import Flock from './boidCode/Flock.js';

class ThreeScene {
    constructor() {
        this.container = document.getElementById( 'container' );
        this.scene = new THREE.Scene();
        this.sceneRoot = new THREE.Group();

        /*------------------- Set up the camera -------------------*/
        this.camera = new THREE.PerspectiveCamera( 50, container.clientWidth / container.clientHeight, 1, 10000 );
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = controls.depth * 3 * controls.scaleY;
        this.camera.lookAt( this.scene.position ); // Deafult scene position is (0,0,0)
        /*---------------------------------------------------------*/

        /*------------------ Set up the renderer ------------------*/
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor( new THREE.Color(0, 0, 0) );
        this.renderer.setPixelRatio( container.devicePixelRatio );
        this.renderer.setSize( container.clientWidth, container.clientHeight );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild( this.renderer.domElement );
        /*---------------------------------------------------------*/

        /*------------ Time stamp for animation timing ------------*/
        this.previousTime = performance.now();
        /*---------------------------------------------------------*/

        /*-------------- Bind functions to the class --------------*/
        this.onWindowResize = this.onWindowResize.bind(this);
        this.render = this.render.bind(this);
        this.animate = this.animate.bind(this);
        this.drawInitalScene = this.drawInitalScene.bind(this);

        window.addEventListener( 'resize', this.onWindowResize, false );
        /*---------------------------------------------------------*/

        this.drawInitalScene();
    }
    
    drawInitalScene() {
        /*-------------- CREATE THE FLOCK OF BOIDS ---------------*/
        this.flock = new Flock(controls.boidAmount, this.sceneRoot);
        /*--------------------------------------------------------*/

        /*--------------------- SET UP SCENE ---------------------*/
        this.scene.add( this.sceneRoot );

				/*------------ LIGHTS ------------*/
        this.scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ) );

        let light = new THREE.PointLight( 0xffffff, 1, 0, 2 );
        // let light = new THREE.SpotLight( 0xffffff );
        // light.position.set( maxW / 5, 0, this.camera.position.z /2 );
        // light.angle = Math.PI/3;
        // light.decay = 0.5;
        light.castShadow = true;
        // light.penumbra = 0.9;
        // light.distance = 1000;

				light.shadow.mapSize.width = 3000;
        light.shadow.mapSize.height = 3000;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 10000;
        // light.shadow.camera.fov = 90;

        /*-- CAMERA HELPER --*/
				// let cameraHelper = new THREE.CameraHelper( light.shadow.camera );
        // this.scene.add(cameraHelper);

				// let spotLightHelper  = new THREE.SpotLightHelper( light );
        // this.scene.add(spotLightHelper );
        /*-------------------*/

				this.scene.add(light);
        /*-------------------------------*/

        /*---------- CONTAINER -----------*/
        const backgroundGeometry = new THREE.BoxGeometry(controls.width*2 * controls.scaleX, controls.height*2 * controls.scaleY, controls.depth*2 * controls.scaleZ, 10, 10, 10);
        const backgroundMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(1, 1, 1),
            side: THREE.BackSide,
            wireframe: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.container = new THREE.Mesh( backgroundGeometry, backgroundMaterial );

        this.sceneRoot.add( this.container );
        /*--------------------------------*/
				/*--------------------------------------------------------*/

				/*------------------- ORBIT CONTROLS ---------------------*/
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.minDistance = 30;
				this.controls.maxDistance = this.camera.position.z * 1.5;
				/*--------------------------------------------------------*/
    }

    // Some things need to change when the window is resized
    onWindowResize() {
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( container.clientWidth, container.clientHeight );
    }

    changeContainerSize() {
      this.container.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
      this.camera.position.z = controls.depth * 3 * controls.scaleY;
      this.controls.maxDistance = this.camera.position.z * 1.5;
    }

    render() {			
        var currentTime;

        // Perform animations with absolute speed (elapsed time, not frame numbers)
        currentTime	= performance.now();
        const deltaTime = (currentTime - this.previousTime) / 1000; // getTime() returns milliseconds
        
        //this.objectSpin.rotation.z += 0.8 * deltaTime; // Rotate 0.8 radians per second

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        if(controls.scaleX != this.container.scale.x ||
          controls.scaleY != this.container.scale.y ||
          controls.scaleZ != this.container.scale.z) {
            this.changeContainerSize();
        }

        if(controls.play) {
          this.flock.updateFlock(deltaTime);
          this.flock.boids.forEach((boid) => {
            boid.mesh.position.set(
              boid.position.x,
              boid.position.y, 
              boid.position.z
            );
            // Rotate the boid
            const head = boid.velocity.clone();
            head.multiplyScalar(10);
            head.add(boid.position);
            boid.mesh.lookAt(head);
          });

          this.previousTime = currentTime;
        }
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(this.animate); // Request to be called again for next frame
        this.render();
    }
}

const threeScene = new ThreeScene();    // Set up the scene
threeScene.animate(); // Start an infinite animation loop

export default ThreeScene;