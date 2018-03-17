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
    this.isDynam = this.el.hasAttribute('dynamic-body');
    if(this.el.components.visible.data !== this.lastVis){
      this.lastVis = this.el.components.visible.data;
      this.el.dispatchEvent(new CustomEvent('toggleVisible', { detail: this.lastVis }));
    }
    if(this.isDynam !== this.lastGrav){
      this.lastGrav = !this.lastGrav;
      this.el.dispatchEvent(new CustomEvent('toggleGravity', { detail: this.lastGrav }));
    }
    /*if(this.isDynam){
      this.el.setAttribute('rotation', this.el.object3D.rotation.toVector3());
    }*/
    let geom = JSON.stringify(this.el.components.geometry.data);
    if(this.lastGeom !== geom){
      if(this.el.components.geometry.oldData){
        let physType = this.isDynam ? 'dynamic-body' : 'static-body';
        if(this.el.components[physType]){
          let physData = this.el.components[physType].data;
          this.el.removeAttribute(physType);
          this.el.setAttribute(physType, physData);
        }
      }
      this.lastGeom = geom;
      this.el.dispatchEvent(new CustomEvent('updateGeometry', { detail: this.el.components.geometry.data }));
    }
  }
});