import plain from './plain.js';
import stylish from './stylish.js';

const chooseFormater = (diff, format) => {
  let result;
  switch (format) {
    case plain:
      result = plain(diff);
      break;
    case stylish:
      result = stylish(diff);
      break;
    default:
      result = JSON.stringify(diff);
  }
  return result;
};

export default chooseFormater;
