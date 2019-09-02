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
      if (err) return cb(err, data);
      if (data && data.Location) return cb(null, data.Location);
      // data.Location is the uploaded location
      return cb(new Error("data.Location not found!"), data);
    });
  return pass;
};
exports.uploadToS3RawResponse = function uploadFromStream(
  s3,
  uploadParams,
  cb
) {
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
