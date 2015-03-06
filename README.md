# feedhandler

[![Circle CI](https://circleci.com/gh/busbud/feedhandler/tree/master.svg?style=svg&circle-token=ef379600d241ad64c0d04e2f6eb56a4c2b6a4ecb)](https://circleci.com/gh/busbud/feedhandler/tree/master)

An extensible RSS/RDF/Atom feed parser for use with [html-parser2](https://www.npmjs.com/package/htmlparser2).


## Example
Assuming the following RSS, with a custom `my:tag` you want to extract into your object model

```xml
<?xml version="1.0"?>
<rss version="2.0" xmlns:my="http://example.com/my">
   <channel>
      <title>Liftoff News</title>
      <link>http://liftoff.msfc.nasa.gov/</link>
      <description>Liftoff to Space Exploration.</description>
      <language>en-us</language>
      <pubDate>Tue, 10 Jun 2003 04:00:00 GMT</pubDate>
      <lastBuildDate>Tue, 10 Jun 2003 09:41:01 GMT</lastBuildDate>
      <item>
         <title>Star City</title>
         <link>http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp</link>
         <description>How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's &lt;a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm"&gt;Star City&lt;/a&gt;.</description>
         <pubDate>Tue, 03 Jun 2003 09:39:21 GMT</pubDate>
         <guid>http://liftoff.msfc.nasa.gov/2003/06/03.html#item573</guid>
         <!-- custom extension to RSS payload -->
         <my:tag>So glad I could sneak this new content in</my:tag>
      </item>
   </channel>
</rss>
```

You can extract the value of the custom tag using the `extensions` property.

```js
var htmlparser2 = require('htmlparser2');
var FeedHandler = require('feedhandler');

function parse(xml, cb) {
  var handler = new FeedHandler(cb, {
    extensions: [
      {input: "my:tag", output: "my_tag"}
    ]
  });

  try {
    new htmlparser2.Parser(handler, {xmlMode: true}).parseComplete(xml);
  } catch (ex) {
    cb(ex);
  }
}

module.exports = parse;
```

Running `parse` against the xml sample will return the following object:

```json
{
  type: "rss",
  id: "",
  title: "Liftoff News",
  link: "http://liftoff.msfc.nasa.gov/",
  description: "Liftoff to Space Exploration.",
  updated: new Date("Tue, 10 Jun 2003 09:41:01 GMT"),
  items: [{
    id: "http://liftoff.msfc.nasa.gov/2003/06/03.html#item573",
    title: "Star City",
    link: "http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp",
    description: "How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's &lt;a href=\"http://howe.iki.rssi.ru/GCTC/gctc_e.htm\"&gt;Star City&lt;/a&gt;.",
    pubDate: new Date("Tue, 03 Jun 2003 09:39:21 GMT"),
    my_tag: "So glad I could sneak this new content in"
  }]
}
```