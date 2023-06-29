import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Fusible extends THREE.Object3D {
  constructor() {
    super();

    const smaterial = new THREE.MeshStandardMaterial({
      color: 0xffa500 // grey color in hexadecimal format
    });

    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/aluminio.jpg');
    const bumpTexture = textureLoader.load('../imgs/aluminio.jpg');

    const rmaterial = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
    });


    var extgeo = new THREE.CylinderGeometry(3, 3, 12, 30, 30);
    var intgeo = new THREE.CylinderGeometry(2.7, 2.7, 12, 30, 30);
    var accentgeo = new THREE.CylinderGeometry(1, 1, 1.2, 30, 30);

    var exterior = new THREE.Mesh(extgeo, smaterial);
    var interiorcsg = new THREE.Mesh(intgeo, smaterial);
    var interior = new THREE.Mesh(intgeo, rmaterial);
    var accent = new THREE.Mesh(accentgeo, rmaterial);

    var csg = new CSG();
    csg.union([exterior]);
    csg.subtract([interiorcsg]);

    var exteriorvacio = csg.toMesh();

    this.add(exteriorvacio);
    this.add(interior);
    accent.position.y = 6.6;
    this.add(accent);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Fusible }
