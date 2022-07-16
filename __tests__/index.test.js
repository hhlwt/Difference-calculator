import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each([
  ['file1', 'file2', 'stylish', 'expected_file_stylish.txt'],
  ['file1', 'file2', 'plain', 'expected_file_plain.txt'],
  ['file1', 'file2', 'json', 'expected_file_json.txt'],
])('compare (%s, %s) with %s formatter', (fileName1, fileName2, formatter, expected) => {
  expect(genDiff(getFixturePath(`${fileName1}.json`), getFixturePath(`${fileName2}.json`), formatter)).toBe(readFile(expected));
  expect(genDiff(getFixturePath(`${fileName1}.yml`), getFixturePath(`${fileName2}.yml`), formatter)).toBe(readFile(expected));
});
