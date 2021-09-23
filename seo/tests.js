const assert = require('assert')
const {CrawlWebsiteFor404} = require('./api')

/**
 * Test to check that the 404 Finder is working
 */
describe('CrawlWebsiteFor404', function() {
    describe('number of results', function() {
        it('1 error if the root is invalid', async function() {
            let r = CrawlWebsiteFor404(
                'https://idonotexist.error/'
            );
            r = await r;
            assert.equal(r.length, 1);
        });
        it('0 errors if the root is valid', async function() {
            let r = CrawlWebsiteFor404(
                'https://duckduckgo.com/',
                1
            );
            r = await r;
            assert.equal(r.length, 0);
        });
    });
    describe('check the value', function() {
        it('assert than the invalid link is the right one', async function() {
            let URL = 'https://idonotexist.error/';
            let r = CrawlWebsiteFor404(URL);
            r = await r;
            assert.deepStrictEqual(r, [URL]);
        });
    });
});