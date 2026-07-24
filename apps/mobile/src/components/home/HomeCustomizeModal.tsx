
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { colors } from '@beeapp/design-system';
import { MODULES_POOL } from './homeModules';

interface HomeCustomizeModalProps {
  visible: boolean;
  selectedIds: string[];
  onChangeSelected: (ids: string[]) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function HomeCustomizeModal({ visible, selectedIds, onChangeSelected, onCancel, onSave }: HomeCustomizeModalProps) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Personalizar Accesos</Text>
            <Text style={styles.modalSubtitle}>
              Selecciona exactamente 3 accesos rápidos para tu pantalla de inicio.
            </Text>
            <Text style={styles.selectionCounter}>
              {selectedIds.length} de 3 seleccionados
            </Text>
          </View>

          <ScrollView style={styles.modulesScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.modulesModalList}>
              {MODULES_POOL.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.modalModuleItem, isSelected && styles.modalModuleItemActive]}
                    onPress={() => {
                      if (isSelected) {
                        onChangeSelected(selectedIds.filter(id => id !== item.id));
                      } else {
                        if (selectedIds.length >= 3) {
                          alert('Solo puedes seleccionar un máximo de 3 accesos rápidos.');
                          return;
                        }
                        onChangeSelected([...selectedIds, item.id]);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.modalModuleIconWrap, { backgroundColor: item.bgColor }]}>
                      <IconComponent size={20} color={item.iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalModuleName}>{item.name}</Text>
                      <Text style={styles.modalModuleDesc}>
                        {item.id === 'mail' ? 'Bandeja de entrada y correos' :
                         item.id === 'notes' ? 'Notas y apuntes personales' :
                         item.id === 'contacts' ? 'Buscador de red empresarial y contactos' :
                         item.id === 'files' ? 'Archivos y firma digital de documentos' :
                         item.id === 'calendar' ? 'Calendario y agenda de eventos' :
                         'Historial de llamadas entrantes y salientes'}
                      </Text>
                    </View>
                    <View style={[styles.checkboxCircle, isSelected && styles.checkboxCircleActive]}>
                      {isSelected && <View style={styles.checkboxCircleInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.modalCancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalSaveBtn,
                selectedIds.length !== 3 && styles.modalSaveBtnDisabled
              ]}
              disabled={selectedIds.length !== 3}
              onPress={onSave}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSaveBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.neutral.gray600,
    textAlign: 'center',
    marginBottom: 10,
  },
  selectionCounter: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brand.primary,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modulesScroll: {
    marginBottom: 20,
  },
  modulesModalList: {
    gap: 12,
  },
  modalModuleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    backgroundColor: colors.neutral.white,
  },
  modalModuleItemActive: {
    borderColor: colors.brand.primary,
    backgroundColor: '#FBFBFF',
  },
  modalModuleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalModuleName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  modalModuleDesc: {
    fontSize: 11,
    color: colors.neutral.gray600,
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxCircleActive: {
    borderColor: colors.brand.primary,
  },
  checkboxCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
    paddingTop: 16,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.gray700,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveBtnDisabled: {
    backgroundColor: colors.neutral.gray400,
  },
  modalSaveBtnText: {
    color: colors.neutral.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
