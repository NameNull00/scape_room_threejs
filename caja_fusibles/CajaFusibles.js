import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { Fusible } from '../fusible/fusible.js';

class CajaFusibles extends THREE.Object3D {
  constructor() {
    super();

    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/aluminio.jpg');
    const bumpTexture = textureLoader.load('../imgs/aluminio.jpg');

    const rmaterial = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
      color: 0xadd8e6
    });

    var bigCajageo = new THREE.BoxGeometry(15.5,16,8);
    var smallCajageo = new THREE.BoxGeometry(13.5,13.2,7);
    smallCajageo.translate(0,0,0.5);

    var bigCaja = new THREE.Mesh(bigCajageo, rmaterial);
    var smallCaja = new THREE.Mesh(smallCajageo, rmaterial);

    var csg = new CSG();
    csg.union([bigCaja]);
    csg.subtract([smallCaja]);

    var contenedor = csg.toMesh();
    this.f1 = new Fusible();
    var f2 = new Fusible();

    this.f1.position.x = -3.2;
    f2.position.x = 3.2;

    this.f1.visible = false;

    this.add(contenedor);
    this.add(this.f1);
    this.add(f2);

    this.englobante = new THREE.Box3();
    this.englobante.setFromObject(this);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { CajaFusibles }
