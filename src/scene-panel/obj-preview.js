export class ObjPreview{
  constructor(canvasEl, objEl){
    this.lastRot = 0;
    this.canvas = canvasEl;
    this.obj = objEl;

    this.scene = new THREE.Scene();

    this.resize();

    this.VIEW_ANGLE = 45;
    this.ASPECT = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
    this.NEAR = 0.1;
    this.FAR = 20000;
    this.camera = new THREE.PerspectiveCamera( this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    this.scene.add(this.camera);

    if ( window.WebGLRenderingContext )
      this.renderer = new THREE.WebGLRenderer( {antialias:true, canvas: this.canvas} );
    else
      this.renderer = new THREE.CanvasRenderer({canvas: this.canvas});
    this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(0,15000,10000);
    this.scene.add(this.light);
    this.light2 = new THREE.AmbientLight(0x444444);
    this.scene.add(this.light2);
    //this.scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

    this.objMesh = new THREE.Mesh( this.obj.object3DMap.mesh.geometry.clone(), this.obj.object3DMap.mesh.material.clone() );
    this.scene.add(this.objMesh);

    this.objMesh.geometry.computeBoundingSphere();
    let radius = this.objMesh.geometry.boundingSphere.radius;
    this.camera.position.set(0, radius*1, radius*3);
    this.camera.lookAt(this.scene.position);

    //this.controls = new THREE.OrbitControls( this.camera, this.canvas );

    this.rotVec = new THREE.Vector3(0, 1, 0);

    this.obj.addEventListener('materialtextureloaded', ()=>{
      this.objMesh.material = this.obj.object3DMap.mesh.material.clone();
      if(this.obj.localName === 'a-sky') this.objMesh.material.side = THREE.BackSide;
    });

    if(this.obj.localName === 'a-plane'){
      this.camera.position.set(0, 1.6, 0);
      this.camera.lookAt(new THREE.Vector3(0, 0, radius));
      this.objMesh.rotateX(3*(Math.PI/2));
      this.rotVec = new THREE.Vector3(0, 0, 1);
    }
    if(this.obj.localName === 'a-sky'){
      this.camera.position.set(0, 0, 0);
      this.camera.lookAt(new THREE.Vector3(0, 0, 1));
      this.objMesh.material.side = THREE.BackSide;
      window.Sky = this;
    }

    this.animate();
  }

  resize(){
    let ratio = 9/16;
    this.canvas.style.width = '100%';
    this.SCREEN_WIDTH  = this.canvas.offsetWidth;
    this.SCREEN_HEIGHT = Math.floor(this.SCREEN_WIDTH*ratio);
    this.canvas.style.height = this.SCREEN_HEIGHT+'px';
    this.canvas.setAttribute('width', this.SCREEN_WIDTH);
    this.canvas.setAttribute('height', this.SCREEN_HEIGHT);
    if(this.renderer) this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
  }

  animate(){
    requestAnimationFrame( ()=>this.animate() );
    //don't render if not visible, visible code taken from jquery
    if( !( this.canvas.offsetWidth || this.canvas.offsetHeight || this.canvas.getClientRects().length )) return;
    this.renderer.render( this.scene, this.camera );
    let time = Date.now();
    if(time - this.lastRot > 30){
      this.lastRot = time;
      this.objMesh.rotateOnAxis(this.rotVec, 0.01);
    }
  }

  remove(){}
}