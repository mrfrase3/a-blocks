import {ObjPreview} from './obj-preview.js';
import {BlocklyObj} from '../blockly/blockly-init.js';

const previews = {};

AFRAME.registerComponent('scene-panel', {
  schema: {
    name: {default: 'Object'},
    type: {default: 'obj'}
  },

  init: function(){
    let self = this;
    this.id = Math.random().toString(16).substr(2);
    this.$el = $(require('./scene-panel-card.html').replace('{{id}}', this.id).replace('{{name}}', this.data.name));
    this.$sceneTab = $('#scene-tab-'+this.data.type).append(this.$el);
    previews[this.id] = new ObjPreview($('#scene-panel-card-'+this.id+' .obj-preview').get(0), this.el);

    this.bo = new BlocklyObj(this.id, this.data.name);

    $('#scene-panel-card-'+this.id+' .card-image').click(function(){
      if(self.$el.hasClass('active')){
        self.$el.removeClass('active');
        self.bo.hide();
      } else {
        self.$sceneTab.parent().find('div.active').removeClass('active');
        self.$el.addClass('active');
        self.bo.show();
      }
    });

    $('#scene-panel-card-'+this.id+' .toggle-vis').click(function(){
      if($(this).hasClass('fa-eye')){
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
        self.el.setAttribute('visible', false);
      } else {
        $(this).removeClass('fa-eye-slash');
        $(this).addClass('fa-eye');
        self.el.setAttribute('visible', true);
      }
    });
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