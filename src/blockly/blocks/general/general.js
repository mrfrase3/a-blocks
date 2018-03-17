const Blockly = require('node-blockly/browser');

const codes = {
  prompt: Handlebars.compile(require('./prompt.block')),
  wait: Handlebars.compile(require('./wait.block'))
};

window.colourRandom = function(){
  return '#'+Math.random().toString(16).substr(2, 6);
};

//Recode some of the default blocks to work with this implementation

Blockly.JavaScript['variables_get'] = function(block) {
  // Variable getter.
  var code = 'self.vars.'+Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
    Blockly.Variables.VARIABLE_CATEGORY_NAME);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
    Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = 'self.vars'+Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.JavaScript['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
    Blockly.JavaScript.ORDER_ADDITION) || '0';
  var varName = 'self.vars.'+Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.VARIABLE_CATEGORY_NAME);
  return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
    ' : 0) + ' + argument0 + ';\n';
};


Blockly.JavaScript['text_print'] = function(block) {
  // Print statement.
  var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
    Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'Materialize.toast($(\'<span></span>\').text(' + msg + '), 1000);\n';
};

Blockly.Blocks['text_async_prompt'] = {
  init: function() {
    this.appendValueInput("MSG")
      .setCheck("String")
      .appendField("to")
      .appendField(new Blockly.FieldVariable("item"), "VAR")
      .appendField("ask for")
      .appendField(new Blockly.FieldDropdown([["text","text"], ["number","number"]]), "TYPE")
      .appendField("from user with the message");
    this.appendStatementInput("CALLBACK")
      .setCheck(null)
      .appendField("and then:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("This will ask the user for a text/number using the given message, and store it to the selected variable.");
    this.setHelpUrl("");
  },
  _isAsync: true
};

Blockly.JavaScript['text_async_prompt'] = function(block) {
  var ctx = {
    msg: Blockly.JavaScript.valueToCode(block, 'MSG', Blockly.JavaScript.ORDER_NONE) || '\'\'',
    type: block.getFieldValue('TYPE'),
    var: Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.VARIABLE_CATEGORY_NAME),
    id: block.id
  };
  ctx.isNum = ctx.type === 'number';
  return codes.prompt(ctx);
};

Blockly.Blocks['time_async_wait'] = {
  init: function() {
    this.appendValueInput("SEC")
      .setCheck("Number")
      .appendField("wait for");
    this.appendDummyInput()
      .appendField("seconds, then");
    this.appendStatementInput("CALLBACK")
      .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
    this.setTooltip("This will pause and wait for the number of seconds and then run the code inside.");
    this.setHelpUrl("");
  },
  _isAsync: true
};

Blockly.JavaScript['time_async_wait'] = function(block) {
  var ctx = {
    sec: Blockly.JavaScript.valueToCode(block, 'SEC', Blockly.JavaScript.ORDER_NONE) || '0',
    id: block.id
  };
  return codes.wait(ctx);
};