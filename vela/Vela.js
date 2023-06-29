import * as THREE from '../libs/three.module.js'

class Vela extends THREE.Object3D {
  constructor() {
    super();

    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/cera.jpg');
    const bumpTexture = textureLoader.load('../imgs/cera-bump.jpg');

    const materialc = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
    });

    const materialm = new THREE.MeshPhysicalMaterial({
      color: 0xff8c00, // color blanco
      transparent: true, // material transparente
      opacity: 0.6, // opacidad del material
      transmission: 0.9, // transmisión de la luz
      clearcoat: 0.5, // capa de barniz
      clearcoatRoughness: 0.1,
      emissive: 0xff8c00, // emissive color (white in this case)
      emissiveIntensity: 0.7 // rugosidad de la capa de barniz
    });

    var light = new THREE.PointLight(0xff8c00, 0.1);

    light.position.set(0, 4.5, 0);

    var vela_geo = new THREE.CylinderGeometry(1, 1, 7, 30, 30);
    var mecha_geo = new THREE.CylinderGeometry(0.01,0.1,1,30,30);

    mecha_geo.translate(0,4,0);

    var vela = new THREE.Mesh(vela_geo, materialc);
    var mecha = new THREE.Mesh(mecha_geo, materialm);

    this.add(vela);
    this.add(mecha);
    this.add(light);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Vela }
