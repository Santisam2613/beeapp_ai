const fs = require('fs');
const path = require('path');

// Fix Expo Router in npm workspaces by replacing the dynamic env var
// with a hardcoded string literal, satisfying Metro's require.context
const ctxFiles = ['_ctx.android.js', '_ctx.ios.js', '_ctx.web.js', '_ctx-shared.js'];
const localRouterDir = path.resolve(__dirname, '../node_modules/expo-router');
const rootRouterDir = path.resolve(__dirname, '../../../node_modules/expo-router');

const routerDir = fs.existsSync(localRouterDir) ? localRouterDir : rootRouterDir;

if (fs.existsSync(routerDir)) {
  ctxFiles.forEach(file => {
    const filePath = path.join(routerDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // If the file is hoisted to the root, we need to point to apps/mobile/app
      // If it is in apps/mobile/node_modules, we need to point to ../../app
      const isRoot = routerDir === rootRouterDir;
      const appPath = isRoot ? '"./apps/mobile/app"' : '"../../app"';
      
      content = content.replace(/process\.env\.EXPO_ROUTER_APP_ROOT/g, appPath);
      content = content.replace(/process\.env\.EXPO_ROUTER_IMPORT_MODE/g, '"sync"');
      fs.writeFileSync(filePath, content);
    }
  });
  console.log('✅ Patched expo-router _ctx files for monorepo support (Dir: ' + routerDir + ')');
}
