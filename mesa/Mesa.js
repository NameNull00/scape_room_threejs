import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Mesa extends THREE.Object3D {
  constructor() {
    super();

    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/wood.jpg');
    const bumpTexture = textureLoader.load('../imgs/wood-bump.jpg');

    const material = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
    });

    var tablongeo = new THREE.CylinderGeometry(5.535, 5.535, 0.4, 30, 30);
    var patageo = new THREE.CylinderGeometry(0.4, 0.4, 8, 30, 30);

    tablongeo.translate(0, 3.9, 0);

    var tablonmesh = new THREE.Mesh(tablongeo, material);
    var pata1 = new THREE.Mesh(patageo, material);
    var pata2 = new THREE.Mesh(patageo, material);
    var pata3 = new THREE.Mesh(patageo, material);
    var pata4 = new THREE.Mesh(patageo, material);

    pata1.position.x = 2.4;
    pata1.position.z = 2.4;
    pata2.position.x = 2.4;
    pata2.position.z = -2.4;
    pata3.position.x = -2.4;
    pata3.position.z = 2.4;
    pata4.position.x = -2.4;
    pata4.position.z = -2.4;

    this.add(tablonmesh);
    this.add(pata1);
    this.add(pata2);
    this.add(pata3);
    this.add(pata4);

    this.englobante = new THREE.Box3();
    this.englobante.setFromObject(this);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Mesa }
