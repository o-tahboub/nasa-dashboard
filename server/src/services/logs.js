const path = require('path');
const { createWriteStream } = require('fs');

function getLogName(date) {
  return new Intl.DateTimeFormat("en-UK").format(date).replaceAll('/', '-');
}

function getLogPath() {
  return path.join(__dirname, '../', '../', 'logs', getLogName());
}

let logStream = createWriteStream(getLogPath(), { flags: 'a' });

module.exports = {
  logStream
}
