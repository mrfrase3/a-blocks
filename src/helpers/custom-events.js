AFRAME.registerComponent('custom-events', {
  schema: {
  },

  init: function(){
    this.lastVis = true;
    if(this.el.components.visible) this.lastVis = this.el.components.visible.data;
    this.lastGrav = this.el.hasAttribute('dynamic-body');
    this.lastGeom = '';
    if(this.el.components.geometry) this.lastGeom = JSON.stringify(this.el.components.geometry.data);

    this.el.dispatchEvent(new CustomEvent('toggleVisible', { detail: this.lastVis }));
    this.el.dispatchEvent(new CustomEvent('toggleGravity', { detail: this.lastGrav }));
  },

  tick: function(time,delta){
    if(this.el.components.visible.data !== this.lastVis){
      this.lastVis = this.el.components.visible.data;
      this.el.dispatchEvent(new CustomEvent('toggleVisible', { detail: this.lastVis }));
    }
    if(this.el.hasAttribute('dynamic-body') !== this.lastGrav){
      this.lastGrav = !this.lastGrav;
      this.el.dispatchEvent(new CustomEvent('toggleGravity', { detail: this.lastGrav }));
    }
    let geom = JSON.stringify(this.el.components.geometry.data);
    if(this.lastGeom !== geom){
      if(this.el.components.geometry.oldData){
        let physType = this.el.hasAttribute('dynamic-body') ? 'dynamic-body' : 'static-body';
        let physData = this.el.components[physType].data;
        this.el.removeAttribute(physType);
        this.el.setAttribute(physType, physData);
      }
      this.lastGeom = geom;
      this.el.dispatchEvent(new CustomEvent('updateGeometry', { detail: this.el.components.geometry.data }));
    }
  }
});