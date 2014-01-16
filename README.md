screenpop
=========
**(c)[Bumblehead][0], 2014** [MIT-license](#license)  


### Overview:

A simple and customizable popup.

`screenpop` **does** allow you to...
  - customize popup behaviour through hooks (_onRender, onLoad, onShut_)
  - render strings or elements (including iframes) to a popup
  - easily override default [BEM][1] styles with your own
  - keep a rendered popup centered

`screenpop` **does not** use a popular library like jQuery to interface with the DOM. Instead, it uses purpose-built modules I've made -[elemst][2], [lockfn][3], [domwh][4], [lsn][5]. With the modules its minified size is ~7.2kb. Without the modules, its minified size is ~3.5kb. Modules are isolated on public screenpop methods and may be redefined with methods using jQuery or any library. 

`screenpop` **does not** add or include structural elements, such as titles, footer links or close buttons. Write a wrapper for constructing a themed screenpop for repeated titles or buttons.

A sample themed `screenpop` is included in the tests:

 ![themed-layer][6] 

As shown above, methods on `screenpop` can keep a popup visible when the document is scrolled. The screenpop above is called with a `hintSize` of `20` pixels and when the document is scrolled down, 20 pixels of the popup are kept visible:

 ```javascript
 screenpop({
     hintSize : 20
 }).onRender(function (screen, fn) {
     fn(null, '' + 
         '<div class="pop">' +
         '  <div class="pop-header">' +
         '    <h2 class="pop-header-title">title</h2>' +
         '    <a id="CloseLink" class="pop-header-close">' +
         '      <span class="pop-header-close-sprite"></span>' +
         '    </a>' +
         '  </div>' +
         '  <div class="pop-content">' +
         '    <p>some popup content</p>' +
         '  </div>' +
         '</div>');
     }).onOpen(function (screen) {
         var close = document.getElementById('CloseLink');
         if (close) {
             close.onclick = function () {
             screen.shut();
         };
     }
 }).pop();
 ```

I'm proud to say that Ties.com have been using a variant of this popup script for a few years -click on the 'Dressing Room' link in one of their [product pages][7] to see it.


[0]: http://www.bumblehead.com                            "bumblehead"
[1]: http://bem.info                                             "bem"
[2]: https://github.com/iambumblehead/elemst                  "elemst"
[3]: https://github.com/iambumblehead/lockfn                  "lockfn"
[4]: https://github.com/iambumblehead/domwh                    "domwh"
[5]: https://github.com/iambumblehead/lsn                        "lsn"
[6]: https://github.com/iambumblehead/screenpop/raw/master/img/screenpop-screen-themed.png
[7]: http://ties.com/v/a/the-american-necktie-co-harvard-navy-blue-tie


---------------------------------------------------------
#### <a id="elements"></a>elements, styles:

 To ensure visibility, popups are rendered to a 'container' element (.sp-layers) at the bottom of the document, just before the closing `</body>`tag. The container holds a 'layer' element (.sp-layers-layer) for each popup.

 ![elements][10] 
 
 'container', 'layer' and 'load' elements are created only when a popup renders. If removed, they are created for the next popup rendered. A layer is created for each new popup.

[10]: https://github.com/iambumblehead/screenpop/raw/master/img/screenpop-screen.png


---------------------------------------------------------
#### <a id="centering"></a>centering:

 screenpop attaches throttled listeners to window resize and document scroll. On resize, an 'open' popup  is centered. On scroll, an 'open' popup is vertically translated to remain visible on screen.

 - if popup is vertically centered and too tall to fit viewport, top of popup is aligned with top of viewport. scroll down to see rest of popup.

 - if popup bottom or top is scrolled out of viewport, popup is translated up or down to maintain visibility


---------------------------------------------------------
#### <a id="loading"></a>loading: 

'Loading' can pose a UX problem for a popup. When a user clicks to open, visual feedback may be desired if content is generated during a wait process...

Scenarious to avoid:
 - loading gif appears for a split second before removal when content is ready quickly.
 - popup appears with loading gif before content generation -when content is added, size and position of popup are updated (klunky).

`screenpop` uses the same solution for quick and slow render popups. The popup appears fully formed at once and any loading indicator slowly fades away. The loading indicator is an html/css visualization above the darkened screen to be positioned where needed, preferably uncovered by the appearing popup.

Each `screenpop` may have its own loading indicator or the prototype may be redefined with a loading indicator for all popups.

`screenpop` tests use this for the loading indicator:

```javascript
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
```


---------------------------------------------------------
#### <a id="methods"></a>methods:

 * **screenpop**
 
 Two properties are useful for the screenpop constructor. Default values are `20` and `''`.
 
 ```javascript
 beast({
     hintSize : 20, // number of pixels used to display hint area
     loadElemStr : '' // string formatted html for loading indicator
 })
 ```
 
 * **screenpop.screenobjLast**
 
 A reference to the last popup rendered by screenpop

 * **screenpop.center( )**
 
 Centers any 'open' popup
 
 * **screenpop.centerVert( )**
 
 Vertically centers any 'open' popup 
 
 * **screenpop.shut( )**
 
 Shuts any 'open' popup  

 * **screenpop.rm( )**
 
 Removes the popup reference by `screenpop.screenobjLast` from the document
 
 * **screenpop.proto**
 
 proto is not a method but a property defined on the screenpop namespace. the prototype is used to construct screenpop objects. proto may be accessed to redefine its default properties.

 Important methods on screenpop objects are listed below
 
 * **screenpop.proto.onRender( _fn_ )** 

 The given function is called when the popup is rendered.
 
 * **screenpop.proto.onShut( _fn_ )** 

 The given function is called when the popup is shut. 
 
 * **screenpop.proto.onOpen( _fn_ )** 

 The given function is called when the popup is open. Useful for modifiying behaviour or adding events to the popup once it is rendered.
 
 * **screenpop.proto.onRender( _fn_ )** 

 The given function is given a callback to be called with an error as the first parameter or content as the second parameter.   

 ```javascript
 screenpop().onRender(function (screen, fn) {
     fn(null, 'some-content');
 }).pop();
 ```
 
 * **screenpop.proto.getLoadElemStr( )** 
 
 Returns the string HTML to used for the loading indicator.

 * **screenpop.proto.getLayerElem( )** 

 Returns the layer element parenting the 'screen', 'load' and 'content' elements of the popup.

 * **screenpop.proto.getContentElem( )** 

 Returns the content element of the popup.
 
 * **screenpop.proto.getLoadElem( )** 

 Returns the load element of the popup. 
 
 * **screenpop.proto.center( )** 

 Centers the popup.  
 
 * **screenpop.proto.centerVert( )** 

 Vertically centers the popup.   

 * **screenpop.proto.replaceContent( _str or element_ )** 

 Uses innerHTML or appendChild to add given content to the popup.

 * **screenpop.proto.pop( )**  
 
 Generates markup for the popup, obtains content for the popup using `screenPop.onRender`, updates classNames on the popup to make it visible and then calls `screenPop.onOpen`.

 * **screenpop.proto.open( )**  
 
 Updates classNames on the popup to make it visble.
 
 * **screenpop.proto.load( )**  
 
 Updates classNames on the popup to make loading indicator visible.
 
 * **screenpop.proto.shut( )**  
 
 Updates classNames on the popup to hide it. 
 
 * **screenpop.proto.rm( )**  
 
 Removes the popup from the document.  


---------------------------------------------------------
#### <a id="install"></a>Install:

`screenpop` may be downloaded directly or installed through `npm`.

 * **npm**   

 ```bash
 $ npm install screenpop
 ```

 * **Direct Download**
 
 ```bash  
 $ git clone https://github.com/iambumblehead/screenpop.git
 $ cd screenpop && npm install
 ```

`screenpop` is meant to be npm-installed and deployed with [scroungejs][22]. Alternatively, this repository contains two ready-to-use files, [screenpop.min.js][23] and [screenpop.unmin.js][24].

Run npm start to build a sample screenpop page and to see a themed screenpop.

[22]: https://github.com/iambumblehead/scroungejs
[23]: http://github.com/iambumblehead/beast/raw/master/screenpop.min.js
[24]: http://github.com/iambumblehead/beast/raw/master/screenpop.unmin.js

---------------------------------------------------------
#### <a id="test"></a>Test:

Tests are not automated and are performed by loading a document in the browser and using the browser console.

1. build test files

   `npm start`
   
2. load `test/index.html` in your browser and run tests from the console



---------------------------------------------------------
#### <a id="license">License:

 ![scrounge](http://github.com/iambumblehead/scroungejs/raw/master/img/hand.png) 

(The MIT License)

Copyright (c) 2013 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
