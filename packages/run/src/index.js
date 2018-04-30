/* eslint-disable no-console */
import exec from './exec';

export default {
  execute: async ({ children }) => {
    try {
      await exec(children);
    } catch (err) {
      console.log(err.message);

      throw err;
    }
  },
  validate: (props, children) => {
    if (typeof children !== 'string') {
      throw new Error('"children" of "Run" can only be a "string"');
    }
  },
};
