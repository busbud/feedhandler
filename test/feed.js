'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var R = require('ramda');
var htmlparser2 = require('htmlparser2');
var FeedHandler = require('../index');

describe('Basic feed tests', function(){
  var tests = {
    rss: {
      name: "RSS (2.0)",
      file: "rss-example.xml",
      expected: {
        type: "rss",
        id: "",
        title: "Liftoff News",
        link: "http://liftoff.msfc.nasa.gov/",
        description: "Liftoff to Space Exploration.",
        updated: new Date("Tue, 10 Jun 2003 09:41:01 GMT"),
        author: "editor@example.com",
        items: [{
          id: "http://liftoff.msfc.nasa.gov/2003/06/03.html#item573",
          title: "Star City",
          link: "http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp",
          description: "How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's &lt;a href=\"http://howe.iki.rssi.ru/GCTC/gctc_e.htm\"&gt;Star City&lt;/a&gt;.",
          pubDate: new Date("Tue, 03 Jun 2003 09:39:21 GMT")
        }, {
          id: "http://liftoff.msfc.nasa.gov/2003/05/30.html#item572",
          description: "Sky watchers in Europe, Asia, and parts of Alaska and Canada will experience a &lt;a href=\"http://science.nasa.gov/headlines/y2003/30may_solareclipse.htm\"&gt;partial eclipse of the Sun&lt;/a&gt; on Saturday, May 31st.",
          pubDate: new Date("Fri, 30 May 2003 11:06:42 GMT")
        }, {
          id: "http://liftoff.msfc.nasa.gov/2003/05/27.html#item571",
          title: "The Engine That Does More",
          link: "http://liftoff.msfc.nasa.gov/news/2003/news-VASIMR.asp",
          description: "Before man travels to Mars, NASA hopes to design new engines that will let us fly through the Solar System more quickly.  The proposed VASIMR engine would do that.",
          pubDate: new Date("Tue, 27 May 2003 08:37:32 GMT")
        }, {
          id: "http://liftoff.msfc.nasa.gov/2003/05/20.html#item570",
          title: "Astronauts' Dirty Laundry",
          link: "http://liftoff.msfc.nasa.gov/news/2003/news-laundry.asp",
          description: "Compared to earlier spacecraft, the International Space Station has many luxuries, but laundry facilities are not one of them.  Instead, astronauts have other options.",
          pubDate: new Date("Tue, 20 May 2003 08:56:02 GMT")
        }]
      }
    },
    atom: {
      name: "Atom (1.0)",
      file: "atom-example.xml",
      expected: {
        type: "atom",
        id: "urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6",
        title: "Example Feed",
        link: "http://example.org/feed/",
        description: "A subtitle.",
        updated: new Date("2003-12-13T18:30:02Z"),
        author: "johndoe@example.com",
        items: [{
          id: "urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a",
          title: "Atom-Powered Robots Run Amok",
          link: "http://example.org/2003/12/13/atom03",
          description: "Some text.",
          pubDate: new Date("2003-12-13T18:30:02Z")
        }]
      }
    },
    rdf: {
      name: "RDF test",
      file: "rdf-example.xml",
      expected: {
        type: "rdf",
        id: "",
        title: "craigslist | all community in SF bay area",
        link: "http://sfbay.craigslist.org/ccc/",
        items: [
          {
            title: "Music Equipment Repair and Consignment",
            link: "http://sfbay.craigslist.org/sby/muc/2681301534.html",
            description: "San Jose Rock Shop offers musical instrument repair and consignment! (408) 215-2065<br> <br> We are pleased to announce our NEW LOCATION: 1199 N 5th st. San Jose, ca 95112. Please call ahead, by appointment only.<br> <br> Recently featured by Metro Newspaper in their 2011 Best of the Silicon Valley edition see it online here:<br> <a href=\"http://www.metroactive.com/best-of-silicon-valley/2011/music-nightlife/editor-picks.html\" rel=\"nofollow\">http://www.metroactive.com/best-of-silicon-valley/2011/music-nightlife/editor-picks.html</a><br> <br> Guitar Set up (acoustic and electronic) $40!<!-- END CLTAGS -->"
          },
          {
            title: "Ride Offered - Oakland/BART to LA/SFV - TODAY 3PM 11/04 (oakland north / temescal)",
            link: "http://sfbay.craigslist.org/eby/rid/2685010755.html",
            description: "Im offering a lift for up to two people from Oakland (or near any BART station in the East Bay/580/880 Corridor, or San Jose/Morgan Hill, Gilroy) to the San Fernando Valley / Los Angeles area. Specifically, Im leaving from Oakland between 2:30 and 3:00pm (this is flexible, but if I leave too late my girlfriend will kill me), and heading to Woodland Hills via the 580, I-5, 405, and 101.<!-- END CLTAGS -->"
          }
        ]
      }
    }
  };

  function parse(xml, cb) {
    var handler = new FeedHandler(cb);

    try {
      new htmlparser2.Parser(handler, {xmlMode: true}).parseComplete(xml);
    } catch (ex) {
      cb(ex);
    }
  }

  R.values(tests).forEach(function(test) {
    var xml = fs.readFileSync(path.join(__dirname, 'fixtures', test.file), 'utf-8');

    it(test.name, function(done){
      parse(xml, function(err, data) {
        if (err) return done(err);
        assert.deepEqual(data, test.expected);
        done();
      })
    });
  })
});