import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Desague extends THREE.Object3D {
  constructor() {
    super();

    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/aluminio.jpg');
    const bumpTexture = textureLoader.load('../imgs/aluminio.jpg');

    const rmaterial = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
    });

    var roscaggeo = new THREE.CylinderGeometry(5, 5, 1, 30, 30);
    var huecogeo = new THREE.CylinderGeometry(1.2, 1.2, 1, 3, 3, false, 0);
    var tuercageo = new THREE.SphereGeometry(1.1, 30, 30);
    var endidurageo = new THREE.BoxGeometry(0.2, 10, 10);
    endidurageo.translate(0,5,0);

    var tuerca = new THREE.Mesh(tuercageo, rmaterial);
    var endidura = new THREE.Mesh(endidurageo, rmaterial);

    var csgtuerca = new CSG();
    csgtuerca.union([tuerca]);
    csgtuerca.subtract([endidura]);
    var tuercad = csgtuerca.toMesh();

    var huecos = [];

    var seccion = 2*Math.PI/6;

    huecogeo.translate(0,0, -2.8);

    for(var i = 0; i < 6; i++){
        huecos.push(new THREE.Mesh(huecogeo, rmaterial));
        huecos[i].rotateY(seccion*i);
    }

    var roscag = new THREE.Mesh(roscaggeo, rmaterial);

    var csg = new CSG();
    csg.union([roscag, tuercad]);
    for(var i = 0; i < 6; i++){
      csg.subtract([huecos[i]]);
    }

    var model = csg.toMesh();
    this.add(model);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Desague }
