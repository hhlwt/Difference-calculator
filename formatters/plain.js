import _ from 'lodash';

const plain = (tree) => {
  const iter = (node, path) => {
    const strings = node.flatMap((item) => {
      const newPath = `${path}.${item.key}`;
      let string = '';
      let value1;
      let value2;
      switch (item.type) {
        case 'removed':
          string = `Property '${newPath.slice(1)}' was removed`;
          break;
        case 'added':
          value1 = _.isObject(item.value) ? '[complex value]' : item.value;
          string = `Property '${newPath.slice(1)}' was added with value: ${typeof value1 === 'string' && value1 !== '[complex value]' ? `'${value1}'` : `${value1}`}`;
          break;
        case 'changed':
          value1 = _.isObject(item.value.value1) ? '[complex value]' : item.value.value1;
          value2 = _.isObject(item.value.value2) ? '[complex value]' : item.value.value2;
          string = `Property '${newPath.slice(1)}' was updated. From ${typeof value1 === 'string' && value1 !== '[complex value]' ? `'${value1}'` : `${value1}`} to ${typeof value2 === 'string' && value2 !== '[complex value]' ? `'${value2}'` : `${value2}`}`;
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
