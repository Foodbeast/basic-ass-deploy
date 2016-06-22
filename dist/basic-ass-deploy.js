#! /usr/bin/env node 


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new Promise(function (resolve, reject) {
  if (_fs2.default.existsSync('../../bad.json')) {
    _fs2.default.readFile('../../bad.json', 'utf8', function (err, config) {
      if (err) throw err;

      config = JSON.parse(config);

      resolve({
        host: config.ssh.host,
        username: config.ssh.username,
        privateKey: config.ssh.privateKey,
        processManager: config.stack.processManager,
        appName: config.stack.appName,
        directory: config.stack.directory,
        repo: config.code.repo,
        branch: config.code.branch
      });
    });
  } else {
    reject('Deployment must be run from a valid project folder.');
  }
});

},{"babel-polyfill":13,"fs":undefined}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  return new Promise(function (resolve, reject) {

    console.log('Starting Deployment...');

    var ssh = new _sshPromise2.default({
      host: config.host,
      username: config.username,
      privateKey: _fs2.default.readFileSync(config.privateKey.replace('~', process.env.HOME))
    });

    resolve({
      ssh: ssh,
      config: config
    });
  });
};

require('babel-polyfill');

var _sshPromise = require('ssh-promise');

var _sshPromise2 = _interopRequireDefault(_sshPromise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./logger":4,"babel-polyfill":13,"fs":undefined,"ssh-promise":324}],3:[function(require,module,exports){
'use strict';

require('babel-polyfill');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _confirmSimple = require('confirm-simple');

var _confirmSimple2 = _interopRequireDefault(_confirmSimple);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _deploy = require('./deploy');

var _deploy2 = _interopRequireDefault(_deploy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _confirmSimple2.default)('Are you sure you want to deploy `' + _config2.default.branch + '` to ' + _config2.default.host + '?', ['yes', 'no'], function (ok) {
  if (ok) {

    console.log('Loading config...');

    _config2.default.then(_deploy2.default).then(function (result) {
      var ssh = result.ssh;
      var config = result.config;


      ssh.exec('( cd ' + config.directory + ' ; git clean -f ; git pull origin ' + config.branch + ' ; export NODE_ENV=production ; ' + config.processManager + ' restart ' + config.appName + ')').then(function () {
        console.log(_chalk2.default.white.bgCyan('++++++++++++++++++++++++++++'));
        console.log(_chalk2.default.white.bgBlue('                            '));
        console.log(_chalk2.default.white.bgBlue('    ' + config.branch + ' has been deployed!    '));
        console.log(_chalk2.default.white.bgBlue('                            '));
        console.log(_chalk2.default.white.bgCyan('++++++++++++++++++++++++++++'));
        process.exit(1);
      }).catch(function (err) {
        throw err;
      }).done();
    }).catch(function (err) {
      console.log(_chalk2.default.white.bgRed(err));
      process.exit(1);
    });
  } else {
    console.log(_chalk2.default.white.bgRed('Cancelling deployment. '));
    process.exit(1);
  }
});

},{"./config":1,"./deploy":2,"babel-polyfill":13,"chalk":14,"confirm-simple":16,"fs":undefined}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function _default() {
  return {
    info: function info(_info) {
      console.log(_info);
    },
    error: function error(err) {
      console.log(err);
    }
  };
}
exports.default = _default;

},{}],5:[function(require,module,exports){
'use strict';
module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
};

},{}],6:[function(require,module,exports){
'use strict';

function assembleStyles () {
	var styles = {
		modifiers: {
			reset: [0, 0],
			bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		colors: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39]
		},
		bgColors: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49]
		}
	};

	// fix humans
	styles.colors.grey = styles.colors.gray;

	Object.keys(styles).forEach(function (groupName) {
		var group = styles[groupName];

		Object.keys(group).forEach(function (styleName) {
			var style = group[styleName];

			styles[styleName] = group[styleName] = {
				open: '\u001b[' + style[0] + 'm',
				close: '\u001b[' + style[1] + 'm'
			};
		});

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	});

	return styles;
}

Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});

},{}],7:[function(require,module,exports){
// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


module.exports = {

  newInvalidAsn1Error: function(msg) {
    var e = new Error();
    e.name = 'InvalidAsn1Error';
    e.message = msg || '';
    return e;
  }

};

},{}],8:[function(require,module,exports){
// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var errors = require('./errors');
var types = require('./types');

var Reader = require('./reader');
var Writer = require('./writer');


///--- Exports

module.exports = {

  Reader: Reader,

  Writer: Writer

};

for (var t in types) {
  if (types.hasOwnProperty(t))
    module.exports[t] = types[t];
}
for (var e in errors) {
  if (errors.hasOwnProperty(e))
    module.exports[e] = errors[e];
}

},{"./errors":7,"./reader":9,"./types":10,"./writer":11}],9:[function(require,module,exports){
// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var assert = require('assert');

var ASN1 = require('./types');
var errors = require('./errors');


///--- Globals

var newInvalidAsn1Error = errors.newInvalidAsn1Error;



///--- API

function Reader(data) {
  if (!data || !Buffer.isBuffer(data))
    throw new TypeError('data must be a node Buffer');

  this._buf = data;
  this._size = data.length;

  // These hold the "current" state
  this._len = 0;
  this._offset = 0;
}

Object.defineProperty(Reader.prototype, 'length', {
  enumerable: true,
  get: function () { return (this._len); }
});

Object.defineProperty(Reader.prototype, 'offset', {
  enumerable: true,
  get: function () { return (this._offset); }
});

Object.defineProperty(Reader.prototype, 'remain', {
  get: function () { return (this._size - this._offset); }
});

Object.defineProperty(Reader.prototype, 'buffer', {
  get: function () { return (this._buf.slice(this._offset)); }
});


/**
 * Reads a single byte and advances offset; you can pass in `true` to make this
 * a "peek" operation (i.e., get the byte, but don't advance the offset).
 *
 * @param {Boolean} peek true means don't move offset.
 * @return {Number} the next byte, null if not enough data.
 */
Reader.prototype.readByte = function(peek) {
  if (this._size - this._offset < 1)
    return null;

  var b = this._buf[this._offset] & 0xff;

  if (!peek)
    this._offset += 1;

  return b;
};


Reader.prototype.peek = function() {
  return this.readByte(true);
};


/**
 * Reads a (potentially) variable length off the BER buffer.  This call is
 * not really meant to be called directly, as callers have to manipulate
 * the internal buffer afterwards.
 *
 * As a result of this call, you can call `Reader.length`, until the
 * next thing called that does a readLength.
 *
 * @return {Number} the amount of offset to advance the buffer.
 * @throws {InvalidAsn1Error} on bad ASN.1
 */
Reader.prototype.readLength = function(offset) {
  if (offset === undefined)
    offset = this._offset;

  if (offset >= this._size)
    return null;

  var lenB = this._buf[offset++] & 0xff;
  if (lenB === null)
    return null;

  if ((lenB & 0x80) == 0x80) {
    lenB &= 0x7f;

    if (lenB == 0)
      throw newInvalidAsn1Error('Indefinite length not supported');

    if (lenB > 4)
      throw newInvalidAsn1Error('encoding too long');

    if (this._size - offset < lenB)
      return null;

    this._len = 0;
    for (var i = 0; i < lenB; i++)
      this._len = (this._len << 8) + (this._buf[offset++] & 0xff);

  } else {
    // Wasn't a variable length
    this._len = lenB;
  }

  return offset;
};


/**
 * Parses the next sequence in this BER buffer.
 *
 * To get the length of the sequence, call `Reader.length`.
 *
 * @return {Number} the sequence's tag.
 */
Reader.prototype.readSequence = function(tag) {
  var seq = this.peek();
  if (seq === null)
    return null;
  if (tag !== undefined && tag !== seq)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + seq.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`
  if (o === null)
    return null;

  this._offset = o;
  return seq;
};


Reader.prototype.readInt = function() {
  return this._readTag(ASN1.Integer);
};


Reader.prototype.readBoolean = function() {
  return (this._readTag(ASN1.Boolean) === 0 ? false : true);
};


Reader.prototype.readEnumeration = function() {
  return this._readTag(ASN1.Enumeration);
};


Reader.prototype.readString = function(tag, retbuf) {
  if (!tag)
    tag = ASN1.OctetString;

  var b = this.peek();
  if (b === null)
    return null;

  if (b !== tag)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + b.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`

  if (o === null)
    return null;

  if (this.length > this._size - o)
    return null;

  this._offset = o;

  if (this.length === 0)
    return retbuf ? new Buffer(0) : '';

  var str = this._buf.slice(this._offset, this._offset + this.length);
  this._offset += this.length;

  return retbuf ? str : str.toString('utf8');
};

Reader.prototype.readOID = function(tag) {
  if (!tag)
    tag = ASN1.OID;

  var b = this.readString(tag, true);
  if (b === null)
    return null;

  var values = [];
  var value = 0;

  for (var i = 0; i < b.length; i++) {
    var byte = b[i] & 0xff;

    value <<= 7;
    value += byte & 0x7f;
    if ((byte & 0x80) == 0) {
      values.push(value);
      value = 0;
    }
  }

  value = values.shift();
  values.unshift(value % 40);
  values.unshift((value / 40) >> 0);

  return values.join('.');
};


Reader.prototype._readTag = function(tag) {
  assert.ok(tag !== undefined);

  var b = this.peek();

  if (b === null)
    return null;

  if (b !== tag)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + b.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`
  if (o === null)
    return null;

  if (this.length > 4)
    throw newInvalidAsn1Error('Integer too long: ' + this.length);

  if (this.length > this._size - o)
    return null;
  this._offset = o;

  var fb = this._buf[this._offset];
  var value = 0;

  for (var i = 0; i < this.length; i++) {
    value <<= 8;
    value |= (this._buf[this._offset++] & 0xff);
  }

  if ((fb & 0x80) == 0x80 && i !== 4)
    value -= (1 << (i * 8));

  return value >> 0;
};



///--- Exported API

module.exports = Reader;

},{"./errors":7,"./types":10,"assert":undefined}],10:[function(require,module,exports){
// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


module.exports = {
  EOC: 0,
  Boolean: 1,
  Integer: 2,
  BitString: 3,
  OctetString: 4,
  Null: 5,
  OID: 6,
  ObjectDescriptor: 7,
  External: 8,
  Real: 9, // float
  Enumeration: 10,
  PDV: 11,
  Utf8String: 12,
  RelativeOID: 13,
  Sequence: 16,
  Set: 17,
  NumericString: 18,
  PrintableString: 19,
  T61String: 20,
  VideotexString: 21,
  IA5String: 22,
  UTCTime: 23,
  GeneralizedTime: 24,
  GraphicString: 25,
  VisibleString: 26,
  GeneralString: 28,
  UniversalString: 29,
  CharacterString: 30,
  BMPString: 31,
  Constructor: 32,
  Context: 128
};

},{}],11:[function(require,module,exports){
// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var assert = require('assert');
var ASN1 = require('./types');
var errors = require('./errors');


///--- Globals

var newInvalidAsn1Error = errors.newInvalidAsn1Error;

var DEFAULT_OPTS = {
  size: 1024,
  growthFactor: 8
};


///--- Helpers

function merge(from, to) {
  assert.ok(from);
  assert.equal(typeof(from), 'object');
  assert.ok(to);
  assert.equal(typeof(to), 'object');

  var keys = Object.getOwnPropertyNames(from);
  keys.forEach(function(key) {
    if (to[key])
      return;

    var value = Object.getOwnPropertyDescriptor(from, key);
    Object.defineProperty(to, key, value);
  });

  return to;
}



///--- API

function Writer(options) {
  options = merge(DEFAULT_OPTS, options || {});

  this._buf = new Buffer(options.size || 1024);
  this._size = this._buf.length;
  this._offset = 0;
  this._options = options;

  // A list of offsets in the buffer where we need to insert
  // sequence tag/len pairs.
  this._seq = [];
}

Object.defineProperty(Writer.prototype, 'buffer', {
  get: function () {
    if (this._seq.length)
      throw new InvalidAsn1Error(this._seq.length + ' unended sequence(s)');

    return (this._buf.slice(0, this._offset));
  }
});

Writer.prototype.writeByte = function(b) {
  if (typeof(b) !== 'number')
    throw new TypeError('argument must be a Number');

  this._ensure(1);
  this._buf[this._offset++] = b;
};


Writer.prototype.writeInt = function(i, tag) {
  if (typeof(i) !== 'number')
    throw new TypeError('argument must be a Number');
  if (typeof(tag) !== 'number')
    tag = ASN1.Integer;

  var sz = 4;

  while ((((i & 0xff800000) === 0) || ((i & 0xff800000) === 0xff800000 >> 0)) &&
         (sz > 1)) {
    sz--;
    i <<= 8;
  }

  if (sz > 4)
    throw new InvalidAsn1Error('BER ints cannot be > 0xffffffff');

  this._ensure(2 + sz);
  this._buf[this._offset++] = tag;
  this._buf[this._offset++] = sz;

  while (sz-- > 0) {
    this._buf[this._offset++] = ((i & 0xff000000) >>> 24);
    i <<= 8;
  }

};


Writer.prototype.writeNull = function() {
  this.writeByte(ASN1.Null);
  this.writeByte(0x00);
};


Writer.prototype.writeEnumeration = function(i, tag) {
  if (typeof(i) !== 'number')
    throw new TypeError('argument must be a Number');
  if (typeof(tag) !== 'number')
    tag = ASN1.Enumeration;

  return this.writeInt(i, tag);
};


Writer.prototype.writeBoolean = function(b, tag) {
  if (typeof(b) !== 'boolean')
    throw new TypeError('argument must be a Boolean');
  if (typeof(tag) !== 'number')
    tag = ASN1.Boolean;

  this._ensure(3);
  this._buf[this._offset++] = tag;
  this._buf[this._offset++] = 0x01;
  this._buf[this._offset++] = b ? 0xff : 0x00;
};


Writer.prototype.writeString = function(s, tag) {
  if (typeof(s) !== 'string')
    throw new TypeError('argument must be a string (was: ' + typeof(s) + ')');
  if (typeof(tag) !== 'number')
    tag = ASN1.OctetString;

  var len = Buffer.byteLength(s);
  this.writeByte(tag);
  this.writeLength(len);
  if (len) {
    this._ensure(len);
    this._buf.write(s, this._offset);
    this._offset += len;
  }
};


Writer.prototype.writeBuffer = function(buf, tag) {
  if (typeof(tag) !== 'number')
    throw new TypeError('tag must be a number');
  if (!Buffer.isBuffer(buf))
    throw new TypeError('argument must be a buffer');

  this.writeByte(tag);
  this.writeLength(buf.length);
  this._ensure(buf.length);
  buf.copy(this._buf, this._offset, 0, buf.length);
  this._offset += buf.length;
};


Writer.prototype.writeStringArray = function(strings) {
  if ((!strings instanceof Array))
    throw new TypeError('argument must be an Array[String]');

  var self = this;
  strings.forEach(function(s) {
    self.writeString(s);
  });
};

// This is really to solve DER cases, but whatever for now
Writer.prototype.writeOID = function(s, tag) {
  if (typeof(s) !== 'string')
    throw new TypeError('argument must be a string');
  if (typeof(tag) !== 'number')
    tag = ASN1.OID;

  if (!/^([0-9]+\.){3,}[0-9]+$/.test(s))
    throw new Error('argument is not a valid OID string');

  function encodeOctet(bytes, octet) {
    if (octet < 128) {
        bytes.push(octet);
    } else if (octet < 16384) {
        bytes.push((octet >>> 7) | 0x80);
        bytes.push(octet & 0x7F);
    } else if (octet < 2097152) {
      bytes.push((octet >>> 14) | 0x80);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    } else if (octet < 268435456) {
      bytes.push((octet >>> 21) | 0x80);
      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    } else {
      bytes.push(((octet >>> 28) | 0x80) & 0xFF);
      bytes.push(((octet >>> 21) | 0x80) & 0xFF);
      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    }
  }

  var tmp = s.split('.');
  var bytes = [];
  bytes.push(parseInt(tmp[0], 10) * 40 + parseInt(tmp[1], 10));
  tmp.slice(2).forEach(function(b) {
    encodeOctet(bytes, parseInt(b, 10));
  });

  var self = this;
  this._ensure(2 + bytes.length);
  this.writeByte(tag);
  this.writeLength(bytes.length);
  bytes.forEach(function(b) {
    self.writeByte(b);
  });
};


Writer.prototype.writeLength = function(len) {
  if (typeof(len) !== 'number')
    throw new TypeError('argument must be a Number');

  this._ensure(4);

  if (len <= 0x7f) {
    this._buf[this._offset++] = len;
  } else if (len <= 0xff) {
    this._buf[this._offset++] = 0x81;
    this._buf[this._offset++] = len;
  } else if (len <= 0xffff) {
    this._buf[this._offset++] = 0x82;
    this._buf[this._offset++] = len >> 8;
    this._buf[this._offset++] = len;
  } else if (len <= 0xffffff) {
    this._buf[this._offset++] = 0x83;
    this._buf[this._offset++] = len >> 16;
    this._buf[this._offset++] = len >> 8;
    this._buf[this._offset++] = len;
  } else {
    throw new InvalidAsn1ERror('Length too long (> 4 bytes)');
  }
};

Writer.prototype.startSequence = function(tag) {
  if (typeof(tag) !== 'number')
    tag = ASN1.Sequence | ASN1.Constructor;

  this.writeByte(tag);
  this._seq.push(this._offset);
  this._ensure(3);
  this._offset += 3;
};


Writer.prototype.endSequence = function() {
  var seq = this._seq.pop();
  var start = seq + 3;
  var len = this._offset - start;

  if (len <= 0x7f) {
    this._shift(start, len, -2);
    this._buf[seq] = len;
  } else if (len <= 0xff) {
    this._shift(start, len, -1);
    this._buf[seq] = 0x81;
    this._buf[seq + 1] = len;
  } else if (len <= 0xffff) {
    this._buf[seq] = 0x82;
    this._buf[seq + 1] = len >> 8;
    this._buf[seq + 2] = len;
  } else if (len <= 0xffffff) {
    this._shift(start, len, 1);
    this._buf[seq] = 0x83;
    this._buf[seq + 1] = len >> 16;
    this._buf[seq + 2] = len >> 8;
    this._buf[seq + 3] = len;
  } else {
    throw new InvalidAsn1Error('Sequence too long');
  }
};


Writer.prototype._shift = function(start, len, shift) {
  assert.ok(start !== undefined);
  assert.ok(len !== undefined);
  assert.ok(shift);

  this._buf.copy(this._buf, start + shift, start, start + len);
  this._offset += shift;
};

Writer.prototype._ensure = function(len) {
  assert.ok(len);

  if (this._size - this._offset < len) {
    var sz = this._size * this._options.growthFactor;
    if (sz - this._offset < len)
      sz += len;

    var buf = new Buffer(sz);

    this._buf.copy(buf, 0, 0, this._offset);
    this._buf = buf;
    this._size = sz;
  }
};



///--- Exported API

module.exports = Writer;

},{"./errors":7,"./types":10,"assert":undefined}],12:[function(require,module,exports){
// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

// If you have no idea what ASN.1 or BER is, see this:
// ftp://ftp.rsa.com/pub/pkcs/ascii/layman.asc

var Ber = require('./ber/index');



///--- Exported API

module.exports = {

  Ber: Ber,

  BerReader: Ber.Reader,

  BerWriter: Ber.Writer

};

},{"./ber/index":8}],13:[function(require,module,exports){
"use strict";

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

/* eslint max-len: 0 */

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

// Should be removed in the next major release:

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
},{"core-js/fn/regexp/escape":17,"core-js/shim":311,"regenerator-runtime/runtime":323}],14:[function(require,module,exports){
'use strict';
var escapeStringRegexp = require('escape-string-regexp');
var ansiStyles = require('ansi-styles');
var stripAnsi = require('strip-ansi');
var hasAnsi = require('has-ansi');
var supportsColor = require('supports-color');
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
	// detect mode if not set manually
	this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = (function () {
	var ret = {};

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				return build.call(this, this._styles.concat(key));
			}
		};
	});

	return ret;
})();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder.enabled = this.enabled;
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = ansiStyles[nestedStyles[i]];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build.call(this, [name]);
			}
		};
	});

	return ret;
}

defineProps(Chalk.prototype, init());

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.hasColor = hasAnsi;
module.exports.stripColor = stripAnsi;
module.exports.supportsColor = supportsColor;

},{"ansi-styles":6,"escape-string-regexp":313,"has-ansi":314,"strip-ansi":342,"supports-color":343}],15:[function(require,module,exports){
'use strict';
var codes = {
  'white': 37,
  'grey': 90,
  'black': 30,
  'blue': 34,
  'cyan': 36,
  'green': 32,
  'magenta': 35,
  'red': 31,
  'yellow': 33
};
function Render(code) {
  return function(s) {
    var a = '\x1B[' + code.toString() + 'm' + s + '\x1B[39m';
    return a;
  }
};
var colors = module.exports = {};
Object.keys(codes).forEach(function(i){
  colors[i] = new Render(codes[i])
})

},{}],16:[function(require,module,exports){
'use strict';
var colors = require('colors-mini')
var util = require('util')

module.exports = function(message, chose, callback) {
  if (!message) {
    throw new Error('message required!')
  };
  if (!chose && !callback) {
    throw new Error('callback required!')
  };
  if (typeof callback === 'undefined') {
    callback = chose;
    chose = ['yes', 'no'];
  };
  if (!util.isArray(chose) || (chose && chose.length !== 2)) {
    throw new Error('chose is not a right array')
  };
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  var answer = '';
  var ask = colors.red('?');
  var msg = [ask];
  msg.push(colors.grey(message));
  msg.push(colors.yellow('<' + chose.join('|') + '>') + ' : ');

  process.stdout.write(msg.join(' '));
  process.stdin.once('data', function(data) {
    var ok = data.trim() === chose[0];
    try {
      callback(ok);
    } catch (e) {
      console.log(e)
      throw new Error(e);
    }
    process.stdin.pause();
  })
}

},{"colors-mini":15,"util":undefined}],17:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;
},{"../../modules/_core":38,"../../modules/core.regexp.escape":135}],18:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],19:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};
},{"./_cof":33}],20:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./_hide":55,"./_wks":132}],21:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],22:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":64}],23:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./_to-index":120,"./_to-length":123,"./_to-object":124}],24:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./_to-index":120,"./_to-length":123,"./_to-object":124}],25:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":52}],26:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":120,"./_to-iobject":122,"./_to-length":123}],27:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":30,"./_ctx":40,"./_iobject":60,"./_to-length":123,"./_to-object":124}],28:[function(require,module,exports){
var aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , IObject   = require('./_iobject')
  , toLength  = require('./_to-length');

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};
},{"./_a-function":18,"./_iobject":60,"./_to-length":123,"./_to-object":124}],29:[function(require,module,exports){
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":62,"./_is-object":64,"./_wks":132}],30:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":29}],31:[function(require,module,exports){
'use strict';
var aFunction  = require('./_a-function')
  , isObject   = require('./_is-object')
  , invoke     = require('./_invoke')
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};
},{"./_a-function":18,"./_invoke":59,"./_is-object":64}],32:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":33,"./_wks":132}],33:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],34:[function(require,module,exports){
'use strict';
var dP          = require('./_object-dp').f
  , create      = require('./_object-create')
  , hide        = require('./_hide')
  , redefineAll = require('./_redefine-all')
  , ctx         = require('./_ctx')
  , anInstance  = require('./_an-instance')
  , defined     = require('./_defined')
  , forOf       = require('./_for-of')
  , $iterDefine = require('./_iter-define')
  , step        = require('./_iter-step')
  , setSpecies  = require('./_set-species')
  , DESCRIPTORS = require('./_descriptors')
  , fastKey     = require('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_an-instance":21,"./_ctx":40,"./_defined":42,"./_descriptors":43,"./_for-of":52,"./_hide":55,"./_iter-define":68,"./_iter-step":70,"./_meta":77,"./_object-create":81,"./_object-dp":82,"./_redefine-all":101,"./_set-species":106}],35:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof')
  , from    = require('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":25,"./_classof":32}],36:[function(require,module,exports){
'use strict';
var redefineAll       = require('./_redefine-all')
  , getWeak           = require('./_meta').getWeak
  , anObject          = require('./_an-object')
  , isObject          = require('./_is-object')
  , anInstance        = require('./_an-instance')
  , forOf             = require('./_for-of')
  , createArrayMethod = require('./_array-methods')
  , $has              = require('./_has')
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};
},{"./_an-instance":21,"./_an-object":22,"./_array-methods":27,"./_for-of":52,"./_has":54,"./_is-object":64,"./_meta":77,"./_redefine-all":101}],37:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , $export           = require('./_export')
  , redefine          = require('./_redefine')
  , redefineAll       = require('./_redefine-all')
  , meta              = require('./_meta')
  , forOf             = require('./_for-of')
  , anInstance        = require('./_an-instance')
  , isObject          = require('./_is-object')
  , fails             = require('./_fails')
  , $iterDetect       = require('./_iter-detect')
  , setToStringTag    = require('./_set-to-string-tag')
  , inheritIfRequired = require('./_inherit-if-required');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_an-instance":21,"./_export":47,"./_fails":49,"./_for-of":52,"./_global":53,"./_inherit-if-required":58,"./_is-object":64,"./_iter-detect":69,"./_meta":77,"./_redefine":102,"./_redefine-all":101,"./_set-to-string-tag":107}],38:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],39:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp')
  , createDesc      = require('./_property-desc');

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};
},{"./_object-dp":82,"./_property-desc":100}],40:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":18}],41:[function(require,module,exports){
'use strict';
var anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive')
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};
},{"./_an-object":22,"./_to-primitive":125}],42:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],43:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":49}],44:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":53,"./_is-object":64}],45:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],46:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":88,"./_object-keys":91,"./_object-pie":92}],47:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , hide      = require('./_hide')
  , redefine  = require('./_redefine')
  , ctx       = require('./_ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":38,"./_ctx":40,"./_global":53,"./_hide":55,"./_redefine":102}],48:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./_wks":132}],49:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],50:[function(require,module,exports){
'use strict';
var hide     = require('./_hide')
  , redefine = require('./_redefine')
  , fails    = require('./_fails')
  , defined  = require('./_defined')
  , wks      = require('./_wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};
},{"./_defined":42,"./_fails":49,"./_hide":55,"./_redefine":102,"./_wks":132}],51:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./_an-object":22}],52:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":22,"./_ctx":40,"./_is-array-iter":61,"./_iter-call":66,"./_to-length":123,"./core.get-iterator-method":133}],53:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],54:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],55:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":43,"./_object-dp":82,"./_property-desc":100}],56:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":53}],57:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":43,"./_dom-create":44,"./_fails":49}],58:[function(require,module,exports){
var isObject       = require('./_is-object')
  , setPrototypeOf = require('./_set-proto').set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};
},{"./_is-object":64,"./_set-proto":105}],59:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],60:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":33}],61:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":71,"./_wks":132}],62:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":33}],63:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":64}],64:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],65:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object')
  , cof      = require('./_cof')
  , MATCH    = require('./_wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./_cof":33,"./_is-object":64,"./_wks":132}],66:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":22}],67:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":55,"./_object-create":81,"./_property-desc":100,"./_set-to-string-tag":107,"./_wks":132}],68:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":47,"./_has":54,"./_hide":55,"./_iter-create":67,"./_iterators":71,"./_library":73,"./_object-gpo":89,"./_redefine":102,"./_set-to-string-tag":107,"./_wks":132}],69:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":132}],70:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],71:[function(require,module,exports){
module.exports = {};
},{}],72:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":91,"./_to-iobject":122}],73:[function(require,module,exports){
module.exports = false;
},{}],74:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;
},{}],75:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],76:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],77:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":49,"./_has":54,"./_is-object":64,"./_object-dp":82,"./_uid":129}],78:[function(require,module,exports){
var Map     = require('./es6.map')
  , $export = require('./_export')
  , shared  = require('./_shared')('metadata')
  , store   = shared.store || (shared.store = new (require('./es6.weak-map')));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};
},{"./_export":47,"./_shared":109,"./es6.map":165,"./es6.weak-map":271}],79:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
},{"./_cof":33,"./_global":53,"./_task":119}],80:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":49,"./_iobject":60,"./_object-gops":88,"./_object-keys":91,"./_object-pie":92,"./_to-object":124}],81:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};
},{"./_an-object":22,"./_dom-create":44,"./_enum-bug-keys":45,"./_html":56,"./_object-dps":83,"./_shared-key":108}],82:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":22,"./_descriptors":43,"./_ie8-dom-define":57,"./_to-primitive":125}],83:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":22,"./_descriptors":43,"./_object-dp":82,"./_object-keys":91}],84:[function(require,module,exports){
// Forced replacement prototype accessors methods
module.exports = require('./_library')|| !require('./_fails')(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete require('./_global')[K];
});
},{"./_fails":49,"./_global":53,"./_library":73}],85:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":43,"./_has":54,"./_ie8-dom-define":57,"./_object-pie":92,"./_property-desc":100,"./_to-iobject":122,"./_to-primitive":125}],86:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":87,"./_to-iobject":122}],87:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":45,"./_object-keys-internal":90}],88:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],89:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":54,"./_shared-key":108,"./_to-object":124}],90:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":26,"./_has":54,"./_shared-key":108,"./_to-iobject":122}],91:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":45,"./_object-keys-internal":90}],92:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],93:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":38,"./_export":47,"./_fails":49}],94:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject')
  , isEnum    = require('./_object-pie').f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./_object-keys":91,"./_object-pie":92,"./_to-iobject":122}],95:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN     = require('./_object-gopn')
  , gOPS     = require('./_object-gops')
  , anObject = require('./_an-object')
  , Reflect  = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./_an-object":22,"./_global":53,"./_object-gopn":87,"./_object-gops":88}],96:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat
  , $trim       = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;
},{"./_global":53,"./_string-trim":117,"./_string-ws":118}],97:[function(require,module,exports){
var $parseInt = require('./_global').parseInt
  , $trim     = require('./_string-trim').trim
  , ws        = require('./_string-ws')
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;
},{"./_global":53,"./_string-trim":117,"./_string-ws":118}],98:[function(require,module,exports){
'use strict';
var path      = require('./_path')
  , invoke    = require('./_invoke')
  , aFunction = require('./_a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./_a-function":18,"./_invoke":59,"./_path":99}],99:[function(require,module,exports){
module.exports = require('./_global');
},{"./_global":53}],100:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],101:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};
},{"./_redefine":102}],102:[function(require,module,exports){
var global    = require('./_global')
  , hide      = require('./_hide')
  , has       = require('./_has')
  , SRC       = require('./_uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./_core":38,"./_global":53,"./_has":54,"./_hide":55,"./_uid":129}],103:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],104:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],105:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":22,"./_ctx":40,"./_is-object":64,"./_object-gopd":85}],106:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_descriptors":43,"./_global":53,"./_object-dp":82,"./_wks":132}],107:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":54,"./_object-dp":82,"./_wks":132}],108:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":109,"./_uid":129}],109:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":53}],110:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":18,"./_an-object":22,"./_wks":132}],111:[function(require,module,exports){
var fails = require('./_fails');

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};
},{"./_fails":49}],112:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":42,"./_to-integer":121}],113:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp')
  , defined  = require('./_defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./_defined":42,"./_is-regexp":65}],114:[function(require,module,exports){
var $export = require('./_export')
  , fails   = require('./_fails')
  , defined = require('./_defined')
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};
},{"./_defined":42,"./_export":47,"./_fails":49}],115:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length')
  , repeat   = require('./_string-repeat')
  , defined  = require('./_defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":42,"./_string-repeat":116,"./_to-length":123}],116:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./_defined":42,"./_to-integer":121}],117:[function(require,module,exports){
var $export = require('./_export')
  , defined = require('./_defined')
  , fails   = require('./_fails')
  , spaces  = require('./_string-ws')
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./_defined":42,"./_export":47,"./_fails":49,"./_string-ws":118}],118:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
},{}],119:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":33,"./_ctx":40,"./_dom-create":44,"./_global":53,"./_html":56,"./_invoke":59}],120:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":121}],121:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],122:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":42,"./_iobject":60}],123:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":121}],124:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":42}],125:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":64}],126:[function(require,module,exports){
'use strict';
if(require('./_descriptors')){
  var LIBRARY             = require('./_library')
    , global              = require('./_global')
    , fails               = require('./_fails')
    , $export             = require('./_export')
    , $typed              = require('./_typed')
    , $buffer             = require('./_typed-buffer')
    , ctx                 = require('./_ctx')
    , anInstance          = require('./_an-instance')
    , propertyDesc        = require('./_property-desc')
    , hide                = require('./_hide')
    , redefineAll         = require('./_redefine-all')
    , isInteger           = require('./_is-integer')
    , toInteger           = require('./_to-integer')
    , toLength            = require('./_to-length')
    , toIndex             = require('./_to-index')
    , toPrimitive         = require('./_to-primitive')
    , has                 = require('./_has')
    , same                = require('./_same-value')
    , classof             = require('./_classof')
    , isObject            = require('./_is-object')
    , toObject            = require('./_to-object')
    , isArrayIter         = require('./_is-array-iter')
    , create              = require('./_object-create')
    , getPrototypeOf      = require('./_object-gpo')
    , gOPN                = require('./_object-gopn').f
    , isIterable          = require('./core.is-iterable')
    , getIterFn           = require('./core.get-iterator-method')
    , uid                 = require('./_uid')
    , wks                 = require('./_wks')
    , createArrayMethod   = require('./_array-methods')
    , createArrayIncludes = require('./_array-includes')
    , speciesConstructor  = require('./_species-constructor')
    , ArrayIterators      = require('./es6.array.iterator')
    , Iterators           = require('./_iterators')
    , $iterDetect         = require('./_iter-detect')
    , setSpecies          = require('./_set-species')
    , arrayFill           = require('./_array-fill')
    , arrayCopyWithin     = require('./_array-copy-within')
    , $DP                 = require('./_object-dp')
    , $GOPD               = require('./_object-gopd')
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };
},{"./_an-instance":21,"./_array-copy-within":23,"./_array-fill":24,"./_array-includes":26,"./_array-methods":27,"./_classof":32,"./_ctx":40,"./_descriptors":43,"./_export":47,"./_fails":49,"./_global":53,"./_has":54,"./_hide":55,"./_is-array-iter":61,"./_is-integer":63,"./_is-object":64,"./_iter-detect":69,"./_iterators":71,"./_library":73,"./_object-create":81,"./_object-dp":82,"./_object-gopd":85,"./_object-gopn":87,"./_object-gpo":89,"./_property-desc":100,"./_redefine-all":101,"./_same-value":104,"./_set-species":106,"./_species-constructor":110,"./_to-index":120,"./_to-integer":121,"./_to-length":123,"./_to-object":124,"./_to-primitive":125,"./_typed":128,"./_typed-buffer":127,"./_uid":129,"./_wks":132,"./core.get-iterator-method":133,"./core.is-iterable":134,"./es6.array.iterator":146}],127:[function(require,module,exports){
'use strict';
var global         = require('./_global')
  , DESCRIPTORS    = require('./_descriptors')
  , LIBRARY        = require('./_library')
  , $typed         = require('./_typed')
  , hide           = require('./_hide')
  , redefineAll    = require('./_redefine-all')
  , fails          = require('./_fails')
  , anInstance     = require('./_an-instance')
  , toInteger      = require('./_to-integer')
  , toLength       = require('./_to-length')
  , gOPN           = require('./_object-gopn').f
  , dP             = require('./_object-dp').f
  , arrayFill      = require('./_array-fill')
  , setToStringTag = require('./_set-to-string-tag')
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , parseInt       = global.parseInt
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , min            = Math.min
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
},{"./_an-instance":21,"./_array-fill":24,"./_descriptors":43,"./_fails":49,"./_global":53,"./_hide":55,"./_library":73,"./_object-dp":82,"./_object-gopn":87,"./_redefine-all":101,"./_set-to-string-tag":107,"./_to-integer":121,"./_to-length":123,"./_typed":128}],128:[function(require,module,exports){
var global = require('./_global')
  , hide   = require('./_hide')
  , uid    = require('./_uid')
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};
},{"./_global":53,"./_hide":55,"./_uid":129}],129:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],130:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":38,"./_global":53,"./_library":73,"./_object-dp":82,"./_wks-ext":131}],131:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":132}],132:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":53,"./_shared":109,"./_uid":129}],133:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":32,"./_core":38,"./_iterators":71,"./_wks":132}],134:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};
},{"./_classof":32,"./_core":38,"./_iterators":71,"./_wks":132}],135:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export')
  , $re     = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./_export":47,"./_replacer":103}],136:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {copyWithin: require('./_array-copy-within')});

require('./_add-to-unscopables')('copyWithin');
},{"./_add-to-unscopables":20,"./_array-copy-within":23,"./_export":47}],137:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $every  = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":27,"./_export":47,"./_strict-method":111}],138:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {fill: require('./_array-fill')});

require('./_add-to-unscopables')('fill');
},{"./_add-to-unscopables":20,"./_array-fill":24,"./_export":47}],139:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":27,"./_export":47,"./_strict-method":111}],140:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":20,"./_array-methods":27,"./_export":47}],141:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":20,"./_array-methods":27,"./_export":47}],142:[function(require,module,exports){
'use strict';
var $export  = require('./_export')
  , $forEach = require('./_array-methods')(0)
  , STRICT   = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":27,"./_export":47,"./_strict-method":111}],143:[function(require,module,exports){
'use strict';
var ctx            = require('./_ctx')
  , $export        = require('./_export')
  , toObject       = require('./_to-object')
  , call           = require('./_iter-call')
  , isArrayIter    = require('./_is-array-iter')
  , toLength       = require('./_to-length')
  , createProperty = require('./_create-property')
  , getIterFn      = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":39,"./_ctx":40,"./_export":47,"./_is-array-iter":61,"./_iter-call":66,"./_iter-detect":69,"./_to-length":123,"./_to-object":124,"./core.get-iterator-method":133}],144:[function(require,module,exports){
'use strict';
var $export       = require('./_export')
  , $indexOf      = require('./_array-includes')(false)
  , $native       = [].indexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});
},{"./_array-includes":26,"./_export":47,"./_strict-method":111}],145:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', {isArray: require('./_is-array')});
},{"./_export":47,"./_is-array":62}],146:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":20,"./_iter-define":68,"./_iter-step":70,"./_iterators":71,"./_to-iobject":122}],147:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});
},{"./_export":47,"./_iobject":60,"./_strict-method":111,"./_to-iobject":122}],148:[function(require,module,exports){
'use strict';
var $export       = require('./_export')
  , toIObject     = require('./_to-iobject')
  , toInteger     = require('./_to-integer')
  , toLength      = require('./_to-length')
  , $native       = [].lastIndexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    // convert -0 to +0
    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
    return -1;
  }
});
},{"./_export":47,"./_strict-method":111,"./_to-integer":121,"./_to-iobject":122,"./_to-length":123}],149:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $map    = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":27,"./_export":47,"./_strict-method":111}],150:[function(require,module,exports){
'use strict';
var $export        = require('./_export')
  , createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});
},{"./_create-property":39,"./_export":47,"./_fails":49}],151:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});
},{"./_array-reduce":28,"./_export":47,"./_strict-method":111}],152:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});
},{"./_array-reduce":28,"./_export":47,"./_strict-method":111}],153:[function(require,module,exports){
'use strict';
var $export    = require('./_export')
  , html       = require('./_html')
  , cof        = require('./_cof')
  , toIndex    = require('./_to-index')
  , toLength   = require('./_to-length')
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
},{"./_cof":33,"./_export":47,"./_fails":49,"./_html":56,"./_to-index":120,"./_to-length":123}],154:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $some   = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":27,"./_export":47,"./_strict-method":111}],155:[function(require,module,exports){
'use strict';
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , fails     = require('./_fails')
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});
},{"./_a-function":18,"./_export":47,"./_fails":49,"./_strict-method":111,"./_to-object":124}],156:[function(require,module,exports){
require('./_set-species')('Array');
},{"./_set-species":106}],157:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});
},{"./_export":47}],158:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export')
  , fails   = require('./_fails')
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./_export":47,"./_fails":49}],159:[function(require,module,exports){
'use strict';
var $export     = require('./_export')
  , toObject    = require('./_to-object')
  , toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});
},{"./_export":47,"./_fails":49,"./_to-object":124,"./_to-primitive":125}],160:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));
},{"./_date-to-primitive":41,"./_hide":55,"./_wks":132}],161:[function(require,module,exports){
var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  require('./_redefine')(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}
},{"./_redefine":102}],162:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', {bind: require('./_bind')});
},{"./_bind":31,"./_export":47}],163:[function(require,module,exports){
'use strict';
var isObject       = require('./_is-object')
  , getPrototypeOf = require('./_object-gpo')
  , HAS_INSTANCE   = require('./_wks')('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))require('./_object-dp').f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});
},{"./_is-object":64,"./_object-dp":82,"./_object-gpo":89,"./_wks":132}],164:[function(require,module,exports){
var dP         = require('./_object-dp').f
  , createDesc = require('./_property-desc')
  , has        = require('./_has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});
},{"./_descriptors":43,"./_has":54,"./_object-dp":82,"./_property-desc":100}],165:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./_collection":37,"./_collection-strong":34}],166:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export')
  , log1p   = require('./_math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./_export":47,"./_math-log1p":75}],167:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export')
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});
},{"./_export":47}],168:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export')
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./_export":47}],169:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export')
  , sign    = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./_export":47,"./_math-sign":76}],170:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./_export":47}],171:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./_export":47}],172:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export')
  , $expm1  = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});
},{"./_export":47,"./_math-expm1":74}],173:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./_export')
  , sign      = require('./_math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./_export":47,"./_math-sign":76}],174:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./_export":47}],175:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./_export":47,"./_fails":49}],176:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./_export":47}],177:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', {log1p: require('./_math-log1p')});
},{"./_export":47,"./_math-log1p":75}],178:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./_export":47}],179:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', {sign: require('./_math-sign')});
},{"./_export":47,"./_math-sign":76}],180:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./_export":47,"./_fails":49,"./_math-expm1":74}],181:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./_export":47,"./_math-expm1":74}],182:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./_export":47}],183:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , has               = require('./_has')
  , cof               = require('./_cof')
  , inheritIfRequired = require('./_inherit-if-required')
  , toPrimitive       = require('./_to-primitive')
  , fails             = require('./_fails')
  , gOPN              = require('./_object-gopn').f
  , gOPD              = require('./_object-gopd').f
  , dP                = require('./_object-dp').f
  , $trim             = require('./_string-trim').trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(require('./_object-create')(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}
},{"./_cof":33,"./_descriptors":43,"./_fails":49,"./_global":53,"./_has":54,"./_inherit-if-required":58,"./_object-create":81,"./_object-dp":82,"./_object-gopd":85,"./_object-gopn":87,"./_redefine":102,"./_string-trim":117,"./_to-primitive":125}],184:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./_export":47}],185:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./_export')
  , _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./_export":47,"./_global":53}],186:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":47,"./_is-integer":63}],187:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./_export":47}],188:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./_export')
  , isInteger = require('./_is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./_export":47,"./_is-integer":63}],189:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./_export":47}],190:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./_export":47}],191:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});
},{"./_export":47,"./_parse-float":96}],192:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});
},{"./_export":47,"./_parse-int":97}],193:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , anInstance   = require('./_an-instance')
  , toInteger    = require('./_to-integer')
  , aNumberValue = require('./_a-number-value')
  , repeat       = require('./_string-repeat')
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});
},{"./_a-number-value":19,"./_an-instance":21,"./_export":47,"./_fails":49,"./_string-repeat":116,"./_to-integer":121}],194:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $fails       = require('./_fails')
  , aNumberValue = require('./_a-number-value')
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});
},{"./_a-number-value":19,"./_export":47,"./_fails":49}],195:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":47,"./_object-assign":80}],196:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":47,"./_object-create":81}],197:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperties: require('./_object-dps')});
},{"./_descriptors":43,"./_export":47,"./_object-dps":83}],198:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":43,"./_export":47,"./_object-dp":82}],199:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});
},{"./_is-object":64,"./_meta":77,"./_object-sap":93}],200:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":85,"./_object-sap":93,"./_to-iobject":122}],201:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function(){
  return require('./_object-gopn-ext').f;
});
},{"./_object-gopn-ext":86,"./_object-sap":93}],202:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":89,"./_object-sap":93,"./_to-object":124}],203:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./_is-object":64,"./_object-sap":93}],204:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./_is-object":64,"./_object-sap":93}],205:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./_is-object":64,"./_object-sap":93}],206:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', {is: require('./_same-value')});
},{"./_export":47,"./_same-value":104}],207:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":91,"./_object-sap":93,"./_to-object":124}],208:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});
},{"./_is-object":64,"./_meta":77,"./_object-sap":93}],209:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});
},{"./_is-object":64,"./_meta":77,"./_object-sap":93}],210:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":47,"./_set-proto":105}],211:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof')
  , test    = {};
test[require('./_wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./_redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./_classof":32,"./_redefine":102,"./_wks":132}],212:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});
},{"./_export":47,"./_parse-float":96}],213:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});
},{"./_export":47,"./_parse-int":97}],214:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , anObject           = require('./_an-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , setProto           = require('./_set-proto').set
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":18,"./_an-instance":21,"./_an-object":22,"./_classof":32,"./_core":38,"./_ctx":40,"./_export":47,"./_for-of":52,"./_global":53,"./_is-object":64,"./_iter-detect":69,"./_library":73,"./_microtask":79,"./_redefine-all":101,"./_set-proto":105,"./_set-species":106,"./_set-to-string-tag":107,"./_species-constructor":110,"./_task":119,"./_wks":132}],215:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , anObject  = require('./_an-object')
  , _apply    = Function.apply;

$export($export.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(aFunction(target), thisArgument, anObject(argumentsList));
  }
});
},{"./_a-function":18,"./_an-object":22,"./_export":47}],216:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export   = require('./_export')
  , create    = require('./_object-create')
  , aFunction = require('./_a-function')
  , anObject  = require('./_an-object')
  , isObject  = require('./_is-object')
  , bind      = require('./_bind');

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$export($export.S + $export.F * require('./_fails')(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./_a-function":18,"./_an-object":22,"./_bind":31,"./_export":47,"./_fails":49,"./_is-object":64,"./_object-create":81}],217:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = require('./_object-dp')
  , $export     = require('./_export')
  , anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":22,"./_export":47,"./_fails":49,"./_object-dp":82,"./_to-primitive":125}],218:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./_export')
  , gOPD     = require('./_object-gopd').f
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./_an-object":22,"./_export":47,"./_object-gopd":85}],219:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./_export')
  , anObject = require('./_an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./_an-object":22,"./_export":47,"./_iter-create":67}],220:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = require('./_object-gopd')
  , $export  = require('./_export')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});
},{"./_an-object":22,"./_export":47,"./_object-gopd":85}],221:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./_export')
  , getProto = require('./_object-gpo')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./_an-object":22,"./_export":47,"./_object-gpo":89}],222:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , isObject       = require('./_is-object')
  , anObject       = require('./_an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./_an-object":22,"./_export":47,"./_has":54,"./_is-object":64,"./_object-gopd":85,"./_object-gpo":89}],223:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./_export":47}],224:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./_export')
  , anObject      = require('./_an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./_an-object":22,"./_export":47}],225:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', {ownKeys: require('./_own-keys')});
},{"./_export":47,"./_own-keys":95}],226:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./_export')
  , anObject           = require('./_an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":22,"./_export":47}],227:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./_export')
  , setProto = require('./_set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_export":47,"./_set-proto":105}],228:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = require('./_object-dp')
  , gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , createDesc     = require('./_property-desc')
  , anObject       = require('./_an-object')
  , isObject       = require('./_is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./_an-object":22,"./_export":47,"./_has":54,"./_is-object":64,"./_object-dp":82,"./_object-gopd":85,"./_object-gpo":89,"./_property-desc":100}],229:[function(require,module,exports){
var global            = require('./_global')
  , inheritIfRequired = require('./_inherit-if-required')
  , dP                = require('./_object-dp').f
  , gOPN              = require('./_object-gopn').f
  , isRegExp          = require('./_is-regexp')
  , $flags            = require('./_flags')
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function(){
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');
},{"./_descriptors":43,"./_fails":49,"./_flags":51,"./_global":53,"./_inherit-if-required":58,"./_is-regexp":65,"./_object-dp":82,"./_object-gopn":87,"./_redefine":102,"./_set-species":106,"./_wks":132}],230:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if(require('./_descriptors') && /./g.flags != 'g')require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});
},{"./_descriptors":43,"./_flags":51,"./_object-dp":82}],231:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});
},{"./_fix-re-wks":50}],232:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});
},{"./_fix-re-wks":50}],233:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});
},{"./_fix-re-wks":50}],234:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = require('./_is-regexp')
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});
},{"./_fix-re-wks":50,"./_is-regexp":65}],235:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject    = require('./_an-object')
  , $flags      = require('./_flags')
  , DESCRIPTORS = require('./_descriptors')
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(require('./_fails')(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}
},{"./_an-object":22,"./_descriptors":43,"./_fails":49,"./_flags":51,"./_redefine":102,"./es6.regexp.flags":230}],236:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":37,"./_collection-strong":34}],237:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});
},{"./_string-html":114}],238:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});
},{"./_string-html":114}],239:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});
},{"./_string-html":114}],240:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});
},{"./_string-html":114}],241:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $at     = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./_export":47,"./_string-at":112}],242:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./_export')
  , toLength  = require('./_to-length')
  , context   = require('./_string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./_export":47,"./_fails-is-regexp":48,"./_string-context":113,"./_to-length":123}],243:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});
},{"./_string-html":114}],244:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});
},{"./_string-html":114}],245:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});
},{"./_string-html":114}],246:[function(require,module,exports){
var $export        = require('./_export')
  , toIndex        = require('./_to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./_export":47,"./_to-index":120}],247:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./_export')
  , context  = require('./_string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./_export":47,"./_fails-is-regexp":48,"./_string-context":113}],248:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});
},{"./_string-html":114}],249:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":68,"./_string-at":112}],250:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});
},{"./_string-html":114}],251:[function(require,module,exports){
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./_export":47,"./_to-iobject":122,"./_to-length":123}],252:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});
},{"./_export":47,"./_string-repeat":116}],253:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});
},{"./_string-html":114}],254:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./_export')
  , toLength    = require('./_to-length')
  , context     = require('./_string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./_export":47,"./_fails-is-regexp":48,"./_string-context":113,"./_to-length":123}],255:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});
},{"./_string-html":114}],256:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});
},{"./_string-html":114}],257:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});
},{"./_string-html":114}],258:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./_string-trim":117}],259:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":22,"./_descriptors":43,"./_enum-keys":46,"./_export":47,"./_fails":49,"./_global":53,"./_has":54,"./_hide":55,"./_is-array":62,"./_keyof":72,"./_library":73,"./_meta":77,"./_object-create":81,"./_object-dp":82,"./_object-gopd":85,"./_object-gopn":87,"./_object-gopn-ext":86,"./_object-gops":88,"./_object-keys":91,"./_object-pie":92,"./_property-desc":100,"./_redefine":102,"./_set-to-string-tag":107,"./_shared":109,"./_to-iobject":122,"./_to-primitive":125,"./_uid":129,"./_wks":132,"./_wks-define":130,"./_wks-ext":131}],260:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $typed       = require('./_typed')
  , buffer       = require('./_typed-buffer')
  , anObject     = require('./_an-object')
  , toIndex      = require('./_to-index')
  , toLength     = require('./_to-length')
  , isObject     = require('./_is-object')
  , TYPED_ARRAY  = require('./_wks')('typed_array')
  , ArrayBuffer  = require('./_global').ArrayBuffer
  , speciesConstructor = require('./_species-constructor')
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);
},{"./_an-object":22,"./_export":47,"./_fails":49,"./_global":53,"./_is-object":64,"./_set-species":106,"./_species-constructor":110,"./_to-index":120,"./_to-length":123,"./_typed":128,"./_typed-buffer":127,"./_wks":132}],261:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});
},{"./_export":47,"./_typed":128,"./_typed-buffer":127}],262:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":126}],263:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":126}],264:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":126}],265:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":126}],266:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":126}],267:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":126}],268:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":126}],269:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":126}],270:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);
},{"./_typed-array":126}],271:[function(require,module,exports){
'use strict';
var each         = require('./_array-methods')(0)
  , redefine     = require('./_redefine')
  , meta         = require('./_meta')
  , assign       = require('./_object-assign')
  , weak         = require('./_collection-weak')
  , isObject     = require('./_is-object')
  , has          = require('./_has')
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./_array-methods":27,"./_collection":37,"./_collection-weak":36,"./_has":54,"./_is-object":64,"./_meta":77,"./_object-assign":80,"./_redefine":102}],272:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');

// 23.4 WeakSet Objects
require('./_collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./_collection":37,"./_collection-weak":36}],273:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export   = require('./_export')
  , $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');
},{"./_add-to-unscopables":20,"./_array-includes":26,"./_export":47}],274:[function(require,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export   = require('./_export')
  , microtask = require('./_microtask')()
  , process   = require('./_global').process
  , isNode    = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn){
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});
},{"./_cof":33,"./_export":47,"./_global":53,"./_microtask":79}],275:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export')
  , cof     = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});
},{"./_cof":33,"./_export":47}],276:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Map', {toJSON: require('./_collection-to-json')('Map')});
},{"./_collection-to-json":35,"./_export":47}],277:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});
},{"./_export":47}],278:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});
},{"./_export":47}],279:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});
},{"./_export":47}],280:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});
},{"./_export":47}],281:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":18,"./_descriptors":43,"./_export":47,"./_object-dp":82,"./_object-forced-pam":84,"./_to-object":124}],282:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":18,"./_descriptors":43,"./_export":47,"./_object-dp":82,"./_object-forced-pam":84,"./_to-object":124}],283:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export  = require('./_export')
  , $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./_export":47,"./_object-to-array":94}],284:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = require('./_export')
  , ownKeys        = require('./_own-keys')
  , toIObject      = require('./_to-iobject')
  , gOPD           = require('./_object-gopd')
  , createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});
},{"./_create-property":39,"./_export":47,"./_object-gopd":85,"./_own-keys":95,"./_to-iobject":122}],285:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":43,"./_export":47,"./_object-forced-pam":84,"./_object-gopd":85,"./_object-gpo":89,"./_to-object":124,"./_to-primitive":125}],286:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":43,"./_export":47,"./_object-forced-pam":84,"./_object-gopd":85,"./_object-gpo":89,"./_to-object":124,"./_to-primitive":125}],287:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export')
  , $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./_export":47,"./_object-to-array":94}],288:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export     = require('./_export')
  , global      = require('./_global')
  , core        = require('./_core')
  , microtask   = require('./_microtask')()
  , OBSERVABLE  = require('./_wks')('observable')
  , aFunction   = require('./_a-function')
  , anObject    = require('./_an-object')
  , anInstance  = require('./_an-instance')
  , redefineAll = require('./_redefine-all')
  , hide        = require('./_hide')
  , forOf       = require('./_for-of')
  , RETURN      = forOf.RETURN;

var getMethod = function(fn){
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function(subscription){
  var cleanup = subscription._c;
  if(cleanup){
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function(subscription){
  return subscription._o === undefined;
};

var closeSubscription = function(subscription){
  if(!subscriptionClosed(subscription)){
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function(observer, subscriber){
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup      = subscriber(observer)
      , subscription = cleanup;
    if(cleanup != null){
      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch(e){
    observer.error(e);
    return;
  } if(subscriptionClosed(this))cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe(){ closeSubscription(this); }
});

var SubscriptionObserver = function(subscription){
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if(m)return m.call(observer, value);
      } catch(e){
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value){
    var subscription = this._s;
    if(subscriptionClosed(subscription))throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if(!m)throw value;
      value = m.call(observer, value);
    } catch(e){
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch(e){
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber){
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer){
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn){
    var that = this;
    return new (core.Promise || global.Promise)(function(resolve, reject){
      aFunction(fn);
      var subscription = that.subscribe({
        next : function(value){
          try {
            return fn(value);
          } catch(e){
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x){
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if(method){
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function(observer){
        return observable.subscribe(observer);
      });
    }
    return new C(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          try {
            if(forOf(x, false, function(it){
              observer.next(it);
              if(done)return RETURN;
            }) === RETURN)return;
          } catch(e){
            if(done)throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  },
  of: function of(){
    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          for(var i = 0; i < items.length; ++i){
            observer.next(items[i]);
            if(done)return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function(){ return this; });

$export($export.G, {Observable: $Observable});

require('./_set-species')('Observable');
},{"./_a-function":18,"./_an-instance":21,"./_an-object":22,"./_core":38,"./_export":47,"./_for-of":52,"./_global":53,"./_hide":55,"./_microtask":79,"./_redefine-all":101,"./_set-species":106,"./_wks":132}],289:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});
},{"./_an-object":22,"./_metadata":78}],290:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});
},{"./_an-object":22,"./_metadata":78}],291:[function(require,module,exports){
var Set                     = require('./es6.set')
  , from                    = require('./_array-from-iterable')
  , metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , getPrototypeOf          = require('./_object-gpo')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":22,"./_array-from-iterable":25,"./_metadata":78,"./_object-gpo":89,"./es6.set":236}],292:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":22,"./_metadata":78,"./_object-gpo":89}],293:[function(require,module,exports){
var metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":22,"./_metadata":78}],294:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":22,"./_metadata":78}],295:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":22,"./_metadata":78,"./_object-gpo":89}],296:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":22,"./_metadata":78}],297:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , aFunction                 = require('./_a-function')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});
},{"./_a-function":18,"./_an-object":22,"./_metadata":78}],298:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Set', {toJSON: require('./_collection-to-json')('Set')});
},{"./_collection-to-json":35,"./_export":47}],299:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export')
  , $at     = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./_export":47,"./_string-at":112}],300:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export     = require('./_export')
  , defined     = require('./_defined')
  , toLength    = require('./_to-length')
  , isRegExp    = require('./_is-regexp')
  , getFlags    = require('./_flags')
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});
},{"./_defined":42,"./_export":47,"./_flags":51,"./_is-regexp":65,"./_iter-create":67,"./_to-length":123}],301:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./_export":47,"./_string-pad":115}],302:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./_export":47,"./_string-pad":115}],303:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');
},{"./_string-trim":117}],304:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');
},{"./_string-trim":117}],305:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":130}],306:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":130}],307:[function(require,module,exports){
// https://github.com/ljharb/proposal-global
var $export = require('./_export');

$export($export.S, 'System', {global: require('./_global')});
},{"./_export":47,"./_global":53}],308:[function(require,module,exports){
var $iterators    = require('./es6.array.iterator')
  , redefine      = require('./_redefine')
  , global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , wks           = require('./_wks')
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}
},{"./_global":53,"./_hide":55,"./_iterators":71,"./_redefine":102,"./_wks":132,"./es6.array.iterator":146}],309:[function(require,module,exports){
var $export = require('./_export')
  , $task   = require('./_task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./_export":47,"./_task":119}],310:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./_global')
  , $export    = require('./_export')
  , invoke     = require('./_invoke')
  , partial    = require('./_partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./_export":47,"./_global":53,"./_invoke":59,"./_partial":98}],311:[function(require,module,exports){
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.umulh');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');
},{"./modules/_core":38,"./modules/es6.array.copy-within":136,"./modules/es6.array.every":137,"./modules/es6.array.fill":138,"./modules/es6.array.filter":139,"./modules/es6.array.find":141,"./modules/es6.array.find-index":140,"./modules/es6.array.for-each":142,"./modules/es6.array.from":143,"./modules/es6.array.index-of":144,"./modules/es6.array.is-array":145,"./modules/es6.array.iterator":146,"./modules/es6.array.join":147,"./modules/es6.array.last-index-of":148,"./modules/es6.array.map":149,"./modules/es6.array.of":150,"./modules/es6.array.reduce":152,"./modules/es6.array.reduce-right":151,"./modules/es6.array.slice":153,"./modules/es6.array.some":154,"./modules/es6.array.sort":155,"./modules/es6.array.species":156,"./modules/es6.date.now":157,"./modules/es6.date.to-iso-string":158,"./modules/es6.date.to-json":159,"./modules/es6.date.to-primitive":160,"./modules/es6.date.to-string":161,"./modules/es6.function.bind":162,"./modules/es6.function.has-instance":163,"./modules/es6.function.name":164,"./modules/es6.map":165,"./modules/es6.math.acosh":166,"./modules/es6.math.asinh":167,"./modules/es6.math.atanh":168,"./modules/es6.math.cbrt":169,"./modules/es6.math.clz32":170,"./modules/es6.math.cosh":171,"./modules/es6.math.expm1":172,"./modules/es6.math.fround":173,"./modules/es6.math.hypot":174,"./modules/es6.math.imul":175,"./modules/es6.math.log10":176,"./modules/es6.math.log1p":177,"./modules/es6.math.log2":178,"./modules/es6.math.sign":179,"./modules/es6.math.sinh":180,"./modules/es6.math.tanh":181,"./modules/es6.math.trunc":182,"./modules/es6.number.constructor":183,"./modules/es6.number.epsilon":184,"./modules/es6.number.is-finite":185,"./modules/es6.number.is-integer":186,"./modules/es6.number.is-nan":187,"./modules/es6.number.is-safe-integer":188,"./modules/es6.number.max-safe-integer":189,"./modules/es6.number.min-safe-integer":190,"./modules/es6.number.parse-float":191,"./modules/es6.number.parse-int":192,"./modules/es6.number.to-fixed":193,"./modules/es6.number.to-precision":194,"./modules/es6.object.assign":195,"./modules/es6.object.create":196,"./modules/es6.object.define-properties":197,"./modules/es6.object.define-property":198,"./modules/es6.object.freeze":199,"./modules/es6.object.get-own-property-descriptor":200,"./modules/es6.object.get-own-property-names":201,"./modules/es6.object.get-prototype-of":202,"./modules/es6.object.is":206,"./modules/es6.object.is-extensible":203,"./modules/es6.object.is-frozen":204,"./modules/es6.object.is-sealed":205,"./modules/es6.object.keys":207,"./modules/es6.object.prevent-extensions":208,"./modules/es6.object.seal":209,"./modules/es6.object.set-prototype-of":210,"./modules/es6.object.to-string":211,"./modules/es6.parse-float":212,"./modules/es6.parse-int":213,"./modules/es6.promise":214,"./modules/es6.reflect.apply":215,"./modules/es6.reflect.construct":216,"./modules/es6.reflect.define-property":217,"./modules/es6.reflect.delete-property":218,"./modules/es6.reflect.enumerate":219,"./modules/es6.reflect.get":222,"./modules/es6.reflect.get-own-property-descriptor":220,"./modules/es6.reflect.get-prototype-of":221,"./modules/es6.reflect.has":223,"./modules/es6.reflect.is-extensible":224,"./modules/es6.reflect.own-keys":225,"./modules/es6.reflect.prevent-extensions":226,"./modules/es6.reflect.set":228,"./modules/es6.reflect.set-prototype-of":227,"./modules/es6.regexp.constructor":229,"./modules/es6.regexp.flags":230,"./modules/es6.regexp.match":231,"./modules/es6.regexp.replace":232,"./modules/es6.regexp.search":233,"./modules/es6.regexp.split":234,"./modules/es6.regexp.to-string":235,"./modules/es6.set":236,"./modules/es6.string.anchor":237,"./modules/es6.string.big":238,"./modules/es6.string.blink":239,"./modules/es6.string.bold":240,"./modules/es6.string.code-point-at":241,"./modules/es6.string.ends-with":242,"./modules/es6.string.fixed":243,"./modules/es6.string.fontcolor":244,"./modules/es6.string.fontsize":245,"./modules/es6.string.from-code-point":246,"./modules/es6.string.includes":247,"./modules/es6.string.italics":248,"./modules/es6.string.iterator":249,"./modules/es6.string.link":250,"./modules/es6.string.raw":251,"./modules/es6.string.repeat":252,"./modules/es6.string.small":253,"./modules/es6.string.starts-with":254,"./modules/es6.string.strike":255,"./modules/es6.string.sub":256,"./modules/es6.string.sup":257,"./modules/es6.string.trim":258,"./modules/es6.symbol":259,"./modules/es6.typed.array-buffer":260,"./modules/es6.typed.data-view":261,"./modules/es6.typed.float32-array":262,"./modules/es6.typed.float64-array":263,"./modules/es6.typed.int16-array":264,"./modules/es6.typed.int32-array":265,"./modules/es6.typed.int8-array":266,"./modules/es6.typed.uint16-array":267,"./modules/es6.typed.uint32-array":268,"./modules/es6.typed.uint8-array":269,"./modules/es6.typed.uint8-clamped-array":270,"./modules/es6.weak-map":271,"./modules/es6.weak-set":272,"./modules/es7.array.includes":273,"./modules/es7.asap":274,"./modules/es7.error.is-error":275,"./modules/es7.map.to-json":276,"./modules/es7.math.iaddh":277,"./modules/es7.math.imulh":278,"./modules/es7.math.isubh":279,"./modules/es7.math.umulh":280,"./modules/es7.object.define-getter":281,"./modules/es7.object.define-setter":282,"./modules/es7.object.entries":283,"./modules/es7.object.get-own-property-descriptors":284,"./modules/es7.object.lookup-getter":285,"./modules/es7.object.lookup-setter":286,"./modules/es7.object.values":287,"./modules/es7.observable":288,"./modules/es7.reflect.define-metadata":289,"./modules/es7.reflect.delete-metadata":290,"./modules/es7.reflect.get-metadata":292,"./modules/es7.reflect.get-metadata-keys":291,"./modules/es7.reflect.get-own-metadata":294,"./modules/es7.reflect.get-own-metadata-keys":293,"./modules/es7.reflect.has-metadata":295,"./modules/es7.reflect.has-own-metadata":296,"./modules/es7.reflect.metadata":297,"./modules/es7.set.to-json":298,"./modules/es7.string.at":299,"./modules/es7.string.match-all":300,"./modules/es7.string.pad-end":301,"./modules/es7.string.pad-start":302,"./modules/es7.string.trim-left":303,"./modules/es7.string.trim-right":304,"./modules/es7.symbol.async-iterator":305,"./modules/es7.symbol.observable":306,"./modules/es7.system.global":307,"./modules/web.dom.iterable":308,"./modules/web.immediate":309,"./modules/web.timers":310}],312:[function(require,module,exports){
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

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

},{}],313:[function(require,module,exports){
'use strict';

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};

},{}],314:[function(require,module,exports){
'use strict';
var ansiRegex = require('ansi-regex');
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);

},{"ansi-regex":5}],315:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],316:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],317:[function(require,module,exports){
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

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

},{"./_stream_readable":319,"./_stream_writable":321,"core-util-is":312,"inherits":315}],318:[function(require,module,exports){
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

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":320,"core-util-is":312,"inherits":315}],319:[function(require,module,exports){
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

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;
  var ret;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    ret = null;

    // In cases where the decoder did not receive enough data
    // to produce a full chunk, then immediately received an
    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
    // howMuchToRead will see this and coerce the amount to
    // read to zero (because it's looking at the length of the
    // first <Buffer > in state.buffer), and we'll end up here.
    //
    // This can only happen via state.decoder -- no other venue
    // exists for pushing a zero-length chunk into state.buffer
    // and triggering this behavior. In this case, we return our
    // remaining data and end the stream, if appropriate.
    if (state.length > 0 && state.decoder) {
      ret = fromList(n, state);
      state.length -= ret.length;
    }

    if (state.length === 0)
      endReadable(this);

    return ret;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    process.nextTick(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    process.nextTick(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      process.nextTick(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    //if (state.objectMode && util.isNullOrUndefined(chunk))
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

},{"buffer":undefined,"core-util-is":312,"events":undefined,"inherits":315,"isarray":316,"stream":undefined,"string_decoder/":341}],320:[function(require,module,exports){
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


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":317,"core-util-is":312,"inherits":315}],321:[function(require,module,exports){
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

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      cb(er);
    });
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

},{"./_stream_duplex":317,"buffer":undefined,"core-util-is":312,"inherits":315,"stream":undefined}],322:[function(require,module,exports){
var Stream = require('stream'); // hack to fix a circular dependency issue when used with browserify
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');
if (!process.browser && process.env.READABLE_STREAM === 'disable') {
  module.exports = require('stream');
}

},{"./lib/_stream_duplex.js":317,"./lib/_stream_passthrough.js":318,"./lib/_stream_readable.js":319,"./lib/_stream_transform.js":320,"./lib/_stream_writable.js":321,"stream":undefined}],323:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return Promise.resolve(value.arg).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = arg;

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

},{}],324:[function(require,module,exports){
var SSH2Client = require('ssh2').Client;
var when = require('when');
var sequence = require('when/sequence');

function Client(config, logger) {

  if (!(this instanceof Client)) {
    return new Client(config);
  }

  this.config = config;

  this.logger = logger || console;

  return this;
}

Client.prototype.exec = function(commands) {
  
  if (!commands) {
    return when.resolve();
  }

  if (commands.constructor !== Array) {
    commands = [commands];
  }

  var config = this.config;
  var logger = this.logger;
  commandSequence = [];

  commands.forEach(function(cmd) {
    commandSequence.push(function() { return commandExecute(config, cmd, logger); });
  });

  return sequence(commandSequence);
  
};

function commandExecute(config, command, logger) {

  var d = when.defer();

  var conn = new SSH2Client();

  conn.on('ready', function() {

    logger.info('Client :: ready');

    conn.exec(command, function(err, stream) {

      if (err) {
        logger.error(err);
        return d.reject(err);
      }

      stream.on('close', function(code, signal) {

        logger.info('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();

        if (code !== 0) {
          var err = new Error("SSH connection ended with non-zero exit code");
          logger.error(err);
          return d.reject(err);
        }

        return d.resolve();

      }).on('data', function(data) {
        logger.info('STDOUT: ' + data);

      }).stderr.on('data', function(data) {
        logger.error('STDERR: ' + data);
      });

    });
  }).connect(config);

  return d.promise;

}

module.exports = Client;

},{"ssh2":336,"when":362,"when/sequence":361}],325:[function(require,module,exports){
module.exports = {
  SFTPStream: require('./lib/sftp'),
  SSH2Stream: require('./lib/ssh'),
  utils: require('./lib/utils'),
  constants: require('./lib/constants')
};
},{"./lib/constants":326,"./lib/sftp":329,"./lib/ssh":330,"./lib/utils":331}],326:[function(require,module,exports){
var i;
var keys;
var len;

var MESSAGE = exports.MESSAGE = {
  // Transport layer protocol -- generic (1-19)
  DISCONNECT: 1,
  IGNORE: 2,
  UNIMPLEMENTED: 3,
  DEBUG: 4,
  SERVICE_REQUEST: 5,
  SERVICE_ACCEPT: 6,

  // Transport layer protocol -- algorithm negotiation (20-29)
  KEXINIT: 20,
  NEWKEYS: 21,

  // Transport layer protocol -- key exchange method-specific (30-49)

  // User auth protocol -- generic (50-59)
  USERAUTH_REQUEST: 50,
  USERAUTH_FAILURE: 51,
  USERAUTH_SUCCESS: 52,
  USERAUTH_BANNER: 53,

  // User auth protocol -- user auth method-specific (60-79)

  // Connection protocol -- generic (80-89)
  GLOBAL_REQUEST: 80,
  REQUEST_SUCCESS: 81,
  REQUEST_FAILURE: 82,

  // Connection protocol -- channel-related (90-127)
  CHANNEL_OPEN: 90,
  CHANNEL_OPEN_CONFIRMATION: 91,
  CHANNEL_OPEN_FAILURE: 92,
  CHANNEL_WINDOW_ADJUST: 93,
  CHANNEL_DATA: 94,
  CHANNEL_EXTENDED_DATA: 95,
  CHANNEL_EOF: 96,
  CHANNEL_CLOSE: 97,
  CHANNEL_REQUEST: 98,
  CHANNEL_SUCCESS: 99,
  CHANNEL_FAILURE: 100

  // Reserved for client protocols (128-191)

  // Local extensions (192-155)
};
for (i = 0, keys = Object.keys(MESSAGE), len = keys.length; i < len; ++i)
  MESSAGE[MESSAGE[keys[i]]] = keys[i];
// context-specific message codes:
MESSAGE.KEXDH_INIT = 30;
MESSAGE.KEXDH_REPLY = 31;
MESSAGE.KEXDH_GEX_REQUEST = 34;
MESSAGE.KEXDH_GEX_GROUP = 31;
MESSAGE.KEXDH_GEX_INIT = 32;
MESSAGE.KEXDH_GEX_REPLY = 33;
MESSAGE.USERAUTH_PASSWD_CHANGEREQ = 60;
MESSAGE.USERAUTH_PK_OK = 60;
MESSAGE.USERAUTH_INFO_REQUEST = 60;
MESSAGE.USERAUTH_INFO_RESPONSE = 61;

var DISCONNECT_REASON = exports.DISCONNECT_REASON = {
  HOST_NOT_ALLOWED_TO_CONNECT: 1,
  PROTOCOL_ERROR: 2,
  KEY_EXCHANGE_FAILED: 3,
  RESERVED: 4,
  MAC_ERROR: 5,
  COMPRESSION_ERROR: 6,
  SERVICE_NOT_AVAILABLE: 7,
  PROTOCOL_VERSION_NOT_SUPPORTED: 8,
  HOST_KEY_NOT_VERIFIABLE: 9,
  CONNECTION_LOST: 10,
  BY_APPLICATION: 11,
  TOO_MANY_CONNECTIONS: 12,
  AUTH_CANCELED_BY_USER: 13,
  NO_MORE_AUTH_METHODS_AVAILABLE: 14,
  ILLEGAL_USER_NAME: 15
};
for (i = 0, keys = Object.keys(DISCONNECT_REASON), len = keys.length; i < len; ++i)
  DISCONNECT_REASON[DISCONNECT_REASON[keys[i]]] = keys[i];

var CHANNEL_OPEN_FAILURE = exports.CHANNEL_OPEN_FAILURE = {
  ADMINISTRATIVELY_PROHIBITED: 1,
  CONNECT_FAILED: 2,
  UNKNOWN_CHANNEL_TYPE: 3,
  RESOURCE_SHORTAGE: 4
};
for (i = 0, keys = Object.keys(CHANNEL_OPEN_FAILURE), len = keys.length; i < len; ++i)
  CHANNEL_OPEN_FAILURE[CHANNEL_OPEN_FAILURE[keys[i]]] = keys[i];

var TERMINAL_MODE = exports.TERMINAL_MODE = {
  TTY_OP_END: 0,        // Indicates end of options.
  VINTR: 1,             // Interrupt character; 255 if none. Similarly for the
                        //  other characters.  Not all of these characters are
                        //  supported on all systems.
  VQUIT: 2,             // The quit character (sends SIGQUIT signal on POSIX
                        //  systems).
  VERASE: 3,            // Erase the character to left of the cursor.
  VKILL: 4,             // Kill the current input line.
  VEOF: 5,              // End-of-file character (sends EOF from the terminal).
  VEOL: 6,              // End-of-line character in addition to carriage return
                        //  and/or linefeed.
  VEOL2: 7,             // Additional end-of-line character.
  VSTART: 8,            // Continues paused output (normally control-Q).
  VSTOP: 9,             // Pauses output (normally control-S).
  VSUSP: 10,            // Suspends the current program.
  VDSUSP: 11,           // Another suspend character.
  VREPRINT: 12,         // Reprints the current input line.
  VWERASE: 13,          // Erases a word left of cursor.
  VLNEXT: 14,           // Enter the next character typed literally, even if it
                        //  is a special character
  VFLUSH: 15,           // Character to flush output.
  VSWTCH: 16,           // Switch to a different shell layer.
  VSTATUS: 17,          // Prints system status line (load, command, pid, etc).
  VDISCARD: 18,         // Toggles the flushing of terminal output.
  IGNPAR: 30,           // The ignore parity flag.  The parameter SHOULD be 0
                        //  if this flag is FALSE, and 1 if it is TRUE.
  PARMRK: 31,           // Mark parity and framing errors.
  INPCK: 32,            // Enable checking of parity errors.
  ISTRIP: 33,           // Strip 8th bit off characters.
  INLCR: 34,            // Map NL into CR on input.
  IGNCR: 35,            // Ignore CR on input.
  ICRNL: 36,            // Map CR to NL on input.
  IUCLC: 37,            // Translate uppercase characters to lowercase.
  IXON: 38,             // Enable output flow control.
  IXANY: 39,            // Any char will restart after stop.
  IXOFF: 40,            // Enable input flow control.
  IMAXBEL: 41,          // Ring bell on input queue full.
  ISIG: 50,             // Enable signals INTR, QUIT, [D]SUSP.
  ICANON: 51,           // Canonicalize input lines.
  XCASE: 52,            // Enable input and output of uppercase characters by
                        //  preceding their lowercase equivalents with "\".
  ECHO: 53,             // Enable echoing.
  ECHOE: 54,            // Visually erase chars.
  ECHOK: 55,            // Kill character discards current line.
  ECHONL: 56,           // Echo NL even if ECHO is off.
  NOFLSH: 57,           // Don't flush after interrupt.
  TOSTOP: 58,           // Stop background jobs from output.
  IEXTEN: 59,           // Enable extensions.
  ECHOCTL: 60,          // Echo control characters as ^(Char).
  ECHOKE: 61,           // Visual erase for line kill.
  PENDIN: 62,           // Retype pending input.
  OPOST: 70,            // Enable output processing.
  OLCUC: 71,            // Convert lowercase to uppercase.
  ONLCR: 72,            // Map NL to CR-NL.
  OCRNL: 73,            // Translate carriage return to newline (output).
  ONOCR: 74,            // Translate newline to carriage return-newline (output).
  ONLRET: 75,           // Newline performs a carriage return (output).
  CS7: 90,              // 7 bit mode.
  CS8: 91,              // 8 bit mode.
  PARENB: 92,           // Parity enable.
  PARODD: 93,           // Odd parity, else even.
  TTY_OP_ISPEED: 128,   // Specifies the input baud rate in bits per second.
  TTY_OP_OSPEED: 129    // Specifies the output baud rate in bits per second.
};
for (i = 0, keys = Object.keys(TERMINAL_MODE), len = keys.length; i < len; ++i)
  TERMINAL_MODE[TERMINAL_MODE[keys[i]]] = keys[i];

var CHANNEL_EXTENDED_DATATYPE = exports.CHANNEL_EXTENDED_DATATYPE = {
  STDERR: 1
};
for (i = 0, keys = Object.keys(CHANNEL_EXTENDED_DATATYPE), len = keys.length; i < len; ++i)
  CHANNEL_EXTENDED_DATATYPE[CHANNEL_EXTENDED_DATATYPE[keys[i]]] = keys[i];

exports.SIGNALS = ['ABRT', 'ALRM', 'FPE', 'HUP', 'ILL', 'INT',
                   'QUIT', 'SEGV', 'TERM', 'USR1', 'USR2', 'KILL',
                   'PIPE'];

var KEX = [
      'diffie-hellman-group14-sha1', // REQUIRED
      'diffie-hellman-group1-sha1' // REQUIRED
    ],
    KEX_LIST = new Buffer(KEX.join(',')),
    SERVER_HOST_KEY = [
      'ssh-rsa', // RECOMMENDED
      'ssh-dss'  // REQUIRED
    ],
    SERVER_HOST_KEY_LIST = new Buffer(SERVER_HOST_KEY.join(',')),
    CIPHER = [
      'aes256-cbc',  // OPTIONAL
      'aes192-cbc',  // OPTIONAL
      'aes128-cbc',  // RECOMMENDED
      'blowfish-cbc',// OPTIONAL
      '3des-cbc',    // REQUIRED

      // http://tools.ietf.org/html/rfc4345#section-4:
      'arcfour256',
      'arcfour128',

      'cast128-cbc', // OPTIONAL
      'arcfour'      // OPTIONAL
      //'none'       // OPTIONAL
    ],
    CIPHER_LIST = new Buffer(CIPHER.join(',')),
    HMAC = [
      'hmac-md5',    // OPTIONAL      (digest length = key length = 16)
      'hmac-sha1',   // REQUIRED      (digest length = key length = 20)
      'hmac-sha2-256',
      'hmac-sha2-256-96',
      'hmac-sha2-512',
      'hmac-sha2-512-96',
      'hmac-ripemd160',
      'hmac-sha1-96',// RECOMMENDED   first 96 bits of HMAC-SHA1
                     //                (digest length = 12, key length = 20)
      'hmac-md5-96'  // OPTIONAL      first 96 bits of HMAC-MD5
                     //                (digest length = 12, key length = 16)
      //'none'       // OPTIONAL
    ],
    HMAC_LIST = new Buffer(HMAC.join(',')),
    COMPRESS = [
      'none'   // REQUIRED
      //'zlib' // OPTIONAL        ZLIB (LZ77) compression
    ],
    COMPRESS_LIST = new Buffer(COMPRESS.join(','));

if (process.versions.openssl >= '1.0.1') {
  if (process.version >= 'v0.11.12') {
    // node v0.11.12 introduced support for setting AAD, which is needed for
    // AES-GCM in SSH2
    CIPHER = [
      // http://tools.ietf.org/html/rfc5647
      'aes128-gcm',
      'aes128-gcm@openssh.com',
      'aes256-gcm',
      'aes256-gcm@openssh.com'
    ].concat(CIPHER);

    KEX = [
      'diffie-hellman-group-exchange-sha256',
      'diffie-hellman-group-exchange-sha1'
    ].concat(KEX);
    KEX_LIST = new Buffer(KEX.join(','));
  }
  CIPHER = [
    // http://tools.ietf.org/html/rfc4344#section-4
    'aes256-ctr',  // RECOMMENDED
    'aes192-ctr',  // RECOMMENDED
    'aes128-ctr'  // RECOMMENDED
  ].concat(CIPHER);
  CIPHER_LIST = new Buffer(CIPHER.join(','));

  // http://tools.ietf.org/html/rfc5647#section-5.1:
  //   If AES-GCM is selected as the encryption algorithm for a given
  //   tunnel, AES-GCM MUST also be selected as the Message Authentication
  //   Code (MAC) algorithm.  ***Conversely, if AES-GCM is selected as the MAC
  //   algorithm, it MUST also be selected as the encryption algorithm.***
  // Note: @openssh.com versions deviate from the above rule
  /*HMAC = [
    // http://tools.ietf.org/html/rfc5647
    'aes128-gcm',
    'aes128-gcm@openssh.com',
    'aes256-gcm',
    'aes256-gcm@openssh.com'
  ].concat(HMAC);
  HMAC_LIST = new Buffer(HMAC.join(','));*/
}

exports.ALGORITHMS = {
  KEX: KEX,
  KEX_LIST: KEX_LIST,
  KEX_LIST_SIZE: KEX_LIST.length,
  SERVER_HOST_KEY: SERVER_HOST_KEY,
  SERVER_HOST_KEY_LIST: SERVER_HOST_KEY_LIST,
  SERVER_HOST_KEY_LIST_SIZE: SERVER_HOST_KEY_LIST.length,
  CIPHER: CIPHER,
  CIPHER_LIST: CIPHER_LIST,
  CIPHER_LIST_SIZE: CIPHER_LIST.length,
  HMAC: HMAC,
  HMAC_LIST: HMAC_LIST,
  HMAC_LIST_SIZE: HMAC_LIST.length,
  COMPRESS: COMPRESS,
  COMPRESS_LIST: COMPRESS_LIST,
  COMPRESS_LIST_SIZE: COMPRESS_LIST.length
};
exports.SSH_TO_OPENSSL = {
  // ciphers
  'aes128-gcm': 'aes-128-gcm',
  'aes256-gcm': 'aes-256-gcm',
  'aes128-gcm@openssh.com': 'aes-128-gcm',
  'aes256-gcm@openssh.com': 'aes-256-gcm',
  '3des-cbc': 'des-ede3-cbc',
  'blowfish-cbc': 'bf-cbc',
  'aes256-cbc': 'aes-256-cbc',
  'aes192-cbc': 'aes-192-cbc',
  'aes128-cbc': 'aes-128-cbc',
  'idea-cbc': 'idea-cbc',
  'cast128-cbc': 'cast-cbc',
  'rijndael-cbc@lysator.liu.se': 'aes-256-cbc',
  'arcfour128': 'rc4',
  'arcfour256': 'rc4',
  'arcfour512': 'rc4',
  'arcfour': 'rc4',
  'camellia128-cbc': 'camellia-128-cbc',
  'camellia192-cbc': 'camellia-192-cbc',
  'camellia256-cbc': 'camellia-256-cbc',
  'camellia128-cbc@openssh.com': 'camellia-128-cbc',
  'camellia192-cbc@openssh.com': 'camellia-192-cbc',
  'camellia256-cbc@openssh.com': 'camellia-256-cbc',
  '3des-ctr': 'des-ede3',
  'blowfish-ctr': 'bf-ecb',
  'aes256-ctr': 'aes-256-ctr',
  'aes192-ctr': 'aes-192-ctr',
  'aes128-ctr': 'aes-128-ctr',
  'cast128-ctr': 'cast5-ecb',
  'camellia128-ctr': 'camellia-128-ecb',
  'camellia192-ctr': 'camellia-192-ecb',
  'camellia256-ctr': 'camellia-256-ecb',
  'camellia128-ctr@openssh.com': 'camellia-128-ecb',
  'camellia192-ctr@openssh.com': 'camellia-192-ecb',
  'camellia256-ctr@openssh.com': 'camellia-256-ecb',
  // hmac
  'hmac-sha1-96': 'sha1',
  'hmac-sha1': 'sha1',
  'hmac-sha2-256': 'sha256',
  'hmac-sha2-256-96': 'sha256',
  'hmac-sha2-512': 'sha512',
  'hmac-sha2-512-96': 'sha512',
  'hmac-md5-96': 'md5',
  'hmac-md5': 'md5',
  'hmac-ripemd160': 'ripemd160'
};

var BUGS = exports.BUGS = {
  BAD_DHGEX: 1
};

exports.BUGGY_IMPLS = [
  [ 'Cisco-1.25', BUGS.BAD_DHGEX ]
];

},{}],327:[function(require,module,exports){
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// Set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
BigInteger.prototype.am = am3;
dbits = 28;

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);   // normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);  // "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {   // Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;       // y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;   // y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;    // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;       // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))  // force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this^2
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {  // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// Expose the Barrett function
BigInteger.prototype.Barrett = Barrett

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)

module.exports = BigInteger;


},{}],328:[function(require,module,exports){
// TODO:
//    * handle multi-line header values (OpenSSH)?

var utils;

var RE_PPK = /^PuTTY-User-Key-File-2: ssh-(rsa|dss)\r?\nEncryption: (aes256-cbc|none)\r?\nComment: ([^\r\n]*)\r?\nPublic-Lines: \d+\r?\n([\s\S]+?)\r?\nPrivate-Lines: \d+\r?\n([\s\S]+?)\r?\nPrivate-MAC: ([^\r\n]+)/;
var RE_HEADER_OPENSSH_PRIV = /^-----BEGIN (RSA|DSA) PRIVATE KEY-----$/i;
var RE_FOOTER_OPENSSH_PRIV = /^-----END (?:RSA|DSA) PRIVATE KEY-----$/i;
var RE_HEADER_OPENSSH_PUB = /^(ssh-(rsa|dss)(?:-cert-v0[01]@openssh.com)?) ([A-Z0-9a-z\/+=]+)(?:$|\s+([\S].*)?)$/i;
var RE_HEADER_RFC4716_PUB = /^---- BEGIN SSH2 PUBLIC KEY ----$/i;
var RE_FOOTER_RFC4716_PUB = /^---- END SSH2 PUBLIC KEY ----$/i;
var RE_HEADER_OPENSSH = /^([^:]+):\s*([\S].*)?$/i;
var RE_HEADER_RFC4716 = /^([^:]+): (.*)?$/i;

module.exports = function(data) {
  if (Buffer.isBuffer(data))
    data = data.toString('utf8');
  else if (typeof data !== 'string')
    return new Error('Key data must be a Buffer or string');

  var ret = {
        fulltype: undefined,
        type: undefined,
        extra: undefined,
        comment: undefined,
        encryption: undefined,
        private: undefined,
        privateOrig: undefined,
        public: undefined,
        publicOrig: undefined
      };
  var m;
  var i;
  var len;

  data = data.trim().split(/\r\n|\n/);

  while (!data[0].length)
    data.shift();
  while (!data.slice(-1)[0].length)
    data.pop();

  var orig = data.join('\n');

  if ((m = RE_HEADER_OPENSSH_PRIV.exec(data[0]))
      && RE_FOOTER_OPENSSH_PRIV.test(data.slice(-1))) {
    // OpenSSH private key
    ret.type = (m[1].toLowerCase() === 'dsa' ? 'dss' : 'rsa');
    if (!RE_HEADER_OPENSSH.test(data[1])) {
      // unencrypted, no headers
      ret.private = new Buffer(data.slice(1, -1).join(''), 'base64');
    } else {
      // possibly encrypted, headers
      for (i = 1, len = data.length; i < len; ++i) {
        m = RE_HEADER_OPENSSH.exec(data[i]);
        if (m) {
          m[1] = m[1].toLowerCase();
          if (m[1] === 'dek-info') {
            m[2] = m[2].split(',');
            ret.encryption = m[2][0].toLowerCase();
            if (m[2].length > 1)
              ret.extra = m[2].slice(1);
          }
        } else if (data[i].length)
          break;
      }
      ret.private = new Buffer(data.slice(i, -1).join(''), 'base64');
    }
    ret.privateOrig = new Buffer(orig);
  } else if (m = RE_HEADER_OPENSSH_PUB.exec(data[0])) {
    // OpenSSH public key
    ret.fulltype = m[1];
    ret.type = m[2].toLowerCase();
    ret.public = new Buffer(m[3], 'base64');
    ret.publicOrig = new Buffer(orig);
    ret.comment = m[4];
  } else if (RE_HEADER_RFC4716_PUB.test(data[0])
             && RE_FOOTER_RFC4716_PUB.test(data.slice(-1))) {
    if (data[1].indexOf(': ') === -1) {
      // no headers
      ret.public = new Buffer(data.slice(1, -1).join(''), 'base64');
    } else {
      // headers
      for (i = 1, len = data.length; i < len; ++i) {
        if (data[i].indexOf(': ') === -1) {
          if (data[i].length)
            break; // start of key data
          else
            continue; // empty line
        }
        while (data[i].substr(-1) === '\\') {
          if (i + 1 < len) {
            data[i] = data[i].slice(0, -1) + data[i + 1];
            data.splice(i + 1, 1);
            --len;
          } else
            return new Error('RFC4716 public key missing header continuation line');
        }
        m = RE_HEADER_RFC4716.exec(data[i]);
        if (m) {
          m[1] = m[1].toLowerCase();
          if (m[1] === 'comment') {
            ret.comment = m[2] || '';
            if (ret.comment[0] === '"' && ret.comment.substr(-1) === '"')
              ret.comment = ret.comment.slice(1, -1);
          }
        } else
          return new Error('RFC4716 public key invalid header line');
      }
      ret.public = new Buffer(data.slice(i, -1).join(''), 'base64');
    }
    len = ret.public.readUInt32BE(0, true);
    var fulltype = ret.public.toString('ascii', 4, 4 + len);
    ret.fulltype = fulltype;
    if (fulltype === 'ssh-dss')
      ret.type = 'dss';
    else if (fulltype === 'ssh-rsa')
      ret.type = 'rsa';
    else
      return new Error('Unsupported RFC4716 public key type: ' + fulltype);
    ret.public = ret.public.slice(11);
    ret.publicOrig = new Buffer(orig);
  } else if (m = RE_PPK.exec(orig)) {
    // m[1] = short type
    // m[2] = encryption type
    // m[3] = comment
    // m[4] = base64-encoded public key data:
    //         for "ssh-rsa":
    //          string "ssh-rsa"
    //          mpint  e    (public exponent)
    //          mpint  n    (modulus)
    //         for "ssh-dss":
    //          string "ssh-dss"
    //          mpint p     (modulus)
    //          mpint q     (prime)
    //          mpint g     (base number)
    //          mpint y     (public key parameter: g^x mod p)
    // m[5] = base64-encoded private key data:
    //         for "ssh-rsa":
    //          mpint  d    (private exponent)
    //          mpint  p    (prime 1)
    //          mpint  q    (prime 2)
    //          mpint  iqmp ([inverse of q] mod p)
    //         for "ssh-dss":
    //          mpint x     (private key parameter)
    // m[6] = SHA1 HMAC over:
    //          string  name of algorithm ("ssh-dss", "ssh-rsa")
    //          string  encryption type
    //          string  comment
    //          string  public key data
    //          string  private-plaintext (including the final padding)

    // avoid cyclic require by requiring on first use
    if (!utils)
      utils = require('./utils');

    ret.ppk = true;
    ret.type = m[1];
    ret.fulltype = 'ssh-' + m[1];
    if (m[2] !== 'none')
      ret.encryption = m[2];
    ret.comment = m[3];

    ret.public = new Buffer(m[4].replace(/\r?\n/g, ''), 'base64');
    var privateKey = new Buffer(m[5].replace(/\r?\n/g, ''), 'base64');

    ret.privateMAC = m[6].replace(/\r?\n/g, '');

    // automatically verify private key MAC if we don't need to wait for
    // decryption
    if (!ret.encryption) {
      var valid = utils.verifyPPKMAC(ret, undefined, privateKey);
      if (!valid)
        throw new Error('PPK MAC mismatch');
    }

    // generate a PEM encoded version of the public key
    var pubkey = utils.genPublicKey(ret);
    ret.public = pubkey.public;
    ret.publicOrig = pubkey.publicOrig;

    ret.private = privateKey;

    // automatically convert private key data to OpenSSL format (including PEM)
    // if we don't need to wait for decryption
    if (!ret.encryption)
      utils.convertPPKPrivate(ret);
  } else
    return new Error('Unsupported key format');

  return ret;
};

},{"./utils":331}],329:[function(require,module,exports){
// TODO: support EXTENDED request packets

var TransformStream = require('stream').Transform;
var ReadableStream = require('stream').Readable;
var WritableStream = require('stream').Writable;
var constants = process.binding('constants');
var util = require('util');
var inherits = util.inherits;
var isDate = util.isDate;
var listenerCount = require('events').EventEmitter.listenerCount;
var fs = require('fs');

var readString = require('./utils').readString;
var readInt = require('./utils').readInt;

var ATTR = {
  SIZE: 0x00000001,
  UIDGID: 0x00000002,
  PERMISSIONS: 0x00000004,
  ACMODTIME: 0x00000008,
  EXTENDED: 0x80000000
};

var STATUS_CODE = {
  OK: 0,
  EOF: 1,
  NO_SUCH_FILE: 2,
  PERMISSION_DENIED: 3,
  FAILURE: 4,
  BAD_MESSAGE: 5,
  NO_CONNECTION: 6,
  CONNECTION_LOST: 7,
  OP_UNSUPPORTED: 8
};
Object.keys(STATUS_CODE).forEach(function(key) {
  STATUS_CODE[STATUS_CODE[key]] = key;
});
SFTPStream.STATUS_CODE = STATUS_CODE;

var REQUEST = {
  INIT: 1,
  OPEN: 3,
  CLOSE: 4,
  READ: 5,
  WRITE: 6,
  LSTAT: 7,
  FSTAT: 8,
  SETSTAT: 9,
  FSETSTAT: 10,
  OPENDIR: 11,
  READDIR: 12,
  REMOVE: 13,
  MKDIR: 14,
  RMDIR: 15,
  REALPATH: 16,
  STAT: 17,
  RENAME: 18,
  READLINK: 19,
  SYMLINK: 20,
  EXTENDED: 200
};
Object.keys(REQUEST).forEach(function(key) {
  REQUEST[REQUEST[key]] = key;
});

var RESPONSE = {
  VERSION: 2,
  STATUS: 101,
  HANDLE: 102,
  DATA: 103,
  NAME: 104,
  ATTRS: 105,
  EXTENDED: 201
};
Object.keys(RESPONSE).forEach(function(key) {
  RESPONSE[RESPONSE[key]] = key;
});

var OPEN_MODE = {
  READ: 0x00000001,
  WRITE: 0x00000002,
  APPEND: 0x00000004,
  CREAT: 0x00000008,
  TRUNC: 0x00000010,
  EXCL: 0x00000020
};
SFTPStream.OPEN_MODE = OPEN_MODE;

var MAX_PKT_LEN = 34000;
var MAX_REQID = Math.pow(2, 32) - 1;
var CLIENT_VERSION_BUFFER = new Buffer([0, 0, 0, 5 /* length */,
                                        REQUEST.INIT,
                                        0, 0, 0, 3 /* version */]);
var SERVER_VERSION_BUFFER = new Buffer([0, 0, 0, 5 /* length */,
                                        RESPONSE.VERSION,
                                        0, 0, 0, 3 /* version */]);
/*
  http://tools.ietf.org/html/draft-ietf-secsh-filexfer-02:

     The maximum size of a packet is in practice determined by the client
     (the maximum size of read or write requests that it sends, plus a few
     bytes of packet overhead).  All servers SHOULD support packets of at
     least 34000 bytes (where the packet size refers to the full length,
     including the header above).  This should allow for reads and writes
     of at most 32768 bytes.

  OpenSSH caps this to 256kb instead of the ~34kb as mentioned in the sftpv3
  spec.
*/
var RE_OPENSSH = /^SSH-2.0-(?:OpenSSH|dropbear)/;
var OPENSSH_MAX_DATA_LEN = (256 * 1024) - (2 * 1024)/*account for header data*/;

function DEBUG_NOOP(msg) {}

function SFTPStream(cfg, remoteIdentRaw) {
  if (typeof cfg === 'string' && !remoteIdentRaw) {
    remoteIdentRaw = cfg;
    cfg = undefined;
  }
  if (typeof cfg !== 'object' || !cfg)
    cfg = {};

  TransformStream.call(this, {
    highWaterMark: (typeof cfg.highWaterMark === 'number'
                    ? cfg.highWaterMark
                    : 32 * 1024)
  });

  this.debug = (typeof cfg.debug === 'function' ? cfg.debug : DEBUG_NOOP);
  this.server = (cfg.server ? true : false);
  this._isOpenSSH = (remoteIdentRaw && RE_OPENSSH.test(remoteIdentRaw));
  this._needContinue = false;
  this._state = {
    // common
    status: 'packet_header',
    writeReqid: -1,
    pktLeft: undefined,
    pktHdrBuf: new Buffer(9), // room for pktLen + pktType + req id
    pktBuf: undefined,
    pktType: undefined,
    version: undefined,
    extensions: {},

    // client
    maxDataLen: (this._isOpenSSH ? OPENSSH_MAX_DATA_LEN : 32768),
    requests: {}
  };

  var self = this;
  this.on('end', function() {
    self.readable = false;
  }).on('finish', onFinish)
    .on('prefinish', onFinish);
  function onFinish() {
    self.writable = false;
    self._cleanup(false);
  }

  if (!this.server)
    this.push(CLIENT_VERSION_BUFFER);
}
inherits(SFTPStream, TransformStream);

SFTPStream.prototype.__read = TransformStream.prototype._read;
SFTPStream.prototype._read = function(n) {
  if (this._needContinue) {
    this._needContinue = false;
    this.emit('continue');
  }
  return this.__read(n);
};
SFTPStream.prototype.__push = TransformStream.prototype.push;
SFTPStream.prototype.push = function(chunk, encoding) {
  if (!this.readable)
    return false;
  if (chunk === null)
    this.readable = false;
  var ret = this.__push(chunk, encoding);
  this._needContinue = (ret === false);
  return ret;
};

SFTPStream.prototype._cleanup = function(callback) {
  var state = this._state;

  state.pktBuf = undefined; // give GC something to do

  var requests = state.requests;
  var keys = Object.keys(requests);
  var len = keys.length;
  if (len) {
    if (this.readable) {
      var err = new Error('SFTP session ended early');
      for (var i = 0, cb; i < len; ++i)
        (cb = requests[keys[i]].cb) && cb(err);
    }
    state.requests = {};
  }

  if (this.readable)
    this.push(null);
  else if (!this._readableState.endEmitted && !this._readableState.flowing) {
    // Ugh!
    this.resume();
  }
  if (callback !== false) {
    this.debug('DEBUG[SFTP]: Parser: Malformed packet');
    callback && callback(new Error('Malformed packet'));
  }
};

SFTPStream.prototype._transform = function(chunk, encoding, callback) {
  var state = this._state;
  var server = this.server;
  var status = state.status;
  var pktType = state.pktType;
  var pktBuf = state.pktBuf;
  var pktLeft = state.pktLeft;
  var version = state.version;
  var pktHdrBuf = state.pktHdrBuf;
  var requests = state.requests;
  var debug = this.debug;
  var chunkLen = chunk.length;
  var chunkPos = 0;
  var buffer;
  var chunkLeft;
  var id;

  while (true) {
    if (status === 'discard') {
      chunkLeft = (chunkLen - chunkPos);
      if (pktLeft <= chunkLeft) {
        chunkPos += pktLeft;
        pktLeft = 0;
        status = 'packet_header';
        buffer = pktBuf = undefined;
      } else {
        pktLeft -= chunkLeft;
        break;
      }
    } else if (pktBuf !== undefined) {
      chunkLeft = (chunkLen - chunkPos);
      if (pktLeft <= chunkLeft) {
        chunk.copy(pktBuf,
                   pktBuf.length - pktLeft,
                   chunkPos,
                   chunkPos + pktLeft);
        chunkPos += pktLeft;
        pktLeft = 0;
        buffer = pktBuf;
        pktBuf = undefined;
        continue;
      } else {
        chunk.copy(pktBuf, pktBuf.length - pktLeft, chunkPos);
        pktLeft -= chunkLeft;
        break;
      }
    } else if (status === 'packet_header') {
      if (!buffer) {
        pktLeft = 5;
        pktBuf = pktHdrBuf;
      } else {
        // here we read the right-most 5 bytes from buffer (pktHdrBuf)
        pktLeft = buffer.readUInt32BE(4, true) - 1; // account for type byte
        pktType = buffer[8];

        if (server) {
          if (version === undefined && pktType !== REQUEST.INIT) {
            debug('DEBUG[SFTP]: Parser: Unexpected packet before init');
            status = 'bad_pkt';
          } else if (version !== undefined && pktType === REQUEST.INIT) {
            debug('DEBUG[SFTP]: Parser: Unexpected duplicate init');
            status = 'bad_pkt';
          } else if (pktLeft > MAX_PKT_LEN) {
            debug('DEBUG[SFTP]: Parser: Packet length ('
                  + pktLeft
                  + ') exceeds max length ('
                  + MAX_PKT_LEN
                  + ')');
            status = 'bad_pkt';
          } else if (pktType === REQUEST.EXTENDED)
            status = 'bad_pkt';
          else if (REQUEST[pktType] === undefined) {
            debug('DEBUG[SFTP]: Parser: Unsupported packet type: ' + pktType);
            status = 'discard';
          }
        } else if (version === undefined && pktType !== RESPONSE.VERSION) {
          debug('DEBUG[SFTP]: Parser: Unexpected packet before version');
          status = 'bad_pkt';
        } else if (version !== undefined && pktType === RESPONSE.VERSION) {
          debug('DEBUG[SFTP]: Parser: Unexpected duplicate version');
          status = 'bad_pkt';
        } else if (RESPONSE[pktType] === undefined)
          status = 'discard';

        if (status === 'bad_pkt') {
          // copy original packet info
          pktHdrBuf.writeUInt32BE(pktLeft, 0, true);
          pktHdrBuf[4] = pktType;

          pktLeft = 4;
          pktBuf = pktHdrBuf;
        } else {
          pktBuf = new Buffer(pktLeft);
          status = 'payload';
        }
      }
    } else if (status === 'payload') {
      if (pktType === RESPONSE.VERSION || pktType === REQUEST.INIT) {
        /*
          uint32 version
          <extension data>
        */
        version = state.version = readInt(buffer, 0, this, callback);
        if (version === false)
          return;
        if (version < 3) {
          this._cleanup();
          return callback(new Error('Incompatible SFTP version: ' + version));
        } else if (server)
          this.push(SERVER_VERSION_BUFFER);

        var buflen = buffer.length;
        var extname;
        var extdata;
        buffer._pos = 4;
        while (buffer._pos < buflen) {
          extname = readString(buffer, buffer._pos, 'ascii', this, callback);
          if (extname === false)
            return;
          extdata = readString(buffer, buffer._pos, 'ascii', this, callback);
          if (extdata === false)
            return;
          if (state.extensions[extname])
            state.extensions[extname].push(extdata);
          else
            state.extensions[extname] = [ extdata ];
        }

        this.emit('ready');
      } else {
        /*
          All other packets (client and server) begin with a (client) request
          id:
          uint32     id
        */
        id = readInt(buffer, 0, this, callback);
        if (id === false)
          return;

        var filename;
        var attrs;
        var handle;
        var data;

        if (!server) {
          var req = requests[id];
          var cb = req && req.cb;
          debug('DEBUG[SFTP]: Parser: Response: ' + RESPONSE[pktType]);
          if (req && cb) {
            if (pktType === RESPONSE.STATUS) {
              /*
                uint32     error/status code
                string     error message (ISO-10646 UTF-8)
                string     language tag
              */
              var code = readInt(buffer, 4, this, callback);
              if (code === false)
                return;
              var msg = readString(buffer, 8, 'utf8', this, callback);
              if (msg === false)
                return;
              var lang = readString(buffer,
                                    buffer._pos,
                                    'ascii',
                                    this,
                                    callback);
              if (lang === false)
                return;

              if (code === STATUS_CODE.OK)
                cb();
              else {
                var err = new Error(msg || STATUS_CODE[code]);
                err.code = code;
                err.lang = lang;
                cb(err);
              }
            } else if (pktType === RESPONSE.HANDLE) {
              /*
                string     handle
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              cb(undefined, handle);
            } else if (pktType === RESPONSE.DATA) {
              /*
                string     data
              */
              if (req.buffer) {
                // we have already pre-allocated space to store the data
                var dataLen = readInt(buffer, 4, this, callback);
                if (dataLen === false)
                  return;
                var reqBufLen = req.buffer.length;
                if (dataLen > reqBufLen) {
                  // truncate response data to fit expected size
                  buffer.writeUInt32BE(reqBufLen, 4, true);
                }
                data = readString(buffer, 4, req.buffer, this, callback);
                if (data === false)
                  return;
                cb(undefined, data, dataLen);
              } else {
                data = readString(buffer, 4, this, callback);
                if (data === false)
                  return;
                cb(undefined, data);
              }
            } else if (pktType === RESPONSE.NAME) {
              /*
                uint32     count
                repeats count times:
                        string     filename
                        string     longname
                        ATTRS      attrs
              */
              var namesLen = readInt(buffer, 4, this, callback);
              if (namesLen === false)
                return;
              var names = [],
                  longname;
              buffer._pos = 8;
              for (var i = 0; i < namesLen; ++i) {
                // we are going to assume UTF-8 for filenames despite the SFTPv3
                // spec not specifying an encoding because the specs for newer
                // versions of the protocol all explicitly specify UTF-8 for
                // filenames
                filename = readString(buffer,
                                      buffer._pos,
                                      'utf8',
                                      this,
                                      callback);
                if (filename === false)
                  return;
                // `longname` only exists in SFTPv3 and since it typically will
                // contain the filename, we assume it is also UTF-8
                longname = readString(buffer,
                                      buffer._pos,
                                      'utf8',
                                      this,
                                      callback);
                if (longname === false)
                  return;
                attrs = readAttrs(buffer, buffer._pos, this, callback);
                if (attrs === false)
                  return;
                names.push({
                  filename: filename,
                  longname: longname,
                  attrs: attrs
                });
              }
              cb(undefined, names);
            } else if (pktType === RESPONSE.ATTRS) {
              /*
                ATTRS      attrs
              */
              attrs = readAttrs(buffer, 4, this, callback);
              if (attrs === false)
                return;
              cb(undefined, attrs);
            } else if (pktType === RESPONSE.EXTENDED) {
              if (req.extended) {
                switch (req.extended) {
                  case 'statvfs@openssh.com':
                  case 'fstatvfs@openssh.com':
                    /*
                      uint64    f_bsize   // file system block size
                      uint64    f_frsize  // fundamental fs block size
                      uint64    f_blocks  // number of blocks (unit f_frsize)
                      uint64    f_bfree   // free blocks in file system
                      uint64    f_bavail  // free blocks for non-root
                      uint64    f_files   // total file inodes
                      uint64    f_ffree   // free file inodes
                      uint64    f_favail  // free file inodes for to non-root
                      uint64    f_fsid    // file system id
                      uint64    f_flag    // bit mask of f_flag values
                      uint64    f_namemax // maximum filename length
                    */
                    var stats = {
                      f_bsize: undefined,
                      f_frsize: undefined,
                      f_blocks: undefined,
                      f_bfree: undefined,
                      f_bavail: undefined,
                      f_files: undefined,
                      f_ffree: undefined,
                      f_favail: undefined,
                      f_sid: undefined,
                      f_flag: undefined,
                      f_namemax: undefined
                    };
                    stats.f_bsize = readUInt64BE(buffer, 4, this, callback);
                    if (stats.f_bsize === false)
                      return;
                    stats.f_frsize = readUInt64BE(buffer, 12, this, callback);
                    if (stats.f_frsize === false)
                      return;
                    stats.f_blocks = readUInt64BE(buffer, 20, this, callback);
                    if (stats.f_blocks === false)
                      return;
                    stats.f_bfree = readUInt64BE(buffer, 28, this, callback);
                    if (stats.f_bfree === false)
                      return;
                    stats.f_bavail = readUInt64BE(buffer, 36, this, callback);
                    if (stats.f_bavail === false)
                      return;
                    stats.f_files = readUInt64BE(buffer, 44, this, callback);
                    if (stats.f_files === false)
                      return;
                    stats.f_ffree = readUInt64BE(buffer, 52, this, callback);
                    if (stats.f_ffree === false)
                      return;
                    stats.f_favail = readUInt64BE(buffer, 60, this, callback);
                    if (stats.f_favail === false)
                      return;
                    stats.f_sid = readUInt64BE(buffer, 68, this, callback);
                    if (stats.f_sid === false)
                      return;
                    stats.f_flag = readUInt64BE(buffer, 76, this, callback);
                    if (stats.f_flag === false)
                      return;
                    stats.f_namemax = readUInt64BE(buffer, 84, this, callback);
                    if (stats.f_namemax === false)
                      return;
                    cb(undefined, stats);
                  break;
                }
              }
              // XXX: at least provide the raw buffer data to the callback in
              // case of unexpected extended response?
              cb();
            }
          }
          if (req)
            delete requests[id];
        } else {
          // server
          var evName = REQUEST[pktType];
          var offset;
          var path;

          debug('DEBUG[SFTP]: Parser: Request: ' + evName);
          if (listenerCount(this, evName)) {
            if (pktType === REQUEST.OPEN) {
              /*
                string        filename
                uint32        pflags
                ATTRS         attrs
              */
              filename = readString(buffer, 4, 'utf8', this, callback);
              if (filename === false)
                return;
              var pflags = readInt(buffer, buffer._pos, this, callback);
              if (pflags === false)
                return;
              attrs = readAttrs(buffer, buffer._pos + 4, this, callback);
              if (attrs === false)
                return;
              this.emit(evName, id, filename, pflags, attrs);
            } else if (pktType === REQUEST.CLOSE
                       || pktType === REQUEST.FSTAT
                       || pktType === REQUEST.READDIR) {
              /*
                string     handle
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              this.emit(evName, id, handle);
            } else if (pktType === REQUEST.READ) {
              /*
                string     handle
                uint64     offset
                uint32     len
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              offset = readUInt64BE(buffer, buffer._pos, this, callback);
              if (offset === false)
                return;
              var len = readInt(buffer, buffer._pos, this, callback);
              if (len === false)
                return;
              this.emit(evName, id, handle, offset, len);
            } else if (pktType === REQUEST.WRITE) {
              /*
                string     handle
                uint64     offset
                string     data
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              offset = readUInt64BE(buffer, buffer._pos, this, callback);
              if (offset === false)
                return;
              data = readString(buffer, buffer._pos, this, callback);
              if (data === false)
                return;
              this.emit(evName, id, handle, offset, data);
            } else if (pktType === REQUEST.LSTAT
                       || pktType === REQUEST.STAT
                       || pktType === REQUEST.OPENDIR
                       || pktType === REQUEST.REMOVE
                       || pktType === REQUEST.RMDIR
                       || pktType === REQUEST.REALPATH
                       || pktType === REQUEST.READLINK) {
              /*
                string     path
              */
              path = readString(buffer, 4, 'utf8', this, callback);
              if (path === false)
                return;
              this.emit(evName, id, path);
            } else if (pktType === REQUEST.SETSTAT
                       || pktType === REQUEST.MKDIR) {
              /*
                string     path
                ATTRS      attrs
              */
              path = readString(buffer, 4, 'utf8', this, callback);
              if (path === false)
                return;
              attrs = readAttrs(buffer, buffer._pos, this, callback);
              if (attrs === false)
                return;
              this.emit(evName, id, path, attrs);
            } else if (pktType === REQUEST.FSETSTAT) {
              /*
                string     handle
                ATTRS      attrs
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              attrs = readAttrs(buffer, buffer._pos, this, callback);
              if (attrs === false)
                return;
              this.emit(evName, id, handle, attrs);
            } else if (pktType === REQUEST.RENAME
                       || pktType === REQUEST.SYMLINK) {
              /*
                RENAME:
                  string     oldpath
                  string     newpath
                SYMLINK:
                  string     linkpath
                  string     targetpath
              */
              var str1;
              var str2;
              str1 = readString(buffer, 4, 'utf8', this, callback);
              if (str1 === false)
                return;
              str2 = readString(buffer, buffer._pos, 'utf8', this, callback);
              if (str2 === false)
                return;
              if (pktType === REQUEST.SYMLINK && this._isOpenSSH) {
                // OpenSSH has linkpath and targetpath positions switched
                this.emit(evName, id, str2, str1);
              } else
                this.emit(evName, id, str1, str2);
            }
          } else {
            // automatically reject request if no handler for request type
            this.status(id, STATUS_CODE.OP_UNSUPPORTED);
          }
        }
      }

      // prepare for next packet
      status = 'packet_header';
      buffer = pktBuf = undefined;
    } else if (status === 'bad_pkt') {
      if (server && buffer[4] !== REQUEST.INIT) {
        var errCode = (buffer[4] === REQUEST.EXTENDED
                       ? STATUS_CODE.OP_UNSUPPORTED
                       : STATUS_CODE.FAILURE);

        // no request id for init/version packets, so we have no way to send a
        // status response, so we just close up shop ...
        if (buffer[4] === REQUEST.INIT || buffer[4] === RESPONSE.VERSION)
          return this._cleanup(callback);

        id = readInt(buffer, 5, this, callback);
        if (id === false)
          return;
        this.status(id, errCode);
      }

      // by this point we have already read the type byte and the id bytes, so
      // we subtract those from the number of bytes to skip
      pktLeft = buffer.readUInt32BE(0, true) - 5;

      status = 'discard';
    }

    if (chunkPos >= chunkLen)
      break;
  }

  state.status = status;
  state.pktType = pktType;
  state.pktBuf = pktBuf;
  state.pktLeft = pktLeft;
  state.version = version;

  callback();
};

// client
SFTPStream.prototype.createReadStream = function(path, options) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  return new ReadStream(this, path, options);
};
SFTPStream.prototype.createWriteStream = function(path, options) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  return new WriteStream(this, path, options);
};
SFTPStream.prototype.open = function(path, flags_, attrs, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  if (typeof attrs === 'function') {
    cb = attrs;
    attrs = undefined;
  }

  var flags = stringToFlags(flags_);
  if (flags === null)
    throw new Error('Unknown flags string: ' + flags_);

  var attrFlags = 0;
  var attrBytes = 0;
  if (typeof attrs === 'object') {
    attrs = attrsToBytes(attrs);
    attrFlags = attrs.flags;
    attrBytes = attrs.nbytes;
    attrs = attrs.bytes;
  }

  /*
    uint32        id
    string        filename
    uint32        pflags
    ATTRS         attrs
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen + 4 + 4 + attrBytes);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.OPEN;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');
  buf.writeUInt32BE(flags, p += pathlen, true);
  buf.writeUInt32BE(attrFlags, p += 4, true);
  if (attrs && attrFlags) {
    p += 4;
    for (var i = 0, len = attrs.length; i < len; ++i)
      for (var j = 0, len2 = attrs[i].length; j < len2; ++j)
        buf[p++] = attrs[i][j];
  }
  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing OPEN');
  return this.push(buf);
};
SFTPStream.prototype.close = function(handle, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  var state = this._state;

  /*
    uint32     id
    string     handle
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + handlelen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.CLOSE;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(handlelen, p, true);
  handle.copy(buf, p += 4);

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing CLOSE');
  return this.push(buf);
};
SFTPStream.prototype.readData = function(handle, buf, off, len, position, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');
  else if (!Buffer.isBuffer(buf))
    throw new Error('buffer is not a Buffer');
  else if (off >= buf.length)
    throw new Error('offset is out of bounds');
  else if (off + len > buf.length)
    throw new Error('length extends beyond buffer');
  else if (position === null)
    throw new Error('null position currently unsupported');

  var state = this._state;

  /*
    uint32     id
    string     handle
    uint64     offset
    uint32     len
  */
  var handlelen = handle.length;
  var p = 9;
  var pos = position;
  var out = new Buffer(4 + 1 + 4 + 4 + handlelen + 8 + 4);

  out.writeUInt32BE(out.length - 4, 0, true);
  out[4] = REQUEST.READ;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  out.writeUInt32BE(reqid, 5, true);

  out.writeUInt32BE(handlelen, p, true);
  handle.copy(out, p += 4);
  p += handlelen;
  for (var i = 7; i >= 0; --i) {
    out[p + i] = pos & 0xFF;
    pos /= 256;
  }
  out.writeUInt32BE(len, p += 8, true);

  state.requests[reqid] = {
    cb: function(err, data, nb) {
      if (err && err.code !== STATUS_CODE.EOF)
        return cb(err);
      cb(undefined, nb || 0, data, position);
    },
    buffer: buf.slice(off, off + len)
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing READ');
  return this.push(out);
};
SFTPStream.prototype.writeData = function(handle, buf, off, len, position, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');
  else if (!Buffer.isBuffer(buf))
    throw new Error('buffer is not a Buffer');
  else if (off > buf.length)
    throw new Error('offset is out of bounds');
  else if (off + len > buf.length)
    throw new Error('length extends beyond buffer');
  else if (position === null)
    throw new Error('null position currently unsupported');

  var self = this;
  var state = this._state;

  if (!len) {
    cb && process.nextTick(function() { cb(undefined, 0); });
    return;
  }

  var overflow = (len > state.maxDataLen
                  ? len - state.maxDataLen
                  : 0);
  var origPosition = position;

  if (overflow)
    len = state.maxDataLen;

  /*
    uint32     id
    string     handle
    uint64     offset
    string     data
  */
  var handlelen = handle.length;
  var p = 9;
  var out = new Buffer(4 + 1 + 4 + 4 + handlelen + 8 + 4 + len);

  out.writeUInt32BE(out.length - 4, 0, true);
  out[4] = REQUEST.WRITE;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  out.writeUInt32BE(reqid, 5, true);

  out.writeUInt32BE(handlelen, p, true);
  handle.copy(out, p += 4);
  p += handlelen;
  for (var i = 7; i >= 0; --i) {
    out[p + i] = position & 0xFF;
    position /= 256;
  }
  out.writeUInt32BE(len, p += 8, true);
  buf.copy(out, p += 4, off, off + len);

  state.requests[reqid] = {
    cb: function(err) {
      if (err)
        cb && cb(err);
      else if (overflow) {
        self.writeData(handle,
                       buf,
                       off + len,
                       overflow,
                       origPosition + len,
                       cb);
      } else
        cb && cb(undefined, len);
    }
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing WRITE');
  return this.push(out);
};
function fastXfer(src, dst, srcPath, dstPath, opts, cb) {
  var concurrency = 25;
  var chunkSize = 32768;
  var preserve = false;
  var onstep;

  if (typeof opts === 'function')
    cb = opts;
  else if (typeof opts === 'object') {
    if (typeof opts.concurrency === 'number'
        && opts.concurrency > 0
        && !isNaN(opts.concurrency))
      concurrency = opts.concurrency;
    if (typeof opts.chunkSize === 'number'
        && opts.chunkSize > 0
        && !isNaN(opts.chunkSize))
      chunkSize = opts.chunkSize;
    if (typeof opts.step === 'function')
      onstep = opts.step;
    preserve = (opts.preserve ? true : false);
  }

  // internal state variables
  var fsize;
  var chunk;
  var psrc = 0;
  var pdst = 0;
  var reads = 0;
  var total = 0;
  var hadError = false;
  var srcHandle;
  var dstHandle;
  var readbuf = new Buffer(chunkSize * concurrency);

  function onerror(err) {
    if (hadError)
      return;

    hadError = true;

    var left = 0;
    var cbfinal;

    if (srcHandle || dstHandle) {
      cbfinal = function() {
        if (--left === 0)
          cb(err);
      };
      if (srcHandle && (src === fs || src.writable))
        ++left;
      if (dstHandle && (dst === fs || dst.writable))
        ++left;
      if (srcHandle && (src === fs || src.writable))
        src.close(srcHandle, cbfinal);
      if (dstHandle && (dst === fs || dst.writable))
        dst.close(dstHandle, cbfinal);
    } else
      cb(err);
  }

  src.open(srcPath, 'r', function(err, sourceHandle) {
    if (err)
      return onerror(err);
    srcHandle = sourceHandle;

    src.fstat(srcHandle, function tryStat(err, attrs) {
      if (err) {
        if (src !== fs) {
          // Try stat() for sftp servers that may not support fstat() for
          // whatever reason
          src.stat(srcPath, function(err_, attrs_) {
            if (err_)
              return onerror(err);
            tryStat(null, attrs_);
          });
          return;
        }
        return onerror(err);
      }
      fsize = attrs.size;

      dst.open(dstPath, 'w', function(err, destHandle) {
        if (err)
          return onerror(err);
        dstHandle = destHandle;

        if (fsize <= 0)
          return onerror();

        function onread(err, nb, data, dstpos, datapos) {
          if (err)
            return onerror(err);

          if (src === fs)
            dst.writeData(dstHandle, data, datapos || 0, nb, dstpos, writeCb);
          else
            dst.write(dstHandle, data, datapos || 0, nb, dstpos, writeCb);

          function writeCb(err) {
            if (err)
              return onerror(err);

            total += nb;
            onstep && onstep(total, nb, fsize);

            if (--reads === 0) {
              if (total === fsize) {
                dst.close(dstHandle, function(err) {
                  dstHandle = undefined;
                  if (err)
                    return onerror(err);
                  src.close(srcHandle, function(err) {
                    srcHandle = undefined;
                    if (err)
                      return onerror(err);
                    cb();
                  });
                });
              } else
                read();
            }
          }
        }

        function makeCb(psrc, pdst) {
          return function(err, nb, data) {
            onread(err, nb, data, pdst, psrc);
          };
        }

        function read() {
          while (pdst < fsize && reads < concurrency) {
            chunk = (pdst + chunkSize > fsize ? fsize - pdst : chunkSize);
            if (src === fs) {
              src.read(srcHandle,
                       readbuf,
                       psrc,
                       chunk,
                       pdst,
                       makeCb(psrc, pdst));
            } else
              src.readData(srcHandle, readbuf, psrc, chunk, pdst, onread);
            psrc += chunk;
            pdst += chunk;
            ++reads;
          }
          psrc = 0;
        }
        read();
      });
    });
  });
}
SFTPStream.prototype.fastGet = function(remotePath, localPath, opts, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  fastXfer(this, fs, remotePath, localPath, opts, cb);
};
SFTPStream.prototype.fastPut = function(localPath, remotePath, opts, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  fastXfer(fs, this, localPath, remotePath, opts, cb);
};
SFTPStream.prototype.readFile = function(path, options, callback_) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var callback = (typeof callback_ === 'function' ? callback_ : undefined);
  var self = this;

  if (typeof options === 'function' || !options)
    options = { encoding: null, flag: 'r' };
  else if (typeof options === 'string')
    options = { encoding: options, flag: 'r' };
  else if (!options)
    options = { encoding: null, flag: 'r' };
  else if (typeof options !== 'object')
    throw new TypeError('Bad arguments');

  var encoding = options.encoding;
  if (encoding && !Buffer.isEncoding(encoding))
    throw new Error('Unknown encoding: ' + encoding);

  // first, stat the file, so we know the size.
  var size;
  var buffer; // single buffer with file data
  var buffers; // list for when size is unknown
  var pos = 0;
  var handle;

  // SFTPv3 does not support using -1 for read position, so we have to track
  // read position manually
  var bytesRead = 0;

  var flag = options.flag || 'r';
  this.open(path, flag, 438 /*=0666*/, function(er, handle_) {
    if (er)
      return callback && callback(er);
    handle = handle_;

    self.fstat(handle, function tryStat(er, st) {
      if (er) {
        // Try stat() for sftp servers that may not support fstat() for
        // whatever reason
        self.stat(path, function(er_, st_) {
          if (er_) {
            return self.close(handle, function() {
              callback && callback(er);
            });
          }
          tryStat(null, st_);
        });
        return;
      }

      size = st.size;
      if (size === 0) {
        // the kernel lies about many files.
        // Go ahead and try to read some bytes.
        buffers = [];
        return read();
      }

      buffer = new Buffer(size);
      read();
    });
  });

  function read() {
    if (size === 0) {
      buffer = new Buffer(8192);
      self.readData(handle, buffer, 0, 8192, bytesRead, afterRead);
    } else
      self.readData(handle, buffer, pos, size - pos, bytesRead, afterRead);
  }

  function afterRead(er, nbytes) {
    if (er) {
      return self.close(handle, function() {
        return callback && callback(er);
      });
    }

    if (nbytes === 0)
      return close();

    bytesRead += nbytes;
    pos += nbytes;
    if (size !== 0) {
      if (pos === size)
        close();
      else
        read();
    } else {
      // unknown size, just read until we don't get bytes.
      buffers.push(buffer.slice(0, nbytes));
      read();
    }
  }

  function close() {
    self.close(handle, function(er) {
      if (size === 0) {
        // collected the data into the buffers list.
        buffer = Buffer.concat(buffers, pos);
      } else if (pos < size)
        buffer = buffer.slice(0, pos);

      if (encoding)
        buffer = buffer.toString(encoding);
      return callback && callback(er, buffer);
    });
  }
};
function writeAll(self, handle, buffer, offset, length, position, callback_) {
  var callback = (typeof callback_ === 'function' ? callback_ : undefined);

  self.writeData(handle,
                 buffer,
                 offset,
                 length,
                 position,
                 function(writeErr, written) {
    if (writeErr) {
      return self.close(handle, function() {
        callback && callback(writeErr);
      });
    }
    if (written === length)
      self.close(handle, callback);
    else {
      offset += written;
      length -= written;
      position += written;
      writeAll(self, handle, buffer, offset, length, position, callback);
    }
  });
}
SFTPStream.prototype.writeFile = function(path, data, options, callback_) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var callback = (typeof callback_ === 'function' ? callback_ : undefined);
  var self = this;

  if (typeof options === 'function' || !options) {
    callback = options;
    options = { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'w' };
  } else if (typeof options === 'string')
    options = { encoding: options, mode: 438, flag: 'w' };
  else if (!options)
    options = { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'w' };
  else if (typeof options !== 'object')
    throw new TypeError('Bad arguments');

  if (options.encoding && !Buffer.isEncoding(options.encoding))
    throw new Error('Unknown encoding: ' + options.encoding);

  var flag = options.flag || 'w';
  this.open(path, flag, options.mode, function(openErr, handle) {
    if (openErr)
      callback && callback(openErr);
    else {
      var buffer = (Buffer.isBuffer(data)
                    ? data
                    : new Buffer('' + data, options.encoding || 'utf8'));
      var position = (/a/.test(flag) ? null : 0);

      // SFTPv3 does not support the notion of 'current position'
      // (null position), so we just attempt to append to the end of the file
      // instead
      if (position === null) {
        self.fstat(handle, function tryStat(er, st) {
          if (er) {
            // Try stat() for sftp servers that may not support fstat() for
            // whatever reason
            self.stat(path, function(er_, st_) {
              if (er_) {
                return self.close(handle, function() {
                  callback && callback(er);
                });
              }
              tryStat(null, st_);
            });
            return;
          }
          writeAll(self, handle, buffer, 0, buffer.length, st.size, callback);
        });
        return;
      }
      writeAll(self, handle, buffer, 0, buffer.length, position, callback);
    }
  });
};
SFTPStream.prototype.appendFile = function(path, data, options, callback_) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var callback = (typeof callback_ === 'function' ? callback_ : undefined);
  if (typeof options === 'function' || !options) {
    callback = options;
    options = { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'a' };
  } else if (typeof options === 'string')
    options = { encoding: options, mode: 438, flag: 'a' };
  else if (!options)
    options = { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'a' };
  else if (typeof options !== 'object')
    throw new TypeError('Bad arguments');

  if (!options.flag)
    options = util._extend({ flag: 'a' }, options);
  this.writeFile(path, data, options, callback_);
};
SFTPStream.prototype.exists = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  this.stat(path, function(err) {
    cb && cb(err ? false : true);
  });
};
SFTPStream.prototype.unlink = function(filename, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     filename
  */
  var fnamelen = Buffer.byteLength(filename);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + fnamelen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.REMOVE;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(fnamelen, p, true);
  buf.write(filename, p += 4, fnamelen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing REMOVE');
  return this.push(buf);
};
SFTPStream.prototype.rename = function(oldPath, newPath, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     oldpath
    string     newpath
  */
  var oldlen = Buffer.byteLength(oldPath);
  var newlen = Buffer.byteLength(newPath);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + oldlen + 4 + newlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.RENAME;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(oldlen, p, true);
  buf.write(oldPath, p += 4, oldlen, 'utf8');
  buf.writeUInt32BE(newlen, p += oldlen, true);
  buf.write(newPath, p += 4, newlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing RENAME');
  return this.push(buf);
};
SFTPStream.prototype.mkdir = function(path, attrs, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var flags = 0;
  var attrBytes = 0;
  var state = this._state;

  if (typeof attrs === 'function') {
    cb = attrs;
    attrs = undefined;
  }
  if (typeof attrs === 'object') {
    attrs = attrsToBytes(attrs);
    flags = attrs.flags;
    attrBytes = attrs.nbytes;
    attrs = attrs.bytes;
  }

  /*
    uint32     id
    string     path
    ATTRS      attrs
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen + 4 + attrBytes);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.MKDIR;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');
  buf.writeUInt32BE(flags, p += pathlen);
  if (flags) {
    p += 4;
    for (var i = 0, len = attrs.length; i < len; ++i)
      for (var j = 0, len2 = attrs[i].length; j < len2; ++j)
        buf[p++] = attrs[i][j];
  }

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing MKDIR');
  return this.push(buf);
};
SFTPStream.prototype.rmdir = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.RMDIR;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing RMDIR');
  return this.push(buf);
};
SFTPStream.prototype.readdir = function(where, opts, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;
  var doFilter;

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  if (typeof opts !== 'object')
    opts = {};

  doFilter = (opts && opts.full ? false : true);

  if (!Buffer.isBuffer(where) && typeof where !== 'string')
    throw new Error('missing directory handle or path');

  if (typeof where === 'string') {
    var self = this;
    var entries = [];
    var e = 0;

    return this.opendir(where, function reread(err, handle) {
      if (err)
        return cb(err);

      self.readdir(handle, opts, function(err, list) {
        var eof = (err && err.code === STATUS_CODE.EOF);

        if (err && !eof) {
          return self.close(handle, function() {
            cb(err);
          });
        } else if (eof) {
          return self.close(handle, function(err) {
            if (err)
              return cb(err);
            cb(undefined, entries);
          });
        }

        for (var i = 0, len = list.length; i < len; ++i, ++e)
          entries[e] = list[i];

        reread(undefined, handle);
      });
    });
  }

  /*
    uint32     id
    string     handle
  */
  var handlelen = where.length;
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + handlelen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.READDIR;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(handlelen, p, true);
  where.copy(buf, p += 4);

  state.requests[reqid] = {
    cb: (doFilter
         ? function(err, list) {
             if (err)
               return cb(err);

             for (var i = list.length - 1; i >= 0; --i) {
               if (list[i].filename === '.' || list[i].filename === '..')
                 list.splice(i, 1);
             }

             cb(undefined, list);
           }
         : cb)
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing READDIR');
  return this.push(buf);
};
SFTPStream.prototype.fstat = function(handle, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  var state = this._state;

  /*
    uint32     id
    string     handle
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + handlelen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.FSTAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(handlelen, p, true);
  handle.copy(buf, p += 4);

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing FSTAT');
  return this.push(buf);
};
SFTPStream.prototype.stat = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.STAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing STAT');
  return this.push(buf);
};
SFTPStream.prototype.lstat = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.LSTAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing LSTAT');
  return this.push(buf);
};
SFTPStream.prototype.opendir = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.OPENDIR;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing OPENDIR');
  return this.push(buf);
};
SFTPStream.prototype.setstat = function(path, attrs, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var flags = 0;
  var attrBytes = 0;
  var state = this._state;

  if (typeof attrs === 'object') {
    attrs = attrsToBytes(attrs);
    flags = attrs.flags;
    attrBytes = attrs.nbytes;
    attrs = attrs.bytes;
  } else if (typeof attrs === 'function')
    cb = attrs;

  /*
    uint32     id
    string     path
    ATTRS      attrs
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen + 4 + attrBytes);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.SETSTAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');
  buf.writeUInt32BE(flags, p += pathlen);
  if (flags) {
    p += 4;
    for (var i = 0, len = attrs.length; i < len; ++i)
      for (var j = 0, len2 = attrs[i].length; j < len2; ++j)
        buf[p++] = attrs[i][j];
  }

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing SETSTAT');
  return this.push(buf);
};
SFTPStream.prototype.fsetstat = function(handle, attrs, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  var flags = 0;
  var attrBytes = 0;
  var state = this._state;

  if (typeof attrs === 'object') {
    attrs = attrsToBytes(attrs);
    flags = attrs.flags;
    attrBytes = attrs.nbytes;
    attrs = attrs.bytes;
  } else if (typeof attrs === 'function')
    cb = attrs;

  /*
    uint32     id
    string     handle
    ATTRS      attrs
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + handlelen + 4 + attrBytes);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.FSETSTAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(handlelen, p, true);
  handle.copy(buf, p += 4);
  buf.writeUInt32BE(flags, p += handlelen);
  if (flags) {
    p += 4;
    for (var i = 0, len = attrs.length; i < len; ++i)
      for (var j = 0, len2 = attrs[i].length; j < len2; ++j)
        buf[p++] = attrs[i][j];
  }

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing FSETSTAT');
  return this.push(buf);
};
SFTPStream.prototype.futimes = function(handle, atime, mtime, cb) {
  return this.fsetstat(handle, {
    atime: toUnixTimestamp(atime),
    mtime: toUnixTimestamp(mtime)
  }, cb);
};
SFTPStream.prototype.utimes = function(path, atime, mtime, cb) {
  return this.setstat(path, {
    atime: toUnixTimestamp(atime),
    mtime: toUnixTimestamp(mtime)
  }, cb);
};
SFTPStream.prototype.fchown = function(handle, uid, gid, cb) {
  return this.fsetstat(handle, {
    uid: uid,
    gid: gid
  }, cb);
};
SFTPStream.prototype.chown = function(path, uid, gid, cb) {
  return this.setstat(path, {
    uid: uid,
    gid: gid
  }, cb);
};
SFTPStream.prototype.fchmod = function(handle, mode, cb) {
  return this.fsetstat(handle, {
    mode: mode
  }, cb);
};
SFTPStream.prototype.chmod = function(path, mode, cb) {
  return this.setstat(path, {
    mode: mode
  }, cb);
};
SFTPStream.prototype.readlink = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.READLINK;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = {
    cb: function(err, names) {
      if (err)
        return cb(err);
      else if (!names || !names.length)
        return cb(new Error('Response missing link info'));
      cb(undefined, names[0].filename);
    }
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing READLINK');
  return this.push(buf);
};
SFTPStream.prototype.symlink = function(targetPath, linkPath, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     linkpath
    string     targetpath
  */
  var linklen = Buffer.byteLength(linkPath);
  var targetlen = Buffer.byteLength(targetPath);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + linklen + 4 + targetlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.SYMLINK;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  if (this._isOpenSSH) {
    // OpenSSH has linkpath and targetpath positions switched
    buf.writeUInt32BE(targetlen, p, true);
    buf.write(targetPath, p += 4, targetlen, 'utf8');
    buf.writeUInt32BE(linklen, p += targetlen, true);
    buf.write(linkPath, p += 4, linklen, 'utf8');
  } else {
    buf.writeUInt32BE(linklen, p, true);
    buf.write(linkPath, p += 4, linklen, 'utf8');
    buf.writeUInt32BE(targetlen, p += linklen, true);
    buf.write(targetPath, p += 4, targetlen, 'utf8');
  }

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing SYMLINK');
  return this.push(buf);
};
SFTPStream.prototype.realpath = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + pathlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.REALPATH;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = {
    cb: function(err, names) {
      if (err)
        return cb(err);
      else if (!names || !names.length)
        return cb(new Error('Response missing path info'));
      cb(undefined, names[0].filename);
    }
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing REALPATH');
  return this.push(buf);
};
// extended requests
SFTPStream.prototype.ext_openssh_rename = function(oldPath, newPath, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['posix-rename@openssh.com']
           || state.extensions['posix-rename@openssh.com'].indexOf('1') === -1)
    throw new Error('Server does not support this extended request');

  /*
    uint32    id
    string    "posix-rename@openssh.com"
    string    oldpath
    string    newpath
  */
  var oldlen = Buffer.byteLength(oldPath);
  var newlen = Buffer.byteLength(newPath);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + 24 + 4 + oldlen + 4 + newlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);
  buf.writeUInt32BE(24, p, true);
  buf.write('posix-rename@openssh.com', p += 4, 24, 'ascii');

  buf.writeUInt32BE(oldlen, p += 24, true);
  buf.write(oldPath, p += 4, oldlen, 'utf8');
  buf.writeUInt32BE(newlen, p += oldlen, true);
  buf.write(newPath, p += 4, newlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing posix-rename@openssh.com');
  return this.push(buf);
};
SFTPStream.prototype.ext_openssh_statvfs = function(path, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['statvfs@openssh.com']
           || state.extensions['statvfs@openssh.com'].indexOf('2') === -1)
    throw new Error('Server does not support this extended request');

  /*
    uint32    id
    string    "statvfs@openssh.com"
    string    path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + 19 + 4 + pathlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);
  buf.writeUInt32BE(19, p, true);
  buf.write('statvfs@openssh.com', p += 4, 19, 'ascii');

  buf.writeUInt32BE(pathlen, p += 19, true);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = {
    extended: 'statvfs@openssh.com',
    cb: cb
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing statvfs@openssh.com');
  return this.push(buf);
};
SFTPStream.prototype.ext_openssh_fstatvfs = function(handle, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['fstatvfs@openssh.com']
           || state.extensions['fstatvfs@openssh.com'].indexOf('2') === -1)
    throw new Error('Server does not support this extended request');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  /*
    uint32    id
    string    "fstatvfs@openssh.com"
    string    handle
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + 20 + 4 + handlelen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);
  buf.writeUInt32BE(20, p, true);
  buf.write('fstatvfs@openssh.com', p += 4, 20, 'ascii');

  buf.writeUInt32BE(handlelen, p += 20, true);
  buf.write(handle, p += 4, handlelen, 'utf8');

  state.requests[reqid] = {
    extended: 'fstatvfs@openssh.com',
    cb: cb
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing fstatvfs@openssh.com');
  return this.push(buf);
};
SFTPStream.prototype.ext_openssh_hardlink = function(oldPath, newPath, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['hardlink@openssh.com']
           || state.extensions['hardlink@openssh.com'].indexOf('1') === -1)
    throw new Error('Server does not support this extended request');

  /*
    uint32    id
    string    "hardlink@openssh.com"
    string    oldpath
    string    newpath
  */
  var oldlen = Buffer.byteLength(oldPath);
  var newlen = Buffer.byteLength(newPath);
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + 20 + 4 + oldlen + 4 + newlen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);
  buf.writeUInt32BE(20, p, true);
  buf.write('hardlink@openssh.com', p += 4, 20, 'ascii');

  buf.writeUInt32BE(oldlen, p += 20, true);
  buf.write(oldPath, p += 4, oldlen, 'utf8');
  buf.writeUInt32BE(newlen, p += oldlen, true);
  buf.write(newPath, p += 4, newlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing hardlink@openssh.com');
  return this.push(buf);
};
SFTPStream.prototype.ext_openssh_fsync = function(handle, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['fsync@openssh.com']
           || state.extensions['fsync@openssh.com'].indexOf('1') === -1)
    throw new Error('Server does not support this extended request');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  /*
    uint32    id
    string    "fsync@openssh.com"
    string    handle
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = new Buffer(4 + 1 + 4 + 4 + 17 + 4 + handlelen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  buf.writeUInt32BE(reqid, 5, true);
  buf.writeUInt32BE(17, p, true);
  buf.write('fsync@openssh.com', p += 4, 17, 'ascii');

  buf.writeUInt32BE(handlelen, p += 17, true);
  buf.write(handle, p += 4, handlelen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing fsync@openssh.com');
  return this.push(buf);
};

// server
SFTPStream.prototype.status = function(id, code, message, lang) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (!STATUS_CODE[code] || typeof code !== 'number')
    throw new Error('Bad status code: ' + code);

  message || (message = '');
  lang || (lang = '');

  var msgLen = Buffer.byteLength(message);
  var langLen = Buffer.byteLength(lang);
  var buf = new Buffer(4 + 1 + 4 + 4 + 4 + msgLen + 4 + langLen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = RESPONSE.STATUS;
  buf.writeUInt32BE(id, 5, true);

  buf.writeUInt32BE(code, 9, true);

  buf.writeUInt32BE(msgLen, 13, true);
  if (msgLen)
    buf.write(message, 17, msgLen, 'utf8');

  buf.writeUInt32BE(langLen, 17 + msgLen, true);
  if (langLen)
    buf.write(lang, 17 + msgLen + 4, langLen, 'ascii');

  this.debug('DEBUG[SFTP]: Outgoing: Writing STATUS');
  return this.push(buf);
};
SFTPStream.prototype.handle = function(id, handle) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  var handleLen = handle.length;

  if (handleLen > 256)
    throw new Error('handle too large (> 256 bytes)');

  var buf = new Buffer(4 + 1 + 4 + 4 + handleLen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = RESPONSE.HANDLE;
  buf.writeUInt32BE(id, 5, true);

  buf.writeUInt32BE(handleLen, 9, true);
  if (handleLen)
    handle.copy(buf, 13);

  this.debug('DEBUG[SFTP]: Outgoing: Writing HANDLE');
  return this.push(buf);
};
SFTPStream.prototype.data = function(id, data, encoding) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var isBuffer = Buffer.isBuffer(data);

  if (!isBuffer && typeof data !== 'string')
    throw new Error('data is not a Buffer or string');

  if (!isBuffer)
    encoding || (encoding = 'utf8');

  var dataLen = (isBuffer ? data.length : Buffer.byteLength(data, encoding));
  var buf = new Buffer(4 + 1 + 4 + 4 + dataLen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = RESPONSE.DATA;
  buf.writeUInt32BE(id, 5, true);

  buf.writeUInt32BE(dataLen, 9, true);
  if (dataLen) {
    if (isBuffer)
      data.copy(buf, 13);
    else
      buf.write(data, 13, dataLen, encoding);
  }

  this.debug('DEBUG[SFTP]: Outgoing: Writing DATA');
  return this.push(buf);
};
SFTPStream.prototype.name = function(id, names) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (!Array.isArray(names) && typeof names === 'object')
    names = [ names ];
  else if (!Array.isArray(names))
    throw new Error('names is not an object or array');

  var count = names.length;
  var namesLen = 0;
  var nameAttrs;
  var attrs = [];
  var name;
  var filename;
  var longname;
  var attr;
  var len;
  var len2;
  var buf;
  var p;
  var i;
  var j;
  var k;

  for (i = 0; i < count; ++i) {
    name = names[i];
    filename = (!name || !name.filename || typeof name.filename !== 'string'
                ? ''
                : name.filename);
    namesLen += 4 + Buffer.byteLength(filename);
    longname = (!name || !name.longname || typeof name.longname !== 'string'
                ? ''
                : name.longname);
    namesLen += 4 + Buffer.byteLength(longname);

    if (typeof name.attrs === 'object') {
      nameAttrs = attrsToBytes(name.attrs);
      namesLen += 4 + nameAttrs.nbytes;
      attrs.push(nameAttrs);
    } else
      attrs.push(null);
  }

  buf = new Buffer(4 + 1 + 4 + 4 + namesLen);

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = RESPONSE.NAME;
  buf.writeUInt32BE(id, 5, true);

  buf.writeUInt32BE(count, 9, true);

  p = 13;

  for (i = 0; i < count; ++i) {
    name = names[i];

    filename = (!name || !name.filename || typeof name.filename !== 'string'
                ? ''
                : name.filename);
    len = Buffer.byteLength(filename);
    buf.writeUInt32BE(len, p, true);
    p += 4;
    if (len) {
      buf.write(filename, p, len, 'utf8');
      p += len;
    }

    longname = (!name || !name.longname || typeof name.longname !== 'string'
                ? ''
                : name.longname);
    len = Buffer.byteLength(longname);
    buf.writeUInt32BE(len, p, true);
    p += 4;
    if (len) {
      buf.write(longname, p, len, 'utf8');
      p += len;
    }

    attr = attrs[i];
    if (attr) {
      buf.writeUInt32BE(attr.flags, p, true);
      p += 4;
      if (attr.flags && attr.bytes) {
        var bytes = attr.bytes;
        for (j = 0, len = bytes.length; j < len; ++j)
          for (k = 0, len2 = bytes[j].length; k < len2; ++k)
            buf[p++] = bytes[j][k];
      }
    } else {
      buf.writeUInt32BE(0, p, true);
      p += 4;
    }
  }

  this.debug('DEBUG[SFTP]: Outgoing: Writing NAME');
  return this.push(buf);
};
SFTPStream.prototype.attrs = function(id, attrs) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (typeof attrs !== 'object')
    throw new Error('attrs is not an object');

  var info = attrsToBytes(attrs);
  var buf = new Buffer(4 + 1 + 4 + 4 + info.nbytes);
  var p = 13;

  buf.writeUInt32BE(buf.length - 4, 0, true);
  buf[4] = RESPONSE.ATTRS;
  buf.writeUInt32BE(id, 5, true);

  buf.writeUInt32BE(info.flags, 9, true);

  if (info.flags && info.bytes) {
    var bytes = info.bytes;
    for (var j = 0, len = bytes.length; j < len; ++j)
      for (var k = 0, len2 = bytes[j].length; k < len2; ++k)
        buf[p++] = bytes[j][k];
  }

  this.debug('DEBUG[SFTP]: Outgoing: Writing ATTRS');
  return this.push(buf);
};

function readAttrs(buf, p, stream, callback) {
  /*
    uint32   flags
    uint64   size           present only if flag SSH_FILEXFER_ATTR_SIZE
    uint32   uid            present only if flag SSH_FILEXFER_ATTR_UIDGID
    uint32   gid            present only if flag SSH_FILEXFER_ATTR_UIDGID
    uint32   permissions    present only if flag SSH_FILEXFER_ATTR_PERMISSIONS
    uint32   atime          present only if flag SSH_FILEXFER_ACMODTIME
    uint32   mtime          present only if flag SSH_FILEXFER_ACMODTIME
    uint32   extended_count present only if flag SSH_FILEXFER_ATTR_EXTENDED
    string   extended_type
    string   extended_data
    ...      more extended data (extended_type - extended_data pairs),
               so that number of pairs equals extended_count
  */
  var flags = buf.readUInt32BE(p, true);
  var attrs = new Stats();

  p += 4;

  if (flags & ATTR.SIZE) {
    var size = readUInt64BE(buf, p, stream, callback);
    if (size === false)
      return false;
    attrs.size = size;
    p += 8;
  }
  if (flags & ATTR.UIDGID) {
    var uid;
    var gid;
    uid = readInt(buf, p, this, callback);
    if (uid === false)
      return false;
    attrs.uid = uid;
    p += 4;
    gid = readInt(buf, p, this, callback);
    if (gid === false)
      return false;
    attrs.gid = gid;
    p += 4;
  }
  if (flags & ATTR.PERMISSIONS) {
    var mode = readInt(buf, p, this, callback);
    if (mode === false)
      return false;
    attrs.mode = mode;
    // backwards compatibility
    attrs.permissions = mode;
    p += 4;
  }
  if (flags & ATTR.ACMODTIME) {
    var atime;
    var mtime;
    atime = readInt(buf, p, this, callback);
    if (atime === false)
      return false;
    attrs.atime = atime;
    p += 4;
    mtime = readInt(buf, p, this, callback);
    if (mtime === false)
      return false;
    attrs.mtime = mtime;
    p += 4;
  }
  if (flags & ATTR.EXTENDED) {
    // TODO: read/parse extended data
    var extcount = readInt(buf, p, this, callback);
    if (extcount === false)
      return false;
    p += 4;
    for (var i = 0, len; i < extcount; ++i) {
      len = readInt(buf, p, this, callback);
      if (len === false)
        return false;
      p += 4 + len;
    }
  }

  buf._pos = p;

  return attrs;
}

function readUInt64BE(buffer, p, stream, callback) {
  if ((buffer.length - p) < 8) {
    stream && stream._cleanup(callback);
    return false;
  }

  var val = 0;

  for (var len = p + 8; p < len; ++p) {
    val *= 256;
    val += buffer[p];
  }

  buffer._pos = p;

  return val;
}

function attrsToBytes(attrs) {
  var flags = 0;
  var attrBytes = 0;
  var ret = [];
  var i = 0;

  if (typeof attrs.size === 'number') {
    flags |= ATTR.SIZE;
    attrBytes += 8;
    var sizeBytes = new Array(8);
    var val = attrs.size;
    for (i = 7; i >= 0; --i) {
      sizeBytes[i] = val & 0xFF;
      val /= 256;
    }
    ret.push(sizeBytes);
  }
  if (typeof attrs.uid === 'number' && typeof attrs.gid === 'number') {
    flags |= ATTR.UIDGID;
    attrBytes += 8;
    ret.push([(attrs.uid >> 24) & 0xFF, (attrs.uid >> 16) & 0xFF,
              (attrs.uid >> 8) & 0xFF, attrs.uid & 0xFF]);
    ret.push([(attrs.gid >> 24) & 0xFF, (attrs.gid >> 16) & 0xFF,
              (attrs.gid >> 8) & 0xFF, attrs.gid & 0xFF]);
  }
  if (typeof attrs.permissions === 'number'
      || typeof attrs.permissions === 'string'
      || typeof attrs.mode === 'number'
      || typeof attrs.mode === 'string') {
    var mode = modeNum(attrs.mode || attrs.permissions);
    flags |= ATTR.PERMISSIONS;
    attrBytes += 4;
    ret.push([(mode >> 24) & 0xFF,
              (mode >> 16) & 0xFF,
              (mode >> 8) & 0xFF,
              mode & 0xFF]);
  }
  if ((typeof attrs.atime === 'number' || isDate(attrs.atime))
      && (typeof attrs.mtime === 'number' || isDate(attrs.mtime))) {
    var atime = toUnixTimestamp(attrs.atime);
    var mtime = toUnixTimestamp(attrs.mtime);

    flags |= ATTR.ACMODTIME;
    attrBytes += 8;
    ret.push([(atime >> 24) & 0xFF, (atime >> 16) & 0xFF,
              (atime >> 8) & 0xFF, atime & 0xFF]);
    ret.push([(mtime >> 24) & 0xFF, (mtime >> 16) & 0xFF,
              (mtime >> 8) & 0xFF, mtime & 0xFF]);
  }
  // TODO: extended attributes

  return { flags: flags, nbytes: attrBytes, bytes: ret };
}

function toUnixTimestamp(time) {
  if (typeof time === 'number' && !isNaN(time))
    return time;
  else if (isDate(time))
    return parseInt(time.getTime() / 1000, 10);
  throw new Error('Cannot parse time: ' + time);
}

function modeNum(mode) {
  if (typeof mode === 'number' && !isNaN(mode))
    return mode;
  else if (typeof mode === 'string')
    return modeNum(parseInt(mode, 8));
  throw new Error('Cannot parse mode: ' + mode);
}

var stringFlagMap = {
  'r': OPEN_MODE.READ,
  'r+': OPEN_MODE.READ | OPEN_MODE.WRITE,
  'w': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE,
  'wx': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'xw': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'w+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE,
  'wx+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'xw+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'a': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE,
  'ax': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'xa': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'a+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE,
  'ax+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'xa+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL
};
var stringFlagMapKeys = Object.keys(stringFlagMap);

function stringToFlags(str) {
  var flags = stringFlagMap[str];
  if (flags !== undefined)
    return flags;
  return null;
}
SFTPStream.stringToFlags = stringToFlags;

function flagsToString(flags) {
  for (var i = 0; i < stringFlagMapKeys.length; ++i) {
    var key = stringFlagMapKeys[i];
    if (stringFlagMap[key] === flags)
      return key;
  }
  return null;
}
SFTPStream.flagsToString = flagsToString;

function Stats(initial) {
  this.mode = (initial && initial.mode);
  this.permissions = this.mode; // backwards compatiblity
  this.uid = (initial && initial.uid);
  this.gid = (initial && initial.gid);
  this.size = (initial && initial.size);
  this.atime = (initial && initial.atime);
  this.mtime = (initial && initial.mtime);
}
Stats.prototype._checkModeProperty = function(property) {
  return ((this.mode & constants.S_IFMT) === property);
};
Stats.prototype.isDirectory = function() {
  return this._checkModeProperty(constants.S_IFDIR);
};
Stats.prototype.isFile = function() {
  return this._checkModeProperty(constants.S_IFREG);
};
Stats.prototype.isBlockDevice = function() {
  return this._checkModeProperty(constants.S_IFBLK);
};
Stats.prototype.isCharacterDevice = function() {
  return this._checkModeProperty(constants.S_IFCHR);
};
Stats.prototype.isSymbolicLink = function() {
  return this._checkModeProperty(constants.S_IFLNK);
};
Stats.prototype.isFIFO = function() {
  return this._checkModeProperty(constants.S_IFIFO);
};
Stats.prototype.isSocket = function() {
  return this._checkModeProperty(constants.S_IFSOCK);
};
SFTPStream.Stats = Stats;


// ReadStream-related
var kMinPoolSpace = 128;
var pool;
function allocNewPool(poolSize) {
  pool = new Buffer(poolSize);
  pool.used = 0;
}

function ReadStream(sftp, path, options) {
  if (!(this instanceof ReadStream))
    return new ReadStream(sftp, path, options);

  var self = this;

  if (options === undefined)
    options = {};
  else if (typeof options === 'string')
    options = { encoding: options };
  else if (options === null || typeof options !== 'object')
    throw new TypeError('"options" argument must be a string or an object');
  else
    options = Object.create(options);

  // a little bit bigger buffer and water marks by default
  if (options.highWaterMark === undefined)
    options.highWaterMark = 64 * 1024;

  ReadableStream.call(this, options);

  this.path = path;
  this.handle = options.handle === undefined ? null : options.handle;
  this.flags = options.flags === undefined ? 'r' : options.flags;
  this.mode = options.mode === undefined ? 438/*0666*/ : options.mode;

  this.start = options.start === undefined ? undefined : options.start;
  this.end = options.end === undefined ? undefined : options.end;
  this.autoClose = options.autoClose === undefined ? true : options.autoClose;
  this.pos = 0;
  this.sftp = sftp;

  if (this.start !== undefined) {
    if (typeof this.start !== 'number')
      throw new TypeError('start must be a Number');
    if (this.end === undefined)
      this.end = Infinity;
    else if (typeof this.end !== 'number')
      throw new TypeError('end must be a Number');

    if (this.start > this.end)
      throw new Error('start must be <= end');
    else if (this.start < 0)
      throw new Error('start must be >= zero');

    this.pos = this.start;
  }

  this.on('end', function() {
    if (self.autoClose) {
      self.destroy();
    }
  });

  if (!Buffer.isBuffer(this.handle))
    this.open();
}
inherits(ReadStream, ReadableStream);

ReadStream.prototype.open = function() {
  var self = this;
  this.sftp.open(this.path, this.flags, this.mode, function(er, handle) {
    if (er) {
      self.emit('error', er);
      this.destroyed = this.closed = true;
      self.emit('close');
      return;
    }

    self.handle = handle;
    self.emit('open', handle);
    // start the flow of data.
    self.read();
  });
};

ReadStream.prototype._read = function(n) {
  if (!Buffer.isBuffer(this.handle)) {
    return this.once('open', function() {
      this._read(n);
    });
  }

  if (this.destroyed)
    return;

  if (!pool || pool.length - pool.used < kMinPoolSpace) {
    // discard the old pool.
    pool = null;
    allocNewPool(this._readableState.highWaterMark);
  }

  // Grab another reference to the pool in the case that while we're
  // in the thread pool another read() finishes up the pool, and
  // allocates a new one.
  var thisPool = pool;
  var toRead = Math.min(pool.length - pool.used, n);
  var start = pool.used;

  if (this.end !== undefined)
    toRead = Math.min(this.end - this.pos + 1, toRead);

  // already read everything we were supposed to read!
  // treat as EOF.
  if (toRead <= 0)
    return this.push(null);

  // the actual read.
  var self = this;
  this.sftp.readData(this.handle, pool, pool.used, toRead, this.pos, onread);

  // move the pool positions, and internal position for reading.
  this.pos += toRead;
  pool.used += toRead;

  function onread(er, bytesRead) {
    if (er) {
      if (self.autoClose)
        self.destroy();
      self.emit('error', er);
    } else {
      var b = null;
      if (bytesRead > 0)
        b = thisPool.slice(start, start + bytesRead);

      self.push(b);
    }
  }
};

ReadStream.prototype.destroy = function() {
  if (this.destroyed)
    return;
  this.destroyed = true;
  if (Buffer.isBuffer(this.handle))
    this.close();
};


ReadStream.prototype.close = function(cb) {
  var self = this;
  if (cb)
    this.once('close', cb);
  if (this.closed || !Buffer.isBuffer(this.handle)) {
    if (!Buffer.isBuffer(this.handle)) {
      this.once('open', close);
      return;
    }
    return process.nextTick(this.emit.bind(this, 'close'));
  }
  this.closed = true;
  close();

  function close(handle) {
    self.sftp.close(handle || self.handle, function(er) {
      if (er)
        self.emit('error', er);
      else
        self.emit('close');
    });
    self.handle = null;
  }
};


function WriteStream(sftp, path, options) {
  if (!(this instanceof WriteStream))
    return new WriteStream(sftp, path, options);

  if (options === undefined)
    options = {};
  else if (typeof options === 'string')
    options = { encoding: options };
  else if (options === null || typeof options !== 'object')
    throw new TypeError('"options" argument must be a string or an object');
  else
    options = Object.create(options);

  WritableStream.call(this, options);

  this.path = path;
  this.handle = options.handle === undefined ? null : options.handle;
  this.flags = options.flags === undefined ? 'w' : options.flags;
  this.mode = options.mode === undefined ? 438/*0666*/ : options.mode;

  this.start = options.start === undefined ? undefined : options.start;
  this.autoClose = options.autoClose === undefined ? true : options.autoClose;
  this.pos = 0;
  this.bytesWritten = 0;
  this.sftp = sftp;

  if (this.start !== undefined) {
    if (typeof this.start !== 'number')
      throw new TypeError('start must be a Number');
    if (this.start < 0)
      throw new Error('start must be >= zero');

    this.pos = this.start;
  }

  if (options.encoding)
    this.setDefaultEncoding(options.encoding);

  if (!Buffer.isBuffer(this.handle))
    this.open();

  // dispose on finish.
  this.once('finish', function onclose() {
    if (this.autoClose)
      this.close();
  });
}
inherits(WriteStream, WritableStream);

WriteStream.prototype.open = function() {
  var self = this;
  this.sftp.open(this.path, this.flags, this.mode, function(er, handle) {
    if (er) {
      self.emit('error', er);
      if (this.autoClose) {
        this.destroyed = this.closed = true;
        self.emit('close');
      }
      return;
    }

    self.handle = handle;
    // SFTPv3 requires absolute offsets, no matter the open flag used
    if (self.flags[0] === 'a') {
      self.sftp.fstat(handle, function tryStat(err, st) {
        if (err) {
          // Try stat() for sftp servers that may not support fstat() for
          // whatever reason
          self.sftp.stat(self.path, function(err_, st_) {
            if (err_) {
              self.destroy();
              self.emit('error', err);
              return;
            }
            tryStat(null, st_);
          });
          return;
        }

        self.pos = st.size;
        self.emit('open', handle);
      });
      return;
    }
    self.emit('open', handle);
  });
};

WriteStream.prototype._write = function(data, encoding, cb) {
  if (!Buffer.isBuffer(data))
    return this.emit('error', new Error('Invalid data'));

  if (!Buffer.isBuffer(this.handle)) {
    return this.once('open', function() {
      this._write(data, encoding, cb);
    });
  }

  var self = this;
  this.sftp.writeData(this.handle,
                      data,
                      0,
                      data.length,
                      this.pos,
                      function(er, bytes) {
    if (er) {
      if (self.autoClose)
        self.destroy();
      return cb(er);
    }
    self.bytesWritten += bytes;
    cb();
  });

  this.pos += data.length;
};

WriteStream.prototype._writev = function(data, cb) {
  if (!Buffer.isBuffer(this.handle)) {
    return this.once('open', function() {
      this._writev(data, cb);
    });
  }

  var sftp = this.sftp;
  var handle = this.handle;
  var writesLeft = data.length;
  var self = this;

  for (var i = 0; i < data.length; ++i) {
    var chunk = data[i].chunk;

    sftp.writeData(handle, chunk, 0, chunk.length, this.pos, onwrite);
    this.pos += chunk.length;
  }

  function onwrite(er, bytes) {
    if (er) {
      self.destroy();
      return cb(er);
    }
    self.bytesWritten += bytes;
    if (--writesLeft === 0)
      cb();
  }
};

WriteStream.prototype.destroy = ReadStream.prototype.destroy;
WriteStream.prototype.close = ReadStream.prototype.close;

// There is no shutdown() for files.
WriteStream.prototype.destroySoon = WriteStream.prototype.end;


module.exports = SFTPStream;


},{"./utils":331,"events":undefined,"fs":undefined,"stream":undefined,"util":undefined}],330:[function(require,module,exports){
// TODO: * Automatic re-key every (configurable) n bytes or length of time
//         - RFC suggests every 1GB of transmitted data or 1 hour, whichever
//           comes sooner
//       * Filter control codes from strings
//         (as per http://tools.ietf.org/html/rfc4251#section-9.2)

var crypto = require('crypto');
var zlib = require('zlib');
var TransformStream = require('stream').Transform;
var inherits = require('util').inherits;
var inspect = require('util').inspect;

var StreamSearch = require('streamsearch');
var Ber = require('asn1').Ber;

var consts = require('./constants');
var utils = require('./utils');
var isStreamCipher = utils.isStreamCipher;
var isGCM = utils.isGCM;
var iv_inc = utils.iv_inc;
var parseKey = utils.parseKey;
var decryptKey = utils.decryptKey;
var genPublicKey = utils.genPublicKey;
var readString = utils.readString;
var readInt = utils.readInt;

var MESSAGE = consts.MESSAGE;
var ALGORITHMS = consts.ALGORITHMS;
var DISCONNECT_REASON = consts.DISCONNECT_REASON;
var CHANNEL_OPEN_FAILURE = consts.CHANNEL_OPEN_FAILURE;
var SSH_TO_OPENSSL = consts.SSH_TO_OPENSSL;
var TERMINAL_MODE = consts.TERMINAL_MODE;
var SIGNALS = consts.SIGNALS;
var BUGS = consts.BUGS;
var BUGGY_IMPLS = consts.BUGGY_IMPLS;
var BUGGY_IMPLS_LEN = BUGGY_IMPLS.length;
var MODULE_VER = require('../package.json').version;
var I = 0;
var IN_INIT = I++;
var IN_GREETING = I++;
var IN_HEADER = I++;
var IN_PACKETBEFORE = I++;
var IN_PACKET = I++;
var IN_PACKETDATA = I++;
var IN_PACKETDATAVERIFY = I++;
var IN_PACKETDATAAFTER = I++;
var OUT_INIT = I++;
var OUT_READY = I++;
var OUT_REKEYING = I++;
var MAX_SEQNO = 4294967295;
var MAX_PACKET_SIZE = 35000;
var MAX_PACKETS_REKEYING = 50;
var EXP_TYPE_HEADER = 0;
var EXP_TYPE_LF = 1;
var EXP_TYPE_BYTES = 2; // waits until n bytes have been seen

var RE_SHA1 = /^group|gex-sha1$/i;
var RE_NULL = /\x00/g;

var IDENT_PREFIX_BUFFER = new Buffer('SSH-');
var EMPTY_BUFFER = new Buffer(0);
var PING_PACKET = new Buffer([
  MESSAGE.GLOBAL_REQUEST,
  // "keepalive@openssh.com"
  0, 0, 0, 21,
    107, 101, 101, 112, 97, 108, 105, 118, 101, 64, 111, 112, 101, 110, 115,
    115, 104, 46, 99, 111, 109,
  // request a reply
  1
]);
var NEWKEYS_PACKET = new Buffer([MESSAGE.NEWKEYS]);
var USERAUTH_SUCCESS_PACKET = new Buffer([MESSAGE.USERAUTH_SUCCESS]);
var REQUEST_SUCCESS_PACKET = new Buffer([MESSAGE.REQUEST_SUCCESS]);
var REQUEST_FAILURE_PACKET = new Buffer([MESSAGE.REQUEST_FAILURE]);
var NO_TERMINAL_MODES_BUFFER = new Buffer([TERMINAL_MODE.TTY_OP_END]);
var KEXDH_GEX_REQ_PACKET = new Buffer([
  MESSAGE.KEXDH_GEX_REQUEST,
  // minimal size in bits of an acceptable group
  0, 0, 4, 0, // 1024, modp2
  // preferred size in bits of the group the server will send
  0, 0, 10, 0, // 4096, modp16
  // maximal size in bits of an acceptable group
  0, 0, 20, 0 // 8192, modp18
]);

function DEBUG_NOOP(msg) {}

function SSH2Stream(cfg) {
  if (typeof cfg !== 'object')
    cfg = {};

  TransformStream.call(this, {
    highWaterMark: (typeof cfg.highWaterMark === 'number'
                    ? cfg.highWaterMark
                    : 32 * 1024)
  });

  this._needContinue = false;
  this.bytesSent = this.bytesReceived = 0;
  this.debug = (typeof cfg.debug === 'function' ? cfg.debug : DEBUG_NOOP);
  this.server = (cfg.server === true);
  this.doCompress = false;
  this.maxPacketSize = (typeof cfg.maxPacketSize === 'number'
                        ? cfg.maxPacketSize
                        : MAX_PACKET_SIZE);
  // bitmap that indicates any bugs the remote side has. this is determined
  // by the reported software version.
  this.remoteBugs = 0;

  if (this.server) {
    // TODO: remove when we support group exchange for server implementation
    this.remoteBugs = BUGS.BAD_DHGEX;
  }

  var privKeyInfo;
  var publicKeyInfo;
  var self = this;

  if (this.server
      && typeof cfg.privateKey !== 'string'
      && !Buffer.isBuffer(cfg.privateKey))
    throw new Error('Invalid/missing privateKey');
  else if (this.server) {
    privKeyInfo = parseKey(cfg.privateKey);
    if (privKeyInfo instanceof Error)
      throw new Error('Cannot parse privateKey: ' + privKeyInfo.message);
    if (!privKeyInfo.private)
      throw new Error('privateKey value does not contain a (valid) private key');
    if (privKeyInfo.encryption) {
      if (typeof cfg.passphrase !== 'string')
        throw new Error('Encrypted private key detected, but no passphrase given');
      decryptKey(privKeyInfo, cfg.passphrase);
    }
    publicKeyInfo = genPublicKey(privKeyInfo);
  }

  this.config = {
    // server
    privateKey: privKeyInfo,
    publicKey: publicKeyInfo,

    // client/server
    ident: 'SSH-2.0-'
           + (cfg.ident || ('ssh2js' + MODULE_VER + (this.server ? 'srv' : '')))
  };
  // RFC 4253 states the identification string must not contain NULL
  this.config.ident.replace(RE_NULL, '');

  if (this.config.ident.length + 2 /* account for "\r\n" */ > 255)
    throw new Error('ident too long');

  this.reset(true);

  // common events
  this.on('header', function(header) {
    var identRaw = header.identRaw;
    var software = header.versions.software;
    self.debug('DEBUG: Remote ident: ' + inspect(identRaw));
    for (var i = 0, rule; i < BUGGY_IMPLS_LEN; ++i) {
      rule = BUGGY_IMPLS[i];
      if (typeof rule[0] === 'string') {
        if (software === rule[0])
          self.remoteBugs |= rule[1];
      } else if (rule[0].test(software))
        self.remoteBugs |= rule[1];
    }
    self._state.incoming.identRaw = identRaw;
    KEXINIT(self);
  });
  this.on('end', function() {
    // let GC collect any Buffers we were previously storing
    self._state = undefined;
    self.reset();
    self._state.incoming.hmac.bufCompute = undefined;
    self._state.outgoing.bufSeqno = undefined;
  });
  this.on('DISCONNECT', function(reason, code, desc, lang) {
    onDISCONNECT(self, reason, code, desc, lang);
  });
  this.on('KEXINIT', function(init) { onKEXINIT(self, init); });
  this.on('NEWKEYS', function() { onNEWKEYS(self); });

  if (this.server) {
    // server-specific events
    this.on('KEXDH_INIT', function(e) { onKEXDH_INIT(self, e); });
  } else {
    // client-specific events
    this.on('KEXDH_REPLY', function(info) { onKEXDH_REPLY(self, info); })
        .on('KEXDH_GEX_GROUP',
            function(prime, gen) { onKEXDH_GEX_GROUP(self, prime, gen); });
  }

  if (this.server && typeof cfg.banner === 'string') {
    if (cfg.banner.slice(-2) === '\r\n')
      this.push(cfg.banner);
    else
      this.push(cfg.banner + '\r\n');
  }
  this.debug('DEBUG: Local ident: ' + inspect(this.config.ident));
  this.push(this.config.ident + '\r\n');

  this._state.incoming.expectedPacket = 'KEXINIT';
}
inherits(SSH2Stream, TransformStream);

SSH2Stream.prototype.__read = TransformStream.prototype._read;
SSH2Stream.prototype._read = function(n) {
  if (this._needContinue) {
    this._needContinue = false;
    this.emit('continue');
  }
  return this.__read(n);
};
SSH2Stream.prototype.__push = TransformStream.prototype.push;
SSH2Stream.prototype.push = function(chunk, encoding) {
  var ret = this.__push(chunk, encoding);
  this._needContinue = (ret === false);
  return ret;
};

SSH2Stream.prototype._cleanup = function(callback) {
  this.reset();
  this.debug('DEBUG: Parser: Malformed packet');
  callback && callback(new Error('Malformed packet'));
};

SSH2Stream.prototype._transform = function(chunk, encoding, callback) {
  var skipDecrypt = false;
  var doDecryptGCM = false;
  var state = this._state;
  var instate = state.incoming;
  var outstate = state.outgoing;
  var expect = instate.expect;
  var decrypt = instate.decrypt;
  var decompress = instate.decompress;
  var chlen = chunk.length;
  var chleft = 0;
  var debug = this.debug;
  var i = 0;
  var p = i;
  var buffer;
  var buf;
  var r;

  this.bytesReceived += chlen;

  while (true) {
    if (expect.type !== undefined) {
      if (i >= chlen)
        break;
      if (expect.type === EXP_TYPE_BYTES) {
        chleft = (chlen - i);
        var pktLeft = (expect.buf.length - expect.ptr);
        if (pktLeft <= chleft) {
          chunk.copy(expect.buf, expect.ptr, i, i + pktLeft);
          i += pktLeft;
          buffer = expect.buf;
          expect.buf = undefined;
          expect.ptr = 0;
          expect.type = undefined;
        } else {
          chunk.copy(expect.buf, expect.ptr, i);
          expect.ptr += chleft;
          i += chleft;
        }
        continue;
      } else if (expect.type === EXP_TYPE_HEADER) {
        i += instate.search.push(chunk);
        if (expect.type !== undefined)
          continue;
      } else if (expect.type === EXP_TYPE_LF) {
        if (++expect.ptr + 4 /* account for "SSH-" */ > 255) {
          this.reset();
          debug('DEBUG: Parser: Identification string exceeded 255 characters');
          return callback(new Error('Max identification string size exceeded'));
        }
        if (chunk[i] === 0x0A) {
          expect.type = undefined;
          if (p < i) {
            if (expect.buf === undefined)
              expect.buf = chunk.toString('ascii', p, i);
            else
              expect.buf += chunk.toString('ascii', p, i);
          }
          buffer = expect.buf;
          expect.buf = undefined;
          ++i;
        } else {
          if (++i === chlen && p < i) {
            if (expect.buf === undefined)
              expect.buf = chunk.toString('ascii', p, i);
            else
              expect.buf += chunk.toString('ascii', p, i);
          }
          continue;
        }
      }
    }

    if (instate.status === IN_INIT) {
      if (this.server) {
        // retrieve what should be the start of the protocol version exchange
        if (!buffer) {
          debug('DEBUG: Parser: IN_INIT (waiting for identification begin)');
          expectData(this, EXP_TYPE_BYTES, 4);
        } else {
          if (buffer[0] === 0x53       // S
              && buffer[1] === 0x53    // S
              && buffer[2] === 0x48    // H
              && buffer[3] === 0x2D) { // -
            instate.status = IN_GREETING;
            debug('DEBUG: Parser: IN_INIT (waiting for rest of identification)');
          } else {
            this.reset();
            debug('DEBUG: Parser: Bad identification start');
            return callback(new Error('Bad identification start'));
          }
        }
      } else {
        debug('DEBUG: Parser: IN_INIT');
        // retrieve any bytes that may come before the protocol version exchange
        var ss = instate.search = new StreamSearch(IDENT_PREFIX_BUFFER);
        ss.on('info', function onInfo(matched, data, start, end) {
          if (data) {
            if (instate.greeting === undefined)
              instate.greeting = data.toString('binary', start, end);
            else
              instate.greeting += data.toString('binary', start, end);
          }
          if (matched) {
            expect.type = undefined;
            instate.search.removeListener('info', onInfo);
          }
        });
        ss.maxMatches = 1;
        expectData(this, EXP_TYPE_HEADER);
        instate.status = IN_GREETING;
      }
    } else if (instate.status === IN_GREETING) {
      debug('DEBUG: Parser: IN_GREETING');
      instate.search = undefined;
      // retrieve the identification bytes after the "SSH-" header
      p = i;
      expectData(this, EXP_TYPE_LF);
      instate.status = IN_HEADER;
    } else if (instate.status === IN_HEADER) {
      debug('DEBUG: Parser: IN_HEADER');
      buffer = buffer.trim();
      var idxDash = buffer.indexOf('-');
      var idxSpace = buffer.indexOf(' ');
      var header = {
        // RFC says greeting SHOULD be utf8
        greeting: instate.greeting,
        identRaw: 'SSH-' + buffer,
        versions: {
          protocol: buffer.substr(0, idxDash),
          software: (idxSpace === -1
                     ? buffer.substring(idxDash + 1)
                     : buffer.substring(idxDash + 1, idxSpace))
        },
        comments: (idxSpace > -1 ? buffer.substring(idxSpace + 1) : undefined)
      };
      instate.greeting = undefined;

      if (header.versions.protocol !== '1.99'
          && header.versions.protocol !== '2.0') {
        this.reset();
        debug('DEBUG: Parser: protocol version not supported: '
              + header.versions.protocol);
        return callback(new Error('Protocol version not supported'));
      } else
        this.emit('header', header);
      if (instate.status === IN_INIT) {
        // we reset from an event handler
        // possibly due to an unsupported SSH protocol version?
        return;
      }
      instate.status = IN_PACKETBEFORE;
    } else if (instate.status === IN_PACKETBEFORE) {
      debug('DEBUG: Parser: IN_PACKETBEFORE (expecting ' + decrypt.size + ')');
      // wait for the right number of bytes so we can determine the incoming
      // packet length
      expectData(this, EXP_TYPE_BYTES, decrypt.size, decrypt.buf);
      instate.status = IN_PACKET;
    } else if (instate.status === IN_PACKET) {
      debug('DEBUG: Parser: IN_PACKET');
      doDecryptGCM = (decrypt.instance && isGCM(decrypt.type));
      if (decrypt.instance && !isGCM(decrypt.type))
        buffer = decryptData(this, buffer);

      r = readInt(buffer, 0, this, callback);
      if (r === false)
        return;
      var macSize = (instate.hmac.size || 0);
      var fullPacketLen = r + 4 + macSize;
      if (fullPacketLen > this.maxPacketSize
          // TODO: change 16 to "MAX(16, decrypt.size)" when/if SSH2 adopts
          // 512-bit ciphers
          || fullPacketLen < (16 + macSize)
          || ((r + 4) % decrypt.size) !== 0) {
        // TODO: account for compressed payloads when checking against
        // maxPacketSize. dropbear allows an extra
        // (((maxPacketSize/16384)+1)*5 + 6) bytes for compressed payloads.
        this.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
        debug('DEBUG: Parser: Bad packet length (' + fullPacketLen + ')');
        return callback(new Error('Bad packet length'));
      }

      instate.pktLen = r;
      var remainLen = instate.pktLen + 4 - decrypt.size;
      if (doDecryptGCM) {
        decrypt.instance.setAAD(buffer.slice(0, 4));
        debug('DEBUG: Parser: pktLen:'
              + instate.pktLen
              + ',remainLen:'
              + remainLen);
      } else {
        instate.padLen = buffer[4];
        debug('DEBUG: Parser: pktLen:'
              + instate.pktLen
              + ',padLen:'
              + instate.padLen
              + ',remainLen:'
              + remainLen);
      }
      if (remainLen > 0) {
        if (doDecryptGCM)
          instate.pktExtra = buffer.slice(4);
        else
          instate.pktExtra = buffer.slice(5);
        // grab the rest of the packet
        expectData(this, EXP_TYPE_BYTES, remainLen);
        instate.status = IN_PACKETDATA;
      } else if (remainLen < 0)
        instate.status = IN_PACKETBEFORE;
      else {
        // entire message fit into one block
        skipDecrypt = true;
        instate.status = IN_PACKETDATA;
        continue;
      }
    } else if (instate.status === IN_PACKETDATA) {
      debug('DEBUG: Parser: IN_PACKETDATA');
      doDecryptGCM = (decrypt.instance && isGCM(decrypt.type));
      if (decrypt.instance && !skipDecrypt && !doDecryptGCM)
        buffer = decryptData(this, buffer);
      else if (skipDecrypt)
        skipDecrypt = false;
      var padStart = instate.pktLen - instate.padLen - 1;
      // TODO: allocate a Buffer once that is slightly larger than maxPacketSize
      // (to accommodate for packet length field and MAC) and re-use that
      // instead
      if (instate.pktExtra) {
        buf = new Buffer(instate.pktExtra.length + buffer.length);
        instate.pktExtra.copy(buf);
        buffer.copy(buf, instate.pktExtra.length);
        instate.payload = buf.slice(0, padStart);
      } else {
        // entire message fit into one block
        if (doDecryptGCM)
          buf = buffer.slice(4);
        else
          buf = buffer.slice(5);
        instate.payload = buffer.slice(5, 5 + padStart);
      }
      if (instate.hmac.size !== undefined) {
        // wait for hmac hash
        debug('DEBUG: Parser: HMAC size:' + instate.hmac.size);
        expectData(this, EXP_TYPE_BYTES, instate.hmac.size, instate.hmac.buf);
        instate.status = IN_PACKETDATAVERIFY;
        instate.packet = buf;
      } else
        instate.status = IN_PACKETDATAAFTER;
      instate.pktExtra = undefined;
      buf = undefined;
    } else if (instate.status === IN_PACKETDATAVERIFY) {
      debug('DEBUG: Parser: IN_PACKETDATAVERIFY');
      // verify packet data integrity
      if (hmacVerify(this, buffer)) {
        debug('DEBUG: Parser: IN_PACKETDATAVERIFY (Valid HMAC)');
        instate.status = IN_PACKETDATAAFTER;
        instate.packet = undefined;
      } else {
        this.reset();
        debug('DEBUG: Parser: IN_PACKETDATAVERIFY (Invalid HMAC)');
        return callback(new Error('Invalid HMAC'));
      }
    } else if (instate.status === IN_PACKETDATAAFTER) {
      if (decompress.instance) {
        debug('DEBUG: Parser: Decompressing');
        instate.payload = decompress.instance(instate.payload);
      }

      this.emit('packet');

      var ptype = instate.payload[0];

      if (debug !== DEBUG_NOOP) {
        var msgPacket = 'DEBUG: Parser: IN_PACKETDATAAFTER, packet: ';
        var kexdh = state.kexdh;
        var authMethod = state.authMethod;
        var msgPktType = null;

        if (outstate.status === OUT_REKEYING
            && !(ptype <= 4 || (ptype >= 20 && ptype <= 49)))
          msgPacket += '(enqueued) ';

        if (kexdh === 'group' && ptype === MESSAGE.KEXDH_INIT)
          msgPktType = 'KEXDH_INIT';
        else if (kexdh === 'group' && ptype === MESSAGE.KEXDH_REPLY)
          msgPktType = 'KEXDH_REPLY';
        else if (kexdh !== 'group' && ptype === MESSAGE.KEXDH_GEX_GROUP)
          msgPktType = 'KEXDH_GEX_GROUP';
        else if (kexdh !== 'group' && ptype === MESSAGE.KEXDH_GEX_REPLY)
          msgPktType = 'KEXDH_GEX_REPLY';
        else if (ptype === 60) {
          if (authMethod === 'password')
            msgPktType = 'USERAUTH_PASSWD_CHANGEREQ';
          else if (authMethod === 'keyboard-interactive')
            msgPktType = 'USERAUTH_INFO_REQUEST';
          else if (authMethod === 'publickey')
            msgPktType = 'USERAUTH_PK_OK';
        } else if (ptype === 61) {
          if (authMethod === 'keyboard-interactive')
            msgPktType = 'USERAUTH_INFO_RESPONSE';
        }

        if (msgPktType === null)
          msgPktType = MESSAGE[ptype];

        // don't write debug output for messages we custom make in parsePacket()
        if (ptype !== MESSAGE.CHANNEL_OPEN
            && ptype !== MESSAGE.CHANNEL_REQUEST
            && ptype !== MESSAGE.CHANNEL_SUCCESS
            && ptype !== MESSAGE.CHANNEL_FAILURE
            && ptype !== MESSAGE.CHANNEL_EOF
            && ptype !== MESSAGE.CHANNEL_CLOSE
            && ptype !== MESSAGE.CHANNEL_DATA
            && ptype !== MESSAGE.CHANNEL_EXTENDED_DATA
            && ptype !== MESSAGE.CHANNEL_WINDOW_ADJUST
            && ptype !== MESSAGE.DISCONNECT
            && ptype !== MESSAGE.USERAUTH_REQUEST)
          debug(msgPacket + msgPktType);
      }

      // only parse packet if we are not re-keying or the packet is not a
      // transport layer packet needed for re-keying
      if (outstate.status === OUT_READY
          || ptype <= 4
          || (ptype >= 20 && ptype <= 49)) {
        if (parsePacket(this, callback) === false)
          return;

        if (instate.status === IN_INIT) {
          // we were reset due to some error/disagreement ?
          return;
        }
      } else if (outstate.status === OUT_REKEYING) {
        if (instate.rekeyQueue.length === MAX_PACKETS_REKEYING) {
          debug('DEBUG: Parser: Max incoming re-key queue length reached');
          this.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
          return callback(
            new Error('Incoming re-key queue length limit reached')
          );
        }

        // make sure to record the sequence number in case we need it later on
        // when we drain the queue (e.g. unknown packet)
        var seqno = instate.seqno;
        if (++instate.seqno > MAX_SEQNO)
          instate.seqno = 0;

        instate.rekeyQueue.push([seqno,instate.payload]);
      }

      instate.status = IN_PACKETBEFORE;
      instate.payload = undefined;
    }
    if (buffer !== undefined)
      buffer = undefined;
  }

  callback();
};

SSH2Stream.prototype.reset = function(noend) {
  if (this._state) {
    var state = this._state;
    state.incoming.status = IN_INIT;
    state.outgoing.status = OUT_INIT;
  } else {
    this._state = {
      authMethod: undefined,
      hostkeyFormat: undefined,
      kex: undefined,
      kexdh: undefined,

      incoming: {
        status: IN_INIT,
        expectedPacket: undefined,
        search: undefined,
        greeting: undefined,
        seqno: 0,
        pktLen: undefined,
        padLen: undefined,
        pktExtra: undefined,
        payload: undefined,
        packet: undefined,
        kexinit: undefined,
        identRaw: undefined,
        rekeyQueue: [],

        expect: {
          amount: undefined,
          type: undefined,
          ptr: 0,
          buf: undefined
        },

        decrypt: {
          instance: false,
          size: 8,
          iv: undefined, // GCM
          key: undefined, // GCM
          buf: undefined,
          type: undefined
        },

        hmac: {
          size: undefined,
          key: undefined,
          buf: undefined,
          bufCompute: new Buffer(9),
          type: false
        },

        decompress: {
          instance: false,
          type: false
        }
      },

      outgoing: {
        status: OUT_INIT,
        seqno: 0,
        bufSeqno: new Buffer(4),
        rekeyQueue: [],
        kexinit: undefined,
        kexsecret: undefined,
        pubkey: undefined,
        exchangeHash: undefined,
        sessionId: undefined,

        encrypt: {
          instance: false,
          size: 8,
          iv: undefined, // GCM
          key: undefined, // GCM
          type: undefined
        },

        hmac: {
          size: undefined,
          key: undefined,
          buf: undefined,
          type: false
        },

        compress: {
          instance: false,
          type: false
        }
      }
    };
  }
  if (!noend) {
    if (this.readable)
      this.push(null);
  }
};

// common methods
// global
SSH2Stream.prototype.disconnect = function(reason) {
  /*
    byte      SSH_MSG_DISCONNECT
    uint32    reason code
    string    description in ISO-10646 UTF-8 encoding
    string    language tag
  */
  var buf = new Buffer(1 + 4 + 4 + 4);

  buf.fill(0);
  buf[0] = MESSAGE.DISCONNECT;

  if (DISCONNECT_REASON[reason] === undefined)
    reason = DISCONNECT_REASON.BY_APPLICATION;
  buf.writeUInt32BE(reason, 1, true);

  this.debug('DEBUG: Outgoing: Writing DISCONNECT ('
             + DISCONNECT_REASON[reason]
             + ')');
  send(this, buf);
  this.reset();

  return false;
};
SSH2Stream.prototype.ping = function() {
  this.debug('DEBUG: Outgoing: Writing ping (GLOBAL_REQUEST: keepalive@openssh.com)');
  return send(this, PING_PACKET);
};
SSH2Stream.prototype.rekey = function() {
  var status = this._state.outgoing.status;
  if (status === OUT_REKEYING)
    throw new Error('A re-key is already in progress');
  else if (status !== OUT_READY)
    throw new Error('Cannot re-key yet');

  this.debug('DEBUG: Outgoing: Starting re-key');
  return KEXINIT(this);
};

// ssh-connection service-specific
SSH2Stream.prototype.requestSuccess = function(data) {
  var buf;
  if (Buffer.isBuffer(data)) {
    buf = new Buffer(1 + data.length);

    buf[0] = MESSAGE.REQUEST_SUCCESS;

    data.copy(buf, 1);
  } else
    buf = REQUEST_SUCCESS_PACKET;

  this.debug('DEBUG: Outgoing: Writing REQUEST_SUCCESS');
  return send(this, buf);
};
SSH2Stream.prototype.requestFailure = function() {
  this.debug('DEBUG: Outgoing: Writing REQUEST_FAILURE');
  return send(this, REQUEST_FAILURE_PACKET);
};
SSH2Stream.prototype.channelSuccess = function(chan) {
  // does not consume window space
  var buf = new Buffer(1 + 4);

  buf[0] = MESSAGE.CHANNEL_SUCCESS;

  buf.writeUInt32BE(chan, 1, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_SUCCESS (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelFailure = function(chan) {
  // does not consume window space
  var buf = new Buffer(1 + 4);

  buf[0] = MESSAGE.CHANNEL_FAILURE;

  buf.writeUInt32BE(chan, 1, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_FAILURE (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelEOF = function(chan) {
  // does not consume window space
  var buf = new Buffer(1 + 4);

  buf[0] = MESSAGE.CHANNEL_EOF;

  buf.writeUInt32BE(chan, 1, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_EOF (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelClose = function(chan) {
  // does not consume window space
  var buf = new Buffer(1 + 4);

  buf[0] = MESSAGE.CHANNEL_CLOSE;

  buf.writeUInt32BE(chan, 1, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_CLOSE (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelWindowAdjust = function(chan, amount) {
  // does not consume window space
  var buf = new Buffer(1 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_WINDOW_ADJUST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(amount, 5, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_WINDOW_ADJUST ('
             + chan
             + ', '
             + amount
             + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelData = function(chan, data) {
  var dataIsBuffer = Buffer.isBuffer(data);
  var dataLen = (dataIsBuffer ? data.length : Buffer.byteLength(data));
  var buf = new Buffer(1 + 4 + 4 + dataLen);

  buf[0] = MESSAGE.CHANNEL_DATA;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(dataLen, 5, true);
  if (dataIsBuffer)
    data.copy(buf, 9);
  else
    buf.write(data, 9, dataLen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_DATA (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelExtData = function(chan, data, type) {
  var dataIsBuffer = Buffer.isBuffer(data);
  var dataLen = (dataIsBuffer ? data.length : Buffer.byteLength(data));
  var buf = new Buffer(1 + 4 + 4 + 4 + dataLen);

  buf[0] = MESSAGE.CHANNEL_EXTENDED_DATA;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(type, 5, true);

  buf.writeUInt32BE(dataLen, 9, true);
  if (dataIsBuffer)
    data.copy(buf, 13);
  else
    buf.write(data, 13, dataLen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_EXTENDED_DATA (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelOpenConfirm = function(remoteChan, localChan,
                                                   initWindow, maxPacket) {
  var buf = new Buffer(1 + 4 + 4 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN_CONFIRMATION;

  buf.writeUInt32BE(remoteChan, 1, true);

  buf.writeUInt32BE(localChan, 5, true);

  buf.writeUInt32BE(initWindow, 9, true);

  buf.writeUInt32BE(maxPacket, 13, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN_CONFIRMATION (r:'
             + remoteChan
             + ', l:'
             + localChan
             + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelOpenFail = function(remoteChan, reason, desc,
                                                lang) {
  if (typeof desc !== 'string')
    desc = '';
  if (typeof lang !== 'string')
    lang = '';

  var descLen = Buffer.byteLength(desc);
  var langLen = Buffer.byteLength(lang);
  var p = 9;
  var buf = new Buffer(1 + 4 + 4 + 4 + descLen + 4 + langLen);

  buf[0] = MESSAGE.CHANNEL_OPEN_FAILURE;

  buf.writeUInt32BE(remoteChan, 1, true);

  buf.writeUInt32BE(reason, 5, true);

  buf.writeUInt32BE(descLen, p, true);
  p += 4;
  if (descLen) {
    buf.write(desc, p, descLen, 'utf8');
    p += descLen;
  }

  buf.writeUInt32BE(langLen, p, true);
  if (langLen)
    buf.write(lang, p += 4, langLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN_FAILURE ('
             + remoteChan
             + ')');
  return send(this, buf);
};

// client-specific methods
// global
SSH2Stream.prototype.service = function(svcName) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var svcNameLen = Buffer.byteLength(svcName);
  var buf = new Buffer(1 + 4 + svcNameLen);

  buf[0] = MESSAGE.SERVICE_REQUEST;

  buf.writeUInt32BE(svcNameLen, 1, true);
  buf.write(svcName, 5, svcNameLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing SERVICE_REQUEST (' + svcName + ')');
  return send(this, buf);
};
// ssh-connection service-specific
SSH2Stream.prototype.tcpipForward = function(bindAddr, bindPort, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var addrlen = Buffer.byteLength(bindAddr);
  var buf = new Buffer(1 + 4 + 13 + 1 + 4 + addrlen + 4);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  buf.writeUInt32BE(13, 1, true);
  buf.write('tcpip-forward', 5, 13, 'ascii');

  buf[18] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf.writeUInt32BE(addrlen, 19, true);
  buf.write(bindAddr, 23, addrlen, 'ascii');

  buf.writeUInt32BE(bindPort, 23 + addrlen, true);

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (tcpip-forward)');
  return send(this, buf);
};
SSH2Stream.prototype.cancelTcpipForward = function(bindAddr, bindPort,
                                                   wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var addrlen = Buffer.byteLength(bindAddr);
  var buf = new Buffer(1 + 4 + 20 + 1 + 4 + addrlen + 4);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  buf.writeUInt32BE(20, 1, true);
  buf.write('cancel-tcpip-forward', 5, 20, 'ascii');

  buf[25] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf.writeUInt32BE(addrlen, 26, true);
  buf.write(bindAddr, 30, addrlen, 'ascii');

  buf.writeUInt32BE(bindPort, 30 + addrlen, true);

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (cancel-tcpip-forward)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_streamLocalForward = function(socketPath,
                                                           wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var pathlen = Buffer.byteLength(pathlen);
  var buf = new Buffer(1 + 4 + 31 + 1 + 4 + pathlen);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  buf.writeUInt32BE(31, 1, true);
  buf.write('streamlocal-forward@openssh.com', 5, 31, 'ascii');

  buf[36] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf.writeUInt32BE(pathlen, 37, true);
  buf.write(socketPath, 41, pathlen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (streamlocal-forward@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_cancelStreamLocalForward = function(socketPath,
                                                                 wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var pathlen = Buffer.byteLength(pathlen);
  var buf = new Buffer(1 + 4 + 38 + 1 + 4 + pathlen);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  buf.writeUInt32BE(38, 1, true);
  buf.write('cancel-streamlocal-forward@openssh.com', 5, 38, 'ascii');

  buf[43] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf.writeUInt32BE(pathlen, 44, true);
  buf.write(socketPath, 48, pathlen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (cancel-streamlocal-forward@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.directTcpip = function(chan, initWindow, maxPacket, cfg) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var srclen = Buffer.byteLength(cfg.srcIP);
  var dstlen = Buffer.byteLength(cfg.dstIP);
  var p = 29;
  var buf = new Buffer(1 + 4 + 12 + 4 + 4 + 4 + 4 + srclen + 4 + 4 + dstlen
                       + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  buf.writeUInt32BE(12, 1, true);
  buf.write('direct-tcpip', 5, 12, 'ascii');

  buf.writeUInt32BE(chan, 17, true);

  buf.writeUInt32BE(initWindow, 21, true);

  buf.writeUInt32BE(maxPacket, 25, true);

  buf.writeUInt32BE(dstlen, p, true);
  buf.write(cfg.dstIP, p += 4, dstlen, 'ascii');

  buf.writeUInt32BE(cfg.dstPort, p += dstlen, true);

  buf.writeUInt32BE(srclen, p += 4, true);
  buf.write(cfg.srcIP, p += 4, srclen, 'ascii');

  buf.writeUInt32BE(cfg.srcPort, p += srclen, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', direct-tcpip)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_directStreamLocal = function(chan, initWindow,
                                                          maxPacket, cfg) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var pathlen = Buffer.byteLength(cfg.socketPath);
  var p = 47;
  var buf = new Buffer(1 + 4 + 30 + 4 + 4 + 4 + 4 + pathlen + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  buf.writeUInt32BE(30, 1, true);
  buf.write('direct-streamlocal@openssh.com', 5, 30, 'ascii');

  buf.writeUInt32BE(chan, 35, true);

  buf.writeUInt32BE(initWindow, 39, true);

  buf.writeUInt32BE(maxPacket, 43, true);

  buf.writeUInt32BE(pathlen, p, true);
  buf.write(cfg.socketPath, p += 4, pathlen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', direct-streamlocal@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_noMoreSessions = function(wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var buf = new Buffer(1 + 4 + 28 + 1);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  buf.writeUInt32BE(28, 1, true);
  buf.write('no-more-sessions@openssh.com', 5, 28, 'ascii');

  buf[33] = (wantReply === undefined || wantReply === true ? 1 : 0);

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (no-more-sessions@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.session = function(chan, initWindow, maxPacket) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  var buf = new Buffer(1 + 4 + 7 + 4 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  buf.writeUInt32BE(7, 1, true);
  buf.write('session', 5, 7, 'ascii');

  buf.writeUInt32BE(chan, 12, true);

  buf.writeUInt32BE(initWindow, 16, true);

  buf.writeUInt32BE(maxPacket, 20, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', session)');
  return send(this, buf);
};
SSH2Stream.prototype.windowChange = function(chan, rows, cols, height, width) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  var buf = new Buffer(1 + 4 + 4 + 13 + 1 + 4 + 4 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(13, 5, true);
  buf.write('window-change', 9, 13, 'ascii');

  buf[22] = 0;

  buf.writeUInt32BE(cols, 23, true);

  buf.writeUInt32BE(rows, 27, true);

  buf.writeUInt32BE(width, 31, true);

  buf.writeUInt32BE(height, 35, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', window-change)');
  return send(this, buf);
};
SSH2Stream.prototype.pty = function(chan, rows, cols, height,
                                    width, term, modes, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  if (!term || !term.length)
    term = 'vt100';
  if (modes
      && !Buffer.isBuffer(modes)
      && !Array.isArray(modes)
      && typeof modes === 'object')
    modes = modesToBytes(modes);
  if (!modes || !modes.length)
    modes = NO_TERMINAL_MODES_BUFFER;

  var termLen = term.length;
  var modesLen = modes.length;
  var p = 21;
  var buf = new Buffer(1 + 4 + 4 + 7 + 1 + 4 + termLen + 4 + 4 + 4 + 4 + 4
                       + modesLen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(7, 5, true);
  buf.write('pty-req', 9, 7, 'ascii');

  buf[16] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf.writeUInt32BE(termLen, 17, true);
  buf.write(term, 21, termLen, 'utf8');

  buf.writeUInt32BE(cols, p += termLen, true);

  buf.writeUInt32BE(rows, p += 4, true);

  buf.writeUInt32BE(width, p += 4, true);

  buf.writeUInt32BE(height, p += 4, true);

  buf.writeUInt32BE(modesLen, p += 4, true);
  p += 4;
  if (Array.isArray(modes)) {
    for (var i = 0; i < modesLen; ++i)
      buf[p++] = modes[i];
  } else if (Buffer.isBuffer(modes))
    modes.copy(buf, p);
  else if (typeof modes === 'string')
    buf.write(modes, p += 4, modesLen, 'binary');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', pty-req)');
  return send(this, buf);
};
SSH2Stream.prototype.shell = function(chan, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  var buf = new Buffer(1 + 4 + 4 + 5 + 1);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(5, 5, true);
  buf.write('shell', 9, 5, 'ascii');

  buf[14] = (wantReply === undefined || wantReply === true ? 1 : 0);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', shell)');
  return send(this, buf);
};
SSH2Stream.prototype.exec = function(chan, cmd, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  var cmdlen = (Buffer.isBuffer(cmd) ? cmd.length : Buffer.byteLength(cmd));
  var buf = new Buffer(1 + 4 + 4 + 4 + 1 + 4 + cmdlen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(4, 5, true);
  buf.write('exec', 9, 4, 'ascii');

  buf[13] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf.writeUInt32BE(cmdlen, 14, true);
  if (Buffer.isBuffer(cmd))
    cmd.copy(buf, 18);
  else
    buf.write(cmd, 18, cmdlen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', exec)');
  return send(this, buf);
};
SSH2Stream.prototype.signal = function(chan, signal) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  signal = signal.toUpperCase();
  if (signal.slice(0, 3) === 'SIG')
    signal = signal.substring(3);

  if (SIGNALS.indexOf(signal) === -1)
    throw new Error('Invalid signal: ' + signal);

  var signalLen = signal.length;
  var buf = new Buffer(1 + 4 + 4 + 6 + 1 + 4 + signalLen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(6, 5, true);
  buf.write('signal', 9, 6, 'ascii');

  buf[15] = 0;

  buf.writeUInt32BE(signalLen, 16, true);
  buf.write(signal, 20, signalLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', signal)');
  return send(this, buf);
};
SSH2Stream.prototype.env = function(chan, key, val, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  var keyLen = Buffer.byteLength(key);
  var valLen = (Buffer.isBuffer(val) ? val.length : Buffer.byteLength(val));
  var buf = new Buffer(1 + 4 + 4 + 3 + 1 + 4 + keyLen + 4 + valLen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(3, 5, true);
  buf.write('env', 9, 3, 'ascii');

  buf[12] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf.writeUInt32BE(keyLen, 13, true);
  buf.write(key, 17, keyLen, 'ascii');

  buf.writeUInt32BE(valLen, 17 + keyLen, true);
  if (Buffer.isBuffer(val))
    val.copy(buf, 17 + keyLen + 4);
  else
    buf.write(val, 17 + keyLen + 4, valLen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', env)');
  return send(this, buf);
};
SSH2Stream.prototype.x11Forward = function(chan, cfg, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  var protolen = Buffer.byteLength(cfg.protocol);
  var cookielen = Buffer.byteLength(cfg.cookie);
  var buf = new Buffer(1 + 4 + 4 + 7 + 1 + 1 + 4 + protolen + 4 + cookielen
                       + 4);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(7, 5, true);
  buf.write('x11-req', 9, 7, 'ascii');

  buf[16] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf[17] = (cfg.single ? 1 : 0);

  buf.writeUInt32BE(protolen, 18, true);
  var bp = 22;
  if (Buffer.isBuffer(cfg.protocol))
    cfg.protocol.copy(buf, bp);
  else
    buf.write(cfg.protocol, bp, protolen, 'utf8');
  bp += protolen;

  buf.writeUInt32BE(cookielen, bp, true);
  bp += 4;
  if (Buffer.isBuffer(cfg.cookie))
    cfg.cookie.copy(buf, bp);
  else
    buf.write(cfg.cookie, bp, cookielen, 'utf8');
  bp += cookielen;

  buf.writeUInt32BE((cfg.screen || 0), bp, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', x11-req)');
  return send(this, buf);
};
SSH2Stream.prototype.subsystem = function(chan, name, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  var nameLen = Buffer.byteLength(name);
  var buf = new Buffer(1 + 4 + 4 + 9 + 1 + 4 + nameLen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(9, 5, true);
  buf.write('subsystem', 9, 9, 'ascii');

  buf[18] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf.writeUInt32BE(nameLen, 19, true);
  buf.write(name, 23, nameLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', subsystem: '
             + name
             + ')');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_agentForward = function(chan, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // does not consume window space
  var buf = new Buffer(1 + 4 + 4 + 26 + 1);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(26, 5, true);
  buf.write('auth-agent-req@openssh.com', 9, 26, 'ascii');

  buf[35] = (wantReply === undefined || wantReply === true ? 1 : 0);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', auth-agent-req@openssh.com)');
  return send(this, buf);
};
// ssh-userauth service-specific
SSH2Stream.prototype.authPassword = function(username, password) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var userLen = Buffer.byteLength(username);
  var passLen = Buffer.byteLength(password);
  var p = 0;
  var buf = new Buffer(1
                       + 4 + userLen
                       + 4 + 14 // "ssh-connection"
                       + 4 + 8 // "password"
                       + 1
                       + 4 + passLen);

  buf[p] = MESSAGE.USERAUTH_REQUEST;

  buf.writeUInt32BE(userLen, ++p, true);
  buf.write(username, p += 4, userLen, 'utf8');

  buf.writeUInt32BE(14, p += userLen, true);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  buf.writeUInt32BE(8, p += 14, true);
  buf.write('password', p += 4, 8, 'ascii');

  buf[p += 8] = 0;

  buf.writeUInt32BE(passLen, ++p, true);
  buf.write(password, p += 4, passLen, 'utf8');

  this._state.authMethod = 'password';
  this.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (password)');
  return send(this, buf);
};
SSH2Stream.prototype.authPK = function(username, pubKey, cbSign) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var self = this;
  var outstate = this._state.outgoing;
  var pubKeyFullType;
  var pubKeyType;

  this._state.authMethod = 'publickey';

  if (pubKey.public) {
    pubKeyFullType = pubKey.fulltype;
    pubKeyType = pubKey.type;
    pubKey = pubKey.public;
  } else {
    pubKeyFullType = pubKey.toString('ascii',
                                     4,
                                     4 + pubKey.readUInt32BE(0, true));
    pubKeyType = pubKeyFullType.substring(4, 7);
  }

  var userLen = Buffer.byteLength(username);
  var algoLen = Buffer.byteLength(pubKeyFullType);
  var pubKeyLen = pubKey.length;
  var sesLen = outstate.sessionId.length;
  var p = 0;
  var buf = new Buffer((cbSign ? 4 + sesLen : 0)
                       + 1
                       + 4 + userLen
                       + 4 + 14 // "ssh-connection"
                       + 4 + 9 // "publickey"
                       + 1
                       + 4 + algoLen
                       + 4 + pubKeyLen
                      );

  if (cbSign) {
    buf.writeUInt32BE(sesLen, p, true);
    outstate.sessionId.copy(buf, p += 4);
    buf[p += sesLen] = MESSAGE.USERAUTH_REQUEST;
  } else
    buf[p] = MESSAGE.USERAUTH_REQUEST;

  buf.writeUInt32BE(userLen, ++p, true);
  buf.write(username, p += 4, userLen, 'utf8');

  buf.writeUInt32BE(14, p += userLen, true);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  buf.writeUInt32BE(9, p += 14, true);
  buf.write('publickey', p += 4, 9, 'ascii');

  buf[p += 9] = (cbSign ? 1 : 0);

  buf.writeUInt32BE(algoLen, ++p, true);
  buf.write(pubKeyFullType, p += 4, algoLen, 'ascii');
  buf.writeUInt32BE(pubKeyLen, p += algoLen, true);
  pubKey.copy(buf, p += 4);

  if (!cbSign) {
    this.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (publickey -- check)');
    return send(this, buf);
  }

  cbSign(buf, function(signature) {
    var sigLen = signature.length;
    var privAlgoLen = 7;
    var sigbuf = new Buffer(1
                            + 4 + userLen
                            + 4 + 14 // "ssh-connection"
                            + 4 + 9 // "publickey"
                            + 1
                            + 4 + algoLen
                            + 4 + pubKeyLen
                            + 4 // 4 + privAlgoLen + 4 + sigLen
                            + 4 + privAlgoLen
                            + 4 + sigLen);

    p = 0;

    sigbuf[p] = MESSAGE.USERAUTH_REQUEST;

    sigbuf.writeUInt32BE(userLen, ++p, true);
    sigbuf.write(username, p += 4, userLen, 'utf8');

    sigbuf.writeUInt32BE(14, p += userLen, true);
    sigbuf.write('ssh-connection', p += 4, 14, 'ascii');

    sigbuf.writeUInt32BE(9, p += 14, true);
    sigbuf.write('publickey', p += 4, 9, 'ascii');

    sigbuf[p += 9] = 1;

    sigbuf.writeUInt32BE(algoLen, ++p, true);
    sigbuf.write(pubKeyFullType, p += 4, algoLen, 'ascii');

    sigbuf.writeUInt32BE(pubKeyLen, p += algoLen, true);
    pubKey.copy(sigbuf, p += 4);
    sigbuf.writeUInt32BE(4 + privAlgoLen + 4 + sigLen, p += pubKeyLen, true);
    sigbuf.writeUInt32BE(privAlgoLen, p += 4, true);
    sigbuf.write(pubKeyFullType, p += 4, privAlgoLen, 'ascii');
    sigbuf.writeUInt32BE(sigLen, p += privAlgoLen, true);
    signature.copy(sigbuf, p += 4);

    self.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (publickey)');
    return send(self, sigbuf);
  });
  return true;
};
SSH2Stream.prototype.authHostbased = function(username, pubKey, hostname,
                                              userlocal, cbSign) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var self = this;
  var outstate = this._state.outgoing;
  var pubKeyFullType;
  var pubKeyType;

  if (pubKey.public) {
    pubKeyFullType = pubKey.fulltype;
    pubKeyType = pubKey.type;
    pubKey = pubKey.public;
  } else {
    pubKeyFullType = pubKey.toString('ascii',
                                     4,
                                     4 + pubKey.readUInt32BE(0, true));
    pubKeyType = pubKeyFullType.substring(4, 7);
  }

  var userLen = Buffer.byteLength(username);
  var algoLen = Buffer.byteLength(pubKeyFullType);
  var pubKeyLen = pubKey.length;
  var sesLen = outstate.sessionId.length;
  var hostnameLen = Buffer.byteLength(hostname);
  var userlocalLen = Buffer.byteLength(userlocal);
  var p = 0;
  var buf = new Buffer(4 + sesLen
                       + 1
                       + 4 + userLen
                       + 4 + 14 // "ssh-connection"
                       + 4 + 9 // "hostbased"
                       + 4 + algoLen
                       + 4 + pubKeyLen
                       + 4 + hostnameLen
                       + 4 + userlocalLen
                      );

  buf.writeUInt32BE(sesLen, p, true);
  outstate.sessionId.copy(buf, p += 4);

  buf[p += sesLen] = MESSAGE.USERAUTH_REQUEST;

  buf.writeUInt32BE(userLen, ++p, true);
  buf.write(username, p += 4, userLen, 'utf8');

  buf.writeUInt32BE(14, p += userLen, true);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  buf.writeUInt32BE(9, p += 14, true);
  buf.write('hostbased', p += 4, 9, 'ascii');

  buf.writeUInt32BE(algoLen, p += 9, true);
  buf.write(pubKeyFullType, p += 4, algoLen, 'ascii');

  buf.writeUInt32BE(pubKeyLen, p += algoLen, true);
  pubKey.copy(buf, p += 4);

  buf.writeUInt32BE(hostnameLen, p += pubKeyLen, true);
  buf.write(hostname, p += 4, hostnameLen, 'ascii');

  buf.writeUInt32BE(userlocalLen, p += hostnameLen, true);
  buf.write(userlocal, p += 4, userlocalLen, 'utf8');

  cbSign(buf, function(signature) {
    var sigLen = signature.length;
    var sigbuf = new Buffer((buf.length - sesLen) + sigLen);

    buf.copy(sigbuf, 0, 4 + sesLen);
    sigbuf.writeUInt32BE(sigLen, sigbuf.length - sigLen - 4, true);
    signature.copy(sigbuf, sigbuf.length - sigLen);

    self._state.authMethod = 'hostbased';
    self.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (hostbased)');
    return send(self, sigbuf);
  });
  return true;
};
SSH2Stream.prototype.authKeyboard = function(username) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var userLen = Buffer.byteLength(username);
  var p = 0;
  var buf = new Buffer(1
                       + 4 + userLen
                       + 4 + 14 // "ssh-connection"
                       + 4 + 20 // "keyboard-interactive"
                       + 4 // no language set
                       + 4 // no submethods
                      );

  buf[p] = MESSAGE.USERAUTH_REQUEST;

  buf.writeUInt32BE(userLen, ++p, true);
  buf.write(username, p += 4, userLen, 'utf8');

  buf.writeUInt32BE(14, p += userLen, true);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  buf.writeUInt32BE(20, p += 14, true);
  buf.write('keyboard-interactive', p += 4, 20, 'ascii');

  buf.writeUInt32BE(0, p += 20, true);

  buf.writeUInt32BE(0, p += 4, true);

  this._state.authMethod = 'keyboard-interactive';
  this.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (keyboard-interactive)');
  return send(this, buf);
};
SSH2Stream.prototype.authNone = function(username) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var userLen = Buffer.byteLength(username);
  var p = 0;
  var buf = new Buffer(1
                       + 4 + userLen
                       + 4 + 14 // "ssh-connection"
                       + 4 + 4 // "none"
                      );

  buf[p] = MESSAGE.USERAUTH_REQUEST;

  buf.writeUInt32BE(userLen, ++p, true);
  buf.write(username, p += 4, userLen, 'utf8');

  buf.writeUInt32BE(14, p += userLen, true);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  buf.writeUInt32BE(4, p += 14, true);
  buf.write('none', p += 4, 4, 'ascii');

  this._state.authMethod = 'none';
  this.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (none)');
  return send(this, buf);
};
SSH2Stream.prototype.authInfoRes = function(responses) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var responsesLen = 0;
  var p = 0;
  var resLen;
  var len;
  var i;

  if (responses) {
    for (i = 0, len = responses.length; i < len; ++i)
      responsesLen += 4 + Buffer.byteLength(responses[i]);
  }
  var buf = new Buffer(1 + 4 + responsesLen);

  buf[p++] = MESSAGE.USERAUTH_INFO_RESPONSE;

  buf.writeUInt32BE(responses ? responses.length : 0, p, true);
  if (responses) {
    p += 4;
    for (i = 0, len = responses.length; i < len; ++i) {
      resLen = Buffer.byteLength(responses[i]);
      buf.writeUInt32BE(resLen, p, true);
      p += 4;
      if (resLen) {
        buf.write(responses[i], p, resLen, 'utf8');
        p += resLen;
      }
    }
  }

  this.debug('DEBUG: Outgoing: Writing USERAUTH_INFO_RESPONSE');
  return send(this, buf);
};

// server-specific methods
// global
SSH2Stream.prototype.serviceAccept = function(svcName) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var svcNameLen = svcName.length;
  var buf = new Buffer(1 + 4 + svcNameLen);

  buf[0] = MESSAGE.SERVICE_ACCEPT;

  buf.writeUInt32BE(svcNameLen, 1, true);
  buf.write(svcName, 5, svcNameLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing SERVICE_ACCEPT (' + svcName + ')');
  return send(this, buf);
};
// ssh-connection service-specific
SSH2Stream.prototype.forwardedTcpip = function(chan, initWindow, maxPacket, cfg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var boundAddrLen = Buffer.byteLength(cfg.boundAddr);
  var remoteAddrLen = Buffer.byteLength(cfg.remoteAddr);
  var p = 36 + boundAddrLen;
  var buf = new Buffer(1 + 4 + 15 + 4 + 4 + 4 + 4 + boundAddrLen + 4 + 4
                       + remoteAddrLen + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  buf.writeUInt32BE(15, 1, true);
  buf.write('forwarded-tcpip', 5, 15, 'ascii');

  buf.writeUInt32BE(chan, 20, true);

  buf.writeUInt32BE(initWindow, 24, true);

  buf.writeUInt32BE(maxPacket, 28, true);

  buf.writeUInt32BE(boundAddrLen, 32, true);
  buf.write(cfg.boundAddr, 36, boundAddrLen, 'ascii');

  buf.writeUInt32BE(cfg.boundPort, p, true);

  buf.writeUInt32BE(remoteAddrLen, p += 4, true);
  buf.write(cfg.remoteAddr, p += 4, remoteAddrLen, 'ascii');

  buf.writeUInt32BE(cfg.remotePort, p += remoteAddrLen, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', forwarded-tcpip)');
  return send(this, buf);
};
SSH2Stream.prototype.x11 = function(chan, initWindow, maxPacket, cfg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var addrLen = Buffer.byteLength(cfg.originAddr);
  var p = 24 + addrLen;
  var buf = new Buffer(1 + 4 + 3 + 4 + 4 + 4 + 4 + addrLen + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  buf.writeUInt32BE(3, 1, true);
  buf.write('x11', 5, 3, 'ascii');

  buf.writeUInt32BE(chan, 8, true);

  buf.writeUInt32BE(initWindow, 12, true);

  buf.writeUInt32BE(maxPacket, 16, true);

  buf.writeUInt32BE(addrLen, 20, true);
  buf.write(cfg.originAddr, 24, addrLen, 'ascii');

  buf.writeUInt32BE(cfg.originPort, p, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', x11)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_forwardedStreamLocal = function(chan, initWindow,
                                                             maxPacket, cfg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var pathlen = Buffer.byteLength(cfg.socketPath);
  var buf = new Buffer(1 + 4 + 33 + 4 + 4 + 4 + 4 + pathlen + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  buf.writeUInt32BE(33, 1, true);
  buf.write('forwarded-streamlocal@openssh.com', 5, 33, 'ascii');

  buf.writeUInt32BE(chan, 38, true);

  buf.writeUInt32BE(initWindow, 42, true);

  buf.writeUInt32BE(maxPacket, 46, true);

  buf.writeUInt32BE(pathlen, 50, true);
  buf.write(cfg.socketPath, 54, pathlen, 'utf8');

  buf.writeUInt32BE(0, 54 + pathlen, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', forwarded-streamlocal@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.exitStatus = function(chan, status) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  // does not consume window space
  var buf = new Buffer(1 + 4 + 4 + 11 + 1 + 4);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(11, 5, true);
  buf.write('exit-status', 9, 11, 'ascii');

  buf[20] = 0;

  buf.writeUInt32BE(status, 21, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', exit-status)');
  return send(this, buf);
};
SSH2Stream.prototype.exitSignal = function(chan, name, coreDumped, msg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  // does not consume window space
  var nameLen = Buffer.byteLength(name);
  var msgLen = (msg ? Buffer.byteLength(msg) : 0);
  var p = 25 + nameLen;
  var buf = new Buffer(1 + 4 + 4 + 11 + 1 + 4 + nameLen + 1 + 4 + msgLen + 4);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  buf.writeUInt32BE(chan, 1, true);

  buf.writeUInt32BE(11, 5, true);
  buf.write('exit-signal', 9, 11, 'ascii');

  buf[20] = 0;

  buf.writeUInt32BE(nameLen, 21, true);
  buf.write(name, 25, nameLen, 'utf8');

  buf[p++] = (coreDumped ? 1 : 0);

  buf.writeUInt32BE(msgLen, p, true);
  p += 4;
  if (msgLen) {
    buf.write(msg, p, msgLen, 'utf8');
    p += msgLen;
  }

  buf.writeUInt32BE(0, p, true);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', exit-signal)');
  return send(this, buf);
};
// ssh-userauth service-specific
SSH2Stream.prototype.authFailure = function(authMethods, isPartial) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var methods;

  if (typeof authMethods === 'boolean') {
    isPartial = authMethods;
    authMethods = undefined;
  }

  if (authMethods) {
    methods = [];
    for (var i = 0, len = authMethods.length; i < len; ++i) {
      if (authMethods[i].toLowerCase() === 'none')
        continue;
      methods.push(authMethods[i]);
    }
    methods = methods.join(',');
  } else
    methods = '';

  var methodsLen = methods.length;
  var buf = new Buffer(1 + 4 + methodsLen + 1);

  buf[0] = MESSAGE.USERAUTH_FAILURE;

  buf.writeUInt32BE(methodsLen, 1, true);
  buf.write(methods, 5, methodsLen, 'ascii');

  buf[5 + methodsLen] = (isPartial === true ? 1 : 0);

  this.debug('DEBUG: Outgoing: Writing USERAUTH_FAILURE');
  return send(this, buf);
};
SSH2Stream.prototype.authSuccess = function() {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  this.debug('DEBUG: Outgoing: Writing USERAUTH_SUCCESS');
  return send(this, USERAUTH_SUCCESS_PACKET);
};
SSH2Stream.prototype.authPKOK = function(keyAlgo, key) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var keyAlgoLen = keyAlgo.length;
  var keyLen = key.length;
  var buf = new Buffer(1 + 4 + keyAlgoLen + 4 + keyLen);

  buf[0] = MESSAGE.USERAUTH_PK_OK;

  buf.writeUInt32BE(keyAlgoLen, 1, true);
  buf.write(keyAlgo, 5, keyAlgoLen, 'ascii');

  buf.writeUInt32BE(keyLen, 5 + keyAlgoLen, true);
  key.copy(buf, 5 + keyAlgoLen + 4);

  this.debug('DEBUG: Outgoing: Writing USERAUTH_PK_OK');
  return send(this, buf);
};
SSH2Stream.prototype.authPasswdChg = function(prompt, lang) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var promptLen = Buffer.byteLength(prompt);
  var langLen = lang ? lang.length : 0;
  var p = 0;
  var buf = new Buffer(1 + 4 + promptLen + 4 + langLen);

  buf[p] = MESSAGE.USERAUTH_PASSWD_CHANGEREQ;

  buf.writeUInt32BE(promptLen, ++p, true);
  buf.write(prompt, p += 4, promptLen, 'utf8');

  buf.writeUInt32BE(langLen, p += promptLen, true);
  if (langLen)
    buf.write(lang, p += 4, langLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing USERAUTH_PASSWD_CHANGEREQ');
  return send(this, buf);
};
SSH2Stream.prototype.authInfoReq = function(name, instructions, prompts) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var promptsLen = 0;
  var nameLen = name ? Buffer.byteLength(name) : 0;
  var instrLen = instructions ? Buffer.byteLength(instructions) : 0;
  var p = 0;
  var promptLen;
  var prompt;
  var len;
  var i;

  for (i = 0, len = prompts.length; i < len; ++i)
    promptsLen += 4 + Buffer.byteLength(prompts[i].prompt) + 1;
  var buf = new Buffer(1 + 4 + nameLen + 4 + instrLen + 4 + 4 + promptsLen);

  buf[p++] = MESSAGE.USERAUTH_INFO_REQUEST;

  buf.writeUInt32BE(nameLen, p, true);
  p += 4;
  if (name) {
    buf.write(name, p, nameLen, 'utf8');
    p += nameLen;
  }

  buf.writeUInt32BE(instrLen, p, true);
  p += 4;
  if (instructions) {
    buf.write(instructions, p, instrLen, 'utf8');
    p += instrLen;
  }

  buf.writeUInt32BE(0, p, true);
  p += 4;

  buf.writeUInt32BE(prompts.length, p, true);
  p += 4;
  for (i = 0, len = prompts.length; i < len; ++i) {
    prompt = prompts[i];
    promptLen = Buffer.byteLength(prompt.prompt);
    buf.writeUInt32BE(promptLen, p, true);
    p += 4;
    if (promptLen) {
      buf.write(prompt.prompt, p, promptLen, 'utf8');
      p += promptLen;
    }
    buf[p++] = (prompt.echo ? 1 : 0);
  }

  this.debug('DEBUG: Outgoing: Writing USERAUTH_INFO_REQUEST');
  return send(this, buf);
};

// Shared incoming/parser functions
function onDISCONNECT(self, reason, code, desc, lang) { // client/server
  if (code !== DISCONNECT_REASON.BY_APPLICATION) {
    var err = new Error(desc || reason);
    err.code = code;
    self.emit('error', err);
  }
  self.reset();
}

function onKEXINIT(self, init) { // client/server
  var state = self._state;
  var outstate = state.outgoing;

  if (outstate.status === OUT_READY) {
    self.debug('DEBUG: Received re-key request');
    outstate.status = OUT_REKEYING;
    outstate.kexinit = undefined;
    KEXINIT(self);
  }

  if (check_KEXINIT(self, init) === true) {
    if (!self.server) {
      if (state.kexdh !== 'group')
        KEXDH_GEX_REQ(self);
      else
        KEXDH_INIT(self);
    } else {
      if (state.kexdh !== 'group')
        state.incoming.expectedPacket = 'KEXDH_GEX_REQ';
      else
        state.incoming.expectedPacket = 'KEXDH_INIT';
    }
  }
}

function check_KEXINIT(self, init) {
  var state = self._state;
  var instate = state.incoming;
  var outstate = state.outgoing;
  var debug = self.debug;
  var serverList;
  var clientList;
  var val;
  var len;
  var i;

  debug('DEBUG: Comparing KEXINITs ...');

  var kex = ALGORITHMS.KEX;
  if ((self.remoteBugs & BUGS.BAD_DHGEX)
      && ~kex.toString().indexOf('group-exchange')) {
    kex = kex.slice();
    for (var j = kex.length - 1; j >= 0; --j) {
      if (~kex[j].indexOf('group-exchange'))
        kex.splice(j, 1);
    }
  }

  debug('DEBUG: (local) KEX algorithms: ' + kex);
  debug('DEBUG: (remote) KEX algorithms: ' + init.algorithms.kex);
  if (self.server) {
    serverList = kex;
    clientList = init.algorithms.kex;
  } else {
    serverList = init.algorithms.kex;
    clientList = kex;
  }
  // check for agreeable key exchange algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // no suitable match found!
    debug('DEBUG: No matching KEX algorithm');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  var kex_algorithm = clientList[i];
  debug('DEBUG: KEX algorithm: ' + kex_algorithm);

  debug('DEBUG: (local) Host key formats: ' + ALGORITHMS.SERVER_HOST_KEY);
  debug('DEBUG: (remote) Host key formats: ' + init.algorithms.srvHostKey);
  if (self.server) {
    serverList = ALGORITHMS.SERVER_HOST_KEY;
    clientList = init.algorithms.srvHostKey;
  } else {
    serverList = init.algorithms.srvHostKey;
    clientList = ALGORITHMS.SERVER_HOST_KEY;
  }
  // check for agreeable server host key format
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // no suitable match found!
    debug('DEBUG: No matching host key format');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  state.hostkeyFormat = clientList[i];
  debug('DEBUG: Host key format: ' + state.hostkeyFormat);

  debug('DEBUG: (local) Client->Server ciphers: ' + ALGORITHMS.CIPHER);
  debug('DEBUG: (remote) Client->Server ciphers: '
        + init.algorithms.cs.encrypt);
  if (self.server) {
    serverList = ALGORITHMS.CIPHER;
    clientList = init.algorithms.cs.encrypt;
  } else {
    serverList = init.algorithms.cs.encrypt;
    clientList = ALGORITHMS.CIPHER;
  }
  // check for agreeable client->server cipher
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // no suitable match found!
    debug('DEBUG: No matching Client->Server cipher');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = instate.decrypt.type = clientList[i];
  else
    val = outstate.encrypt.type = clientList[i];
  debug('DEBUG: Client->Server Cipher: ' + val);

  debug('DEBUG: (local) Server->Client ciphers: ' + ALGORITHMS.CIPHER);
  debug('DEBUG: (remote) Server->Client ciphers: '
        + (init.algorithms.sc.encrypt));
  if (self.server) {
    serverList = ALGORITHMS.CIPHER;
    clientList = init.algorithms.sc.encrypt;
  } else {
    serverList = init.algorithms.sc.encrypt;
    clientList = ALGORITHMS.CIPHER;
  }
  // check for agreeable server->client cipher
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // no suitable match found!
    debug('DEBUG: No matching Server->Client cipher');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = outstate.encrypt.type = clientList[i];
  else
    val = instate.decrypt.type = clientList[i];
  debug('DEBUG: Server->Client Cipher: ' + val);

  debug('DEBUG: (local) Client->Server HMAC algorithms: ' + ALGORITHMS.HMAC);
  debug('DEBUG: (remote) Client->Server HMAC algorithms: '
        + init.algorithms.cs.mac);
  if (self.server) {
    serverList = ALGORITHMS.HMAC;
    clientList = init.algorithms.cs.mac;
  } else {
    serverList = init.algorithms.cs.mac;
    clientList = ALGORITHMS.HMAC;
  }
  // check for agreeable client->server hmac algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // no suitable match found!
    debug('DEBUG: No matching Client->Server HMAC algorithm');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = instate.hmac.type = clientList[i];
  else
    val = outstate.hmac.type = clientList[i];
  debug('DEBUG: Client->Server HMAC algorithm: ' + val);

  debug('DEBUG: (local) Server->Client HMAC algorithms: ' + ALGORITHMS.HMAC);
  debug('DEBUG: (remote) Server->Client HMAC algorithms: '
        + init.algorithms.sc.mac);
  if (self.server) {
    serverList = ALGORITHMS.HMAC;
    clientList = init.algorithms.sc.mac;
  } else {
    serverList = init.algorithms.sc.mac;
    clientList = ALGORITHMS.HMAC;
  }
  // check for agreeable server->client hmac algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // no suitable match found!
    debug('DEBUG: No matching Server->Client HMAC algorithm');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = outstate.hmac.type = clientList[i];
  else
    val = instate.hmac.type = clientList[i];
  debug('DEBUG: Server->Client HMAC algorithm: ' + val);

  var compressList = ALGORITHMS.COMPRESS;

  if (self.doCompress && compressList.slice(-1) !== 'none') {
    var nonePos = compressList.indexOf('none');
    if (~nonePos) {
      compressList = compressList.slice();
      compressList.splice(nonePos, 1);
      compressList.push('none');
    }
  }

  debug('DEBUG: (local) Client->Server compression algorithms: '
        + compressList);
  debug('DEBUG: (remote) Client->Server compression algorithms: '
        + init.algorithms.cs.compress);
  if (self.server) {
    serverList = compressList;
    clientList = init.algorithms.cs.compress;
  } else {
    serverList = init.algorithms.cs.compress;
    clientList = compressList;
  }
  // check for agreeable client->server compression algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // no suitable match found!
    debug('DEBUG: No matching Client->Server compression algorithm');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = instate.decompress.type = clientList[i];
  else
    val = outstate.compress.type = clientList[i];
  debug('DEBUG: Client->Server compression algorithm: ' + val);

  debug('DEBUG: (local) Server->Client compression algorithms: '
        + compressList);
  debug('DEBUG: (remote) Server->Client compression algorithms: '
        + init.algorithms.sc.compress);
  if (self.server) {
    serverList = compressList;
    clientList = init.algorithms.sc.compress;
  } else {
    serverList = init.algorithms.sc.compress;
    clientList = compressList;
  }
  // check for agreeable server->client compression algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // no suitable match found!
    debug('DEBUG: No matching Server->Client compression algorithm');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = outstate.compress.type = clientList[i];
  else
    val = instate.decompress.type = clientList[i];
  debug('DEBUG: Server->Client compression algorithm: ' + val);

  if (kex_algorithm === 'diffie-hellman-group1-sha1')
    state.kex = crypto.getDiffieHellman('modp2');
  else if (kex_algorithm === 'diffie-hellman-group14-sha1')
    state.kex = crypto.getDiffieHellman('modp14');
  else {
    // Reset kex object if DH group exchange is selected on re-key and DH group
    // exchange was used before the re-key. This ensures that we send the right
    // DH packet after the KEXINIT exchange
    state.kex = undefined;
  }

  if (state.kex) {
    state.kexdh = 'group';
    outstate.pubkey = new Buffer(state.kex.generateKeys('binary'), 'binary');
    var idx = 0;
    len = outstate.pubkey.length;
    while (outstate.pubkey[idx] === 0x00) {
      ++idx;
      --len;
    }
    if (outstate.pubkey[idx] & 0x80) {
      var key = new Buffer(len + 1);
      key[0] = 0;
      outstate.pubkey.copy(key, 1, idx);
      outstate.pubkey = key;
    }
  } else if (kex_algorithm === 'diffie-hellman-group-exchange-sha1')
    state.kexdh = 'gex-sha1';
  else if (kex_algorithm === 'diffie-hellman-group-exchange-sha256')
    state.kexdh = 'gex-sha256';

  return true;
}

function onKEXDH_GEX_GROUP(self, prime, gen) {
  var state = self._state;
  var outstate = state.outgoing;

  state.kex = crypto.createDiffieHellman(prime, gen);
  outstate.pubkey = new Buffer(state.kex.generateKeys('binary'), 'binary');
  var idx = 0;
  var len = outstate.pubkey.length;
  while (outstate.pubkey[idx] === 0x00) {
    ++idx;
    --len;
  }
  if (outstate.pubkey[idx] & 0x80) {
    var key = new Buffer(len + 1);
    key[0] = 0;
    outstate.pubkey.copy(key, 1, idx);
    outstate.pubkey = key;
  }
  KEXDH_INIT(self);
}

function onKEXDH_INIT(self, e) { // server
  KEXDH_REPLY(self, e);
}

function onKEXDH_REPLY(self, info, callback) { // client
  var state = self._state;
  var instate = state.incoming;
  var outstate = state.outgoing;
  var debug = self.debug;
  var len;
  var i;

  debug('DEBUG: Checking host key format');
  // ensure all host key formats agree
  var hostkey_format = readString(info.hostkey, 0, 'ascii', self, callback);
  if (hostkey_format === false)
    return false;
  if (info.hostkey_format !== state.hostkeyFormat
      || info.hostkey_format !== hostkey_format) {
    // expected and actual server host key format do not match!
    debug('DEBUG: Host key format mismatch');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    self.reset();
    return false;
  }

  debug('DEBUG: Checking signature format');
  // ensure signature formats agree
  var sig_format = readString(info.sig, 0, 'ascii', self, callback);
  if (sig_format === false)
    return false;
  if (info.sig_format !== sig_format) {
    debug('DEBUG: Signature format mismatch');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    self.reset();
    return false;
  }

  // verify the host fingerprint first if needed
  if (outstate.status === OUT_INIT) {
    debug('DEBUG: Verifying host fingerprint');
    var verifiedHost;
    self.emit('fingerprint', info.hostkey, function(permitted) {
      if (verifiedHost !== undefined)
        return;
      verifiedHost = permitted;
    });
    if (verifiedHost === undefined)
      debug('DEBUG: Host accepted by default (no verification)');
    else if (verifiedHost === true)
      debug('DEBUG: Host accepted (verified)');
    else {
      debug('DEBUG: Host denied via fingerprint verification');
      self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
      self.reset();
      self.emit('error', new Error('Host fingerprint verification failed'));
      return false;
    }
  }

  var slicepos = -1;
  for (i = 0, len = info.pubkey.length; i < len; ++i) {
    if (info.pubkey[i] === 0)
      ++slicepos;
    else
      break;
  }
  if (slicepos > -1)
    info.pubkey = info.pubkey.slice(slicepos + 1);
  var compSecret = state.kex.computeSecret(info.pubkey, 'binary', 'binary');
  info.secret = new Buffer(compSecret, 'binary');
  var hash = crypto.createHash(RE_SHA1.test(state.kexdh)
                               ? 'sha1'
                               : 'sha256');
  var len_ident = Buffer.byteLength(self.config.ident);
  var len_sident = Buffer.byteLength(instate.identRaw);
  var len_init = outstate.kexinit.length;
  var len_sinit = instate.kexinit.length;
  var len_hostkey = info.hostkey.length;
  var len_gex_req = 0;
  var len_gex_prime = 0;
  var len_gex_gen = 0;
  var len_pubkey = outstate.pubkey.length;
  var len_spubkey = info.pubkey.length;
  var len_secret = info.secret.length;

  var idx_pubkey = 0;
  var idx_spubkey = 0;
  var idx_secret = 0;

  var idx_gex_prime = 0;
  var idx_gex_gen = 0;
  var gex_prime;
  var gex_gen;
  if (state.kexdh !== 'group') {
    len_gex_req = 12;
    gex_prime = state.kex.getPrime();
    gex_gen = state.kex.getGenerator();
    len_gex_prime = gex_prime.length;
    len_gex_gen = gex_gen.length;
    while (gex_prime[idx_gex_prime] === 0x00) {
      ++idx_gex_prime;
      --len_gex_prime;
    }
    while (gex_gen[idx_gex_gen] === 0x00) {
      ++idx_gex_gen;
      --len_gex_gen;
    }
    if (gex_prime[idx_gex_prime] & 0x80)
      ++len_gex_prime;
    if (gex_gen[idx_gex_gen] & 0x80)
      ++len_gex_gen;
  }
  while (outstate.pubkey[idx_pubkey] === 0x00) {
    ++idx_pubkey;
    --len_pubkey;
  }
  while (info.pubkey[idx_spubkey] === 0x00) {
    ++idx_spubkey;
    --len_spubkey;
  }
  while (info.secret[idx_secret] === 0x00) {
    ++idx_secret;
    --len_secret;
  }
  if (outstate.pubkey[idx_pubkey] & 0x80)
    ++len_pubkey;
  if (info.pubkey[idx_spubkey] & 0x80)
    ++len_spubkey;
  if (info.secret[idx_secret] & 0x80)
    ++len_secret;
  var bp = 0;
  var exchangeBuf = new Buffer(len_ident
                               + len_sident
                               + len_init
                               + len_sinit
                               + len_hostkey
                               + len_gex_req
                               + len_gex_prime
                               + len_gex_gen
                               + len_pubkey
                               + len_spubkey
                               + len_secret
                               + (4 * 8)
                               + (state.kexdh !== 'group' ? (4 * 2) : 0));
  exchangeBuf.writeUInt32BE(len_ident, bp, true);
  bp += 4;
  exchangeBuf.write(self.config.ident, bp, 'utf8'); // V_C
  bp += len_ident;

  exchangeBuf.writeUInt32BE(len_sident, bp, true);
  bp += 4;
  exchangeBuf.write(instate.identRaw, bp, 'utf8'); // V_S
  bp += len_sident;

  exchangeBuf.writeUInt32BE(len_init, bp, true);
  bp += 4;
  outstate.kexinit.copy(exchangeBuf, bp); // I_C
  bp += len_init;
  outstate.kexinit = undefined;

  exchangeBuf.writeUInt32BE(len_sinit, bp, true);
  bp += 4;
  instate.kexinit.copy(exchangeBuf, bp); // I_S
  bp += len_sinit;
  instate.kexinit = undefined;

  exchangeBuf.writeUInt32BE(len_hostkey, bp, true);
  bp += 4;
  info.hostkey.copy(exchangeBuf, bp); // K_S
  bp += len_hostkey;

  if (state.kexdh !== 'group') {
    KEXDH_GEX_REQ_PACKET.slice(1).copy(exchangeBuf, bp); // min, n, max
    bp += len_gex_req;

    exchangeBuf.writeUInt32BE(len_gex_prime, bp, true);
    bp += 4;
    if (gex_prime[idx_gex_prime] & 0x80)
      exchangeBuf[bp++] = 0;
    gex_prime.copy(exchangeBuf, bp, idx_gex_prime); // p
    bp += len_gex_prime - (gex_prime[idx_gex_prime] & 0x80 ? 1 : 0);

    exchangeBuf.writeUInt32BE(len_gex_gen, bp, true);
    bp += 4;
    if (gex_gen[idx_gex_gen] & 0x80)
      exchangeBuf[bp++] = 0;
    gex_gen.copy(exchangeBuf, bp, idx_gex_gen); // g
    bp += len_gex_gen - (gex_gen[idx_gex_gen] & 0x80 ? 1 : 0);
  }

  exchangeBuf.writeUInt32BE(len_pubkey, bp, true);
  bp += 4;
  if (outstate.pubkey[idx_pubkey] & 0x80)
    exchangeBuf[bp++] = 0;
  outstate.pubkey.copy(exchangeBuf, bp, idx_pubkey); // e
  bp += len_pubkey - (outstate.pubkey[idx_pubkey] & 0x80 ? 1 : 0);

  exchangeBuf.writeUInt32BE(len_spubkey, bp, true);
  bp += 4;
  if (info.pubkey[idx_spubkey] & 0x80)
    exchangeBuf[bp++] = 0;
  info.pubkey.copy(exchangeBuf, bp, idx_spubkey); // f
  bp += len_spubkey - (info.pubkey[idx_spubkey] & 0x80 ? 1 : 0);

  exchangeBuf.writeUInt32BE(len_secret, bp, true);
  bp += 4;
  if (info.secret[idx_secret] & 0x80)
    exchangeBuf[bp++] = 0;
  info.secret.copy(exchangeBuf, bp, idx_secret); // K

  outstate.exchangeHash = new Buffer(hash.update(exchangeBuf)
                                         .digest('binary'), 'binary'); // H

  var asnWriter = new Ber.Writer();
  var rawsig = readString(info.sig, info.sig._pos, self, callback); // s
  if (rawsig === false)
    return false;
  var algo = (info.sig_format === 'ssh-rsa' ? 'RSA' : 'DSA');
  var verifier = crypto.createVerify(algo + '-SHA1');
  verifier.update(outstate.exchangeHash, 'binary');

  // change bare host key parameters to ASN.1 DER values for OpenSSL
  asnWriter.startSequence();
  if (algo === 'RSA') {
    var e = readString(info.hostkey, info.hostkey._pos, self, callback);
    if (e === false)
      return false;
    var n = readString(info.hostkey, info.hostkey._pos, self, callback);
    if (n === false)
      return false;
    asnWriter.startSequence();
    asnWriter.writeOID('1.2.840.113549.1.1.1');
    asnWriter.writeNull();
    asnWriter.endSequence();

    asnWriter.startSequence(Ber.BitString);
    asnWriter.writeByte(0x00);
    asnWriter.startSequence();
    asnWriter.writeBuffer(n, Ber.Integer);
    asnWriter.writeBuffer(e, Ber.Integer);
    asnWriter.endSequence();
    asnWriter.endSequence();
  } else {
    var p = readString(info.hostkey, info.hostkey._pos, self, callback);
    if (p === false)
      return false;
    var q = readString(info.hostkey, info.hostkey._pos, self, callback);
    if (q === false)
      return false;
    var g = readString(info.hostkey, info.hostkey._pos, self, callback);
    if (g === false)
      return false;
    var y = readString(info.hostkey, info.hostkey._pos, self, callback);
    if (y === false)
      return false;

    asnWriter.startSequence();
    asnWriter.writeOID('1.2.840.10040.4.1');
    asnWriter.startSequence();
    asnWriter.writeBuffer(p, Ber.Integer);
    asnWriter.writeBuffer(q, Ber.Integer);
    asnWriter.writeBuffer(g, Ber.Integer);
    asnWriter.endSequence();
    asnWriter.endSequence();

    asnWriter.startSequence(Ber.BitString);
    asnWriter.writeByte(0x00);
    asnWriter.writeBuffer(y, Ber.Integer);
    asnWriter.endSequence();

    if (rawsig.length <= 40) {
      // change bare signature r and s values to ASN.1 DER values for OpenSSL
      var asnSigWriter = new Ber.Writer();
      asnSigWriter.startSequence();
      var rBuf = rawsig.slice(0, 20);
      var sBuf = rawsig.slice(20);
      if (rBuf[0] & 0x80) {
        var rNew = new Buffer(21);
        rNew[0] = 0x00;
        rBuf.copy(rNew, 1);
        rBuf = rNew;
      }
      if (sBuf[0] & 0x80) {
        var sNew = new Buffer(21);
        sNew[0] = 0x00;
        sBuf.copy(sNew, 1);
        sBuf = sNew;
      }
      asnSigWriter.writeBuffer(rBuf, Ber.Integer);
      asnSigWriter.writeBuffer(sBuf, Ber.Integer);
      asnSigWriter.endSequence();
      rawsig = asnSigWriter.buffer;
    }
  }
  asnWriter.endSequence();

  debug('DEBUG: Verifying signature');

  var b64key = asnWriter.buffer.toString('base64')
                               .replace(/(.{64})/g, '$1\n');
  var fullkey = '-----BEGIN PUBLIC KEY-----\n'
                + b64key
                + (b64key[b64key.length - 1] === '\n' ? '' : '\n')
                + '-----END PUBLIC KEY-----';
  var verified = verifier.verify(fullkey, rawsig, 'binary');

  if (!verified) {
    debug('DEBUG: Signature could not be verified');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    self.reset();
    return false;
  }

  if (outstate.sessionId === undefined)
    outstate.sessionId = outstate.exchangeHash;
  outstate.kexsecret = info.secret;

  debug('DEBUG: Outgoing: Writing NEWKEYS');
  if (outstate.status === OUT_REKEYING)
    send(self, NEWKEYS_PACKET, undefined, true);
  else
    send(self, NEWKEYS_PACKET);
}

function onNEWKEYS(self) { // client/server
  var state = self._state;
  var outstate = state.outgoing;
  var instate = state.incoming;

  var idx_secret = 0;
  var len = outstate.kexsecret.length;
  while (outstate.kexsecret[idx_secret] === 0x00) {
    ++idx_secret;
    --len;
  }

  var blocklen = 8;
  var keylen = 0;
  var p = 0;
  var dhHashAlgo = (RE_SHA1.test(state.kexdh) ? 'sha1' : 'sha256');
  var len_secret = (outstate.kexsecret[idx_secret] & 0x80 ? 1 : 0) + len;
  var secret = new Buffer(4 + len_secret);
  var iv;
  var key;

  secret.writeUInt32BE(len_secret, p, true);
  p += 4;
  if (outstate.kexsecret[idx_secret] & 0x80)
    secret[p++] = 0;
  outstate.kexsecret.copy(secret, p, idx_secret);
  outstate.kexsecret = undefined;
  if (!isStreamCipher(outstate.encrypt.type)) {
    iv = new Buffer(crypto.createHash(dhHashAlgo)
                          .update(secret)
                          .update(outstate.exchangeHash)
                          .update(!self.server ? 'A' : 'B', 'ascii')
                          .update(outstate.sessionId)
                          .digest('binary'),
                    'binary');
    switch (outstate.encrypt.type) {
      case 'aes128-gcm':
      case 'aes256-gcm':
      case 'aes128-gcm@openssh.com':
      case 'aes256-gcm@openssh.com':
        blocklen = 12;
      break;
      case 'aes256-cbc':
      case 'aes192-cbc':
      case 'aes128-cbc':
      case 'aes256-ctr':
      case 'aes192-ctr':
      case 'aes128-ctr':
        blocklen = 16;
    }
    outstate.encrypt.size = blocklen;
    while (blocklen > iv.length) {
      iv = Buffer.concat([iv,
                          new Buffer(crypto.createHash(dhHashAlgo)
                                           .update(secret)
                                           .update(outstate.exchangeHash)
                                           .update(iv)
                                           .digest('binary'),
                                     'binary')]);
    }
    iv = iv.slice(0, blocklen);
  } else {
    outstate.encrypt.size = blocklen;
    iv = EMPTY_BUFFER; // streaming ciphers don't use an IV upfront
  }
  switch (outstate.encrypt.type) {
    case 'aes256-gcm':
    case 'aes256-gcm@openssh.com':
    case 'aes256-cbc':
    case 'aes256-ctr':
    case 'arcfour256':
      keylen = 32; // eg. 256 / 8
      break;
    case '3des-cbc':
    case '3des-ctr':
    case 'aes192-cbc':
    case 'aes192-ctr':
      keylen = 24; // eg. 192 / 8
      break;
    case 'aes128-gcm':
    case 'aes128-gcm@openssh.com':
    case 'aes128-cbc':
    case 'aes128-ctr':
    case 'cast128-cbc':
    case 'blowfish-cbc':
    case 'arcfour':
    case 'arcfour128':
      keylen = 16; // eg. 128 / 8
      break;
  }

  key = new Buffer(crypto.createHash(dhHashAlgo)
                         .update(secret)
                         .update(outstate.exchangeHash)
                         .update(!self.server ? 'C' : 'D', 'ascii')
                         .update(outstate.sessionId)
                         .digest('binary'),
                   'binary');
  while (keylen > key.length) {
    key = Buffer.concat([key,
                         new Buffer(crypto.createHash(dhHashAlgo)
                                          .update(secret)
                                          .update(outstate.exchangeHash)
                                          .update(key)
                                          .digest('binary'),
                                    'binary')]);
  }
  key = key.slice(0, keylen);

  if (isGCM(outstate.encrypt.type)) {
    outstate.encrypt.size = 16;
    outstate.encrypt.iv = iv;
    outstate.encrypt.key = key;
    outstate.encrypt.instance = true;
  } else {
    var cipherAlgo = SSH_TO_OPENSSL[outstate.encrypt.type];
    outstate.encrypt.instance = crypto.createCipheriv(cipherAlgo, key, iv);
    outstate.encrypt.instance.setAutoPadding(false);
  }

  // and now for decrypting ...

  blocklen = 8;
  keylen = 0;
  if (!isStreamCipher(instate.decrypt.type)) {
    iv = new Buffer(crypto.createHash(dhHashAlgo)
                          .update(secret)
                          .update(outstate.exchangeHash)
                          .update(!self.server ? 'B' : 'A', 'ascii')
                          .update(outstate.sessionId)
                          .digest('binary'),
                    'binary');
    switch (instate.decrypt.type) {
      case 'aes128-gcm':
      case 'aes256-gcm':
      case 'aes128-gcm@openssh.com':
      case 'aes256-gcm@openssh.com':
        blocklen = 12;
      break;
      case 'aes256-cbc':
      case 'aes192-cbc':
      case 'aes128-cbc':
      case 'aes256-ctr':
      case 'aes192-ctr':
      case 'aes128-ctr':
        blocklen = 16;
    }
    if (isGCM(instate.decrypt.type))
      instate.decrypt.size = 16;
    else
      instate.decrypt.size = blocklen;
    while (blocklen > iv.length) {
      iv = Buffer.concat([iv,
                          new Buffer(crypto.createHash(dhHashAlgo)
                                           .update(secret)
                                           .update(outstate.exchangeHash)
                                           .update(iv)
                                           .digest('binary'),
                                     'binary')]);
    }
    iv = iv.slice(0, blocklen);
  } else {
    instate.decrypt.size = blocklen;
    iv = EMPTY_BUFFER; // streaming ciphers don't use an IV upfront
  }

  // Create a reusable buffer for decryption purposes
  instate.decrypt.buf = new Buffer(instate.decrypt.size);

  switch (instate.decrypt.type) {
    case 'aes256-gcm':
    case 'aes256-gcm@openssh.com':
    case 'aes256-cbc':
    case 'aes256-ctr':
    case 'arcfour256':
      keylen = 32; // eg. 256 / 8
      break;
    case '3des-cbc':
    case '3des-ctr':
    case 'aes192-cbc':
    case 'aes192-ctr':
      keylen = 24; // eg. 192 / 8
      break;
    case 'aes128-gcm':
    case 'aes128-gcm@openssh.com':
    case 'aes128-cbc':
    case 'aes128-ctr':
    case 'cast128-cbc':
    case 'blowfish-cbc':
    case 'arcfour':
    case 'arcfour128':
      keylen = 16; // eg. 128 / 8
      break;
  }
  key = new Buffer(crypto.createHash(dhHashAlgo)
                         .update(secret)
                         .update(outstate.exchangeHash)
                         .update(!self.server ? 'D' : 'C', 'ascii')
                         .update(outstate.sessionId)
                         .digest('binary'),
                   'binary');
  while (keylen > key.length) {
    key = Buffer.concat([key,
                         new Buffer(crypto.createHash(dhHashAlgo)
                                          .update(secret)
                                          .update(outstate.exchangeHash)
                                          .update(key)
                                          .digest('binary'),
                                    'binary')]);
  }
  key = key.slice(0, keylen);

  var decipherAlgo = SSH_TO_OPENSSL[instate.decrypt.type];
  instate.decrypt.instance = crypto.createDecipheriv(decipherAlgo, key, iv);
  instate.decrypt.instance.setAutoPadding(false);
  instate.decrypt.iv = iv;
  instate.decrypt.key = key;

  /* The "arcfour128" algorithm is the RC4 cipher, as described in
     [SCHNEIER], using a 128-bit key.  The first 1536 bytes of keystream
     generated by the cipher MUST be discarded, and the first byte of the
     first encrypted packet MUST be encrypted using the 1537th byte of
     keystream.

     -- http://tools.ietf.org/html/rfc4345#section-4 */
  var emptyBuf;
  if (outstate.encrypt.type.substr(0, 7) === 'arcfour') {
    emptyBuf = new Buffer(1536);
    emptyBuf.fill(0);
    outstate.encrypt.instance.update(emptyBuf);
  }
  if (instate.decrypt.type.substr(0, 7) === 'arcfour') {
    emptyBuf = new Buffer(1536);
    emptyBuf.fill(0);
    instate.decrypt.instance.update(emptyBuf);
  }

  var createKeyLen = 0;
  var checkKeyLen = 0;
  switch (outstate.hmac.type) {
    case 'hmac-ripemd160':
    case 'hmac-sha1':
      createKeyLen = 20;
      outstate.hmac.size = 20;
      break;
    case 'hmac-sha1-96':
      createKeyLen = 20;
      outstate.hmac.size = 12;
      break;
    case 'hmac-sha2-256':
      createKeyLen = 32;
      outstate.hmac.size = 32;
      break;
    case 'hmac-sha2-256-96':
      createKeyLen = 32;
      outstate.hmac.size = 12;
      break;
    case 'hmac-sha2-512':
      createKeyLen = 64;
      outstate.hmac.size = 64;
      break;
    case 'hmac-sha2-512-96':
      createKeyLen = 64;
      outstate.hmac.size = 12;
      break;
    case 'hmac-md5':
      createKeyLen = 16;
      outstate.hmac.size = 16;
      break;
    case 'hmac-md5-96':
      createKeyLen = 16;
      outstate.hmac.size = 12;
      break;
  }
  switch (instate.hmac.type) {
    case 'hmac-ripemd160':
    case 'hmac-sha1':
      checkKeyLen = 20;
      instate.hmac.size = 20;
      break;
    case 'hmac-sha1-96':
      checkKeyLen = 20;
      instate.hmac.size = 12;
      break;
    case 'hmac-sha2-256':
      checkKeyLen = 32;
      instate.hmac.size = 32;
      break;
    case 'hmac-sha2-256-96':
      checkKeyLen = 32;
      instate.hmac.size = 12;
      break;
    case 'hmac-sha2-512':
      checkKeyLen = 64;
      instate.hmac.size = 64;
      break;
    case 'hmac-sha2-512-96':
      checkKeyLen = 64;
      instate.hmac.size = 12;
      break;
    case 'hmac-md5':
      checkKeyLen = 16;
      instate.hmac.size = 16;
      break;
    case 'hmac-md5-96':
      checkKeyLen = 16;
      instate.hmac.size = 12;
      break;
  }

  if (!isGCM(outstate.encrypt.type)) {
    key = new Buffer(crypto.createHash(dhHashAlgo)
                           .update(secret)
                           .update(outstate.exchangeHash)
                           .update(!self.server ? 'E' : 'F', 'ascii')
                           .update(outstate.sessionId)
                           .digest('binary'),
                     'binary');
    while (createKeyLen > key.length) {
      key = Buffer.concat([key,
                           new Buffer(crypto.createHash(dhHashAlgo)
                                            .update(secret)
                                            .update(outstate.exchangeHash)
                                            .update(key)
                                            .digest('binary'),
                                      'binary')]);
    }
    outstate.hmac.key = key.slice(0, createKeyLen);
  } else
    outstate.hmac.key = undefined;
  if (!isGCM(instate.decrypt.type)) {
    key = new Buffer(crypto.createHash(dhHashAlgo)
                           .update(secret)
                           .update(outstate.exchangeHash)
                           .update(!self.server ? 'F' : 'E', 'ascii')
                           .update(outstate.sessionId)
                           .digest('binary'),
                     'binary');
    while (checkKeyLen > key.length) {
      key = Buffer.concat([key,
                           new Buffer(crypto.createHash(dhHashAlgo)
                                            .update(secret)
                                            .update(outstate.exchangeHash)
                                            .update(key)
                                            .digest('binary'),
                                      'binary')]);
    }
    instate.hmac.key = key.slice(0, checkKeyLen);
  } else {
    instate.hmac.key = undefined;
    instate.hmac.size = 16;
  }

  outstate.exchangeHash = undefined;

  // Create a reusable buffer for message verification purposes
  if (!instate.hmac.buf
      || instate.hmac.buf.length !== instate.hmac.size)
    instate.hmac.buf = new Buffer(instate.hmac.size);

  if (outstate.compress.type !== false && outstate.compress.type !== 'none')
    outstate.compress.instance = zlib.deflateSync;
  if (instate.decompress.type !== false && instate.decompress.type !== 'none')
    instate.decompress.instance = zlib.inflateSync;

  self.bytesSent = self.bytesReceived = 0;

  if (outstate.status === OUT_REKEYING) {
    outstate.status = OUT_READY;
    instate.expectedPacket = undefined;

    // empty our outbound buffer of any data we tried to send during the
    // re-keying process
    var queue = outstate.rekeyQueue;
    var qlen = queue.length;
    var q = 0;

    outstate.rekeyQueue = [];

    for (; q < qlen; ++q) {
      if (Buffer.isBuffer(queue[q]))
        send(self, queue[q]);
      else
        send(self, queue[q][0], queue[q][1]);
    }

    // now empty our inbound buffer of any non-transport layer packets we
    // received during the re-keying process
    queue = instate.rekeyQueue;
    qlen = queue.length;
    q = 0;

    instate.rekeyQueue = [];

    var curSeqno = instate.seqno;
    for (; q < qlen; ++q) {
      instate.seqno = queue[q][0];
      instate.payload = queue[q][1];
      if (parsePacket(self) === false)
        return;

      if (instate.status === IN_INIT) {
        // we were reset due to some error/disagreement ?
        return;
      }
    }
    instate.seqno = curSeqno;
  } else {
    outstate.status = OUT_READY;
    instate.expectedPacket = undefined;
  }
}

function parsePacket(self, callback) {
  var instate = self._state.incoming;
  var outstate = self._state.outgoing;
  var payload = instate.payload;
  var seqno = instate.seqno;
  var serviceName;
  var lang;
  var message;
  var info;
  var chan;
  var data;
  var srcIP;
  var srcPort;
  var sender;
  var window;
  var packetSize;
  var recipient;
  var description;
  var socketPath;

  if (++instate.seqno > MAX_SEQNO)
    instate.seqno = 0;

  var type = payload[0];
  if (type === undefined)
    return false;

  // if we receive a packet during handshake that is not the expected packet
  // and it is not one of: DISCONNECT, IGNORE, UNIMPLEMENTED, or DEBUG, then we
  // close the stream
  if (outstate.status !== OUT_READY
      && MESSAGE[type] !== instate.expectedPacket
      && type < 1
      && type > 4) {
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, expected: '
               + instate.expectedPacket
               + ' but got: '
               + MESSAGE[type]);
    // XXX: potential issue where the module user decides to initiate a rekey
    // via KEXINIT() (which sets `expectedPacket`) after receiving a packet
    // and there is still another packet already waiting to be parsed at the
    // time the KEXINIT is written. this will cause an unexpected disconnect...
    self.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
    return false;
  }

  if (type === MESSAGE.CHANNEL_DATA) {
    /*
      byte      SSH_MSG_CHANNEL_DATA
      uint32    recipient channel
      string    data
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    // TODO: MAX_CHAN_DATA_LEN here should really be dependent upon the
    //       channel's packet size. The ssh2 module uses 32KB, so we'll hard
    //       code this for now ...
    data = readString(payload, 5, self, callback, 32768);
    if (data === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_DATA ('
               + chan
               + ')');
    self.emit('CHANNEL_DATA:' + chan, data);
  } else if (type === MESSAGE.CHANNEL_EXTENDED_DATA) {
    /*
      byte      SSH_MSG_CHANNEL_EXTENDED_DATA
      uint32    recipient channel
      uint32    data_type_code
      string    data
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    var dataType = readInt(payload, 5, self, callback);
    if (dataType === false)
      return false;
    data = readString(payload, 9, self, callback);
    if (data === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_EXTENDED_DATA ('
               + chan
               + ')');
    self.emit('CHANNEL_EXTENDED_DATA:' + chan, dataType, data);
  } else if (type === MESSAGE.CHANNEL_WINDOW_ADJUST) {
    /*
      byte      SSH_MSG_CHANNEL_WINDOW_ADJUST
      uint32    recipient channel
      uint32    bytes to add
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    var bytesToAdd = readInt(payload, 5, self, callback);
    if (bytesToAdd === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_WINDOW_ADJUST ('
               + chan
               + ', '
               + bytesToAdd
               + ')');
    self.emit('CHANNEL_WINDOW_ADJUST:' + chan, bytesToAdd);
  } else if (type === MESSAGE.CHANNEL_SUCCESS) {
    /*
      byte      SSH_MSG_CHANNEL_SUCCESS
      uint32    recipient channel
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_SUCCESS ('
               + chan
               + ')');
    self.emit('CHANNEL_SUCCESS:' + chan);
  } else if (type === MESSAGE.CHANNEL_FAILURE) {
    /*
      byte      SSH_MSG_CHANNEL_FAILURE
      uint32    recipient channel
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_FAILURE ('
               + chan
               + ')');
    self.emit('CHANNEL_FAILURE:' + chan);
  } else if (type === MESSAGE.CHANNEL_EOF) {
    /*
      byte      SSH_MSG_CHANNEL_EOF
      uint32    recipient channel
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_EOF ('
               + chan
               + ')');
    self.emit('CHANNEL_EOF:' + chan);
  } else if (type === MESSAGE.CHANNEL_OPEN) {
    /*
      byte      SSH_MSG_CHANNEL_OPEN
      string    channel type in US-ASCII only
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      ....      channel type specific data follows
    */
    var chanType = readString(payload, 1, 'ascii', self, callback);
    if (chanType === false)
      return false;
    sender = readInt(payload, payload._pos, self, callback);
    if (sender === false)
      return false;
    window = readInt(payload, payload._pos += 4, self, callback);
    if (window === false)
      return false;
    packetSize = readInt(payload, payload._pos += 4, self, callback);
    if (packetSize === false)
      return false;
    var channel;

    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_OPEN ('
               + sender
               + ', '
               + chanType
               + ')');

    if (chanType === 'forwarded-tcpip' // server->client
        || chanType === 'direct-tcpip') { // client->server
      /*
        string    address that was connected / host to connect
        uint32    port that was connected / port to connect
        string    originator IP address
        uint32    originator port
      */
      var destIP = readString(payload,
                              payload._pos += 4,
                              'ascii',
                              self,
                              callback);
      if (destIP === false)
        return false;
      var destPort = readInt(payload, payload._pos, self, callback);
      if (destPort === false)
        return false;
      srcIP = readString(payload, payload._pos += 4, 'ascii', self, callback);
      if (srcIP === false)
        return false;
      srcPort = readInt(payload, payload._pos, self, callback);
      if (srcPort === false)
        return false;
      channel = {
        type: chanType,
        sender: sender,
        window: window,
        packetSize: packetSize,
        data: {
          destIP: destIP,
          destPort: destPort,
          srcIP: srcIP,
          srcPort: srcPort
        }
      };
    } else if (chanType === 'forwarded-streamlocal@openssh.com' // server->client
               || chanType === 'direct-streamlocal@openssh.com') { // client->server
      /*
        string    socket path
        string    reserved for future use
      */
      socketPath = readString(payload,
                              payload._pos += 4,
                              'utf8',
                              self,
                              callback);
      if (socketPath === false)
        return false;
      channel = {
        type: chanType,
        sender: sender,
        window: window,
        packetSize: packetSize,
        data: {
          socketPath: socketPath,
        }
      };
    } else if (chanType === 'x11') { // server->client
      /*
        string    originator address (e.g., "192.168.7.38")
        uint32    originator port
      */
      srcIP = readString(payload, payload._pos += 4, 'ascii', self, callback);
      if (srcIP === false)
        return false;
      srcPort = readInt(payload, payload._pos, self, callback);
      if (srcPort === false)
        return false;
      channel = {
        type: chanType,
        sender: sender,
        window: window,
        packetSize: packetSize,
        data: {
          srcIP: srcIP,
          srcPort: srcPort
        }
      };
    } else {
      // 'session' (client->server), 'auth-agent@openssh.com' (server->client)
      channel = {
        type: chanType,
        sender: sender,
        window: window,
        packetSize: packetSize,
        data: {}
      };
    }

    self.emit('CHANNEL_OPEN', channel);
  } else if (type === MESSAGE.CHANNEL_OPEN_CONFIRMATION) {
    /*
      byte      SSH_MSG_CHANNEL_OPEN_CONFIRMATION
      uint32    recipient channel
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      ....      channel type specific data follows
    */
    // "The 'recipient channel' is the channel number given in the
    // original open request, and 'sender channel' is the channel number
    // allocated by the other side."
    recipient = readInt(payload, 1, self, callback);
    if (recipient === false)
      return false;
    sender = readInt(payload, 5, self, callback);
    if (sender === false)
      return false;
    window = readInt(payload, 9, self, callback);
    if (window === false)
      return false;
    packetSize = readInt(payload, 13, self, callback);
    if (packetSize === false)
      return false;

    info = {
      recipient: recipient,
      sender: sender,
      window: window,
      packetSize: packetSize
    };

    if (payload.length > 17)
      info.data = payload.slice(17);

    self.emit('CHANNEL_OPEN_CONFIRMATION:' + info.recipient, info);
  } else if (type === MESSAGE.CHANNEL_OPEN_FAILURE) {
    /*
      byte      SSH_MSG_CHANNEL_OPEN_FAILURE
      uint32    recipient channel
      uint32    reason code
      string    description in ISO-10646 UTF-8 encoding
      string    language tag
    */
    recipient = readInt(payload, 1, self, callback);
    if (recipient === false)
      return false;
    var reasonCode = readInt(payload, 5, self, callback);
    if (reasonCode === false)
      return false;
    description = readString(payload, 9, 'utf8', self, callback);
    if (description === false)
      return false;
    lang = readString(payload, payload._pos, 'utf8', self, callback);
    if (lang === false)
      return false;
    payload._pos = 9;
    info = {
      recipient: recipient,
      reasonCode: reasonCode,
      reason: CHANNEL_OPEN_FAILURE[reasonCode],
      description: description,
      lang: lang
    };

    self.emit('CHANNEL_OPEN_FAILURE:' + info.recipient, info);
  } else if (type === MESSAGE.CHANNEL_CLOSE) {
    /*
      byte      SSH_MSG_CHANNEL_CLOSE
      uint32    recipient channel
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_CLOSE ('
               + chan
               + ')');
    self.emit('CHANNEL_CLOSE:' + chan);
  } else if (type === MESSAGE.IGNORE) {
    /*
      byte      SSH_MSG_IGNORE
      string    data
    */
  } else if (type === MESSAGE.DISCONNECT) {
    /*
      byte      SSH_MSG_DISCONNECT
      uint32    reason code
      string    description in ISO-10646 UTF-8 encoding
      string    language tag
    */
    var reason = readInt(payload, 1, self, callback);
    if (reason === false)
      return false;
    var reasonText = DISCONNECT_REASON[reason];
    description = readString(payload, 5, 'utf8', self, callback);
    if (description === false)
      return false;

    lang = readString(payload, payload._pos, 'ascii', self, callback);

    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: DISCONNECT ('
               + reasonText
               + ')');

    self.emit('DISCONNECT', reasonText, reason, description, lang);
  } else if (type === MESSAGE.DEBUG) {
    /*
      byte      SSH_MSG_DEBUG
      boolean   always_display
      string    message in ISO-10646 UTF-8 encoding
      string    language tag
    */
    message = readString(payload, 2, 'utf8', self, callback);
    if (message === false)
      return false;
    lang = readString(payload, payload._pos, 'ascii', self, callback);
    if (lang === false)
      return false;

    self.emit('DEBUG', message, lang);
  } else if (type === MESSAGE.NEWKEYS) {
    /*
      byte      SSH_MSG_NEW_KEYS
    */
    self.emit('NEWKEYS');
  } else if (type === MESSAGE.SERVICE_REQUEST) {
    /*
      byte      SSH_MSG_SERVICE_REQUEST
      string    service name
    */
    serviceName = readString(payload, 1, 'ascii', self, callback);
    if (serviceName === false)
      return false;

    self.emit('SERVICE_REQUEST', serviceName);
  } else if (type === MESSAGE.SERVICE_ACCEPT) {
    /*
      byte      SSH_MSG_SERVICE_ACCEPT
      string    service name
    */
    serviceName = readString(payload, 1, 'ascii', self, callback);
    if (serviceName === false)
      return false;

    self.emit('SERVICE_ACCEPT', serviceName);
  } else if (type === MESSAGE.USERAUTH_REQUEST) {
    /*
      byte      SSH_MSG_USERAUTH_REQUEST
      string    user name in ISO-10646 UTF-8 encoding [RFC3629]
      string    service name in US-ASCII
      string    method name in US-ASCII
      ....      method specific fields
    */
    var username = readString(payload, 1, 'utf8', self, callback);
    if (username === false)
      return false;
    var svcName = readString(payload, payload._pos, 'ascii', self, callback);
    if (svcName === false)
      return false;
    var method = readString(payload, payload._pos, 'ascii', self, callback);
    if (method === false)
      return false;
    var methodData;

    if (method === 'password') {
      methodData = readString(payload, payload._pos + 1, 'utf8', self, callback);
      if (methodData === false)
        return false;
    } else if (method === 'publickey' || method === 'hostbased') {
      var pkSigned;
      var keyAlgo;
      var key;
      var signature;
      var blob;
      var hostname;
      var userlocal;
      if (method === 'publickey') {
        pkSigned = payload[payload._pos++];
        if (pkSigned === undefined)
          return false;
        pkSigned = (pkSigned !== 0);
      }
      keyAlgo = readString(payload, payload._pos, 'ascii', self, callback);
      if (keyAlgo === false)
        return false;
      key = readString(payload, payload._pos, self, callback);
      if (key === false)
        return false;

      if (pkSigned || method === 'hostbased') {
        if (method === 'hostbased') {
          hostname = readString(payload, payload._pos, 'ascii', self, callback);
          if (hostname === false)
            return false;
          userlocal = readString(payload, payload._pos, 'utf8', self, callback);
          if (userlocal === false)
            return false;
        }

        var blobEnd = payload._pos;
        signature = readString(payload, blobEnd, self, callback);
        if (signature === false)
          return false;

        if (signature.toString('ascii', 4, 11) === keyAlgo) {
          // skip algoLen + algo + sigLen
          signature = signature.slice(4 + 7 + 4);
        }

        if (keyAlgo === 'ssh-dss' && signature.length <= 40) {
          // change bare signature r and s values to ASN.1 DER values for
          // OpenSSL
          var asnSigWriter = new Ber.Writer();
          asnSigWriter.startSequence();
          var rBuf = signature.slice(0, 20);
          var sBuf = signature.slice(20);
          if (rBuf[0] & 0x80) {
            var rNew = new Buffer(21);
            rNew[0] = 0x00;
            rBuf.copy(rNew, 1);
            rBuf = rNew;
          }
          if (sBuf[0] & 0x80) {
            var sNew = new Buffer(21);
            sNew[0] = 0x00;
            sBuf.copy(sNew, 1);
            sBuf = sNew;
          }
          asnSigWriter.writeBuffer(rBuf, Ber.Integer);
          asnSigWriter.writeBuffer(sBuf, Ber.Integer);
          asnSigWriter.endSequence();
          signature = asnSigWriter.buffer;
        }

        blob = new Buffer(4 + outstate.sessionId.length + blobEnd);
        blob.writeUInt32BE(outstate.sessionId.length, 0, true);
        outstate.sessionId.copy(blob, 4);
        payload.copy(blob, 4 + outstate.sessionId.length, 0, blobEnd);
      }

      methodData = {
        keyAlgo: keyAlgo,
        key: key,
        signature: signature,
        blob: blob,
        localHostname: hostname,
        localUsername: userlocal
      };
    } else if (method === 'keyboard-interactive') {
      // skip language, it's deprecated
      var skipLen = readInt(payload, payload._pos, self, callback);
      if (skipLen === false)
        return false;
      methodData = readString(payload,
                              payload._pos + 4 + skipLen,
                              'utf8',
                              self,
                              callback);
      if (methodData === false)
        return false;
    } else if (method !== 'none')
      methodData = payload.slice(payload._pos);

    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: USERAUTH_REQUEST ('
               + method
               + ')');

    self.emit('USERAUTH_REQUEST', username, svcName, method, methodData);
  } else if (type === MESSAGE.USERAUTH_SUCCESS) {
    /*
      byte      SSH_MSG_USERAUTH_SUCCESS
    */
    self.emit('USERAUTH_SUCCESS');
  } else if (type === MESSAGE.USERAUTH_FAILURE) {
    /*
      byte      SSH_MSG_USERAUTH_FAILURE
      name-list    authentications that can continue
      boolean      partial success
    */
    var auths = readString(payload, 1, 'ascii', self, callback);
    if (auths === false)
      return false;
    var partSuccess = payload[payload._pos];
    if (partSuccess === undefined)
      return false;

    partSuccess = (partSuccess !== 0);
    auths = auths.split(',');

    self.emit('USERAUTH_FAILURE', auths, partSuccess);
  } else if (type === MESSAGE.USERAUTH_BANNER) {
    /*
      byte      SSH_MSG_USERAUTH_BANNER
      string    message in ISO-10646 UTF-8 encoding
      string    language tag
    */
    message = readString(payload, 1, 'utf8', self, callback);
    if (message === false)
      return false;
    lang = readString(payload, payload._pos, 'utf8', self, callback);
    if (lang === false)
      return false;

    self.emit('USERAUTH_BANNER', message, lang);
  } else if (type === MESSAGE.GLOBAL_REQUEST) {
    /*
      byte      SSH_MSG_GLOBAL_REQUEST
      string    request name in US-ASCII only
      boolean   want reply
      ....      request-specific data follows
    */
    var request = readString(payload, 1, 'ascii', self, callback);
    if (request === false)
      return false;
    var wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    var reqData;

    wantReply = (wantReply !== 0);

    if (request === 'tcpip-forward' || request === 'cancel-tcpip-forward') {
      var bindAddr = readString(payload, payload._pos, 'ascii', self, callback);
      if (bindAddr === false)
        return false;
      var bindPort = readInt(payload, payload._pos, self, callback);
      if (bindPort === false)
        return false;
      reqData = {
        bindAddr: bindAddr,
        bindPort: bindPort
      };
    } else if (request === 'streamlocal-forward@openssh.com'
               || request === 'cancel-streamlocal-forward@openssh.com') {
      socketPath = readString(payload, payload._pos, 'utf8', self, callback);
      if (socketPath === false)
        return false;
      reqData = {
        socketPath: socketPath
      };
    } else if (request === 'no-more-sessions@openssh.com') {
      // no data
    } else
      reqData = payload.slice(payload._pos);

    self.emit('GLOBAL_REQUEST', request, wantReply, reqData);
  } else if (type === MESSAGE.REQUEST_SUCCESS) {
    /*
      byte      SSH_MSG_REQUEST_SUCCESS
      ....      response specific data
    */
    if (payload.length > 1)
      self.emit('REQUEST_SUCCESS', payload.slice(1));
    else
      self.emit('REQUEST_SUCCESS');
  } else if (type === MESSAGE.REQUEST_FAILURE) {
    /*
      byte      SSH_MSG_REQUEST_FAILURE
    */
    self.emit('REQUEST_FAILURE');
  } else if (type === MESSAGE.UNIMPLEMENTED) {
    /*
      byte      SSH_MSG_UNIMPLEMENTED
      uint32    packet sequence number of rejected message
    */
    // TODO
  } else if (type === MESSAGE.KEXINIT)
    return parse_KEXINIT(self, callback);
  else if (type === MESSAGE.CHANNEL_REQUEST)
    return parse_CHANNEL_REQUEST(self, callback);
  else if (type >= 30 && type <= 49) // key exchange method-specific messages
    return parse_KEX(self, type, callback);
  else if (type >= 60 && type <= 70) // user auth context-specific messages
    return parse_USERAUTH(self, type, callback);
  else {
    // unknown packet type
    var unimpl = new Buffer(1 + 4);
    unimpl[0] = MESSAGE.UNIMPLEMENTED;
    unimpl.writeUInt32BE(seqno, 1, true);
    send(self, unimpl);
  }
}

function parse_KEXINIT(self, callback) {
  var instate = self._state.incoming;
  var payload = instate.payload;

  /*
    byte         SSH_MSG_KEXINIT
    byte[16]     cookie (random bytes)
    name-list    kex_algorithms
    name-list    server_host_key_algorithms
    name-list    encryption_algorithms_client_to_server
    name-list    encryption_algorithms_server_to_client
    name-list    mac_algorithms_client_to_server
    name-list    mac_algorithms_server_to_client
    name-list    compression_algorithms_client_to_server
    name-list    compression_algorithms_server_to_client
    name-list    languages_client_to_server
    name-list    languages_server_to_client
    boolean      first_kex_packet_follows
    uint32       0 (reserved for future extension)
  */
  var init = {
    algorithms: {
      kex: undefined,
      srvHostKey: undefined,
      cs: {
        encrypt: undefined,
        mac: undefined,
        compress: undefined
      },
      sc: {
        encrypt: undefined,
        mac: undefined,
        compress: undefined
      }
    },
    languages: {
      cs: undefined,
      sc: undefined
    }
  };
  var val;

  val = readList(payload, 17, self, callback);
  if (val === false)
    return false;
  init.algorithms.kex = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.srvHostKey = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.cs.encrypt = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.sc.encrypt = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.cs.mac = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.sc.mac = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.cs.compress = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.sc.compress = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.languages.cs = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.languages.sc = val;

  instate.kexinit = payload;

  self.emit('KEXINIT', init);
}

function parse_KEX(self, type, callback) {
  var state = self._state;
  var instate = state.incoming;
  var payload = instate.payload;

  if (state.kexdh !== 'group') {
    // dynamic group exchange-related

    if (self.server) {
      // TODO: support group exchange server-side
      self.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
      return false;
    } else {
      if (type === MESSAGE.KEXDH_GEX_GROUP) {
        /*
          byte    SSH_MSG_KEX_DH_GEX_GROUP
          mpint   p, safe prime
          mpint   g, generator for subgroup in GF(p)
        */
        var prime = readString(payload, 1, self, callback);
        if (prime === false)
          return false;
        var gen = readString(payload, payload._pos, self, callback);
        if (gen === false)
          return false;
        self.emit('KEXDH_GEX_GROUP', prime, gen);
      } else if (type === MESSAGE.KEXDH_GEX_REPLY)
        return parse_KEXDH_REPLY(self, callback);
    }
  } else {
    // static group-related

    if (type === MESSAGE.KEXDH_INIT) {
      /*
        byte      SSH_MSG_KEXDH_INIT
        mpint     e
      */
      var e = readString(payload, 1, self, callback);
      if (e === false)
        return false;

      self.emit('KEXDH_INIT', e);
    } else if (type === MESSAGE.KEXDH_REPLY)
      return parse_KEXDH_REPLY(self, callback);
  }
}

function parse_KEXDH_REPLY(self, callback) {
  var payload = self._state.incoming.payload;
  /*
    byte      SSH_MSG_KEXDH_REPLY / SSH_MSG_KEX_DH_GEX_REPLY
    string    server public host key and certificates (K_S)
    mpint     f
    string    signature of H
  */
  var hostkey = readString(payload, 1, self, callback);
  if (hostkey === false)
    return false;
  var pubkey = readString(payload, payload._pos, self, callback);
  if (pubkey === false)
    return false;
  var sig = readString(payload, payload._pos, self, callback);
  if (sig === false)
    return false;
  var info = {
    hostkey: hostkey,
    hostkey_format: undefined,
    pubkey: pubkey,
    sig: sig,
    sig_format: undefined
  };
  var hostkey_format = readString(hostkey, 0, 'ascii', self, callback);
  if (hostkey_format === false)
    return false;
  info.hostkey_format = hostkey_format;
  var sig_format = readString(sig, 0, 'ascii', self, callback);
  if (sig_format === false)
    return false;
  info.sig_format = sig_format;
  self.emit('KEXDH_REPLY', info);
}

function parse_USERAUTH(self, type, callback) {
  var state = self._state;
  var authMethod = state.authMethod;
  var payload = state.incoming.payload;
  var message;
  var lang;
  var text;

  if (authMethod === 'password') {
    if (type === MESSAGE.USERAUTH_PASSWD_CHANGEREQ) {
      /*
        byte      SSH_MSG_USERAUTH_PASSWD_CHANGEREQ
        string    prompt in ISO-10646 UTF-8 encoding
        string    language tag
      */
      message = readString(payload, 1, 'utf8', self, callback);
      if (message === false)
        return false;
      lang = readString(payload, payload._pos, 'utf8', self, callback);
      if (lang === false)
        return false;
      self.emit('USERAUTH_PASSWD_CHANGEREQ', message, lang);
    }
  } else if (authMethod === 'keyboard-interactive') {
    if (type === MESSAGE.USERAUTH_INFO_REQUEST) {
      /*
        byte      SSH_MSG_USERAUTH_INFO_REQUEST
        string    name (ISO-10646 UTF-8)
        string    instruction (ISO-10646 UTF-8)
        string    language tag -- MAY be empty
        int       num-prompts
        string    prompt[1] (ISO-10646 UTF-8)
        boolean   echo[1]
        ...
        string    prompt[num-prompts] (ISO-10646 UTF-8)
        boolean   echo[num-prompts]
      */
      var name;
      var instr;
      var nprompts;

      name = readString(payload, 1, 'utf8', self, callback);
      if (name === false)
        return false;
      instr = readString(payload, payload._pos, 'utf8', self, callback);
      if (instr === false)
        return false;
      lang = readString(payload, payload._pos, 'utf8', self, callback);
      if (lang === false)
        return false;
      nprompts = readInt(payload, payload._pos, self, callback);
      if (nprompts === false)
        return false;

      payload._pos += 4;

      var prompts = [];
      for (var prompt = 0; prompt < nprompts; ++prompt) {
        text = readString(payload, payload._pos, 'utf8', self, callback);
        if (text === false)
          return false;
        var echo = payload[payload._pos++];
        if (echo === undefined)
          return false;
        echo = (echo !== 0);
        prompts.push({
          prompt: text,
          echo: echo
        });
      }
      self.emit('USERAUTH_INFO_REQUEST', name, instr, lang, prompts);
    } else if (type === MESSAGE.USERAUTH_INFO_RESPONSE) {
      /*
        byte      SSH_MSG_USERAUTH_INFO_RESPONSE
        int       num-responses
        string    response[1] (ISO-10646 UTF-8)
        ...
        string    response[num-responses] (ISO-10646 UTF-8)
      */
      var nresponses = readInt(payload, 1, self, callback);
      if (nresponses === false)
        return false;

      payload._pos = 5;

      var responses = [];
      for (var response = 0; response < nresponses; ++response) {
        text = readString(payload, payload._pos, 'utf8', self, callback);
        if (text === false)
          return false;
        responses.push(text);
      }
      self.emit('USERAUTH_INFO_RESPONSE', responses);
    }
  } else if (authMethod === 'publickey') {
    if (type === MESSAGE.USERAUTH_PK_OK) {
      /*
        byte      SSH_MSG_USERAUTH_PK_OK
        string    public key algorithm name from the request
        string    public key blob from the request
      */
      self.emit('USERAUTH_PK_OK');
      // XXX: parse public key info? client currently can ignore it because
      // there is only one outstanding auth request at any given time, so it
      // knows which key was OK'd
    }
  }
}

function parse_CHANNEL_REQUEST(self, callback) {
  var payload = self._state.incoming.payload;
  var info;
  var cols;
  var rows;
  var width;
  var height;
  var wantReply;
  var signal;

  var recipient = readInt(payload, 1, self, callback);
  if (recipient === false)
    return false;
  var request = readString(payload, 5, 'ascii', self, callback);
  if (request === false)
    return false;

  if (request === 'exit-status') { // server->client
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exit-status"
      boolean   FALSE
      uint32    exit_status
    */
    var code = readInt(payload, ++payload._pos, self, callback);
    if (code === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      code: code
    };
  } else if (request === 'exit-signal') { // server->client
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exit-signal"
      boolean   FALSE
      string    signal name (without the "SIG" prefix)
      boolean   core dumped
      string    error message in ISO-10646 UTF-8 encoding
      string    language tag
    */
    signal = readString(payload, ++payload._pos, 'ascii', self, callback);
    if (signal === false)
      return false;
    var coredump = payload[payload._pos];
    if (coredump === undefined)
      return false;
    coredump = (coredump !== 0);
    var description = readString(payload, ++payload._pos, 'utf8', self,
                                 callback);
    if (description === false)
      return false;
    var lang = readString(payload, payload._pos, 'utf8', self, callback);
    if (lang === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      signal: signal,
      coredump: coredump,
      description: description,
      lang: lang
    };
  } else if (request === 'pty-req') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "pty-req"
      boolean   want_reply
      string    TERM environment variable value (e.g., vt100)
      uint32    terminal width, characters (e.g., 80)
      uint32    terminal height, rows (e.g., 24)
      uint32    terminal width, pixels (e.g., 640)
      uint32    terminal height, pixels (e.g., 480)
      string    encoded terminal modes
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var term = readString(payload, payload._pos, 'ascii', self, callback);
    if (term === false)
      return false;
    cols = readInt(payload, payload._pos, self, callback);
    if (cols === false)
      return false;
    rows = readInt(payload, payload._pos += 4, self, callback);
    if (rows === false)
      return false;
    width = readInt(payload, payload._pos += 4, self, callback);
    if (width === false)
      return false;
    height = readInt(payload, payload._pos += 4, self, callback);
    if (height === false)
      return false;
    var modes = readString(payload, payload._pos += 4, self, callback);
    if (modes === false)
      return false;
    modes = bytesToModes(modes);
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      term: term,
      cols: cols,
      rows: rows,
      width: width,
      height: height,
      modes: modes
    };
  } else if (request === 'window-change') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "window-change"
      boolean   FALSE
      uint32    terminal width, columns
      uint32    terminal height, rows
      uint32    terminal width, pixels
      uint32    terminal height, pixels
    */
    cols = readInt(payload, ++payload._pos, self, callback);
    if (cols === false)
      return false;
    rows = readInt(payload, payload._pos += 4, self, callback);
    if (rows === false)
      return false;
    width = readInt(payload, payload._pos += 4, self, callback);
    if (width === false)
      return false;
    height = readInt(payload, payload._pos += 4, self, callback);
    if (height === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      cols: cols,
      rows: rows,
      width: width,
      height: height
    };
  } else if (request === 'x11-req') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "x11-req"
      boolean   want reply
      boolean   single connection
      string    x11 authentication protocol
      string    x11 authentication cookie
      uint32    x11 screen number
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var single = payload[payload._pos++];
    if (single === undefined)
      return false;
    single = (single !== 0);
    var protocol = readString(payload, payload._pos, 'ascii', self, callback);
    if (protocol === false)
      return false;
    var cookie = readString(payload, payload._pos, 'hex', self, callback);
    if (cookie === false)
      return false;
    var screen = readInt(payload, payload._pos, self, callback);
    if (screen === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      single: single,
      protocol: protocol,
      cookie: cookie,
      screen: screen
    };
  } else if (request === 'env') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "env"
      boolean   want reply
      string    variable name
      string    variable value
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var key = readString(payload, payload._pos, 'utf8', self, callback);
    if (key === false)
      return false;
    var val = readString(payload, payload._pos, 'utf8', self, callback);
    if (val === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      key: key,
      val: val
    };
  } else if (request === 'shell') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "shell"
      boolean   want reply
    */
    wantReply = payload[payload._pos];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply
    };
  } else if (request === 'exec') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exec"
      boolean   want reply
      string    command
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var command = readString(payload, payload._pos, 'utf8', self, callback);
    if (command === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      command: command
    };
  } else if (request === 'subsystem') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "subsystem"
      boolean   want reply
      string    subsystem name
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var subsystem = readString(payload, payload._pos, 'utf8', self, callback);
    if (subsystem === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      subsystem: subsystem
    };
  } else if (request === 'signal') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "signal"
      boolean   FALSE
      string    signal name (without the "SIG" prefix)
    */
    signal = readString(payload, ++payload._pos, 'ascii', self, callback);
    if (signal === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      signal: 'SIG' + signal
    };
  } else if (request === 'xon-xoff') { // client->server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "xon-xoff"
      boolean   FALSE
      boolean   client can do
    */
    var clientControl = payload[++payload._pos];
    if (clientControl === undefined)
      return false;
    clientControl = (clientControl !== 0);
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      clientControl: clientControl
    };
  } else if (request === 'auth-agent-req@openssh.com') {
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "auth-agent-req@openssh.com"
      boolean   want reply
    */
    wantReply = payload[payload._pos];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply
    };
  } else {
    // unknown request type
    wantReply = payload[payload._pos];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply
    };
  }
  self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_REQUEST ('
             + recipient
             + ', '
             + request
             + ')');
  self.emit('CHANNEL_REQUEST:' + recipient, info);
}

function hmacVerify(self, data) {
  var instate = self._state.incoming;
  var hmac = instate.hmac;

  self.debug('DEBUG: Parser: Verifying MAC');

  if (isGCM(instate.decrypt.type)) {
    var decrypt = instate.decrypt;
    var instance = decrypt.instance;

    instance.setAuthTag(data);

    var payload = new Buffer(instance.update(instate.packet,
                                             'binary',
                                             'binary'),
                             'binary');
    instate.payload = payload.slice(1, instate.packet.length + 4 - payload[0]);
    instance.final('binary');
    iv_inc(decrypt.iv);

    decrypt.instance = crypto.createDecipheriv(
                         SSH_TO_OPENSSL[decrypt.type],
                         decrypt.key,
                         decrypt.iv
                       );
    decrypt.instance.setAutoPadding(false);
    return true;
  } else {
    var calcHmac = crypto.createHmac(SSH_TO_OPENSSL[hmac.type], hmac.key);

    hmac.bufCompute.writeUInt32BE(instate.seqno, 0, true);
    hmac.bufCompute.writeUInt32BE(instate.pktLen, 4, true);
    hmac.bufCompute[8] = instate.padLen;

    calcHmac.update(hmac.bufCompute);
    calcHmac.update(instate.packet);

    var mac = calcHmac.digest('binary');
    if (mac.length > instate.hmac.size)
      mac = mac.slice(0, instate.hmac.size);
    return (mac === data.toString('binary'));
  }
}

function decryptData(self, data) {
  var instance = self._state.incoming.decrypt.instance;
  self.debug('DEBUG: Parser: Decrypting');
  return new Buffer(instance.update(data, 'binary', 'binary'), 'binary');
}

function expectData(self, type, amount, bufferKey) {
  var expect = self._state.incoming.expect;
  expect.amount = amount;
  expect.type = type;
  expect.ptr = 0;
  if (bufferKey && self[bufferKey])
    expect.buf = self[bufferKey];
  else if (amount)
    expect.buf = new Buffer(amount);
}

function readList(buffer, start, stream, callback) {
  var list = readString(buffer, start, 'ascii', stream, callback);
  return (list !== false ? (list.length ? list.split(',') : []) : false);
}

function bytesToModes(buffer) {
  var modes = {};

  for (var i = 0, len = buffer.length, opcode; i < len; i += 5) {
    opcode = buffer[i];
    if (opcode === TERMINAL_MODE.TTY_OP_END
        || TERMINAL_MODE[opcode] === undefined
        || i + 5 > len)
      break;
    modes[TERMINAL_MODE[opcode]] = buffer.readUInt32BE(i + 1, true);
  }

  return modes;
}

function modesToBytes(modes) {
  var RE_IS_NUM = /^\d+$/;
  var keys = Object.keys(modes);
  var b = 0;
  var bytes = [];

  for (var i = 0, len = keys.length, key, opcode, val; i < len; ++i) {
    key = keys[i];
    opcode = TERMINAL_MODE[key];
    if (opcode
        && !RE_IS_NUM.test(key)
        && typeof modes[key] === 'number'
        && key !== 'TTY_OP_END') {
      val = modes[key];
      bytes[b++] = opcode;
      bytes[b++] = (val >>> 24) & 0xFF;
      bytes[b++] = (val >>> 16) & 0xFF;
      bytes[b++] = (val >>> 8) & 0xFF;
      bytes[b++] = val & 0xFF;
    }
  }

  bytes[b] = TERMINAL_MODE.TTY_OP_END;

  return bytes;
}

// Shared outgoing functions
function KEXINIT(self) { // client/server
  var my_cookie = randBytes(16);
  /*
    byte         SSH_MSG_KEXINIT
    byte[16]     cookie (random bytes)
    name-list    kex_algorithms
    name-list    server_host_key_algorithms
    name-list    encryption_algorithms_client_to_server
    name-list    encryption_algorithms_server_to_client
    name-list    mac_algorithms_client_to_server
    name-list    mac_algorithms_server_to_client
    name-list    compression_algorithms_client_to_server
    name-list    compression_algorithms_server_to_client
    name-list    languages_client_to_server
    name-list    languages_server_to_client
    boolean      first_kex_packet_follows
    uint32       0 (reserved for future extension)
  */

  var kex_list_size = ALGORITHMS.KEX_LIST_SIZE,
      kex_list = ALGORITHMS.KEX_LIST;
  if ((self.remoteBugs & BUGS.BAD_DHGEX)
      && ~kex_list.toString().indexOf('group-exchange')) {
    kex_list = ALGORITHMS.KEX.slice();
    for (var j = kex_list.length - 1; j >= 0; --j) {
      if (~kex_list[j].indexOf('group-exchange'))
        kex_list.splice(j, 1);
    }
    kex_list = new Buffer(kex_list.join(','));
    kex_list_size = kex_list.length;
  }

  var hostKeyList;
  if (self.server) {
    // make sure the proper host key format is sent, since this module only
    // supports one host key (type) currently ...
    hostKeyList = self.config.publicKey.fulltype;
  } else
    hostKeyList = ALGORITHMS.SERVER_HOST_KEY_LIST;

  var kexInitSize = 1 + 16
                    + 4 + kex_list_size
                    + 4 + hostKeyList.length
                    + (2 * (4 + ALGORITHMS.CIPHER_LIST_SIZE))
                    + (2 * (4 + ALGORITHMS.HMAC_LIST_SIZE))
                    + (2 * (4 + ALGORITHMS.COMPRESS_LIST_SIZE))
                    + (2 * (4 /* languages skipped */))
                    + 1 + 4,
      buf = new Buffer(kexInitSize),
      p = 17;

  buf.fill(0);

  buf[0] = MESSAGE.KEXINIT;

  if (my_cookie !== false)
    my_cookie.copy(buf, 1);

  buf.writeUInt32BE(kex_list_size, p, true);
  p += 4;
  kex_list.copy(buf, p);
  p += kex_list_size;

  buf.writeUInt32BE(hostKeyList.length, p, true);
  p += 4;
  if (typeof hostKeyList === 'string')
    buf.write(hostKeyList, p);
  else
    hostKeyList.copy(buf, p);
  p += hostKeyList.length;

  buf.writeUInt32BE(ALGORITHMS.CIPHER_LIST_SIZE, p, true);
  p += 4;
  ALGORITHMS.CIPHER_LIST.copy(buf, p);
  p += ALGORITHMS.CIPHER_LIST_SIZE;

  buf.writeUInt32BE(ALGORITHMS.CIPHER_LIST_SIZE, p, true);
  p += 4;
  ALGORITHMS.CIPHER_LIST.copy(buf, p);
  p += ALGORITHMS.CIPHER_LIST_SIZE;

  buf.writeUInt32BE(ALGORITHMS.HMAC_LIST_SIZE, p, true);
  p += 4;
  ALGORITHMS.HMAC_LIST.copy(buf, p);
  p += ALGORITHMS.HMAC_LIST_SIZE;

  buf.writeUInt32BE(ALGORITHMS.HMAC_LIST_SIZE, p, true);
  p += 4;
  ALGORITHMS.HMAC_LIST.copy(buf, p);
  p += ALGORITHMS.HMAC_LIST_SIZE;

  var compressList = ALGORITHMS.COMPRESS_LIST,
      compressListSize = ALGORITHMS.COMPRESS_LIST_SIZE;

  if (self.doCompress && ALGORITHMS.COMPRESS.slice(-1) !== 'none') {
    var nonePos = ALGORITHMS.COMPRESS.indexOf('none');
    if (~nonePos) {
      compressList = ALGORITHMS.COMPRESS.slice();
      compressList.splice(nonePos, 1);
      compressList.push('none');
      compressList = new Buffer(compressList.join(','));
      compressListSize = compressList.length;
    }
  }

  buf.writeUInt32BE(compressListSize, p, true);
  p += 4;
  compressList.copy(buf, p);
  p += compressListSize;

  buf.writeUInt32BE(compressListSize, p, true);
  p += 4;
  compressList.copy(buf, p);
  p += compressListSize;

  // skip language lists, first_kex_packet_follows, and reserved bytes

  self.debug('DEBUG: Outgoing: Writing KEXINIT');

  self._state.incoming.expectedPacket = 'KEXINIT';

  var outstate = self._state.outgoing;

  outstate.kexinit = buf;

  if (outstate.status === OUT_READY) {
    // we are the one starting the rekeying process ...
    outstate.status = OUT_REKEYING;
  }

  return send(self, buf, undefined, true);
}

function KEXDH_INIT(self) { // client
  var state = self._state;
  var outstate = state.outgoing;
  var buf = new Buffer(1 + 4 + outstate.pubkey.length);

  if (state.kexdh !== 'group') {
    state.incoming.expectedPacket = 'KEXDH_GEX_REPLY';
    buf[0] = MESSAGE.KEXDH_GEX_INIT;
    self.debug('DEBUG: Outgoing: Writing KEXDH_GEX_INIT');
  } else {
    state.incoming.expectedPacket = 'KEXDH_REPLY';
    buf[0] = MESSAGE.KEXDH_INIT;
    self.debug('DEBUG: Outgoing: Writing KEXDH_INIT');
  }

  buf.writeUInt32BE(outstate.pubkey.length, 1, true);
  outstate.pubkey.copy(buf, 5);

  return send(self, buf, undefined, true);
}

function KEXDH_REPLY(self, e) { // server
  var state = self._state;
  var outstate = state.outgoing;
  var instate = state.incoming;
  var hostkey = self.config.publicKey.public;
  var hostkeyAlgo = self.config.publicKey.fulltype;
  var privateKey = self.config.privateKey.privateOrig;

  // e === client DH public key

  var slicepos = -1;
  for (var i = 0, len = e.length; i < len; ++i) {
    if (e[i] === 0)
      ++slicepos;
    else
      break;
  }
  if (slicepos > -1)
    e = e.slice(slicepos + 1);

  var compSecret = state.kex.computeSecret(e, 'binary', 'binary');
  var secret = new Buffer(compSecret, 'binary');
  var hash = crypto.createHash(RE_SHA1.test(state.kexdh)
                               ? 'sha1'
                               : 'sha256');
  var len_ident = Buffer.byteLength(instate.identRaw);
  var len_sident = Buffer.byteLength(self.config.ident);
  var len_init = instate.kexinit.length;
  var len_sinit = outstate.kexinit.length;
  var len_hostkey = hostkey.length;
  var len_gex_req = 0;
  var len_gex_prime = 0;
  var len_gex_gen = 0;
  var len_pubkey = e.length;
  var len_spubkey = outstate.pubkey.length;
  var len_secret = secret.length;

  var idx_spubkey = 0;
  var idx_secret = 0;

  var idx_gex_prime = 0;
  var idx_gex_gen = 0;
  var gex_prime;
  var gex_gen;
  if (state.kexdh !== 'group') {
    len_gex_req = 12;
    gex_prime = state.kex.getPrime();
    gex_gen = state.kex.getGenerator();
    len_gex_prime = gex_prime.length;
    len_gex_gen = gex_gen.length;
    while (gex_prime[idx_gex_prime] === 0x00) {
      ++idx_gex_prime;
      --len_gex_prime;
    }
    while (gex_gen[idx_gex_gen] === 0x00) {
      ++idx_gex_gen;
      --len_gex_gen;
    }
    if (gex_prime[idx_gex_prime] & 0x80)
      ++len_gex_prime;
    if (gex_gen[idx_gex_gen] & 0x80)
      ++len_gex_gen;
  }
  while (outstate.pubkey[idx_spubkey] === 0x00) {
    ++idx_spubkey;
    --len_spubkey;
  }
  while (secret[idx_secret] === 0x00) {
    ++idx_secret;
    --len_secret;
  }
  if (e[0] & 0x80)
    ++len_pubkey;
  if (outstate.pubkey[idx_spubkey] & 0x80)
    ++len_spubkey;
  if (secret[idx_secret] & 0x80)
    ++len_secret;
  var bp = 0;
  var exchangeBuf = new Buffer(len_ident
                               + len_sident
                               + len_init
                               + len_sinit
                               + len_hostkey
                               + len_gex_req
                               + len_gex_prime
                               + len_gex_gen
                               + len_pubkey
                               + len_spubkey
                               + len_secret
                               + (4 * 8)
                               + (state.kexdh !== 'group' ? (4 * 2) : 0));
  exchangeBuf.writeUInt32BE(len_ident, bp, true);
  bp += 4;
  exchangeBuf.write(instate.identRaw, bp, 'utf8'); // V_C
  bp += len_ident;

  exchangeBuf.writeUInt32BE(len_sident, bp, true);
  bp += 4;
  exchangeBuf.write(self.config.ident, bp, 'utf8'); // V_S
  bp += len_sident;

  exchangeBuf.writeUInt32BE(len_init, bp, true);
  bp += 4;
  instate.kexinit.copy(exchangeBuf, bp); // I_C
  bp += len_init;
  instate.kexinit = undefined;

  exchangeBuf.writeUInt32BE(len_sinit, bp, true);
  bp += 4;
  outstate.kexinit.copy(exchangeBuf, bp); // I_S
  bp += len_sinit;
  outstate.kexinit = undefined;

  exchangeBuf.writeUInt32BE(len_hostkey, bp, true);
  bp += 4;
  hostkey.copy(exchangeBuf, bp); // K_S
  bp += len_hostkey;

  if (state.kexdh !== 'group') {
    KEXDH_GEX_REQ_PACKET.slice(1).copy(exchangeBuf, bp); // min, n, max
    bp += len_gex_req;

    exchangeBuf.writeUInt32BE(len_gex_prime, bp, true);
    bp += 4;
    if (gex_prime[idx_gex_prime] & 0x80)
      exchangeBuf[bp++] = 0;
    gex_prime.copy(exchangeBuf, bp, idx_gex_prime); // p
    bp += len_gex_prime - (gex_prime[idx_gex_prime] & 0x80 ? 1 : 0);

    exchangeBuf.writeUInt32BE(len_gex_gen, bp, true);
    bp += 4;
    if (gex_gen[idx_gex_gen] & 0x80)
      exchangeBuf[bp++] = 0;
    gex_gen.copy(exchangeBuf, bp, idx_gex_gen); // g
    bp += len_gex_gen - (gex_gen[idx_gex_gen] & 0x80 ? 1 : 0);
  }

  exchangeBuf.writeUInt32BE(len_pubkey, bp, true);
  bp += 4;
  if (e[0] & 0x80)
    exchangeBuf[bp++] = 0;
  e.copy(exchangeBuf, bp); // e
  bp += len_pubkey - (e[0] & 0x80 ? 1 : 0);

  exchangeBuf.writeUInt32BE(len_spubkey, bp, true);
  bp += 4;
  if (outstate.pubkey[idx_spubkey] & 0x80)
    exchangeBuf[bp++] = 0;
  outstate.pubkey.copy(exchangeBuf, bp, idx_spubkey); // f
  bp += len_spubkey - (outstate.pubkey[idx_spubkey] & 0x80 ? 1 : 0);

  exchangeBuf.writeUInt32BE(len_secret, bp, true);
  bp += 4;
  if (secret[idx_secret] & 0x80)
    exchangeBuf[bp++] = 0;
  secret.copy(exchangeBuf, bp, idx_secret); // K

  outstate.exchangeHash = new Buffer(hash.update(exchangeBuf)
                                         .digest('binary'), 'binary'); // H

  if (outstate.sessionId === undefined)
      outstate.sessionId = outstate.exchangeHash;
  outstate.kexsecret = secret;

  var algo = (hostkeyAlgo === 'ssh-rsa' ? 'RSA' : 'DSA');
  var signer = crypto.createSign(algo + '-SHA1');
  var signature;
  signer.update(outstate.exchangeHash, 'binary');
  signature = signer.sign(privateKey, 'binary');

  if (hostkeyAlgo === 'ssh-dss') {
    // strip ASN.1 notation to bare r and s values only (minus leading zeros),
    // 40 bytes total
    var asn1Reader = new Ber.Reader(new Buffer(signature, 'binary'));
    var zeros;
    var r;
    var s;
    asn1Reader.readSequence();
    r = asn1Reader.readString(Ber.Integer, true);
    s = asn1Reader.readString(Ber.Integer, true);
    zeros = 0;
    while ((r.length - zeros) > 20 && r[zeros] === 0x00)
      ++zeros;
    if (zeros > 0)
      r = r.slice(zeros);
    zeros = 0;
    while ((s.length - zeros) > 20 && s[zeros] === 0x00)
      ++zeros;
    if (zeros > 0)
      s = s.slice(zeros);
    signature = r.toString('binary') + s.toString('binary');
  }

  /*
    byte      SSH_MSG_KEXDH_REPLY
    string    server public host key and certificates (K_S)
    mpint     f
    string    signature of H
  */

  var siglen = 4 + hostkeyAlgo.length + 4 + signature.length;
  var buf = new Buffer(1
                       + 4 + len_hostkey
                       + 4 + len_spubkey
                       + 4 + siglen);

  bp = 0;
  buf[bp] = (state.kexdh === 'group'
             ? MESSAGE.KEXDH_REPLY
             : MESSAGE.KEXDH_GEX_REPLY);
  ++bp;

  buf.writeUInt32BE(len_hostkey, bp, true);
  bp += 4;
  hostkey.copy(buf, bp); // K_S
  bp += len_hostkey;

  buf.writeUInt32BE(len_spubkey, bp, true);
  bp += 4;
  if (outstate.pubkey[idx_spubkey] & 0x80)
    buf[bp++] = 0;
  outstate.pubkey.copy(buf, bp, idx_spubkey); // f
  bp += len_spubkey - (outstate.pubkey[idx_spubkey] & 0x80 ? 1 : 0);

  buf.writeUInt32BE(siglen, bp, true);
  bp += 4;
  buf.writeUInt32BE(hostkeyAlgo.length, bp, true);
  bp += 4;
  buf.write(hostkeyAlgo, bp, hostkeyAlgo.length, 'ascii');
  bp += hostkeyAlgo.length;
  buf.writeUInt32BE(signature.length, bp, true);
  bp += 4;
  buf.write(signature, bp, signature.length, 'binary');  // signature

  state.incoming.expectedPacket = 'NEWKEYS';

  self.debug('DEBUG: Outgoing: Writing KEXDH_REPLY');
  send(self, buf, undefined, true);

  self.debug('DEBUG: Outgoing: Writing NEWKEYS');
  return send(self, NEWKEYS_PACKET, undefined, true);
}

function KEXDH_GEX_REQ(self) { // client
  self._state.incoming.expectedPacket = 'KEXDH_GEX_GROUP';

  self.debug('DEBUG: Outgoing: Writing KEXDH_GEX_REQUEST');
  return send(self, KEXDH_GEX_REQ_PACKET, undefined, true);
}

function send(self, payload, cb, bypass) {
  // TODO: implement length checks

  var state = self._state;

  if (!state)
    return;

  var outstate = state.outgoing,
      encrypt = outstate.encrypt,
      hmac = outstate.hmac,
      compress = outstate.compress.instance,
      pktLen,
      padLen,
      buf,
      mac,
      ret;

  if (outstate.status === OUT_REKEYING && !bypass) {
    if (typeof cb === 'function')
      outstate.rekeyQueue.push([payload, cb]);
    else
      outstate.rekeyQueue.push(payload);
    return false;
  } else if (self._readableState.ended || self._writableState.ended)
    return false;

  if (compress)
    payload = compress(payload);

  pktLen = payload.length + 9;

  if (encrypt.instance !== false && isGCM(encrypt.type)) {
    var ptlen = 1 + payload.length + 4 /* must have at least 4 bytes padding*/;
    while ((ptlen % encrypt.size) !== 0)
      ++ptlen;
    padLen = ptlen - 1 - payload.length;
    pktLen = 4 + ptlen;
  } else {
    pktLen += ((encrypt.size - 1) * pktLen) % encrypt.size;
    padLen = pktLen - payload.length - 5;
  }

  buf = new Buffer(pktLen);

  buf.writeUInt32BE(pktLen - 4, 0, true);
  buf[4] = padLen;
  payload.copy(buf, 5);

  var padBytes = crypto.randomBytes(padLen);
  padBytes.copy(buf, 5 + payload.length);

  if (hmac.type !== false && hmac.key) {
    mac = crypto.createHmac(SSH_TO_OPENSSL[hmac.type], hmac.key);
    outstate.bufSeqno.writeUInt32BE(outstate.seqno, 0, true);
    mac.update(outstate.bufSeqno);
    mac.update(buf);
    mac = mac.digest('binary');
    if (mac.length > outstate.hmac.size)
      mac = mac.slice(0, outstate.hmac.size);
    mac = new Buffer(mac, 'binary');
  }

  var nb = 0;
  var encData;

  if (encrypt.instance !== false) {
    if (isGCM(encrypt.type)) {
      var encrypter = crypto.createCipheriv(SSH_TO_OPENSSL[encrypt.type],
                                            encrypt.key,
                                            encrypt.iv);
      encrypter.setAutoPadding(false);

      var lenbuf = buf.slice(0, 4);

      encrypter.setAAD(lenbuf);
      self.push(lenbuf);
      nb += lenbuf;

      encData = encrypter.update(buf.slice(4), 'binary', 'binary');
      self.push(encData, 'binary');
      nb += encData.length;

      var final = encrypter.final('binary');
      if (final.length) {
        self.push(final, 'binary');
        nb += final.length;
      }

      var authTag = encrypter.getAuthTag();
      ret = self.push(authTag);
      nb += authTag.length;

      iv_inc(encrypt.iv);
    } else {
      encData = encrypt.instance.update(buf, 'binary', 'binary');
      self.push(encData, 'binary');
      nb += encData.length;

      ret = self.push(mac);
      nb += mac.length;
    }
  } else {
    ret = self.push(buf);
    nb = buf.length;
  }

  self.bytesSent += nb;

  if (++outstate.seqno > MAX_SEQNO)
    outstate.seqno = 0;

  cb && cb();

  return ret;
}

function randBytes(n) {
  var ret = false;
  try {
    ret = crypto.randomBytes(n);
  } catch (ex) {}
  return ret;
}

module.exports = SSH2Stream;

},{"../package.json":332,"./constants":326,"./utils":331,"asn1":12,"crypto":undefined,"stream":undefined,"streamsearch":340,"util":undefined,"zlib":undefined}],331:[function(require,module,exports){
var crypto = require('crypto');

var Ber = require('asn1').Ber;
var BigInteger = require('./jsbn'); // only for converting PPK -> OpenSSL format

var SSH_TO_OPENSSL = require('./constants').SSH_TO_OPENSSL;

var RE_STREAM = /^arcfour/i;
var RE_GCM = /^aes\d+-gcm/i;
var RE_KEY_LEN = /(.{64})/g;
// XXX the value of 2400 from dropbear is only for certain strings, not all
// strings. for example the list strings used during handshakes
var MAX_STRING_LEN = Infinity;//2400; // taken from dropbear
var PPK_IV = new Buffer([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

module.exports = {
  iv_inc: function(iv) {
    var n = 12;
    var c = 0;
    do {
      --n;
      c = iv[n];
      if (c === 255)
        iv[n] = 0;
      else {
        iv[n] = ++c;
        return;
      }
    } while (n > 4);
  },
  isStreamCipher: function(name) {
    return RE_STREAM.test(name);
  },
  isGCM: function(name) {
    return RE_GCM.test(name);
  },
  readInt: function(buffer, start, stream, cb) {
    var bufferLen = buffer.length;
    if (start < 0 || start >= bufferLen || (bufferLen - start) < 4) {
      stream && stream._cleanup(cb);
      return false;
    }

    return buffer.readUInt32BE(start, true);
  },
  readString: readString,
  parseKey: require('./keyParser'),
  genPublicKey: genPublicKey,
  convertPPKPrivate: convertPPKPrivate,
  verifyPPKMAC: verifyPPKMAC,
  decryptKey: function(keyInfo, passphrase) {
    if (keyInfo._decrypted || !keyInfo.encryption)
      return;

    var keylen = 0;
    var key;
    var iv;
    var out;
    var dc;

    keyInfo.encryption = (SSH_TO_OPENSSL[keyInfo.encryption]
                          || keyInfo.encryption);
    switch (keyInfo.encryption) {
      case 'aes-256-cbc':
      case 'aes-256-ctr':
        keylen = 32; // eg. 256 / 8
        break;
      case 'des-ede3-cbc':
      case 'des-ede3':
      case 'aes-192-cbc':
      case 'aes-192-ctr':
        keylen = 24; // eg. 192 / 8
        break;
      case 'aes-128-cbc':
      case 'aes-128-ctr':
      case 'cast-cbc':
      case 'bf-cbc':
        keylen = 16; // eg. 128 / 8
        break;
    }

    if (keyInfo.ppk) {
      iv = PPK_IV;

      key = crypto.createHash('sha1')
                  .update('\x00\x00\x00\x00' + passphrase, 'binary')
                  .digest('binary')
            + crypto.createHash('sha1')
                    .update('\x00\x00\x00\x01' + passphrase, 'binary')
                    .digest('binary');
      key = new Buffer(key, 'binary').slice(0, keylen);
    } else {
      iv = new Buffer(keyInfo.extra[0], 'hex');

      key = new Buffer(crypto.createHash('md5')
                             .update(passphrase + iv.toString('binary', 0, 8),
                                     'binary')
                             .digest('binary'), 'binary');

      while (keylen > key.length) {
        key = Buffer.concat([
          key,
          new Buffer(crypto.createHash('md5')
                           .update(key.toString('binary')
                                   + passphrase
                                   + iv.toString('binary'),
                                   'binary')
                           .digest('binary'), 'binary').slice(0, 8)
        ]);
      }
      if (key.length > keylen)
        key = key.slice(0, keylen);
    }

    dc = crypto.createDecipheriv(keyInfo.encryption, key, iv);
    dc.setAutoPadding(false);
    out = dc.update(keyInfo.private, 'binary', 'binary');
    out += dc.final('binary');

    keyInfo.private = new Buffer(out, 'binary');

    keyInfo._decrypted = true;

    if (keyInfo.privateOrig) {
      // update our original base64-encoded version of the private key
      var orig = keyInfo.privateOrig.toString('utf8');
      var newOrig = /^(.+(?:\r\n|\n))/.exec(orig)[1];
      var b64key = new Buffer(out, 'binary').toString('base64');

      newOrig += b64key.match(/.{1,70}/g).join('\n');
      newOrig += /((?:\r\n|\n).+)$/.exec(orig)[1];

      keyInfo.privateOrig = newOrig;
    } else if (keyInfo.ppk) {
      var valid = verifyPPKMAC(keyInfo, passphrase, keyInfo.private);
      if (!valid)
        throw new Error('PPK MAC mismatch');
      // automatically convert private key data to OpenSSL format
      // (including PEM)
      convertPPKPrivate(keyInfo);
    }
  }
};

function genPublicKey(keyInfo) {
  var publicKey;
  var p;

  // RSA
  var nStart;
  var nLen;
  var eStart;
  var eLen;

  // DSA
  var pStart;
  var pLen;
  var qStart;
  var qLen;
  var gStart;
  var gLen;
  var yStart;
  var yLen;

  if (keyInfo.private) {
    // parsing private key in ASN.1 format in order to generate a public key
    var privKey = keyInfo.private;
    var i = 2;
    var len;
    var octets;

    if (privKey[0] === 0x30) {
      if (privKey[1] & 0x80)
        i += (privKey[1] & 0x7F);

      // version -- integer
      if (privKey[i++] !== 0x02)
        throw new Error('Malformed private key (expected integer for version)');
      len = privKey[i++];
      if (len & 0x80) {
        octets = len & 0x7F;
        len = 0;
        while (octets > 0) {
          len += (privKey[i++] * Math.pow(2, (octets - 1) * 8));
          --octets;
        }
      }
      i += len; // skip version value

      if (keyInfo.type === 'rsa') {
        // modulus (n) -- integer
        if (privKey[i++] !== 0x02)
          throw new Error('Malformed private key (expected integer for n)');
        nLen = privKey[i++];
        if (nLen & 0x80) {
          octets = nLen & 0x7F;
          nLen = 0;
          while (octets > 0) {
            nLen += (privKey[i++] * Math.pow(2, (octets - 1) * 8));
            --octets;
          }
        }
        nStart = i;
        i += nLen;

        // public exponent (e) -- integer
        if (privKey[i++] !== 0x02)
          throw new Error('Malformed private key (expected integer for e)');
        eLen = privKey[i++];
        if (eLen & 0x80) {
          octets = eLen & 0x7F;
          eLen = 0;
          while (octets > 0) {
            eLen += (privKey[i++] * Math.pow(2, (octets - 1) * 8));
            --octets;
          }
        }
        eStart = i;
      } else { // DSA
        // prime (p) -- integer
        if (privKey[i++] !== 0x02)
          throw new Error('Malformed private key (expected integer for p)');
        pLen = privKey[i++];
        if (pLen & 0x80) {
          octets = pLen & 0x7F;
          pLen = 0;
          while (octets > 0) {
            pLen += (privKey[i++] * Math.pow(2, (octets - 1) * 8));
            --octets;
          }
        }
        pStart = i;
        i += pLen;

        // group order (q) -- integer
        if (privKey[i++] !== 0x02)
          throw new Error('Malformed private key (expected integer for q)');
        qLen = privKey[i++];
        if (qLen & 0x80) {
          octets = qLen & 0x7F;
          qLen = 0;
          while (octets > 0) {
            qLen += (privKey[i++] * Math.pow(2, (octets - 1) * 8));
            --octets;
          }
        }
        qStart = i;
        i += qLen;

        // group generator (g) -- integer
        if (privKey[i++] !== 0x02)
          throw new Error('Malformed private key (expected integer for g)');
        gLen = privKey[i++];
        if (gLen & 0x80) {
          octets = gLen & 0x7F;
          gLen = 0;
          while (octets > 0) {
            gLen += (privKey[i++] * Math.pow(2, (octets - 1) * 8));
            --octets;
          }
        }
        gStart = i;
        i += gLen;

        // public key value (y) -- integer
        if (privKey[i++] !== 0x02)
          throw new Error('Malformed private key (expected integer for y)');
        yLen = privKey[i++];
        if (yLen & 0x80) {
          octets = yLen & 0x7F;
          yLen = 0;
          while (octets > 0) {
            yLen += (privKey[i++] * Math.pow(2, (octets - 1) * 8));
            --octets;
          }
        }
        yStart = i;
        i += yLen;
      }

      p = 4 + 7;

      if (keyInfo.type === 'rsa') {
        publicKey = new Buffer(4 + 7 // ssh-rsa
                               + 4 + nLen
                               + 4 + eLen);

        publicKey.writeUInt32BE(7, 0, true);
        publicKey.write('ssh-rsa', 4, 7, 'ascii');

        publicKey.writeUInt32BE(eLen, p, true);
        privKey.copy(publicKey, p += 4, eStart, eStart + eLen);

        publicKey.writeUInt32BE(nLen, p += eLen, true);
        privKey.copy(publicKey, p += 4, nStart, nStart + nLen);
      } else { // DSA
        publicKey = new Buffer(4 + 7 // ssh-dss
                               + 4 + pLen
                               + 4 + qLen
                               + 4 + gLen
                               + 4 + yLen);

        publicKey.writeUInt32BE(7, 0, true);
        publicKey.write('ssh-dss', 4, 7, 'ascii');

        publicKey.writeUInt32BE(pLen, p, true);
        privKey.copy(publicKey, p += 4, pStart, pStart + pLen);

        publicKey.writeUInt32BE(qLen, p += pLen, true);
        privKey.copy(publicKey, p += 4, qStart, qStart + qLen);

        publicKey.writeUInt32BE(gLen, p += qLen, true);
        privKey.copy(publicKey, p += 4, gStart, gStart + gLen);

        publicKey.writeUInt32BE(yLen, p += gLen, true);
        privKey.copy(publicKey, p += 4, yStart, yStart + yLen);
      }
    } else {
      var errMsg = 'Malformed private key (expected sequence)';
      if (keyInfo._decrypted)
        errMsg += '. Bad passphrase?';
      throw new Error(errMsg);
    }
  } else if (keyInfo.public) {
    publicKey = keyInfo.public;
    // check for missing ssh-{dsa,rsa} prefix
    if (publicKey[0] !== 0
        || publicKey[1] !== 0
        || publicKey[2] !== 0
        || publicKey[3] !== 7
        || publicKey[4] !== 115
        || publicKey[5] !== 115
        || publicKey[6] !== 104
        || publicKey[7] !== 45
        || ((publicKey[8] !== 114
             || publicKey[9] !== 115
             || publicKey[10] !== 97)
            &&
            ((publicKey[8] !== 100
              || publicKey[9] !== 115
              || publicKey[10] !== 115)))) {
      var newPK = new Buffer(4 + 7 + publicKey.length);
      publicKey.copy(newPK, 11);
      newPK.writeUInt32BE(7, 0, true);
      if (keyInfo.type === 'rsa')
        newPK.write('ssh-rsa', 4, 7, 'ascii');
      else
        newPK.write('ssh-dss', 4, 7, 'ascii');
      publicKey = newPK;
    }
  } else
    throw new Error('Missing data generated by parseKey()');

  // generate a public key format for use with OpenSSL

  p = 4 + 7;

  var asnWriter = new Ber.Writer();
  asnWriter.startSequence();
  if (keyInfo.type === 'rsa') {
    eLen = publicKey.readUInt32BE(p, true);
    p += 4;
    eStart = p;
    p += eLen;

    nLen = publicKey.readUInt32BE(p, true);
    p += 4;
    nStart = p;

    var e = publicKey.slice(eStart, eStart + eLen);
    var n = publicKey.slice(nStart, nStart + nLen);
    asnWriter.startSequence();
    asnWriter.writeOID('1.2.840.113549.1.1.1');
    asnWriter.writeNull();
    asnWriter.endSequence();

    asnWriter.startSequence(Ber.BitString);
    asnWriter.writeByte(0x00);
    asnWriter.startSequence();
    asnWriter.writeBuffer(n, Ber.Integer);
    asnWriter.writeBuffer(e, Ber.Integer);
    asnWriter.endSequence();
    asnWriter.endSequence();
  } else {
    pLen = publicKey.readUInt32BE(p, true);
    p += 4;
    pStart = p;
    p += pLen;

    qLen = publicKey.readUInt32BE(p, true);
    p += 4;
    qStart = p;
    p += qLen;

    gLen = publicKey.readUInt32BE(p, true);
    p += 4;
    gStart = p;
    p += gLen;

    yLen = publicKey.readUInt32BE(p, true);
    p += 4;
    yStart = p;

    p = publicKey.slice(pStart, pStart + pLen);
    var q = publicKey.slice(qStart, qStart + qLen);
    var g = publicKey.slice(gStart, gStart + gLen);
    var y = publicKey.slice(yStart, yStart + yLen);

    asnWriter.startSequence();
    asnWriter.writeOID('1.2.840.10040.4.1');
    asnWriter.startSequence();
    asnWriter.writeBuffer(p, Ber.Integer);
    asnWriter.writeBuffer(q, Ber.Integer);
    asnWriter.writeBuffer(g, Ber.Integer);
    asnWriter.endSequence();
    asnWriter.endSequence();

    asnWriter.startSequence(Ber.BitString);
    asnWriter.writeByte(0x00);
    asnWriter.writeBuffer(y, Ber.Integer);
    asnWriter.endSequence();
  }
  asnWriter.endSequence();

  var b64key = asnWriter.buffer.toString('base64').replace(RE_KEY_LEN, '$1\n');
  var fullkey = '-----BEGIN PUBLIC KEY-----\n'
                + b64key
                + (b64key[b64key.length - 1] === '\n' ? '' : '\n')
                + '-----END PUBLIC KEY-----';

  return {
    type: keyInfo.type,
    fulltype: 'ssh-' + keyInfo.type,
    public: publicKey,
    publicOrig: new Buffer(fullkey)
  };
}

function verifyPPKMAC(keyInfo, passphrase, privateKey) {
  if (keyInfo._macresult !== undefined)
    return keyInfo._macresult;
  else if (!keyInfo.ppk)
    throw new Error("Key isn't a PPK");
  else if (!keyInfo.privateMAC)
    throw new Error('Missing MAC');
  else if (!privateKey)
    throw new Error('Missing raw private key data');
  else if (keyInfo.encryption && typeof passphrase !== 'string')
    throw new Error('Missing passphrase for encrypted PPK');
  else if (keyInfo.encryption && !keyInfo._decrypted)
    throw new Error('PPK must be decrypted before verifying MAC');

  var mac = keyInfo.privateMAC;
  var typelen = keyInfo.fulltype.length;
  // encryption algorithm is converted at this point for use with OpenSSL,
  // so we need to use the original value so that the MAC is calculated
  // correctly
  var enc = (keyInfo.encryption ? 'aes256-cbc' : 'none');
  var enclen = enc.length;
  var commlen = Buffer.byteLength(keyInfo.comment);
  var pub = keyInfo.public;
  var publen = pub.length;
  var privlen = privateKey.length;
  var macdata = new Buffer(4 + typelen
                           + 4 + enclen
                           + 4 + commlen
                           + 4 + publen
                           + 4 + privlen);
  var p = 0;

  macdata.writeUInt32BE(typelen, p, true);
  macdata.write(keyInfo.fulltype, p += 4, typelen, 'ascii');
  macdata.writeUInt32BE(enclen, p += typelen, true);
  macdata.write(enc, p += 4, enclen, 'ascii');
  macdata.writeUInt32BE(commlen, p += enclen, true);
  macdata.write(keyInfo.comment, p += 4, commlen, 'utf8');
  macdata.writeUInt32BE(publen, p += commlen, true);
  pub.copy(macdata, p += 4);
  macdata.writeUInt32BE(privlen, p += publen, true);
  privateKey.copy(macdata, p += 4);

  if (typeof passphrase !== 'string')
    passphrase = '';

  var mackey = crypto.createHash('sha1')
                     .update('putty-private-key-file-mac-key', 'ascii')
                     .update(passphrase, 'utf8')
                     .digest('binary');
  mackey = new Buffer(mackey, 'binary');

  var calcMAC = crypto.createHmac('sha1', mackey)
                      .update(macdata, 'binary')
                      .digest('hex');

  return (keyInfo._macresult = (calcMAC === mac));
}

function convertPPKPrivate(keyInfo) {
  if (!keyInfo.ppk || !keyInfo.public || !keyInfo.private)
    throw new Error("Key isn't a PPK");
  else if (keyInfo._converted)
    return false;

  var pub = keyInfo.public;
  var priv = keyInfo.private;
  var asnWriter = new Ber.Writer();
  var p;
  var q;

  if (keyInfo.type === 'rsa') {
    var e = readString(pub, 4 + 7);
    var n = readString(pub, pub._pos);
    var d = readString(priv, 0);
    p = readString(priv, priv._pos);
    q = readString(priv, priv._pos);
    var iqmp = readString(priv, priv._pos);
    var p1 = new BigInteger(p, 256);
    var q1 = new BigInteger(q, 256);
    var dmp1 = new BigInteger(d, 256);
    var dmq1 = new BigInteger(d, 256);

    dmp1 = new Buffer(dmp1.mod(p1.subtract(BigInteger.ONE)).toByteArray());
    dmq1 = new Buffer(dmq1.mod(q1.subtract(BigInteger.ONE)).toByteArray());

    asnWriter.startSequence();
    asnWriter.writeInt(0x00, Ber.Integer);
    asnWriter.writeBuffer(n, Ber.Integer);
    asnWriter.writeBuffer(e, Ber.Integer);
    asnWriter.writeBuffer(d, Ber.Integer);
    asnWriter.writeBuffer(p, Ber.Integer);
    asnWriter.writeBuffer(q, Ber.Integer);
    asnWriter.writeBuffer(dmp1, Ber.Integer);
    asnWriter.writeBuffer(dmq1, Ber.Integer);
    asnWriter.writeBuffer(iqmp, Ber.Integer);
    asnWriter.endSequence();
  } else {
    p = readString(pub, 4 + 7);
    q = readString(pub, pub._pos);
    var g = readString(pub, pub._pos);
    var y = readString(pub, pub._pos);
    var x = readString(priv, 0);

    asnWriter.startSequence();
    asnWriter.writeInt(0x00, Ber.Integer);
    asnWriter.writeBuffer(p, Ber.Integer);
    asnWriter.writeBuffer(q, Ber.Integer);
    asnWriter.writeBuffer(g, Ber.Integer);
    asnWriter.writeBuffer(y, Ber.Integer);
    asnWriter.writeBuffer(x, Ber.Integer);
    asnWriter.endSequence();
  }

  var b64key = asnWriter.buffer.toString('base64').replace(RE_KEY_LEN, '$1\n');
  var fullkey = '-----BEGIN '
                + (keyInfo.type === 'rsa' ? 'RSA' : 'DSA')
                + ' PRIVATE KEY-----\n'
                + b64key
                + (b64key[b64key.length - 1] === '\n' ? '' : '\n')
                + '-----END '
                + (keyInfo.type === 'rsa' ? 'RSA' : 'DSA')
                + ' PRIVATE KEY-----';

  keyInfo.private = asnWriter.buffer;
  keyInfo.privateOrig = new Buffer(fullkey);
  keyInfo._converted = true;
  return true;
}

function readString(buffer, start, encoding, stream, cb, maxLen) {
  if (encoding && !Buffer.isBuffer(encoding) && typeof encoding !== 'string') {
    if (typeof cb === 'number')
      maxLen = cb;
    cb = stream;
    stream = encoding;
    encoding = undefined;
  }

  var bufferLen = buffer.length;
  var left = (bufferLen - start);
  var len;
  var end;
  if (start < 0 || start >= bufferLen || left < 4) {
    stream && stream._cleanup(cb);
    return false;
  }

  len = buffer.readUInt32BE(start, true);
  if (len > (maxLen || MAX_STRING_LEN) || left < (4 + len)) {
    stream && stream._cleanup(cb);
    return false;
  }

  start += 4;
  end = start + len;
  buffer._pos = end;

  if (encoding) {
    if (Buffer.isBuffer(encoding)) {
      buffer.copy(encoding, 0, start, end);
      return encoding;
    } else
      return buffer.toString(encoding, start, end);
  } else
    return buffer.slice(start, end);
}


},{"./constants":326,"./jsbn":327,"./keyParser":328,"asn1":12,"crypto":undefined}],332:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "ssh2-streams@~0.0.22",
      "/Users/rudeluv/Apps/basic-ass-deploy/node_modules/ssh2"
    ]
  ],
  "_from": "ssh2-streams@>=0.0.22 <0.1.0",
  "_id": "ssh2-streams@0.0.23",
  "_inCache": true,
  "_installable": true,
  "_location": "/ssh2-streams",
  "_nodeVersion": "5.7.1",
  "_npmOperationalInternal": {
    "host": "packages-12-west.internal.npmjs.com",
    "tmp": "tmp/ssh2-streams-0.0.23.tgz_1457279385063_0.9182592548895627"
  },
  "_npmUser": {
    "email": "mscdex@mscdex.net",
    "name": "mscdex"
  },
  "_npmVersion": "3.6.0",
  "_phantomChildren": {},
  "_requested": {
    "name": "ssh2-streams",
    "raw": "ssh2-streams@~0.0.22",
    "rawSpec": "~0.0.22",
    "scope": null,
    "spec": ">=0.0.22 <0.1.0",
    "type": "range"
  },
  "_requiredBy": [
    "/ssh2"
  ],
  "_resolved": "https://registry.npmjs.org/ssh2-streams/-/ssh2-streams-0.0.23.tgz",
  "_shasum": "aeef30831bb5fc4af6aa3f6d0a261a413531612b",
  "_shrinkwrap": null,
  "_spec": "ssh2-streams@~0.0.22",
  "_where": "/Users/rudeluv/Apps/basic-ass-deploy/node_modules/ssh2",
  "author": {
    "email": "mscdex@mscdex.net",
    "name": "Brian White"
  },
  "bugs": {
    "url": "https://github.com/mscdex/ssh2-streams/issues"
  },
  "dependencies": {
    "asn1": "~0.2.0",
    "readable-stream": "~1.0.0",
    "streamsearch": "~0.1.2"
  },
  "description": "SSH2 and SFTP(v3) client/server protocol streams for node.js",
  "devDependencies": {},
  "directories": {},
  "dist": {
    "shasum": "aeef30831bb5fc4af6aa3f6d0a261a413531612b",
    "tarball": "https://registry.npmjs.org/ssh2-streams/-/ssh2-streams-0.0.23.tgz"
  },
  "engines": {
    "node": ">=0.8.7"
  },
  "homepage": "https://github.com/mscdex/ssh2-streams#readme",
  "keywords": [
    "client",
    "protocol",
    "secure",
    "server",
    "sftp",
    "ssh",
    "ssh2",
    "streams"
  ],
  "licenses": [
    {
      "type": "MIT",
      "url": "http://github.com/mscdex/ssh2-streams/raw/master/LICENSE"
    }
  ],
  "main": "./index",
  "maintainers": [
    {
      "name": "mscdex",
      "email": "mscdex@mscdex.net"
    }
  ],
  "name": "ssh2-streams",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/mscdex/ssh2-streams.git"
  },
  "scripts": {
    "test": "node test/test.js"
  },
  "version": "0.0.23"
}

},{}],333:[function(require,module,exports){
var inherits = require('util').inherits,
    DuplexStream = require('stream').Duplex
                   || require('readable-stream').Duplex,
    ReadableStream = require('stream').Readable
                     || require('readable-stream').Readable,
    WritableStream = require('stream').Writable
                     || require('readable-stream').Writable;

var STDERR = require('ssh2-streams').constants.CHANNEL_EXTENDED_DATATYPE.STDERR;

var PACKET_SIZE = 32 * 1024,
    MAX_WINDOW = 1 * 1024 * 1024,
    CUSTOM_EVENTS = [
      'CHANNEL_EOF',
      'CHANNEL_CLOSE',
      'CHANNEL_DATA',
      'CHANNEL_EXTENDED_DATA',
      'CHANNEL_WINDOW_ADJUST',
      'CHANNEL_SUCCESS',
      'CHANNEL_FAILURE',
      'CHANNEL_REQUEST'
    ],
    CUSTOM_EVENTS_LEN = CUSTOM_EVENTS.length;

function Channel(info, client, opts) {
  var streamOpts = {
    highWaterMark: MAX_WINDOW,
    allowHalfOpen: (!opts || (opts && opts.allowHalfOpen !== false))
  };

  this.allowHalfOpen = streamOpts.allowHalfOpen;

  DuplexStream.call(this, streamOpts);

  var self = this,
      server = opts && opts.server;

  this.server = server;
  this.type = info.type;
  this.subtype = undefined;
  /*
    incoming and outgoing contain these properties:
    {
      id: undefined,
      window: undefined,
      packetSize: undefined,
      state: 'closed'
    }
  */
  var incoming = this.incoming = info.incoming,
      incomingId = incoming.id,
      outgoing = this.outgoing = info.outgoing,
      callbacks = this._callbacks = [],
      exitCode,
      exitSignal,
      exitDump,
      exitDesc,
      exitLang;

  this._client = client;
  this._hasX11 = false;

  var channels = client._channels,
      sshstream = client._sshstream;

  function ondrain() {
    if (self._waitClientDrain) {
      self._waitClientDrain = false;
      if (!self._waitWindow) {
        if (self._chunk)
          self._write(self._chunk, null, self._chunkcb);
        else if (self._chunkcb)
          self._chunkcb();
        else if (self._chunkErr)
          self.stderr._write(self._chunkErr, null, self._chunkcbErr);
        else if (self._chunkcbErr)
          self._chunkcbErr();
      }
    }
  }
  client._sock.on('drain', ondrain);

  sshstream.once('CHANNEL_EOF:' + incomingId, function() {
    if (incoming.state === 'closed' || incoming.state === 'eof')
      return;
    incoming.state = 'eof';

    if (self.readable)
      self.push(null);
    if (server && self.stderr.writable)
      self.stderr.end();
    else if (!server && self.stderr.readable)
      self.stderr.push(null);
  }).once('CHANNEL_CLOSE:' + incomingId, function() {
    if (incoming.state === 'closed')
      return;
    incoming.state = 'closed';

    if (self.readable)
      self.push(null);
    if (server && self.stderr.writable)
      self.stderr.end();
    else if (!server && self.stderr.readable)
      self.stderr.push(null);

    if (outgoing.state === 'open' || outgoing.state === 'eof')
      self.close();
    if (outgoing.state === 'closing')
      outgoing.state = 'closed';

    delete channels[incomingId];

    var state = self._writableState;
    client._sock.removeListener('drain', ondrain);
    if (!state.ending && !state.finished)
      self.end();

    // Take care of any outstanding channel requests
    self._callbacks = [];
    for (var i = 0; i < callbacks.length; ++i)
      callbacks[i](true);
    callbacks = self._callbacks;

    if (!server) {
      // align more with node child processes, where the close event gets the
      // same arguments as the exit event
      if (exitCode === null)
        self.emit('close', exitCode, exitSignal, exitDump, exitDesc, exitLang);
      else
        self.emit('close', exitCode);

      self.stderr.emit('close');
    } else
      self.emit('close');

    for (var i = 0; i < CUSTOM_EVENTS_LEN; ++i)
      sshstream.removeAllListeners(CUSTOM_EVENTS[i] + ':' + incomingId);
  }).on('CHANNEL_DATA:' + incomingId, function(data) {
    // the remote party should not be sending us data if there is no window
    // space available ...
    if (incoming.window === 0)
      return;

    incoming.window -= data.length;

    if (!self.push(data)) {
      self._waitChanDrain = true;
      return;
    }

    if (incoming.window === 0)
      windowAdjust(self);
  }).on('CHANNEL_WINDOW_ADJUST:' + incomingId, function(amt) {
    // the server is allowing us to send `amt` more bytes of data
    outgoing.window += amt;

    if (self._waitWindow) {
      self._waitWindow = false;
      if (!self._waitClientDrain) {
        if (self._chunk)
          self._write(self._chunk, null, self._chunkcb);
        else if (self._chunkcb)
          self._chunkcb();
        else if (self._chunkErr)
          self.stderr._write(self._chunkErr, null, self._chunkcbErr);
        else if (self._chunkcbErr)
          self._chunkcbErr();
      }
    }
  }).on('CHANNEL_SUCCESS:' + incomingId, function() {
    if (server) {
      sshstream._kalast = Date.now();
      sshstream._kacnt = 0;
    } else
      client._resetKA();
    if (callbacks.length)
      callbacks.shift()(false);
  }).on('CHANNEL_FAILURE:' + incomingId, function() {
    if (server) {
      sshstream._kalast = Date.now();
      sshstream._kacnt = 0;
    } else
      client._resetKA();
    if (callbacks.length)
      callbacks.shift()(true);
  }).on('CHANNEL_REQUEST:' + incomingId, function(info) {
    if (!server) {
      if (info.request === 'exit-status') {
        self.emit('exit', exitCode = info.code);
        return;
      } else if (info.request === 'exit-signal') {
        self.emit('exit',
                  exitCode = null,
                  exitSignal = 'SIG' + info.signal,
                  exitDump = info.coredump,
                  exitDesc = info.description,
                  exitLang = info.lang);
        return;
      }
    }

    // keepalive request? OpenSSH will send one as a channel request if there
    // is a channel open

    if (info.wantReply)
      sshstream.channelFailure(outgoing.id);
  });

  this.stdin = this.stdout = this;

  if (server)
    this.stderr = new ServerStderr(this);
  else {
    this.stderr = new ReadableStream(streamOpts);
    this.stderr._read = function(n) {
      if (self._waitChanDrain) {
        self._waitChanDrain = false;
        if (incoming.window === 0)
          windowAdjust(self);
      }
    };

    sshstream.on('CHANNEL_EXTENDED_DATA:' + incomingId,
      function(type, data) {
        // the remote party should not be sending us data if there is no window
        // space available ...
        if (incoming.window === 0)
          return;

        incoming.window -= data.length;

        if (!self.stderr.push(data)) {
          self._waitChanDrain = true;
          return;
        }

        if (incoming.window === 0)
          windowAdjust(self);
      }
    );
  }

  // outgoing data
  this._waitClientDrain = false; // Client stream-level backpressure
  this._waitWindow = false; // SSH-level backpressure

  // incoming data
  this._waitChanDrain = false; // Channel Readable side backpressure

  this._chunk = undefined;
  this._chunkcb = undefined;
  this._chunkErr = undefined;
  this._chunkcbErr = undefined;

  function onFinish() {
    self.eof();
    if (server || (!server && !self.allowHalfOpen))
      self.close();
    self.writable = false;
  }
  this.on('finish', onFinish)
      .on('prefinish', onFinish); // for node v0.11+
  function onEnd() {
    self.readable = false;
  }
  this.on('end', onEnd)
      .on('close', onEnd);
}
inherits(Channel, DuplexStream);

Channel.prototype.eof = function() {
  var ret = true,
      outgoing = this.outgoing;

  if (outgoing.state === 'open') {
    outgoing.state = 'eof';
    ret = this._client._sshstream.channelEOF(outgoing.id);
  }

  return ret;
};

Channel.prototype.close = function() {
  var ret = true,
      outgoing = this.outgoing;

  if (outgoing.state === 'open' || outgoing.state === 'eof') {
    outgoing.state = 'closing';
    ret = this._client._sshstream.channelClose(outgoing.id);
  }

  return ret;
};

Channel.prototype._read = function(n) {
  if (this._waitChanDrain) {
    this._waitChanDrain = false;
    if (this.incoming.window === 0)
      windowAdjust(this);
  }
};

Channel.prototype._write = function(data, encoding, cb) {
  var sshstream = this._client._sshstream,
      outgoing = this.outgoing,
      packetSize = outgoing.packetSize,
      id = outgoing.id,
      window = outgoing.window,
      len = data.length,
      p = 0,
      ret,
      buf,
      sliceLen;

  if (outgoing.state !== 'open')
    return;

  while (len - p > 0 && window > 0) {
    sliceLen = len - p;
    if (sliceLen > window)
      sliceLen = window;
    if (sliceLen > packetSize)
      sliceLen = packetSize;

    ret = sshstream.channelData(id, data.slice(p, p + sliceLen));

    p += sliceLen;
    window -= sliceLen;

    if (!ret) {
      this._waitClientDrain = true;
      this._chunk = undefined;
      this._chunkcb = cb;
      break;
    }
  }

  outgoing.window = window;

  if (len - p > 0) {
    if (window === 0)
      this._waitWindow = true;
    if (p > 0) {
      // partial
      buf = new Buffer(len - p);
      data.copy(buf, 0, p);
      this._chunk = buf;
    } else
      this._chunk = data;
    this._chunkcb = cb;
    return;
  }

  if (!this._waitClientDrain)
    cb();
};

Channel.prototype.destroy = function() {
  this.end();
};

// session type-specific methods
Channel.prototype.setWindow = function(rows, cols, height, width) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  if (this.type === 'session'
      && (this.subtype === 'shell' || this.subtype === 'exec')
      && this.writable
      && this.outgoing.state === 'open') {
    return this._client._sshstream.windowChange(this.outgoing.id,
                                                rows,
                                                cols,
                                                height,
                                                width);
  }

  return true;
};
Channel.prototype.signal = function(signalName) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  if (this.type === 'session'
      && this.writable
      && this.outgoing.state === 'open')
    return this._client._sshstream.signal(this.outgoing.id, signalName);

  return true;
};
Channel.prototype.exit = function(name, coreDumped, msg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (this.type === 'session'
      && this.writable
      && this.outgoing.state === 'open') {
    if (typeof name === 'number')
      return this._client._sshstream.exitStatus(this.outgoing.id, name);
    else {
      return this._client._sshstream.exitSignal(this.outgoing.id,
                                                name,
                                                coreDumped,
                                                msg);
    }
  }

  return true;
};

Channel.MAX_WINDOW = MAX_WINDOW;
Channel.PACKET_SIZE = PACKET_SIZE;

function windowAdjust(self, amt) {
  if (self.outgoing.state !== 'open')
    return true;
  amt = amt || MAX_WINDOW;
  self.incoming.window += amt;
  return self._client._sshstream.channelWindowAdjust(self.outgoing.id, amt);
}

function ServerStderr(channel) {
  WritableStream.call(this, { highWaterMark: MAX_WINDOW });
  this._channel = channel;
}
inherits(ServerStderr, WritableStream);

ServerStderr.prototype._write = function(data, encoding, cb) {
  var channel = this._channel,
      sshstream = channel._client._sshstream,
      outgoing = channel.outgoing,
      packetSize = outgoing.packetSize,
      id = outgoing.id,
      window = outgoing.window,
      len = data.length,
      p = 0,
      ret,
      buf,
      sliceLen;

  if (channel.outgoing.state !== 'open')
    return;

  while (len - p > 0 && window > 0) {
    sliceLen = len - p;
    if (sliceLen > window)
      sliceLen = window;
    if (sliceLen > packetSize)
      sliceLen = packetSize;

    ret = sshstream.channelExtData(id, data.slice(p, p + sliceLen), STDERR);

    p += sliceLen;
    window -= sliceLen;

    if (!ret) {
      channel._waitClientDrain = true;
      channel._chunkErr = undefined;
      channel._chunkcbErr = cb;
      break;
    }
  }

  outgoing.window = window;

  if (len - p > 0) {
    if (window === 0)
      channel._waitWindow = true;
    if (p > 0) {
      // partial
      buf = new Buffer(len - p);
      data.copy(buf, 0, p);
      channel._chunkErr = buf;
    } else
      channel._chunkErr = data;
    channel._chunkcbErr = cb;
    return;
  }

  if (!channel._waitClientDrain)
    cb();
};

module.exports = Channel;

},{"readable-stream":322,"ssh2-streams":325,"stream":undefined,"util":undefined}],334:[function(require,module,exports){
// This wrapper class is used to retain backwards compatibility with
// pre-v0.4 ssh2. If it weren't for `read()` and `write()` being used by the
// streams2/3 API, we could just pass the SFTPStream directly to the end user...

var inherits = require('util').inherits,
    EventEmitter = require('events').EventEmitter;

function SFTPWrapper(stream) {
  var self = this;

  EventEmitter.call(this);

  this._stream = stream;

  stream.on('error', function(err) {
    self.emit('error', err);
  }).on('end', function() {
    self.emit('end');
  }).on('close', function() {
    self.emit('close');
  }).on('continue', function() {
    self.emit('continue');
  });
}
inherits(SFTPWrapper, EventEmitter);

// stream-related methods to pass on
SFTPWrapper.prototype.end = function() {
  return this._stream.end();
};
// SFTPStream client methods
SFTPWrapper.prototype.createReadStream = function(path, options) {
  return this._stream.createReadStream(path, options);
};
SFTPWrapper.prototype.createWriteStream = function(path, options) {
  return this._stream.createWriteStream(path, options);
};
SFTPWrapper.prototype.open = function(path, flags, attrs, cb) {
  return this._stream.open(path, flags, attrs, cb);
};
SFTPWrapper.prototype.close = function(handle, cb) {
  return this._stream.close(handle, cb);
};
SFTPWrapper.prototype.read = function(handle, buf, off, len, position, cb) {
  return this._stream.readData(handle, buf, off, len, position, cb);
};
SFTPWrapper.prototype.write = function(handle, buf, off, len, position, cb) {
  return this._stream.writeData(handle, buf, off, len, position, cb);
};
SFTPWrapper.prototype.fastGet = function(remotePath, localPath, opts, cb) {
  return this._stream.fastGet(remotePath, localPath, opts, cb);
};
SFTPWrapper.prototype.fastPut = function(localPath, remotePath, opts, cb) {
  return this._stream.fastPut(localPath, remotePath, opts, cb);
};
SFTPWrapper.prototype.readFile = function(path, options, callback_) {
  return this._stream.readFile(path, options, callback_);
};
SFTPWrapper.prototype.writeFile = function(path, data, options, callback_) {
  return this._stream.writeFile(path, data, options, callback_);
};
SFTPWrapper.prototype.appendFile = function(path, data, options, callback_) {
  return this._stream.appendFile(path, data, options, callback_);
};
SFTPWrapper.prototype.exists = function(path, cb) {
  return this._stream.exists(path, cb);
};
SFTPWrapper.prototype.unlink = function(filename, cb) {
  return this._stream.unlink(filename, cb);
};
SFTPWrapper.prototype.rename = function(oldPath, newPath, cb) {
  return this._stream.rename(oldPath, newPath, cb);
};
SFTPWrapper.prototype.mkdir = function(path, attrs, cb) {
  return this._stream.mkdir(path, attrs, cb);
};
SFTPWrapper.prototype.rmdir = function(path, cb) {
  return this._stream.rmdir(path, cb);
};
SFTPWrapper.prototype.readdir = function(where, opts, cb) {
  return this._stream.readdir(where, opts, cb);
};
SFTPWrapper.prototype.fstat = function(handle, cb) {
  return this._stream.fstat(handle, cb);
};
SFTPWrapper.prototype.stat = function(path, cb) {
  return this._stream.stat(path, cb);
};
SFTPWrapper.prototype.lstat = function(path, cb) {
  return this._stream.lstat(path, cb);
};
SFTPWrapper.prototype.opendir = function(path, cb) {
  return this._stream.opendir(path, cb);
};
SFTPWrapper.prototype.setstat = function(path, attrs, cb) {
  return this._stream.setstat(path, attrs, cb);
};
SFTPWrapper.prototype.fsetstat = function(handle, attrs, cb) {
  return this._stream.fsetstat(handle, attrs, cb);
};
SFTPWrapper.prototype.futimes = function(handle, atime, mtime, cb) {
  return this._stream.futimes(handle, atime, mtime, cb);
};
SFTPWrapper.prototype.utimes = function(path, atime, mtime, cb) {
  return this._stream.utimes(path, atime, mtime, cb);
};
SFTPWrapper.prototype.fchown = function(handle, uid, gid, cb) {
  return this._stream.fchown(handle, uid, gid, cb);
};
SFTPWrapper.prototype.chown = function(path, uid, gid, cb) {
  return this._stream.chown(path, uid, gid, cb);
};
SFTPWrapper.prototype.fchmod = function(handle, mode, cb) {
  return this._stream.fchmod(handle, mode, cb);
};
SFTPWrapper.prototype.chmod = function(path, mode, cb) {
  return this._stream.chmod(path, mode, cb);
};
SFTPWrapper.prototype.readlink = function(path, cb) {
  return this._stream.readlink(path, cb);
};
SFTPWrapper.prototype.symlink = function(targetPath, linkPath, cb) {
  return this._stream.symlink(targetPath, linkPath, cb);
};
SFTPWrapper.prototype.realpath = function(path, cb) {
  return this._stream.realpath(path, cb);
};
// extended requests
SFTPWrapper.prototype.ext_openssh_rename = function(oldPath, newPath, cb) {
  return this._stream.ext_openssh_rename(oldPath, newPath, cb);
};
SFTPWrapper.prototype.ext_openssh_statvfs = function(path, cb) {
  return this._stream.ext_openssh_statvfs(path, cb);
};
SFTPWrapper.prototype.ext_openssh_fstatvfs = function(handle, cb) {
  return this._stream.ext_openssh_fstatvfs(handle, cb);
};
SFTPWrapper.prototype.ext_openssh_hardlink = function(oldPath, newPath, cb) {
  return this._stream.ext_openssh_hardlink(oldPath, newPath, cb);
};
SFTPWrapper.prototype.ext_openssh_fsync = function(handle, cb) {
  return this._stream.ext_openssh_fsync(handle, cb);
};

module.exports = SFTPWrapper;

},{"events":undefined,"util":undefined}],335:[function(require,module,exports){
(function (__dirname){
var Socket = require('net').Socket,
    EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    path = require('path'),
    fs = require('fs'),
    cp = require('child_process');

var REQUEST_IDENTITIES = 11,
    IDENTITIES_ANSWER = 12,
    SIGN_REQUEST = 13,
    SIGN_RESPONSE = 14,
    FAILURE = 5;

var RE_CYGWIN_SOCK = /^\!<socket >(\d+) s ([A-Z0-9]{8}\-[A-Z0-9]{8}\-[A-Z0-9]{8}\-[A-Z0-9]{8})/;

module.exports = function(sockPath, key, keyType, data, cb) {
  var sock,
      error,
      sig,
      datalen,
      keylen = 0,
      isSigning = Buffer.isBuffer(key),
      type,
      count = 0,
      siglen = 0,
      nkeys = 0,
      keys,
      comlen = 0,
      comment = false,
      accept,
      reject;

  if (typeof key === 'function' && typeof keyType === 'function') {
    // agent forwarding
    accept = key;
    reject = keyType;
  } else if (isSigning) {
    keylen = key.length;
    datalen = data.length;
  } else {
    cb = key;
    key = undefined;
  }

  function onconnect() {
    var buf;
    if (isSigning) {
      /*
        byte        SSH2_AGENTC_SIGN_REQUEST
        string      key_blob
        string      data
        uint32      flags
      */
      var p = 9;
      buf = new Buffer(4 + 1 + 4 + keylen + 4 + datalen + 4);
      buf.writeUInt32BE(buf.length - 4, 0, true);
      buf[4] = SIGN_REQUEST;
      buf.writeUInt32BE(keylen, 5, true);
      key.copy(buf, p);
      buf.writeUInt32BE(datalen, p += keylen, true);
      data.copy(buf, p += 4);
      buf.writeUInt32BE(0, p += datalen, true);
      sock.write(buf);
    } else {
      /*
        byte        SSH2_AGENTC_REQUEST_IDENTITIES
      */
      sock.write(new Buffer([0, 0, 0, 1, REQUEST_IDENTITIES]));
    }
  }
  function ondata(chunk) {
    for (var i = 0, len = chunk.length; i < len; ++i) {
      if (type === undefined) {
        // skip over packet length
        if (++count === 5) {
          type = chunk[i];
          count = 0;
        }
      } else if (type === SIGN_RESPONSE) {
        /*
          byte        SSH2_AGENT_SIGN_RESPONSE
          string      signature_blob
        */
        if (!sig) {
          siglen <<= 8;
          siglen += chunk[i];
          if (++count === 4) {
            sig = new Buffer(siglen);
            count = 0;
          }
        } else {
          sig[count] = chunk[i];
          if (++count === siglen) {
            sock.removeAllListeners('data');
            return sock.destroy();
          }
        }
      } else if (type === IDENTITIES_ANSWER) {
        /*
          byte        SSH2_AGENT_IDENTITIES_ANSWER
          uint32      num_keys

        Followed by zero or more consecutive keys, encoded as:

          string      public key blob
          string      public key comment
        */
        if (keys === undefined) {
          nkeys <<= 8;
          nkeys += chunk[i];
          if (++count === 4) {
            keys = new Array(nkeys);
            count = 0;
            if (nkeys === 0) {
              sock.removeAllListeners('data');
              return sock.destroy();
            }
          }
        } else {
          if (!key) {
            keylen <<= 8;
            keylen += chunk[i];
            if (++count === 4) {
              key = new Buffer(keylen);
              count = 0;
            }
          } else if (comment === false) {
            key[count] = chunk[i];
            if (++count === keylen) {
              keys[nkeys - 1] = key;
              keylen = 0;
              count = 0;
              comment = true;
              if (--nkeys === 0) {
                key = undefined;
                sock.removeAllListeners('data');
                return sock.destroy();
              }
            }
          } else if (comment === true) {
            comlen <<= 8;
            comlen += chunk[i];
            if (++count === 4) {
              count = 0;
              if (comlen > 0)
                comment = comlen;
              else {
                key = undefined;
                comment = false;
              }
              comlen = 0;
            }
          } else {
            // skip comments
            if (++count === comment) {
              comment = false;
              count = 0;
              key = undefined;
            }
          }
        }
      } else if (type === FAILURE) {
        if (isSigning)
          error = new Error('Agent unable to sign data');
        else
          error = new Error('Unable to retrieve list of keys from agent');
        sock.removeAllListeners('data');
        return sock.destroy();
      }
    }
  }
  function onerror(err) {
    error = err;
  }
  function onclose() {
    if (error)
      cb(error);
    else if ((isSigning && !sig) || (!isSigning && !keys))
      cb(new Error('Unexpected disconnection from agent'));
    else if (isSigning && sig)
      cb(undefined, sig);
    else if (!isSigning && keys)
      cb(undefined, keys);
  }

  if (process.platform === 'win32') {
    if (sockPath === 'pageant') {
      // Pageant (PuTTY authentication agent)
      sock = new PageantSock();
    } else {
      // cygwin ssh-agent instance
      var triedCygpath = false;
      fs.readFile(sockPath, function readCygsocket(err, data) {
        if (err) {
          if (triedCygpath)
            return cb(new Error('Invalid cygwin unix socket path'));
          // try using `cygpath` to convert a possible *nix-style path to the
          // real Windows path before giving up ...
          cp.exec('cygpath -w "' + sockPath + '"',
                  function(err, stdout, stderr) {
            if (err || stdout.length === 0)
              return cb(new Error('Invalid cygwin unix socket path'));
            triedCygpath = true;
            sockPath = stdout.toString().replace(/[\r\n]/g, '');
            fs.readFile(sockPath, readCygsocket);
          });
          return;
        }

        var m;
        if (m = RE_CYGWIN_SOCK.exec(data.toString('ascii'))) {
          var port,
              secret,
              secretbuf,
              state,
              bc = 0,
              isRetrying = false,
              inbuf = [],
              credsbuf = new Buffer(12),
              i, j;

          // use 0 for pid, uid, and gid to ensure we get an error and also
          // a valid uid and gid from cygwin so that we don't have to figure it
          // out ourselves
          credsbuf.fill(0);

          // parse cygwin unix socket file contents
          port = parseInt(m[1], 10);
          secret = m[2].replace(/\-/g, '');
          secretbuf = new Buffer(16);
          for (i = 0, j = 0; j < 32; ++i,j+=2)
            secretbuf[i] = parseInt(secret.substring(j, j + 2), 16);

          // convert to host order (always LE for Windows)
          for (i = 0; i < 16; i += 4)
            secretbuf.writeUInt32LE(secretbuf.readUInt32BE(i, true), i, true);

          function _onconnect() {
            bc = 0;
            state = 'secret';
            sock.write(secretbuf);
          }
          function _ondata(data) {
            bc += data.length;
            if (state === 'secret') {
              // the secret we sent is echoed back to us by cygwin, not sure of
              // the reason for that, but we ignore it nonetheless ...
              if (bc === 16) {
                bc = 0;
                state = 'creds';
                sock.write(credsbuf);
              }
            } else if (state === 'creds') {
              // if this is the first attempt, make sure to gather the valid
              // uid and gid for our next attempt
              if (!isRetrying)
                inbuf.push(data);

              if (bc === 12) {
                sock.removeListener('connect', _onconnect);
                sock.removeListener('data', _ondata);
                sock.removeListener('close', _onclose);
                if (isRetrying) {
                  addSockListeners();
                  sock.emit('connect');
                } else {
                  isRetrying = true;
                  credsbuf = Buffer.concat(inbuf);
                  credsbuf.writeUInt32LE(process.pid, 0, true);
                  sock.destroy();
                  tryConnect();
                }
              }
            }
          }
          function _onclose() {
            cb(new Error('Problem negotiating cygwin unix socket security'));
          }
          function tryConnect() {
            sock = new Socket();
            sock.once('connect', _onconnect);
            sock.on('data', _ondata);
            sock.once('close', _onclose);
            sock.connect(port);
          }
          tryConnect();
        } else
          cb(new Error('Malformed cygwin unix socket file'));
      });
      return;
    }
  } else
    sock = new Socket();

  function addSockListeners() {
    if (!accept && !reject) {
      sock.once('connect', onconnect);
      sock.on('data', ondata);
      sock.once('error', onerror);
      sock.once('close', onclose);
    } else {
      var chan;
      sock.once('connect', function() {
        chan = accept();
        var isDone = false;
        function onDone() {
          if (isDone)
            return;
          sock.destroy();
          isDone = true;
        }
        chan.once('end', onDone)
            .once('close', onDone)
            .on('data', function(data) {
          sock.write(data);
        });
        sock.on('data', function(data) {
          chan.write(data);
        });
      });
      sock.once('close', function() {
        if (!chan)
          reject();
      });
    }
  }
  addSockListeners();
  sock.connect(sockPath);
};


// win32 only ------------------------------------------------------------------
if (process.platform === 'win32') {
  var RET_ERR_BADARGS = 10,
      RET_ERR_UNAVAILABLE = 11,
      RET_ERR_NOMAP = 12,
      RET_ERR_BINSTDIN = 13,
      RET_ERR_BINSTDOUT = 14,
      RET_ERR_BADLEN = 15;

  var ERROR = {}, EXEPATH = path.resolve(__dirname, '..', 'util/pagent.exe');
  ERROR[RET_ERR_BADARGS] = new Error('Invalid pagent.exe arguments');
  ERROR[RET_ERR_UNAVAILABLE] = new Error('Pageant is not running');
  ERROR[RET_ERR_NOMAP] = new Error('pagent.exe could not create an mmap');
  ERROR[RET_ERR_BINSTDIN] = new Error('pagent.exe could not set mode for stdin');
  ERROR[RET_ERR_BINSTDOUT] = new Error('pagent.exe could not set mode for stdout');
  ERROR[RET_ERR_BADLEN] = new Error('pagent.exe did not get expected input payload');

  function PageantSock() {
    this.proc = undefined;
    this.buffer = null;
  }
  inherits(PageantSock, EventEmitter);

  PageantSock.prototype.write = function(buf) {
    if (this.buffer === null)
      this.buffer = buf;
    else {
      this.buffer = Buffer.concat([this.buffer, buf],
                                  this.buffer.length + buf.length);
    }
    // Wait for at least all length bytes
    if (this.buffer.length < 4)
      return;

    var len = this.buffer.readUInt32BE(0, true);
    // Make sure we have a full message before querying pageant
    if ((this.buffer.length - 4) < len)
      return;

    buf = this.buffer.slice(0, 4 + len);
    if (this.buffer.length > (4 + len))
      this.buffer = this.buffer.slice(4 + len);
    else
      this.buffer = null;

    var self = this,
        proc,
        hadError = false;
    proc = this.proc = cp.spawn(EXEPATH, [ buf.length ]);
    proc.stdout.on('data', function(data) {
      self.emit('data', data);
    });
    proc.once('error', function(err) {
      if (!hadError) {
        hadError = true;
        self.emit('error', err);
      }
    });
    proc.once('close', function(code) {
      self.proc = undefined;
      if (ERROR[code] && !hadError) {
        hadError = true;
        self.emit('error', ERROR[code]);
      }
      self.emit('close', hadError);
    });
    proc.stdin.end(buf);
  };
  PageantSock.prototype.end = PageantSock.prototype.destroy = function() {
    this.buffer = null;
    if (this.proc) {
      this.proc.kill();
      this.proc = undefined;
    }
  };
  PageantSock.prototype.connect = function() {
    this.emit('connect');
  };
}

}).call(this,"/Users/rudeluv/Apps/basic-ass-deploy/node_modules/ssh2/lib")
},{"child_process":undefined,"events":undefined,"fs":undefined,"net":undefined,"path":undefined,"util":undefined}],336:[function(require,module,exports){
var crypto = require('crypto'),
    Socket = require('net').Socket,
    dnsLookup = require('dns').lookup,
    EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits;

var ssh2_streams = require('ssh2-streams'),
    SSH2Stream = ssh2_streams.SSH2Stream,
    SFTPStream = ssh2_streams.SFTPStream,
    consts = ssh2_streams.constants,
    parseKey = ssh2_streams.utils.parseKey,
    decryptKey = ssh2_streams.utils.decryptKey,
    genPublicKey = ssh2_streams.utils.genPublicKey;

var Channel = require('./Channel'),
    agentQuery = require('./agent'),
    SFTPWrapper = require('./SFTPWrapper');

var MAX_CHANNEL = Math.pow(2, 32) - 1,
    RE_OPENSSH = /^OpenSSH_(?:(?![0-4])\d)|(?:\d{2,})/,
    DEBUG_NOOP = function(msg) {};

function Client() {
  if (!(this instanceof Client))
    return new Client();

  EventEmitter.call(this);

  this.config = {
    host: undefined,
    port: undefined,
    forceIPv4: undefined,
    forceIPv6: undefined,
    keepaliveCountMax: undefined,
    keepaliveInterval: undefined,
    readyTimeout: undefined,
    compress: undefined,

    username: undefined,
    password: undefined,
    privateKey: undefined,
    publicKey: undefined,
    tryKeyboard: undefined,
    agent: undefined,
    allowAgentFwd: undefined,

    hostHashAlgo: undefined,
    hostHashCb: undefined,
    strictVendor: undefined,
    debug: undefined
  };

  this._readyTimeout = undefined;
  this._channels = undefined;
  this._callbacks = undefined;
  this._forwarding = undefined;
  this._acceptX11 = undefined;
  this._agentFwdEnabled = undefined;
  this._curChan = undefined;
  this._remoteVer = undefined;

  this._sshstream = undefined;
  this._sock = undefined;
  this._resetKA = undefined;
}
inherits(Client, EventEmitter);

Client.prototype.connect = function(cfg) {
  var self = this;

  if (this._sock && this._sock.writable) {
    this.once('close', function() {
      self.connect(cfg);
    });
    this.end();
    return;
  }

  this.config.host = cfg.hostname || cfg.host || 'localhost';
  this.config.port = cfg.port || 22;
  this.config.forceIPv4 = cfg.forceIPv4 || false;
  this.config.forceIPv6 = cfg.forceIPv6 || false;
  this.config.keepaliveCountMax = (typeof cfg.keepaliveCountMax === 'number'
                                   && cfg.keepaliveCountMax >= 0
                                   ? cfg.keepaliveCountMax
                                   : 3);
  this.config.keepaliveInterval = (typeof cfg.keepaliveInterval === 'number'
                                   && cfg.keepaliveInterval > 0
                                   ? cfg.keepaliveInterval
                                   : 0);
  this.config.readyTimeout = (typeof cfg.readyTimeout === 'number'
                              && cfg.readyTimeout >= 0
                              ? cfg.readyTimeout
                              : 20000);
  this.config.compress = cfg.compress;

  this.config.username = cfg.username || cfg.user;
  this.config.password = (typeof cfg.password === 'string'
                          ? cfg.password
                          : undefined);
  this.config.privateKey = (typeof cfg.privateKey === 'string'
                            || Buffer.isBuffer(cfg.privateKey)
                            ? cfg.privateKey
                            : undefined);
  this.config.publicKey = undefined;
  this.config.localHostname = (typeof cfg.localHostname === 'string'
                               && cfg.localHostname.length
                               ? cfg.localHostname
                               : undefined);
  this.config.localUsername = (typeof cfg.localUsername === 'string'
                               && cfg.localUsername.length
                               ? cfg.localUsername
                               : undefined);
  this.config.tryKeyboard = (cfg.tryKeyboard === true);
  this.config.agent = (typeof cfg.agent === 'string' && cfg.agent.length
                       ? cfg.agent
                       : undefined);
  this.config.allowAgentFwd = (cfg.agentForward === true
                               && this.config.agent !== undefined);

  this.config.strictVendor = (typeof cfg.strictVendor === 'boolean'
                              ? cfg.strictVendor
                              : true);

  var debug = this.config.debug = (typeof cfg.debug === 'function'
                                   ? cfg.debug
                                   : DEBUG_NOOP);

  if (typeof this.config.username !== 'string')
    throw new Error('Invalid username');

  if (cfg.agentForward === true && !this.config.allowAgentFwd)
    throw new Error('You must set a valid agent path to allow agent forwarding');

  var callbacks = this._callbacks = [];
  this._channels = {};
  this._forwarding = {};
  this._acceptX11 = 0;
  this._agentFwdEnabled = false;
  this._curChan = -1;
  this._remoteVer = undefined;

  if (this.config.privateKey) {
    var privKeyInfo = parseKey(this.config.privateKey);
    if (privKeyInfo instanceof Error)
      throw new Error('Cannot parse privateKey: ' + privKeyInfo.message);
    if (!privKeyInfo.private)
      throw new Error('privateKey value does not contain a (valid) private key');
    if (privKeyInfo.encryption) {
      if (typeof cfg.passphrase !== 'string')
        throw new Error('Encrypted private key detected, but no passphrase given');
      decryptKey(privKeyInfo, cfg.passphrase);
    }
    this.config.privateKey = privKeyInfo;
    this.config.publicKey = genPublicKey(privKeyInfo);
  }

  var stream = this._sshstream = new SSH2Stream({
        debug: (debug === DEBUG_NOOP ? undefined : debug)
      }),
      sock = this._sock = (cfg.sock || new Socket());

  // drain stderr if we are connection hopping using an exec stream
  if (this._sock.stderr)
    this._sock.stderr.resume();

  // keepalive-related
  var kainterval = this.config.keepaliveInterval,
      kacountmax = this.config.keepaliveCountMax,
      kacount = 0,
      katimer;
  function sendKA() {
    if (++kacount > kacountmax) {
      clearInterval(katimer);
      if (sock.readable) {
        var err = new Error('Keepalive timeout');
        err.level = 'client-timeout';
        self.emit('error', err);
        sock.destroy();
      }
      return;
    }
    if (sock.writable) {
      // append dummy callback to keep correct callback order
      callbacks.push(resetKA);
      stream.ping();
    } else
      clearInterval(katimer);
  }
  function resetKA() {
    if (kainterval > 0) {
      kacount = 0;
      clearInterval(katimer);
      if (sock.writable)
        katimer = setInterval(sendKA, kainterval);
    }
  }
  this._resetKA = resetKA;

  stream.on('USERAUTH_BANNER', function(msg) {
    self.emit('banner', msg);
  });

  sock.on('connect', function() {
    debug('DEBUG: Client: Connected');
    self.emit('connect');
    self._sock.setKeepAlive(true);
    if (!cfg.sock)
      stream.pipe(sock).pipe(stream);
  }).on('timeout', function() {
    self.emit('timeout');
  }).on('error', function(err) {
    clearTimeout(self._readyTimeout);
    err.level = 'client-socket';
    self.emit('error', err);
  }).on('end', function() {
    stream.unpipe(sock);
    clearTimeout(self._readyTimeout);
    clearInterval(katimer);
    self.emit('end');
  }).on('close', function() {
    stream.unpipe(sock);
    clearTimeout(self._readyTimeout);
    clearInterval(katimer);
    self.emit('close');

    // notify outstanding channel requests of disconnection ...
    var callbacks_ = callbacks,
        err = new Error('No response from server');
    callbacks = self._callbacks = [];
    for (var i = 0; i < callbacks_.length; ++i)
      callbacks_[i](err);

    // simulate error for any channels waiting to be opened. this is safe
    // against successfully opened channels because the success and failure
    // event handlers are automatically removed when a success/failure response
    // is received
    var chanNos = Object.keys(self._channels);
    self._channels = {};
    for (var i = 0; i < chanNos.length; ++i) {
      stream.emit('CHANNEL_OPEN_FAILURE:' + chanNos[i], err);
      // emitting CHANNEL_CLOSE should be safe too and should help for any
      // special channels which might otherwise keep the process alive, such
      // as agent forwarding channels which have open unix sockets ...
      stream.emit('CHANNEL_CLOSE:' + chanNos[i]);
    }
  });
  stream.on('drain', function() {
    self.emit('drain');
  }).once('header', function(header) {
    self._remoteVer = header.versions.software;
    if (header.greeting)
      self.emit('greeting', header.greeting);
  }).on('continue', function() {
    self.emit('continue');
  }).on('error', function(err) {
    err.level = 'protocol';
    self.emit('error', err);
  });

  if (typeof cfg.hostVerifier === 'function'
      && ~crypto.getHashes().indexOf(cfg.hostHash)) {
    var hashCb = cfg.hostVerifier,
        hasher = crypto.createHash(cfg.hostHash);
    stream.once('fingerprint', function(key, verify) {
      hasher.update(key, 'binary');
      verify(hashCb(hasher.digest('hex')));
    });
  }

  // begin authentication handling =============================================
  var auths = [],
      curAuth,
      agentKeys,
      agentKeyPos = 0;
  if (this.config.password !== undefined)
    auths.push('password');
  if (this.config.publicKey !== undefined)
    auths.push('publickey');
  if (this.config.agent !== undefined)
    auths.push('agent');
  if (this.config.tryKeyboard)
    auths.push('keyboard-interactive');
  if (this.config.publicKey !== undefined
      && this.config.localHostname !== undefined
      && this.config.localUsername !== undefined)
    auths.push('hostbased');
  auths.push('none');
  function tryNextAuth() {
    // TODO: better shutdown
    if (!auths.length) {
      stream.removeListener('USERAUTH_FAILURE', onUSERAUTH_FAILURE);
      stream.removeListener('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
      var err = new Error('All configured authentication methods failed');
      err.level = 'client-authentication';
      self.emit('error', err);
      if (stream.writable)
        self.end();
      return;
    }

    curAuth = auths.shift();
    switch (curAuth) {
      case 'password':
        stream.authPassword(self.config.username, self.config.password);
      break;
      case 'publickey':
        stream.authPK(self.config.username, self.config.publicKey);
        stream.once('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
      break;
      case 'hostbased':
        function hostbasedCb(buf, cb) {
          var signature = crypto.createSign(self.config.privateKey.type === 'rsa'
                                            ? 'RSA-SHA1'
                                            : 'DSA-SHA1');
          signature.update(buf);
          signature = signature.sign(self.config.privateKey.privateOrig, 'binary');
          signature = new Buffer(signature, 'binary');

          if (self.config.privateKey.type === 'dss' && signature.length > 40) {
            // this is a quick and dirty way to get from DER encoded r and s that
            // OpenSSL gives us, to just the bare values back to back (40 bytes
            // total) like OpenSSH (and possibly others) are expecting
            var newsig = new Buffer(40),
                rlen = signature[3],
                rstart = 4,
                sstart = 4 + 1 + rlen + 1;
            while (signature[rstart] === 0)
              ++rstart;
            while (signature[sstart] === 0)
              ++sstart;
            signature.copy(newsig, 0, rstart, rstart + 20);
            signature.copy(newsig, 20, sstart, sstart + 20);
            signature = newsig;
          }
          cb(signature);
        }
        stream.authHostbased(self.config.username,
                             self.config.publicKey,
                             self.config.localHostname,
                             self.config.localUsername,
                             hostbasedCb);
      break;
      case 'agent':
        agentQuery(self.config.agent, function(err, keys) {
          if (err) {
            err.level = 'agent';
            self.emit('error', err);
            agentKeys = undefined;
            return tryNextAuth();
          } else if (keys.length === 0) {
            debug('DEBUG: Agent: No keys stored in agent');
            agentKeys = undefined;
            return tryNextAuth();
          }

          agentKeys = keys;
          agentKeyPos = 0;

          stream.authPK(self.config.username, keys[0]);
          stream.once('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
        });
      break;
      case 'keyboard-interactive':
        stream.authKeyboard(self.config.username);
        stream.on('USERAUTH_INFO_REQUEST', onUSERAUTH_INFO_REQUEST);
      break;
      case 'none':
        stream.authNone(self.config.username);
      break;
    }
  }
  function onUSERAUTH_INFO_REQUEST(name, instructions, lang, prompts) {
    var nprompts = (Array.isArray(prompts) ? prompts.length : 0);
    if (nprompts === 0) {
      debug('DEBUG: Client: Sending automatic USERAUTH_INFO_RESPONSE');
      return stream.authInfoRes();
    }
    // we sent a keyboard-interactive user authentication request and now the
    // server is sending us the prompts we need to present to the user
    self.emit('keyboard-interactive',
              name,
              instructions,
              lang,
              prompts,
              function(answers) {
                stream.authInfoRes(answers);
              });
  }
  function onUSERAUTH_PK_OK() {
    if (curAuth === 'agent') {
      var agentKey = agentKeys[agentKeyPos],
          pubKeyFullType = agentKey.toString('ascii',
                                             4,
                                             4 + agentKey.readUInt32BE(0, true)),
          pubKeyType = pubKeyFullType.substring(4, 7);
      stream.authPK(self.config.username, 
                    agentKey,
                    function(buf, cb) {
        agentQuery(self.config.agent,
                   agentKey,
                   pubKeyType,
                   buf,
                   function(err, signed) {
          if (err) {
            err.level = 'agent';
            self.emit('error', err);
            agentKeys = undefined;
            return tryNextAuth();
          }

          var signature;

          if (signed.toString('ascii', 4, 11) === 'ssh-' + pubKeyType) {
            // skip algoLen + algo + sigLen
            signature = signed.slice(4 + 7 + 4);
          } else
            signature = signed;

          cb(signature);
        });
      });
    } else if (curAuth === 'publickey') {
      stream.authPK(self.config.username,
                    self.config.publicKey,
                    function(buf, cb) {
        var signature = crypto.createSign(self.config.privateKey.type === 'rsa'
                                          ? 'RSA-SHA1'
                                          : 'DSA-SHA1');
        signature.update(buf);
        signature = signature.sign(self.config.privateKey.privateOrig, 'binary');
        signature = new Buffer(signature, 'binary');

        if (self.config.privateKey.type === 'dss' && signature.length > 40) {
          // this is a quick and dirty way to get from DER encoded r and s that
          // OpenSSL gives us, to just the bare values back to back (40 bytes
          // total) like OpenSSH (and possibly others) are expecting
          var newsig = new Buffer(40),
              rlen = signature[3],
              rstart = 4,
              sstart = 4 + 1 + rlen + 1;
          while (signature[rstart] === 0)
            ++rstart;
          while (signature[sstart] === 0)
            ++sstart;
          signature.copy(newsig, 0, rstart, rstart + 20);
          signature.copy(newsig, 20, sstart, sstart + 20);
          signature = newsig;
        }
        cb(signature);
      });
    }
  }
  function onUSERAUTH_FAILURE(authsLeft, partial) {
    stream.removeListener('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
    stream.removeListener('USERAUTH_INFO_REQUEST', onUSERAUTH_INFO_REQUEST);
    if (curAuth === 'agent') {
      debug('DEBUG: Client: Agent key #' + (agentKeyPos + 1) + ' failed');
      if (++agentKeyPos >= agentKeys.length) {
        debug('DEBUG: Agent: No more keys left to try');
        debug('DEBUG: Client: ' + curAuth + ' auth failed');
        agentKeys = undefined;
        tryNextAuth();
      } else {
        debug('DEBUG: Agent: Trying key #' + (agentKeyPos + 1));
        stream.authPK(self.config.username, agentKeys[agentKeyPos]);
        stream.once('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
      }
      return;
    } else
      debug('DEBUG: Client: ' + curAuth + ' auth failed');

    tryNextAuth();
  }
  stream.once('USERAUTH_SUCCESS', function() {
    auths = undefined;
    stream.removeListener('USERAUTH_FAILURE', onUSERAUTH_FAILURE);
    stream.removeListener('USERAUTH_INFO_REQUEST', onUSERAUTH_INFO_REQUEST);
    /*if (self.config.agent && self._agentKeys)
      self._agentKeys = undefined;*/

    // start keepalive mechanism
    resetKA();

    clearTimeout(self._readyTimeout);

    self.emit('ready');
  }).on('USERAUTH_FAILURE', onUSERAUTH_FAILURE);
  // end authentication handling ===============================================

  // handle initial handshake completion
  stream.once('NEWKEYS', function() {
    stream.service('ssh-userauth');
    stream.once('SERVICE_ACCEPT', function(svcName) {
      if (svcName === 'ssh-userauth')
        tryNextAuth();
    });
  });

  // handle incoming requests from server, typically a forwarded TCP or X11
  // connection
  stream.on('CHANNEL_OPEN', function(info) {
    onCHANNEL_OPEN(self, info);
  });

  // handle responses for tcpip-forward and other global requests
  stream.on('REQUEST_SUCCESS', function(data) {
    if (callbacks.length)
      callbacks.shift()(false, data);
  }).on('REQUEST_FAILURE', function() {
    if (callbacks.length)
      callbacks.shift()(true);
  });

  stream.on('GLOBAL_REQUEST', function(name, wantReply, data) {
    // auto-reject all global requests, this can be especially useful if the
    // server is sending us dummy keepalive global requests
    if (wantReply)
      stream.requestFailure();
  });

  if (!cfg.sock) {
    var host = this.config.host,
        forceIPv4 = this.config.forceIPv4,
        forceIPv6 = this.config.forceIPv6;

    debug('DEBUG: Client: Trying '
          + host
          + ' on port '
          + this.config.port
          + ' ...');

    function doConnect() {
      startTimeout();
      self._sock.connect(self.config.port, host);
      self._sock.setNoDelay(true);
      self._sock.setMaxListeners(0);
      self._sock.setTimeout(typeof cfg.timeout === 'number' ? cfg.timeout : 0);
    }

    if ((!forceIPv4 && !forceIPv6) || (forceIPv4 && forceIPv6))
      doConnect();
    else {
      dnsLookup(host, (forceIPv4 ? 4 : 6), function(err, address, family) {
        if (err) {
          var error = new Error('Error while looking up '
                                + (forceIPv4 ? 'IPv4' : 'IPv6')
                                + ' address for host '
                                + host
                                + ': ' + err);
          clearTimeout(self._readyTimeout);
          error.level = 'client-dns';
          self.emit('error', error);
          self.emit('close');
          return;
        }
        host = address;
        doConnect();
      });
    }
  } else {
    startTimeout();
    stream.pipe(sock).pipe(stream);
  }

  function startTimeout() {
    if (self.config.readyTimeout > 0) {
      self._readyTimeout = setTimeout(function() {
        var err = new Error('Timed out while waiting for handshake');
        err.level = 'client-timeout';
        self.emit('error', err);
        sock.destroy();
      }, self.config.readyTimeout);
    }
  }
};

Client.prototype.end = function() {
  if (this._sock
      && this._sock.writable
      && this._sshstream
      && this._sshstream.writable)
    return this._sshstream.disconnect();
  return false;
};

Client.prototype.destroy = function() {
  this._sock && this._sock.destroy();
};

Client.prototype.exec = function(cmd, opts, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  var self = this,
      extraOpts = { allowHalfOpen: (opts.allowHalfOpen !== false) };

  return openChannel(this, 'session', extraOpts, function(err, chan) {
    if (err)
      return cb(err);

    var todo = [];

    function reqCb(err) {
      if (err) {
        chan.close();
        return cb(err);
      }
      if (todo.length)
        todo.shift()();
    }

    if (self.config.allowAgentFwd === true
        || (opts
            && opts.agentForward === true
            && self.config.agent !== undefined)) {
      todo.push(function() {
        reqAgentFwd(chan, reqCb);
      });
    }

    if (typeof opts === 'object') {
      if (typeof opts.env === 'object')
        reqEnv(chan, opts.env);
      if (typeof opts.pty === 'object' || opts.pty === true)
        todo.push(function() { reqPty(chan, opts.pty, reqCb); });
      if (typeof opts.x11 === 'object'
          || opts.x11 === 'number'
          || opts.x11 === true)
        todo.push(function() { reqX11(chan, opts.x11, reqCb); });
    }

    todo.push(function() { reqExec(chan, cmd, opts, cb); });
    todo.shift()();
  });
};

Client.prototype.shell = function(wndopts, opts, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  // start an interactive terminal/shell session
  var self = this;

  if (typeof wndopts === 'function') {
    cb = wndopts;
    wndopts = opts = undefined;
  } else if (typeof opts === 'function') {
    cb = opts;
    opts = undefined;
  }
  if (wndopts && wndopts.x11 !== undefined) {
    opts = wndopts;
    wndopts = undefined;
  }

  return openChannel(this, 'session', function(err, chan) {
    if (err)
      return cb(err);

    var todo = [];

    function reqCb(err) {
      if (err) {
        chan.close();
        return cb(err);
      }
      if (todo.length)
        todo.shift()();
    }

    if (self.config.allowAgentFwd === true
        || (opts
            && opts.agentForward === true
            && self.config.agent !== undefined)) {
      todo.push(function() {
        reqAgentFwd(chan, reqCb);
      });
    }

    if (wndopts !== false)
      todo.push(function() { reqPty(chan, wndopts, reqCb); });

    if (typeof opts === 'object') {
      if (typeof opts.x11 === 'object'
          || opts.x11 === 'number'
          || opts.x11 === true)
        todo.push(function() { reqX11(chan, opts.x11, reqCb); });
    }

    todo.push(function() { reqShell(chan, cb); });
    todo.shift()();
  });
};

Client.prototype.subsys = function(name, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

	return openChannel(this, 'session', function(err, chan) {
		if (err)
			return cb(err);

		reqSubsystem(chan, name, function(err, stream) {
			if (err)
				return cb(err);

			cb(undefined, stream);
		});
	});
};

Client.prototype.sftp = function(cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  var self = this;

  // start an SFTP session
  return openChannel(this, 'session', function(err, chan) {
    if (err)
      return cb(err);

    reqSubsystem(chan, 'sftp', function(err, stream) {
      if (err)
        return cb(err);

      var serverIdentRaw = self._sshstream._state.incoming.identRaw,
          cfg = { debug: self.config.debug },
          sftp = new SFTPStream(cfg, serverIdentRaw);

      function onError(err) {
        sftp.removeListener('ready', onReady);
        stream.removeListener('exit', onExit);
        cb(err);
      }

      function onReady() {
        sftp.removeListener('error', onError);
        stream.removeListener('exit', onExit);
        cb(undefined, new SFTPWrapper(sftp));
      }

      function onExit(code, signal) {
        sftp.removeListener('ready', onReady);
        sftp.removeListener('error', onError);
        var msg;
        if (typeof code === 'number') {
          msg = 'Received exit code '
                + code
                + ' while establishing SFTP session';
        } else {
          msg = 'Received signal '
                + signal
                + ' while establishing SFTP session';
        }
        var err = new Error(msg);
        err.code = code;
        err.signal = signal;
        cb(err);
      }

      sftp.once('error', onError)
          .once('ready', onReady)
          .once('close', function() {
            stream.end();
          });

      // OpenSSH server sends an exit-status if there was a problem spinning up
      // an sftp server child process, so we listen for that here in order to
      // properly raise an error.
      stream.once('exit', onExit);

      sftp.pipe(stream).pipe(sftp);
    });
  });
};

Client.prototype.forwardIn = function(bindAddr, bindPort, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  // send a request for the server to start forwarding TCP connections to us
  // on a particular address and port

  var self = this,
      wantReply = (typeof cb === 'function');

  if (wantReply) {
    this._callbacks.push(function(had_err, data) {
      if (had_err) {
        return cb(had_err !== true
                  ? had_err
                  : new Error('Unable to bind to ' + bindAddr + ':' + bindPort));
      }

      if (bindPort === 0 && data && data.length >= 4)
        bindPort = data.readUInt32BE(0, true);

      self._forwarding[bindAddr + ':' + bindPort] = true;

      cb(undefined, bindPort);
    });
  }

  return this._sshstream.tcpipForward(bindAddr, bindPort, wantReply);
};

Client.prototype.unforwardIn = function(bindAddr, bindPort, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  // send a request to stop forwarding us new connections for a particular
  // address and port

  var self = this,
      wantReply = (typeof cb === 'function');

  if (wantReply) {
    this._callbacks.push(function(had_err) {
      if (had_err) {
        return cb(had_err !== true
                  ? had_err
                  : new Error('Unable to unbind from '
                              + bindAddr + ':' + bindPort));
      }

      delete self._forwarding[bindAddr + ':' + bindPort];

      cb();
    });
  }

  return this._sshstream.cancelTcpipForward(bindAddr, bindPort, wantReply);
};

Client.prototype.forwardOut = function(srcIP, srcPort, dstIP, dstPort, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  // send a request to forward a TCP connection to the server

  var cfg = {
    srcIP: srcIP,
    srcPort: srcPort,
    dstIP: dstIP,
    dstPort: dstPort
  };

  return openChannel(this, 'direct-tcpip', cfg, cb);
};

Client.prototype.openssh_noMoreSessions = function(cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  var wantReply = (typeof cb === 'function');

  if (!this.config.strictVendor
      || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
    if (wantReply) {
      this._callbacks.push(function(had_err) {
        if (had_err) {
          return cb(had_err !== true
                    ? had_err
                    : new Error('Unable to disable future sessions'));
        }

        cb();
      });
    }

    return this._sshstream.openssh_noMoreSessions(wantReply);
  } else if (wantReply) {
    process.nextTick(function() {
      cb(new Error('strictVendor enabled and server is not OpenSSH or compatible version'));
    });
  }

  return true;
};

Client.prototype.openssh_forwardInStreamLocal = function(socketPath, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  var wantReply = (typeof cb === 'function');

  if (!this.config.strictVendor
      || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
    if (wantReply) {
      this._callbacks.push(function(had_err) {
        if (had_err) {
          return cb(had_err !== true
                    ? had_err
                    : new Error('Unable to bind to ' + socketPath));
        }

        cb();
      });
    }

    return this._sshstream.openssh_streamLocalForward(socketPath, wantReply);
  } else if (wantReply) {
    process.nextTick(function() {
      cb(new Error('strictVendor enabled and server is not OpenSSH or compatible version'));
    });
  }

  return true;
};

Client.prototype.openssh_unforwardInStreamLocal = function(socketPath, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  var wantReply = (typeof cb === 'function');

  if (!this.config.strictVendor
      || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
    if (wantReply) {
      this._callbacks.push(function(had_err) {
        if (had_err) {
          return cb(had_err !== true
                    ? had_err
                    : new Error('Unable to unbind on ' + socketPath));
        }

        cb();
      });
    }

    return this._sshstream.openssh_cancelStreamLocalForward(socketPath, wantReply);
  } else if (wantReply) {
    process.nextTick(function() {
      cb(new Error('strictVendor enabled and server is not OpenSSH or compatible version'));
    });
  }

  return true;
};

Client.prototype.openssh_forwardOutStreamLocal = function(socketPath, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  if (!this.config.strictVendor
      || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
    var cfg = { socketPath: socketPath };
    return openChannel(this, 'direct-streamlocal@openssh.com', cfg, cb);
  } else {
    process.nextTick(function() {
      cb(new Error('strictVendor enabled and server is not OpenSSH or compatible version'));
    });
  }

  return true;
};

function openChannel(self, type, opts, cb) {
  // ask the server to open a channel for some purpose
  // (e.g. session (sftp, exec, shell), or forwarding a TCP connection
  var localChan = nextChannel(self),
      initWindow = Channel.MAX_WINDOW,
      maxPacket = Channel.PACKET_SIZE,
      ret = true;

  if (localChan === false)
    return cb(new Error('No free channels available'));

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  self._channels[localChan] = true;

  var sshstream = self._sshstream;
  sshstream.once('CHANNEL_OPEN_CONFIRMATION:' + localChan, onSuccess)
           .once('CHANNEL_OPEN_FAILURE:' + localChan, onFailure)
           .once('CHANNEL_CLOSE:' + localChan, onFailure);

  if (type === 'session')
    ret = sshstream.session(localChan, initWindow, maxPacket);
  else if (type === 'direct-tcpip')
    ret = sshstream.directTcpip(localChan, initWindow, maxPacket, opts);
  else if (type === 'direct-streamlocal@openssh.com') {
    ret = sshstream.openssh_directStreamLocal(localChan,
                                              initWindow,
                                              maxPacket,
                                              opts);
  }

  return ret;

  function onSuccess(info) {
    sshstream.removeListener('CHANNEL_OPEN_FAILURE:' + localChan, onFailure);
    sshstream.removeListener('CHANNEL_CLOSE:' + localChan, onFailure);

    var chaninfo = {
      type: type,
      incoming: {
        id: localChan,
        window: initWindow,
        packetSize: maxPacket,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
    cb(undefined, new Channel(chaninfo, self));
  }

  function onFailure(info) {
    sshstream.removeListener('CHANNEL_OPEN_CONFIRMATION:' + localChan,
                             onSuccess);
    sshstream.removeListener('CHANNEL_OPEN_FAILURE:' + localChan, onFailure);
    sshstream.removeListener('CHANNEL_CLOSE:' + localChan, onFailure);

    delete self._channels[localChan];

    var err;
    if (info instanceof Error)
      err = info;
    else if (typeof info === 'object' && info !== null) {
      err = new Error('(SSH) Channel open failure: ' + info.description);
      err.reason = info.reason;
      err.lang = info.lang;
    } else {
      err = new Error('(SSH) Channel open failure: '
                      + 'server closed channel unexpectedly');
      err.reason = err.lang = '';
    }
    cb(err);
  }
}

function nextChannel(self) {
  // get the next available channel number

  // optimized path
  if (self._curChan < MAX_CHANNEL)
    return ++self._curChan;

  // slower lookup path
  for (var i = 0, channels = self._channels; i < MAX_CHANNEL; ++i)
    if (!channels[i])
      return i;

  return false;
}

function reqX11(chan, screen, cb) {
  // asks server to start sending us X11 connections
  var cfg = {
        single: false,
        protocol: 'MIT-MAGIC-COOKIE-1',
        cookie: crypto.randomBytes(16).toString('hex'),
        screen: (typeof screen === 'number' ? screen : 0)
      };

  if (typeof screen === 'function')
    cb = screen;
  else if (typeof screen === 'object') {
    if (typeof screen.single === 'boolean')
      cfg.single = screen.single;
    if (typeof screen.screen === 'number')
      cfg.screen = screen.screen;
  }

  var wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    wantReply && cb(new Error('Channel is not open'));
    return true;
  }

  if (wantReply) {
    chan._callbacks.push(function(had_err) {
      if (had_err) {
        return cb(had_err !== true
                  ? had_err
                  : new Error('Unable to request X11'));
      }

      chan._hasX11 = true;
      ++chan._client._acceptX11;
      chan.once('close', function() {
        if (chan._client._acceptX11)
          --chan._client._acceptX11;
      });

      cb();
    });
  }

  return chan._client._sshstream.x11Forward(chan.outgoing.id, cfg, wantReply);
}

function reqPty(chan, opts, cb) {
  var rows = 24,
      cols = 80,
      width = 640,
      height = 480,
      term = 'vt100';

  if (typeof opts === 'function')
    cb = opts;
  else if (typeof opts === 'object') {
    if (typeof opts.rows === 'number')
      rows = opts.rows;
    if (typeof opts.cols === 'number')
      cols = opts.cols;
    if (typeof opts.width === 'number')
      width = opts.width;
    if (typeof opts.height === 'number')
      height = opts.height;
    if (typeof opts.term === 'string')
      term = opts.term;
  }

  var wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    wantReply && cb(new Error('Channel is not open'));
    return true;
  }

  if (wantReply) {
    chan._callbacks.push(function(had_err) {
      if (had_err) {
        return cb(had_err !== true
                  ? had_err
                  : new Error('Unable to request a pseudo-terminal'));
      }
      cb();
    });
  }

  return chan._client._sshstream.pty(chan.outgoing.id,
                                     rows,
                                     cols,
                                     height,
                                     width,
                                     term,
                                     null,
                                     wantReply);
}

function reqAgentFwd(chan, cb) {
  var wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    wantReply && cb(new Error('Channel is not open'));
    return true;
  } else if (chan._client._agentFwdEnabled) {
    wantReply && cb(false);
    return true;
  }

  chan._client._agentFwdEnabled = true;

  chan._callbacks.push(function(had_err) {
    if (had_err) {
      chan._client._agentFwdEnabled = false;
      wantReply && cb(had_err !== true
                      ? had_err
                      : new Error('Unable to request agent forwarding'));
      return;
    }

    wantReply && cb();
  });

  return chan._client._sshstream.openssh_agentForward(chan.outgoing.id, true);
}

function reqShell(chan, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return true;
  }
  chan._callbacks.push(function(had_err) {
    if (had_err) {
      return cb(had_err !== true
                ? had_err
                : new Error('Unable to open shell'));
    }
    chan.subtype = 'shell';
    cb(undefined, chan);
  });

  return chan._client._sshstream.shell(chan.outgoing.id, true);
}

function reqExec(chan, cmd, opts, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return true;
  }
  chan._callbacks.push(function(had_err) {
    if (had_err) {
      return cb(had_err !== true
                ? had_err
                : new Error('Unable to exec'));
    }
    chan.subtype = 'exec';
    chan.allowHalfOpen = (opts.allowHalfOpen !== false);
    cb(undefined, chan);
  });

  return chan._client._sshstream.exec(chan.outgoing.id, cmd, true);
}

function reqEnv(chan, env) {
  if (chan.outgoing.state !== 'open')
    return true;
  var ret = true,
      keys = Object.keys(env || {}),
      key,
      val;

  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    val = env[key];
    ret = chan._client._sshstream.env(chan.outgoing.id, key, val, false);
  }

  return ret;
}

function reqSubsystem(chan, name, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return true;
  }
  chan._callbacks.push(function(had_err) {
    if (had_err) {
      return cb(had_err !== true
                ? had_err
                : new Error('Unable to start subsystem: ' + name));
    }
    chan.subtype = 'subsystem';
    cb(undefined, chan);
  });

  return chan._client._sshstream.subsystem(chan.outgoing.id, name, true);
}

function onCHANNEL_OPEN(self, info) {
  // the server is trying to open a channel with us, this is usually when
  // we asked the server to forward us connections on some port and now they
  // are asking us to accept/deny an incoming connection on their side

  var localChan = false,
      reason;

  function accept() {
    var chaninfo = {
      type: info.type,
      incoming: {
        id: localChan,
        window: Channel.MAX_WINDOW,
        packetSize: Channel.PACKET_SIZE,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
    var stream = new Channel(chaninfo, self);

    self._sshstream.channelOpenConfirm(info.sender,
                                       localChan,
                                       Channel.MAX_WINDOW,
                                       Channel.PACKET_SIZE);
    return stream;
  }
  function reject() {
    if (reason === undefined) {
      if (localChan === false)
        reason = consts.CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE;
      else
        reason = consts.CHANNEL_OPEN_FAILURE.CONNECT_FAILED;
    }

    self._sshstream.channelOpenFail(info.sender, reason, '', '');
  }

  if (info.type === 'forwarded-tcpip'
      || info.type === 'x11'
      || info.type === 'auth-agent@openssh.com') {
    // check for conditions for automatic rejection
    var rejectConn = ((info.type === 'forwarded-tcpip'
                       && !self._forwarding[info.data.destIP
                                            + ':'
                                            + info.data.destPort])
                      || (info.type === 'x11' && self._acceptX11 === 0)
                      || (info.type === 'auth-agent@openssh.com'
                          && !self._agentFwdEnabled));
    if (!rejectConn) {
      localChan = nextChannel(self);

      if (localChan === false) {
        self.config.debug('DEBUG: Client: Automatic rejection of incoming channel open: no channels available');
        rejectConn = true;
      } else
        self._channels[localChan] = true;
    } else {
      reason = consts.CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
      self.config.debug('DEBUG: Client: Automatic rejection of incoming channel open: unexpected channel open for: '
                        + info.type);
    }

    // TODO: automatic rejection after some timeout?

    if (rejectConn)
      reject();

    if (localChan !== false) {
      if (info.type === 'forwarded-tcpip')
        self.emit('tcp connection', info.data, accept, reject);
      else if (info.type === 'x11')
        self.emit('x11', info.data, accept, reject);
      else
        agentQuery(self.config.agent, accept, reject);
    }
  } else {
    // automatically reject any unsupported channel open requests
    self.config.debug('DEBUG: Client: Automatic rejection of incoming channel open: unsupported type: '
                      + info.type);
    reason = consts.CHANNEL_OPEN_FAILURE.UNKNOWN_CHANNEL_TYPE;
    reject();
  }
}

Client.Client = Client;
Client.Server = require('./server');
// pass some useful utilities on to end user (e.g. parseKey(), genPublicKey())
Client.utils = ssh2_streams.utils;
// expose useful SFTPStream constants for sftp server usage
Client.SFTP_STATUS_CODE = SFTPStream.STATUS_CODE;
Client.SFTP_OPEN_MODE = SFTPStream.OPEN_MODE;

module.exports = Client; // backwards compatibility

},{"./Channel":333,"./SFTPWrapper":334,"./agent":335,"./server":338,"crypto":undefined,"dns":undefined,"events":undefined,"net":undefined,"ssh2-streams":325,"util":undefined}],337:[function(require,module,exports){
var spliceOne = require('./utils').spliceOne;

function Manager(interval, streamInterval, kaCountMax) {
  var streams = this._streams = [];
  this._timer = undefined;
  this._timerInterval = interval;
  this._timerfn = function() {
    var now = Date.now();
    for (var i = 0, len = streams.length, s, last; i < len; ++i) {
      s = streams[i];
      last = s._kalast;
      if (last && (now - last) >= streamInterval) {
        if (++s._kacnt > kaCountMax) {
          var err = new Error('Keepalive timeout');
          err.level = 'client-timeout';
          s.emit('error', err);
          s.disconnect();
          spliceOne(streams, i);
          --i;
          len = streams.length;
        } else {
          s._kalast = now;
          // XXX: if the server ever starts sending real global requests to the
          //      client, we will need to add a dummy callback here to keep the
          //      correct reply order
          s.ping();
        }
      }
    }
  };
}

Manager.prototype.start = function() {
  if (this._timer)
    this.stop();
  this._timer = setInterval(this._timerfn, this._timerInterval);
};

Manager.prototype.stop = function() {
  if (this._timer) {
    clearInterval(this._timer);
    this._timer = undefined;
  }
};

Manager.prototype.add = function(stream) {
  var streams = this._streams,
      self = this;

  stream.once('end', function() {
    self.remove(stream);
  }).on('packet', resetKA);

  streams[streams.length] = stream;

  resetKA();

  if (!this._timer)
    this.start();

  function resetKA() {
    stream._kalast = Date.now();
    stream._kacnt = 0;
  }
};

Manager.prototype.remove = function(stream) {
  var streams = this._streams,
      index = streams.indexOf(stream);
  if (~index)
    spliceOne(streams, index);
  if (!streams.length)
    this.stop();
};

module.exports = Manager;

},{"./utils":339}],338:[function(require,module,exports){
var net = require('net'),
    EventEmitter = require('events').EventEmitter,
    listenerCount = EventEmitter.listenerCount,
    inherits = require('util').inherits;

var ssh2_streams = require('ssh2-streams'),
    SSH2Stream = ssh2_streams.SSH2Stream,
    SFTPStream = ssh2_streams.SFTPStream,
    consts = ssh2_streams.constants,
    DISCONNECT_REASON = consts.DISCONNECT_REASON,
    CHANNEL_OPEN_FAILURE = consts.CHANNEL_OPEN_FAILURE;

var Channel = require('./Channel'),
    KeepaliveManager = require('./keepalivemgr');

var MAX_CHANNEL = Math.pow(2, 32) - 1,
    MAX_PENDING_AUTHS = 10;

var kaMgr;

function Server(cfg, listener) {
  if (!(this instanceof Server))
    return new Server(cfg, listener);

  if (!kaMgr
      && Server.KEEPALIVE_INTERVAL > 0
      && Server.KEEPALIVE_CLIENT_INTERVAL > 0
      && Server.KEEPALIVE_CLIENT_COUNT_MAX >= 0) {
    kaMgr = new KeepaliveManager(Server.KEEPALIVE_INTERVAL,
                                 Server.KEEPALIVE_CLIENT_INTERVAL,
                                 Server.KEEPALIVE_CLIENT_COUNT_MAX);
  }

  var self = this;

  EventEmitter.call(this);

  if (typeof listener === 'function')
    self.on('connection', listener);

  var streamcfg = {};
  for (var i = 0, keys = Object.keys(cfg), len = keys.length; i < len; ++i)
    streamcfg[keys[i]] = cfg[keys[i]];

  streamcfg.server = true;

  if (typeof streamcfg.debug === 'function') {
    var oldDebug = streamcfg.debug,
        cfgKeys = Object.keys(streamcfg);
  }

  this._srv = new net.Server(function(socket) {
    if (self._connections >= self.maxConnections) {
      socket.destroy();
      return;
    }
    ++self._connections;
    socket.once('close', function(had_err) {
      --self._connections;

      // since joyent/node#993bb93e0a, we have to "read past EOF" in order to
      // get an `end` event on streams. thankfully adding this does not
      // negatively affect node versions pre-joyent/node#993bb93e0a.
      sshstream.read();
    }).on('error', function(err) {
      sshstream.reset();
      sshstream.emit('error', err);
    });

    var conncfg = streamcfg;

    // prepend debug output with a unique identifier in case there are multiple
    // clients connected at the same time
    if (oldDebug) {
      conncfg = {};
      for (var i = 0, key; i < cfgKeys.length; ++i) {
        key = cfgKeys[i];
        conncfg[key] = streamcfg[key];
      }
      var debugPrefix = '[' + process.hrtime().join('.') + '] ';
      conncfg.debug = function(msg) {
        oldDebug(debugPrefix + msg);
      };
    }

    var sshstream = new SSH2Stream(conncfg),
        client = new Client(sshstream, socket);

    socket.pipe(sshstream).pipe(socket);

    // silence pre-header errors
    function onClientPreHeaderError(err) {}
    client.on('error', onClientPreHeaderError);

    sshstream.once('header', function(header) {
      if (sshstream._readableState.ended) {
        // already disconnected internally in SSH2Stream due to incompatible
        // protocol version
        return;
      } else if (!listenerCount(self, 'connection')) {
        // auto reject
        return sshstream.disconnect(DISCONNECT_REASON.BY_APPLICATION);
      }

      client.removeListener('error', onClientPreHeaderError);

      self.emit('connection',
                client,
                { ip: socket.remoteAddress, header: header });
    });
  }).on('error', function(err) {
    self.emit('error', err);
  }).on('listening', function() {
    self.emit('listening');
  }).on('close', function() {
    self.emit('close');
  });
  this._connections = 0;
  this.maxConnections = Infinity;
}
inherits(Server, EventEmitter);

Server.prototype.listen = function() {
  this._srv.listen.apply(this._srv, arguments);
  return this;
};

Server.prototype.address = function() {
  return this._srv.address();
};

Server.prototype.getConnections = function(cb) {
  this._srv.getConnections(cb);
};

Server.prototype.close = function(cb) {
  this._srv.close(cb);
  return this;
};

Server.prototype.ref = function() {
  this._srv.ref();
};

Server.prototype.unref = function() {
  this._srv.unref();
};


function Client(stream, socket) {
  EventEmitter.call(this);

  var self = this;

  this._sshstream = stream;
  var channels = this._channels = {};
  this._curChan = -1;
  this._sock = socket;
  this.noMoreSessions = false;
  this.authenticated = false;

  stream.on('end', function() {
    self.emit('end');
  }).on('close', function(hasErr) {
    self.emit('close', hasErr);
  }).on('error', function(err) {
    self.emit('error', err);
  }).on('drain', function() {
    self.emit('drain');
  }).on('continue', function() {
    self.emit('continue');
  });

  var exchanges = 0,
      acceptedAuthSvc = false,
      pendingAuths = [],
      authCtx;

  // begin service/auth-related ================================================
  stream.on('SERVICE_REQUEST', function(service) {
    if (exchanges === 0
        || acceptedAuthSvc
        || self.authenticated
        || service !== 'ssh-userauth')
      return stream.disconnect(DISCONNECT_REASON.SERVICE_NOT_AVAILABLE);

    acceptedAuthSvc = true;
    stream.serviceAccept(service);
  }).on('USERAUTH_REQUEST', onUSERAUTH_REQUEST);
  function onUSERAUTH_REQUEST(username, service, method, methodData) {
    if (exchanges === 0
        || (authCtx
            && (authCtx.username !== username || authCtx.service !== service))
          // TODO: support hostbased auth
        || (method !== 'password'
            && method !== 'publickey'
            && method !== 'hostbased'
            && method !== 'keyboard-interactive'
            && method !== 'none')
        || pendingAuths.length === MAX_PENDING_AUTHS)
      return stream.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
    else if (service !== 'ssh-connection')
      return stream.disconnect(DISCONNECT_REASON.SERVICE_NOT_AVAILABLE);

    // XXX: this really shouldn't be reaching into private state ...
    stream._state.authMethod = method;

    var ctx;
    if (method === 'keyboard-interactive') {
      ctx = new KeyboardAuthContext(stream, username, service, method,
                                    methodData, onAuthDecide);
    } else if (method === 'publickey') {
      ctx = new PKAuthContext(stream, username, service, method, methodData,
                              onAuthDecide);
    } else if (method === 'hostbased') {
      ctx = new HostbasedAuthContext(stream, username, service, method,
                                     methodData, onAuthDecide);
    } else if (method === 'password') {
      ctx = new PwdAuthContext(stream, username, service, method, methodData,
                               onAuthDecide);
    } else if (method === 'none')
      ctx = new AuthContext(stream, username, service, method, onAuthDecide);

    if (authCtx) {
      if (!authCtx._initialResponse)
        return pendingAuths.push(ctx);
      else if (authCtx._multistep && !this._finalResponse) {
        // RFC 4252 says to silently abort the current auth request if a new
        // auth request comes in before the final response from an auth method
        // that requires additional request/response exchanges -- this means
        // keyboard-interactive for now ...
        authCtx._cleanup && authCtx._cleanup();
        authCtx.emit('abort');
      }
    }

    authCtx = ctx;

    if (listenerCount(self, 'authentication'))
      self.emit('authentication', authCtx);
    else
      authCtx.reject();
  }
  function onAuthDecide(ctx, allowed, methodsLeft, isPartial) {
    if (authCtx === ctx && !self.authenticated) {
      if (allowed) {
        stream.removeListener('USERAUTH_REQUEST', onUSERAUTH_REQUEST);
        authCtx = undefined;
        self.authenticated = true;
        stream.authSuccess();
        pendingAuths = [];
        self.emit('ready');
      } else {
        stream.authFailure(methodsLeft, isPartial);
        if (pendingAuths.length) {
          authCtx = pendingAuths.pop();
          if (listenerCount(self, 'authentication'))
            self.emit('authentication', authCtx);
          else
            authCtx.reject();
        }
      }
    }
  }
  // end service/auth-related ==================================================

  stream.on('GLOBAL_REQUEST', function(name, wantReply, data) {
    if ((name === 'tcpip-forward'
         || name === 'cancel-tcpip-forward'
         || name === 'no-more-sessions@openssh.com'
         || name === 'streamlocal-forward@openssh.com'
         || name === 'cancel-streamlocal-forward@openssh.com')
        && listenerCount(self, 'request')
        && self.authenticated) {
      var accept,
          reject;

      if (wantReply) {
        var replied = false;
        accept = function(chosenPort) {
          if (replied)
            return;
          replied = true;
          var bufPort;
          if (name === 'tcpip-forward'
              && data.bindPort === 0
              && typeof chosenPort === 'number') {
            bufPort = new Buffer(4);
            bufPort.writeUInt32BE(chosenPort, 0, true);
          }
          return stream.requestSuccess(bufPort);
        };
        reject = function() {
          if (replied)
            return;
          replied = true;
          return stream.requestFailure();
        };
      }

      if (name === 'no-more-sessions@openssh.com') {
        self.noMoreSessions = true;
        accept && accept();
        return;
      }

      self.emit('request', accept, reject, name, data);
    } else if (wantReply)
      stream.requestFailure();
  });

  stream.on('CHANNEL_OPEN', function(info) {
    // do early reject in some cases to prevent wasteful channel allocation
    if ((info.type === 'session' && self.noMoreSessions)
        || !self.authenticated) {
      var reasonCode = CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
      return stream.channelOpenFail(info.sender, reasonCode);
    }

    var localChan = nextChannel(self),
        accept,
        reject,
        replied = false;
    if (localChan === false) {
      // auto-reject due to no channels available
      return stream.channelOpenFail(info.sender,
                                    CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE);
    }

    // be optimistic, reserve channel to prevent another request from trying to
    // take the same channel
    channels[localChan] = true;

    reject = function() {
      if (replied)
        return;

      replied = true;

      delete channels[localChan];

      var reasonCode = CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
      return stream.channelOpenFail(info.sender, reasonCode);
    };

    switch (info.type) {
      case 'session':
        if (listenerCount(self, 'session')) {
          accept = function() {
            if (replied)
              return;

            replied = true;

            stream.channelOpenConfirm(info.sender,
                                      localChan,
                                      Channel.MAX_WINDOW,
                                      Channel.PACKET_SIZE);

            return new Session(self, info, localChan);
          };

          self.emit('session', accept, reject);
        } else
          reject();
      break;
      case 'direct-tcpip':
        if (listenerCount(self, 'tcpip')) {
          accept = function() {
            if (replied)
              return;

            replied = true;

            stream.channelOpenConfirm(info.sender,
                                      localChan,
                                      Channel.MAX_WINDOW,
                                      Channel.PACKET_SIZE);

            var chaninfo = {
              type: undefined,
              incoming: {
                id: localChan,
                window: Channel.MAX_WINDOW,
                packetSize: Channel.PACKET_SIZE,
                state: 'open'
              },
              outgoing: {
                id: info.sender,
                window: info.window,
                packetSize: info.packetSize,
                state: 'open'
              }
            };

            return new Channel(chaninfo, self);
          };

          self.emit('tcpip', accept, reject, info.data);
        } else
          reject();
      break;
      case 'direct-streamlocal@openssh.com':
        if (listenerCount(self, 'openssh.streamlocal')) {
          accept = function() {
            if (replied)
              return;

            replied = true;

            stream.channelOpenConfirm(info.sender,
                                      localChan,
                                      Channel.MAX_WINDOW,
                                      Channel.PACKET_SIZE);

            var chaninfo = {
              type: undefined,
              incoming: {
                id: localChan,
                window: Channel.MAX_WINDOW,
                packetSize: Channel.PACKET_SIZE,
                state: 'open'
              },
              outgoing: {
                id: info.sender,
                window: info.window,
                packetSize: info.packetSize,
                state: 'open'
              }
            };

            return new Channel(chaninfo, self);
          };

          self.emit('openssh.streamlocal', accept, reject, info.data);
        } else
          reject();
      break;
      default:
        // auto-reject unsupported channel types
        reject();
    }
  });

  stream.on('NEWKEYS', function() {
    if (++exchanges > 1)
      self.emit('rekey');
  });

  if (kaMgr) {
    this.once('ready', function() {
      kaMgr.add(stream);
    });
  }
}
inherits(Client, EventEmitter);

Client.prototype.end = function() {
  return this._sshstream.disconnect(DISCONNECT_REASON.BY_APPLICATION);
};

Client.prototype.x11 = function(originAddr, originPort, cb) {
  var opts = {
    originAddr: originAddr,
    originPort: originPort
  };
  return openChannel(this, 'x11', opts, cb);
};

Client.prototype.forwardOut = function(boundAddr, boundPort, remoteAddr,
                                       remotePort, cb) {
  var opts = {
    boundAddr: boundAddr,
    boundPort: boundPort,
    remoteAddr: remoteAddr,
    remotePort: remotePort
  };
  return openChannel(this, 'forwarded-tcpip', opts, cb);
};

Client.prototype.openssh_forwardOutStreamLocal = function(socketPath, cb) {
  var opts = {
    socketPath: socketPath
  };
  return openChannel(this, 'forwarded-streamlocal@openssh.com', opts, cb);
};

Client.prototype.rekey = function(cb) {
  var stream = this._sshstream,
      ret = true,
      error;

  try {
    ret = stream.rekey();
  } catch (ex) {
    error = ex;
  }

  // TODO: re-throw error if no callback?

  if (typeof cb === 'function') {
    if (error) {
      process.nextTick(function() {
        cb(error);
      });
    } else
      this.once('rekey', cb);
  }

  return ret;
};

function Session(client, info, localChan) {
  this.subtype = undefined;

  var ending = false,
      self = this,
      outgoingId = info.sender,
      channel;

  var chaninfo = {
    type: 'session',
    incoming: {
      id: localChan,
      window: Channel.MAX_WINDOW,
      packetSize: Channel.PACKET_SIZE,
      state: 'open'
    },
    outgoing: {
      id: info.sender,
      window: info.window,
      packetSize: info.packetSize,
      state: 'open'
    }
  };

  function onREQUEST(info) {
    var replied = false,
        accept,
        reject;

    if (info.wantReply) {
      // "real session" requests will have custom accept behaviors
      if (info.request !== 'shell'
          && info.request !== 'exec'
          && info.request !== 'subsystem') {
        accept = function() {
          if (replied || ending || channel)
            return;

          replied = true;

          return client._sshstream.channelSuccess(outgoingId);
        };
      }

      reject = function() {
        if (replied || ending || channel)
          return;

        replied = true;

        return client._sshstream.channelFailure(outgoingId);
      };
    }

    if (ending) {
      reject && reject();
      return;
    }

    switch (info.request) {
      // "pre-real session start" requests
      case 'env':
        if (listenerCount(self, 'env')) {
          self.emit('env', accept, reject, {
            key: info.key,
            val: info.val
          });
        } else
          reject && reject();
      break;
      case 'pty-req':
        if (listenerCount(self, 'pty')) {
          self.emit('pty', accept, reject, {
            cols: info.cols,
            rows: info.rows,
            width: info.width,
            height: info.height,
            term: info.term,
            modes: info.modes,
          });
        } else
          reject && reject();
      break;
      case 'window-change':
        if (listenerCount(self, 'window-change')) {
          self.emit('window-change', accept, reject, {
            cols: info.cols,
            rows: info.rows,
            width: info.width,
            height: info.height
          });
        } else
          reject && reject();
      break;
      case 'x11-req':
        if (listenerCount(self, 'x11')) {
          self.emit('x11', accept, reject, {
            single: info.single,
            protocol: info.protocol,
            cookie: info.cookie,
            screen: info.screen
          });
        } else
          reject && reject();
      break;
      // "post-real session start" requests
      case 'signal':
        if (listenerCount(self, 'signal')) {
          self.emit('signal', accept, reject, {
            name: info.signal
          });
        } else
          reject && reject();
      break;
      // XXX: is `auth-agent-req@openssh.com` really "post-real session start"?
      case 'auth-agent-req@openssh.com':
        if (listenerCount(self, 'auth-agent'))
          self.emit('auth-agent', accept, reject);
        else
          reject && reject();
      break;
      // "real session start" requests
      case 'shell':
        if (listenerCount(self, 'shell')) {
          accept = function() {
            if (replied || ending || channel)
              return;

            replied = true;

            if (info.wantReply)
              client._sshstream.channelSuccess(outgoingId);

            channel = new Channel(chaninfo, client, { server: true });

            channel.subtype = self.subtype = info.request;

            return channel;
          };

          self.emit('shell', accept, reject);
        } else
          reject && reject();
      break;
      case 'exec':
        if (listenerCount(self, 'exec')) {
          accept = function() {
            if (replied || ending || channel)
              return;

            replied = true;

            if (info.wantReply)
              client._sshstream.channelSuccess(outgoingId);

            channel = new Channel(chaninfo, client, { server: true });

            channel.subtype = self.subtype = info.request;

            return channel;
          };

          self.emit('exec', accept, reject, {
            command: info.command
          });
        } else
          reject && reject();
      break;
      case 'subsystem':
        accept = function() {
          if (replied || ending || channel)
            return;

          replied = true;

          if (info.wantReply)
            client._sshstream.channelSuccess(outgoingId);

          channel = new Channel(chaninfo, client, { server: true });

          channel.subtype = self.subtype = (info.request + ':' + info.subsystem);

          if (info.subsystem === 'sftp') {
            var sftp = new SFTPStream({
              server: true,
              debug: client._sshstream.debug
            });
            channel.pipe(sftp).pipe(channel);

            return sftp;
          } else
            return channel;
        };

        if (info.subsystem === 'sftp' && listenerCount(self, 'sftp'))
          self.emit('sftp', accept, reject);
        else if (info.subsystem !== 'sftp' && listenerCount(self, 'subsystem')) {
          self.emit('subsystem', accept, reject, {
            name: info.subsystem
          });
        } else
          reject && reject();
      break;
      default:
        reject && reject();
    }
  }
  function onEOF() {
    ending = true;
    self.emit('eof');
    self.emit('end');
  }
  function onCLOSE() {
    ending = true;
    self.emit('close');
  }
  client._sshstream
        .on('CHANNEL_REQUEST:' + localChan, onREQUEST)
        .once('CHANNEL_EOF:' + localChan, onEOF)
        .once('CHANNEL_CLOSE:' + localChan, onCLOSE);
}
inherits(Session, EventEmitter);


function AuthContext(stream, username, service, method, cb) {
  EventEmitter.call(this);

  var self = this;

  this.username = this.user = username;
  this.service = service;
  this.method = method;
  this._initialResponse = false;
  this._finalResponse = false;
  this._multistep = false;
  this._cbfinal = function(allowed, methodsLeft, isPartial) {
    if (!self._finalResponse) {
      self._finalResponse = true;
      cb(self, allowed, methodsLeft, isPartial);
    }
  };
  this._stream = stream;
}
inherits(AuthContext, EventEmitter);
AuthContext.prototype.accept = function() {
  this._cleanup && this._cleanup();
  this._initialResponse = true;
  this._cbfinal(true);
};
AuthContext.prototype.reject = function(methodsLeft, isPartial) {
  this._cleanup && this._cleanup();
  this._initialResponse = true;
  this._cbfinal(false, methodsLeft, isPartial);
};

var RE_KBINT_SUBMETHODS = /[ \t\r\n]*,[ \t\r\n]*/g;
function KeyboardAuthContext(stream, username, service, method, submethods, cb) {
  AuthContext.call(this, stream, username, service, method, cb);
  this._multistep = true;

  var self = this;

  this._cb = undefined;
  this._onInfoResponse = function(responses) {
    if (self._cb) {
      var callback = self._cb;
      self._cb = undefined;
      callback(responses);
    }
  };
  this.submethods = submethods.split(RE_KBINT_SUBMETHODS);
  this.on('abort', function() {
    self._cb && self._cb(new Error('Authentication request aborted'));
  });
}
inherits(KeyboardAuthContext, AuthContext);
KeyboardAuthContext.prototype._cleanup = function() {
  this._stream.removeListener('USERAUTH_INFO_RESPONSE', this._onInfoResponse);
};
KeyboardAuthContext.prototype.prompt = function(prompts, title, instructions,
                                                cb) {
  if (!Array.isArray(prompts))
    prompts = [ prompts ];

  if (typeof title === 'function') {
    cb = title;
    title = instructions = undefined;
  } else if (typeof instructions === 'function') {
    cb = instructions;
    instructions = undefined;
  }

  for (var i = 0; i < prompts.length; ++i) {
    if (typeof prompts[i] === 'string') {
      prompts[i] = {
        prompt: prompts[i],
        echo: true
      };
    }
  }

  this._cb = cb;
  this._initialResponse = true;
  this._stream.once('USERAUTH_INFO_RESPONSE', this._onInfoResponse);

  return this._stream.authInfoReq(title, instructions, prompts);
};

function PKAuthContext(stream, username, service, method, pkInfo, cb) {
  AuthContext.call(this, stream, username, service, method, cb);

  this.key = { algo: pkInfo.keyAlgo, data: pkInfo.key };
  this.signature = pkInfo.signature;
  if (this.signature)
    this.sigAlgo = (pkInfo.keyAlgo === 'ssh-rsa' ? 'RSA-SHA1' : 'DSA-SHA1');
  else
    this.sigAlgo = undefined;
  this.blob = pkInfo.blob;
}
inherits(PKAuthContext, AuthContext);
PKAuthContext.prototype.accept = function() {
  if (!this.signature) {
    this._initialResponse = true;
    this._stream.authPKOK(this.key.algo, this.key.data);
  } else
    AuthContext.prototype.accept.call(this);
};

function HostbasedAuthContext(stream, username, service, method, pkInfo, cb) {
  AuthContext.call(this, stream, username, service, method, cb);

  this.key = { algo: pkInfo.keyAlgo, data: pkInfo.key };
  this.signature = pkInfo.signature;
  if (this.signature)
    this.sigAlgo = (pkInfo.keyAlgo === 'ssh-rsa' ? 'RSA-SHA1' : 'DSA-SHA1');
  else
    this.sigAlgo = undefined;
  this.blob = pkInfo.blob;
  this.localHostname = pkInfo.localHostname;
  this.localUsername = pkInfo.localUsername;
}
inherits(HostbasedAuthContext, AuthContext);

function PwdAuthContext(stream, username, service, method, password, cb) {
  AuthContext.call(this, stream, username, service, method, cb);

  this.password = password;
}
inherits(PwdAuthContext, AuthContext);


function openChannel(self, type, opts, cb) {
  // ask the client to open a channel for some purpose
  // (e.g. a forwarded TCP connection)
  var localChan = nextChannel(self),
      initWindow = Channel.MAX_WINDOW,
      maxPacket = Channel.PACKET_SIZE,
      ret = true;

  if (localChan === false)
    return cb(new Error('No free channels available'));

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  self._channels[localChan] = true;

  var sshstream = self._sshstream;
  sshstream.once('CHANNEL_OPEN_CONFIRMATION:' + localChan, function(info) {
    sshstream.removeAllListeners('CHANNEL_OPEN_FAILURE:' + localChan);

    var chaninfo = {
      type: type,
      incoming: {
        id: localChan,
        window: initWindow,
        packetSize: maxPacket,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
    cb(undefined, new Channel(chaninfo, self, { server: true }));
  }).once('CHANNEL_OPEN_FAILURE:' + localChan, function(info) {
    sshstream.removeAllListeners('CHANNEL_OPEN_CONFIRMATION:' + localChan);

    delete self._channels[localChan];

    var err = new Error('(SSH) Channel open failure: ' + info.description);
    err.reason = info.reason;
    err.lang = info.lang;
    cb(err);
  });

  if (type === 'forwarded-tcpip')
    ret = sshstream.forwardedTcpip(localChan, initWindow, maxPacket, opts);
  else if (type === 'x11')
    ret = sshstream.x11(localChan, initWindow, maxPacket, opts);
  else if (type === 'forwarded-streamlocal@openssh.com') {
    ret = sshstream.openssh_forwardedStreamLocal(localChan,
                                                 initWindow,
                                                 maxPacket,
                                                 opts);
  }

  return ret;
}

function nextChannel(self) {
  // get the next available channel number

  // fast path
  if (self._curChan < MAX_CHANNEL)
    return ++self._curChan;

  // slower lookup path
  for (var i = 0, channels = self._channels; i < MAX_CHANNEL; ++i)
    if (!channels[i])
      return i;

  return false;
}


Server.createServer = function(cfg, listener) {
  return new Server(cfg, listener);
};
Server.KEEPALIVE_INTERVAL = 1000;
Server.KEEPALIVE_CLIENT_INTERVAL = 15000;
Server.KEEPALIVE_CLIENT_COUNT_MAX = 3;

module.exports = Server;

},{"./Channel":333,"./keepalivemgr":337,"events":undefined,"net":undefined,"ssh2-streams":325,"util":undefined}],339:[function(require,module,exports){
exports.spliceOne = function(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
};

},{}],340:[function(require,module,exports){
/*
  Based heavily on the Streaming Boyer-Moore-Horspool C++ implementation
  by Hongli Lai at: https://github.com/FooBarWidget/boyer-moore-horspool
*/
var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits;

function jsmemcmp(buf1, pos1, buf2, pos2, num) {
  for (var i = 0; i < num; ++i, ++pos1, ++pos2)
    if (buf1[pos1] !== buf2[pos2])
      return false;
  return true;
}

function SBMH(needle) {
  if (typeof needle === 'string')
    needle = new Buffer(needle);
  var i, j, needle_len = needle.length;

  this.maxMatches = Infinity;
  this.matches = 0;

  this._occ = new Array(256);
  this._lookbehind_size = 0;
  this._needle = needle;
  this._bufpos = 0;

  this._lookbehind = new Buffer(needle_len);

  // Initialize occurrence table.
  for (j = 0; j < 256; ++j)
    this._occ[j] = needle_len;

  // Populate occurrence table with analysis of the needle,
  // ignoring last letter.
  if (needle_len >= 1) {
    for (i = 0; i < needle_len - 1; ++i)
      this._occ[needle[i]] = needle_len - 1 - i;
  }
}
inherits(SBMH, EventEmitter);

SBMH.prototype.reset = function() {
  this._lookbehind_size = 0;
  this.matches = 0;
  this._bufpos = 0;
};

SBMH.prototype.push = function(chunk, pos) {
  var r, chlen;
  if (!Buffer.isBuffer(chunk))
    chunk = new Buffer(chunk, 'binary');
  chlen = chunk.length;
  this._bufpos = pos || 0;
  while (r !== chlen && this.matches < this.maxMatches)
    r = this._sbmh_feed(chunk);
  return r;
};

SBMH.prototype._sbmh_feed = function(data) {
  var len = data.length, needle = this._needle, needle_len = needle.length;

  // Positive: points to a position in `data`
  //           pos == 3 points to data[3]
  // Negative: points to a position in the lookbehind buffer
  //           pos == -2 points to lookbehind[lookbehind_size - 2]
  var pos = -this._lookbehind_size,
      last_needle_char = needle[needle_len - 1],
      occ = this._occ,
      lookbehind = this._lookbehind;

  if (pos < 0) {
    // Lookbehind buffer is not empty. Perform Boyer-Moore-Horspool
    // search with character lookup code that considers both the
    // lookbehind buffer and the current round's haystack data.
    //
    // Loop until
    //   there is a match.
    // or until
    //   we've moved past the position that requires the
    //   lookbehind buffer. In this case we switch to the
    //   optimized loop.
    // or until
    //   the character to look at lies outside the haystack.
    while (pos < 0 && pos <= len - needle_len) {
       var ch = this._sbmh_lookup_char(data, pos + needle_len - 1);

      if (ch === last_needle_char
          && this._sbmh_memcmp(data, pos, needle_len - 1)) {
        this._lookbehind_size = 0;
        ++this.matches;
        if (pos > -this._lookbehind_size)
          this.emit('info', true, lookbehind, 0, this._lookbehind_size + pos);
        else
          this.emit('info', true);

        this._bufpos = pos + needle_len;
        return pos + needle_len;
      } else
        pos += occ[ch];
    }

    // No match.

    if (pos < 0) {
      // There's too few data for Boyer-Moore-Horspool to run,
      // so let's use a different algorithm to skip as much as
      // we can.
      // Forward pos until
      //   the trailing part of lookbehind + data
      //   looks like the beginning of the needle
      // or until
      //   pos == 0
      while (pos < 0 && !this._sbmh_memcmp(data, pos, len - pos))
        pos++;
    }

    if (pos >= 0) {
      // Discard lookbehind buffer.
      this.emit('info', false, lookbehind, 0, this._lookbehind_size);
      this._lookbehind_size = 0;
    } else {
      // Cut off part of the lookbehind buffer that has
      // been processed and append the entire haystack
      // into it.
      var bytesToCutOff = this._lookbehind_size + pos;

      if (bytesToCutOff > 0) {
        // The cut off data is guaranteed not to contain the needle.
        this.emit('info', false, lookbehind, 0, bytesToCutOff);
      }

      lookbehind.copy(lookbehind, 0, bytesToCutOff,
                      this._lookbehind_size - bytesToCutOff);
      this._lookbehind_size -= bytesToCutOff;

      data.copy(lookbehind, this._lookbehind_size);
      this._lookbehind_size += len;

      this._bufpos = len;
      return len;
    }
  }

  if (pos >= 0)
    pos += this._bufpos;

  // Lookbehind buffer is now empty. Perform Boyer-Moore-Horspool
  // search with optimized character lookup code that only considers
  // the current round's haystack data.
  while (pos <= len - needle_len) {
    var ch = data[pos + needle_len - 1];

    if (ch === last_needle_char
        && data[pos] === needle[0]
        && jsmemcmp(needle, 0, data, pos, needle_len - 1)) {
      ++this.matches;
      if (pos > 0)
        this.emit('info', true, data, this._bufpos, pos);
      else
        this.emit('info', true);

      this._bufpos = pos + needle_len;
      return pos + needle_len;
    } else
      pos += occ[ch];
  }

  // There was no match. If there's trailing haystack data that we cannot
  // match yet using the Boyer-Moore-Horspool algorithm (because the trailing
  // data is less than the needle size) then match using a modified
  // algorithm that starts matching from the beginning instead of the end.
  // Whatever trailing data is left after running this algorithm is added to
  // the lookbehind buffer.
  if (pos < len) {
    while (pos < len && (data[pos] !== needle[0]
                         || !jsmemcmp(data, pos, needle, 0, len - pos))) {
      ++pos;
    }
    if (pos < len) {
      data.copy(lookbehind, 0, pos, pos + (len - pos));
      this._lookbehind_size = len - pos;
    }
  }

  // Everything until pos is guaranteed not to contain needle data.
  if (pos > 0)
    this.emit('info', false, data, this._bufpos, pos < len ? pos : len);

  this._bufpos = len;
  return len;
};

SBMH.prototype._sbmh_lookup_char = function(data, pos) {
  if (pos < 0)
    return this._lookbehind[this._lookbehind_size + pos];
  else
    return data[pos];
}

SBMH.prototype._sbmh_memcmp = function(data, pos, len) {
  var i = 0;

  while (i < len) {
    if (this._sbmh_lookup_char(data, pos + i) === this._needle[i])
      ++i;
    else
      return false;
  }
  return true;
}

module.exports = SBMH;

},{"events":undefined,"util":undefined}],341:[function(require,module,exports){
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

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":undefined}],342:[function(require,module,exports){
'use strict';
var ansiRegex = require('ansi-regex')();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

},{"ansi-regex":5}],343:[function(require,module,exports){
'use strict';
var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
})();

},{}],344:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function (require) {

	var makePromise = require('./makePromise');
	var Scheduler = require('./Scheduler');
	var async = require('./env').asap;

	return makePromise({
		scheduler: new Scheduler(async)
	});

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

},{"./Scheduler":345,"./env":357,"./makePromise":359}],345:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	// Credit to Twisol (https://github.com/Twisol) for suggesting
	// this type of extensible queue + trampoline approach for next-tick conflation.

	/**
	 * Async task scheduler
	 * @param {function} async function to schedule a single async function
	 * @constructor
	 */
	function Scheduler(async) {
		this._async = async;
		this._running = false;

		this._queue = this;
		this._queueLen = 0;
		this._afterQueue = {};
		this._afterQueueLen = 0;

		var self = this;
		this.drain = function() {
			self._drain();
		};
	}

	/**
	 * Enqueue a task
	 * @param {{ run:function }} task
	 */
	Scheduler.prototype.enqueue = function(task) {
		this._queue[this._queueLen++] = task;
		this.run();
	};

	/**
	 * Enqueue a task to run after the main task queue
	 * @param {{ run:function }} task
	 */
	Scheduler.prototype.afterQueue = function(task) {
		this._afterQueue[this._afterQueueLen++] = task;
		this.run();
	};

	Scheduler.prototype.run = function() {
		if (!this._running) {
			this._running = true;
			this._async(this.drain);
		}
	};

	/**
	 * Drain the handler queue entirely, and then the after queue
	 */
	Scheduler.prototype._drain = function() {
		var i = 0;
		for (; i < this._queueLen; ++i) {
			this._queue[i].run();
			this._queue[i] = void 0;
		}

		this._queueLen = 0;
		this._running = false;

		for (i = 0; i < this._afterQueueLen; ++i) {
			this._afterQueue[i].run();
			this._afterQueue[i] = void 0;
		}

		this._afterQueueLen = 0;
	};

	return Scheduler;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],346:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	/**
	 * Custom error type for promises rejected by promise.timeout
	 * @param {string} message
	 * @constructor
	 */
	function TimeoutError (message) {
		Error.call(this);
		this.message = message;
		this.name = TimeoutError.name;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, TimeoutError);
		}
	}

	TimeoutError.prototype = Object.create(Error.prototype);
	TimeoutError.prototype.constructor = TimeoutError;

	return TimeoutError;
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
},{}],347:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	makeApply.tryCatchResolve = tryCatchResolve;

	return makeApply;

	function makeApply(Promise, call) {
		if(arguments.length < 2) {
			call = tryCatchResolve;
		}

		return apply;

		function apply(f, thisArg, args) {
			var p = Promise._defer();
			var l = args.length;
			var params = new Array(l);
			callAndResolve({ f:f, thisArg:thisArg, args:args, params:params, i:l-1, call:call }, p._handler);

			return p;
		}

		function callAndResolve(c, h) {
			if(c.i < 0) {
				return call(c.f, c.thisArg, c.params, h);
			}

			var handler = Promise._handler(c.args[c.i]);
			handler.fold(callAndResolveNext, c, void 0, h);
		}

		function callAndResolveNext(c, x, h) {
			c.params[c.i] = x;
			c.i -= 1;
			callAndResolve(c, h);
		}
	}

	function tryCatchResolve(f, thisArg, args, resolver) {
		try {
			resolver.resolve(f.apply(thisArg, args));
		} catch(e) {
			resolver.reject(e);
		}
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));



},{}],348:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var state = require('../state');
	var applier = require('../apply');

	return function array(Promise) {

		var applyFold = applier(Promise);
		var toPromise = Promise.resolve;
		var all = Promise.all;

		var ar = Array.prototype.reduce;
		var arr = Array.prototype.reduceRight;
		var slice = Array.prototype.slice;

		// Additional array combinators

		Promise.any = any;
		Promise.some = some;
		Promise.settle = settle;

		Promise.map = map;
		Promise.filter = filter;
		Promise.reduce = reduce;
		Promise.reduceRight = reduceRight;

		/**
		 * When this promise fulfills with an array, do
		 * onFulfilled.apply(void 0, array)
		 * @param {function} onFulfilled function to apply
		 * @returns {Promise} promise for the result of applying onFulfilled
		 */
		Promise.prototype.spread = function(onFulfilled) {
			return this.then(all).then(function(array) {
				return onFulfilled.apply(this, array);
			});
		};

		return Promise;

		/**
		 * One-winner competitive race.
		 * Return a promise that will fulfill when one of the promises
		 * in the input array fulfills, or will reject when all promises
		 * have rejected.
		 * @param {array} promises
		 * @returns {Promise} promise for the first fulfilled value
		 */
		function any(promises) {
			var p = Promise._defer();
			var resolver = p._handler;
			var l = promises.length>>>0;

			var pending = l;
			var errors = [];

			for (var h, x, i = 0; i < l; ++i) {
				x = promises[i];
				if(x === void 0 && !(i in promises)) {
					--pending;
					continue;
				}

				h = Promise._handler(x);
				if(h.state() > 0) {
					resolver.become(h);
					Promise._visitRemaining(promises, i, h);
					break;
				} else {
					h.visit(resolver, handleFulfill, handleReject);
				}
			}

			if(pending === 0) {
				resolver.reject(new RangeError('any(): array must not be empty'));
			}

			return p;

			function handleFulfill(x) {
				/*jshint validthis:true*/
				errors = null;
				this.resolve(x); // this === resolver
			}

			function handleReject(e) {
				/*jshint validthis:true*/
				if(this.resolved) { // this === resolver
					return;
				}

				errors.push(e);
				if(--pending === 0) {
					this.reject(errors);
				}
			}
		}

		/**
		 * N-winner competitive race
		 * Return a promise that will fulfill when n input promises have
		 * fulfilled, or will reject when it becomes impossible for n
		 * input promises to fulfill (ie when promises.length - n + 1
		 * have rejected)
		 * @param {array} promises
		 * @param {number} n
		 * @returns {Promise} promise for the earliest n fulfillment values
		 *
		 * @deprecated
		 */
		function some(promises, n) {
			/*jshint maxcomplexity:7*/
			var p = Promise._defer();
			var resolver = p._handler;

			var results = [];
			var errors = [];

			var l = promises.length>>>0;
			var nFulfill = 0;
			var nReject;
			var x, i; // reused in both for() loops

			// First pass: count actual array items
			for(i=0; i<l; ++i) {
				x = promises[i];
				if(x === void 0 && !(i in promises)) {
					continue;
				}
				++nFulfill;
			}

			// Compute actual goals
			n = Math.max(n, 0);
			nReject = (nFulfill - n + 1);
			nFulfill = Math.min(n, nFulfill);

			if(n > nFulfill) {
				resolver.reject(new RangeError('some(): array must contain at least '
				+ n + ' item(s), but had ' + nFulfill));
			} else if(nFulfill === 0) {
				resolver.resolve(results);
			}

			// Second pass: observe each array item, make progress toward goals
			for(i=0; i<l; ++i) {
				x = promises[i];
				if(x === void 0 && !(i in promises)) {
					continue;
				}

				Promise._handler(x).visit(resolver, fulfill, reject, resolver.notify);
			}

			return p;

			function fulfill(x) {
				/*jshint validthis:true*/
				if(this.resolved) { // this === resolver
					return;
				}

				results.push(x);
				if(--nFulfill === 0) {
					errors = null;
					this.resolve(results);
				}
			}

			function reject(e) {
				/*jshint validthis:true*/
				if(this.resolved) { // this === resolver
					return;
				}

				errors.push(e);
				if(--nReject === 0) {
					results = null;
					this.reject(errors);
				}
			}
		}

		/**
		 * Apply f to the value of each promise in a list of promises
		 * and return a new list containing the results.
		 * @param {array} promises
		 * @param {function(x:*, index:Number):*} f mapping function
		 * @returns {Promise}
		 */
		function map(promises, f) {
			return Promise._traverse(f, promises);
		}

		/**
		 * Filter the provided array of promises using the provided predicate.  Input may
		 * contain promises and values
		 * @param {Array} promises array of promises and values
		 * @param {function(x:*, index:Number):boolean} predicate filtering predicate.
		 *  Must return truthy (or promise for truthy) for items to retain.
		 * @returns {Promise} promise that will fulfill with an array containing all items
		 *  for which predicate returned truthy.
		 */
		function filter(promises, predicate) {
			var a = slice.call(promises);
			return Promise._traverse(predicate, a).then(function(keep) {
				return filterSync(a, keep);
			});
		}

		function filterSync(promises, keep) {
			// Safe because we know all promises have fulfilled if we've made it this far
			var l = keep.length;
			var filtered = new Array(l);
			for(var i=0, j=0; i<l; ++i) {
				if(keep[i]) {
					filtered[j++] = Promise._handler(promises[i]).value;
				}
			}
			filtered.length = j;
			return filtered;

		}

		/**
		 * Return a promise that will always fulfill with an array containing
		 * the outcome states of all input promises.  The returned promise
		 * will never reject.
		 * @param {Array} promises
		 * @returns {Promise} promise for array of settled state descriptors
		 */
		function settle(promises) {
			return all(promises.map(settleOne));
		}

		function settleOne(p) {
			var h = Promise._handler(p);
			if(h.state() === 0) {
				return toPromise(p).then(state.fulfilled, state.rejected);
			}

			h._unreport();
			return state.inspect(h);
		}

		/**
		 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
		 * input may contain promises and/or values, and reduceFunc
		 * may return either a value or a promise, *and* initialValue may
		 * be a promise for the starting value.
		 * @param {Array|Promise} promises array or promise for an array of anything,
		 *      may contain a mix of promises and values.
		 * @param {function(accumulated:*, x:*, index:Number):*} f reduce function
		 * @returns {Promise} that will resolve to the final reduced value
		 */
		function reduce(promises, f /*, initialValue */) {
			return arguments.length > 2 ? ar.call(promises, liftCombine(f), arguments[2])
					: ar.call(promises, liftCombine(f));
		}

		/**
		 * Traditional reduce function, similar to `Array.prototype.reduceRight()`, but
		 * input may contain promises and/or values, and reduceFunc
		 * may return either a value or a promise, *and* initialValue may
		 * be a promise for the starting value.
		 * @param {Array|Promise} promises array or promise for an array of anything,
		 *      may contain a mix of promises and values.
		 * @param {function(accumulated:*, x:*, index:Number):*} f reduce function
		 * @returns {Promise} that will resolve to the final reduced value
		 */
		function reduceRight(promises, f /*, initialValue */) {
			return arguments.length > 2 ? arr.call(promises, liftCombine(f), arguments[2])
					: arr.call(promises, liftCombine(f));
		}

		function liftCombine(f) {
			return function(z, x, i) {
				return applyFold(f, void 0, [z,x,i]);
			};
		}
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../apply":347,"../state":360}],349:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function flow(Promise) {

		var resolve = Promise.resolve;
		var reject = Promise.reject;
		var origCatch = Promise.prototype['catch'];

		/**
		 * Handle the ultimate fulfillment value or rejection reason, and assume
		 * responsibility for all errors.  If an error propagates out of result
		 * or handleFatalError, it will be rethrown to the host, resulting in a
		 * loud stack track on most platforms and a crash on some.
		 * @param {function?} onResult
		 * @param {function?} onError
		 * @returns {undefined}
		 */
		Promise.prototype.done = function(onResult, onError) {
			this._handler.visit(this._handler.receiver, onResult, onError);
		};

		/**
		 * Add Error-type and predicate matching to catch.  Examples:
		 * promise.catch(TypeError, handleTypeError)
		 *   .catch(predicate, handleMatchedErrors)
		 *   .catch(handleRemainingErrors)
		 * @param onRejected
		 * @returns {*}
		 */
		Promise.prototype['catch'] = Promise.prototype.otherwise = function(onRejected) {
			if (arguments.length < 2) {
				return origCatch.call(this, onRejected);
			}

			if(typeof onRejected !== 'function') {
				return this.ensure(rejectInvalidPredicate);
			}

			return origCatch.call(this, createCatchFilter(arguments[1], onRejected));
		};

		/**
		 * Wraps the provided catch handler, so that it will only be called
		 * if the predicate evaluates truthy
		 * @param {?function} handler
		 * @param {function} predicate
		 * @returns {function} conditional catch handler
		 */
		function createCatchFilter(handler, predicate) {
			return function(e) {
				return evaluatePredicate(e, predicate)
					? handler.call(this, e)
					: reject(e);
			};
		}

		/**
		 * Ensures that onFulfilledOrRejected will be called regardless of whether
		 * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
		 * receive the promises' value or reason.  Any returned value will be disregarded.
		 * onFulfilledOrRejected may throw or return a rejected promise to signal
		 * an additional error.
		 * @param {function} handler handler to be called regardless of
		 *  fulfillment or rejection
		 * @returns {Promise}
		 */
		Promise.prototype['finally'] = Promise.prototype.ensure = function(handler) {
			if(typeof handler !== 'function') {
				return this;
			}

			return this.then(function(x) {
				return runSideEffect(handler, this, identity, x);
			}, function(e) {
				return runSideEffect(handler, this, reject, e);
			});
		};

		function runSideEffect (handler, thisArg, propagate, value) {
			var result = handler.call(thisArg);
			return maybeThenable(result)
				? propagateValue(result, propagate, value)
				: propagate(value);
		}

		function propagateValue (result, propagate, x) {
			return resolve(result).then(function () {
				return propagate(x);
			});
		}

		/**
		 * Recover from a failure by returning a defaultValue.  If defaultValue
		 * is a promise, it's fulfillment value will be used.  If defaultValue is
		 * a promise that rejects, the returned promise will reject with the
		 * same reason.
		 * @param {*} defaultValue
		 * @returns {Promise} new promise
		 */
		Promise.prototype['else'] = Promise.prototype.orElse = function(defaultValue) {
			return this.then(void 0, function() {
				return defaultValue;
			});
		};

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @return {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		Promise.prototype['yield'] = function(value) {
			return this.then(function() {
				return value;
			});
		};

		/**
		 * Runs a side effect when this promise fulfills, without changing the
		 * fulfillment value.
		 * @param {function} onFulfilledSideEffect
		 * @returns {Promise}
		 */
		Promise.prototype.tap = function(onFulfilledSideEffect) {
			return this.then(onFulfilledSideEffect)['yield'](this);
		};

		return Promise;
	};

	function rejectInvalidPredicate() {
		throw new TypeError('catch predicate must be a function');
	}

	function evaluatePredicate(e, predicate) {
		return isError(predicate) ? e instanceof predicate : predicate(e);
	}

	function isError(predicate) {
		return predicate === Error
			|| (predicate != null && predicate.prototype instanceof Error);
	}

	function maybeThenable(x) {
		return (typeof x === 'object' || typeof x === 'function') && x !== null;
	}

	function identity(x) {
		return x;
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],350:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */
/** @author Jeff Escalante */

(function(define) { 'use strict';
define(function() {

	return function fold(Promise) {

		Promise.prototype.fold = function(f, z) {
			var promise = this._beget();

			this._handler.fold(function(z, x, to) {
				Promise._handler(z).fold(function(x, z, to) {
					to.resolve(f.call(this, z, x));
				}, x, this, to);
			}, z, promise._handler.receiver, promise._handler);

			return promise;
		};

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],351:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var inspect = require('../state').inspect;

	return function inspection(Promise) {

		Promise.prototype.inspect = function() {
			return inspect(Promise._handler(this));
		};

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../state":360}],352:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function generate(Promise) {

		var resolve = Promise.resolve;

		Promise.iterate = iterate;
		Promise.unfold = unfold;

		return Promise;

		/**
		 * @deprecated Use github.com/cujojs/most streams and most.iterate
		 * Generate a (potentially infinite) stream of promised values:
		 * x, f(x), f(f(x)), etc. until condition(x) returns true
		 * @param {function} f function to generate a new x from the previous x
		 * @param {function} condition function that, given the current x, returns
		 *  truthy when the iterate should stop
		 * @param {function} handler function to handle the value produced by f
		 * @param {*|Promise} x starting value, may be a promise
		 * @return {Promise} the result of the last call to f before
		 *  condition returns true
		 */
		function iterate(f, condition, handler, x) {
			return unfold(function(x) {
				return [x, f(x)];
			}, condition, handler, x);
		}

		/**
		 * @deprecated Use github.com/cujojs/most streams and most.unfold
		 * Generate a (potentially infinite) stream of promised values
		 * by applying handler(generator(seed)) iteratively until
		 * condition(seed) returns true.
		 * @param {function} unspool function that generates a [value, newSeed]
		 *  given a seed.
		 * @param {function} condition function that, given the current seed, returns
		 *  truthy when the unfold should stop
		 * @param {function} handler function to handle the value produced by unspool
		 * @param x {*|Promise} starting value, may be a promise
		 * @return {Promise} the result of the last value produced by unspool before
		 *  condition returns true
		 */
		function unfold(unspool, condition, handler, x) {
			return resolve(x).then(function(seed) {
				return resolve(condition(seed)).then(function(done) {
					return done ? seed : resolve(unspool(seed)).spread(next);
				});
			});

			function next(item, newSeed) {
				return resolve(handler(item)).then(function() {
					return unfold(unspool, condition, handler, newSeed);
				});
			}
		}
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],353:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function progress(Promise) {

		/**
		 * @deprecated
		 * Register a progress handler for this promise
		 * @param {function} onProgress
		 * @returns {Promise}
		 */
		Promise.prototype.progress = function(onProgress) {
			return this.then(void 0, void 0, onProgress);
		};

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],354:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var env = require('../env');
	var TimeoutError = require('../TimeoutError');

	function setTimeout(f, ms, x, y) {
		return env.setTimer(function() {
			f(x, y, ms);
		}, ms);
	}

	return function timed(Promise) {
		/**
		 * Return a new promise whose fulfillment value is revealed only
		 * after ms milliseconds
		 * @param {number} ms milliseconds
		 * @returns {Promise}
		 */
		Promise.prototype.delay = function(ms) {
			var p = this._beget();
			this._handler.fold(handleDelay, ms, void 0, p._handler);
			return p;
		};

		function handleDelay(ms, x, h) {
			setTimeout(resolveDelay, ms, x, h);
		}

		function resolveDelay(x, h) {
			h.resolve(x);
		}

		/**
		 * Return a new promise that rejects after ms milliseconds unless
		 * this promise fulfills earlier, in which case the returned promise
		 * fulfills with the same value.
		 * @param {number} ms milliseconds
		 * @param {Error|*=} reason optional rejection reason to use, defaults
		 *   to a TimeoutError if not provided
		 * @returns {Promise}
		 */
		Promise.prototype.timeout = function(ms, reason) {
			var p = this._beget();
			var h = p._handler;

			var t = setTimeout(onTimeout, ms, reason, p._handler);

			this._handler.visit(h,
				function onFulfill(x) {
					env.clearTimer(t);
					this.resolve(x); // this = h
				},
				function onReject(x) {
					env.clearTimer(t);
					this.reject(x); // this = h
				},
				h.notify);

			return p;
		};

		function onTimeout(reason, h, ms) {
			var e = typeof reason === 'undefined'
				? new TimeoutError('timed out after ' + ms + 'ms')
				: reason;
			h.reject(e);
		}

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../TimeoutError":346,"../env":357}],355:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var setTimer = require('../env').setTimer;
	var format = require('../format');

	return function unhandledRejection(Promise) {

		var logError = noop;
		var logInfo = noop;
		var localConsole;

		if(typeof console !== 'undefined') {
			// Alias console to prevent things like uglify's drop_console option from
			// removing console.log/error. Unhandled rejections fall into the same
			// category as uncaught exceptions, and build tools shouldn't silence them.
			localConsole = console;
			logError = typeof localConsole.error !== 'undefined'
				? function (e) { localConsole.error(e); }
				: function (e) { localConsole.log(e); };

			logInfo = typeof localConsole.info !== 'undefined'
				? function (e) { localConsole.info(e); }
				: function (e) { localConsole.log(e); };
		}

		Promise.onPotentiallyUnhandledRejection = function(rejection) {
			enqueue(report, rejection);
		};

		Promise.onPotentiallyUnhandledRejectionHandled = function(rejection) {
			enqueue(unreport, rejection);
		};

		Promise.onFatalRejection = function(rejection) {
			enqueue(throwit, rejection.value);
		};

		var tasks = [];
		var reported = [];
		var running = null;

		function report(r) {
			if(!r.handled) {
				reported.push(r);
				logError('Potentially unhandled rejection [' + r.id + '] ' + format.formatError(r.value));
			}
		}

		function unreport(r) {
			var i = reported.indexOf(r);
			if(i >= 0) {
				reported.splice(i, 1);
				logInfo('Handled previous rejection [' + r.id + '] ' + format.formatObject(r.value));
			}
		}

		function enqueue(f, x) {
			tasks.push(f, x);
			if(running === null) {
				running = setTimer(flush, 0);
			}
		}

		function flush() {
			running = null;
			while(tasks.length > 0) {
				tasks.shift()(tasks.shift());
			}
		}

		return Promise;
	};

	function throwit(e) {
		throw e;
	}

	function noop() {}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../env":357,"../format":358}],356:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function addWith(Promise) {
		/**
		 * Returns a promise whose handlers will be called with `this` set to
		 * the supplied receiver.  Subsequent promises derived from the
		 * returned promise will also have their handlers called with receiver
		 * as `this`. Calling `with` with undefined or no arguments will return
		 * a promise whose handlers will again be called in the usual Promises/A+
		 * way (no `this`) thus safely undoing any previous `with` in the
		 * promise chain.
		 *
		 * WARNING: Promises returned from `with`/`withThis` are NOT Promises/A+
		 * compliant, specifically violating 2.2.5 (http://promisesaplus.com/#point-41)
		 *
		 * @param {object} receiver `this` value for all handlers attached to
		 *  the returned promise.
		 * @returns {Promise}
		 */
		Promise.prototype['with'] = Promise.prototype.withThis = function(receiver) {
			var p = this._beget();
			var child = p._handler;
			child.receiver = receiver;
			this._handler.chain(child, receiver);
			return p;
		};

		return Promise;
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));


},{}],357:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global process,document,setTimeout,clearTimeout,MutationObserver,WebKitMutationObserver*/
(function(define) { 'use strict';
define(function(require) {
	/*jshint maxcomplexity:6*/

	// Sniff "best" async scheduling option
	// Prefer process.nextTick or MutationObserver, then check for
	// setTimeout, and finally vertx, since its the only env that doesn't
	// have setTimeout

	var MutationObs;
	var capturedSetTimeout = typeof setTimeout !== 'undefined' && setTimeout;

	// Default env
	var setTimer = function(f, ms) { return setTimeout(f, ms); };
	var clearTimer = function(t) { return clearTimeout(t); };
	var asap = function (f) { return capturedSetTimeout(f, 0); };

	// Detect specific env
	if (isNode()) { // Node
		asap = function (f) { return process.nextTick(f); };

	} else if (MutationObs = hasMutationObserver()) { // Modern browser
		asap = initMutationObserver(MutationObs);

	} else if (!capturedSetTimeout) { // vert.x
		var vertxRequire = require;
		var vertx = vertxRequire('vertx');
		setTimer = function (f, ms) { return vertx.setTimer(ms, f); };
		clearTimer = vertx.cancelTimer;
		asap = vertx.runOnLoop || vertx.runOnContext;
	}

	return {
		setTimer: setTimer,
		clearTimer: clearTimer,
		asap: asap
	};

	function isNode () {
		return typeof process !== 'undefined' &&
			Object.prototype.toString.call(process) === '[object process]';
	}

	function hasMutationObserver () {
		return (typeof MutationObserver === 'function' && MutationObserver) ||
			(typeof WebKitMutationObserver === 'function' && WebKitMutationObserver);
	}

	function initMutationObserver(MutationObserver) {
		var scheduled;
		var node = document.createTextNode('');
		var o = new MutationObserver(run);
		o.observe(node, { characterData: true });

		function run() {
			var f = scheduled;
			scheduled = void 0;
			f();
		}

		var i = 0;
		return function (f) {
			scheduled = f;
			node.data = (i ^= 1);
		};
	}
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{}],358:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return {
		formatError: formatError,
		formatObject: formatObject,
		tryStringify: tryStringify
	};

	/**
	 * Format an error into a string.  If e is an Error and has a stack property,
	 * it's returned.  Otherwise, e is formatted using formatObject, with a
	 * warning added about e not being a proper Error.
	 * @param {*} e
	 * @returns {String} formatted string, suitable for output to developers
	 */
	function formatError(e) {
		var s = typeof e === 'object' && e !== null && (e.stack || e.message) ? e.stack || e.message : formatObject(e);
		return e instanceof Error ? s : s + ' (WARNING: non-Error used)';
	}

	/**
	 * Format an object, detecting "plain" objects and running them through
	 * JSON.stringify if possible.
	 * @param {Object} o
	 * @returns {string}
	 */
	function formatObject(o) {
		var s = String(o);
		if(s === '[object Object]' && typeof JSON !== 'undefined') {
			s = tryStringify(o, s);
		}
		return s;
	}

	/**
	 * Try to return the result of JSON.stringify(x).  If that fails, return
	 * defaultValue
	 * @param {*} x
	 * @param {*} defaultValue
	 * @returns {String|*} JSON.stringify(x) or defaultValue
	 */
	function tryStringify(x, defaultValue) {
		try {
			return JSON.stringify(x);
		} catch(e) {
			return defaultValue;
		}
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],359:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function makePromise(environment) {

		var tasks = environment.scheduler;
		var emitRejection = initEmitRejection();

		var objectCreate = Object.create ||
			function(proto) {
				function Child() {}
				Child.prototype = proto;
				return new Child();
			};

		/**
		 * Create a promise whose fate is determined by resolver
		 * @constructor
		 * @returns {Promise} promise
		 * @name Promise
		 */
		function Promise(resolver, handler) {
			this._handler = resolver === Handler ? handler : init(resolver);
		}

		/**
		 * Run the supplied resolver
		 * @param resolver
		 * @returns {Pending}
		 */
		function init(resolver) {
			var handler = new Pending();

			try {
				resolver(promiseResolve, promiseReject, promiseNotify);
			} catch (e) {
				promiseReject(e);
			}

			return handler;

			/**
			 * Transition from pre-resolution state to post-resolution state, notifying
			 * all listeners of the ultimate fulfillment or rejection
			 * @param {*} x resolution value
			 */
			function promiseResolve (x) {
				handler.resolve(x);
			}
			/**
			 * Reject this promise with reason, which will be used verbatim
			 * @param {Error|*} reason rejection reason, strongly suggested
			 *   to be an Error type
			 */
			function promiseReject (reason) {
				handler.reject(reason);
			}

			/**
			 * @deprecated
			 * Issue a progress event, notifying all progress listeners
			 * @param {*} x progress event payload to pass to all listeners
			 */
			function promiseNotify (x) {
				handler.notify(x);
			}
		}

		// Creation

		Promise.resolve = resolve;
		Promise.reject = reject;
		Promise.never = never;

		Promise._defer = defer;
		Promise._handler = getHandler;

		/**
		 * Returns a trusted promise. If x is already a trusted promise, it is
		 * returned, otherwise returns a new trusted Promise which follows x.
		 * @param  {*} x
		 * @return {Promise} promise
		 */
		function resolve(x) {
			return isPromise(x) ? x
				: new Promise(Handler, new Async(getHandler(x)));
		}

		/**
		 * Return a reject promise with x as its reason (x is used verbatim)
		 * @param {*} x
		 * @returns {Promise} rejected promise
		 */
		function reject(x) {
			return new Promise(Handler, new Async(new Rejected(x)));
		}

		/**
		 * Return a promise that remains pending forever
		 * @returns {Promise} forever-pending promise.
		 */
		function never() {
			return foreverPendingPromise; // Should be frozen
		}

		/**
		 * Creates an internal {promise, resolver} pair
		 * @private
		 * @returns {Promise}
		 */
		function defer() {
			return new Promise(Handler, new Pending());
		}

		// Transformation and flow control

		/**
		 * Transform this promise's fulfillment value, returning a new Promise
		 * for the transformed result.  If the promise cannot be fulfilled, onRejected
		 * is called with the reason.  onProgress *may* be called with updates toward
		 * this promise's fulfillment.
		 * @param {function=} onFulfilled fulfillment handler
		 * @param {function=} onRejected rejection handler
		 * @param {function=} onProgress @deprecated progress handler
		 * @return {Promise} new promise
		 */
		Promise.prototype.then = function(onFulfilled, onRejected, onProgress) {
			var parent = this._handler;
			var state = parent.join().state();

			if ((typeof onFulfilled !== 'function' && state > 0) ||
				(typeof onRejected !== 'function' && state < 0)) {
				// Short circuit: value will not change, simply share handler
				return new this.constructor(Handler, parent);
			}

			var p = this._beget();
			var child = p._handler;

			parent.chain(child, parent.receiver, onFulfilled, onRejected, onProgress);

			return p;
		};

		/**
		 * If this promise cannot be fulfilled due to an error, call onRejected to
		 * handle the error. Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @return {Promise}
		 */
		Promise.prototype['catch'] = function(onRejected) {
			return this.then(void 0, onRejected);
		};

		/**
		 * Creates a new, pending promise of the same type as this promise
		 * @private
		 * @returns {Promise}
		 */
		Promise.prototype._beget = function() {
			return begetFrom(this._handler, this.constructor);
		};

		function begetFrom(parent, Promise) {
			var child = new Pending(parent.receiver, parent.join().context);
			return new Promise(Handler, child);
		}

		// Array combinators

		Promise.all = all;
		Promise.race = race;
		Promise._traverse = traverse;

		/**
		 * Return a promise that will fulfill when all promises in the
		 * input array have fulfilled, or will reject when one of the
		 * promises rejects.
		 * @param {array} promises array of promises
		 * @returns {Promise} promise for array of fulfillment values
		 */
		function all(promises) {
			return traverseWith(snd, null, promises);
		}

		/**
		 * Array<Promise<X>> -> Promise<Array<f(X)>>
		 * @private
		 * @param {function} f function to apply to each promise's value
		 * @param {Array} promises array of promises
		 * @returns {Promise} promise for transformed values
		 */
		function traverse(f, promises) {
			return traverseWith(tryCatch2, f, promises);
		}

		function traverseWith(tryMap, f, promises) {
			var handler = typeof f === 'function' ? mapAt : settleAt;

			var resolver = new Pending();
			var pending = promises.length >>> 0;
			var results = new Array(pending);

			for (var i = 0, x; i < promises.length && !resolver.resolved; ++i) {
				x = promises[i];

				if (x === void 0 && !(i in promises)) {
					--pending;
					continue;
				}

				traverseAt(promises, handler, i, x, resolver);
			}

			if(pending === 0) {
				resolver.become(new Fulfilled(results));
			}

			return new Promise(Handler, resolver);

			function mapAt(i, x, resolver) {
				if(!resolver.resolved) {
					traverseAt(promises, settleAt, i, tryMap(f, x, i), resolver);
				}
			}

			function settleAt(i, x, resolver) {
				results[i] = x;
				if(--pending === 0) {
					resolver.become(new Fulfilled(results));
				}
			}
		}

		function traverseAt(promises, handler, i, x, resolver) {
			if (maybeThenable(x)) {
				var h = getHandlerMaybeThenable(x);
				var s = h.state();

				if (s === 0) {
					h.fold(handler, i, void 0, resolver);
				} else if (s > 0) {
					handler(i, h.value, resolver);
				} else {
					resolver.become(h);
					visitRemaining(promises, i+1, h);
				}
			} else {
				handler(i, x, resolver);
			}
		}

		Promise._visitRemaining = visitRemaining;
		function visitRemaining(promises, start, handler) {
			for(var i=start; i<promises.length; ++i) {
				markAsHandled(getHandler(promises[i]), handler);
			}
		}

		function markAsHandled(h, handler) {
			if(h === handler) {
				return;
			}

			var s = h.state();
			if(s === 0) {
				h.visit(h, void 0, h._unreport);
			} else if(s < 0) {
				h._unreport();
			}
		}

		/**
		 * Fulfill-reject competitive race. Return a promise that will settle
		 * to the same state as the earliest input promise to settle.
		 *
		 * WARNING: The ES6 Promise spec requires that race()ing an empty array
		 * must return a promise that is pending forever.  This implementation
		 * returns a singleton forever-pending promise, the same singleton that is
		 * returned by Promise.never(), thus can be checked with ===
		 *
		 * @param {array} promises array of promises to race
		 * @returns {Promise} if input is non-empty, a promise that will settle
		 * to the same outcome as the earliest input promise to settle. if empty
		 * is empty, returns a promise that will never settle.
		 */
		function race(promises) {
			if(typeof promises !== 'object' || promises === null) {
				return reject(new TypeError('non-iterable passed to race()'));
			}

			// Sigh, race([]) is untestable unless we return *something*
			// that is recognizable without calling .then() on it.
			return promises.length === 0 ? never()
				 : promises.length === 1 ? resolve(promises[0])
				 : runRace(promises);
		}

		function runRace(promises) {
			var resolver = new Pending();
			var i, x, h;
			for(i=0; i<promises.length; ++i) {
				x = promises[i];
				if (x === void 0 && !(i in promises)) {
					continue;
				}

				h = getHandler(x);
				if(h.state() !== 0) {
					resolver.become(h);
					visitRemaining(promises, i+1, h);
					break;
				} else {
					h.visit(resolver, resolver.resolve, resolver.reject);
				}
			}
			return new Promise(Handler, resolver);
		}

		// Promise internals
		// Below this, everything is @private

		/**
		 * Get an appropriate handler for x, without checking for cycles
		 * @param {*} x
		 * @returns {object} handler
		 */
		function getHandler(x) {
			if(isPromise(x)) {
				return x._handler.join();
			}
			return maybeThenable(x) ? getHandlerUntrusted(x) : new Fulfilled(x);
		}

		/**
		 * Get a handler for thenable x.
		 * NOTE: You must only call this if maybeThenable(x) == true
		 * @param {object|function|Promise} x
		 * @returns {object} handler
		 */
		function getHandlerMaybeThenable(x) {
			return isPromise(x) ? x._handler.join() : getHandlerUntrusted(x);
		}

		/**
		 * Get a handler for potentially untrusted thenable x
		 * @param {*} x
		 * @returns {object} handler
		 */
		function getHandlerUntrusted(x) {
			try {
				var untrustedThen = x.then;
				return typeof untrustedThen === 'function'
					? new Thenable(untrustedThen, x)
					: new Fulfilled(x);
			} catch(e) {
				return new Rejected(e);
			}
		}

		/**
		 * Handler for a promise that is pending forever
		 * @constructor
		 */
		function Handler() {}

		Handler.prototype.when
			= Handler.prototype.become
			= Handler.prototype.notify // deprecated
			= Handler.prototype.fail
			= Handler.prototype._unreport
			= Handler.prototype._report
			= noop;

		Handler.prototype._state = 0;

		Handler.prototype.state = function() {
			return this._state;
		};

		/**
		 * Recursively collapse handler chain to find the handler
		 * nearest to the fully resolved value.
		 * @returns {object} handler nearest the fully resolved value
		 */
		Handler.prototype.join = function() {
			var h = this;
			while(h.handler !== void 0) {
				h = h.handler;
			}
			return h;
		};

		Handler.prototype.chain = function(to, receiver, fulfilled, rejected, progress) {
			this.when({
				resolver: to,
				receiver: receiver,
				fulfilled: fulfilled,
				rejected: rejected,
				progress: progress
			});
		};

		Handler.prototype.visit = function(receiver, fulfilled, rejected, progress) {
			this.chain(failIfRejected, receiver, fulfilled, rejected, progress);
		};

		Handler.prototype.fold = function(f, z, c, to) {
			this.when(new Fold(f, z, c, to));
		};

		/**
		 * Handler that invokes fail() on any handler it becomes
		 * @constructor
		 */
		function FailIfRejected() {}

		inherit(Handler, FailIfRejected);

		FailIfRejected.prototype.become = function(h) {
			h.fail();
		};

		var failIfRejected = new FailIfRejected();

		/**
		 * Handler that manages a queue of consumers waiting on a pending promise
		 * @constructor
		 */
		function Pending(receiver, inheritedContext) {
			Promise.createContext(this, inheritedContext);

			this.consumers = void 0;
			this.receiver = receiver;
			this.handler = void 0;
			this.resolved = false;
		}

		inherit(Handler, Pending);

		Pending.prototype._state = 0;

		Pending.prototype.resolve = function(x) {
			this.become(getHandler(x));
		};

		Pending.prototype.reject = function(x) {
			if(this.resolved) {
				return;
			}

			this.become(new Rejected(x));
		};

		Pending.prototype.join = function() {
			if (!this.resolved) {
				return this;
			}

			var h = this;

			while (h.handler !== void 0) {
				h = h.handler;
				if (h === this) {
					return this.handler = cycle();
				}
			}

			return h;
		};

		Pending.prototype.run = function() {
			var q = this.consumers;
			var handler = this.handler;
			this.handler = this.handler.join();
			this.consumers = void 0;

			for (var i = 0; i < q.length; ++i) {
				handler.when(q[i]);
			}
		};

		Pending.prototype.become = function(handler) {
			if(this.resolved) {
				return;
			}

			this.resolved = true;
			this.handler = handler;
			if(this.consumers !== void 0) {
				tasks.enqueue(this);
			}

			if(this.context !== void 0) {
				handler._report(this.context);
			}
		};

		Pending.prototype.when = function(continuation) {
			if(this.resolved) {
				tasks.enqueue(new ContinuationTask(continuation, this.handler));
			} else {
				if(this.consumers === void 0) {
					this.consumers = [continuation];
				} else {
					this.consumers.push(continuation);
				}
			}
		};

		/**
		 * @deprecated
		 */
		Pending.prototype.notify = function(x) {
			if(!this.resolved) {
				tasks.enqueue(new ProgressTask(x, this));
			}
		};

		Pending.prototype.fail = function(context) {
			var c = typeof context === 'undefined' ? this.context : context;
			this.resolved && this.handler.join().fail(c);
		};

		Pending.prototype._report = function(context) {
			this.resolved && this.handler.join()._report(context);
		};

		Pending.prototype._unreport = function() {
			this.resolved && this.handler.join()._unreport();
		};

		/**
		 * Wrap another handler and force it into a future stack
		 * @param {object} handler
		 * @constructor
		 */
		function Async(handler) {
			this.handler = handler;
		}

		inherit(Handler, Async);

		Async.prototype.when = function(continuation) {
			tasks.enqueue(new ContinuationTask(continuation, this));
		};

		Async.prototype._report = function(context) {
			this.join()._report(context);
		};

		Async.prototype._unreport = function() {
			this.join()._unreport();
		};

		/**
		 * Handler that wraps an untrusted thenable and assimilates it in a future stack
		 * @param {function} then
		 * @param {{then: function}} thenable
		 * @constructor
		 */
		function Thenable(then, thenable) {
			Pending.call(this);
			tasks.enqueue(new AssimilateTask(then, thenable, this));
		}

		inherit(Pending, Thenable);

		/**
		 * Handler for a fulfilled promise
		 * @param {*} x fulfillment value
		 * @constructor
		 */
		function Fulfilled(x) {
			Promise.createContext(this);
			this.value = x;
		}

		inherit(Handler, Fulfilled);

		Fulfilled.prototype._state = 1;

		Fulfilled.prototype.fold = function(f, z, c, to) {
			runContinuation3(f, z, this, c, to);
		};

		Fulfilled.prototype.when = function(cont) {
			runContinuation1(cont.fulfilled, this, cont.receiver, cont.resolver);
		};

		var errorId = 0;

		/**
		 * Handler for a rejected promise
		 * @param {*} x rejection reason
		 * @constructor
		 */
		function Rejected(x) {
			Promise.createContext(this);

			this.id = ++errorId;
			this.value = x;
			this.handled = false;
			this.reported = false;

			this._report();
		}

		inherit(Handler, Rejected);

		Rejected.prototype._state = -1;

		Rejected.prototype.fold = function(f, z, c, to) {
			to.become(this);
		};

		Rejected.prototype.when = function(cont) {
			if(typeof cont.rejected === 'function') {
				this._unreport();
			}
			runContinuation1(cont.rejected, this, cont.receiver, cont.resolver);
		};

		Rejected.prototype._report = function(context) {
			tasks.afterQueue(new ReportTask(this, context));
		};

		Rejected.prototype._unreport = function() {
			if(this.handled) {
				return;
			}
			this.handled = true;
			tasks.afterQueue(new UnreportTask(this));
		};

		Rejected.prototype.fail = function(context) {
			this.reported = true;
			emitRejection('unhandledRejection', this);
			Promise.onFatalRejection(this, context === void 0 ? this.context : context);
		};

		function ReportTask(rejection, context) {
			this.rejection = rejection;
			this.context = context;
		}

		ReportTask.prototype.run = function() {
			if(!this.rejection.handled && !this.rejection.reported) {
				this.rejection.reported = true;
				emitRejection('unhandledRejection', this.rejection) ||
					Promise.onPotentiallyUnhandledRejection(this.rejection, this.context);
			}
		};

		function UnreportTask(rejection) {
			this.rejection = rejection;
		}

		UnreportTask.prototype.run = function() {
			if(this.rejection.reported) {
				emitRejection('rejectionHandled', this.rejection) ||
					Promise.onPotentiallyUnhandledRejectionHandled(this.rejection);
			}
		};

		// Unhandled rejection hooks
		// By default, everything is a noop

		Promise.createContext
			= Promise.enterContext
			= Promise.exitContext
			= Promise.onPotentiallyUnhandledRejection
			= Promise.onPotentiallyUnhandledRejectionHandled
			= Promise.onFatalRejection
			= noop;

		// Errors and singletons

		var foreverPendingHandler = new Handler();
		var foreverPendingPromise = new Promise(Handler, foreverPendingHandler);

		function cycle() {
			return new Rejected(new TypeError('Promise cycle'));
		}

		// Task runners

		/**
		 * Run a single consumer
		 * @constructor
		 */
		function ContinuationTask(continuation, handler) {
			this.continuation = continuation;
			this.handler = handler;
		}

		ContinuationTask.prototype.run = function() {
			this.handler.join().when(this.continuation);
		};

		/**
		 * Run a queue of progress handlers
		 * @constructor
		 */
		function ProgressTask(value, handler) {
			this.handler = handler;
			this.value = value;
		}

		ProgressTask.prototype.run = function() {
			var q = this.handler.consumers;
			if(q === void 0) {
				return;
			}

			for (var c, i = 0; i < q.length; ++i) {
				c = q[i];
				runNotify(c.progress, this.value, this.handler, c.receiver, c.resolver);
			}
		};

		/**
		 * Assimilate a thenable, sending it's value to resolver
		 * @param {function} then
		 * @param {object|function} thenable
		 * @param {object} resolver
		 * @constructor
		 */
		function AssimilateTask(then, thenable, resolver) {
			this._then = then;
			this.thenable = thenable;
			this.resolver = resolver;
		}

		AssimilateTask.prototype.run = function() {
			var h = this.resolver;
			tryAssimilate(this._then, this.thenable, _resolve, _reject, _notify);

			function _resolve(x) { h.resolve(x); }
			function _reject(x)  { h.reject(x); }
			function _notify(x)  { h.notify(x); }
		};

		function tryAssimilate(then, thenable, resolve, reject, notify) {
			try {
				then.call(thenable, resolve, reject, notify);
			} catch (e) {
				reject(e);
			}
		}

		/**
		 * Fold a handler value with z
		 * @constructor
		 */
		function Fold(f, z, c, to) {
			this.f = f; this.z = z; this.c = c; this.to = to;
			this.resolver = failIfRejected;
			this.receiver = this;
		}

		Fold.prototype.fulfilled = function(x) {
			this.f.call(this.c, this.z, x, this.to);
		};

		Fold.prototype.rejected = function(x) {
			this.to.reject(x);
		};

		Fold.prototype.progress = function(x) {
			this.to.notify(x);
		};

		// Other helpers

		/**
		 * @param {*} x
		 * @returns {boolean} true iff x is a trusted Promise
		 */
		function isPromise(x) {
			return x instanceof Promise;
		}

		/**
		 * Test just enough to rule out primitives, in order to take faster
		 * paths in some code
		 * @param {*} x
		 * @returns {boolean} false iff x is guaranteed *not* to be a thenable
		 */
		function maybeThenable(x) {
			return (typeof x === 'object' || typeof x === 'function') && x !== null;
		}

		function runContinuation1(f, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.become(h);
			}

			Promise.enterContext(h);
			tryCatchReject(f, h.value, receiver, next);
			Promise.exitContext();
		}

		function runContinuation3(f, x, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.become(h);
			}

			Promise.enterContext(h);
			tryCatchReject3(f, x, h.value, receiver, next);
			Promise.exitContext();
		}

		/**
		 * @deprecated
		 */
		function runNotify(f, x, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.notify(x);
			}

			Promise.enterContext(h);
			tryCatchReturn(f, x, receiver, next);
			Promise.exitContext();
		}

		function tryCatch2(f, a, b) {
			try {
				return f(a, b);
			} catch(e) {
				return reject(e);
			}
		}

		/**
		 * Return f.call(thisArg, x), or if it throws return a rejected promise for
		 * the thrown exception
		 */
		function tryCatchReject(f, x, thisArg, next) {
			try {
				next.become(getHandler(f.call(thisArg, x)));
			} catch(e) {
				next.become(new Rejected(e));
			}
		}

		/**
		 * Same as above, but includes the extra argument parameter.
		 */
		function tryCatchReject3(f, x, y, thisArg, next) {
			try {
				f.call(thisArg, x, y, next);
			} catch(e) {
				next.become(new Rejected(e));
			}
		}

		/**
		 * @deprecated
		 * Return f.call(thisArg, x), or if it throws, *return* the exception
		 */
		function tryCatchReturn(f, x, thisArg, next) {
			try {
				next.notify(f.call(thisArg, x));
			} catch(e) {
				next.notify(e);
			}
		}

		function inherit(Parent, Child) {
			Child.prototype = objectCreate(Parent.prototype);
			Child.prototype.constructor = Child;
		}

		function snd(x, y) {
			return y;
		}

		function noop() {}

		function initEmitRejection() {
			/*global process, self, CustomEvent*/
			if(typeof process !== 'undefined' && process !== null
				&& typeof process.emit === 'function') {
				// Returning falsy here means to call the default
				// onPotentiallyUnhandledRejection API.  This is safe even in
				// browserify since process.emit always returns falsy in browserify:
				// https://github.com/defunctzombie/node-process/blob/master/browser.js#L40-L46
				return function(type, rejection) {
					return type === 'unhandledRejection'
						? process.emit(type, rejection.value, rejection)
						: process.emit(type, rejection);
				};
			} else if(typeof self !== 'undefined' && typeof CustomEvent === 'function') {
				return (function(noop, self, CustomEvent) {
					var hasCustomEvent = false;
					try {
						var ev = new CustomEvent('unhandledRejection');
						hasCustomEvent = ev instanceof CustomEvent;
					} catch (e) {}

					return !hasCustomEvent ? noop : function(type, rejection) {
						var ev = new CustomEvent(type, {
							detail: {
								reason: rejection.value,
								key: rejection
							},
							bubbles: false,
							cancelable: true
						});

						return !self.dispatchEvent(ev);
					};
				}(noop, self, CustomEvent));
			}

			return noop;
		}

		return Promise;
	};
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],360:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return {
		pending: toPendingState,
		fulfilled: toFulfilledState,
		rejected: toRejectedState,
		inspect: inspect
	};

	function toPendingState() {
		return { state: 'pending' };
	}

	function toRejectedState(e) {
		return { state: 'rejected', reason: e };
	}

	function toFulfilledState(x) {
		return { state: 'fulfilled', value: x };
	}

	function inspect(handler) {
		var state = handler.state();
		return state === 0 ? toPendingState()
			 : state > 0   ? toFulfilledState(handler.value)
			               : toRejectedState(handler.value);
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],361:[function(require,module,exports){
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * sequence.js
 *
 * Run a set of task functions in sequence.  All tasks will
 * receive the same args.
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(define) {
define(function(require) {

	var when = require('./when');
	var all = when.Promise.all;
	var slice = Array.prototype.slice;

	/**
	 * Run array of tasks in sequence with no overlap
	 * @param tasks {Array|Promise} array or promiseForArray of task functions
	 * @param [args] {*} arguments to be passed to all tasks
	 * @return {Promise} promise for an array containing
	 * the result of each task in the array position corresponding
	 * to position of the task in the tasks array
	 */
	return function sequence(tasks /*, args... */) {
		var results = [];

		return all(slice.call(arguments, 1)).then(function(args) {
			return when.reduce(tasks, function(results, task) {
				return when(task.apply(void 0, args), addResult);
			}, results);
		});

		function addResult(result) {
			results.push(result);
			return results;
		}
	};

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });



},{"./when":362}],362:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */

/**
 * Promises/A+ and when() implementation
 * when is part of the cujoJS family of libraries (http://cujojs.com/)
 * @author Brian Cavalier
 * @author John Hann
 */
(function(define) { 'use strict';
define(function (require) {

	var timed = require('./lib/decorators/timed');
	var array = require('./lib/decorators/array');
	var flow = require('./lib/decorators/flow');
	var fold = require('./lib/decorators/fold');
	var inspect = require('./lib/decorators/inspect');
	var generate = require('./lib/decorators/iterate');
	var progress = require('./lib/decorators/progress');
	var withThis = require('./lib/decorators/with');
	var unhandledRejection = require('./lib/decorators/unhandledRejection');
	var TimeoutError = require('./lib/TimeoutError');

	var Promise = [array, flow, fold, generate, progress,
		inspect, withThis, timed, unhandledRejection]
		.reduce(function(Promise, feature) {
			return feature(Promise);
		}, require('./lib/Promise'));

	var apply = require('./lib/apply')(Promise);

	// Public API

	when.promise     = promise;              // Create a pending promise
	when.resolve     = Promise.resolve;      // Create a resolved promise
	when.reject      = Promise.reject;       // Create a rejected promise

	when.lift        = lift;                 // lift a function to return promises
	when['try']      = attempt;              // call a function and return a promise
	when.attempt     = attempt;              // alias for when.try

	when.iterate     = Promise.iterate;      // DEPRECATED (use cujojs/most streams) Generate a stream of promises
	when.unfold      = Promise.unfold;       // DEPRECATED (use cujojs/most streams) Generate a stream of promises

	when.join        = join;                 // Join 2 or more promises

	when.all         = all;                  // Resolve a list of promises
	when.settle      = settle;               // Settle a list of promises

	when.any         = lift(Promise.any);    // One-winner race
	when.some        = lift(Promise.some);   // Multi-winner race
	when.race        = lift(Promise.race);   // First-to-settle race

	when.map         = map;                  // Array.map() for promises
	when.filter      = filter;               // Array.filter() for promises
	when.reduce      = lift(Promise.reduce);       // Array.reduce() for promises
	when.reduceRight = lift(Promise.reduceRight);  // Array.reduceRight() for promises

	when.isPromiseLike = isPromiseLike;      // Is something promise-like, aka thenable

	when.Promise     = Promise;              // Promise constructor
	when.defer       = defer;                // Create a {promise, resolve, reject} tuple

	// Error types

	when.TimeoutError = TimeoutError;

	/**
	 * Get a trusted promise for x, or by transforming x with onFulfilled
	 *
	 * @param {*} x
	 * @param {function?} onFulfilled callback to be called when x is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} onRejected callback to be called when x is
	 *   rejected.
	 * @param {function?} onProgress callback to be called when progress updates
	 *   are issued for x. @deprecated
	 * @returns {Promise} a new promise that will fulfill with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(x, onFulfilled, onRejected, onProgress) {
		var p = Promise.resolve(x);
		if (arguments.length < 2) {
			return p;
		}

		return p.then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Creates a new promise whose fate is determined by resolver.
	 * @param {function} resolver function(resolve, reject, notify)
	 * @returns {Promise} promise whose fate is determine by resolver
	 */
	function promise(resolver) {
		return new Promise(resolver);
	}

	/**
	 * Lift the supplied function, creating a version of f that returns
	 * promises, and accepts promises as arguments.
	 * @param {function} f
	 * @returns {Function} version of f that returns promises
	 */
	function lift(f) {
		return function() {
			for(var i=0, l=arguments.length, a=new Array(l); i<l; ++i) {
				a[i] = arguments[i];
			}
			return apply(f, this, a);
		};
	}

	/**
	 * Call f in a future turn, with the supplied args, and return a promise
	 * for the result.
	 * @param {function} f
	 * @returns {Promise}
	 */
	function attempt(f /*, args... */) {
		/*jshint validthis:true */
		for(var i=0, l=arguments.length-1, a=new Array(l); i<l; ++i) {
			a[i] = arguments[i+1];
		}
		return apply(f, this, a);
	}

	/**
	 * Creates a {promise, resolver} pair, either or both of which
	 * may be given out safely to consumers.
	 * @return {{promise: Promise, resolve: function, reject: function, notify: function}}
	 */
	function defer() {
		return new Deferred();
	}

	function Deferred() {
		var p = Promise._defer();

		function resolve(x) { p._handler.resolve(x); }
		function reject(x) { p._handler.reject(x); }
		function notify(x) { p._handler.notify(x); }

		this.promise = p;
		this.resolve = resolve;
		this.reject = reject;
		this.notify = notify;
		this.resolver = { resolve: resolve, reject: reject, notify: notify };
	}

	/**
	 * Determines if x is promise-like, i.e. a thenable object
	 * NOTE: Will return true for *any thenable object*, and isn't truly
	 * safe, since it may attempt to access the `then` property of x (i.e.
	 *  clever/malicious getters may do weird things)
	 * @param {*} x anything
	 * @returns {boolean} true if x is promise-like
	 */
	function isPromiseLike(x) {
		return x && typeof x.then === 'function';
	}

	/**
	 * Return a promise that will resolve only once all the supplied arguments
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the arguments.
	 * @param {...*} arguments may be a mix of promises and values
	 * @returns {Promise}
	 */
	function join(/* ...promises */) {
		return Promise.all(arguments);
	}

	/**
	 * Return a promise that will fulfill once all input promises have
	 * fulfilled, or reject when any one input promise rejects.
	 * @param {array|Promise} promises array (or promise for an array) of promises
	 * @returns {Promise}
	 */
	function all(promises) {
		return when(promises, Promise.all);
	}

	/**
	 * Return a promise that will always fulfill with an array containing
	 * the outcome states of all input promises.  The returned promise
	 * will only reject if `promises` itself is a rejected promise.
	 * @param {array|Promise} promises array (or promise for an array) of promises
	 * @returns {Promise} promise for array of settled state descriptors
	 */
	function settle(promises) {
		return when(promises, Promise.settle);
	}

	/**
	 * Promise-aware array map function, similar to `Array.prototype.map()`,
	 * but input array may contain promises or values.
	 * @param {Array|Promise} promises array of anything, may contain promises and values
	 * @param {function(x:*, index:Number):*} mapFunc map function which may
	 *  return a promise or value
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function map(promises, mapFunc) {
		return when(promises, function(promises) {
			return Promise.map(promises, mapFunc);
		});
	}

	/**
	 * Filter the provided array of promises using the provided predicate.  Input may
	 * contain promises and values
	 * @param {Array|Promise} promises array of promises and values
	 * @param {function(x:*, index:Number):boolean} predicate filtering predicate.
	 *  Must return truthy (or promise for truthy) for items to retain.
	 * @returns {Promise} promise that will fulfill with an array containing all items
	 *  for which predicate returned truthy.
	 */
	function filter(promises, predicate) {
		return when(promises, function(promises) {
			return Promise.filter(promises, predicate);
		});
	}

	return when;
});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

},{"./lib/Promise":344,"./lib/TimeoutError":346,"./lib/apply":347,"./lib/decorators/array":348,"./lib/decorators/flow":349,"./lib/decorators/fold":350,"./lib/decorators/inspect":351,"./lib/decorators/iterate":352,"./lib/decorators/progress":353,"./lib/decorators/timed":354,"./lib/decorators/unhandledRejection":355,"./lib/decorators/with":356}]},{},[3]);
