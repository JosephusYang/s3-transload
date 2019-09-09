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

  const setup = function(s3) {
    return function() {
      return uploadToS3(s3);
    };
  };
  describe("setup", function() {
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
});
