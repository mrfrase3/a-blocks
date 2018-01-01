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
    if(!this.el.id) this.el.id = Math.random().toString(16).substr(2);
    this.id = this.el.id;
    this.$el = $(template({id: this.id, name: this.data.name, type: this.data.type}));
    this.$sceneTab = $('#scene-tab-'+this.data.type).prepend(this.$el);
    this.$sceneTab = $('#scene-col-'+this.data.type).prepend(
      '<a href="#" class="collection-item" data-type="env" id="scene-panel-col-'+this.id+'"><i class="fa fa-cube"></i> '+this.data.name+'</a>'
    );
    previews[this.id] = new ObjPreview($('#scene-panel-card-'+this.id+' .obj-preview').get(0), this.el);

    $('#scene-panel-card-'+this.id+' .card-image, #scene-panel-col-'+this.id).click(function(e){
      e.preventDefault();
      $('.scene-tabs a[href="#scene-tab-'+self.data.type+'"]').click();
      if(e.target.className === 'card-title') return;
      if(self.$el.hasClass('active')){
        self.$el.removeClass('active');
        self.el.components.blockly.hide();
      } else {
        self.$sceneTab.parent().find('div.active').removeClass('active');
        self.$el.addClass('active');
        self.el.components.blockly.show();
      }
    });
    $('#scene-panel-card-'+this.id+' i').tooltip();

    $('#scene-panel-card-'+this.id+' .card-title').keyup(function(e){
      //e.preventDefault();
      self.el.setAttribute('scene-panel', {name: $(this).text(), type: self.data.type});
      if(self.el.components.blockly) self.el.components.blockly.updateName();
    });

    this.lastVis = true;
    this.lastGrav = false;

    this.$toggleVis = $('#scene-panel-card-'+this.id+' .toggle-vis');
    this.$toggleVis.click(function(){
      self.el.setAttribute('visible', !self.el.components.visible.data);
    });

    this.$toggleGrav = $('#scene-panel-card-'+this.id+' .toggle-grav');
    this.$toggleGrav.click(function(){
      let isDynam = self.el.hasAttribute('dynamic-body');
      self.el.removeAttribute(isDynam ? 'dynamic-body' : 'static-body');
      self.el.setAttribute(isDynam ? 'static-body' : 'dynamic-body', '');
    });
    $('#scene-panel-card-'+this.id+' .rename').click(()=>{$('#scene-panel-card-'+this.id+' .card-title').focus()});
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
    if(this.el.hasAttribute('dynamic-body') !== this.lastGrav){
      this.lastGrav = !this.lastGrav;
      if(this.lastGrav) this.$toggleGrav.addClass('green-text');
      else this.$toggleGrav.removeClass('green-text');
    }
  }
});

$(document).ready(function(){

  const $tabs = $('ul.scene-tabs');

  const onresize = function(e) {
    for(let i in previews) previews[i].resize();
    $tabs.trigger('resize');
    let maxHeight = 0;
    $('#left-view-bottom .card:not(.add-obj)').each(function(){
      maxHeight = Math.max(maxHeight, $(this).height());
    });
    $('#left-view-bottom .card.add-obj').height(maxHeight);
  };
  window.addEventListener('resize', onresize, false);
  window.splitEvents.onDrag.push(onresize);
  onresize();
  $tabs.tabs({
    //swipeable: true,
    onShow: onresize
  });
});