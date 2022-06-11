import _ from 'lodash';
import parseFiles from './parsers.js';

export const stylish = (tree, replacer = '  ', replacersCount = 1) => {
  const iter = (currentNode, depth = 1) => {
    const indent = replacer.repeat(depth * replacersCount);
    const bracketIndent = replacer.repeat((depth - 1) * replacersCount);
    const values = currentNode.map((node) => {
      let string;
      if (node.type === 'deleted') {
        string = `${indent}- ${node.key}: ${node.value}`;
      } else if (node.type === 'added') {
        string = `${indent}+ ${node.key}: ${node.value}`;
      } else if (node.type === 'changed') {
        string = `${indent}- ${node.key}: ${node.value.previousValue}\n${indent}+ ${node.key}: ${node.value.currentValue}`;
      } else if (node.type === 'unchanged') {
        string = `${indent}  ${node.key}: ${node.value}`;
      } else if (node.type === '') {
        string = `${indent}  ${node.key}: ${iter(node.value, depth + 2)}`;
      } else {
        string = `${indent}  ${node.key}: ${node.value}`;
      }
      return string;
    });
    return ['{', ...values, `${bracketIndent}}`].join('\n');
  };
  return iter(tree);
};

export default (filePath1, filePath2, format = stylish) => {
  const obj1 = parseFiles(filePath1);
  const obj2 = parseFiles(filePath2);

  const getDiff = (firstObj, secondObj) => {
    const [keys1, keys2] = [_.keys(firstObj), _.keys(secondObj)];
    const uniqKeys = _.union(keys1, keys2).slice().sort();
    const tree = uniqKeys.map((key) => {
      const node = {};
      if (_.has(firstObj, key) && !_.has(secondObj, key)) {
        node.key = key;
        node.type = 'deleted';
        node.value = firstObj[key];
      }
      if (!_.has(firstObj, key) && _.has(secondObj, key)) {
        node.key = key;
        node.type = 'added';
        node.value = secondObj[key];
      }
      if (_.has(firstObj, key) && _.has(secondObj, key)) {
        if (_.isObject(firstObj[key]) && _.isObject(secondObj[key])) {
          const objValue = getDiff(firstObj[key], secondObj[key]);
          node.key = key;
          node.type = '';
          node.value = objValue;
        } else if (firstObj[key] !== secondObj[key]) {
          node.key = key;
          node.type = 'changed';
          node.value = {
            previousValue: firstObj[key],
            currentValue: secondObj[key],
          };
        }
        if (firstObj[key] === secondObj[key]) {
          node.key = key;
          node.type = 'unchanged';
          node.value = secondObj[key];
        }
      }
      return node;
    });
    return tree;
  };

  const resultTree = getDiff(obj1, obj2);
  // return resultTree;
  const formatedTree = format(resultTree);
  return formatedTree;
};
