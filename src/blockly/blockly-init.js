
const Blockly = require('node-blockly/browser');

$(document).ready(function () {

  var blocklyArea = document.getElementById('right-view');
  var blocklyDiv = document.getElementById('blocklyDiv');

  var onresize = function(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
  };
  window.addEventListener('resize', onresize, false);
  window.splitEvents.onDrag.push(onresize);

  var workspacePlayground = Blockly.inject(blocklyDiv,
    {toolbox: require('./toolbox.xml')});
  onresize();
  Blockly.svgResize(workspacePlayground);
});