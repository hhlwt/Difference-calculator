import yaml from 'js-yaml';

const parse = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.load(data);
    default:
      return new Error('Unknown format.');
  }
};

export default parse;
