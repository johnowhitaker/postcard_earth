// Created by Bjorn Sandvik - thematicmapping.org
(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;



	// Earth params
	var radius   = 0.5,
		segments = 32,
		rotation = 6;

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	// Handle resizing
	window.addEventListener( 'resize', onWindowResize, false );
	function onWindowResize(){
		width  = window.innerWidth;
		height = window.innerHeight;
		camera.aspect = window.innerWidth / window.innerHeight;
	  camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}


	// lIGHTS
	scene.add(new THREE.AmbientLight(0x333333));

	var ambient = new THREE.AmbientLight(0xff33ff);
	ambient.intensity = 0;
	scene.add(ambient);

	var sun = new THREE.DirectionalLight(0xffffff, 1);
	sun.position.set(5,3,5);
	scene.add(sun);

  var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation;
	scene.add(sphere)

	var stars = createStars(90, 64);
	scene.add(stars);

	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	render();

	function render() {
		controls.update();

		if (document.getElementById('rot_check').checked){
			sphere.rotation.y += 0.005;
		}
		if (document.getElementById('directional_light').checked){
			ambient.color.setHex( 0xFFFFFF );
			sun.intensity = 0;
		}
		else{
			ambient.color.setHex( 0x000000 );
			sun.intensity = 1;
		}

		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/postcard_pic.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/earthspec1k.jpg'),
				specular:    new THREE.Color('grey')
			})
		);
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
				side: THREE.BackSide
			})
		);
	}



}());
