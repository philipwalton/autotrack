var assert = require('assert');


var browserCaps;
var baseUrl = browser.options.baseUrl;


describe('urlTracker', function() {

  before(function *() {
    browserCaps = (yield browser.session()).value;
  });


  it('should capture URL changes via pushState and popstate', function *() {

    if (notSupportedInBrowser()) return;

    var fooUrl = (yield browser
        .url('/test/url-change-tracker.html')
        .click('#foo')
        .url())
        .value;

    assert.equal(fooUrl, baseUrl + '/test/foo.html');

    var barUrl = (yield browser
        .click('#bar')
        .url())
        .value;

    assert.equal(barUrl, baseUrl + '/test/bar.html');

    var quxUrl = (yield browser
        .click('#qux')
        .url())
        .value;

    assert.equal(quxUrl, baseUrl + '/test/qux.html');

    var back1Url = (yield browser
        .back()
        .url())
        .value;

    assert.equal(back1Url, baseUrl + '/test/bar.html');

    var back2Url = (yield browser
        .back()
        .url())
        .value;

    assert.equal(back2Url, baseUrl + '/test/foo.html');

    var back3Url = (yield browser
        .back()
        .url())
        .value;

    assert.equal(back3Url, baseUrl + '/test/url-change-tracker.html');

    var hitData = (yield browser
        .execute(getPageData))
        .value;

    assert.equal(hitData[0].page, '/test/foo.html');
    assert.equal(hitData[0].title, 'Foo');
    assert.equal(hitData[1].page, '/test/bar.html');
    assert.equal(hitData[1].title, 'Bar');
    assert.equal(hitData[2].page, '/test/qux.html');
    assert.equal(hitData[2].title, 'Qux');
    assert.equal(hitData[3].page, '/test/bar.html');
    assert.equal(hitData[3].title, 'Bar');
    assert.equal(hitData[4].page, '/test/foo.html');
    assert.equal(hitData[4].title, 'Foo');
    assert.equal(hitData[5].page, '/test/url-change-tracker.html');
    assert.equal(hitData[5].title, 'Home');
  });


  it('should not capture hash changes', function *() {

    if (notSupportedInBrowser()) return;

    var url = (yield browser
        .url('/test/url-change-tracker.html')
        .click('#hash')
        .url())
        .value;

    assert.equal(url, baseUrl + '/test/url-change-tracker.html#hash');

    var backUrl = (yield browser
        .back()
        .url())
        .value;

    assert.equal(backUrl, baseUrl + '/test/url-change-tracker.html');

    var hitData = (yield browser
        .execute(getPageData))
        .value;

    assert.equal(hitData.count, 0);
  });

  it('should support customizing what is considered a change', function *() {

    if (notSupportedInBrowser()) return;

    var fooUrl = (yield browser
        .url('/test/url-change-tracker-conditional.html')
        .click('#foo')
        .url())
        .value;

    assert.equal(fooUrl, baseUrl + '/test/foo.html');

    var backUrl = (yield browser
       .back()
       .url())
       .value;

    assert.equal(backUrl, baseUrl +
                          '/test/url-change-tracker-conditional.html');

    var hitData = (yield browser
       .execute(getPageData))
       .value;

    assert.equal(hitData.count, 0);
  });
});


function getPageData() {
  return hitData;
}


function isIE9() {
  return browserCaps.browserName == 'internet explorer' &&
         browserCaps.version == '9';
}


function notSupportedInBrowser() {
  // IE9 doesn't support the HTML5 History API.
  return isIE9();
}