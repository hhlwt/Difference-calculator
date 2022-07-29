import _ from 'lodash';

const checkNodeValue = (nodeValue) => {
  if (!_.isPlainObject(nodeValue)) {
    return nodeValue;
  }

  const result = Object.entries(nodeValue).map(([key, value]) => ({ key, type: 'unchanged', value: checkNodeValue(value) }));
  return result;
};

const buildTree = (firstItem, secondItem) => {
  const firstItemKeys = Object.keys(firstItem);
  const secondItemKeys = Object.keys(secondItem);
  const sortedKeys = _.uniq(_.sortBy([...firstItemKeys, ...secondItemKeys]));

  const diffTree = sortedKeys.map((key) => {
    if (_.isPlainObject(firstItem[key]) && _.isPlainObject(secondItem[key])) {
      const children = buildTree(firstItem[key], secondItem[key]);
      return { key, type: 'nested', children };
    }

    if (!_.has(firstItem, key)) {
      return { key, type: 'added', value: checkNodeValue(secondItem[key]) };
    }

    if (!_.has(secondItem, key)) {
      return { key, type: 'removed', value: checkNodeValue(firstItem[key]) };
    }

    if (firstItem[key] !== secondItem[key]) {
      return {
        key, type: 'changed', value1: checkNodeValue(firstItem[key]), value2: checkNodeValue(secondItem[key]),
      };
    }

    return { key, type: 'unchanged', value: secondItem[key] };
  });

  return diffTree;
};

export default buildTree;
