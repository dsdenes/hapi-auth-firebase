Hapi authentication plugin to verify JWT token provided by the *firebase* client library.

Installation
============
```
$ npm install --save hapi-auth-firebase
```

Usage
=====
Server
------
```javascript
const Hapi = require('hapi');
const hapiAuthFirebase = require('hapi-auth-firebase');
const firebaseAdmin = require('firebase-admin');

const server = new Hapi.Server();

server.register(hapiAuthFirebase, (err) => {
    if (err) {
        throw err;
    }
    
    server.auth.strategy('firebase', 'firebase', { 
        firebaseAdmin 
    });
    
    server.route({
        path: '/session',
        config: {
            auth: 'firebase',
        },
        handler: function (request, reply) {
            const name = request.auth.credentials.name;
            reply('hello ' + name);
        }
    });

});

```
Client
------
```javascript
import * as firebase from 'firebase';
import axios from 'axios';

async function prepareRequest() {
  const idToken =
    await firebase
      .auth()
      .currentUser
      .getToken();

  return axios.create({
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
}

async function sendRequest() {
  const request = await prepareRequest();
  request.get('http://localhost/myapi');
}

sendRequest();

```
