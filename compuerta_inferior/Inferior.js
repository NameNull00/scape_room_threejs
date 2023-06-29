import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Plataforma } from '../plataforma/Plataforma.js'
import { Puertita } from './puertita.js'

class Inferior extends THREE.Object3D {
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


    var shape = new THREE.Shape();
    shape.lineTo(7,0);
    shape.lineTo(7,5);
    shape.lineTo(5,7);
    shape.lineTo(-5,7);
    shape.lineTo(-7,5);
    shape.lineTo(-7,0);
    shape.lineTo(0,0);

    const extrusionSettings = {
        depth: 5,
        bevelEnabled: false
    };

    var soport_geo = new THREE.ExtrudeGeometry(shape, extrusionSettings);
    var soport = new THREE.Mesh(soport_geo, material);

    var hueco = new THREE.BoxGeometry(3, 3, 20);
    var hueco_mesh = new THREE.Mesh(hueco, material);

    hueco_mesh.translateY(3.5);

    var csg = new CSG();
    csg.union([soport]);
    csg.subtract([hueco_mesh]);

    var model = csg.toMesh();
    this.plataforma = new Plataforma('Fusible');

    this.plataforma.scale.set(0.3,0.3,0.3);
    this.plataforma.translateY(3.5);

    this.puertita = new Puertita();
    this.puertita2 = new Puertita();

    this.puertita.translateX(-1.5);
    this.puertita2.rotateZ(Math.PI);
    this.puertita2.translateX(-1.5);

    this.puertita.translateY(3.5);
    this.puertita2.translateY(-3.5);
    this.puertita.translateZ(4.9);
    this.puertita2.translateZ(4.9);


    this.add(model);
    this.add(this.plataforma);
    this.add(this.puertita);
    this.add(this.puertita2);



  }

  update () {
    TWEEN.update();
  }

  triggerAnimation(){
    this.plataforma.triggerAnimation();
    this.puertita.triggerAnimation();
    this.puertita2.triggerAnimation();
  }
}

export { Inferior }
