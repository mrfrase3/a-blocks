import {ObjPreview} from './obj-preview.js';

const previews = {};
const template = Handlebars.compile(require('./scene-panel-card.hbs'));

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
    $('#scene-col-'+this.data.type).prepend(
      '<a href="#" class="collection-item" data-type="env" id="scene-panel-col-'+this.id+'"><i class="fa fa-cube"></i> '+this.data.name+'</a>'
    );
    previews[this.id] = new ObjPreview($('#scene-panel-card-'+this.id+' .obj-preview').get(0), this.el);

    $('#scene-panel-card-'+this.id+' .card-image, #scene-panel-col-'+this.id).click(function(e){
      e.preventDefault();
      $('.scene-tabs a[href="#scene-tab-'+self.data.type+'"]').click();
      if(e.target.className === 'card-title') return;
      if(self.$el.hasClass('active')){
        self.$el.removeClass('active');
        self.el.components['obj-config'].hide();
      } else {
        self.$sceneTab.parent().find('div.active').removeClass('active');
        self.$el.addClass('active');
        self.el.components['obj-config'].show();
      }
    });
    $('#scene-panel-card-'+this.id+' i').tooltip();

    $('#scene-panel-card-'+this.id+' .card-title').keyup(function(e){
      //e.preventDefault();
      self.el.setAttribute('scene-panel', {name: $(this).text().trim(), type: self.data.type});
      self.el.dispatchEvent(new CustomEvent('updateName', {detail: $(this).text().trim()}));
    });
    self.el.dispatchEvent(new CustomEvent('updateName', {detail: $(this).text().trim()}));

    this.$toggleVis = $('#scene-panel-card-'+this.id+' .toggle-vis');
    this.$toggleVis.click(function(){
      self.el.setAttribute('visible', !self.el.components.visible.data);
    });
    this.el.addEventListener('toggleVisible', function(e){
      self.$toggleVis.removeClass(e.detail ? 'fa-eye-slash' : 'fa-eye');
      self.$toggleVis.addClass(e.detail ? 'fa-eye' : 'fa-eye-slash');
    });

    this.$toggleGrav = $('#scene-panel-card-'+this.id+' .toggle-grav');
    this.$toggleGrav.click(function(){
      let isDynam = self.el.hasAttribute('dynamic-body');
      self.el.removeAttribute(isDynam ? 'dynamic-body' : 'static-body');
      self.el.setAttribute(isDynam ? 'static-body' : 'dynamic-body', '');
    });
    this.el.addEventListener('toggleGravity', function(e){
      if(e.detail) self.$toggleGrav.addClass('green-text');
      else self.$toggleGrav.removeClass('green-text');
    });

    $('#scene-panel-card-'+this.id+' .rename').click(()=>{$('#scene-panel-card-'+this.id+' .card-title').focus()});

  },

  remove: function(){
    previews[this.id].remove();
    delete previews[this.id];
    $('#scene-panel-card-'+this.id).parent().remove();
  },

  tick: function(time,delta){
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

  $('.add-obj').click(function(e){
    let id = Math.random().toString(16).substr(2);
    let $entity = $('<a-entity id="'+id+'" geometry="primitive: box;" scene-panel="name:New Object;" blockly static-body obj-config custom-events></a-entity>');
    $('a-scene').append($entity);
    setTimeout(function(){
      $('#scene-panel-card-'+id+' .card-image').click();
      setTimeout(function(){
        $('#settings-'+id).click();
      }, 50);
    }, 50);
  });
});