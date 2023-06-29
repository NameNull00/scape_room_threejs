import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Puertita extends THREE.Object3D {
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

        var puertita_geo = new THREE.BoxGeometry(1.5,3,0.2);

        puertita_geo.translate(0.75,0,0);

        var puertita = new THREE.Mesh(puertita_geo, material);

        this.tweenp = new TWEEN.Tween(puertita.rotation).to({y: -(Math.PI/2)}, 2000);
        this.add(puertita);


    }

    update () {
        TWEEN.update();
    }

    triggerAnimation(){
        this.tweenp.start();
    }
}

export { Puertita }


