import _ from 'lodash';

const getIndent = (depth, replacersCount = 4) => ' '.repeat(depth * replacersCount - 2);
const getBracketIndent = (depth, replacersCount = 4) => ' '.repeat(replacersCount * depth - replacersCount);

const stringifyValue = (nodeValue) => {
  if (!_.isPlainObject(nodeValue)) {
    return String(nodeValue);
  }
  const result = Object.entries(nodeValue).map(([key, value]) => ({ key, value, type: 'unchanged' }));

  return result;
};

const stylish = (tree) => {
  const iter = (subTree, depth = 1) => {
    if (typeof subTree === 'string') {
      return subTree;
    }
    const strings = subTree.map((node) => {
      switch (node.type) {
        case 'added':
          return `${getIndent(depth)}+ ${node.key}: ${iter(stringifyValue(node.value), depth + 1)}`;
        case 'removed':
          return `${getIndent(depth)}- ${node.key}: ${iter(stringifyValue(node.value), depth + 1)}`;
        case 'changed':
          return `${getIndent(depth)}- ${node.key}: ${iter(stringifyValue(node.value1), depth + 1)}\n${getIndent(depth)}+ ${node.key}: ${iter(stringifyValue(node.value2), depth + 1)}`;
        case 'unchanged':
          return `${getIndent(depth)}  ${node.key}: ${iter(stringifyValue(node.value), depth + 1)}`;
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
