/* eslint-disable no-console */
import exec from './exec';

export default {
  execute: async ({ command }) => {
    try {
      await exec(command);
    } catch (err) {
      console.log(err.message);

      throw err;
    }
  },
  validate: ({ command }) => {
    if (typeof command !== 'string') {
      throw new Error('"command" of "Run" can only be a "string"');
    }
  },
};
