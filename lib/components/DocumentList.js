var React = require("atom").React;

var DocumentList = React.createClass({
  displayName: "DocumentList",

  render: function() {
    return React.DOM.ul(
      null,
      React.DOM.li(null, "item 1"),
      React.DOM.li(null, "item 2"),
      React.DOM.li(null, "item 3")
    );
  }
});

module.exports = DocumentList;
