import _ from 'lodash';

const stylish = (tree, replacer = '  ', replacersCount = 1) => {
  const iter = (subTree, depth = 1) => {
    const indent = replacer.repeat(replacersCount * depth);
    const bracketIndent = replacer.repeat(replacersCount * (depth - 1));
    const strings = subTree.map((node) => {
      let string = '';
      switch (node.type) {
        case 'added':
          string = `${indent}+ ${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 2) : node.value}`;
          break;
        case 'removed':
          string = `${indent}- ${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 2) : node.value}`;
          break;
        case 'changed':
          string = `${indent}- ${node.key}: ${_.isObject(node.value.value1) ? iter(Object.entries(node.value.value1), depth + 2) : node.value.value1}\n${indent}+ ${node.key}: ${_.isObject(node.value.value2) ? iter(Object.entries(node.value.value2), depth + 2) : node.value.value2}`;
          break;
        case 'unchanged':
          return `${indent}  ${node.key}: ${_.isObject(node.value) ? iter(Object.entries(node.value), depth + 2) : node.value}`;
        case 'nested':
          string = `${indent}  ${node.key}: ${iter(node.value, depth + 2)}`;
          break;
        default:
          string = `${indent}  ${node[0]}: ${_.isObject(node[1]) ? iter(Object.entries(node[1]), depth + 2) : node[1]}`;
      }
      return string;
    });
    return ['{', ...strings, `${bracketIndent}}`].join('\n');
  };
  return iter(tree);
};

export default stylish;
