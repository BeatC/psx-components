describe('GoogleStorage component', () => {
  let GoogleStorage;

  afterEach(() => {
    jest.resetModules();
  });

  describe('#validate', () => {
    describe('GOOGLE_APPLICATION_CREDENTIALS not set', () => {
      beforeEach(() => {
        delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
        GoogleStorage = require('.').default;
      });

      it('should throw error', () => {
        expect(() =>
          GoogleStorage.validate({
            bucket: 'foo',
            from: '/bar',
          }),
        ).toThrow();
      });
    });

    describe('GOOGLE_APPLICATION_CREDENTIALS set', () => {
      afterEach(() => {
        delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
      });

      beforeEach(() => {
        process.env.GOOGLE_APPLICATION_CREDENTIALS =
          'FOO_GOOGLE_APPLICATION_CREDENTIALS';
        GoogleStorage = require('.').default;
      });

      describe('valid arguments', () => {
        it('should not throw an error', () => {
          expect(() =>
            GoogleStorage.validate({
              bucket: 'foo',
              from: '/bar',
            }),
          ).not.toThrow();
        });
      });

      describe('"bucket" not a string', () => {
        it('should throw an error', () => {
          expect(() =>
            GoogleStorage.validate({
              bucket: 1,
              from: '/foo',
            }),
          ).toThrow();
        });
      });

      describe('"from" not a string', () => {
        it('should throw an error', () => {
          expect(() =>
            GoogleStorage.validate({
              bucket: 'foo',
              from: 1,
            }),
          ).toThrow();
        });
      });
    });
  });

  describe('#execute', () => {
    let next;
    let upload;

    describe('when command is successful', () => {
      beforeEach(async () => {
        upload = jest.fn();
        next = jest.fn();

        jest.doMock('path', () => ({
          resolve: (arg1, arg2) => `${arg1}/${arg2}`,
          join: (arg1, arg2) => `${arg1}${arg2}`,
        }));

        jest.doMock('glob-promise', () => () => [
          'file.txt',
          'folder/file.txt',
          'folder/sub-folder/file.txt',
        ]);

        jest.doMock('@google-cloud/storage', () => {
          return jest.fn().mockImplementation(() => ({
            bucket: jest.fn(() => ({
              upload,
            })),
          }));
        });

        GoogleStorage = require('.').default;

        await GoogleStorage.execute(
          {
            from: './public',
            bucket: 'sail-temp',
          },
          jest.fn(),
          next,
        );
      });

      it('should upload files with correct paths', () => {
        expect(upload).toHaveBeenCalledWith(
          './public/folder/sub-folder/file.txt',
          {
            destination: '/folder/sub-folder/file.txt',
          },
        );
        expect(upload).toHaveBeenCalledWith('./public/folder/file.txt', {
          destination: '/folder/file.txt',
        });
        expect(upload).toHaveBeenCalledWith('./public/file.txt', {
          destination: '/file.txt',
        });
        expect(upload).toHaveBeenCalledTimes(3);
      });

      it('should complete successfully', () => {
        expect(next).toHaveBeenCalledTimes(1);
      });
    });
  });
});
