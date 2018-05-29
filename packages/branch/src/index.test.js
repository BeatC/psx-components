describe('Branch component', () => {
  let Branch;

  afterEach(() => {
    process.env.GIT_BRANCH = undefined;
    jest.resetModules();
  });

  describe('#execute', () => {
    let nextMock;

    describe('when "GIT_BRANCH" environment variable is missing', () => {
      beforeEach(() => {
        nextMock = jest.fn(() => Promise.resolve());

        Branch = require('.').default;
      });

      it('throws error', async () => {
        expect(
          Branch.execute({ when: '^master$' }, {}, nextMock),
        ).rejects.toThrow(
          '"Branch" component requires GIT_BRANCH environment variable to be set',
        );
      });
    });

    describe('when "GIT_BRANCH" environment variable is present', () => {
      beforeEach(() => {
        process.env.GIT_BRANCH = undefined;
      });

      describe('when "when" matches current branch', () => {
        beforeEach(() => {
          process.env.GIT_BRANCH = 'master';

          nextMock = jest.fn(() => Promise.resolve());

          Branch = require('.').default;
        });

        it('calls next', async () => {
          await Branch.execute({ when: '^master$' }, {}, nextMock);

          expect(nextMock).toHaveBeenCalled();
        });
      });

      describe('when "when" does not match current branch', () => {
        beforeEach(() => {
          process.env.GIT_BRANCH = 'master';

          nextMock = jest.fn(() => Promise.resolve());

          Branch = require('.').default;
        });

        it('calls next', async () => {
          await Branch.execute({ when: '^develop$' }, {}, nextMock);

          expect(nextMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('#validate', () => {
    beforeEach(() => {
      Branch = require('.').default;
    });

    it('does not throw an error when "when" is a string', () => {
      expect(() => Branch.validate({ when: '/master/' })).not.toThrow();
    });

    it('throws an error when "when" is not a string', () => {
      expect(() => Branch.validate({ when: 1 })).toThrow();
    });
  });
});
