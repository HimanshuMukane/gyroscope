const canvas = document.getElementById('canvas');
const permissionButton = document.getElementById('permissionButton');
let gimbal;

function init() {
    // Set up the renderer and scene
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    scene.add(camera);

    // Load the GLTF cube model
    const loader = new THREE.GLTFLoader();
    loader.load('files/Home.gltf', (gltf) => {
        scene.add(gltf.scene);
    });

    // Set up the gimbal
    gimbal = new Gimbal();

    permissionButton.addEventListener('click', () => {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response == 'granted') {
                // Now we can enable the gimbal!
                gimbal.enable();
            }
        });
    });

    // Render loop
    function render() {
        // Performs all necessary calculations
        gimbal.update();

        // Gets yaw rotation (y-axis)
        // Range [-180, 180], 0 is forward
        const yaw = gimbal.yaw;

        // Gets pitch rotation (x-axis)
        // Range [-180, 180], 0 is horizontal
        const pitch = gimbal.pitch;

        // Gets roll rotation (z-axis)
        // Range [-180, 180], 0 is vertical
        const roll = gimbal.roll;

        // Update the camera's rotation based on gimbal data
        camera.rotation.set(THREE.MathUtils.degToRad(pitch), THREE.MathUtils.degToRad(yaw), THREE.MathUtils.degToRad(roll));

        // Render the scene with the updated camera angle
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    // Start the render loop
    render();
}

// Wait for the DOM to load before initializing the app
document.addEventListener('DOMContentLoaded', init);
