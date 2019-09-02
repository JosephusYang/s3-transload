"use strict";

const AWS = require("aws-sdk");
const request = require("request");

const { uploadToS3, uploadToS3RawResponse } = require("./uploadToS3.helper");

/* initiate a get request to the url and pipe the data to S3 bucket
 * will terminate when statusCode != 200
 * params:
 *  url : the url of the target resource
 *  bucketName: the bucketName in S3
 *  itemKey: the fileName on S3
 *  callback: function(err, data), where data will Location in upload response
 */
exports.urlToS3 = function(url, bucketName, itemKey, callback) {
  const s3 = new AWS.S3({ params: { Bucket: bucketName, Key: itemKey } });
  const req = request.get(url);
  req.pause();
  req.on("response", resp => {
    if (resp.statusCode === 200) {
      req.pipe(uploadToS3(s3, null, callback));
      req.resume();
    } else {
      return callback(new Error("request item did not respond with HTTP 200"));
    }
  });
};
/* initiate a get request to the url and pipe the data to S3 bucket
 * will terminate when statusCode != 200
 * params:
 *  url : the url of the target resource
 *  bucketName: the bucketName in S3
 *  itemKey: the fileName on S3
 *  callback: function(err, data), where data will Location in upload response
 */
exports.urlToS3WithS3Obj = function(url, s3Obj, uploadParams, callback) {
  const s3 = s3Obj;
  const req = request.get(url);
  req.pause();
  req.on("response", resp => {
    if (resp.statusCode === 200) {
      req.pipe(uploadToS3(s3, uploadParams, callback));
      req.resume();
    } else {
      return callback(new Error("request item did not respond with HTTP 200"));
    }
  });
};

/* Same as urlToS3, but callback will return s3 upload raw response
 *  callback: function(err, data), where data is s3 upload response
 */
exports.urlToS3RawWithS3Obj = function(url, s3Obj, uploadParams, callback) {
  const s3 = s3Obj;
  const req = request.get(url);
  req.pause();
  req.on("response", resp => {
    if (resp.statusCode === 200) {
      req.pipe(uploadToS3RawResponse(s3, uploadParams, callback));
      req.resume();
    } else {
      return callback(new Error("request item did not respond with HTTP 200"));
    }
  });
};
