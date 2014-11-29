var assert = require("minitest").assert;
var refute = require("minitest").refute;
var fs = require("fs-plus");
var DocumentLoader = require("../../browser/DocumentLoader");
var foo = __dirname + "/foo.md"

suite("DocumentLoader", function() {
  test("loads documents in directory", function(done) {
    fs.writeFileSync(foo, "hello world");

    var callbacks = {
      update: function(details) {
        assert.equal("keep.txt", details.filename);
        done();
      },
      remove: function(filename) {
        // noop
      }
    }

    new DocumentLoader(__dirname, [".txt"], callbacks);
  });

  test("fires update callback when file is added", function(done) {
    var callbacks = {
      update: function(details) {
        assert.equal("foo.md", details.filename);
        done();
      },
      remove: function(filename) {
        // noop
      }
    }

    new DocumentLoader(__dirname, [".md"], callbacks);

    fs.writeFileSync(foo, "hello world");
  });

  test("fires remove callback when file is removed", function(done) {
    var callbacks = {
      update: function(details) {
        // noop
      },
      remove: function(filename) {
        assert.equal("foo.md", filename);
        done();
      }
    }

    new DocumentLoader(__dirname, [".md"], callbacks);

    fs.unlinkSync(foo);
  });
});
