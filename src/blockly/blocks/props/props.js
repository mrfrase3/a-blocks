const Blockly = require('node-blockly/browser');

const codes = {
  set_colour: Handlebars.compile(require('./set_colour.block'))
};

Blockly.Blocks['props_colour_set'] = {
  init: function() {
    this.appendValueInput("COLOUR")
      .setCheck("Colour")
      .appendField("set colour to");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Sets the colour of the object to the specified colour. If you have a texture, you won't see the colour.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['props_colour_set'] = function(block) {
  var ctx = {
    colour: Blockly.JavaScript.valueToCode(block, 'COLOUR', Blockly.JavaScript.ORDER_ATOMIC)
  };
  if(ctx.colour.indexOf('#') === 0) ctx.colour = '"' + ctx.colour + '"';
  return codes.set_colour(ctx);
};