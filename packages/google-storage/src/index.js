const Storage = require('@google-cloud/storage');
const path = require('path');
const glob = require('glob-promise');
const storage = new Storage();

export default {
  execute: async ({ bucket, from, to = '/' }, _, next) => {
    const files = await glob('**/*', {
      cwd: path.resolve(process.cwd(), from),
      nodir: true,
    });

    const uploads = files.map(f => {
      const toLocation = path.join(to, f);

      return storage.bucket(bucket).upload(path.resolve(from, f), {
        destination: toLocation,
      });
    });

    await Promise.all(uploads);

    await next();
  },
  validate: ({ bucket, from }) => {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error(
        '"GOOGLE_APPLICATION_CREDENTIALS" needed for "GoogleStorage" to run',
      );
    }

    if (typeof bucket !== 'string') {
      throw new Error('"bucket" of "GoogleStorage" can only be a "string"');
    }

    if (typeof from !== 'string') {
      throw new Error('"from" of "GoogleStorage" can only be a "string"');
    }
  },
};
