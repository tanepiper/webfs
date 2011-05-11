// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('../common');
var assert = require('assert');
var fs = require('fs');
var join = require('path').join;

var filename = join(common.fixturesDir, 'test.txt');

common.error('writing to ' + filename);

var s = 'åè¶å½æ¯å203å¹´è³å111å¹´å­å¨äºå²­åå°åºçä¸ä¸ªå½å®¶ï¼å½é½ä½äºçªç¦ºï¼çååæ¬ä»å¤©ä¸­å½çå¹¿ä¸ã' +
        'å¹¿è¥¿ä¸¤çåºçå¤§é¨ä»½å°åºï¼ç¦å»ºçãæ¹åãè´µå·ãäºåçä¸å°é¨ä»½å°åºåè¶åçåé¨ã' +
        'åè¶å½æ¯ç§¦æç­äº¡åï¼ç±åæµ·é¡å°èµµä½äºå203å¹´èµ·åµå¼å¹¶æ¡æé¡åè±¡é¡åå»ºç«ã' +
        'å196å¹´åå179å¹´ï¼åè¶å½æ¾ååä¸¤æ¬¡åä¹ä¸è£å±äºè¥¿æ±ï¼æä¸ºè¥¿æ±çâå¤è£âãå112å¹´ï¼' +
        'åè¶å½æ«ä»£åä¸»èµµå»ºå¾·ä¸è¥¿æ±åçæäºï¼è¢«æ±æ­¦å¸äºå111å¹´æç­ãåè¶å½å±å­å¨93å¹´ï¼' +
        'åç»äºä»£åä¸»ãåè¶å½æ¯å²­åå°åºçç¬¬ä¸ä¸ªæè®°è½½çæ¿æå½å®¶ï¼éç¨å°å»ºå¶åé¡å¿å¶å¹¶å­çå¶åº¦ï¼' +
        'å®çå»ºç«ä¿è¯äºç§¦æ«ä¹±ä¸å²­åå°åºç¤¾ä¼ç§©åºçç¨³å®ï¼ææçæ¹åäºå²­åå°åºè½åçæ¿æ²»ã##æµç°ç¶ã\n';

var ncallbacks = 0;

fs.writeFile(filename, s, function(e) {
  if (e) throw e;

  ncallbacks++;
  common.error('file written');

  fs.readFile(filename, function(e, buffer) {
    if (e) throw e;
    common.error('file read');
    ncallbacks++;
    assert.equal(Buffer.byteLength(s), buffer.length);
  });
});

// test that writeFile accepts buffers
var filename2 = join(common.fixturesDir, 'test2.txt');
var buf = new Buffer(s, 'utf8');
common.error('writing to ' + filename2);

fs.writeFile(filename2, buf, function(e) {
  if (e) throw e;

  ncallbacks++;
  common.error('file2 written');

  fs.readFile(filename2, function(e, buffer) {
    if (e) throw e;
    common.error('file2 read');
    ncallbacks++;
    assert.equal(buf.length, buffer.length);
  });
});


process.addListener('exit', function() {
  common.error('done');
  assert.equal(4, ncallbacks);

  fs.unlinkSync(filename);
  fs.unlinkSync(filename2);
});
