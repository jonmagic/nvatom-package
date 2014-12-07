var React = require("atom").React;

var DocumentList = React.createClass({
  displayName: "DocumentList",

  render: function() {
    var documents = this.props.documents,
        documentListItems = [];

    for (var i in documents) {
      documentListItems.push(React.DOM.li(null, documents[i].filename));
    }

    return React.DOM.ul(null, documentListItems);
  }
});

module.exports = DocumentList;
