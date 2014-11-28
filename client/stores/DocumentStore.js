// Simple full-text search in your browser http://lunrjs.com
var lunr = require("lunr");

// Public: DocumentStore manages a list of documents and their details. The
// public interface consists of four methods: load, remove, get, and search.
//
// Example Usage:
//
//   > var documentStore = new DocumentStore
//   > var foo = {filename: "foo.md", modifiedAt: new Date, body: "hello"}
//   > documentStore.load(foo)
//
//   > documentStore.get("foo.md")
//   {filename: "foo.md", modifiedAt: "...", body: "hello"}
//
//   > documentStore.search("foo")
//   [{filename: "foo.md", modifiedAt: "...", body: "hello"}]
//
//   > documentStore.remove("foo.md")
//   > documentStore.get("foo.md")
//   undefined
//
var DocumentStore = function() {

  // Internal storage for document details
  var _documents = {};

  // Internal: Search index for documents.
  //
  // Returns a lunr index.
  var index = lunr(function () {
    this.field('filename', { boost: 10 });
    this.field('body');
  });

  // Internal: Sort documents by modifiedAt.
  //
  // Returns an array of document details.
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

  // Internal: Is the value blank?
  //
  // Returns true or false.
  function isBlank(value) {
    if(value == undefined) return true;
    if(value == null) return true;
    if(value == "") return true;
    return false;
  }

  // Internal: Is the value not blank?
  //
  // Returns true or false.
  function isNotBlank(value) {
    return !isBlank(value);
  }

  // Internal: Does the object have this property?
  //
  // Returns true or false.
  function hasProperty(object, property) {
    return object.hasOwnProperty(property);
  }

  // Internal: Is the object missing this property?
  //
  // Returns true or false.
  function missingProperty(object, property) {
    return !hasProperty(object, property);
  }

  // Internal: Validate whether document details object has required properties.
  //
  // Returns true or false.
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
    // Public: Load document details object into store. The details object must
    // have the filename, modifiedAt, and body properties. The first two
    // properties have a non-blank value or the object will not be loaded.
    //
    // details - Object with filename, modifiedAt, and body properties
    //
    // Example Usage:
    //
    //   > var foo = {filename: "foo.md", modifiedAt: new Date, body: "hello"}
    //   > documentStore.load(foo)
    //   true
    //
    // Returns true or false;
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

    // Public: Remove a document from the store by filename.
    //
    // filename - String filename to be removed
    //
    // Example Usage:
    //
    //   > documentStore.remove("foo.md")
    //   true
    //
    // Returns true or false.
    remove: function(filename) {
      if(hasProperty(_documents, filename)) {
        delete _documents[filename];

        return true;
      } else {
        return false;
      }
    },

    // Public: Get document details by filename.
    //
    // filename - String filename to be retrieved
    //
    // Example Usage:
    //
    //   > documentStore.get("foo.md")
    //   {filename: "foo.md", modifiedAt: "...", body: "hello"}
    //
    // Returns document details Object or undefined.
    get: function(filename) {
      if(hasProperty(_documents, filename)) {
        return _documents[filename];
      }
    },

    // Public: Search document store for documents. It returns all document
    // details sorted by modifiedAt if query is blank. It returns specific
    // document details sorted by query matching score when query is present.
    //
    // query - String search query
    //
    // Example Usage:
    //
    //   > documentStore.search("foo")
    //   [{filename: "foo.md", modifiedAt: "...", body: "hello"}]
    //
    // Returns an array of document detail objects.
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
