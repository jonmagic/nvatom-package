var React = require("atom").React;
var DocumentSearchAndCreate = require("./DocumentSearchAndCreate");
var DocumentList = require("./DocumentList");
var DocumentEditor = require("./DocumentEditor");

var App = React.createClass({
  displayName: "App",

  render: function() {
    return React.DOM.div(null,
      React.DOM.div(
        {className: "nvatom-document-search-and-create"},
        DocumentSearchAndCreate()
      ),
      React.DOM.div(
        {className: "nvatom-container"},
        React.DOM.div(
          {className: "nvatom-document-list clearfix"},
          DocumentList()
        ),
        React.DOM.div(
          {className: "nvatom-document-editor"},
          DocumentEditor()
        )
      )
    )
  }
});

module.exports = App;
