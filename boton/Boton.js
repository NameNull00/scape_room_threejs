import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { BoxGeometry } from 'three';

class Boton extends THREE.Object3D {
  constructor() {
    super();

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/aluminio.jpg');
    const bumpTexture = textureLoader.load('../imgs/aluminio.jpg');

    const bmaterial = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
      color: 0xff0000
    });

    const mmaterial = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
    });

    var botongeo = new THREE.CylinderGeometry(2, 2, 1.5, 30, 30);
    botongeo.rotateX(Math.PI/2);
    var marcogeo = new THREE.BoxGeometry(6, 6, 1);
    marcogeo.translate(0, 0, -1.25);

    var boton = new THREE.Mesh(botongeo, bmaterial);
    var marco = new THREE.Mesh(marcogeo, mmaterial);

    this.add(marco);
    this.add(boton);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Boton }
