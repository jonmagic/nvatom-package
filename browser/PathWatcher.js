var fs = require("fs-plus");
var Path = require("path");

// Public: PathWatcher takes a path and an object with update and remove
// functions and first calls update for every file in the path and then watches
// the path for file changes and calls update or remove as needed.
//
// path       - String path to directory to load and watch
// extensions - Array of extensions (each is a String)
// callbacks  - Object with update and remove functions
//
// Example Usage:
//
//   > var PathWatcher = require("./browser/PathWatcher");
//   > var path = "/tmp";
//
//   > var callbacks = {
//       update: function(details) {
//         console.log("Updated", details.filename);
//       },
//       remove: function(filename) {
//         console.log("Removed", filename);
//       }
//     }
//
//   > new PathWatcher(path, [".md"], callbacks);
//   { path: "/tmp", extensions: [".md"] }
//
//   > var fs = require("fs")
//   > fs.writeFileSync(path + "/foo.md", "hello world");
//   Updated foo.md
//   > fs.unlinkSync(path + "/foo.md")
//   Removed foo.md
//
// Returns an Object.
var PathWatcher = function(path, extensions, callbacks) {
  this.path = path;
  this.extensions = extensions;

  // Internal: Tests filename extension against configured extensions.
  //
  // filename - String filename
  //
  // Returns true or false.
  function isExtensionValid(filename) {
    var valid = false;

    extensions.forEach(function(extension) {
      if(Path.extname(filename) === extension) valid = true;
    });

    return valid;
  }

  // Internal: Takes filename and runs callbacks.update with file details.
  //
  // filename - String filename
  //
  function update(filename) {
    var documentPath = path + "/" + filename;
    var stats = fs.statSync(documentPath);

    callbacks.update({
      filename: filename,
      modifiedAt: stats.mtime.getTime(),
      body: fs.readFileSync(documentPath, {encoding: "utf8"})
    });
  }

  // Internal: Lists files in directory and calls update for every file with
  // a valid extension.
  fs.readdirSync(path).forEach(function(filename) {
    if(isExtensionValid(filename)) update(filename);
  });

  // Internal: Starts a file system watcher for the directory. If a file is
  // added, removed, or updated it will run the function passing it the event
  // and the filename. The function checks to see if the file has a valid
  // extensions and if it does it either calls update or remove depending
  // on whether the file still exists.
  fs.watch(path, function(event, filename) {
    if(isExtensionValid(filename)) {
      var documentPath = path + "/" + filename;

      if(fs.existsSync(documentPath)) {
        update(filename);
      } else {
        callbacks.remove(filename);
      }
    }
  });

  return this;
}

module.exports = PathWatcher;
