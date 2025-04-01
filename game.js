let scene, camera, renderer, car, plane, obstacles = [];
let clock = new THREE.Clock();
let timeLeft = 60;
let level = 1;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    document.getElementById('arButton').addEventListener('click', startAR);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    console.log("Inicializálás kész");
}

async function startAR() {
    if (!navigator.xr) {
        alert("A böngésződ nem támogatja a WebXR-t!");
        return;
    }

    const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
    });
    console.log("WebXR session aktív:", session);

    renderer.xr.enabled = true;
    renderer.xr.setSession(session);

    createPlane();
    createCar();
    generateTrack();

    animate();
}

function createPlane() {
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    console.log("Pálya létrehozva");
}

function createCar() {
    const geometry = new THREE.BoxGeometry(0.2, 0.1, 0.4);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    car = new THREE.Mesh(geometry, material);
    car.position.set(0, 0.05, 0);
    scene.add(car);
    console.log("Autó létrehozva");
}

function generateTrack() {
    obstacles.forEach(obj => scene.remove(obj));
    obstacles = [];

    for (let i = 0; i < level * 2; i++) {
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const obstacle = new THREE.Mesh(geometry, material);
        obstacle.position.set(
            (Math.random() - 0.5) * 4,
            0.15,
            (Math.random() - 0.5) * 4
        );
        scene.add(obstacle);
        obstacles.push(obstacle);
    }
    console.log("Pálya generálva, akadályok száma:", obstacles.length);
}

function animate() {
    renderer.setAnimationLoop(() => {
        const delta = clock.getDelta();
        timeLeft -= delta;
        if (timeLeft <= 0) {
            alert("Idő lejárt! Szint: " + level);
            level++;
            timeLeft = 60;
            generateTrack();
        }

        if (car.position.x < 2.5) car.position.x += 0.05;

        renderer.render(scene, camera);
        console.log("Render fut, autó pozíció:", car.position.x);
    });
}

init();
