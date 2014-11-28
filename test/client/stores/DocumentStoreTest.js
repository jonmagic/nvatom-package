var assert = require("minitest").assert;
var refute = require("minitest").refute;
var DocumentStore = require("../../../client/stores/DocumentStore");

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

var invalid = {
  filename: "invalid.md"
};

var documentStore;

suite("DocumentStore", function() {
  setup(function() {
    documentStore = new DocumentStore;
  });

  suite("#load", function() {
    test("returns false if document details are invalid", function() {
      refute(documentStore.load(invalid));
    });

    test("returns true if filename and modifiedAt are present and body is blank", function() {
      var valid = invalid;
      valid.modifiedAt = new Date;
      valid.body = "";
      assert(documentStore.load(valid));
    });
  });

  suite("#remove", function() {
    test("returns true if document details were removed", function() {
      documentStore.load(foo);
      assert(documentStore.remove("foo.md"));
    });

    test("returns false if unable to remove document", function() {
      refute(documentStore.remove("blob.md"));
    });
  });

  suite("#get", function() {
    test("returns file by filename", function() {
      documentStore.load(foo);
      assert.equal(foo, documentStore.get("foo.md"));
    });

    test("returns undefined if document does not exist", function() {
      assert.equal(undefined, documentStore.get("blob.md"));
    });
  });

  suite("#search", function() {
    test("returns an empty array before documents are loaded", function() {
      assert.equal([], documentStore.search());
    });

    test("returns documents sorted by modifiedAt with blank query", function() {
      documentStore.load(foo);
      documentStore.load(bar);
      assert.equal([bar, foo], documentStore.search());
    });

    test("returns filtered documents sorted by search score", function() {
      documentStore.load(foo);
      documentStore.load(bar);
      assert.equal([foo], documentStore.search("rainbow"));
    });

    test("scores filename higher than body", function() {
      documentStore.load(bar);
      documentStore.load(foo);
      assert.equal([foo, bar], documentStore.search("foo"));
      assert.equal([bar, foo], documentStore.search("bar"));
    });
  });
});
