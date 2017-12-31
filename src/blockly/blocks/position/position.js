const Blockly = require('node-blockly/browser');

const codes = {
  move: Handlebars.compile(require('./move.block')),
  rotate: Handlebars.compile(require('./rotate.block')),
  set: Handlebars.compile(require('./set.block'))
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
    dir: Blockly.JavaScript.valueToCode(block,'DIRECTION',Blockly.JavaScript.ORDER_NONE) || '"F"',
    steps: Blockly.JavaScript.valueToCode(block,'STEPS',Blockly.JavaScript.ORDER_NONE) || '0',
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
    dir: Blockly.JavaScript.valueToCode(block,'DIRECTION',Blockly.JavaScript.ORDER_NONE) || '"F"',
    degrees: Blockly.JavaScript.valueToCode(block,'DEGREES',Blockly.JavaScript.ORDER_NONE) || '0',
    rotRelative: true
  };
  return codes.rotate(ctx);
};

Blockly.Blocks['position_direction'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([["Forwards","F"], ["Backwards","B"], ["Left","L"], ["Right","R"], ["Up","U"], ["Down","D"], ["X","X"], ["Y","Y"], ["Z","Z"]]), "DIR");
    this.setOutput(true, "Direction");
    this.setColour(240);
    this.setTooltip("x, y and z are global, the rest are relative to rotation.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['position_direction'] = function(block) {
  var dropdown_direction = block.getFieldValue('DIR');
  return ['"'+dropdown_direction+'"', Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['position_getpos'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([["x (left-right)","x"], ["y (up-down)","y"], ["z (backwards-forwards)","z"]]), "DIR")
      .appendField("position");
    this.setOutput(true, null);
    this.setColour(240);
    this.setTooltip("An objects position consists of three values; x, y and z.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['position_getpos'] = function(block) {
  var dir = block.getFieldValue('DIR');
  return ['(self.el.components.position.data.'+dir+'*1000)', Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['position_getrot'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([["x (up-down)","x"], ["y (left-right)","y"], ["z (backwards-forwards)","z"]]), "DIR")
      .appendField("rotation");
    this.setOutput(true, null);
    this.setColour(240);
    this.setTooltip("An objects rotation consists of three values; x, y and z. (in degrees)");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['position_getrot'] = function(block) {
  var dir = block.getFieldValue('DIR');
  return ['(self.el.components.rotation.data.'+dir+')', Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['position_setpos'] = {
  init: function() {
    this.appendValueInput("VAL")
      .setCheck("Number")
      .appendField("Set")
      .appendField(new Blockly.FieldDropdown([["x (left-right)","x"], ["y (up-down)","y"], ["z (backwards-forwards)","z"]]), "DIR")
      .appendField("position to");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
    this.setTooltip("An objects position consists of three values; x, y and z.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['position_setpos'] = function(block) {
  var ctx = {
    dir: block.getFieldValue('DIR'),
    val: Blockly.JavaScript.valueToCode(block,'VAL',Blockly.JavaScript.ORDER_NONE) || '0',
    type: 'position'
  };
  return codes.set(ctx);
};

Blockly.Blocks['position_setrot'] = {
  init: function() {
    this.appendValueInput("VAL")
      .setCheck("Number")
      .appendField("Set")
      .appendField(new Blockly.FieldDropdown([["x (up-down)","x"], ["y (left-right)","y"], ["z (backwards-forwards)","z"]]), "DIR")
      .appendField("rotation to");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
    this.setTooltip("An objects position consists of three values; x, y and z.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['position_setrot'] = function(block) {
  var ctx = {
    dir: block.getFieldValue('DIR'),
    val: Blockly.JavaScript.valueToCode(block,'VAL',Blockly.JavaScript.ORDER_NONE) || '0',
    type: 'rotation'
  };
  return codes.set(ctx);
};