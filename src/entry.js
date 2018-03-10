require('./main.css');

require('./split-init.js');
require('./aframe/aframe-init.js');
require('./obj-config/obj-config-init.js');
require('./scene-panel/scene-panel-init.js');
require('./code-exec/code-exec-init.js');
require('./blockly/blockly-init.js');
require('./helpers/custom-events.js');
require('./helpers/camera-rig.js');

require('aframe-extras').registerAll();
require('aframe-teleport-controls');

$(document).ready(function(){$('.loader').css('height', 0);});