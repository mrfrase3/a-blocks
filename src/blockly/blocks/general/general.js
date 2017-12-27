const Blockly = require('node-blockly/browser');

//Recode some of the default blocks to work with this implementation

Blockly.JavaScript['variables_get'] = function(block) {
  // Variable getter.
  var code = 'this.vars.'+Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
    Blockly.Variables.VARIABLE_CATEGORY_NAME);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
    Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = 'this.vars.'+Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.JavaScript['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
    Blockly.JavaScript.ORDER_ADDITION) || '0';
  var varName = 'this.vars.'+Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.VARIABLE_CATEGORY_NAME);
  return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
    ' : 0) + ' + argument0 + ';\n';
};

Blockly.JavaScript['text_print'] = function(block) {
  // Print statement.
  var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
    Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'Materialize.toast(' + msg + ', 1000);\n';
};