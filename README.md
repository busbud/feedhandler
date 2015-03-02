# feedhandler

[![Circle CI](https://circleci.com/gh/busbud/feedhandler/tree/master.svg?style=svg&circle-token=ef379600d241ad64c0d04e2f6eb56a4c2b6a4ecb)](https://circleci.com/gh/busbud/feedhandler/tree/master)

An extensible RSS/RDF/Atom feed parser for use with [html-parser2](https://www.npmjs.com/package/htmlparser2).

```js
var htmlparser2 = require('htmlparser2');
var FeedHandler = require('feedhandler');

function parse(xml, cb) {
  var handler = new FeedHandler(cb, {
    extensions: [
      {input: 'tag1', output: 'property1'},
      {input: 'tag2', output: 'property2'}
    ]
  });

  try {
    new htmlparser2.Parser(handler, {xmlMode: true}).parseComplete(xml);
  } catch (ex) {
    cb(ex);
  }
}
```
