import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Manual extends THREE.Object3D {
  constructor() {
    super();

    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/Manual.png');

    const material = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
    });

    var mangeo = new THREE.PlaneGeometry(12, 16);

    var man = new THREE.Mesh(mangeo, material);

    this.add(man);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Manual }
