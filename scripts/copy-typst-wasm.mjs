#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webRoot = dirname(__dirname);

function copyWasmFile(pkgName, fileName) {
  console.log(`🔧 正在复制 ${pkgName} 的 WebAssembly 文件...`);

  const wasmSourcePath = join(webRoot, `node_modules/${pkgName}/pkg/${fileName}`);
  const publicTypstDir = join(webRoot, 'public');
  const wasmTargetPath = join(publicTypstDir, fileName);

  try {
    if (!existsSync(wasmSourcePath)) {
      console.error(`❌ 错误: 找不到 ${pkgName} 的 WASM 文件`);
      console.error(`   预期位置: ${wasmSourcePath}`);
      process.exit(1);
    }

    mkdirSync(publicTypstDir, { recursive: true });
    copyFileSync(wasmSourcePath, wasmTargetPath);

    console.log(`✅ ${pkgName} 的 WASM 文件复制成功!`);
    console.log(`   源文件: ${wasmSourcePath}`);
    console.log(`   目标文件: ${wasmTargetPath}`);
  } catch (error) {
    console.error(`❌ 复制 ${pkgName} WASM 文件时出错:`, error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行复制操作
if (import.meta.url === `file://${process.argv[1]}`) {
  copyWasmFile('@myriaddreamin/typst-ts-renderer', 'typst_ts_renderer_bg.wasm');
  copyWasmFile('@myriaddreamin/typst-ts-web-compiler', 'typst_ts_web_compiler_bg.wasm');
}

export { copyWasmFile };
