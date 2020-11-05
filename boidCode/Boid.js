// import { OBJLoader2 } from '../three.js/examples/jsm/loaders/OBJLoader2.js';

class Boid {
	constructor(xPos, yPos, zPos) {
		this.position = new THREE.Vector3(xPos, yPos, zPos);

		const angle = Math.random() * 2.0 * Math.PI;
		// this.velocity = new THREE.Vector3(0, 1, 0);
		this.velocity = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0.0);

		this.flaxa = this.flaxa.bind(this);
		this.createModel = this.createModel.bind(this);
		this.interact_with_flock = this.interact_with_flock.bind(this);
		this.avoid = this.avoid.bind(this);
		this.avoidBorder = this.avoidBorder.bind(this);
		this.getNeighbors = this.getNeighbors.bind(this);
		this.isNeighbor = this.isNeighbor.bind(this);
		this.cohesion = this.cohesion.bind(this);

		/* --------- THE 3D-OBJECT ---------- */
		this.loaded = new Promise(
			async (resolve) => {
				await this.createModel();
				resolve("The resource was loaded");
			}
		);
		/* ---------------------------------- */

		this.flaxAngle = 0;
		this.maxFlax = 70;
		this.minFlax = -40;
		this.flaxStep = -10;
	}

	flaxa() {
		this.mesh.children[1].rotateZ(THREE.Math.degToRad(this.flaxStep * controls.speed));
		this.mesh.children[2].rotateZ(THREE.Math.degToRad(-this.flaxStep * controls.speed));
		
		this.flaxAngle += this.flaxStep * controls.speed;
		
		if(this.flaxAngle > this.maxFlax) {
			this.flaxStep = -this.flaxStep;
		}
		if(this.flaxAngle < this.minFlax) {
			this.flaxStep = -this.flaxStep;
		}
	}

	createModel() {
		return new Promise((resolve) => {
			this.mesh = new THREE.Object3D();

			let boidBody = new THREE.CylinderGeometry( 0.1, 0.2, 3, 32 );
			boidBody.rotateX(THREE.Math.degToRad(-90));

			/*-------------- LEFT WING -------------*/
			let boidLeftWing = new THREE.Geometry();

			let v1_1 = new THREE.Vector3(0, 0.5, -0.1);
			let v2_1 = new THREE.Vector3(3, 0, 0);
			let v3_1 = new THREE.Vector3(0, -1, -0.1);

			let v1_2 = new THREE.Vector3(0, 0.5, -0.1);
			let v2_2 = new THREE.Vector3(3, 0, 0);
			let v3_2 = new THREE.Vector3(0, -0.25, 0.1);

			let v1_3 = new THREE.Vector3(0, -0.25, 0.1);
			let v2_3 = new THREE.Vector3(3, 0, 0);
			let v3_3 = new THREE.Vector3(0, -1, -0.1);

			let triangle1 = new THREE.Triangle(v1_1, v2_1, v3_1);
			let triangle2 = new THREE.Triangle(v1_2, v2_2, v3_2);
			let triangle3 = new THREE.Triangle(v1_3, v2_3, v3_3);

			let normal1 = new THREE.Vector3();
			let normal2 = new THREE.Vector3();
			let normal3 = new THREE.Vector3();
			triangle1.getNormal(normal1);
			triangle2.getNormal(normal2);
			triangle3.getNormal(normal3);

			boidLeftWing.vertices.push(triangle1.a);
			boidLeftWing.vertices.push(triangle1.b);
			boidLeftWing.vertices.push(triangle1.c);
			boidLeftWing.vertices.push(triangle2.a);
			boidLeftWing.vertices.push(triangle2.b);
			boidLeftWing.vertices.push(triangle2.c);
			boidLeftWing.vertices.push(triangle3.a);
			boidLeftWing.vertices.push(triangle3.b);
			boidLeftWing.vertices.push(triangle3.c);

			boidLeftWing.faces.push(new THREE.Face3(0, 1, 2, normal1));
			boidLeftWing.faces.push(new THREE.Face3(3, 5, 4, normal1));
			boidLeftWing.faces.push(new THREE.Face3(6, 8, 7, normal1));
			boidLeftWing.rotateX(THREE.Math.degToRad(-90));
			/*--------------------------------------*/

			/*------------- RIGHT WING -------------*/
			let boidRightWing = new THREE.Geometry();

			v1_1 = new THREE.Vector3(0, 0.5, -0.1);
			v2_1 = new THREE.Vector3(-3, 0, 0);
			v3_1 = new THREE.Vector3(0, -1, -0.1);

			v1_2 = new THREE.Vector3(0, 0.5, -0.1);
			v2_2 = new THREE.Vector3(-3, 0, 0);
			v3_2 = new THREE.Vector3(0, -0.25, 0.1);

			v1_3 = new THREE.Vector3(0, -0.25, 0.1);
			v2_3 = new THREE.Vector3(-3, 0, 0);
			v3_3 = new THREE.Vector3(0, -1, -0.1);

			triangle1 = new THREE.Triangle(v1_1, v2_1, v3_1);
			triangle2 = new THREE.Triangle(v1_2, v2_2, v3_2);
			triangle3 = new THREE.Triangle(v1_3, v2_3, v3_3);

			triangle1.getNormal(normal1);
			triangle2.getNormal(normal2);
			triangle3.getNormal(normal3);

			boidRightWing.vertices.push(triangle1.a);
			boidRightWing.vertices.push(triangle1.b);
			boidRightWing.vertices.push(triangle1.c);
			boidRightWing.vertices.push(triangle2.a);
			boidRightWing.vertices.push(triangle2.b);
			boidRightWing.vertices.push(triangle2.c);
			boidRightWing.vertices.push(triangle3.a);
			boidRightWing.vertices.push(triangle3.b);
			boidRightWing.vertices.push(triangle3.c);

			boidRightWing.faces.push(new THREE.Face3(0, 1, 2, normal1));
			boidRightWing.faces.push(new THREE.Face3(3, 5, 4, normal1));
			boidRightWing.faces.push(new THREE.Face3(6, 8, 7, normal1));
			boidRightWing.rotateX(THREE.Math.degToRad(-90));
			/*--------------------------------------*/

			let boidMaterial = new THREE.MeshLambertMaterial({color: new THREE.Color('red'), side: THREE.DoubleSide});
			
			this.mesh.add( new THREE.Mesh(boidBody, boidMaterial) );
			this.mesh.add( new THREE.Mesh(boidLeftWing, boidMaterial) );
			this.mesh.add( new THREE.Mesh(boidRightWing, boidMaterial) );
			// this.mesh.rotateY(THREE.Math.degToRad(90));
			// this.mesh.rotateX(THREE.Math.degToRad(90));
			this.mesh.position.set( this.position.x, this.position.y, this.position.z );

			// Rotate the boid
			const head = this.velocity.clone();
			head.multiplyScalar(10);
			head.add(this.position);
			this.mesh.lookAt(head);

			resolve(this.mesh);

			// let boidGeometry = new THREE.ConeGeometry( 0.75, 2, 32 );

			// var textureLoader = new THREE.TextureLoader();
			// textureLoader.load('coneTexture.jpg', function (texture) {
			// 	boidMaterial.map = texture;
			// 	boidMaterial.needsUpdate = true;
			// });
		});
	}

	interact_with_flock(boids) {
		//const oldVelo = this.velocity.clone();    // for angle calc in 3D
		let newVelo = new THREE.Vector3(0.0, 0.0, 0.0);

		const nearby_boids = this.getNeighbors(controls.cohRadius, boids);
		const PI_HALF = Math.PI / 2.0;
		let maxRot = 5.0 * (Math.PI / 180.0);

		// console.log("nearby_boids", nearby_boids);

		if (nearby_boids.length > 0) {
			let vel_Coh = this.cohesion(nearby_boids);
			vel_Coh.multiplyScalar(controls.cohFactor);

			let vel_Ali = this.align(nearby_boids);
			vel_Ali.multiplyScalar(controls.aliFactor);

			let vel_Sep = this.seperate(nearby_boids);
			vel_Sep.multiplyScalar(controls.sepFactor);
			
			newVelo.addVectors(vel_Ali, vel_Sep)
			newVelo.add(vel_Coh);
		}

		const xIn = Math.cos(-PI_HALF) * this.velocity.x - Math.sin(-PI_HALF) * this.velocity.y;
		const yIn = Math.sin(-PI_HALF) * this.velocity.x + Math.cos(-PI_HALF) * this.velocity.y;
		const ortoVelo = new THREE.Vector3(xIn, yIn, 0.0);
		const dot_prod = ortoVelo.dot(newVelo);

		if (this.velocity.angleTo(newVelo) > maxRot) {
			if (dot_prod > 0) {
				maxRot = -maxRot;
			}

			let spherical = new THREE.Spherical();
			spherical.setFromVector3(this.velocity);
			newVelo.copy(this.velocity);

			newVelo.setComponent(0, Math.cos(maxRot) * this.velocity.x - Math.sin(maxRot) * this.velocity.y);   // Set new X
			newVelo.setComponent(1, Math.sin(maxRot) * this.velocity.x + Math.cos(maxRot) * this.velocity.y);   // Set new Y
		}

		newVelo.normalize();
		let vel_avoid = this.avoidBorder(newVelo, maxRot);
		newVelo.add(vel_avoid);

		this.velocity.copy(newVelo);
		this.velocity.normalize();

		this.update();
	}

	avoid( wall = new THREE.Vector3() ) {
		let box = new THREE.Box3().setFromObject( this.mesh );

		let boundingSphere = new THREE.Sphere();
		box.getBoundingSphere(boundingSphere);
		
		const toMeVector = new THREE.Vector3();
		toMeVector.subVectors(this.mesh.position, wall);

		const distance = toMeVector.length();// - boundingSphere.radius * 2;
		toMeVector.normalize();
		toMeVector.multiplyScalar(1 / (Math.pow(distance, 2)));
		return toMeVector;
	}

	avoidBorder(newVelo, maxRot) {
		const sumVector = new THREE.Vector3();
		sumVector.add(this.avoid( new THREE.Vector3(controls.width * controls.scaleX, this.position.y, this.position.z)));
		sumVector.add(this.avoid( new THREE.Vector3(-controls.width * controls.scaleX, this.position.y, this.position.z)));
		sumVector.add(this.avoid( new THREE.Vector3(this.position.x, controls.height * controls.scaleY, this.position.z)));
		sumVector.add(this.avoid( new THREE.Vector3(this.position.x, -controls.height * controls.scaleY, this.position.z)));
		sumVector.add(this.avoid( new THREE.Vector3(this.position.x, this.position.y, controls.depth * controls.scaleZ)));
		sumVector.add(this.avoid( new THREE.Vector3(this.position.x, this.position.y, -controls.depth * controls.scaleZ)));
		// sumVector.multiplyScalar(Math.pow(newVelo.length(), 209000000));
		// sumVector.multiplyScalar(10);
		return sumVector;

		// let ray = new THREE.Vector3();
		// let returnVelo = new THREE.Vector3();
		// ray.copy(newVelo);
		// ray.copy(returnVelo);
		// ray.multiplyScalar(5);

		// if(ray >= this.maxPositionX) {
		// 	let dot = ray.dot( new THREE.Vector3(0, 1, 0) );

		// 	if(dot > 0) {
		// 		returnVelo.setComponent(0, Math.cos(maxRot) * ray.x - Math.sin(maxRot) * ray.y);   // Set new X
		// 	}
		// }

		// return returnVelo;
	}

	getNeighbors(radiusOfVision, boidsArray) {
		let nearby_boids = [];

		boidsArray.forEach(boid => {
			if (this.isNeighbor(radiusOfVision, boid)) {
				nearby_boids.push(boid);
			}
		});

		return nearby_boids;
	}

	isNeighbor(radiusOfVision, boid) {
		const d = boid.position.distanceTo(this.position);
		let theta = Math.abs(this.velocity.angleTo(boid.velocity));   // 
		

		if (d > Number.EPSILON && d <= radiusOfVision && theta < 150.0) {   //
			return true;
		}
		else return false;
	}

	update() {
		this.velocity.multiplyScalar(controls.speed);
		this.position.add(this.velocity);
	}

	cohesion(nearby_boids) {
		let cohVelo = new THREE.Vector3(0.0, 0.0, 0.0);
		let steer = new THREE.Vector3(0.0, 0.0, 0.0);

		if (nearby_boids.length > 0) {
			nearby_boids.forEach(boid => {
				steer.add(boid.position);
			});

			steer.divideScalar(nearby_boids.length);    // Average

			cohVelo.subVectors(steer, this.position);
			cohVelo.normalize();
		}
		return cohVelo;
	}

	align(boidsArray) {
		let aliVelo = new THREE.Vector3(0.0, 0.0, 0.0);
		let steer = new THREE.Vector3(0.0, 0.0, 0.0);

		// console.log("boidsArray",boidsArray);

		const nearby_boids = this.getNeighbors(controls.aliRadius, boidsArray);

		if (nearby_boids.length > 0) {
			nearby_boids.forEach(boid => {
				steer.add(boid.velocity);
			});

			steer.divideScalar(nearby_boids.length);    // Average

			aliVelo.copy(steer);
			aliVelo.normalize();
		}
		return aliVelo;
	}

	seperate(boidsArray) {
		let sepVelo = new THREE.Vector3(0.0, 0.0, 0.0);
		let steer = new THREE.Vector3(0.0, 0.0, 0.0);

		const nearby_boids = this.getNeighbors(controls.sepRadius, boidsArray);

		if (nearby_boids.length > 0) {
			nearby_boids.forEach(boid => {
				steer.add(boid.position);
			});

			steer.divideScalar(nearby_boids.length);    // Average

			sepVelo.subVectors(this.position, steer);
			sepVelo.normalize();
		}
		return sepVelo;
	}
}

export default Boid;