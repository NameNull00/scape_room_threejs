import * as THREE from '../libs/three.module.js'

class Bombilla extends THREE.Object3D {
  constructor() {
    super();

    // El material se usa desde varios métodos. Por eso se alamacena en un atributo

    var shape = new THREE.Shape();
    shape.lineTo(0.1,0);
    shape.bezierCurveTo(0.1, 0, 4.3, 0.7, 1.7, 4.8);
    shape.bezierCurveTo(1.7,4.8, 0.96, 5.67, 1, 6.3);
    shape.lineTo(1,7.5);
    shape.lineTo(0.0001,7.5);



    var roscashape = new THREE.Shape();
    roscashape.lineTo(1.4, 0);
    roscashape.lineTo(1.4, 1.5);
    roscashape.lineTo(0.1, 2.3);
    roscashape.lineTo(0.0001, 2.3);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // color blanco
      transparent: true, // material transparente
      opacity: 0.6, // opacidad del material
      transmission: 0.9, // transmisión de la luz
      clearcoat: 0.5, // capa de barniz
      clearcoatRoughness: 0.1,
      emissive: 0xffffff, // emissive color (white in this case)
      emissiveIntensity: 0.9 // rugosidad de la capa de barniz
    });

    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/aluminio.jpg');
    const bumpTexture = textureLoader.load('../imgs/aluminio.jpg');

    const rmaterial = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
    });

    const cmaterial = new THREE.MeshStandardMaterial({
      color: 0xff8080 // grey color in hexadecimal format
    });


    //var material = new THREE.MeshNormalMaterial();
    var bombillageo = new THREE.LatheGeometry(shape.extractPoints().shape, 50, 0, Math.PI*2);
    var roscageo = new THREE.LatheGeometry(roscashape.extractPoints().shape, 50, 0, Math.PI*2);
    var cuerdageo = new THREE.CylinderGeometry(0.1, 0.1, 7);
    var rosca = new THREE.Mesh(roscageo, rmaterial);
    var bombilla = new THREE.Mesh(bombillageo, material);
    var cuerda = new THREE.Mesh(cuerdageo, cmaterial);

    rosca.position.y = 6.42;
    cuerda.position.y = 12.22;

    this.add(rosca);
    this.add(cuerda);
    this.add(bombilla);
    this.add(light);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Bombilla }
