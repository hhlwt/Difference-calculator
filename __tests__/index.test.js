import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('compare json STYLISH', () => {
  const expectedJson = readFile('expected_file_stylish.txt');
  expect(genDiff('./__fixtures__/file1.json', './__fixtures__/file2.json', 'stylish')).toBe(expectedJson);
});

test('compare yml STYLISH', () => {
  const expectedYml = readFile('expected_file_stylish.txt');
  expect(genDiff('./__fixtures__/file3.yml', './__fixtures__/file4.yml', 'stylish')).toBe(expectedYml);
});

test('compare json PLAIN', () => {
  const expectedJson = readFile('expected_file_plain.txt');
  expect(genDiff('./__fixtures__/file1.json', './__fixtures__/file2.json', 'plain')).toBe(expectedJson);
});

test('compare yml PLAIN', () => {
  const expectedYml = readFile('expected_file_plain.txt');
  expect(genDiff('./__fixtures__/file3.yml', './__fixtures__/file4.yml', 'plain')).toBe(expectedYml);
});

test('compare json JSON', () => {
  const expectedJson = readFile('expected_file_json.txt');
  expect(genDiff('./__fixtures__/file1.json', './__fixtures__/file2.json', 'json')).toBe(expectedJson);
});

test('compare yml JSON', () => {
  const expectedYml = readFile('expected_file_json.txt');
  expect(genDiff('./__fixtures__/file3.yml', './__fixtures__/file4.yml', 'json')).toBe(expectedYml);
});
