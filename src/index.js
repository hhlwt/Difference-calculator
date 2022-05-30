import fs from 'fs';
import _ from 'lodash';

const parseJsonData = (filePath) => {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const parsedData = JSON.parse(jsonData);
  return parsedData;
};

export default (filePath1, filePath2) => {
  const obj1 = parseJsonData(filePath1);
  const obj2 = parseJsonData(filePath2);
  const [keys1, keys2] = [_.keys(obj1), _.keys(obj2)];
  const uniqKeys = _.union(keys1, keys2).slice().sort();
  const resultObj = uniqKeys.reduce((newObj, key) => {
    if (_.has(obj1, key) && !_.has(obj2, key)) {
      newObj[`- ${key}`] = obj1[key];
    }
    if (!_.has(obj1, key) && _.has(obj2, key)) {
      newObj[`+ ${key}`] = obj2[key];
    }
    if (_.has(obj1, key) && _.has(obj2, key)) {
      if (obj1[key] === obj2[key]) {
        newObj[`  ${key}`] = obj2[key];
      }
      if (obj1[key] !== obj2[key]) {
        newObj[`- ${key}`] = obj1[key];
        newObj[`+ ${key}`] = obj2[key];
      }
    }
    return resultObj;
  }, {});
  const resultString = `${_.keys(resultObj).reduce((acc, string) => {
    const newAcc = `${acc}  ${string}: ${resultObj[string]}\n`;
    return newAcc;
  }, '{\n')}}`;

  console.log(resultString);
};
