#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from '../src/index.js';

const program = new Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    switch (options.format) {
      case 'plain':
        console.log(genDiff(filepath1, filepath2, 'plain'));
        break;
      case 'json':
        console.log(genDiff(filepath1, filepath2, 'json'));
        break;
      default:
        console.log((genDiff(filepath1, filepath2, 'stylish')));
    }
  })
  .parse(process.argv);
