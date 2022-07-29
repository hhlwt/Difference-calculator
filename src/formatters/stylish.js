import _ from 'lodash';

const getIndent = (depth, replacersCount = 4) => ' '.repeat(depth * replacersCount - 2);
const getBracketIndent = (depth, replacersCount = 4) => ' '.repeat(replacersCount * depth - replacersCount);

const stringifyValue = (nodeValue, depth) => {
  if (!_.isPlainObject(nodeValue)) {
    return String(nodeValue);
  }
  const strings = Object.entries(nodeValue).map(([key, value]) => `${getIndent(depth + 1)}  ${key}: ${stringifyValue(value, depth + 1)}`);

  return ['{', ...strings, `${getBracketIndent(depth + 1)}}`].join('\n');
};

const stylish = (tree) => {
  const iter = (subTree, depth = 1) => {
    const strings = subTree.map((node) => {
      switch (node.type) {
        case 'added':
          return `${getIndent(depth)}+ ${node.key}: ${stringifyValue(node.value, depth)}`;
        case 'removed':
          return `${getIndent(depth)}- ${node.key}: ${stringifyValue(node.value, depth)}`;
        case 'changed':
          return `${getIndent(depth)}- ${node.key}: ${stringifyValue(node.value1, depth)}\n${getIndent(depth)}+ ${node.key}: ${stringifyValue(node.value2, depth)}`;
        case 'unchanged':
          return `${getIndent(depth)}  ${node.key}: ${stringifyValue(node.value, depth)}`;
        case 'nested':
          return `${getIndent(depth)}  ${node.key}: ${iter(node.children, depth + 1)}`;
        default:
          throw new Error(`Node type ${node.type} is not supported.`);
      }
    });
    return ['{', ...strings, `${getBracketIndent(depth)}}`].join('\n');
  };
  return iter(tree, 1);
};

export default stylish;
