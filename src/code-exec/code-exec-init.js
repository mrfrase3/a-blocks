const variables = {};

AFRAME.registerComponent('code-exec',{
  schema: {
    type: 'string'
  },

  init: function(){
    this.events = {};
    this.vars = variables;
    this.callbacks = {};
    this.blockstore = {waits: {}};
    if(this.data) this.eval(this.data);
    let self = this;
    this.el.addEventListener('collide', function (e) {/*console.log(e);*/self.trigger('aframeevent_collision', [e]);});
    this.el.addEventListener('codeStart', function () {self.trigger('aframeevent_start');});
    this.el.addEventListener('codeStop', function () {self.trigger('aframeevent_stop');});
  },

  update: function(){
    if(this.data) this.eval(this.data);
    this.el.dispatchEvent(new CustomEvent('codeLoaded', { detail: this.data }));
  },

  eval: function(codes){
    this.codes = JSON.parse(codes);
    this.events = {};
    this.callbacks = {};
    let self = this;
    for(event in this.codes){
      if(event === 'callbacks'){
        for(let i in this.codes[event]){
          eval('this.callbacks[i] = function(){' + this.codes[event][i] + '};');
        }
      } else {
        if (!this.events[event]) this.events[event] = [];
        for (let i in this.codes[event]) {
          eval('this.events[event].push(function(){' + this.codes[event][i] + '});');
        }
      }
    }
  },

  trigger: function(event, args, context){
    for(let i in this.events[event]) this.events[event][i].apply(context || this, args);
  },

  tick(time, delta){
    this._time = time;
    this._delta = delta;
    this.trigger('aframeevent_tick', [time, delta]);
    this.trigger('aframeevent_interval', [time, delta]);
    for(let id in this.blockstore.waits){
      if(!this.callbacks[id]) continue;
      let toDelete = [];
      for(let i in this.blockstore.waits[id]){
        if(time >= this.blockstore.waits[id][i]){
          toDelete.unshift(i);
          this.callbacks[id].apply(this);
        }
      }
      for(let i in toDelete) this.blockstore.waits[id].splice(toDelete[i], 1);
    }
  }
});