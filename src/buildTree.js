import _ from 'lodash';

const buildTree = (firstObj, secondObj) => {
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
      const objValueDiff = buildTree(firstObj[key], secondObj[key]);
      return [...acc, { key, type: 'nested', value: objValueDiff }];
    }
    return [...acc, { key, type: 'changed', value: { value1: firstObj[key], value2: secondObj[key] } }];
  }, []);

  return diffObj;
};

export default buildTree;
