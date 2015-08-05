var fs     = require("fs");
var Module = require('module');

var basepath = __dirname+"/../";
var files = fs.readdirSync(basepath);

// Get the symlink mappings
var symLinks = {};
files.forEach(function(filepath) {
  var fullpath = basepath + filepath;
  var stat = fs.lstatSync(fullpath);

  if(stat.isSymbolicLink()) {
    symLinks[filepath] = fullpath;
  }
});

var origRequire = Module.prototype.require;
Module.prototype.require = function(path) {
  for(var base in symLinks) {
    (function(mapDir) {
      var re = new RegExp("^"+base+"\/(.*)");
      if(path.match(re)) {
        path = mapDir+"/"+RegExp.$1;
      }
    })(symLinks[base]);
  }
  return origRequire.call(this, path);
};
