const variables = {};

AFRAME.registerComponent('code-exec',{
  schema: {
    type: 'string'
  },

  init: function(){
    this.events = {};
    this.vars = variables;
    if(this.data) this.eval(this.data);
  },

  update: function(){
    if(this.data) this.eval(this.data);
  },

  eval: function(codes){
    this.codes = JSON.parse(codes);
    this.events = {};
    for(event in this.codes){
      if(!this.events[event]) this.events[event] = [];
      for(let i in this.codes[event]) {
        eval('this.events[event].push(function(){' + this.codes[event][i] + '});');
      }
    }
  },

  trigger: function(event, args, context){
    for(let i in this.events[event]) this.events[event][i].apply(context || this, args);
  },

  tick(time, delta){
    this.trigger('aframeevent_tick', [time, delta]);
  }
});