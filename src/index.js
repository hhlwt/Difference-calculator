import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import format from './formatters/index.js';
import buildTree from './buildTree.js';

const extractFormat = (filePath) => path.extname(filePath).slice(1);

export default (filePath1, filePath2, formatName) => {
  const formatName1 = extractFormat(filePath1);
  const formatName2 = extractFormat(filePath2);
  const fileContent1 = fs.readFileSync(filePath1, 'utf-8');
  const fileContent2 = fs.readFileSync(filePath2, 'utf-8');
  const data1 = parse(fileContent1, formatName1);
  const data2 = parse(fileContent2, formatName2);

  const tree = buildTree(data1, data2);
  return format(tree, formatName);
};
