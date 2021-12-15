import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
const goldTexture = textureLoader.load('/textur_test.jpg')

/**
 * Object
 */

// const material = new THREE.MeshStandardMaterial({
//     //map: goldTexture,
//     // transparent: true,
//     // opacity: 0.8,
//     color: 'blue',
//     //wireframe: true
// })
// const material = new THREE.MeshMatcapMaterial({
//     matcap: matcapTexture,
// })

const geometry = new THREE.BoxGeometry(1, 1, 1)

// function createCubeMatrix(m, n, v, offset) {
//     offset = offset !== undefined ? offset : 2.0;
//     var xMin = -offset * ((m-1) / 2.0);
//     var yMin = -offset * ((n-1) / 2.0);
//     var zMin = -offset * ((v-1) / 2.0);
//     for (let i = 0, x = xMin; i < m; i++, x += offset) {
//         for (let j = 0, y = yMin; j < n; j++, y += offset) {
//             for (let k = 0, z = zMin; k < v; k++, z += offset) {
//                 var box = new THREE.Mesh(geometry, material)
//                 box.position.x = x;
//                 box.position.y = y;
//                 box.position.z = z;
//                 scene.add(box);
//             }
//         }
//     }
// }
// createCubeMatrix(10, 10, 10, 1.5)

// Objects anzeigen
const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

// Random positions
for ( let i = 0; i < 118; i++ ) {
    const edges = new THREE.EdgesGeometry( geometry );
    const objectbox = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    // const objectbox = new THREE.Mesh(geometry, material);
		objectbox.position.x = Math.random() * 10 - 2;
		objectbox.position.y = Math.random() * 10 - 2;
		objectbox.position.z = Math.random() * 10 - 2;
		// scene.add( objectbox );

		objects.push( objectbox );
}


const vector = new THREE.Vector3();

// Helix
for ( let i = 0; i < objects.length; i++ ) {

    const theta = i * 0.175 + Math.PI; //default  0.175
    const y = - ( i * 0.05 ) + 2;

    // const edges = new THREE.EdgesGeometry( geometry );
    // const object = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xff9900 } ) );
    const object = new THREE.Mesh(geometry, new THREE.MeshMatcapMaterial({
            matcap: matcapTexture,
            map: goldTexture
        }))
    object.position.setFromCylindricalCoords( 8, theta, y );

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt( vector );

    targets.helix.push( object );
}

for ( let i = 0; i < objects.length; i++ ) {
    scene.add(targets.helix[i]);
    // scene.add(objects[i])
}

/**
 * Raycaster
 */
// Raycaster
const raycaster = new THREE.Raycaster()


/**Mehrere Objects**/
const intersect = raycaster.intersectObjects(targets.helix)
console.log(intersect)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Lights
 */
const directionalLight1 = new THREE.DirectionalLight({
    color: 'white',
    intensity: 1
})
directionalLight1.position.y = 5;
directionalLight1.position.x = 2;
directionalLight1.position.z = -3;
scene.add(directionalLight1)

const directionalLight2 = new THREE.DirectionalLight({
    color: 'white',
    intensity: 2
})
directionalLight2.position.y = 3;
directionalLight2.position.x = -3;
directionalLight2.position.z = 3;
scene.add(directionalLight2)

/**
 * Mouse 
 */
 const mouse = new THREE.Vector2()

 window.addEventListener('mousemove', (event) => {
 
     mouse.x = event.clientX / sizes.width * 2 - 1 // Values from -1 to 1 -> normalized
     mouse.y = -(event.clientY / sizes.height) * 2 + 1 // Values from -1 to 1 -> normalized
 })

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
// camera.position.x = 1
// camera.position.y = 1
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Cast a Ray
    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = targets.helix
    const intersects = raycaster.intersectObjects(objectsToTest)

    for(const object of objectsToTest) {
        object.material.color.set('#00ff00')
    }

    for(const intersect of intersects) {
        intersect.object.material.color.set('#005500')

    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()