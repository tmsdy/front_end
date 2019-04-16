const path = require('path');
const cwd = process.cwd();
const staticSrc = path.join(cwd, 'src');

module.exports = {
  alias: {
    'Common': path.join(staticSrc, 'common'),
    'Components': path.join(staticSrc, 'components'),
    'Less': path.join(staticSrc, 'less'),
    'Res': path.join(staticSrc, 'res'),
    'Assets': path.join(staticSrc, 'assets'),
  },
  extensions: ['.js', '.json', '.less'],
}
