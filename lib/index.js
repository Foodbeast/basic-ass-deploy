import "babel-polyfill";
import chalk from 'chalk';
import confirm from 'confirm-simple';
import fs from 'fs';

import config from './config';
import deploy from './deploy';

confirm('Are you sure you want to deploy `' + config.branch + '` to ' + config.host + '?', ['yes', 'no'] , function(ok){
  if(ok) {

    console.log('Loading config...');

    config
      .then(deploy)
      .then((result) => {

        const [ssh,config] = [result.ssh, result.config];

        ssh.exec('( cd ' + config.directory + ' ; git clean -f ; git pull origin ' + config.branch + ' ; export NODE_ENV=production ; ' + config.processManager + ' restart ' + config.appName + ')')
        .then(function() {
          console.log(chalk.white.bgCyan('++++++++++++++++++++++++++++'));
          console.log(chalk.white.bgBlue('                            '));
          console.log(chalk.white.bgBlue('    ' + config.branch + ' has been deployed!    '));
          console.log(chalk.white.bgBlue('                            '));
          console.log(chalk.white.bgCyan('++++++++++++++++++++++++++++'));
          process.exit(1);
        })
        .catch(function(err) {
          throw err;
        })
        .done();
      })
      .catch(function(err) {
        console.log(chalk.white.bgRed(err));
        process.exit(1);
      });

  } else {
    console.log(chalk.white.bgRed('Cancelling deployment. '));
    process.exit(1);
  }
}); 