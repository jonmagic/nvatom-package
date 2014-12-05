var DocumentStore = require("../lib/DocumentStore");

var invalid = {
  filename: "invalid.md"
};

var foo = {
  filename: "foo.md",
  modifiedAt: new Date("Thu Nov 27 2014 16:26:29 GMT-0800 (PST)"),
  body: "rainbow and dragon bar"
};

var bar = {
  filename: "bar.md",
  modifiedAt: new Date("Thu Nov 27 2014 16:27:42 GMT-0800 (PST)"),
  body: "I'll just write an algorithm for foo."
};

var documentStore;

describe("DocumentStore", function() {
  beforeEach(function() {
    documentStore = new DocumentStore;
  });



  describe("::load", function() {
    it("returns false if document details are invalid", function() {
      expect(documentStore.load(invalid)).toBe(false);
    });

    it("returns true if filename and modifiedAt are present and body is blank", function() {
      var valid = invalid;
      valid.modifiedAt = new Date;
      valid.body = "";
      expect(documentStore.load(valid)).toBe(true);
    });
  });

  describe("::remove", function() {
    it("returns true if document details were removed", function() {
      documentStore.load(foo);
      expect(documentStore.remove("foo.md")).toBe(true);
    });

    it("returns false if unable to remove document", function() {
      expect(documentStore.remove("blob.md")).toBe(false);
    });
  });

  describe("::get", function() {
    it("returns file by filename", function() {
      documentStore.load(foo);
      expect(documentStore.get("foo.md")).toEqual(foo);
    });

    it("returns undefined if document does not exist", function() {
      expect(documentStore.get("blob.md")).toBeUndefined();
    });
  });

  describe("::search", function() {
    it("returns an empty array before documents are loaded", function() {
      expect(documentStore.search()).toEqual([]);
    });

    it("returns documents sorted by modifiedAt with blank query", function() {
      documentStore.load(foo);
      documentStore.load(bar);
      expect(documentStore.search()).toEqual([bar, foo]);
    });

    it("returns filtered documents sorted by search score", function() {
      documentStore.load(foo);
      documentStore.load(bar);
      expect(documentStore.search("rainbow")).toEqual([foo]);
    });

    it("scores filename higher than body", function() {
      documentStore.load(bar);
      documentStore.load(foo);
      expect(documentStore.search("foo")).toEqual([foo, bar]);
      expect(documentStore.search("bar")).toEqual([bar, foo]);
    });
  });
});
