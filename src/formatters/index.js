import plain from './plain.js';
import stylish from './stylish.js';

const format = (diff, formatName) => {
  switch (formatName) {
    case 'plain':
      return plain(diff);
    case 'json':
      return JSON.stringify(diff);
    case '':
    case 'stylish':
      return stylish(diff);
    default:
      throw new Error(`Format name ${formatName} is not supported.`);
  }
};

export default format;
