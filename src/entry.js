window.$ = window.jQuery = require('jquery');

require('materialize-css/dist/css/materialize.css');
require('materialize-css/dist/js/materialize.js');
require('materialize-css/js/initial.js');
require('font-awesome/css/font-awesome.css');
require('./main.css');

require('./split-init.js');

require('./aframe-init.js');

require('./blockly/blockly-init.js');


$(document).ready(function(){
  var $tabs = $('ul.tabs');
  $tabs.tabs();//{swipeable: true });
  var onresize = function(e) {
    $tabs.trigger('resize');
  };
  window.addEventListener('resize', onresize, false);
  window.splitEvents.onDrag.push(onresize);
});