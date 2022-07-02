import plain from './plain.js';
import stylish from './stylish.js';

const chooseFormater = (diff, format) => {
  switch (format) {
    case 'plain':
      return plain(diff);
    case 'json':
      return JSON.stringify(diff);
    default:
      return stylish(diff);
  }
};

export default chooseFormater;
