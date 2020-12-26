'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var EmbeddedHeadingsExtension = /** @class */ (function () {
    function EmbeddedHeadingsExtension() {
        this.headings = {};
    }
    EmbeddedHeadingsExtension.prototype.removeHeading = function (id, leaf) {
        if (!this.headings[id])
            return;
        var h1Edit = document.getElementById(id + "-edit");
        var h1Preview = document.getElementById(id + "-preview");
        if (h1Edit)
            h1Edit.remove();
        if (h1Preview)
            h1Preview.remove();
        delete this.headings[id];
    };
    EmbeddedHeadingsExtension.prototype.createHeading = function (id, leaf) {
        if (this.headings[id])
            return;
        var header = leaf.view.containerEl.getElementsByClassName("view-header-title");
        var viewContent = leaf.view.containerEl.getElementsByClassName("CodeMirror-scroll");
        var previewContent = leaf.view.containerEl.getElementsByClassName("markdown-preview-view");
        if (header.length && viewContent.length && previewContent.length) {
            var editEl = viewContent[0];
            var h1Edit = document.createElement("h1");
            h1Edit.setText(header[0].innerText);
            h1Edit.id = id + "-edit";
            editEl.prepend(h1Edit);
            var previewEl = previewContent[0];
            var h1Preview = document.createElement("h1");
            h1Preview.setText(header[0].innerText);
            h1Preview.id = id + "-preview";
            previewEl.prepend(h1Preview);
            this.headings[id] = leaf;
        }
    };
    EmbeddedHeadingsExtension.prototype.getLeafId = function (leaf) {
        var viewState = leaf.getViewState();
        if (viewState.type === "markdown") {
            return ("title-" +
                (leaf.id + viewState.state.file).replace(/^[^a-z]+|[^\w:.-]+/gi, ""));
        }
        return null;
    };
    EmbeddedHeadingsExtension.prototype.createHeadings = function (app) {
        var _this = this;
        var seen = {};
        app.workspace.iterateRootLeaves(function (leaf) {
            var id = _this.getLeafId(leaf);
            if (id) {
                _this.createHeading(id, leaf);
                seen[id] = true;
            }
        });
        Object.keys(this.headings).forEach(function (id) {
            if (!seen[id]) {
                _this.removeHeading(id, _this.headings[id]);
            }
        });
    };
    EmbeddedHeadingsExtension.prototype.onload = function () {
        document.body.classList.add("embedded-note-title");
    };
    EmbeddedHeadingsExtension.prototype.onunload = function () {
        var _this = this;
        document.body.classList.remove("embedded-note-title");
        Object.keys(this.headings).forEach(function (id) {
            _this.removeHeading(id, _this.headings[id]);
        });
    };
    return EmbeddedHeadingsExtension;
}());

var paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };

var SPECIAL_SPACES = [
  0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
  0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF
];

function isSpace(ch) {
  return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) || // Line terminators
    // White spaces
    (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
    (ch >= 0x1680 && SPECIAL_SPACES.indexOf(ch) >= 0);
}

function isCommand(code) {
  /*eslint-disable no-bitwise*/
  switch (code | 0x20) {
    case 0x6D/* m */:
    case 0x7A/* z */:
    case 0x6C/* l */:
    case 0x68/* h */:
    case 0x76/* v */:
    case 0x63/* c */:
    case 0x73/* s */:
    case 0x71/* q */:
    case 0x74/* t */:
    case 0x61/* a */:
    case 0x72/* r */:
      return true;
  }
  return false;
}

function isArc(code) {
  return (code | 0x20) === 0x61;
}

function isDigit(code) {
  return (code >= 48 && code <= 57);   // 0..9
}

function isDigitStart(code) {
  return (code >= 48 && code <= 57) || /* 0..9 */
          code === 0x2B || /* + */
          code === 0x2D || /* - */
          code === 0x2E;   /* . */
}


function State(path) {
  this.index  = 0;
  this.path   = path;
  this.max    = path.length;
  this.result = [];
  this.param  = 0.0;
  this.err    = '';
  this.segmentStart = 0;
  this.data   = [];
}

function skipSpaces(state) {
  while (state.index < state.max && isSpace(state.path.charCodeAt(state.index))) {
    state.index++;
  }
}


function scanFlag(state) {
  var ch = state.path.charCodeAt(state.index);

  if (ch === 0x30/* 0 */) {
    state.param = 0;
    state.index++;
    return;
  }

  if (ch === 0x31/* 1 */) {
    state.param = 1;
    state.index++;
    return;
  }

  state.err = 'SvgPath: arc flag can be 0 or 1 only (at pos ' + state.index + ')';
}


function scanParam(state) {
  var start = state.index,
      index = start,
      max = state.max,
      zeroFirst = false,
      hasCeiling = false,
      hasDecimal = false,
      hasDot = false,
      ch;

  if (index >= max) {
    state.err = 'SvgPath: missed param (at pos ' + index + ')';
    return;
  }
  ch = state.path.charCodeAt(index);

  if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
    index++;
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  // This logic is shamelessly borrowed from Esprima
  // https://github.com/ariya/esprimas
  //
  if (!isDigit(ch) && ch !== 0x2E/* . */) {
    state.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
    return;
  }

  if (ch !== 0x2E/* . */) {
    zeroFirst = (ch === 0x30/* 0 */);
    index++;

    ch = (index < max) ? state.path.charCodeAt(index) : 0;

    if (zeroFirst && index < max) {
      // decimal number starts with '0' such as '09' is illegal.
      if (ch && isDigit(ch)) {
        state.err = 'SvgPath: numbers started with `0` such as `09` are illegal (at pos ' + start + ')';
        return;
      }
    }

    while (index < max && isDigit(state.path.charCodeAt(index))) {
      index++;
      hasCeiling = true;
    }
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  if (ch === 0x2E/* . */) {
    hasDot = true;
    index++;
    while (isDigit(state.path.charCodeAt(index))) {
      index++;
      hasDecimal = true;
    }
    ch = (index < max) ? state.path.charCodeAt(index) : 0;
  }

  if (ch === 0x65/* e */ || ch === 0x45/* E */) {
    if (hasDot && !hasCeiling && !hasDecimal) {
      state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      return;
    }

    index++;

    ch = (index < max) ? state.path.charCodeAt(index) : 0;
    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      index++;
    }
    if (index < max && isDigit(state.path.charCodeAt(index))) {
      while (index < max && isDigit(state.path.charCodeAt(index))) {
        index++;
      }
    } else {
      state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      return;
    }
  }

  state.index = index;
  state.param = parseFloat(state.path.slice(start, index)) + 0.0;
}


function finalizeSegment(state) {
  var cmd, cmdLC;

  // Process duplicated commands (without comand name)

  // This logic is shamelessly borrowed from Raphael
  // https://github.com/DmitryBaranovskiy/raphael/
  //
  cmd   = state.path[state.segmentStart];
  cmdLC = cmd.toLowerCase();

  var params = state.data;

  if (cmdLC === 'm' && params.length > 2) {
    state.result.push([ cmd, params[0], params[1] ]);
    params = params.slice(2);
    cmdLC = 'l';
    cmd = (cmd === 'm') ? 'l' : 'L';
  }

  if (cmdLC === 'r') {
    state.result.push([ cmd ].concat(params));
  } else {

    while (params.length >= paramCounts[cmdLC]) {
      state.result.push([ cmd ].concat(params.splice(0, paramCounts[cmdLC])));
      if (!paramCounts[cmdLC]) {
        break;
      }
    }
  }
}


function scanSegment(state) {
  var max = state.max,
      cmdCode, is_arc, comma_found, need_params, i;

  state.segmentStart = state.index;
  cmdCode = state.path.charCodeAt(state.index);
  is_arc = isArc(cmdCode);

  if (!isCommand(cmdCode)) {
    state.err = 'SvgPath: bad command ' + state.path[state.index] + ' (at pos ' + state.index + ')';
    return;
  }

  need_params = paramCounts[state.path[state.index].toLowerCase()];

  state.index++;
  skipSpaces(state);

  state.data = [];

  if (!need_params) {
    // Z
    finalizeSegment(state);
    return;
  }

  comma_found = false;

  for (;;) {
    for (i = need_params; i > 0; i--) {
      if (is_arc && (i === 3 || i === 4)) scanFlag(state);
      else scanParam(state);

      if (state.err.length) {
        return;
      }
      state.data.push(state.param);

      skipSpaces(state);
      comma_found = false;

      if (state.index < max && state.path.charCodeAt(state.index) === 0x2C/* , */) {
        state.index++;
        skipSpaces(state);
        comma_found = true;
      }
    }

    // after ',' param is mandatory
    if (comma_found) {
      continue;
    }

    if (state.index >= state.max) {
      break;
    }

    // Stop on next segment
    if (!isDigitStart(state.path.charCodeAt(state.index))) {
      break;
    }
  }

  finalizeSegment(state);
}


/* Returns array of segments:
 *
 * [
 *   [ command, coord1, coord2, ... ]
 * ]
 */
var path_parse = function pathParse(svgPath) {
  var state = new State(svgPath);
  var max = state.max;

  skipSpaces(state);

  while (state.index < max && !state.err.length) {
    scanSegment(state);
  }

  if (state.err.length) {
    state.result = [];

  } else if (state.result.length) {

    if ('mM'.indexOf(state.result[0][0]) < 0) {
      state.err = 'SvgPath: string should start with `M` or `m`';
      state.result = [];
    } else {
      state.result[0][0] = 'M';
    }
  }

  return {
    err: state.err,
    segments: state.result
  };
};

// combine 2 matrixes
// m1, m2 - [a, b, c, d, e, g]
//
function combine(m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ];
}


function Matrix() {
  if (!(this instanceof Matrix)) { return new Matrix(); }
  this.queue = [];   // list of matrixes to apply
  this.cache = null; // combined matrix cache
}


Matrix.prototype.matrix = function (m) {
  if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0) {
    return this;
  }
  this.cache = null;
  this.queue.push(m);
  return this;
};


Matrix.prototype.translate = function (tx, ty) {
  if (tx !== 0 || ty !== 0) {
    this.cache = null;
    this.queue.push([ 1, 0, 0, 1, tx, ty ]);
  }
  return this;
};


Matrix.prototype.scale = function (sx, sy) {
  if (sx !== 1 || sy !== 1) {
    this.cache = null;
    this.queue.push([ sx, 0, 0, sy, 0, 0 ]);
  }
  return this;
};


Matrix.prototype.rotate = function (angle, rx, ry) {
  var rad, cos, sin;

  if (angle !== 0) {
    this.translate(rx, ry);

    rad = angle * Math.PI / 180;
    cos = Math.cos(rad);
    sin = Math.sin(rad);

    this.queue.push([ cos, sin, -sin, cos, 0, 0 ]);
    this.cache = null;

    this.translate(-rx, -ry);
  }
  return this;
};


Matrix.prototype.skewX = function (angle) {
  if (angle !== 0) {
    this.cache = null;
    this.queue.push([ 1, 0, Math.tan(angle * Math.PI / 180), 1, 0, 0 ]);
  }
  return this;
};


Matrix.prototype.skewY = function (angle) {
  if (angle !== 0) {
    this.cache = null;
    this.queue.push([ 1, Math.tan(angle * Math.PI / 180), 0, 1, 0, 0 ]);
  }
  return this;
};


// Flatten queue
//
Matrix.prototype.toArray = function () {
  if (this.cache) {
    return this.cache;
  }

  if (!this.queue.length) {
    this.cache = [ 1, 0, 0, 1, 0, 0 ];
    return this.cache;
  }

  this.cache = this.queue[0];

  if (this.queue.length === 1) {
    return this.cache;
  }

  for (var i = 1; i < this.queue.length; i++) {
    this.cache = combine(this.cache, this.queue[i]);
  }

  return this.cache;
};


// Apply list of matrixes to (x,y) point.
// If `isRelative` set, `translate` component of matrix will be skipped
//
Matrix.prototype.calc = function (x, y, isRelative) {
  var m;

  // Don't change point on empty transforms queue
  if (!this.queue.length) { return [ x, y ]; }

  // Calculate final matrix, if not exists
  //
  // NB. if you deside to apply transforms to point one-by-one,
  // they should be taken in reverse order

  if (!this.cache) {
    this.cache = this.toArray();
  }

  m = this.cache;

  // Apply matrix to point
  return [
    x * m[0] + y * m[2] + (isRelative ? 0 : m[4]),
    x * m[1] + y * m[3] + (isRelative ? 0 : m[5])
  ];
};


var matrix = Matrix;

var operations = {
  matrix: true,
  scale: true,
  rotate: true,
  translate: true,
  skewX: true,
  skewY: true
};

var CMD_SPLIT_RE    = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/;
var PARAMS_SPLIT_RE = /[\s,]+/;


var transform_parse = function transformParse(transformString) {
  var matrix$1 = new matrix();
  var cmd, params;

  // Split value into ['', 'translate', '10 50', '', 'scale', '2', '', 'rotate',  '-45', '']
  transformString.split(CMD_SPLIT_RE).forEach(function (item) {

    // Skip empty elements
    if (!item.length) { return; }

    // remember operation
    if (typeof operations[item] !== 'undefined') {
      cmd = item;
      return;
    }

    // extract params & att operation to matrix
    params = item.split(PARAMS_SPLIT_RE).map(function (i) {
      return +i || 0;
    });

    // If params count is not correct - ignore command
    switch (cmd) {
      case 'matrix':
        if (params.length === 6) {
          matrix$1.matrix(params);
        }
        return;

      case 'scale':
        if (params.length === 1) {
          matrix$1.scale(params[0], params[0]);
        } else if (params.length === 2) {
          matrix$1.scale(params[0], params[1]);
        }
        return;

      case 'rotate':
        if (params.length === 1) {
          matrix$1.rotate(params[0], 0, 0);
        } else if (params.length === 3) {
          matrix$1.rotate(params[0], params[1], params[2]);
        }
        return;

      case 'translate':
        if (params.length === 1) {
          matrix$1.translate(params[0], 0);
        } else if (params.length === 2) {
          matrix$1.translate(params[0], params[1]);
        }
        return;

      case 'skewX':
        if (params.length === 1) {
          matrix$1.skewX(params[0]);
        }
        return;

      case 'skewY':
        if (params.length === 1) {
          matrix$1.skewY(params[0]);
        }
        return;
    }
  });

  return matrix$1;
};

// Convert an arc to a sequence of cubic bézier curves


var TAU = Math.PI * 2;


/* eslint-disable space-infix-ops */

// Calculate an angle between two unit vectors
//
// Since we measure angle between radii of circular arcs,
// we can use simplified math (without length normalization)
//
function unit_vector_angle(ux, uy, vx, vy) {
  var sign = (ux * vy - uy * vx < 0) ? -1 : 1;
  var dot  = ux * vx + uy * vy;

  // Add this to work with arbitrary vectors:
  // dot /= Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);

  // rounding errors, e.g. -1.0000000000000002 can screw up this
  if (dot >  1.0) { dot =  1.0; }
  if (dot < -1.0) { dot = -1.0; }

  return sign * Math.acos(dot);
}


// Convert from endpoint to center parameterization,
// see http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
//
// Return [cx, cy, theta1, delta_theta]
//
function get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi) {
  // Step 1.
  //
  // Moving an ellipse so origin will be the middlepoint between our two
  // points. After that, rotate it to line up ellipse axes with coordinate
  // axes.
  //
  var x1p =  cos_phi*(x1-x2)/2 + sin_phi*(y1-y2)/2;
  var y1p = -sin_phi*(x1-x2)/2 + cos_phi*(y1-y2)/2;

  var rx_sq  =  rx * rx;
  var ry_sq  =  ry * ry;
  var x1p_sq = x1p * x1p;
  var y1p_sq = y1p * y1p;

  // Step 2.
  //
  // Compute coordinates of the centre of this ellipse (cx', cy')
  // in the new coordinate system.
  //
  var radicant = (rx_sq * ry_sq) - (rx_sq * y1p_sq) - (ry_sq * x1p_sq);

  if (radicant < 0) {
    // due to rounding errors it might be e.g. -1.3877787807814457e-17
    radicant = 0;
  }

  radicant /=   (rx_sq * y1p_sq) + (ry_sq * x1p_sq);
  radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);

  var cxp = radicant *  rx/ry * y1p;
  var cyp = radicant * -ry/rx * x1p;

  // Step 3.
  //
  // Transform back to get centre coordinates (cx, cy) in the original
  // coordinate system.
  //
  var cx = cos_phi*cxp - sin_phi*cyp + (x1+x2)/2;
  var cy = sin_phi*cxp + cos_phi*cyp + (y1+y2)/2;

  // Step 4.
  //
  // Compute angles (theta1, delta_theta).
  //
  var v1x =  (x1p - cxp) / rx;
  var v1y =  (y1p - cyp) / ry;
  var v2x = (-x1p - cxp) / rx;
  var v2y = (-y1p - cyp) / ry;

  var theta1 = unit_vector_angle(1, 0, v1x, v1y);
  var delta_theta = unit_vector_angle(v1x, v1y, v2x, v2y);

  if (fs === 0 && delta_theta > 0) {
    delta_theta -= TAU;
  }
  if (fs === 1 && delta_theta < 0) {
    delta_theta += TAU;
  }

  return [ cx, cy, theta1, delta_theta ];
}

//
// Approximate one unit arc segment with bézier curves,
// see http://math.stackexchange.com/questions/873224
//
function approximate_unit_arc(theta1, delta_theta) {
  var alpha = 4/3 * Math.tan(delta_theta/4);

  var x1 = Math.cos(theta1);
  var y1 = Math.sin(theta1);
  var x2 = Math.cos(theta1 + delta_theta);
  var y2 = Math.sin(theta1 + delta_theta);

  return [ x1, y1, x1 - y1*alpha, y1 + x1*alpha, x2 + y2*alpha, y2 - x2*alpha, x2, y2 ];
}

var a2c = function a2c(x1, y1, x2, y2, fa, fs, rx, ry, phi) {
  var sin_phi = Math.sin(phi * TAU / 360);
  var cos_phi = Math.cos(phi * TAU / 360);

  // Make sure radii are valid
  //
  var x1p =  cos_phi*(x1-x2)/2 + sin_phi*(y1-y2)/2;
  var y1p = -sin_phi*(x1-x2)/2 + cos_phi*(y1-y2)/2;

  if (x1p === 0 && y1p === 0) {
    // we're asked to draw line to itself
    return [];
  }

  if (rx === 0 || ry === 0) {
    // one of the radii is zero
    return [];
  }


  // Compensate out-of-range radii
  //
  rx = Math.abs(rx);
  ry = Math.abs(ry);

  var lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }


  // Get center parameters (cx, cy, theta1, delta_theta)
  //
  var cc = get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi);

  var result = [];
  var theta1 = cc[2];
  var delta_theta = cc[3];

  // Split an arc to multiple segments, so each segment
  // will be less than τ/4 (= 90°)
  //
  var segments = Math.max(Math.ceil(Math.abs(delta_theta) / (TAU / 4)), 1);
  delta_theta /= segments;

  for (var i = 0; i < segments; i++) {
    result.push(approximate_unit_arc(theta1, delta_theta));
    theta1 += delta_theta;
  }

  // We have a bezier approximation of a unit circle,
  // now need to transform back to the original ellipse
  //
  return result.map(function (curve) {
    for (var i = 0; i < curve.length; i += 2) {
      var x = curve[i + 0];
      var y = curve[i + 1];

      // scale
      x *= rx;
      y *= ry;

      // rotate
      var xp = cos_phi*x - sin_phi*y;
      var yp = sin_phi*x + cos_phi*y;

      // translate
      curve[i + 0] = xp + cc[0];
      curve[i + 1] = yp + cc[1];
    }

    return curve;
  });
};

/* eslint-disable space-infix-ops */

// The precision used to consider an ellipse as a circle
//
var epsilon = 0.0000000001;

// To convert degree in radians
//
var torad = Math.PI / 180;

// Class constructor :
//  an ellipse centred at 0 with radii rx,ry and x - axis - angle ax.
//
function Ellipse(rx, ry, ax) {
  if (!(this instanceof Ellipse)) { return new Ellipse(rx, ry, ax); }
  this.rx = rx;
  this.ry = ry;
  this.ax = ax;
}

// Apply a linear transform m to the ellipse
// m is an array representing a matrix :
//    -         -
//   | m[0] m[2] |
//   | m[1] m[3] |
//    -         -
//
Ellipse.prototype.transform = function (m) {
  // We consider the current ellipse as image of the unit circle
  // by first scale(rx,ry) and then rotate(ax) ...
  // So we apply ma =  m x rotate(ax) x scale(rx,ry) to the unit circle.
  var c = Math.cos(this.ax * torad), s = Math.sin(this.ax * torad);
  var ma = [
    this.rx * (m[0]*c + m[2]*s),
    this.rx * (m[1]*c + m[3]*s),
    this.ry * (-m[0]*s + m[2]*c),
    this.ry * (-m[1]*s + m[3]*c)
  ];

  // ma * transpose(ma) = [ J L ]
  //                      [ L K ]
  // L is calculated later (if the image is not a circle)
  var J = ma[0]*ma[0] + ma[2]*ma[2],
      K = ma[1]*ma[1] + ma[3]*ma[3];

  // the discriminant of the characteristic polynomial of ma * transpose(ma)
  var D = ((ma[0]-ma[3])*(ma[0]-ma[3]) + (ma[2]+ma[1])*(ma[2]+ma[1])) *
          ((ma[0]+ma[3])*(ma[0]+ma[3]) + (ma[2]-ma[1])*(ma[2]-ma[1]));

  // the "mean eigenvalue"
  var JK = (J + K) / 2;

  // check if the image is (almost) a circle
  if (D < epsilon * JK) {
    // if it is
    this.rx = this.ry = Math.sqrt(JK);
    this.ax = 0;
    return this;
  }

  // if it is not a circle
  var L = ma[0]*ma[1] + ma[2]*ma[3];

  D = Math.sqrt(D);

  // {l1,l2} = the two eigen values of ma * transpose(ma)
  var l1 = JK + D/2,
      l2 = JK - D/2;
  // the x - axis - rotation angle is the argument of the l1 - eigenvector
  /*eslint-disable indent*/
  this.ax = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ?
    90
  :
    Math.atan(Math.abs(L) > Math.abs(l1 - K) ?
      (l1 - J) / L
    :
      L / (l1 - K)
    ) * 180 / Math.PI;
  /*eslint-enable indent*/

  // if ax > 0 => rx = sqrt(l1), ry = sqrt(l2), else exchange axes and ax += 90
  if (this.ax >= 0) {
    // if ax in [0,90]
    this.rx = Math.sqrt(l1);
    this.ry = Math.sqrt(l2);
  } else {
    // if ax in ]-90,0[ => exchange axes
    this.ax += 90;
    this.rx = Math.sqrt(l2);
    this.ry = Math.sqrt(l1);
  }

  return this;
};

// Check if the ellipse is (almost) degenerate, i.e. rx = 0 or ry = 0
//
Ellipse.prototype.isDegenerate = function () {
  return (this.rx < epsilon * this.ry || this.ry < epsilon * this.rx);
};

var ellipse = Ellipse;

// Class constructor
//
function SvgPath(path) {
  if (!(this instanceof SvgPath)) { return new SvgPath(path); }

  var pstate = path_parse(path);

  // Array of path segments.
  // Each segment is array [command, param1, param2, ...]
  this.segments = pstate.segments;

  // Error message on parse error.
  this.err      = pstate.err;

  // Transforms stack for lazy evaluation
  this.__stack    = [];
}

SvgPath.from = function (src) {
  if (typeof src === 'string') return new SvgPath(src);

  if (src instanceof SvgPath) {
    // Create empty object
    var s = new SvgPath('');

    // Clone properies
    s.err = src.err;
    s.segments = src.segments.map(function (sgm) { return sgm.slice(); });
    s.__stack = src.__stack.map(function (m) {
      return matrix().matrix(m.toArray());
    });

    return s;
  }

  throw new Error('SvgPath.from: invalid param type ' + src);
};


SvgPath.prototype.__matrix = function (m) {
  var self = this, i;

  // Quick leave for empty matrix
  if (!m.queue.length) { return; }

  this.iterate(function (s, index, x, y) {
    var p, result, name, isRelative;

    switch (s[0]) {

      // Process 'assymetric' commands separately
      case 'v':
        p      = m.calc(0, s[1], true);
        result = (p[0] === 0) ? [ 'v', p[1] ] : [ 'l', p[0], p[1] ];
        break;

      case 'V':
        p      = m.calc(x, s[1], false);
        result = (p[0] === m.calc(x, y, false)[0]) ? [ 'V', p[1] ] : [ 'L', p[0], p[1] ];
        break;

      case 'h':
        p      = m.calc(s[1], 0, true);
        result = (p[1] === 0) ? [ 'h', p[0] ] : [ 'l', p[0], p[1] ];
        break;

      case 'H':
        p      = m.calc(s[1], y, false);
        result = (p[1] === m.calc(x, y, false)[1]) ? [ 'H', p[0] ] : [ 'L', p[0], p[1] ];
        break;

      case 'a':
      case 'A':
        // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]

        // Drop segment if arc is empty (end point === start point)
        /*if ((s[0] === 'A' && s[6] === x && s[7] === y) ||
            (s[0] === 'a' && s[6] === 0 && s[7] === 0)) {
          return [];
        }*/

        // Transform rx, ry and the x-axis-rotation
        var ma = m.toArray();
        var e = ellipse(s[1], s[2], s[3]).transform(ma);

        // flip sweep-flag if matrix is not orientation-preserving
        if (ma[0] * ma[3] - ma[1] * ma[2] < 0) {
          s[5] = s[5] ? '0' : '1';
        }

        // Transform end point as usual (without translation for relative notation)
        p = m.calc(s[6], s[7], s[0] === 'a');

        // Empty arcs can be ignored by renderer, but should not be dropped
        // to avoid collisions with `S A S` and so on. Replace with empty line.
        if ((s[0] === 'A' && s[6] === x && s[7] === y) ||
            (s[0] === 'a' && s[6] === 0 && s[7] === 0)) {
          result = [ s[0] === 'a' ? 'l' : 'L', p[0], p[1] ];
          break;
        }

        // if the resulting ellipse is (almost) a segment ...
        if (e.isDegenerate()) {
          // replace the arc by a line
          result = [ s[0] === 'a' ? 'l' : 'L', p[0], p[1] ];
        } else {
          // if it is a real ellipse
          // s[0], s[4] and s[5] are not modified
          result = [ s[0], e.rx, e.ry, e.ax, s[4], s[5], p[0], p[1] ];
        }

        break;

      case 'm':
        // Edge case. The very first `m` should be processed as absolute, if happens.
        // Make sense for coord shift transforms.
        isRelative = index > 0;

        p = m.calc(s[1], s[2], isRelative);
        result = [ 'm', p[0], p[1] ];
        break;

      default:
        name       = s[0];
        result     = [ name ];
        isRelative = (name.toLowerCase() === name);

        // Apply transformations to the segment
        for (i = 1; i < s.length; i += 2) {
          p = m.calc(s[i], s[i + 1], isRelative);
          result.push(p[0], p[1]);
        }
    }

    self.segments[index] = result;
  }, true);
};


// Apply stacked commands
//
SvgPath.prototype.__evaluateStack = function () {
  var m, i;

  if (!this.__stack.length) { return; }

  if (this.__stack.length === 1) {
    this.__matrix(this.__stack[0]);
    this.__stack = [];
    return;
  }

  m = matrix();
  i = this.__stack.length;

  while (--i >= 0) {
    m.matrix(this.__stack[i].toArray());
  }

  this.__matrix(m);
  this.__stack = [];
};


// Convert processed SVG Path back to string
//
SvgPath.prototype.toString = function () {
  var elements = [], skipCmd, cmd;

  this.__evaluateStack();

  for (var i = 0; i < this.segments.length; i++) {
    // remove repeating commands names
    cmd = this.segments[i][0];
    skipCmd = i > 0 && cmd !== 'm' && cmd !== 'M' && cmd === this.segments[i - 1][0];
    elements = elements.concat(skipCmd ? this.segments[i].slice(1) : this.segments[i]);
  }

  return elements.join(' ')
    // Optimizations: remove spaces around commands & before `-`
    //
    // We could also remove leading zeros for `0.5`-like values,
    // but their count is too small to spend time for.
    .replace(/ ?([achlmqrstvz]) ?/gi, '$1')
    .replace(/ \-/g, '-')
    // workaround for FontForge SVG importing bug
    .replace(/zm/g, 'z m');
};


// Translate path to (x [, y])
//
SvgPath.prototype.translate = function (x, y) {
  this.__stack.push(matrix().translate(x, y || 0));
  return this;
};


// Scale path to (sx [, sy])
// sy = sx if not defined
//
SvgPath.prototype.scale = function (sx, sy) {
  this.__stack.push(matrix().scale(sx, (!sy && (sy !== 0)) ? sx : sy));
  return this;
};


// Rotate path around point (sx [, sy])
// sy = sx if not defined
//
SvgPath.prototype.rotate = function (angle, rx, ry) {
  this.__stack.push(matrix().rotate(angle, rx || 0, ry || 0));
  return this;
};


// Skew path along the X axis by `degrees` angle
//
SvgPath.prototype.skewX = function (degrees) {
  this.__stack.push(matrix().skewX(degrees));
  return this;
};


// Skew path along the Y axis by `degrees` angle
//
SvgPath.prototype.skewY = function (degrees) {
  this.__stack.push(matrix().skewY(degrees));
  return this;
};


// Apply matrix transform (array of 6 elements)
//
SvgPath.prototype.matrix = function (m) {
  this.__stack.push(matrix().matrix(m));
  return this;
};


// Transform path according to "transform" attr of SVG spec
//
SvgPath.prototype.transform = function (transformString) {
  if (!transformString.trim()) {
    return this;
  }
  this.__stack.push(transform_parse(transformString));
  return this;
};


// Round coords with given decimal precition.
// 0 by default (to integers)
//
SvgPath.prototype.round = function (d) {
  var contourStartDeltaX = 0, contourStartDeltaY = 0, deltaX = 0, deltaY = 0, l;

  d = d || 0;

  this.__evaluateStack();

  this.segments.forEach(function (s) {
    var isRelative = (s[0].toLowerCase() === s[0]);

    switch (s[0]) {
      case 'H':
      case 'h':
        if (isRelative) { s[1] += deltaX; }
        deltaX = s[1] - s[1].toFixed(d);
        s[1] = +s[1].toFixed(d);
        return;

      case 'V':
      case 'v':
        if (isRelative) { s[1] += deltaY; }
        deltaY = s[1] - s[1].toFixed(d);
        s[1] = +s[1].toFixed(d);
        return;

      case 'Z':
      case 'z':
        deltaX = contourStartDeltaX;
        deltaY = contourStartDeltaY;
        return;

      case 'M':
      case 'm':
        if (isRelative) {
          s[1] += deltaX;
          s[2] += deltaY;
        }

        deltaX = s[1] - s[1].toFixed(d);
        deltaY = s[2] - s[2].toFixed(d);

        contourStartDeltaX = deltaX;
        contourStartDeltaY = deltaY;

        s[1] = +s[1].toFixed(d);
        s[2] = +s[2].toFixed(d);
        return;

      case 'A':
      case 'a':
        // [cmd, rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        if (isRelative) {
          s[6] += deltaX;
          s[7] += deltaY;
        }

        deltaX = s[6] - s[6].toFixed(d);
        deltaY = s[7] - s[7].toFixed(d);

        s[1] = +s[1].toFixed(d);
        s[2] = +s[2].toFixed(d);
        s[3] = +s[3].toFixed(d + 2); // better precision for rotation
        s[6] = +s[6].toFixed(d);
        s[7] = +s[7].toFixed(d);
        return;

      default:
        // a c l q s t
        l = s.length;

        if (isRelative) {
          s[l - 2] += deltaX;
          s[l - 1] += deltaY;
        }

        deltaX = s[l - 2] - s[l - 2].toFixed(d);
        deltaY = s[l - 1] - s[l - 1].toFixed(d);

        s.forEach(function (val, i) {
          if (!i) { return; }
          s[i] = +s[i].toFixed(d);
        });
        return;
    }
  });

  return this;
};


// Apply iterator function to all segments. If function returns result,
// current segment will be replaced to array of returned segments.
// If empty array is returned, current regment will be deleted.
//
SvgPath.prototype.iterate = function (iterator, keepLazyStack) {
  var segments = this.segments,
      replacements = {},
      needReplace = false,
      lastX = 0,
      lastY = 0,
      countourStartX = 0,
      countourStartY = 0;
  var i, j, newSegments;

  if (!keepLazyStack) {
    this.__evaluateStack();
  }

  segments.forEach(function (s, index) {

    var res = iterator(s, index, lastX, lastY);

    if (Array.isArray(res)) {
      replacements[index] = res;
      needReplace = true;
    }

    var isRelative = (s[0] === s[0].toLowerCase());

    // calculate absolute X and Y
    switch (s[0]) {
      case 'm':
      case 'M':
        lastX = s[1] + (isRelative ? lastX : 0);
        lastY = s[2] + (isRelative ? lastY : 0);
        countourStartX = lastX;
        countourStartY = lastY;
        return;

      case 'h':
      case 'H':
        lastX = s[1] + (isRelative ? lastX : 0);
        return;

      case 'v':
      case 'V':
        lastY = s[1] + (isRelative ? lastY : 0);
        return;

      case 'z':
      case 'Z':
        // That make sence for multiple contours
        lastX = countourStartX;
        lastY = countourStartY;
        return;

      default:
        lastX = s[s.length - 2] + (isRelative ? lastX : 0);
        lastY = s[s.length - 1] + (isRelative ? lastY : 0);
    }
  });

  // Replace segments if iterator return results

  if (!needReplace) { return this; }

  newSegments = [];

  for (i = 0; i < segments.length; i++) {
    if (typeof replacements[i] !== 'undefined') {
      for (j = 0; j < replacements[i].length; j++) {
        newSegments.push(replacements[i][j]);
      }
    } else {
      newSegments.push(segments[i]);
    }
  }

  this.segments = newSegments;

  return this;
};


// Converts segments from relative to absolute
//
SvgPath.prototype.abs = function () {

  this.iterate(function (s, index, x, y) {
    var name = s[0],
        nameUC = name.toUpperCase(),
        i;

    // Skip absolute commands
    if (name === nameUC) { return; }

    s[0] = nameUC;

    switch (name) {
      case 'v':
        // v has shifted coords parity
        s[1] += y;
        return;

      case 'a':
        // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        // touch x, y only
        s[6] += x;
        s[7] += y;
        return;

      default:
        for (i = 1; i < s.length; i++) {
          s[i] += i % 2 ? x : y; // odd values are X, even - Y
        }
    }
  }, true);

  return this;
};


// Converts segments from absolute to relative
//
SvgPath.prototype.rel = function () {

  this.iterate(function (s, index, x, y) {
    var name = s[0],
        nameLC = name.toLowerCase(),
        i;

    // Skip relative commands
    if (name === nameLC) { return; }

    // Don't touch the first M to avoid potential confusions.
    if (index === 0 && name === 'M') { return; }

    s[0] = nameLC;

    switch (name) {
      case 'V':
        // V has shifted coords parity
        s[1] -= y;
        return;

      case 'A':
        // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        // touch x, y only
        s[6] -= x;
        s[7] -= y;
        return;

      default:
        for (i = 1; i < s.length; i++) {
          s[i] -= i % 2 ? x : y; // odd values are X, even - Y
        }
    }
  }, true);

  return this;
};


// Converts arcs to cubic bézier curves
//
SvgPath.prototype.unarc = function () {
  this.iterate(function (s, index, x, y) {
    var new_segments, nextX, nextY, result = [], name = s[0];

    // Skip anything except arcs
    if (name !== 'A' && name !== 'a') { return null; }

    if (name === 'a') {
      // convert relative arc coordinates to absolute
      nextX = x + s[6];
      nextY = y + s[7];
    } else {
      nextX = s[6];
      nextY = s[7];
    }

    new_segments = a2c(x, y, nextX, nextY, s[4], s[5], s[1], s[2], s[3]);

    // Degenerated arcs can be ignored by renderer, but should not be dropped
    // to avoid collisions with `S A S` and so on. Replace with empty line.
    if (new_segments.length === 0) {
      return [ [ s[0] === 'a' ? 'l' : 'L', s[6], s[7] ] ];
    }

    new_segments.forEach(function (s) {
      result.push([ 'C', s[2], s[3], s[4], s[5], s[6], s[7] ]);
    });

    return result;
  });

  return this;
};


// Converts smooth curves (with missed control point) to generic curves
//
SvgPath.prototype.unshort = function () {
  var segments = this.segments;
  var prevControlX, prevControlY, prevSegment;
  var curControlX, curControlY;

  // TODO: add lazy evaluation flag when relative commands supported

  this.iterate(function (s, idx, x, y) {
    var name = s[0], nameUC = name.toUpperCase(), isRelative;

    // First command MUST be M|m, it's safe to skip.
    // Protect from access to [-1] for sure.
    if (!idx) { return; }

    if (nameUC === 'T') { // quadratic curve
      isRelative = (name === 't');

      prevSegment = segments[idx - 1];

      if (prevSegment[0] === 'Q') {
        prevControlX = prevSegment[1] - x;
        prevControlY = prevSegment[2] - y;
      } else if (prevSegment[0] === 'q') {
        prevControlX = prevSegment[1] - prevSegment[3];
        prevControlY = prevSegment[2] - prevSegment[4];
      } else {
        prevControlX = 0;
        prevControlY = 0;
      }

      curControlX = -prevControlX;
      curControlY = -prevControlY;

      if (!isRelative) {
        curControlX += x;
        curControlY += y;
      }

      segments[idx] = [
        isRelative ? 'q' : 'Q',
        curControlX, curControlY,
        s[1], s[2]
      ];

    } else if (nameUC === 'S') { // cubic curve
      isRelative = (name === 's');

      prevSegment = segments[idx - 1];

      if (prevSegment[0] === 'C') {
        prevControlX = prevSegment[3] - x;
        prevControlY = prevSegment[4] - y;
      } else if (prevSegment[0] === 'c') {
        prevControlX = prevSegment[3] - prevSegment[5];
        prevControlY = prevSegment[4] - prevSegment[6];
      } else {
        prevControlX = 0;
        prevControlY = 0;
      }

      curControlX = -prevControlX;
      curControlY = -prevControlY;

      if (!isRelative) {
        curControlX += x;
        curControlY += y;
      }

      segments[idx] = [
        isRelative ? 'c' : 'C',
        curControlX, curControlY,
        s[1], s[2], s[3], s[4]
      ];
    }
  });

  return this;
};


var svgpath = SvgPath;

var svgpath$1 = svgpath;

function scale(path, from, to) {
    if (typeof path === "string") {
        return "<path d=\"" + svgpath$1(path).scale(to / from) + "\" />";
    }
    return "<path " + Object.keys(path)
        .map(function (k) {
        return k + "=\"" + (k === "d"
            ? svgpath$1(path[k]).scale(to / from)
            : path[k]) + "\"";
    })
        .join(" ") + " />";
}
var icons = {
    "any-key": "",
    "audio-file": "",
    blocks: "",
    "broken-link": "M16.949 14.121L19.071 12c1.948-1.949 1.948-5.122 0-7.071-1.95-1.95-5.123-1.948-7.071 0l-.707.707 1.414 1.414.707-.707c1.169-1.167 3.072-1.169 4.243 0 1.169 1.17 1.169 3.073 0 4.243l-2.122 2.121c-.247.247-.534.435-.844.57L13.414 12l1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465-.235 0-.464.032-.691.066L3.707 2.293 2.293 3.707l18 18 1.414-1.414-5.536-5.536C16.448 14.573 16.709 14.361 16.949 14.121zM10.586 17.657c-1.169 1.167-3.072 1.169-4.243 0-1.169-1.17-1.169-3.073 0-4.243l1.476-1.475-1.414-1.414L4.929 12c-1.948 1.949-1.948 5.122 0 7.071.975.975 2.255 1.462 3.535 1.462 1.281 0 2.562-.487 3.536-1.462l.707-.707-1.414-1.414L10.586 17.657z",
    "bullet-list": "M4 6H6V8H4zM4 11H6V13H4zM4 16H6V18H4zM20 8L20 6 18.8 6 9.2 6 8.023 6 8.023 8 9.2 8 18.8 8zM8 11H20V13H8zM8 16H20V18H8z",
    "calendar-with-checkmark": [
        "M19,4h-2V2h-2v2H9V2H7v2H5C3.897,4,3,4.897,3,6v2v12c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2V8V6 C21,4.897,20.103,4,19,4z M19.002,20H5V8h14L19.002,20z",
        "M11 17.414L16.707 11.707 15.293 10.293 11 14.586 8.707 12.293 7.293 13.707z",
    ],
    "check-in-circle": "M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z",
    "check-small": "M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z",
    checkmark: "M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z",
    "create-new": ["M13 7L11 7 11 11 7 11 7 13 11 13 11 17 13 17 13 13 17 13 17 11 13 11z",
        "M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10c5.514,0,10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8 s3.589-8,8-8s8,3.589,8,8S16.411,20,12,20z",],
    "cross-in-box": "M9.172 16.242L12 13.414 14.828 16.242 16.242 14.828 13.414 12 16.242 9.172 14.828 7.758 12 10.586 9.172 7.758 7.758 9.172 10.586 12 7.758 14.828z",
    cross: "M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z",
    "crossed-star": "M5.025,20.775c-0.092,0.399,0.068,0.814,0.406,1.047C5.603,21.94,5.801,22,6,22c0.193,0,0.387-0.056,0.555-0.168L12,18.202 l5.445,3.63c0.348,0.232,0.804,0.223,1.145-0.024c0.338-0.247,0.487-0.68,0.372-1.082l-1.829-6.4l4.536-4.082 c0.297-0.267,0.406-0.686,0.278-1.064c-0.129-0.378-0.47-0.645-0.868-0.676L15.378,8.05l-2.467-5.461C12.75,2.23,12.393,2,12,2 s-0.75,0.23-0.911,0.588L8.622,8.05L2.921,8.503C2.529,8.534,2.192,8.791,2.06,9.16c-0.134,0.369-0.038,0.782,0.242,1.056 l4.214,4.107L5.025,20.775z M12,5.429l2.042,4.521l0.588,0.047c0.001,0,0.001,0,0.001,0l3.972,0.315l-3.271,2.944 c-0.001,0.001-0.001,0.001-0.001,0.002l-0.463,0.416l0.171,0.597c0,0,0,0.002,0,0.003l1.253,4.385L12,15.798V5.429z",
    dice: "M19,3H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2V5C21,3.897,20.103,3,19,3z M5,19V5h14 l0.002,14H5z",
    document: "M19.937,8.68c-0.011-0.032-0.02-0.063-0.033-0.094c-0.049-0.106-0.11-0.207-0.196-0.293l-6-6 c-0.086-0.086-0.187-0.147-0.293-0.196c-0.03-0.014-0.062-0.022-0.094-0.033c-0.084-0.028-0.17-0.046-0.259-0.051 C13.04,2.011,13.021,2,13,2H6C4.897,2,4,2.897,4,4v16c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2V9 c0-0.021-0.011-0.04-0.013-0.062C19.982,8.85,19.965,8.764,19.937,8.68z M16.586,8H14V5.414L16.586,8z M6,20V4h6v5 c0,0.553,0.447,1,1,1h5l0.002,10H6z",
    documents: ["M20,2H10C8.897,2,8,2.897,8,4v4H4c-1.103,0-2,0.897-2,2v10c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2v-4h4 c1.103,0,2-0.897,2-2V4C22,2.897,21.103,2,20,2z M4,20V10h10l0.002,10H4z M20,14h-4v-4c0-1.103-0.897-2-2-2h-4V4h10V14z",
        "M6 12H12V14H6zM6 16H12V18H6z",],
    "dot-network": "M19.5,3C18.121,3,17,4.121,17,5.5c0,0.357,0.078,0.696,0.214,1.005l-1.955,2.199C14.615,8.262,13.839,8,13,8 c-0.74,0-1.424,0.216-2.019,0.566L8.707,6.293L8.684,6.316C8.88,5.918,9,5.475,9,5c0-1.657-1.343-3-3-3S3,3.343,3,5s1.343,3,3,3 c0.475,0,0.917-0.12,1.316-0.316L7.293,7.707L9.567,9.98C9.215,10.576,9,11.261,9,12c0,0.997,0.38,1.899,0.985,2.601l-2.577,2.576 C7.126,17.066,6.821,17,6.5,17C5.122,17,4,18.121,4,19.5S5.122,22,6.5,22S9,20.879,9,19.5c0-0.321-0.066-0.626-0.177-0.909 l2.838-2.838C12.082,15.903,12.528,16,13,16c2.206,0,4-1.794,4-4c0-0.636-0.163-1.229-0.428-1.764l2.117-2.383 C18.945,7.941,19.215,8,19.5,8C20.879,8,22,6.879,22,5.5S20.879,3,19.5,3z M13,14c-1.103,0-2-0.897-2-2s0.897-2,2-2 c1.103,0,2,0.897,2,2S14.103,14,13,14z",
    enter: "",
    "expand-vertically": "M7 17L12 22 17 17 13 17 13 7 17 7 12 2 7 7 11 7 11 17z",
    "filled-pin": "M15,11.586V6h2V4c0-1.104-0.896-2-2-2H9C7.896,2,7,2.896,7,4v2h2v5.586l-2.707,1.707C6.105,13.48,6,13.734,6,14v2 c0,0.553,0.448,1,1,1h2h2v3l1,2l1-2v-3h4c0.553,0,1-0.447,1-1v-2c0-0.266-0.105-0.52-0.293-0.707L15,11.586z",
    folder: "M20,5h-8.586L9.707,3.293C9.52,3.105,9.265,3,9,3H4C2.897,3,2,3.897,2,5v14c0,1.103,0.897,2,2,2h16c1.103,0,2-0.897,2-2V7 C22,5.897,21.103,5,20,5z M4,19V7h7h1h8l0.002,12H4z",
    "forward-arrow": "M10.707 17.707L16.414 12 10.707 6.293 9.293 7.707 13.586 12 9.293 16.293z",
    gear: ["M12,16c2.206,0,4-1.794,4-4s-1.794-4-4-4s-4,1.794-4,4S9.794,16,12,16z M12,10c1.084,0,2,0.916,2,2s-0.916,2-2,2 s-2-0.916-2-2S10.916,10,12,10z",
        "M2.845,16.136l1,1.73c0.531,0.917,1.809,1.261,2.73,0.73l0.529-0.306C7.686,18.747,8.325,19.122,9,19.402V20 c0,1.103,0.897,2,2,2h2c1.103,0,2-0.897,2-2v-0.598c0.675-0.28,1.314-0.655,1.896-1.111l0.529,0.306 c0.923,0.53,2.198,0.188,2.731-0.731l0.999-1.729c0.552-0.955,0.224-2.181-0.731-2.732l-0.505-0.292C19.973,12.742,20,12.371,20,12 s-0.027-0.743-0.081-1.111l0.505-0.292c0.955-0.552,1.283-1.777,0.731-2.732l-0.999-1.729c-0.531-0.92-1.808-1.265-2.731-0.732 l-0.529,0.306C16.314,5.253,15.675,4.878,15,4.598V4c0-1.103-0.897-2-2-2h-2C9.897,2,9,2.897,9,4v0.598 c-0.675,0.28-1.314,0.655-1.896,1.111L6.575,5.403c-0.924-0.531-2.2-0.187-2.731,0.732L2.845,7.864 c-0.552,0.955-0.224,2.181,0.731,2.732l0.505,0.292C4.027,11.257,4,11.629,4,12s0.027,0.742,0.081,1.111l-0.505,0.292 C2.621,13.955,2.293,15.181,2.845,16.136z M6.171,13.378C6.058,12.925,6,12.461,6,12c0-0.462,0.058-0.926,0.17-1.378 c0.108-0.433-0.083-0.885-0.47-1.108L4.577,8.864l0.998-1.729L6.72,7.797c0.384,0.221,0.867,0.165,1.188-0.142 c0.683-0.647,1.507-1.131,2.384-1.399C10.713,6.128,11,5.739,11,5.3V4h2v1.3c0,0.439,0.287,0.828,0.708,0.956 c0.877,0.269,1.701,0.752,2.384,1.399c0.321,0.307,0.806,0.362,1.188,0.142l1.144-0.661l1,1.729L18.3,9.514 c-0.387,0.224-0.578,0.676-0.47,1.108C17.942,11.074,18,11.538,18,12c0,0.461-0.058,0.925-0.171,1.378 c-0.107,0.433,0.084,0.885,0.471,1.108l1.123,0.649l-0.998,1.729l-1.145-0.661c-0.383-0.221-0.867-0.166-1.188,0.142 c-0.683,0.647-1.507,1.131-2.384,1.399C13.287,17.872,13,18.261,13,18.7l0.002,1.3H11v-1.3c0-0.439-0.287-0.828-0.708-0.956 c-0.877-0.269-1.701-0.752-2.384-1.399c-0.19-0.182-0.438-0.275-0.688-0.275c-0.172,0-0.344,0.044-0.5,0.134l-1.144,0.662l-1-1.729 L5.7,14.486C6.087,14.263,6.278,13.811,6.171,13.378z",],
    "go-to-file": "M13.707,2.293C13.52,2.105,13.266,2,13,2H6C4.897,2,4,2.897,4,4v16c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2V9 c0-0.266-0.105-0.52-0.293-0.707L13.707,2.293z M6,4h6.586L18,9.414l0.002,9.174l-2.568-2.568C15.784,15.425,16,14.739,16,14 c0-2.206-1.794-4-4-4s-4,1.794-4,4s1.794,4,4,4c0.739,0,1.425-0.216,2.02-0.566L16.586,20H6V4z M12,16c-1.103,0-2-0.897-2-2 s0.897-2,2-2s2,0.897,2,2S13.103,16,12,16z",
    hashtag: "M16.018,3.815L15.232,8h-4.966l0.716-3.815L9.018,3.815L8.232,8H4v2h3.857l-0.751,4H3v2h3.731l-0.714,3.805l1.965,0.369 L8.766,16h4.966l-0.714,3.805l1.965,0.369L15.766,16H20v-2h-3.859l0.751-4H21V8h-3.733l0.716-3.815L16.018,3.815z M14.106,14H9.141 l0.751-4h4.966L14.106,14z",
    help: ["M12 6C9.831 6 8.066 7.765 8.066 9.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626-.255.207-.496.404-.691.599C11.029 13.156 11 14.215 11 14.333V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182C15.934 7.765 14.169 6 12 6zM11 16H13V18H11z",
        "M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z",],
    "horizontal-split": "M17 11L7 11 7 7 2 12 7 17 7 13 17 13 17 17 22 12 17 7z",
    "image-file": ["M20,2H8C6.897,2,6,2.897,6,4v12c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2V4C22,2.897,21.103,2,20,2z M8,16V4h12 l0.002,12H8z",
        "M4,8H2v12c0,1.103,0.897,2,2,2h12v-2H4V8z",
        "M12 12L11 11 9 14 19 14 15 8z",],
    info: "M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z",
    install: "",
    languages: "",
    "left-arrow-with-tail": "M13.293 6.293L7.586 12 13.293 17.707 14.707 16.293 10.414 12 14.707 7.707z",
    "left-arrow": "M13.293 6.293L7.586 12 13.293 17.707 14.707 16.293 10.414 12 14.707 7.707z",
    "lines-of-text": "M20,3H4C2.897,3,2,3.897,2,5v11c0,1.103,0.897,2,2,2h7v2H8v2h3h2h3v-2h-3v-2h7c1.103,0,2-0.897,2-2V5 C22,3.897,21.103,3,20,3z M4,14V5h16l0.002,9H4z",
    link: [
        "M8.465,11.293c1.133-1.133,3.109-1.133,4.242,0L13.414,12l1.414-1.414l-0.707-0.707c-0.943-0.944-2.199-1.465-3.535-1.465 S7.994,8.935,7.051,9.879L4.929,12c-1.948,1.949-1.948,5.122,0,7.071c0.975,0.975,2.255,1.462,3.535,1.462 c1.281,0,2.562-0.487,3.536-1.462l0.707-0.707l-1.414-1.414l-0.707,0.707c-1.17,1.167-3.073,1.169-4.243,0 c-1.169-1.17-1.169-3.073,0-4.243L8.465,11.293z",
        "M12,4.929l-0.707,0.707l1.414,1.414l0.707-0.707c1.169-1.167,3.072-1.169,4.243,0c1.169,1.17,1.169,3.073,0,4.243 l-2.122,2.121c-1.133,1.133-3.109,1.133-4.242,0L10.586,12l-1.414,1.414l0.707,0.707c0.943,0.944,2.199,1.465,3.535,1.465 s2.592-0.521,3.535-1.465L19.071,12c1.948-1.949,1.948-5.122,0-7.071C17.121,2.979,13.948,2.98,12,4.929z",
    ],
    "magnifying-glass": "M19.023,16.977c-0.513-0.488-1.004-0.997-1.367-1.384c-0.372-0.378-0.596-0.653-0.596-0.653l-2.8-1.337 C15.34,12.37,16,10.763,16,9c0-3.859-3.14-7-7-7S2,5.141,2,9s3.14,7,7,7c1.763,0,3.37-0.66,4.603-1.739l1.337,2.8 c0,0,0.275,0.224,0.653,0.596c0.387,0.363,0.896,0.854,1.384,1.367c0.494,0.506,0.988,1.012,1.358,1.392 c0.362,0.388,0.604,0.646,0.604,0.646l2.121-2.121c0,0-0.258-0.242-0.646-0.604C20.035,17.965,19.529,17.471,19.023,16.977z M9,14 c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S11.757,14,9,14z",
    "microphone-filled": "M12,16c2.206,0,4-1.794,4-4V6c0-2.217-1.785-4.021-3.979-4.021c-0.069,0-0.14,0.009-0.209,0.025C9.693,2.104,8,3.857,8,6v6 C8,14.206,9.794,16,12,16z",
    microphone: "M16,12V6c0-2.217-1.785-4.021-3.979-4.021c-0.069,0-0.14,0.009-0.209,0.025C9.693,2.104,8,3.857,8,6v6c0,2.206,1.794,4,4,4 S16,14.206,16,12z M10,12V6c0-1.103,0.897-2,2-2c0.055,0,0.109-0.005,0.163-0.015C13.188,4.06,14,4.935,14,6v6c0,1.103-0.897,2-2,2 S10,13.103,10,12z",
    "open-vault": "M19,2.01H6c-1.206,0-3,0.799-3,3v3v6v3v2c0,2.201,1.794,3,3,3h15v-2H6.012C5.55,19.998,5,19.815,5,19.01 c0-0.101,0.009-0.191,0.024-0.273c0.112-0.575,0.583-0.717,0.987-0.727H20c0.018,0,0.031-0.009,0.049-0.01H21v-0.99V15V4.01 C21,2.907,20.103,2.01,19,2.01z M19,16.01H5v-2v-6v-3c0-0.806,0.55-0.988,1-1h7v7l2-1l2,1v-7h2V15V16.01z",
    "pane-layout": "",
    "paper-plane": "M20.563,3.34c-0.292-0.199-0.667-0.229-0.989-0.079l-17,8C2.219,11.429,1.995,11.788,2,12.18 c0.006,0.392,0.24,0.745,0.6,0.902L8,15.445v6.722l5.836-4.168l4.764,2.084c0.128,0.057,0.265,0.084,0.4,0.084 c0.181,0,0.36-0.049,0.52-0.146c0.278-0.169,0.457-0.463,0.479-0.788l1-15C21.021,3.879,20.856,3.54,20.563,3.34z M18.097,17.68 l-5.269-2.306L16,9.167l-7.649,4.25l-2.932-1.283L18.89,5.794L18.097,17.68z",
    paused: "",
    "pdf-file": "M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651C8.971 14.9 8.717 14.68 8.267 14.68zM11.754 14.692c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396C13.015 15.13 12.53 14.692 11.754 14.692z",
    pencil: "M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zM16.045 4.401l1.587 1.585-1.59 1.584-1.586-1.585L16.045 4.401zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zM4 20H20V22H4z",
    pin: "M12,22l1-2v-3h5c0.553,0,1-0.447,1-1v-1.586c0-0.526-0.214-1.042-0.586-1.414L17,11.586V8c0.553,0,1-0.447,1-1V4 c0-1.103-0.897-2-2-2H8C6.897,2,6,2.897,6,4v3c0,0.553,0.448,1,1,1v3.586L5.586,13C5.213,13.372,5,13.888,5,14.414V16 c0,0.553,0.448,1,1,1h5v3L12,22z M8,4h8v2H8V4z M7,14.414l1.707-1.707C8.895,12.52,9,12.266,9,12V8h6v4 c0,0.266,0.105,0.52,0.293,0.707L17,14.414V15H7V14.414z",
    "popup-open": ["M20,3H4C2.897,3,2,3.897,2,5v14c0,1.103,0.897,2,2,2h5v-2H4V7h16v12h-5v2h5c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z",
        "M13 21L13 16 16 16 12 11 8 16 11 16 11 21z",],
    presentation: "",
    reset: ["M12,16c1.671,0,3-1.331,3-3s-1.329-3-3-3s-3,1.331-3,3S10.329,16,12,16z",
        "M20.817,11.186c-0.12-0.583-0.297-1.151-0.525-1.688c-0.225-0.532-0.504-1.046-0.83-1.531 c-0.324-0.479-0.693-0.926-1.098-1.329c-0.404-0.406-0.853-0.776-1.332-1.101c-0.483-0.326-0.998-0.604-1.528-0.829 c-0.538-0.229-1.106-0.405-1.691-0.526c-0.6-0.123-1.219-0.182-1.838-0.18V2L8,5l3.975,3V6.002C12.459,6,12.943,6.046,13.41,6.142 c0.454,0.094,0.896,0.231,1.314,0.409c0.413,0.174,0.813,0.392,1.188,0.644c0.373,0.252,0.722,0.54,1.038,0.857 c0.315,0.314,0.604,0.663,0.854,1.035c0.254,0.376,0.471,0.776,0.646,1.191c0.178,0.417,0.314,0.859,0.408,1.311 C18.952,12.048,19,12.523,19,13s-0.048,0.952-0.142,1.41c-0.094,0.454-0.23,0.896-0.408,1.315 c-0.175,0.413-0.392,0.813-0.644,1.188c-0.253,0.373-0.542,0.722-0.858,1.039c-0.315,0.316-0.663,0.603-1.036,0.854 c-0.372,0.251-0.771,0.468-1.189,0.645c-0.417,0.177-0.858,0.314-1.311,0.408c-0.92,0.188-1.906,0.188-2.822,0 c-0.454-0.094-0.896-0.231-1.314-0.409c-0.416-0.176-0.815-0.393-1.189-0.645c-0.371-0.25-0.719-0.538-1.035-0.854 c-0.315-0.316-0.604-0.665-0.855-1.036c-0.254-0.376-0.471-0.776-0.646-1.19c-0.178-0.418-0.314-0.86-0.408-1.312 C5.048,13.952,5,13.477,5,13H3c0,0.611,0.062,1.221,0.183,1.814c0.12,0.582,0.297,1.15,0.525,1.689 c0.225,0.532,0.504,1.046,0.831,1.531c0.323,0.477,0.692,0.924,1.097,1.329c0.406,0.407,0.854,0.777,1.331,1.099 c0.479,0.325,0.994,0.604,1.529,0.83c0.538,0.229,1.106,0.405,1.691,0.526C10.779,21.938,11.389,22,12,22s1.221-0.062,1.814-0.183 c0.583-0.121,1.151-0.297,1.688-0.525c0.537-0.227,1.052-0.506,1.53-0.83c0.478-0.322,0.926-0.692,1.331-1.099 c0.405-0.405,0.774-0.853,1.1-1.332c0.325-0.483,0.604-0.998,0.829-1.528c0.229-0.54,0.405-1.108,0.525-1.692 C20.938,14.221,21,13.611,21,13S20.938,11.779,20.817,11.186z",],
    "right-arrow-with-tail": "M10.707 17.707L16.414 12 10.707 6.293 9.293 7.707 13.586 12 9.293 16.293z",
    "right-arrow": "M10.707 17.707L16.414 12 10.707 6.293 9.293 7.707 13.586 12 9.293 16.293z",
    "right-triangle": "M10.707 17.707L16.414 12 10.707 6.293 9.293 7.707 13.586 12 9.293 16.293z",
    search: "M19.023,16.977c-0.513-0.488-1.004-0.997-1.367-1.384c-0.372-0.378-0.596-0.653-0.596-0.653l-2.8-1.337 C15.34,12.37,16,10.763,16,9c0-3.859-3.14-7-7-7S2,5.141,2,9s3.14,7,7,7c1.763,0,3.37-0.66,4.603-1.739l1.337,2.8 c0,0,0.275,0.224,0.653,0.596c0.387,0.363,0.896,0.854,1.384,1.367c0.494,0.506,0.988,1.012,1.358,1.392 c0.362,0.388,0.604,0.646,0.604,0.646l2.121-2.121c0,0-0.258-0.242-0.646-0.604C20.035,17.965,19.529,17.471,19.023,16.977z M9,14 c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S11.757,14,9,14z",
    "sheets-in-box": "",
    "star-list": "M19 15L19 12 17 12 17 15 14.78 15 14 15 14 17 14.78 17 17 17 17 20 19 20 19 17 21.063 17 22 17 22 15 21.063 15zM4 7H15V9H4zM4 11H15V13H4zM4 15H12V17H4z",
    star: "M6.516,14.323l-1.49,6.452c-0.092,0.399,0.068,0.814,0.406,1.047C5.603,21.94,5.801,22,6,22 c0.193,0,0.387-0.056,0.555-0.168L12,18.202l5.445,3.63c0.348,0.232,0.805,0.223,1.145-0.024c0.338-0.247,0.487-0.68,0.372-1.082 l-1.829-6.4l4.536-4.082c0.297-0.268,0.406-0.686,0.278-1.064c-0.129-0.378-0.47-0.644-0.868-0.676L15.378,8.05l-2.467-5.461 C12.75,2.23,12.393,2,12,2s-0.75,0.23-0.911,0.589L8.622,8.05L2.921,8.503C2.529,8.534,2.192,8.791,2.06,9.16 c-0.134,0.369-0.038,0.782,0.242,1.056L6.516,14.323z M9.369,9.997c0.363-0.029,0.683-0.253,0.832-0.586L12,5.43l1.799,3.981 c0.149,0.333,0.469,0.557,0.832,0.586l3.972,0.315l-3.271,2.944c-0.284,0.256-0.397,0.65-0.293,1.018l1.253,4.385l-3.736-2.491 c-0.336-0.225-0.773-0.225-1.109,0l-3.904,2.603l1.05-4.546c0.078-0.34-0.026-0.697-0.276-0.94l-3.038-2.962L9.369,9.997z",
    switch: "",
    "sync-small": "",
    sync: "",
    "three-horizontal-bars": "M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z",
    trash: [
        {
            fill: "none",
            d: "M17.004 20L17.003 8h-1-8-1v12H17.004zM13.003 10h2v8h-2V10zM9.003 10h2v8h-2V10zM9.003 4H15.003V6H9.003z",
        },
        "M5.003,20c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2V8h2V6h-3h-1V4c0-1.103-0.897-2-2-2h-6c-1.103,0-2,0.897-2,2v2h-1h-3 v2h2V20z M9.003,4h6v2h-6V4z M8.003,8h8h1l0.001,12H7.003V8H8.003z",
        "M9.003 10H11.003V18H9.003zM13.003 10H15.003V18H13.003z",
    ],
    "two-columns": "",
    "up-and-down-arrows": "M7 20L9 20 9 8 12 8 8 4 4 8 7 8zM20 16L17 16 17 4 15 4 15 16 12 16 16 20z",
    "uppercase-lowercase-a": "M22 6L19 2 16 6 18 6 18 10 16 10 19 14 22 10 20 10 20 6zM9.307 4l-6 16h2.137l1.875-5h6.363l1.875 5h2.137l-6-16H9.307zM8.068 13L10.5 6.515 12.932 13H8.068z",
    vault: "M19,2.01H6c-1.206,0-3,0.799-3,3v3v6v3v2c0,2.201,1.794,3,3,3h15v-2H6.012C5.55,19.998,5,19.815,5,19.01 c0-0.101,0.009-0.191,0.024-0.273c0.112-0.575,0.583-0.717,0.987-0.727H20c0.018,0,0.031-0.009,0.049-0.01H21v-0.99V15V4.01 C21,2.907,20.103,2.01,19,2.01z M19,16.01H5v-2v-6v-3c0-0.806,0.55-0.988,1-1h7v7l2-1l2,1v-7h2V15V16.01z",
    "vertical-split": "M7 17L12 22 17 17 13 17 13 7 17 7 12 2 7 7 11 7 11 17z",
    "vertical-three-dots": "M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S13.1 10 12 10zM12 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S13.1 4 12 4zM12 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S13.1 16 12 16z",
};
var from = 24;
var to = 100;
function initIcons() {
    Object.keys(icons).forEach(function (icon) {
        var path = icons[icon];
        if (Array.isArray(path)) {
            obsidian.addIcon(icon, path.map(function (p) { return scale(p, from, to); }).join(""));
        }
        else if (path !== "") {
            obsidian.addIcon(icon, scale(path, from, to));
        }
    });
}

initIcons();
var config = {
    attributes: false,
    childList: true,
    subtree: false,
};
function tagNode(node) {
    if (node.nodeType === 3) {
        return;
    }
    var nodeEl = node;
    if (!nodeEl.dataset.tagName &&
        nodeEl.hasChildNodes() &&
        nodeEl.firstChild.nodeType !== 3) {
        var childEl = node.firstChild;
        nodeEl.dataset.tagName = childEl.tagName.toLowerCase();
    }
}
var CaliforniaCoastTheme = /** @class */ (function (_super) {
    __extends(CaliforniaCoastTheme, _super);
    function CaliforniaCoastTheme() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.media = null;
        _this.observers = {};
        _this.mediaCallback = function (e) {
            if (e.matches) {
                _this.updateDarkStyle();
            }
            else {
                _this.updateLightStyle();
            }
        };
        _this.listenForSystemTheme = function () {
            _this.media = window.matchMedia("(prefers-color-scheme: dark)");
            _this.media.addEventListener("change", _this.mediaCallback);
            _this.register(function () {
                return _this.media.removeEventListener("change", _this.mediaCallback);
            });
            if (_this.media.matches) {
                _this.updateDarkStyle();
            }
            else {
                _this.updateLightStyle();
            }
        };
        _this.stopListeningForSystemTheme = function () {
            _this.media.removeEventListener("change", _this.mediaCallback);
        };
        _this.enableContextualTypography = function () {
            _this.registerEvent(_this.app.workspace.on("layout-change", function () {
                if (_this.settings.prettyPreview) {
                    var seen_1 = {};
                    _this.app.workspace.iterateRootLeaves(function (leaf) {
                        var id = leaf.id;
                        _this.connectObserver(id, leaf);
                        seen_1[id] = true;
                    });
                    Object.keys(_this.observers).forEach(function (k) {
                        if (!seen_1[k]) {
                            _this.disconnectObserver(k);
                        }
                    });
                }
            }));
        };
        _this.disableContextualTypography = function () {
            Object.keys(_this.observers).forEach(function (k) { return _this.disconnectObserver(k); });
        };
        _this.enableEmbeddedHeadings = function () {
            _this.embeddedHeadings.onload();
            _this.registerEvent(_this.app.workspace.on("layout-change", function () {
                if (_this.settings.embeddedHeadings) {
                    _this.embeddedHeadings.createHeadings(_this.app);
                }
            }));
        };
        _this.disableEmbeddedHeadings = function () {
            _this.embeddedHeadings.onunload();
        };
        return _this;
    }
    CaliforniaCoastTheme.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.embeddedHeadings = new EmbeddedHeadingsExtension();
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = (_b.sent()) || new ThemeSettings();
                        this.addSettingTab(new ThemeSettingTab(this.app, this));
                        this.addStyle();
                        this.refresh();
                        if (this.settings.useSystemTheme) {
                            this.enableSystemTheme();
                        }
                        if (!this.app.plugins.plugins["obsidian-contextual-typography"] &&
                            this.settings.prettyPreview) {
                            this.enableContextualTypography();
                        }
                        if (this.settings.embeddedHeadings) {
                            this.enableEmbeddedHeadings();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CaliforniaCoastTheme.prototype.onunload = function () {
        this.disableContextualTypography();
        this.disableEmbeddedHeadings();
    };
    // refresh function for when we change settings
    CaliforniaCoastTheme.prototype.refresh = function () {
        // re-load the style
        this.updateStyle();
    };
    // add the styling elements we need
    CaliforniaCoastTheme.prototype.addStyle = function () {
        // add a css block for our settings-dependent styles
        var css = document.createElement("style");
        css.id = "california-coast-theme";
        document.getElementsByTagName("head")[0].appendChild(css);
        // add the main class
        document.body.classList.add("california-coast-theme");
        // update the style with the settings-dependent styles
        this.updateStyle();
    };
    CaliforniaCoastTheme.prototype.removeStyle = function () {
        document.body.removeClass("cc-pretty-editor", "cc-pretty-preview");
    };
    // update the styles (at the start, or as the result of a settings change)
    CaliforniaCoastTheme.prototype.updateStyle = function () {
        this.removeStyle();
        document.body.classList.toggle("cc-pretty-editor", this.settings.prettyEditor);
        document.body.classList.toggle("cc-pretty-preview", this.settings.prettyPreview);
        // get the custom css element
        var el = document.getElementById("california-coast-theme");
        if (!el)
            throw "california-coast-theme element not found!";
        else {
            // set the settings-dependent css
            el.innerText = ("\n        body.california-coast-theme {\n          --editor-font-size:" + this.settings.textNormal + "px;\n          --editor-font-features: " + this.settings.fontFeatures + ";\n          --line-width:" + this.settings.lineWidth + "rem;\n          --font-monospace:" + this.settings.monoFont + ";\n          --text:" + this.settings.textFont + ";\n          --text-editor:" + this.settings.editorFont + ";\n        }\n      ")
                .trim()
                .replace(/[\r\n\s]+/g, " ");
        }
    };
    CaliforniaCoastTheme.prototype.enableSystemTheme = function () {
        this.app.workspace.layoutReady
            ? this.listenForSystemTheme()
            : this.app.workspace.on("layout-ready", this.listenForSystemTheme);
    };
    CaliforniaCoastTheme.prototype.updateDarkStyle = function () {
        document.body.removeClass("theme-light");
        document.body.addClass("theme-dark");
        this.app.workspace.trigger("css-change");
    };
    CaliforniaCoastTheme.prototype.updateLightStyle = function () {
        document.body.removeClass("theme-dark");
        document.body.addClass("theme-light");
        this.app.workspace.trigger("css-change");
    };
    CaliforniaCoastTheme.prototype.disconnectObserver = function (id) {
        if (this.observers[id]) {
            this.observers[id].disconnect();
            delete this.observers[id];
        }
    };
    CaliforniaCoastTheme.prototype.connectObserver = function (id, leaf) {
        if (this.observers[id])
            return;
        var previewSection = leaf.view.containerEl.getElementsByClassName("markdown-preview-section");
        if (previewSection.length) {
            this.observers[id] = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(tagNode);
                });
            });
            this.observers[id].observe(previewSection[0], config);
            setTimeout(function () {
                previewSection[0].childNodes.forEach(tagNode);
            }, 0);
        }
    };
    return CaliforniaCoastTheme;
}(obsidian.Plugin));
var ThemeSettings = /** @class */ (function () {
    function ThemeSettings() {
        this.prettyEditor = true;
        this.prettyPreview = true;
        this.embeddedHeadings = false;
        this.useSystemTheme = false;
        this.lineWidth = 42;
        this.textNormal = 18;
        this.fontFeatures = '""';
        this.textFont = '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';
        this.editorFont = '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';
        this.monoFont = "Menlo,SFMono-Regular,Consolas,Roboto Mono,monospace";
    }
    return ThemeSettings;
}());
var ThemeSettingTab = /** @class */ (function (_super) {
    __extends(ThemeSettingTab, _super);
    function ThemeSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    ThemeSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl("h3", { text: "California Coast Theme" });
        new obsidian.Setting(containerEl)
            .setName("Enhanced Editor Typography")
            .setDesc("Enhances the typography styles in editor mode")
            .addToggle(function (toggle) {
            return toggle.setValue(_this.plugin.settings.prettyEditor).onChange(function (value) {
                _this.plugin.settings.prettyEditor = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Enhanced Preview Typography")
            .setDesc("Enhances the typography styles in preview mode")
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.prettyPreview)
                .onChange(function (value) {
                _this.plugin.settings.prettyPreview = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                if (value) {
                    _this.plugin.enableContextualTypography();
                }
                else {
                    _this.plugin.disableContextualTypography();
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Display note file names as headings")
            .setDesc("Embeds note titles as top level H1 tags")
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.embeddedHeadings)
                .onChange(function (value) {
                _this.plugin.settings.embeddedHeadings = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                if (value) {
                    _this.plugin.enableEmbeddedHeadings();
                }
                else {
                    _this.plugin.disableEmbeddedHeadings();
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Use system-level setting for light or dark mode")
            .setDesc("Automatically switch based on your operating system settings")
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.useSystemTheme)
                .onChange(function (value) {
                _this.plugin.settings.useSystemTheme = value;
                _this.plugin.saveData(_this.plugin.settings);
                if (value) {
                    _this.plugin.listenForSystemTheme();
                }
                else {
                    _this.plugin.stopListeningForSystemTheme();
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Line width")
            .setDesc("The maximum number of characters per line (default 40)")
            .addText(function (text) {
            return text
                .setPlaceholder("42")
                .setValue((_this.plugin.settings.lineWidth || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.lineWidth = parseInt(value.trim());
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Body font size")
            .setDesc("Used for the main text (default 18)")
            .addText(function (text) {
            return text
                .setPlaceholder("18")
                .setValue((_this.plugin.settings.textNormal || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.textNormal = parseInt(value.trim());
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        containerEl.createEl("br");
        containerEl.createEl("h3", { text: "Custom fonts" });
        new obsidian.Setting(containerEl)
            .setName("UI font")
            .setDesc("Used for the user interface")
            .addText(function (text) {
            return text
                .setPlaceholder("")
                .setValue((_this.plugin.settings.textFont || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.textFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Editor font")
            .setDesc("Used for the editor and preview")
            .addText(function (text) {
            return text
                .setPlaceholder("")
                .setValue((_this.plugin.settings.editorFont || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.editorFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Editor font features")
            .setDesc('eg. "ss01", "cv05", "cv07", "case"')
            .addText(function (text) {
            return text
                .setPlaceholder('""')
                .setValue((_this.plugin.settings.fontFeatures || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.fontFeatures = value.trim();
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Monospace font")
            .setDesc("Used for code blocks, front matter, etc")
            .addText(function (text) {
            return text
                .setPlaceholder("")
                .setValue((_this.plugin.settings.monoFont || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.monoFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
    };
    return ThemeSettingTab;
}(obsidian.PluginSettingTab));

module.exports = CaliforniaCoastTheme;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsImV4dGVuc2lvbnMvZW1iZWRkZWRIZWFkaW5ncy50cyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2xpYi9wYXRoX3BhcnNlLmpzIiwibm9kZV9tb2R1bGVzL3N2Z3BhdGgvbGliL21hdHJpeC5qcyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2xpYi90cmFuc2Zvcm1fcGFyc2UuanMiLCJub2RlX21vZHVsZXMvc3ZncGF0aC9saWIvYTJjLmpzIiwibm9kZV9tb2R1bGVzL3N2Z3BhdGgvbGliL2VsbGlwc2UuanMiLCJub2RlX21vZHVsZXMvc3ZncGF0aC9saWIvc3ZncGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2luZGV4LmpzIiwiZXh0ZW5zaW9ucy9ib3hpY29ucy50cyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtYmVkZGVkSGVhZGluZ3NFeHRlbnNpb24ge1xuICBoZWFkaW5nczogeyBbaWQ6IHN0cmluZ106IFdvcmtzcGFjZUxlYWYgfSA9IHt9O1xuXG4gIHJlbW92ZUhlYWRpbmcoaWQ6IHN0cmluZywgbGVhZjogV29ya3NwYWNlTGVhZikge1xuICAgIGlmICghdGhpcy5oZWFkaW5nc1tpZF0pIHJldHVybjtcblxuICAgIGNvbnN0IGgxRWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2lkfS1lZGl0YCk7XG4gICAgY29uc3QgaDFQcmV2aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7aWR9LXByZXZpZXdgKTtcblxuICAgIGlmIChoMUVkaXQpIGgxRWRpdC5yZW1vdmUoKTtcbiAgICBpZiAoaDFQcmV2aWV3KSBoMVByZXZpZXcucmVtb3ZlKCk7XG5cbiAgICBkZWxldGUgdGhpcy5oZWFkaW5nc1tpZF07XG4gIH1cblxuICBjcmVhdGVIZWFkaW5nKGlkOiBzdHJpbmcsIGxlYWY6IFdvcmtzcGFjZUxlYWYpIHtcbiAgICBpZiAodGhpcy5oZWFkaW5nc1tpZF0pIHJldHVybjtcblxuICAgIGNvbnN0IGhlYWRlciA9IGxlYWYudmlldy5jb250YWluZXJFbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgXCJ2aWV3LWhlYWRlci10aXRsZVwiXG4gICAgKTtcblxuICAgIGNvbnN0IHZpZXdDb250ZW50ID0gbGVhZi52aWV3LmNvbnRhaW5lckVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXG4gICAgICBcIkNvZGVNaXJyb3Itc2Nyb2xsXCJcbiAgICApO1xuXG4gICAgY29uc3QgcHJldmlld0NvbnRlbnQgPSBsZWFmLnZpZXcuY29udGFpbmVyRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcbiAgICAgIFwibWFya2Rvd24tcHJldmlldy12aWV3XCJcbiAgICApO1xuXG4gICAgaWYgKGhlYWRlci5sZW5ndGggJiYgdmlld0NvbnRlbnQubGVuZ3RoICYmIHByZXZpZXdDb250ZW50Lmxlbmd0aCkge1xuICAgICAgY29uc3QgZWRpdEVsID0gdmlld0NvbnRlbnRbMF0gYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICBjb25zdCBoMUVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cbiAgICAgIGgxRWRpdC5zZXRUZXh0KChoZWFkZXJbMF0gYXMgSFRNTERpdkVsZW1lbnQpLmlubmVyVGV4dCk7XG4gICAgICBoMUVkaXQuaWQgPSBgJHtpZH0tZWRpdGA7XG4gICAgICBlZGl0RWwucHJlcGVuZChoMUVkaXQpO1xuXG4gICAgICBjb25zdCBwcmV2aWV3RWwgPSBwcmV2aWV3Q29udGVudFswXSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgIGNvbnN0IGgxUHJldmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblxuICAgICAgaDFQcmV2aWV3LnNldFRleHQoKGhlYWRlclswXSBhcyBIVE1MRGl2RWxlbWVudCkuaW5uZXJUZXh0KTtcbiAgICAgIGgxUHJldmlldy5pZCA9IGAke2lkfS1wcmV2aWV3YDtcbiAgICAgIHByZXZpZXdFbC5wcmVwZW5kKGgxUHJldmlldyk7XG5cbiAgICAgIHRoaXMuaGVhZGluZ3NbaWRdID0gbGVhZjtcbiAgICB9XG4gIH1cblxuICBnZXRMZWFmSWQobGVhZjogV29ya3NwYWNlTGVhZikge1xuICAgIGNvbnN0IHZpZXdTdGF0ZSA9IGxlYWYuZ2V0Vmlld1N0YXRlKCk7XG5cbiAgICBpZiAodmlld1N0YXRlLnR5cGUgPT09IFwibWFya2Rvd25cIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgXCJ0aXRsZS1cIiArXG4gICAgICAgICgoKGxlYWYgYXMgYW55KS5pZCBhcyBzdHJpbmcpICsgdmlld1N0YXRlLnN0YXRlLmZpbGUpLnJlcGxhY2UoXG4gICAgICAgICAgL15bXmEtel0rfFteXFx3Oi4tXSsvZ2ksXG4gICAgICAgICAgXCJcIlxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY3JlYXRlSGVhZGluZ3MoYXBwOiBBcHApIHtcbiAgICBjb25zdCBzZWVuOiB7IFtrOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuICAgIGFwcC53b3Jrc3BhY2UuaXRlcmF0ZVJvb3RMZWF2ZXMoKGxlYWYpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRMZWFmSWQobGVhZik7XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICB0aGlzLmNyZWF0ZUhlYWRpbmcoaWQsIGxlYWYpO1xuICAgICAgICBzZWVuW2lkXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLmhlYWRpbmdzKS5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgaWYgKCFzZWVuW2lkXSkge1xuICAgICAgICB0aGlzLnJlbW92ZUhlYWRpbmcoaWQsIHRoaXMuaGVhZGluZ3NbaWRdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9ubG9hZCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJlbWJlZGRlZC1ub3RlLXRpdGxlXCIpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiZW1iZWRkZWQtbm90ZS10aXRsZVwiKTtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMuaGVhZGluZ3MpLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZUhlYWRpbmcoaWQsIHRoaXMuaGVhZGluZ3NbaWRdKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBwYXJhbUNvdW50cyA9IHsgYTogNywgYzogNiwgaDogMSwgbDogMiwgbTogMiwgcjogNCwgcTogNCwgczogNCwgdDogMiwgdjogMSwgejogMCB9O1xuXG52YXIgU1BFQ0lBTF9TUEFDRVMgPSBbXG4gIDB4MTY4MCwgMHgxODBFLCAweDIwMDAsIDB4MjAwMSwgMHgyMDAyLCAweDIwMDMsIDB4MjAwNCwgMHgyMDA1LCAweDIwMDYsXG4gIDB4MjAwNywgMHgyMDA4LCAweDIwMDksIDB4MjAwQSwgMHgyMDJGLCAweDIwNUYsIDB4MzAwMCwgMHhGRUZGXG5dO1xuXG5mdW5jdGlvbiBpc1NwYWNlKGNoKSB7XG4gIHJldHVybiAoY2ggPT09IDB4MEEpIHx8IChjaCA9PT0gMHgwRCkgfHwgKGNoID09PSAweDIwMjgpIHx8IChjaCA9PT0gMHgyMDI5KSB8fCAvLyBMaW5lIHRlcm1pbmF0b3JzXG4gICAgLy8gV2hpdGUgc3BhY2VzXG4gICAgKGNoID09PSAweDIwKSB8fCAoY2ggPT09IDB4MDkpIHx8IChjaCA9PT0gMHgwQikgfHwgKGNoID09PSAweDBDKSB8fCAoY2ggPT09IDB4QTApIHx8XG4gICAgKGNoID49IDB4MTY4MCAmJiBTUEVDSUFMX1NQQUNFUy5pbmRleE9mKGNoKSA+PSAwKTtcbn1cblxuZnVuY3Rpb24gaXNDb21tYW5kKGNvZGUpIHtcbiAgLyplc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlKi9cbiAgc3dpdGNoIChjb2RlIHwgMHgyMCkge1xuICAgIGNhc2UgMHg2RC8qIG0gKi86XG4gICAgY2FzZSAweDdBLyogeiAqLzpcbiAgICBjYXNlIDB4NkMvKiBsICovOlxuICAgIGNhc2UgMHg2OC8qIGggKi86XG4gICAgY2FzZSAweDc2LyogdiAqLzpcbiAgICBjYXNlIDB4NjMvKiBjICovOlxuICAgIGNhc2UgMHg3My8qIHMgKi86XG4gICAgY2FzZSAweDcxLyogcSAqLzpcbiAgICBjYXNlIDB4NzQvKiB0ICovOlxuICAgIGNhc2UgMHg2MS8qIGEgKi86XG4gICAgY2FzZSAweDcyLyogciAqLzpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNBcmMoY29kZSkge1xuICByZXR1cm4gKGNvZGUgfCAweDIwKSA9PT0gMHg2MTtcbn1cblxuZnVuY3Rpb24gaXNEaWdpdChjb2RlKSB7XG4gIHJldHVybiAoY29kZSA+PSA0OCAmJiBjb2RlIDw9IDU3KTsgICAvLyAwLi45XG59XG5cbmZ1bmN0aW9uIGlzRGlnaXRTdGFydChjb2RlKSB7XG4gIHJldHVybiAoY29kZSA+PSA0OCAmJiBjb2RlIDw9IDU3KSB8fCAvKiAwLi45ICovXG4gICAgICAgICAgY29kZSA9PT0gMHgyQiB8fCAvKiArICovXG4gICAgICAgICAgY29kZSA9PT0gMHgyRCB8fCAvKiAtICovXG4gICAgICAgICAgY29kZSA9PT0gMHgyRTsgICAvKiAuICovXG59XG5cblxuZnVuY3Rpb24gU3RhdGUocGF0aCkge1xuICB0aGlzLmluZGV4ICA9IDA7XG4gIHRoaXMucGF0aCAgID0gcGF0aDtcbiAgdGhpcy5tYXggICAgPSBwYXRoLmxlbmd0aDtcbiAgdGhpcy5yZXN1bHQgPSBbXTtcbiAgdGhpcy5wYXJhbSAgPSAwLjA7XG4gIHRoaXMuZXJyICAgID0gJyc7XG4gIHRoaXMuc2VnbWVudFN0YXJ0ID0gMDtcbiAgdGhpcy5kYXRhICAgPSBbXTtcbn1cblxuZnVuY3Rpb24gc2tpcFNwYWNlcyhzdGF0ZSkge1xuICB3aGlsZSAoc3RhdGUuaW5kZXggPCBzdGF0ZS5tYXggJiYgaXNTcGFjZShzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoc3RhdGUuaW5kZXgpKSkge1xuICAgIHN0YXRlLmluZGV4Kys7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzY2FuRmxhZyhzdGF0ZSkge1xuICB2YXIgY2ggPSBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoc3RhdGUuaW5kZXgpO1xuXG4gIGlmIChjaCA9PT0gMHgzMC8qIDAgKi8pIHtcbiAgICBzdGF0ZS5wYXJhbSA9IDA7XG4gICAgc3RhdGUuaW5kZXgrKztcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2ggPT09IDB4MzEvKiAxICovKSB7XG4gICAgc3RhdGUucGFyYW0gPSAxO1xuICAgIHN0YXRlLmluZGV4Kys7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUuZXJyID0gJ1N2Z1BhdGg6IGFyYyBmbGFnIGNhbiBiZSAwIG9yIDEgb25seSAoYXQgcG9zICcgKyBzdGF0ZS5pbmRleCArICcpJztcbn1cblxuXG5mdW5jdGlvbiBzY2FuUGFyYW0oc3RhdGUpIHtcbiAgdmFyIHN0YXJ0ID0gc3RhdGUuaW5kZXgsXG4gICAgICBpbmRleCA9IHN0YXJ0LFxuICAgICAgbWF4ID0gc3RhdGUubWF4LFxuICAgICAgemVyb0ZpcnN0ID0gZmFsc2UsXG4gICAgICBoYXNDZWlsaW5nID0gZmFsc2UsXG4gICAgICBoYXNEZWNpbWFsID0gZmFsc2UsXG4gICAgICBoYXNEb3QgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIGlmIChpbmRleCA+PSBtYXgpIHtcbiAgICBzdGF0ZS5lcnIgPSAnU3ZnUGF0aDogbWlzc2VkIHBhcmFtIChhdCBwb3MgJyArIGluZGV4ICsgJyknO1xuICAgIHJldHVybjtcbiAgfVxuICBjaCA9IHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCk7XG5cbiAgaWYgKGNoID09PSAweDJCLyogKyAqLyB8fCBjaCA9PT0gMHgyRC8qIC0gKi8pIHtcbiAgICBpbmRleCsrO1xuICAgIGNoID0gKGluZGV4IDwgbWF4KSA/IHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkgOiAwO1xuICB9XG5cbiAgLy8gVGhpcyBsb2dpYyBpcyBzaGFtZWxlc3NseSBib3Jyb3dlZCBmcm9tIEVzcHJpbWFcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FyaXlhL2VzcHJpbWFzXG4gIC8vXG4gIGlmICghaXNEaWdpdChjaCkgJiYgY2ggIT09IDB4MkUvKiAuICovKSB7XG4gICAgc3RhdGUuZXJyID0gJ1N2Z1BhdGg6IHBhcmFtIHNob3VsZCBzdGFydCB3aXRoIDAuLjkgb3IgYC5gIChhdCBwb3MgJyArIGluZGV4ICsgJyknO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjaCAhPT0gMHgyRS8qIC4gKi8pIHtcbiAgICB6ZXJvRmlyc3QgPSAoY2ggPT09IDB4MzAvKiAwICovKTtcbiAgICBpbmRleCsrO1xuXG4gICAgY2ggPSAoaW5kZXggPCBtYXgpID8gc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSA6IDA7XG5cbiAgICBpZiAoemVyb0ZpcnN0ICYmIGluZGV4IDwgbWF4KSB7XG4gICAgICAvLyBkZWNpbWFsIG51bWJlciBzdGFydHMgd2l0aCAnMCcgc3VjaCBhcyAnMDknIGlzIGlsbGVnYWwuXG4gICAgICBpZiAoY2ggJiYgaXNEaWdpdChjaCkpIHtcbiAgICAgICAgc3RhdGUuZXJyID0gJ1N2Z1BhdGg6IG51bWJlcnMgc3RhcnRlZCB3aXRoIGAwYCBzdWNoIGFzIGAwOWAgYXJlIGlsbGVnYWwgKGF0IHBvcyAnICsgc3RhcnQgKyAnKSc7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoaW5kZXggPCBtYXggJiYgaXNEaWdpdChzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgaW5kZXgrKztcbiAgICAgIGhhc0NlaWxpbmcgPSB0cnVlO1xuICAgIH1cbiAgICBjaCA9IChpbmRleCA8IG1heCkgPyBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpIDogMDtcbiAgfVxuXG4gIGlmIChjaCA9PT0gMHgyRS8qIC4gKi8pIHtcbiAgICBoYXNEb3QgPSB0cnVlO1xuICAgIGluZGV4Kys7XG4gICAgd2hpbGUgKGlzRGlnaXQoc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgIGluZGV4Kys7XG4gICAgICBoYXNEZWNpbWFsID0gdHJ1ZTtcbiAgICB9XG4gICAgY2ggPSAoaW5kZXggPCBtYXgpID8gc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSA6IDA7XG4gIH1cblxuICBpZiAoY2ggPT09IDB4NjUvKiBlICovIHx8IGNoID09PSAweDQ1LyogRSAqLykge1xuICAgIGlmIChoYXNEb3QgJiYgIWhhc0NlaWxpbmcgJiYgIWhhc0RlY2ltYWwpIHtcbiAgICAgIHN0YXRlLmVyciA9ICdTdmdQYXRoOiBpbnZhbGlkIGZsb2F0IGV4cG9uZW50IChhdCBwb3MgJyArIGluZGV4ICsgJyknO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGluZGV4Kys7XG5cbiAgICBjaCA9IChpbmRleCA8IG1heCkgPyBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpIDogMDtcbiAgICBpZiAoY2ggPT09IDB4MkIvKiArICovIHx8IGNoID09PSAweDJELyogLSAqLykge1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgaWYgKGluZGV4IDwgbWF4ICYmIGlzRGlnaXQoc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgIHdoaWxlIChpbmRleCA8IG1heCAmJiBpc0RpZ2l0KHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLmVyciA9ICdTdmdQYXRoOiBpbnZhbGlkIGZsb2F0IGV4cG9uZW50IChhdCBwb3MgJyArIGluZGV4ICsgJyknO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLmluZGV4ID0gaW5kZXg7XG4gIHN0YXRlLnBhcmFtID0gcGFyc2VGbG9hdChzdGF0ZS5wYXRoLnNsaWNlKHN0YXJ0LCBpbmRleCkpICsgMC4wO1xufVxuXG5cbmZ1bmN0aW9uIGZpbmFsaXplU2VnbWVudChzdGF0ZSkge1xuICB2YXIgY21kLCBjbWRMQztcblxuICAvLyBQcm9jZXNzIGR1cGxpY2F0ZWQgY29tbWFuZHMgKHdpdGhvdXQgY29tYW5kIG5hbWUpXG5cbiAgLy8gVGhpcyBsb2dpYyBpcyBzaGFtZWxlc3NseSBib3Jyb3dlZCBmcm9tIFJhcGhhZWxcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0RtaXRyeUJhcmFub3Zza2l5L3JhcGhhZWwvXG4gIC8vXG4gIGNtZCAgID0gc3RhdGUucGF0aFtzdGF0ZS5zZWdtZW50U3RhcnRdO1xuICBjbWRMQyA9IGNtZC50b0xvd2VyQ2FzZSgpO1xuXG4gIHZhciBwYXJhbXMgPSBzdGF0ZS5kYXRhO1xuXG4gIGlmIChjbWRMQyA9PT0gJ20nICYmIHBhcmFtcy5sZW5ndGggPiAyKSB7XG4gICAgc3RhdGUucmVzdWx0LnB1c2goWyBjbWQsIHBhcmFtc1swXSwgcGFyYW1zWzFdIF0pO1xuICAgIHBhcmFtcyA9IHBhcmFtcy5zbGljZSgyKTtcbiAgICBjbWRMQyA9ICdsJztcbiAgICBjbWQgPSAoY21kID09PSAnbScpID8gJ2wnIDogJ0wnO1xuICB9XG5cbiAgaWYgKGNtZExDID09PSAncicpIHtcbiAgICBzdGF0ZS5yZXN1bHQucHVzaChbIGNtZCBdLmNvbmNhdChwYXJhbXMpKTtcbiAgfSBlbHNlIHtcblxuICAgIHdoaWxlIChwYXJhbXMubGVuZ3RoID49IHBhcmFtQ291bnRzW2NtZExDXSkge1xuICAgICAgc3RhdGUucmVzdWx0LnB1c2goWyBjbWQgXS5jb25jYXQocGFyYW1zLnNwbGljZSgwLCBwYXJhbUNvdW50c1tjbWRMQ10pKSk7XG4gICAgICBpZiAoIXBhcmFtQ291bnRzW2NtZExDXSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzY2FuU2VnbWVudChzdGF0ZSkge1xuICB2YXIgbWF4ID0gc3RhdGUubWF4LFxuICAgICAgY21kQ29kZSwgaXNfYXJjLCBjb21tYV9mb3VuZCwgbmVlZF9wYXJhbXMsIGk7XG5cbiAgc3RhdGUuc2VnbWVudFN0YXJ0ID0gc3RhdGUuaW5kZXg7XG4gIGNtZENvZGUgPSBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoc3RhdGUuaW5kZXgpO1xuICBpc19hcmMgPSBpc0FyYyhjbWRDb2RlKTtcblxuICBpZiAoIWlzQ29tbWFuZChjbWRDb2RlKSkge1xuICAgIHN0YXRlLmVyciA9ICdTdmdQYXRoOiBiYWQgY29tbWFuZCAnICsgc3RhdGUucGF0aFtzdGF0ZS5pbmRleF0gKyAnIChhdCBwb3MgJyArIHN0YXRlLmluZGV4ICsgJyknO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG5lZWRfcGFyYW1zID0gcGFyYW1Db3VudHNbc3RhdGUucGF0aFtzdGF0ZS5pbmRleF0udG9Mb3dlckNhc2UoKV07XG5cbiAgc3RhdGUuaW5kZXgrKztcbiAgc2tpcFNwYWNlcyhzdGF0ZSk7XG5cbiAgc3RhdGUuZGF0YSA9IFtdO1xuXG4gIGlmICghbmVlZF9wYXJhbXMpIHtcbiAgICAvLyBaXG4gICAgZmluYWxpemVTZWdtZW50KHN0YXRlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb21tYV9mb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAoOzspIHtcbiAgICBmb3IgKGkgPSBuZWVkX3BhcmFtczsgaSA+IDA7IGktLSkge1xuICAgICAgaWYgKGlzX2FyYyAmJiAoaSA9PT0gMyB8fCBpID09PSA0KSkgc2NhbkZsYWcoc3RhdGUpO1xuICAgICAgZWxzZSBzY2FuUGFyYW0oc3RhdGUpO1xuXG4gICAgICBpZiAoc3RhdGUuZXJyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzdGF0ZS5kYXRhLnB1c2goc3RhdGUucGFyYW0pO1xuXG4gICAgICBza2lwU3BhY2VzKHN0YXRlKTtcbiAgICAgIGNvbW1hX2ZvdW5kID0gZmFsc2U7XG5cbiAgICAgIGlmIChzdGF0ZS5pbmRleCA8IG1heCAmJiBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoc3RhdGUuaW5kZXgpID09PSAweDJDLyogLCAqLykge1xuICAgICAgICBzdGF0ZS5pbmRleCsrO1xuICAgICAgICBza2lwU3BhY2VzKHN0YXRlKTtcbiAgICAgICAgY29tbWFfZm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFmdGVyICcsJyBwYXJhbSBpcyBtYW5kYXRvcnlcbiAgICBpZiAoY29tbWFfZm91bmQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5pbmRleCA+PSBzdGF0ZS5tYXgpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIFN0b3Agb24gbmV4dCBzZWdtZW50XG4gICAgaWYgKCFpc0RpZ2l0U3RhcnQoc3RhdGUucGF0aC5jaGFyQ29kZUF0KHN0YXRlLmluZGV4KSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZpbmFsaXplU2VnbWVudChzdGF0ZSk7XG59XG5cblxuLyogUmV0dXJucyBhcnJheSBvZiBzZWdtZW50czpcbiAqXG4gKiBbXG4gKiAgIFsgY29tbWFuZCwgY29vcmQxLCBjb29yZDIsIC4uLiBdXG4gKiBdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGF0aFBhcnNlKHN2Z1BhdGgpIHtcbiAgdmFyIHN0YXRlID0gbmV3IFN0YXRlKHN2Z1BhdGgpO1xuICB2YXIgbWF4ID0gc3RhdGUubWF4O1xuXG4gIHNraXBTcGFjZXMoc3RhdGUpO1xuXG4gIHdoaWxlIChzdGF0ZS5pbmRleCA8IG1heCAmJiAhc3RhdGUuZXJyLmxlbmd0aCkge1xuICAgIHNjYW5TZWdtZW50KHN0YXRlKTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5lcnIubGVuZ3RoKSB7XG4gICAgc3RhdGUucmVzdWx0ID0gW107XG5cbiAgfSBlbHNlIGlmIChzdGF0ZS5yZXN1bHQubGVuZ3RoKSB7XG5cbiAgICBpZiAoJ21NJy5pbmRleE9mKHN0YXRlLnJlc3VsdFswXVswXSkgPCAwKSB7XG4gICAgICBzdGF0ZS5lcnIgPSAnU3ZnUGF0aDogc3RyaW5nIHNob3VsZCBzdGFydCB3aXRoIGBNYCBvciBgbWAnO1xuICAgICAgc3RhdGUucmVzdWx0ID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnJlc3VsdFswXVswXSA9ICdNJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVycjogc3RhdGUuZXJyLFxuICAgIHNlZ21lbnRzOiBzdGF0ZS5yZXN1bHRcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGNvbWJpbmUgMiBtYXRyaXhlc1xuLy8gbTEsIG0yIC0gW2EsIGIsIGMsIGQsIGUsIGddXG4vL1xuZnVuY3Rpb24gY29tYmluZShtMSwgbTIpIHtcbiAgcmV0dXJuIFtcbiAgICBtMVswXSAqIG0yWzBdICsgbTFbMl0gKiBtMlsxXSxcbiAgICBtMVsxXSAqIG0yWzBdICsgbTFbM10gKiBtMlsxXSxcbiAgICBtMVswXSAqIG0yWzJdICsgbTFbMl0gKiBtMlszXSxcbiAgICBtMVsxXSAqIG0yWzJdICsgbTFbM10gKiBtMlszXSxcbiAgICBtMVswXSAqIG0yWzRdICsgbTFbMl0gKiBtMls1XSArIG0xWzRdLFxuICAgIG0xWzFdICogbTJbNF0gKyBtMVszXSAqIG0yWzVdICsgbTFbNV1cbiAgXTtcbn1cblxuXG5mdW5jdGlvbiBNYXRyaXgoKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNYXRyaXgpKSB7IHJldHVybiBuZXcgTWF0cml4KCk7IH1cbiAgdGhpcy5xdWV1ZSA9IFtdOyAgIC8vIGxpc3Qgb2YgbWF0cml4ZXMgdG8gYXBwbHlcbiAgdGhpcy5jYWNoZSA9IG51bGw7IC8vIGNvbWJpbmVkIG1hdHJpeCBjYWNoZVxufVxuXG5cbk1hdHJpeC5wcm90b3R5cGUubWF0cml4ID0gZnVuY3Rpb24gKG0pIHtcbiAgaWYgKG1bMF0gPT09IDEgJiYgbVsxXSA9PT0gMCAmJiBtWzJdID09PSAwICYmIG1bM10gPT09IDEgJiYgbVs0XSA9PT0gMCAmJiBtWzVdID09PSAwKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5jYWNoZSA9IG51bGw7XG4gIHRoaXMucXVldWUucHVzaChtKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbk1hdHJpeC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKHR4LCB0eSkge1xuICBpZiAodHggIT09IDAgfHwgdHkgIT09IDApIHtcbiAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgICB0aGlzLnF1ZXVlLnB1c2goWyAxLCAwLCAwLCAxLCB0eCwgdHkgXSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbk1hdHJpeC5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiAoc3gsIHN5KSB7XG4gIGlmIChzeCAhPT0gMSB8fCBzeSAhPT0gMSkge1xuICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuICAgIHRoaXMucXVldWUucHVzaChbIHN4LCAwLCAwLCBzeSwgMCwgMCBdKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuTWF0cml4LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoYW5nbGUsIHJ4LCByeSkge1xuICB2YXIgcmFkLCBjb3MsIHNpbjtcblxuICBpZiAoYW5nbGUgIT09IDApIHtcbiAgICB0aGlzLnRyYW5zbGF0ZShyeCwgcnkpO1xuXG4gICAgcmFkID0gYW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xuICAgIGNvcyA9IE1hdGguY29zKHJhZCk7XG4gICAgc2luID0gTWF0aC5zaW4ocmFkKTtcblxuICAgIHRoaXMucXVldWUucHVzaChbIGNvcywgc2luLCAtc2luLCBjb3MsIDAsIDAgXSk7XG4gICAgdGhpcy5jYWNoZSA9IG51bGw7XG5cbiAgICB0aGlzLnRyYW5zbGF0ZSgtcngsIC1yeSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbk1hdHJpeC5wcm90b3R5cGUuc2tld1ggPSBmdW5jdGlvbiAoYW5nbGUpIHtcbiAgaWYgKGFuZ2xlICE9PSAwKSB7XG4gICAgdGhpcy5jYWNoZSA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKFsgMSwgMCwgTWF0aC50YW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSwgMSwgMCwgMCBdKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuTWF0cml4LnByb3RvdHlwZS5za2V3WSA9IGZ1bmN0aW9uIChhbmdsZSkge1xuICBpZiAoYW5nbGUgIT09IDApIHtcbiAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgICB0aGlzLnF1ZXVlLnB1c2goWyAxLCBNYXRoLnRhbihhbmdsZSAqIE1hdGguUEkgLyAxODApLCAwLCAxLCAwLCAwIF0pO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBGbGF0dGVuIHF1ZXVlXG4vL1xuTWF0cml4LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5jYWNoZSkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlO1xuICB9XG5cbiAgaWYgKCF0aGlzLnF1ZXVlLmxlbmd0aCkge1xuICAgIHRoaXMuY2FjaGUgPSBbIDEsIDAsIDAsIDEsIDAsIDAgXTtcbiAgICByZXR1cm4gdGhpcy5jYWNoZTtcbiAgfVxuXG4gIHRoaXMuY2FjaGUgPSB0aGlzLnF1ZXVlWzBdO1xuXG4gIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCB0aGlzLnF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5jYWNoZSA9IGNvbWJpbmUodGhpcy5jYWNoZSwgdGhpcy5xdWV1ZVtpXSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5jYWNoZTtcbn07XG5cblxuLy8gQXBwbHkgbGlzdCBvZiBtYXRyaXhlcyB0byAoeCx5KSBwb2ludC5cbi8vIElmIGBpc1JlbGF0aXZlYCBzZXQsIGB0cmFuc2xhdGVgIGNvbXBvbmVudCBvZiBtYXRyaXggd2lsbCBiZSBza2lwcGVkXG4vL1xuTWF0cml4LnByb3RvdHlwZS5jYWxjID0gZnVuY3Rpb24gKHgsIHksIGlzUmVsYXRpdmUpIHtcbiAgdmFyIG07XG5cbiAgLy8gRG9uJ3QgY2hhbmdlIHBvaW50IG9uIGVtcHR5IHRyYW5zZm9ybXMgcXVldWVcbiAgaWYgKCF0aGlzLnF1ZXVlLmxlbmd0aCkgeyByZXR1cm4gWyB4LCB5IF07IH1cblxuICAvLyBDYWxjdWxhdGUgZmluYWwgbWF0cml4LCBpZiBub3QgZXhpc3RzXG4gIC8vXG4gIC8vIE5CLiBpZiB5b3UgZGVzaWRlIHRvIGFwcGx5IHRyYW5zZm9ybXMgdG8gcG9pbnQgb25lLWJ5LW9uZSxcbiAgLy8gdGhleSBzaG91bGQgYmUgdGFrZW4gaW4gcmV2ZXJzZSBvcmRlclxuXG4gIGlmICghdGhpcy5jYWNoZSkge1xuICAgIHRoaXMuY2FjaGUgPSB0aGlzLnRvQXJyYXkoKTtcbiAgfVxuXG4gIG0gPSB0aGlzLmNhY2hlO1xuXG4gIC8vIEFwcGx5IG1hdHJpeCB0byBwb2ludFxuICByZXR1cm4gW1xuICAgIHggKiBtWzBdICsgeSAqIG1bMl0gKyAoaXNSZWxhdGl2ZSA/IDAgOiBtWzRdKSxcbiAgICB4ICogbVsxXSArIHkgKiBtWzNdICsgKGlzUmVsYXRpdmUgPyAwIDogbVs1XSlcbiAgXTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg7XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIE1hdHJpeCA9IHJlcXVpcmUoJy4vbWF0cml4Jyk7XG5cbnZhciBvcGVyYXRpb25zID0ge1xuICBtYXRyaXg6IHRydWUsXG4gIHNjYWxlOiB0cnVlLFxuICByb3RhdGU6IHRydWUsXG4gIHRyYW5zbGF0ZTogdHJ1ZSxcbiAgc2tld1g6IHRydWUsXG4gIHNrZXdZOiB0cnVlXG59O1xuXG52YXIgQ01EX1NQTElUX1JFICAgID0gL1xccyoobWF0cml4fHRyYW5zbGF0ZXxzY2FsZXxyb3RhdGV8c2tld1h8c2tld1kpXFxzKlxcKFxccyooLis/KVxccypcXClbXFxzLF0qLztcbnZhciBQQVJBTVNfU1BMSVRfUkUgPSAvW1xccyxdKy87XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1QYXJzZSh0cmFuc2Zvcm1TdHJpbmcpIHtcbiAgdmFyIG1hdHJpeCA9IG5ldyBNYXRyaXgoKTtcbiAgdmFyIGNtZCwgcGFyYW1zO1xuXG4gIC8vIFNwbGl0IHZhbHVlIGludG8gWycnLCAndHJhbnNsYXRlJywgJzEwIDUwJywgJycsICdzY2FsZScsICcyJywgJycsICdyb3RhdGUnLCAgJy00NScsICcnXVxuICB0cmFuc2Zvcm1TdHJpbmcuc3BsaXQoQ01EX1NQTElUX1JFKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGVsZW1lbnRzXG4gICAgaWYgKCFpdGVtLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIC8vIHJlbWVtYmVyIG9wZXJhdGlvblxuICAgIGlmICh0eXBlb2Ygb3BlcmF0aW9uc1tpdGVtXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNtZCA9IGl0ZW07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZXh0cmFjdCBwYXJhbXMgJiBhdHQgb3BlcmF0aW9uIHRvIG1hdHJpeFxuICAgIHBhcmFtcyA9IGl0ZW0uc3BsaXQoUEFSQU1TX1NQTElUX1JFKS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgIHJldHVybiAraSB8fCAwO1xuICAgIH0pO1xuXG4gICAgLy8gSWYgcGFyYW1zIGNvdW50IGlzIG5vdCBjb3JyZWN0IC0gaWdub3JlIGNvbW1hbmRcbiAgICBzd2l0Y2ggKGNtZCkge1xuICAgICAgY2FzZSAnbWF0cml4JzpcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgICBtYXRyaXgubWF0cml4KHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdzY2FsZSc6XG4gICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbWF0cml4LnNjYWxlKHBhcmFtc1swXSwgcGFyYW1zWzBdKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgbWF0cml4LnNjYWxlKHBhcmFtc1swXSwgcGFyYW1zWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ3JvdGF0ZSc6XG4gICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbWF0cml4LnJvdGF0ZShwYXJhbXNbMF0sIDAsIDApO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICBtYXRyaXgucm90YXRlKHBhcmFtc1swXSwgcGFyYW1zWzFdLCBwYXJhbXNbMl0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAndHJhbnNsYXRlJzpcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBtYXRyaXgudHJhbnNsYXRlKHBhcmFtc1swXSwgMCk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIG1hdHJpeC50cmFuc2xhdGUocGFyYW1zWzBdLCBwYXJhbXNbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnc2tld1gnOlxuICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1hdHJpeC5za2V3WChwYXJhbXNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnc2tld1knOlxuICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1hdHJpeC5za2V3WShwYXJhbXNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBtYXRyaXg7XG59O1xuIiwiLy8gQ29udmVydCBhbiBhcmMgdG8gYSBzZXF1ZW5jZSBvZiBjdWJpYyBiw6l6aWVyIGN1cnZlc1xuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgVEFVID0gTWF0aC5QSSAqIDI7XG5cblxuLyogZXNsaW50LWRpc2FibGUgc3BhY2UtaW5maXgtb3BzICovXG5cbi8vIENhbGN1bGF0ZSBhbiBhbmdsZSBiZXR3ZWVuIHR3byB1bml0IHZlY3RvcnNcbi8vXG4vLyBTaW5jZSB3ZSBtZWFzdXJlIGFuZ2xlIGJldHdlZW4gcmFkaWkgb2YgY2lyY3VsYXIgYXJjcyxcbi8vIHdlIGNhbiB1c2Ugc2ltcGxpZmllZCBtYXRoICh3aXRob3V0IGxlbmd0aCBub3JtYWxpemF0aW9uKVxuLy9cbmZ1bmN0aW9uIHVuaXRfdmVjdG9yX2FuZ2xlKHV4LCB1eSwgdngsIHZ5KSB7XG4gIHZhciBzaWduID0gKHV4ICogdnkgLSB1eSAqIHZ4IDwgMCkgPyAtMSA6IDE7XG4gIHZhciBkb3QgID0gdXggKiB2eCArIHV5ICogdnk7XG5cbiAgLy8gQWRkIHRoaXMgdG8gd29yayB3aXRoIGFyYml0cmFyeSB2ZWN0b3JzOlxuICAvLyBkb3QgLz0gTWF0aC5zcXJ0KHV4ICogdXggKyB1eSAqIHV5KSAqIE1hdGguc3FydCh2eCAqIHZ4ICsgdnkgKiB2eSk7XG5cbiAgLy8gcm91bmRpbmcgZXJyb3JzLCBlLmcuIC0xLjAwMDAwMDAwMDAwMDAwMDIgY2FuIHNjcmV3IHVwIHRoaXNcbiAgaWYgKGRvdCA+ICAxLjApIHsgZG90ID0gIDEuMDsgfVxuICBpZiAoZG90IDwgLTEuMCkgeyBkb3QgPSAtMS4wOyB9XG5cbiAgcmV0dXJuIHNpZ24gKiBNYXRoLmFjb3MoZG90KTtcbn1cblxuXG4vLyBDb252ZXJ0IGZyb20gZW5kcG9pbnQgdG8gY2VudGVyIHBhcmFtZXRlcml6YXRpb24sXG4vLyBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvaW1wbG5vdGUuaHRtbCNBcmNJbXBsZW1lbnRhdGlvbk5vdGVzXG4vL1xuLy8gUmV0dXJuIFtjeCwgY3ksIHRoZXRhMSwgZGVsdGFfdGhldGFdXG4vL1xuZnVuY3Rpb24gZ2V0X2FyY19jZW50ZXIoeDEsIHkxLCB4MiwgeTIsIGZhLCBmcywgcngsIHJ5LCBzaW5fcGhpLCBjb3NfcGhpKSB7XG4gIC8vIFN0ZXAgMS5cbiAgLy9cbiAgLy8gTW92aW5nIGFuIGVsbGlwc2Ugc28gb3JpZ2luIHdpbGwgYmUgdGhlIG1pZGRsZXBvaW50IGJldHdlZW4gb3VyIHR3b1xuICAvLyBwb2ludHMuIEFmdGVyIHRoYXQsIHJvdGF0ZSBpdCB0byBsaW5lIHVwIGVsbGlwc2UgYXhlcyB3aXRoIGNvb3JkaW5hdGVcbiAgLy8gYXhlcy5cbiAgLy9cbiAgdmFyIHgxcCA9ICBjb3NfcGhpKih4MS14MikvMiArIHNpbl9waGkqKHkxLXkyKS8yO1xuICB2YXIgeTFwID0gLXNpbl9waGkqKHgxLXgyKS8yICsgY29zX3BoaSooeTEteTIpLzI7XG5cbiAgdmFyIHJ4X3NxICA9ICByeCAqIHJ4O1xuICB2YXIgcnlfc3EgID0gIHJ5ICogcnk7XG4gIHZhciB4MXBfc3EgPSB4MXAgKiB4MXA7XG4gIHZhciB5MXBfc3EgPSB5MXAgKiB5MXA7XG5cbiAgLy8gU3RlcCAyLlxuICAvL1xuICAvLyBDb21wdXRlIGNvb3JkaW5hdGVzIG9mIHRoZSBjZW50cmUgb2YgdGhpcyBlbGxpcHNlIChjeCcsIGN5JylcbiAgLy8gaW4gdGhlIG5ldyBjb29yZGluYXRlIHN5c3RlbS5cbiAgLy9cbiAgdmFyIHJhZGljYW50ID0gKHJ4X3NxICogcnlfc3EpIC0gKHJ4X3NxICogeTFwX3NxKSAtIChyeV9zcSAqIHgxcF9zcSk7XG5cbiAgaWYgKHJhZGljYW50IDwgMCkge1xuICAgIC8vIGR1ZSB0byByb3VuZGluZyBlcnJvcnMgaXQgbWlnaHQgYmUgZS5nLiAtMS4zODc3Nzg3ODA3ODE0NDU3ZS0xN1xuICAgIHJhZGljYW50ID0gMDtcbiAgfVxuXG4gIHJhZGljYW50IC89ICAgKHJ4X3NxICogeTFwX3NxKSArIChyeV9zcSAqIHgxcF9zcSk7XG4gIHJhZGljYW50ID0gTWF0aC5zcXJ0KHJhZGljYW50KSAqIChmYSA9PT0gZnMgPyAtMSA6IDEpO1xuXG4gIHZhciBjeHAgPSByYWRpY2FudCAqICByeC9yeSAqIHkxcDtcbiAgdmFyIGN5cCA9IHJhZGljYW50ICogLXJ5L3J4ICogeDFwO1xuXG4gIC8vIFN0ZXAgMy5cbiAgLy9cbiAgLy8gVHJhbnNmb3JtIGJhY2sgdG8gZ2V0IGNlbnRyZSBjb29yZGluYXRlcyAoY3gsIGN5KSBpbiB0aGUgb3JpZ2luYWxcbiAgLy8gY29vcmRpbmF0ZSBzeXN0ZW0uXG4gIC8vXG4gIHZhciBjeCA9IGNvc19waGkqY3hwIC0gc2luX3BoaSpjeXAgKyAoeDEreDIpLzI7XG4gIHZhciBjeSA9IHNpbl9waGkqY3hwICsgY29zX3BoaSpjeXAgKyAoeTEreTIpLzI7XG5cbiAgLy8gU3RlcCA0LlxuICAvL1xuICAvLyBDb21wdXRlIGFuZ2xlcyAodGhldGExLCBkZWx0YV90aGV0YSkuXG4gIC8vXG4gIHZhciB2MXggPSAgKHgxcCAtIGN4cCkgLyByeDtcbiAgdmFyIHYxeSA9ICAoeTFwIC0gY3lwKSAvIHJ5O1xuICB2YXIgdjJ4ID0gKC14MXAgLSBjeHApIC8gcng7XG4gIHZhciB2MnkgPSAoLXkxcCAtIGN5cCkgLyByeTtcblxuICB2YXIgdGhldGExID0gdW5pdF92ZWN0b3JfYW5nbGUoMSwgMCwgdjF4LCB2MXkpO1xuICB2YXIgZGVsdGFfdGhldGEgPSB1bml0X3ZlY3Rvcl9hbmdsZSh2MXgsIHYxeSwgdjJ4LCB2MnkpO1xuXG4gIGlmIChmcyA9PT0gMCAmJiBkZWx0YV90aGV0YSA+IDApIHtcbiAgICBkZWx0YV90aGV0YSAtPSBUQVU7XG4gIH1cbiAgaWYgKGZzID09PSAxICYmIGRlbHRhX3RoZXRhIDwgMCkge1xuICAgIGRlbHRhX3RoZXRhICs9IFRBVTtcbiAgfVxuXG4gIHJldHVybiBbIGN4LCBjeSwgdGhldGExLCBkZWx0YV90aGV0YSBdO1xufVxuXG4vL1xuLy8gQXBwcm94aW1hdGUgb25lIHVuaXQgYXJjIHNlZ21lbnQgd2l0aCBiw6l6aWVyIGN1cnZlcyxcbi8vIHNlZSBodHRwOi8vbWF0aC5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvODczMjI0XG4vL1xuZnVuY3Rpb24gYXBwcm94aW1hdGVfdW5pdF9hcmModGhldGExLCBkZWx0YV90aGV0YSkge1xuICB2YXIgYWxwaGEgPSA0LzMgKiBNYXRoLnRhbihkZWx0YV90aGV0YS80KTtcblxuICB2YXIgeDEgPSBNYXRoLmNvcyh0aGV0YTEpO1xuICB2YXIgeTEgPSBNYXRoLnNpbih0aGV0YTEpO1xuICB2YXIgeDIgPSBNYXRoLmNvcyh0aGV0YTEgKyBkZWx0YV90aGV0YSk7XG4gIHZhciB5MiA9IE1hdGguc2luKHRoZXRhMSArIGRlbHRhX3RoZXRhKTtcblxuICByZXR1cm4gWyB4MSwgeTEsIHgxIC0geTEqYWxwaGEsIHkxICsgeDEqYWxwaGEsIHgyICsgeTIqYWxwaGEsIHkyIC0geDIqYWxwaGEsIHgyLCB5MiBdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGEyYyh4MSwgeTEsIHgyLCB5MiwgZmEsIGZzLCByeCwgcnksIHBoaSkge1xuICB2YXIgc2luX3BoaSA9IE1hdGguc2luKHBoaSAqIFRBVSAvIDM2MCk7XG4gIHZhciBjb3NfcGhpID0gTWF0aC5jb3MocGhpICogVEFVIC8gMzYwKTtcblxuICAvLyBNYWtlIHN1cmUgcmFkaWkgYXJlIHZhbGlkXG4gIC8vXG4gIHZhciB4MXAgPSAgY29zX3BoaSooeDEteDIpLzIgKyBzaW5fcGhpKih5MS15MikvMjtcbiAgdmFyIHkxcCA9IC1zaW5fcGhpKih4MS14MikvMiArIGNvc19waGkqKHkxLXkyKS8yO1xuXG4gIGlmICh4MXAgPT09IDAgJiYgeTFwID09PSAwKSB7XG4gICAgLy8gd2UncmUgYXNrZWQgdG8gZHJhdyBsaW5lIHRvIGl0c2VsZlxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlmIChyeCA9PT0gMCB8fCByeSA9PT0gMCkge1xuICAgIC8vIG9uZSBvZiB0aGUgcmFkaWkgaXMgemVyb1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG5cbiAgLy8gQ29tcGVuc2F0ZSBvdXQtb2YtcmFuZ2UgcmFkaWlcbiAgLy9cbiAgcnggPSBNYXRoLmFicyhyeCk7XG4gIHJ5ID0gTWF0aC5hYnMocnkpO1xuXG4gIHZhciBsYW1iZGEgPSAoeDFwICogeDFwKSAvIChyeCAqIHJ4KSArICh5MXAgKiB5MXApIC8gKHJ5ICogcnkpO1xuICBpZiAobGFtYmRhID4gMSkge1xuICAgIHJ4ICo9IE1hdGguc3FydChsYW1iZGEpO1xuICAgIHJ5ICo9IE1hdGguc3FydChsYW1iZGEpO1xuICB9XG5cblxuICAvLyBHZXQgY2VudGVyIHBhcmFtZXRlcnMgKGN4LCBjeSwgdGhldGExLCBkZWx0YV90aGV0YSlcbiAgLy9cbiAgdmFyIGNjID0gZ2V0X2FyY19jZW50ZXIoeDEsIHkxLCB4MiwgeTIsIGZhLCBmcywgcngsIHJ5LCBzaW5fcGhpLCBjb3NfcGhpKTtcblxuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciB0aGV0YTEgPSBjY1syXTtcbiAgdmFyIGRlbHRhX3RoZXRhID0gY2NbM107XG5cbiAgLy8gU3BsaXQgYW4gYXJjIHRvIG11bHRpcGxlIHNlZ21lbnRzLCBzbyBlYWNoIHNlZ21lbnRcbiAgLy8gd2lsbCBiZSBsZXNzIHRoYW4gz4QvNCAoPSA5MMKwKVxuICAvL1xuICB2YXIgc2VnbWVudHMgPSBNYXRoLm1heChNYXRoLmNlaWwoTWF0aC5hYnMoZGVsdGFfdGhldGEpIC8gKFRBVSAvIDQpKSwgMSk7XG4gIGRlbHRhX3RoZXRhIC89IHNlZ21lbnRzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2VnbWVudHM7IGkrKykge1xuICAgIHJlc3VsdC5wdXNoKGFwcHJveGltYXRlX3VuaXRfYXJjKHRoZXRhMSwgZGVsdGFfdGhldGEpKTtcbiAgICB0aGV0YTEgKz0gZGVsdGFfdGhldGE7XG4gIH1cblxuICAvLyBXZSBoYXZlIGEgYmV6aWVyIGFwcHJveGltYXRpb24gb2YgYSB1bml0IGNpcmNsZSxcbiAgLy8gbm93IG5lZWQgdG8gdHJhbnNmb3JtIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGVsbGlwc2VcbiAgLy9cbiAgcmV0dXJuIHJlc3VsdC5tYXAoZnVuY3Rpb24gKGN1cnZlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJ2ZS5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgdmFyIHggPSBjdXJ2ZVtpICsgMF07XG4gICAgICB2YXIgeSA9IGN1cnZlW2kgKyAxXTtcblxuICAgICAgLy8gc2NhbGVcbiAgICAgIHggKj0gcng7XG4gICAgICB5ICo9IHJ5O1xuXG4gICAgICAvLyByb3RhdGVcbiAgICAgIHZhciB4cCA9IGNvc19waGkqeCAtIHNpbl9waGkqeTtcbiAgICAgIHZhciB5cCA9IHNpbl9waGkqeCArIGNvc19waGkqeTtcblxuICAgICAgLy8gdHJhbnNsYXRlXG4gICAgICBjdXJ2ZVtpICsgMF0gPSB4cCArIGNjWzBdO1xuICAgICAgY3VydmVbaSArIDFdID0geXAgKyBjY1sxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VydmU7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50LWRpc2FibGUgc3BhY2UtaW5maXgtb3BzICovXG5cbi8vIFRoZSBwcmVjaXNpb24gdXNlZCB0byBjb25zaWRlciBhbiBlbGxpcHNlIGFzIGEgY2lyY2xlXG4vL1xudmFyIGVwc2lsb24gPSAwLjAwMDAwMDAwMDE7XG5cbi8vIFRvIGNvbnZlcnQgZGVncmVlIGluIHJhZGlhbnNcbi8vXG52YXIgdG9yYWQgPSBNYXRoLlBJIC8gMTgwO1xuXG4vLyBDbGFzcyBjb25zdHJ1Y3RvciA6XG4vLyAgYW4gZWxsaXBzZSBjZW50cmVkIGF0IDAgd2l0aCByYWRpaSByeCxyeSBhbmQgeCAtIGF4aXMgLSBhbmdsZSBheC5cbi8vXG5mdW5jdGlvbiBFbGxpcHNlKHJ4LCByeSwgYXgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEVsbGlwc2UpKSB7IHJldHVybiBuZXcgRWxsaXBzZShyeCwgcnksIGF4KTsgfVxuICB0aGlzLnJ4ID0gcng7XG4gIHRoaXMucnkgPSByeTtcbiAgdGhpcy5heCA9IGF4O1xufVxuXG4vLyBBcHBseSBhIGxpbmVhciB0cmFuc2Zvcm0gbSB0byB0aGUgZWxsaXBzZVxuLy8gbSBpcyBhbiBhcnJheSByZXByZXNlbnRpbmcgYSBtYXRyaXggOlxuLy8gICAgLSAgICAgICAgIC1cbi8vICAgfCBtWzBdIG1bMl0gfFxuLy8gICB8IG1bMV0gbVszXSB8XG4vLyAgICAtICAgICAgICAgLVxuLy9cbkVsbGlwc2UucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChtKSB7XG4gIC8vIFdlIGNvbnNpZGVyIHRoZSBjdXJyZW50IGVsbGlwc2UgYXMgaW1hZ2Ugb2YgdGhlIHVuaXQgY2lyY2xlXG4gIC8vIGJ5IGZpcnN0IHNjYWxlKHJ4LHJ5KSBhbmQgdGhlbiByb3RhdGUoYXgpIC4uLlxuICAvLyBTbyB3ZSBhcHBseSBtYSA9ICBtIHggcm90YXRlKGF4KSB4IHNjYWxlKHJ4LHJ5KSB0byB0aGUgdW5pdCBjaXJjbGUuXG4gIHZhciBjID0gTWF0aC5jb3ModGhpcy5heCAqIHRvcmFkKSwgcyA9IE1hdGguc2luKHRoaXMuYXggKiB0b3JhZCk7XG4gIHZhciBtYSA9IFtcbiAgICB0aGlzLnJ4ICogKG1bMF0qYyArIG1bMl0qcyksXG4gICAgdGhpcy5yeCAqIChtWzFdKmMgKyBtWzNdKnMpLFxuICAgIHRoaXMucnkgKiAoLW1bMF0qcyArIG1bMl0qYyksXG4gICAgdGhpcy5yeSAqICgtbVsxXSpzICsgbVszXSpjKVxuICBdO1xuXG4gIC8vIG1hICogdHJhbnNwb3NlKG1hKSA9IFsgSiBMIF1cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgWyBMIEsgXVxuICAvLyBMIGlzIGNhbGN1bGF0ZWQgbGF0ZXIgKGlmIHRoZSBpbWFnZSBpcyBub3QgYSBjaXJjbGUpXG4gIHZhciBKID0gbWFbMF0qbWFbMF0gKyBtYVsyXSptYVsyXSxcbiAgICAgIEsgPSBtYVsxXSptYVsxXSArIG1hWzNdKm1hWzNdO1xuXG4gIC8vIHRoZSBkaXNjcmltaW5hbnQgb2YgdGhlIGNoYXJhY3RlcmlzdGljIHBvbHlub21pYWwgb2YgbWEgKiB0cmFuc3Bvc2UobWEpXG4gIHZhciBEID0gKChtYVswXS1tYVszXSkqKG1hWzBdLW1hWzNdKSArIChtYVsyXSttYVsxXSkqKG1hWzJdK21hWzFdKSkgKlxuICAgICAgICAgICgobWFbMF0rbWFbM10pKihtYVswXSttYVszXSkgKyAobWFbMl0tbWFbMV0pKihtYVsyXS1tYVsxXSkpO1xuXG4gIC8vIHRoZSBcIm1lYW4gZWlnZW52YWx1ZVwiXG4gIHZhciBKSyA9IChKICsgSykgLyAyO1xuXG4gIC8vIGNoZWNrIGlmIHRoZSBpbWFnZSBpcyAoYWxtb3N0KSBhIGNpcmNsZVxuICBpZiAoRCA8IGVwc2lsb24gKiBKSykge1xuICAgIC8vIGlmIGl0IGlzXG4gICAgdGhpcy5yeCA9IHRoaXMucnkgPSBNYXRoLnNxcnQoSkspO1xuICAgIHRoaXMuYXggPSAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gaWYgaXQgaXMgbm90IGEgY2lyY2xlXG4gIHZhciBMID0gbWFbMF0qbWFbMV0gKyBtYVsyXSptYVszXTtcblxuICBEID0gTWF0aC5zcXJ0KEQpO1xuXG4gIC8vIHtsMSxsMn0gPSB0aGUgdHdvIGVpZ2VuIHZhbHVlcyBvZiBtYSAqIHRyYW5zcG9zZShtYSlcbiAgdmFyIGwxID0gSksgKyBELzIsXG4gICAgICBsMiA9IEpLIC0gRC8yO1xuICAvLyB0aGUgeCAtIGF4aXMgLSByb3RhdGlvbiBhbmdsZSBpcyB0aGUgYXJndW1lbnQgb2YgdGhlIGwxIC0gZWlnZW52ZWN0b3JcbiAgLyplc2xpbnQtZGlzYWJsZSBpbmRlbnQqL1xuICB0aGlzLmF4ID0gKE1hdGguYWJzKEwpIDwgZXBzaWxvbiAmJiBNYXRoLmFicyhsMSAtIEspIDwgZXBzaWxvbikgP1xuICAgIDkwXG4gIDpcbiAgICBNYXRoLmF0YW4oTWF0aC5hYnMoTCkgPiBNYXRoLmFicyhsMSAtIEspID9cbiAgICAgIChsMSAtIEopIC8gTFxuICAgIDpcbiAgICAgIEwgLyAobDEgLSBLKVxuICAgICkgKiAxODAgLyBNYXRoLlBJO1xuICAvKmVzbGludC1lbmFibGUgaW5kZW50Ki9cblxuICAvLyBpZiBheCA+IDAgPT4gcnggPSBzcXJ0KGwxKSwgcnkgPSBzcXJ0KGwyKSwgZWxzZSBleGNoYW5nZSBheGVzIGFuZCBheCArPSA5MFxuICBpZiAodGhpcy5heCA+PSAwKSB7XG4gICAgLy8gaWYgYXggaW4gWzAsOTBdXG4gICAgdGhpcy5yeCA9IE1hdGguc3FydChsMSk7XG4gICAgdGhpcy5yeSA9IE1hdGguc3FydChsMik7XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgYXggaW4gXS05MCwwWyA9PiBleGNoYW5nZSBheGVzXG4gICAgdGhpcy5heCArPSA5MDtcbiAgICB0aGlzLnJ4ID0gTWF0aC5zcXJ0KGwyKTtcbiAgICB0aGlzLnJ5ID0gTWF0aC5zcXJ0KGwxKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gQ2hlY2sgaWYgdGhlIGVsbGlwc2UgaXMgKGFsbW9zdCkgZGVnZW5lcmF0ZSwgaS5lLiByeCA9IDAgb3IgcnkgPSAwXG4vL1xuRWxsaXBzZS5wcm90b3R5cGUuaXNEZWdlbmVyYXRlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKHRoaXMucnggPCBlcHNpbG9uICogdGhpcy5yeSB8fCB0aGlzLnJ5IDwgZXBzaWxvbiAqIHRoaXMucngpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbGxpcHNlO1xuIiwiLy8gU1ZHIFBhdGggdHJhbnNmb3JtYXRpb25zIGxpYnJhcnlcbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyAgICBTdmdQYXRoKCcuLi4nKVxuLy8gICAgICAudHJhbnNsYXRlKC0xNTAsIC0xMDApXG4vLyAgICAgIC5zY2FsZSgwLjUpXG4vLyAgICAgIC50cmFuc2xhdGUoLTE1MCwgLTEwMClcbi8vICAgICAgLnRvRml4ZWQoMSlcbi8vICAgICAgLnRvU3RyaW5nKClcbi8vXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgcGF0aFBhcnNlICAgICAgPSByZXF1aXJlKCcuL3BhdGhfcGFyc2UnKTtcbnZhciB0cmFuc2Zvcm1QYXJzZSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtX3BhcnNlJyk7XG52YXIgbWF0cml4ICAgICAgICAgPSByZXF1aXJlKCcuL21hdHJpeCcpO1xudmFyIGEyYyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9hMmMnKTtcbnZhciBlbGxpcHNlICAgICAgICA9IHJlcXVpcmUoJy4vZWxsaXBzZScpO1xuXG5cbi8vIENsYXNzIGNvbnN0cnVjdG9yXG4vL1xuZnVuY3Rpb24gU3ZnUGF0aChwYXRoKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTdmdQYXRoKSkgeyByZXR1cm4gbmV3IFN2Z1BhdGgocGF0aCk7IH1cblxuICB2YXIgcHN0YXRlID0gcGF0aFBhcnNlKHBhdGgpO1xuXG4gIC8vIEFycmF5IG9mIHBhdGggc2VnbWVudHMuXG4gIC8vIEVhY2ggc2VnbWVudCBpcyBhcnJheSBbY29tbWFuZCwgcGFyYW0xLCBwYXJhbTIsIC4uLl1cbiAgdGhpcy5zZWdtZW50cyA9IHBzdGF0ZS5zZWdtZW50cztcblxuICAvLyBFcnJvciBtZXNzYWdlIG9uIHBhcnNlIGVycm9yLlxuICB0aGlzLmVyciAgICAgID0gcHN0YXRlLmVycjtcblxuICAvLyBUcmFuc2Zvcm1zIHN0YWNrIGZvciBsYXp5IGV2YWx1YXRpb25cbiAgdGhpcy5fX3N0YWNrICAgID0gW107XG59XG5cblN2Z1BhdGguZnJvbSA9IGZ1bmN0aW9uIChzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKSByZXR1cm4gbmV3IFN2Z1BhdGgoc3JjKTtcblxuICBpZiAoc3JjIGluc3RhbmNlb2YgU3ZnUGF0aCkge1xuICAgIC8vIENyZWF0ZSBlbXB0eSBvYmplY3RcbiAgICB2YXIgcyA9IG5ldyBTdmdQYXRoKCcnKTtcblxuICAgIC8vIENsb25lIHByb3Blcmllc1xuICAgIHMuZXJyID0gc3JjLmVycjtcbiAgICBzLnNlZ21lbnRzID0gc3JjLnNlZ21lbnRzLm1hcChmdW5jdGlvbiAoc2dtKSB7IHJldHVybiBzZ20uc2xpY2UoKTsgfSk7XG4gICAgcy5fX3N0YWNrID0gc3JjLl9fc3RhY2subWFwKGZ1bmN0aW9uIChtKSB7XG4gICAgICByZXR1cm4gbWF0cml4KCkubWF0cml4KG0udG9BcnJheSgpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKCdTdmdQYXRoLmZyb206IGludmFsaWQgcGFyYW0gdHlwZSAnICsgc3JjKTtcbn07XG5cblxuU3ZnUGF0aC5wcm90b3R5cGUuX19tYXRyaXggPSBmdW5jdGlvbiAobSkge1xuICB2YXIgc2VsZiA9IHRoaXMsIGk7XG5cbiAgLy8gUXVpY2sgbGVhdmUgZm9yIGVtcHR5IG1hdHJpeFxuICBpZiAoIW0ucXVldWUubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gIHRoaXMuaXRlcmF0ZShmdW5jdGlvbiAocywgaW5kZXgsIHgsIHkpIHtcbiAgICB2YXIgcCwgcmVzdWx0LCBuYW1lLCBpc1JlbGF0aXZlO1xuXG4gICAgc3dpdGNoIChzWzBdKSB7XG5cbiAgICAgIC8vIFByb2Nlc3MgJ2Fzc3ltZXRyaWMnIGNvbW1hbmRzIHNlcGFyYXRlbHlcbiAgICAgIGNhc2UgJ3YnOlxuICAgICAgICBwICAgICAgPSBtLmNhbGMoMCwgc1sxXSwgdHJ1ZSk7XG4gICAgICAgIHJlc3VsdCA9IChwWzBdID09PSAwKSA/IFsgJ3YnLCBwWzFdIF0gOiBbICdsJywgcFswXSwgcFsxXSBdO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnVic6XG4gICAgICAgIHAgICAgICA9IG0uY2FsYyh4LCBzWzFdLCBmYWxzZSk7XG4gICAgICAgIHJlc3VsdCA9IChwWzBdID09PSBtLmNhbGMoeCwgeSwgZmFsc2UpWzBdKSA/IFsgJ1YnLCBwWzFdIF0gOiBbICdMJywgcFswXSwgcFsxXSBdO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnaCc6XG4gICAgICAgIHAgICAgICA9IG0uY2FsYyhzWzFdLCAwLCB0cnVlKTtcbiAgICAgICAgcmVzdWx0ID0gKHBbMV0gPT09IDApID8gWyAnaCcsIHBbMF0gXSA6IFsgJ2wnLCBwWzBdLCBwWzFdIF07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdIJzpcbiAgICAgICAgcCAgICAgID0gbS5jYWxjKHNbMV0sIHksIGZhbHNlKTtcbiAgICAgICAgcmVzdWx0ID0gKHBbMV0gPT09IG0uY2FsYyh4LCB5LCBmYWxzZSlbMV0pID8gWyAnSCcsIHBbMF0gXSA6IFsgJ0wnLCBwWzBdLCBwWzFdIF07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdhJzpcbiAgICAgIGNhc2UgJ0EnOlxuICAgICAgICAvLyBBUkMgaXM6IFsnQScsIHJ4LCByeSwgeC1heGlzLXJvdGF0aW9uLCBsYXJnZS1hcmMtZmxhZywgc3dlZXAtZmxhZywgeCwgeV1cblxuICAgICAgICAvLyBEcm9wIHNlZ21lbnQgaWYgYXJjIGlzIGVtcHR5IChlbmQgcG9pbnQgPT09IHN0YXJ0IHBvaW50KVxuICAgICAgICAvKmlmICgoc1swXSA9PT0gJ0EnICYmIHNbNl0gPT09IHggJiYgc1s3XSA9PT0geSkgfHxcbiAgICAgICAgICAgIChzWzBdID09PSAnYScgJiYgc1s2XSA9PT0gMCAmJiBzWzddID09PSAwKSkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSovXG5cbiAgICAgICAgLy8gVHJhbnNmb3JtIHJ4LCByeSBhbmQgdGhlIHgtYXhpcy1yb3RhdGlvblxuICAgICAgICB2YXIgbWEgPSBtLnRvQXJyYXkoKTtcbiAgICAgICAgdmFyIGUgPSBlbGxpcHNlKHNbMV0sIHNbMl0sIHNbM10pLnRyYW5zZm9ybShtYSk7XG5cbiAgICAgICAgLy8gZmxpcCBzd2VlcC1mbGFnIGlmIG1hdHJpeCBpcyBub3Qgb3JpZW50YXRpb24tcHJlc2VydmluZ1xuICAgICAgICBpZiAobWFbMF0gKiBtYVszXSAtIG1hWzFdICogbWFbMl0gPCAwKSB7XG4gICAgICAgICAgc1s1XSA9IHNbNV0gPyAnMCcgOiAnMSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUcmFuc2Zvcm0gZW5kIHBvaW50IGFzIHVzdWFsICh3aXRob3V0IHRyYW5zbGF0aW9uIGZvciByZWxhdGl2ZSBub3RhdGlvbilcbiAgICAgICAgcCA9IG0uY2FsYyhzWzZdLCBzWzddLCBzWzBdID09PSAnYScpO1xuXG4gICAgICAgIC8vIEVtcHR5IGFyY3MgY2FuIGJlIGlnbm9yZWQgYnkgcmVuZGVyZXIsIGJ1dCBzaG91bGQgbm90IGJlIGRyb3BwZWRcbiAgICAgICAgLy8gdG8gYXZvaWQgY29sbGlzaW9ucyB3aXRoIGBTIEEgU2AgYW5kIHNvIG9uLiBSZXBsYWNlIHdpdGggZW1wdHkgbGluZS5cbiAgICAgICAgaWYgKChzWzBdID09PSAnQScgJiYgc1s2XSA9PT0geCAmJiBzWzddID09PSB5KSB8fFxuICAgICAgICAgICAgKHNbMF0gPT09ICdhJyAmJiBzWzZdID09PSAwICYmIHNbN10gPT09IDApKSB7XG4gICAgICAgICAgcmVzdWx0ID0gWyBzWzBdID09PSAnYScgPyAnbCcgOiAnTCcsIHBbMF0sIHBbMV0gXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSByZXN1bHRpbmcgZWxsaXBzZSBpcyAoYWxtb3N0KSBhIHNlZ21lbnQgLi4uXG4gICAgICAgIGlmIChlLmlzRGVnZW5lcmF0ZSgpKSB7XG4gICAgICAgICAgLy8gcmVwbGFjZSB0aGUgYXJjIGJ5IGEgbGluZVxuICAgICAgICAgIHJlc3VsdCA9IFsgc1swXSA9PT0gJ2EnID8gJ2wnIDogJ0wnLCBwWzBdLCBwWzFdIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gaWYgaXQgaXMgYSByZWFsIGVsbGlwc2VcbiAgICAgICAgICAvLyBzWzBdLCBzWzRdIGFuZCBzWzVdIGFyZSBub3QgbW9kaWZpZWRcbiAgICAgICAgICByZXN1bHQgPSBbIHNbMF0sIGUucngsIGUucnksIGUuYXgsIHNbNF0sIHNbNV0sIHBbMF0sIHBbMV0gXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtJzpcbiAgICAgICAgLy8gRWRnZSBjYXNlLiBUaGUgdmVyeSBmaXJzdCBgbWAgc2hvdWxkIGJlIHByb2Nlc3NlZCBhcyBhYnNvbHV0ZSwgaWYgaGFwcGVucy5cbiAgICAgICAgLy8gTWFrZSBzZW5zZSBmb3IgY29vcmQgc2hpZnQgdHJhbnNmb3Jtcy5cbiAgICAgICAgaXNSZWxhdGl2ZSA9IGluZGV4ID4gMDtcblxuICAgICAgICBwID0gbS5jYWxjKHNbMV0sIHNbMl0sIGlzUmVsYXRpdmUpO1xuICAgICAgICByZXN1bHQgPSBbICdtJywgcFswXSwgcFsxXSBdO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbmFtZSAgICAgICA9IHNbMF07XG4gICAgICAgIHJlc3VsdCAgICAgPSBbIG5hbWUgXTtcbiAgICAgICAgaXNSZWxhdGl2ZSA9IChuYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUpO1xuXG4gICAgICAgIC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9ucyB0byB0aGUgc2VnbWVudFxuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgIHAgPSBtLmNhbGMoc1tpXSwgc1tpICsgMV0sIGlzUmVsYXRpdmUpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHBbMF0sIHBbMV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5zZWdtZW50c1tpbmRleF0gPSByZXN1bHQ7XG4gIH0sIHRydWUpO1xufTtcblxuXG4vLyBBcHBseSBzdGFja2VkIGNvbW1hbmRzXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUuX19ldmFsdWF0ZVN0YWNrID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbSwgaTtcblxuICBpZiAoIXRoaXMuX19zdGFjay5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMuX19zdGFjay5sZW5ndGggPT09IDEpIHtcbiAgICB0aGlzLl9fbWF0cml4KHRoaXMuX19zdGFja1swXSk7XG4gICAgdGhpcy5fX3N0YWNrID0gW107XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbSA9IG1hdHJpeCgpO1xuICBpID0gdGhpcy5fX3N0YWNrLmxlbmd0aDtcblxuICB3aGlsZSAoLS1pID49IDApIHtcbiAgICBtLm1hdHJpeCh0aGlzLl9fc3RhY2tbaV0udG9BcnJheSgpKTtcbiAgfVxuXG4gIHRoaXMuX19tYXRyaXgobSk7XG4gIHRoaXMuX19zdGFjayA9IFtdO1xufTtcblxuXG4vLyBDb252ZXJ0IHByb2Nlc3NlZCBTVkcgUGF0aCBiYWNrIHRvIHN0cmluZ1xuLy9cblN2Z1BhdGgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWxlbWVudHMgPSBbXSwgc2tpcENtZCwgY21kO1xuXG4gIHRoaXMuX19ldmFsdWF0ZVN0YWNrKCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gcmVtb3ZlIHJlcGVhdGluZyBjb21tYW5kcyBuYW1lc1xuICAgIGNtZCA9IHRoaXMuc2VnbWVudHNbaV1bMF07XG4gICAgc2tpcENtZCA9IGkgPiAwICYmIGNtZCAhPT0gJ20nICYmIGNtZCAhPT0gJ00nICYmIGNtZCA9PT0gdGhpcy5zZWdtZW50c1tpIC0gMV1bMF07XG4gICAgZWxlbWVudHMgPSBlbGVtZW50cy5jb25jYXQoc2tpcENtZCA/IHRoaXMuc2VnbWVudHNbaV0uc2xpY2UoMSkgOiB0aGlzLnNlZ21lbnRzW2ldKTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50cy5qb2luKCcgJylcbiAgICAvLyBPcHRpbWl6YXRpb25zOiByZW1vdmUgc3BhY2VzIGFyb3VuZCBjb21tYW5kcyAmIGJlZm9yZSBgLWBcbiAgICAvL1xuICAgIC8vIFdlIGNvdWxkIGFsc28gcmVtb3ZlIGxlYWRpbmcgemVyb3MgZm9yIGAwLjVgLWxpa2UgdmFsdWVzLFxuICAgIC8vIGJ1dCB0aGVpciBjb3VudCBpcyB0b28gc21hbGwgdG8gc3BlbmQgdGltZSBmb3IuXG4gICAgLnJlcGxhY2UoLyA/KFthY2hsbXFyc3R2el0pID8vZ2ksICckMScpXG4gICAgLnJlcGxhY2UoLyBcXC0vZywgJy0nKVxuICAgIC8vIHdvcmthcm91bmQgZm9yIEZvbnRGb3JnZSBTVkcgaW1wb3J0aW5nIGJ1Z1xuICAgIC5yZXBsYWNlKC96bS9nLCAneiBtJyk7XG59O1xuXG5cbi8vIFRyYW5zbGF0ZSBwYXRoIHRvICh4IFssIHldKVxuLy9cblN2Z1BhdGgucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gIHRoaXMuX19zdGFjay5wdXNoKG1hdHJpeCgpLnRyYW5zbGF0ZSh4LCB5IHx8IDApKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIFNjYWxlIHBhdGggdG8gKHN4IFssIHN5XSlcbi8vIHN5ID0gc3ggaWYgbm90IGRlZmluZWRcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uIChzeCwgc3kpIHtcbiAgdGhpcy5fX3N0YWNrLnB1c2gobWF0cml4KCkuc2NhbGUoc3gsICghc3kgJiYgKHN5ICE9PSAwKSkgPyBzeCA6IHN5KSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBSb3RhdGUgcGF0aCBhcm91bmQgcG9pbnQgKHN4IFssIHN5XSlcbi8vIHN5ID0gc3ggaWYgbm90IGRlZmluZWRcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoYW5nbGUsIHJ4LCByeSkge1xuICB0aGlzLl9fc3RhY2sucHVzaChtYXRyaXgoKS5yb3RhdGUoYW5nbGUsIHJ4IHx8IDAsIHJ5IHx8IDApKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIFNrZXcgcGF0aCBhbG9uZyB0aGUgWCBheGlzIGJ5IGBkZWdyZWVzYCBhbmdsZVxuLy9cblN2Z1BhdGgucHJvdG90eXBlLnNrZXdYID0gZnVuY3Rpb24gKGRlZ3JlZXMpIHtcbiAgdGhpcy5fX3N0YWNrLnB1c2gobWF0cml4KCkuc2tld1goZGVncmVlcykpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gU2tldyBwYXRoIGFsb25nIHRoZSBZIGF4aXMgYnkgYGRlZ3JlZXNgIGFuZ2xlXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUuc2tld1kgPSBmdW5jdGlvbiAoZGVncmVlcykge1xuICB0aGlzLl9fc3RhY2sucHVzaChtYXRyaXgoKS5za2V3WShkZWdyZWVzKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBBcHBseSBtYXRyaXggdHJhbnNmb3JtIChhcnJheSBvZiA2IGVsZW1lbnRzKVxuLy9cblN2Z1BhdGgucHJvdG90eXBlLm1hdHJpeCA9IGZ1bmN0aW9uIChtKSB7XG4gIHRoaXMuX19zdGFjay5wdXNoKG1hdHJpeCgpLm1hdHJpeChtKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBUcmFuc2Zvcm0gcGF0aCBhY2NvcmRpbmcgdG8gXCJ0cmFuc2Zvcm1cIiBhdHRyIG9mIFNWRyBzcGVjXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUudHJhbnNmb3JtID0gZnVuY3Rpb24gKHRyYW5zZm9ybVN0cmluZykge1xuICBpZiAoIXRyYW5zZm9ybVN0cmluZy50cmltKCkpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9fc3RhY2sucHVzaCh0cmFuc2Zvcm1QYXJzZSh0cmFuc2Zvcm1TdHJpbmcpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIFJvdW5kIGNvb3JkcyB3aXRoIGdpdmVuIGRlY2ltYWwgcHJlY2l0aW9uLlxuLy8gMCBieSBkZWZhdWx0ICh0byBpbnRlZ2Vycylcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5yb3VuZCA9IGZ1bmN0aW9uIChkKSB7XG4gIHZhciBjb250b3VyU3RhcnREZWx0YVggPSAwLCBjb250b3VyU3RhcnREZWx0YVkgPSAwLCBkZWx0YVggPSAwLCBkZWx0YVkgPSAwLCBsO1xuXG4gIGQgPSBkIHx8IDA7XG5cbiAgdGhpcy5fX2V2YWx1YXRlU3RhY2soKTtcblxuICB0aGlzLnNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKHMpIHtcbiAgICB2YXIgaXNSZWxhdGl2ZSA9IChzWzBdLnRvTG93ZXJDYXNlKCkgPT09IHNbMF0pO1xuXG4gICAgc3dpdGNoIChzWzBdKSB7XG4gICAgICBjYXNlICdIJzpcbiAgICAgIGNhc2UgJ2gnOlxuICAgICAgICBpZiAoaXNSZWxhdGl2ZSkgeyBzWzFdICs9IGRlbHRhWDsgfVxuICAgICAgICBkZWx0YVggPSBzWzFdIC0gc1sxXS50b0ZpeGVkKGQpO1xuICAgICAgICBzWzFdID0gK3NbMV0udG9GaXhlZChkKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdWJzpcbiAgICAgIGNhc2UgJ3YnOlxuICAgICAgICBpZiAoaXNSZWxhdGl2ZSkgeyBzWzFdICs9IGRlbHRhWTsgfVxuICAgICAgICBkZWx0YVkgPSBzWzFdIC0gc1sxXS50b0ZpeGVkKGQpO1xuICAgICAgICBzWzFdID0gK3NbMV0udG9GaXhlZChkKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdaJzpcbiAgICAgIGNhc2UgJ3onOlxuICAgICAgICBkZWx0YVggPSBjb250b3VyU3RhcnREZWx0YVg7XG4gICAgICAgIGRlbHRhWSA9IGNvbnRvdXJTdGFydERlbHRhWTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdNJzpcbiAgICAgIGNhc2UgJ20nOlxuICAgICAgICBpZiAoaXNSZWxhdGl2ZSkge1xuICAgICAgICAgIHNbMV0gKz0gZGVsdGFYO1xuICAgICAgICAgIHNbMl0gKz0gZGVsdGFZO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsdGFYID0gc1sxXSAtIHNbMV0udG9GaXhlZChkKTtcbiAgICAgICAgZGVsdGFZID0gc1syXSAtIHNbMl0udG9GaXhlZChkKTtcblxuICAgICAgICBjb250b3VyU3RhcnREZWx0YVggPSBkZWx0YVg7XG4gICAgICAgIGNvbnRvdXJTdGFydERlbHRhWSA9IGRlbHRhWTtcblxuICAgICAgICBzWzFdID0gK3NbMV0udG9GaXhlZChkKTtcbiAgICAgICAgc1syXSA9ICtzWzJdLnRvRml4ZWQoZCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnQSc6XG4gICAgICBjYXNlICdhJzpcbiAgICAgICAgLy8gW2NtZCwgcngsIHJ5LCB4LWF4aXMtcm90YXRpb24sIGxhcmdlLWFyYy1mbGFnLCBzd2VlcC1mbGFnLCB4LCB5XVxuICAgICAgICBpZiAoaXNSZWxhdGl2ZSkge1xuICAgICAgICAgIHNbNl0gKz0gZGVsdGFYO1xuICAgICAgICAgIHNbN10gKz0gZGVsdGFZO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsdGFYID0gc1s2XSAtIHNbNl0udG9GaXhlZChkKTtcbiAgICAgICAgZGVsdGFZID0gc1s3XSAtIHNbN10udG9GaXhlZChkKTtcblxuICAgICAgICBzWzFdID0gK3NbMV0udG9GaXhlZChkKTtcbiAgICAgICAgc1syXSA9ICtzWzJdLnRvRml4ZWQoZCk7XG4gICAgICAgIHNbM10gPSArc1szXS50b0ZpeGVkKGQgKyAyKTsgLy8gYmV0dGVyIHByZWNpc2lvbiBmb3Igcm90YXRpb25cbiAgICAgICAgc1s2XSA9ICtzWzZdLnRvRml4ZWQoZCk7XG4gICAgICAgIHNbN10gPSArc1s3XS50b0ZpeGVkKGQpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIGEgYyBsIHEgcyB0XG4gICAgICAgIGwgPSBzLmxlbmd0aDtcblxuICAgICAgICBpZiAoaXNSZWxhdGl2ZSkge1xuICAgICAgICAgIHNbbCAtIDJdICs9IGRlbHRhWDtcbiAgICAgICAgICBzW2wgLSAxXSArPSBkZWx0YVk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWx0YVggPSBzW2wgLSAyXSAtIHNbbCAtIDJdLnRvRml4ZWQoZCk7XG4gICAgICAgIGRlbHRhWSA9IHNbbCAtIDFdIC0gc1tsIC0gMV0udG9GaXhlZChkKTtcblxuICAgICAgICBzLmZvckVhY2goZnVuY3Rpb24gKHZhbCwgaSkge1xuICAgICAgICAgIGlmICghaSkgeyByZXR1cm47IH1cbiAgICAgICAgICBzW2ldID0gK3NbaV0udG9GaXhlZChkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBBcHBseSBpdGVyYXRvciBmdW5jdGlvbiB0byBhbGwgc2VnbWVudHMuIElmIGZ1bmN0aW9uIHJldHVybnMgcmVzdWx0LFxuLy8gY3VycmVudCBzZWdtZW50IHdpbGwgYmUgcmVwbGFjZWQgdG8gYXJyYXkgb2YgcmV0dXJuZWQgc2VnbWVudHMuXG4vLyBJZiBlbXB0eSBhcnJheSBpcyByZXR1cm5lZCwgY3VycmVudCByZWdtZW50IHdpbGwgYmUgZGVsZXRlZC5cbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBrZWVwTGF6eVN0YWNrKSB7XG4gIHZhciBzZWdtZW50cyA9IHRoaXMuc2VnbWVudHMsXG4gICAgICByZXBsYWNlbWVudHMgPSB7fSxcbiAgICAgIG5lZWRSZXBsYWNlID0gZmFsc2UsXG4gICAgICBsYXN0WCA9IDAsXG4gICAgICBsYXN0WSA9IDAsXG4gICAgICBjb3VudG91clN0YXJ0WCA9IDAsXG4gICAgICBjb3VudG91clN0YXJ0WSA9IDA7XG4gIHZhciBpLCBqLCBuZXdTZWdtZW50cztcblxuICBpZiAoIWtlZXBMYXp5U3RhY2spIHtcbiAgICB0aGlzLl9fZXZhbHVhdGVTdGFjaygpO1xuICB9XG5cbiAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbiAocywgaW5kZXgpIHtcblxuICAgIHZhciByZXMgPSBpdGVyYXRvcihzLCBpbmRleCwgbGFzdFgsIGxhc3RZKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHJlcykpIHtcbiAgICAgIHJlcGxhY2VtZW50c1tpbmRleF0gPSByZXM7XG4gICAgICBuZWVkUmVwbGFjZSA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGlzUmVsYXRpdmUgPSAoc1swXSA9PT0gc1swXS50b0xvd2VyQ2FzZSgpKTtcblxuICAgIC8vIGNhbGN1bGF0ZSBhYnNvbHV0ZSBYIGFuZCBZXG4gICAgc3dpdGNoIChzWzBdKSB7XG4gICAgICBjYXNlICdtJzpcbiAgICAgIGNhc2UgJ00nOlxuICAgICAgICBsYXN0WCA9IHNbMV0gKyAoaXNSZWxhdGl2ZSA/IGxhc3RYIDogMCk7XG4gICAgICAgIGxhc3RZID0gc1syXSArIChpc1JlbGF0aXZlID8gbGFzdFkgOiAwKTtcbiAgICAgICAgY291bnRvdXJTdGFydFggPSBsYXN0WDtcbiAgICAgICAgY291bnRvdXJTdGFydFkgPSBsYXN0WTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdoJzpcbiAgICAgIGNhc2UgJ0gnOlxuICAgICAgICBsYXN0WCA9IHNbMV0gKyAoaXNSZWxhdGl2ZSA/IGxhc3RYIDogMCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAndic6XG4gICAgICBjYXNlICdWJzpcbiAgICAgICAgbGFzdFkgPSBzWzFdICsgKGlzUmVsYXRpdmUgPyBsYXN0WSA6IDApO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ3onOlxuICAgICAgY2FzZSAnWic6XG4gICAgICAgIC8vIFRoYXQgbWFrZSBzZW5jZSBmb3IgbXVsdGlwbGUgY29udG91cnNcbiAgICAgICAgbGFzdFggPSBjb3VudG91clN0YXJ0WDtcbiAgICAgICAgbGFzdFkgPSBjb3VudG91clN0YXJ0WTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsYXN0WCA9IHNbcy5sZW5ndGggLSAyXSArIChpc1JlbGF0aXZlID8gbGFzdFggOiAwKTtcbiAgICAgICAgbGFzdFkgPSBzW3MubGVuZ3RoIC0gMV0gKyAoaXNSZWxhdGl2ZSA/IGxhc3RZIDogMCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBSZXBsYWNlIHNlZ21lbnRzIGlmIGl0ZXJhdG9yIHJldHVybiByZXN1bHRzXG5cbiAgaWYgKCFuZWVkUmVwbGFjZSkgeyByZXR1cm4gdGhpczsgfVxuXG4gIG5ld1NlZ21lbnRzID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHR5cGVvZiByZXBsYWNlbWVudHNbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgcmVwbGFjZW1lbnRzW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIG5ld1NlZ21lbnRzLnB1c2gocmVwbGFjZW1lbnRzW2ldW2pdKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U2VnbWVudHMucHVzaChzZWdtZW50c1tpXSk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5zZWdtZW50cyA9IG5ld1NlZ21lbnRzO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBDb252ZXJ0cyBzZWdtZW50cyBmcm9tIHJlbGF0aXZlIHRvIGFic29sdXRlXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUuYWJzID0gZnVuY3Rpb24gKCkge1xuXG4gIHRoaXMuaXRlcmF0ZShmdW5jdGlvbiAocywgaW5kZXgsIHgsIHkpIHtcbiAgICB2YXIgbmFtZSA9IHNbMF0sXG4gICAgICAgIG5hbWVVQyA9IG5hbWUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgaTtcblxuICAgIC8vIFNraXAgYWJzb2x1dGUgY29tbWFuZHNcbiAgICBpZiAobmFtZSA9PT0gbmFtZVVDKSB7IHJldHVybjsgfVxuXG4gICAgc1swXSA9IG5hbWVVQztcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAndic6XG4gICAgICAgIC8vIHYgaGFzIHNoaWZ0ZWQgY29vcmRzIHBhcml0eVxuICAgICAgICBzWzFdICs9IHk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnYSc6XG4gICAgICAgIC8vIEFSQyBpczogWydBJywgcngsIHJ5LCB4LWF4aXMtcm90YXRpb24sIGxhcmdlLWFyYy1mbGFnLCBzd2VlcC1mbGFnLCB4LCB5XVxuICAgICAgICAvLyB0b3VjaCB4LCB5IG9ubHlcbiAgICAgICAgc1s2XSArPSB4O1xuICAgICAgICBzWzddICs9IHk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBzW2ldICs9IGkgJSAyID8geCA6IHk7IC8vIG9kZCB2YWx1ZXMgYXJlIFgsIGV2ZW4gLSBZXG4gICAgICAgIH1cbiAgICB9XG4gIH0sIHRydWUpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBDb252ZXJ0cyBzZWdtZW50cyBmcm9tIGFic29sdXRlIHRvIHJlbGF0aXZlXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUucmVsID0gZnVuY3Rpb24gKCkge1xuXG4gIHRoaXMuaXRlcmF0ZShmdW5jdGlvbiAocywgaW5kZXgsIHgsIHkpIHtcbiAgICB2YXIgbmFtZSA9IHNbMF0sXG4gICAgICAgIG5hbWVMQyA9IG5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgaTtcblxuICAgIC8vIFNraXAgcmVsYXRpdmUgY29tbWFuZHNcbiAgICBpZiAobmFtZSA9PT0gbmFtZUxDKSB7IHJldHVybjsgfVxuXG4gICAgLy8gRG9uJ3QgdG91Y2ggdGhlIGZpcnN0IE0gdG8gYXZvaWQgcG90ZW50aWFsIGNvbmZ1c2lvbnMuXG4gICAgaWYgKGluZGV4ID09PSAwICYmIG5hbWUgPT09ICdNJykgeyByZXR1cm47IH1cblxuICAgIHNbMF0gPSBuYW1lTEM7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgJ1YnOlxuICAgICAgICAvLyBWIGhhcyBzaGlmdGVkIGNvb3JkcyBwYXJpdHlcbiAgICAgICAgc1sxXSAtPSB5O1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ0EnOlxuICAgICAgICAvLyBBUkMgaXM6IFsnQScsIHJ4LCByeSwgeC1heGlzLXJvdGF0aW9uLCBsYXJnZS1hcmMtZmxhZywgc3dlZXAtZmxhZywgeCwgeV1cbiAgICAgICAgLy8gdG91Y2ggeCwgeSBvbmx5XG4gICAgICAgIHNbNl0gLT0geDtcbiAgICAgICAgc1s3XSAtPSB5O1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgc1tpXSAtPSBpICUgMiA/IHggOiB5OyAvLyBvZGQgdmFsdWVzIGFyZSBYLCBldmVuIC0gWVxuICAgICAgICB9XG4gICAgfVxuICB9LCB0cnVlKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gQ29udmVydHMgYXJjcyB0byBjdWJpYyBiw6l6aWVyIGN1cnZlc1xuLy9cblN2Z1BhdGgucHJvdG90eXBlLnVuYXJjID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLml0ZXJhdGUoZnVuY3Rpb24gKHMsIGluZGV4LCB4LCB5KSB7XG4gICAgdmFyIG5ld19zZWdtZW50cywgbmV4dFgsIG5leHRZLCByZXN1bHQgPSBbXSwgbmFtZSA9IHNbMF07XG5cbiAgICAvLyBTa2lwIGFueXRoaW5nIGV4Y2VwdCBhcmNzXG4gICAgaWYgKG5hbWUgIT09ICdBJyAmJiBuYW1lICE9PSAnYScpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIGlmIChuYW1lID09PSAnYScpIHtcbiAgICAgIC8vIGNvbnZlcnQgcmVsYXRpdmUgYXJjIGNvb3JkaW5hdGVzIHRvIGFic29sdXRlXG4gICAgICBuZXh0WCA9IHggKyBzWzZdO1xuICAgICAgbmV4dFkgPSB5ICsgc1s3XTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dFggPSBzWzZdO1xuICAgICAgbmV4dFkgPSBzWzddO1xuICAgIH1cblxuICAgIG5ld19zZWdtZW50cyA9IGEyYyh4LCB5LCBuZXh0WCwgbmV4dFksIHNbNF0sIHNbNV0sIHNbMV0sIHNbMl0sIHNbM10pO1xuXG4gICAgLy8gRGVnZW5lcmF0ZWQgYXJjcyBjYW4gYmUgaWdub3JlZCBieSByZW5kZXJlciwgYnV0IHNob3VsZCBub3QgYmUgZHJvcHBlZFxuICAgIC8vIHRvIGF2b2lkIGNvbGxpc2lvbnMgd2l0aCBgUyBBIFNgIGFuZCBzbyBvbi4gUmVwbGFjZSB3aXRoIGVtcHR5IGxpbmUuXG4gICAgaWYgKG5ld19zZWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbIFsgc1swXSA9PT0gJ2EnID8gJ2wnIDogJ0wnLCBzWzZdLCBzWzddIF0gXTtcbiAgICB9XG5cbiAgICBuZXdfc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbiAocykge1xuICAgICAgcmVzdWx0LnB1c2goWyAnQycsIHNbMl0sIHNbM10sIHNbNF0sIHNbNV0sIHNbNl0sIHNbN10gXSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gQ29udmVydHMgc21vb3RoIGN1cnZlcyAod2l0aCBtaXNzZWQgY29udHJvbCBwb2ludCkgdG8gZ2VuZXJpYyBjdXJ2ZXNcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS51bnNob3J0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRzO1xuICB2YXIgcHJldkNvbnRyb2xYLCBwcmV2Q29udHJvbFksIHByZXZTZWdtZW50O1xuICB2YXIgY3VyQ29udHJvbFgsIGN1ckNvbnRyb2xZO1xuXG4gIC8vIFRPRE86IGFkZCBsYXp5IGV2YWx1YXRpb24gZmxhZyB3aGVuIHJlbGF0aXZlIGNvbW1hbmRzIHN1cHBvcnRlZFxuXG4gIHRoaXMuaXRlcmF0ZShmdW5jdGlvbiAocywgaWR4LCB4LCB5KSB7XG4gICAgdmFyIG5hbWUgPSBzWzBdLCBuYW1lVUMgPSBuYW1lLnRvVXBwZXJDYXNlKCksIGlzUmVsYXRpdmU7XG5cbiAgICAvLyBGaXJzdCBjb21tYW5kIE1VU1QgYmUgTXxtLCBpdCdzIHNhZmUgdG8gc2tpcC5cbiAgICAvLyBQcm90ZWN0IGZyb20gYWNjZXNzIHRvIFstMV0gZm9yIHN1cmUuXG4gICAgaWYgKCFpZHgpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAobmFtZVVDID09PSAnVCcpIHsgLy8gcXVhZHJhdGljIGN1cnZlXG4gICAgICBpc1JlbGF0aXZlID0gKG5hbWUgPT09ICd0Jyk7XG5cbiAgICAgIHByZXZTZWdtZW50ID0gc2VnbWVudHNbaWR4IC0gMV07XG5cbiAgICAgIGlmIChwcmV2U2VnbWVudFswXSA9PT0gJ1EnKSB7XG4gICAgICAgIHByZXZDb250cm9sWCA9IHByZXZTZWdtZW50WzFdIC0geDtcbiAgICAgICAgcHJldkNvbnRyb2xZID0gcHJldlNlZ21lbnRbMl0gLSB5O1xuICAgICAgfSBlbHNlIGlmIChwcmV2U2VnbWVudFswXSA9PT0gJ3EnKSB7XG4gICAgICAgIHByZXZDb250cm9sWCA9IHByZXZTZWdtZW50WzFdIC0gcHJldlNlZ21lbnRbM107XG4gICAgICAgIHByZXZDb250cm9sWSA9IHByZXZTZWdtZW50WzJdIC0gcHJldlNlZ21lbnRbNF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2Q29udHJvbFggPSAwO1xuICAgICAgICBwcmV2Q29udHJvbFkgPSAwO1xuICAgICAgfVxuXG4gICAgICBjdXJDb250cm9sWCA9IC1wcmV2Q29udHJvbFg7XG4gICAgICBjdXJDb250cm9sWSA9IC1wcmV2Q29udHJvbFk7XG5cbiAgICAgIGlmICghaXNSZWxhdGl2ZSkge1xuICAgICAgICBjdXJDb250cm9sWCArPSB4O1xuICAgICAgICBjdXJDb250cm9sWSArPSB5O1xuICAgICAgfVxuXG4gICAgICBzZWdtZW50c1tpZHhdID0gW1xuICAgICAgICBpc1JlbGF0aXZlID8gJ3EnIDogJ1EnLFxuICAgICAgICBjdXJDb250cm9sWCwgY3VyQ29udHJvbFksXG4gICAgICAgIHNbMV0sIHNbMl1cbiAgICAgIF07XG5cbiAgICB9IGVsc2UgaWYgKG5hbWVVQyA9PT0gJ1MnKSB7IC8vIGN1YmljIGN1cnZlXG4gICAgICBpc1JlbGF0aXZlID0gKG5hbWUgPT09ICdzJyk7XG5cbiAgICAgIHByZXZTZWdtZW50ID0gc2VnbWVudHNbaWR4IC0gMV07XG5cbiAgICAgIGlmIChwcmV2U2VnbWVudFswXSA9PT0gJ0MnKSB7XG4gICAgICAgIHByZXZDb250cm9sWCA9IHByZXZTZWdtZW50WzNdIC0geDtcbiAgICAgICAgcHJldkNvbnRyb2xZID0gcHJldlNlZ21lbnRbNF0gLSB5O1xuICAgICAgfSBlbHNlIGlmIChwcmV2U2VnbWVudFswXSA9PT0gJ2MnKSB7XG4gICAgICAgIHByZXZDb250cm9sWCA9IHByZXZTZWdtZW50WzNdIC0gcHJldlNlZ21lbnRbNV07XG4gICAgICAgIHByZXZDb250cm9sWSA9IHByZXZTZWdtZW50WzRdIC0gcHJldlNlZ21lbnRbNl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2Q29udHJvbFggPSAwO1xuICAgICAgICBwcmV2Q29udHJvbFkgPSAwO1xuICAgICAgfVxuXG4gICAgICBjdXJDb250cm9sWCA9IC1wcmV2Q29udHJvbFg7XG4gICAgICBjdXJDb250cm9sWSA9IC1wcmV2Q29udHJvbFk7XG5cbiAgICAgIGlmICghaXNSZWxhdGl2ZSkge1xuICAgICAgICBjdXJDb250cm9sWCArPSB4O1xuICAgICAgICBjdXJDb250cm9sWSArPSB5O1xuICAgICAgfVxuXG4gICAgICBzZWdtZW50c1tpZHhdID0gW1xuICAgICAgICBpc1JlbGF0aXZlID8gJ2MnIDogJ0MnLFxuICAgICAgICBjdXJDb250cm9sWCwgY3VyQ29udHJvbFksXG4gICAgICAgIHNbMV0sIHNbMl0sIHNbM10sIHNbNF1cbiAgICAgIF07XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdmdQYXRoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL3N2Z3BhdGgnKTtcbiIsImltcG9ydCB7IGFkZEljb24gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBzdmdwYXRoIGZyb20gXCJzdmdwYXRoXCI7XG5cbmZ1bmN0aW9uIHNjYWxlKHBhdGg6IHN0cmluZyB8IFBhdGhEZWYsIGZyb206IG51bWJlciwgdG86IG51bWJlcikge1xuICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gYDxwYXRoIGQ9XCIke3N2Z3BhdGgocGF0aCkuc2NhbGUodG8gLyBmcm9tKX1cIiAvPmA7XG4gIH1cblxuICByZXR1cm4gYDxwYXRoICR7T2JqZWN0LmtleXMocGF0aClcbiAgICAubWFwKFxuICAgICAgKGspID0+XG4gICAgICAgIGAke2t9PVwiJHtcbiAgICAgICAgICBrID09PSBcImRcIlxuICAgICAgICAgICAgPyBzdmdwYXRoKHBhdGhba10pLnNjYWxlKHRvIC8gZnJvbSlcbiAgICAgICAgICAgIDogcGF0aFtrIGFzIGtleW9mIFBhdGhEZWZdXG4gICAgICAgIH1cImBcbiAgICApXG4gICAgLmpvaW4oXCIgXCIpfSAvPmA7XG59XG5cbmludGVyZmFjZSBQYXRoRGVmIHtcbiAgZDogc3RyaW5nO1xuICBmaWxsOiBzdHJpbmc7XG59XG5cbmNvbnN0IGljb25zOiB7IFtrOiBzdHJpbmddOiBzdHJpbmcgfCBBcnJheTxzdHJpbmcgfCBQYXRoRGVmPiB9ID0ge1xuICBcImFueS1rZXlcIjogXCJcIixcbiAgXCJhdWRpby1maWxlXCI6IFwiXCIsXG4gIGJsb2NrczogXCJcIixcbiAgXCJicm9rZW4tbGlua1wiOlxuICAgIFwiTTE2Ljk0OSAxNC4xMjFMMTkuMDcxIDEyYzEuOTQ4LTEuOTQ5IDEuOTQ4LTUuMTIyIDAtNy4wNzEtMS45NS0xLjk1LTUuMTIzLTEuOTQ4LTcuMDcxIDBsLS43MDcuNzA3IDEuNDE0IDEuNDE0LjcwNy0uNzA3YzEuMTY5LTEuMTY3IDMuMDcyLTEuMTY5IDQuMjQzIDAgMS4xNjkgMS4xNyAxLjE2OSAzLjA3MyAwIDQuMjQzbC0yLjEyMiAyLjEyMWMtLjI0Ny4yNDctLjUzNC40MzUtLjg0NC41N0wxMy40MTQgMTJsMS40MTQtMS40MTQtLjcwNy0uNzA3Yy0uOTQzLS45NDQtMi4xOTktMS40NjUtMy41MzUtMS40NjUtLjIzNSAwLS40NjQuMDMyLS42OTEuMDY2TDMuNzA3IDIuMjkzIDIuMjkzIDMuNzA3bDE4IDE4IDEuNDE0LTEuNDE0LTUuNTM2LTUuNTM2QzE2LjQ0OCAxNC41NzMgMTYuNzA5IDE0LjM2MSAxNi45NDkgMTQuMTIxek0xMC41ODYgMTcuNjU3Yy0xLjE2OSAxLjE2Ny0zLjA3MiAxLjE2OS00LjI0MyAwLTEuMTY5LTEuMTctMS4xNjktMy4wNzMgMC00LjI0M2wxLjQ3Ni0xLjQ3NS0xLjQxNC0xLjQxNEw0LjkyOSAxMmMtMS45NDggMS45NDktMS45NDggNS4xMjIgMCA3LjA3MS45NzUuOTc1IDIuMjU1IDEuNDYyIDMuNTM1IDEuNDYyIDEuMjgxIDAgMi41NjItLjQ4NyAzLjUzNi0xLjQ2MmwuNzA3LS43MDctMS40MTQtMS40MTRMMTAuNTg2IDE3LjY1N3pcIixcbiAgXCJidWxsZXQtbGlzdFwiOlxuICAgIFwiTTQgNkg2VjhINHpNNCAxMUg2VjEzSDR6TTQgMTZINlYxOEg0ek0yMCA4TDIwIDYgMTguOCA2IDkuMiA2IDguMDIzIDYgOC4wMjMgOCA5LjIgOCAxOC44IDh6TTggMTFIMjBWMTNIOHpNOCAxNkgyMFYxOEg4elwiLFxuICBcImNhbGVuZGFyLXdpdGgtY2hlY2ttYXJrXCI6IFtcbiAgICBcIk0xOSw0aC0yVjJoLTJ2Mkg5VjJIN3YySDVDMy44OTcsNCwzLDQuODk3LDMsNnYydjEyYzAsMS4xMDMsMC44OTcsMiwyLDJoMTRjMS4xMDMsMCwyLTAuODk3LDItMlY4VjYgQzIxLDQuODk3LDIwLjEwMyw0LDE5LDR6IE0xOS4wMDIsMjBINVY4aDE0TDE5LjAwMiwyMHpcIixcbiAgICBcIk0xMSAxNy40MTRMMTYuNzA3IDExLjcwNyAxNS4yOTMgMTAuMjkzIDExIDE0LjU4NiA4LjcwNyAxMi4yOTMgNy4yOTMgMTMuNzA3elwiLFxuICBdLFxuICBcImNoZWNrLWluLWNpcmNsZVwiOlxuICAgIFwiTTEyLDJDNi40ODYsMiwyLDYuNDg2LDIsMTJzNC40ODYsMTAsMTAsMTBzMTAtNC40ODYsMTAtMTBTMTcuNTE0LDIsMTIsMnogTTEyLDIwYy00LjQxMSwwLTgtMy41ODktOC04czMuNTg5LTgsOC04IHM4LDMuNTg5LDgsOFMxNi40MTEsMjAsMTIsMjB6XCIsXG4gIFwiY2hlY2stc21hbGxcIjpcbiAgICBcIk0xMCAxNS41ODZMNi43MDcgMTIuMjkzIDUuMjkzIDEzLjcwNyAxMCAxOC40MTQgMTkuNzA3IDguNzA3IDE4LjI5MyA3LjI5M3pcIixcbiAgY2hlY2ttYXJrOlxuICAgIFwiTTEwIDE1LjU4Nkw2LjcwNyAxMi4yOTMgNS4yOTMgMTMuNzA3IDEwIDE4LjQxNCAxOS43MDcgOC43MDcgMTguMjkzIDcuMjkzelwiLFxuICBcImNyZWF0ZS1uZXdcIjogW1wiTTEzIDdMMTEgNyAxMSAxMSA3IDExIDcgMTMgMTEgMTMgMTEgMTcgMTMgMTcgMTMgMTMgMTcgMTMgMTcgMTEgMTMgMTF6XCIsXG4gIFwiTTEyLDJDNi40ODYsMiwyLDYuNDg2LDIsMTJzNC40ODYsMTAsMTAsMTBjNS41MTQsMCwxMC00LjQ4NiwxMC0xMFMxNy41MTQsMiwxMiwyeiBNMTIsMjBjLTQuNDExLDAtOC0zLjU4OS04LTggczMuNTg5LTgsOC04czgsMy41ODksOCw4UzE2LjQxMSwyMCwxMiwyMHpcIixdLFxuICBcImNyb3NzLWluLWJveFwiOlxuICAgIFwiTTkuMTcyIDE2LjI0MkwxMiAxMy40MTQgMTQuODI4IDE2LjI0MiAxNi4yNDIgMTQuODI4IDEzLjQxNCAxMiAxNi4yNDIgOS4xNzIgMTQuODI4IDcuNzU4IDEyIDEwLjU4NiA5LjE3MiA3Ljc1OCA3Ljc1OCA5LjE3MiAxMC41ODYgMTIgNy43NTggMTQuODI4elwiLFxuICBjcm9zczpcbiAgICBcIk0xNi4xOTIgNi4zNDRMMTEuOTQ5IDEwLjU4NiA3LjcwNyA2LjM0NCA2LjI5MyA3Ljc1OCAxMC41MzUgMTIgNi4yOTMgMTYuMjQyIDcuNzA3IDE3LjY1NiAxMS45NDkgMTMuNDE0IDE2LjE5MiAxNy42NTYgMTcuNjA2IDE2LjI0MiAxMy4zNjQgMTIgMTcuNjA2IDcuNzU4elwiLFxuICBcImNyb3NzZWQtc3RhclwiOlxuICAgIFwiTTUuMDI1LDIwLjc3NWMtMC4wOTIsMC4zOTksMC4wNjgsMC44MTQsMC40MDYsMS4wNDdDNS42MDMsMjEuOTQsNS44MDEsMjIsNiwyMmMwLjE5MywwLDAuMzg3LTAuMDU2LDAuNTU1LTAuMTY4TDEyLDE4LjIwMiBsNS40NDUsMy42M2MwLjM0OCwwLjIzMiwwLjgwNCwwLjIyMywxLjE0NS0wLjAyNGMwLjMzOC0wLjI0NywwLjQ4Ny0wLjY4LDAuMzcyLTEuMDgybC0xLjgyOS02LjRsNC41MzYtNC4wODIgYzAuMjk3LTAuMjY3LDAuNDA2LTAuNjg2LDAuMjc4LTEuMDY0Yy0wLjEyOS0wLjM3OC0wLjQ3LTAuNjQ1LTAuODY4LTAuNjc2TDE1LjM3OCw4LjA1bC0yLjQ2Ny01LjQ2MUMxMi43NSwyLjIzLDEyLjM5MywyLDEyLDIgcy0wLjc1LDAuMjMtMC45MTEsMC41ODhMOC42MjIsOC4wNUwyLjkyMSw4LjUwM0MyLjUyOSw4LjUzNCwyLjE5Miw4Ljc5MSwyLjA2LDkuMTZjLTAuMTM0LDAuMzY5LTAuMDM4LDAuNzgyLDAuMjQyLDEuMDU2IGw0LjIxNCw0LjEwN0w1LjAyNSwyMC43NzV6IE0xMiw1LjQyOWwyLjA0Miw0LjUyMWwwLjU4OCwwLjA0N2MwLjAwMSwwLDAuMDAxLDAsMC4wMDEsMGwzLjk3MiwwLjMxNWwtMy4yNzEsMi45NDQgYy0wLjAwMSwwLjAwMS0wLjAwMSwwLjAwMS0wLjAwMSwwLjAwMmwtMC40NjMsMC40MTZsMC4xNzEsMC41OTdjMCwwLDAsMC4wMDIsMCwwLjAwM2wxLjI1Myw0LjM4NUwxMiwxNS43OThWNS40Mjl6XCIsXG4gIGRpY2U6XG4gICAgXCJNMTksM0g1QzMuODk3LDMsMywzLjg5NywzLDV2MTRjMCwxLjEwMywwLjg5NywyLDIsMmgxNGMxLjEwMywwLDItMC44OTcsMi0yVjVDMjEsMy44OTcsMjAuMTAzLDMsMTksM3ogTTUsMTlWNWgxNCBsMC4wMDIsMTRINXpcIixcbiAgZG9jdW1lbnQ6XG4gICAgXCJNMTkuOTM3LDguNjhjLTAuMDExLTAuMDMyLTAuMDItMC4wNjMtMC4wMzMtMC4wOTRjLTAuMDQ5LTAuMTA2LTAuMTEtMC4yMDctMC4xOTYtMC4yOTNsLTYtNiBjLTAuMDg2LTAuMDg2LTAuMTg3LTAuMTQ3LTAuMjkzLTAuMTk2Yy0wLjAzLTAuMDE0LTAuMDYyLTAuMDIyLTAuMDk0LTAuMDMzYy0wLjA4NC0wLjAyOC0wLjE3LTAuMDQ2LTAuMjU5LTAuMDUxIEMxMy4wNCwyLjAxMSwxMy4wMjEsMiwxMywySDZDNC44OTcsMiw0LDIuODk3LDQsNHYxNmMwLDEuMTAzLDAuODk3LDIsMiwyaDEyYzEuMTAzLDAsMi0wLjg5NywyLTJWOSBjMC0wLjAyMS0wLjAxMS0wLjA0LTAuMDEzLTAuMDYyQzE5Ljk4Miw4Ljg1LDE5Ljk2NSw4Ljc2NCwxOS45MzcsOC42OHogTTE2LjU4Niw4SDE0VjUuNDE0TDE2LjU4Niw4eiBNNiwyMFY0aDZ2NSBjMCwwLjU1MywwLjQ0NywxLDEsMWg1bDAuMDAyLDEwSDZ6XCIsXG4gIGRvY3VtZW50czpcbiAgICBbXCJNMjAsMkgxMEM4Ljg5NywyLDgsMi44OTcsOCw0djRINGMtMS4xMDMsMC0yLDAuODk3LTIsMnYxMGMwLDEuMTAzLDAuODk3LDIsMiwyaDEwYzEuMTAzLDAsMi0wLjg5NywyLTJ2LTRoNCBjMS4xMDMsMCwyLTAuODk3LDItMlY0QzIyLDIuODk3LDIxLjEwMywyLDIwLDJ6IE00LDIwVjEwaDEwbDAuMDAyLDEwSDR6IE0yMCwxNGgtNHYtNGMwLTEuMTAzLTAuODk3LTItMi0yaC00VjRoMTBWMTR6XCIsXG4gICAgXCJNNiAxMkgxMlYxNEg2ek02IDE2SDEyVjE4SDZ6XCIsXSxcbiAgXCJkb3QtbmV0d29ya1wiOlxuICAgIFwiTTE5LjUsM0MxOC4xMjEsMywxNyw0LjEyMSwxNyw1LjVjMCwwLjM1NywwLjA3OCwwLjY5NiwwLjIxNCwxLjAwNWwtMS45NTUsMi4xOTlDMTQuNjE1LDguMjYyLDEzLjgzOSw4LDEzLDggYy0wLjc0LDAtMS40MjQsMC4yMTYtMi4wMTksMC41NjZMOC43MDcsNi4yOTNMOC42ODQsNi4zMTZDOC44OCw1LjkxOCw5LDUuNDc1LDksNWMwLTEuNjU3LTEuMzQzLTMtMy0zUzMsMy4zNDMsMyw1czEuMzQzLDMsMywzIGMwLjQ3NSwwLDAuOTE3LTAuMTIsMS4zMTYtMC4zMTZMNy4yOTMsNy43MDdMOS41NjcsOS45OEM5LjIxNSwxMC41NzYsOSwxMS4yNjEsOSwxMmMwLDAuOTk3LDAuMzgsMS44OTksMC45ODUsMi42MDFsLTIuNTc3LDIuNTc2IEM3LjEyNiwxNy4wNjYsNi44MjEsMTcsNi41LDE3QzUuMTIyLDE3LDQsMTguMTIxLDQsMTkuNVM1LjEyMiwyMiw2LjUsMjJTOSwyMC44NzksOSwxOS41YzAtMC4zMjEtMC4wNjYtMC42MjYtMC4xNzctMC45MDkgbDIuODM4LTIuODM4QzEyLjA4MiwxNS45MDMsMTIuNTI4LDE2LDEzLDE2YzIuMjA2LDAsNC0xLjc5NCw0LTRjMC0wLjYzNi0wLjE2My0xLjIyOS0wLjQyOC0xLjc2NGwyLjExNy0yLjM4MyBDMTguOTQ1LDcuOTQxLDE5LjIxNSw4LDE5LjUsOEMyMC44NzksOCwyMiw2Ljg3OSwyMiw1LjVTMjAuODc5LDMsMTkuNSwzeiBNMTMsMTRjLTEuMTAzLDAtMi0wLjg5Ny0yLTJzMC44OTctMiwyLTIgYzEuMTAzLDAsMiwwLjg5NywyLDJTMTQuMTAzLDE0LDEzLDE0elwiLFxuICBlbnRlcjogXCJcIixcbiAgXCJleHBhbmQtdmVydGljYWxseVwiOiBcIk03IDE3TDEyIDIyIDE3IDE3IDEzIDE3IDEzIDcgMTcgNyAxMiAyIDcgNyAxMSA3IDExIDE3elwiLFxuICBcImZpbGxlZC1waW5cIjpcbiAgICBcIk0xNSwxMS41ODZWNmgyVjRjMC0xLjEwNC0wLjg5Ni0yLTItMkg5QzcuODk2LDIsNywyLjg5Niw3LDR2MmgydjUuNTg2bC0yLjcwNywxLjcwN0M2LjEwNSwxMy40OCw2LDEzLjczNCw2LDE0djIgYzAsMC41NTMsMC40NDgsMSwxLDFoMmgydjNsMSwybDEtMnYtM2g0YzAuNTUzLDAsMS0wLjQ0NywxLTF2LTJjMC0wLjI2Ni0wLjEwNS0wLjUyLTAuMjkzLTAuNzA3TDE1LDExLjU4NnpcIixcbiAgZm9sZGVyOlxuICAgIFwiTTIwLDVoLTguNTg2TDkuNzA3LDMuMjkzQzkuNTIsMy4xMDUsOS4yNjUsMyw5LDNINEMyLjg5NywzLDIsMy44OTcsMiw1djE0YzAsMS4xMDMsMC44OTcsMiwyLDJoMTZjMS4xMDMsMCwyLTAuODk3LDItMlY3IEMyMiw1Ljg5NywyMS4xMDMsNSwyMCw1eiBNNCwxOVY3aDdoMWg4bDAuMDAyLDEySDR6XCIsXG4gIFwiZm9yd2FyZC1hcnJvd1wiOlxuICAgIFwiTTEwLjcwNyAxNy43MDdMMTYuNDE0IDEyIDEwLjcwNyA2LjI5MyA5LjI5MyA3LjcwNyAxMy41ODYgMTIgOS4yOTMgMTYuMjkzelwiLFxuICBnZWFyOlxuICAgIFtcIk0xMiwxNmMyLjIwNiwwLDQtMS43OTQsNC00cy0xLjc5NC00LTQtNHMtNCwxLjc5NC00LDRTOS43OTQsMTYsMTIsMTZ6IE0xMiwxMGMxLjA4NCwwLDIsMC45MTYsMiwycy0wLjkxNiwyLTIsMiBzLTItMC45MTYtMi0yUzEwLjkxNiwxMCwxMiwxMHpcIixcbiAgICBcIk0yLjg0NSwxNi4xMzZsMSwxLjczYzAuNTMxLDAuOTE3LDEuODA5LDEuMjYxLDIuNzMsMC43M2wwLjUyOS0wLjMwNkM3LjY4NiwxOC43NDcsOC4zMjUsMTkuMTIyLDksMTkuNDAyVjIwIGMwLDEuMTAzLDAuODk3LDIsMiwyaDJjMS4xMDMsMCwyLTAuODk3LDItMnYtMC41OThjMC42NzUtMC4yOCwxLjMxNC0wLjY1NSwxLjg5Ni0xLjExMWwwLjUyOSwwLjMwNiBjMC45MjMsMC41MywyLjE5OCwwLjE4OCwyLjczMS0wLjczMWwwLjk5OS0xLjcyOWMwLjU1Mi0wLjk1NSwwLjIyNC0yLjE4MS0wLjczMS0yLjczMmwtMC41MDUtMC4yOTJDMTkuOTczLDEyLjc0MiwyMCwxMi4zNzEsMjAsMTIgcy0wLjAyNy0wLjc0My0wLjA4MS0xLjExMWwwLjUwNS0wLjI5MmMwLjk1NS0wLjU1MiwxLjI4My0xLjc3NywwLjczMS0yLjczMmwtMC45OTktMS43MjljLTAuNTMxLTAuOTItMS44MDgtMS4yNjUtMi43MzEtMC43MzIgbC0wLjUyOSwwLjMwNkMxNi4zMTQsNS4yNTMsMTUuNjc1LDQuODc4LDE1LDQuNTk4VjRjMC0xLjEwMy0wLjg5Ny0yLTItMmgtMkM5Ljg5NywyLDksMi44OTcsOSw0djAuNTk4IGMtMC42NzUsMC4yOC0xLjMxNCwwLjY1NS0xLjg5NiwxLjExMUw2LjU3NSw1LjQwM2MtMC45MjQtMC41MzEtMi4yLTAuMTg3LTIuNzMxLDAuNzMyTDIuODQ1LDcuODY0IGMtMC41NTIsMC45NTUtMC4yMjQsMi4xODEsMC43MzEsMi43MzJsMC41MDUsMC4yOTJDNC4wMjcsMTEuMjU3LDQsMTEuNjI5LDQsMTJzMC4wMjcsMC43NDIsMC4wODEsMS4xMTFsLTAuNTA1LDAuMjkyIEMyLjYyMSwxMy45NTUsMi4yOTMsMTUuMTgxLDIuODQ1LDE2LjEzNnogTTYuMTcxLDEzLjM3OEM2LjA1OCwxMi45MjUsNiwxMi40NjEsNiwxMmMwLTAuNDYyLDAuMDU4LTAuOTI2LDAuMTctMS4zNzggYzAuMTA4LTAuNDMzLTAuMDgzLTAuODg1LTAuNDctMS4xMDhMNC41NzcsOC44NjRsMC45OTgtMS43MjlMNi43Miw3Ljc5N2MwLjM4NCwwLjIyMSwwLjg2NywwLjE2NSwxLjE4OC0wLjE0MiBjMC42ODMtMC42NDcsMS41MDctMS4xMzEsMi4zODQtMS4zOTlDMTAuNzEzLDYuMTI4LDExLDUuNzM5LDExLDUuM1Y0aDJ2MS4zYzAsMC40MzksMC4yODcsMC44MjgsMC43MDgsMC45NTYgYzAuODc3LDAuMjY5LDEuNzAxLDAuNzUyLDIuMzg0LDEuMzk5YzAuMzIxLDAuMzA3LDAuODA2LDAuMzYyLDEuMTg4LDAuMTQybDEuMTQ0LTAuNjYxbDEsMS43MjlMMTguMyw5LjUxNCBjLTAuMzg3LDAuMjI0LTAuNTc4LDAuNjc2LTAuNDcsMS4xMDhDMTcuOTQyLDExLjA3NCwxOCwxMS41MzgsMTgsMTJjMCwwLjQ2MS0wLjA1OCwwLjkyNS0wLjE3MSwxLjM3OCBjLTAuMTA3LDAuNDMzLDAuMDg0LDAuODg1LDAuNDcxLDEuMTA4bDEuMTIzLDAuNjQ5bC0wLjk5OCwxLjcyOWwtMS4xNDUtMC42NjFjLTAuMzgzLTAuMjIxLTAuODY3LTAuMTY2LTEuMTg4LDAuMTQyIGMtMC42ODMsMC42NDctMS41MDcsMS4xMzEtMi4zODQsMS4zOTlDMTMuMjg3LDE3Ljg3MiwxMywxOC4yNjEsMTMsMTguN2wwLjAwMiwxLjNIMTF2LTEuM2MwLTAuNDM5LTAuMjg3LTAuODI4LTAuNzA4LTAuOTU2IGMtMC44NzctMC4yNjktMS43MDEtMC43NTItMi4zODQtMS4zOTljLTAuMTktMC4xODItMC40MzgtMC4yNzUtMC42ODgtMC4yNzVjLTAuMTcyLDAtMC4zNDQsMC4wNDQtMC41LDAuMTM0bC0xLjE0NCwwLjY2MmwtMS0xLjcyOSBMNS43LDE0LjQ4NkM2LjA4NywxNC4yNjMsNi4yNzgsMTMuODExLDYuMTcxLDEzLjM3OHpcIixdLFxuICBcImdvLXRvLWZpbGVcIjpcbiAgICBcIk0xMy43MDcsMi4yOTNDMTMuNTIsMi4xMDUsMTMuMjY2LDIsMTMsMkg2QzQuODk3LDIsNCwyLjg5Nyw0LDR2MTZjMCwxLjEwMywwLjg5NywyLDIsMmgxMmMxLjEwMywwLDItMC44OTcsMi0yVjkgYzAtMC4yNjYtMC4xMDUtMC41Mi0wLjI5My0wLjcwN0wxMy43MDcsMi4yOTN6IE02LDRoNi41ODZMMTgsOS40MTRsMC4wMDIsOS4xNzRsLTIuNTY4LTIuNTY4QzE1Ljc4NCwxNS40MjUsMTYsMTQuNzM5LDE2LDE0IGMwLTIuMjA2LTEuNzk0LTQtNC00cy00LDEuNzk0LTQsNHMxLjc5NCw0LDQsNGMwLjczOSwwLDEuNDI1LTAuMjE2LDIuMDItMC41NjZMMTYuNTg2LDIwSDZWNHogTTEyLDE2Yy0xLjEwMywwLTItMC44OTctMi0yIHMwLjg5Ny0yLDItMnMyLDAuODk3LDIsMlMxMy4xMDMsMTYsMTIsMTZ6XCIsXG4gIGhhc2h0YWc6XG4gICAgXCJNMTYuMDE4LDMuODE1TDE1LjIzMiw4aC00Ljk2NmwwLjcxNi0zLjgxNUw5LjAxOCwzLjgxNUw4LjIzMiw4SDR2MmgzLjg1N2wtMC43NTEsNEgzdjJoMy43MzFsLTAuNzE0LDMuODA1bDEuOTY1LDAuMzY5IEw4Ljc2NiwxNmg0Ljk2NmwtMC43MTQsMy44MDVsMS45NjUsMC4zNjlMMTUuNzY2LDE2SDIwdi0yaC0zLjg1OWwwLjc1MS00SDIxVjhoLTMuNzMzbDAuNzE2LTMuODE1TDE2LjAxOCwzLjgxNXogTTE0LjEwNiwxNEg5LjE0MSBsMC43NTEtNGg0Ljk2NkwxNC4xMDYsMTR6XCIsXG4gIGhlbHA6XG4gICAgW1wiTTEyIDZDOS44MzEgNiA4LjA2NiA3Ljc2NSA4LjA2NiA5LjkzNGgyQzEwLjA2NiA4Ljg2NyAxMC45MzQgOCAxMiA4czEuOTM0Ljg2NyAxLjkzNCAxLjkzNGMwIC41OTgtLjQ4MSAxLjAzMi0xLjIxNiAxLjYyNi0uMjU1LjIwNy0uNDk2LjQwNC0uNjkxLjU5OUMxMS4wMjkgMTMuMTU2IDExIDE0LjIxNSAxMSAxNC4zMzNWMTVoMmwtLjAwMS0uNjMzYy4wMDEtLjAxNi4wMzMtLjM4Ni40NDEtLjc5My4xNS0uMTUuMzM5LS4zLjUzNS0uNDU4Ljc3OS0uNjMxIDEuOTU4LTEuNTg0IDEuOTU4LTMuMTgyQzE1LjkzNCA3Ljc2NSAxNC4xNjkgNiAxMiA2ek0xMSAxNkgxM1YxOEgxMXpcIixcbiAgICBcIk0xMiwyQzYuNDg2LDIsMiw2LjQ4NiwyLDEyczQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzE3LjUxNCwyLDEyLDJ6IE0xMiwyMGMtNC40MTEsMC04LTMuNTg5LTgtOHMzLjU4OS04LDgtOCBzOCwzLjU4OSw4LDhTMTYuNDExLDIwLDEyLDIwelwiLF0sXG4gIFwiaG9yaXpvbnRhbC1zcGxpdFwiOiBcIk0xNyAxMUw3IDExIDcgNyAyIDEyIDcgMTcgNyAxMyAxNyAxMyAxNyAxNyAyMiAxMiAxNyA3elwiLFxuICBcImltYWdlLWZpbGVcIjpcbiAgICBbXCJNMjAsMkg4QzYuODk3LDIsNiwyLjg5Nyw2LDR2MTJjMCwxLjEwMywwLjg5NywyLDIsMmgxMmMxLjEwMywwLDItMC44OTcsMi0yVjRDMjIsMi44OTcsMjEuMTAzLDIsMjAsMnogTTgsMTZWNGgxMiBsMC4wMDIsMTJIOHpcIixcbiAgICBcIk00LDhIMnYxMmMwLDEuMTAzLDAuODk3LDIsMiwyaDEydi0ySDRWOHpcIixcbiAgICBcIk0xMiAxMkwxMSAxMSA5IDE0IDE5IDE0IDE1IDh6XCIsXSxcbiAgaW5mbzpcbiAgICBcIk0xMiwyQzYuNDg2LDIsMiw2LjQ4NiwyLDEyczQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzE3LjUxNCwyLDEyLDJ6IE0xMiwyMGMtNC40MTEsMC04LTMuNTg5LTgtOHMzLjU4OS04LDgtOCBzOCwzLjU4OSw4LDhTMTYuNDExLDIwLDEyLDIwelwiLFxuICBpbnN0YWxsOiBcIlwiLFxuICBsYW5ndWFnZXM6IFwiXCIsXG4gIFwibGVmdC1hcnJvdy13aXRoLXRhaWxcIjpcbiAgICBcIk0xMy4yOTMgNi4yOTNMNy41ODYgMTIgMTMuMjkzIDE3LjcwNyAxNC43MDcgMTYuMjkzIDEwLjQxNCAxMiAxNC43MDcgNy43MDd6XCIsXG4gIFwibGVmdC1hcnJvd1wiOlxuICAgIFwiTTEzLjI5MyA2LjI5M0w3LjU4NiAxMiAxMy4yOTMgMTcuNzA3IDE0LjcwNyAxNi4yOTMgMTAuNDE0IDEyIDE0LjcwNyA3LjcwN3pcIixcbiAgXCJsaW5lcy1vZi10ZXh0XCI6XG4gICAgXCJNMjAsM0g0QzIuODk3LDMsMiwzLjg5NywyLDV2MTFjMCwxLjEwMywwLjg5NywyLDIsMmg3djJIOHYyaDNoMmgzdi0yaC0zdi0yaDdjMS4xMDMsMCwyLTAuODk3LDItMlY1IEMyMiwzLjg5NywyMS4xMDMsMywyMCwzeiBNNCwxNFY1aDE2bDAuMDAyLDlINHpcIixcbiAgbGluazogW1xuICAgIFwiTTguNDY1LDExLjI5M2MxLjEzMy0xLjEzMywzLjEwOS0xLjEzMyw0LjI0MiwwTDEzLjQxNCwxMmwxLjQxNC0xLjQxNGwtMC43MDctMC43MDdjLTAuOTQzLTAuOTQ0LTIuMTk5LTEuNDY1LTMuNTM1LTEuNDY1IFM3Ljk5NCw4LjkzNSw3LjA1MSw5Ljg3OUw0LjkyOSwxMmMtMS45NDgsMS45NDktMS45NDgsNS4xMjIsMCw3LjA3MWMwLjk3NSwwLjk3NSwyLjI1NSwxLjQ2MiwzLjUzNSwxLjQ2MiBjMS4yODEsMCwyLjU2Mi0wLjQ4NywzLjUzNi0xLjQ2MmwwLjcwNy0wLjcwN2wtMS40MTQtMS40MTRsLTAuNzA3LDAuNzA3Yy0xLjE3LDEuMTY3LTMuMDczLDEuMTY5LTQuMjQzLDAgYy0xLjE2OS0xLjE3LTEuMTY5LTMuMDczLDAtNC4yNDNMOC40NjUsMTEuMjkzelwiLFxuICAgIFwiTTEyLDQuOTI5bC0wLjcwNywwLjcwN2wxLjQxNCwxLjQxNGwwLjcwNy0wLjcwN2MxLjE2OS0xLjE2NywzLjA3Mi0xLjE2OSw0LjI0MywwYzEuMTY5LDEuMTcsMS4xNjksMy4wNzMsMCw0LjI0MyBsLTIuMTIyLDIuMTIxYy0xLjEzMywxLjEzMy0zLjEwOSwxLjEzMy00LjI0MiwwTDEwLjU4NiwxMmwtMS40MTQsMS40MTRsMC43MDcsMC43MDdjMC45NDMsMC45NDQsMi4xOTksMS40NjUsMy41MzUsMS40NjUgczIuNTkyLTAuNTIxLDMuNTM1LTEuNDY1TDE5LjA3MSwxMmMxLjk0OC0xLjk0OSwxLjk0OC01LjEyMiwwLTcuMDcxQzE3LjEyMSwyLjk3OSwxMy45NDgsMi45OCwxMiw0LjkyOXpcIixcbiAgXSxcbiAgXCJtYWduaWZ5aW5nLWdsYXNzXCI6XG4gICAgXCJNMTkuMDIzLDE2Ljk3N2MtMC41MTMtMC40ODgtMS4wMDQtMC45OTctMS4zNjctMS4zODRjLTAuMzcyLTAuMzc4LTAuNTk2LTAuNjUzLTAuNTk2LTAuNjUzbC0yLjgtMS4zMzcgQzE1LjM0LDEyLjM3LDE2LDEwLjc2MywxNiw5YzAtMy44NTktMy4xNC03LTctN1MyLDUuMTQxLDIsOXMzLjE0LDcsNyw3YzEuNzYzLDAsMy4zNy0wLjY2LDQuNjAzLTEuNzM5bDEuMzM3LDIuOCBjMCwwLDAuMjc1LDAuMjI0LDAuNjUzLDAuNTk2YzAuMzg3LDAuMzYzLDAuODk2LDAuODU0LDEuMzg0LDEuMzY3YzAuNDk0LDAuNTA2LDAuOTg4LDEuMDEyLDEuMzU4LDEuMzkyIGMwLjM2MiwwLjM4OCwwLjYwNCwwLjY0NiwwLjYwNCwwLjY0NmwyLjEyMS0yLjEyMWMwLDAtMC4yNTgtMC4yNDItMC42NDYtMC42MDRDMjAuMDM1LDE3Ljk2NSwxOS41MjksMTcuNDcxLDE5LjAyMywxNi45Nzd6IE05LDE0IGMtMi43NTcsMC01LTIuMjQzLTUtNXMyLjI0My01LDUtNXM1LDIuMjQzLDUsNVMxMS43NTcsMTQsOSwxNHpcIixcbiAgXCJtaWNyb3Bob25lLWZpbGxlZFwiOlxuICAgIFwiTTEyLDE2YzIuMjA2LDAsNC0xLjc5NCw0LTRWNmMwLTIuMjE3LTEuNzg1LTQuMDIxLTMuOTc5LTQuMDIxYy0wLjA2OSwwLTAuMTQsMC4wMDktMC4yMDksMC4wMjVDOS42OTMsMi4xMDQsOCwzLjg1Nyw4LDZ2NiBDOCwxNC4yMDYsOS43OTQsMTYsMTIsMTZ6XCIsXG4gIG1pY3JvcGhvbmU6XG4gICAgXCJNMTYsMTJWNmMwLTIuMjE3LTEuNzg1LTQuMDIxLTMuOTc5LTQuMDIxYy0wLjA2OSwwLTAuMTQsMC4wMDktMC4yMDksMC4wMjVDOS42OTMsMi4xMDQsOCwzLjg1Nyw4LDZ2NmMwLDIuMjA2LDEuNzk0LDQsNCw0IFMxNiwxNC4yMDYsMTYsMTJ6IE0xMCwxMlY2YzAtMS4xMDMsMC44OTctMiwyLTJjMC4wNTUsMCwwLjEwOS0wLjAwNSwwLjE2My0wLjAxNUMxMy4xODgsNC4wNiwxNCw0LjkzNSwxNCw2djZjMCwxLjEwMy0wLjg5NywyLTIsMiBTMTAsMTMuMTAzLDEwLDEyelwiLFxuICBcIm9wZW4tdmF1bHRcIjpcbiAgICBcIk0xOSwyLjAxSDZjLTEuMjA2LDAtMywwLjc5OS0zLDN2M3Y2djN2MmMwLDIuMjAxLDEuNzk0LDMsMywzaDE1di0ySDYuMDEyQzUuNTUsMTkuOTk4LDUsMTkuODE1LDUsMTkuMDEgYzAtMC4xMDEsMC4wMDktMC4xOTEsMC4wMjQtMC4yNzNjMC4xMTItMC41NzUsMC41ODMtMC43MTcsMC45ODctMC43MjdIMjBjMC4wMTgsMCwwLjAzMS0wLjAwOSwwLjA0OS0wLjAxSDIxdi0wLjk5VjE1VjQuMDEgQzIxLDIuOTA3LDIwLjEwMywyLjAxLDE5LDIuMDF6IE0xOSwxNi4wMUg1di0ydi02di0zYzAtMC44MDYsMC41NS0wLjk4OCwxLTFoN3Y3bDItMWwyLDF2LTdoMlYxNVYxNi4wMXpcIixcbiAgXCJwYW5lLWxheW91dFwiOiBcIlwiLFxuICBcInBhcGVyLXBsYW5lXCI6XG4gICAgXCJNMjAuNTYzLDMuMzRjLTAuMjkyLTAuMTk5LTAuNjY3LTAuMjI5LTAuOTg5LTAuMDc5bC0xNyw4QzIuMjE5LDExLjQyOSwxLjk5NSwxMS43ODgsMiwxMi4xOCBjMC4wMDYsMC4zOTIsMC4yNCwwLjc0NSwwLjYsMC45MDJMOCwxNS40NDV2Ni43MjJsNS44MzYtNC4xNjhsNC43NjQsMi4wODRjMC4xMjgsMC4wNTcsMC4yNjUsMC4wODQsMC40LDAuMDg0IGMwLjE4MSwwLDAuMzYtMC4wNDksMC41Mi0wLjE0NmMwLjI3OC0wLjE2OSwwLjQ1Ny0wLjQ2MywwLjQ3OS0wLjc4OGwxLTE1QzIxLjAyMSwzLjg3OSwyMC44NTYsMy41NCwyMC41NjMsMy4zNHogTTE4LjA5NywxNy42OCBsLTUuMjY5LTIuMzA2TDE2LDkuMTY3bC03LjY0OSw0LjI1bC0yLjkzMi0xLjI4M0wxOC44OSw1Ljc5NEwxOC4wOTcsMTcuNjh6XCIsXG4gIHBhdXNlZDogXCJcIixcbiAgXCJwZGYtZmlsZVwiOlxuICAgIFwiTTguMjY3IDE0LjY4Yy0uMTg0IDAtLjMwOC4wMTgtLjM3Mi4wMzZ2MS4xNzhjLjA3Ni4wMTguMTcxLjAyMy4zMDIuMDIzLjQ3OSAwIC43NzQtLjI0Mi43NzQtLjY1MUM4Ljk3MSAxNC45IDguNzE3IDE0LjY4IDguMjY3IDE0LjY4ek0xMS43NTQgMTQuNjkyYy0uMiAwLS4zMy4wMTgtLjQwNy4wMzZ2Mi42MWMuMDc3LjAxOC4yMDEuMDE4LjMxMy4wMTguODE3LjAwNiAxLjM0OS0uNDQ0IDEuMzQ5LTEuMzk2QzEzLjAxNSAxNS4xMyAxMi41MyAxNC42OTIgMTEuNzU0IDE0LjY5MnpcIixcbiAgcGVuY2lsOlxuICBcIk0xOS4wNDUgNy40MDFjLjM3OC0uMzc4LjU4Ni0uODguNTg2LTEuNDE0cy0uMjA4LTEuMDM2LS41ODYtMS40MTRsLTEuNTg2LTEuNTg2Yy0uMzc4LS4zNzgtLjg4LS41ODYtMS40MTQtLjU4NnMtMS4wMzYuMjA4LTEuNDEzLjU4NUw0IDEzLjU4NVYxOGg0LjQxM0wxOS4wNDUgNy40MDF6TTE2LjA0NSA0LjQwMWwxLjU4NyAxLjU4NS0xLjU5IDEuNTg0LTEuNTg2LTEuNTg1TDE2LjA0NSA0LjQwMXpNNiAxNnYtMS41ODVsNy4wNC03LjAxOCAxLjU4NiAxLjU4Nkw3LjU4NyAxNkg2ek00IDIwSDIwVjIySDR6XCIsXG4gIHBpbjpcbiAgICBcIk0xMiwyMmwxLTJ2LTNoNWMwLjU1MywwLDEtMC40NDcsMS0xdi0xLjU4NmMwLTAuNTI2LTAuMjE0LTEuMDQyLTAuNTg2LTEuNDE0TDE3LDExLjU4NlY4YzAuNTUzLDAsMS0wLjQ0NywxLTFWNCBjMC0xLjEwMy0wLjg5Ny0yLTItMkg4QzYuODk3LDIsNiwyLjg5Nyw2LDR2M2MwLDAuNTUzLDAuNDQ4LDEsMSwxdjMuNTg2TDUuNTg2LDEzQzUuMjEzLDEzLjM3Miw1LDEzLjg4OCw1LDE0LjQxNFYxNiBjMCwwLjU1MywwLjQ0OCwxLDEsMWg1djNMMTIsMjJ6IE04LDRoOHYySDhWNHogTTcsMTQuNDE0bDEuNzA3LTEuNzA3QzguODk1LDEyLjUyLDksMTIuMjY2LDksMTJWOGg2djQgYzAsMC4yNjYsMC4xMDUsMC41MiwwLjI5MywwLjcwN0wxNywxNC40MTRWMTVIN1YxNC40MTR6XCIsXG4gIFwicG9wdXAtb3BlblwiOlxuICAgIFtcIk0yMCwzSDRDMi44OTcsMywyLDMuODk3LDIsNXYxNGMwLDEuMTAzLDAuODk3LDIsMiwyaDV2LTJINFY3aDE2djEyaC01djJoNWMxLjEwMywwLDItMC44OTcsMi0yVjVDMjIsMy44OTcsMjEuMTAzLDMsMjAsM3pcIixcbiAgICBcIk0xMyAyMUwxMyAxNiAxNiAxNiAxMiAxMSA4IDE2IDExIDE2IDExIDIxelwiLF0sXG4gIHByZXNlbnRhdGlvbjogXCJcIixcbiAgcmVzZXQ6IFtcIk0xMiwxNmMxLjY3MSwwLDMtMS4zMzEsMy0zcy0xLjMyOS0zLTMtM3MtMywxLjMzMS0zLDNTMTAuMzI5LDE2LDEyLDE2elwiLFxuICBcIk0yMC44MTcsMTEuMTg2Yy0wLjEyLTAuNTgzLTAuMjk3LTEuMTUxLTAuNTI1LTEuNjg4Yy0wLjIyNS0wLjUzMi0wLjUwNC0xLjA0Ni0wLjgzLTEuNTMxIGMtMC4zMjQtMC40NzktMC42OTMtMC45MjYtMS4wOTgtMS4zMjljLTAuNDA0LTAuNDA2LTAuODUzLTAuNzc2LTEuMzMyLTEuMTAxYy0wLjQ4My0wLjMyNi0wLjk5OC0wLjYwNC0xLjUyOC0wLjgyOSBjLTAuNTM4LTAuMjI5LTEuMTA2LTAuNDA1LTEuNjkxLTAuNTI2Yy0wLjYtMC4xMjMtMS4yMTktMC4xODItMS44MzgtMC4xOFYyTDgsNWwzLjk3NSwzVjYuMDAyQzEyLjQ1OSw2LDEyLjk0Myw2LjA0NiwxMy40MSw2LjE0MiBjMC40NTQsMC4wOTQsMC44OTYsMC4yMzEsMS4zMTQsMC40MDljMC40MTMsMC4xNzQsMC44MTMsMC4zOTIsMS4xODgsMC42NDRjMC4zNzMsMC4yNTIsMC43MjIsMC41NCwxLjAzOCwwLjg1NyBjMC4zMTUsMC4zMTQsMC42MDQsMC42NjMsMC44NTQsMS4wMzVjMC4yNTQsMC4zNzYsMC40NzEsMC43NzYsMC42NDYsMS4xOTFjMC4xNzgsMC40MTcsMC4zMTQsMC44NTksMC40MDgsMS4zMTEgQzE4Ljk1MiwxMi4wNDgsMTksMTIuNTIzLDE5LDEzcy0wLjA0OCwwLjk1Mi0wLjE0MiwxLjQxYy0wLjA5NCwwLjQ1NC0wLjIzLDAuODk2LTAuNDA4LDEuMzE1IGMtMC4xNzUsMC40MTMtMC4zOTIsMC44MTMtMC42NDQsMS4xODhjLTAuMjUzLDAuMzczLTAuNTQyLDAuNzIyLTAuODU4LDEuMDM5Yy0wLjMxNSwwLjMxNi0wLjY2MywwLjYwMy0xLjAzNiwwLjg1NCBjLTAuMzcyLDAuMjUxLTAuNzcxLDAuNDY4LTEuMTg5LDAuNjQ1Yy0wLjQxNywwLjE3Ny0wLjg1OCwwLjMxNC0xLjMxMSwwLjQwOGMtMC45MiwwLjE4OC0xLjkwNiwwLjE4OC0yLjgyMiwwIGMtMC40NTQtMC4wOTQtMC44OTYtMC4yMzEtMS4zMTQtMC40MDljLTAuNDE2LTAuMTc2LTAuODE1LTAuMzkzLTEuMTg5LTAuNjQ1Yy0wLjM3MS0wLjI1LTAuNzE5LTAuNTM4LTEuMDM1LTAuODU0IGMtMC4zMTUtMC4zMTYtMC42MDQtMC42NjUtMC44NTUtMS4wMzZjLTAuMjU0LTAuMzc2LTAuNDcxLTAuNzc2LTAuNjQ2LTEuMTljLTAuMTc4LTAuNDE4LTAuMzE0LTAuODYtMC40MDgtMS4zMTIgQzUuMDQ4LDEzLjk1Miw1LDEzLjQ3Nyw1LDEzSDNjMCwwLjYxMSwwLjA2MiwxLjIyMSwwLjE4MywxLjgxNGMwLjEyLDAuNTgyLDAuMjk3LDEuMTUsMC41MjUsMS42ODkgYzAuMjI1LDAuNTMyLDAuNTA0LDEuMDQ2LDAuODMxLDEuNTMxYzAuMzIzLDAuNDc3LDAuNjkyLDAuOTI0LDEuMDk3LDEuMzI5YzAuNDA2LDAuNDA3LDAuODU0LDAuNzc3LDEuMzMxLDEuMDk5IGMwLjQ3OSwwLjMyNSwwLjk5NCwwLjYwNCwxLjUyOSwwLjgzYzAuNTM4LDAuMjI5LDEuMTA2LDAuNDA1LDEuNjkxLDAuNTI2QzEwLjc3OSwyMS45MzgsMTEuMzg5LDIyLDEyLDIyczEuMjIxLTAuMDYyLDEuODE0LTAuMTgzIGMwLjU4My0wLjEyMSwxLjE1MS0wLjI5NywxLjY4OC0wLjUyNWMwLjUzNy0wLjIyNywxLjA1Mi0wLjUwNiwxLjUzLTAuODNjMC40NzgtMC4zMjIsMC45MjYtMC42OTIsMS4zMzEtMS4wOTkgYzAuNDA1LTAuNDA1LDAuNzc0LTAuODUzLDEuMS0xLjMzMmMwLjMyNS0wLjQ4MywwLjYwNC0wLjk5OCwwLjgyOS0xLjUyOGMwLjIyOS0wLjU0LDAuNDA1LTEuMTA4LDAuNTI1LTEuNjkyIEMyMC45MzgsMTQuMjIxLDIxLDEzLjYxMSwyMSwxM1MyMC45MzgsMTEuNzc5LDIwLjgxNywxMS4xODZ6XCIsXSxcbiAgXCJyaWdodC1hcnJvdy13aXRoLXRhaWxcIjpcbiAgICBcIk0xMC43MDcgMTcuNzA3TDE2LjQxNCAxMiAxMC43MDcgNi4yOTMgOS4yOTMgNy43MDcgMTMuNTg2IDEyIDkuMjkzIDE2LjI5M3pcIixcbiAgXCJyaWdodC1hcnJvd1wiOlxuICAgIFwiTTEwLjcwNyAxNy43MDdMMTYuNDE0IDEyIDEwLjcwNyA2LjI5MyA5LjI5MyA3LjcwNyAxMy41ODYgMTIgOS4yOTMgMTYuMjkzelwiLFxuICBcInJpZ2h0LXRyaWFuZ2xlXCI6XG4gICAgXCJNMTAuNzA3IDE3LjcwN0wxNi40MTQgMTIgMTAuNzA3IDYuMjkzIDkuMjkzIDcuNzA3IDEzLjU4NiAxMiA5LjI5MyAxNi4yOTN6XCIsXG4gIHNlYXJjaDpcbiAgXCJNMTkuMDIzLDE2Ljk3N2MtMC41MTMtMC40ODgtMS4wMDQtMC45OTctMS4zNjctMS4zODRjLTAuMzcyLTAuMzc4LTAuNTk2LTAuNjUzLTAuNTk2LTAuNjUzbC0yLjgtMS4zMzcgQzE1LjM0LDEyLjM3LDE2LDEwLjc2MywxNiw5YzAtMy44NTktMy4xNC03LTctN1MyLDUuMTQxLDIsOXMzLjE0LDcsNyw3YzEuNzYzLDAsMy4zNy0wLjY2LDQuNjAzLTEuNzM5bDEuMzM3LDIuOCBjMCwwLDAuMjc1LDAuMjI0LDAuNjUzLDAuNTk2YzAuMzg3LDAuMzYzLDAuODk2LDAuODU0LDEuMzg0LDEuMzY3YzAuNDk0LDAuNTA2LDAuOTg4LDEuMDEyLDEuMzU4LDEuMzkyIGMwLjM2MiwwLjM4OCwwLjYwNCwwLjY0NiwwLjYwNCwwLjY0NmwyLjEyMS0yLjEyMWMwLDAtMC4yNTgtMC4yNDItMC42NDYtMC42MDRDMjAuMDM1LDE3Ljk2NSwxOS41MjksMTcuNDcxLDE5LjAyMywxNi45Nzd6IE05LDE0IGMtMi43NTcsMC01LTIuMjQzLTUtNXMyLjI0My01LDUtNXM1LDIuMjQzLDUsNVMxMS43NTcsMTQsOSwxNHpcIixcbiAgXCJzaGVldHMtaW4tYm94XCI6IFwiXCIsXG4gIFwic3Rhci1saXN0XCI6XG4gICAgXCJNMTkgMTVMMTkgMTIgMTcgMTIgMTcgMTUgMTQuNzggMTUgMTQgMTUgMTQgMTcgMTQuNzggMTcgMTcgMTcgMTcgMjAgMTkgMjAgMTkgMTcgMjEuMDYzIDE3IDIyIDE3IDIyIDE1IDIxLjA2MyAxNXpNNCA3SDE1VjlINHpNNCAxMUgxNVYxM0g0ek00IDE1SDEyVjE3SDR6XCIsXG4gIHN0YXI6XG4gICAgXCJNNi41MTYsMTQuMzIzbC0xLjQ5LDYuNDUyYy0wLjA5MiwwLjM5OSwwLjA2OCwwLjgxNCwwLjQwNiwxLjA0N0M1LjYwMywyMS45NCw1LjgwMSwyMiw2LDIyIGMwLjE5MywwLDAuMzg3LTAuMDU2LDAuNTU1LTAuMTY4TDEyLDE4LjIwMmw1LjQ0NSwzLjYzYzAuMzQ4LDAuMjMyLDAuODA1LDAuMjIzLDEuMTQ1LTAuMDI0YzAuMzM4LTAuMjQ3LDAuNDg3LTAuNjgsMC4zNzItMS4wODIgbC0xLjgyOS02LjRsNC41MzYtNC4wODJjMC4yOTctMC4yNjgsMC40MDYtMC42ODYsMC4yNzgtMS4wNjRjLTAuMTI5LTAuMzc4LTAuNDctMC42NDQtMC44NjgtMC42NzZMMTUuMzc4LDguMDVsLTIuNDY3LTUuNDYxIEMxMi43NSwyLjIzLDEyLjM5MywyLDEyLDJzLTAuNzUsMC4yMy0wLjkxMSwwLjU4OUw4LjYyMiw4LjA1TDIuOTIxLDguNTAzQzIuNTI5LDguNTM0LDIuMTkyLDguNzkxLDIuMDYsOS4xNiBjLTAuMTM0LDAuMzY5LTAuMDM4LDAuNzgyLDAuMjQyLDEuMDU2TDYuNTE2LDE0LjMyM3ogTTkuMzY5LDkuOTk3YzAuMzYzLTAuMDI5LDAuNjgzLTAuMjUzLDAuODMyLTAuNTg2TDEyLDUuNDNsMS43OTksMy45ODEgYzAuMTQ5LDAuMzMzLDAuNDY5LDAuNTU3LDAuODMyLDAuNTg2bDMuOTcyLDAuMzE1bC0zLjI3MSwyLjk0NGMtMC4yODQsMC4yNTYtMC4zOTcsMC42NS0wLjI5MywxLjAxOGwxLjI1Myw0LjM4NWwtMy43MzYtMi40OTEgYy0wLjMzNi0wLjIyNS0wLjc3My0wLjIyNS0xLjEwOSwwbC0zLjkwNCwyLjYwM2wxLjA1LTQuNTQ2YzAuMDc4LTAuMzQtMC4wMjYtMC42OTctMC4yNzYtMC45NGwtMy4wMzgtMi45NjJMOS4zNjksOS45OTd6XCIsXG4gIHN3aXRjaDogXCJcIixcbiAgXCJzeW5jLXNtYWxsXCI6IFwiXCIsXG4gIHN5bmM6IFwiXCIsXG4gIFwidGhyZWUtaG9yaXpvbnRhbC1iYXJzXCI6IFwiTTQgNkgyMFY4SDR6TTQgMTFIMjBWMTNINHpNNCAxNkgyMFYxOEg0elwiLFxuICB0cmFzaDogW1xuICAgIHtcbiAgICAgIGZpbGw6IFwibm9uZVwiLFxuICAgICAgZDpcbiAgICAgICAgXCJNMTcuMDA0IDIwTDE3LjAwMyA4aC0xLTgtMXYxMkgxNy4wMDR6TTEzLjAwMyAxMGgydjhoLTJWMTB6TTkuMDAzIDEwaDJ2OGgtMlYxMHpNOS4wMDMgNEgxNS4wMDNWNkg5LjAwM3pcIixcbiAgICB9LFxuICAgIFwiTTUuMDAzLDIwYzAsMS4xMDMsMC44OTcsMiwyLDJoMTBjMS4xMDMsMCwyLTAuODk3LDItMlY4aDJWNmgtM2gtMVY0YzAtMS4xMDMtMC44OTctMi0yLTJoLTZjLTEuMTAzLDAtMiwwLjg5Ny0yLDJ2MmgtMWgtMyB2MmgyVjIweiBNOS4wMDMsNGg2djJoLTZWNHogTTguMDAzLDhoOGgxbDAuMDAxLDEySDcuMDAzVjhIOC4wMDN6XCIsXG4gICAgXCJNOS4wMDMgMTBIMTEuMDAzVjE4SDkuMDAzek0xMy4wMDMgMTBIMTUuMDAzVjE4SDEzLjAwM3pcIixcbiAgXSxcbiAgXCJ0d28tY29sdW1uc1wiOiBcIlwiLFxuICBcInVwLWFuZC1kb3duLWFycm93c1wiOlxuICAgIFwiTTcgMjBMOSAyMCA5IDggMTIgOCA4IDQgNCA4IDcgOHpNMjAgMTZMMTcgMTYgMTcgNCAxNSA0IDE1IDE2IDEyIDE2IDE2IDIwelwiLFxuICBcInVwcGVyY2FzZS1sb3dlcmNhc2UtYVwiOlxuICAgIFwiTTIyIDZMMTkgMiAxNiA2IDE4IDYgMTggMTAgMTYgMTAgMTkgMTQgMjIgMTAgMjAgMTAgMjAgNnpNOS4zMDcgNGwtNiAxNmgyLjEzN2wxLjg3NS01aDYuMzYzbDEuODc1IDVoMi4xMzdsLTYtMTZIOS4zMDd6TTguMDY4IDEzTDEwLjUgNi41MTUgMTIuOTMyIDEzSDguMDY4elwiLFxuICB2YXVsdDpcbiAgICBcIk0xOSwyLjAxSDZjLTEuMjA2LDAtMywwLjc5OS0zLDN2M3Y2djN2MmMwLDIuMjAxLDEuNzk0LDMsMywzaDE1di0ySDYuMDEyQzUuNTUsMTkuOTk4LDUsMTkuODE1LDUsMTkuMDEgYzAtMC4xMDEsMC4wMDktMC4xOTEsMC4wMjQtMC4yNzNjMC4xMTItMC41NzUsMC41ODMtMC43MTcsMC45ODctMC43MjdIMjBjMC4wMTgsMCwwLjAzMS0wLjAwOSwwLjA0OS0wLjAxSDIxdi0wLjk5VjE1VjQuMDEgQzIxLDIuOTA3LDIwLjEwMywyLjAxLDE5LDIuMDF6IE0xOSwxNi4wMUg1di0ydi02di0zYzAtMC44MDYsMC41NS0wLjk4OCwxLTFoN3Y3bDItMWwyLDF2LTdoMlYxNVYxNi4wMXpcIixcbiAgXCJ2ZXJ0aWNhbC1zcGxpdFwiOiBcIk03IDE3TDEyIDIyIDE3IDE3IDEzIDE3IDEzIDcgMTcgNyAxMiAyIDcgNyAxMSA3IDExIDE3elwiLFxuICBcInZlcnRpY2FsLXRocmVlLWRvdHNcIjpcbiAgICBcIk0xMiAxMGMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTJTMTMuMSAxMCAxMiAxMHpNMTIgNGMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTJTMTMuMSA0IDEyIDR6TTEyIDE2Yy0xLjEgMC0yIC45LTIgMnMuOSAyIDIgMiAyLS45IDItMlMxMy4xIDE2IDEyIDE2elwiLFxufTtcblxuY29uc3QgZnJvbSA9IDI0O1xuY29uc3QgdG8gPSAxMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0SWNvbnMoKSB7XG4gIE9iamVjdC5rZXlzKGljb25zKS5mb3JFYWNoKChpY29uKSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IGljb25zW2ljb25dO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGF0aCkpIHtcbiAgICAgIGFkZEljb24oaWNvbiwgcGF0aC5tYXAoKHApID0+IHNjYWxlKHAsIGZyb20sIHRvKSkuam9pbihcIlwiKSk7XG4gICAgfSBlbHNlIGlmIChwYXRoICE9PSBcIlwiKSB7XG4gICAgICBhZGRJY29uKGljb24sIHNjYWxlKHBhdGgsIGZyb20sIHRvKSk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7XHJcbiAgQXBwLFxyXG4gIFBsdWdpbixcclxuICBQbHVnaW5TZXR0aW5nVGFiLFxyXG4gIFNldHRpbmcsXHJcbiAgV29ya3NwYWNlTGVhZixcclxufSBmcm9tIFwib2JzaWRpYW5cIjtcclxuXHJcbmltcG9ydCBFbWJlZGRlZEhlYWRpbmdzRXh0ZW5zaW9uIGZyb20gXCIuL2V4dGVuc2lvbnMvZW1iZWRkZWRIZWFkaW5nc1wiO1xyXG5pbXBvcnQgeyBpbml0SWNvbnMgfSBmcm9tICcuL2V4dGVuc2lvbnMvYm94aWNvbnMnXHJcblxyXG5pbml0SWNvbnMoKTtcclxuXHJcbmNvbnN0IGNvbmZpZyA9IHtcclxuICBhdHRyaWJ1dGVzOiBmYWxzZSxcclxuICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgc3VidHJlZTogZmFsc2UsXHJcbn07XHJcblxyXG5mdW5jdGlvbiB0YWdOb2RlKG5vZGU6IE5vZGUpIHtcclxuICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgbm9kZUVsID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcclxuXHJcbiAgaWYgKFxyXG4gICAgIW5vZGVFbC5kYXRhc2V0LnRhZ05hbWUgJiZcclxuICAgIG5vZGVFbC5oYXNDaGlsZE5vZGVzKCkgJiZcclxuICAgIG5vZGVFbC5maXJzdENoaWxkLm5vZGVUeXBlICE9PSAzXHJcbiAgKSB7XHJcbiAgICBjb25zdCBjaGlsZEVsID0gbm9kZS5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgbm9kZUVsLmRhdGFzZXQudGFnTmFtZSA9IGNoaWxkRWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsaWZvcm5pYUNvYXN0VGhlbWUgZXh0ZW5kcyBQbHVnaW4ge1xyXG4gIHNldHRpbmdzOiBUaGVtZVNldHRpbmdzO1xyXG4gIG1lZGlhOiBNZWRpYVF1ZXJ5TGlzdCB8IG51bGwgPSBudWxsO1xyXG4gIG9ic2VydmVyczogeyBbaWQ6IHN0cmluZ106IE11dGF0aW9uT2JzZXJ2ZXIgfSA9IHt9O1xyXG4gIGVtYmVkZGVkSGVhZGluZ3M6IEVtYmVkZGVkSGVhZGluZ3NFeHRlbnNpb247XHJcblxyXG4gIGFzeW5jIG9ubG9hZCgpIHtcclxuICAgIHRoaXMuZW1iZWRkZWRIZWFkaW5ncyA9IG5ldyBFbWJlZGRlZEhlYWRpbmdzRXh0ZW5zaW9uKCk7XHJcblxyXG4gICAgdGhpcy5zZXR0aW5ncyA9IChhd2FpdCB0aGlzLmxvYWREYXRhKCkpIHx8IG5ldyBUaGVtZVNldHRpbmdzKCk7XHJcblxyXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBUaGVtZVNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuICAgIHRoaXMuYWRkU3R5bGUoKTtcclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG5cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLnVzZVN5c3RlbVRoZW1lKSB7XHJcbiAgICAgIHRoaXMuZW5hYmxlU3lzdGVtVGhlbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoXHJcbiAgICAgICEodGhpcy5hcHAgYXMgYW55KS5wbHVnaW5zLnBsdWdpbnNbXCJvYnNpZGlhbi1jb250ZXh0dWFsLXR5cG9ncmFwaHlcIl0gJiZcclxuICAgICAgdGhpcy5zZXR0aW5ncy5wcmV0dHlQcmV2aWV3XHJcbiAgICApIHtcclxuICAgICAgdGhpcy5lbmFibGVDb250ZXh0dWFsVHlwb2dyYXBoeSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLmVtYmVkZGVkSGVhZGluZ3MpIHtcclxuICAgICAgdGhpcy5lbmFibGVFbWJlZGRlZEhlYWRpbmdzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbnVubG9hZCgpIHtcclxuICAgIHRoaXMuZGlzYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5KCk7XHJcbiAgICB0aGlzLmRpc2FibGVFbWJlZGRlZEhlYWRpbmdzKCk7XHJcbiAgfVxyXG5cclxuICBtZWRpYUNhbGxiYWNrID0gKGU6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IHtcclxuICAgIGlmIChlLm1hdGNoZXMpIHtcclxuICAgICAgdGhpcy51cGRhdGVEYXJrU3R5bGUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXBkYXRlTGlnaHRTdHlsZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGxpc3RlbkZvclN5c3RlbVRoZW1lID0gKCkgPT4ge1xyXG4gICAgdGhpcy5tZWRpYSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiKTtcclxuICAgIHRoaXMubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCB0aGlzLm1lZGlhQ2FsbGJhY2spO1xyXG4gICAgdGhpcy5yZWdpc3RlcigoKSA9PlxyXG4gICAgICB0aGlzLm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5tZWRpYUNhbGxiYWNrKVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAodGhpcy5tZWRpYS5tYXRjaGVzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRGFya1N0eWxlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVwZGF0ZUxpZ2h0U3R5bGUoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzdG9wTGlzdGVuaW5nRm9yU3lzdGVtVGhlbWUgPSAoKSA9PiB7XHJcbiAgICB0aGlzLm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5tZWRpYUNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvLyByZWZyZXNoIGZ1bmN0aW9uIGZvciB3aGVuIHdlIGNoYW5nZSBzZXR0aW5nc1xyXG4gIHJlZnJlc2goKSB7XHJcbiAgICAvLyByZS1sb2FkIHRoZSBzdHlsZVxyXG4gICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gYWRkIHRoZSBzdHlsaW5nIGVsZW1lbnRzIHdlIG5lZWRcclxuICBhZGRTdHlsZSgpIHtcclxuICAgIC8vIGFkZCBhIGNzcyBibG9jayBmb3Igb3VyIHNldHRpbmdzLWRlcGVuZGVudCBzdHlsZXNcclxuICAgIGNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuICAgIGNzcy5pZCA9IFwiY2FsaWZvcm5pYS1jb2FzdC10aGVtZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKGNzcyk7XHJcblxyXG4gICAgLy8gYWRkIHRoZSBtYWluIGNsYXNzXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJjYWxpZm9ybmlhLWNvYXN0LXRoZW1lXCIpO1xyXG5cclxuICAgIC8vIHVwZGF0ZSB0aGUgc3R5bGUgd2l0aCB0aGUgc2V0dGluZ3MtZGVwZW5kZW50IHN0eWxlc1xyXG4gICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlU3R5bGUoKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNsYXNzKFwiY2MtcHJldHR5LWVkaXRvclwiLCBcImNjLXByZXR0eS1wcmV2aWV3XCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gdXBkYXRlIHRoZSBzdHlsZXMgKGF0IHRoZSBzdGFydCwgb3IgYXMgdGhlIHJlc3VsdCBvZiBhIHNldHRpbmdzIGNoYW5nZSlcclxuICB1cGRhdGVTdHlsZSgpIHtcclxuICAgIHRoaXMucmVtb3ZlU3R5bGUoKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcclxuICAgICAgXCJjYy1wcmV0dHktZWRpdG9yXCIsXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MucHJldHR5RWRpdG9yXHJcbiAgICApO1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFxyXG4gICAgICBcImNjLXByZXR0eS1wcmV2aWV3XCIsXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MucHJldHR5UHJldmlld1xyXG4gICAgKTtcclxuXHJcbiAgICAvLyBnZXQgdGhlIGN1c3RvbSBjc3MgZWxlbWVudFxyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbGlmb3JuaWEtY29hc3QtdGhlbWVcIik7XHJcbiAgICBpZiAoIWVsKSB0aHJvdyBcImNhbGlmb3JuaWEtY29hc3QtdGhlbWUgZWxlbWVudCBub3QgZm91bmQhXCI7XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy8gc2V0IHRoZSBzZXR0aW5ncy1kZXBlbmRlbnQgY3NzXHJcbiAgICAgIGVsLmlubmVyVGV4dCA9IGBcclxuICAgICAgICBib2R5LmNhbGlmb3JuaWEtY29hc3QtdGhlbWUge1xyXG4gICAgICAgICAgLS1lZGl0b3ItZm9udC1zaXplOiR7dGhpcy5zZXR0aW5ncy50ZXh0Tm9ybWFsfXB4O1xyXG4gICAgICAgICAgLS1lZGl0b3ItZm9udC1mZWF0dXJlczogJHt0aGlzLnNldHRpbmdzLmZvbnRGZWF0dXJlc307XHJcbiAgICAgICAgICAtLWxpbmUtd2lkdGg6JHt0aGlzLnNldHRpbmdzLmxpbmVXaWR0aH1yZW07XHJcbiAgICAgICAgICAtLWZvbnQtbW9ub3NwYWNlOiR7dGhpcy5zZXR0aW5ncy5tb25vRm9udH07XHJcbiAgICAgICAgICAtLXRleHQ6JHt0aGlzLnNldHRpbmdzLnRleHRGb250fTtcclxuICAgICAgICAgIC0tdGV4dC1lZGl0b3I6JHt0aGlzLnNldHRpbmdzLmVkaXRvckZvbnR9O1xyXG4gICAgICAgIH1cclxuICAgICAgYFxyXG4gICAgICAgIC50cmltKClcclxuICAgICAgICAucmVwbGFjZSgvW1xcclxcblxcc10rL2csIFwiIFwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVuYWJsZVN5c3RlbVRoZW1lKCkge1xyXG4gICAgKHRoaXMuYXBwLndvcmtzcGFjZSBhcyBhbnkpLmxheW91dFJlYWR5XHJcbiAgICAgID8gdGhpcy5saXN0ZW5Gb3JTeXN0ZW1UaGVtZSgpXHJcbiAgICAgIDogdGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LXJlYWR5XCIsIHRoaXMubGlzdGVuRm9yU3lzdGVtVGhlbWUpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGFya1N0eWxlKCkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDbGFzcyhcInRoZW1lLWxpZ2h0XCIpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRDbGFzcyhcInRoZW1lLWRhcmtcIik7XHJcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2UudHJpZ2dlcihcImNzcy1jaGFuZ2VcIik7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVMaWdodFN0eWxlKCkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDbGFzcyhcInRoZW1lLWRhcmtcIik7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZENsYXNzKFwidGhlbWUtbGlnaHRcIik7XHJcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2UudHJpZ2dlcihcImNzcy1jaGFuZ2VcIik7XHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0T2JzZXJ2ZXIoaWQ6IHN0cmluZykge1xyXG4gICAgaWYgKHRoaXMub2JzZXJ2ZXJzW2lkXSkge1xyXG4gICAgICB0aGlzLm9ic2VydmVyc1tpZF0uZGlzY29ubmVjdCgpO1xyXG4gICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNbaWRdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29ubmVjdE9ic2VydmVyKGlkOiBzdHJpbmcsIGxlYWY6IFdvcmtzcGFjZUxlYWYpIHtcclxuICAgIGlmICh0aGlzLm9ic2VydmVyc1tpZF0pIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBwcmV2aWV3U2VjdGlvbiA9IGxlYWYudmlldy5jb250YWluZXJFbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICBcIm1hcmtkb3duLXByZXZpZXctc2VjdGlvblwiXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChwcmV2aWV3U2VjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5vYnNlcnZlcnNbaWRdID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xyXG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xyXG4gICAgICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKHRhZ05vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2lkXS5vYnNlcnZlKHByZXZpZXdTZWN0aW9uWzBdLCBjb25maWcpO1xyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgcHJldmlld1NlY3Rpb25bMF0uY2hpbGROb2Rlcy5mb3JFYWNoKHRhZ05vZGUpO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVuYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5ID0gKCkgPT4ge1xyXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxyXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5wcmV0dHlQcmV2aWV3KSB7XHJcbiAgICAgICAgICBjb25zdCBzZWVuOiB7IFtrOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcclxuICBcclxuICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlUm9vdExlYXZlcygobGVhZikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IChsZWFmIGFzIGFueSkuaWQgYXMgc3RyaW5nO1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RPYnNlcnZlcihpZCwgbGVhZik7XHJcbiAgICAgICAgICAgIHNlZW5baWRdID0gdHJ1ZTtcclxuICAgICAgICAgIH0pO1xyXG4gIFxyXG4gICAgICAgICAgT2JqZWN0LmtleXModGhpcy5vYnNlcnZlcnMpLmZvckVhY2goKGspID0+IHtcclxuICAgICAgICAgICAgaWYgKCFzZWVuW2tdKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0T2JzZXJ2ZXIoayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgZGlzYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5ID0gKCkgPT4ge1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5vYnNlcnZlcnMpLmZvckVhY2goKGspID0+IHRoaXMuZGlzY29ubmVjdE9ic2VydmVyKGspKTtcclxuICB9O1xyXG5cclxuICBlbmFibGVFbWJlZGRlZEhlYWRpbmdzID0gKCkgPT4ge1xyXG4gICAgdGhpcy5lbWJlZGRlZEhlYWRpbmdzLm9ubG9hZCgpO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZW1iZWRkZWRIZWFkaW5ncykge1xyXG4gICAgICAgICAgdGhpcy5lbWJlZGRlZEhlYWRpbmdzLmNyZWF0ZUhlYWRpbmdzKHRoaXMuYXBwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIGRpc2FibGVFbWJlZGRlZEhlYWRpbmdzID0gKCkgPT4ge1xyXG4gICAgdGhpcy5lbWJlZGRlZEhlYWRpbmdzLm9udW5sb2FkKCk7XHJcbiAgfTtcclxufVxyXG5cclxuY2xhc3MgVGhlbWVTZXR0aW5ncyB7XHJcbiAgcHJldHR5RWRpdG9yOiBib29sZWFuID0gdHJ1ZTtcclxuICBwcmV0dHlQcmV2aWV3OiBib29sZWFuID0gdHJ1ZTtcclxuICBlbWJlZGRlZEhlYWRpbmdzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgdXNlU3lzdGVtVGhlbWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgbGluZVdpZHRoOiBudW1iZXIgPSA0MjtcclxuICB0ZXh0Tm9ybWFsOiBudW1iZXIgPSAxODtcclxuXHJcbiAgZm9udEZlYXR1cmVzOiBzdHJpbmcgPSAnXCJcIic7XHJcblxyXG4gIHRleHRGb250OiBzdHJpbmcgPVxyXG4gICAgJy1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFwiU2Vnb2UgVUkgRW1vamlcIixcIlNlZ29lIFVJXCIsUm9ib3RvLE94eWdlbi1TYW5zLFVidW50dSxDYW50YXJlbGwsc2Fucy1zZXJpZic7XHJcblxyXG4gIGVkaXRvckZvbnQ6IHN0cmluZyA9XHJcbiAgICAnLWFwcGxlLXN5c3RlbSxCbGlua01hY1N5c3RlbUZvbnQsXCJTZWdvZSBVSSBFbW9qaVwiLFwiU2Vnb2UgVUlcIixSb2JvdG8sT3h5Z2VuLVNhbnMsVWJ1bnR1LENhbnRhcmVsbCxzYW5zLXNlcmlmJztcclxuXHJcbiAgbW9ub0ZvbnQ6IHN0cmluZyA9IFwiTWVubG8sU0ZNb25vLVJlZ3VsYXIsQ29uc29sYXMsUm9ib3RvIE1vbm8sbW9ub3NwYWNlXCI7XHJcbn1cclxuXHJcbmNsYXNzIFRoZW1lU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG4gIHBsdWdpbjogQ2FsaWZvcm5pYUNvYXN0VGhlbWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IENhbGlmb3JuaWFDb2FzdFRoZW1lKSB7XHJcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XHJcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICB9XHJcblxyXG4gIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuXHJcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiQ2FsaWZvcm5pYSBDb2FzdCBUaGVtZVwiIH0pO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkVuaGFuY2VkIEVkaXRvciBUeXBvZ3JhcGh5XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiRW5oYW5jZXMgdGhlIHR5cG9ncmFwaHkgc3R5bGVzIGluIGVkaXRvciBtb2RlXCIpXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJldHR5RWRpdG9yKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnByZXR0eUVkaXRvciA9IHZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRW5oYW5jZWQgUHJldmlldyBUeXBvZ3JhcGh5XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiRW5oYW5jZXMgdGhlIHR5cG9ncmFwaHkgc3R5bGVzIGluIHByZXZpZXcgbW9kZVwiKVxyXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XHJcbiAgICAgICAgdG9nZ2xlXHJcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJldHR5UHJldmlldylcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucHJldHR5UHJldmlldyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLmVuYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGlzYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRGlzcGxheSBub3RlIGZpbGUgbmFtZXMgYXMgaGVhZGluZ3NcIilcclxuICAgICAgLnNldERlc2MoXCJFbWJlZHMgbm90ZSB0aXRsZXMgYXMgdG9wIGxldmVsIEgxIHRhZ3NcIilcclxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxyXG4gICAgICAgIHRvZ2dsZVxyXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVtYmVkZGVkSGVhZGluZ3MpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVtYmVkZGVkSGVhZGluZ3MgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5lbmFibGVFbWJlZGRlZEhlYWRpbmdzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGlzYWJsZUVtYmVkZGVkSGVhZGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJVc2Ugc3lzdGVtLWxldmVsIHNldHRpbmcgZm9yIGxpZ2h0IG9yIGRhcmsgbW9kZVwiKVxyXG4gICAgICAuc2V0RGVzYyhcIkF1dG9tYXRpY2FsbHkgc3dpdGNoIGJhc2VkIG9uIHlvdXIgb3BlcmF0aW5nIHN5c3RlbSBzZXR0aW5nc1wiKVxyXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XHJcbiAgICAgICAgdG9nZ2xlXHJcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlU3lzdGVtVGhlbWUpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZVN5c3RlbVRoZW1lID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLmxpc3RlbkZvclN5c3RlbVRoZW1lKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc3RvcExpc3RlbmluZ0ZvclN5c3RlbVRoZW1lKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiTGluZSB3aWR0aFwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlRoZSBtYXhpbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHBlciBsaW5lIChkZWZhdWx0IDQwKVwiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCI0MlwiKVxyXG4gICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5saW5lV2lkdGggfHwgXCJcIikgKyBcIlwiKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5saW5lV2lkdGggPSBwYXJzZUludCh2YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiQm9keSBmb250IHNpemVcIilcclxuICAgICAgLnNldERlc2MoXCJVc2VkIGZvciB0aGUgbWFpbiB0ZXh0IChkZWZhdWx0IDE4KVwiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCIxOFwiKVxyXG4gICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZXh0Tm9ybWFsIHx8IFwiXCIpICsgXCJcIilcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGV4dE5vcm1hbCA9IHBhcnNlSW50KHZhbHVlLnRyaW0oKSk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImJyXCIpO1xyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiQ3VzdG9tIGZvbnRzXCIgfSk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiVUkgZm9udFwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlVzZWQgZm9yIHRoZSB1c2VyIGludGVyZmFjZVwiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZSgodGhpcy5wbHVnaW4uc2V0dGluZ3MudGV4dEZvbnQgfHwgXCJcIikgKyBcIlwiKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZXh0Rm9udCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRWRpdG9yIGZvbnRcIilcclxuICAgICAgLnNldERlc2MoXCJVc2VkIGZvciB0aGUgZWRpdG9yIGFuZCBwcmV2aWV3XCIpXHJcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG4gICAgICAgIHRleHRcclxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIlwiKVxyXG4gICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lZGl0b3JGb250IHx8IFwiXCIpICsgXCJcIilcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZWRpdG9yRm9udCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRWRpdG9yIGZvbnQgZmVhdHVyZXNcIilcclxuICAgICAgLnNldERlc2MoJ2VnLiBcInNzMDFcIiwgXCJjdjA1XCIsIFwiY3YwN1wiLCBcImNhc2VcIicpXHJcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG4gICAgICAgIHRleHRcclxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignXCJcIicpXHJcbiAgICAgICAgICAuc2V0VmFsdWUoKHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbnRGZWF0dXJlcyB8fCBcIlwiKSArIFwiXCIpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbnRGZWF0dXJlcyA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIk1vbm9zcGFjZSBmb250XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiVXNlZCBmb3IgY29kZSBibG9ja3MsIGZyb250IG1hdHRlciwgZXRjXCIpXHJcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG4gICAgICAgIHRleHRcclxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIlwiKVxyXG4gICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb25vRm9udCB8fCBcIlwiKSArIFwiXCIpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1vbm9Gb250ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIm1hdHJpeCIsIk1hdHJpeCIsInBhdGhQYXJzZSIsInRyYW5zZm9ybVBhcnNlIiwicmVxdWlyZSQkMCIsInN2Z3BhdGgiLCJhZGRJY29uIiwiUGx1Z2luIiwiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQXVDRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlDLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDeEUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCO0FBQ2hCLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO0FBQ2hJLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQzFHLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENB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QUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO0FBQ3hFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07QUFDaEUsQ0FBQyxDQUFDO0FBQ0Y7QUFDQSxTQUFTLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDckIsRUFBRSxPQUFPLENBQUMsRUFBRSxLQUFLLElBQUksTUFBTSxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxNQUFNLENBQUM7QUFDN0U7QUFDQSxLQUFLLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssSUFBSSxDQUFDO0FBQ3JGLEtBQUssRUFBRSxJQUFJLE1BQU0sSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFDRDtBQUNBLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRTtBQUN6QjtBQUNBLEVBQUUsUUFBUSxJQUFJLEdBQUcsSUFBSTtBQUNyQixJQUFJLEtBQUssSUFBSSxRQUFRO0FBQ3JCLElBQUksS0FBSyxJQUFJLFFBQVE7QUFDckIsSUFBSSxLQUFLLElBQUksUUFBUTtBQUNyQixJQUFJLEtBQUssSUFBSSxRQUFRO0FBQ3JCLElBQUksS0FBSyxJQUFJLFFBQVE7QUFDckIsSUFBSSxLQUFLLElBQUksUUFBUTtBQUNyQixJQUFJLEtBQUssSUFBSSxRQUFRO0FBQ3JCLElBQUksS0FBSyxJQUFJLFFBQVE7QUFDckIsSUFBSSxLQUFLLElBQUksUUFBUTtBQUNyQixJQUFJLEtBQUssSUFBSSxRQUFRO0FBQ3JC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O0FBQ0E7QUFDQSxFQUFFLEdBQUcsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN6QyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDNUI7QUFDQSxFQUFFLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDMUI7QUFDQSxFQUFFLElBQUksS0FBSyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMxQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2hCLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3BDLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLEtBQUssR0FBRyxFQUFFO0FBQ3JCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM5QyxHQUFHLE1BQU07QUFDVDtBQUNBLElBQUksT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNoRCxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxNQUFNLElBQUksQ0FBQyxXQUFXLENB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Q0FBQztBQUN4QjtBQUNBLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3RCO0FBQ0EsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsR0FBRztBQUNILEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxLQUFLLEVBQUU7QUFDMUMsRUFBRSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4RSxHQUFHO0FBQ0gsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLEtBQUssRUFBRTtBQUMxQyxFQUFFLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNuQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLEdBQUc7QUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxZQUFZO0FBQ3ZDLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2xCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDdEMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0I7QUFDQSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQy9CLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDcEIsQ0FBQyxD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SyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN4RixDQUFDO0FBQ0Q7QUFDQSxPQUFjLEdBQUcsU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7QUFDbkUsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDMUMsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQ7QUFDQSxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO0FBQzlCO0FBQ0EsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDNUI7QUFDQSxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwQixFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDakUsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDbEIsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVFO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsRUFBRSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNFLEVBQUUsV0FBVyxJQUFJLFFBQVEsQ0FBQztBQUMx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R0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsR0FBRyxDQUFDO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFD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QSxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDdkIsRUFBRSxJQUFJLEVBQUUsSUFBSSxZQUFZLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQy9EO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBR0UsVUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xDO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUM3QjtBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsT0FBTyxNQUFNLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2RDtBQUNBLEVBQUUsSUFBSSxHQUFHLFlBQVksT0FBTyxFQUFFO0FBQzlCO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QjtBQUNBO0FBQ0EsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDcEIsSUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUUsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQzdDLE1BQU0sT0FBTyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDMUMsS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBLElBQUksT0FBTyxDQUFDLENBQUM7QUFDYixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDN0QsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQzFDLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNyQjtBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUU7QUFDbEM7QUFDQSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekMsSUFBSSxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQztBQUNwQztBQUNBLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hCO0FBQ0E7QUFDQSxNQUFNLEtBQUssR0FBRztBQUNkLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2QyxRQUFRLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BFLFFBQVEsTUFBTTtBQUNkO0FBQ0EsTUFBTSxLQUFLLEdBQUc7QUFDZCxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEMsUUFBUSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN6RixRQUFRLE1BQU07QUFDZDtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEUsUUFBUSxNQUFNO0FBQ2Q7QUFDQSxNQUFNLEtBQUssR0FBRztBQUNkLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4QyxRQUFRLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3pGLFFBQVEsTUFBTTtBQUNkO0FBQ0EsTUFBTSxLQUFLLEdBQUcsQ0FBQztBQUNmLE1BQU0sS0FBSyxHQUFHO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsUUFBUSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQy9DLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2xDLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUM3QztBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDckQsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3hELFVBQVUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUM1RCxVQUFVLE1BQU07QUFDaEIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO0FBQzlCO0FBQ0EsVUFBVSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzVELFNBQVMsTUFBTTtBQUNmO0FBQ0E7QUFDQSxVQUFVLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN0RSxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE1BQU07QUFDZDtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2Q7QUFDQTtBQUNBLFFBQVEsVUFBVSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDL0I7QUFDQSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFD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
