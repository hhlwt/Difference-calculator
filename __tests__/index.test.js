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
  ['./__fixtures__/file1.json', './__fixtures__/file2.json', 'stylish', 'expected_file_stylish.txt'],
  ['./__fixtures__/file3.yml', './__fixtures__/file4.yml', 'stylish', 'expected_file_stylish.txt'],
  ['./__fixtures__/file1.json', './__fixtures__/file2.json', 'plain', 'expected_file_plain.txt'],
  ['./__fixtures__/file3.yml', './__fixtures__/file4.yml', 'plain', 'expected_file_plain.txt'],
  ['./__fixtures__/file1.json', './__fixtures__/file2.json', 'json', 'expected_file_json.txt'],
  ['./__fixtures__/file3.yml', './__fixtures__/file4.yml', 'json', 'expected_file_json.txt'],
])('compare (%s, %s) with %s formatter', (first, second, format, expected) => {
  expect(genDiff(first, second, format)).toBe(readFile(expected));
});
