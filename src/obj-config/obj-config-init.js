const configTemplate = Handlebars.compile(require('./config-menu.hbs'));
const settingsTemplate = Handlebars.compile(require('./settings-form.hbs'));
const materialTemplate = Handlebars.compile(require('./material-form.hbs'));

AFRAME.registerComponent('obj-config', {
  schema: {
  },

  init: function(){
    const self = this;
    if(!this.el.id) this.el.id = Math.random().toString(16).substr(2);
    this.id = this.el.id;
    this.name = 'Loading...';
    if(this.el.components['scene-panel']) this.name = this.el.components['scene-panel'].data.name;

    this.settingsForm = settingsTemplate(this);
    this.materialForm = materialTemplate(this);
    this.$mainArea = $('#right-view');
    this.$configDiv = $(configTemplate(this));
    this.$mainArea.append(this.$configDiv);

    this.$toggleVis = $('#settings-'+this.id+' .toggle-vis');
    this.$toggleVis.change(function(){
      self.el.setAttribute('visible', !self.el.components.visible.data);
    });
    this.el.addEventListener('toggleVisible', function(e){
      self.$toggleVis.prop('checked', !e.detail);
    });

    this.$toggleGrav = $('#settings-'+this.id+' .toggle-grav');
    this.$toggleGrav.change(function(){
      let isDynam = self.el.hasAttribute('dynamic-body');
      self.el.removeAttribute(isDynam ? 'dynamic-body' : 'static-body');
      self.el.setAttribute(isDynam ? 'static-body' : 'dynamic-body', '');
    });
    this.el.addEventListener('toggleGravity', function(e){
      self.$toggleGrav.prop('checked', e.detail);
    });

    this.el.addEventListener('updateName', function(e){
      if(self.name === e.detail) return;
      self.name = e.detail;
      self.$configDiv.find('.name').text(e.detail);
    });

    this.$configDiv.find('.shape-settings input').keyup(function(){self.setGeom()});
    this.$configDiv.find('.shape-settings input').change(function(){self.setGeom()});
    this.$configDiv.find('.shape-settings select').change(function(){self.setGeom()});
    this.$configDiv.find('.shape-settings select').material_select();
    this.$configDiv.find('.obj-tabs').tabs();

    this.shapeInputs = {
      shape: this.$configDiv.find('.selectShapeWrap input.select-dropdown'),
      realShape: this.$configDiv.find('.selectShape'),
      radius: this.$configDiv.find('.inputDiameter'),
      height: this.$configDiv.find('.inputHeight'),
      width: this.$configDiv.find('.inputWidth'),
      depth: this.$configDiv.find('.inputDepth')
    };

    this.shapeWraps = {
      all: this.$configDiv.find('.shape-settings > .row:not(.selectShapeWrap)'),
      shape: this.$configDiv.find('.selectShapeWrap'),
      radius: this.$configDiv.find('.inputDiameterWrap'),
      height: this.$configDiv.find('.inputHeightWrap'),
      width: this.$configDiv.find('.inputWidthWrap'),
      depth: this.$configDiv.find('.inputDepthWrap')
    };

    this.$configDiv.find(`a[href="#blocklyDiv-${this.id}"]`).click(function(){
      self.onresize();
    });

    this.el.addEventListener('updateName', function(e){self.updateGeom(e.detail)});
    if(this.el.components.geometry) self.updateGeom(this.el.components.geometry.data);

    window.addEventListener('resize', ()=>this.onresize(), false);
    window.splitEvents.onDrag.push(()=>this.onresize());
    this.hide();
  },

  onresize: function(){
    if(this.el.components.blockly){
      requestAnimationFrame(()=>this.el.components.blockly.onresize());
    }
    this.$configDiv.find('.obj-tabs').trigger('resize');
  },

  setGeom: function(){
    this.lastGeom = this.lastGeom || {};
    let diff = false;
    let primTrans = {Box: 'box', Can: 'cylinder', Ball: 'sphere'};
    console.log(this.shapeInputs.shape.val());
    let prim = primTrans[this.shapeInputs.shape.val()];
    let data = {primitive: prim};
    if(this.lastGeom.primitive !== prim) diff = true;
    if(['sphere', 'cylinder', 'circle', 'dodecahedron', 'octahedron', 'tetrahedron'].indexOf(prim) !== -1){
      data.radius = Number(this.shapeInputs.radius.val())/2;
      if(this.lastGeom.radius !== data.radius) diff = true;
    }
    if(['box', 'cylinder', 'plane'].indexOf(prim) !== -1){
      data.height = Number(this.shapeInputs.height.val());
      if(this.lastGeom.height !== data.height) diff = true;
    }
    if(['box', 'plane'].indexOf(prim) !== -1){
      data.width = Number(this.shapeInputs.width.val());
      if(this.lastGeom.width !== data.width) diff = true;
    }
    if(['box'].indexOf(prim) !== -1){
      data.depth = Number(this.shapeInputs.depth.val());
      if(this.lastGeom.depth !== data.depth) diff = true;
    }
    this.lastGeom = data;
    this.updateGeom(data);
    console.log(data);
    if(diff) this.el.setAttribute('geometry', data);
  },

  updateGeom: function(data){
    let prim = data.primitive;
    this.shapeInputs.realShape.val(prim);
    //this.shapeInputs.realShape.material_select('destroy');
    //this.shapeInputs.realShape.material_select();
    this.shapeWraps.all.hide();
    if(data.radius){
      this.shapeWraps.radius.show();
      this.shapeInputs.radius.val(data.radius*2);
    }
    if(data.height){
      this.shapeWraps.height.show();
      this.shapeInputs.height.val(data.height);
    }
    if(data.width){
      this.shapeWraps.width.show();
      this.shapeInputs.width.val(data.width);
    }
    if(data.depth){
      this.shapeWraps.depth.show();
      this.shapeInputs.depth.val(data.depth);
    }
  },

  show: function(){
    $('#right-view > div').hide();
    this.$configDiv.show();
    this.onresize();
  },

  hide: function(){
    this.$configDiv.hide();
    $('#blocklyNoSelect').show();
  },

  remove: function(){
    this.$configDiv.remove();
  },

  tick: function(time,delta){
  }
});