import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Armazon extends THREE.Object3D {
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

    var armazon_geo = new THREE.BoxGeometry(18.5, 10.5, 5.2);
    var hueco_geo = new THREE.BoxGeometry(7, 3, 5);
    var hueco1 = new THREE.Mesh(hueco_geo, material);
    hueco1.position.x = 5;
    hueco1.position.y = 2.25;
    hueco1.position.z = 0.1;
    var hueco2 = new THREE.Mesh(hueco_geo, material);
    hueco2.position.x = 5;
    hueco2.position.y = -2.25;
    hueco2.position.z = 0.1;
    var hueco3 = new THREE.Mesh(hueco_geo, material);
    hueco3.position.x = -5;
    hueco3.position.y = 2.25;
    hueco3.position.z = 0.1;
    var hueco4 = new THREE.Mesh(hueco_geo, material);
    hueco4.position.x = -5;
    hueco4.position.y = -2.25;
    hueco4.position.z = 0.1;
    var armazon = new THREE.Mesh(armazon_geo, material);
    var armazon_csg = new CSG();
    armazon_csg.union([armazon]);
    armazon_csg.subtract([hueco1, hueco2, hueco3, hueco4]);
    var armazon_model = armazon_csg.toMesh();
    this.add(armazon_model);
  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Armazon }
