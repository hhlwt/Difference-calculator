import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each(['yml', 'json'])('gendiff %s', (format) => {
  const filePath1 = getFixturePath(`file1.${format}`);
  const filePath2 = getFixturePath(`file2.${format}`);

  expect(genDiff(filePath1, filePath2)).toBe(readFile('expected_file_stylish.txt'));
  expect(genDiff(filePath1, filePath2, 'stylish')).toBe(readFile('expected_file_stylish.txt'));
  expect(genDiff(filePath1, filePath2, 'plain')).toBe(readFile('expected_file_plain.txt'));
  expect(genDiff(filePath1, filePath2, 'json')).toBe(readFile('expected_file_json.txt'));
});
