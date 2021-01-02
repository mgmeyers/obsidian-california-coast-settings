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
        if (!el)
            throw "california-coast-theme element not found!";
        else {
            // set the settings-dependent css
            el.innerText = ("\n        body.california-coast-theme {\n          --editor-font-size:" + this.settings.textNormal + "px;\n          --editor-font-features: " + this.settings.fontFeatures + ";\n          --editor-line-height: " + this.settings.editorLineHeight + ";\n          --editor-line-height-rem: " + this.settings.editorLineHeight + "rem;\n          --line-width:" + this.settings.lineWidth + "rem;\n          --font-monospace:" + this.settings.monoFont + ";\n          --text:" + this.settings.textFont + ";\n          --text-editor:" + this.settings.editorFont + ";\n          --accent-h:" + this.settings.accentHue + ";\n          --accent-s:" + this.settings.accentSat + "%;\n        }\n      ")
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
        containerEl.createEl("a", { text: "⬤ Accent color" });
        containerEl.createEl("h3");
        new obsidian.Setting(containerEl)
            .setName("Accent color hue")
            .setDesc("For links and interactive elements")
            .addSlider(function (slider) {
            return slider
                .setLimits(0, 360, 1)
                .setValue(_this.plugin.settings.accentHue)
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
                .setValue(_this.plugin.settings.accentSat)
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
        new obsidian.Setting(containerEl)
            .setName("Body line height")
            .setDesc("Used for the main text (default 1.88889)")
            .addText(function (text) {
            return text
                .setPlaceholder("1.88889")
                .setValue((_this.plugin.settings.editorLineHeight || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.editorLineHeight = parseFloat(value.trim());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsImV4dGVuc2lvbnMvZW1iZWRkZWRIZWFkaW5ncy50cyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2xpYi9wYXRoX3BhcnNlLmpzIiwibm9kZV9tb2R1bGVzL3N2Z3BhdGgvbGliL21hdHJpeC5qcyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2xpYi90cmFuc2Zvcm1fcGFyc2UuanMiLCJub2RlX21vZHVsZXMvc3ZncGF0aC9saWIvYTJjLmpzIiwibm9kZV9tb2R1bGVzL3N2Z3BhdGgvbGliL2VsbGlwc2UuanMiLCJub2RlX21vZHVsZXMvc3ZncGF0aC9saWIvc3ZncGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9zdmdwYXRoL2luZGV4LmpzIiwiZXh0ZW5zaW9ucy9ib3hpY29ucy50cyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtYmVkZGVkSGVhZGluZ3NFeHRlbnNpb24ge1xuICBoZWFkaW5nczogeyBbaWQ6IHN0cmluZ106IHtcbiAgICBsZWFmOiBXb3Jrc3BhY2VMZWFmLFxuICAgIHJlc2l6ZVdhdGNoZXI6IGFueX0gfSA9IHt9O1xuXG4gIHJlbW92ZUhlYWRpbmcoaWQ6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5oZWFkaW5nc1tpZF0pIHJldHVybjtcblxuICAgIGNvbnN0IGgxRWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2lkfS1lZGl0YCk7XG4gICAgY29uc3QgaDFQcmV2aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7aWR9LXByZXZpZXdgKTtcblxuICAgIGlmIChoMUVkaXQpIGgxRWRpdC5yZW1vdmUoKTtcbiAgICBpZiAoaDFQcmV2aWV3KSBoMVByZXZpZXcucmVtb3ZlKCk7XG5cbiAgICB0aGlzLmhlYWRpbmdzW2lkXS5yZXNpemVXYXRjaGVyLmRpc2Nvbm5lY3QoKVxuXG4gICAgZGVsZXRlIHRoaXMuaGVhZGluZ3NbaWRdLnJlc2l6ZVdhdGNoZXI7XG4gICAgZGVsZXRlIHRoaXMuaGVhZGluZ3NbaWRdO1xuICB9XG5cbiAgY3JlYXRlSGVhZGluZyhpZDogc3RyaW5nLCBsZWFmOiBXb3Jrc3BhY2VMZWFmKSB7XG4gICAgaWYgKHRoaXMuaGVhZGluZ3NbaWRdKSByZXR1cm47XG5cbiAgICBjb25zdCBoZWFkZXIgPSBsZWFmLnZpZXcuY29udGFpbmVyRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcbiAgICAgIFwidmlldy1oZWFkZXItdGl0bGVcIlxuICAgICk7XG5cbiAgICBjb25zdCB2aWV3Q29udGVudCA9IGxlYWYudmlldy5jb250YWluZXJFbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgXCJDb2RlTWlycm9yLXNjcm9sbFwiXG4gICAgKTtcblxuICAgIGNvbnN0IGxpbmVzID0gbGVhZi52aWV3LmNvbnRhaW5lckVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXG4gICAgICBcIkNvZGVNaXJyb3ItbGluZXNcIlxuICAgICk7XG5cbiAgICBjb25zdCBwcmV2aWV3Q29udGVudCA9IGxlYWYudmlldy5jb250YWluZXJFbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgXCJtYXJrZG93bi1wcmV2aWV3LXZpZXdcIlxuICAgICk7XG5cbiAgICBpZiAoaGVhZGVyLmxlbmd0aCAmJiB2aWV3Q29udGVudC5sZW5ndGggJiYgcHJldmlld0NvbnRlbnQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlZGl0RWwgPSB2aWV3Q29udGVudFswXSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgIGNvbnN0IGgxRWRpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcblxuICAgICAgaDFFZGl0LnNldFRleHQoKGhlYWRlclswXSBhcyBIVE1MRGl2RWxlbWVudCkuaW5uZXJUZXh0KTtcbiAgICAgIGgxRWRpdC5pZCA9IGAke2lkfS1lZGl0YDtcbiAgICAgIGVkaXRFbC5wcmVwZW5kKGgxRWRpdCk7XG5cbiAgICAgIGxldCBkZWJvdW5jZVRpbWVyID0gMDtcblxuICAgICAgY29uc3QgcmVzaXplV2F0Y2hlciA9IG5ldyAod2luZG93IGFzIGFueSkuUmVzaXplT2JzZXJ2ZXIoKGVudHJpZXM6IGFueSkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVib3VuY2VUaW1lcilcblxuICAgICAgICBkZWJvdW5jZVRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzRWwgPSBsaW5lc1swXSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IE1hdGguY2VpbChlbnRyaWVzWzBdLmJvcmRlckJveFNpemVbMF0uYmxvY2tTaXplKTtcbiAgICBcbiAgICAgICAgICAgIGxpbmVzRWwuc3R5bGUucGFkZGluZ1RvcCA9IGAke2hlaWdodH1weGA7XG4gICAgICAgICAgICBoMUVkaXQuc3R5bGUubWFyZ2luQm90dG9tID0gYC0ke2hlaWdodH1weGA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAyMClcbiAgICAgIH0pXG5cbiAgICAgIHJlc2l6ZVdhdGNoZXIub2JzZXJ2ZShoMUVkaXQpXG5cbiAgICAgIGNvbnN0IHByZXZpZXdFbCA9IHByZXZpZXdDb250ZW50WzBdIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgY29uc3QgaDFQcmV2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuXG4gICAgICBoMVByZXZpZXcuc2V0VGV4dCgoaGVhZGVyWzBdIGFzIEhUTUxEaXZFbGVtZW50KS5pbm5lclRleHQpO1xuICAgICAgaDFQcmV2aWV3LmlkID0gYCR7aWR9LXByZXZpZXdgO1xuICAgICAgcHJldmlld0VsLnByZXBlbmQoaDFQcmV2aWV3KTtcblxuICAgICAgdGhpcy5oZWFkaW5nc1tpZF0gPSB7IGxlYWYsIHJlc2l6ZVdhdGNoZXIgfTtcbiAgICB9XG4gIH1cblxuICBnZXRMZWFmSWQobGVhZjogV29ya3NwYWNlTGVhZikge1xuICAgIGNvbnN0IHZpZXdTdGF0ZSA9IGxlYWYuZ2V0Vmlld1N0YXRlKCk7XG5cbiAgICBpZiAodmlld1N0YXRlLnR5cGUgPT09IFwibWFya2Rvd25cIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgXCJ0aXRsZS1cIiArXG4gICAgICAgICgoKGxlYWYgYXMgYW55KS5pZCBhcyBzdHJpbmcpICsgdmlld1N0YXRlLnN0YXRlLmZpbGUpLnJlcGxhY2UoXG4gICAgICAgICAgL15bXmEtel0rfFteXFx3Oi4tXSsvZ2ksXG4gICAgICAgICAgXCJcIlxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY3JlYXRlSGVhZGluZ3MoYXBwOiBBcHApIHtcbiAgICBjb25zdCBzZWVuOiB7IFtrOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuICAgIGFwcC53b3Jrc3BhY2UuaXRlcmF0ZVJvb3RMZWF2ZXMoKGxlYWYpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRMZWFmSWQobGVhZik7XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICB0aGlzLmNyZWF0ZUhlYWRpbmcoaWQsIGxlYWYpO1xuICAgICAgICBzZWVuW2lkXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLmhlYWRpbmdzKS5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgaWYgKCFzZWVuW2lkXSkge1xuICAgICAgICB0aGlzLnJlbW92ZUhlYWRpbmcoaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25sb2FkKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcImVtYmVkZGVkLW5vdGUtdGl0bGVcIik7XG4gIH1cblxuICBvbnVubG9hZCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJlbWJlZGRlZC1ub3RlLXRpdGxlXCIpO1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5oZWFkaW5ncykuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlSGVhZGluZyhpZCk7XG4gICAgfSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgcGFyYW1Db3VudHMgPSB7IGE6IDcsIGM6IDYsIGg6IDEsIGw6IDIsIG06IDIsIHI6IDQsIHE6IDQsIHM6IDQsIHQ6IDIsIHY6IDEsIHo6IDAgfTtcblxudmFyIFNQRUNJQUxfU1BBQ0VTID0gW1xuICAweDE2ODAsIDB4MTgwRSwgMHgyMDAwLCAweDIwMDEsIDB4MjAwMiwgMHgyMDAzLCAweDIwMDQsIDB4MjAwNSwgMHgyMDA2LFxuICAweDIwMDcsIDB4MjAwOCwgMHgyMDA5LCAweDIwMEEsIDB4MjAyRiwgMHgyMDVGLCAweDMwMDAsIDB4RkVGRlxuXTtcblxuZnVuY3Rpb24gaXNTcGFjZShjaCkge1xuICByZXR1cm4gKGNoID09PSAweDBBKSB8fCAoY2ggPT09IDB4MEQpIHx8IChjaCA9PT0gMHgyMDI4KSB8fCAoY2ggPT09IDB4MjAyOSkgfHwgLy8gTGluZSB0ZXJtaW5hdG9yc1xuICAgIC8vIFdoaXRlIHNwYWNlc1xuICAgIChjaCA9PT0gMHgyMCkgfHwgKGNoID09PSAweDA5KSB8fCAoY2ggPT09IDB4MEIpIHx8IChjaCA9PT0gMHgwQykgfHwgKGNoID09PSAweEEwKSB8fFxuICAgIChjaCA+PSAweDE2ODAgJiYgU1BFQ0lBTF9TUEFDRVMuaW5kZXhPZihjaCkgPj0gMCk7XG59XG5cbmZ1bmN0aW9uIGlzQ29tbWFuZChjb2RlKSB7XG4gIC8qZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSovXG4gIHN3aXRjaCAoY29kZSB8IDB4MjApIHtcbiAgICBjYXNlIDB4NkQvKiBtICovOlxuICAgIGNhc2UgMHg3QS8qIHogKi86XG4gICAgY2FzZSAweDZDLyogbCAqLzpcbiAgICBjYXNlIDB4NjgvKiBoICovOlxuICAgIGNhc2UgMHg3Ni8qIHYgKi86XG4gICAgY2FzZSAweDYzLyogYyAqLzpcbiAgICBjYXNlIDB4NzMvKiBzICovOlxuICAgIGNhc2UgMHg3MS8qIHEgKi86XG4gICAgY2FzZSAweDc0LyogdCAqLzpcbiAgICBjYXNlIDB4NjEvKiBhICovOlxuICAgIGNhc2UgMHg3Mi8qIHIgKi86XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzQXJjKGNvZGUpIHtcbiAgcmV0dXJuIChjb2RlIHwgMHgyMCkgPT09IDB4NjE7XG59XG5cbmZ1bmN0aW9uIGlzRGlnaXQoY29kZSkge1xuICByZXR1cm4gKGNvZGUgPj0gNDggJiYgY29kZSA8PSA1Nyk7ICAgLy8gMC4uOVxufVxuXG5mdW5jdGlvbiBpc0RpZ2l0U3RhcnQoY29kZSkge1xuICByZXR1cm4gKGNvZGUgPj0gNDggJiYgY29kZSA8PSA1NykgfHwgLyogMC4uOSAqL1xuICAgICAgICAgIGNvZGUgPT09IDB4MkIgfHwgLyogKyAqL1xuICAgICAgICAgIGNvZGUgPT09IDB4MkQgfHwgLyogLSAqL1xuICAgICAgICAgIGNvZGUgPT09IDB4MkU7ICAgLyogLiAqL1xufVxuXG5cbmZ1bmN0aW9uIFN0YXRlKHBhdGgpIHtcbiAgdGhpcy5pbmRleCAgPSAwO1xuICB0aGlzLnBhdGggICA9IHBhdGg7XG4gIHRoaXMubWF4ICAgID0gcGF0aC5sZW5ndGg7XG4gIHRoaXMucmVzdWx0ID0gW107XG4gIHRoaXMucGFyYW0gID0gMC4wO1xuICB0aGlzLmVyciAgICA9ICcnO1xuICB0aGlzLnNlZ21lbnRTdGFydCA9IDA7XG4gIHRoaXMuZGF0YSAgID0gW107XG59XG5cbmZ1bmN0aW9uIHNraXBTcGFjZXMoc3RhdGUpIHtcbiAgd2hpbGUgKHN0YXRlLmluZGV4IDwgc3RhdGUubWF4ICYmIGlzU3BhY2Uoc3RhdGUucGF0aC5jaGFyQ29kZUF0KHN0YXRlLmluZGV4KSkpIHtcbiAgICBzdGF0ZS5pbmRleCsrO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc2NhbkZsYWcoc3RhdGUpIHtcbiAgdmFyIGNoID0gc3RhdGUucGF0aC5jaGFyQ29kZUF0KHN0YXRlLmluZGV4KTtcblxuICBpZiAoY2ggPT09IDB4MzAvKiAwICovKSB7XG4gICAgc3RhdGUucGFyYW0gPSAwO1xuICAgIHN0YXRlLmluZGV4Kys7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNoID09PSAweDMxLyogMSAqLykge1xuICAgIHN0YXRlLnBhcmFtID0gMTtcbiAgICBzdGF0ZS5pbmRleCsrO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRlLmVyciA9ICdTdmdQYXRoOiBhcmMgZmxhZyBjYW4gYmUgMCBvciAxIG9ubHkgKGF0IHBvcyAnICsgc3RhdGUuaW5kZXggKyAnKSc7XG59XG5cblxuZnVuY3Rpb24gc2NhblBhcmFtKHN0YXRlKSB7XG4gIHZhciBzdGFydCA9IHN0YXRlLmluZGV4LFxuICAgICAgaW5kZXggPSBzdGFydCxcbiAgICAgIG1heCA9IHN0YXRlLm1heCxcbiAgICAgIHplcm9GaXJzdCA9IGZhbHNlLFxuICAgICAgaGFzQ2VpbGluZyA9IGZhbHNlLFxuICAgICAgaGFzRGVjaW1hbCA9IGZhbHNlLFxuICAgICAgaGFzRG90ID0gZmFsc2UsXG4gICAgICBjaDtcblxuICBpZiAoaW5kZXggPj0gbWF4KSB7XG4gICAgc3RhdGUuZXJyID0gJ1N2Z1BhdGg6IG1pc3NlZCBwYXJhbSAoYXQgcG9zICcgKyBpbmRleCArICcpJztcbiAgICByZXR1cm47XG4gIH1cbiAgY2ggPSBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpO1xuXG4gIGlmIChjaCA9PT0gMHgyQi8qICsgKi8gfHwgY2ggPT09IDB4MkQvKiAtICovKSB7XG4gICAgaW5kZXgrKztcbiAgICBjaCA9IChpbmRleCA8IG1heCkgPyBzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpIDogMDtcbiAgfVxuXG4gIC8vIFRoaXMgbG9naWMgaXMgc2hhbWVsZXNzbHkgYm9ycm93ZWQgZnJvbSBFc3ByaW1hXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hcml5YS9lc3ByaW1hc1xuICAvL1xuICBpZiAoIWlzRGlnaXQoY2gpICYmIGNoICE9PSAweDJFLyogLiAqLykge1xuICAgIHN0YXRlLmVyciA9ICdTdmdQYXRoOiBwYXJhbSBzaG91bGQgc3RhcnQgd2l0aCAwLi45IG9yIGAuYCAoYXQgcG9zICcgKyBpbmRleCArICcpJztcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2ggIT09IDB4MkUvKiAuICovKSB7XG4gICAgemVyb0ZpcnN0ID0gKGNoID09PSAweDMwLyogMCAqLyk7XG4gICAgaW5kZXgrKztcblxuICAgIGNoID0gKGluZGV4IDwgbWF4KSA/IHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkgOiAwO1xuXG4gICAgaWYgKHplcm9GaXJzdCAmJiBpbmRleCA8IG1heCkge1xuICAgICAgLy8gZGVjaW1hbCBudW1iZXIgc3RhcnRzIHdpdGggJzAnIHN1Y2ggYXMgJzA5JyBpcyBpbGxlZ2FsLlxuICAgICAgaWYgKGNoICYmIGlzRGlnaXQoY2gpKSB7XG4gICAgICAgIHN0YXRlLmVyciA9ICdTdmdQYXRoOiBudW1iZXJzIHN0YXJ0ZWQgd2l0aCBgMGAgc3VjaCBhcyBgMDlgIGFyZSBpbGxlZ2FsIChhdCBwb3MgJyArIHN0YXJ0ICsgJyknO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKGluZGV4IDwgbWF4ICYmIGlzRGlnaXQoc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgIGluZGV4Kys7XG4gICAgICBoYXNDZWlsaW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgY2ggPSAoaW5kZXggPCBtYXgpID8gc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSA6IDA7XG4gIH1cblxuICBpZiAoY2ggPT09IDB4MkUvKiAuICovKSB7XG4gICAgaGFzRG90ID0gdHJ1ZTtcbiAgICBpbmRleCsrO1xuICAgIHdoaWxlIChpc0RpZ2l0KHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICBpbmRleCsrO1xuICAgICAgaGFzRGVjaW1hbCA9IHRydWU7XG4gICAgfVxuICAgIGNoID0gKGluZGV4IDwgbWF4KSA/IHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkgOiAwO1xuICB9XG5cbiAgaWYgKGNoID09PSAweDY1LyogZSAqLyB8fCBjaCA9PT0gMHg0NS8qIEUgKi8pIHtcbiAgICBpZiAoaGFzRG90ICYmICFoYXNDZWlsaW5nICYmICFoYXNEZWNpbWFsKSB7XG4gICAgICBzdGF0ZS5lcnIgPSAnU3ZnUGF0aDogaW52YWxpZCBmbG9hdCBleHBvbmVudCAoYXQgcG9zICcgKyBpbmRleCArICcpJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpbmRleCsrO1xuXG4gICAgY2ggPSAoaW5kZXggPCBtYXgpID8gc3RhdGUucGF0aC5jaGFyQ29kZUF0KGluZGV4KSA6IDA7XG4gICAgaWYgKGNoID09PSAweDJCLyogKyAqLyB8fCBjaCA9PT0gMHgyRC8qIC0gKi8pIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIGlmIChpbmRleCA8IG1heCAmJiBpc0RpZ2l0KHN0YXRlLnBhdGguY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICB3aGlsZSAoaW5kZXggPCBtYXggJiYgaXNEaWdpdChzdGF0ZS5wYXRoLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5lcnIgPSAnU3ZnUGF0aDogaW52YWxpZCBmbG9hdCBleHBvbmVudCAoYXQgcG9zICcgKyBpbmRleCArICcpJztcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4O1xuICBzdGF0ZS5wYXJhbSA9IHBhcnNlRmxvYXQoc3RhdGUucGF0aC5zbGljZShzdGFydCwgaW5kZXgpKSArIDAuMDtcbn1cblxuXG5mdW5jdGlvbiBmaW5hbGl6ZVNlZ21lbnQoc3RhdGUpIHtcbiAgdmFyIGNtZCwgY21kTEM7XG5cbiAgLy8gUHJvY2VzcyBkdXBsaWNhdGVkIGNvbW1hbmRzICh3aXRob3V0IGNvbWFuZCBuYW1lKVxuXG4gIC8vIFRoaXMgbG9naWMgaXMgc2hhbWVsZXNzbHkgYm9ycm93ZWQgZnJvbSBSYXBoYWVsXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EbWl0cnlCYXJhbm92c2tpeS9yYXBoYWVsL1xuICAvL1xuICBjbWQgICA9IHN0YXRlLnBhdGhbc3RhdGUuc2VnbWVudFN0YXJ0XTtcbiAgY21kTEMgPSBjbWQudG9Mb3dlckNhc2UoKTtcblxuICB2YXIgcGFyYW1zID0gc3RhdGUuZGF0YTtcblxuICBpZiAoY21kTEMgPT09ICdtJyAmJiBwYXJhbXMubGVuZ3RoID4gMikge1xuICAgIHN0YXRlLnJlc3VsdC5wdXNoKFsgY21kLCBwYXJhbXNbMF0sIHBhcmFtc1sxXSBdKTtcbiAgICBwYXJhbXMgPSBwYXJhbXMuc2xpY2UoMik7XG4gICAgY21kTEMgPSAnbCc7XG4gICAgY21kID0gKGNtZCA9PT0gJ20nKSA/ICdsJyA6ICdMJztcbiAgfVxuXG4gIGlmIChjbWRMQyA9PT0gJ3InKSB7XG4gICAgc3RhdGUucmVzdWx0LnB1c2goWyBjbWQgXS5jb25jYXQocGFyYW1zKSk7XG4gIH0gZWxzZSB7XG5cbiAgICB3aGlsZSAocGFyYW1zLmxlbmd0aCA+PSBwYXJhbUNvdW50c1tjbWRMQ10pIHtcbiAgICAgIHN0YXRlLnJlc3VsdC5wdXNoKFsgY21kIF0uY29uY2F0KHBhcmFtcy5zcGxpY2UoMCwgcGFyYW1Db3VudHNbY21kTENdKSkpO1xuICAgICAgaWYgKCFwYXJhbUNvdW50c1tjbWRMQ10pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gc2NhblNlZ21lbnQoc3RhdGUpIHtcbiAgdmFyIG1heCA9IHN0YXRlLm1heCxcbiAgICAgIGNtZENvZGUsIGlzX2FyYywgY29tbWFfZm91bmQsIG5lZWRfcGFyYW1zLCBpO1xuXG4gIHN0YXRlLnNlZ21lbnRTdGFydCA9IHN0YXRlLmluZGV4O1xuICBjbWRDb2RlID0gc3RhdGUucGF0aC5jaGFyQ29kZUF0KHN0YXRlLmluZGV4KTtcbiAgaXNfYXJjID0gaXNBcmMoY21kQ29kZSk7XG5cbiAgaWYgKCFpc0NvbW1hbmQoY21kQ29kZSkpIHtcbiAgICBzdGF0ZS5lcnIgPSAnU3ZnUGF0aDogYmFkIGNvbW1hbmQgJyArIHN0YXRlLnBhdGhbc3RhdGUuaW5kZXhdICsgJyAoYXQgcG9zICcgKyBzdGF0ZS5pbmRleCArICcpJztcbiAgICByZXR1cm47XG4gIH1cblxuICBuZWVkX3BhcmFtcyA9IHBhcmFtQ291bnRzW3N0YXRlLnBhdGhbc3RhdGUuaW5kZXhdLnRvTG93ZXJDYXNlKCldO1xuXG4gIHN0YXRlLmluZGV4Kys7XG4gIHNraXBTcGFjZXMoc3RhdGUpO1xuXG4gIHN0YXRlLmRhdGEgPSBbXTtcblxuICBpZiAoIW5lZWRfcGFyYW1zKSB7XG4gICAgLy8gWlxuICAgIGZpbmFsaXplU2VnbWVudChzdGF0ZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29tbWFfZm91bmQgPSBmYWxzZTtcblxuICBmb3IgKDs7KSB7XG4gICAgZm9yIChpID0gbmVlZF9wYXJhbXM7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGlmIChpc19hcmMgJiYgKGkgPT09IDMgfHwgaSA9PT0gNCkpIHNjYW5GbGFnKHN0YXRlKTtcbiAgICAgIGVsc2Ugc2NhblBhcmFtKHN0YXRlKTtcblxuICAgICAgaWYgKHN0YXRlLmVyci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3RhdGUuZGF0YS5wdXNoKHN0YXRlLnBhcmFtKTtcblxuICAgICAgc2tpcFNwYWNlcyhzdGF0ZSk7XG4gICAgICBjb21tYV9mb3VuZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoc3RhdGUuaW5kZXggPCBtYXggJiYgc3RhdGUucGF0aC5jaGFyQ29kZUF0KHN0YXRlLmluZGV4KSA9PT0gMHgyQy8qICwgKi8pIHtcbiAgICAgICAgc3RhdGUuaW5kZXgrKztcbiAgICAgICAgc2tpcFNwYWNlcyhzdGF0ZSk7XG4gICAgICAgIGNvbW1hX2ZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhZnRlciAnLCcgcGFyYW0gaXMgbWFuZGF0b3J5XG4gICAgaWYgKGNvbW1hX2ZvdW5kKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuaW5kZXggPj0gc3RhdGUubWF4KSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBTdG9wIG9uIG5leHQgc2VnbWVudFxuICAgIGlmICghaXNEaWdpdFN0YXJ0KHN0YXRlLnBhdGguY2hhckNvZGVBdChzdGF0ZS5pbmRleCkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBmaW5hbGl6ZVNlZ21lbnQoc3RhdGUpO1xufVxuXG5cbi8qIFJldHVybnMgYXJyYXkgb2Ygc2VnbWVudHM6XG4gKlxuICogW1xuICogICBbIGNvbW1hbmQsIGNvb3JkMSwgY29vcmQyLCAuLi4gXVxuICogXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhdGhQYXJzZShzdmdQYXRoKSB7XG4gIHZhciBzdGF0ZSA9IG5ldyBTdGF0ZShzdmdQYXRoKTtcbiAgdmFyIG1heCA9IHN0YXRlLm1heDtcblxuICBza2lwU3BhY2VzKHN0YXRlKTtcblxuICB3aGlsZSAoc3RhdGUuaW5kZXggPCBtYXggJiYgIXN0YXRlLmVyci5sZW5ndGgpIHtcbiAgICBzY2FuU2VnbWVudChzdGF0ZSk7XG4gIH1cblxuICBpZiAoc3RhdGUuZXJyLmxlbmd0aCkge1xuICAgIHN0YXRlLnJlc3VsdCA9IFtdO1xuXG4gIH0gZWxzZSBpZiAoc3RhdGUucmVzdWx0Lmxlbmd0aCkge1xuXG4gICAgaWYgKCdtTScuaW5kZXhPZihzdGF0ZS5yZXN1bHRbMF1bMF0pIDwgMCkge1xuICAgICAgc3RhdGUuZXJyID0gJ1N2Z1BhdGg6IHN0cmluZyBzaG91bGQgc3RhcnQgd2l0aCBgTWAgb3IgYG1gJztcbiAgICAgIHN0YXRlLnJlc3VsdCA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5yZXN1bHRbMF1bMF0gPSAnTSc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlcnI6IHN0YXRlLmVycixcbiAgICBzZWdtZW50czogc3RhdGUucmVzdWx0XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb21iaW5lIDIgbWF0cml4ZXNcbi8vIG0xLCBtMiAtIFthLCBiLCBjLCBkLCBlLCBnXVxuLy9cbmZ1bmN0aW9uIGNvbWJpbmUobTEsIG0yKSB7XG4gIHJldHVybiBbXG4gICAgbTFbMF0gKiBtMlswXSArIG0xWzJdICogbTJbMV0sXG4gICAgbTFbMV0gKiBtMlswXSArIG0xWzNdICogbTJbMV0sXG4gICAgbTFbMF0gKiBtMlsyXSArIG0xWzJdICogbTJbM10sXG4gICAgbTFbMV0gKiBtMlsyXSArIG0xWzNdICogbTJbM10sXG4gICAgbTFbMF0gKiBtMls0XSArIG0xWzJdICogbTJbNV0gKyBtMVs0XSxcbiAgICBtMVsxXSAqIG0yWzRdICsgbTFbM10gKiBtMls1XSArIG0xWzVdXG4gIF07XG59XG5cblxuZnVuY3Rpb24gTWF0cml4KCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTWF0cml4KSkgeyByZXR1cm4gbmV3IE1hdHJpeCgpOyB9XG4gIHRoaXMucXVldWUgPSBbXTsgICAvLyBsaXN0IG9mIG1hdHJpeGVzIHRvIGFwcGx5XG4gIHRoaXMuY2FjaGUgPSBudWxsOyAvLyBjb21iaW5lZCBtYXRyaXggY2FjaGVcbn1cblxuXG5NYXRyaXgucHJvdG90eXBlLm1hdHJpeCA9IGZ1bmN0aW9uIChtKSB7XG4gIGlmIChtWzBdID09PSAxICYmIG1bMV0gPT09IDAgJiYgbVsyXSA9PT0gMCAmJiBtWzNdID09PSAxICYmIG1bNF0gPT09IDAgJiYgbVs1XSA9PT0gMCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuY2FjaGUgPSBudWxsO1xuICB0aGlzLnF1ZXVlLnB1c2gobSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5NYXRyaXgucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uICh0eCwgdHkpIHtcbiAgaWYgKHR4ICE9PSAwIHx8IHR5ICE9PSAwKSB7XG4gICAgdGhpcy5jYWNoZSA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKFsgMSwgMCwgMCwgMSwgdHgsIHR5IF0pO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5NYXRyaXgucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24gKHN4LCBzeSkge1xuICBpZiAoc3ggIT09IDEgfHwgc3kgIT09IDEpIHtcbiAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgICB0aGlzLnF1ZXVlLnB1c2goWyBzeCwgMCwgMCwgc3ksIDAsIDAgXSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbk1hdHJpeC5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGFuZ2xlLCByeCwgcnkpIHtcbiAgdmFyIHJhZCwgY29zLCBzaW47XG5cbiAgaWYgKGFuZ2xlICE9PSAwKSB7XG4gICAgdGhpcy50cmFuc2xhdGUocngsIHJ5KTtcblxuICAgIHJhZCA9IGFuZ2xlICogTWF0aC5QSSAvIDE4MDtcbiAgICBjb3MgPSBNYXRoLmNvcyhyYWQpO1xuICAgIHNpbiA9IE1hdGguc2luKHJhZCk7XG5cbiAgICB0aGlzLnF1ZXVlLnB1c2goWyBjb3MsIHNpbiwgLXNpbiwgY29zLCAwLCAwIF0pO1xuICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuXG4gICAgdGhpcy50cmFuc2xhdGUoLXJ4LCAtcnkpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5NYXRyaXgucHJvdG90eXBlLnNrZXdYID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG4gIGlmIChhbmdsZSAhPT0gMCkge1xuICAgIHRoaXMuY2FjaGUgPSBudWxsO1xuICAgIHRoaXMucXVldWUucHVzaChbIDEsIDAsIE1hdGgudGFuKGFuZ2xlICogTWF0aC5QSSAvIDE4MCksIDEsIDAsIDAgXSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbk1hdHJpeC5wcm90b3R5cGUuc2tld1kgPSBmdW5jdGlvbiAoYW5nbGUpIHtcbiAgaWYgKGFuZ2xlICE9PSAwKSB7XG4gICAgdGhpcy5jYWNoZSA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKFsgMSwgTWF0aC50YW4oYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSwgMCwgMSwgMCwgMCBdKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gRmxhdHRlbiBxdWV1ZVxuLy9cbk1hdHJpeC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuY2FjaGUpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZTtcbiAgfVxuXG4gIGlmICghdGhpcy5xdWV1ZS5sZW5ndGgpIHtcbiAgICB0aGlzLmNhY2hlID0gWyAxLCAwLCAwLCAxLCAwLCAwIF07XG4gICAgcmV0dXJuIHRoaXMuY2FjaGU7XG4gIH1cblxuICB0aGlzLmNhY2hlID0gdGhpcy5xdWV1ZVswXTtcblxuICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy5xdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuY2FjaGUgPSBjb21iaW5lKHRoaXMuY2FjaGUsIHRoaXMucXVldWVbaV0pO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuY2FjaGU7XG59O1xuXG5cbi8vIEFwcGx5IGxpc3Qgb2YgbWF0cml4ZXMgdG8gKHgseSkgcG9pbnQuXG4vLyBJZiBgaXNSZWxhdGl2ZWAgc2V0LCBgdHJhbnNsYXRlYCBjb21wb25lbnQgb2YgbWF0cml4IHdpbGwgYmUgc2tpcHBlZFxuLy9cbk1hdHJpeC5wcm90b3R5cGUuY2FsYyA9IGZ1bmN0aW9uICh4LCB5LCBpc1JlbGF0aXZlKSB7XG4gIHZhciBtO1xuXG4gIC8vIERvbid0IGNoYW5nZSBwb2ludCBvbiBlbXB0eSB0cmFuc2Zvcm1zIHF1ZXVlXG4gIGlmICghdGhpcy5xdWV1ZS5sZW5ndGgpIHsgcmV0dXJuIFsgeCwgeSBdOyB9XG5cbiAgLy8gQ2FsY3VsYXRlIGZpbmFsIG1hdHJpeCwgaWYgbm90IGV4aXN0c1xuICAvL1xuICAvLyBOQi4gaWYgeW91IGRlc2lkZSB0byBhcHBseSB0cmFuc2Zvcm1zIHRvIHBvaW50IG9uZS1ieS1vbmUsXG4gIC8vIHRoZXkgc2hvdWxkIGJlIHRha2VuIGluIHJldmVyc2Ugb3JkZXJcblxuICBpZiAoIXRoaXMuY2FjaGUpIHtcbiAgICB0aGlzLmNhY2hlID0gdGhpcy50b0FycmF5KCk7XG4gIH1cblxuICBtID0gdGhpcy5jYWNoZTtcblxuICAvLyBBcHBseSBtYXRyaXggdG8gcG9pbnRcbiAgcmV0dXJuIFtcbiAgICB4ICogbVswXSArIHkgKiBtWzJdICsgKGlzUmVsYXRpdmUgPyAwIDogbVs0XSksXG4gICAgeCAqIG1bMV0gKyB5ICogbVszXSArIChpc1JlbGF0aXZlID8gMCA6IG1bNV0pXG4gIF07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWF0cml4O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBNYXRyaXggPSByZXF1aXJlKCcuL21hdHJpeCcpO1xuXG52YXIgb3BlcmF0aW9ucyA9IHtcbiAgbWF0cml4OiB0cnVlLFxuICBzY2FsZTogdHJ1ZSxcbiAgcm90YXRlOiB0cnVlLFxuICB0cmFuc2xhdGU6IHRydWUsXG4gIHNrZXdYOiB0cnVlLFxuICBza2V3WTogdHJ1ZVxufTtcblxudmFyIENNRF9TUExJVF9SRSAgICA9IC9cXHMqKG1hdHJpeHx0cmFuc2xhdGV8c2NhbGV8cm90YXRlfHNrZXdYfHNrZXdZKVxccypcXChcXHMqKC4rPylcXHMqXFwpW1xccyxdKi87XG52YXIgUEFSQU1TX1NQTElUX1JFID0gL1tcXHMsXSsvO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtUGFyc2UodHJhbnNmb3JtU3RyaW5nKSB7XG4gIHZhciBtYXRyaXggPSBuZXcgTWF0cml4KCk7XG4gIHZhciBjbWQsIHBhcmFtcztcblxuICAvLyBTcGxpdCB2YWx1ZSBpbnRvIFsnJywgJ3RyYW5zbGF0ZScsICcxMCA1MCcsICcnLCAnc2NhbGUnLCAnMicsICcnLCAncm90YXRlJywgICctNDUnLCAnJ11cbiAgdHJhbnNmb3JtU3RyaW5nLnNwbGl0KENNRF9TUExJVF9SRSkuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXG4gICAgLy8gU2tpcCBlbXB0eSBlbGVtZW50c1xuICAgIGlmICghaXRlbS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyByZW1lbWJlciBvcGVyYXRpb25cbiAgICBpZiAodHlwZW9mIG9wZXJhdGlvbnNbaXRlbV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjbWQgPSBpdGVtO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGV4dHJhY3QgcGFyYW1zICYgYXR0IG9wZXJhdGlvbiB0byBtYXRyaXhcbiAgICBwYXJhbXMgPSBpdGVtLnNwbGl0KFBBUkFNU19TUExJVF9SRSkubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICByZXR1cm4gK2kgfHwgMDtcbiAgICB9KTtcblxuICAgIC8vIElmIHBhcmFtcyBjb3VudCBpcyBub3QgY29ycmVjdCAtIGlnbm9yZSBjb21tYW5kXG4gICAgc3dpdGNoIChjbWQpIHtcbiAgICAgIGNhc2UgJ21hdHJpeCc6XG4gICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICAgbWF0cml4Lm1hdHJpeChwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnc2NhbGUnOlxuICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1hdHJpeC5zY2FsZShwYXJhbXNbMF0sIHBhcmFtc1swXSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIG1hdHJpeC5zY2FsZShwYXJhbXNbMF0sIHBhcmFtc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1hdHJpeC5yb3RhdGUocGFyYW1zWzBdLCAwLCAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgbWF0cml4LnJvdGF0ZShwYXJhbXNbMF0sIHBhcmFtc1sxXSwgcGFyYW1zWzJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ3RyYW5zbGF0ZSc6XG4gICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbWF0cml4LnRyYW5zbGF0ZShwYXJhbXNbMF0sIDApO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICBtYXRyaXgudHJhbnNsYXRlKHBhcmFtc1swXSwgcGFyYW1zWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ3NrZXdYJzpcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBtYXRyaXguc2tld1gocGFyYW1zWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ3NrZXdZJzpcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBtYXRyaXguc2tld1kocGFyYW1zWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbWF0cml4O1xufTtcbiIsIi8vIENvbnZlcnQgYW4gYXJjIHRvIGEgc2VxdWVuY2Ugb2YgY3ViaWMgYsOpemllciBjdXJ2ZXNcbi8vXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIFRBVSA9IE1hdGguUEkgKiAyO1xuXG5cbi8qIGVzbGludC1kaXNhYmxlIHNwYWNlLWluZml4LW9wcyAqL1xuXG4vLyBDYWxjdWxhdGUgYW4gYW5nbGUgYmV0d2VlbiB0d28gdW5pdCB2ZWN0b3JzXG4vL1xuLy8gU2luY2Ugd2UgbWVhc3VyZSBhbmdsZSBiZXR3ZWVuIHJhZGlpIG9mIGNpcmN1bGFyIGFyY3MsXG4vLyB3ZSBjYW4gdXNlIHNpbXBsaWZpZWQgbWF0aCAod2l0aG91dCBsZW5ndGggbm9ybWFsaXphdGlvbilcbi8vXG5mdW5jdGlvbiB1bml0X3ZlY3Rvcl9hbmdsZSh1eCwgdXksIHZ4LCB2eSkge1xuICB2YXIgc2lnbiA9ICh1eCAqIHZ5IC0gdXkgKiB2eCA8IDApID8gLTEgOiAxO1xuICB2YXIgZG90ICA9IHV4ICogdnggKyB1eSAqIHZ5O1xuXG4gIC8vIEFkZCB0aGlzIHRvIHdvcmsgd2l0aCBhcmJpdHJhcnkgdmVjdG9yczpcbiAgLy8gZG90IC89IE1hdGguc3FydCh1eCAqIHV4ICsgdXkgKiB1eSkgKiBNYXRoLnNxcnQodnggKiB2eCArIHZ5ICogdnkpO1xuXG4gIC8vIHJvdW5kaW5nIGVycm9ycywgZS5nLiAtMS4wMDAwMDAwMDAwMDAwMDAyIGNhbiBzY3JldyB1cCB0aGlzXG4gIGlmIChkb3QgPiAgMS4wKSB7IGRvdCA9ICAxLjA7IH1cbiAgaWYgKGRvdCA8IC0xLjApIHsgZG90ID0gLTEuMDsgfVxuXG4gIHJldHVybiBzaWduICogTWF0aC5hY29zKGRvdCk7XG59XG5cblxuLy8gQ29udmVydCBmcm9tIGVuZHBvaW50IHRvIGNlbnRlciBwYXJhbWV0ZXJpemF0aW9uLFxuLy8gc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ltcGxub3RlLmh0bWwjQXJjSW1wbGVtZW50YXRpb25Ob3Rlc1xuLy9cbi8vIFJldHVybiBbY3gsIGN5LCB0aGV0YTEsIGRlbHRhX3RoZXRhXVxuLy9cbmZ1bmN0aW9uIGdldF9hcmNfY2VudGVyKHgxLCB5MSwgeDIsIHkyLCBmYSwgZnMsIHJ4LCByeSwgc2luX3BoaSwgY29zX3BoaSkge1xuICAvLyBTdGVwIDEuXG4gIC8vXG4gIC8vIE1vdmluZyBhbiBlbGxpcHNlIHNvIG9yaWdpbiB3aWxsIGJlIHRoZSBtaWRkbGVwb2ludCBiZXR3ZWVuIG91ciB0d29cbiAgLy8gcG9pbnRzLiBBZnRlciB0aGF0LCByb3RhdGUgaXQgdG8gbGluZSB1cCBlbGxpcHNlIGF4ZXMgd2l0aCBjb29yZGluYXRlXG4gIC8vIGF4ZXMuXG4gIC8vXG4gIHZhciB4MXAgPSAgY29zX3BoaSooeDEteDIpLzIgKyBzaW5fcGhpKih5MS15MikvMjtcbiAgdmFyIHkxcCA9IC1zaW5fcGhpKih4MS14MikvMiArIGNvc19waGkqKHkxLXkyKS8yO1xuXG4gIHZhciByeF9zcSAgPSAgcnggKiByeDtcbiAgdmFyIHJ5X3NxICA9ICByeSAqIHJ5O1xuICB2YXIgeDFwX3NxID0geDFwICogeDFwO1xuICB2YXIgeTFwX3NxID0geTFwICogeTFwO1xuXG4gIC8vIFN0ZXAgMi5cbiAgLy9cbiAgLy8gQ29tcHV0ZSBjb29yZGluYXRlcyBvZiB0aGUgY2VudHJlIG9mIHRoaXMgZWxsaXBzZSAoY3gnLCBjeScpXG4gIC8vIGluIHRoZSBuZXcgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gIC8vXG4gIHZhciByYWRpY2FudCA9IChyeF9zcSAqIHJ5X3NxKSAtIChyeF9zcSAqIHkxcF9zcSkgLSAocnlfc3EgKiB4MXBfc3EpO1xuXG4gIGlmIChyYWRpY2FudCA8IDApIHtcbiAgICAvLyBkdWUgdG8gcm91bmRpbmcgZXJyb3JzIGl0IG1pZ2h0IGJlIGUuZy4gLTEuMzg3Nzc4NzgwNzgxNDQ1N2UtMTdcbiAgICByYWRpY2FudCA9IDA7XG4gIH1cblxuICByYWRpY2FudCAvPSAgIChyeF9zcSAqIHkxcF9zcSkgKyAocnlfc3EgKiB4MXBfc3EpO1xuICByYWRpY2FudCA9IE1hdGguc3FydChyYWRpY2FudCkgKiAoZmEgPT09IGZzID8gLTEgOiAxKTtcblxuICB2YXIgY3hwID0gcmFkaWNhbnQgKiAgcngvcnkgKiB5MXA7XG4gIHZhciBjeXAgPSByYWRpY2FudCAqIC1yeS9yeCAqIHgxcDtcblxuICAvLyBTdGVwIDMuXG4gIC8vXG4gIC8vIFRyYW5zZm9ybSBiYWNrIHRvIGdldCBjZW50cmUgY29vcmRpbmF0ZXMgKGN4LCBjeSkgaW4gdGhlIG9yaWdpbmFsXG4gIC8vIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAvL1xuICB2YXIgY3ggPSBjb3NfcGhpKmN4cCAtIHNpbl9waGkqY3lwICsgKHgxK3gyKS8yO1xuICB2YXIgY3kgPSBzaW5fcGhpKmN4cCArIGNvc19waGkqY3lwICsgKHkxK3kyKS8yO1xuXG4gIC8vIFN0ZXAgNC5cbiAgLy9cbiAgLy8gQ29tcHV0ZSBhbmdsZXMgKHRoZXRhMSwgZGVsdGFfdGhldGEpLlxuICAvL1xuICB2YXIgdjF4ID0gICh4MXAgLSBjeHApIC8gcng7XG4gIHZhciB2MXkgPSAgKHkxcCAtIGN5cCkgLyByeTtcbiAgdmFyIHYyeCA9ICgteDFwIC0gY3hwKSAvIHJ4O1xuICB2YXIgdjJ5ID0gKC15MXAgLSBjeXApIC8gcnk7XG5cbiAgdmFyIHRoZXRhMSA9IHVuaXRfdmVjdG9yX2FuZ2xlKDEsIDAsIHYxeCwgdjF5KTtcbiAgdmFyIGRlbHRhX3RoZXRhID0gdW5pdF92ZWN0b3JfYW5nbGUodjF4LCB2MXksIHYyeCwgdjJ5KTtcblxuICBpZiAoZnMgPT09IDAgJiYgZGVsdGFfdGhldGEgPiAwKSB7XG4gICAgZGVsdGFfdGhldGEgLT0gVEFVO1xuICB9XG4gIGlmIChmcyA9PT0gMSAmJiBkZWx0YV90aGV0YSA8IDApIHtcbiAgICBkZWx0YV90aGV0YSArPSBUQVU7XG4gIH1cblxuICByZXR1cm4gWyBjeCwgY3ksIHRoZXRhMSwgZGVsdGFfdGhldGEgXTtcbn1cblxuLy9cbi8vIEFwcHJveGltYXRlIG9uZSB1bml0IGFyYyBzZWdtZW50IHdpdGggYsOpemllciBjdXJ2ZXMsXG4vLyBzZWUgaHR0cDovL21hdGguc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzg3MzIyNFxuLy9cbmZ1bmN0aW9uIGFwcHJveGltYXRlX3VuaXRfYXJjKHRoZXRhMSwgZGVsdGFfdGhldGEpIHtcbiAgdmFyIGFscGhhID0gNC8zICogTWF0aC50YW4oZGVsdGFfdGhldGEvNCk7XG5cbiAgdmFyIHgxID0gTWF0aC5jb3ModGhldGExKTtcbiAgdmFyIHkxID0gTWF0aC5zaW4odGhldGExKTtcbiAgdmFyIHgyID0gTWF0aC5jb3ModGhldGExICsgZGVsdGFfdGhldGEpO1xuICB2YXIgeTIgPSBNYXRoLnNpbih0aGV0YTEgKyBkZWx0YV90aGV0YSk7XG5cbiAgcmV0dXJuIFsgeDEsIHkxLCB4MSAtIHkxKmFscGhhLCB5MSArIHgxKmFscGhhLCB4MiArIHkyKmFscGhhLCB5MiAtIHgyKmFscGhhLCB4MiwgeTIgXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhMmMoeDEsIHkxLCB4MiwgeTIsIGZhLCBmcywgcngsIHJ5LCBwaGkpIHtcbiAgdmFyIHNpbl9waGkgPSBNYXRoLnNpbihwaGkgKiBUQVUgLyAzNjApO1xuICB2YXIgY29zX3BoaSA9IE1hdGguY29zKHBoaSAqIFRBVSAvIDM2MCk7XG5cbiAgLy8gTWFrZSBzdXJlIHJhZGlpIGFyZSB2YWxpZFxuICAvL1xuICB2YXIgeDFwID0gIGNvc19waGkqKHgxLXgyKS8yICsgc2luX3BoaSooeTEteTIpLzI7XG4gIHZhciB5MXAgPSAtc2luX3BoaSooeDEteDIpLzIgKyBjb3NfcGhpKih5MS15MikvMjtcblxuICBpZiAoeDFwID09PSAwICYmIHkxcCA9PT0gMCkge1xuICAgIC8vIHdlJ3JlIGFza2VkIHRvIGRyYXcgbGluZSB0byBpdHNlbGZcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAocnggPT09IDAgfHwgcnkgPT09IDApIHtcbiAgICAvLyBvbmUgb2YgdGhlIHJhZGlpIGlzIHplcm9cbiAgICByZXR1cm4gW107XG4gIH1cblxuXG4gIC8vIENvbXBlbnNhdGUgb3V0LW9mLXJhbmdlIHJhZGlpXG4gIC8vXG4gIHJ4ID0gTWF0aC5hYnMocngpO1xuICByeSA9IE1hdGguYWJzKHJ5KTtcblxuICB2YXIgbGFtYmRhID0gKHgxcCAqIHgxcCkgLyAocnggKiByeCkgKyAoeTFwICogeTFwKSAvIChyeSAqIHJ5KTtcbiAgaWYgKGxhbWJkYSA+IDEpIHtcbiAgICByeCAqPSBNYXRoLnNxcnQobGFtYmRhKTtcbiAgICByeSAqPSBNYXRoLnNxcnQobGFtYmRhKTtcbiAgfVxuXG5cbiAgLy8gR2V0IGNlbnRlciBwYXJhbWV0ZXJzIChjeCwgY3ksIHRoZXRhMSwgZGVsdGFfdGhldGEpXG4gIC8vXG4gIHZhciBjYyA9IGdldF9hcmNfY2VudGVyKHgxLCB5MSwgeDIsIHkyLCBmYSwgZnMsIHJ4LCByeSwgc2luX3BoaSwgY29zX3BoaSk7XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgdGhldGExID0gY2NbMl07XG4gIHZhciBkZWx0YV90aGV0YSA9IGNjWzNdO1xuXG4gIC8vIFNwbGl0IGFuIGFyYyB0byBtdWx0aXBsZSBzZWdtZW50cywgc28gZWFjaCBzZWdtZW50XG4gIC8vIHdpbGwgYmUgbGVzcyB0aGFuIM+ELzQgKD0gOTDCsClcbiAgLy9cbiAgdmFyIHNlZ21lbnRzID0gTWF0aC5tYXgoTWF0aC5jZWlsKE1hdGguYWJzKGRlbHRhX3RoZXRhKSAvIChUQVUgLyA0KSksIDEpO1xuICBkZWx0YV90aGV0YSAvPSBzZWdtZW50cztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ21lbnRzOyBpKyspIHtcbiAgICByZXN1bHQucHVzaChhcHByb3hpbWF0ZV91bml0X2FyYyh0aGV0YTEsIGRlbHRhX3RoZXRhKSk7XG4gICAgdGhldGExICs9IGRlbHRhX3RoZXRhO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSBhIGJlemllciBhcHByb3hpbWF0aW9uIG9mIGEgdW5pdCBjaXJjbGUsXG4gIC8vIG5vdyBuZWVkIHRvIHRyYW5zZm9ybSBiYWNrIHRvIHRoZSBvcmlnaW5hbCBlbGxpcHNlXG4gIC8vXG4gIHJldHVybiByZXN1bHQubWFwKGZ1bmN0aW9uIChjdXJ2ZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VydmUubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciB4ID0gY3VydmVbaSArIDBdO1xuICAgICAgdmFyIHkgPSBjdXJ2ZVtpICsgMV07XG5cbiAgICAgIC8vIHNjYWxlXG4gICAgICB4ICo9IHJ4O1xuICAgICAgeSAqPSByeTtcblxuICAgICAgLy8gcm90YXRlXG4gICAgICB2YXIgeHAgPSBjb3NfcGhpKnggLSBzaW5fcGhpKnk7XG4gICAgICB2YXIgeXAgPSBzaW5fcGhpKnggKyBjb3NfcGhpKnk7XG5cbiAgICAgIC8vIHRyYW5zbGF0ZVxuICAgICAgY3VydmVbaSArIDBdID0geHAgKyBjY1swXTtcbiAgICAgIGN1cnZlW2kgKyAxXSA9IHlwICsgY2NbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnZlO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIGVzbGludC1kaXNhYmxlIHNwYWNlLWluZml4LW9wcyAqL1xuXG4vLyBUaGUgcHJlY2lzaW9uIHVzZWQgdG8gY29uc2lkZXIgYW4gZWxsaXBzZSBhcyBhIGNpcmNsZVxuLy9cbnZhciBlcHNpbG9uID0gMC4wMDAwMDAwMDAxO1xuXG4vLyBUbyBjb252ZXJ0IGRlZ3JlZSBpbiByYWRpYW5zXG4vL1xudmFyIHRvcmFkID0gTWF0aC5QSSAvIDE4MDtcblxuLy8gQ2xhc3MgY29uc3RydWN0b3IgOlxuLy8gIGFuIGVsbGlwc2UgY2VudHJlZCBhdCAwIHdpdGggcmFkaWkgcngscnkgYW5kIHggLSBheGlzIC0gYW5nbGUgYXguXG4vL1xuZnVuY3Rpb24gRWxsaXBzZShyeCwgcnksIGF4KSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBFbGxpcHNlKSkgeyByZXR1cm4gbmV3IEVsbGlwc2UocngsIHJ5LCBheCk7IH1cbiAgdGhpcy5yeCA9IHJ4O1xuICB0aGlzLnJ5ID0gcnk7XG4gIHRoaXMuYXggPSBheDtcbn1cblxuLy8gQXBwbHkgYSBsaW5lYXIgdHJhbnNmb3JtIG0gdG8gdGhlIGVsbGlwc2Vcbi8vIG0gaXMgYW4gYXJyYXkgcmVwcmVzZW50aW5nIGEgbWF0cml4IDpcbi8vICAgIC0gICAgICAgICAtXG4vLyAgIHwgbVswXSBtWzJdIHxcbi8vICAgfCBtWzFdIG1bM10gfFxuLy8gICAgLSAgICAgICAgIC1cbi8vXG5FbGxpcHNlLnByb3RvdHlwZS50cmFuc2Zvcm0gPSBmdW5jdGlvbiAobSkge1xuICAvLyBXZSBjb25zaWRlciB0aGUgY3VycmVudCBlbGxpcHNlIGFzIGltYWdlIG9mIHRoZSB1bml0IGNpcmNsZVxuICAvLyBieSBmaXJzdCBzY2FsZShyeCxyeSkgYW5kIHRoZW4gcm90YXRlKGF4KSAuLi5cbiAgLy8gU28gd2UgYXBwbHkgbWEgPSAgbSB4IHJvdGF0ZShheCkgeCBzY2FsZShyeCxyeSkgdG8gdGhlIHVuaXQgY2lyY2xlLlxuICB2YXIgYyA9IE1hdGguY29zKHRoaXMuYXggKiB0b3JhZCksIHMgPSBNYXRoLnNpbih0aGlzLmF4ICogdG9yYWQpO1xuICB2YXIgbWEgPSBbXG4gICAgdGhpcy5yeCAqIChtWzBdKmMgKyBtWzJdKnMpLFxuICAgIHRoaXMucnggKiAobVsxXSpjICsgbVszXSpzKSxcbiAgICB0aGlzLnJ5ICogKC1tWzBdKnMgKyBtWzJdKmMpLFxuICAgIHRoaXMucnkgKiAoLW1bMV0qcyArIG1bM10qYylcbiAgXTtcblxuICAvLyBtYSAqIHRyYW5zcG9zZShtYSkgPSBbIEogTCBdXG4gIC8vICAgICAgICAgICAgICAgICAgICAgIFsgTCBLIF1cbiAgLy8gTCBpcyBjYWxjdWxhdGVkIGxhdGVyIChpZiB0aGUgaW1hZ2UgaXMgbm90IGEgY2lyY2xlKVxuICB2YXIgSiA9IG1hWzBdKm1hWzBdICsgbWFbMl0qbWFbMl0sXG4gICAgICBLID0gbWFbMV0qbWFbMV0gKyBtYVszXSptYVszXTtcblxuICAvLyB0aGUgZGlzY3JpbWluYW50IG9mIHRoZSBjaGFyYWN0ZXJpc3RpYyBwb2x5bm9taWFsIG9mIG1hICogdHJhbnNwb3NlKG1hKVxuICB2YXIgRCA9ICgobWFbMF0tbWFbM10pKihtYVswXS1tYVszXSkgKyAobWFbMl0rbWFbMV0pKihtYVsyXSttYVsxXSkpICpcbiAgICAgICAgICAoKG1hWzBdK21hWzNdKSoobWFbMF0rbWFbM10pICsgKG1hWzJdLW1hWzFdKSoobWFbMl0tbWFbMV0pKTtcblxuICAvLyB0aGUgXCJtZWFuIGVpZ2VudmFsdWVcIlxuICB2YXIgSksgPSAoSiArIEspIC8gMjtcblxuICAvLyBjaGVjayBpZiB0aGUgaW1hZ2UgaXMgKGFsbW9zdCkgYSBjaXJjbGVcbiAgaWYgKEQgPCBlcHNpbG9uICogSkspIHtcbiAgICAvLyBpZiBpdCBpc1xuICAgIHRoaXMucnggPSB0aGlzLnJ5ID0gTWF0aC5zcXJ0KEpLKTtcbiAgICB0aGlzLmF4ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGlmIGl0IGlzIG5vdCBhIGNpcmNsZVxuICB2YXIgTCA9IG1hWzBdKm1hWzFdICsgbWFbMl0qbWFbM107XG5cbiAgRCA9IE1hdGguc3FydChEKTtcblxuICAvLyB7bDEsbDJ9ID0gdGhlIHR3byBlaWdlbiB2YWx1ZXMgb2YgbWEgKiB0cmFuc3Bvc2UobWEpXG4gIHZhciBsMSA9IEpLICsgRC8yLFxuICAgICAgbDIgPSBKSyAtIEQvMjtcbiAgLy8gdGhlIHggLSBheGlzIC0gcm90YXRpb24gYW5nbGUgaXMgdGhlIGFyZ3VtZW50IG9mIHRoZSBsMSAtIGVpZ2VudmVjdG9yXG4gIC8qZXNsaW50LWRpc2FibGUgaW5kZW50Ki9cbiAgdGhpcy5heCA9IChNYXRoLmFicyhMKSA8IGVwc2lsb24gJiYgTWF0aC5hYnMobDEgLSBLKSA8IGVwc2lsb24pID9cbiAgICA5MFxuICA6XG4gICAgTWF0aC5hdGFuKE1hdGguYWJzKEwpID4gTWF0aC5hYnMobDEgLSBLKSA/XG4gICAgICAobDEgLSBKKSAvIExcbiAgICA6XG4gICAgICBMIC8gKGwxIC0gSylcbiAgICApICogMTgwIC8gTWF0aC5QSTtcbiAgLyplc2xpbnQtZW5hYmxlIGluZGVudCovXG5cbiAgLy8gaWYgYXggPiAwID0+IHJ4ID0gc3FydChsMSksIHJ5ID0gc3FydChsMiksIGVsc2UgZXhjaGFuZ2UgYXhlcyBhbmQgYXggKz0gOTBcbiAgaWYgKHRoaXMuYXggPj0gMCkge1xuICAgIC8vIGlmIGF4IGluIFswLDkwXVxuICAgIHRoaXMucnggPSBNYXRoLnNxcnQobDEpO1xuICAgIHRoaXMucnkgPSBNYXRoLnNxcnQobDIpO1xuICB9IGVsc2Uge1xuICAgIC8vIGlmIGF4IGluIF0tOTAsMFsgPT4gZXhjaGFuZ2UgYXhlc1xuICAgIHRoaXMuYXggKz0gOTA7XG4gICAgdGhpcy5yeCA9IE1hdGguc3FydChsMik7XG4gICAgdGhpcy5yeSA9IE1hdGguc3FydChsMSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIENoZWNrIGlmIHRoZSBlbGxpcHNlIGlzIChhbG1vc3QpIGRlZ2VuZXJhdGUsIGkuZS4gcnggPSAwIG9yIHJ5ID0gMFxuLy9cbkVsbGlwc2UucHJvdG90eXBlLmlzRGVnZW5lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICh0aGlzLnJ4IDwgZXBzaWxvbiAqIHRoaXMucnkgfHwgdGhpcy5yeSA8IGVwc2lsb24gKiB0aGlzLnJ4KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWxsaXBzZTtcbiIsIi8vIFNWRyBQYXRoIHRyYW5zZm9ybWF0aW9ucyBsaWJyYXJ5XG4vL1xuLy8gVXNhZ2U6XG4vL1xuLy8gICAgU3ZnUGF0aCgnLi4uJylcbi8vICAgICAgLnRyYW5zbGF0ZSgtMTUwLCAtMTAwKVxuLy8gICAgICAuc2NhbGUoMC41KVxuLy8gICAgICAudHJhbnNsYXRlKC0xNTAsIC0xMDApXG4vLyAgICAgIC50b0ZpeGVkKDEpXG4vLyAgICAgIC50b1N0cmluZygpXG4vL1xuXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIHBhdGhQYXJzZSAgICAgID0gcmVxdWlyZSgnLi9wYXRoX3BhcnNlJyk7XG52YXIgdHJhbnNmb3JtUGFyc2UgPSByZXF1aXJlKCcuL3RyYW5zZm9ybV9wYXJzZScpO1xudmFyIG1hdHJpeCAgICAgICAgID0gcmVxdWlyZSgnLi9tYXRyaXgnKTtcbnZhciBhMmMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vYTJjJyk7XG52YXIgZWxsaXBzZSAgICAgICAgPSByZXF1aXJlKCcuL2VsbGlwc2UnKTtcblxuXG4vLyBDbGFzcyBjb25zdHJ1Y3RvclxuLy9cbmZ1bmN0aW9uIFN2Z1BhdGgocGF0aCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU3ZnUGF0aCkpIHsgcmV0dXJuIG5ldyBTdmdQYXRoKHBhdGgpOyB9XG5cbiAgdmFyIHBzdGF0ZSA9IHBhdGhQYXJzZShwYXRoKTtcblxuICAvLyBBcnJheSBvZiBwYXRoIHNlZ21lbnRzLlxuICAvLyBFYWNoIHNlZ21lbnQgaXMgYXJyYXkgW2NvbW1hbmQsIHBhcmFtMSwgcGFyYW0yLCAuLi5dXG4gIHRoaXMuc2VnbWVudHMgPSBwc3RhdGUuc2VnbWVudHM7XG5cbiAgLy8gRXJyb3IgbWVzc2FnZSBvbiBwYXJzZSBlcnJvci5cbiAgdGhpcy5lcnIgICAgICA9IHBzdGF0ZS5lcnI7XG5cbiAgLy8gVHJhbnNmb3JtcyBzdGFjayBmb3IgbGF6eSBldmFsdWF0aW9uXG4gIHRoaXMuX19zdGFjayAgICA9IFtdO1xufVxuXG5TdmdQYXRoLmZyb20gPSBmdW5jdGlvbiAoc3JjKSB7XG4gIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykgcmV0dXJuIG5ldyBTdmdQYXRoKHNyYyk7XG5cbiAgaWYgKHNyYyBpbnN0YW5jZW9mIFN2Z1BhdGgpIHtcbiAgICAvLyBDcmVhdGUgZW1wdHkgb2JqZWN0XG4gICAgdmFyIHMgPSBuZXcgU3ZnUGF0aCgnJyk7XG5cbiAgICAvLyBDbG9uZSBwcm9wZXJpZXNcbiAgICBzLmVyciA9IHNyYy5lcnI7XG4gICAgcy5zZWdtZW50cyA9IHNyYy5zZWdtZW50cy5tYXAoZnVuY3Rpb24gKHNnbSkgeyByZXR1cm4gc2dtLnNsaWNlKCk7IH0pO1xuICAgIHMuX19zdGFjayA9IHNyYy5fX3N0YWNrLm1hcChmdW5jdGlvbiAobSkge1xuICAgICAgcmV0dXJuIG1hdHJpeCgpLm1hdHJpeChtLnRvQXJyYXkoKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcignU3ZnUGF0aC5mcm9tOiBpbnZhbGlkIHBhcmFtIHR5cGUgJyArIHNyYyk7XG59O1xuXG5cblN2Z1BhdGgucHJvdG90eXBlLl9fbWF0cml4ID0gZnVuY3Rpb24gKG0pIHtcbiAgdmFyIHNlbGYgPSB0aGlzLCBpO1xuXG4gIC8vIFF1aWNrIGxlYXZlIGZvciBlbXB0eSBtYXRyaXhcbiAgaWYgKCFtLnF1ZXVlLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICB0aGlzLml0ZXJhdGUoZnVuY3Rpb24gKHMsIGluZGV4LCB4LCB5KSB7XG4gICAgdmFyIHAsIHJlc3VsdCwgbmFtZSwgaXNSZWxhdGl2ZTtcblxuICAgIHN3aXRjaCAoc1swXSkge1xuXG4gICAgICAvLyBQcm9jZXNzICdhc3N5bWV0cmljJyBjb21tYW5kcyBzZXBhcmF0ZWx5XG4gICAgICBjYXNlICd2JzpcbiAgICAgICAgcCAgICAgID0gbS5jYWxjKDAsIHNbMV0sIHRydWUpO1xuICAgICAgICByZXN1bHQgPSAocFswXSA9PT0gMCkgPyBbICd2JywgcFsxXSBdIDogWyAnbCcsIHBbMF0sIHBbMV0gXTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ1YnOlxuICAgICAgICBwICAgICAgPSBtLmNhbGMoeCwgc1sxXSwgZmFsc2UpO1xuICAgICAgICByZXN1bHQgPSAocFswXSA9PT0gbS5jYWxjKHgsIHksIGZhbHNlKVswXSkgPyBbICdWJywgcFsxXSBdIDogWyAnTCcsIHBbMF0sIHBbMV0gXTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2gnOlxuICAgICAgICBwICAgICAgPSBtLmNhbGMoc1sxXSwgMCwgdHJ1ZSk7XG4gICAgICAgIHJlc3VsdCA9IChwWzFdID09PSAwKSA/IFsgJ2gnLCBwWzBdIF0gOiBbICdsJywgcFswXSwgcFsxXSBdO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnSCc6XG4gICAgICAgIHAgICAgICA9IG0uY2FsYyhzWzFdLCB5LCBmYWxzZSk7XG4gICAgICAgIHJlc3VsdCA9IChwWzFdID09PSBtLmNhbGMoeCwgeSwgZmFsc2UpWzFdKSA/IFsgJ0gnLCBwWzBdIF0gOiBbICdMJywgcFswXSwgcFsxXSBdO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYSc6XG4gICAgICBjYXNlICdBJzpcbiAgICAgICAgLy8gQVJDIGlzOiBbJ0EnLCByeCwgcnksIHgtYXhpcy1yb3RhdGlvbiwgbGFyZ2UtYXJjLWZsYWcsIHN3ZWVwLWZsYWcsIHgsIHldXG5cbiAgICAgICAgLy8gRHJvcCBzZWdtZW50IGlmIGFyYyBpcyBlbXB0eSAoZW5kIHBvaW50ID09PSBzdGFydCBwb2ludClcbiAgICAgICAgLyppZiAoKHNbMF0gPT09ICdBJyAmJiBzWzZdID09PSB4ICYmIHNbN10gPT09IHkpIHx8XG4gICAgICAgICAgICAoc1swXSA9PT0gJ2EnICYmIHNbNl0gPT09IDAgJiYgc1s3XSA9PT0gMCkpIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH0qL1xuXG4gICAgICAgIC8vIFRyYW5zZm9ybSByeCwgcnkgYW5kIHRoZSB4LWF4aXMtcm90YXRpb25cbiAgICAgICAgdmFyIG1hID0gbS50b0FycmF5KCk7XG4gICAgICAgIHZhciBlID0gZWxsaXBzZShzWzFdLCBzWzJdLCBzWzNdKS50cmFuc2Zvcm0obWEpO1xuXG4gICAgICAgIC8vIGZsaXAgc3dlZXAtZmxhZyBpZiBtYXRyaXggaXMgbm90IG9yaWVudGF0aW9uLXByZXNlcnZpbmdcbiAgICAgICAgaWYgKG1hWzBdICogbWFbM10gLSBtYVsxXSAqIG1hWzJdIDwgMCkge1xuICAgICAgICAgIHNbNV0gPSBzWzVdID8gJzAnIDogJzEnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVHJhbnNmb3JtIGVuZCBwb2ludCBhcyB1c3VhbCAod2l0aG91dCB0cmFuc2xhdGlvbiBmb3IgcmVsYXRpdmUgbm90YXRpb24pXG4gICAgICAgIHAgPSBtLmNhbGMoc1s2XSwgc1s3XSwgc1swXSA9PT0gJ2EnKTtcblxuICAgICAgICAvLyBFbXB0eSBhcmNzIGNhbiBiZSBpZ25vcmVkIGJ5IHJlbmRlcmVyLCBidXQgc2hvdWxkIG5vdCBiZSBkcm9wcGVkXG4gICAgICAgIC8vIHRvIGF2b2lkIGNvbGxpc2lvbnMgd2l0aCBgUyBBIFNgIGFuZCBzbyBvbi4gUmVwbGFjZSB3aXRoIGVtcHR5IGxpbmUuXG4gICAgICAgIGlmICgoc1swXSA9PT0gJ0EnICYmIHNbNl0gPT09IHggJiYgc1s3XSA9PT0geSkgfHxcbiAgICAgICAgICAgIChzWzBdID09PSAnYScgJiYgc1s2XSA9PT0gMCAmJiBzWzddID09PSAwKSkge1xuICAgICAgICAgIHJlc3VsdCA9IFsgc1swXSA9PT0gJ2EnID8gJ2wnIDogJ0wnLCBwWzBdLCBwWzFdIF07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgcmVzdWx0aW5nIGVsbGlwc2UgaXMgKGFsbW9zdCkgYSBzZWdtZW50IC4uLlxuICAgICAgICBpZiAoZS5pc0RlZ2VuZXJhdGUoKSkge1xuICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGFyYyBieSBhIGxpbmVcbiAgICAgICAgICByZXN1bHQgPSBbIHNbMF0gPT09ICdhJyA/ICdsJyA6ICdMJywgcFswXSwgcFsxXSBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIGl0IGlzIGEgcmVhbCBlbGxpcHNlXG4gICAgICAgICAgLy8gc1swXSwgc1s0XSBhbmQgc1s1XSBhcmUgbm90IG1vZGlmaWVkXG4gICAgICAgICAgcmVzdWx0ID0gWyBzWzBdLCBlLnJ4LCBlLnJ5LCBlLmF4LCBzWzRdLCBzWzVdLCBwWzBdLCBwWzFdIF07XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbSc6XG4gICAgICAgIC8vIEVkZ2UgY2FzZS4gVGhlIHZlcnkgZmlyc3QgYG1gIHNob3VsZCBiZSBwcm9jZXNzZWQgYXMgYWJzb2x1dGUsIGlmIGhhcHBlbnMuXG4gICAgICAgIC8vIE1ha2Ugc2Vuc2UgZm9yIGNvb3JkIHNoaWZ0IHRyYW5zZm9ybXMuXG4gICAgICAgIGlzUmVsYXRpdmUgPSBpbmRleCA+IDA7XG5cbiAgICAgICAgcCA9IG0uY2FsYyhzWzFdLCBzWzJdLCBpc1JlbGF0aXZlKTtcbiAgICAgICAgcmVzdWx0ID0gWyAnbScsIHBbMF0sIHBbMV0gXTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG5hbWUgICAgICAgPSBzWzBdO1xuICAgICAgICByZXN1bHQgICAgID0gWyBuYW1lIF07XG4gICAgICAgIGlzUmVsYXRpdmUgPSAobmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lKTtcblxuICAgICAgICAvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbnMgdG8gdGhlIHNlZ21lbnRcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IHMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICBwID0gbS5jYWxjKHNbaV0sIHNbaSArIDFdLCBpc1JlbGF0aXZlKTtcbiAgICAgICAgICByZXN1bHQucHVzaChwWzBdLCBwWzFdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGYuc2VnbWVudHNbaW5kZXhdID0gcmVzdWx0O1xuICB9LCB0cnVlKTtcbn07XG5cblxuLy8gQXBwbHkgc3RhY2tlZCBjb21tYW5kc1xuLy9cblN2Z1BhdGgucHJvdG90eXBlLl9fZXZhbHVhdGVTdGFjayA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG0sIGk7XG5cbiAgaWYgKCF0aGlzLl9fc3RhY2subGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLl9fc3RhY2subGVuZ3RoID09PSAxKSB7XG4gICAgdGhpcy5fX21hdHJpeCh0aGlzLl9fc3RhY2tbMF0pO1xuICAgIHRoaXMuX19zdGFjayA9IFtdO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG0gPSBtYXRyaXgoKTtcbiAgaSA9IHRoaXMuX19zdGFjay5sZW5ndGg7XG5cbiAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgbS5tYXRyaXgodGhpcy5fX3N0YWNrW2ldLnRvQXJyYXkoKSk7XG4gIH1cblxuICB0aGlzLl9fbWF0cml4KG0pO1xuICB0aGlzLl9fc3RhY2sgPSBbXTtcbn07XG5cblxuLy8gQ29udmVydCBwcm9jZXNzZWQgU1ZHIFBhdGggYmFjayB0byBzdHJpbmdcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVsZW1lbnRzID0gW10sIHNraXBDbWQsIGNtZDtcblxuICB0aGlzLl9fZXZhbHVhdGVTdGFjaygpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIC8vIHJlbW92ZSByZXBlYXRpbmcgY29tbWFuZHMgbmFtZXNcbiAgICBjbWQgPSB0aGlzLnNlZ21lbnRzW2ldWzBdO1xuICAgIHNraXBDbWQgPSBpID4gMCAmJiBjbWQgIT09ICdtJyAmJiBjbWQgIT09ICdNJyAmJiBjbWQgPT09IHRoaXMuc2VnbWVudHNbaSAtIDFdWzBdO1xuICAgIGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KHNraXBDbWQgPyB0aGlzLnNlZ21lbnRzW2ldLnNsaWNlKDEpIDogdGhpcy5zZWdtZW50c1tpXSk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudHMuam9pbignICcpXG4gICAgLy8gT3B0aW1pemF0aW9uczogcmVtb3ZlIHNwYWNlcyBhcm91bmQgY29tbWFuZHMgJiBiZWZvcmUgYC1gXG4gICAgLy9cbiAgICAvLyBXZSBjb3VsZCBhbHNvIHJlbW92ZSBsZWFkaW5nIHplcm9zIGZvciBgMC41YC1saWtlIHZhbHVlcyxcbiAgICAvLyBidXQgdGhlaXIgY291bnQgaXMgdG9vIHNtYWxsIHRvIHNwZW5kIHRpbWUgZm9yLlxuICAgIC5yZXBsYWNlKC8gPyhbYWNobG1xcnN0dnpdKSA/L2dpLCAnJDEnKVxuICAgIC5yZXBsYWNlKC8gXFwtL2csICctJylcbiAgICAvLyB3b3JrYXJvdW5kIGZvciBGb250Rm9yZ2UgU1ZHIGltcG9ydGluZyBidWdcbiAgICAucmVwbGFjZSgvem0vZywgJ3ogbScpO1xufTtcblxuXG4vLyBUcmFuc2xhdGUgcGF0aCB0byAoeCBbLCB5XSlcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB0aGlzLl9fc3RhY2sucHVzaChtYXRyaXgoKS50cmFuc2xhdGUoeCwgeSB8fCAwKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBTY2FsZSBwYXRoIHRvIChzeCBbLCBzeV0pXG4vLyBzeSA9IHN4IGlmIG5vdCBkZWZpbmVkXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiAoc3gsIHN5KSB7XG4gIHRoaXMuX19zdGFjay5wdXNoKG1hdHJpeCgpLnNjYWxlKHN4LCAoIXN5ICYmIChzeSAhPT0gMCkpID8gc3ggOiBzeSkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gUm90YXRlIHBhdGggYXJvdW5kIHBvaW50IChzeCBbLCBzeV0pXG4vLyBzeSA9IHN4IGlmIG5vdCBkZWZpbmVkXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGFuZ2xlLCByeCwgcnkpIHtcbiAgdGhpcy5fX3N0YWNrLnB1c2gobWF0cml4KCkucm90YXRlKGFuZ2xlLCByeCB8fCAwLCByeSB8fCAwKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBTa2V3IHBhdGggYWxvbmcgdGhlIFggYXhpcyBieSBgZGVncmVlc2AgYW5nbGVcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5za2V3WCA9IGZ1bmN0aW9uIChkZWdyZWVzKSB7XG4gIHRoaXMuX19zdGFjay5wdXNoKG1hdHJpeCgpLnNrZXdYKGRlZ3JlZXMpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIFNrZXcgcGF0aCBhbG9uZyB0aGUgWSBheGlzIGJ5IGBkZWdyZWVzYCBhbmdsZVxuLy9cblN2Z1BhdGgucHJvdG90eXBlLnNrZXdZID0gZnVuY3Rpb24gKGRlZ3JlZXMpIHtcbiAgdGhpcy5fX3N0YWNrLnB1c2gobWF0cml4KCkuc2tld1koZGVncmVlcykpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gQXBwbHkgbWF0cml4IHRyYW5zZm9ybSAoYXJyYXkgb2YgNiBlbGVtZW50cylcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS5tYXRyaXggPSBmdW5jdGlvbiAobSkge1xuICB0aGlzLl9fc3RhY2sucHVzaChtYXRyaXgoKS5tYXRyaXgobSkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gVHJhbnNmb3JtIHBhdGggYWNjb3JkaW5nIHRvIFwidHJhbnNmb3JtXCIgYXR0ciBvZiBTVkcgc3BlY1xuLy9cblN2Z1BhdGgucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uICh0cmFuc2Zvcm1TdHJpbmcpIHtcbiAgaWYgKCF0cmFuc2Zvcm1TdHJpbmcudHJpbSgpKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5fX3N0YWNrLnB1c2godHJhbnNmb3JtUGFyc2UodHJhbnNmb3JtU3RyaW5nKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vLyBSb3VuZCBjb29yZHMgd2l0aCBnaXZlbiBkZWNpbWFsIHByZWNpdGlvbi5cbi8vIDAgYnkgZGVmYXVsdCAodG8gaW50ZWdlcnMpXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUucm91bmQgPSBmdW5jdGlvbiAoZCkge1xuICB2YXIgY29udG91clN0YXJ0RGVsdGFYID0gMCwgY29udG91clN0YXJ0RGVsdGFZID0gMCwgZGVsdGFYID0gMCwgZGVsdGFZID0gMCwgbDtcblxuICBkID0gZCB8fCAwO1xuXG4gIHRoaXMuX19ldmFsdWF0ZVN0YWNrKCk7XG5cbiAgdGhpcy5zZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgdmFyIGlzUmVsYXRpdmUgPSAoc1swXS50b0xvd2VyQ2FzZSgpID09PSBzWzBdKTtcblxuICAgIHN3aXRjaCAoc1swXSkge1xuICAgICAgY2FzZSAnSCc6XG4gICAgICBjYXNlICdoJzpcbiAgICAgICAgaWYgKGlzUmVsYXRpdmUpIHsgc1sxXSArPSBkZWx0YVg7IH1cbiAgICAgICAgZGVsdGFYID0gc1sxXSAtIHNbMV0udG9GaXhlZChkKTtcbiAgICAgICAgc1sxXSA9ICtzWzFdLnRvRml4ZWQoZCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnVic6XG4gICAgICBjYXNlICd2JzpcbiAgICAgICAgaWYgKGlzUmVsYXRpdmUpIHsgc1sxXSArPSBkZWx0YVk7IH1cbiAgICAgICAgZGVsdGFZID0gc1sxXSAtIHNbMV0udG9GaXhlZChkKTtcbiAgICAgICAgc1sxXSA9ICtzWzFdLnRvRml4ZWQoZCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnWic6XG4gICAgICBjYXNlICd6JzpcbiAgICAgICAgZGVsdGFYID0gY29udG91clN0YXJ0RGVsdGFYO1xuICAgICAgICBkZWx0YVkgPSBjb250b3VyU3RhcnREZWx0YVk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnTSc6XG4gICAgICBjYXNlICdtJzpcbiAgICAgICAgaWYgKGlzUmVsYXRpdmUpIHtcbiAgICAgICAgICBzWzFdICs9IGRlbHRhWDtcbiAgICAgICAgICBzWzJdICs9IGRlbHRhWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbHRhWCA9IHNbMV0gLSBzWzFdLnRvRml4ZWQoZCk7XG4gICAgICAgIGRlbHRhWSA9IHNbMl0gLSBzWzJdLnRvRml4ZWQoZCk7XG5cbiAgICAgICAgY29udG91clN0YXJ0RGVsdGFYID0gZGVsdGFYO1xuICAgICAgICBjb250b3VyU3RhcnREZWx0YVkgPSBkZWx0YVk7XG5cbiAgICAgICAgc1sxXSA9ICtzWzFdLnRvRml4ZWQoZCk7XG4gICAgICAgIHNbMl0gPSArc1syXS50b0ZpeGVkKGQpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ0EnOlxuICAgICAgY2FzZSAnYSc6XG4gICAgICAgIC8vIFtjbWQsIHJ4LCByeSwgeC1heGlzLXJvdGF0aW9uLCBsYXJnZS1hcmMtZmxhZywgc3dlZXAtZmxhZywgeCwgeV1cbiAgICAgICAgaWYgKGlzUmVsYXRpdmUpIHtcbiAgICAgICAgICBzWzZdICs9IGRlbHRhWDtcbiAgICAgICAgICBzWzddICs9IGRlbHRhWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbHRhWCA9IHNbNl0gLSBzWzZdLnRvRml4ZWQoZCk7XG4gICAgICAgIGRlbHRhWSA9IHNbN10gLSBzWzddLnRvRml4ZWQoZCk7XG5cbiAgICAgICAgc1sxXSA9ICtzWzFdLnRvRml4ZWQoZCk7XG4gICAgICAgIHNbMl0gPSArc1syXS50b0ZpeGVkKGQpO1xuICAgICAgICBzWzNdID0gK3NbM10udG9GaXhlZChkICsgMik7IC8vIGJldHRlciBwcmVjaXNpb24gZm9yIHJvdGF0aW9uXG4gICAgICAgIHNbNl0gPSArc1s2XS50b0ZpeGVkKGQpO1xuICAgICAgICBzWzddID0gK3NbN10udG9GaXhlZChkKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBhIGMgbCBxIHMgdFxuICAgICAgICBsID0gcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGlzUmVsYXRpdmUpIHtcbiAgICAgICAgICBzW2wgLSAyXSArPSBkZWx0YVg7XG4gICAgICAgICAgc1tsIC0gMV0gKz0gZGVsdGFZO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsdGFYID0gc1tsIC0gMl0gLSBzW2wgLSAyXS50b0ZpeGVkKGQpO1xuICAgICAgICBkZWx0YVkgPSBzW2wgLSAxXSAtIHNbbCAtIDFdLnRvRml4ZWQoZCk7XG5cbiAgICAgICAgcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWwsIGkpIHtcbiAgICAgICAgICBpZiAoIWkpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc1tpXSA9ICtzW2ldLnRvRml4ZWQoZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gQXBwbHkgaXRlcmF0b3IgZnVuY3Rpb24gdG8gYWxsIHNlZ21lbnRzLiBJZiBmdW5jdGlvbiByZXR1cm5zIHJlc3VsdCxcbi8vIGN1cnJlbnQgc2VnbWVudCB3aWxsIGJlIHJlcGxhY2VkIHRvIGFycmF5IG9mIHJldHVybmVkIHNlZ21lbnRzLlxuLy8gSWYgZW1wdHkgYXJyYXkgaXMgcmV0dXJuZWQsIGN1cnJlbnQgcmVnbWVudCB3aWxsIGJlIGRlbGV0ZWQuXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUuaXRlcmF0ZSA9IGZ1bmN0aW9uIChpdGVyYXRvciwga2VlcExhenlTdGFjaykge1xuICB2YXIgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRzLFxuICAgICAgcmVwbGFjZW1lbnRzID0ge30sXG4gICAgICBuZWVkUmVwbGFjZSA9IGZhbHNlLFxuICAgICAgbGFzdFggPSAwLFxuICAgICAgbGFzdFkgPSAwLFxuICAgICAgY291bnRvdXJTdGFydFggPSAwLFxuICAgICAgY291bnRvdXJTdGFydFkgPSAwO1xuICB2YXIgaSwgaiwgbmV3U2VnbWVudHM7XG5cbiAgaWYgKCFrZWVwTGF6eVN0YWNrKSB7XG4gICAgdGhpcy5fX2V2YWx1YXRlU3RhY2soKTtcbiAgfVxuXG4gIHNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKHMsIGluZGV4KSB7XG5cbiAgICB2YXIgcmVzID0gaXRlcmF0b3IocywgaW5kZXgsIGxhc3RYLCBsYXN0WSk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZXMpKSB7XG4gICAgICByZXBsYWNlbWVudHNbaW5kZXhdID0gcmVzO1xuICAgICAgbmVlZFJlcGxhY2UgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciBpc1JlbGF0aXZlID0gKHNbMF0gPT09IHNbMF0udG9Mb3dlckNhc2UoKSk7XG5cbiAgICAvLyBjYWxjdWxhdGUgYWJzb2x1dGUgWCBhbmQgWVxuICAgIHN3aXRjaCAoc1swXSkge1xuICAgICAgY2FzZSAnbSc6XG4gICAgICBjYXNlICdNJzpcbiAgICAgICAgbGFzdFggPSBzWzFdICsgKGlzUmVsYXRpdmUgPyBsYXN0WCA6IDApO1xuICAgICAgICBsYXN0WSA9IHNbMl0gKyAoaXNSZWxhdGl2ZSA/IGxhc3RZIDogMCk7XG4gICAgICAgIGNvdW50b3VyU3RhcnRYID0gbGFzdFg7XG4gICAgICAgIGNvdW50b3VyU3RhcnRZID0gbGFzdFk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSAnaCc6XG4gICAgICBjYXNlICdIJzpcbiAgICAgICAgbGFzdFggPSBzWzFdICsgKGlzUmVsYXRpdmUgPyBsYXN0WCA6IDApO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ3YnOlxuICAgICAgY2FzZSAnVic6XG4gICAgICAgIGxhc3RZID0gc1sxXSArIChpc1JlbGF0aXZlID8gbGFzdFkgOiAwKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICd6JzpcbiAgICAgIGNhc2UgJ1onOlxuICAgICAgICAvLyBUaGF0IG1ha2Ugc2VuY2UgZm9yIG11bHRpcGxlIGNvbnRvdXJzXG4gICAgICAgIGxhc3RYID0gY291bnRvdXJTdGFydFg7XG4gICAgICAgIGxhc3RZID0gY291bnRvdXJTdGFydFk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGFzdFggPSBzW3MubGVuZ3RoIC0gMl0gKyAoaXNSZWxhdGl2ZSA/IGxhc3RYIDogMCk7XG4gICAgICAgIGxhc3RZID0gc1tzLmxlbmd0aCAtIDFdICsgKGlzUmVsYXRpdmUgPyBsYXN0WSA6IDApO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gUmVwbGFjZSBzZWdtZW50cyBpZiBpdGVyYXRvciByZXR1cm4gcmVzdWx0c1xuXG4gIGlmICghbmVlZFJlcGxhY2UpIHsgcmV0dXJuIHRoaXM7IH1cblxuICBuZXdTZWdtZW50cyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0eXBlb2YgcmVwbGFjZW1lbnRzW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgZm9yIChqID0gMDsgaiA8IHJlcGxhY2VtZW50c1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgICBuZXdTZWdtZW50cy5wdXNoKHJlcGxhY2VtZW50c1tpXVtqXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1NlZ21lbnRzLnB1c2goc2VnbWVudHNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuc2VnbWVudHMgPSBuZXdTZWdtZW50cztcblxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gQ29udmVydHMgc2VnbWVudHMgZnJvbSByZWxhdGl2ZSB0byBhYnNvbHV0ZVxuLy9cblN2Z1BhdGgucHJvdG90eXBlLmFicyA9IGZ1bmN0aW9uICgpIHtcblxuICB0aGlzLml0ZXJhdGUoZnVuY3Rpb24gKHMsIGluZGV4LCB4LCB5KSB7XG4gICAgdmFyIG5hbWUgPSBzWzBdLFxuICAgICAgICBuYW1lVUMgPSBuYW1lLnRvVXBwZXJDYXNlKCksXG4gICAgICAgIGk7XG5cbiAgICAvLyBTa2lwIGFic29sdXRlIGNvbW1hbmRzXG4gICAgaWYgKG5hbWUgPT09IG5hbWVVQykgeyByZXR1cm47IH1cblxuICAgIHNbMF0gPSBuYW1lVUM7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAvLyB2IGhhcyBzaGlmdGVkIGNvb3JkcyBwYXJpdHlcbiAgICAgICAgc1sxXSArPSB5O1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAvLyBBUkMgaXM6IFsnQScsIHJ4LCByeSwgeC1heGlzLXJvdGF0aW9uLCBsYXJnZS1hcmMtZmxhZywgc3dlZXAtZmxhZywgeCwgeV1cbiAgICAgICAgLy8gdG91Y2ggeCwgeSBvbmx5XG4gICAgICAgIHNbNl0gKz0geDtcbiAgICAgICAgc1s3XSArPSB5O1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgc1tpXSArPSBpICUgMiA/IHggOiB5OyAvLyBvZGQgdmFsdWVzIGFyZSBYLCBldmVuIC0gWVxuICAgICAgICB9XG4gICAgfVxuICB9LCB0cnVlKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLy8gQ29udmVydHMgc2VnbWVudHMgZnJvbSBhYnNvbHV0ZSB0byByZWxhdGl2ZVxuLy9cblN2Z1BhdGgucHJvdG90eXBlLnJlbCA9IGZ1bmN0aW9uICgpIHtcblxuICB0aGlzLml0ZXJhdGUoZnVuY3Rpb24gKHMsIGluZGV4LCB4LCB5KSB7XG4gICAgdmFyIG5hbWUgPSBzWzBdLFxuICAgICAgICBuYW1lTEMgPSBuYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIGk7XG5cbiAgICAvLyBTa2lwIHJlbGF0aXZlIGNvbW1hbmRzXG4gICAgaWYgKG5hbWUgPT09IG5hbWVMQykgeyByZXR1cm47IH1cblxuICAgIC8vIERvbid0IHRvdWNoIHRoZSBmaXJzdCBNIHRvIGF2b2lkIHBvdGVudGlhbCBjb25mdXNpb25zLlxuICAgIGlmIChpbmRleCA9PT0gMCAmJiBuYW1lID09PSAnTScpIHsgcmV0dXJuOyB9XG5cbiAgICBzWzBdID0gbmFtZUxDO1xuXG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdWJzpcbiAgICAgICAgLy8gViBoYXMgc2hpZnRlZCBjb29yZHMgcGFyaXR5XG4gICAgICAgIHNbMV0gLT0geTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlICdBJzpcbiAgICAgICAgLy8gQVJDIGlzOiBbJ0EnLCByeCwgcnksIHgtYXhpcy1yb3RhdGlvbiwgbGFyZ2UtYXJjLWZsYWcsIHN3ZWVwLWZsYWcsIHgsIHldXG4gICAgICAgIC8vIHRvdWNoIHgsIHkgb25seVxuICAgICAgICBzWzZdIC09IHg7XG4gICAgICAgIHNbN10gLT0geTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHNbaV0gLT0gaSAlIDIgPyB4IDogeTsgLy8gb2RkIHZhbHVlcyBhcmUgWCwgZXZlbiAtIFlcbiAgICAgICAgfVxuICAgIH1cbiAgfSwgdHJ1ZSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIENvbnZlcnRzIGFyY3MgdG8gY3ViaWMgYsOpemllciBjdXJ2ZXNcbi8vXG5TdmdQYXRoLnByb3RvdHlwZS51bmFyYyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pdGVyYXRlKGZ1bmN0aW9uIChzLCBpbmRleCwgeCwgeSkge1xuICAgIHZhciBuZXdfc2VnbWVudHMsIG5leHRYLCBuZXh0WSwgcmVzdWx0ID0gW10sIG5hbWUgPSBzWzBdO1xuXG4gICAgLy8gU2tpcCBhbnl0aGluZyBleGNlcHQgYXJjc1xuICAgIGlmIChuYW1lICE9PSAnQScgJiYgbmFtZSAhPT0gJ2EnKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ2EnKSB7XG4gICAgICAvLyBjb252ZXJ0IHJlbGF0aXZlIGFyYyBjb29yZGluYXRlcyB0byBhYnNvbHV0ZVxuICAgICAgbmV4dFggPSB4ICsgc1s2XTtcbiAgICAgIG5leHRZID0geSArIHNbN107XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRYID0gc1s2XTtcbiAgICAgIG5leHRZID0gc1s3XTtcbiAgICB9XG5cbiAgICBuZXdfc2VnbWVudHMgPSBhMmMoeCwgeSwgbmV4dFgsIG5leHRZLCBzWzRdLCBzWzVdLCBzWzFdLCBzWzJdLCBzWzNdKTtcblxuICAgIC8vIERlZ2VuZXJhdGVkIGFyY3MgY2FuIGJlIGlnbm9yZWQgYnkgcmVuZGVyZXIsIGJ1dCBzaG91bGQgbm90IGJlIGRyb3BwZWRcbiAgICAvLyB0byBhdm9pZCBjb2xsaXNpb25zIHdpdGggYFMgQSBTYCBhbmQgc28gb24uIFJlcGxhY2Ugd2l0aCBlbXB0eSBsaW5lLlxuICAgIGlmIChuZXdfc2VnbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gWyBbIHNbMF0gPT09ICdhJyA/ICdsJyA6ICdMJywgc1s2XSwgc1s3XSBdIF07XG4gICAgfVxuXG4gICAgbmV3X3NlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJlc3VsdC5wdXNoKFsgJ0MnLCBzWzJdLCBzWzNdLCBzWzRdLCBzWzVdLCBzWzZdLCBzWzddIF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8vIENvbnZlcnRzIHNtb290aCBjdXJ2ZXMgKHdpdGggbWlzc2VkIGNvbnRyb2wgcG9pbnQpIHRvIGdlbmVyaWMgY3VydmVzXG4vL1xuU3ZnUGF0aC5wcm90b3R5cGUudW5zaG9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlZ21lbnRzID0gdGhpcy5zZWdtZW50cztcbiAgdmFyIHByZXZDb250cm9sWCwgcHJldkNvbnRyb2xZLCBwcmV2U2VnbWVudDtcbiAgdmFyIGN1ckNvbnRyb2xYLCBjdXJDb250cm9sWTtcblxuICAvLyBUT0RPOiBhZGQgbGF6eSBldmFsdWF0aW9uIGZsYWcgd2hlbiByZWxhdGl2ZSBjb21tYW5kcyBzdXBwb3J0ZWRcblxuICB0aGlzLml0ZXJhdGUoZnVuY3Rpb24gKHMsIGlkeCwgeCwgeSkge1xuICAgIHZhciBuYW1lID0gc1swXSwgbmFtZVVDID0gbmFtZS50b1VwcGVyQ2FzZSgpLCBpc1JlbGF0aXZlO1xuXG4gICAgLy8gRmlyc3QgY29tbWFuZCBNVVNUIGJlIE18bSwgaXQncyBzYWZlIHRvIHNraXAuXG4gICAgLy8gUHJvdGVjdCBmcm9tIGFjY2VzcyB0byBbLTFdIGZvciBzdXJlLlxuICAgIGlmICghaWR4KSB7IHJldHVybjsgfVxuXG4gICAgaWYgKG5hbWVVQyA9PT0gJ1QnKSB7IC8vIHF1YWRyYXRpYyBjdXJ2ZVxuICAgICAgaXNSZWxhdGl2ZSA9IChuYW1lID09PSAndCcpO1xuXG4gICAgICBwcmV2U2VnbWVudCA9IHNlZ21lbnRzW2lkeCAtIDFdO1xuXG4gICAgICBpZiAocHJldlNlZ21lbnRbMF0gPT09ICdRJykge1xuICAgICAgICBwcmV2Q29udHJvbFggPSBwcmV2U2VnbWVudFsxXSAtIHg7XG4gICAgICAgIHByZXZDb250cm9sWSA9IHByZXZTZWdtZW50WzJdIC0geTtcbiAgICAgIH0gZWxzZSBpZiAocHJldlNlZ21lbnRbMF0gPT09ICdxJykge1xuICAgICAgICBwcmV2Q29udHJvbFggPSBwcmV2U2VnbWVudFsxXSAtIHByZXZTZWdtZW50WzNdO1xuICAgICAgICBwcmV2Q29udHJvbFkgPSBwcmV2U2VnbWVudFsyXSAtIHByZXZTZWdtZW50WzRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldkNvbnRyb2xYID0gMDtcbiAgICAgICAgcHJldkNvbnRyb2xZID0gMDtcbiAgICAgIH1cblxuICAgICAgY3VyQ29udHJvbFggPSAtcHJldkNvbnRyb2xYO1xuICAgICAgY3VyQ29udHJvbFkgPSAtcHJldkNvbnRyb2xZO1xuXG4gICAgICBpZiAoIWlzUmVsYXRpdmUpIHtcbiAgICAgICAgY3VyQ29udHJvbFggKz0geDtcbiAgICAgICAgY3VyQ29udHJvbFkgKz0geTtcbiAgICAgIH1cblxuICAgICAgc2VnbWVudHNbaWR4XSA9IFtcbiAgICAgICAgaXNSZWxhdGl2ZSA/ICdxJyA6ICdRJyxcbiAgICAgICAgY3VyQ29udHJvbFgsIGN1ckNvbnRyb2xZLFxuICAgICAgICBzWzFdLCBzWzJdXG4gICAgICBdO1xuXG4gICAgfSBlbHNlIGlmIChuYW1lVUMgPT09ICdTJykgeyAvLyBjdWJpYyBjdXJ2ZVxuICAgICAgaXNSZWxhdGl2ZSA9IChuYW1lID09PSAncycpO1xuXG4gICAgICBwcmV2U2VnbWVudCA9IHNlZ21lbnRzW2lkeCAtIDFdO1xuXG4gICAgICBpZiAocHJldlNlZ21lbnRbMF0gPT09ICdDJykge1xuICAgICAgICBwcmV2Q29udHJvbFggPSBwcmV2U2VnbWVudFszXSAtIHg7XG4gICAgICAgIHByZXZDb250cm9sWSA9IHByZXZTZWdtZW50WzRdIC0geTtcbiAgICAgIH0gZWxzZSBpZiAocHJldlNlZ21lbnRbMF0gPT09ICdjJykge1xuICAgICAgICBwcmV2Q29udHJvbFggPSBwcmV2U2VnbWVudFszXSAtIHByZXZTZWdtZW50WzVdO1xuICAgICAgICBwcmV2Q29udHJvbFkgPSBwcmV2U2VnbWVudFs0XSAtIHByZXZTZWdtZW50WzZdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldkNvbnRyb2xYID0gMDtcbiAgICAgICAgcHJldkNvbnRyb2xZID0gMDtcbiAgICAgIH1cblxuICAgICAgY3VyQ29udHJvbFggPSAtcHJldkNvbnRyb2xYO1xuICAgICAgY3VyQ29udHJvbFkgPSAtcHJldkNvbnRyb2xZO1xuXG4gICAgICBpZiAoIWlzUmVsYXRpdmUpIHtcbiAgICAgICAgY3VyQ29udHJvbFggKz0geDtcbiAgICAgICAgY3VyQ29udHJvbFkgKz0geTtcbiAgICAgIH1cblxuICAgICAgc2VnbWVudHNbaWR4XSA9IFtcbiAgICAgICAgaXNSZWxhdGl2ZSA/ICdjJyA6ICdDJyxcbiAgICAgICAgY3VyQ29udHJvbFgsIGN1ckNvbnRyb2xZLFxuICAgICAgICBzWzFdLCBzWzJdLCBzWzNdLCBzWzRdXG4gICAgICBdO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU3ZnUGF0aDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9zdmdwYXRoJyk7XG4iLCJpbXBvcnQgeyBhZGRJY29uIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgc3ZncGF0aCBmcm9tIFwic3ZncGF0aFwiO1xuXG5mdW5jdGlvbiBzY2FsZShwYXRoOiBzdHJpbmcgfCBQYXRoRGVmLCBmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGA8cGF0aCBkPVwiJHtzdmdwYXRoKHBhdGgpLnNjYWxlKHRvIC8gZnJvbSl9XCIgLz5gO1xuICB9XG5cbiAgcmV0dXJuIGA8cGF0aCAke09iamVjdC5rZXlzKHBhdGgpXG4gICAgLm1hcChcbiAgICAgIChrKSA9PlxuICAgICAgICBgJHtrfT1cIiR7XG4gICAgICAgICAgayA9PT0gXCJkXCJcbiAgICAgICAgICAgID8gc3ZncGF0aChwYXRoW2tdKS5zY2FsZSh0byAvIGZyb20pXG4gICAgICAgICAgICA6IHBhdGhbayBhcyBrZXlvZiBQYXRoRGVmXVxuICAgICAgICB9XCJgXG4gICAgKVxuICAgIC5qb2luKFwiIFwiKX0gLz5gO1xufVxuXG5pbnRlcmZhY2UgUGF0aERlZiB7XG4gIGQ6IHN0cmluZztcbiAgZmlsbDogc3RyaW5nO1xufVxuXG5jb25zdCBpY29uczogeyBbazogc3RyaW5nXTogc3RyaW5nIHwgQXJyYXk8c3RyaW5nIHwgUGF0aERlZj4gfSA9IHtcbiAgXCJhbnkta2V5XCI6IFwiXCIsXG4gIFwiYXVkaW8tZmlsZVwiOiBcIlwiLFxuICBibG9ja3M6IFtcbiAgICBcIk0xMiAxOEwxNiAxMyAxMyAxMyAxMyAyIDExIDIgMTEgMTMgOCAxM3pcIixcbiAgICBcIk0xOSw5aC00djJoNHY5SDV2LTloNFY5SDVjLTEuMTAzLDAtMiwwLjg5Ny0yLDJ2OWMwLDEuMTAzLDAuODk3LDIsMiwyaDE0YzEuMTAzLDAsMi0wLjg5NywyLTJ2LTlDMjEsOS44OTcsMjAuMTAzLDksMTksOSB6XCIsXG4gIF0sXG4gIFwiYnJva2VuLWxpbmtcIjpcbiAgICBcIk0xNi45NDkgMTQuMTIxTDE5LjA3MSAxMmMxLjk0OC0xLjk0OSAxLjk0OC01LjEyMiAwLTcuMDcxLTEuOTUtMS45NS01LjEyMy0xLjk0OC03LjA3MSAwbC0uNzA3LjcwNyAxLjQxNCAxLjQxNC43MDctLjcwN2MxLjE2OS0xLjE2NyAzLjA3Mi0xLjE2OSA0LjI0MyAwIDEuMTY5IDEuMTcgMS4xNjkgMy4wNzMgMCA0LjI0M2wtMi4xMjIgMi4xMjFjLS4yNDcuMjQ3LS41MzQuNDM1LS44NDQuNTdMMTMuNDE0IDEybDEuNDE0LTEuNDE0LS43MDctLjcwN2MtLjk0My0uOTQ0LTIuMTk5LTEuNDY1LTMuNTM1LTEuNDY1LS4yMzUgMC0uNDY0LjAzMi0uNjkxLjA2NkwzLjcwNyAyLjI5MyAyLjI5MyAzLjcwN2wxOCAxOCAxLjQxNC0xLjQxNC01LjUzNi01LjUzNkMxNi40NDggMTQuNTczIDE2LjcwOSAxNC4zNjEgMTYuOTQ5IDE0LjEyMXpNMTAuNTg2IDE3LjY1N2MtMS4xNjkgMS4xNjctMy4wNzIgMS4xNjktNC4yNDMgMC0xLjE2OS0xLjE3LTEuMTY5LTMuMDczIDAtNC4yNDNsMS40NzYtMS40NzUtMS40MTQtMS40MTRMNC45MjkgMTJjLTEuOTQ4IDEuOTQ5LTEuOTQ4IDUuMTIyIDAgNy4wNzEuOTc1Ljk3NSAyLjI1NSAxLjQ2MiAzLjUzNSAxLjQ2MiAxLjI4MSAwIDIuNTYyLS40ODcgMy41MzYtMS40NjJsLjcwNy0uNzA3LTEuNDE0LTEuNDE0TDEwLjU4NiAxNy42NTd6XCIsXG4gIFwiYnVsbGV0LWxpc3RcIjpcbiAgICBcIk00IDZINlY4SDR6TTQgMTFINlYxM0g0ek00IDE2SDZWMThINHpNMjAgOEwyMCA2IDE4LjggNiA5LjIgNiA4LjAyMyA2IDguMDIzIDggOS4yIDggMTguOCA4ek04IDExSDIwVjEzSDh6TTggMTZIMjBWMThIOHpcIixcbiAgXCJjYWxlbmRhci13aXRoLWNoZWNrbWFya1wiOiBbXG4gICAgXCJNMTksNGgtMlYyaC0ydjJIOVYySDd2Mkg1QzMuODk3LDQsMyw0Ljg5NywzLDZ2MnYxMmMwLDEuMTAzLDAuODk3LDIsMiwyaDE0YzEuMTAzLDAsMi0wLjg5NywyLTJWOFY2IEMyMSw0Ljg5NywyMC4xMDMsNCwxOSw0eiBNMTkuMDAyLDIwSDVWOGgxNEwxOS4wMDIsMjB6XCIsXG4gICAgXCJNMTEgMTcuNDE0TDE2LjcwNyAxMS43MDcgMTUuMjkzIDEwLjI5MyAxMSAxNC41ODYgOC43MDcgMTIuMjkzIDcuMjkzIDEzLjcwN3pcIixcbiAgXSxcbiAgXCJjaGVjay1pbi1jaXJjbGVcIjpcbiAgICBcIk0xMiwyQzYuNDg2LDIsMiw2LjQ4NiwyLDEyczQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzE3LjUxNCwyLDEyLDJ6IE0xMiwyMGMtNC40MTEsMC04LTMuNTg5LTgtOHMzLjU4OS04LDgtOCBzOCwzLjU4OSw4LDhTMTYuNDExLDIwLDEyLDIwelwiLFxuICBcImNoZWNrLXNtYWxsXCI6XG4gICAgXCJNMTAgMTUuNTg2TDYuNzA3IDEyLjI5MyA1LjI5MyAxMy43MDcgMTAgMTguNDE0IDE5LjcwNyA4LjcwNyAxOC4yOTMgNy4yOTN6XCIsXG4gIGNoZWNrbWFyazpcbiAgICBcIk0xMCAxNS41ODZMNi43MDcgMTIuMjkzIDUuMjkzIDEzLjcwNyAxMCAxOC40MTQgMTkuNzA3IDguNzA3IDE4LjI5MyA3LjI5M3pcIixcbiAgXCJjcmVhdGUtbmV3XCI6IFtcbiAgICBcIk0xMyA3TDExIDcgMTEgMTEgNyAxMSA3IDEzIDExIDEzIDExIDE3IDEzIDE3IDEzIDEzIDE3IDEzIDE3IDExIDEzIDExelwiLFxuICAgIFwiTTEyLDJDNi40ODYsMiwyLDYuNDg2LDIsMTJzNC40ODYsMTAsMTAsMTBjNS41MTQsMCwxMC00LjQ4NiwxMC0xMFMxNy41MTQsMiwxMiwyeiBNMTIsMjBjLTQuNDExLDAtOC0zLjU4OS04LTggczMuNTg5LTgsOC04czgsMy41ODksOCw4UzE2LjQxMSwyMCwxMiwyMHpcIixcbiAgXSxcbiAgXCJjcm9zcy1pbi1ib3hcIjpcbiAgICBcIk05LjE3MiAxNi4yNDJMMTIgMTMuNDE0IDE0LjgyOCAxNi4yNDIgMTYuMjQyIDE0LjgyOCAxMy40MTQgMTIgMTYuMjQyIDkuMTcyIDE0LjgyOCA3Ljc1OCAxMiAxMC41ODYgOS4xNzIgNy43NTggNy43NTggOS4xNzIgMTAuNTg2IDEyIDcuNzU4IDE0LjgyOHpcIixcbiAgY3Jvc3M6XG4gICAgXCJNMTYuMTkyIDYuMzQ0TDExLjk0OSAxMC41ODYgNy43MDcgNi4zNDQgNi4yOTMgNy43NTggMTAuNTM1IDEyIDYuMjkzIDE2LjI0MiA3LjcwNyAxNy42NTYgMTEuOTQ5IDEzLjQxNCAxNi4xOTIgMTcuNjU2IDE3LjYwNiAxNi4yNDIgMTMuMzY0IDEyIDE3LjYwNiA3Ljc1OHpcIixcbiAgXCJjcm9zc2VkLXN0YXJcIjpcbiAgICBcIk01LjAyNSwyMC43NzVjLTAuMDkyLDAuMzk5LDAuMDY4LDAuODE0LDAuNDA2LDEuMDQ3QzUuNjAzLDIxLjk0LDUuODAxLDIyLDYsMjJjMC4xOTMsMCwwLjM4Ny0wLjA1NiwwLjU1NS0wLjE2OEwxMiwxOC4yMDIgbDUuNDQ1LDMuNjNjMC4zNDgsMC4yMzIsMC44MDQsMC4yMjMsMS4xNDUtMC4wMjRjMC4zMzgtMC4yNDcsMC40ODctMC42OCwwLjM3Mi0xLjA4MmwtMS44MjktNi40bDQuNTM2LTQuMDgyIGMwLjI5Ny0wLjI2NywwLjQwNi0wLjY4NiwwLjI3OC0xLjA2NGMtMC4xMjktMC4zNzgtMC40Ny0wLjY0NS0wLjg2OC0wLjY3NkwxNS4zNzgsOC4wNWwtMi40NjctNS40NjFDMTIuNzUsMi4yMywxMi4zOTMsMiwxMiwyIHMtMC43NSwwLjIzLTAuOTExLDAuNTg4TDguNjIyLDguMDVMMi45MjEsOC41MDNDMi41MjksOC41MzQsMi4xOTIsOC43OTEsMi4wNiw5LjE2Yy0wLjEzNCwwLjM2OS0wLjAzOCwwLjc4MiwwLjI0MiwxLjA1NiBsNC4yMTQsNC4xMDdMNS4wMjUsMjAuNzc1eiBNMTIsNS40MjlsMi4wNDIsNC41MjFsMC41ODgsMC4wNDdjMC4wMDEsMCwwLjAwMSwwLDAuMDAxLDBsMy45NzIsMC4zMTVsLTMuMjcxLDIuOTQ0IGMtMC4wMDEsMC4wMDEtMC4wMDEsMC4wMDEtMC4wMDEsMC4wMDJsLTAuNDYzLDAuNDE2bDAuMTcxLDAuNTk3YzAsMCwwLDAuMDAyLDAsMC4wMDNsMS4yNTMsNC4zODVMMTIsMTUuNzk4VjUuNDI5elwiLFxuICBkaWNlOlxuICAgIFwiTTE5LDNINUMzLjg5NywzLDMsMy44OTcsMyw1djE0YzAsMS4xMDMsMC44OTcsMiwyLDJoMTRjMS4xMDMsMCwyLTAuODk3LDItMlY1QzIxLDMuODk3LDIwLjEwMywzLDE5LDN6IE01LDE5VjVoMTQgbDAuMDAyLDE0SDV6XCIsXG4gIGRvY3VtZW50OlxuICAgIFwiTTE5LjkzNyw4LjY4Yy0wLjAxMS0wLjAzMi0wLjAyLTAuMDYzLTAuMDMzLTAuMDk0Yy0wLjA0OS0wLjEwNi0wLjExLTAuMjA3LTAuMTk2LTAuMjkzbC02LTYgYy0wLjA4Ni0wLjA4Ni0wLjE4Ny0wLjE0Ny0wLjI5My0wLjE5NmMtMC4wMy0wLjAxNC0wLjA2Mi0wLjAyMi0wLjA5NC0wLjAzM2MtMC4wODQtMC4wMjgtMC4xNy0wLjA0Ni0wLjI1OS0wLjA1MSBDMTMuMDQsMi4wMTEsMTMuMDIxLDIsMTMsMkg2QzQuODk3LDIsNCwyLjg5Nyw0LDR2MTZjMCwxLjEwMywwLjg5NywyLDIsMmgxMmMxLjEwMywwLDItMC44OTcsMi0yVjkgYzAtMC4wMjEtMC4wMTEtMC4wNC0wLjAxMy0wLjA2MkMxOS45ODIsOC44NSwxOS45NjUsOC43NjQsMTkuOTM3LDguNjh6IE0xNi41ODYsOEgxNFY1LjQxNEwxNi41ODYsOHogTTYsMjBWNGg2djUgYzAsMC41NTMsMC40NDcsMSwxLDFoNWwwLjAwMiwxMEg2elwiLFxuICBkb2N1bWVudHM6IFtcbiAgICBcIk0yMCwySDEwQzguODk3LDIsOCwyLjg5Nyw4LDR2NEg0Yy0xLjEwMywwLTIsMC44OTctMiwydjEwYzAsMS4xMDMsMC44OTcsMiwyLDJoMTBjMS4xMDMsMCwyLTAuODk3LDItMnYtNGg0IGMxLjEwMywwLDItMC44OTcsMi0yVjRDMjIsMi44OTcsMjEuMTAzLDIsMjAsMnogTTQsMjBWMTBoMTBsMC4wMDIsMTBINHogTTIwLDE0aC00di00YzAtMS4xMDMtMC44OTctMi0yLTJoLTRWNGgxMFYxNHpcIixcbiAgICBcIk02IDEySDEyVjE0SDZ6TTYgMTZIMTJWMThINnpcIixcbiAgXSxcbiAgXCJkb3QtbmV0d29ya1wiOlxuICAgIFwiTTE5LjUsM0MxOC4xMjEsMywxNyw0LjEyMSwxNyw1LjVjMCwwLjM1NywwLjA3OCwwLjY5NiwwLjIxNCwxLjAwNWwtMS45NTUsMi4xOTlDMTQuNjE1LDguMjYyLDEzLjgzOSw4LDEzLDggYy0wLjc0LDAtMS40MjQsMC4yMTYtMi4wMTksMC41NjZMOC43MDcsNi4yOTNMOC42ODQsNi4zMTZDOC44OCw1LjkxOCw5LDUuNDc1LDksNWMwLTEuNjU3LTEuMzQzLTMtMy0zUzMsMy4zNDMsMyw1czEuMzQzLDMsMywzIGMwLjQ3NSwwLDAuOTE3LTAuMTIsMS4zMTYtMC4zMTZMNy4yOTMsNy43MDdMOS41NjcsOS45OEM5LjIxNSwxMC41NzYsOSwxMS4yNjEsOSwxMmMwLDAuOTk3LDAuMzgsMS44OTksMC45ODUsMi42MDFsLTIuNTc3LDIuNTc2IEM3LjEyNiwxNy4wNjYsNi44MjEsMTcsNi41LDE3QzUuMTIyLDE3LDQsMTguMTIxLDQsMTkuNVM1LjEyMiwyMiw2LjUsMjJTOSwyMC44NzksOSwxOS41YzAtMC4zMjEtMC4wNjYtMC42MjYtMC4xNzctMC45MDkgbDIuODM4LTIuODM4QzEyLjA4MiwxNS45MDMsMTIuNTI4LDE2LDEzLDE2YzIuMjA2LDAsNC0xLjc5NCw0LTRjMC0wLjYzNi0wLjE2My0xLjIyOS0wLjQyOC0xLjc2NGwyLjExNy0yLjM4MyBDMTguOTQ1LDcuOTQxLDE5LjIxNSw4LDE5LjUsOEMyMC44NzksOCwyMiw2Ljg3OSwyMiw1LjVTMjAuODc5LDMsMTkuNSwzeiBNMTMsMTRjLTEuMTAzLDAtMi0wLjg5Ny0yLTJzMC44OTctMiwyLTIgYzEuMTAzLDAsMiwwLjg5NywyLDJTMTQuMTAzLDE0LDEzLDE0elwiLFxuICBlbnRlcjogXCJcIixcbiAgXCJleHBhbmQtdmVydGljYWxseVwiOiBcIk03IDE3TDEyIDIyIDE3IDE3IDEzIDE3IDEzIDcgMTcgNyAxMiAyIDcgNyAxMSA3IDExIDE3elwiLFxuICBcImZpbGxlZC1waW5cIjpcbiAgICBcIk0xNSwxMS41ODZWNmgyVjRjMC0xLjEwNC0wLjg5Ni0yLTItMkg5QzcuODk2LDIsNywyLjg5Niw3LDR2MmgydjUuNTg2bC0yLjcwNywxLjcwN0M2LjEwNSwxMy40OCw2LDEzLjczNCw2LDE0djIgYzAsMC41NTMsMC40NDgsMSwxLDFoMmgydjNsMSwybDEtMnYtM2g0YzAuNTUzLDAsMS0wLjQ0NywxLTF2LTJjMC0wLjI2Ni0wLjEwNS0wLjUyLTAuMjkzLTAuNzA3TDE1LDExLjU4NnpcIixcbiAgZm9sZGVyOlxuICAgIFwiTTIwLDVoLTguNTg2TDkuNzA3LDMuMjkzQzkuNTIsMy4xMDUsOS4yNjUsMyw5LDNINEMyLjg5NywzLDIsMy44OTcsMiw1djE0YzAsMS4xMDMsMC44OTcsMiwyLDJoMTZjMS4xMDMsMCwyLTAuODk3LDItMlY3IEMyMiw1Ljg5NywyMS4xMDMsNSwyMCw1eiBNNCwxOVY3aDdoMWg4bDAuMDAyLDEySDR6XCIsXG4gIFwiZm9yd2FyZC1hcnJvd1wiOlxuICAgIFwiTTEwLjcwNyAxNy43MDdMMTYuNDE0IDEyIDEwLjcwNyA2LjI5MyA5LjI5MyA3LjcwNyAxMy41ODYgMTIgOS4yOTMgMTYuMjkzelwiLFxuICBnZWFyOiBbXG4gICAgXCJNMTIsMTZjMi4yMDYsMCw0LTEuNzk0LDQtNHMtMS43OTQtNC00LTRzLTQsMS43OTQtNCw0UzkuNzk0LDE2LDEyLDE2eiBNMTIsMTBjMS4wODQsMCwyLDAuOTE2LDIsMnMtMC45MTYsMi0yLDIgcy0yLTAuOTE2LTItMlMxMC45MTYsMTAsMTIsMTB6XCIsXG4gICAgXCJNMi44NDUsMTYuMTM2bDEsMS43M2MwLjUzMSwwLjkxNywxLjgwOSwxLjI2MSwyLjczLDAuNzNsMC41MjktMC4zMDZDNy42ODYsMTguNzQ3LDguMzI1LDE5LjEyMiw5LDE5LjQwMlYyMCBjMCwxLjEwMywwLjg5NywyLDIsMmgyYzEuMTAzLDAsMi0wLjg5NywyLTJ2LTAuNTk4YzAuNjc1LTAuMjgsMS4zMTQtMC42NTUsMS44OTYtMS4xMTFsMC41MjksMC4zMDYgYzAuOTIzLDAuNTMsMi4xOTgsMC4xODgsMi43MzEtMC43MzFsMC45OTktMS43MjljMC41NTItMC45NTUsMC4yMjQtMi4xODEtMC43MzEtMi43MzJsLTAuNTA1LTAuMjkyQzE5Ljk3MywxMi43NDIsMjAsMTIuMzcxLDIwLDEyIHMtMC4wMjctMC43NDMtMC4wODEtMS4xMTFsMC41MDUtMC4yOTJjMC45NTUtMC41NTIsMS4yODMtMS43NzcsMC43MzEtMi43MzJsLTAuOTk5LTEuNzI5Yy0wLjUzMS0wLjkyLTEuODA4LTEuMjY1LTIuNzMxLTAuNzMyIGwtMC41MjksMC4zMDZDMTYuMzE0LDUuMjUzLDE1LjY3NSw0Ljg3OCwxNSw0LjU5OFY0YzAtMS4xMDMtMC44OTctMi0yLTJoLTJDOS44OTcsMiw5LDIuODk3LDksNHYwLjU5OCBjLTAuNjc1LDAuMjgtMS4zMTQsMC42NTUtMS44OTYsMS4xMTFMNi41NzUsNS40MDNjLTAuOTI0LTAuNTMxLTIuMi0wLjE4Ny0yLjczMSwwLjczMkwyLjg0NSw3Ljg2NCBjLTAuNTUyLDAuOTU1LTAuMjI0LDIuMTgxLDAuNzMxLDIuNzMybDAuNTA1LDAuMjkyQzQuMDI3LDExLjI1Nyw0LDExLjYyOSw0LDEyczAuMDI3LDAuNzQyLDAuMDgxLDEuMTExbC0wLjUwNSwwLjI5MiBDMi42MjEsMTMuOTU1LDIuMjkzLDE1LjE4MSwyLjg0NSwxNi4xMzZ6IE02LjE3MSwxMy4zNzhDNi4wNTgsMTIuOTI1LDYsMTIuNDYxLDYsMTJjMC0wLjQ2MiwwLjA1OC0wLjkyNiwwLjE3LTEuMzc4IGMwLjEwOC0wLjQzMy0wLjA4My0wLjg4NS0wLjQ3LTEuMTA4TDQuNTc3LDguODY0bDAuOTk4LTEuNzI5TDYuNzIsNy43OTdjMC4zODQsMC4yMjEsMC44NjcsMC4xNjUsMS4xODgtMC4xNDIgYzAuNjgzLTAuNjQ3LDEuNTA3LTEuMTMxLDIuMzg0LTEuMzk5QzEwLjcxMyw2LjEyOCwxMSw1LjczOSwxMSw1LjNWNGgydjEuM2MwLDAuNDM5LDAuMjg3LDAuODI4LDAuNzA4LDAuOTU2IGMwLjg3NywwLjI2OSwxLjcwMSwwLjc1MiwyLjM4NCwxLjM5OWMwLjMyMSwwLjMwNywwLjgwNiwwLjM2MiwxLjE4OCwwLjE0MmwxLjE0NC0wLjY2MWwxLDEuNzI5TDE4LjMsOS41MTQgYy0wLjM4NywwLjIyNC0wLjU3OCwwLjY3Ni0wLjQ3LDEuMTA4QzE3Ljk0MiwxMS4wNzQsMTgsMTEuNTM4LDE4LDEyYzAsMC40NjEtMC4wNTgsMC45MjUtMC4xNzEsMS4zNzggYy0wLjEwNywwLjQzMywwLjA4NCwwLjg4NSwwLjQ3MSwxLjEwOGwxLjEyMywwLjY0OWwtMC45OTgsMS43MjlsLTEuMTQ1LTAuNjYxYy0wLjM4My0wLjIyMS0wLjg2Ny0wLjE2Ni0xLjE4OCwwLjE0MiBjLTAuNjgzLDAuNjQ3LTEuNTA3LDEuMTMxLTIuMzg0LDEuMzk5QzEzLjI4NywxNy44NzIsMTMsMTguMjYxLDEzLDE4LjdsMC4wMDIsMS4zSDExdi0xLjNjMC0wLjQzOS0wLjI4Ny0wLjgyOC0wLjcwOC0wLjk1NiBjLTAuODc3LTAuMjY5LTEuNzAxLTAuNzUyLTIuMzg0LTEuMzk5Yy0wLjE5LTAuMTgyLTAuNDM4LTAuMjc1LTAuNjg4LTAuMjc1Yy0wLjE3MiwwLTAuMzQ0LDAuMDQ0LTAuNSwwLjEzNGwtMS4xNDQsMC42NjJsLTEtMS43MjkgTDUuNywxNC40ODZDNi4wODcsMTQuMjYzLDYuMjc4LDEzLjgxMSw2LjE3MSwxMy4zNzh6XCIsXG4gIF0sXG4gIFwiZ28tdG8tZmlsZVwiOlxuICAgIFwiTTEzLjcwNywyLjI5M0MxMy41MiwyLjEwNSwxMy4yNjYsMiwxMywySDZDNC44OTcsMiw0LDIuODk3LDQsNHYxNmMwLDEuMTAzLDAuODk3LDIsMiwyaDEyYzEuMTAzLDAsMi0wLjg5NywyLTJWOSBjMC0wLjI2Ni0wLjEwNS0wLjUyLTAuMjkzLTAuNzA3TDEzLjcwNywyLjI5M3ogTTYsNGg2LjU4NkwxOCw5LjQxNGwwLjAwMiw5LjE3NGwtMi41NjgtMi41NjhDMTUuNzg0LDE1LjQyNSwxNiwxNC43MzksMTYsMTQgYzAtMi4yMDYtMS43OTQtNC00LTRzLTQsMS43OTQtNCw0czEuNzk0LDQsNCw0YzAuNzM5LDAsMS40MjUtMC4yMTYsMi4wMi0wLjU2NkwxNi41ODYsMjBINlY0eiBNMTIsMTZjLTEuMTAzLDAtMi0wLjg5Ny0yLTIgczAuODk3LTIsMi0yczIsMC44OTcsMiwyUzEzLjEwMywxNiwxMiwxNnpcIixcbiAgaGFzaHRhZzpcbiAgICBcIk0xNi4wMTgsMy44MTVMMTUuMjMyLDhoLTQuOTY2bDAuNzE2LTMuODE1TDkuMDE4LDMuODE1TDguMjMyLDhINHYyaDMuODU3bC0wLjc1MSw0SDN2MmgzLjczMWwtMC43MTQsMy44MDVsMS45NjUsMC4zNjkgTDguNzY2LDE2aDQuOTY2bC0wLjcxNCwzLjgwNWwxLjk2NSwwLjM2OUwxNS43NjYsMTZIMjB2LTJoLTMuODU5bDAuNzUxLTRIMjFWOGgtMy43MzNsMC43MTYtMy44MTVMMTYuMDE4LDMuODE1eiBNMTQuMTA2LDE0SDkuMTQxIGwwLjc1MS00aDQuOTY2TDE0LjEwNiwxNHpcIixcbiAgaGVscDogW1xuICAgIFwiTTEyIDZDOS44MzEgNiA4LjA2NiA3Ljc2NSA4LjA2NiA5LjkzNGgyQzEwLjA2NiA4Ljg2NyAxMC45MzQgOCAxMiA4czEuOTM0Ljg2NyAxLjkzNCAxLjkzNGMwIC41OTgtLjQ4MSAxLjAzMi0xLjIxNiAxLjYyNi0uMjU1LjIwNy0uNDk2LjQwNC0uNjkxLjU5OUMxMS4wMjkgMTMuMTU2IDExIDE0LjIxNSAxMSAxNC4zMzNWMTVoMmwtLjAwMS0uNjMzYy4wMDEtLjAxNi4wMzMtLjM4Ni40NDEtLjc5My4xNS0uMTUuMzM5LS4zLjUzNS0uNDU4Ljc3OS0uNjMxIDEuOTU4LTEuNTg0IDEuOTU4LTMuMTgyQzE1LjkzNCA3Ljc2NSAxNC4xNjkgNiAxMiA2ek0xMSAxNkgxM1YxOEgxMXpcIixcbiAgICBcIk0xMiwyQzYuNDg2LDIsMiw2LjQ4NiwyLDEyczQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzE3LjUxNCwyLDEyLDJ6IE0xMiwyMGMtNC40MTEsMC04LTMuNTg5LTgtOHMzLjU4OS04LDgtOCBzOCwzLjU4OSw4LDhTMTYuNDExLDIwLDEyLDIwelwiLFxuICBdLFxuICBcImhvcml6b250YWwtc3BsaXRcIjogXCJNMTcgMTFMNyAxMSA3IDcgMiAxMiA3IDE3IDcgMTMgMTcgMTMgMTcgMTcgMjIgMTIgMTcgN3pcIixcbiAgXCJpbWFnZS1maWxlXCI6IFtcbiAgICBcIk0yMCwySDhDNi44OTcsMiw2LDIuODk3LDYsNHYxMmMwLDEuMTAzLDAuODk3LDIsMiwyaDEyYzEuMTAzLDAsMi0wLjg5NywyLTJWNEMyMiwyLjg5NywyMS4xMDMsMiwyMCwyeiBNOCwxNlY0aDEyIGwwLjAwMiwxMkg4elwiLFxuICAgIFwiTTQsOEgydjEyYzAsMS4xMDMsMC44OTcsMiwyLDJoMTJ2LTJINFY4elwiLFxuICAgIFwiTTEyIDEyTDExIDExIDkgMTQgMTkgMTQgMTUgOHpcIixcbiAgXSxcbiAgaW5mbzpcbiAgICBcIk0xMiwyQzYuNDg2LDIsMiw2LjQ4NiwyLDEyczQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzE3LjUxNCwyLDEyLDJ6IE0xMiwyMGMtNC40MTEsMC04LTMuNTg5LTgtOHMzLjU4OS04LDgtOCBzOCwzLjU4OSw4LDhTMTYuNDExLDIwLDEyLDIwelwiLFxuICBpbnN0YWxsOiBcIlwiLFxuICBsYW5ndWFnZXM6IFwiXCIsXG4gIFwibGVmdC1hcnJvdy13aXRoLXRhaWxcIjpcbiAgICBcIk0xMy4yOTMgNi4yOTNMNy41ODYgMTIgMTMuMjkzIDE3LjcwNyAxNC43MDcgMTYuMjkzIDEwLjQxNCAxMiAxNC43MDcgNy43MDd6XCIsXG4gIFwibGVmdC1hcnJvd1wiOlxuICAgIFwiTTEzLjI5MyA2LjI5M0w3LjU4NiAxMiAxMy4yOTMgMTcuNzA3IDE0LjcwNyAxNi4yOTMgMTAuNDE0IDEyIDE0LjcwNyA3LjcwN3pcIixcbiAgXCJsaW5lcy1vZi10ZXh0XCI6XG4gICAgXCJNMjAsM0g0QzIuODk3LDMsMiwzLjg5NywyLDV2MTFjMCwxLjEwMywwLjg5NywyLDIsMmg3djJIOHYyaDNoMmgzdi0yaC0zdi0yaDdjMS4xMDMsMCwyLTAuODk3LDItMlY1IEMyMiwzLjg5NywyMS4xMDMsMywyMCwzeiBNNCwxNFY1aDE2bDAuMDAyLDlINHpcIixcbiAgbGluazogW1xuICAgIFwiTTguNDY1LDExLjI5M2MxLjEzMy0xLjEzMywzLjEwOS0xLjEzMyw0LjI0MiwwTDEzLjQxNCwxMmwxLjQxNC0xLjQxNGwtMC43MDctMC43MDdjLTAuOTQzLTAuOTQ0LTIuMTk5LTEuNDY1LTMuNTM1LTEuNDY1IFM3Ljk5NCw4LjkzNSw3LjA1MSw5Ljg3OUw0LjkyOSwxMmMtMS45NDgsMS45NDktMS45NDgsNS4xMjIsMCw3LjA3MWMwLjk3NSwwLjk3NSwyLjI1NSwxLjQ2MiwzLjUzNSwxLjQ2MiBjMS4yODEsMCwyLjU2Mi0wLjQ4NywzLjUzNi0xLjQ2MmwwLjcwNy0wLjcwN2wtMS40MTQtMS40MTRsLTAuNzA3LDAuNzA3Yy0xLjE3LDEuMTY3LTMuMDczLDEuMTY5LTQuMjQzLDAgYy0xLjE2OS0xLjE3LTEuMTY5LTMuMDczLDAtNC4yNDNMOC40NjUsMTEuMjkzelwiLFxuICAgIFwiTTEyLDQuOTI5bC0wLjcwNywwLjcwN2wxLjQxNCwxLjQxNGwwLjcwNy0wLjcwN2MxLjE2OS0xLjE2NywzLjA3Mi0xLjE2OSw0LjI0MywwYzEuMTY5LDEuMTcsMS4xNjksMy4wNzMsMCw0LjI0MyBsLTIuMTIyLDIuMTIxYy0xLjEzMywxLjEzMy0zLjEwOSwxLjEzMy00LjI0MiwwTDEwLjU4NiwxMmwtMS40MTQsMS40MTRsMC43MDcsMC43MDdjMC45NDMsMC45NDQsMi4xOTksMS40NjUsMy41MzUsMS40NjUgczIuNTkyLTAuNTIxLDMuNTM1LTEuNDY1TDE5LjA3MSwxMmMxLjk0OC0xLjk0OSwxLjk0OC01LjEyMiwwLTcuMDcxQzE3LjEyMSwyLjk3OSwxMy45NDgsMi45OCwxMiw0LjkyOXpcIixcbiAgXSxcbiAgXCJtYWduaWZ5aW5nLWdsYXNzXCI6XG4gICAgXCJNMTkuMDIzLDE2Ljk3N2MtMC41MTMtMC40ODgtMS4wMDQtMC45OTctMS4zNjctMS4zODRjLTAuMzcyLTAuMzc4LTAuNTk2LTAuNjUzLTAuNTk2LTAuNjUzbC0yLjgtMS4zMzcgQzE1LjM0LDEyLjM3LDE2LDEwLjc2MywxNiw5YzAtMy44NTktMy4xNC03LTctN1MyLDUuMTQxLDIsOXMzLjE0LDcsNyw3YzEuNzYzLDAsMy4zNy0wLjY2LDQuNjAzLTEuNzM5bDEuMzM3LDIuOCBjMCwwLDAuMjc1LDAuMjI0LDAuNjUzLDAuNTk2YzAuMzg3LDAuMzYzLDAuODk2LDAuODU0LDEuMzg0LDEuMzY3YzAuNDk0LDAuNTA2LDAuOTg4LDEuMDEyLDEuMzU4LDEuMzkyIGMwLjM2MiwwLjM4OCwwLjYwNCwwLjY0NiwwLjYwNCwwLjY0NmwyLjEyMS0yLjEyMWMwLDAtMC4yNTgtMC4yNDItMC42NDYtMC42MDRDMjAuMDM1LDE3Ljk2NSwxOS41MjksMTcuNDcxLDE5LjAyMywxNi45Nzd6IE05LDE0IGMtMi43NTcsMC01LTIuMjQzLTUtNXMyLjI0My01LDUtNXM1LDIuMjQzLDUsNVMxMS43NTcsMTQsOSwxNHpcIixcbiAgXCJtaWNyb3Bob25lLWZpbGxlZFwiOlxuICAgIFwiTTEyLDE2YzIuMjA2LDAsNC0xLjc5NCw0LTRWNmMwLTIuMjE3LTEuNzg1LTQuMDIxLTMuOTc5LTQuMDIxYy0wLjA2OSwwLTAuMTQsMC4wMDktMC4yMDksMC4wMjVDOS42OTMsMi4xMDQsOCwzLjg1Nyw4LDZ2NiBDOCwxNC4yMDYsOS43OTQsMTYsMTIsMTZ6XCIsXG4gIG1pY3JvcGhvbmU6XG4gICAgXCJNMTYsMTJWNmMwLTIuMjE3LTEuNzg1LTQuMDIxLTMuOTc5LTQuMDIxYy0wLjA2OSwwLTAuMTQsMC4wMDktMC4yMDksMC4wMjVDOS42OTMsMi4xMDQsOCwzLjg1Nyw4LDZ2NmMwLDIuMjA2LDEuNzk0LDQsNCw0IFMxNiwxNC4yMDYsMTYsMTJ6IE0xMCwxMlY2YzAtMS4xMDMsMC44OTctMiwyLTJjMC4wNTUsMCwwLjEwOS0wLjAwNSwwLjE2My0wLjAxNUMxMy4xODgsNC4wNiwxNCw0LjkzNSwxNCw2djZjMCwxLjEwMy0wLjg5NywyLTIsMiBTMTAsMTMuMTAzLDEwLDEyelwiLFxuICBcIm9wZW4tdmF1bHRcIjpcbiAgICBcIk0xOSwyLjAxSDZjLTEuMjA2LDAtMywwLjc5OS0zLDN2M3Y2djN2MmMwLDIuMjAxLDEuNzk0LDMsMywzaDE1di0ySDYuMDEyQzUuNTUsMTkuOTk4LDUsMTkuODE1LDUsMTkuMDEgYzAtMC4xMDEsMC4wMDktMC4xOTEsMC4wMjQtMC4yNzNjMC4xMTItMC41NzUsMC41ODMtMC43MTcsMC45ODctMC43MjdIMjBjMC4wMTgsMCwwLjAzMS0wLjAwOSwwLjA0OS0wLjAxSDIxdi0wLjk5VjE1VjQuMDEgQzIxLDIuOTA3LDIwLjEwMywyLjAxLDE5LDIuMDF6IE0xOSwxNi4wMUg1di0ydi02di0zYzAtMC44MDYsMC41NS0wLjk4OCwxLTFoN3Y3bDItMWwyLDF2LTdoMlYxNVYxNi4wMXpcIixcbiAgXCJwYW5lLWxheW91dFwiOiBcIlwiLFxuICBcInBhcGVyLXBsYW5lXCI6XG4gICAgXCJNMjAuNTYzLDMuMzRjLTAuMjkyLTAuMTk5LTAuNjY3LTAuMjI5LTAuOTg5LTAuMDc5bC0xNyw4QzIuMjE5LDExLjQyOSwxLjk5NSwxMS43ODgsMiwxMi4xOCBjMC4wMDYsMC4zOTIsMC4yNCwwLjc0NSwwLjYsMC45MDJMOCwxNS40NDV2Ni43MjJsNS44MzYtNC4xNjhsNC43NjQsMi4wODRjMC4xMjgsMC4wNTcsMC4yNjUsMC4wODQsMC40LDAuMDg0IGMwLjE4MSwwLDAuMzYtMC4wNDksMC41Mi0wLjE0NmMwLjI3OC0wLjE2OSwwLjQ1Ny0wLjQ2MywwLjQ3OS0wLjc4OGwxLTE1QzIxLjAyMSwzLjg3OSwyMC44NTYsMy41NCwyMC41NjMsMy4zNHogTTE4LjA5NywxNy42OCBsLTUuMjY5LTIuMzA2TDE2LDkuMTY3bC03LjY0OSw0LjI1bC0yLjkzMi0xLjI4M0wxOC44OSw1Ljc5NEwxOC4wOTcsMTcuNjh6XCIsXG4gIHBhdXNlZDogXCJcIixcbiAgXCJwZGYtZmlsZVwiOlxuICAgIFwiTTguMjY3IDE0LjY4Yy0uMTg0IDAtLjMwOC4wMTgtLjM3Mi4wMzZ2MS4xNzhjLjA3Ni4wMTguMTcxLjAyMy4zMDIuMDIzLjQ3OSAwIC43NzQtLjI0Mi43NzQtLjY1MUM4Ljk3MSAxNC45IDguNzE3IDE0LjY4IDguMjY3IDE0LjY4ek0xMS43NTQgMTQuNjkyYy0uMiAwLS4zMy4wMTgtLjQwNy4wMzZ2Mi42MWMuMDc3LjAxOC4yMDEuMDE4LjMxMy4wMTguODE3LjAwNiAxLjM0OS0uNDQ0IDEuMzQ5LTEuMzk2QzEzLjAxNSAxNS4xMyAxMi41MyAxNC42OTIgMTEuNzU0IDE0LjY5MnpcIixcbiAgcGVuY2lsOlxuICAgIFwiTTE5LjA0NSA3LjQwMWMuMzc4LS4zNzguNTg2LS44OC41ODYtMS40MTRzLS4yMDgtMS4wMzYtLjU4Ni0xLjQxNGwtMS41ODYtMS41ODZjLS4zNzgtLjM3OC0uODgtLjU4Ni0xLjQxNC0uNTg2cy0xLjAzNi4yMDgtMS40MTMuNTg1TDQgMTMuNTg1VjE4aDQuNDEzTDE5LjA0NSA3LjQwMXpNMTYuMDQ1IDQuNDAxbDEuNTg3IDEuNTg1LTEuNTkgMS41ODQtMS41ODYtMS41ODVMMTYuMDQ1IDQuNDAxek02IDE2di0xLjU4NWw3LjA0LTcuMDE4IDEuNTg2IDEuNTg2TDcuNTg3IDE2SDZ6TTQgMjBIMjBWMjJINHpcIixcbiAgcGluOlxuICAgIFwiTTEyLDIybDEtMnYtM2g1YzAuNTUzLDAsMS0wLjQ0NywxLTF2LTEuNTg2YzAtMC41MjYtMC4yMTQtMS4wNDItMC41ODYtMS40MTRMMTcsMTEuNTg2VjhjMC41NTMsMCwxLTAuNDQ3LDEtMVY0IGMwLTEuMTAzLTAuODk3LTItMi0ySDhDNi44OTcsMiw2LDIuODk3LDYsNHYzYzAsMC41NTMsMC40NDgsMSwxLDF2My41ODZMNS41ODYsMTNDNS4yMTMsMTMuMzcyLDUsMTMuODg4LDUsMTQuNDE0VjE2IGMwLDAuNTUzLDAuNDQ4LDEsMSwxaDV2M0wxMiwyMnogTTgsNGg4djJIOFY0eiBNNywxNC40MTRsMS43MDctMS43MDdDOC44OTUsMTIuNTIsOSwxMi4yNjYsOSwxMlY4aDZ2NCBjMCwwLjI2NiwwLjEwNSwwLjUyLDAuMjkzLDAuNzA3TDE3LDE0LjQxNFYxNUg3VjE0LjQxNHpcIixcbiAgXCJwb3B1cC1vcGVuXCI6IFtcbiAgICBcIk0yMCwzSDRDMi44OTcsMywyLDMuODk3LDIsNXYxNGMwLDEuMTAzLDAuODk3LDIsMiwyaDV2LTJINFY3aDE2djEyaC01djJoNWMxLjEwMywwLDItMC44OTcsMi0yVjVDMjIsMy44OTcsMjEuMTAzLDMsMjAsM3pcIixcbiAgICBcIk0xMyAyMUwxMyAxNiAxNiAxNiAxMiAxMSA4IDE2IDExIDE2IDExIDIxelwiLFxuICBdLFxuICBwcmVzZW50YXRpb246IFwiXCIsXG4gIHJlc2V0OiBbXG4gICAgXCJNMTIsMTZjMS42NzEsMCwzLTEuMzMxLDMtM3MtMS4zMjktMy0zLTNzLTMsMS4zMzEtMywzUzEwLjMyOSwxNiwxMiwxNnpcIixcbiAgICBcIk0yMC44MTcsMTEuMTg2Yy0wLjEyLTAuNTgzLTAuMjk3LTEuMTUxLTAuNTI1LTEuNjg4Yy0wLjIyNS0wLjUzMi0wLjUwNC0xLjA0Ni0wLjgzLTEuNTMxIGMtMC4zMjQtMC40NzktMC42OTMtMC45MjYtMS4wOTgtMS4zMjljLTAuNDA0LTAuNDA2LTAuODUzLTAuNzc2LTEuMzMyLTEuMTAxYy0wLjQ4My0wLjMyNi0wLjk5OC0wLjYwNC0xLjUyOC0wLjgyOSBjLTAuNTM4LTAuMjI5LTEuMTA2LTAuNDA1LTEuNjkxLTAuNTI2Yy0wLjYtMC4xMjMtMS4yMTktMC4xODItMS44MzgtMC4xOFYyTDgsNWwzLjk3NSwzVjYuMDAyQzEyLjQ1OSw2LDEyLjk0Myw2LjA0NiwxMy40MSw2LjE0MiBjMC40NTQsMC4wOTQsMC44OTYsMC4yMzEsMS4zMTQsMC40MDljMC40MTMsMC4xNzQsMC44MTMsMC4zOTIsMS4xODgsMC42NDRjMC4zNzMsMC4yNTIsMC43MjIsMC41NCwxLjAzOCwwLjg1NyBjMC4zMTUsMC4zMTQsMC42MDQsMC42NjMsMC44NTQsMS4wMzVjMC4yNTQsMC4zNzYsMC40NzEsMC43NzYsMC42NDYsMS4xOTFjMC4xNzgsMC40MTcsMC4zMTQsMC44NTksMC40MDgsMS4zMTEgQzE4Ljk1MiwxMi4wNDgsMTksMTIuNTIzLDE5LDEzcy0wLjA0OCwwLjk1Mi0wLjE0MiwxLjQxYy0wLjA5NCwwLjQ1NC0wLjIzLDAuODk2LTAuNDA4LDEuMzE1IGMtMC4xNzUsMC40MTMtMC4zOTIsMC44MTMtMC42NDQsMS4xODhjLTAuMjUzLDAuMzczLTAuNTQyLDAuNzIyLTAuODU4LDEuMDM5Yy0wLjMxNSwwLjMxNi0wLjY2MywwLjYwMy0xLjAzNiwwLjg1NCBjLTAuMzcyLDAuMjUxLTAuNzcxLDAuNDY4LTEuMTg5LDAuNjQ1Yy0wLjQxNywwLjE3Ny0wLjg1OCwwLjMxNC0xLjMxMSwwLjQwOGMtMC45MiwwLjE4OC0xLjkwNiwwLjE4OC0yLjgyMiwwIGMtMC40NTQtMC4wOTQtMC44OTYtMC4yMzEtMS4zMTQtMC40MDljLTAuNDE2LTAuMTc2LTAuODE1LTAuMzkzLTEuMTg5LTAuNjQ1Yy0wLjM3MS0wLjI1LTAuNzE5LTAuNTM4LTEuMDM1LTAuODU0IGMtMC4zMTUtMC4zMTYtMC42MDQtMC42NjUtMC44NTUtMS4wMzZjLTAuMjU0LTAuMzc2LTAuNDcxLTAuNzc2LTAuNjQ2LTEuMTljLTAuMTc4LTAuNDE4LTAuMzE0LTAuODYtMC40MDgtMS4zMTIgQzUuMDQ4LDEzLjk1Miw1LDEzLjQ3Nyw1LDEzSDNjMCwwLjYxMSwwLjA2MiwxLjIyMSwwLjE4MywxLjgxNGMwLjEyLDAuNTgyLDAuMjk3LDEuMTUsMC41MjUsMS42ODkgYzAuMjI1LDAuNTMyLDAuNTA0LDEuMDQ2LDAuODMxLDEuNTMxYzAuMzIzLDAuNDc3LDAuNjkyLDAuOTI0LDEuMDk3LDEuMzI5YzAuNDA2LDAuNDA3LDAuODU0LDAuNzc3LDEuMzMxLDEuMDk5IGMwLjQ3OSwwLjMyNSwwLjk5NCwwLjYwNCwxLjUyOSwwLjgzYzAuNTM4LDAuMjI5LDEuMTA2LDAuNDA1LDEuNjkxLDAuNTI2QzEwLjc3OSwyMS45MzgsMTEuMzg5LDIyLDEyLDIyczEuMjIxLTAuMDYyLDEuODE0LTAuMTgzIGMwLjU4My0wLjEyMSwxLjE1MS0wLjI5NywxLjY4OC0wLjUyNWMwLjUzNy0wLjIyNywxLjA1Mi0wLjUwNiwxLjUzLTAuODNjMC40NzgtMC4zMjIsMC45MjYtMC42OTIsMS4zMzEtMS4wOTkgYzAuNDA1LTAuNDA1LDAuNzc0LTAuODUzLDEuMS0xLjMzMmMwLjMyNS0wLjQ4MywwLjYwNC0wLjk5OCwwLjgyOS0xLjUyOGMwLjIyOS0wLjU0LDAuNDA1LTEuMTA4LDAuNTI1LTEuNjkyIEMyMC45MzgsMTQuMjIxLDIxLDEzLjYxMSwyMSwxM1MyMC45MzgsMTEuNzc5LDIwLjgxNywxMS4xODZ6XCIsXG4gIF0sXG4gIFwicmlnaHQtYXJyb3ctd2l0aC10YWlsXCI6XG4gICAgXCJNMTAuNzA3IDE3LjcwN0wxNi40MTQgMTIgMTAuNzA3IDYuMjkzIDkuMjkzIDcuNzA3IDEzLjU4NiAxMiA5LjI5MyAxNi4yOTN6XCIsXG4gIFwicmlnaHQtYXJyb3dcIjpcbiAgICBcIk0xMC43MDcgMTcuNzA3TDE2LjQxNCAxMiAxMC43MDcgNi4yOTMgOS4yOTMgNy43MDcgMTMuNTg2IDEyIDkuMjkzIDE2LjI5M3pcIixcbiAgXCJyaWdodC10cmlhbmdsZVwiOlxuICAgIFwiTTEwLjcwNyAxNy43MDdMMTYuNDE0IDEyIDEwLjcwNyA2LjI5MyA5LjI5MyA3LjcwNyAxMy41ODYgMTIgOS4yOTMgMTYuMjkzelwiLFxuICBzZWFyY2g6XG4gICAgXCJNMTkuMDIzLDE2Ljk3N2MtMC41MTMtMC40ODgtMS4wMDQtMC45OTctMS4zNjctMS4zODRjLTAuMzcyLTAuMzc4LTAuNTk2LTAuNjUzLTAuNTk2LTAuNjUzbC0yLjgtMS4zMzcgQzE1LjM0LDEyLjM3LDE2LDEwLjc2MywxNiw5YzAtMy44NTktMy4xNC03LTctN1MyLDUuMTQxLDIsOXMzLjE0LDcsNyw3YzEuNzYzLDAsMy4zNy0wLjY2LDQuNjAzLTEuNzM5bDEuMzM3LDIuOCBjMCwwLDAuMjc1LDAuMjI0LDAuNjUzLDAuNTk2YzAuMzg3LDAuMzYzLDAuODk2LDAuODU0LDEuMzg0LDEuMzY3YzAuNDk0LDAuNTA2LDAuOTg4LDEuMDEyLDEuMzU4LDEuMzkyIGMwLjM2MiwwLjM4OCwwLjYwNCwwLjY0NiwwLjYwNCwwLjY0NmwyLjEyMS0yLjEyMWMwLDAtMC4yNTgtMC4yNDItMC42NDYtMC42MDRDMjAuMDM1LDE3Ljk2NSwxOS41MjksMTcuNDcxLDE5LjAyMywxNi45Nzd6IE05LDE0IGMtMi43NTcsMC01LTIuMjQzLTUtNXMyLjI0My01LDUtNXM1LDIuMjQzLDUsNVMxMS43NTcsMTQsOSwxNHpcIixcbiAgXCJzaGVldHMtaW4tYm94XCI6IFwiXCIsXG4gIFwic3Rhci1saXN0XCI6XG4gICAgXCJNMTkgMTVMMTkgMTIgMTcgMTIgMTcgMTUgMTQuNzggMTUgMTQgMTUgMTQgMTcgMTQuNzggMTcgMTcgMTcgMTcgMjAgMTkgMjAgMTkgMTcgMjEuMDYzIDE3IDIyIDE3IDIyIDE1IDIxLjA2MyAxNXpNNCA3SDE1VjlINHpNNCAxMUgxNVYxM0g0ek00IDE1SDEyVjE3SDR6XCIsXG4gIHN0YXI6XG4gICAgXCJNNi41MTYsMTQuMzIzbC0xLjQ5LDYuNDUyYy0wLjA5MiwwLjM5OSwwLjA2OCwwLjgxNCwwLjQwNiwxLjA0N0M1LjYwMywyMS45NCw1LjgwMSwyMiw2LDIyIGMwLjE5MywwLDAuMzg3LTAuMDU2LDAuNTU1LTAuMTY4TDEyLDE4LjIwMmw1LjQ0NSwzLjYzYzAuMzQ4LDAuMjMyLDAuODA1LDAuMjIzLDEuMTQ1LTAuMDI0YzAuMzM4LTAuMjQ3LDAuNDg3LTAuNjgsMC4zNzItMS4wODIgbC0xLjgyOS02LjRsNC41MzYtNC4wODJjMC4yOTctMC4yNjgsMC40MDYtMC42ODYsMC4yNzgtMS4wNjRjLTAuMTI5LTAuMzc4LTAuNDctMC42NDQtMC44NjgtMC42NzZMMTUuMzc4LDguMDVsLTIuNDY3LTUuNDYxIEMxMi43NSwyLjIzLDEyLjM5MywyLDEyLDJzLTAuNzUsMC4yMy0wLjkxMSwwLjU4OUw4LjYyMiw4LjA1TDIuOTIxLDguNTAzQzIuNTI5LDguNTM0LDIuMTkyLDguNzkxLDIuMDYsOS4xNiBjLTAuMTM0LDAuMzY5LTAuMDM4LDAuNzgyLDAuMjQyLDEuMDU2TDYuNTE2LDE0LjMyM3ogTTkuMzY5LDkuOTk3YzAuMzYzLTAuMDI5LDAuNjgzLTAuMjUzLDAuODMyLTAuNTg2TDEyLDUuNDNsMS43OTksMy45ODEgYzAuMTQ5LDAuMzMzLDAuNDY5LDAuNTU3LDAuODMyLDAuNTg2bDMuOTcyLDAuMzE1bC0zLjI3MSwyLjk0NGMtMC4yODQsMC4yNTYtMC4zOTcsMC42NS0wLjI5MywxLjAxOGwxLjI1Myw0LjM4NWwtMy43MzYtMi40OTEgYy0wLjMzNi0wLjIyNS0wLjc3My0wLjIyNS0xLjEwOSwwbC0zLjkwNCwyLjYwM2wxLjA1LTQuNTQ2YzAuMDc4LTAuMzQtMC4wMjYtMC42OTctMC4yNzYtMC45NGwtMy4wMzgtMi45NjJMOS4zNjksOS45OTd6XCIsXG4gIHN3aXRjaDpcbiAgICBcIk0xOSA3YzAtLjU1My0uNDQ3LTEtMS0xaC04djJoN3Y1aC0zbDMuOTY5IDVMMjIgMTNoLTNWN3pNNSAxN2MwIC41NTMuNDQ3IDEgMSAxaDh2LTJIN3YtNWgzTDYgNmwtNCA1aDNWMTd6XCIsXG4gIFwic3luYy1zbWFsbFwiOiBcIlwiLFxuICBzeW5jOiBcIlwiLFxuICBcInRocmVlLWhvcml6b250YWwtYmFyc1wiOiBcIk00IDZIMjBWOEg0ek00IDExSDIwVjEzSDR6TTQgMTZIMjBWMThINHpcIixcbiAgdHJhc2g6IFtcbiAgICB7XG4gICAgICBmaWxsOiBcIm5vbmVcIixcbiAgICAgIGQ6XG4gICAgICAgIFwiTTE3LjAwNCAyMEwxNy4wMDMgOGgtMS04LTF2MTJIMTcuMDA0ek0xMy4wMDMgMTBoMnY4aC0yVjEwek05LjAwMyAxMGgydjhoLTJWMTB6TTkuMDAzIDRIMTUuMDAzVjZIOS4wMDN6XCIsXG4gICAgfSxcbiAgICBcIk01LjAwMywyMGMwLDEuMTAzLDAuODk3LDIsMiwyaDEwYzEuMTAzLDAsMi0wLjg5NywyLTJWOGgyVjZoLTNoLTFWNGMwLTEuMTAzLTAuODk3LTItMi0yaC02Yy0xLjEwMywwLTIsMC44OTctMiwydjJoLTFoLTMgdjJoMlYyMHogTTkuMDAzLDRoNnYyaC02VjR6IE04LjAwMyw4aDhoMWwwLjAwMSwxMkg3LjAwM1Y4SDguMDAzelwiLFxuICAgIFwiTTkuMDAzIDEwSDExLjAwM1YxOEg5LjAwM3pNMTMuMDAzIDEwSDE1LjAwM1YxOEgxMy4wMDN6XCIsXG4gIF0sXG4gIFwidHdvLWNvbHVtbnNcIjogXCJcIixcbiAgXCJ1cC1hbmQtZG93bi1hcnJvd3NcIjpcbiAgICBcIk03IDIwTDkgMjAgOSA4IDEyIDggOCA0IDQgOCA3IDh6TTIwIDE2TDE3IDE2IDE3IDQgMTUgNCAxNSAxNiAxMiAxNiAxNiAyMHpcIixcbiAgXCJ1cHBlcmNhc2UtbG93ZXJjYXNlLWFcIjpcbiAgICBcIk0yMiA2TDE5IDIgMTYgNiAxOCA2IDE4IDEwIDE2IDEwIDE5IDE0IDIyIDEwIDIwIDEwIDIwIDZ6TTkuMzA3IDRsLTYgMTZoMi4xMzdsMS44NzUtNWg2LjM2M2wxLjg3NSA1aDIuMTM3bC02LTE2SDkuMzA3ek04LjA2OCAxM0wxMC41IDYuNTE1IDEyLjkzMiAxM0g4LjA2OHpcIixcbiAgdmF1bHQ6XG4gICAgXCJNMTksMi4wMUg2Yy0xLjIwNiwwLTMsMC43OTktMywzdjN2NnYzdjJjMCwyLjIwMSwxLjc5NCwzLDMsM2gxNXYtMkg2LjAxMkM1LjU1LDE5Ljk5OCw1LDE5LjgxNSw1LDE5LjAxIGMwLTAuMTAxLDAuMDA5LTAuMTkxLDAuMDI0LTAuMjczYzAuMTEyLTAuNTc1LDAuNTgzLTAuNzE3LDAuOTg3LTAuNzI3SDIwYzAuMDE4LDAsMC4wMzEtMC4wMDksMC4wNDktMC4wMUgyMXYtMC45OVYxNVY0LjAxIEMyMSwyLjkwNywyMC4xMDMsMi4wMSwxOSwyLjAxeiBNMTksMTYuMDFINXYtMnYtNnYtM2MwLTAuODA2LDAuNTUtMC45ODgsMS0xaDd2N2wyLTFsMiwxdi03aDJWMTVWMTYuMDF6XCIsXG4gIFwidmVydGljYWwtc3BsaXRcIjogXCJNNyAxN0wxMiAyMiAxNyAxNyAxMyAxNyAxMyA3IDE3IDcgMTIgMiA3IDcgMTEgNyAxMSAxN3pcIixcbiAgXCJ2ZXJ0aWNhbC10aHJlZS1kb3RzXCI6XG4gICAgXCJNMTIgMTBjLTEuMSAwLTIgLjktMiAycy45IDIgMiAyIDItLjkgMi0yUzEzLjEgMTAgMTIgMTB6TTEyIDRjLTEuMSAwLTIgLjktMiAycy45IDIgMiAyIDItLjkgMi0yUzEzLjEgNCAxMiA0ek0xMiAxNmMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTJTMTMuMSAxNiAxMiAxNnpcIixcbn07XG5cbmNvbnN0IGZyb20gPSAyNDtcbmNvbnN0IHRvID0gMTAwO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEljb25zKCkge1xuICBPYmplY3Qua2V5cyhpY29ucykuZm9yRWFjaCgoaWNvbikgPT4ge1xuICAgIGNvbnN0IHBhdGggPSBpY29uc1tpY29uXTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhdGgpKSB7XG4gICAgICBhZGRJY29uKGljb24sIHBhdGgubWFwKChwKSA9PiBzY2FsZShwLCBmcm9tLCB0bykpLmpvaW4oXCJcIikpO1xuICAgIH0gZWxzZSBpZiAocGF0aCAhPT0gXCJcIikge1xuICAgICAgYWRkSWNvbihpY29uLCBzY2FsZShwYXRoLCBmcm9tLCB0bykpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQge1xyXG4gIEFwcCxcclxuICBQbHVnaW4sXHJcbiAgUGx1Z2luU2V0dGluZ1RhYixcclxuICBTZXR0aW5nLFxyXG4gIFdvcmtzcGFjZUxlYWYsXHJcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcblxyXG5pbXBvcnQgRW1iZWRkZWRIZWFkaW5nc0V4dGVuc2lvbiBmcm9tIFwiLi9leHRlbnNpb25zL2VtYmVkZGVkSGVhZGluZ3NcIjtcclxuaW1wb3J0IHsgaW5pdEljb25zIH0gZnJvbSBcIi4vZXh0ZW5zaW9ucy9ib3hpY29uc1wiO1xyXG5cclxuaW5pdEljb25zKCk7XHJcblxyXG5jb25zdCBjb25maWcgPSB7XHJcbiAgYXR0cmlidXRlczogZmFsc2UsXHJcbiAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gIHN1YnRyZWU6IGZhbHNlLFxyXG59O1xyXG5cclxuZnVuY3Rpb24gdGFnTm9kZShub2RlOiBOb2RlKSB7XHJcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGNvbnN0IG5vZGVFbCA9IG5vZGUgYXMgSFRNTEVsZW1lbnQ7XHJcblxyXG4gIGlmIChcclxuICAgICFub2RlRWwuZGF0YXNldC50YWdOYW1lICYmXHJcbiAgICBub2RlRWwuaGFzQ2hpbGROb2RlcygpICYmXHJcbiAgICBub2RlRWwuZmlyc3RDaGlsZC5ub2RlVHlwZSAhPT0gM1xyXG4gICkge1xyXG4gICAgY29uc3QgY2hpbGRFbCA9IG5vZGUuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxuICAgIG5vZGVFbC5kYXRhc2V0LnRhZ05hbWUgPSBjaGlsZEVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGlmb3JuaWFDb2FzdFRoZW1lIGV4dGVuZHMgUGx1Z2luIHtcclxuICBzZXR0aW5nczogVGhlbWVTZXR0aW5ncztcclxuICBtZWRpYTogTWVkaWFRdWVyeUxpc3QgfCBudWxsID0gbnVsbDtcclxuICBvYnNlcnZlcnM6IHsgW2lkOiBzdHJpbmddOiBNdXRhdGlvbk9ic2VydmVyIH0gPSB7fTtcclxuICBlbWJlZGRlZEhlYWRpbmdzOiBFbWJlZGRlZEhlYWRpbmdzRXh0ZW5zaW9uO1xyXG5cclxuICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICB0aGlzLmVtYmVkZGVkSGVhZGluZ3MgPSBuZXcgRW1iZWRkZWRIZWFkaW5nc0V4dGVuc2lvbigpO1xyXG5cclxuICAgIHRoaXMuc2V0dGluZ3MgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSB8fCBuZXcgVGhlbWVTZXR0aW5ncygpO1xyXG5cclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgVGhlbWVTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcbiAgICB0aGlzLmFkZFN0eWxlKCk7XHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuXHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy51c2VTeXN0ZW1UaGVtZSkge1xyXG4gICAgICB0aGlzLmVuYWJsZVN5c3RlbVRoZW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICAhKHRoaXMuYXBwIGFzIGFueSkucGx1Z2lucy5wbHVnaW5zW1wib2JzaWRpYW4tY29udGV4dHVhbC10eXBvZ3JhcGh5XCJdICYmXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MucHJldHR5UHJldmlld1xyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMuZW5hYmxlQ29udGV4dHVhbFR5cG9ncmFwaHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5lbWJlZGRlZEhlYWRpbmdzKSB7XHJcbiAgICAgIHRoaXMuZW5hYmxlRW1iZWRkZWRIZWFkaW5ncygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb251bmxvYWQoKSB7XHJcbiAgICB0aGlzLmRpc2FibGVDb250ZXh0dWFsVHlwb2dyYXBoeSgpO1xyXG4gICAgdGhpcy5kaXNhYmxlRW1iZWRkZWRIZWFkaW5ncygpO1xyXG4gIH1cclxuXHJcbiAgbWVkaWFDYWxsYmFjayA9IChlOiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5tYXRjaGVzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRGFya1N0eWxlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVwZGF0ZUxpZ2h0U3R5bGUoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBsaXN0ZW5Gb3JTeXN0ZW1UaGVtZSA9ICgpID0+IHtcclxuICAgIHRoaXMubWVkaWEgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylcIik7XHJcbiAgICB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5tZWRpYUNhbGxiYWNrKTtcclxuICAgIHRoaXMucmVnaXN0ZXIoKCkgPT5cclxuICAgICAgdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMubWVkaWFDYWxsYmFjaylcclxuICAgICk7XHJcblxyXG4gICAgaWYgKHRoaXMubWVkaWEubWF0Y2hlcykge1xyXG4gICAgICB0aGlzLnVwZGF0ZURhcmtTdHlsZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cGRhdGVMaWdodFN0eWxlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgc3RvcExpc3RlbmluZ0ZvclN5c3RlbVRoZW1lID0gKCkgPT4ge1xyXG4gICAgdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMubWVkaWFDYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLy8gcmVmcmVzaCBmdW5jdGlvbiBmb3Igd2hlbiB3ZSBjaGFuZ2Ugc2V0dGluZ3NcclxuICByZWZyZXNoKCkge1xyXG4gICAgLy8gcmUtbG9hZCB0aGUgc3R5bGVcclxuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcclxuICB9XHJcblxyXG4gIC8vIGFkZCB0aGUgc3R5bGluZyBlbGVtZW50cyB3ZSBuZWVkXHJcbiAgYWRkU3R5bGUoKSB7XHJcbiAgICAvLyBhZGQgYSBjc3MgYmxvY2sgZm9yIG91ciBzZXR0aW5ncy1kZXBlbmRlbnQgc3R5bGVzXHJcbiAgICBjb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcbiAgICBjc3MuaWQgPSBcImNhbGlmb3JuaWEtY29hc3QtdGhlbWVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChjc3MpO1xyXG5cclxuICAgIC8vIGFkZCB0aGUgbWFpbiBjbGFzc1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwiY2FsaWZvcm5pYS1jb2FzdC10aGVtZVwiKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgdGhlIHN0eWxlIHdpdGggdGhlIHNldHRpbmdzLWRlcGVuZGVudCBzdHlsZXNcclxuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVN0eWxlKCkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDbGFzcyhcImNjLXByZXR0eS1lZGl0b3JcIiwgXCJjYy1wcmV0dHktcHJldmlld1wiLCBcImZhbmN5LWN1cnNvclwiKTtcclxuICB9XHJcblxyXG4gIC8vIHVwZGF0ZSB0aGUgc3R5bGVzIChhdCB0aGUgc3RhcnQsIG9yIGFzIHRoZSByZXN1bHQgb2YgYSBzZXR0aW5ncyBjaGFuZ2UpXHJcbiAgdXBkYXRlU3R5bGUoKSB7XHJcbiAgICB0aGlzLnJlbW92ZVN0eWxlKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXHJcbiAgICAgIFwiY2MtcHJldHR5LWVkaXRvclwiLFxyXG4gICAgICB0aGlzLnNldHRpbmdzLnByZXR0eUVkaXRvclxyXG4gICAgKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcclxuICAgICAgXCJjYy1wcmV0dHktcHJldmlld1wiLFxyXG4gICAgICB0aGlzLnNldHRpbmdzLnByZXR0eVByZXZpZXdcclxuICAgICk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJmYW5jeS1jdXJzb3JcIiwgdGhpcy5zZXR0aW5ncy5mYW5jeUN1cnNvcik7XHJcblxyXG4gICAgLy8gZ2V0IHRoZSBjdXN0b20gY3NzIGVsZW1lbnRcclxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYWxpZm9ybmlhLWNvYXN0LXRoZW1lXCIpO1xyXG4gICAgaWYgKCFlbCkgdGhyb3cgXCJjYWxpZm9ybmlhLWNvYXN0LXRoZW1lIGVsZW1lbnQgbm90IGZvdW5kIVwiO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgIC8vIHNldCB0aGUgc2V0dGluZ3MtZGVwZW5kZW50IGNzc1xyXG4gICAgICBlbC5pbm5lclRleHQgPSBgXHJcbiAgICAgICAgYm9keS5jYWxpZm9ybmlhLWNvYXN0LXRoZW1lIHtcclxuICAgICAgICAgIC0tZWRpdG9yLWZvbnQtc2l6ZToke3RoaXMuc2V0dGluZ3MudGV4dE5vcm1hbH1weDtcclxuICAgICAgICAgIC0tZWRpdG9yLWZvbnQtZmVhdHVyZXM6ICR7dGhpcy5zZXR0aW5ncy5mb250RmVhdHVyZXN9O1xyXG4gICAgICAgICAgLS1lZGl0b3ItbGluZS1oZWlnaHQ6ICR7dGhpcy5zZXR0aW5ncy5lZGl0b3JMaW5lSGVpZ2h0fTtcclxuICAgICAgICAgIC0tZWRpdG9yLWxpbmUtaGVpZ2h0LXJlbTogJHt0aGlzLnNldHRpbmdzLmVkaXRvckxpbmVIZWlnaHR9cmVtO1xyXG4gICAgICAgICAgLS1saW5lLXdpZHRoOiR7dGhpcy5zZXR0aW5ncy5saW5lV2lkdGh9cmVtO1xyXG4gICAgICAgICAgLS1mb250LW1vbm9zcGFjZToke3RoaXMuc2V0dGluZ3MubW9ub0ZvbnR9O1xyXG4gICAgICAgICAgLS10ZXh0OiR7dGhpcy5zZXR0aW5ncy50ZXh0Rm9udH07XHJcbiAgICAgICAgICAtLXRleHQtZWRpdG9yOiR7dGhpcy5zZXR0aW5ncy5lZGl0b3JGb250fTtcclxuICAgICAgICAgIC0tYWNjZW50LWg6JHt0aGlzLnNldHRpbmdzLmFjY2VudEh1ZX07XHJcbiAgICAgICAgICAtLWFjY2VudC1zOiR7dGhpcy5zZXR0aW5ncy5hY2NlbnRTYXR9JTtcclxuICAgICAgICB9XHJcbiAgICAgIGBcclxuICAgICAgICAudHJpbSgpXHJcbiAgICAgICAgLnJlcGxhY2UoL1tcXHJcXG5cXHNdKy9nLCBcIiBcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbmFibGVTeXN0ZW1UaGVtZSgpIHtcclxuICAgICh0aGlzLmFwcC53b3Jrc3BhY2UgYXMgYW55KS5sYXlvdXRSZWFkeVxyXG4gICAgICA/IHRoaXMubGlzdGVuRm9yU3lzdGVtVGhlbWUoKVxyXG4gICAgICA6IHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImxheW91dC1yZWFkeVwiLCB0aGlzLmxpc3RlbkZvclN5c3RlbVRoZW1lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURhcmtTdHlsZSgpIHtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2xhc3MoXCJ0aGVtZS1saWdodFwiKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkQ2xhc3MoXCJ0aGVtZS1kYXJrXCIpO1xyXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLnRyaWdnZXIoXCJjc3MtY2hhbmdlXCIpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlTGlnaHRTdHlsZSgpIHtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2xhc3MoXCJ0aGVtZS1kYXJrXCIpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRDbGFzcyhcInRoZW1lLWxpZ2h0XCIpO1xyXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLnRyaWdnZXIoXCJjc3MtY2hhbmdlXCIpO1xyXG4gIH1cclxuXHJcbiAgZGlzY29ubmVjdE9ic2VydmVyKGlkOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLm9ic2VydmVyc1tpZF0pIHtcclxuICAgICAgdGhpcy5vYnNlcnZlcnNbaWRdLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzW2lkXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbm5lY3RPYnNlcnZlcihpZDogc3RyaW5nLCBsZWFmOiBXb3Jrc3BhY2VMZWFmKSB7XHJcbiAgICBpZiAodGhpcy5vYnNlcnZlcnNbaWRdKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgcHJldmlld1NlY3Rpb24gPSBsZWFmLnZpZXcuY29udGFpbmVyRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcclxuICAgICAgXCJtYXJrZG93bi1wcmV2aWV3LXNlY3Rpb25cIlxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAocHJldmlld1NlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2lkXSA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcclxuICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcclxuICAgICAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaCh0YWdOb2RlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm9ic2VydmVyc1tpZF0ub2JzZXJ2ZShwcmV2aWV3U2VjdGlvblswXSwgY29uZmlnKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHByZXZpZXdTZWN0aW9uWzBdLmNoaWxkTm9kZXMuZm9yRWFjaCh0YWdOb2RlKTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbmFibGVDb250ZXh0dWFsVHlwb2dyYXBoeSA9ICgpID0+IHtcclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MucHJldHR5UHJldmlldykge1xyXG4gICAgICAgICAgY29uc3Qgc2VlbjogeyBbazogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XHJcblxyXG4gICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVSb290TGVhdmVzKChsZWFmKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gKGxlYWYgYXMgYW55KS5pZCBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdE9ic2VydmVyKGlkLCBsZWFmKTtcclxuICAgICAgICAgICAgc2VlbltpZF0gPSB0cnVlO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgT2JqZWN0LmtleXModGhpcy5vYnNlcnZlcnMpLmZvckVhY2goKGspID0+IHtcclxuICAgICAgICAgICAgaWYgKCFzZWVuW2tdKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0T2JzZXJ2ZXIoayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgZGlzYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5ID0gKCkgPT4ge1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5vYnNlcnZlcnMpLmZvckVhY2goKGspID0+IHRoaXMuZGlzY29ubmVjdE9ic2VydmVyKGspKTtcclxuICB9O1xyXG5cclxuICBlbmFibGVFbWJlZGRlZEhlYWRpbmdzID0gKCkgPT4ge1xyXG4gICAgdGhpcy5lbWJlZGRlZEhlYWRpbmdzLm9ubG9hZCgpO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZW1iZWRkZWRIZWFkaW5ncykge1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1iZWRkZWRIZWFkaW5ncy5jcmVhdGVIZWFkaW5ncyh0aGlzLmFwcCk7XHJcbiAgICAgICAgICB9LCAwKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgZGlzYWJsZUVtYmVkZGVkSGVhZGluZ3MgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmVtYmVkZGVkSGVhZGluZ3Mub251bmxvYWQoKTtcclxuICB9O1xyXG59XHJcblxyXG5jbGFzcyBUaGVtZVNldHRpbmdzIHtcclxuICBwcmV0dHlFZGl0b3I6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIHByZXR0eVByZXZpZXc6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIGVtYmVkZGVkSGVhZGluZ3M6IGJvb2xlYW4gPSBmYWxzZTtcclxuICB1c2VTeXN0ZW1UaGVtZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGZhbmN5Q3Vyc29yOiBib29sZWFuID0gZmFsc2U7XHJcbiAgYWNjZW50SHVlOiBudW1iZXIgPSAyMTE7XHJcbiAgYWNjZW50U2F0OiBudW1iZXIgPSAxMDA7XHJcblxyXG4gIGxpbmVXaWR0aDogbnVtYmVyID0gNDI7XHJcbiAgdGV4dE5vcm1hbDogbnVtYmVyID0gMTg7XHJcblxyXG4gIGZvbnRGZWF0dXJlczogc3RyaW5nID0gJ1wiXCInO1xyXG5cclxuICB0ZXh0Rm9udDogc3RyaW5nID1cclxuICAgICctYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxcIlNlZ29lIFVJIEVtb2ppXCIsXCJTZWdvZSBVSVwiLFJvYm90byxPeHlnZW4tU2FucyxVYnVudHUsQ2FudGFyZWxsLHNhbnMtc2VyaWYnO1xyXG5cclxuICBlZGl0b3JGb250OiBzdHJpbmcgPVxyXG4gICAgJy1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFwiU2Vnb2UgVUkgRW1vamlcIixcIlNlZ29lIFVJXCIsUm9ib3RvLE94eWdlbi1TYW5zLFVidW50dSxDYW50YXJlbGwsc2Fucy1zZXJpZic7XHJcbiAgZWRpdG9yTGluZUhlaWdodDogbnVtYmVyID0gMS44ODg4OTtcclxuXHJcbiAgbW9ub0ZvbnQ6IHN0cmluZyA9IFwiTWVubG8sU0ZNb25vLVJlZ3VsYXIsQ29uc29sYXMsUm9ib3RvIE1vbm8sbW9ub3NwYWNlXCI7XHJcbn1cclxuXHJcbmNsYXNzIFRoZW1lU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG4gIHBsdWdpbjogQ2FsaWZvcm5pYUNvYXN0VGhlbWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IENhbGlmb3JuaWFDb2FzdFRoZW1lKSB7XHJcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XHJcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICB9XHJcblxyXG4gIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuXHJcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiQ2FsaWZvcm5pYSBDb2FzdCBUaGVtZVwiIH0pO1xyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJhXCIsIHsgdGV4dDogXCLirKQgQWNjZW50IGNvbG9yXCIgfSk7XHJcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIpO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkFjY2VudCBjb2xvciBodWVcIilcclxuICAgICAgLnNldERlc2MoXCJGb3IgbGlua3MgYW5kIGludGVyYWN0aXZlIGVsZW1lbnRzXCIpXHJcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT5cclxuICAgICAgICBzbGlkZXJcclxuICAgICAgICAgIC5zZXRMaW1pdHMoMCwgMzYwLCAxKVxyXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmFjY2VudEh1ZSlcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYWNjZW50SHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJBY2NlbnQgY29sb3Igc2F0dXJhdGlvblwiKVxyXG4gICAgICAuc2V0RGVzYyhcIkZvciBsaW5rcyBhbmQgaW50ZXJhY3RpdmUgZWxlbWVudHNcIilcclxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PlxyXG4gICAgICAgIHNsaWRlclxyXG4gICAgICAgICAgLnNldExpbWl0cygwLCAxMDAsIDEpXHJcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYWNjZW50U2F0KVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hY2NlbnRTYXQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkFjY2VudGVkIGN1cnNvclwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlRoZSBlZGl0b3IgY3Vyc29yIHRha2VzIG9uIHlvdXIgYWNjZW50IGNvbG9yXCIpXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZmFuY3lDdXJzb3IpLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZmFuY3lDdXJzb3IgPSB2YWx1ZTtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkVuaGFuY2VkIEVkaXRvciBUeXBvZ3JhcGh5XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiRW5oYW5jZXMgdGhlIHR5cG9ncmFwaHkgc3R5bGVzIGluIGVkaXRvciBtb2RlXCIpXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJldHR5RWRpdG9yKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnByZXR0eUVkaXRvciA9IHZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRW5oYW5jZWQgUHJldmlldyBUeXBvZ3JhcGh5XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiRW5oYW5jZXMgdGhlIHR5cG9ncmFwaHkgc3R5bGVzIGluIHByZXZpZXcgbW9kZVwiKVxyXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XHJcbiAgICAgICAgdG9nZ2xlXHJcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJldHR5UHJldmlldylcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucHJldHR5UHJldmlldyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLmVuYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGlzYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRGlzcGxheSBub3RlIGZpbGUgbmFtZXMgYXMgaGVhZGluZ3NcIilcclxuICAgICAgLnNldERlc2MoXCJFbWJlZHMgbm90ZSB0aXRsZXMgYXMgdG9wIGxldmVsIEgxIHRhZ3NcIilcclxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxyXG4gICAgICAgIHRvZ2dsZVxyXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVtYmVkZGVkSGVhZGluZ3MpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVtYmVkZGVkSGVhZGluZ3MgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5lbmFibGVFbWJlZGRlZEhlYWRpbmdzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGlzYWJsZUVtYmVkZGVkSGVhZGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJVc2Ugc3lzdGVtLWxldmVsIHNldHRpbmcgZm9yIGxpZ2h0IG9yIGRhcmsgbW9kZVwiKVxyXG4gICAgICAuc2V0RGVzYyhcIkF1dG9tYXRpY2FsbHkgc3dpdGNoIGJhc2VkIG9uIHlvdXIgb3BlcmF0aW5nIHN5c3RlbSBzZXR0aW5nc1wiKVxyXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XHJcbiAgICAgICAgdG9nZ2xlXHJcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlU3lzdGVtVGhlbWUpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZVN5c3RlbVRoZW1lID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLmxpc3RlbkZvclN5c3RlbVRoZW1lKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc3RvcExpc3RlbmluZ0ZvclN5c3RlbVRoZW1lKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiTGluZSB3aWR0aFwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlRoZSBtYXhpbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHBlciBsaW5lIChkZWZhdWx0IDQwKVwiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCI0MlwiKVxyXG4gICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5saW5lV2lkdGggfHwgXCJcIikgKyBcIlwiKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5saW5lV2lkdGggPSBwYXJzZUludCh2YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiQm9keSBmb250IHNpemVcIilcclxuICAgICAgLnNldERlc2MoXCJVc2VkIGZvciB0aGUgbWFpbiB0ZXh0IChkZWZhdWx0IDE4KVwiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCIxOFwiKVxyXG4gICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZXh0Tm9ybWFsIHx8IFwiXCIpICsgXCJcIilcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGV4dE5vcm1hbCA9IHBhcnNlSW50KHZhbHVlLnRyaW0oKSk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJCb2R5IGxpbmUgaGVpZ2h0XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiVXNlZCBmb3IgdGhlIG1haW4gdGV4dCAoZGVmYXVsdCAxLjg4ODg5KVwiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCIxLjg4ODg5XCIpXHJcbiAgICAgICAgICAuc2V0VmFsdWUoKHRoaXMucGx1Z2luLnNldHRpbmdzLmVkaXRvckxpbmVIZWlnaHQgfHwgXCJcIikgKyBcIlwiKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lZGl0b3JMaW5lSGVpZ2h0ID0gcGFyc2VGbG9hdCh2YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJiclwiKTtcclxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkN1c3RvbSBmb250c1wiIH0pO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIlVJIGZvbnRcIilcclxuICAgICAgLnNldERlc2MoXCJVc2VkIGZvciB0aGUgdXNlciBpbnRlcmZhY2VcIilcclxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgdGV4dFxyXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiXCIpXHJcbiAgICAgICAgICAuc2V0VmFsdWUoKHRoaXMucGx1Z2luLnNldHRpbmdzLnRleHRGb250IHx8IFwiXCIpICsgXCJcIilcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGV4dEZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkVkaXRvciBmb250XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiVXNlZCBmb3IgdGhlIGVkaXRvciBhbmQgcHJldmlld1wiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZSgodGhpcy5wbHVnaW4uc2V0dGluZ3MuZWRpdG9yRm9udCB8fCBcIlwiKSArIFwiXCIpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVkaXRvckZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkVkaXRvciBmb250IGZlYXR1cmVzXCIpXHJcbiAgICAgIC5zZXREZXNjKCdlZy4gXCJzczAxXCIsIFwiY3YwNVwiLCBcImN2MDdcIiwgXCJjYXNlXCInKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ1wiXCInKVxyXG4gICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb250RmVhdHVyZXMgfHwgXCJcIikgKyBcIlwiKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb250RmVhdHVyZXMgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJNb25vc3BhY2UgZm9udFwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlVzZWQgZm9yIGNvZGUgYmxvY2tzLCBmcm9udCBtYXR0ZXIsIGV0Y1wiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZSgodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9ub0ZvbnQgfHwgXCJcIikgKyBcIlwiKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb25vRm9udCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJtYXRyaXgiLCJNYXRyaXgiLCJwYXRoUGFyc2UiLCJ0cmFuc2Zvcm1QYXJzZSIsInJlcXVpcmUkJDAiLCJzdmdwYXRoIiwiYWRkSWNvbiIsIlBsdWdpbiIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7QUFDekMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BGLFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFHLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUNGO0FBQ08sU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0MsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUF1Q0Q7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMs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LEtBQUssR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDNUI7QUFDQSxFQUFFLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDMUI7QUFDQSxFQUFFLElBQUksS0FBSyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMxQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2hCLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3BDLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLEtBQUssR0FBRyxFQUFFO0FBQ3JCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM5QyxHQUFHLE1BQU07QUFDVDtBQUNBLElBQUksT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNoRCxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDL0IsUUFBUSxNQUFNO0FBQ2QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FB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LE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxZQUFZO0FBQ3ZDLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2xCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDdEMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0I7QUFDQSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQy9CLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENB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LENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN4RixDQUFDO0FBQ0Q7QUFDQSxPQUFjLEdBQUcsU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7QUFDbkUsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDMUMsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQ7QUFDQSxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO0FBQzlCO0FBQ0EsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDNUI7QUFDQSxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwQixFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDakUsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDbEIsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVFO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsRUFBRSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNFLEVBQUUsV0FBVyxJQUFJLFFBQVEsQ0FBQztBQUMxQjtBQUNBLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNy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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsR0FBRyxDQUFDO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMs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TyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQy9EO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBR0UsVUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xDO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUM3QjtBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsT0FBTyxNQUFNLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBQ0Q7QUFDQSxPQUFPLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2RDtBQUNBLEVBQUUsSUFBSSxHQUFHLFlBQVksT0FBTyxFQUFFO0FBQzlCO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QjtBQUNBO0FBQ0EsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDcEIsSUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUUsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQzdDLE1BQU0sT0FBTyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDMUMsS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBLElBQUksT0FBTyxDQUFDLENBQUM7QUFDYixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDN0QsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQzFDLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNyQjtBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUU7QUFDbEM7QUFDQSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekMsSUFBSSxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQztBQUNwQztBQUNBLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hCO0FBQ0E7QUFDQSxNQUFNLEtBQUssR0FBRztBQUNkLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2QyxRQUFRLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BFLFFBQVEsTUFBTTtBQUNkO0FBQ0EsTUFBTSxLQUFLLEdBQUc7QUFDZCxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEMsUUFBUSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN6RixRQUFRLE1BQU07QUFDZDtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEUsUUFBUSxNQUFNO0FBQ2Q7QUFDQSxNQUFNLEtBQUssR0FBRztBQUNkLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4QyxRQUFRLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3pGLFFBQVEsTUFBTTtBQUNkO0FBQ0EsTUFBTSxLQUFLLEdBQUcsQ0FBQztBQUNmLE1BQU0sS0FBSyxHQUFHO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsUUFBUSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQy9DLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2xDLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUM3QztBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDckQsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3hELFVBQVUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUM1RCxVQUFVLE1BQU07QUFDaEIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO0FBQzlCO0FBQ0EsVUFBVSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzVELFNBQVMsTUFBTTtBQUNmO0FBQ0E7QUFDQSxVQUFVLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN0RSxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE1BQU07QUFDZDtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2Q7QUFDQTtBQUNBLFFBQVEsVUFBVSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDL0I7QUFDQSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDM0MsUUFBUSxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFB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
