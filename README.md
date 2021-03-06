## s3-transload

[![NPM](https://nodei.co/npm/s3-transload.png)](https://nodei.co/npm/s3-transload/)

[![Build status](https://img.shields.io/travis/JosephusYang/s3-transload/master.svg?style=flat-square)](https://travis-ci.org/JosephusYang/s3-transload)
[![dependencies Status](https://david-dm.org/JosephusYang/s3-transload/status.svg)](https://david-dm.org/JosephusYang/s3-transload)
[![Known Vulnerabilities](https://snyk.io/test/npm/s3-transload/1.0.0/badge.svg)](https://snyk.io/test/npm/s3-transload/1.0.0)


A module that pipe network file into AWS S3.
Recommended to use with node 6+, as it is using some ES6 feature.

### What this module do?

* GET a file from the provide url and stream to S3

## Example

```js
const AWS = require("aws-sdk");
const s3Transload = require("s3-transload");

// setup S3 credential
var credentials = new AWS.SharedIniFileCredentials({profile: 'your-profile'});
AWS.config.credentials = credentials;

const s3 = new AWS.S3({
  apiVersion: "2006-03-01"
});

const { urlToS3 } = s3Transload(s3);
const util = require("util");
const urlToS3Promise = util.promisify(urlToS3);

urlToS3Promise("http://path/to/the/resource", {
  Bucket: "your-bucket-name",
  Key: "your-item-key"
}).then(result => {
  console.log(result);
});
```

## Note

[How To setup AWS credential](https://aws.amazon.com/sdk-for-node-js/)

## Under the hood

* It use [request](https://github.com/request/request) to create stream, and pipe it into s3 upload.
* It will stop and return error if HTTP status code not equal to 200.
* This module is inspire by this [SO](http://stackoverflow.com/a/37366093/3744557) and this [SO](http://stackoverflow.com/a/26163128/3744557)
