import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const parseFiles = (filePath) => {
  const format = path.extname(filePath);
  const data = fs.readFileSync(filePath, 'utf-8');

  let parser;
  if (format === '.json' || format === '') {
    parser = JSON.parse;
  } else if (format === 'yml' || format === 'yaml') {
    parser = yaml.load;
  }

  if (parser === yaml.load) {
    return yaml.load(data);
  }
  return JSON.parse(data);
};

export default parseFiles;
