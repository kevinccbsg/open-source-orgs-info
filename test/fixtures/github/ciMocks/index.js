const rascalCi = require('./files/rascalCi.json');
const systemicAwsS3Ci = require('./files/systemicAwsS3Ci.json');
const moodCi = require('./files/moodCi.json');
const rascalPaths = require('./paths/rascalPaths.json');
const systemicAwsS3Paths = require('./paths/systemicAwsS3Paths.json');
const moodPaths = require('./paths/moodPaths.json');

module.exports = {
  files: {
    rascalCi,
    systemicAwsS3Ci,
    moodCi,
  },
  paths: {
    rascalPaths,
    systemicAwsS3Paths,
    moodPaths,
  },
};
