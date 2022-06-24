import _ from 'lodash';

const plain = (tree) => {
  const iter = (node, path) => {
    const strings = node.flatMap((item) => {
      const newPath = `${path}.${item.key}`;
      let string = '';
      switch (item.type) {
        case 'removed':
          string = `Property '${newPath.slice(1)}' was removed`;
          break;
        case 'added':
          string = `Property '${newPath.slice(1)}' was added with value: ${_.isObject(item.value) ? '[complex value]' : item.value}`;
          break;
        case 'changed':
          string = `Property '${newPath.slice(1)}' was updated. From ${_.isObject(item.value.value1) ? '[complex value]' : item.value.value1} to ${_.isObject(item.value.value2) ? '[complex value]' : item.value.value2}`;
          break;
        case 'nested':
          string = iter(item.value, newPath);
          break;
        default:
          string = '';
      }
      return string;
    });
    return strings;
  };
  return iter(tree, '').filter((string) => string).join('\n');
};

export default plain;
