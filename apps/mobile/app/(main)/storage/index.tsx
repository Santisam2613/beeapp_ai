import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { colors } from '@beeapp/design-system';
import {
  ChevronLeft,
  Search,
  Grid,
  List,
  ArrowUpDown,
  Plus,
  MoreVertical,
  Eye,
  Edit2,
  Move,
  Share2,
  Download,
  FileText,
  Folder,
  Trash2,
  FolderPlus,
  FilePlus,
  Image as ImageIcon,
  Video as VideoIcon,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react-native';
import FloatingTabBar from '../../../src/components/FloatingTabBar';
import { getItems, setItems, StorageItem } from './store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FAB_BOTTOM_OFFSET = 105;

type SortOption = 'name' | 'date' | 'size' | 'type';

export default function StorageIndexScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // Storage State
  const [items, setLocalItems] = useState<StorageItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [pathStack, setPathStack] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: 'Inicio' },
  ]);

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'docs' | 'media' | 'signed' | 'shared' | 'trash'>('all');

  // Modals & Menu States
  const [activeItem, setActiveItem] = useState<StorageItem | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [folderModalMode, setFolderModalMode] = useState<'create' | 'rename'>('create');
  const [folderNameInput, setFolderNameInput] = useState('');
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [fabMenuVisible, setFabMenuVisible] = useState(false);

  // Load items from memory store on mount / focus
  useEffect(() => {
    setLocalItems(getItems());
    // Refocus listener to keep items synchronized
    const unsubscribe = navigation.addListener('focus', () => {
      setLocalItems(getItems());
    });
    return unsubscribe;
  }, [navigation]);

  // Sync back local state to store
  const syncStore = (newItems: StorageItem[]) => {
    setLocalItems(newItems);
    setItems(newItems);
  };

  // Breadcrumbs click
  const handleBreadcrumbPress = (index: number) => {
    const newStack = pathStack.slice(0, index + 1);
    setPathStack(newStack);
    setCurrentFolderId(newStack[newStack.length - 1].id);
    setFabMenuVisible(false);
  };

  // Folder click
  const handleFolderPress = (folder: StorageItem) => {
    setPathStack([...pathStack, { id: folder.id, name: folder.name }]);
    setCurrentFolderId(folder.id);
    setFabMenuVisible(false);
  };

  // Sorting Logic
  const getSortedItems = (list: StorageItem[]) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'date') {
        return b.updatedAt.localeCompare(a.updatedAt);
      }
      if (sortBy === 'size') {
        const sizeA = a.size ? parseFloat(a.size) : 0;
        const sizeB = b.size ? parseFloat(b.size) : 0;
        return sizeB - sizeA;
      }
      if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });
  };

  // Filtering Logic
  const getFilteredItems = () => {
    // 1. Filter by current folder hierarchy (only when query is empty)
    let list = items;
    if (!searchQuery) {
      list = items.filter((item) => item.parentId === currentFolderId);
    } else {
      // If searching, search globally in all subfolders
      list = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Filter by chip selections
    if (activeFilter === 'recent') {
      list = list.filter((item) => item.updatedAt.includes('Hoy') || item.updatedAt.includes('Ayer'));
    } else if (activeFilter === 'docs') {
      list = list.filter((item) => item.type === 'pdf' || item.type === 'doc');
    } else if (activeFilter === 'media') {
      list = list.filter((item) => item.type === 'image' || item.type === 'video');
    } else if (activeFilter === 'signed') {
      list = list.filter((item) => item.isSigned);
    } else if (activeFilter === 'shared') {
      list = list.filter((item) => item.isShared);
    }

    return getSortedItems(list);
  };

  // Storage breakdown calculations
  const totalSpace = 15; // GB
  const usedSpace = 8.2; // GB
  const progressPercent = (usedSpace / totalSpace) * 100;

  // Folder CRUD Operations
  const handleCreateFolder = () => {
    if (!folderNameInput.trim()) return;
    const newFolder: StorageItem = {
      id: `f-${Date.now()}`,
      name: folderNameInput.trim(),
      type: 'folder',
      parentId: currentFolderId,
      updatedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      itemCount: 0,
    };
    syncStore([...items, newFolder]);
    setFolderModalVisible(false);
    setFolderNameInput('');
  };

  const handleRenameItem = () => {
    if (!activeItem || !folderNameInput.trim()) return;
    const updated = items.map((item) =>
      item.id === activeItem.id ? { ...item, name: folderNameInput.trim() } : item
    );
    syncStore(updated);
    setFolderModalVisible(false);
    setFolderNameInput('');
    setActiveItem(null);
  };

  const handleDeleteItem = (item: StorageItem) => {
    const updated = items.filter((i) => i.id !== item.id);
    syncStore(updated);
    alert(`${item.type === 'folder' ? 'Carpeta' : 'Archivo'} eliminado.`);
    setContextMenuVisible(false);
    setActiveItem(null);
  };

  const handleMoveItem = (targetFolderId: string | null) => {
    if (!activeItem) return;
    const updated = items.map((i) =>
      i.id === activeItem.id ? { ...i, parentId: targetFolderId } : i
    );
    syncStore(updated);
    alert(`Elemento movido con éxito.`);
    setMoveModalVisible(false);
    setContextMenuVisible(false);
    setActiveItem(null);
  };

  // Mock Uploads
  const triggerMockUpload = (type: 'pdf' | 'image' | 'video' | 'doc', customName?: string) => {
    let name = '';
    let size = '1.5 MB';
    if (type === 'pdf') {
      name = customName || `Documento_Escaneado_${Date.now().toString().slice(-4)}.pdf`;
      size = '2.1 MB';
    } else if (type === 'image') {
      name = `IMG_${Date.now().toString().slice(-4)}.jpg`;
      size = '1.8 MB';
    } else if (type === 'video') {
      name = `VIDEO_${Date.now().toString().slice(-4)}.mp4`;
      size = '12.4 MB';
    } else {
      name = `Nota_Contrato_${Date.now().toString().slice(-4)}.doc`;
      size = '780 KB';
    }

    const newFile: StorageItem = {
      id: `file-${Date.now()}`,
      name,
      type,
      size,
      updatedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parentId: currentFolderId,
    };
    syncStore([...items, newFile]);
    setFabMenuVisible(false);
    alert(`Subido con éxito: ${name}`);
  };

  // Context Menu triggers
  const openContextMenu = (item: StorageItem) => {
    setActiveItem(item);
    setContextMenuVisible(true);
  };

  const triggerRenameFlow = () => {
    if (!activeItem) return;
    setFolderModalMode('rename');
    setFolderNameInput(activeItem.name);
    setContextMenuVisible(false);
    setFolderModalVisible(true);
  };

  const triggerMoveFlow = () => {
    setMoveModalVisible(true);
  };

  // Icon Render for files
  const renderItemIcon = (item: StorageItem) => {
    const size = 20;
    if (item.type === 'folder') {
      return <Folder size={size} color="#7C3AED" fill="#E8D5FF" />;
    }
    if (item.type === 'pdf') {
      return <FileText size={size} color="#EF4444" />;
    }
    if (item.type === 'image') {
      return <ImageIcon size={size} color="#10B981" />;
    }
    if (item.type === 'video') {
      return <VideoIcon size={size} color="#3B82F6" />;
    }
    return <FileText size={size} color="#6B7280" />;
  };

  const filteredItems = getFilteredItems();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeftCol}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
              <ChevronLeft size={24} color={colors.neutral.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Almacenamiento</Text>
          </View>

          {/* Sort & View controls */}
          <View style={styles.headerControls}>
            <TouchableOpacity
              onPress={() => {
                const nextSort: Record<SortOption, SortOption> = { name: 'date', date: 'size', size: 'type', type: 'name' };
                setSortBy(nextSort[sortBy]);
              }}
              style={styles.controlIconBtn}
              activeOpacity={0.7}
            >
              <ArrowUpDown size={18} color={colors.brand.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={styles.controlIconBtn}
              activeOpacity={0.7}
            >
              {viewMode === 'grid' ? (
                <List size={18} color={colors.brand.primary} />
              ) : (
                <Grid size={18} color={colors.brand.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBarBox}>
          <Search size={18} color={colors.neutral.gray500} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar archivos y carpetas..."
            placeholderTextColor={colors.neutral.gray500}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
          {/* Storage summary bar */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>Espacio Disponible</Text>
              <Text style={styles.summaryStats}>{usedSpace} GB de {totalSpace} GB usados ({progressPercent.toFixed(0)}%)</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.breakdownText}>
              Documentos: 3.4 GB | Multimedia: 4.2 GB | Otros: 0.6 GB
            </Text>
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'recent', label: 'Recientes' },
              { id: 'docs', label: 'Documentos' },
              { id: 'media', label: 'Fotos y Videos' },
              { id: 'signed', label: 'Firmados' },
              { id: 'shared', label: 'Compartidos' },
            ].map((f) => {
              const active = activeFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setActiveFilter(f.id as any)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Breadcrumbs (only when not searching) */}
          {!searchQuery && (
            <View style={styles.breadcrumbBar}>
              {pathStack.map((stackItem, idx) => (
                <View key={idx} style={styles.breadcrumbItemWrap}>
                  {idx > 0 && <Text style={styles.breadcrumbSeparator}>/</Text>}
                  <TouchableOpacity onPress={() => handleBreadcrumbPress(idx)} activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.breadcrumbText,
                        idx === pathStack.length - 1 && styles.breadcrumbTextActive,
                      ]}
                    >
                      {stackItem.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Content display */}
          {filteredItems.length > 0 ? (
            viewMode === 'grid' ? (
              // Grid View
              <View style={styles.gridViewContainer}>
                {filteredItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.gridCard}
                    onPress={() => {
                      if (item.type === 'folder') {
                        handleFolderPress(item);
                      } else {
                        router.push({
                          pathname: '/(main)/storage/preview',
                          params: { id: item.id },
                        });
                      }
                    }}
                    onLongPress={() => openContextMenu(item)}
                    activeOpacity={0.7}
                  >
                    {/* Ellipsis Options trigger */}
                    <TouchableOpacity
                      style={styles.cardEllipsis}
                      onPress={() => openContextMenu(item)}
                      activeOpacity={0.7}
                    >
                      <MoreVertical size={16} color={colors.neutral.gray600} />
                    </TouchableOpacity>

                    {/* Visual icon representation */}
                    <View style={styles.gridIconBox}>
                      {renderItemIcon(item)}
                    </View>

                    {/* Metadata text */}
                    <Text style={styles.gridName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    {item.type === 'folder' ? (
                      <Text style={styles.gridSubtext}>
                        {item.itemCount || 0} elementos
                      </Text>
                    ) : (
                      <View style={styles.gridMetaRow}>
                        <Text style={styles.gridSubtext}>{item.size}</Text>
                        {item.isSigned && (
                          <View style={styles.signedTagMini}>
                            <ShieldCheck size={10} color="#7C3AED" />
                            <Text style={styles.signedTagMiniText}>Firmado</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              // List View
              <View style={styles.listViewContainer}>
                {filteredItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.listRow}
                    onPress={() => {
                      if (item.type === 'folder') {
                        handleFolderPress(item);
                      } else {
                        router.push({
                          pathname: '/(main)/storage/preview',
                          params: { id: item.id },
                        });
                      }
                    }}
                    onLongPress={() => openContextMenu(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.listIconBox}>
                      {renderItemIcon(item)}
                    </View>

                    <View style={styles.listDetails}>
                      <Text style={styles.listName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={styles.listMetaRow}>
                        <Text style={styles.listSubtext}>
                          {item.type === 'folder' ? `${item.itemCount || 0} elementos` : item.size}
                        </Text>
                        <Text style={styles.listDot}>•</Text>
                        <Text style={styles.listSubtext}>{item.updatedAt}</Text>

                        {item.isSigned && (
                          <View style={styles.signedBadgeRow}>
                            <ShieldCheck size={11} color="#7C3AED" />
                            <Text style={styles.signedBadgeRowText}>Firmado</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity onPress={() => openContextMenu(item)} activeOpacity={0.7} style={styles.listMenuBtn}>
                      <MoreVertical size={18} color={colors.neutral.gray600} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )
          ) : (
            // Empty State
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <FolderOpen size={40} color={colors.neutral.gray400} />
              </View>
              <Text style={styles.emptyTitle}>Carpeta Vacía</Text>
              <Text style={styles.emptyDesc}>
                No hay archivos ni carpetas que mostrar en este directorio.
              </Text>
            </View>
          )}

          <View style={{ height: 160 }} />
        </ScrollView>

        {/* Context Options Action Sheet Modal */}
        <Modal transparent visible={contextMenuVisible} animationType="slide">
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setContextMenuVisible(false)}>
            <View style={styles.contextMenuSheet}>
              {activeItem && (
                <>
                  <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle} numberOfLines={1}>{activeItem.name}</Text>
                    <Text style={styles.menuSub}>{activeItem.type === 'folder' ? 'Carpeta' : activeItem.size}</Text>
                  </View>

                  <ScrollView style={{ maxHeight: 350 }}>
                    <TouchableOpacity
                      style={styles.menuRow}
                      onPress={() => {
                        setContextMenuVisible(false);
                        if (activeItem.type === 'folder') {
                          handleFolderPress(activeItem);
                        } else {
                          router.push({
                            pathname: '/(main)/storage/preview',
                            params: { id: activeItem.id },
                          });
                        }
                      }}
                    >
                      <Eye size={18} color={colors.neutral.text} />
                      <Text style={styles.menuRowText}>Abrir / Vista previa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} onPress={triggerRenameFlow}>
                      <Edit2 size={18} color={colors.neutral.text} />
                      <Text style={styles.menuRowText}>Renombrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} onPress={triggerMoveFlow}>
                      <Move size={18} color={colors.neutral.text} />
                      <Text style={styles.menuRowText}>Mover a otra carpeta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} onPress={() => { alert('Compartir enlace generado.'); setContextMenuVisible(false); }}>
                      <Share2 size={18} color={colors.neutral.text} />
                      <Text style={styles.menuRowText}>Compartir</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} onPress={() => { alert('Descargando archivo...'); setContextMenuVisible(false); }}>
                      <Download size={18} color={colors.neutral.text} />
                      <Text style={styles.menuRowText}>Descargar</Text>
                    </TouchableOpacity>

                    {activeItem.type === 'pdf' && (
                      <TouchableOpacity
                        style={styles.menuRow}
                        onPress={() => {
                          setContextMenuVisible(false);
                          router.push({
                            pathname: '/(main)/storage/sign',
                            params: { id: activeItem.id },
                          });
                        }}
                      >
                        <ShieldCheck size={18} color="#7C3AED" />
                        <Text style={[styles.menuRowText, { color: '#7C3AED', fontWeight: 'bold' }]}>
                          Firmar documento
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.menuRow, { borderBottomWidth: 0 }]}
                      onPress={() => handleDeleteItem(activeItem)}
                    >
                      <Trash2 size={18} color={colors.semantic.error} />
                      <Text style={[styles.menuRowText, { color: colors.semantic.error }]}>Eliminar</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Move to Folder Modal */}
        <Modal transparent visible={moveModalVisible} animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.moveSheet}>
              <Text style={styles.moveTitle}>Mover a...</Text>
              <Text style={styles.moveSubtitle}>Selecciona la carpeta de destino para el archivo</Text>

              <ScrollView style={styles.moveList}>
                {/* Root Option */}
                <TouchableOpacity
                  style={[styles.moveFolderRow, currentFolderId === null && styles.moveFolderRowActive]}
                  onPress={() => handleMoveItem(null)}
                >
                  <Folder size={18} color="#7C3AED" />
                  <Text style={styles.moveFolderText}>Inicio (Carpeta Raíz)</Text>
                </TouchableOpacity>

                {/* Subfolders list */}
                {items
                  .filter((i) => i.type === 'folder' && i.id !== activeItem?.id)
                  .map((f) => (
                    <TouchableOpacity
                      key={f.id}
                      style={[styles.moveFolderRow, currentFolderId === f.id && styles.moveFolderRowActive]}
                      onPress={() => handleMoveItem(f.id)}
                    >
                      <Folder size={18} color="#7C3AED" />
                      <Text style={styles.moveFolderText}>{f.name}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>

              <View style={styles.moveActions}>
                <TouchableOpacity style={styles.moveCancelBtn} onPress={() => setMoveModalVisible(false)}>
                  <Text style={styles.moveCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Rename/Create Modal */}
        <Modal transparent visible={folderModalVisible} animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.dialogBox}>
              <Text style={styles.dialogTitle}>
                {folderModalMode === 'create' ? 'Nueva Carpeta' : 'Renombrar'}
              </Text>
              <TextInput
                style={styles.dialogInput}
                placeholder="Nombre de la carpeta"
                placeholderTextColor={colors.neutral.gray500}
                value={folderNameInput}
                onChangeText={setFolderNameInput}
                autoFocus
              />
              <View style={styles.dialogActions}>
                <TouchableOpacity style={styles.dialogBtnCancel} onPress={() => setFolderModalVisible(false)}>
                  <Text style={styles.dialogBtnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dialogBtnConfirm}
                  onPress={folderModalMode === 'create' ? handleCreateFolder : handleRenameItem}
                >
                  <Text style={styles.dialogBtnConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* FAB Submenu overlay */}
        {fabMenuVisible && (
          <Modal transparent visible={fabMenuVisible} animationType="fade">
            <TouchableOpacity
              style={styles.fabBackdrop}
              activeOpacity={1}
              onPress={() => setFabMenuVisible(false)}
            >
              <View style={[styles.fabMenuContainer, { bottom: FAB_BOTTOM_OFFSET + 65 }]}>
                <TouchableOpacity
                  style={styles.fabMenuRow}
                  onPress={() => {
                    setFabMenuVisible(false);
                    setFolderModalMode('create');
                    setFolderNameInput('');
                    setFolderModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <FolderPlus size={16} color="#7C3AED" />
                  <Text style={styles.fabMenuText}>Crear carpeta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fabMenuRow}
                  onPress={() => triggerMockUpload('pdf')}
                  activeOpacity={0.8}
                >
                  <FilePlus size={16} color="#7C3AED" />
                  <Text style={styles.fabMenuText}>Subir archivo (Documento)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fabMenuRow}
                  onPress={() => triggerMockUpload('image')}
                  activeOpacity={0.8}
                >
                  <ImageIcon size={16} color="#7C3AED" />
                  <Text style={styles.fabMenuText}>Subir foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fabMenuRow}
                  onPress={() => triggerMockUpload('video')}
                  activeOpacity={0.8}
                >
                  <VideoIcon size={16} color="#7C3AED" />
                  <Text style={styles.fabMenuText}>Subir video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fabMenuRow, { borderBottomWidth: 0 }]}
                  onPress={() => triggerMockUpload('pdf', 'Doc_Escaneado_Firma.pdf')}
                  activeOpacity={0.8}
                >
                  <FileText size={16} color="#7C3AED" />
                  <Text style={styles.fabMenuText}>Escanear documento</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        {/* FAB Button - Respecting vertical height offset */}
        <TouchableOpacity
          style={styles.createFab}
          onPress={() => setFabMenuVisible(!fabMenuVisible)}
          activeOpacity={0.8}
        >
          <Plus size={24} color={colors.neutral.white} />
        </TouchableOpacity>

        {/* Tab Menu bar */}
        <FloatingTabBar activeTab="explore" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray100,
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.neutral.text,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray50,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray100,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.neutral.text,
    paddingVertical: 6,
    fontWeight: '500',
  },
  scrollList: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  summaryInfo: {
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  summaryStats: {
    fontSize: 11,
    color: colors.neutral.gray600,
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: 4,
  },
  breakdownText: {
    fontSize: 10,
    color: colors.neutral.gray600,
    fontWeight: '500',
  },
  filtersScroll: {
    marginVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  filterChipActive: {
    backgroundColor: '#F3E8FF',
    borderColor: colors.brand.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  filterChipTextActive: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  breadcrumbBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 4,
  },
  breadcrumbItemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breadcrumbSeparator: {
    fontSize: 13,
    color: colors.neutral.gray400,
    fontWeight: '500',
  },
  breadcrumbText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brand.primary,
  },
  breadcrumbTextActive: {
    color: colors.neutral.text,
    fontWeight: '800',
  },
  gridViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  gridCard: {
    width: (SCREEN_WIDTH - 40 - 12) / 2,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    borderRadius: 20,
    padding: 16,
    position: 'relative',
  },
  cardEllipsis: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  gridIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.gray50,
    marginBottom: 12,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 4,
    paddingRight: 16,
  },
  gridSubtext: {
    fontSize: 11,
    color: colors.neutral.gray600,
    fontWeight: '500',
  },
  gridMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signedTagMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    gap: 2,
  },
  signedTagMiniText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#7C3AED',
  },
  listViewContainer: {
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  listIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.gray50,
    marginRight: 12,
  },
  listDetails: {
    flex: 1,
    paddingRight: 10,
  },
  listName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listSubtext: {
    fontSize: 11,
    color: colors.neutral.gray600,
    fontWeight: '500',
  },
  listDot: {
    fontSize: 11,
    color: colors.neutral.gray400,
  },
  signedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
    marginLeft: 6,
  },
  signedBadgeRowText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#7C3AED',
  },
  listMenuBtn: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.neutral.gray600,
    textAlign: 'center',
    lineHeight: 18,
  },
  createFab: {
    position: 'absolute',
    bottom: FAB_BOTTOM_OFFSET,
    right: 20,
    backgroundColor: colors.brand.primary,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
    justifyContent: 'flex-end',
  },
  contextMenuSheet: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  menuHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    paddingBottom: 12,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral.text,
  },
  menuSub: {
    fontSize: 12,
    color: colors.neutral.gray600,
    marginTop: 2,
    fontWeight: '600',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    gap: 12,
  },
  menuRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.text,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    width: SCREEN_WIDTH - 48,
    backgroundColor: colors.neutral.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.neutral.text,
    marginBottom: 20,
    fontWeight: '500',
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
  },
  dialogBtnCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    alignItems: 'center',
  },
  dialogBtnCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.gray700,
  },
  dialogBtnConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
  },
  dialogBtnConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  moveSheet: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: colors.neutral.white,
    borderRadius: 24,
    padding: 20,
    maxHeight: '60%',
  },
  moveTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral.text,
    marginBottom: 4,
  },
  moveSubtitle: {
    fontSize: 12,
    color: colors.neutral.gray600,
    marginBottom: 16,
  },
  moveList: {
    maxHeight: 250,
    marginBottom: 16,
  },
  moveFolderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 10,
  },
  moveFolderRowActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#E9D5FF',
  },
  moveFolderText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.text,
  },
  moveActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  moveCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  moveCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.gray700,
  },
  fabBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.1)',
  },
  fabMenuContainer: {
    position: 'absolute',
    right: 20,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    padding: 8,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  fabMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    gap: 10,
  },
  fabMenuText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.text,
  },
});
