// Alap Three.js és WebXR inicializálás
let scene, camera, renderer, car, plane, obstacles = [];
let clock = new THREE.Clock();
let timeLeft = 60; // 60 másodperc időkorlát
let level = 1;

function init() {
    // Jelenet létrehozása
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // WebXR aktiválása
    document.getElementById('arButton').addEventListener('click', startAR);

    // Fényforrás
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
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

    renderer.xr.enabled = true;
    renderer.xr.setSession(session);

    // Sík felület létrehozása
    createPlane();
    createCar();
    generateTrack();

    animate();
}

// Pálya alapja (sík felület)
function createPlane() {
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Fekvő pozíció
    scene.add(plane);
}

// Autó létrehozása
function createCar() {
    const geometry = new THREE.BoxGeometry(0.2, 0.1, 0.4);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    car = new THREE.Mesh(geometry, material);
    car.position.set(0, 0.05, 0);
    scene.add(car);
}

// Véletlenszerű pályagenerálás
function generateTrack() {
    obstacles.forEach(obj => scene.remove(obj));
    obstacles = [];

    for (let i = 0; i < level * 2; i++) { // Nehézség növelése
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
}

// Animáció és logika
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

        // Autó mozgatása (pl. egyszerű billentyűzet inputtal, később érintésvezérlés)
        if (car.position.x < 2.5) car.position.x += 0.05;

        renderer.render(scene, camera);
    });
}

init();