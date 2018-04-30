import { spawn } from 'child_process';

const execCommand = command =>
  new Promise((resolve, reject) => {
    let handled = false;
    const commandProcess = spawn(command, {
      stdio: 'inherit',
      shell: true,
    });

    commandProcess.on('error', () => {
      handled = true;
      reject(new Error('Failed to run command.'));
    });

    commandProcess.on('exit', code => {
      if (!handled) {
        if (code > 0) {
          return reject(
            new Error(`Command failed with an exit code of ${code}.`),
          );
        }

        resolve();
      }
    });
  });

export default execCommand;
