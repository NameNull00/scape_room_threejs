import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Caja extends THREE.Object3D {
  constructor() {
    super();

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/carton.jpg');
    const bumpTexture = textureLoader.load('../imgs/carton-normal.jpg');

    const material = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      normalMap: bumpTexture,
    });
    var BigCaja = new THREE.BoxGeometry(5,5,5);
    var SmallCaja = new THREE.BoxGeometry(4.8,4.8,4.8);
    var pestgeo = new THREE.BoxGeometry(5,0.2,2.5);
    var pestgeo2 = new THREE.BoxGeometry(5,0.2,2.5);
    var pestgeo3 = new THREE.BoxGeometry(5,0.2,2.5);
    var pestgeo4 = new THREE.BoxGeometry(5,0.2,2.5);
    pestgeo2.rotateY(Math.PI/2);
    pestgeo4.rotateY(Math.PI/2);
    SmallCaja.translate(0,-0.1,0);
    pestgeo2.translate(3.75,-2.4,0);
    pestgeo.translate(0,-2.4,3.75);
    pestgeo4.translate(-3.75,-2.4,0);
    pestgeo3.translate(0,-2.4,-3.75);

    var pest = new THREE.Mesh(pestgeo, material);
    var pest2 = new THREE.Mesh(pestgeo2, material);
    var pest3 = new THREE.Mesh(pestgeo3, material);
    var pest4 = new THREE.Mesh(pestgeo4, material);
    var BigCajaobj = new THREE.Mesh(BigCaja, material);
    var SmallCajaobj = new THREE.Mesh(SmallCaja, material);

    var csg = new CSG();
    csg.union([BigCajaobj, pest, pest2, pest3, pest4]);
    csg.subtract([SmallCajaobj]);

    var model = csg.toMesh();
    this.add(model);

    this.englobante = new THREE.Box3();
    this.englobante.setFromObject(this);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Caja }
