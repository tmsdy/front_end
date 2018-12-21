
import Vue from 'vue'
import capitalize from '../lodash-master/capitalize.js';
import deburr from '../lodash-master/deburr.js';
import endsWith from '../lodash-master/endsWith.js';
import escape from '../lodash-master/escape.js';
import escapeRegExp from '../lodash-master/escapeRegExp.js';
import kebabCase from '../lodash-master/kebabCase.js';
import lowerFirst from '../lodash-master/lowerFirst.js';
import pad from '../lodash-master/pad.js';
import padEnd from '../lodash-master/padEnd.js';
import repeat from '../lodash-master/repeat.js';
import replace from '../lodash-master/replace.js';
import split from '../lodash-master/split.js';
import trim from '../lodash-master/trim.js';
import words from '../lodash-master/words.js';

new Vue({
  el: '#app' ,
  template: `<div>555</div>` ,
  created(){
    console.log(capitalize('FRED')) // Fred
    console.log(deburr('déjà vu')) //deja vu
    console.log(endsWith('abc', 'c'),endsWith('abc', 'b')) //true false startsWith同理
    console.log(escape('fred, barney, & pebbles')) //'fred, barney, &amp; pebbles' unescape反着来的
    console.log(escapeRegExp('[lodash](https://lodash.com/)')) // '\[lodash\]\(https://lodash\.com/\)'
    console.log(kebabCase('Foo Bar'),kebabCase('fooBar')) // 'foo-bar' 'foo-bar' 'foo-bar'
    console.log(lowerFirst('Fred'),lowerFirst('FRED')) //fred fRED upperFirst同理
    console.log(pad('abc', 8),pad('abc', 8, '_-'),pad('abc', 3))//'  abc   ' '_-abc_-_' 'abc'
    console.log(padEnd('abc', 6),padEnd('abc', 6, '_-'),padEnd('abc', 3))// 'abc   ' 'abc_-_' 'abc' padStart同理
    console.log(repeat('*', 3),repeat('abc', 2),repeat('abc', 0)) //'***' 'abcabc' ''
    console.log(replace('Hi Fred', 'Fred', 'Barney')) //'Hi Barney'
    console.log(split('a-b-c', '-', 2)) // ["a", "b"]
    console.log(trim('  abc  '),trim('-_-abc-_-', '_-')) //abc abc trimEnd,trimStart自己体会
    console.log(words('fred, barney, & pebbles', /[^, ]+/g)) //["fred", "barney", "&", "pebbles"]
  },
  methods:{
    
  }
})

