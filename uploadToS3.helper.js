"use strict";

const stream = require("stream");

exports.uploadToS3 = function uploadFromStream(s3, uploadParams, cb) {
  const pass = new stream.PassThrough();
  const params = uploadParams || {};
  params.Body = pass;
  s3.upload(params)
    // on('httpUploadProgress', function(evt) { console.log(evt); }).
    .send((err, data) => {
      // console.log(err, data);
      cb(err, data);
    });
  return pass;
};
