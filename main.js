let camera, scene, renderer;
let gltfModel;

function init() {
  scene = new THREE.Scene();

  // Create a fixed camera at a position
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  scene.add(camera);

  // Add lighting to the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  const loader = new THREE.GLTFLoader();
  loader.load('path/to/your/gltf/model.gltf', (gltf) => {
    gltfModel = gltf.scene;
    scene.add(gltfModel);
  });

  // Handle gyroscope and accelerometer input
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    console.log('DeviceOrientationEvent is supported.');
  } else {
    console.log('DeviceOrientationEvent is not supported.');
  }

  window.addEventListener('resize', onWindowResize, false);
}

function handleDeviceOrientation(event) {
  const { alpha, beta } = event;

  // Convert beta and alpha angles to radians.
  const betaRad = THREE.MathUtils.degToRad(beta);
  const alphaRad = THREE.MathUtils.degToRad(alpha);

  // Calculate the new camera position based on the device orientation.
  const cameraDistance = 5; // The distance of the camera from the center of the scene.
  const cameraX = cameraDistance * Math.cos(betaRad) * Math.sin(alphaRad);
  const cameraY = cameraDistance * Math.sin(betaRad);
  const cameraZ = cameraDistance * Math.cos(betaRad) * Math.cos(alphaRad);

  // Set the new camera position.
  camera.position.set(cameraX, cameraY, cameraZ);

  // Point the camera at the center of the scene.
  camera.lookAt(0, 0, 0);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
