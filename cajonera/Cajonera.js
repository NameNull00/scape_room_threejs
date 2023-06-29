import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { Armazon } from '../armazon/Armazon.js'
import { Cajon } from '../cajon/Cajon.js'
import * as TWEEN from '../libs/tween.esm.js'

class Cajonera extends THREE.Object3D {
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
    var pata_geo = new THREE.BoxGeometry(1,1,1);
    var tablon_geo = new THREE.BoxGeometry(19, 0.2, 5.6);
    tablon_geo.translate(0, 5.35, 0.2);

    var tablon = new THREE.Mesh(tablon_geo, material);

    var pata1 = new THREE.Mesh(pata_geo, material);
    pata1.position.x = 8.75;
    pata1.position.y = -5.75;
    pata1.position.z = -2.1;
    var pata2 = new THREE.Mesh(pata_geo, material);
    pata2.position.x = 8.75;
    pata2.position.y = -5.75;
    pata2.position.z = 2.1;
    var pata3 = new THREE.Mesh(pata_geo, material);
    pata3.position.x = -8.75;
    pata3.position.y = -5.75;
    pata3.position.z = 2.1;
    var pata4 = new THREE.Mesh(pata_geo, material);
    pata4.position.x = -8.75;
    pata4.position.y = -5.75;
    pata4.position.z = -2.1;

    var armazon = new Armazon();
    this.cajon1 = new Cajon(true);
    this.cajon1.position.x = 5;
    this.cajon1.position.y = 2.25;
    this.cajon2 = new Cajon(false);
    this.cajon2.position.x = 5;
    this.cajon2.position.y = -2.25;
    this.cajon3 = new Cajon(false);
    this.cajon3.position.x = -5;
    this.cajon3.position.y = 2.25;
    this.cajon4 = new Cajon(false);
    this.cajon4.position.x = -5;
    this.cajon4.position.y = -2.25;

    this.add(armazon);
    this.add(this.cajon1);
    this.add(this.cajon2);
    this.add(this.cajon3);
    this.add(this.cajon4);
    this.add(pata1);
    this.add(pata2);
    this.add(pata3);
    this.add(pata4);
    this.add(tablon);

    this.englobante = new THREE.Box3();
    this.englobante.setFromObject(this);

  }

  update () {
    TWEEN.update();
    this.cajon1.update();
    this.cajon2.update();
    this.cajon3.update();
    this.cajon4.update();
  }
}

export { Cajonera }
