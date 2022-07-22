import _ from 'lodash';

const stringifyValue = (value, level, iterFunc) => {
  if (_.isObject(value)) {
    return iterFunc(Object.entries(value), level + 1);
  }
  return value;
};

const stylish = (tree, replacer = '  ', replacersCount = 2) => {
  const iter = (subTree, depth = 1) => {
    const indent = replacer.repeat(replacersCount * depth);
    const signIndent = replacer.repeat(replacersCount * depth - 1);
    const bracketIndent = replacer.repeat(replacersCount * depth - replacersCount);

    const strings = subTree.map((node) => {
      switch (node.type) {
        case 'added':
          return `${signIndent}+ ${node.key}: ${stringifyValue(node.value, depth, iter)}`;
        case 'removed':
          return `${signIndent}- ${node.key}: ${stringifyValue(node.value, depth, iter)}`;
        case 'changed':
          return `${signIndent}- ${node.key}: ${stringifyValue(node.value1, depth, iter)}\n${signIndent}+ ${node.key}: ${stringifyValue(node.value2, depth, iter)}`;
        case 'unchanged':
          return `${indent}${node.key}: ${stringifyValue(node.value, depth, iter)}`;
        case 'nested':
          return `${indent}${node.key}: ${iter(node.children, depth + 1)}`;
        default:
          // eslint-disable-next-line no-case-declarations
          const [key, value] = node;
          return `${indent}${key}: ${stringifyValue(value, depth, iter)}`; // Этот кейс на случай если value у ноды с типом added или removed - это объект. Например value у ноды group3 просто будет потеряно, если мы уберем этот кейс. Думал, как это можно по другому сделать, но так ничего и не придумал :)
      }
    });
    return ['{', ...strings, `${bracketIndent}}`].join('\n');
  };
  return iter(tree, 1);
};

export default stylish;
