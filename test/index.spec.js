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
const request = require("request");
const uploadHelper = require("../uploadToS3.helper");
const uploadToS3 = require("../index");
const chance = require("chance").Chance("INDEX");

describe("UploadToS3 Module", function() {
  let s3Stub;
  beforeEach(function() {
    s3Stub = {
      upload: sinon.stub().returnsThis(),
      send: sinon.stub()
    };
  });
  afterEach(function() {
    sinon.restore();
  });

  describe("setup", function() {
    const setup = function(s3) {
      return function() {
        return uploadToS3(s3);
      };
    };
    it("should throw if s3 is not provided", function() {
      return expect(setup()).to.throw("please specify a valid s3 object.");
    });
    it("should throw if s3 object do not have upload function", function() {
      return expect(setup({})).to.throw("please specify a valid s3 object.");
    });

    it("should get lib with urlToS3 function", function() {
      expect(setup(s3Stub)).not.to.throw();
      const lib = setup(s3Stub)();
      expect(lib).to.haveOwnProperty("urlToS3");
      expect(lib.urlToS3).to.be.a("function");
    });
  });
  describe("urlToS3", function() {
    let service;
    let requestObj, requestStub;
    let uploadToS3Stub;
    const uploadStreamObj = { some: "object" };
    let callback;

    const url = chance.url();

    beforeEach(function() {
      service = uploadToS3(s3Stub);
      requestObj = {
        pause: sinon.stub(),
        on: sinon.stub(),
        pipe: sinon.stub(),
        resume: sinon.stub()
      };
      requestStub = sinon.stub(request, "get").returns(requestObj);
      uploadToS3Stub = sinon
        .stub(uploadHelper, "uploadToS3")
        .returns(uploadStreamObj);
      callback = sinon.stub();
    });
    it("should pipe the response to s3", function() {
      service.urlToS3(url, undefined, callback);
      expect(requestStub.calledOnce, "request.get should be called once").to.be
        .true;
      expect(requestObj.pause.calledOnce, "req.pause should be called once").to
        .be.true;
      expect(requestObj.on.calledOnce, "req.pause should be called once").to.be
        .true;
      expect(requestObj.on.args[0][0]).to.equal("response");
      expect(requestObj.on.args[0][1]).to.be.a("function");
      const response = {
        statusCode: 200,
        headers: {}
      };
      const responseFunction = requestObj.on.args[0][1];
      responseFunction(response);
      expect(uploadToS3Stub.calledOnce, "uploadToS3 should be called once").to
        .be.true;
      expect(uploadToS3Stub.args[0][0]).to.equal(s3Stub);
      expect(uploadToS3Stub.args[0][2]).to.equal(callback);
      expect(requestObj.pipe.calledOnce, "req.pipe should be called once").to.be
        .true;
      expect(requestObj.pipe.args[0][0]).to.equal(uploadStreamObj);
      expect(requestObj.resume.calledOnce, "req.resume should be called once")
        .to.be.true;
    });
  });
});
