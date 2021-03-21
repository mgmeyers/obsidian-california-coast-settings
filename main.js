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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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
    EmbeddedHeadingsExtension.prototype.removeHeading = function (id) {
        if (!this.headings[id])
            return;
        var h1Edit = document.getElementById(id + "-edit");
        var h1Preview = document.getElementById(id + "-preview");
        if (h1Edit)
            h1Edit.remove();
        if (h1Preview)
            h1Preview.remove();
        this.headings[id].resizeWatcher.disconnect();
        delete this.headings[id].resizeWatcher;
        delete this.headings[id];
    };
    EmbeddedHeadingsExtension.prototype.createHeading = function (id, leaf) {
        if (this.headings[id])
            return;
        var header = leaf.view.containerEl.getElementsByClassName("view-header-title");
        var viewContent = leaf.view.containerEl.getElementsByClassName("CodeMirror-scroll");
        var lines = leaf.view.containerEl.getElementsByClassName("CodeMirror-lines");
        var previewContent = leaf.view.containerEl.getElementsByClassName("markdown-preview-view");
        if (header.length && viewContent.length && previewContent.length) {
            var editEl = viewContent[0];
            var h1Edit_1 = document.createElement("h1");
            h1Edit_1.setText(header[0].innerText);
            h1Edit_1.id = id + "-edit";
            editEl.prepend(h1Edit_1);
            var debounceTimer_1 = 0;
            var resizeWatcher = new window.ResizeObserver(function (entries) {
                clearTimeout(debounceTimer_1);
                debounceTimer_1 = window.setTimeout(function () {
                    if (lines.length) {
                        var linesEl = lines[0];
                        var height = Math.ceil(entries[0].borderBoxSize[0].blockSize);
                        linesEl.style.paddingTop = height + "px";
                        h1Edit_1.style.marginBottom = "-" + height + "px";
                    }
                }, 20);
            });
            resizeWatcher.observe(h1Edit_1);
            var previewEl = previewContent[0];
            var h1Preview = document.createElement("h1");
            h1Preview.setText(header[0].innerText);
            h1Preview.id = id + "-preview";
            previewEl.prepend(h1Preview);
            this.headings[id] = { leaf: leaf, resizeWatcher: resizeWatcher };
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
                _this.removeHeading(id);
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
            _this.removeHeading(id);
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
    blocks: [
        "M12 18L16 13 13 13 13 2 11 2 11 13 8 13z",
        "M19,9h-4v2h4v9H5v-9h4V9H5c-1.103,0-2,0.897-2,2v9c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2v-9C21,9.897,20.103,9,19,9 z",
    ],
    "broken-link": "M16.949 14.121L19.071 12c1.948-1.949 1.948-5.122 0-7.071-1.95-1.95-5.123-1.948-7.071 0l-.707.707 1.414 1.414.707-.707c1.169-1.167 3.072-1.169 4.243 0 1.169 1.17 1.169 3.073 0 4.243l-2.122 2.121c-.247.247-.534.435-.844.57L13.414 12l1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465-.235 0-.464.032-.691.066L3.707 2.293 2.293 3.707l18 18 1.414-1.414-5.536-5.536C16.448 14.573 16.709 14.361 16.949 14.121zM10.586 17.657c-1.169 1.167-3.072 1.169-4.243 0-1.169-1.17-1.169-3.073 0-4.243l1.476-1.475-1.414-1.414L4.929 12c-1.948 1.949-1.948 5.122 0 7.071.975.975 2.255 1.462 3.535 1.462 1.281 0 2.562-.487 3.536-1.462l.707-.707-1.414-1.414L10.586 17.657z",
    "bullet-list": "M4 6H6V8H4zM4 11H6V13H4zM4 16H6V18H4zM20 8L20 6 18.8 6 9.2 6 8.023 6 8.023 8 9.2 8 18.8 8zM8 11H20V13H8zM8 16H20V18H8z",
    "calendar-with-checkmark": [
        "M19,4h-2V2h-2v2H9V2H7v2H5C3.897,4,3,4.897,3,6v2v12c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2V8V6 C21,4.897,20.103,4,19,4z M19.002,20H5V8h14L19.002,20z",
        "M11 17.414L16.707 11.707 15.293 10.293 11 14.586 8.707 12.293 7.293 13.707z",
    ],
    "check-in-circle": "M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z",
    "check-small": "M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z",
    checkmark: "M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z",
    "create-new": [
        "M13 7L11 7 11 11 7 11 7 13 11 13 11 17 13 17 13 13 17 13 17 11 13 11z",
        "M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10c5.514,0,10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8 s3.589-8,8-8s8,3.589,8,8S16.411,20,12,20z",
    ],
    "cross-in-box": "M9.172 16.242L12 13.414 14.828 16.242 16.242 14.828 13.414 12 16.242 9.172 14.828 7.758 12 10.586 9.172 7.758 7.758 9.172 10.586 12 7.758 14.828z",
    cross: "M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z",
    "crossed-star": "M5.025,20.775c-0.092,0.399,0.068,0.814,0.406,1.047C5.603,21.94,5.801,22,6,22c0.193,0,0.387-0.056,0.555-0.168L12,18.202 l5.445,3.63c0.348,0.232,0.804,0.223,1.145-0.024c0.338-0.247,0.487-0.68,0.372-1.082l-1.829-6.4l4.536-4.082 c0.297-0.267,0.406-0.686,0.278-1.064c-0.129-0.378-0.47-0.645-0.868-0.676L15.378,8.05l-2.467-5.461C12.75,2.23,12.393,2,12,2 s-0.75,0.23-0.911,0.588L8.622,8.05L2.921,8.503C2.529,8.534,2.192,8.791,2.06,9.16c-0.134,0.369-0.038,0.782,0.242,1.056 l4.214,4.107L5.025,20.775z M12,5.429l2.042,4.521l0.588,0.047c0.001,0,0.001,0,0.001,0l3.972,0.315l-3.271,2.944 c-0.001,0.001-0.001,0.001-0.001,0.002l-0.463,0.416l0.171,0.597c0,0,0,0.002,0,0.003l1.253,4.385L12,15.798V5.429z",
    dice: "M19,3H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2V5C21,3.897,20.103,3,19,3z M5,19V5h14 l0.002,14H5z",
    document: "M19.937,8.68c-0.011-0.032-0.02-0.063-0.033-0.094c-0.049-0.106-0.11-0.207-0.196-0.293l-6-6 c-0.086-0.086-0.187-0.147-0.293-0.196c-0.03-0.014-0.062-0.022-0.094-0.033c-0.084-0.028-0.17-0.046-0.259-0.051 C13.04,2.011,13.021,2,13,2H6C4.897,2,4,2.897,4,4v16c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2V9 c0-0.021-0.011-0.04-0.013-0.062C19.982,8.85,19.965,8.764,19.937,8.68z M16.586,8H14V5.414L16.586,8z M6,20V4h6v5 c0,0.553,0.447,1,1,1h5l0.002,10H6z",
    documents: [
        "M20,2H10C8.897,2,8,2.897,8,4v4H4c-1.103,0-2,0.897-2,2v10c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2v-4h4 c1.103,0,2-0.897,2-2V4C22,2.897,21.103,2,20,2z M4,20V10h10l0.002,10H4z M20,14h-4v-4c0-1.103-0.897-2-2-2h-4V4h10V14z",
        "M6 12H12V14H6zM6 16H12V18H6z",
    ],
    "dot-network": "M19.5,3C18.121,3,17,4.121,17,5.5c0,0.357,0.078,0.696,0.214,1.005l-1.955,2.199C14.615,8.262,13.839,8,13,8 c-0.74,0-1.424,0.216-2.019,0.566L8.707,6.293L8.684,6.316C8.88,5.918,9,5.475,9,5c0-1.657-1.343-3-3-3S3,3.343,3,5s1.343,3,3,3 c0.475,0,0.917-0.12,1.316-0.316L7.293,7.707L9.567,9.98C9.215,10.576,9,11.261,9,12c0,0.997,0.38,1.899,0.985,2.601l-2.577,2.576 C7.126,17.066,6.821,17,6.5,17C5.122,17,4,18.121,4,19.5S5.122,22,6.5,22S9,20.879,9,19.5c0-0.321-0.066-0.626-0.177-0.909 l2.838-2.838C12.082,15.903,12.528,16,13,16c2.206,0,4-1.794,4-4c0-0.636-0.163-1.229-0.428-1.764l2.117-2.383 C18.945,7.941,19.215,8,19.5,8C20.879,8,22,6.879,22,5.5S20.879,3,19.5,3z M13,14c-1.103,0-2-0.897-2-2s0.897-2,2-2 c1.103,0,2,0.897,2,2S14.103,14,13,14z",
    enter: "",
    "expand-vertically": "M7 17L12 22 17 17 13 17 13 7 17 7 12 2 7 7 11 7 11 17z",
    "filled-pin": "M15,11.586V6h2V4c0-1.104-0.896-2-2-2H9C7.896,2,7,2.896,7,4v2h2v5.586l-2.707,1.707C6.105,13.48,6,13.734,6,14v2 c0,0.553,0.448,1,1,1h2h2v3l1,2l1-2v-3h4c0.553,0,1-0.447,1-1v-2c0-0.266-0.105-0.52-0.293-0.707L15,11.586z",
    folder: "M20,5h-8.586L9.707,3.293C9.52,3.105,9.265,3,9,3H4C2.897,3,2,3.897,2,5v14c0,1.103,0.897,2,2,2h16c1.103,0,2-0.897,2-2V7 C22,5.897,21.103,5,20,5z M4,19V7h7h1h8l0.002,12H4z",
    "forward-arrow": "M10.707 17.707L16.414 12 10.707 6.293 9.293 7.707 13.586 12 9.293 16.293z",
    gear: [
        "M12,16c2.206,0,4-1.794,4-4s-1.794-4-4-4s-4,1.794-4,4S9.794,16,12,16z M12,10c1.084,0,2,0.916,2,2s-0.916,2-2,2 s-2-0.916-2-2S10.916,10,12,10z",
        "M2.845,16.136l1,1.73c0.531,0.917,1.809,1.261,2.73,0.73l0.529-0.306C7.686,18.747,8.325,19.122,9,19.402V20 c0,1.103,0.897,2,2,2h2c1.103,0,2-0.897,2-2v-0.598c0.675-0.28,1.314-0.655,1.896-1.111l0.529,0.306 c0.923,0.53,2.198,0.188,2.731-0.731l0.999-1.729c0.552-0.955,0.224-2.181-0.731-2.732l-0.505-0.292C19.973,12.742,20,12.371,20,12 s-0.027-0.743-0.081-1.111l0.505-0.292c0.955-0.552,1.283-1.777,0.731-2.732l-0.999-1.729c-0.531-0.92-1.808-1.265-2.731-0.732 l-0.529,0.306C16.314,5.253,15.675,4.878,15,4.598V4c0-1.103-0.897-2-2-2h-2C9.897,2,9,2.897,9,4v0.598 c-0.675,0.28-1.314,0.655-1.896,1.111L6.575,5.403c-0.924-0.531-2.2-0.187-2.731,0.732L2.845,7.864 c-0.552,0.955-0.224,2.181,0.731,2.732l0.505,0.292C4.027,11.257,4,11.629,4,12s0.027,0.742,0.081,1.111l-0.505,0.292 C2.621,13.955,2.293,15.181,2.845,16.136z M6.171,13.378C6.058,12.925,6,12.461,6,12c0-0.462,0.058-0.926,0.17-1.378 c0.108-0.433-0.083-0.885-0.47-1.108L4.577,8.864l0.998-1.729L6.72,7.797c0.384,0.221,0.867,0.165,1.188-0.142 c0.683-0.647,1.507-1.131,2.384-1.399C10.713,6.128,11,5.739,11,5.3V4h2v1.3c0,0.439,0.287,0.828,0.708,0.956 c0.877,0.269,1.701,0.752,2.384,1.399c0.321,0.307,0.806,0.362,1.188,0.142l1.144-0.661l1,1.729L18.3,9.514 c-0.387,0.224-0.578,0.676-0.47,1.108C17.942,11.074,18,11.538,18,12c0,0.461-0.058,0.925-0.171,1.378 c-0.107,0.433,0.084,0.885,0.471,1.108l1.123,0.649l-0.998,1.729l-1.145-0.661c-0.383-0.221-0.867-0.166-1.188,0.142 c-0.683,0.647-1.507,1.131-2.384,1.399C13.287,17.872,13,18.261,13,18.7l0.002,1.3H11v-1.3c0-0.439-0.287-0.828-0.708-0.956 c-0.877-0.269-1.701-0.752-2.384-1.399c-0.19-0.182-0.438-0.275-0.688-0.275c-0.172,0-0.344,0.044-0.5,0.134l-1.144,0.662l-1-1.729 L5.7,14.486C6.087,14.263,6.278,13.811,6.171,13.378z",
    ],
    "go-to-file": "M13.707,2.293C13.52,2.105,13.266,2,13,2H6C4.897,2,4,2.897,4,4v16c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2V9 c0-0.266-0.105-0.52-0.293-0.707L13.707,2.293z M6,4h6.586L18,9.414l0.002,9.174l-2.568-2.568C15.784,15.425,16,14.739,16,14 c0-2.206-1.794-4-4-4s-4,1.794-4,4s1.794,4,4,4c0.739,0,1.425-0.216,2.02-0.566L16.586,20H6V4z M12,16c-1.103,0-2-0.897-2-2 s0.897-2,2-2s2,0.897,2,2S13.103,16,12,16z",
    hashtag: "M16.018,3.815L15.232,8h-4.966l0.716-3.815L9.018,3.815L8.232,8H4v2h3.857l-0.751,4H3v2h3.731l-0.714,3.805l1.965,0.369 L8.766,16h4.966l-0.714,3.805l1.965,0.369L15.766,16H20v-2h-3.859l0.751-4H21V8h-3.733l0.716-3.815L16.018,3.815z M14.106,14H9.141 l0.751-4h4.966L14.106,14z",
    help: [
        "M12 6C9.831 6 8.066 7.765 8.066 9.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626-.255.207-.496.404-.691.599C11.029 13.156 11 14.215 11 14.333V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182C15.934 7.765 14.169 6 12 6zM11 16H13V18H11z",
        "M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z",
    ],
    "horizontal-split": "M17 11L7 11 7 7 2 12 7 17 7 13 17 13 17 17 22 12 17 7z",
    "image-file": [
        "M20,2H8C6.897,2,6,2.897,6,4v12c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2V4C22,2.897,21.103,2,20,2z M8,16V4h12 l0.002,12H8z",
        "M4,8H2v12c0,1.103,0.897,2,2,2h12v-2H4V8z",
        "M12 12L11 11 9 14 19 14 15 8z",
    ],
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
    "popup-open": [
        "M20,3H4C2.897,3,2,3.897,2,5v14c0,1.103,0.897,2,2,2h5v-2H4V7h16v12h-5v2h5c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z",
        "M13 21L13 16 16 16 12 11 8 16 11 16 11 21z",
    ],
    presentation: "",
    reset: [
        "M12,16c1.671,0,3-1.331,3-3s-1.329-3-3-3s-3,1.331-3,3S10.329,16,12,16z",
        "M20.817,11.186c-0.12-0.583-0.297-1.151-0.525-1.688c-0.225-0.532-0.504-1.046-0.83-1.531 c-0.324-0.479-0.693-0.926-1.098-1.329c-0.404-0.406-0.853-0.776-1.332-1.101c-0.483-0.326-0.998-0.604-1.528-0.829 c-0.538-0.229-1.106-0.405-1.691-0.526c-0.6-0.123-1.219-0.182-1.838-0.18V2L8,5l3.975,3V6.002C12.459,6,12.943,6.046,13.41,6.142 c0.454,0.094,0.896,0.231,1.314,0.409c0.413,0.174,0.813,0.392,1.188,0.644c0.373,0.252,0.722,0.54,1.038,0.857 c0.315,0.314,0.604,0.663,0.854,1.035c0.254,0.376,0.471,0.776,0.646,1.191c0.178,0.417,0.314,0.859,0.408,1.311 C18.952,12.048,19,12.523,19,13s-0.048,0.952-0.142,1.41c-0.094,0.454-0.23,0.896-0.408,1.315 c-0.175,0.413-0.392,0.813-0.644,1.188c-0.253,0.373-0.542,0.722-0.858,1.039c-0.315,0.316-0.663,0.603-1.036,0.854 c-0.372,0.251-0.771,0.468-1.189,0.645c-0.417,0.177-0.858,0.314-1.311,0.408c-0.92,0.188-1.906,0.188-2.822,0 c-0.454-0.094-0.896-0.231-1.314-0.409c-0.416-0.176-0.815-0.393-1.189-0.645c-0.371-0.25-0.719-0.538-1.035-0.854 c-0.315-0.316-0.604-0.665-0.855-1.036c-0.254-0.376-0.471-0.776-0.646-1.19c-0.178-0.418-0.314-0.86-0.408-1.312 C5.048,13.952,5,13.477,5,13H3c0,0.611,0.062,1.221,0.183,1.814c0.12,0.582,0.297,1.15,0.525,1.689 c0.225,0.532,0.504,1.046,0.831,1.531c0.323,0.477,0.692,0.924,1.097,1.329c0.406,0.407,0.854,0.777,1.331,1.099 c0.479,0.325,0.994,0.604,1.529,0.83c0.538,0.229,1.106,0.405,1.691,0.526C10.779,21.938,11.389,22,12,22s1.221-0.062,1.814-0.183 c0.583-0.121,1.151-0.297,1.688-0.525c0.537-0.227,1.052-0.506,1.53-0.83c0.478-0.322,0.926-0.692,1.331-1.099 c0.405-0.405,0.774-0.853,1.1-1.332c0.325-0.483,0.604-0.998,0.829-1.528c0.229-0.54,0.405-1.108,0.525-1.692 C20.938,14.221,21,13.611,21,13S20.938,11.779,20.817,11.186z",
    ],
    "right-arrow-with-tail": "M10.707 17.707L16.414 12 10.707 6.293 9.293 7.707 13.586 12 9.293 16.293z",
    "right-arrow": "M10.707 17.707L16.414 12 10.707 6.293 9.293 7.707 13.586 12 9.293 16.293z",
    "right-triangle": "M10.707 17.707L16.414 12 10.707 6.293 9.293 7.707 13.586 12 9.293 16.293z",
    search: "M19.023,16.977c-0.513-0.488-1.004-0.997-1.367-1.384c-0.372-0.378-0.596-0.653-0.596-0.653l-2.8-1.337 C15.34,12.37,16,10.763,16,9c0-3.859-3.14-7-7-7S2,5.141,2,9s3.14,7,7,7c1.763,0,3.37-0.66,4.603-1.739l1.337,2.8 c0,0,0.275,0.224,0.653,0.596c0.387,0.363,0.896,0.854,1.384,1.367c0.494,0.506,0.988,1.012,1.358,1.392 c0.362,0.388,0.604,0.646,0.604,0.646l2.121-2.121c0,0-0.258-0.242-0.646-0.604C20.035,17.965,19.529,17.471,19.023,16.977z M9,14 c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S11.757,14,9,14z",
    "sheets-in-box": "",
    "star-list": "M19 15L19 12 17 12 17 15 14.78 15 14 15 14 17 14.78 17 17 17 17 20 19 20 19 17 21.063 17 22 17 22 15 21.063 15zM4 7H15V9H4zM4 11H15V13H4zM4 15H12V17H4z",
    star: "M6.516,14.323l-1.49,6.452c-0.092,0.399,0.068,0.814,0.406,1.047C5.603,21.94,5.801,22,6,22 c0.193,0,0.387-0.056,0.555-0.168L12,18.202l5.445,3.63c0.348,0.232,0.805,0.223,1.145-0.024c0.338-0.247,0.487-0.68,0.372-1.082 l-1.829-6.4l4.536-4.082c0.297-0.268,0.406-0.686,0.278-1.064c-0.129-0.378-0.47-0.644-0.868-0.676L15.378,8.05l-2.467-5.461 C12.75,2.23,12.393,2,12,2s-0.75,0.23-0.911,0.589L8.622,8.05L2.921,8.503C2.529,8.534,2.192,8.791,2.06,9.16 c-0.134,0.369-0.038,0.782,0.242,1.056L6.516,14.323z M9.369,9.997c0.363-0.029,0.683-0.253,0.832-0.586L12,5.43l1.799,3.981 c0.149,0.333,0.469,0.557,0.832,0.586l3.972,0.315l-3.271,2.944c-0.284,0.256-0.397,0.65-0.293,1.018l1.253,4.385l-3.736-2.491 c-0.336-0.225-0.773-0.225-1.109,0l-3.904,2.603l1.05-4.546c0.078-0.34-0.026-0.697-0.276-0.94l-3.038-2.962L9.369,9.997z",
    switch: "M19 7c0-.553-.447-1-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17c0 .553.447 1 1 1h8v-2H7v-5h3L6 6l-4 5h3V17z",
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

function stringOrDefault(str, def) {
    return str || def;
}
function numberOrDefault(num, def) {
    return typeof num === 'number' ? num : def;
}
function populatedArrayOrDefault(arr, def) {
    return Array.isArray(arr) && arr.length > 0 ? arr : def;
}

initIcons();
var ThemeSettings = /** @class */ (function () {
    function ThemeSettings() {
        this.prettyEditor = true;
        this.prettyPreview = true;
        this.embeddedHeadings = false;
        this.useSystemTheme = false;
        this.fancyCursor = false;
        this.accentHue = 211;
        this.accentSat = 100;
        this.lineWidth = 42;
        this.textNormal = 18;
        this.fontFeatures = '""';
        this.textFont = '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';
        this.editorFont = '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';
        this.editorLineHeight = 1.88889;
        this.monoFont = "Menlo,SFMono-Regular,Consolas,Roboto Mono,monospace";
        this.headingConfig = [
            {
                size: "1.602rem",
                lineHeight: 1.4,
                marginTop: 4,
                marginBottom: 1,
                weight: 500,
                style: "normal",
            },
            {
                size: "1.424rem",
                lineHeight: 1.4,
                marginTop: 2.5,
                marginBottom: 0.5,
                weight: 500,
                style: "normal",
            },
            {
                size: "1.266rem",
                lineHeight: 1.4,
                marginTop: 2,
                marginBottom: 0.5,
                weight: 500,
                style: "normal",
            },
            {
                size: "1.125rem",
                lineHeight: 1.5,
                marginTop: 1.5,
                marginBottom: 0.5,
                weight: 500,
                style: "normal",
            },
            {
                size: "1rem",
                lineHeight: 1.5,
                marginTop: 1.5,
                marginBottom: 0.5,
                weight: 500,
                style: "normal",
            },
            {
                size: "1rem",
                lineHeight: 1.5,
                marginTop: 1.5,
                marginBottom: 0.5,
                weight: 500,
                style: "italic",
            },
        ];
    }
    return ThemeSettings;
}());
var defaultSettings = new ThemeSettings();
var observerConfig = {
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
                    setTimeout(function () {
                        _this.embeddedHeadings.createHeadings(_this.app);
                    }, 0);
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
        this.updateStyle();
    };
    // add the styling elements we need
    CaliforniaCoastTheme.prototype.addStyle = function () {
        var css = document.createElement("style");
        css.id = "california-coast-theme";
        document.getElementsByTagName("head")[0].appendChild(css);
        // add the main class
        document.body.classList.add("california-coast-theme");
        // update the style with the settings-dependent styles
        this.updateStyle();
    };
    CaliforniaCoastTheme.prototype.removeStyle = function () {
        document.body.removeClass("cc-pretty-editor", "cc-pretty-preview", "fancy-cursor");
    };
    // update the styles (at the start, or as the result of a settings change)
    CaliforniaCoastTheme.prototype.updateStyle = function () {
        this.removeStyle();
        document.body.classList.toggle("cc-pretty-editor", this.settings.prettyEditor);
        document.body.classList.toggle("cc-pretty-preview", this.settings.prettyPreview);
        document.body.classList.toggle("fancy-cursor", this.settings.fancyCursor);
        // get the custom css element
        var el = document.getElementById("california-coast-theme");
        if (!el) {
            throw "california-coast-theme element not found!";
        }
        else {
            var headingConfig = populatedArrayOrDefault(this.settings.headingConfig, defaultSettings.headingConfig);
            // set the settings-dependent css
            el.innerText = ("\n        body.california-coast-theme {\n          --editor-font-size: " + numberOrDefault(this.settings.textNormal, defaultSettings.textNormal) + "px;\n          --editor-font-features: " + stringOrDefault(this.settings.fontFeatures, defaultSettings.fontFeatures) + ";\n          --editor-line-height: " + numberOrDefault(this.settings.editorLineHeight, defaultSettings.editorLineHeight) + ";\n          --editor-line-height-rem: " + numberOrDefault(this.settings.editorLineHeight, defaultSettings.editorLineHeight) + "rem;\n          --line-width: " + numberOrDefault(this.settings.lineWidth, defaultSettings.lineWidth) + "rem;\n          --font-monospace: " + stringOrDefault(this.settings.monoFont, defaultSettings.monoFont) + ";\n          --text: " + stringOrDefault(this.settings.textFont, defaultSettings.textFont) + ";\n          --text-editor: " + stringOrDefault(this.settings.editorFont, defaultSettings.editorFont) + ";\n          --accent-h: " + numberOrDefault(this.settings.accentHue, defaultSettings.accentHue) + ";\n          --accent-s: " + numberOrDefault(this.settings.accentSat, defaultSettings.accentSat) + "%;\n\n          " + headingConfig
                .map(function (c, i) { return "\n              --h" + (i + 1) + "-size: " + c.size + ";\n              --h" + (i + 1) + "-line-height: " + c.lineHeight + ";\n              --h" + (i + 1) + "-margin-top: " + c.marginTop + ";\n              --h" + (i + 1) + "-margin-bottom: " + c.marginBottom + "; \n              --h" + (i + 1) + "-weight: " + c.weight + "; \n              --h" + (i + 1) + "-style: " + c.style + "; \n            "; })
                .join(" ") + "\n        }\n      ")
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
            this.observers[id].observe(previewSection[0], observerConfig);
            setTimeout(function () {
                previewSection[0].childNodes.forEach(tagNode);
            }, 0);
        }
    };
    return CaliforniaCoastTheme;
}(obsidian.Plugin));
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
        containerEl.createEl("br");
        containerEl.createEl("a", { text: "⬤ Accent Color" });
        containerEl.createEl("h3");
        new obsidian.Setting(containerEl)
            .setName("Reset accent color")
            .setDesc("Set accent color back to theme default")
            .addButton(function (button) {
            return button.setButtonText("Reset").onClick(function () {
                _this.plugin.settings.accentHue = defaultSettings.accentHue;
                _this.plugin.settings.accentSat = defaultSettings.accentSat;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Accent color hue")
            .setDesc("For links and interactive elements")
            .addSlider(function (slider) {
            return slider
                .setLimits(0, 360, 1)
                .setValue(typeof _this.plugin.settings.accentHue === "number"
                ? _this.plugin.settings.accentHue
                : defaultSettings.accentHue)
                .onChange(function (value) {
                _this.plugin.settings.accentHue = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Accent color saturation")
            .setDesc("For links and interactive elements")
            .addSlider(function (slider) {
            return slider
                .setLimits(0, 100, 1)
                .setValue(typeof _this.plugin.settings.accentSat === "number"
                ? _this.plugin.settings.accentSat
                : defaultSettings.accentSat)
                .onChange(function (value) {
                _this.plugin.settings.accentSat = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Accented cursor")
            .setDesc("The editor cursor takes on your accent color")
            .addToggle(function (toggle) {
            return toggle.setValue(_this.plugin.settings.fancyCursor).onChange(function (value) {
                _this.plugin.settings.fancyCursor = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
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
        containerEl.createEl("br");
        containerEl.createEl("h3", { text: "Custom fonts" });
        new obsidian.Setting(containerEl)
            .setName("UI font")
            .setDesc("Used for the user interface")
            .addText(function (text) {
            return text
                .setPlaceholder("")
                .setValue((_this.plugin.settings.textFont || defaultSettings.textFont) + "")
                .onChange(function (value) {
                _this.plugin.settings.textFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Body font")
            .setDesc("Used for the editor and preview")
            .addText(function (text) {
            return text
                .setPlaceholder("")
                .setValue((_this.plugin.settings.editorFont || defaultSettings.editorFont) + "")
                .onChange(function (value) {
                _this.plugin.settings.editorFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Body font features")
            .setDesc('eg. "ss01", "cv05", "cv07", "case"')
            .addText(function (text) {
            return text
                .setPlaceholder('""')
                .setValue((_this.plugin.settings.fontFeatures ||
                defaultSettings.fontFeatures) + "")
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
                .setValue((_this.plugin.settings.monoFont || defaultSettings.monoFont) + "")
                .onChange(function (value) {
                _this.plugin.settings.monoFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        containerEl.createEl("br");
        containerEl.createEl("h3", { text: "Typography" });
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
            .setName("Enhanced Editor Typography")
            .setDesc("Adds WYSIWYG-like functionality to editor mode")
            .addToggle(function (toggle) {
            return toggle.setValue(_this.plugin.settings.prettyEditor).onChange(function (value) {
                _this.plugin.settings.prettyEditor = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Enhanced Preview Typography")
            .setDesc("Adds context aware padding between text elements in preview mode")
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
            .setName("Line width")
            .setDesc("The maximum number of characters per line (default 42)")
            .addText(function (text) {
            return text
                .setPlaceholder("42")
                .setValue((_this.plugin.settings.lineWidth || defaultSettings.lineWidth) + "")
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
                .setValue((_this.plugin.settings.textNormal || defaultSettings.textNormal) + "")
                .onChange(function (value) {
                _this.plugin.settings.textNormal = parseInt(value.trim());
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Body line height")
            .setDesc("Used for the main text (default 1.88889)")
            .addText(function (text) {
            return text
                .setPlaceholder("1.88889")
                .setValue((_this.plugin.settings.editorLineHeight ||
                defaultSettings.editorLineHeight) + "")
                .onChange(function (value) {
                _this.plugin.settings.editorLineHeight = parseFloat(value.trim());
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        if (!this.plugin.settings.headingConfig ||
            this.plugin.settings.headingConfig.length === 0) {
            this.plugin.settings.headingConfig = defaultSettings.headingConfig.map(function (c) { return (__assign({}, c)); });
        }
        this.plugin.settings.headingConfig.forEach(function (c, i) {
            var index = i;
            containerEl.createEl("h4", { text: "Level " + (i + 1) + " Headings" });
            new obsidian.Setting(containerEl)
                .setName("H" + (index + 1) + " font size")
                .setDesc("Accepts any CSS font-size value (default " + defaultSettings.headingConfig[index].size + ")")
                .addText(function (text) {
                return text
                    .setPlaceholder(defaultSettings.headingConfig[index].size)
                    .setValue(c.size)
                    .onChange(function (value) {
                    _this.plugin.settings.headingConfig[index].size = value;
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                });
            });
            new obsidian.Setting(containerEl)
                .setName("H" + (index + 1) + " line height")
                .setDesc("Accepts decimal values (default " + defaultSettings.headingConfig[index].lineHeight + ")")
                .addText(function (text) {
                return text
                    .setPlaceholder(defaultSettings.headingConfig[index].lineHeight + "")
                    .setValue(c.lineHeight + "")
                    .onChange(function (value) {
                    _this.plugin.settings.headingConfig[index].lineHeight = parseFloat(value);
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                });
            });
            new obsidian.Setting(containerEl)
                .setName("H" + (index + 1) + " top margin")
                .setDesc("Accepts decimal values representing the number of lines to add before the heading (default " + defaultSettings.headingConfig[index].marginTop + ")")
                .addText(function (text) {
                return text
                    .setPlaceholder(defaultSettings.headingConfig[index].marginTop + "")
                    .setValue(c.marginTop + "")
                    .onChange(function (value) {
                    _this.plugin.settings.headingConfig[index].marginTop = parseFloat(value);
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                });
            });
            new obsidian.Setting(containerEl)
                .setName("H" + (index + 1) + " bottom margin")
                .setDesc("Accepts decimal values representing the number of lines to add below the heading (default " + defaultSettings.headingConfig[index].marginBottom + ")")
                .addText(function (text) {
                return text
                    .setPlaceholder(defaultSettings.headingConfig[index].marginBottom + "")
                    .setValue(c.marginBottom + "")
                    .onChange(function (value) {
                    _this.plugin.settings.headingConfig[index].marginBottom = parseFloat(value);
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                });
            });
            new obsidian.Setting(containerEl)
                .setName("H" + (index + 1) + " font weight")
                .setDesc("Accepts numbers represeting the CSS font-weight (default " + defaultSettings.headingConfig[index].weight + ")")
                .addText(function (text) {
                return text
                    .setPlaceholder(defaultSettings.headingConfig[index].weight + "")
                    .setValue(c.weight + "")
                    .onChange(function (value) {
                    _this.plugin.settings.headingConfig[index].weight = parseFloat(value);
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                });
            });
            new obsidian.Setting(containerEl)
                .setName("H" + (index + 1) + " font style")
                .setDesc("Accepts any CSS font-style value (default " + defaultSettings.headingConfig[index].style + ")")
                .addText(function (text) {
                return text
                    .setPlaceholder(defaultSettings.headingConfig[index].style)
                    .setValue(c.style)
                    .onChange(function (value) {
                    _this.plugin.settings.headingConfig[index].style = value;
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                });
            });
        });
    };
    return ThemeSettingTab;
}(obsidian.PluginSettingTab));

module.exports = CaliforniaCoastTheme;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsImV4dGVuc2lvbnMvZW1iZWRkZWRIZWFkaW5ncy50cyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2xpYi9wYXRoX3BhcnNlLmpzIiwibm9kZV9tb2R1bGVzL3N2Z3BhdGgvbGliL21hdHJpeC5qcyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2xpYi90cmFuc2Zvcm1fcGFyc2UuanMiLCJub2RlX21vZHVsZXMvc3ZncGF0aC9saWIvYTJjLmpzIiwibm9kZV9tb2R1bGVzL3N2Z3BhdGgvbGliL2VsbGlwc2UuanMiLCJub2RlX21vZHVsZXMvc3ZncGF0aC9saWIvc3ZncGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2luZGV4LmpzIiwiZXh0ZW5zaW9ucy9ib3hpY29ucy50cyIsImhlbHBlcnMudHMiLCJtYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7IEFwcCwgV29ya3NwYWNlTGVhZiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbWJlZGRlZEhlYWRpbmdzRXh0ZW5zaW9uIHtcbiAgaGVhZGluZ3M6IHsgW2lkOiBzdHJpbmddOiB7XG4gICAgbGVhZjogV29ya3NwYWNlTGVhZixcbiAgICByZXNpemVXYXRjaGVyOiBhbnl9IH0gPSB7fTtcblxuICByZW1vdmVIZWFkaW5nKGlkOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuaGVhZGluZ3NbaWRdKSByZXR1cm47XG5cbiAgICBjb25zdCBoMUVkaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHtpZH0tZWRpdGApO1xuICAgIGNvbnN0IGgxUHJldmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2lkfS1wcmV2aWV3YCk7XG5cbiAgICBpZiAoaDFFZGl0KSBoMUVkaXQucmVtb3ZlKCk7XG4gICAgaWYgKGgxUHJldmlldykgaDFQcmV2aWV3LnJlbW92ZSgpO1xuXG4gICAgdGhpcy5oZWFkaW5nc1tpZF0ucmVzaXplV2F0Y2hlci5kaXNjb25uZWN0KClcblxuICAgIGRlbGV0ZSB0aGlzLmhlYWRpbmdzW2lkXS5yZXNpemVXYXRjaGVyO1xuICAgIGRlbGV0ZSB0aGlzLmhlYWRpbmdzW2lkXTtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRpbmcoaWQ6IHN0cmluZywgbGVhZjogV29ya3NwYWNlTGVhZikge1xuICAgIGlmICh0aGlzLmhlYWRpbmdzW2lkXSkgcmV0dXJuO1xuXG4gICAgY29uc3QgaGVhZGVyID0gbGVhZi52aWV3LmNvbnRhaW5lckVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXG4gICAgICBcInZpZXctaGVhZGVyLXRpdGxlXCJcbiAgICApO1xuXG4gICAgY29uc3Qgdmlld0NvbnRlbnQgPSBsZWFmLnZpZXcuY29udGFpbmVyRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcbiAgICAgIFwiQ29kZU1pcnJvci1zY3JvbGxcIlxuICAgICk7XG5cbiAgICBjb25zdCBsaW5lcyA9IGxlYWYudmlldy5jb250YWluZXJFbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgXCJDb2RlTWlycm9yLWxpbmVzXCJcbiAgICApO1xuXG4gICAgY29uc3QgcHJldmlld0NvbnRlbnQgPSBsZWFmLnZpZXcuY29udGFpbmVyRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcbiAgICAgIFwibWFya2Rvd24tcHJldmlldy12aWV3XCJcbiAgICApO1xuXG4gICAgaWYgKGhlYWRlci5sZW5ndGggJiYgdmlld0NvbnRlbnQubGVuZ3RoICYmIHByZXZpZXdDb250ZW50Lmxlbmd0aCkge1xuICAgICAgY29uc3QgZWRpdEVsID0gdmlld0NvbnRlbnRbMF0gYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICBjb25zdCBoMUVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG5cbiAgICAgIGgxRWRpdC5zZXRUZXh0KChoZWFkZXJbMF0gYXMgSFRNTERpdkVsZW1lbnQpLmlubmVyVGV4dCk7XG4gICAgICBoMUVkaXQuaWQgPSBgJHtpZH0tZWRpdGA7XG4gICAgICBlZGl0RWwucHJlcGVuZChoMUVkaXQpO1xuXG4gICAgICBsZXQgZGVib3VuY2VUaW1lciA9IDA7XG5cbiAgICAgIGNvbnN0IHJlc2l6ZVdhdGNoZXIgPSBuZXcgKHdpbmRvdyBhcyBhbnkpLlJlc2l6ZU9ic2VydmVyKChlbnRyaWVzOiBhbnkpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGRlYm91bmNlVGltZXIpXG5cbiAgICAgICAgZGVib3VuY2VUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAobGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lc0VsID0gbGluZXNbMF0gYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmNlaWwoZW50cmllc1swXS5ib3JkZXJCb3hTaXplWzBdLmJsb2NrU2l6ZSk7XG4gICAgXG4gICAgICAgICAgICBsaW5lc0VsLnN0eWxlLnBhZGRpbmdUb3AgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICAgICAgaDFFZGl0LnN0eWxlLm1hcmdpbkJvdHRvbSA9IGAtJHtoZWlnaHR9cHhgO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMjApXG4gICAgICB9KVxuXG4gICAgICByZXNpemVXYXRjaGVyLm9ic2VydmUoaDFFZGl0KVxuXG4gICAgICBjb25zdCBwcmV2aWV3RWwgPSBwcmV2aWV3Q29udGVudFswXSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgIGNvbnN0IGgxUHJldmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblxuICAgICAgaDFQcmV2aWV3LnNldFRleHQoKGhlYWRlclswXSBhcyBIVE1MRGl2RWxlbWVudCkuaW5uZXJUZXh0KTtcbiAgICAgIGgxUHJldmlldy5pZCA9IGAke2lkfS1wcmV2aWV3YDtcbiAgICAgIHByZXZpZXdFbC5wcmVwZW5kKGgxUHJldmlldyk7XG5cbiAgICAgIHRoaXMuaGVhZGluZ3NbaWRdID0geyBsZWFmLCByZXNpemVXYXRjaGVyIH07XG4gICAgfVxuICB9XG5cbiAgZ2V0TGVhZklkKGxlYWY6IFdvcmtzcGFjZUxlYWYpIHtcbiAgICBjb25zdCB2aWV3U3RhdGUgPSBsZWFmLmdldFZpZXdTdGF0ZSgpO1xuXG4gICAgaWYgKHZpZXdTdGF0ZS50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFwidGl0bGUtXCIgK1xuICAgICAgICAoKChsZWFmIGFzIGFueSkuaWQgYXMgc3RyaW5nKSArIHZpZXdTdGF0ZS5zdGF0ZS5maWxlKS5yZXBsYWNlKFxuICAgICAgICAgIC9eW15hLXpdK3xbXlxcdzouLV0rL2dpLFxuICAgICAgICAgIFwiXCJcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRpbmdzKGFwcDogQXBwKSB7XG4gICAgY29uc3Qgc2VlbjogeyBbazogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XG5cbiAgICBhcHAud29ya3NwYWNlLml0ZXJhdGVSb290TGVhdmVzKChsZWFmKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0TGVhZklkKGxlYWYpO1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVIZWFkaW5nKGlkLCBsZWFmKTtcbiAgICAgICAgc2VlbltpZF0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5oZWFkaW5ncykuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgIGlmICghc2VlbltpZF0pIHtcbiAgICAgICAgdGhpcy5yZW1vdmVIZWFkaW5nKGlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9ubG9hZCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJlbWJlZGRlZC1ub3RlLXRpdGxlXCIpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiZW1iZWRkZWQtbm90ZS10aXRsZVwiKTtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMuaGVhZGluZ3MpLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZUhlYWRpbmcoaWQpO1xuICAgIH0pO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIHBhcmFtQ291bnRzID0geyBhOiA3LCBjOiA2LCBoOiAxLCBsOiAyLCBtOiAyLCByOiA0LCBxOiA0LCBzOiA0LCB0OiAyLCB2OiAxLCB6OiAwIH07XG5cbnZhciBTUEVDSUFMX1NQQUNFUyA9IFtcbiAgMHgxNjgwLCAweDE4MEUsIDB4MjAwMCwgMHgyMDAxLCAweDIwMDIsIDB4MjAwMywgMHgyMDA0LCAweDIwMDUsIDB4MjAwNixcbiAgMHgyMDA3LCAweDIwMDgsIDB4MjAwOSwgMHgyMDBBLCAweDIwMkYsIDB4MjA1RiwgMHgzMDAwLCAweEZFRkZcbl07XG5cbmZ1bmN0aW9uIGlzU3BhY2UoY2gpIHtcbiAgcmV0dXJuIChjaCA9PT0gMHgwQSkgfHwgKGNoID09PSAweDBEKSB8fCAoY2ggPT09IDB4MjAyOCkgfHwgKGNoID09PSAweDIwMjkpIHx8IC8vIExpbmUgdGVybWluYXRvcnNcbiAgICAvLyBXaGl0ZSBzcGFjZXNcbiAgICAoY2ggPT09IDB4MjApIHx8IChjaCA9PT0gMHgwOSkgfHwgKGNoID09PSAweDBCKSB8fCAoY2ggPT09IDB4MEMpIHx8IChjaCA9PT0gMHhBMCkgfHxcbiAgICAoY2ggPj0gMHgxNjgwICYmIFNQRUNJQUxfU1BBQ0VTLmluZGV4T2YoY2gpID49IDApO1xufVxuXG5mdW5jdGlvbiBpc0NvbW1hbmQoY29kZSkge1xuICAvKmVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UqL1xuICBzd2l0Y2ggKGNvZGUgfCAweDIwKSB7XG4gICAgY2FzZSAweDZELyogbSAqLzpcbiAgICBjYXNlIDB4N0EvKiB6ICovOlxuICAgIGNhc2UgMHg2Qy8qIGwgKi86XG4gICAgY2FzZSAweDY4LyogaCAqLzpcbiAgICBjYXNlIDB4NzYvKiB2ICovOlxuICAgIGNhc2UgMHg2My8qIGMgKi86XG4gICAgY2FzZSAweDczLyogcyAqLzpcbiAgICBjYXNlIDB4NzEvKiBxICovOlxuICAgIGNhc2UgMHg3NC8qIHQgKi86XG4gICAgY2FzZSAweDYxLyogYSAqLzpcbiAgICBjYXNlIDB4NzIvKiByICovOlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0FyYyhjb2RlKSB7XG4gIHJldHVybiAoY29kZSB8IDB4MjApID09PSAweDYxO1xufVxuXG5mdW5jdGlvbiBpc0RpZ2l0KGNvZGUpIHtcbiAgcmV0dXJuIChjb2RlID49IDQ4ICYmIGNvZGUgPD0gNTcpOyAgIC8vIDAuLjlcbn1cblxuZnVuY3Rpb24gaXNEaWdpdFN0YXJ0KGNvZGUpIHtcbiAgcmV0dXJuIChjb2RlID49IDQ4ICYmIGNvZGUgPD0gNTcpIHx8IC8qIDAuLjkgKi9cbiAgICAgICAgICBjb2RlID09PSAweDJCIHx8IC8qICsgKi9cbiAgICAgICAgICBjb2RlID09PSAweDJEIHx8IC8qIC0gKi9cbiAgICAgICAgICBjb2RlID09PSAweDJFOyAgIC8qIC4gKi9cbn1cblxuXG5mdW5jdGlvbiBTdGF0ZShwYXRoKSB7XG4gIHRoaXMuaW5kZXggID0gMDtcbiAgdGhpcy5wYXRoICAgPSBwYXRoO1xuICB0aGlzLm1heCAgICA9IHBhdGgubGVuZ3RoO1xuICB0aGlzLnJlc3VsdCA9IFtdO1xuICB0aGlzLnBhcmFtICA9IDAuMDtcbiAgdGhpcy5lcnIgICAgPSAnJztcbiAgdGhpcy5zZWdtZW50U3RhcnQgPSAwO1xuICB0aGlzLmRhdGEgICA9IFtdO1xufVxuXG5mdW5jdGlvbiBza2lwU3BhY2VzKHN0YXRlKSB7XG4gIHdoaWxlIChzdGF0ZS5pbmRleCA8IHN0YXRlLm1heCAmJiBpc1NwYWNlKHN0YXRlLnBhdGguY2hhckNvZGVBdChzdGF0ZS5pbmRleCkpKSB7XG4gICAgc3RhdGUuaW5kZXgrKztcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHNjYW5GbGFnKHN0YXRlKSB7XG4gIHZhciBjaCA9IHN0YXRlLnBhdGguY2hhckNvZGVBdChzdGF0ZS5pbmRleCk7XG5cbiAgaWYgKGNoID09PSAweDMwLyogMCAqLykge1xuICAgIHN0YXRlLnBhcmFtID0gMDtcbiAgICBzdGF0ZS5pbmRleCsrO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjaCA9PT0gMHgzMS8qIDEgKi8pIHtcbiAgICBzdGF0ZS5wYXJhbSA9IDE7XG4gICAgc3RhdGUuaW5kZXgrKztcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5lcnIgPSAnU3ZnUGF0aDogYXJjIGZsYWcgY2FuIGJlIDAgb3IgMSBvbmx5IChhdCBwb3MgJyArIHN0YXRlLmluZGV4ICsgJyknO1xufVxuXG5cbmZ1bmN0aW9uIHNjYW5QYXJhbShzdGF0ZSkge1xuICB2YXIgc3RhcnQgPSBzdGF0ZS5pbmRleCxcbiAgICAgIGluZGV4ID0gc3RhcnQsXG4gICAgICBtYXggPSBzdGF0ZS5tYXgsXG4gICAgICB6ZXJvRmlyc3QgPSBmYWxzZSxcbiAgICAgIGhhc0NlaWxpbmcgPSBmYWxzZSxcbiAgICAgIGhhc0RlY2ltYWwgPSBmYWxzZSxcbiAgICAgIGhhc0RvdCA9IGZhbHNlLFxuICAgICAgY2g7XG5cbiAgaWYgKGluZGV4ID49IG1heCkge1xuICAgIHN0YXRlLmVyciA9ICdTdmdQYXRoOiBtaXNzZWQgcGFyYW0gKGF0IHBvcyAnICsgaW5kZXggKyAnKSc7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNoID0gc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KTtcblxuICBpZiAoY2ggPT09IDB4MkIvKiArICovIHx8IGNoID09PSAweDJELyogLSAqLykge1xuICAgIGluZGV4Kys7XG4gICAgY2ggPSAoaW5kZXggPCBtYXgpID8gc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSA6IDA7XG4gIH1cblxuICAvLyBUaGlzIGxvZ2ljIGlzIHNoYW1lbGVzc2x5IGJvcnJvd2VkIGZyb20gRXNwcmltYVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXJpeWEvZXNwcmltYXNcbiAgLy9cbiAgaWYgKCFpc0RpZ2l0KGNoKSAmJiBjaCAhPT0gMHgyRS8qIC4gKi8pIHtcbiAgICBzdGF0ZS5lcnIgPSAnU3ZnUGF0aDogcGFyYW0gc2hvdWxkIHN0YXJ0IHdpdGggMC4uOSBvciBgLmAgKGF0IHBvcyAnICsgaW5kZXggKyAnKSc7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNoICE9PSAweDJFLyogLiAqLykge1xuICAgIHplcm9GaXJzdCA9IChjaCA9PT0gMHgzMC8qIDAgKi8pO1xuICAgIGluZGV4Kys7XG5cbiAgICBjaCA9IChpbmRleCA8IG1heCkgPyBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpIDogMDtcblxuICAgIGlmICh6ZXJvRmlyc3QgJiYgaW5kZXggPCBtYXgpIHtcbiAgICAgIC8vIGRlY2ltYWwgbnVtYmVyIHN0YXJ0cyB3aXRoICcwJyBzdWNoIGFzICcwOScgaXMgaWxsZWdhbC5cbiAgICAgIGlmIChjaCAmJiBpc0RpZ2l0KGNoKSkge1xuICAgICAgICBzdGF0ZS5lcnIgPSAnU3ZnUGF0aDogbnVtYmVycyBzdGFydGVkIHdpdGggYDBgIHN1Y2ggYXMgYDA5YCBhcmUgaWxsZWdhbCAoYXQgcG9zICcgKyBzdGFydCArICcpJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChpbmRleCA8IG1heCAmJiBpc0RpZ2l0KHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICBpbmRleCsrO1xuICAgICAgaGFzQ2VpbGluZyA9IHRydWU7XG4gICAgfVxuICAgIGNoID0gKGluZGV4IDwgbWF4KSA/IHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkgOiAwO1xuICB9XG5cbiAgaWYgKGNoID09PSAweDJFLyogLiAqLykge1xuICAgIGhhc0RvdCA9IHRydWU7XG4gICAgaW5kZXgrKztcbiAgICB3aGlsZSAoaXNEaWdpdChzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgaW5kZXgrKztcbiAgICAgIGhhc0RlY2ltYWwgPSB0cnVlO1xuICAgIH1cbiAgICBjaCA9IChpbmRleCA8IG1heCkgPyBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpIDogMDtcbiAgfVxuXG4gIGlmIChjaCA9PT0gMHg2NS8qIGUgKi8gfHwgY2ggPT09IDB4NDUvKiBFICovKSB7XG4gICAgaWYgKGhhc0RvdCAmJiAhaGFzQ2VpbGluZyAmJiAhaGFzRGVjaW1hbCkge1xuICAgICAgc3RhdGUuZXJyID0gJ1N2Z1BhdGg6IGludmFsaWQgZmxvYXQgZXhwb25lbnQgKGF0IHBvcyAnICsgaW5kZXggKyAnKSc7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaW5kZXgrKztcblxuICAgIGNoID0gKGluZGV4IDwgbWF4KSA/IHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkgOiAwO1xuICAgIGlmIChjaCA9PT0gMHgyQi8qICsgKi8gfHwgY2ggPT09IDB4MkQvKiAtICovKSB7XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgICBpZiAoaW5kZXggPCBtYXggJiYgaXNEaWdpdChzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgd2hpbGUgKGluZGV4IDwgbWF4ICYmIGlzRGlnaXQoc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuZXJyID0gJ1N2Z1BhdGg6IGludmFsaWQgZmxvYXQgZXhwb25lbnQgKGF0IHBvcyAnICsgaW5kZXggKyAnKSc7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgc3RhdGUuaW5kZXggPSBpbmRleDtcbiAgc3RhdGUucGFyYW0gPSBwYXJzZUZsb2F0KHN0YXRlLnBhdGguc2xpY2Uoc3RhcnQsIGluZGV4KSkgKyAwLjA7XG59XG5cblxuZnVuY3Rpb24gZmluYWxpemVTZWdtZW50KHN0YXRlKSB7XG4gIHZhciBjbWQsIGNtZExDO1xuXG4gIC8vIFByb2Nlc3MgZHVwbGljYXRlZCBjb21tYW5kcyAod2l0aG91dCBjb21hbmQgbmFtZSlcblxuICAvLyBUaGlzIGxvZ2ljIGlzIHNoYW1lbGVzc2x5IGJvcnJvd2VkIGZyb20gUmFwaGFlbFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vRG1pdHJ5QmFyYW5vdnNraXkvcmFwaGFlbC9cbiAgLy9cbiAgY21kICAgPSBzdGF0ZS5wYXRoW3N0YXRlLnNlZ21lbnRTdGFydF07XG4gIGNtZExDID0gY21kLnRvTG93ZXJDYXNlKCk7XG5cbiAgdmFyIHBhcmFtcyA9IHN0YXRlLmRhdGE7XG5cbiAgaWYgKGNtZExDID09PSAnbScgJiYgcGFyYW1zLmxlbmd0aCA+IDIpIHtcbiAgICBzdGF0ZS5yZXN1bHQucHVzaChbIGNtZCwgcGFyYW1zWzBdLCBwYXJhbXNbMV0gXSk7XG4gICAgcGFyYW1zID0gcGFyYW1zLnNsaWNlKDIpO1xuICAgIGNtZExDID0gJ2wnO1xuICAgIGNtZCA9IChjbWQgPT09ICdtJykgPyAnbCcgOiAnTCc7XG4gIH1cblxuICBpZiAoY21kTEMgPT09ICdyJykge1xuICAgIHN0YXRlLnJlc3VsdC5wdXNoKFsgY21kIF0uY29uY2F0KHBhcmFtcykpO1xuICB9IGVsc2Uge1xuXG4gICAgd2hpbGUgKHBhcmFtcy5sZW5ndGggPj0gcGFyYW1Db3VudHNbY21kTENdKSB7XG4gICAgICBzdGF0ZS5yZXN1bHQucHVzaChbIGNtZCBdLmNvbmNhdChwYXJhbXMuc3BsaWNlKDAsIHBhcmFtQ291bnRzW2NtZExDXSkpKTtcbiAgICAgIGlmICghcGFyYW1Db3VudHNbY21kTENdKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHNjYW5TZWdtZW50KHN0YXRlKSB7XG4gIHZhciBtYXggPSBzdGF0ZS5tYXgsXG4gICAgICBjbWRDb2RlLCBpc19hcmMsIGNvbW1hX2ZvdW5kLCBuZWVkX3BhcmFtcywgaTtcblxuICBzdGF0ZS5zZWdtZW50U3RhcnQgPSBzdGF0ZS5pbmRleDtcbiAgY21kQ29kZSA9IHN0YXRlLnBhdGguY2hhckNvZGVBdChzdGF0ZS5pbmRleCk7XG4gIGlzX2FyYyA9IGlzQXJjKGNtZENvZGUpO1xuXG4gIGlmICghaXNDb21tYW5kKGNtZENvZGUpKSB7XG4gICAgc3RhdGUuZXJyID0gJ1N2Z1BhdGg6IGJhZCBjb21tYW5kICcgKyBzdGF0ZS5wYXRoW3N0YXRlLmluZGV4XSArICcgKGF0IHBvcyAnICsgc3RhdGUuaW5kZXggKyAnKSc7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbmVlZF9wYXJhbXMgPSBwYXJhbUNvdW50c1tzdGF0ZS5wYXRoW3N0YXRlLmluZGV4XS50b0xvd2VyQ2FzZSgpXTtcblxuICBzdGF0ZS5pbmRleCsrO1xuICBza2lwU3BhY2VzKHN0YXRlKTtcblxuICBzdGF0ZS5kYXRhID0gW107XG5cbiAgaWYgKCFuZWVkX3BhcmFtcykge1xuICAgIC8vIFpcbiAgICBmaW5hbGl6ZVNlZ21lbnQoc3RhdGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbW1hX2ZvdW5kID0gZmFsc2U7XG5cbiAgZm9yICg7Oykge1xuICAgIGZvciAoaSA9IG5lZWRfcGFyYW1zOyBpID4gMDsgaS0tKSB7XG4gICAgICBpZiAoaXNfYXJjICYmIChpID09PSAzIHx8IGkgPT09IDQpKSBzY2FuRmxhZyhzdGF0ZSk7XG4gICAgICBlbHNlIHNjYW5QYXJhbShzdGF0ZSk7XG5cbiAgICAgIGlmIChzdGF0ZS5lcnIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHN0YXRlLmRhdGEucHVzaChzdGF0ZS5wYXJhbSk7XG5cbiAgICAgIHNraXBTcGFjZXMoc3RhdGUpO1xuICAgICAgY29tbWFfZm91bmQgPSBmYWxzZTtcblxuICAgICAgaWYgKHN0YXRlLmluZGV4IDwgbWF4ICYmIHN0YXRlLnBhdGguY2hhckNvZGVBdChzdGF0ZS5pbmRleCkgPT09IDB4MkMvKiAsICovKSB7XG4gICAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgICAgIHNraXBTcGFjZXMoc3RhdGUpO1xuICAgICAgICBjb21tYV9mb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWZ0ZXIgJywnIHBhcmFtIGlzIG1hbmRhdG9yeVxuICAgIGlmIChjb21tYV9mb3VuZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLmluZGV4ID49IHN0YXRlLm1heCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gU3RvcCBvbiBuZXh0IHNlZ21lbnRcbiAgICBpZiAoIWlzRGlnaXRTdGFydChzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoc3RhdGUuaW5kZXgpKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZmluYWxpemVTZWdtZW50KHN0YXRlKTtcbn1cblxuXG4vKiBSZXR1cm5zIGFycmF5IG9mIHNlZ21lbnRzOlxuICpcbiAqIFtcbiAqICAgWyBjb21tYW5kLCBjb29yZDEsIGNvb3JkMiwgLi4uIF1cbiAqIF1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXRoUGFyc2Uoc3ZnUGF0aCkge1xuICB2YXIgc3RhdGUgPSBuZXcgU3RhdGUoc3ZnUGF0aCk7XG4gIHZhciBtYXggPSBzdGF0ZS5tYXg7XG5cbiAgc2tpcFNwYWNlcyhzdGF0ZSk7XG5cbiAgd2hpbGUgKHN0YXRlLmluZGV4IDwgbWF4ICYmICFzdGF0ZS5lcnIubGVuZ3RoKSB7XG4gICAgc2NhblNlZ21lbnQoc3RhdGUpO1xuICB9XG5cbiAgaWYgKHN0YXRlLmVyci5sZW5ndGgpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBbXTtcblxuICB9IGVsc2UgaWYgKHN0YXRlLnJlc3VsdC5sZW5ndGgpIHtcblxuICAgIGlmICgnbU0nLmluZGV4T2Yoc3RhdGUucmVzdWx0WzBdWzBdKSA8IDApIHtcbiAgICAgIHN0YXRlLmVyciA9ICdTdmdQYXRoOiBzdHJpbmcgc2hvdWxkIHN0YXJ0IHdpdGggYE1gIG9yIGBtYCc7XG4gICAgICBzdGF0ZS5yZXN1bHQgPSBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucmVzdWx0WzBdWzBdID0gJ00nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZXJyOiBzdGF0ZS5lcnIsXG4gICAgc2VnbWVudHM6IHN0YXRlLnJlc3VsdFxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gY29tYmluZSAyIG1hdHJpeGVzXG4vLyBtMSwgbTIgLSBbYSwgYiwgYywgZCwgZSwgZ11cbi8vXG5mdW5jdGlvbiBjb21iaW5lKG0xLCBtMikge1xuICByZXR1cm4gW1xuICAgIG0xWzBdICogbTJbMF0gKyBtMVsyXSAqIG0yWzFdLFxuICAgIG0xWzFdICogbTJbMF0gKyBtMVszXSAqIG0yWzFdLFxuICAgIG0xWzBdICogbTJbMl0gKyBtMVsyXSAqIG0yWzNdLFxuICAgIG0xWzFdICogbTJbMl0gKyBtMVszXSAqIG0yWzNdLFxuICAgIG0xWzBdICogbTJbNF0gKyBtMVsyXSAqIG0yWzVdICsgbTFbNF0sXG4gICAgbTFbMV0gKiBtMls0XSArIG0xWzNdICogbTJbNV0gKyBtMVs1XVxuICBdO1xufVxuXG5cbmZ1bmN0aW9uIE1hdHJpeCgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1hdHJpeCkpIHsgcmV0dXJuIG5ldyBNYXRyaXgoKTsgfVxuICB0aGlzLnF1ZXVlID0gW107ICAgLy8gbGlzdCBvZiBtYXRyaXhlcyB0byBhcHBseVxuICB0aGlzLmNhY2hlID0gbnVsbDsgLy8gY29tYmluZWQgbWF0cml4IGNhY2hlXG59XG5cblxuTWF0cml4LnByb3RvdHlwZS5tYXRyaXggPSBmdW5jdGlvbiAobSkge1xuICBpZiAobVswXSA9PT0gMSAmJiBtWzFdID09PSAwICYmIG1bMl0gPT09IDAgJiYgbVszXSA9PT0gMSAmJiBtWzRdID09PSAwICYmIG1bNV0gPT09IDApIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgdGhpcy5xdWV1ZS5wdXNoKG0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuTWF0cml4LnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAodHgsIHR5KSB7XG4gIGlmICh0eCAhPT0gMCB8fCB0eSAhPT0gMCkge1xuICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuICAgIHRoaXMucXVldWUucHVzaChbIDEsIDAsIDAsIDEsIHR4LCB0eSBdKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuTWF0cml4LnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uIChzeCwgc3kpIHtcbiAgaWYgKHN4ICE9PSAxIHx8IHN5ICE9PSAxKSB7XG4gICAgdGhpcy5jYWNoZSA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKFsgc3gsIDAsIDAsIHN5LCAwLCAwIF0pO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5NYXRyaXgucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSwgcngsIHJ5KSB7XG4gIHZhciByYWQsIGNvcywgc2luO1xuXG4gIGlmIChhbmdsZSAhPT0gMCkge1xuICAgIHRoaXMudHJhbnNsYXRlKHJ4LCByeSk7XG5cbiAgICByYWQgPSBhbmdsZSAqIE1hdGguUEkgLyAxODA7XG4gICAgY29zID0gTWF0aC5jb3MocmFkKTtcbiAgICBzaW4gPSBNYXRoLnNpbihyYWQpO1xuXG4gICAgdGhpcy5xdWV1ZS5wdXNoKFsgY29zLCBzaW4sIC1zaW4sIGNvcywgMCwgMCBdKTtcbiAgICB0aGlzLmNhY2hlID0gbnVsbDtcblxuICAgIHRoaXMudHJhbnNsYXRlKC1yeCwgLXJ5KTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuTWF0cml4LnByb3RvdHlwZS5za2V3WCA9IGZ1bmN0aW9uIChhbmdsZSkge1xuICBpZiAoYW5nbGUgIT09IDApIHtcbiAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgICB0aGlzLnF1ZXVlLnB1c2goWyAxLCAwLCBNYXRoLnRhbihhbmdsZSAqIE1hdGguUEkgLyAxODApLCAxLCAwLCAwIF0pO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5NYXRyaXgucHJvdG90eXBlLnNrZXdZID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG4gIGlmIChhbmdsZSAhPT0gMCkge1xuICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuICAgIHRoaXMucXVldWUucHVzaChbIDEsIE1hdGgudGFuKGFuZ2xlICogTWF0aC5QSSAvIDE4MCksIDAsIDEsIDAsIDAgXSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIEZsYXR0ZW4gcXVldWVcbi8vXG5NYXRyaXgucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmNhY2hlKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGU7XG4gIH1cblxuICBpZiAoIXRoaXMucXVldWUubGVuZ3RoKSB7XG4gICAgdGhpcy5jYWNoZSA9IFsgMSwgMCwgMCwgMSwgMCwgMCBdO1xuICAgIHJldHVybiB0aGlzLmNhY2hlO1xuICB9XG5cbiAgdGhpcy5jYWNoZSA9IHRoaXMucXVldWVbMF07XG5cbiAgaWYgKHRoaXMucXVldWUubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGU7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMTsgaSA8IHRoaXMucXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLmNhY2hlID0gY29tYmluZSh0aGlzLmNhY2hlLCB0aGlzLnF1ZXVlW2ldKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmNhY2hlO1xufTtcblxuXG4vLyBBcHBseSBsaXN0IG9mIG1hdHJpeGVzIHRvICh4LHkpIHBvaW50LlxuLy8gSWYgYGlzUmVsYXRpdmVgIHNldCwgYHRyYW5zbGF0ZWAgY29tcG9uZW50IG9mIG1hdHJpeCB3aWxsIGJlIHNraXBwZWRcbi8vXG5NYXRyaXgucHJvdG90eXBlLmNhbGMgPSBmdW5jdGlvbiAoeCwgeSwgaXNSZWxhdGl2ZSkge1xuICB2YXIgbTtcblxuICAvLyBEb24ndCBjaGFuZ2UgcG9pbnQgb24gZW1wdHkgdHJhbnNmb3JtcyBxdWV1ZVxuICBpZiAoIXRoaXMucXVldWUubGVuZ3RoKSB7IHJldHVybiBbIHgsIHkgXTsgfVxuXG4gIC8vIENhbGN1bGF0ZSBmaW5hbCBtYXRyaXgsIGlmIG5vdCBleGlzdHNcbiAgLy9cbiAgLy8gTkIuIGlmIHlvdSBkZXNpZGUgdG8gYXBwbHkgdHJhbnNmb3JtcyB0byBwb2ludCBvbmUtYnktb25lLFxuICAvLyB0aGV5IHNob3VsZCBiZSB0YWtlbiBpbiByZXZlcnNlIG9yZGVyXG5cbiAgaWYgKCF0aGlzLmNhY2hlKSB7XG4gICAgdGhpcy5jYWNoZSA9IHRoaXMudG9BcnJheSgpO1xuICB9XG5cbiAgbSA9IHRoaXMuY2FjaGU7XG5cbiAgLy8gQXBwbHkgbWF0cml4IHRvIHBvaW50XG4gIHJldHVybiBbXG4gICAgeCAqIG1bMF0gKyB5ICogbVsyXSArIChpc1JlbGF0aXZlID8gMCA6IG1bNF0pLFxuICAgIHggKiBtWzFdICsgeSAqIG1bM10gKyAoaXNSZWxhdGl2ZSA/IDAgOiBtWzVdKVxuICBdO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgTWF0cml4ID0gcmVxdWlyZSgnLi9tYXRyaXgnKTtcblxudmFyIG9wZXJhdGlvbnMgPSB7XG4gIG1hdHJpeDogdHJ1ZSxcbiAgc2NhbGU6IHRydWUsXG4gIHJvdGF0ZTogdHJ1ZSxcbiAgdHJhbnNsYXRlOiB0cnVlLFxuICBza2V3WDogdHJ1ZSxcbiAgc2tld1k6IHRydWVcbn07XG5cbnZhciBDTURfU1BMSVRfUkUgICAgPSAvXFxzKihtYXRyaXh8dHJhbnNsYXRlfHNjYWxlfHJvdGF0ZXxza2V3WHxza2V3WSlcXHMqXFwoXFxzKiguKz8pXFxzKlxcKVtcXHMsXSovO1xudmFyIFBBUkFNU19TUExJVF9SRSA9IC9bXFxzLF0rLztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybVBhcnNlKHRyYW5zZm9ybVN0cmluZykge1xuICB2YXIgbWF0cml4ID0gbmV3IE1hdHJpeCgpO1xuICB2YXIgY21kLCBwYXJhbXM7XG5cbiAgLy8gU3BsaXQgdmFsdWUgaW50byBbJycsICd0cmFuc2xhdGUnLCAnMTAgNTAnLCAnJywgJ3NjYWxlJywgJzInLCAnJywgJ3JvdGF0ZScsICAnLTQ1JywgJyddXG4gIHRyYW5zZm9ybVN0cmluZy5zcGxpdChDTURfU1BMSVRfUkUpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblxuICAgIC8vIFNraXAgZW1wdHkgZWxlbWVudHNcbiAgICBpZiAoIWl0ZW0ubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgLy8gcmVtZW1iZXIgb3BlcmF0aW9uXG4gICAgaWYgKHR5cGVvZiBvcGVyYXRpb25zW2l0ZW1dICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY21kID0gaXRlbTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBleHRyYWN0IHBhcmFtcyAmIGF0dCBvcGVyYXRpb24gdG8gbWF0cml4XG4gICAgcGFyYW1zID0gaXRlbS5zcGxpdChQQVJBTVNfU1BMSVRfUkUpLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgcmV0dXJuICtpIHx8IDA7XG4gICAgfSk7XG5cbiAgICAvLyBJZiBwYXJhbXMgY291bnQgaXMgbm90IGNvcnJlY3QgLSBpZ25vcmUgY29tbWFuZFxuICAgIHN3aXRjaCAoY21kKSB7XG4gICAgICBjYXNlICdtYXRyaXgnOlxuICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgIG1hdHJpeC5tYXRyaXgocGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBtYXRyaXguc2NhbGUocGFyYW1zWzBdLCBwYXJhbXNbMF0pO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICBtYXRyaXguc2NhbGUocGFyYW1zWzBdLCBwYXJhbXNbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBtYXRyaXgucm90YXRlKHBhcmFtc1swXSwgMCwgMCk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIG1hdHJpeC5yb3RhdGUocGFyYW1zWzBdLCBwYXJhbXNbMV0sIHBhcmFtc1syXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICd0cmFuc2xhdGUnOlxuICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1hdHJpeC50cmFuc2xhdGUocGFyYW1zWzBdLCAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgbWF0cml4LnRyYW5zbGF0ZShwYXJhbXNbMF0sIHBhcmFtc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdza2V3WCc6XG4gICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbWF0cml4LnNrZXdYKHBhcmFtc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdza2V3WSc6XG4gICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbWF0cml4LnNrZXdZKHBhcmFtc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG1hdHJpeDtcbn07XG4iLCIvLyBDb252ZXJ0IGFuIGFyYyB0byBhIHNlcXVlbmNlIG9mIGN1YmljIGLDqXppZXIgY3VydmVzXG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBUQVUgPSBNYXRoLlBJICogMjtcblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBzcGFjZS1pbmZpeC1vcHMgKi9cblxuLy8gQ2FsY3VsYXRlIGFuIGFuZ2xlIGJldHdlZW4gdHdvIHVuaXQgdmVjdG9yc1xuLy9cbi8vIFNpbmNlIHdlIG1lYXN1cmUgYW5nbGUgYmV0d2VlbiByYWRpaSBvZiBjaXJjdWxhciBhcmNzLFxuLy8gd2UgY2FuIHVzZSBzaW1wbGlmaWVkIG1hdGggKHdpdGhvdXQgbGVuZ3RoIG5vcm1hbGl6YXRpb24pXG4vL1xuZnVuY3Rpb24gdW5pdF92ZWN0b3JfYW5nbGUodXgsIHV5LCB2eCwgdnkpIHtcbiAgdmFyIHNpZ24gPSAodXggKiB2eSAtIHV5ICogdnggPCAwKSA/IC0xIDogMTtcbiAgdmFyIGRvdCAgPSB1eCAqIHZ4ICsgdXkgKiB2eTtcblxuICAvLyBBZGQgdGhpcyB0byB3b3JrIHdpdGggYXJiaXRyYXJ5IHZlY3RvcnM6XG4gIC8vIGRvdCAvPSBNYXRoLnNxcnQodXggKiB1eCArIHV5ICogdXkpICogTWF0aC5zcXJ0KHZ4ICogdnggKyB2eSAqIHZ5KTtcblxuICAvLyByb3VuZGluZyBlcnJvcnMsIGUuZy4gLTEuMDAwMDAwMDAwMDAwMDAwMiBjYW4gc2NyZXcgdXAgdGhpc1xuICBpZiAoZG90ID4gIDEuMCkgeyBkb3QgPSAgMS4wOyB9XG4gIGlmIChkb3QgPCAtMS4wKSB7IGRvdCA9IC0xLjA7IH1cblxuICByZXR1cm4gc2lnbiAqIE1hdGguYWNvcyhkb3QpO1xufVxuXG5cbi8vIENvbnZlcnQgZnJvbSBlbmRwb2ludCB0byBjZW50ZXIgcGFyYW1ldGVyaXphdGlvbixcbi8vIHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9pbXBsbm90ZS5odG1sI0FyY0ltcGxlbWVudGF0aW9uTm90ZXNcbi8vXG4vLyBSZXR1cm4gW2N4LCBjeSwgdGhldGExLCBkZWx0YV90aGV0YV1cbi8vXG5mdW5jdGlvbiBnZXRfYXJjX2NlbnRlcih4MSwgeTEsIHgyLCB5MiwgZmEsIGZzLCByeCwgcnksIHNpbl9waGksIGNvc19waGkpIHtcbiAgLy8gU3RlcCAxLlxuICAvL1xuICAvLyBNb3ZpbmcgYW4gZWxsaXBzZSBzbyBvcmlnaW4gd2lsbCBiZSB0aGUgbWlkZGxlcG9pbnQgYmV0d2VlbiBvdXIgdHdvXG4gIC8vIHBvaW50cy4gQWZ0ZXIgdGhhdCwgcm90YXRlIGl0IHRvIGxpbmUgdXAgZWxsaXBzZSBheGVzIHdpdGggY29vcmRpbmF0ZVxuICAvLyBheGVzLlxuICAvL1xuICB2YXIgeDFwID0gIGNvc19waGkqKHgxLXgyKS8yICsgc2luX3BoaSooeTEteTIpLzI7XG4gIHZhciB5MXAgPSAtc2luX3BoaSooeDEteDIpLzIgKyBjb3NfcGhpKih5MS15MikvMjtcblxuICB2YXIgcnhfc3EgID0gIHJ4ICogcng7XG4gIHZhciByeV9zcSAgPSAgcnkgKiByeTtcbiAgdmFyIHgxcF9zcSA9IHgxcCAqIHgxcDtcbiAgdmFyIHkxcF9zcSA9IHkxcCAqIHkxcDtcblxuICAvLyBTdGVwIDIuXG4gIC8vXG4gIC8vIENvbXB1dGUgY29vcmRpbmF0ZXMgb2YgdGhlIGNlbnRyZSBvZiB0aGlzIGVsbGlwc2UgKGN4JywgY3knKVxuICAvLyBpbiB0aGUgbmV3IGNvb3JkaW5hdGUgc3lzdGVtLlxuICAvL1xuICB2YXIgcmFkaWNhbnQgPSAocnhfc3EgKiByeV9zcSkgLSAocnhfc3EgKiB5MXBfc3EpIC0gKHJ5X3NxICogeDFwX3NxKTtcblxuICBpZiAocmFkaWNhbnQgPCAwKSB7XG4gICAgLy8gZHVlIHRvIHJvdW5kaW5nIGVycm9ycyBpdCBtaWdodCBiZSBlLmcuIC0xLjM4Nzc3ODc4MDc4MTQ0NTdlLTE3XG4gICAgcmFkaWNhbnQgPSAwO1xuICB9XG5cbiAgcmFkaWNhbnQgLz0gICAocnhfc3EgKiB5MXBfc3EpICsgKHJ5X3NxICogeDFwX3NxKTtcbiAgcmFkaWNhbnQgPSBNYXRoLnNxcnQocmFkaWNhbnQpICogKGZhID09PSBmcyA/IC0xIDogMSk7XG5cbiAgdmFyIGN4cCA9IHJhZGljYW50ICogIHJ4L3J5ICogeTFwO1xuICB2YXIgY3lwID0gcmFkaWNhbnQgKiAtcnkvcnggKiB4MXA7XG5cbiAgLy8gU3RlcCAzLlxuICAvL1xuICAvLyBUcmFuc2Zvcm0gYmFjayB0byBnZXQgY2VudHJlIGNvb3JkaW5hdGVzIChjeCwgY3kpIGluIHRoZSBvcmlnaW5hbFxuICAvLyBjb29yZGluYXRlIHN5c3RlbS5cbiAgLy9cbiAgdmFyIGN4ID0gY29zX3BoaSpjeHAgLSBzaW5fcGhpKmN5cCArICh4MSt4MikvMjtcbiAgdmFyIGN5ID0gc2luX3BoaSpjeHAgKyBjb3NfcGhpKmN5cCArICh5MSt5MikvMjtcblxuICAvLyBTdGVwIDQuXG4gIC8vXG4gIC8vIENvbXB1dGUgYW5nbGVzICh0aGV0YTEsIGRlbHRhX3RoZXRhKS5cbiAgLy9cbiAgdmFyIHYxeCA9ICAoeDFwIC0gY3hwKSAvIHJ4O1xuICB2YXIgdjF5ID0gICh5MXAgLSBjeXApIC8gcnk7XG4gIHZhciB2MnggPSAoLXgxcCAtIGN4cCkgLyByeDtcbiAgdmFyIHYyeSA9ICgteTFwIC0gY3lwKSAvIHJ5O1xuXG4gIHZhciB0aGV0YTEgPSB1bml0X3ZlY3Rvcl9hbmdsZSgxLCAwLCB2MXgsIHYxeSk7XG4gIHZhciBkZWx0YV90aGV0YSA9IHVuaXRfdmVjdG9yX2FuZ2xlKHYxeCwgdjF5LCB2MngsIHYyeSk7XG5cbiAgaWYgKGZzID09PSAwICYmIGRlbHRhX3RoZXRhID4gMCkge1xuICAgIGRlbHRhX3RoZXRhIC09IFRBVTtcbiAgfVxuICBpZiAoZnMgPT09IDEgJiYgZGVsdGFfdGhldGEgPCAwKSB7XG4gICAgZGVsdGFfdGhldGEgKz0gVEFVO1xuICB9XG5cbiAgcmV0dXJuIFsgY3gsIGN5LCB0aGV0YTEsIGRlbHRhX3RoZXRhIF07XG59XG5cbi8vXG4vLyBBcHByb3hpbWF0ZSBvbmUgdW5pdCBhcmMgc2VnbWVudCB3aXRoIGLDqXppZXIgY3VydmVzLFxuLy8gc2VlIGh0dHA6Ly9tYXRoLnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy84NzMyMjRcbi8vXG5mdW5jdGlvbiBhcHByb3hpbWF0ZV91bml0X2FyYyh0aGV0YTEsIGRlbHRhX3RoZXRhKSB7XG4gIHZhciBhbHBoYSA9IDQvMyAqIE1hdGgudGFuKGRlbHRhX3RoZXRhLzQpO1xuXG4gIHZhciB4MSA9IE1hdGguY29zKHRoZXRhMSk7XG4gIHZhciB5MSA9IE1hdGguc2luKHRoZXRhMSk7XG4gIHZhciB4MiA9IE1hdGguY29zKHRoZXRhMSArIGRlbHRhX3RoZXRhKTtcbiAgdmFyIHkyID0gTWF0aC5zaW4odGhldGExICsgZGVsdGFfdGhldGEpO1xuXG4gIHJldHVybiBbIHgxLCB5MSwgeDEgLSB5MSphbHBoYSwgeTEgKyB4MSphbHBoYSwgeDIgKyB5MiphbHBoYSwgeTIgLSB4MiphbHBoYSwgeDIsIHkyIF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYTJjKHgxLCB5MSwgeDIsIHkyLCBmYSwgZnMsIHJ4LCByeSwgcGhpKSB7XG4gIHZhciBzaW5fcGhpID0gTWF0aC5zaW4ocGhpICogVEFVIC8gMzYwKTtcbiAgdmFyIGNvc19waGkgPSBNYXRoLmNvcyhwaGkgKiBUQVUgLyAzNjApO1xuXG4gIC8vIE1ha2Ugc3VyZSByYWRpaSBhcmUgdmFsaWRcbiAgLy9cbiAgdmFyIHgxcCA9ICBjb3NfcGhpKih4MS14MikvMiArIHNpbl9waGkqKHkxLXkyKS8yO1xuICB2YXIgeTFwID0gLXNpbl9waGkqKHgxLXgyKS8yICsgY29zX3BoaSooeTEteTIpLzI7XG5cbiAgaWYgKHgxcCA9PT0gMCAmJiB5MXAgPT09IDApIHtcbiAgICAvLyB3ZSdyZSBhc2tlZCB0byBkcmF3IGxpbmUgdG8gaXRzZWxmXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgaWYgKHJ4ID09PSAwIHx8IHJ5ID09PSAwKSB7XG4gICAgLy8gb25lIG9mIHRoZSByYWRpaSBpcyB6ZXJvXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cblxuICAvLyBDb21wZW5zYXRlIG91dC1vZi1yYW5nZSByYWRpaVxuICAvL1xuICByeCA9IE1hdGguYWJzKHJ4KTtcbiAgcnkgPSBNYXRoLmFicyhyeSk7XG5cbiAgdmFyIGxhbWJkYSA9ICh4MXAgKiB4MXApIC8gKHJ4ICogcngpICsgKHkxcCAqIHkxcCkgLyAocnkgKiByeSk7XG4gIGlmIChsYW1iZGEgPiAxKSB7XG4gICAgcnggKj0gTWF0aC5zcXJ0KGxhbWJkYSk7XG4gICAgcnkgKj0gTWF0aC5zcXJ0KGxhbWJkYSk7XG4gIH1cblxuXG4gIC8vIEdldCBjZW50ZXIgcGFyYW1ldGVycyAoY3gsIGN5LCB0aGV0YTEsIGRlbHRhX3RoZXRhKVxuICAvL1xuICB2YXIgY2MgPSBnZXRfYXJjX2NlbnRlcih4MSwgeTEsIHgyLCB5MiwgZmEsIGZzLCByeCwgcnksIHNpbl9waGksIGNvc19waGkpO1xuXG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIHRoZXRhMSA9IGNjWzJdO1xuICB2YXIgZGVsdGFfdGhldGEgPSBjY1szXTtcblxuICAvLyBTcGxpdCBhbiBhcmMgdG8gbXVsdGlwbGUgc2VnbWVudHMsIHNvIGVhY2ggc2VnbWVudFxuICAvLyB3aWxsIGJlIGxlc3MgdGhhbiDPhC80ICg9IDkwwrApXG4gIC8vXG4gIHZhciBzZWdtZW50cyA9IE1hdGgubWF4KE1hdGguY2VpbChNYXRoLmFicyhkZWx0YV90aGV0YSkgLyAoVEFVIC8gNCkpLCAxKTtcbiAgZGVsdGFfdGhldGEgLz0gc2VnbWVudHM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50czsgaSsrKSB7XG4gICAgcmVzdWx0LnB1c2goYXBwcm94aW1hdGVfdW5pdF9hcmModGhldGExLCBkZWx0YV90aGV0YSkpO1xuICAgIHRoZXRhMSArPSBkZWx0YV90aGV0YTtcbiAgfVxuXG4gIC8vIFdlIGhhdmUgYSBiZXppZXIgYXBwcm94aW1hdGlvbiBvZiBhIHVuaXQgY2lyY2xlLFxuICAvLyBub3cgbmVlZCB0byB0cmFuc2Zvcm0gYmFjayB0byB0aGUgb3JpZ2luYWwgZWxsaXBzZVxuICAvL1xuICByZXR1cm4gcmVzdWx0Lm1hcChmdW5jdGlvbiAoY3VydmUpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnZlLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICB2YXIgeCA9IGN1cnZlW2kgKyAwXTtcbiAgICAgIHZhciB5ID0gY3VydmVbaSArIDFdO1xuXG4gICAgICAvLyBzY2FsZVxuICAgICAgeCAqPSByeDtcbiAgICAgIHkgKj0gcnk7XG5cbiAgICAgIC8vIHJvdGF0ZVxuICAgICAgdmFyIHhwID0gY29zX3BoaSp4IC0gc2luX3BoaSp5O1xuICAgICAgdmFyIHlwID0gc2luX3BoaSp4ICsgY29zX3BoaSp5O1xuXG4gICAgICAvLyB0cmFuc2xhdGVcbiAgICAgIGN1cnZlW2kgKyAwXSA9IHhwICsgY2NbMF07XG4gICAgICBjdXJ2ZVtpICsgMV0gPSB5cCArIGNjWzFdO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJ2ZTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBzcGFjZS1pbmZpeC1vcHMgKi9cblxuLy8gVGhlIHByZWNpc2lvbiB1c2VkIHRvIGNvbnNpZGVyIGFuIGVsbGlwc2UgYXMgYSBjaXJjbGVcbi8vXG52YXIgZXBzaWxvbiA9IDAuMDAwMDAwMDAwMTtcblxuLy8gVG8gY29udmVydCBkZWdyZWUgaW4gcmFkaWFuc1xuLy9cbnZhciB0b3JhZCA9IE1hdGguUEkgLyAxODA7XG5cbi8vIENsYXNzIGNvbnN0cnVjdG9yIDpcbi8vICBhbiBlbGxpcHNlIGNlbnRyZWQgYXQgMCB3aXRoIHJhZGlpIHJ4LHJ5IGFuZCB4IC0gYXhpcyAtIGFuZ2xlIGF4LlxuLy9cbmZ1bmN0aW9uIEVsbGlwc2UocngsIHJ5LCBheCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRWxsaXBzZSkpIHsgcmV0dXJuIG5ldyBFbGxpcHNlKHJ4LCByeSwgYXgpOyB9XG4gIHRoaXMucnggPSByeDtcbiAgdGhpcy5yeSA9IHJ5O1xuICB0aGlzLmF4ID0gYXg7XG59XG5cbi8vIEFwcGx5IGEgbGluZWFyIHRyYW5zZm9ybSBtIHRvIHRoZSBlbGxpcHNlXG4vLyBtIGlzIGFuIGFycmF5IHJlcHJlc2VudGluZyBhIG1hdHJpeCA6XG4vLyAgICAtICAgICAgICAgLVxuLy8gICB8IG1bMF0gbVsyXSB8XG4vLyAgIHwgbVsxXSBtWzNdIHxcbi8vICAgIC0gICAgICAgICAtXG4vL1xuRWxsaXBzZS5wcm90b3R5cGUudHJhbnNmb3JtID0gZnVuY3Rpb24gKG0pIHtcbiAgLy8gV2UgY29uc2lkZXIgdGhlIGN1cnJlbnQgZWxsaXBzZSBhcyBpbWFnZSBvZiB0aGUgdW5pdCBjaXJjbGVcbiAgLy8gYnkgZmlyc3Qgc2NhbGUocngscnkpIGFuZCB0aGVuIHJvdGF0ZShheCkgLi4uXG4gIC8vIFNvIHdlIGFwcGx5IG1hID0gIG0geCByb3RhdGUoYXgpIHggc2NhbGUocngscnkpIHRvIHRoZSB1bml0IGNpcmNsZS5cbiAgdmFyIGMgPSBNYXRoLmNvcyh0aGlzLmF4ICogdG9yYWQpLCBzID0gTWF0aC5zaW4odGhpcy5heCAqIHRvcmFkKTtcbiAgdmFyIG1hID0gW1xuICAgIHRoaXMucnggKiAobVswXSpjICsgbVsyXSpzKSxcbiAgICB0aGlzLnJ4ICogKG1bMV0qYyArIG1bM10qcyksXG4gICAgdGhpcy5yeSAqICgtbVswXSpzICsgbVsyXSpjKSxcbiAgICB0aGlzLnJ5ICogKC1tWzFdKnMgKyBtWzNdKmMpXG4gIF07XG5cbiAgLy8gbWEgKiB0cmFuc3Bvc2UobWEpID0gWyBKIEwgXVxuICAvLyAgICAgICAgICAgICAgICAgICAgICBbIEwgSyBdXG4gIC8vIEwgaXMgY2FsY3VsYXRlZCBsYXRlciAoaWYgdGhlIGltYWdlIGlzIG5vdCBhIGNpcmNsZSlcbiAgdmFyIEogPSBtYVswXSptYVswXSArIG1hWzJdKm1hWzJdLFxuICAgICAgSyA9IG1hWzFdKm1hWzFdICsgbWFbM10qbWFbM107XG5cbiAgLy8gdGhlIGRpc2NyaW1pbmFudCBvZiB0aGUgY2hhcmFjdGVyaXN0aWMgcG9seW5vbWlhbCBvZiBtYSAqIHRyYW5zcG9zZShtYSlcbiAgdmFyIEQgPSAoKG1hWzBdLW1hWzNdKSoobWFbMF0tbWFbM10pICsgKG1hWzJdK21hWzFdKSoobWFbMl0rbWFbMV0pKSAqXG4gICAgICAgICAgKChtYVswXSttYVszXSkqKG1hWzBdK21hWzNdKSArIChtYVsyXS1tYVsxXSkqKG1hWzJdLW1hWzFdKSk7XG5cbiAgLy8gdGhlIFwibWVhbiBlaWdlbnZhbHVlXCJcbiAgdmFyIEpLID0gKEogKyBLKSAvIDI7XG5cbiAgLy8gY2hlY2sgaWYgdGhlIGltYWdlIGlzIChhbG1vc3QpIGEgY2lyY2xlXG4gIGlmIChEIDwgZXBzaWxvbiAqIEpLKSB7XG4gICAgLy8gaWYgaXQgaXNcbiAgICB0aGlzLnJ4ID0gdGhpcy5yeSA9IE1hdGguc3FydChKSyk7XG4gICAgdGhpcy5heCA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBpZiBpdCBpcyBub3QgYSBjaXJjbGVcbiAgdmFyIEwgPSBtYVswXSptYVsxXSArIG1hWzJdKm1hWzNdO1xuXG4gIEQgPSBNYXRoLnNxcnQoRCk7XG5cbiAgLy8ge2wxLGwyfSA9IHRoZSB0d28gZWlnZW4gdmFsdWVzIG9mIG1hICogdHJhbnNwb3NlKG1hKVxuICB2YXIgbDEgPSBKSyArIEQvMixcbiAgICAgIGwyID0gSksgLSBELzI7XG4gIC8vIHRoZSB4IC0gYXhpcyAtIHJvdGF0aW9uIGFuZ2xlIGlzIHRoZSBhcmd1bWVudCBvZiB0aGUgbDEgLSBlaWdlbnZlY3RvclxuICAvKmVzbGludC1kaXNhYmxlIGluZGVudCovXG4gIHRoaXMuYXggPSAoTWF0aC5hYnMoTCkgPCBlcHNpbG9uICYmIE1hdGguYWJzKGwxIC0gSykgPCBlcHNpbG9uKSA/XG4gICAgOTBcbiAgOlxuICAgIE1hdGguYXRhbihNYXRoLmFicyhMKSA+IE1hdGguYWJzKGwxIC0gSykgP1xuICAgICAgKGwxIC0gSikgLyBMXG4gICAgOlxuICAgICAgTCAvIChsMSAtIEspXG4gICAgKSAqIDE4MCAvIE1hdGguUEk7XG4gIC8qZXNsaW50LWVuYWJsZSBpbmRlbnQqL1xuXG4gIC8vIGlmIGF4ID4gMCA9PiByeCA9IHNxcnQobDEpLCByeSA9IHNxcnQobDIpLCBlbHNlIGV4Y2hhbmdlIGF4ZXMgYW5kIGF4ICs9IDkwXG4gIGlmICh0aGlzLmF4ID49IDApIHtcbiAgICAvLyBpZiBheCBpbiBbMCw5MF1cbiAgICB0aGlzLnJ4ID0gTWF0aC5zcXJ0KGwxKTtcbiAgICB0aGlzLnJ5ID0gTWF0aC5zcXJ0KGwyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpZiBheCBpbiBdLTkwLDBbID0+IGV4Y2hhbmdlIGF4ZXNcbiAgICB0aGlzLmF4ICs9IDkwO1xuICAgIHRoaXMucnggPSBNYXRoLnNxcnQobDIpO1xuICAgIHRoaXMucnkgPSBNYXRoLnNxcnQobDEpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBDaGVjayBpZiB0aGUgZWxsaXBzZSBpcyAoYWxtb3N0KSBkZWdlbmVyYXRlLCBpLmUuIHJ4ID0gMCBvciByeSA9IDBcbi8vXG5FbGxpcHNlLnByb3RvdHlwZS5pc0RlZ2VuZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAodGhpcy5yeCA8IGVwc2lsb24gKiB0aGlzLnJ5IHx8IHRoaXMucnkgPCBlcHNpbG9uICogdGhpcy5yeCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVsbGlwc2U7XG4iLCIvLyBTVkcgUGF0aCB0cmFuc2Zvcm1hdGlvbnMgbGlicmFyeVxuLy9cbi8vIFVzYWdlOlxuLy9cbi8vICAgIFN2Z1BhdGgoJy4uLicpXG4vLyAgICAgIC50cmFuc2xhdGUoLTE1MCwgLTEwMClcbi8vICAgICAgLnNjYWxlKDAuNSlcbi8vICAgICAgLnRyYW5zbGF0ZSgtMTUwLCAtMTAwKVxuLy8gICAgICAudG9GaXhlZCgxKVxuLy8gICAgICAudG9TdHJpbmcoKVxuLy9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBwYXRoUGFyc2UgICAgICA9IHJlcXVpcmUoJy4vcGF0aF9wYXJzZScpO1xudmFyIHRyYW5zZm9ybVBhcnNlID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1fcGFyc2UnKTtcbnZhciBtYXRyaXggICAgICAgICA9IHJlcXVpcmUoJy4vbWF0cml4Jyk7XG52YXIgYTJjICAgICAgICAgICAgPSByZXF1aXJlKCcuL2EyYycpO1xudmFyIGVsbGlwc2UgICAgICAgID0gcmVxdWlyZSgnLi9lbGxpcHNlJyk7XG5cblxuLy8gQ2xhc3MgY29uc3RydWN0b3Jcbi8vXG5mdW5jdGlvbiBTdmdQYXRoKHBhdGgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN2Z1BhdGgpKSB7IHJldHVybiBuZXcgU3ZnUGF0aChwYXRoKTsgfVxuXG4gIHZhciBwc3RhdGUgPSBwYXRoUGFyc2UocGF0aCk7XG5cbiAgLy8gQXJyYXkgb2YgcGF0aCBzZWdtZW50cy5cbiAgLy8gRWFjaCBzZWdtZW50IGlzIGFycmF5IFtjb21tYW5kLCBwYXJhbTEsIHBhcmFtMiwgLi4uXVxuICB0aGlzLnNlZ21lbnRzID0gcHN0YXRlLnNlZ21lbnRzO1xuXG4gIC8vIEVycm9yIG1lc3NhZ2Ugb24gcGFyc2UgZXJyb3IuXG4gIHRoaXMuZXJyICAgICAgPSBwc3RhdGUuZXJyO1xuXG4gIC8vIFRyYW5zZm9ybXMgc3RhY2sgZm9yIGxhenkgZXZhbHVhdGlvblxuICB0aGlzLl9fc3RhY2sgICAgPSBbXTtcbn1cblxuU3ZnUGF0aC5mcm9tID0gZnVuY3Rpb24gKHNyYykge1xuICBpZiAodHlwZW9mIHNyYyA9PT0gJ3N0cmluZycpIHJldHVybiBuZXcgU3ZnUGF0aChzcmMpO1xuXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBTdmdQYXRoKSB7XG4gICAgLy8gQ3JlYXRlIGVtcHR5IG9iamVjdFxuICAgIHZhciBzID0gbmV3IFN2Z1BhdGgoJycpO1xuXG4gICAgLy8gQ2xvbmUgcHJvcGVyaWVzXG4gICAgcy5lcnIgPSBzcmMuZXJyO1xuICAgIHMuc2VnbWVudHMgPSBzcmMuc2VnbWVudHMubWFwKGZ1bmN0aW9uIChzZ20pIHsgcmV0dXJuIHNnbS5zbGljZSgpOyB9KTtcbiAgICBzLl9fc3RhY2sgPSBzcmMuX19zdGFjay5tYXAoZnVuY3Rpb24gKG0pIHtcbiAgICAgIHJldHVybiBtYXRyaXgoKS5tYXRyaXgobS50b0FycmF5KCkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ1N2Z1BhdGguZnJvbTogaW52YWxpZCBwYXJhbSB0eXBlICcgKyBzcmMpO1xufTtcblxuXG5TdmdQYXRoLnByb3RvdHlwZS5fX21hdHJpeCA9IGZ1bmN0aW9uIChtKSB7XG4gIHZhciBzZWxmID0gdGhpcywgaTtcblxuICAvLyBRdWljayBsZWF2ZSBmb3IgZW1wdHkgbWF0cml4XG4gIGlmICghbS5xdWV1ZS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5pdGVyYXRlKGZ1bmN0aW9uIChzLCBpbmRleCwgeCwgeSkge1xuICAgIHZhciBwLCByZXN1bHQsIG5hbWUsIGlzUmVsYXRpdmU7XG5cbiAgICBzd2l0Y2ggKHNbMF0pIHtcblxuICAgICAgLy8gUHJvY2VzcyAnYXNzeW1ldHJpYycgY29tbWFuZHMgc2VwYXJhdGVseVxuICAgICAgY2FzZSAndic6XG4gICAgICAgIHAgICAgICA9IG0uY2FsYygwLCBzWzFdLCB0cnVlKTtcbiAgICAgICAgcmVzdWx0ID0gKHBbMF0gPT09IDApID8gWyAndicsIHBbMV0gXSA6IFsgJ2wnLCBwWzBdLCBwWzFdIF07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdWJzpcbiAgICAgICAgcCAgICAgID0gbS5jYWxjKHgsIHNbMV0sIGZhbHNlKTtcbiAgICAgICAgcmVzdWx0ID0gKHBbMF0gPT09IG0uY2FsYyh4LCB5LCBmYWxzZSlbMF0pID8gWyAnVicsIHBbMV0gXSA6IFsgJ0wnLCBwWzBdLCBwWzFdIF07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdoJzpcbiAgICAgICAgcCAgICAgID0gbS5jYWxjKHNbMV0sIDAsIHRydWUpO1xuICAgICAgICByZXN1bHQgPSAocFsxXSA9PT0gMCkgPyBbICdoJywgcFswXSBdIDogWyAnbCcsIHBbMF0sIHBbMV0gXTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ0gnOlxuICAgICAgICBwICAgICAgPSBtLmNhbGMoc1sxXSwgeSwgZmFsc2UpO1xuICAgICAgICByZXN1bHQgPSAocFsxXSA9PT0gbS5jYWxjKHgsIHksIGZhbHNlKVsxXSkgPyBbICdIJywgcFswXSBdIDogWyAnTCcsIHBbMF0sIHBbMV0gXTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2EnOlxuICAgICAgY2FzZSAnQSc6XG4gICAgICAgIC8vIEFSQyBpczogWydBJywgcngsIHJ5LCB4LWF4aXMtcm90YXRpb24sIGxhcmdlLWFyYy1mbGFnLCBzd2VlcC1mbGFnLCB4LCB5XVxuXG4gICAgICAgIC8vIERyb3Agc2VnbWVudCBpZiBhcmMgaXMgZW1wdHkgKGVuZCBwb2ludCA9PT0gc3RhcnQgcG9pbnQpXG4gICAgICAgIC8qaWYgKChzWzBdID09PSAnQScgJiYgc1s2XSA9PT0geCAmJiBzWzddID09PSB5KSB8fFxuICAgICAgICAgICAgKHNbMF0gPT09ICdhJyAmJiBzWzZdID09PSAwICYmIHNbN10gPT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9Ki9cblxuICAgICAgICAvLyBUcmFuc2Zvcm0gcngsIHJ5IGFuZCB0aGUgeC1heGlzLXJvdGF0aW9uXG4gICAgICAgIHZhciBtYSA9IG0udG9BcnJheSgpO1xuICAgICAgICB2YXIgZSA9IGVsbGlwc2Uoc1sxXSwgc1syXSwgc1szXSkudHJhbnNmb3JtKG1hKTtcblxuICAgICAgICAvLyBmbGlwIHN3ZWVwLWZsYWcgaWYgbWF0cml4IGlzIG5vdCBvcmllbnRhdGlvbi1wcmVzZXJ2aW5nXG4gICAgICAgIGlmIChtYVswXSAqIG1hWzNdIC0gbWFbMV0gKiBtYVsyXSA8IDApIHtcbiAgICAgICAgICBzWzVdID0gc1s1XSA/ICcwJyA6ICcxJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRyYW5zZm9ybSBlbmQgcG9pbnQgYXMgdXN1YWwgKHdpdGhvdXQgdHJhbnNsYXRpb24gZm9yIHJlbGF0aXZlIG5vdGF0aW9uKVxuICAgICAgICBwID0gbS5jYWxjKHNbNl0sIHNbN10sIHNbMF0gPT09ICdhJyk7XG5cbiAgICAgICAgLy8gRW1wdHkgYXJjcyBjYW4gYmUgaWdub3JlZCBieSByZW5kZXJlciwgYnV0IHNob3VsZCBub3QgYmUgZHJvcHBlZFxuICAgICAgICAvLyB0byBhdm9pZCBjb2xsaXNpb25zIHdpdGggYFMgQSBTYCBhbmQgc28gb24uIFJlcGxhY2Ugd2l0aCBlbXB0eSBsaW5lLlxuICAgICAgICBpZiAoKHNbMF0gPT09ICdBJyAmJiBzWzZdID09PSB4ICYmIHNbN10gPT09IHkpIHx8XG4gICAgICAgICAgICAoc1swXSA9PT0gJ2EnICYmIHNbNl0gPT09IDAgJiYgc1s3XSA9PT0gMCkpIHtcbiAgICAgICAgICByZXN1bHQgPSBbIHNbMF0gPT09ICdhJyA/ICdsJyA6ICdMJywgcFswXSwgcFsxXSBdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIHJlc3VsdGluZyBlbGxpcHNlIGlzIChhbG1vc3QpIGEgc2VnbWVudCAuLi5cbiAgICAgICAgaWYgKGUuaXNEZWdlbmVyYXRlKCkpIHtcbiAgICAgICAgICAvLyByZXBsYWNlIHRoZSBhcmMgYnkgYSBsaW5lXG4gICAgICAgICAgcmVzdWx0ID0gWyBzWzBdID09PSAnYScgPyAnbCcgOiAnTCcsIHBbMF0sIHBbMV0gXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiBpdCBpcyBhIHJlYWwgZWxsaXBzZVxuICAgICAgICAgIC8vIHNbMF0sIHNbNF0gYW5kIHNbNV0gYXJlIG5vdCBtb2RpZmllZFxuICAgICAgICAgIHJlc3VsdCA9IFsgc1swXSwgZS5yeCwgZS5yeSwgZS5heCwgc1s0XSwgc1s1XSwgcFswXSwgcFsxXSBdO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ20nOlxuICAgICAgICAvLyBFZGdlIGNhc2UuIFRoZSB2ZXJ5IGZpcnN0IGBtYCBzaG91bGQgYmUgcHJvY2Vzc2VkIGFzIGFic29sdXRlLCBpZiBoYXBwZW5zLlxuICAgICAgICAvLyBNYWtlIHNlbnNlIGZvciBjb29yZCBzaGlmdCB0cmFuc2Zvcm1zLlxuICAgICAgICBpc1JlbGF0aXZlID0gaW5kZXggPiAwO1xuXG4gICAgICAgIHAgPSBtLmNhbGMoc1sxXSwgc1syXSwgaXNSZWxhdGl2ZSk7XG4gICAgICAgIHJlc3VsdCA9IFsgJ20nLCBwWzBdLCBwWzFdIF07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBuYW1lICAgICAgID0gc1swXTtcbiAgICAgICAgcmVzdWx0ICAgICA9IFsgbmFtZSBdO1xuICAgICAgICBpc1JlbGF0aXZlID0gKG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSk7XG5cbiAgICAgICAgLy8gQXBwbHkgdHJhbnNmb3JtYXRpb25zIHRvIHRoZSBzZWdtZW50XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgcCA9IG0uY2FsYyhzW2ldLCBzW2kgKyAxXSwgaXNSZWxhdGl2ZSk7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocFswXSwgcFsxXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLnNlZ21lbnRzW2luZGV4XSA9IHJlc3VsdDtcbiAgfSwgdHJ1ZSk7XG59O1xuXG5cbi8vIEFwcGx5IHN0YWNrZWQgY29tbWFuZHNcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5fX2V2YWx1YXRlU3RhY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtLCBpO1xuXG4gIGlmICghdGhpcy5fX3N0YWNrLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5fX3N0YWNrLmxlbmd0aCA9PT0gMSkge1xuICAgIHRoaXMuX19tYXRyaXgodGhpcy5fX3N0YWNrWzBdKTtcbiAgICB0aGlzLl9fc3RhY2sgPSBbXTtcbiAgICByZXR1cm47XG4gIH1cblxuICBtID0gbWF0cml4KCk7XG4gIGkgPSB0aGlzLl9fc3RhY2subGVuZ3RoO1xuXG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIG0ubWF0cml4KHRoaXMuX19zdGFja1tpXS50b0FycmF5KCkpO1xuICB9XG5cbiAgdGhpcy5fX21hdHJpeChtKTtcbiAgdGhpcy5fX3N0YWNrID0gW107XG59O1xuXG5cbi8vIENvbnZlcnQgcHJvY2Vzc2VkIFNWRyBQYXRoIGJhY2sgdG8gc3RyaW5nXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlbGVtZW50cyA9IFtdLCBza2lwQ21kLCBjbWQ7XG5cbiAgdGhpcy5fX2V2YWx1YXRlU3RhY2soKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyByZW1vdmUgcmVwZWF0aW5nIGNvbW1hbmRzIG5hbWVzXG4gICAgY21kID0gdGhpcy5zZWdtZW50c1tpXVswXTtcbiAgICBza2lwQ21kID0gaSA+IDAgJiYgY21kICE9PSAnbScgJiYgY21kICE9PSAnTScgJiYgY21kID09PSB0aGlzLnNlZ21lbnRzW2kgLSAxXVswXTtcbiAgICBlbGVtZW50cyA9IGVsZW1lbnRzLmNvbmNhdChza2lwQ21kID8gdGhpcy5zZWdtZW50c1tpXS5zbGljZSgxKSA6IHRoaXMuc2VnbWVudHNbaV0pO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRzLmpvaW4oJyAnKVxuICAgIC8vIE9wdGltaXphdGlvbnM6IHJlbW92ZSBzcGFjZXMgYXJvdW5kIGNvbW1hbmRzICYgYmVmb3JlIGAtYFxuICAgIC8vXG4gICAgLy8gV2UgY291bGQgYWxzbyByZW1vdmUgbGVhZGluZyB6ZXJvcyBmb3IgYDAuNWAtbGlrZSB2YWx1ZXMsXG4gICAgLy8gYnV0IHRoZWlyIGNvdW50IGlzIHRvbyBzbWFsbCB0byBzcGVuZCB0aW1lIGZvci5cbiAgICAucmVwbGFjZSgvID8oW2FjaGxtcXJzdHZ6XSkgPy9naSwgJyQxJylcbiAgICAucmVwbGFjZSgvIFxcLS9nLCAnLScpXG4gICAgLy8gd29ya2Fyb3VuZCBmb3IgRm9udEZvcmdlIFNWRyBpbXBvcnRpbmcgYnVnXG4gICAgLnJlcGxhY2UoL3ptL2csICd6IG0nKTtcbn07XG5cblxuLy8gVHJhbnNsYXRlIHBhdGggdG8gKHggWywgeV0pXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgdGhpcy5fX3N0YWNrLnB1c2gobWF0cml4KCkudHJhbnNsYXRlKHgsIHkgfHwgMCkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gU2NhbGUgcGF0aCB0byAoc3ggWywgc3ldKVxuLy8gc3kgPSBzeCBpZiBub3QgZGVmaW5lZFxuLy9cblN2Z1BhdGgucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24gKHN4LCBzeSkge1xuICB0aGlzLl9fc3RhY2sucHVzaChtYXRyaXgoKS5zY2FsZShzeCwgKCFzeSAmJiAoc3kgIT09IDApKSA/IHN4IDogc3kpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIFJvdGF0ZSBwYXRoIGFyb3VuZCBwb2ludCAoc3ggWywgc3ldKVxuLy8gc3kgPSBzeCBpZiBub3QgZGVmaW5lZFxuLy9cblN2Z1BhdGgucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSwgcngsIHJ5KSB7XG4gIHRoaXMuX19zdGFjay5wdXNoKG1hdHJpeCgpLnJvdGF0ZShhbmdsZSwgcnggfHwgMCwgcnkgfHwgMCkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gU2tldyBwYXRoIGFsb25nIHRoZSBYIGF4aXMgYnkgYGRlZ3JlZXNgIGFuZ2xlXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUuc2tld1ggPSBmdW5jdGlvbiAoZGVncmVlcykge1xuICB0aGlzLl9fc3RhY2sucHVzaChtYXRyaXgoKS5za2V3WChkZWdyZWVzKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBTa2V3IHBhdGggYWxvbmcgdGhlIFkgYXhpcyBieSBgZGVncmVlc2AgYW5nbGVcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5za2V3WSA9IGZ1bmN0aW9uIChkZWdyZWVzKSB7XG4gIHRoaXMuX19zdGFjay5wdXNoKG1hdHJpeCgpLnNrZXdZKGRlZ3JlZXMpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIEFwcGx5IG1hdHJpeCB0cmFuc2Zvcm0gKGFycmF5IG9mIDYgZWxlbWVudHMpXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUubWF0cml4ID0gZnVuY3Rpb24gKG0pIHtcbiAgdGhpcy5fX3N0YWNrLnB1c2gobWF0cml4KCkubWF0cml4KG0pKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIFRyYW5zZm9ybSBwYXRoIGFjY29yZGluZyB0byBcInRyYW5zZm9ybVwiIGF0dHIgb2YgU1ZHIHNwZWNcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS50cmFuc2Zvcm0gPSBmdW5jdGlvbiAodHJhbnNmb3JtU3RyaW5nKSB7XG4gIGlmICghdHJhbnNmb3JtU3RyaW5nLnRyaW0oKSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX19zdGFjay5wdXNoKHRyYW5zZm9ybVBhcnNlKHRyYW5zZm9ybVN0cmluZykpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gUm91bmQgY29vcmRzIHdpdGggZ2l2ZW4gZGVjaW1hbCBwcmVjaXRpb24uXG4vLyAwIGJ5IGRlZmF1bHQgKHRvIGludGVnZXJzKVxuLy9cblN2Z1BhdGgucHJvdG90eXBlLnJvdW5kID0gZnVuY3Rpb24gKGQpIHtcbiAgdmFyIGNvbnRvdXJTdGFydERlbHRhWCA9IDAsIGNvbnRvdXJTdGFydERlbHRhWSA9IDAsIGRlbHRhWCA9IDAsIGRlbHRhWSA9IDAsIGw7XG5cbiAgZCA9IGQgfHwgMDtcblxuICB0aGlzLl9fZXZhbHVhdGVTdGFjaygpO1xuXG4gIHRoaXMuc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbiAocykge1xuICAgIHZhciBpc1JlbGF0aXZlID0gKHNbMF0udG9Mb3dlckNhc2UoKSA9PT0gc1swXSk7XG5cbiAgICBzd2l0Y2ggKHNbMF0pIHtcbiAgICAgIGNhc2UgJ0gnOlxuICAgICAgY2FzZSAnaCc6XG4gICAgICAgIGlmIChpc1JlbGF0aXZlKSB7IHNbMV0gKz0gZGVsdGFYOyB9XG4gICAgICAgIGRlbHRhWCA9IHNbMV0gLSBzWzFdLnRvRml4ZWQoZCk7XG4gICAgICAgIHNbMV0gPSArc1sxXS50b0ZpeGVkKGQpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ1YnOlxuICAgICAgY2FzZSAndic6XG4gICAgICAgIGlmIChpc1JlbGF0aXZlKSB7IHNbMV0gKz0gZGVsdGFZOyB9XG4gICAgICAgIGRlbHRhWSA9IHNbMV0gLSBzWzFdLnRvRml4ZWQoZCk7XG4gICAgICAgIHNbMV0gPSArc1sxXS50b0ZpeGVkKGQpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ1onOlxuICAgICAgY2FzZSAneic6XG4gICAgICAgIGRlbHRhWCA9IGNvbnRvdXJTdGFydERlbHRhWDtcbiAgICAgICAgZGVsdGFZID0gY29udG91clN0YXJ0RGVsdGFZO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ00nOlxuICAgICAgY2FzZSAnbSc6XG4gICAgICAgIGlmIChpc1JlbGF0aXZlKSB7XG4gICAgICAgICAgc1sxXSArPSBkZWx0YVg7XG4gICAgICAgICAgc1syXSArPSBkZWx0YVk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWx0YVggPSBzWzFdIC0gc1sxXS50b0ZpeGVkKGQpO1xuICAgICAgICBkZWx0YVkgPSBzWzJdIC0gc1syXS50b0ZpeGVkKGQpO1xuXG4gICAgICAgIGNvbnRvdXJTdGFydERlbHRhWCA9IGRlbHRhWDtcbiAgICAgICAgY29udG91clN0YXJ0RGVsdGFZID0gZGVsdGFZO1xuXG4gICAgICAgIHNbMV0gPSArc1sxXS50b0ZpeGVkKGQpO1xuICAgICAgICBzWzJdID0gK3NbMl0udG9GaXhlZChkKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdBJzpcbiAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAvLyBbY21kLCByeCwgcnksIHgtYXhpcy1yb3RhdGlvbiwgbGFyZ2UtYXJjLWZsYWcsIHN3ZWVwLWZsYWcsIHgsIHldXG4gICAgICAgIGlmIChpc1JlbGF0aXZlKSB7XG4gICAgICAgICAgc1s2XSArPSBkZWx0YVg7XG4gICAgICAgICAgc1s3XSArPSBkZWx0YVk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWx0YVggPSBzWzZdIC0gc1s2XS50b0ZpeGVkKGQpO1xuICAgICAgICBkZWx0YVkgPSBzWzddIC0gc1s3XS50b0ZpeGVkKGQpO1xuXG4gICAgICAgIHNbMV0gPSArc1sxXS50b0ZpeGVkKGQpO1xuICAgICAgICBzWzJdID0gK3NbMl0udG9GaXhlZChkKTtcbiAgICAgICAgc1szXSA9ICtzWzNdLnRvRml4ZWQoZCArIDIpOyAvLyBiZXR0ZXIgcHJlY2lzaW9uIGZvciByb3RhdGlvblxuICAgICAgICBzWzZdID0gK3NbNl0udG9GaXhlZChkKTtcbiAgICAgICAgc1s3XSA9ICtzWzddLnRvRml4ZWQoZCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gYSBjIGwgcSBzIHRcbiAgICAgICAgbCA9IHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChpc1JlbGF0aXZlKSB7XG4gICAgICAgICAgc1tsIC0gMl0gKz0gZGVsdGFYO1xuICAgICAgICAgIHNbbCAtIDFdICs9IGRlbHRhWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbHRhWCA9IHNbbCAtIDJdIC0gc1tsIC0gMl0udG9GaXhlZChkKTtcbiAgICAgICAgZGVsdGFZID0gc1tsIC0gMV0gLSBzW2wgLSAxXS50b0ZpeGVkKGQpO1xuXG4gICAgICAgIHMuZm9yRWFjaChmdW5jdGlvbiAodmFsLCBpKSB7XG4gICAgICAgICAgaWYgKCFpKSB7IHJldHVybjsgfVxuICAgICAgICAgIHNbaV0gPSArc1tpXS50b0ZpeGVkKGQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIEFwcGx5IGl0ZXJhdG9yIGZ1bmN0aW9uIHRvIGFsbCBzZWdtZW50cy4gSWYgZnVuY3Rpb24gcmV0dXJucyByZXN1bHQsXG4vLyBjdXJyZW50IHNlZ21lbnQgd2lsbCBiZSByZXBsYWNlZCB0byBhcnJheSBvZiByZXR1cm5lZCBzZWdtZW50cy5cbi8vIElmIGVtcHR5IGFycmF5IGlzIHJldHVybmVkLCBjdXJyZW50IHJlZ21lbnQgd2lsbCBiZSBkZWxldGVkLlxuLy9cblN2Z1BhdGgucHJvdG90eXBlLml0ZXJhdGUgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGtlZXBMYXp5U3RhY2spIHtcbiAgdmFyIHNlZ21lbnRzID0gdGhpcy5zZWdtZW50cyxcbiAgICAgIHJlcGxhY2VtZW50cyA9IHt9LFxuICAgICAgbmVlZFJlcGxhY2UgPSBmYWxzZSxcbiAgICAgIGxhc3RYID0gMCxcbiAgICAgIGxhc3RZID0gMCxcbiAgICAgIGNvdW50b3VyU3RhcnRYID0gMCxcbiAgICAgIGNvdW50b3VyU3RhcnRZID0gMDtcbiAgdmFyIGksIGosIG5ld1NlZ21lbnRzO1xuXG4gIGlmICgha2VlcExhenlTdGFjaykge1xuICAgIHRoaXMuX19ldmFsdWF0ZVN0YWNrKCk7XG4gIH1cblxuICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzLCBpbmRleCkge1xuXG4gICAgdmFyIHJlcyA9IGl0ZXJhdG9yKHMsIGluZGV4LCBsYXN0WCwgbGFzdFkpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVzKSkge1xuICAgICAgcmVwbGFjZW1lbnRzW2luZGV4XSA9IHJlcztcbiAgICAgIG5lZWRSZXBsYWNlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgaXNSZWxhdGl2ZSA9IChzWzBdID09PSBzWzBdLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgLy8gY2FsY3VsYXRlIGFic29sdXRlIFggYW5kIFlcbiAgICBzd2l0Y2ggKHNbMF0pIHtcbiAgICAgIGNhc2UgJ20nOlxuICAgICAgY2FzZSAnTSc6XG4gICAgICAgIGxhc3RYID0gc1sxXSArIChpc1JlbGF0aXZlID8gbGFzdFggOiAwKTtcbiAgICAgICAgbGFzdFkgPSBzWzJdICsgKGlzUmVsYXRpdmUgPyBsYXN0WSA6IDApO1xuICAgICAgICBjb3VudG91clN0YXJ0WCA9IGxhc3RYO1xuICAgICAgICBjb3VudG91clN0YXJ0WSA9IGxhc3RZO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ2gnOlxuICAgICAgY2FzZSAnSCc6XG4gICAgICAgIGxhc3RYID0gc1sxXSArIChpc1JlbGF0aXZlID8gbGFzdFggOiAwKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICd2JzpcbiAgICAgIGNhc2UgJ1YnOlxuICAgICAgICBsYXN0WSA9IHNbMV0gKyAoaXNSZWxhdGl2ZSA/IGxhc3RZIDogMCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAneic6XG4gICAgICBjYXNlICdaJzpcbiAgICAgICAgLy8gVGhhdCBtYWtlIHNlbmNlIGZvciBtdWx0aXBsZSBjb250b3Vyc1xuICAgICAgICBsYXN0WCA9IGNvdW50b3VyU3RhcnRYO1xuICAgICAgICBsYXN0WSA9IGNvdW50b3VyU3RhcnRZO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxhc3RYID0gc1tzLmxlbmd0aCAtIDJdICsgKGlzUmVsYXRpdmUgPyBsYXN0WCA6IDApO1xuICAgICAgICBsYXN0WSA9IHNbcy5sZW5ndGggLSAxXSArIChpc1JlbGF0aXZlID8gbGFzdFkgOiAwKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFJlcGxhY2Ugc2VnbWVudHMgaWYgaXRlcmF0b3IgcmV0dXJuIHJlc3VsdHNcblxuICBpZiAoIW5lZWRSZXBsYWNlKSB7IHJldHVybiB0aGlzOyB9XG5cbiAgbmV3U2VnbWVudHMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodHlwZW9mIHJlcGxhY2VtZW50c1tpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGZvciAoaiA9IDA7IGogPCByZXBsYWNlbWVudHNbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbmV3U2VnbWVudHMucHVzaChyZXBsYWNlbWVudHNbaV1bal0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTZWdtZW50cy5wdXNoKHNlZ21lbnRzW2ldKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnNlZ21lbnRzID0gbmV3U2VnbWVudHM7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIENvbnZlcnRzIHNlZ21lbnRzIGZyb20gcmVsYXRpdmUgdG8gYWJzb2x1dGVcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5hYnMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdGhpcy5pdGVyYXRlKGZ1bmN0aW9uIChzLCBpbmRleCwgeCwgeSkge1xuICAgIHZhciBuYW1lID0gc1swXSxcbiAgICAgICAgbmFtZVVDID0gbmFtZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICBpO1xuXG4gICAgLy8gU2tpcCBhYnNvbHV0ZSBjb21tYW5kc1xuICAgIGlmIChuYW1lID09PSBuYW1lVUMpIHsgcmV0dXJuOyB9XG5cbiAgICBzWzBdID0gbmFtZVVDO1xuXG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICd2JzpcbiAgICAgICAgLy8gdiBoYXMgc2hpZnRlZCBjb29yZHMgcGFyaXR5XG4gICAgICAgIHNbMV0gKz0geTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdhJzpcbiAgICAgICAgLy8gQVJDIGlzOiBbJ0EnLCByeCwgcnksIHgtYXhpcy1yb3RhdGlvbiwgbGFyZ2UtYXJjLWZsYWcsIHN3ZWVwLWZsYWcsIHgsIHldXG4gICAgICAgIC8vIHRvdWNoIHgsIHkgb25seVxuICAgICAgICBzWzZdICs9IHg7XG4gICAgICAgIHNbN10gKz0geTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHNbaV0gKz0gaSAlIDIgPyB4IDogeTsgLy8gb2RkIHZhbHVlcyBhcmUgWCwgZXZlbiAtIFlcbiAgICAgICAgfVxuICAgIH1cbiAgfSwgdHJ1ZSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIENvbnZlcnRzIHNlZ21lbnRzIGZyb20gYWJzb2x1dGUgdG8gcmVsYXRpdmVcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5yZWwgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdGhpcy5pdGVyYXRlKGZ1bmN0aW9uIChzLCBpbmRleCwgeCwgeSkge1xuICAgIHZhciBuYW1lID0gc1swXSxcbiAgICAgICAgbmFtZUxDID0gbmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBpO1xuXG4gICAgLy8gU2tpcCByZWxhdGl2ZSBjb21tYW5kc1xuICAgIGlmIChuYW1lID09PSBuYW1lTEMpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBEb24ndCB0b3VjaCB0aGUgZmlyc3QgTSB0byBhdm9pZCBwb3RlbnRpYWwgY29uZnVzaW9ucy5cbiAgICBpZiAoaW5kZXggPT09IDAgJiYgbmFtZSA9PT0gJ00nKSB7IHJldHVybjsgfVxuXG4gICAgc1swXSA9IG5hbWVMQztcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnVic6XG4gICAgICAgIC8vIFYgaGFzIHNoaWZ0ZWQgY29vcmRzIHBhcml0eVxuICAgICAgICBzWzFdIC09IHk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnQSc6XG4gICAgICAgIC8vIEFSQyBpczogWydBJywgcngsIHJ5LCB4LWF4aXMtcm90YXRpb24sIGxhcmdlLWFyYy1mbGFnLCBzd2VlcC1mbGFnLCB4LCB5XVxuICAgICAgICAvLyB0b3VjaCB4LCB5IG9ubHlcbiAgICAgICAgc1s2XSAtPSB4O1xuICAgICAgICBzWzddIC09IHk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBzW2ldIC09IGkgJSAyID8geCA6IHk7IC8vIG9kZCB2YWx1ZXMgYXJlIFgsIGV2ZW4gLSBZXG4gICAgICAgIH1cbiAgICB9XG4gIH0sIHRydWUpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBDb252ZXJ0cyBhcmNzIHRvIGN1YmljIGLDqXppZXIgY3VydmVzXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUudW5hcmMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuaXRlcmF0ZShmdW5jdGlvbiAocywgaW5kZXgsIHgsIHkpIHtcbiAgICB2YXIgbmV3X3NlZ21lbnRzLCBuZXh0WCwgbmV4dFksIHJlc3VsdCA9IFtdLCBuYW1lID0gc1swXTtcblxuICAgIC8vIFNraXAgYW55dGhpbmcgZXhjZXB0IGFyY3NcbiAgICBpZiAobmFtZSAhPT0gJ0EnICYmIG5hbWUgIT09ICdhJykgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgaWYgKG5hbWUgPT09ICdhJykge1xuICAgICAgLy8gY29udmVydCByZWxhdGl2ZSBhcmMgY29vcmRpbmF0ZXMgdG8gYWJzb2x1dGVcbiAgICAgIG5leHRYID0geCArIHNbNl07XG4gICAgICBuZXh0WSA9IHkgKyBzWzddO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0WCA9IHNbNl07XG4gICAgICBuZXh0WSA9IHNbN107XG4gICAgfVxuXG4gICAgbmV3X3NlZ21lbnRzID0gYTJjKHgsIHksIG5leHRYLCBuZXh0WSwgc1s0XSwgc1s1XSwgc1sxXSwgc1syXSwgc1szXSk7XG5cbiAgICAvLyBEZWdlbmVyYXRlZCBhcmNzIGNhbiBiZSBpZ25vcmVkIGJ5IHJlbmRlcmVyLCBidXQgc2hvdWxkIG5vdCBiZSBkcm9wcGVkXG4gICAgLy8gdG8gYXZvaWQgY29sbGlzaW9ucyB3aXRoIGBTIEEgU2AgYW5kIHNvIG9uLiBSZXBsYWNlIHdpdGggZW1wdHkgbGluZS5cbiAgICBpZiAobmV3X3NlZ21lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFsgWyBzWzBdID09PSAnYScgPyAnbCcgOiAnTCcsIHNbNl0sIHNbN10gXSBdO1xuICAgIH1cblxuICAgIG5ld19zZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXN1bHQucHVzaChbICdDJywgc1syXSwgc1szXSwgc1s0XSwgc1s1XSwgc1s2XSwgc1s3XSBdKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBDb252ZXJ0cyBzbW9vdGggY3VydmVzICh3aXRoIG1pc3NlZCBjb250cm9sIHBvaW50KSB0byBnZW5lcmljIGN1cnZlc1xuLy9cblN2Z1BhdGgucHJvdG90eXBlLnVuc2hvcnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWdtZW50cyA9IHRoaXMuc2VnbWVudHM7XG4gIHZhciBwcmV2Q29udHJvbFgsIHByZXZDb250cm9sWSwgcHJldlNlZ21lbnQ7XG4gIHZhciBjdXJDb250cm9sWCwgY3VyQ29udHJvbFk7XG5cbiAgLy8gVE9ETzogYWRkIGxhenkgZXZhbHVhdGlvbiBmbGFnIHdoZW4gcmVsYXRpdmUgY29tbWFuZHMgc3VwcG9ydGVkXG5cbiAgdGhpcy5pdGVyYXRlKGZ1bmN0aW9uIChzLCBpZHgsIHgsIHkpIHtcbiAgICB2YXIgbmFtZSA9IHNbMF0sIG5hbWVVQyA9IG5hbWUudG9VcHBlckNhc2UoKSwgaXNSZWxhdGl2ZTtcblxuICAgIC8vIEZpcnN0IGNvbW1hbmQgTVVTVCBiZSBNfG0sIGl0J3Mgc2FmZSB0byBza2lwLlxuICAgIC8vIFByb3RlY3QgZnJvbSBhY2Nlc3MgdG8gWy0xXSBmb3Igc3VyZS5cbiAgICBpZiAoIWlkeCkgeyByZXR1cm47IH1cblxuICAgIGlmIChuYW1lVUMgPT09ICdUJykgeyAvLyBxdWFkcmF0aWMgY3VydmVcbiAgICAgIGlzUmVsYXRpdmUgPSAobmFtZSA9PT0gJ3QnKTtcblxuICAgICAgcHJldlNlZ21lbnQgPSBzZWdtZW50c1tpZHggLSAxXTtcblxuICAgICAgaWYgKHByZXZTZWdtZW50WzBdID09PSAnUScpIHtcbiAgICAgICAgcHJldkNvbnRyb2xYID0gcHJldlNlZ21lbnRbMV0gLSB4O1xuICAgICAgICBwcmV2Q29udHJvbFkgPSBwcmV2U2VnbWVudFsyXSAtIHk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZTZWdtZW50WzBdID09PSAncScpIHtcbiAgICAgICAgcHJldkNvbnRyb2xYID0gcHJldlNlZ21lbnRbMV0gLSBwcmV2U2VnbWVudFszXTtcbiAgICAgICAgcHJldkNvbnRyb2xZID0gcHJldlNlZ21lbnRbMl0gLSBwcmV2U2VnbWVudFs0XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZDb250cm9sWCA9IDA7XG4gICAgICAgIHByZXZDb250cm9sWSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGN1ckNvbnRyb2xYID0gLXByZXZDb250cm9sWDtcbiAgICAgIGN1ckNvbnRyb2xZID0gLXByZXZDb250cm9sWTtcblxuICAgICAgaWYgKCFpc1JlbGF0aXZlKSB7XG4gICAgICAgIGN1ckNvbnRyb2xYICs9IHg7XG4gICAgICAgIGN1ckNvbnRyb2xZICs9IHk7XG4gICAgICB9XG5cbiAgICAgIHNlZ21lbnRzW2lkeF0gPSBbXG4gICAgICAgIGlzUmVsYXRpdmUgPyAncScgOiAnUScsXG4gICAgICAgIGN1ckNvbnRyb2xYLCBjdXJDb250cm9sWSxcbiAgICAgICAgc1sxXSwgc1syXVxuICAgICAgXTtcblxuICAgIH0gZWxzZSBpZiAobmFtZVVDID09PSAnUycpIHsgLy8gY3ViaWMgY3VydmVcbiAgICAgIGlzUmVsYXRpdmUgPSAobmFtZSA9PT0gJ3MnKTtcblxuICAgICAgcHJldlNlZ21lbnQgPSBzZWdtZW50c1tpZHggLSAxXTtcblxuICAgICAgaWYgKHByZXZTZWdtZW50WzBdID09PSAnQycpIHtcbiAgICAgICAgcHJldkNvbnRyb2xYID0gcHJldlNlZ21lbnRbM10gLSB4O1xuICAgICAgICBwcmV2Q29udHJvbFkgPSBwcmV2U2VnbWVudFs0XSAtIHk7XG4gICAgICB9IGVsc2UgaWYgKHByZXZTZWdtZW50WzBdID09PSAnYycpIHtcbiAgICAgICAgcHJldkNvbnRyb2xYID0gcHJldlNlZ21lbnRbM10gLSBwcmV2U2VnbWVudFs1XTtcbiAgICAgICAgcHJldkNvbnRyb2xZID0gcHJldlNlZ21lbnRbNF0gLSBwcmV2U2VnbWVudFs2XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZDb250cm9sWCA9IDA7XG4gICAgICAgIHByZXZDb250cm9sWSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGN1ckNvbnRyb2xYID0gLXByZXZDb250cm9sWDtcbiAgICAgIGN1ckNvbnRyb2xZID0gLXByZXZDb250cm9sWTtcblxuICAgICAgaWYgKCFpc1JlbGF0aXZlKSB7XG4gICAgICAgIGN1ckNvbnRyb2xYICs9IHg7XG4gICAgICAgIGN1ckNvbnRyb2xZICs9IHk7XG4gICAgICB9XG5cbiAgICAgIHNlZ21lbnRzW2lkeF0gPSBbXG4gICAgICAgIGlzUmVsYXRpdmUgPyAnYycgOiAnQycsXG4gICAgICAgIGN1ckNvbnRyb2xYLCBjdXJDb250cm9sWSxcbiAgICAgICAgc1sxXSwgc1syXSwgc1szXSwgc1s0XVxuICAgICAgXTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN2Z1BhdGg7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvc3ZncGF0aCcpO1xuIiwiaW1wb3J0IHsgYWRkSWNvbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHN2Z3BhdGggZnJvbSBcInN2Z3BhdGhcIjtcblxuZnVuY3Rpb24gc2NhbGUocGF0aDogc3RyaW5nIHwgUGF0aERlZiwgZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyKSB7XG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBgPHBhdGggZD1cIiR7c3ZncGF0aChwYXRoKS5zY2FsZSh0byAvIGZyb20pfVwiIC8+YDtcbiAgfVxuXG4gIHJldHVybiBgPHBhdGggJHtPYmplY3Qua2V5cyhwYXRoKVxuICAgIC5tYXAoXG4gICAgICAoaykgPT5cbiAgICAgICAgYCR7a309XCIke1xuICAgICAgICAgIGsgPT09IFwiZFwiXG4gICAgICAgICAgICA/IHN2Z3BhdGgocGF0aFtrXSkuc2NhbGUodG8gLyBmcm9tKVxuICAgICAgICAgICAgOiBwYXRoW2sgYXMga2V5b2YgUGF0aERlZl1cbiAgICAgICAgfVwiYFxuICAgIClcbiAgICAuam9pbihcIiBcIil9IC8+YDtcbn1cblxuaW50ZXJmYWNlIFBhdGhEZWYge1xuICBkOiBzdHJpbmc7XG4gIGZpbGw6IHN0cmluZztcbn1cblxuY29uc3QgaWNvbnM6IHsgW2s6IHN0cmluZ106IHN0cmluZyB8IEFycmF5PHN0cmluZyB8IFBhdGhEZWY+IH0gPSB7XG4gIFwiYW55LWtleVwiOiBcIlwiLFxuICBcImF1ZGlvLWZpbGVcIjogXCJcIixcbiAgYmxvY2tzOiBbXG4gICAgXCJNMTIgMThMMTYgMTMgMTMgMTMgMTMgMiAxMSAyIDExIDEzIDggMTN6XCIsXG4gICAgXCJNMTksOWgtNHYyaDR2OUg1di05aDRWOUg1Yy0xLjEwMywwLTIsMC44OTctMiwydjljMCwxLjEwMywwLjg5NywyLDIsMmgxNGMxLjEwMywwLDItMC44OTcsMi0ydi05QzIxLDkuODk3LDIwLjEwMyw5LDE5LDkgelwiLFxuICBdLFxuICBcImJyb2tlbi1saW5rXCI6XG4gICAgXCJNMTYuOTQ5IDE0LjEyMUwxOS4wNzEgMTJjMS45NDgtMS45NDkgMS45NDgtNS4xMjIgMC03LjA3MS0xLjk1LTEuOTUtNS4xMjMtMS45NDgtNy4wNzEgMGwtLjcwNy43MDcgMS40MTQgMS40MTQuNzA3LS43MDdjMS4xNjktMS4xNjcgMy4wNzItMS4xNjkgNC4yNDMgMCAxLjE2OSAxLjE3IDEuMTY5IDMuMDczIDAgNC4yNDNsLTIuMTIyIDIuMTIxYy0uMjQ3LjI0Ny0uNTM0LjQzNS0uODQ0LjU3TDEzLjQxNCAxMmwxLjQxNC0xLjQxNC0uNzA3LS43MDdjLS45NDMtLjk0NC0yLjE5OS0xLjQ2NS0zLjUzNS0xLjQ2NS0uMjM1IDAtLjQ2NC4wMzItLjY5MS4wNjZMMy43MDcgMi4yOTMgMi4yOTMgMy43MDdsMTggMTggMS40MTQtMS40MTQtNS41MzYtNS41MzZDMTYuNDQ4IDE0LjU3MyAxNi43MDkgMTQuMzYxIDE2Ljk0OSAxNC4xMjF6TTEwLjU4NiAxNy42NTdjLTEuMTY5IDEuMTY3LTMuMDcyIDEuMTY5LTQuMjQzIDAtMS4xNjktMS4xNy0xLjE2OS0zLjA3MyAwLTQuMjQzbDEuNDc2LTEuNDc1LTEuNDE0LTEuNDE0TDQuOTI5IDEyYy0xLjk0OCAxLjk0OS0xLjk0OCA1LjEyMiAwIDcuMDcxLjk3NS45NzUgMi4yNTUgMS40NjIgMy41MzUgMS40NjIgMS4yODEgMCAyLjU2Mi0uNDg3IDMuNTM2LTEuNDYybC43MDctLjcwNy0xLjQxNC0xLjQxNEwxMC41ODYgMTcuNjU3elwiLFxuICBcImJ1bGxldC1saXN0XCI6XG4gICAgXCJNNCA2SDZWOEg0ek00IDExSDZWMTNINHpNNCAxNkg2VjE4SDR6TTIwIDhMMjAgNiAxOC44IDYgOS4yIDYgOC4wMjMgNiA4LjAyMyA4IDkuMiA4IDE4LjggOHpNOCAxMUgyMFYxM0g4ek04IDE2SDIwVjE4SDh6XCIsXG4gIFwiY2FsZW5kYXItd2l0aC1jaGVja21hcmtcIjogW1xuICAgIFwiTTE5LDRoLTJWMmgtMnYySDlWMkg3djJINUMzLjg5Nyw0LDMsNC44OTcsMyw2djJ2MTJjMCwxLjEwMywwLjg5NywyLDIsMmgxNGMxLjEwMywwLDItMC44OTcsMi0yVjhWNiBDMjEsNC44OTcsMjAuMTAzLDQsMTksNHogTTE5LjAwMiwyMEg1VjhoMTRMMTkuMDAyLDIwelwiLFxuICAgIFwiTTExIDE3LjQxNEwxNi43MDcgMTEuNzA3IDE1LjI5MyAxMC4yOTMgMTEgMTQuNTg2IDguNzA3IDEyLjI5MyA3LjI5MyAxMy43MDd6XCIsXG4gIF0sXG4gIFwiY2hlY2staW4tY2lyY2xlXCI6XG4gICAgXCJNMTIsMkM2LjQ4NiwyLDIsNi40ODYsMiwxMnM0LjQ4NiwxMCwxMCwxMHMxMC00LjQ4NiwxMC0xMFMxNy41MTQsMiwxMiwyeiBNMTIsMjBjLTQuNDExLDAtOC0zLjU4OS04LThzMy41ODktOCw4LTggczgsMy41ODksOCw4UzE2LjQxMSwyMCwxMiwyMHpcIixcbiAgXCJjaGVjay1zbWFsbFwiOlxuICAgIFwiTTEwIDE1LjU4Nkw2LjcwNyAxMi4yOTMgNS4yOTMgMTMuNzA3IDEwIDE4LjQxNCAxOS43MDcgOC43MDcgMTguMjkzIDcuMjkzelwiLFxuICBjaGVja21hcms6XG4gICAgXCJNMTAgMTUuNTg2TDYuNzA3IDEyLjI5MyA1LjI5MyAxMy43MDcgMTAgMTguNDE0IDE5LjcwNyA4LjcwNyAxOC4yOTMgNy4yOTN6XCIsXG4gIFwiY3JlYXRlLW5ld1wiOiBbXG4gICAgXCJNMTMgN0wxMSA3IDExIDExIDcgMTEgNyAxMyAxMSAxMyAxMSAxNyAxMyAxNyAxMyAxMyAxNyAxMyAxNyAxMSAxMyAxMXpcIixcbiAgICBcIk0xMiwyQzYuNDg2LDIsMiw2LjQ4NiwyLDEyczQuNDg2LDEwLDEwLDEwYzUuNTE0LDAsMTAtNC40ODYsMTAtMTBTMTcuNTE0LDIsMTIsMnogTTEyLDIwYy00LjQxMSwwLTgtMy41ODktOC04IHMzLjU4OS04LDgtOHM4LDMuNTg5LDgsOFMxNi40MTEsMjAsMTIsMjB6XCIsXG4gIF0sXG4gIFwiY3Jvc3MtaW4tYm94XCI6XG4gICAgXCJNOS4xNzIgMTYuMjQyTDEyIDEzLjQxNCAxNC44MjggMTYuMjQyIDE2LjI0MiAxNC44MjggMTMuNDE0IDEyIDE2LjI0MiA5LjE3MiAxNC44MjggNy43NTggMTIgMTAuNTg2IDkuMTcyIDcuNzU4IDcuNzU4IDkuMTcyIDEwLjU4NiAxMiA3Ljc1OCAxNC44Mjh6XCIsXG4gIGNyb3NzOlxuICAgIFwiTTE2LjE5MiA2LjM0NEwxMS45NDkgMTAuNTg2IDcuNzA3IDYuMzQ0IDYuMjkzIDcuNzU4IDEwLjUzNSAxMiA2LjI5MyAxNi4yNDIgNy43MDcgMTcuNjU2IDExLjk0OSAxMy40MTQgMTYuMTkyIDE3LjY1NiAxNy42MDYgMTYuMjQyIDEzLjM2NCAxMiAxNy42MDYgNy43NTh6XCIsXG4gIFwiY3Jvc3NlZC1zdGFyXCI6XG4gICAgXCJNNS4wMjUsMjAuNzc1Yy0wLjA5MiwwLjM5OSwwLjA2OCwwLjgxNCwwLjQwNiwxLjA0N0M1LjYwMywyMS45NCw1LjgwMSwyMiw2LDIyYzAuMTkzLDAsMC4zODctMC4wNTYsMC41NTUtMC4xNjhMMTIsMTguMjAyIGw1LjQ0NSwzLjYzYzAuMzQ4LDAuMjMyLDAuODA0LDAuMjIzLDEuMTQ1LTAuMDI0YzAuMzM4LTAuMjQ3LDAuNDg3LTAuNjgsMC4zNzItMS4wODJsLTEuODI5LTYuNGw0LjUzNi00LjA4MiBjMC4yOTctMC4yNjcsMC40MDYtMC42ODYsMC4yNzgtMS4wNjRjLTAuMTI5LTAuMzc4LTAuNDctMC42NDUtMC44NjgtMC42NzZMMTUuMzc4LDguMDVsLTIuNDY3LTUuNDYxQzEyLjc1LDIuMjMsMTIuMzkzLDIsMTIsMiBzLTAuNzUsMC4yMy0wLjkxMSwwLjU4OEw4LjYyMiw4LjA1TDIuOTIxLDguNTAzQzIuNTI5LDguNTM0LDIuMTkyLDguNzkxLDIuMDYsOS4xNmMtMC4xMzQsMC4zNjktMC4wMzgsMC43ODIsMC4yNDIsMS4wNTYgbDQuMjE0LDQuMTA3TDUuMDI1LDIwLjc3NXogTTEyLDUuNDI5bDIuMDQyLDQuNTIxbDAuNTg4LDAuMDQ3YzAuMDAxLDAsMC4wMDEsMCwwLjAwMSwwbDMuOTcyLDAuMzE1bC0zLjI3MSwyLjk0NCBjLTAuMDAxLDAuMDAxLTAuMDAxLDAuMDAxLTAuMDAxLDAuMDAybC0wLjQ2MywwLjQxNmwwLjE3MSwwLjU5N2MwLDAsMCwwLjAwMiwwLDAuMDAzbDEuMjUzLDQuMzg1TDEyLDE1Ljc5OFY1LjQyOXpcIixcbiAgZGljZTpcbiAgICBcIk0xOSwzSDVDMy44OTcsMywzLDMuODk3LDMsNXYxNGMwLDEuMTAzLDAuODk3LDIsMiwyaDE0YzEuMTAzLDAsMi0wLjg5NywyLTJWNUMyMSwzLjg5NywyMC4xMDMsMywxOSwzeiBNNSwxOVY1aDE0IGwwLjAwMiwxNEg1elwiLFxuICBkb2N1bWVudDpcbiAgICBcIk0xOS45MzcsOC42OGMtMC4wMTEtMC4wMzItMC4wMi0wLjA2My0wLjAzMy0wLjA5NGMtMC4wNDktMC4xMDYtMC4xMS0wLjIwNy0wLjE5Ni0wLjI5M2wtNi02IGMtMC4wODYtMC4wODYtMC4xODctMC4xNDctMC4yOTMtMC4xOTZjLTAuMDMtMC4wMTQtMC4wNjItMC4wMjItMC4wOTQtMC4wMzNjLTAuMDg0LTAuMDI4LTAuMTctMC4wNDYtMC4yNTktMC4wNTEgQzEzLjA0LDIuMDExLDEzLjAyMSwyLDEzLDJINkM0Ljg5NywyLDQsMi44OTcsNCw0djE2YzAsMS4xMDMsMC44OTcsMiwyLDJoMTJjMS4xMDMsMCwyLTAuODk3LDItMlY5IGMwLTAuMDIxLTAuMDExLTAuMDQtMC4wMTMtMC4wNjJDMTkuOTgyLDguODUsMTkuOTY1LDguNzY0LDE5LjkzNyw4LjY4eiBNMTYuNTg2LDhIMTRWNS40MTRMMTYuNTg2LDh6IE02LDIwVjRoNnY1IGMwLDAuNTUzLDAuNDQ3LDEsMSwxaDVsMC4wMDIsMTBINnpcIixcbiAgZG9jdW1lbnRzOiBbXG4gICAgXCJNMjAsMkgxMEM4Ljg5NywyLDgsMi44OTcsOCw0djRINGMtMS4xMDMsMC0yLDAuODk3LTIsMnYxMGMwLDEuMTAzLDAuODk3LDIsMiwyaDEwYzEuMTAzLDAsMi0wLjg5NywyLTJ2LTRoNCBjMS4xMDMsMCwyLTAuODk3LDItMlY0QzIyLDIuODk3LDIxLjEwMywyLDIwLDJ6IE00LDIwVjEwaDEwbDAuMDAyLDEwSDR6IE0yMCwxNGgtNHYtNGMwLTEuMTAzLTAuODk3LTItMi0yaC00VjRoMTBWMTR6XCIsXG4gICAgXCJNNiAxMkgxMlYxNEg2ek02IDE2SDEyVjE4SDZ6XCIsXG4gIF0sXG4gIFwiZG90LW5ldHdvcmtcIjpcbiAgICBcIk0xOS41LDNDMTguMTIxLDMsMTcsNC4xMjEsMTcsNS41YzAsMC4zNTcsMC4wNzgsMC42OTYsMC4yMTQsMS4wMDVsLTEuOTU1LDIuMTk5QzE0LjYxNSw4LjI2MiwxMy44MzksOCwxMyw4IGMtMC43NCwwLTEuNDI0LDAuMjE2LTIuMDE5LDAuNTY2TDguNzA3LDYuMjkzTDguNjg0LDYuMzE2QzguODgsNS45MTgsOSw1LjQ3NSw5LDVjMC0xLjY1Ny0xLjM0My0zLTMtM1MzLDMuMzQzLDMsNXMxLjM0MywzLDMsMyBjMC40NzUsMCwwLjkxNy0wLjEyLDEuMzE2LTAuMzE2TDcuMjkzLDcuNzA3TDkuNTY3LDkuOThDOS4yMTUsMTAuNTc2LDksMTEuMjYxLDksMTJjMCwwLjk5NywwLjM4LDEuODk5LDAuOTg1LDIuNjAxbC0yLjU3NywyLjU3NiBDNy4xMjYsMTcuMDY2LDYuODIxLDE3LDYuNSwxN0M1LjEyMiwxNyw0LDE4LjEyMSw0LDE5LjVTNS4xMjIsMjIsNi41LDIyUzksMjAuODc5LDksMTkuNWMwLTAuMzIxLTAuMDY2LTAuNjI2LTAuMTc3LTAuOTA5IGwyLjgzOC0yLjgzOEMxMi4wODIsMTUuOTAzLDEyLjUyOCwxNiwxMywxNmMyLjIwNiwwLDQtMS43OTQsNC00YzAtMC42MzYtMC4xNjMtMS4yMjktMC40MjgtMS43NjRsMi4xMTctMi4zODMgQzE4Ljk0NSw3Ljk0MSwxOS4yMTUsOCwxOS41LDhDMjAuODc5LDgsMjIsNi44NzksMjIsNS41UzIwLjg3OSwzLDE5LjUsM3ogTTEzLDE0Yy0xLjEwMywwLTItMC44OTctMi0yczAuODk3LTIsMi0yIGMxLjEwMywwLDIsMC44OTcsMiwyUzE0LjEwMywxNCwxMywxNHpcIixcbiAgZW50ZXI6IFwiXCIsXG4gIFwiZXhwYW5kLXZlcnRpY2FsbHlcIjogXCJNNyAxN0wxMiAyMiAxNyAxNyAxMyAxNyAxMyA3IDE3IDcgMTIgMiA3IDcgMTEgNyAxMSAxN3pcIixcbiAgXCJmaWxsZWQtcGluXCI6XG4gICAgXCJNMTUsMTEuNTg2VjZoMlY0YzAtMS4xMDQtMC44OTYtMi0yLTJIOUM3Ljg5NiwyLDcsMi44OTYsNyw0djJoMnY1LjU4NmwtMi43MDcsMS43MDdDNi4xMDUsMTMuNDgsNiwxMy43MzQsNiwxNHYyIGMwLDAuNTUzLDAuNDQ4LDEsMSwxaDJoMnYzbDEsMmwxLTJ2LTNoNGMwLjU1MywwLDEtMC40NDcsMS0xdi0yYzAtMC4yNjYtMC4xMDUtMC41Mi0wLjI5My0wLjcwN0wxNSwxMS41ODZ6XCIsXG4gIGZvbGRlcjpcbiAgICBcIk0yMCw1aC04LjU4Nkw5LjcwNywzLjI5M0M5LjUyLDMuMTA1LDkuMjY1LDMsOSwzSDRDMi44OTcsMywyLDMuODk3LDIsNXYxNGMwLDEuMTAzLDAuODk3LDIsMiwyaDE2YzEuMTAzLDAsMi0wLjg5NywyLTJWNyBDMjIsNS44OTcsMjEuMTAzLDUsMjAsNXogTTQsMTlWN2g3aDFoOGwwLjAwMiwxMkg0elwiLFxuICBcImZvcndhcmQtYXJyb3dcIjpcbiAgICBcIk0xMC43MDcgMTcuNzA3TDE2LjQxNCAxMiAxMC43MDcgNi4yOTMgOS4yOTMgNy43MDcgMTMuNTg2IDEyIDkuMjkzIDE2LjI5M3pcIixcbiAgZ2VhcjogW1xuICAgIFwiTTEyLDE2YzIuMjA2LDAsNC0xLjc5NCw0LTRzLTEuNzk0LTQtNC00cy00LDEuNzk0LTQsNFM5Ljc5NCwxNiwxMiwxNnogTTEyLDEwYzEuMDg0LDAsMiwwLjkxNiwyLDJzLTAuOTE2LDItMiwyIHMtMi0wLjkxNi0yLTJTMTAuOTE2LDEwLDEyLDEwelwiLFxuICAgIFwiTTIuODQ1LDE2LjEzNmwxLDEuNzNjMC41MzEsMC45MTcsMS44MDksMS4yNjEsMi43MywwLjczbDAuNTI5LTAuMzA2QzcuNjg2LDE4Ljc0Nyw4LjMyNSwxOS4xMjIsOSwxOS40MDJWMjAgYzAsMS4xMDMsMC44OTcsMiwyLDJoMmMxLjEwMywwLDItMC44OTcsMi0ydi0wLjU5OGMwLjY3NS0wLjI4LDEuMzE0LTAuNjU1LDEuODk2LTEuMTExbDAuNTI5LDAuMzA2IGMwLjkyMywwLjUzLDIuMTk4LDAuMTg4LDIuNzMxLTAuNzMxbDAuOTk5LTEuNzI5YzAuNTUyLTAuOTU1LDAuMjI0LTIuMTgxLTAuNzMxLTIuNzMybC0wLjUwNS0wLjI5MkMxOS45NzMsMTIuNzQyLDIwLDEyLjM3MSwyMCwxMiBzLTAuMDI3LTAuNzQzLTAuMDgxLTEuMTExbDAuNTA1LTAuMjkyYzAuOTU1LTAuNTUyLDEuMjgzLTEuNzc3LDAuNzMxLTIuNzMybC0wLjk5OS0xLjcyOWMtMC41MzEtMC45Mi0xLjgwOC0xLjI2NS0yLjczMS0wLjczMiBsLTAuNTI5LDAuMzA2QzE2LjMxNCw1LjI1MywxNS42NzUsNC44NzgsMTUsNC41OThWNGMwLTEuMTAzLTAuODk3LTItMi0yaC0yQzkuODk3LDIsOSwyLjg5Nyw5LDR2MC41OTggYy0wLjY3NSwwLjI4LTEuMzE0LDAuNjU1LTEuODk2LDEuMTExTDYuNTc1LDUuNDAzYy0wLjkyNC0wLjUzMS0yLjItMC4xODctMi43MzEsMC43MzJMMi44NDUsNy44NjQgYy0wLjU1MiwwLjk1NS0wLjIyNCwyLjE4MSwwLjczMSwyLjczMmwwLjUwNSwwLjI5MkM0LjAyNywxMS4yNTcsNCwxMS42MjksNCwxMnMwLjAyNywwLjc0MiwwLjA4MSwxLjExMWwtMC41MDUsMC4yOTIgQzIuNjIxLDEzLjk1NSwyLjI5MywxNS4xODEsMi44NDUsMTYuMTM2eiBNNi4xNzEsMTMuMzc4QzYuMDU4LDEyLjkyNSw2LDEyLjQ2MSw2LDEyYzAtMC40NjIsMC4wNTgtMC45MjYsMC4xNy0xLjM3OCBjMC4xMDgtMC40MzMtMC4wODMtMC44ODUtMC40Ny0xLjEwOEw0LjU3Nyw4Ljg2NGwwLjk5OC0xLjcyOUw2LjcyLDcuNzk3YzAuMzg0LDAuMjIxLDAuODY3LDAuMTY1LDEuMTg4LTAuMTQyIGMwLjY4My0wLjY0NywxLjUwNy0xLjEzMSwyLjM4NC0xLjM5OUMxMC43MTMsNi4xMjgsMTEsNS43MzksMTEsNS4zVjRoMnYxLjNjMCwwLjQzOSwwLjI4NywwLjgyOCwwLjcwOCwwLjk1NiBjMC44NzcsMC4yNjksMS43MDEsMC43NTIsMi4zODQsMS4zOTljMC4zMjEsMC4zMDcsMC44MDYsMC4zNjIsMS4xODgsMC4xNDJsMS4xNDQtMC42NjFsMSwxLjcyOUwxOC4zLDkuNTE0IGMtMC4zODcsMC4yMjQtMC41NzgsMC42NzYtMC40NywxLjEwOEMxNy45NDIsMTEuMDc0LDE4LDExLjUzOCwxOCwxMmMwLDAuNDYxLTAuMDU4LDAuOTI1LTAuMTcxLDEuMzc4IGMtMC4xMDcsMC40MzMsMC4wODQsMC44ODUsMC40NzEsMS4xMDhsMS4xMjMsMC42NDlsLTAuOTk4LDEuNzI5bC0xLjE0NS0wLjY2MWMtMC4zODMtMC4yMjEtMC44NjctMC4xNjYtMS4xODgsMC4xNDIgYy0wLjY4MywwLjY0Ny0xLjUwNywxLjEzMS0yLjM4NCwxLjM5OUMxMy4yODcsMTcuODcyLDEzLDE4LjI2MSwxMywxOC43bDAuMDAyLDEuM0gxMXYtMS4zYzAtMC40MzktMC4yODctMC44MjgtMC43MDgtMC45NTYgYy0wLjg3Ny0wLjI2OS0xLjcwMS0wLjc1Mi0yLjM4NC0xLjM5OWMtMC4xOS0wLjE4Mi0wLjQzOC0wLjI3NS0wLjY4OC0wLjI3NWMtMC4xNzIsMC0wLjM0NCwwLjA0NC0wLjUsMC4xMzRsLTEuMTQ0LDAuNjYybC0xLTEuNzI5IEw1LjcsMTQuNDg2QzYuMDg3LDE0LjI2Myw2LjI3OCwxMy44MTEsNi4xNzEsMTMuMzc4elwiLFxuICBdLFxuICBcImdvLXRvLWZpbGVcIjpcbiAgICBcIk0xMy43MDcsMi4yOTNDMTMuNTIsMi4xMDUsMTMuMjY2LDIsMTMsMkg2QzQuODk3LDIsNCwyLjg5Nyw0LDR2MTZjMCwxLjEwMywwLjg5NywyLDIsMmgxMmMxLjEwMywwLDItMC44OTcsMi0yVjkgYzAtMC4yNjYtMC4xMDUtMC41Mi0wLjI5My0wLjcwN0wxMy43MDcsMi4yOTN6IE02LDRoNi41ODZMMTgsOS40MTRsMC4wMDIsOS4xNzRsLTIuNTY4LTIuNTY4QzE1Ljc4NCwxNS40MjUsMTYsMTQuNzM5LDE2LDE0IGMwLTIuMjA2LTEuNzk0LTQtNC00cy00LDEuNzk0LTQsNHMxLjc5NCw0LDQsNGMwLjczOSwwLDEuNDI1LTAuMjE2LDIuMDItMC41NjZMMTYuNTg2LDIwSDZWNHogTTEyLDE2Yy0xLjEwMywwLTItMC44OTctMi0yIHMwLjg5Ny0yLDItMnMyLDAuODk3LDIsMlMxMy4xMDMsMTYsMTIsMTZ6XCIsXG4gIGhhc2h0YWc6XG4gICAgXCJNMTYuMDE4LDMuODE1TDE1LjIzMiw4aC00Ljk2NmwwLjcxNi0zLjgxNUw5LjAxOCwzLjgxNUw4LjIzMiw4SDR2MmgzLjg1N2wtMC43NTEsNEgzdjJoMy43MzFsLTAuNzE0LDMuODA1bDEuOTY1LDAuMzY5IEw4Ljc2NiwxNmg0Ljk2NmwtMC43MTQsMy44MDVsMS45NjUsMC4zNjlMMTUuNzY2LDE2SDIwdi0yaC0zLjg1OWwwLjc1MS00SDIxVjhoLTMuNzMzbDAuNzE2LTMuODE1TDE2LjAxOCwzLjgxNXogTTE0LjEwNiwxNEg5LjE0MSBsMC43NTEtNGg0Ljk2NkwxNC4xMDYsMTR6XCIsXG4gIGhlbHA6IFtcbiAgICBcIk0xMiA2QzkuODMxIDYgOC4wNjYgNy43NjUgOC4wNjYgOS45MzRoMkMxMC4wNjYgOC44NjcgMTAuOTM0IDggMTIgOHMxLjkzNC44NjcgMS45MzQgMS45MzRjMCAuNTk4LS40ODEgMS4wMzItMS4yMTYgMS42MjYtLjI1NS4yMDctLjQ5Ni40MDQtLjY5MS41OTlDMTEuMDI5IDEzLjE1NiAxMSAxNC4yMTUgMTEgMTQuMzMzVjE1aDJsLS4wMDEtLjYzM2MuMDAxLS4wMTYuMDMzLS4zODYuNDQxLS43OTMuMTUtLjE1LjMzOS0uMy41MzUtLjQ1OC43NzktLjYzMSAxLjk1OC0xLjU4NCAxLjk1OC0zLjE4MkMxNS45MzQgNy43NjUgMTQuMTY5IDYgMTIgNnpNMTEgMTZIMTNWMThIMTF6XCIsXG4gICAgXCJNMTIsMkM2LjQ4NiwyLDIsNi40ODYsMiwxMnM0LjQ4NiwxMCwxMCwxMHMxMC00LjQ4NiwxMC0xMFMxNy41MTQsMiwxMiwyeiBNMTIsMjBjLTQuNDExLDAtOC0zLjU4OS04LThzMy41ODktOCw4LTggczgsMy41ODksOCw4UzE2LjQxMSwyMCwxMiwyMHpcIixcbiAgXSxcbiAgXCJob3Jpem9udGFsLXNwbGl0XCI6IFwiTTE3IDExTDcgMTEgNyA3IDIgMTIgNyAxNyA3IDEzIDE3IDEzIDE3IDE3IDIyIDEyIDE3IDd6XCIsXG4gIFwiaW1hZ2UtZmlsZVwiOiBbXG4gICAgXCJNMjAsMkg4QzYuODk3LDIsNiwyLjg5Nyw2LDR2MTJjMCwxLjEwMywwLjg5NywyLDIsMmgxMmMxLjEwMywwLDItMC44OTcsMi0yVjRDMjIsMi44OTcsMjEuMTAzLDIsMjAsMnogTTgsMTZWNGgxMiBsMC4wMDIsMTJIOHpcIixcbiAgICBcIk00LDhIMnYxMmMwLDEuMTAzLDAuODk3LDIsMiwyaDEydi0ySDRWOHpcIixcbiAgICBcIk0xMiAxMkwxMSAxMSA5IDE0IDE5IDE0IDE1IDh6XCIsXG4gIF0sXG4gIGluZm86XG4gICAgXCJNMTIsMkM2LjQ4NiwyLDIsNi40ODYsMiwxMnM0LjQ4NiwxMCwxMCwxMHMxMC00LjQ4NiwxMC0xMFMxNy41MTQsMiwxMiwyeiBNMTIsMjBjLTQuNDExLDAtOC0zLjU4OS04LThzMy41ODktOCw4LTggczgsMy41ODksOCw4UzE2LjQxMSwyMCwxMiwyMHpcIixcbiAgaW5zdGFsbDogXCJcIixcbiAgbGFuZ3VhZ2VzOiBcIlwiLFxuICBcImxlZnQtYXJyb3ctd2l0aC10YWlsXCI6XG4gICAgXCJNMTMuMjkzIDYuMjkzTDcuNTg2IDEyIDEzLjI5MyAxNy43MDcgMTQuNzA3IDE2LjI5MyAxMC40MTQgMTIgMTQuNzA3IDcuNzA3elwiLFxuICBcImxlZnQtYXJyb3dcIjpcbiAgICBcIk0xMy4yOTMgNi4yOTNMNy41ODYgMTIgMTMuMjkzIDE3LjcwNyAxNC43MDcgMTYuMjkzIDEwLjQxNCAxMiAxNC43MDcgNy43MDd6XCIsXG4gIFwibGluZXMtb2YtdGV4dFwiOlxuICAgIFwiTTIwLDNINEMyLjg5NywzLDIsMy44OTcsMiw1djExYzAsMS4xMDMsMC44OTcsMiwyLDJoN3YySDh2MmgzaDJoM3YtMmgtM3YtMmg3YzEuMTAzLDAsMi0wLjg5NywyLTJWNSBDMjIsMy44OTcsMjEuMTAzLDMsMjAsM3ogTTQsMTRWNWgxNmwwLjAwMiw5SDR6XCIsXG4gIGxpbms6IFtcbiAgICBcIk04LjQ2NSwxMS4yOTNjMS4xMzMtMS4xMzMsMy4xMDktMS4xMzMsNC4yNDIsMEwxMy40MTQsMTJsMS40MTQtMS40MTRsLTAuNzA3LTAuNzA3Yy0wLjk0My0wLjk0NC0yLjE5OS0xLjQ2NS0zLjUzNS0xLjQ2NSBTNy45OTQsOC45MzUsNy4wNTEsOS44NzlMNC45MjksMTJjLTEuOTQ4LDEuOTQ5LTEuOTQ4LDUuMTIyLDAsNy4wNzFjMC45NzUsMC45NzUsMi4yNTUsMS40NjIsMy41MzUsMS40NjIgYzEuMjgxLDAsMi41NjItMC40ODcsMy41MzYtMS40NjJsMC43MDctMC43MDdsLTEuNDE0LTEuNDE0bC0wLjcwNywwLjcwN2MtMS4xNywxLjE2Ny0zLjA3MywxLjE2OS00LjI0MywwIGMtMS4xNjktMS4xNy0xLjE2OS0zLjA3MywwLTQuMjQzTDguNDY1LDExLjI5M3pcIixcbiAgICBcIk0xMiw0LjkyOWwtMC43MDcsMC43MDdsMS40MTQsMS40MTRsMC43MDctMC43MDdjMS4xNjktMS4xNjcsMy4wNzItMS4xNjksNC4yNDMsMGMxLjE2OSwxLjE3LDEuMTY5LDMuMDczLDAsNC4yNDMgbC0yLjEyMiwyLjEyMWMtMS4xMzMsMS4xMzMtMy4xMDksMS4xMzMtNC4yNDIsMEwxMC41ODYsMTJsLTEuNDE0LDEuNDE0bDAuNzA3LDAuNzA3YzAuOTQzLDAuOTQ0LDIuMTk5LDEuNDY1LDMuNTM1LDEuNDY1IHMyLjU5Mi0wLjUyMSwzLjUzNS0xLjQ2NUwxOS4wNzEsMTJjMS45NDgtMS45NDksMS45NDgtNS4xMjIsMC03LjA3MUMxNy4xMjEsMi45NzksMTMuOTQ4LDIuOTgsMTIsNC45Mjl6XCIsXG4gIF0sXG4gIFwibWFnbmlmeWluZy1nbGFzc1wiOlxuICAgIFwiTTE5LjAyMywxNi45NzdjLTAuNTEzLTAuNDg4LTEuMDA0LTAuOTk3LTEuMzY3LTEuMzg0Yy0wLjM3Mi0wLjM3OC0wLjU5Ni0wLjY1My0wLjU5Ni0wLjY1M2wtMi44LTEuMzM3IEMxNS4zNCwxMi4zNywxNiwxMC43NjMsMTYsOWMwLTMuODU5LTMuMTQtNy03LTdTMiw1LjE0MSwyLDlzMy4xNCw3LDcsN2MxLjc2MywwLDMuMzctMC42Niw0LjYwMy0xLjczOWwxLjMzNywyLjggYzAsMCwwLjI3NSwwLjIyNCwwLjY1MywwLjU5NmMwLjM4NywwLjM2MywwLjg5NiwwLjg1NCwxLjM4NCwxLjM2N2MwLjQ5NCwwLjUwNiwwLjk4OCwxLjAxMiwxLjM1OCwxLjM5MiBjMC4zNjIsMC4zODgsMC42MDQsMC42NDYsMC42MDQsMC42NDZsMi4xMjEtMi4xMjFjMCwwLTAuMjU4LTAuMjQyLTAuNjQ2LTAuNjA0QzIwLjAzNSwxNy45NjUsMTkuNTI5LDE3LjQ3MSwxOS4wMjMsMTYuOTc3eiBNOSwxNCBjLTIuNzU3LDAtNS0yLjI0My01LTVzMi4yNDMtNSw1LTVzNSwyLjI0Myw1LDVTMTEuNzU3LDE0LDksMTR6XCIsXG4gIFwibWljcm9waG9uZS1maWxsZWRcIjpcbiAgICBcIk0xMiwxNmMyLjIwNiwwLDQtMS43OTQsNC00VjZjMC0yLjIxNy0xLjc4NS00LjAyMS0zLjk3OS00LjAyMWMtMC4wNjksMC0wLjE0LDAuMDA5LTAuMjA5LDAuMDI1QzkuNjkzLDIuMTA0LDgsMy44NTcsOCw2djYgQzgsMTQuMjA2LDkuNzk0LDE2LDEyLDE2elwiLFxuICBtaWNyb3Bob25lOlxuICAgIFwiTTE2LDEyVjZjMC0yLjIxNy0xLjc4NS00LjAyMS0zLjk3OS00LjAyMWMtMC4wNjksMC0wLjE0LDAuMDA5LTAuMjA5LDAuMDI1QzkuNjkzLDIuMTA0LDgsMy44NTcsOCw2djZjMCwyLjIwNiwxLjc5NCw0LDQsNCBTMTYsMTQuMjA2LDE2LDEyeiBNMTAsMTJWNmMwLTEuMTAzLDAuODk3LTIsMi0yYzAuMDU1LDAsMC4xMDktMC4wMDUsMC4xNjMtMC4wMTVDMTMuMTg4LDQuMDYsMTQsNC45MzUsMTQsNnY2YzAsMS4xMDMtMC44OTcsMi0yLDIgUzEwLDEzLjEwMywxMCwxMnpcIixcbiAgXCJvcGVuLXZhdWx0XCI6XG4gICAgXCJNMTksMi4wMUg2Yy0xLjIwNiwwLTMsMC43OTktMywzdjN2NnYzdjJjMCwyLjIwMSwxLjc5NCwzLDMsM2gxNXYtMkg2LjAxMkM1LjU1LDE5Ljk5OCw1LDE5LjgxNSw1LDE5LjAxIGMwLTAuMTAxLDAuMDA5LTAuMTkxLDAuMDI0LTAuMjczYzAuMTEyLTAuNTc1LDAuNTgzLTAuNzE3LDAuOTg3LTAuNzI3SDIwYzAuMDE4LDAsMC4wMzEtMC4wMDksMC4wNDktMC4wMUgyMXYtMC45OVYxNVY0LjAxIEMyMSwyLjkwNywyMC4xMDMsMi4wMSwxOSwyLjAxeiBNMTksMTYuMDFINXYtMnYtNnYtM2MwLTAuODA2LDAuNTUtMC45ODgsMS0xaDd2N2wyLTFsMiwxdi03aDJWMTVWMTYuMDF6XCIsXG4gIFwicGFuZS1sYXlvdXRcIjogXCJcIixcbiAgXCJwYXBlci1wbGFuZVwiOlxuICAgIFwiTTIwLjU2MywzLjM0Yy0wLjI5Mi0wLjE5OS0wLjY2Ny0wLjIyOS0wLjk4OS0wLjA3OWwtMTcsOEMyLjIxOSwxMS40MjksMS45OTUsMTEuNzg4LDIsMTIuMTggYzAuMDA2LDAuMzkyLDAuMjQsMC43NDUsMC42LDAuOTAyTDgsMTUuNDQ1djYuNzIybDUuODM2LTQuMTY4bDQuNzY0LDIuMDg0YzAuMTI4LDAuMDU3LDAuMjY1LDAuMDg0LDAuNCwwLjA4NCBjMC4xODEsMCwwLjM2LTAuMDQ5LDAuNTItMC4xNDZjMC4yNzgtMC4xNjksMC40NTctMC40NjMsMC40NzktMC43ODhsMS0xNUMyMS4wMjEsMy44NzksMjAuODU2LDMuNTQsMjAuNTYzLDMuMzR6IE0xOC4wOTcsMTcuNjggbC01LjI2OS0yLjMwNkwxNiw5LjE2N2wtNy42NDksNC4yNWwtMi45MzItMS4yODNMMTguODksNS43OTRMMTguMDk3LDE3LjY4elwiLFxuICBwYXVzZWQ6IFwiXCIsXG4gIFwicGRmLWZpbGVcIjpcbiAgICBcIk04LjI2NyAxNC42OGMtLjE4NCAwLS4zMDguMDE4LS4zNzIuMDM2djEuMTc4Yy4wNzYuMDE4LjE3MS4wMjMuMzAyLjAyMy40NzkgMCAuNzc0LS4yNDIuNzc0LS42NTFDOC45NzEgMTQuOSA4LjcxNyAxNC42OCA4LjI2NyAxNC42OHpNMTEuNzU0IDE0LjY5MmMtLjIgMC0uMzMuMDE4LS40MDcuMDM2djIuNjFjLjA3Ny4wMTguMjAxLjAxOC4zMTMuMDE4LjgxNy4wMDYgMS4zNDktLjQ0NCAxLjM0OS0xLjM5NkMxMy4wMTUgMTUuMTMgMTIuNTMgMTQuNjkyIDExLjc1NCAxNC42OTJ6XCIsXG4gIHBlbmNpbDpcbiAgICBcIk0xOS4wNDUgNy40MDFjLjM3OC0uMzc4LjU4Ni0uODguNTg2LTEuNDE0cy0uMjA4LTEuMDM2LS41ODYtMS40MTRsLTEuNTg2LTEuNTg2Yy0uMzc4LS4zNzgtLjg4LS41ODYtMS40MTQtLjU4NnMtMS4wMzYuMjA4LTEuNDEzLjU4NUw0IDEzLjU4NVYxOGg0LjQxM0wxOS4wNDUgNy40MDF6TTE2LjA0NSA0LjQwMWwxLjU4NyAxLjU4NS0xLjU5IDEuNTg0LTEuNTg2LTEuNTg1TDE2LjA0NSA0LjQwMXpNNiAxNnYtMS41ODVsNy4wNC03LjAxOCAxLjU4NiAxLjU4Nkw3LjU4NyAxNkg2ek00IDIwSDIwVjIySDR6XCIsXG4gIHBpbjpcbiAgICBcIk0xMiwyMmwxLTJ2LTNoNWMwLjU1MywwLDEtMC40NDcsMS0xdi0xLjU4NmMwLTAuNTI2LTAuMjE0LTEuMDQyLTAuNTg2LTEuNDE0TDE3LDExLjU4NlY4YzAuNTUzLDAsMS0wLjQ0NywxLTFWNCBjMC0xLjEwMy0wLjg5Ny0yLTItMkg4QzYuODk3LDIsNiwyLjg5Nyw2LDR2M2MwLDAuNTUzLDAuNDQ4LDEsMSwxdjMuNTg2TDUuNTg2LDEzQzUuMjEzLDEzLjM3Miw1LDEzLjg4OCw1LDE0LjQxNFYxNiBjMCwwLjU1MywwLjQ0OCwxLDEsMWg1djNMMTIsMjJ6IE04LDRoOHYySDhWNHogTTcsMTQuNDE0bDEuNzA3LTEuNzA3QzguODk1LDEyLjUyLDksMTIuMjY2LDksMTJWOGg2djQgYzAsMC4yNjYsMC4xMDUsMC41MiwwLjI5MywwLjcwN0wxNywxNC40MTRWMTVIN1YxNC40MTR6XCIsXG4gIFwicG9wdXAtb3BlblwiOiBbXG4gICAgXCJNMjAsM0g0QzIuODk3LDMsMiwzLjg5NywyLDV2MTRjMCwxLjEwMywwLjg5NywyLDIsMmg1di0ySDRWN2gxNnYxMmgtNXYyaDVjMS4xMDMsMCwyLTAuODk3LDItMlY1QzIyLDMuODk3LDIxLjEwMywzLDIwLDN6XCIsXG4gICAgXCJNMTMgMjFMMTMgMTYgMTYgMTYgMTIgMTEgOCAxNiAxMSAxNiAxMSAyMXpcIixcbiAgXSxcbiAgcHJlc2VudGF0aW9uOiBcIlwiLFxuICByZXNldDogW1xuICAgIFwiTTEyLDE2YzEuNjcxLDAsMy0xLjMzMSwzLTNzLTEuMzI5LTMtMy0zcy0zLDEuMzMxLTMsM1MxMC4zMjksMTYsMTIsMTZ6XCIsXG4gICAgXCJNMjAuODE3LDExLjE4NmMtMC4xMi0wLjU4My0wLjI5Ny0xLjE1MS0wLjUyNS0xLjY4OGMtMC4yMjUtMC41MzItMC41MDQtMS4wNDYtMC44My0xLjUzMSBjLTAuMzI0LTAuNDc5LTAuNjkzLTAuOTI2LTEuMDk4LTEuMzI5Yy0wLjQwNC0wLjQwNi0wLjg1My0wLjc3Ni0xLjMzMi0xLjEwMWMtMC40ODMtMC4zMjYtMC45OTgtMC42MDQtMS41MjgtMC44MjkgYy0wLjUzOC0wLjIyOS0xLjEwNi0wLjQwNS0xLjY5MS0wLjUyNmMtMC42LTAuMTIzLTEuMjE5LTAuMTgyLTEuODM4LTAuMThWMkw4LDVsMy45NzUsM1Y2LjAwMkMxMi40NTksNiwxMi45NDMsNi4wNDYsMTMuNDEsNi4xNDIgYzAuNDU0LDAuMDk0LDAuODk2LDAuMjMxLDEuMzE0LDAuNDA5YzAuNDEzLDAuMTc0LDAuODEzLDAuMzkyLDEuMTg4LDAuNjQ0YzAuMzczLDAuMjUyLDAuNzIyLDAuNTQsMS4wMzgsMC44NTcgYzAuMzE1LDAuMzE0LDAuNjA0LDAuNjYzLDAuODU0LDEuMDM1YzAuMjU0LDAuMzc2LDAuNDcxLDAuNzc2LDAuNjQ2LDEuMTkxYzAuMTc4LDAuNDE3LDAuMzE0LDAuODU5LDAuNDA4LDEuMzExIEMxOC45NTIsMTIuMDQ4LDE5LDEyLjUyMywxOSwxM3MtMC4wNDgsMC45NTItMC4xNDIsMS40MWMtMC4wOTQsMC40NTQtMC4yMywwLjg5Ni0wLjQwOCwxLjMxNSBjLTAuMTc1LDAuNDEzLTAuMzkyLDAuODEzLTAuNjQ0LDEuMTg4Yy0wLjI1MywwLjM3My0wLjU0MiwwLjcyMi0wLjg1OCwxLjAzOWMtMC4zMTUsMC4zMTYtMC42NjMsMC42MDMtMS4wMzYsMC44NTQgYy0wLjM3MiwwLjI1MS0wLjc3MSwwLjQ2OC0xLjE4OSwwLjY0NWMtMC40MTcsMC4xNzctMC44NTgsMC4zMTQtMS4zMTEsMC40MDhjLTAuOTIsMC4xODgtMS45MDYsMC4xODgtMi44MjIsMCBjLTAuNDU0LTAuMDk0LTAuODk2LTAuMjMxLTEuMzE0LTAuNDA5Yy0wLjQxNi0wLjE3Ni0wLjgxNS0wLjM5My0xLjE4OS0wLjY0NWMtMC4zNzEtMC4yNS0wLjcxOS0wLjUzOC0xLjAzNS0wLjg1NCBjLTAuMzE1LTAuMzE2LTAuNjA0LTAuNjY1LTAuODU1LTEuMDM2Yy0wLjI1NC0wLjM3Ni0wLjQ3MS0wLjc3Ni0wLjY0Ni0xLjE5Yy0wLjE3OC0wLjQxOC0wLjMxNC0wLjg2LTAuNDA4LTEuMzEyIEM1LjA0OCwxMy45NTIsNSwxMy40NzcsNSwxM0gzYzAsMC42MTEsMC4wNjIsMS4yMjEsMC4xODMsMS44MTRjMC4xMiwwLjU4MiwwLjI5NywxLjE1LDAuNTI1LDEuNjg5IGMwLjIyNSwwLjUzMiwwLjUwNCwxLjA0NiwwLjgzMSwxLjUzMWMwLjMyMywwLjQ3NywwLjY5MiwwLjkyNCwxLjA5NywxLjMyOWMwLjQwNiwwLjQwNywwLjg1NCwwLjc3NywxLjMzMSwxLjA5OSBjMC40NzksMC4zMjUsMC45OTQsMC42MDQsMS41MjksMC44M2MwLjUzOCwwLjIyOSwxLjEwNiwwLjQwNSwxLjY5MSwwLjUyNkMxMC43NzksMjEuOTM4LDExLjM4OSwyMiwxMiwyMnMxLjIyMS0wLjA2MiwxLjgxNC0wLjE4MyBjMC41ODMtMC4xMjEsMS4xNTEtMC4yOTcsMS42ODgtMC41MjVjMC41MzctMC4yMjcsMS4wNTItMC41MDYsMS41My0wLjgzYzAuNDc4LTAuMzIyLDAuOTI2LTAuNjkyLDEuMzMxLTEuMDk5IGMwLjQwNS0wLjQwNSwwLjc3NC0wLjg1MywxLjEtMS4zMzJjMC4zMjUtMC40ODMsMC42MDQtMC45OTgsMC44MjktMS41MjhjMC4yMjktMC41NCwwLjQwNS0xLjEwOCwwLjUyNS0xLjY5MiBDMjAuOTM4LDE0LjIyMSwyMSwxMy42MTEsMjEsMTNTMjAuOTM4LDExLjc3OSwyMC44MTcsMTEuMTg2elwiLFxuICBdLFxuICBcInJpZ2h0LWFycm93LXdpdGgtdGFpbFwiOlxuICAgIFwiTTEwLjcwNyAxNy43MDdMMTYuNDE0IDEyIDEwLjcwNyA2LjI5MyA5LjI5MyA3LjcwNyAxMy41ODYgMTIgOS4yOTMgMTYuMjkzelwiLFxuICBcInJpZ2h0LWFycm93XCI6XG4gICAgXCJNMTAuNzA3IDE3LjcwN0wxNi40MTQgMTIgMTAuNzA3IDYuMjkzIDkuMjkzIDcuNzA3IDEzLjU4NiAxMiA5LjI5MyAxNi4yOTN6XCIsXG4gIFwicmlnaHQtdHJpYW5nbGVcIjpcbiAgICBcIk0xMC43MDcgMTcuNzA3TDE2LjQxNCAxMiAxMC43MDcgNi4yOTMgOS4yOTMgNy43MDcgMTMuNTg2IDEyIDkuMjkzIDE2LjI5M3pcIixcbiAgc2VhcmNoOlxuICAgIFwiTTE5LjAyMywxNi45NzdjLTAuNTEzLTAuNDg4LTEuMDA0LTAuOTk3LTEuMzY3LTEuMzg0Yy0wLjM3Mi0wLjM3OC0wLjU5Ni0wLjY1My0wLjU5Ni0wLjY1M2wtMi44LTEuMzM3IEMxNS4zNCwxMi4zNywxNiwxMC43NjMsMTYsOWMwLTMuODU5LTMuMTQtNy03LTdTMiw1LjE0MSwyLDlzMy4xNCw3LDcsN2MxLjc2MywwLDMuMzctMC42Niw0LjYwMy0xLjczOWwxLjMzNywyLjggYzAsMCwwLjI3NSwwLjIyNCwwLjY1MywwLjU5NmMwLjM4NywwLjM2MywwLjg5NiwwLjg1NCwxLjM4NCwxLjM2N2MwLjQ5NCwwLjUwNiwwLjk4OCwxLjAxMiwxLjM1OCwxLjM5MiBjMC4zNjIsMC4zODgsMC42MDQsMC42NDYsMC42MDQsMC42NDZsMi4xMjEtMi4xMjFjMCwwLTAuMjU4LTAuMjQyLTAuNjQ2LTAuNjA0QzIwLjAzNSwxNy45NjUsMTkuNTI5LDE3LjQ3MSwxOS4wMjMsMTYuOTc3eiBNOSwxNCBjLTIuNzU3LDAtNS0yLjI0My01LTVzMi4yNDMtNSw1LTVzNSwyLjI0Myw1LDVTMTEuNzU3LDE0LDksMTR6XCIsXG4gIFwic2hlZXRzLWluLWJveFwiOiBcIlwiLFxuICBcInN0YXItbGlzdFwiOlxuICAgIFwiTTE5IDE1TDE5IDEyIDE3IDEyIDE3IDE1IDE0Ljc4IDE1IDE0IDE1IDE0IDE3IDE0Ljc4IDE3IDE3IDE3IDE3IDIwIDE5IDIwIDE5IDE3IDIxLjA2MyAxNyAyMiAxNyAyMiAxNSAyMS4wNjMgMTV6TTQgN0gxNVY5SDR6TTQgMTFIMTVWMTNINHpNNCAxNUgxMlYxN0g0elwiLFxuICBzdGFyOlxuICAgIFwiTTYuNTE2LDE0LjMyM2wtMS40OSw2LjQ1MmMtMC4wOTIsMC4zOTksMC4wNjgsMC44MTQsMC40MDYsMS4wNDdDNS42MDMsMjEuOTQsNS44MDEsMjIsNiwyMiBjMC4xOTMsMCwwLjM4Ny0wLjA1NiwwLjU1NS0wLjE2OEwxMiwxOC4yMDJsNS40NDUsMy42M2MwLjM0OCwwLjIzMiwwLjgwNSwwLjIyMywxLjE0NS0wLjAyNGMwLjMzOC0wLjI0NywwLjQ4Ny0wLjY4LDAuMzcyLTEuMDgyIGwtMS44MjktNi40bDQuNTM2LTQuMDgyYzAuMjk3LTAuMjY4LDAuNDA2LTAuNjg2LDAuMjc4LTEuMDY0Yy0wLjEyOS0wLjM3OC0wLjQ3LTAuNjQ0LTAuODY4LTAuNjc2TDE1LjM3OCw4LjA1bC0yLjQ2Ny01LjQ2MSBDMTIuNzUsMi4yMywxMi4zOTMsMiwxMiwycy0wLjc1LDAuMjMtMC45MTEsMC41ODlMOC42MjIsOC4wNUwyLjkyMSw4LjUwM0MyLjUyOSw4LjUzNCwyLjE5Miw4Ljc5MSwyLjA2LDkuMTYgYy0wLjEzNCwwLjM2OS0wLjAzOCwwLjc4MiwwLjI0MiwxLjA1Nkw2LjUxNiwxNC4zMjN6IE05LjM2OSw5Ljk5N2MwLjM2My0wLjAyOSwwLjY4My0wLjI1MywwLjgzMi0wLjU4NkwxMiw1LjQzbDEuNzk5LDMuOTgxIGMwLjE0OSwwLjMzMywwLjQ2OSwwLjU1NywwLjgzMiwwLjU4NmwzLjk3MiwwLjMxNWwtMy4yNzEsMi45NDRjLTAuMjg0LDAuMjU2LTAuMzk3LDAuNjUtMC4yOTMsMS4wMThsMS4yNTMsNC4zODVsLTMuNzM2LTIuNDkxIGMtMC4zMzYtMC4yMjUtMC43NzMtMC4yMjUtMS4xMDksMGwtMy45MDQsMi42MDNsMS4wNS00LjU0NmMwLjA3OC0wLjM0LTAuMDI2LTAuNjk3LTAuMjc2LTAuOTRsLTMuMDM4LTIuOTYyTDkuMzY5LDkuOTk3elwiLFxuICBzd2l0Y2g6XG4gICAgXCJNMTkgN2MwLS41NTMtLjQ0Ny0xLTEtMWgtOHYyaDd2NWgtM2wzLjk2OSA1TDIyIDEzaC0zVjd6TTUgMTdjMCAuNTUzLjQ0NyAxIDEgMWg4di0ySDd2LTVoM0w2IDZsLTQgNWgzVjE3elwiLFxuICBcInN5bmMtc21hbGxcIjogXCJcIixcbiAgc3luYzogXCJcIixcbiAgXCJ0aHJlZS1ob3Jpem9udGFsLWJhcnNcIjogXCJNNCA2SDIwVjhINHpNNCAxMUgyMFYxM0g0ek00IDE2SDIwVjE4SDR6XCIsXG4gIHRyYXNoOiBbXG4gICAge1xuICAgICAgZmlsbDogXCJub25lXCIsXG4gICAgICBkOlxuICAgICAgICBcIk0xNy4wMDQgMjBMMTcuMDAzIDhoLTEtOC0xdjEySDE3LjAwNHpNMTMuMDAzIDEwaDJ2OGgtMlYxMHpNOS4wMDMgMTBoMnY4aC0yVjEwek05LjAwMyA0SDE1LjAwM1Y2SDkuMDAzelwiLFxuICAgIH0sXG4gICAgXCJNNS4wMDMsMjBjMCwxLjEwMywwLjg5NywyLDIsMmgxMGMxLjEwMywwLDItMC44OTcsMi0yVjhoMlY2aC0zaC0xVjRjMC0xLjEwMy0wLjg5Ny0yLTItMmgtNmMtMS4xMDMsMC0yLDAuODk3LTIsMnYyaC0xaC0zIHYyaDJWMjB6IE05LjAwMyw0aDZ2MmgtNlY0eiBNOC4wMDMsOGg4aDFsMC4wMDEsMTJINy4wMDNWOEg4LjAwM3pcIixcbiAgICBcIk05LjAwMyAxMEgxMS4wMDNWMThIOS4wMDN6TTEzLjAwMyAxMEgxNS4wMDNWMThIMTMuMDAzelwiLFxuICBdLFxuICBcInR3by1jb2x1bW5zXCI6IFwiXCIsXG4gIFwidXAtYW5kLWRvd24tYXJyb3dzXCI6XG4gICAgXCJNNyAyMEw5IDIwIDkgOCAxMiA4IDggNCA0IDggNyA4ek0yMCAxNkwxNyAxNiAxNyA0IDE1IDQgMTUgMTYgMTIgMTYgMTYgMjB6XCIsXG4gIFwidXBwZXJjYXNlLWxvd2VyY2FzZS1hXCI6XG4gICAgXCJNMjIgNkwxOSAyIDE2IDYgMTggNiAxOCAxMCAxNiAxMCAxOSAxNCAyMiAxMCAyMCAxMCAyMCA2ek05LjMwNyA0bC02IDE2aDIuMTM3bDEuODc1LTVoNi4zNjNsMS44NzUgNWgyLjEzN2wtNi0xNkg5LjMwN3pNOC4wNjggMTNMMTAuNSA2LjUxNSAxMi45MzIgMTNIOC4wNjh6XCIsXG4gIHZhdWx0OlxuICAgIFwiTTE5LDIuMDFINmMtMS4yMDYsMC0zLDAuNzk5LTMsM3YzdjZ2M3YyYzAsMi4yMDEsMS43OTQsMywzLDNoMTV2LTJINi4wMTJDNS41NSwxOS45OTgsNSwxOS44MTUsNSwxOS4wMSBjMC0wLjEwMSwwLjAwOS0wLjE5MSwwLjAyNC0wLjI3M2MwLjExMi0wLjU3NSwwLjU4My0wLjcxNywwLjk4Ny0wLjcyN0gyMGMwLjAxOCwwLDAuMDMxLTAuMDA5LDAuMDQ5LTAuMDFIMjF2LTAuOTlWMTVWNC4wMSBDMjEsMi45MDcsMjAuMTAzLDIuMDEsMTksMi4wMXogTTE5LDE2LjAxSDV2LTJ2LTZ2LTNjMC0wLjgwNiwwLjU1LTAuOTg4LDEtMWg3djdsMi0xbDIsMXYtN2gyVjE1VjE2LjAxelwiLFxuICBcInZlcnRpY2FsLXNwbGl0XCI6IFwiTTcgMTdMMTIgMjIgMTcgMTcgMTMgMTcgMTMgNyAxNyA3IDEyIDIgNyA3IDExIDcgMTEgMTd6XCIsXG4gIFwidmVydGljYWwtdGhyZWUtZG90c1wiOlxuICAgIFwiTTEyIDEwYy0xLjEgMC0yIC45LTIgMnMuOSAyIDIgMiAyLS45IDItMlMxMy4xIDEwIDEyIDEwek0xMiA0Yy0xLjEgMC0yIC45LTIgMnMuOSAyIDIgMiAyLS45IDItMlMxMy4xIDQgMTIgNHpNMTIgMTZjLTEuMSAwLTIgLjktMiAycy45IDIgMiAyIDItLjkgMi0yUzEzLjEgMTYgMTIgMTZ6XCIsXG59O1xuXG5jb25zdCBmcm9tID0gMjQ7XG5jb25zdCB0byA9IDEwMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRJY29ucygpIHtcbiAgT2JqZWN0LmtleXMoaWNvbnMpLmZvckVhY2goKGljb24pID0+IHtcbiAgICBjb25zdCBwYXRoID0gaWNvbnNbaWNvbl07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXRoKSkge1xuICAgICAgYWRkSWNvbihpY29uLCBwYXRoLm1hcCgocCkgPT4gc2NhbGUocCwgZnJvbSwgdG8pKS5qb2luKFwiXCIpKTtcbiAgICB9IGVsc2UgaWYgKHBhdGggIT09IFwiXCIpIHtcbiAgICAgIGFkZEljb24oaWNvbiwgc2NhbGUocGF0aCwgZnJvbSwgdG8pKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ09yRGVmYXVsdChzdHI6IHN0cmluZyB8IHVuZGVmaW5lZCwgZGVmOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdHIgfHwgZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyT3JEZWZhdWx0KG51bTogbnVtYmVyIHwgdW5kZWZpbmVkLCBkZWY6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInID8gbnVtIDogZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVkQXJyYXlPckRlZmF1bHQ8VD4oYXJyOiBBcnJheTxUPiB8IHVuZGVmaW5lZCwgZGVmOiBBcnJheTxUPik6IEFycmF5PFQ+IHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhcnIpICYmIGFyci5sZW5ndGggPiAwID8gYXJyIDogZGVmO1xufSIsImltcG9ydCB7XHJcbiAgQXBwLFxyXG4gIFBsdWdpbixcclxuICBQbHVnaW5TZXR0aW5nVGFiLFxyXG4gIFNldHRpbmcsXHJcbiAgV29ya3NwYWNlTGVhZixcclxufSBmcm9tIFwib2JzaWRpYW5cIjtcclxuXHJcbmltcG9ydCBFbWJlZGRlZEhlYWRpbmdzRXh0ZW5zaW9uIGZyb20gXCIuL2V4dGVuc2lvbnMvZW1iZWRkZWRIZWFkaW5nc1wiO1xyXG5pbXBvcnQgeyBpbml0SWNvbnMgfSBmcm9tIFwiLi9leHRlbnNpb25zL2JveGljb25zXCI7XHJcbmltcG9ydCB7XHJcbiAgbnVtYmVyT3JEZWZhdWx0LFxyXG4gIHBvcHVsYXRlZEFycmF5T3JEZWZhdWx0LFxyXG4gIHN0cmluZ09yRGVmYXVsdCxcclxufSBmcm9tIFwiaGVscGVyc1wiO1xyXG5cclxuaW5pdEljb25zKCk7XHJcblxyXG5pbnRlcmZhY2UgSGVhZGluZ0NvbmZpZyB7XHJcbiAgc2l6ZTogc3RyaW5nO1xyXG4gIGxpbmVIZWlnaHQ6IG51bWJlcjtcclxuICBtYXJnaW5Ub3A6IG51bWJlcjtcclxuICBtYXJnaW5Cb3R0b206IG51bWJlcjtcclxuICB3ZWlnaHQ6IG51bWJlcjtcclxuICBzdHlsZTogc3RyaW5nO1xyXG59XHJcblxyXG5jbGFzcyBUaGVtZVNldHRpbmdzIHtcclxuICBwcmV0dHlFZGl0b3I6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIHByZXR0eVByZXZpZXc6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIGVtYmVkZGVkSGVhZGluZ3M6IGJvb2xlYW4gPSBmYWxzZTtcclxuICB1c2VTeXN0ZW1UaGVtZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGZhbmN5Q3Vyc29yOiBib29sZWFuID0gZmFsc2U7XHJcbiAgYWNjZW50SHVlOiBudW1iZXIgPSAyMTE7XHJcbiAgYWNjZW50U2F0OiBudW1iZXIgPSAxMDA7XHJcblxyXG4gIGxpbmVXaWR0aDogbnVtYmVyID0gNDI7XHJcbiAgdGV4dE5vcm1hbDogbnVtYmVyID0gMTg7XHJcblxyXG4gIGZvbnRGZWF0dXJlczogc3RyaW5nID0gJ1wiXCInO1xyXG5cclxuICB0ZXh0Rm9udDogc3RyaW5nID1cclxuICAgICctYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxcIlNlZ29lIFVJIEVtb2ppXCIsXCJTZWdvZSBVSVwiLFJvYm90byxPeHlnZW4tU2FucyxVYnVudHUsQ2FudGFyZWxsLHNhbnMtc2VyaWYnO1xyXG5cclxuICBlZGl0b3JGb250OiBzdHJpbmcgPVxyXG4gICAgJy1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFwiU2Vnb2UgVUkgRW1vamlcIixcIlNlZ29lIFVJXCIsUm9ib3RvLE94eWdlbi1TYW5zLFVidW50dSxDYW50YXJlbGwsc2Fucy1zZXJpZic7XHJcbiAgZWRpdG9yTGluZUhlaWdodDogbnVtYmVyID0gMS44ODg4OTtcclxuXHJcbiAgbW9ub0ZvbnQ6IHN0cmluZyA9IFwiTWVubG8sU0ZNb25vLVJlZ3VsYXIsQ29uc29sYXMsUm9ib3RvIE1vbm8sbW9ub3NwYWNlXCI7XHJcblxyXG4gIGhlYWRpbmdDb25maWc6IEhlYWRpbmdDb25maWdbXSA9IFtcclxuICAgIHtcclxuICAgICAgc2l6ZTogXCIxLjYwMnJlbVwiLFxyXG4gICAgICBsaW5lSGVpZ2h0OiAxLjQsXHJcbiAgICAgIG1hcmdpblRvcDogNCxcclxuICAgICAgbWFyZ2luQm90dG9tOiAxLFxyXG4gICAgICB3ZWlnaHQ6IDUwMCxcclxuICAgICAgc3R5bGU6IFwibm9ybWFsXCIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzaXplOiBcIjEuNDI0cmVtXCIsXHJcbiAgICAgIGxpbmVIZWlnaHQ6IDEuNCxcclxuICAgICAgbWFyZ2luVG9wOiAyLjUsXHJcbiAgICAgIG1hcmdpbkJvdHRvbTogMC41LFxyXG4gICAgICB3ZWlnaHQ6IDUwMCxcclxuICAgICAgc3R5bGU6IFwibm9ybWFsXCIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzaXplOiBcIjEuMjY2cmVtXCIsXHJcbiAgICAgIGxpbmVIZWlnaHQ6IDEuNCxcclxuICAgICAgbWFyZ2luVG9wOiAyLFxyXG4gICAgICBtYXJnaW5Cb3R0b206IDAuNSxcclxuICAgICAgd2VpZ2h0OiA1MDAsXHJcbiAgICAgIHN0eWxlOiBcIm5vcm1hbFwiLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc2l6ZTogXCIxLjEyNXJlbVwiLFxyXG4gICAgICBsaW5lSGVpZ2h0OiAxLjUsXHJcbiAgICAgIG1hcmdpblRvcDogMS41LFxyXG4gICAgICBtYXJnaW5Cb3R0b206IDAuNSxcclxuICAgICAgd2VpZ2h0OiA1MDAsXHJcbiAgICAgIHN0eWxlOiBcIm5vcm1hbFwiLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc2l6ZTogXCIxcmVtXCIsXHJcbiAgICAgIGxpbmVIZWlnaHQ6IDEuNSxcclxuICAgICAgbWFyZ2luVG9wOiAxLjUsXHJcbiAgICAgIG1hcmdpbkJvdHRvbTogMC41LFxyXG4gICAgICB3ZWlnaHQ6IDUwMCxcclxuICAgICAgc3R5bGU6IFwibm9ybWFsXCIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzaXplOiBcIjFyZW1cIixcclxuICAgICAgbGluZUhlaWdodDogMS41LFxyXG4gICAgICBtYXJnaW5Ub3A6IDEuNSxcclxuICAgICAgbWFyZ2luQm90dG9tOiAwLjUsXHJcbiAgICAgIHdlaWdodDogNTAwLFxyXG4gICAgICBzdHlsZTogXCJpdGFsaWNcIixcclxuICAgIH0sXHJcbiAgXTtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdFNldHRpbmdzID0gbmV3IFRoZW1lU2V0dGluZ3MoKTtcclxuXHJcbmNvbnN0IG9ic2VydmVyQ29uZmlnID0ge1xyXG4gIGF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gIGNoaWxkTGlzdDogdHJ1ZSxcclxuICBzdWJ0cmVlOiBmYWxzZSxcclxufTtcclxuXHJcbmZ1bmN0aW9uIHRhZ05vZGUobm9kZTogTm9kZSkge1xyXG4gIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCBub2RlRWwgPSBub2RlIGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICBpZiAoXHJcbiAgICAhbm9kZUVsLmRhdGFzZXQudGFnTmFtZSAmJlxyXG4gICAgbm9kZUVsLmhhc0NoaWxkTm9kZXMoKSAmJlxyXG4gICAgbm9kZUVsLmZpcnN0Q2hpbGQubm9kZVR5cGUgIT09IDNcclxuICApIHtcclxuICAgIGNvbnN0IGNoaWxkRWwgPSBub2RlLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICBub2RlRWwuZGF0YXNldC50YWdOYW1lID0gY2hpbGRFbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxpZm9ybmlhQ29hc3RUaGVtZSBleHRlbmRzIFBsdWdpbiB7XHJcbiAgc2V0dGluZ3M6IFRoZW1lU2V0dGluZ3M7XHJcbiAgbWVkaWE6IE1lZGlhUXVlcnlMaXN0IHwgbnVsbCA9IG51bGw7XHJcbiAgb2JzZXJ2ZXJzOiB7IFtpZDogc3RyaW5nXTogTXV0YXRpb25PYnNlcnZlciB9ID0ge307XHJcbiAgZW1iZWRkZWRIZWFkaW5nczogRW1iZWRkZWRIZWFkaW5nc0V4dGVuc2lvbjtcclxuXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgdGhpcy5lbWJlZGRlZEhlYWRpbmdzID0gbmV3IEVtYmVkZGVkSGVhZGluZ3NFeHRlbnNpb24oKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzID0gKGF3YWl0IHRoaXMubG9hZERhdGEoKSkgfHwgbmV3IFRoZW1lU2V0dGluZ3MoKTtcclxuXHJcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFRoZW1lU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG4gICAgdGhpcy5hZGRTdHlsZSgpO1xyXG4gICAgdGhpcy5yZWZyZXNoKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MudXNlU3lzdGVtVGhlbWUpIHtcclxuICAgICAgdGhpcy5lbmFibGVTeXN0ZW1UaGVtZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChcclxuICAgICAgISh0aGlzLmFwcCBhcyBhbnkpLnBsdWdpbnMucGx1Z2luc1tcIm9ic2lkaWFuLWNvbnRleHR1YWwtdHlwb2dyYXBoeVwiXSAmJlxyXG4gICAgICB0aGlzLnNldHRpbmdzLnByZXR0eVByZXZpZXdcclxuICAgICkge1xyXG4gICAgICB0aGlzLmVuYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZW1iZWRkZWRIZWFkaW5ncykge1xyXG4gICAgICB0aGlzLmVuYWJsZUVtYmVkZGVkSGVhZGluZ3MoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9udW5sb2FkKCkge1xyXG4gICAgdGhpcy5kaXNhYmxlQ29udGV4dHVhbFR5cG9ncmFwaHkoKTtcclxuICAgIHRoaXMuZGlzYWJsZUVtYmVkZGVkSGVhZGluZ3MoKTtcclxuICB9XHJcblxyXG4gIG1lZGlhQ2FsbGJhY2sgPSAoZTogTWVkaWFRdWVyeUxpc3RFdmVudCkgPT4ge1xyXG4gICAgaWYgKGUubWF0Y2hlcykge1xyXG4gICAgICB0aGlzLnVwZGF0ZURhcmtTdHlsZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cGRhdGVMaWdodFN0eWxlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbGlzdGVuRm9yU3lzdGVtVGhlbWUgPSAoKSA9PiB7XHJcbiAgICB0aGlzLm1lZGlhID0gd2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIpO1xyXG4gICAgdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMubWVkaWFDYWxsYmFjayk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyKCgpID0+XHJcbiAgICAgIHRoaXMubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCB0aGlzLm1lZGlhQ2FsbGJhY2spXHJcbiAgICApO1xyXG5cclxuICAgIGlmICh0aGlzLm1lZGlhLm1hdGNoZXMpIHtcclxuICAgICAgdGhpcy51cGRhdGVEYXJrU3R5bGUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXBkYXRlTGlnaHRTdHlsZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHN0b3BMaXN0ZW5pbmdGb3JTeXN0ZW1UaGVtZSA9ICgpID0+IHtcclxuICAgIHRoaXMubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCB0aGlzLm1lZGlhQ2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8vIHJlZnJlc2ggZnVuY3Rpb24gZm9yIHdoZW4gd2UgY2hhbmdlIHNldHRpbmdzXHJcbiAgcmVmcmVzaCgpIHtcclxuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcclxuICB9XHJcblxyXG4gIC8vIGFkZCB0aGUgc3R5bGluZyBlbGVtZW50cyB3ZSBuZWVkXHJcbiAgYWRkU3R5bGUoKSB7XHJcbiAgICBjb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcbiAgICBjc3MuaWQgPSBcImNhbGlmb3JuaWEtY29hc3QtdGhlbWVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChjc3MpO1xyXG5cclxuICAgIC8vIGFkZCB0aGUgbWFpbiBjbGFzc1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwiY2FsaWZvcm5pYS1jb2FzdC10aGVtZVwiKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgdGhlIHN0eWxlIHdpdGggdGhlIHNldHRpbmdzLWRlcGVuZGVudCBzdHlsZXNcclxuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVN0eWxlKCkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDbGFzcyhcclxuICAgICAgXCJjYy1wcmV0dHktZWRpdG9yXCIsXHJcbiAgICAgIFwiY2MtcHJldHR5LXByZXZpZXdcIixcclxuICAgICAgXCJmYW5jeS1jdXJzb3JcIlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIHVwZGF0ZSB0aGUgc3R5bGVzIChhdCB0aGUgc3RhcnQsIG9yIGFzIHRoZSByZXN1bHQgb2YgYSBzZXR0aW5ncyBjaGFuZ2UpXHJcbiAgdXBkYXRlU3R5bGUoKSB7XHJcbiAgICB0aGlzLnJlbW92ZVN0eWxlKCk7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFxyXG4gICAgICBcImNjLXByZXR0eS1lZGl0b3JcIixcclxuICAgICAgdGhpcy5zZXR0aW5ncy5wcmV0dHlFZGl0b3JcclxuICAgICk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXHJcbiAgICAgIFwiY2MtcHJldHR5LXByZXZpZXdcIixcclxuICAgICAgdGhpcy5zZXR0aW5ncy5wcmV0dHlQcmV2aWV3XHJcbiAgICApO1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwiZmFuY3ktY3Vyc29yXCIsIHRoaXMuc2V0dGluZ3MuZmFuY3lDdXJzb3IpO1xyXG5cclxuICAgIC8vIGdldCB0aGUgY3VzdG9tIGNzcyBlbGVtZW50XHJcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FsaWZvcm5pYS1jb2FzdC10aGVtZVwiKTtcclxuXHJcbiAgICBpZiAoIWVsKSB7XHJcbiAgICAgIHRocm93IFwiY2FsaWZvcm5pYS1jb2FzdC10aGVtZSBlbGVtZW50IG5vdCBmb3VuZCFcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGhlYWRpbmdDb25maWcgPSBwb3B1bGF0ZWRBcnJheU9yRGVmYXVsdDxIZWFkaW5nQ29uZmlnPihcclxuICAgICAgICB0aGlzLnNldHRpbmdzLmhlYWRpbmdDb25maWcsXHJcbiAgICAgICAgZGVmYXVsdFNldHRpbmdzLmhlYWRpbmdDb25maWdcclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIHNldCB0aGUgc2V0dGluZ3MtZGVwZW5kZW50IGNzc1xyXG4gICAgICBlbC5pbm5lclRleHQgPSBgXHJcbiAgICAgICAgYm9keS5jYWxpZm9ybmlhLWNvYXN0LXRoZW1lIHtcclxuICAgICAgICAgIC0tZWRpdG9yLWZvbnQtc2l6ZTogJHtudW1iZXJPckRlZmF1bHQoXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGV4dE5vcm1hbCxcclxuICAgICAgICAgICAgZGVmYXVsdFNldHRpbmdzLnRleHROb3JtYWxcclxuICAgICAgICAgICl9cHg7XHJcbiAgICAgICAgICAtLWVkaXRvci1mb250LWZlYXR1cmVzOiAke3N0cmluZ09yRGVmYXVsdChcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5mb250RmVhdHVyZXMsXHJcbiAgICAgICAgICAgIGRlZmF1bHRTZXR0aW5ncy5mb250RmVhdHVyZXNcclxuICAgICAgICAgICl9O1xyXG4gICAgICAgICAgLS1lZGl0b3ItbGluZS1oZWlnaHQ6ICR7bnVtYmVyT3JEZWZhdWx0KFxyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmVkaXRvckxpbmVIZWlnaHQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRTZXR0aW5ncy5lZGl0b3JMaW5lSGVpZ2h0XHJcbiAgICAgICAgICApfTtcclxuICAgICAgICAgIC0tZWRpdG9yLWxpbmUtaGVpZ2h0LXJlbTogJHtudW1iZXJPckRlZmF1bHQoXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZWRpdG9yTGluZUhlaWdodCxcclxuICAgICAgICAgICAgZGVmYXVsdFNldHRpbmdzLmVkaXRvckxpbmVIZWlnaHRcclxuICAgICAgICAgICl9cmVtO1xyXG4gICAgICAgICAgLS1saW5lLXdpZHRoOiAke251bWJlck9yRGVmYXVsdChcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5saW5lV2lkdGgsXHJcbiAgICAgICAgICAgIGRlZmF1bHRTZXR0aW5ncy5saW5lV2lkdGhcclxuICAgICAgICAgICl9cmVtO1xyXG4gICAgICAgICAgLS1mb250LW1vbm9zcGFjZTogJHtzdHJpbmdPckRlZmF1bHQoXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MubW9ub0ZvbnQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRTZXR0aW5ncy5tb25vRm9udFxyXG4gICAgICAgICAgKX07XHJcbiAgICAgICAgICAtLXRleHQ6ICR7c3RyaW5nT3JEZWZhdWx0KFxyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLnRleHRGb250LFxyXG4gICAgICAgICAgICBkZWZhdWx0U2V0dGluZ3MudGV4dEZvbnRcclxuICAgICAgICAgICl9O1xyXG4gICAgICAgICAgLS10ZXh0LWVkaXRvcjogJHtzdHJpbmdPckRlZmF1bHQoXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZWRpdG9yRm9udCxcclxuICAgICAgICAgICAgZGVmYXVsdFNldHRpbmdzLmVkaXRvckZvbnRcclxuICAgICAgICAgICl9O1xyXG4gICAgICAgICAgLS1hY2NlbnQtaDogJHtudW1iZXJPckRlZmF1bHQoXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYWNjZW50SHVlLFxyXG4gICAgICAgICAgICBkZWZhdWx0U2V0dGluZ3MuYWNjZW50SHVlXHJcbiAgICAgICAgICApfTtcclxuICAgICAgICAgIC0tYWNjZW50LXM6ICR7bnVtYmVyT3JEZWZhdWx0KFxyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmFjY2VudFNhdCxcclxuICAgICAgICAgICAgZGVmYXVsdFNldHRpbmdzLmFjY2VudFNhdFxyXG4gICAgICAgICAgKX0lO1xyXG5cclxuICAgICAgICAgICR7aGVhZGluZ0NvbmZpZ1xyXG4gICAgICAgICAgICAubWFwKFxyXG4gICAgICAgICAgICAgIChjLCBpKSA9PiBgXHJcbiAgICAgICAgICAgICAgLS1oJHtpICsgMX0tc2l6ZTogJHtjLnNpemV9O1xyXG4gICAgICAgICAgICAgIC0taCR7aSArIDF9LWxpbmUtaGVpZ2h0OiAke2MubGluZUhlaWdodH07XHJcbiAgICAgICAgICAgICAgLS1oJHtpICsgMX0tbWFyZ2luLXRvcDogJHtjLm1hcmdpblRvcH07XHJcbiAgICAgICAgICAgICAgLS1oJHtpICsgMX0tbWFyZ2luLWJvdHRvbTogJHtjLm1hcmdpbkJvdHRvbX07IFxyXG4gICAgICAgICAgICAgIC0taCR7aSArIDF9LXdlaWdodDogJHtjLndlaWdodH07IFxyXG4gICAgICAgICAgICAgIC0taCR7aSArIDF9LXN0eWxlOiAke2Muc3R5bGV9OyBcclxuICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC5qb2luKFwiIFwiKX1cclxuICAgICAgICB9XHJcbiAgICAgIGBcclxuICAgICAgICAudHJpbSgpXHJcbiAgICAgICAgLnJlcGxhY2UoL1tcXHJcXG5cXHNdKy9nLCBcIiBcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbmFibGVTeXN0ZW1UaGVtZSgpIHtcclxuICAgICh0aGlzLmFwcC53b3Jrc3BhY2UgYXMgYW55KS5sYXlvdXRSZWFkeVxyXG4gICAgICA/IHRoaXMubGlzdGVuRm9yU3lzdGVtVGhlbWUoKVxyXG4gICAgICA6IHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImxheW91dC1yZWFkeVwiLCB0aGlzLmxpc3RlbkZvclN5c3RlbVRoZW1lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURhcmtTdHlsZSgpIHtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2xhc3MoXCJ0aGVtZS1saWdodFwiKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkQ2xhc3MoXCJ0aGVtZS1kYXJrXCIpO1xyXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLnRyaWdnZXIoXCJjc3MtY2hhbmdlXCIpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlTGlnaHRTdHlsZSgpIHtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2xhc3MoXCJ0aGVtZS1kYXJrXCIpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRDbGFzcyhcInRoZW1lLWxpZ2h0XCIpO1xyXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLnRyaWdnZXIoXCJjc3MtY2hhbmdlXCIpO1xyXG4gIH1cclxuXHJcbiAgZGlzY29ubmVjdE9ic2VydmVyKGlkOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLm9ic2VydmVyc1tpZF0pIHtcclxuICAgICAgdGhpcy5vYnNlcnZlcnNbaWRdLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzW2lkXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbm5lY3RPYnNlcnZlcihpZDogc3RyaW5nLCBsZWFmOiBXb3Jrc3BhY2VMZWFmKSB7XHJcbiAgICBpZiAodGhpcy5vYnNlcnZlcnNbaWRdKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgcHJldmlld1NlY3Rpb24gPSBsZWFmLnZpZXcuY29udGFpbmVyRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcclxuICAgICAgXCJtYXJrZG93bi1wcmV2aWV3LXNlY3Rpb25cIlxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAocHJldmlld1NlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2lkXSA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcclxuICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcclxuICAgICAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaCh0YWdOb2RlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm9ic2VydmVyc1tpZF0ub2JzZXJ2ZShwcmV2aWV3U2VjdGlvblswXSwgb2JzZXJ2ZXJDb25maWcpO1xyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgcHJldmlld1NlY3Rpb25bMF0uY2hpbGROb2Rlcy5mb3JFYWNoKHRhZ05vZGUpO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVuYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5ID0gKCkgPT4ge1xyXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxyXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5wcmV0dHlQcmV2aWV3KSB7XHJcbiAgICAgICAgICBjb25zdCBzZWVuOiB7IFtrOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcclxuXHJcbiAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZVJvb3RMZWF2ZXMoKGxlYWYpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSAobGVhZiBhcyBhbnkpLmlkIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0T2JzZXJ2ZXIoaWQsIGxlYWYpO1xyXG4gICAgICAgICAgICBzZWVuW2lkXSA9IHRydWU7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm9ic2VydmVycykuZm9yRWFjaCgoaykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXNlZW5ba10pIHtcclxuICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RPYnNlcnZlcihrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBkaXNhYmxlQ29udGV4dHVhbFR5cG9ncmFwaHkgPSAoKSA9PiB7XHJcbiAgICBPYmplY3Qua2V5cyh0aGlzLm9ic2VydmVycykuZm9yRWFjaCgoaykgPT4gdGhpcy5kaXNjb25uZWN0T2JzZXJ2ZXIoaykpO1xyXG4gIH07XHJcblxyXG4gIGVuYWJsZUVtYmVkZGVkSGVhZGluZ3MgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmVtYmVkZGVkSGVhZGluZ3Mub25sb2FkKCk7XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxyXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5lbWJlZGRlZEhlYWRpbmdzKSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWJlZGRlZEhlYWRpbmdzLmNyZWF0ZUhlYWRpbmdzKHRoaXMuYXBwKTtcclxuICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgZGlzYWJsZUVtYmVkZGVkSGVhZGluZ3MgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmVtYmVkZGVkSGVhZGluZ3Mub251bmxvYWQoKTtcclxuICB9O1xyXG59XHJcblxyXG5jbGFzcyBUaGVtZVNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuICBwbHVnaW46IENhbGlmb3JuaWFDb2FzdFRoZW1lO1xyXG5cclxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBDYWxpZm9ybmlhQ29hc3RUaGVtZSkge1xyXG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xyXG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgbGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XHJcblxyXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcclxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkNhbGlmb3JuaWEgQ29hc3QgVGhlbWVcIiB9KTtcclxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiYnJcIik7XHJcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImFcIiwgeyB0ZXh0OiBcIuKspCBBY2NlbnQgQ29sb3JcIiB9KTtcclxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIik7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiUmVzZXQgYWNjZW50IGNvbG9yXCIpXHJcbiAgICAgIC5zZXREZXNjKFwiU2V0IGFjY2VudCBjb2xvciBiYWNrIHRvIHRoZW1lIGRlZmF1bHRcIilcclxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PlxyXG4gICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiUmVzZXRcIikub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hY2NlbnRIdWUgPSBkZWZhdWx0U2V0dGluZ3MuYWNjZW50SHVlO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWNjZW50U2F0ID0gZGVmYXVsdFNldHRpbmdzLmFjY2VudFNhdDtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkFjY2VudCBjb2xvciBodWVcIilcclxuICAgICAgLnNldERlc2MoXCJGb3IgbGlua3MgYW5kIGludGVyYWN0aXZlIGVsZW1lbnRzXCIpXHJcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT5cclxuICAgICAgICBzbGlkZXJcclxuICAgICAgICAgIC5zZXRMaW1pdHMoMCwgMzYwLCAxKVxyXG4gICAgICAgICAgLnNldFZhbHVlKFxyXG4gICAgICAgICAgICB0eXBlb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWNjZW50SHVlID09PSBcIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgPyB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hY2NlbnRIdWVcclxuICAgICAgICAgICAgICA6IGRlZmF1bHRTZXR0aW5ncy5hY2NlbnRIdWVcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWNjZW50SHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJBY2NlbnQgY29sb3Igc2F0dXJhdGlvblwiKVxyXG4gICAgICAuc2V0RGVzYyhcIkZvciBsaW5rcyBhbmQgaW50ZXJhY3RpdmUgZWxlbWVudHNcIilcclxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PlxyXG4gICAgICAgIHNsaWRlclxyXG4gICAgICAgICAgLnNldExpbWl0cygwLCAxMDAsIDEpXHJcbiAgICAgICAgICAuc2V0VmFsdWUoXHJcbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hY2NlbnRTYXQgPT09IFwibnVtYmVyXCJcclxuICAgICAgICAgICAgICA/IHRoaXMucGx1Z2luLnNldHRpbmdzLmFjY2VudFNhdFxyXG4gICAgICAgICAgICAgIDogZGVmYXVsdFNldHRpbmdzLmFjY2VudFNhdFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hY2NlbnRTYXQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkFjY2VudGVkIGN1cnNvclwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlRoZSBlZGl0b3IgY3Vyc29yIHRha2VzIG9uIHlvdXIgYWNjZW50IGNvbG9yXCIpXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZmFuY3lDdXJzb3IpLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZmFuY3lDdXJzb3IgPSB2YWx1ZTtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIlVzZSBzeXN0ZW0tbGV2ZWwgc2V0dGluZyBmb3IgbGlnaHQgb3IgZGFyayBtb2RlXCIpXHJcbiAgICAgIC5zZXREZXNjKFwiQXV0b21hdGljYWxseSBzd2l0Y2ggYmFzZWQgb24geW91ciBvcGVyYXRpbmcgc3lzdGVtIHNldHRpbmdzXCIpXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGVcclxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VTeXN0ZW1UaGVtZSlcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlU3lzdGVtVGhlbWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ubGlzdGVuRm9yU3lzdGVtVGhlbWUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zdG9wTGlzdGVuaW5nRm9yU3lzdGVtVGhlbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImJyXCIpO1xyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiQ3VzdG9tIGZvbnRzXCIgfSk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiVUkgZm9udFwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlVzZWQgZm9yIHRoZSB1c2VyIGludGVyZmFjZVwiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZShcclxuICAgICAgICAgICAgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRleHRGb250IHx8IGRlZmF1bHRTZXR0aW5ncy50ZXh0Rm9udCkgKyBcIlwiXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRleHRGb250ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJCb2R5IGZvbnRcIilcclxuICAgICAgLnNldERlc2MoXCJVc2VkIGZvciB0aGUgZWRpdG9yIGFuZCBwcmV2aWV3XCIpXHJcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG4gICAgICAgIHRleHRcclxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIlwiKVxyXG4gICAgICAgICAgLnNldFZhbHVlKFxyXG4gICAgICAgICAgICAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZWRpdG9yRm9udCB8fCBkZWZhdWx0U2V0dGluZ3MuZWRpdG9yRm9udCkgKyBcIlwiXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVkaXRvckZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkJvZHkgZm9udCBmZWF0dXJlc1wiKVxyXG4gICAgICAuc2V0RGVzYygnZWcuIFwic3MwMVwiLCBcImN2MDVcIiwgXCJjdjA3XCIsIFwiY2FzZVwiJylcclxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgdGV4dFxyXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdcIlwiJylcclxuICAgICAgICAgIC5zZXRWYWx1ZShcclxuICAgICAgICAgICAgKHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbnRGZWF0dXJlcyB8fFxyXG4gICAgICAgICAgICAgIGRlZmF1bHRTZXR0aW5ncy5mb250RmVhdHVyZXMpICsgXCJcIlxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb250RmVhdHVyZXMgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJNb25vc3BhY2UgZm9udFwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlVzZWQgZm9yIGNvZGUgYmxvY2tzLCBmcm9udCBtYXR0ZXIsIGV0Y1wiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZShcclxuICAgICAgICAgICAgKHRoaXMucGx1Z2luLnNldHRpbmdzLm1vbm9Gb250IHx8IGRlZmF1bHRTZXR0aW5ncy5tb25vRm9udCkgKyBcIlwiXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1vbm9Gb250ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImJyXCIpO1xyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiVHlwb2dyYXBoeVwiIH0pO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkRpc3BsYXkgbm90ZSBmaWxlIG5hbWVzIGFzIGhlYWRpbmdzXCIpXHJcbiAgICAgIC5zZXREZXNjKFwiRW1iZWRzIG5vdGUgdGl0bGVzIGFzIHRvcCBsZXZlbCBIMSB0YWdzXCIpXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGVcclxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbWJlZGRlZEhlYWRpbmdzKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbWJlZGRlZEhlYWRpbmdzID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZW5hYmxlRW1iZWRkZWRIZWFkaW5ncygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRpc2FibGVFbWJlZGRlZEhlYWRpbmdzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRW5oYW5jZWQgRWRpdG9yIFR5cG9ncmFwaHlcIilcclxuICAgICAgLnNldERlc2MoXCJBZGRzIFdZU0lXWUctbGlrZSBmdW5jdGlvbmFsaXR5IHRvIGVkaXRvciBtb2RlXCIpXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJldHR5RWRpdG9yKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnByZXR0eUVkaXRvciA9IHZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRW5oYW5jZWQgUHJldmlldyBUeXBvZ3JhcGh5XCIpXHJcbiAgICAgIC5zZXREZXNjKFxyXG4gICAgICAgIFwiQWRkcyBjb250ZXh0IGF3YXJlIHBhZGRpbmcgYmV0d2VlbiB0ZXh0IGVsZW1lbnRzIGluIHByZXZpZXcgbW9kZVwiXHJcbiAgICAgIClcclxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxyXG4gICAgICAgIHRvZ2dsZVxyXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnByZXR0eVByZXZpZXcpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnByZXR0eVByZXZpZXcgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5lbmFibGVDb250ZXh0dWFsVHlwb2dyYXBoeSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRpc2FibGVDb250ZXh0dWFsVHlwb2dyYXBoeSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkxpbmUgd2lkdGhcIilcclxuICAgICAgLnNldERlc2MoXCJUaGUgbWF4aW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyBwZXIgbGluZSAoZGVmYXVsdCA0MilcIilcclxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgdGV4dFxyXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiNDJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZShcclxuICAgICAgICAgICAgKHRoaXMucGx1Z2luLnNldHRpbmdzLmxpbmVXaWR0aCB8fCBkZWZhdWx0U2V0dGluZ3MubGluZVdpZHRoKSArIFwiXCJcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubGluZVdpZHRoID0gcGFyc2VJbnQodmFsdWUudHJpbSgpKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkJvZHkgZm9udCBzaXplXCIpXHJcbiAgICAgIC5zZXREZXNjKFwiVXNlZCBmb3IgdGhlIG1haW4gdGV4dCAoZGVmYXVsdCAxOClcIilcclxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgdGV4dFxyXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiMThcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZShcclxuICAgICAgICAgICAgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRleHROb3JtYWwgfHwgZGVmYXVsdFNldHRpbmdzLnRleHROb3JtYWwpICsgXCJcIlxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZXh0Tm9ybWFsID0gcGFyc2VJbnQodmFsdWUudHJpbSgpKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkJvZHkgbGluZSBoZWlnaHRcIilcclxuICAgICAgLnNldERlc2MoXCJVc2VkIGZvciB0aGUgbWFpbiB0ZXh0IChkZWZhdWx0IDEuODg4ODkpXCIpXHJcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG4gICAgICAgIHRleHRcclxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIjEuODg4ODlcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZShcclxuICAgICAgICAgICAgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVkaXRvckxpbmVIZWlnaHQgfHxcclxuICAgICAgICAgICAgICBkZWZhdWx0U2V0dGluZ3MuZWRpdG9yTGluZUhlaWdodCkgKyBcIlwiXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVkaXRvckxpbmVIZWlnaHQgPSBwYXJzZUZsb2F0KHZhbHVlLnRyaW0oKSk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgICF0aGlzLnBsdWdpbi5zZXR0aW5ncy5oZWFkaW5nQ29uZmlnIHx8XHJcbiAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhlYWRpbmdDb25maWcubGVuZ3RoID09PSAwXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGVhZGluZ0NvbmZpZyA9IGRlZmF1bHRTZXR0aW5ncy5oZWFkaW5nQ29uZmlnLm1hcChcclxuICAgICAgICAoYykgPT4gKHtcclxuICAgICAgICAgIC4uLmMsXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oZWFkaW5nQ29uZmlnLmZvckVhY2goKGMsIGkpID0+IHtcclxuICAgICAgY29uc3QgaW5kZXggPSBpO1xyXG5cclxuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoNFwiLCB7IHRleHQ6IGBMZXZlbCAke2kgKyAxfSBIZWFkaW5nc2AgfSk7XHJcblxyXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAuc2V0TmFtZShgSCR7aW5kZXggKyAxfSBmb250IHNpemVgKVxyXG4gICAgICAgIC5zZXREZXNjKFxyXG4gICAgICAgICAgYEFjY2VwdHMgYW55IENTUyBmb250LXNpemUgdmFsdWUgKGRlZmF1bHQgJHtkZWZhdWx0U2V0dGluZ3MuaGVhZGluZ0NvbmZpZ1tpbmRleF0uc2l6ZX0pYFxyXG4gICAgICAgIClcclxuICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICAgIHRleHRcclxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKGRlZmF1bHRTZXR0aW5ncy5oZWFkaW5nQ29uZmlnW2luZGV4XS5zaXplKVxyXG4gICAgICAgICAgICAuc2V0VmFsdWUoYy5zaXplKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGVhZGluZ0NvbmZpZ1tpbmRleF0uc2l6ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgIC5zZXROYW1lKGBIJHtpbmRleCArIDF9IGxpbmUgaGVpZ2h0YClcclxuICAgICAgICAuc2V0RGVzYyhcclxuICAgICAgICAgIGBBY2NlcHRzIGRlY2ltYWwgdmFsdWVzIChkZWZhdWx0ICR7ZGVmYXVsdFNldHRpbmdzLmhlYWRpbmdDb25maWdbaW5kZXhdLmxpbmVIZWlnaHR9KWBcclxuICAgICAgICApXHJcbiAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcclxuICAgICAgICAgICAgICBkZWZhdWx0U2V0dGluZ3MuaGVhZGluZ0NvbmZpZ1tpbmRleF0ubGluZUhlaWdodCArIFwiXCJcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAuc2V0VmFsdWUoYy5saW5lSGVpZ2h0ICsgXCJcIilcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhlYWRpbmdDb25maWdbaW5kZXhdLmxpbmVIZWlnaHQgPSBwYXJzZUZsb2F0KFxyXG4gICAgICAgICAgICAgICAgdmFsdWVcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgIC5zZXROYW1lKGBIJHtpbmRleCArIDF9IHRvcCBtYXJnaW5gKVxyXG4gICAgICAgIC5zZXREZXNjKFxyXG4gICAgICAgICAgYEFjY2VwdHMgZGVjaW1hbCB2YWx1ZXMgcmVwcmVzZW50aW5nIHRoZSBudW1iZXIgb2YgbGluZXMgdG8gYWRkIGJlZm9yZSB0aGUgaGVhZGluZyAoZGVmYXVsdCAke2RlZmF1bHRTZXR0aW5ncy5oZWFkaW5nQ29uZmlnW2luZGV4XS5tYXJnaW5Ub3B9KWBcclxuICAgICAgICApXHJcbiAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihkZWZhdWx0U2V0dGluZ3MuaGVhZGluZ0NvbmZpZ1tpbmRleF0ubWFyZ2luVG9wICsgXCJcIilcclxuICAgICAgICAgICAgLnNldFZhbHVlKGMubWFyZ2luVG9wICsgXCJcIilcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhlYWRpbmdDb25maWdbaW5kZXhdLm1hcmdpblRvcCA9IHBhcnNlRmxvYXQoXHJcbiAgICAgICAgICAgICAgICB2YWx1ZVxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgLnNldE5hbWUoYEgke2luZGV4ICsgMX0gYm90dG9tIG1hcmdpbmApXHJcbiAgICAgICAgLnNldERlc2MoXHJcbiAgICAgICAgICBgQWNjZXB0cyBkZWNpbWFsIHZhbHVlcyByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBsaW5lcyB0byBhZGQgYmVsb3cgdGhlIGhlYWRpbmcgKGRlZmF1bHQgJHtkZWZhdWx0U2V0dGluZ3MuaGVhZGluZ0NvbmZpZ1tpbmRleF0ubWFyZ2luQm90dG9tfSlgXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG4gICAgICAgICAgdGV4dFxyXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXHJcbiAgICAgICAgICAgICAgZGVmYXVsdFNldHRpbmdzLmhlYWRpbmdDb25maWdbaW5kZXhdLm1hcmdpbkJvdHRvbSArIFwiXCJcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAuc2V0VmFsdWUoYy5tYXJnaW5Cb3R0b20gKyBcIlwiKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGVhZGluZ0NvbmZpZ1tcclxuICAgICAgICAgICAgICAgIGluZGV4XHJcbiAgICAgICAgICAgICAgXS5tYXJnaW5Cb3R0b20gPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAuc2V0TmFtZShgSCR7aW5kZXggKyAxfSBmb250IHdlaWdodGApXHJcbiAgICAgICAgLnNldERlc2MoXHJcbiAgICAgICAgICBgQWNjZXB0cyBudW1iZXJzIHJlcHJlc2V0aW5nIHRoZSBDU1MgZm9udC13ZWlnaHQgKGRlZmF1bHQgJHtkZWZhdWx0U2V0dGluZ3MuaGVhZGluZ0NvbmZpZ1tpbmRleF0ud2VpZ2h0fSlgXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG4gICAgICAgICAgdGV4dFxyXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoZGVmYXVsdFNldHRpbmdzLmhlYWRpbmdDb25maWdbaW5kZXhdLndlaWdodCArIFwiXCIpXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZShjLndlaWdodCArIFwiXCIpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5oZWFkaW5nQ29uZmlnW2luZGV4XS53ZWlnaHQgPSBwYXJzZUZsb2F0KFxyXG4gICAgICAgICAgICAgICAgdmFsdWVcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgIC5zZXROYW1lKGBIJHtpbmRleCArIDF9IGZvbnQgc3R5bGVgKVxyXG4gICAgICAgIC5zZXREZXNjKFxyXG4gICAgICAgICAgYEFjY2VwdHMgYW55IENTUyBmb250LXN0eWxlIHZhbHVlIChkZWZhdWx0ICR7ZGVmYXVsdFNldHRpbmdzLmhlYWRpbmdDb25maWdbaW5kZXhdLnN0eWxlfSlgXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG4gICAgICAgICAgdGV4dFxyXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoZGVmYXVsdFNldHRpbmdzLmhlYWRpbmdDb25maWdbaW5kZXhdLnN0eWxlKVxyXG4gICAgICAgICAgICAuc2V0VmFsdWUoYy5zdHlsZSlcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhlYWRpbmdDb25maWdbaW5kZXhdLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJtYXRyaXgiLCJNYXRyaXgiLCJwYXRoUGFyc2UiLCJ0cmFuc2Zvcm1QYXJzZSIsInJlcXVpcmUkJDAiLCJzdmdwYXRoIiwiYWRkSWNvbiIsIlBsdWdpbiIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxD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SUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxD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RyxFQUFFLEtBQUssQ0FBQztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEdBQUcsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN6QyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDNUI7QUFDQSxFQUFFLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDMUI7QUFDQSxFQUFFLElBQUksS0FBSyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMxQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2hCLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3BDLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLEtBQUssR0FBRyxFQUFFO0FBQ3JCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM5QyxHQUFHLE1BQU07QUFDVDtBQUNBLElBQUksT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNoRCxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxD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SSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QjtBQUNBLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3RCO0FBQ0EsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsR0FBRztBQUNILEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxLQUFLLEVBQUU7QUFDMUMsRUFBRSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4RSxHQUFHO0FBQ0gsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLEtBQUssRUFBRTtBQUMxQyxFQUFFLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNuQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLEdBQUc7QUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxZQUFZO0FBQ3ZDLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2xCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDdEMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0I7QUFDQSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQy9CLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsR0FBRztBQUNIO0FBQ0Es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QUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN4RixDQUFDO0FBQ0Q7QUFDQSxPQUFjLEdBQUcsU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7QUFDbkUsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDMUMsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQ7QUFDQSxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO0FBQzlCO0FBQ0EsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDNUI7QUFDQSxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwQixFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDakUsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDbEIsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVFO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsRUFBRSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FB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QyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsR0FBRyxDQUFDO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RFO0FBQ0E7QUFDQSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkI7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUN4QjtBQUNBLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEMsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoQixJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEM7QUFDQSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CO0FBQ0E7QUFDQSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuQixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQjtBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTztBQUNoRSxJQUFJLEVBQUU7QUFDTjtBQUNBLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM1QyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQ2xCO0FBQ0EsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsQixLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ3BCO0FBQ0EsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUIsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUIsR0FBRyxNQUFNO0FBQ1Q7QUFDQSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxZQUFZO0FBQzdDLEVBQUUsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEUsQ0FBQyxDQUFD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QUFDZCxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEMsUUFBUSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN6RixRQUFRLE1BQU07QUFDZDtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEUsUUFBUSxNQUFNO0FBQ2Q7QUFDQSxNQUFNLEtBQUssR0FBRztBQUNkLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4QyxRQUFRLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3pGLFFBQVEsTUFBTTtBQUNkO0FBQ0EsTUFBTSxLQUFLLEdBQUcsQ0FBQztBQUNmLE1BQU0sS0FBSyxHQUFHO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsUUFBUSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQy9DLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2xDLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUM3QztBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDckQsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3hELFVBQVUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUM1RCxVQUFVLE1BQU07QUFDaEIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO0FBQzlCO0FBQ0EsVUFBVSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzVELFNBQVMsTUFBTTtBQUNmO0FBQ0E7QUFDQSxVQUFVLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN0RSxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE1BQU07QUFDZDtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2Q7QUFDQTtBQUNBLFFBQVEsVUFBVSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDL0I7QUFDQSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxD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QUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkUsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3BELEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFVBQVUsT0FBTyxFQUFFO0FBQzdDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0MsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxPQUFPLEVBQUU7QUFDN0MsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM3QyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsRUFBRTtBQUN4QyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FB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
