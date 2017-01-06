var AWS = require('aws-sdk');
var request = require('request');
const stream = require('stream');


var uploadToS3 = function uploadFromStream(s3, uploadParams, cb) {
  var pass = new stream.PassThrough();

  var params = upuploadParams || {};
  params.Body = pass;
  s3.upload(params).
  // on('httpUploadProgress', function(evt) { console.log(evt); }).
  send(function(err, data) { 
    console.log(err, data); 
    if (err) cb(err, data);
    if (data && data.Location)
      cb(null, data.Location);// data.Location is the uploaded location
    else 
      cb (new Error("data.Location not found!"), data);
  });
  return pass;
};
var uploadToS3RawResponse = function uploadFromStream(s3, uploadParams, cb) {
  var pass = new stream.PassThrough();
  var params = upuploadParams || {};
  params.Body = pass;
  s3.upload(params).
  // on('httpUploadProgress', function(evt) { console.log(evt); }).
  send(function(err, data) { 
    console.log(err, data); 
	cb(err, data);
  });
  return pass;
};
/* initiate a get request to the url and pipe the data to S3 bucket
 * will terminate when statusCode != 200
 * params: 
 *  url : the url of the target resource
 *  bucketName: the bucketName in S3
 *  itemKey: the fileName on S3
 *  callback: function(err, data), where data will Location in upload response
 */
exports.urlToS3 = function(url, bucketName, itemKey, callback) {
  var s3 = new AWS.S3({params : {Bucket: bucketName, Key: itemKey}});
  var req = request.get(url);
  req.pause();
  req.on('response', function(resp) {
    if (resp.statusCode == 200) {
      req.pipe(uploadToS3(s3, callback));
      req.resume();
    } else {
      callback(new Error('request item did not respond with HTTP 200'));
    }
  });
}
/* initiate a get request to the url and pipe the data to S3 bucket
 * will terminate when statusCode != 200
 * params: 
 *  url : the url of the target resource
 *  bucketName: the bucketName in S3
 *  itemKey: the fileName on S3
 *  callback: function(err, data), where data will Location in upload response
 */
exports.urlToS3WithS3Obj = function(url, s3Obj, uploadParams, callback) {
  var s3 = s3Obj; 
  var req = request.get(url);
  req.pause();
  req.on('response', function(resp) {
    if (resp.statusCode == 200) {
      req.pipe(uploadToS3(s3, uploadParams, callback));
      req.resume();
    } else {
      callback(new Error('request item did not respond with HTTP 200'));
    }
  });
}

/* Same as urlToS3, but callback will return s3 upload raw response
 *  callback: function(err, data), where data is s3 upload response
 */
exports.urlToS3RawWithS3Obj = function(url, s3Obj, uploadParams, callback) {
  var s3 = s3Obj;
  var req = request.get(url);
  req.pause();
  req.on('response', function(resp) {
    if (resp.statusCode == 200) {
      req.pipe(uploadToS3RawResponse(s3, uploadParams, callback));
      req.resume();
    } else {
      callback(new Error('request item did not respond with HTTP 200'));
    }
  });
}