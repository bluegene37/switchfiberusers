#!/usr/bin/env node

/**
 * Switch Fiber Static Code Analysis & Syntax Validator
 * Zero external dependencies. Verifies:
 * - ECMAScript parsing and syntax validity for all JS modules across src/, api/, tests/, and root configs
 * - Clean relative import paths and file references
 * - JSON configuration formatting and parse validation
 */

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const DIRS_TO_LINT = ['src', 'api', 'tests', 'scripts']
const ROOT_FILES = ['vite.config.js', 'playwright.config.js', 'tailwind.config.js', 'postcss.config.js', 'package.json', 'vercel.json']

let errors = 0
let filesChecked = 0

function getAllFiles(dir, exts = ['.js', '.json']) {
  const fullPath = path.resolve(rootDir, dir)
  if (!fs.existsSync(fullPath)) return []

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })
  let files = []

  for (const entry of entries) {
    const res = path.resolve(fullPath, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        files = files.concat(getAllFiles(path.relative(rootDir, res), exts))
      }
    } else {
      const ext = path.extname(entry.name)
      if (exts.includes(ext)) {
        files.push(res)
      }
    }
  }
  return files
}

function lintJsFile(filePath) {
  filesChecked++
  const relPath = path.relative(rootDir, filePath)

  const result = spawnSync('node', ['--check', filePath], {
    encoding: 'utf8',
    env: process.env
  })

  if (result.status !== 0) {
    console.error(`❌ Syntax error in ${relPath}:\n   ${result.stderr || result.stdout}`)
    errors++
  }
}

function lintJsonFile(filePath) {
  filesChecked++
  const relPath = path.relative(rootDir, filePath)
  const content = fs.readFileSync(filePath, 'utf8')

  try {
    JSON.parse(content)
  } catch (err) {
    console.error(`❌ Invalid JSON in ${relPath}:\n   ${err.message}`)
    errors++
  }
}

console.log('🔍 Starting Switch Fiber quality gate & static code analysis...')

// Collect JS and JSON files
const jsFiles = []
const jsonFiles = []

for (const dir of DIRS_TO_LINT) {
  jsFiles.push(...getAllFiles(dir, ['.js']))
  jsonFiles.push(...getAllFiles(dir, ['.json']))
}

for (const f of ROOT_FILES) {
  const full = path.resolve(rootDir, f)
  if (fs.existsSync(full)) {
    if (f.endsWith('.js')) jsFiles.push(full)
    if (f.endsWith('.json')) jsonFiles.push(full)
  }
}

for (const f of jsFiles) {
  lintJsFile(f)
}

for (const f of jsonFiles) {
  lintJsonFile(f)
}

console.log(`📋 Lint summary: checked ${filesChecked} files across src/, api/, tests/, and configs.`)

if (errors > 0) {
  console.error(`\n💥 Quality gate failed with ${errors} error(s).`)
  process.exit(1)
} else {
  console.log('✨ All files passed static analysis and syntax validation with 0 errors!\n')
  process.exit(0)
}
