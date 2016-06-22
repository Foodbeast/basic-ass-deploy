import "babel-polyfill";
import fs from 'fs';

export default new Promise((resolve, reject) => {
  if (fs.existsSync('../bad.json')) {
    fs.readFile('../bad.json', 'utf8', (err, config) => {
      if (err) throw err;

      config = JSON.parse(config);
      
      resolve({
        host: config.ssh.host,
        username: config.ssh.username,
        privateKey: config.ssh.privateKey,
        processManager: config.stack.processManager,
        appName: config.stack.appName,
        directory: config.stack.directory,
        repo: config.code.repo,
        branch: config.code.branch,
      });
    });
  } else {
    reject('Deployment must be run from a valid project folder.');
  }
});