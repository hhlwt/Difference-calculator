import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return (typeof value === 'string' ? `'${value}'` : `${value}`);
};

const plain = (tree) => {
  const iter = (node, path) => {
    const strings = node.flatMap((item) => {
      const newPath = `${path}.${item.key}`;
      if (item.type === 'nested') {
        return iter(item.children, newPath);
      }
      switch (item.type) {
        case 'removed':
          return `Property '${newPath.slice(1)}' was removed`;
        case 'added':
          return `Property '${newPath.slice(1)}' was added with value: ${stringify(item.value)}`;
        case 'changed':
          return `Property '${newPath.slice(1)}' was updated. From ${stringify(item.value1)} to ${stringify(item.value2)}`;
        default:
          return '';
      }
    });
    return strings;
  };
  return iter(tree, '').filter((string) => string).join('\n');
};

export default plain;
