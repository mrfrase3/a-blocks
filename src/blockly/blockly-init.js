
const Blockly = require('node-blockly/browser');

export class BlocklyObj {
  constructor(id, name) {

    this.id = id;
    this.name = name;
    this.$blocklyArea =$('#right-view');
    this.$blocklyDiv = $('<div id="blocklyDiv-'+this.id+'" style="position: absolute"></div>');
    this.$blocklyArea.append(this.$blocklyDiv);

    this.blocklyArea = this.$blocklyArea.get(0);
    this.blocklyDiv = this.$blocklyDiv.get(0);


    window.addEventListener('resize', ()=>this.onresize(), false);
    window.splitEvents.onDrag.push(()=>this.onresize());

    this.workspace = Blockly.inject(this.blocklyDiv,
      {toolbox: require('./toolbox.xml').replace('{{name}}', this.name)});
    //Blockly.svgResize(this.workspace);
    this.hide();
  }

  show(){
    $('#right-view > div').hide();
    this.$blocklyDiv.show();
    requestAnimationFrame(()=>this.onresize());
  }

  hide(){
    this.$blocklyDiv.hide();
    $('#blocklyNoSelect').show();
  }

  onresize(e) {
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
  };
}