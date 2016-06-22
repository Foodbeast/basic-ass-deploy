# basic-ass-deploy
Deploy node apps with node, basically. Run `$ bad` to deploy. **This is a serious WIP and is not currently unit or battle tested.**

## READ FIRST
This project currently 

## Installation

```sh
$ npm install basic-ass-deploy --save
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
Start a deployment anywhere in your project by running `$ bad`.
