// Filename: screenpop-test.js  
// Timestamp: 2014.01.15-00:00:02 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: screenpop.js

var screenpoptest = (function() {

  return {
    init : function () {

      var link1Elem = document.getElementById('Link1');
      var link2Elem = document.getElementById('Link2');
      var link4Elem = document.getElementById('Link4');

      screenpop.proto.getLoadElemStr = function () {
        return '' +
          '<div class="loading-container">' +          
          '  <div class="loading">' +
          '    <span class="b"></span><span class="b"></span><span class="b"></span><span class="b"></span><span class="b"></span><br/>' +
          '    <span class="b"></span><span class="t"></span><span class="t"></span><span class="t"></span><span class="t"></span><br/>' +
          '    <span class="b"></span><span class="t"></span><span class="t"></span><span class="r"></span><span class="b"></span><br/>' +
          '    <span class="b"></span><span class="t"></span><span class="t"></span><span class="t"></span><span class="b"></span><br/>' +
          '    <span class="b"></span><span class="b"></span><span class="b"></span><span class="b"></span><span class="b"></span>' +
          '  </div>' +
          '</div>';
      };

      link1Elem.onclick = function () {
        screenpop().onRender(function (screen, fn) {
          fn(null, 'some-content');
        }).onLoad(function () {

        }).pop();
      };

      link2Elem.onclick = function () {
        screenpop().onRender(function (screen, fn) {
          var iframeElem;

          iframeElem = document.createElement('IFRAME');
          iframeElem.id = 'iframe';
          iframeElem.onload = function () {
            console.log('screen2', screen);
            screen.center();
          };
          iframeElem.frameBorder = 'no';
          iframeElem.setAttribute('width', 200);
          iframeElem.setAttribute('height', 200);
          iframeElem.setAttribute('src', 'http://www.cryptogon.com');
          iframeElem.setAttribute('frameborder', '0');
          iframeElem.setAttribute('border', '0');
          iframeElem.scrolling = 'no';

          fn(null, iframeElem);
        }).onLoad(function (screen) {

        }).onShut(function (screen) {
          screen.clear();
        }).pop();
      };

      link4Elem.onclick = function () {
        var uid = Date.now();

        screenpop().onRender(function (screen, fn) {
          fn(null, '' + 
             '<div class="pop">' +
             '  <div class="pop-header">' +
             '    <h2 class="pop-header-title">title</h2>' +
             '    <a id="' + uid + 'CloseLink" class="pop-header-close">' +
             '      <span class="pop-header-close-sprite"></span>' +
             '    </a>' +
             '  </div>' +
             '  <div class="pop-content">' +
             '    <p>some popup content</p>' +
             '  </div>' +
             '</div>');
        }).onOpen(function (screen) {
          var close = document.getElementById(uid + 'CloseLink');
          if (close) {
            close.onclick = function () {
              screen.shut();
            };
          }
        }).pop();
      };
    }
  };

}());
