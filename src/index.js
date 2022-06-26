import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import parseFiles from './parsers.js';
import chooseFormater from '../formatters/index.js';

export default (filePath1, filePath2, format) => {
  const [format1, format2] = [path.extname(filePath1), path.extname(filePath2)];
  const [data1, data2] = [fs.readFileSync(filePath1, 'utf-8'), fs.readFileSync(filePath2, 'utf-8')];
  const obj1 = parseFiles(data1, format1);
  const obj2 = parseFiles(data2, format2);

  const getDiff = (firstObj, secondObj) => {
    const [firstObjKeys, secondObjKeys] = [Object.keys(firstObj), Object.keys(secondObj)];
    const sortedKeys = _.uniq(_.sortBy([...firstObjKeys, ...secondObjKeys]));

    const diffObj = sortedKeys.reduce((acc, key) => {
      const nodeDiff = {};
      if (!Object.hasOwn(firstObj, key)) {
        nodeDiff.key = key;
        nodeDiff.type = 'added';
        nodeDiff.value = secondObj[key];
      } else if (!Object.hasOwn(secondObj, key)) {
        nodeDiff.key = key;
        nodeDiff.type = 'removed';
        nodeDiff.value = firstObj[key];
      } else if (firstObj[key] === secondObj[key]) {
        nodeDiff.key = key;
        nodeDiff.type = 'unchanged';
        nodeDiff.value = secondObj[key];
      } else if (_.isObject(firstObj[key]) && _.isObject(secondObj[key])) {
        const objValueDiff = getDiff(firstObj[key], secondObj[key]);
        nodeDiff.key = key;
        nodeDiff.type = 'nested';
        nodeDiff.value = objValueDiff;
      } else {
        nodeDiff.key = key;
        nodeDiff.type = 'changed';
        nodeDiff.value = { value1: firstObj[key], value2: secondObj[key] };
      }
      return [...acc, nodeDiff];
    }, []);

    return diffObj;
  };

  const resultTree = getDiff(obj1, obj2);
  const formatedTree = chooseFormater(resultTree, format);
  return formatedTree;
};
