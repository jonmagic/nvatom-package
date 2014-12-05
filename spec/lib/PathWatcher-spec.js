var fs = require("fs-plus");
var PathWatcher = require("../../lib/PathWatcher");
var foo = __dirname + "/foo.md"

describe("PathWatcher", function() {
  it("loads documents in directory", function() {
    fs.writeFileSync(foo, "hello world");
    waitsFor(function(done) {
      var callbacks = {
        update: function(details) {
          expect(details.filename).toEqual("keep.txt");
          done();
        },
        remove: function(filename) {
          // noop
        }
      }

      new PathWatcher(__dirname, [".txt"], callbacks);
    });
  });

  it("fires update callback when file is added", function() {
    waitsFor(function(done) {
      var callbacks = {
        update: function(details) {
          expect(details.filename).toEqual("foo.md");
          done();
        },
        remove: function(filename) {
          // noop
        }
      }

      new PathWatcher(__dirname, [".md"], callbacks);

      fs.writeFileSync(foo, "hello world");
    });
  });

  it("fires remove callback when file is removed", function(done) {
    waitsFor(function(done) {
      var callbacks = {
        update: function(details) {
          // noop
        },
        remove: function(filename) {
          expect(filename).toEqual("foo.md");
          done();
        }
      }

      new PathWatcher(__dirname, [".md"], callbacks);

      fs.unlinkSync(foo);
    });
  });
});
