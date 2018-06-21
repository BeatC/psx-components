export default {
  execute: async ({ when }, context, next) => {
    if (!process.env.GIT_COMMIT_BRANCH) {
      throw new Error(
        '"Branch" component requires GIT_BRANCH environment variable to be set',
      );
    }

    const whenRegExp = new RegExp(when);

    if (whenRegExp.test(process.env.GIT_COMMIT_BRANCH)) {
      await next();
    }
  },
  validate: ({ when }) => {
    if (typeof when !== 'string') {
      throw new Error('"when" of "Branch" can only be a "string"');
    }
  },
};
