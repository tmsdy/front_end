const path = require('path');
const cwd = process.cwd();
const staticSrc = path.join(cwd, 'src');

module.exports = {
  alias: {
    '@': staticSrc ,
    'Common': path.join(staticSrc, 'common'),
    'Components': path.join(staticSrc, 'components'),
  },
  extensions: ['.js', '.json', '.less'],
}
