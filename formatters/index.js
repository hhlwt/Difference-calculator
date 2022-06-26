import plain from './plain.js';
import stylish from './stylish.js';

const chooseFormater = (diff, format) => {
  switch (format) {
    case plain:
      return plain(diff);
    case stylish:
      return stylish(diff);
    default:
      return JSON.stringify(diff);
  }
};

export default chooseFormater;
