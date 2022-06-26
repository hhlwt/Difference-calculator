import yaml from 'js-yaml';

const parseFiles = (data, format) => {
  switch (format) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
    case '.yaml':
      return yaml.load(data);
    default:
      return new Error('Unknown extention');
  }
};

export default parseFiles;
