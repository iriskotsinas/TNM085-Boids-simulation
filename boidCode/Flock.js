import Boid from './Boid.js';

class Flock {
	constructor(amount, sceneRoot) {
		this.flockSize = amount;
		this.boids = [];
		this.sceneRoot = sceneRoot;

		this.updateFlockSize = this.updateFlockSize.bind(this);
		this.updateFlock = this.updateFlock.bind(this);

		let minW = -(controls.width - 10) * controls.scaleX;
		let minH = -(controls.height - 10) * controls.scaleY;
		let minD = -(controls.depth - 10) * controls.scaleZ;

		for(let i = 0; i < this.flockSize; i++) {
			let xPos = Math.floor(Math.random() * ((controls.width - 10) * controls.scaleX - minW) + minW);
			let yPos = Math.floor(Math.random() * ((controls.height - 10) * controls.scaleY - minH) + minH);
			let zPos = Math.floor(Math.random() * ((controls.depth - 10) * controls.scaleZ - minD) + minD);

			// let newBoid = new Boid(0,0,0);
			let newBoid = new Boid(xPos, yPos, zPos);

			newBoid.loaded.then((msg) => {
				this.sceneRoot.add( newBoid.mesh );
			}).catch((e) => { console.log(e) });

			this.boids.push(newBoid);
		}
	}

	updateFlockSize() {
		// add boids to scene
		if(this.flockSize < controls.boidAmount) {
			let minW = -(controls.width - 10) * controls.scaleX;
			let minH = -(controls.height - 10) * controls.scaleY;
			let minD = -(controls.depth - 10) * controls.scaleZ;

			for(let i = 0; i < Math.abs(this.flockSize - controls.boidAmount) - 1; i++) {
				let xPos = Math.floor(Math.random() * ((controls.width - 10) * controls.scaleX - minW) + minW);
				let yPos = Math.floor(Math.random() * ((controls.height - 10) * controls.scaleY - minH) + minH);
				let zPos = Math.floor(Math.random() * ((controls.depth - 10) * controls.scaleZ - minD) + minD);

				let newBoid = new Boid(xPos, yPos, zPos);

				newBoid.loaded.then((msg) => {
					this.sceneRoot.add( newBoid.mesh );
				}).catch((e) => { console.log(e) });

				this.boids.push(newBoid);
			}

			this.flockSize = this.boids.length;
		}

		// remove boids from scene
		if(this.flockSize > controls.boidAmount) {
			this.boids.forEach((boid, index) => {
				if(index >= controls.boidAmount) {
					this.sceneRoot.remove( boid.mesh );
					this.boids.splice(index, 1);
				}
			});

			this.flockSize = this.boids.length;
		}
	}

	updateFlock(deltaTime) {
		if(this.flockSize != controls.boidAmount) {
			this.updateFlockSize();
		}

		this.boids.forEach((boid, index) => {
			/*------------------- IF OUTSIDE CONTAINER -------------------*/
			if(boid.position.x >= controls.width * controls.scaleX || boid.position.x <= -controls.width * controls.scaleX ||
				boid.position.y >= controls.height * controls.scaleY || boid.position.y <= -controls.height * controls.scaleY ||
				boid.position.z >= controls.depth * controls.scaleZ || boid.position.z <= -controls.depth * controls.scaleZ) {
					this.sceneRoot.remove( boid.mesh );
					this.boids.splice(index, 1);
			}
			/*------------------------------------------------------------*/
			else {
				if(deltaTime >= 0.0166) {
					boid.interact_with_flock(this.boids);
				}
				if(deltaTime >= 0.0016) {
					boid.flaxa();
				}
			}
		});
	}
}

export default Flock;