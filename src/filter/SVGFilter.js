/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/

import ol_ext_inherits from '../util/ext'
import ol_filter_Base from './Base'
import ol_ext_SVGFilter from '../util/SVGFilter'

/** Add a canvas Context2D SVG filter to a layer
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
 * @constructor
 * @requires ol.filter
 * @extends {ol_filter_Base}
 * @param {ol_ext_SVGFilter|Array<ol_ext_SVGFilter>} filters
 */
var ol_filter_SVGFilter = function(filters) {
  ol_filter_Base.call(this);
  this._svg = {};
  if (!(filters instanceof Array)) filters = [filters];
  filters.forEach(function(f) {
    this.addSVGFilter(f);
  }.bind(this));
};
ol_ext_inherits(ol_filter_SVGFilter, ol_filter_Base);

/** Add a new svg filter
 * @param {ol.ext.SVGFilter} filter
 */
ol_filter_SVGFilter.prototype.addSVGFilter = function(filter) {
  var url = '#'+filter.getId();
  this._svg[url] = 1;
  this.dispatchEvent({ type: 'propertychange', key: 'svg', oldValue: this._svg });
};

/** Remove a svg filter
 * @param {ol.ext.SVGFilter} filter
 */
ol_filter_SVGFilter.prototype.removeSVGFilter = function(filter) {
  var url = '#'+filter.getId();
  delete this._svg[url]
  this.dispatchEvent({ type: 'propertychange', key: 'svg', oldValue: this._svg });
};

/**
 * @private
 */
ol_filter_SVGFilter.prototype.precompose = function() {
};

/**
 * @private
 */
ol_filter_SVGFilter.prototype.postcompose = function(e) {
  var filter = []
  // Set filters
  for (var f in this._svg) {
    filter.push('url('+f+')'); 
  }
  filter = filter.join(' ');
  var canvas = document.createElement('canvas');
  canvas.width = e.context.canvas.width;
  canvas.height = e.context.canvas.height;
  canvas.getContext('2d').drawImage(e.context.canvas,0,0);
  // Apply filter
  if (filter) {
    e.context.save();
    e.context.clearRect(0,0,canvas.width, canvas.height);
    e.context.filter = filter;
    e.context.drawImage(canvas, 0,0);
    e.context.restore();
  }
};

export default ol_filter_SVGFilter
