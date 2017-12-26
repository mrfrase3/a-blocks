
const Blockly = require('node-blockly/browser');

const toolboxTemplate = Handlebars.compile(require('./toolbox.xml'));

require('./blocks/aframeevent/aframeevent.js');
require('./blocks/position/position.js');

AFRAME.registerComponent('blockly', {
  schema: {},

  init: function(){
    this.events = {};
    this.el.bo = this;
    this.id = this.el.components['scene-panel'].data.id;
    this.name = this.el.components['scene-panel'].data.name;
    this.$blocklyArea =$('#right-view');
    this.$blocklyDiv = $('<div id="blocklyDiv-'+this.id+'" style="position: absolute"></div>');
    this.$blocklyArea.append(this.$blocklyDiv);

    this.blocklyArea = this.$blocklyArea.get(0);
    this.blocklyDiv = this.$blocklyDiv.get(0);


    window.addEventListener('resize', ()=>this.onresize(), false);
    window.splitEvents.onDrag.push(()=>this.onresize());

    this.workspace = Blockly.inject(this.blocklyDiv, {
      toolbox: toolboxTemplate({name: this.name})
    });

    this.workspace.addChangeListener(()=>this.compile());
    Blockly.JavaScript.init(this.workspace);
    //Blockly.svgResize(this.workspace);
    this.hide();
  },

  show: function(){
    $('#right-view > div').hide();
    this.$blocklyDiv.show();
    requestAnimationFrame(()=>this.onresize());
  },

  hide: function(){
    this.$blocklyDiv.hide();
    $('#blocklyNoSelect').show();
  },

  onresize: function(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    let element = this.blocklyArea;
    let x = 0;
    let y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    this.blocklyDiv.style.left = x + 'px';
    this.blocklyDiv.style.top = y + 'px';
    this.blocklyDiv.style.width = this.blocklyArea.offsetWidth + 'px';
    this.blocklyDiv.style.height = this.blocklyArea.offsetHeight + 'px';

    Blockly.svgResize(this.workspace);
  },

  compile: function(){
    let blocks = this.workspace.getTopBlocks();
    this.events = {};
    for(let i in blocks){
      let name = blocks[i].type;
      if(name.indexOf('aframeevent') !== 0) continue;
      if(!this.events[name]) this.events[name] = [];
      eval('this.events[name].push(function(){'+Blockly.JavaScript.blockToCode(blocks[i])+'});');
    }
    if(!this.vars) this.vars = {};
  },

  trigger: function(event, args, context){
    for(let i in this.events[event]) this.events[event][i].apply(context || this, args);
  },

  tick(time, delta){
    this.trigger('aframeevent_tick', [time, delta]);
  }
});

// move blockly style to after materialize's
$(document).ready(function(){
  $('head').prepend($('#materializeCSS'));
});

Blockly.JavaScript['variables_get'] = function(block) {
  // Variable getter.
  var code = 'this.'+Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
    Blockly.Variables.VARIABLE_CATEGORY_NAME);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
    Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = 'this.'+Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.JavaScript['text_print'] = function(block) {
  // Print statement.
  var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
    Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'Materialize.toast(' + msg + ', 1000);\n';
};