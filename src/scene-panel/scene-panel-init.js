import {ObjPreview} from './obj-preview.js';

const previews = {};

AFRAME.registerComponent('scene-panel', {
  schema: {
    name: {default: 'Object'},
    type: {default: 'obj'}
  },

  init: function(){
    this.id = Math.random().toString(16).substr(2);
    $('#scene-tab-'+this.data.type).append(require('./scene-panel-card.html').replace('{{id}}', this.id).replace('{{name}}', this.data.name));
    previews[this.id] = new ObjPreview($('#scene-panel-card-'+this.id+' .obj-preview').get(0), this.el);
  },

  remove: function(){
    previews[this.id].remove();
    delete previews[this.id];
    $('#scene-panel-card-'+this.id).parent().remove();
  },

  tick: function(time,delta){}
});

$(document).ready(function(){

  const $tabs = $('ul.scene-tabs');
  $tabs.tabs();//{swipeable: true });
  const onresize = function(e) {
    for(let i in previews) previews[i].resize();
    $tabs.trigger('resize');
  };
  window.addEventListener('resize', onresize, false);
  window.splitEvents.onDrag.push(onresize);
  onresize();

});