import _ from 'lodash';

const getIndent = (depth, replacersCount = 4) => ' '.repeat(depth * replacersCount - 2);
const getBracketIndent = (depth, replacersCount = 4) => ' '.repeat(replacersCount * depth - replacersCount);

const stringifyValue = (nodeValue, depth, iterFunc) => {
  if (!_.isObject(nodeValue)) {
    return String(nodeValue);
  }

  return iterFunc(nodeValue, depth + 1);
};

const stylish = (tree) => {
  const iter = (subTree, depth = 1) => {
    const strings = subTree.map((node) => {
      switch (node.type) {
        case 'added':
          return `${getIndent(depth)}+ ${node.key}: ${stringifyValue(node.value, depth, iter)}`;
        case 'removed':
          return `${getIndent(depth)}- ${node.key}: ${stringifyValue(node.value, depth, iter)}`;
        case 'changed':
          return `${getIndent(depth)}- ${node.key}: ${stringifyValue(node.value1, depth, iter)}\n${getIndent(depth)}+ ${node.key}: ${stringifyValue(node.value2, depth, iter)}`;
        case 'unchanged':
          return `${getIndent(depth)}  ${node.key}: ${stringifyValue(node.value, depth, iter)}`;
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
