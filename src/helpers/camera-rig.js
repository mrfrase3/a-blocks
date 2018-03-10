AFRAME.registerComponent('camera-rig', {

	schema: {
    	position: { default: { x: 0, y: 1.6, z: 0 }, type: 'vec3'}
  	},

	init: function(){
		this.lastVRPos = { x: 0, y: 0, z: 0 };
		this.lhand = $('#leftHand').get(0);
		this.rhand = $('#rightHand').get(0);

		if (!this.el.sceneEl.is('vr-mode')) {
      		this.el.setAttribute('position', this.data.position);
      		this.el.setAttribute('visible', false);
    	}

		this.onEnterVR = this.onEnterVR.bind(this);
	    this.onExitVR = this.onExitVR.bind(this);
	    this.el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
	    this.el.sceneEl.addEventListener('exit-vr', this.onExitVR);
	},

	onEnterVR: function(){
		this.el.setAttribute('position', this.lastVRPos);
		this.el.setAttribute('visible', true);
		this.lhand.setAttribute('static-body','shape: sphere; sphereRadius: 0.05;');
		this.rhand.setAttribute('static-body','shape: sphere; sphereRadius: 0.05;');
	},

	onExitVR: function(){
		this.lastVRPos = this.el.getAttribute('position');
		this.el.setAttribute('position', this.data.position);
		this.el.setAttribute('visible', false);
		this.lhand.removeAttribute('static-body');
		this.rhand.removeAttribute('static-body');
	}

});