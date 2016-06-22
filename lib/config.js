import appRoot from 'app-root-path';
import argv from 'argv';
import 'babel-polyfill';
import fs from 'fs';

export default new Promise((resolve, reject) => {

  argv.option({
    name: 'config',
    short: 'c',
    type: 'string',
    description: 'Defines an alternative path to your config.',
    example: "'bad -c /path/to/newconf.json'"
  });

  let args = argv.run();
  let configPath;

  if(args.options && args.options.config) {
    configPath = (args.options.config);
  } 
  else {
    configPath = appRoot + '/bad.json';
  }

  console.log('Loading config...');

  if (fs.existsSync(configPath)) {
    fs.readFile(configPath, 'utf8', (err, config) => {
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
    reject('Deployment must be run from a valid project folder. HINT: You\'re probably missing a config file!');
  }
});