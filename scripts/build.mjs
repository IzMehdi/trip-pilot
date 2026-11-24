import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, dirname as pathDirname } from 'node:path';

const distDir = './dist';

function addJsExtensions(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  // Add .js extension to relative imports that don't have extensions
  const updated = content.replace(
    /from\s+['"](\.[^'"]*)['"]/g,
    (match, importPath) => {
      // Skip if already has a file extension (e.g., .js, .json, .ts)
      const hasExtension = /\.[a-z]+$/.test(importPath.split('/').pop() || '');
      if (hasExtension) {
        return match;
      }
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        // Check if this import points to a directory (index.js)
        const fullImportPath = join(pathDirname(filePath), importPath);
        const indexPath = join(fullImportPath, 'index.js');
        try {
          const stat = statSync(indexPath);
          if (stat.isFile()) {
            return match.replace(importPath, importPath + '/index.js');
          }
        } catch {
          // Not a directory, use .js extension
        }
        return match.replace(importPath, importPath + '.js');
      }
      return match;
    }
  );
  if (updated !== content) {
    writeFileSync(filePath, updated, 'utf-8');
    console.log(`Updated imports in ${filePath}`);
  }
}

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && (extname(entry.name) === '.js' || extname(entry.name) === '.mjs')) {
      addJsExtensions(fullPath);
    }
  }
}

console.log('Building with tsc...');
import { execSync } from 'node:child_process';
execSync('npx tsc', { stdio: 'inherit' });

console.log('Adding .js extensions to imports...');
walkDir(distDir);

console.log('Build complete!');