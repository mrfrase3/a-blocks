const Blockly = require('node-blockly/browser');

const codes = {
  interval: Handlebars.compile(require('./interval.block'))
};

Blockly.BlockSvg.START_HAT = true;

Blockly.Blocks['aframeevent_tick'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Run forever");
    this.setNextStatement(true, null);
    this.setColour(40);
    this.setTooltip("Happens every time we draw a frame of the animation.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['aframeevent_tick'] = function(block) {
  return 'var time = arguments[0];var delta = arguments[1];';
};

Blockly.Blocks['aframeevent_interval'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Run every")
      .appendField(new Blockly.FieldNumber(2, 0), "SEC")
      .appendField("seconds");
    this.setNextStatement(true, null);
    this.setColour(40);
    this.setTooltip("Only runs your code between the set interval");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['aframeevent_interval'] = function(block) {
  var ctx = {
    sec: block.getFieldValue('SEC'),
    id: block.id
  };
  return codes.interval(ctx);
};