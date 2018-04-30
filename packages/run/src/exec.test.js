const createSpawnMock = () => ({
  on: jest.fn(),
  stderr: { pipe: jest.fn() },
  stdout: { pipe: jest.fn() },
});

describe('exec function', () => {
  let exec;
  let spawnMock;
  let spawnMockInner;

  afterEach(() => {
    jest.resetModules();
  });

  describe('when command runs and is successful', () => {
    beforeEach(() => {
      spawnMockInner = createSpawnMock();
      spawnMock = jest.fn(() => spawnMockInner);
      spawnMockInner.on.mockImplementation((event, fn) => {
        if (event === 'exit') {
          fn(0); // good exit
        }
      });

      jest.doMock('child_process', () => ({
        spawn: spawnMock,
      }));

      exec = require('./exec').default;
    });

    it('passes correct command to spawn', async () => {
      await exec('ls');

      expect(spawnMock).toHaveBeenCalledWith('ls', {
        shell: true,
        stdio: 'inherit',
      });
    });

    it('resolves without error', () => {
      expect(exec('ls')).resolves.toBeUndefined();
    });
  });

  describe('when command runs and ends in error', () => {
    beforeEach(() => {
      spawnMockInner = createSpawnMock();
      spawnMock = jest.fn(() => spawnMockInner);
      spawnMockInner.on.mockImplementation((event, fn) => {
        if (event === 'exit') {
          fn(1); //bad exit
        }
      });

      jest.doMock('child_process', () => ({ spawn: spawnMock }));

      exec = require('./exec').default;
    });

    it('resolves with error', () => {
      expect(exec('ls')).rejects.toThrow(
        'Command failed with an exit code of 1.',
      );
    });
  });

  describe('when command fails to start and error event is sent', () => {
    beforeEach(() => {
      spawnMockInner = createSpawnMock();
      spawnMock = jest.fn(() => spawnMockInner);
      spawnMockInner.on.mockImplementation((event, fn) => {
        if (event === 'error') {
          fn();
        }
      });

      jest.doMock('child_process', () => ({
        spawn: spawnMock,
      }));

      exec = require('./exec').default;
    });

    it('causes an error', () => {
      expect(exec('ls')).rejects.toThrow('Failed to run command.');
    });
  });

  describe('when command fails to start and error event is sent followed by exit event', () => {
    beforeEach(() => {
      spawnMockInner = createSpawnMock();
      spawnMock = jest.fn(() => spawnMockInner);
      spawnMockInner.on.mockImplementation((event, fn) => {
        if (event === 'error') {
          fn();
        }

        if (event === 'exit') {
          fn(1);
        }
      });

      jest.doMock('child_process', () => ({
        spawn: spawnMock,
      }));

      exec = require('./exec').default;
    });

    it('rejects with error from "error" event', () => {
      expect(exec('ls')).rejects.toThrow('Failed to run command.');
    });
  });
});
