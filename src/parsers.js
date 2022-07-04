import yaml from 'js-yaml';

const parseFiles = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.load(data);
    default:
      return new Error('Unknown format.');
  }
};

export default parseFiles;
