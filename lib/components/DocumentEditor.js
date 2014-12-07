var React = require("atom").React;

var DocumentEditor = React.createClass({
  displayName: "DocumentEditor",

  render: function() {
    return React.DOM.div(null, "hello world");
  }
});

module.exports = DocumentEditor;
