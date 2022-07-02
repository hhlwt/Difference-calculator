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
      if (!_.has(firstObj, key)) {
        return [...acc, { key, type: 'added', value: secondObj[key] }];
      } if (!_.has(secondObj, key)) {
        return [...acc, { key, type: 'removed', value: firstObj[key] }];
      } if (firstObj[key] === secondObj[key]) {
        return [...acc, { key, type: 'unchanged', value: secondObj[key] }];
      } if (_.isObject(firstObj[key]) && _.isObject(secondObj[key])) {
        const objValueDiff = getDiff(firstObj[key], secondObj[key]);
        return [...acc, { key, type: 'nested', value: objValueDiff }];
      }
      return [...acc, { key, type: 'changed', value: { value1: firstObj[key], value2: secondObj[key] } }];
    }, []);

    return diffObj;
  };

  const resultTree = getDiff(obj1, obj2);
  const formatedTree = chooseFormater(resultTree, format);
  return formatedTree;
};
