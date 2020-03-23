import './style.css';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

let animate;
let active = false;
let mesh, geometry, renderer, scene, camera, controls, texture, uniforms, material;
let c = document.querySelector('#source');
c.width = 1024;
c.height = 1024;
let id = 392;
let codeBlock = '';
let X, Y, g, h, v, j, p, w, i, P, d, Z, s, M, R, L, k, V, l, b, a;
let r = 0, t = 0;
let x = c.getContext('2d');
let S = Math.sin;
let C = Math.cos;

class Options {
  constructor() {
    this.id = '392';
    this.update = () => {
      getId(this.id);
    }
    this.background = '#FFFFFF';
    this.autoRotate = true;
    this.geometry = 'box';
  }
}

const gui = new dat.GUI();
const options = new Options();
gui.add(options, 'id').name('Codegolf ID');
let optionBackground = gui.addColor(options, 'background').name('Scene BG');
gui.add(options, 'autoRotate').name('Auto Rotate')
let optionGeometry = gui.add(options, 'geometry', ['box', 'sphere', 'cone', 'torus']).name('Geometry')
gui.add(options, 'update').name('Load Golf');

optionBackground.onChange((value) => {
  if (scene) {
    scene.background = new THREE.Color(value);
  }
});


optionGeometry.onChange((value) => {
  if (!scene) return;
  switch (value) {
    case 'box':
      geometry = new THREE.BoxGeometry( 70, 70, 70 )
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry( 35, 32, 32)
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry( 35, 70, 32 )
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry( 40, 16, 16, 100 );
      break;
    default:
      break;
  }
  scene.remove(mesh);
  mesh = new THREE.Mesh( geometry, material )
  scene.add(mesh);
});


let u=()=>{
  eval(codeBlock)
  t+=1/60
  requestAnimationFrame(u)
}

let init = () => {
    renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setSize( document.body.clientWidth, document.body.clientHeight )
    document.querySelector('#render').innerHTML = ''
    document.querySelector('#render').appendChild( renderer.domElement )
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    camera = new THREE.PerspectiveCamera( 
        40,
        document.body.clientWidth / document.body.clientHeight,
        1,
        10000
    );
    camera.position.set( 200, 0, 100 )
    camera.lookAt( scene.position )
    scene.add( camera );
    controls = new OrbitControls(camera, renderer.domElement)

    switch (options.geometry) {
      case 'box':
        geometry = new THREE.BoxGeometry( 70, 70, 70 )
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry( 35, 32, 32)
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry( 35, 70, 32 )
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry( 40, 16, 16, 100 );
        break;
      default:
        break;
    }

    texture = new THREE.Texture(document.querySelector('#source'))
    texture.needsUpdate = true
    mesh = new THREE.Mesh( geometry, material )
    scene.add( mesh );
}

animate = () => {
    requestAnimationFrame( animate )
    texture = new THREE.Texture(document.querySelector('#source'))
    texture.needsUpdate = true; // important
    material = new THREE.ShaderMaterial({
        uniforms        : {
        color: { type: "c", value: new THREE.Color( 0xffffff ) },
        texture: { type: "t", value: texture },
    },
        vertexShader    : document.getElementById( 'vertex_shader' ).textContent,
        fragmentShader  : document.getElementById( 'fragment_shader' ).textContent,
    });
    mesh.material = material;

    if (options.autoRotate) {
      mesh.rotation.x += 0.004
      mesh.rotation.y += 0.006
      mesh.rotation.z += 0.008
    }
    renderer.render( scene, camera )
}

function getId(id) {
  fetch(`https://codegolf.dweet.net/code/?id=${id}`)
  .then(tx=>tx.text()).then(tx=>{
    if (tx === '') {
      return;
    }
    if (scene) {
      t = 0;
      scene.remove(camera);
      scene.remove(mesh);
      camera = null;
      mesh = null;
    }
    codeBlock=tx;
    init();
    if (options.background) {
      scene.background = new THREE.Color(options.background)
    }
    if (!active) {
      animate()
      u()
      active = true;
    }
  })
}

getId(392);


window.addEventListener( 'resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
}, false );