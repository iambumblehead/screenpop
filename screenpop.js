// Filename: screenpop.js
// Timestamp: 2015.04.08-19:26:05 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: elemst.js, domwh.js, lsn.js, lockfn.js
//
//
// +-------------------------------------------------+
// | sp-layers                                       |
// |   +-----------------------------------------+   |
// |   | sp-layers-layer                         |   |
// |   |   +---------------------------------+   |   |
// |   |   | sp-layers-layer-screen          |   |   |
// |   |   +---------------------------------+   |   |
// |   |   +---------------------------------+   |   |
// |   |   | sp-layers-layer-content         |   |   |
// |   |   +---------------------------------+   |   |
// |   |                                         |   |
// |   +-----------------------------------------+   |
// |                                                 |
// +-------------------------------------------------+


var elemst = require('elemst');
var lockfn = require('lockfn');
var domwh = require('domwh');
var lsn = require('lsn');


var screenpop = (function (proto, constructor, deffn) {

  deffn = function (fn) { 
    if (typeof fn === 'function') fn(null, ''); 
  };
  
  proto = {
    count : 0,
    uid : 0,
    hintSize : 20, // number of pixels used to display hint area

    // modules you may want redefined
    throttlefn : lockfnthrottling.getNew({ ms : 500 }),
    elemst : elemst,
    domwh : domwh,
    lsn : lsn,

    onShutHook : deffn,
    onOpenHook : deffn,
    onRenderHook : deffn,

    isOpen : function () {
      return this.getLayerElem() && this.elemst.is(this.getLayerElem(), 'screen-show');
    },

    isShut : function () {
      return !this.isOpen();
    },
    
    onShut : function (fn) {
      this.onShutHook = fn;
      return this;
    },

    onOpen : function (fn) {
      this.onOpenHook = fn;
      return this;
    },

    onRender : function (fn) { 
      this.onRenderHook = fn;
      return this;
    },

    createDiv : function (c, uid) {
      var elem = document.createElement('div');

      if (typeof c === 'string') {
        elem.className = c;
        elem.id = (uid || '') + c;
      }

      return elem;
    },

    connect : function () {
      var that = this;

      that.lsn(document, 'keydown', function (e) {
        if (e && e.keyCode === 27) {
          constructor.shut();
        }
      });

      that.lsn(window, 'resize', function (e) {
        that.throttlefn(function () {
          constructor.center();
        });
      });

      that.lsn(window, 'scroll', function (e) {
        that.throttlefn(function () {
          constructor.centerVert();
        });
      });
    },

    getLoadElemStr : function () {
      return '';
    },

    // was getLayerParent
    getLayersElem : function () {
      var that = this;
      return document.getElementById('sp-layers') || 
        (function (e, d) {
          e = that.createDiv('sp-layers');
          that.container.appendChild(e);
          that.connect();
          return e;
        }());
    },

    createLayerElem : function () {
      var that = this,
          uid = that.uid,
          layerElem = that.createDiv('sp-layers-layer', uid),
          screenElem = that.createDiv('sp-layers-layer-screen', uid),
          contentElem = that.createDiv('sp-layers-layer-content', uid),
          loadElem = that.createDiv('sp-layers-layer-load', uid);          

      loadElem.innerHTML = that.getLoadElemStr();

      layerElem.appendChild(screenElem);
      layerElem.appendChild(loadElem);
      layerElem.appendChild(contentElem);

      layerElem.onclick = function () {
        that.shut();
      };

      return layerElem;
    },

    getLayerElem : function () {
      return document.getElementById(this.uid + 'sp-layers-layer') ||
        this.createLayerElem();
    },
    getContentElem : function () {
      return document.getElementById(this.uid + 'sp-layers-layer-content');
    },
    getLoadElem : function () {
      return document.getElementById(this.uid + 'sp-layers-layer-load');
    },

    getScroll : function () {
      return window.pageYOffset || document.body.scrollTop;
    },
    
    getContentT : function () {
      var contentElem = this.getContentElem(),
          top;

      if (contentElem) {
        top = contentElem.style.margin.match(/^\d*/);
        if (top) {
          top = parseFloat(top[0]);
          top = isNaN(top) ? null : top;
        }
      }

      return top;
    },

    center : function () {
      var that = this,
          contentElem = that.getContentElem(),
          contentWH, windowWH,
          posT, posL;

      if (contentElem) {
        contentWH = that.domwh(contentElem);
        windowWH = that.domwh.window();

        posT = (windowWH[1] - contentWH[1]) / 2;
        posL = (windowWH[0] - contentWH[0]) / 2;

        // restrict top from outside of window
        if (posT < 0) posT = 0;

        contentElem.style.margin = ':tpx :rlpx 0'
          .replace(/:t/, posT + that.getScroll())
          .replace(/:rl/gi, posL);
      }
    },

    centerVert : function () {
      var that = this,
          contentElem = that.getContentElem(),
          contentH, windowH,
          posT, posL, scroll, top, topold;

      if (contentElem) {
        contentH = that.domwh(contentElem)[1];
        windowH = that.domwh.window()[1];
        topold = that.getContentT();
        scroll = that.getScroll();
        posT = (windowH - contentH) / 2;

        if (topold + contentH - that.hintSize <= scroll) {
          // if bottom 'hint' area is not fully visible...
          top = scroll - contentH + that.hintSize;
        } else if (topold >= scroll && posT + scroll < topold) {
          // if top is below top of viewable area &&
          // if top is below the position it would own if 'centered'...
          // if top is not above visible area when centered
          top = (posT > 0) ? posT + scroll : scroll;
        }

        if (typeof top === 'number') {
          contentElem.style.marginTop = ':tpx'.replace(/:t/, top);
        }
      }
    },


    replaceContent : function (o) {
      var contentElem = this.getContentElem();

      if (contentElem) {
        if (typeof o === 'string') {
          contentElem.innerHTML = o;
        } else if (typeof o === 'object' && o && 'tagName' in o) {
          contentElem.appendChild(o);
        }
      }
    },

    pop : function () {
      var that = this,
          layerelem,
          cb = function (e,r) { if (typeof fn === 'function') fn(e,r); };
      
      constructor.shut();
      constructor.screenobjLast = this;

      layerelem = that.getLayerElem();
      that.elemst.up(layerelem, 'screen-load');
      that.getLayersElem().appendChild(layerelem);

      that.onRenderHook(that, function (err, res) {
        if (err) return cb(err);

        that.replaceContent(res);
        that.center();

        that.open();
      });

      return that;
    },

    open : function () {
      var that = this;

      that.center();
      that.elemst.up(that.getLayerElem(), 'screen-show');
      that.onOpenHook(that);
    },

    load : function () {
      var that = this;

      that.center();
      that.elemst.up(that.getLayerElem(), 'screen-load');
    },

    shut : function () {
      var that = this;

      that.elemst.up(that.getLayerElem(), 'screen-hide');
      that.onShutHook(that);
    },

    rm : function () {
      var layerElem = this.getLayerElem();

      if (layerElem) {
        layerElem.parentNode.removeChild(layerElem);
      }
    },

    clear : function () {
      this.replaceContent('');
    }
  };

  constructor = function (opts) {
    var that = Object.create(proto);

    that.uid = (opts && opts.uid) ? opts.uid : ++proto.count;    
    that.onShutHook = deffn;
    that.onOpenHook = deffn;
    that.onRenderHook = deffn;
    that.container = document.body;

    if (opts) {
      if (typeof opts.hintSize === 'number') {
        that.hintSize = opts.hintSize;
      }

      if (typeof opts.loadElemStr === 'string') {
        that.getLoadElemStr = function () {
          return opts.loadElemStr;
        };
      }
    }

    return that;
  };

  constructor.proto = proto;
  constructor.screenobjLast = null;
  constructor.shut = function () {
    var sol = this.screenobjLast;
    if (sol) sol.shut();
  };

  constructor.rm = function () {
    var sol = this.screenobjLast;
    if (sol) sol.rm();
  };

  constructor.center = function () {
    var sol = this.screenobjLast;
    if (sol) sol.center();
  };

  constructor.centerVert = function () {
    var sol = this.screenobjLast;
    if (sol) sol.centerVert();
  };

  return constructor;

}());
