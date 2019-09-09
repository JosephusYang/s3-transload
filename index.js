"use strict";

const request = require("request");

const { uploadToS3 } = require("./uploadToS3.helper");

/* initiate a get request to the url and pipe the data to S3 bucket
 * will terminate when statusCode != 200
 * params:
 *  url : the url of the target resource
 *  bucketName: the bucketName in S3
 *  itemKey: the fileName on S3
 *  callback: function(err, data), where data will Location in upload response
 */

module.exports = function(s3) {
  if (!s3 || typeof s3.upload !== "function") {
    throw new Error("please specify a valid s3 object.");
  }
  return {
    /* initiate a get request to the url and pipe the data to S3 bucket
     * will terminate when statusCode != 200
     * @param  {String} url the url of the target resource
     * @param  {Object} uploadParams S3 upload params
     * @param  {Function} callback function(err, data), where data be s3 upload response
     */
    urlToS3(url, uploadParams, callback) {
      const params = Object.assign({}, uploadParams);
      const req = request.get(url);
      req.pause();
      req.on("response", resp => {
        if (resp.statusCode === 200) {
          const headers = resp.headers;

          if (headers["content-type"]) {
            params.ContentType = headers["content-type"];
          }

          if (headers["content-encoding"]) {
            params.ContentEncoding = headers["content-encoding"];
          }

          req.pipe(uploadToS3(s3, params, callback));
          req.resume();
        } else {
          return callback(
            new Error("request item did not respond with HTTP 200")
          );
        }
      });
    }
  };
};
