var scroungejs = require('scroungejs'),
    startutils = require('./startutil');

startutils.createFileIfNotExist({
  pathSrc : './test/indexSrc.html',
  pathFin : './test/index.html'
}, function (err, res) {
  if (err) return console.log(err);

 var scroungeTestOpts,
      scroungeMinOpts,
      scroungeUnminOpts;

  scroungeTestOpts = {
    inputPath : [
      './test/testbuildSrc',
      './node_modules',
      './screenpop.js'
    ],
    outputPath : './test/testbuildFin', 
    isRecursive : true,
    isSourcePathUnique : true,
    isCompressed : true,
    isConcatenated : true,
    basepage : './test/index.html'
  };

  scroungeMinOpts = Object.create(scroungeTestOpts);
  scroungeMinOpts.basepage = '';
  scroungeMinOpts.trees = ["screenpop.full.js"];
  scroungeMinOpts.outputPath = './screenpop.min.js';
  scroungeMinOpts.isCompressed = true;
  scroungeMinOpts.isConcatenated = true;
  scroungeMinOpts.isLines = false;

  scroungeUnminOpts = Object.create(scroungeTestOpts);
  scroungeUnminOpts.basepage = '';
  scroungeUnminOpts.trees = ["screenpop.full.js"];
  scroungeUnminOpts.outputPath = './screenpop.unmin.js';
  scroungeUnminOpts.isCompressed = false;
  scroungeUnminOpts.isConcatenated = true;

  scroungejs.build(scroungeTestOpts, function (err, res) {
    if (err) return console.log(err);

    // build a minified version
    scroungejs.build(scroungeMinOpts, function (err, res) {
      if (err) return console.log(err);

      // build a minified version
      scroungejs.build(scroungeUnminOpts, function (err, res) {
        if (err) return console.log(err);
        console.log('done');
      });
    });
  });

});
