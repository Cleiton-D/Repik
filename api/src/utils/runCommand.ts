import { exec } from 'child_process';

export default async function runCommand(comand: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(comand, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout || stderr);
    });
  });
}
