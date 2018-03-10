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

const get_all_objects = function() {
  let options = [['Left Hand', 'leftHand'],['Right Hand', 'rightHand']];
  $('a-entity[scene-panel]').each(function(){
    options.push([
      $(this).get(0).components['scene-panel'].data.name,
      $(this).attr('id')
    ]);
  });
  return options;
};

Blockly.Blocks['aframeevent_collision'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Run when I touch ")
        .appendField(new Blockly.FieldDropdown(get_all_objects), "ID");
    this.setNextStatement(true, null);
    this.setColour(40);
    this.setTooltip("Runs when this object touches another.");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['aframeevent_collision'] = function(block) {
  var dropdown_id = block.getFieldValue('ID');
  return `var event = arguments[0]; if(event.detail.body.el.id === event.detail.target.el.id || event.detail.body.el.id !== '${dropdown_id}') return;\n`;
};