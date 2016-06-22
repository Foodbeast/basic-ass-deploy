import "babel-polyfill";
import Client from 'ssh-promise';
import fs from 'fs';
import logger from './logger';

export default function( config ) {
  return new Promise((resolve, reject) => {

    console.log('Starting Deployment...');
    
    let ssh = new Client({
      host: config.host,
      username: config.username,
      privateKey: fs.readFileSync(config.privateKey.replace('~', process.env.HOME))
    });

    resolve({
      ssh: ssh,
      config: config
    });
  });
}