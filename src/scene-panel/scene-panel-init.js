import {ObjPreview} from './obj-preview.js';

const previews = {};
const template = Handlebars.compile(require('./scene-panel-card.html'));

AFRAME.registerComponent('scene-panel', {
  schema: {
    name: {default: 'Object'},
    type: {default: 'obj'}
  },

  init: function(){
    let self = this;
    this.id = Math.random().toString(16).substr(2);
    this.$el = $(template({id: this.id, name: this.data.name}));
    this.$sceneTab = $('#scene-tab-'+this.data.type).append(this.$el);
    previews[this.id] = new ObjPreview($('#scene-panel-card-'+this.id+' .obj-preview').get(0), this.el);

    $('#scene-panel-card-'+this.id+' .card-image').click(function(){
      if(self.$el.hasClass('active')){
        self.$el.removeClass('active');
        self.el.components.blockly.hide();
      } else {
        self.$sceneTab.parent().find('div.active').removeClass('active');
        self.$el.addClass('active');
        self.el.components.blockly.show();
      }
    });

    this.lastVis = true;
    this.$toggleVis = $('#scene-panel-card-'+this.id+' .toggle-vis');
    this.$toggleVis.click(function(){
      self.el.setAttribute('visible', !self.el.components.visible.data);
    });
  },

  remove: function(){
    previews[this.id].remove();
    delete previews[this.id];
    $('#scene-panel-card-'+this.id).parent().remove();
  },

  tick: function(time,delta){
    if(this.el.components.visible.data !== this.lastVis){
      this.lastVis = this.el.components.visible.data;
      this.$toggleVis.removeClass(this.lastVis ? 'fa-eye-slash' : 'fa-eye');
      this.$toggleVis.addClass(this.lastVis ? 'fa-eye' : 'fa-eye-slash');
    }
  }
});

$(document).ready(function(){

  const $tabs = $('ul.scene-tabs');

  const onresize = function(e) {
    for(let i in previews) previews[i].resize();
    $tabs.trigger('resize');
  };
  window.addEventListener('resize', onresize, false);
  window.splitEvents.onDrag.push(onresize);
  onresize();
  $tabs.tabs({
    //swipeable: true,
    onShow: onresize
  });
});