var lunr = require("lunr");

var DocumentStore = function() {
  var _documents = {};
  var index = lunr(function () {
    this.field('filename', { boost: 10 });
    this.field('body');
  });

  function sorted() {
    var documents = Object.keys(_documents).map(function(key) {
      return _documents[key];
    });

    return documents.sort(function(a, b) {
      if(a.modifiedAt < b.modifiedAt) {
        return 1;
      }

      if(a.modifiedAt > b.modifiedAt) {
        return -1;
      }

      return 0;
    });
  }

  function isBlank(value) {
    if(value == undefined) return true;
    if(value == null) return true;
    if(value == "") return true;
    return false;
  }

  function isNotBlank(value) {
    return !isBlank(value);
  }

  function hasProperty(object, property) {
    return object.hasOwnProperty(property);
  }

  function missingProperty(object, property) {
    return !hasProperty(object, property);
  }

  function validateDetails(details) {
    if(missingProperty(details, "filename") && isNotBlank(details["filename"]))
      return false;
    if(missingProperty(details, "modifiedAt") && isNotBlank(details["filename"]))
       return false;
    if(missingProperty(details, "body"))
      return false;

    return true
  }

  return {
    load: function(details) {
      if(validateDetails(details)) {
        _documents[details.filename] = details;

        index.add({
          filename: details.filename,
          body: details.body,
          id: details.filename
        });

        return true;
      } else {
        return false;
      }
    },

    remove: function(filename) {
      if(hasProperty(_documents, filename)) {
        delete _documents[filename];

        return true;
      } else {
        return false;
      }
    },

    get: function(filename) {
      if(hasProperty(_documents, filename)) {
        return _documents[filename];
      }
    },

    search: function(query) {
      if(isBlank(query)) {
        return sorted();
      } else {
        return index.search(query).map(function(r) {
          return _documents[r.ref]
        });
      }
    }
  };
}

module.exports = DocumentStore;
