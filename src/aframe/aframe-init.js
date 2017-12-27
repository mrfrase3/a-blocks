require('aframe');
require('aframe-extras');

var onresize = function(e) {
  var $cont = $('#left-view-top');
  var $canvas = $('#left-view-top canvas');
  $canvas.width($cont.innerWidth());
  $canvas.height($cont.innerHeight());
  document.querySelector('a-scene').resize()
};
window.addEventListener('resize', onresize, false);
window.splitEvents.onDrag.push(onresize);
$(document).ready(onresize);