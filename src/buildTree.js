import _ from 'lodash';

const buildTree = (firstItem, secondItem) => {
  const [firstItemKeys, secondItemKeys] = [Object.keys(firstItem), Object.keys(secondItem)];
  const sortedKeys = _.uniq(_.sortBy([...firstItemKeys, ...secondItemKeys]));

  const diffTree = sortedKeys.map((key) => {
    if (_.isObject(firstItem[key]) && _.isObject(secondItem[key])) {
      const children = buildTree(firstItem[key], secondItem[key]);
      return { key, type: 'nested', children };
    }
    if (!_.has(firstItem, key)) {
      return { key, type: 'added', value: secondItem[key] };
    } if (!_.has(secondItem, key)) {
      return { key, type: 'removed', value: firstItem[key] };
    } if (firstItem[key] !== secondItem[key]) {
      return {
        key, type: 'changed', value1: firstItem[key], value2: secondItem[key],
      };
    }
    return { key, type: 'unchanged', value: secondItem[key] };
  });

  return diffTree;
};

export default buildTree;

// if (firstItem[key] === secondItem[key]) {
//   return { key, type: 'unchanged', value: secondItem[key] };
// } if (_.isObject(firstItem[key]) && _.isObject(secondItem[key])) {
//   const children = buildTree(firstItem[key], secondItem[key]);
//   return { key, type: 'nested', children };
// }
// return { key, type: 'changed', value: { value1: firstItem[key], value2: secondItem[key] } };
