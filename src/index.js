import _ from 'lodash';
import parseFiles from './parsers.js';

export default (filePath1, filePath2) => {
  const obj1 = parseFiles(filePath1);
  const obj2 = parseFiles(filePath2);

  const compareObjects = (firstObj, secondObj) => {
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
          const objValue = compareObjects(firstObj[key], secondObj[key]);
          accObj[`  ${key}`] = objValue;
        } else if (firstObj[key] !== secondObj[key]) {
          accObj[`- ${key}`] = firstObj[key];
          accObj[`+ ${key}`] = secondObj[key];
        }
        if (firstObj[key] === secondObj[key]) {
          accObj[`  ${key}`] = secondObj[key];
        }
      }
      return accObj;
    }, {});
    return resultObj;
  };

  const newObj = compareObjects(obj1, obj2);
  return newObj;
};

// }, {});
// const resultString = `${_.keys(resultObj).reduce((acc, string) => {
//   const newAcc = `${acc}  ${string}: ${resultObj[string]}\n`;
//   return newAcc;
// }, '{\n')}}`;

// return resultString;
