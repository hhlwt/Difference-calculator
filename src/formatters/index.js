import plain from './plain.js';
import stylish from './stylish.js';

const format = (diff, formatName) => {
  switch (formatName) {
    case 'plain':
      return plain(diff);
    case 'json':
      return JSON.stringify(diff);
    default:
      return stylish(diff);
  }
};

export default format;
