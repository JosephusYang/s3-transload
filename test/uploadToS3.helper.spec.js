"use strict";

const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const _ = require("lodash");
const uploadToS3 = require("../uploadToS3.helper");
const chance = require("chance").Chance("UPLOAD_TO_S3");

describe("UploadToS3 Helper", function() {
  describe("Function: uploadToS3", function() {
    const uploadParams = {
      ACL: chance.pickset([
        "private",
        "public-read",
        "public-read-write",
        "authenticated-read",
        "aws-exec-read",
        "bucket-owner-read",
        "bucket-owner-full-control"
      ]),
      Body: chance.string(),
      Key: chance.string(),
      Bucket: chance.string(),
      ContentType: chance.string(),
      Expires: chance.date()
    };
    const fakeLocation = "http://localhost/fake/url";
    const s3ErrorMsg = "Fake Error of S3";
    let uploadStub, sendSuccessStub, sendFailStub;
    const callbackForPromise = (resolve, reject) => (err, data) => {
      if (err) return reject(err);
      resolve(data);
    };
    const getS3Obj = function(upload, send) {
      return { upload, send };
    };
    beforeEach(function() {
      uploadStub = sinon.stub().returnsThis();
      sendSuccessStub = sinon
        .stub()
        .callsFake(fn => fn(undefined, { Location: fakeLocation }));
      sendFailStub = sinon.stub().callsFake(fn => fn(new Error(s3ErrorMsg)));
    });
    afterEach(function() {
      sinon.restore();
    });

    function getTestedPromise(uploadStub, sendStub) {
      let returnValue;
      const uploadToS3Promise = new Promise(function(resolve, reject) {
        returnValue = uploadToS3.uploadToS3(
          getS3Obj(uploadStub, sendStub),
          uploadParams,
          callbackForPromise(resolve, reject)
        );
      });
      // return value is a stream
      expect(returnValue instanceof require("stream").PassThrough).to.be.true;

      // Upload is called
      expect(uploadStub.calledOnce).to.be.true;
      // Body is replaced by return
      expect(uploadStub.args[0][0]).to.containSubset(
        _.omit(uploadParams, "Body")
      );
      // Body is the returned stream
      expect(uploadStub.args[0][0].Body).to.equal(returnValue);

      // send is called
      expect(sendStub.calledOnce).to.be.true;
      return uploadToS3Promise;
    }

    it("should return location on upload callback success", function() {
      const uploadToS3Promised = getTestedPromise(uploadStub, sendSuccessStub);
      return expect(uploadToS3Promised).to.be.fulfilled.and.eventually.equal(
        fakeLocation
      );
    });

    it("should throw s3 error on upload fail", function() {
      const uploadToS3Promised = getTestedPromise(uploadStub, sendFailStub);
      return expect(uploadToS3Promised).to.be.rejectedWith(s3ErrorMsg);
    });
  });
});
