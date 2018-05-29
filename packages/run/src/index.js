import exec from './exec';

export default {
  execute: async ({ command }) => {
    await exec(command);
  },
  validate: ({ command }) => {
    if (typeof command !== 'string') {
      throw new Error('"command" of "Run" can only be a "string"');
    }
  },
};
