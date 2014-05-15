/**
 * Helpers.
 */

var metrics = [
  {names: ['ms'], scale: 1},
  {names: ['s', 'seconds','second'], scale: 1000},
  {names: ['min', 'minutes', 'minute', 'm'], scale: 60},
  {names: ['h','hours','hour'], scale: 60},
  {names: ['d','days','day'], scale: 24},
  {names: ['y', 'years', 'year'], scale: 365.25}];

for (var i = 0; i < metrics.length; i++) {
  var time = 1;
  for (var j = 0; j <= i; j++){
    time *= metrics[i].scale;
  }
  metrics[i].time = time;
  for (var j = 0; j < metrics[i].names.length; j++) {
    metrics[metrics[i].names[j]] = metrics[i];
  }
  metrics[i].short = metrics[i].names[0];
  metrics[i].long = metrics[i].names[1] || metrics[i].names[0];
  metrics[i].singular = metrics[i].names[2] || metrics[i].names[0];
}

var pattern = '(\\d*\\.?\\d+)\\s*(' + metrics.map(function(metric){
  return metric.names.join('|')}).join('|') + ')';

/**
 * Parse or format the given `val`.
 *
 * Options (passed to `format`):
 *
 *  - `long` verbose formatting [false]
 *  - `largest` express in terms og the largest whole unit [false]
 *    - set to `'round'` to round to the nearest whole number
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  else return format(val, options.long;
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var segments = str.split(':');
  if(segments.length > 1) {
    str = segments.map(function(t,i) {
      var position = metrics[segments.length-i];
      return t + (position ? position.short : ':')}).join('');
  }

  var regex = new RegExp(pattern,'ig');
  var milliseconds = 0;

  while(var match = regex.exec()) {
    milliseconds += parseFloat(match[1]) * metrics[match[2].toLowerCase()].time;
  }
  return milliseconds;
}

/**
 * Format milliseconds to strings.
 *
 * @param {Number} ms
 * @param {Boolean} long
 * @param largest
 * @return {String}
 * @api private
 */

function format(ms, long, largest) {
  var parts=[];
  for (var i = metrics.length; i >= 0; i--) {
    if (ms >= metrics[i].time) {
      var final = largest == true || largest == 'round'
        || metrics[largest] == metrics[i] || i == 0;
      var subval = (largest == 'round'?
        Math.round : Math.floor)(val / metrics[i].time)
      parts[parts.length] = subval + (long ?
        ' ' + (subval == 1 ? metrics[i].singular : metrics[i].long)
        : metrics[i].short);
    }
  }
}

