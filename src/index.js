import _ from 'lodash';
import parseFiles from './parsers.js';

export const plain = (tree) => {
  const strings = tree.flatMap((node) => {
    let string = '';
    switch (node.type) {
      case 'deleted':
        string = `Property '${node.key}' was removed`;
        break;
      case 'added':
        string = `Property '${node.key}' was added with value: ${_.isObject(node.value) ? '[complex value]' : node.value}`;
        break;
      case 'changed':
        string = `Property '${node.key}' was updated. From ${_.isObject(node.value.previousValue) ? '[complex value]' : node.value.previousValue} to ${_.isObject(node.value.currentValue) ? '[complex value]' : node.value.currentValue}`;
        break;
      case '':
        string = plain(node.value);
        break;
      default:
        string = '';
    }
    return string;
  });
  const result = strings.filter((string) => string);
  return result.join('\n');
};

export const stylish = (tree, replacer = '  ', replacersCount = 2) => {
  const iter = (currentNode, depth = 1) => {
    const indent = replacer.repeat(depth * replacersCount);
    const plusMinusIndent = replacer.repeat(depth * replacersCount - 1);
    const bracketIndent = replacer.repeat((depth - 1) * replacersCount);
    const values = currentNode.map((node) => {
      switch (node.type) {
        case 'deleted':
          return `${plusMinusIndent}- ${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 1) : node.value}`;
        case 'added':
          return `${plusMinusIndent}+ ${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 1) : node.value}`;
        case 'changed':
          return `${plusMinusIndent}- ${node.key}: ${_.isObject(node.value.previousValue) ? iter(Object.entries(node.value.previousValue), depth + 1) : node.value.previousValue}\n${plusMinusIndent}+ ${node.key}: ${_.isObject(node.value.currentValue) ? iter(Object.entries(node.value.currentValue), depth + 1) : node.value.currentValue}`;
        case 'unchanged':
          return `${indent}${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 1) : node.value}`;
        case '':
          return `${indent}${node.key}: ${iter(node.value, depth + 1)}`;
        default:
          return `${indent}${node[0]}: ${_.isObject(node[1]) ? iter(Object.entries(node[1]), depth + 1) : node[1]}`;
      }
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
  return resultTree;
  // const formatedTree = format(resultTree);
  // return formatedTree;
};
