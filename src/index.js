import _ from 'lodash';
import parseFiles from './parsers.js';

export const stylish = (obj, replacer = '  ', replacersCount = 1) => {
  const iter = (currentValue, depth = 1) => {
    if (!_.isObject(currentValue)) {
      return String(currentValue);
    }
    const indent = replacer.repeat(depth * replacersCount);
    const bracketIndent = replacer.repeat((depth - 1) * replacersCount);
    const valuesArray = Object.entries(currentValue).map(([key, value]) => `${indent}${key.startsWith('+') || key.startsWith('-') ? key : `  ${key}`}: ${iter(value, depth + 2)}`);
    return ['{', ...valuesArray, `${bracketIndent}}`].join('\n');
  };
  return iter(obj);
};

export const plain = (obj) => {
  const iter = (object) => {
    const valuesArray = Object.entries(object).map(([key, value], index, array) => {
      const currentKey = key;
      const currentValue = value;
      const previousKey = array[index - 1] ? array[index - 1][0] : '';
      const previousValue = array[index - 1] ? array[index - 1][1] : '';
      const nextKey = array[index + 1] ? array[index + 1][0] : '';

      if (currentKey.startsWith('+') && previousKey.startsWith('-')) {
        if (currentKey.slice(2) === previousKey.slice(2)) {
          return `Property ${currentKey.slice(2)} was updated. From ${_.isObject(previousValue) ? '[complex value]' : previousValue} to ${currentValue}`;
        }
      }
      if (currentKey.startsWith('+')) {
        return `Property ${currentKey.slice(2)} was added with value: ${_.isObject(currentValue) ? '[complex value]' : currentValue}`;
      }
      if (currentKey.startsWith('-') && !nextKey.includes(currentKey.slice(2))) {
        return `Property ${currentKey.slice(2)} was removed`;
      }
      if (!(currentKey.startsWith('+') || currentKey.startsWith('-')) && _.isObject(currentValue)) {
        iter(currentValue);
      }
      return '';
    });
    console.log(valuesArray.filter((array) => array));
  };
  return iter(obj);
};

export default (filePath1, filePath2, format = stylish) => {
  const obj1 = parseFiles(filePath1);
  const obj2 = parseFiles(filePath2);

  const getDiff = (firstObj, secondObj) => {
    const [keys1, keys2] = [_.keys(firstObj), _.keys(secondObj)];
    const uniqKeys = _.union(keys1, keys2).slice().sort();

    const resultObj = uniqKeys.reduce((accObj, key) => {
      if (_.has(firstObj, key) && !_.has(secondObj, key)) {
        accObj[`- ${key}`] = firstObj[key];
      }
      if (!_.has(firstObj, key) && _.has(secondObj, key)) {
        accObj[`+ ${key}`] = secondObj[key];
      }
      if (_.has(firstObj, key) && _.has(secondObj, key)) {
        if (_.isObject(firstObj[key]) && _.isObject(secondObj[key])) {
          const objValue = getDiff(firstObj[key], secondObj[key]);
          accObj[`${key}`] = objValue;
        } else if (firstObj[key] !== secondObj[key]) {
          accObj[`- ${key}`] = firstObj[key];
          accObj[`+ ${key}`] = secondObj[key];
        }
        if (firstObj[key] === secondObj[key]) {
          accObj[`${key}`] = secondObj[key];
        }
      }
      return accObj;
    }, {});
    return resultObj;
  };

  const newObj = getDiff(obj1, obj2);
  const resultString = format(newObj);
  return resultString;
};
