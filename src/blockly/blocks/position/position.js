const Blockly = require('node-blockly/browser');

const codes = {
  move: Handlebars.compile(require('./move.block')),
  rotate: Handlebars.compile(require('./rotate.block'))
};

Blockly.Blocks['position_move'] = {
  init: function() {
    this.appendValueInput("DIRECTION")
      .setCheck("Direction")
      .appendField("Move");
    this.appendValueInput("STEPS")
      .setCheck("Number")
      .appendField("by");
    this.appendDummyInput()
      .appendField("steps");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
    this.setTooltip("1 step is 1 mm. x, y and z are global, the rest are relative to rotation.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['position_move'] = function(block) {
  let ctx = {
    dir: Blockly.JavaScript.valueToCode(block,'DIRECTION',Blockly.JavaScript.ORDER_NONE),
    steps: Blockly.JavaScript.valueToCode(block,'STEPS',Blockly.JavaScript.ORDER_NONE),
    rotRelative: true,
    posRelative: true
  };
  return codes.move(ctx);
};

Blockly.Blocks['position_rotate'] = {
  init: function() {
    this.appendValueInput("DIRECTION")
      .setCheck("Direction")
      .appendField("Turn");
    this.appendValueInput("DEGREES")
      .setCheck("Number")
      .appendField("by");
    this.appendDummyInput()
      .appendField("degrees");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
    this.setTooltip("Up and Down turn around X, Left and Right turn around Y and Backwards and Forwards turn around Z.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['position_rotate'] = function(block) {
  let ctx = {
    dir: Blockly.JavaScript.valueToCode(block,'DIRECTION',Blockly.JavaScript.ORDER_NONE),
    degrees: Blockly.JavaScript.valueToCode(block,'DEGREES',Blockly.JavaScript.ORDER_NONE),
    rotRelative: true
  };
  return codes.rotate(ctx);
};

Blockly.Blocks['position_direction'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([["Forwards","F"], ["Backwards","B"], ["Left","L"], ["Right","R"], ["Up","U"], ["Down","D"], ["X","X"], ["Y","Y"], ["Z","Z"]]), "Direction");
    this.setOutput(true, "Direction");
    this.setColour(240);
    this.setTooltip("x, y and z are global, the rest are relative to rotation.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['position_direction'] = function(block) {
  var dropdown_direction = block.getFieldValue('Direction');
  return ['"'+dropdown_direction+'"', Blockly.JavaScript.ORDER_NONE];
};