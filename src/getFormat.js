import path from 'path';

const getFormat = (filePath) => {
  const extention = path.extname(filePath);
  switch (extention) {
    case '.json':
      return 'json';
    case '.yml':
    case '.yaml':
      return 'yml';
    default:
      throw new Error('Invalid extention.');
  }
};

export default getFormat;
