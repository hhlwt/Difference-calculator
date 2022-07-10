import _ from 'lodash';

const stylish = (tree, replacer = '  ', replacersCount = 1) => {
  const iter = (subTree, depth = 1) => {
    const indent = replacer.repeat(replacersCount * depth);
    const bracketIndent = replacer.repeat(replacersCount * (depth - 1));
    const strings = subTree.map((node) => {
      switch (node.type) {
        case 'added':
          return `${indent}+ ${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 2) : node.value}`;
        case 'removed':
          return `${indent}- ${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 2) : node.value}`;
        case 'changed':
          return `${indent}- ${node.key}: ${_.isObject(node.value1) ? iter(Object.entries(node.value1), depth + 2) : node.value1}\n${indent}+ ${node.key}: ${_.isObject(node.value2) ? iter(Object.entries(node.value2), depth + 2) : node.value2}`;
        case 'unchanged':
          return `${indent}  ${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 2) : node.value}`;
        case 'nested':
          return `${indent}  ${node.key}: ${iter(node.children, depth + 2)}`;
        default:
          return `${indent}  ${node[0]}: ${_.isObject(node[1]) ? iter(Object.entries(node[1]), depth + 2) : node[1]}`;
      }
    });
    return ['{', ...strings, `${bracketIndent}}`].join('\n');
  };
  return iter(tree);
};

export default stylish;
