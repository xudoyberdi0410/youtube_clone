import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_FILE = 'project_export.txt'
const MAX_FILE_SIZE = 512 * 1024
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', '.next', 'dist', 'build', '__pycache__'])

async function isTextFile(filepath) {
  try {
    const buffer = await fs.readFile(filepath, { encoding: 'utf-8' })
    return /^[\x00-\x7F\n\r\t\f\v\u0085\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]*$/.test(buffer.slice(0, 1000))
  } catch {
    return false
  }
}

async function generateTree(rootDir, prefix = '') {
  let tree = ''
  const entries = await fs.readdir(rootDir, { withFileTypes: true })

  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue

    const fullPath = path.join(rootDir, entry.name)

    if (entry.isDirectory()) {
      tree += `${prefix}${entry.name}/\n`
      tree += await generateTree(fullPath, prefix + '  ')
    } else {
      tree += `${prefix}${entry.name}\n`
    }
  }

  return tree
}

async function collectFiles(rootDir, write) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })

  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue

    const fullPath = path.join(rootDir, entry.name)

    if (entry.isDirectory()) {
      await collectFiles(fullPath, write)
    } else {
      try {
        const stat = await fs.stat(fullPath)
        if (stat.size > MAX_FILE_SIZE) continue

        if (!(await isTextFile(fullPath))) continue

        const rel = path.relative(__dirname, fullPath)
        await write(`\n\n--- FILE: ${rel} ---\n\n`)
        const content = await fs.readFile(fullPath, 'utf-8')
        await write(content)
      } catch (e) {
        await write(`\n\n--- FILE: ${entry.name} ---\n[Ошибка чтения: ${e.message}]\n`)
      }
    }
  }
}

async function exportProject() {
  const handle = await fs.open(OUTPUT_FILE, 'w')
  const write = async (text) => await handle.write(text)

  await write('### 📁 Структура проекта:\n\n')
  const tree = await generateTree(__dirname)
  await write(tree)

  await write('\n\n### 📄 Содержимое файлов:\n\n')
  await collectFiles("src", write)

  await handle.close()
  console.log(`✅ Проект экспортирован в ${OUTPUT_FILE}`)
}

exportProject().catch(console.error)
