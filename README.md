# basic-ass-deploy
Deploy node apps with node, basically. Run `$ bad` to deploy. **This is a serious WIP and is not currently unit or battle tested.**

## READ FIRST
This project currently only supports basic PM2. It also has not been battle tested so use in dev only. TODO: Forever support, more advanced process management support.

## Installation

```sh
$ npm install basic-ass-deploy --save-dev
```

## Configuration
Make sure your repo and server have [deploy keys](https://developer.github.com/guides/managing-deploy-keys/) set up.

Create a bad.json file to store your config in the root of your project/application. 

```javascript
{
  "ssh": {
    "host": "api.yourhost.com",
    "username": "ubuntu",
    "privateKey": "~/yoursshkey.pem"
  },
  "stack": {
    "process_manager": "pm2", // Current only supporting pm2
    "app_name": "my-api",
    "directory": "/srv/my-api"
  },
  "code": {
    "repo": "",
    "branch": "master"
  }
}
```

## Usage
Run `$ bad`.

This will search for a `bad.json` config file in your project root. You can declare another config file by running `$ bad -c /path/t0/other/config.json`.
