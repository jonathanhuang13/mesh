const path = require('path');
const rimraf = require('rimraf');

function deleteSourceMaps() {
  rimraf.sync(path.join(__dirname, '../../app/dist/*.js.map'));
  rimraf.sync(path.join(__dirname, '../../app/*.js.map'));
}

module.exports.DeleteSourceMaps = deleteSourceMaps;
