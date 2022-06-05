#!/usr/bin/env node
import { Command } from 'commander';
import genDiff, { stylish } from '../src/index.js';

const program = new Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2) => {
    const option = program.opts();
    const { format } = option;
    switch (format) {
      case 'plain':
        console.log('Hello!');
        break;
      default:
        console.log(genDiff(filepath1, filepath2, stylish));
    }
  })
  .parse(process.argv);
