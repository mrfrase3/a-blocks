const Blockly = require('node-blockly/browser');

Blockly.BlockSvg.START_HAT = true;

Blockly.Blocks['aframeevent_tick'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Forever");
    this.appendStatementInput("TICK")
      .setCheck(null);
    this.setColour(40);
    this.setTooltip("Happens every time we draw a frame of the animation.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['aframeevent_tick'] = function(block) {
  return 'var time = arguments[0];var delta = arguments[1];'+Blockly.JavaScript.statementToCode(block, 'TICK');
};