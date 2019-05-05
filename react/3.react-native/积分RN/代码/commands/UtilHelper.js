/**
 * 通用工具集
 * Created by xushichao on 2017/7/19.
 */
const fs = require('fs'),
  path = require('path'),
  glob = require('glob'),
  cp = require('child_process'),
  iconv = require('iconv-lite');

let Log = {
  print(msg, color, needHighlight) {
    let colorMap = {'black': 30, 'red': 31, 'green': 32, 'yellow': 33, 'blue': 34, 'purple': 35, 'cyan': 36, 'white': 37};
    if(color && colorMap[color]) {
      msg = '\033[' + colorMap[color] + (needHighlight ? ';1' : '') + 'm' + msg + '\033[0m';
    }
    process.stdout.write(msg);
  },
  println(msg, color, needHighlight) { // 打印整行信息
    Log.print(msg, color, needHighlight);
    Log.print('\r\n');
  },
  verbose(msg) { // 可有可无的信息
    Log.println(msg, 'blue', true);
  },
  tip(msg) { // 弱度提示信息, 用于中间步骤的提示
    Log.println(msg, 'cyan', true);
  },
  info(msg) { // 强度提示信息, 用于总结提示
    Log.println(msg, 'purple', true);
  },
  warn(msg) {
    Log.println(msg, 'yellow', true);
  },
  error(msg) {
    Log.println(msg, 'red', true);
  },
};

let Command = {
  isWindows: (process.platform === 'win32'),
  shell: null,

  exec(commands, options = {}) {
    return new Promise((resolve, reject) => {
      let command = commands.map(item => ['echo', 'echo ==\\> ' + (this.isWindows ? item : item.replace(/\*/g, '\\*')), item].join('&&')).join('&&');
      if (this.isWindows) {
        // covert linux commands to windows
        command = command
          .replace(/\//g, '\\')
          .replace(/echo&&/g, 'echo.&&')
          .replace(/==\\>/g, '==^>')
          .replace(/\brm -fr (.+?)(&&|$)/g, (matchedStr, $1, $2) => {
            let operator = 'del';
            try {
              let stat = fs.statSync($1);
              if(stat.isDirectory()) {
                operator = 'rmdir';
              }
              return `${operator} /s /q ${$1}${$2}`;
            } catch(e) {}
            return '';
          })
          .replace(/\bmkdir -p\b/g, 'mkdir')
          .replace(/\bcp -v\b/g, 'xcopy /F /Y');
        this.shell = cp.spawn('cmd.exe', ['/c', command]);
      } else {
        this.shell = cp.spawn('sh', ['-c', command]);
      }

      this.shell.stdout.on('data', (buf) => {
        let msg = this.isWindows ? iconv.decode(buf, 'gbk') : buf.toString();
        if(~msg.indexOf('==>')) {
          Log.print(msg, 'blue');
        } else {
          Log.print(msg);
        }
      });
      this.shell.stderr.on('data', (buf) => {
        let msg = this.isWindows ? iconv.decode(buf, 'gbk') : buf.toString();
        Log.print(msg, 'red');
      });
      this.shell.on('close', (code) => {
        if(code === 1 && !options.ignoreError) {
          reject('last shell command throw error');
        } else {
          resolve(code);
        }
      });
    });
  },
};

let Util = {
  formatTime(timestamp) {
    return ~~(timestamp / 1000 / 60) + '分' + ~~(timestamp / 1000 % 60) + '秒';
  },

  formatDate(date, formatStr) {
    let format = datePart => match => (`0${datePart}`).substr(-1 * (match.length > 1 ? match.length : String(datePart).length)),
      weekMap = ['日', '一', '二', '三', '四', '五', '六'];
    date = isNaN(date) ? date : new Date(date); // 兼容时间戳
    return formatStr.replace(/(YY){1,2}/, format(date.getFullYear()))
      .replace(/M{1,2}/, format(date.getMonth() + 1))
      .replace(/D{1,2}/, format(date.getDate()))
      .replace(/h{1,2}/, format(date.getHours()))
      .replace(/m{1,2}/, format(date.getMinutes()))
      .replace(/s{1,2}/, format(date.getSeconds()))
      .replace(/W/, weekMap[date.getDay()]); // 周
  },

  /**
   * 计算指定路径占用的磁盘尺寸
   * 用例:
   *     Util.du('./libs/')  // 目录本身的size
   *     Util.du('./libs/**') // 目录及其下所有文件和目录的size
   *     Util.du('./libs/**', {nodir: true})  // 目录下所有文件的size
   *     Util.du('./libs/**\/util*', {nodir: true}) // 目录下所有util开头文件的size
   *     Util.du(['util*', 'test/util*'], {nodir: true, cwd: './libs'}) // 匹配多个pattern
   * @param  {String|Array} pattern 待匹配路径(glob pattern)
   * @param  {Object} options glob的配置项
   * @return {Object}         {totalSize: 0, files: [{path: '', size: 0}]}
   */
  du(pattern, options) {
    options = options || {};

    let totalSize = 0,
      result = [], stat;
    glob.sync(pattern, options).forEach((f) => {
      f = path.join(options.cwd || '', f); // 兼容传入基准路径(cwd)的情况
      stat = fs.statSync(f);
      result.push({
        path: f,
        size: stat.size
      });
      totalSize += stat.size;
    });
    return {totalSize: totalSize, files: result};
  },

  /**
   * 给数值加上千位逗号分隔符
   * 用例:
   *    Util.numberWithCommas(1234567) // return: "1,234,567"
   *    Util.numberWithCommas(1234567.89) // return: "1,234,567.89"
   * @param number {Number}
   * @returns {string}
   */
  numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

module.exports = {Log, Command, Util};
