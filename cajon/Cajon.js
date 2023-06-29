import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Rosca } from '../rosca/Rosca.js'

class Cajon extends THREE.Object3D {
  constructor(engranaje) {
    super();


    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/wood.jpg');
    const bumpTexture = textureLoader.load('../imgs/wood-bump.jpg');

    const material = new THREE.MeshStandardMaterial({
      color: 0xd2b4bf,
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
    });

    var pomo_shape = new THREE.Shape();
    pomo_shape.moveTo(0.0001, 0);
    pomo_shape.lineTo(0.25,0);
    pomo_shape.bezierCurveTo(0.25,0,0.2,0.5,0.35,0.35);
    pomo_shape.bezierCurveTo(0.35,0.35,0.5,0.47,0.5,0.55);
    pomo_shape.bezierCurveTo(0.5,0.55,0.5,0.8,0.0001,0.8);
    var pomo_geo = new THREE.LatheGeometry(pomo_shape.extractPoints().shape,50);
    pomo_geo.rotateX(Math.PI/2);
    pomo_geo.translate(0, 0, 2.49);
    var pomo = new THREE.Mesh(pomo_geo, material);
    var cajon_geo = new THREE.BoxGeometry(7, 3, 5);
    var hueco_geo = new THREE.BoxGeometry(6.6,2.8,4.6);
    hueco_geo.translate(0,0.1,0);
    var cajon = new THREE.Mesh(cajon_geo, material);
    var hueco = new THREE.Mesh(hueco_geo, material);
    var csg_cajon = new CSG();
    csg_cajon.union([cajon]);
    csg_cajon.subtract([hueco]);
    var cajon_model = csg_cajon.toMesh();
    this.abierto = false;
    this.tween = new TWEEN.Tween(this.position)
    .to({ z: 4.6 }, 2000)
    ;
    this.tween2 = new TWEEN.Tween(this.position)
    .to({ z: 0 }, 2000)
    ;
    this.rosca = new Rosca();
    this.rosca.translateY(-1.1);
    this.rosca.scale.set(0.28,0.28,0.28);
    if(engranaje){
      this.add(this.rosca);
    }
    this.add(cajon_model);
    this.add(pomo);

    this.englobante = new THREE.Box3();
    this.englobante.setFromObject(this);

  }

  update () {
    TWEEN.update();
  }

  triggerAnimation(){
    if(!this.abierto){
      this.tween.start();
      this.abierto = true;
    }
    else{
      this.tween2.start();
      this.abierto = false;
    }
  }
}

export { Cajon }
