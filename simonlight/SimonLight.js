import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class SimonLight extends THREE.Object3D {
  constructor(color) {
    super();

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // white color
      transparent: true, // transparent material
      opacity: 0.6, // material opacity
      transmission: 0.9, // light transmission
      clearcoat: 0.5, // clearcoat layer
      clearcoatRoughness: 0.1, // roughness of the clearcoat layer
      emissive: color, // emissive color (white in this case)
      emissiveIntensity: 0.0 // emissive intensity (controls the strength of emission)
    });

    this.light = new THREE.PointLight(color, 0);
    this.light.position.set(0, 1, 0);
    this.imclicked = false;


    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/aluminio.jpg');
    const bumpTexture = textureLoader.load('../imgs/aluminio.jpg');

    const rmaterial = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 1,
    });

    var cristalgeo = new THREE.CylinderGeometry(5, 5, 1.5, 30, 30);
    var panelgeo = new THREE.CylinderGeometry(6, 6, 1, 30, 30);

    var cristal = new THREE.Mesh(cristalgeo, this.material);
    var panel = new THREE.Mesh(panelgeo, rmaterial);

    cristal.position.y = 1.25;

    this.intensity = { value: 0.3 };
    this.tween = new TWEEN.Tween(this.intensity)
      .to({ value: 0.3 }, 1000) // Tween to intensity 1 over 1 second
      .onUpdate(() => {
      this.light.intensity = 0.3;
      this.material.emissiveIntensity = 1;
    })
    .onComplete(() => {
      this.light.intensity = 0;
      this.material.emissiveIntensity = 0;
    });

    this.larga = new TWEEN.Tween(this.intensity)
      .to({value: 0.3}, 2000)
      .onUpdate(() => {
        this.light.intensity = 0.3;
        this.material.emissiveIntensity = 1;
      })
      .onComplete(() => {
        this.light.intensity = 0;
        this.material.emissiveIntensity = 0;
      });

    this.corta = new TWEEN.Tween(this.intensity)
      .to({value: 0.3}, 500)
      .onUpdate(() => {
        this.light.intensity = 0.3;
        this.material.emissiveIntensity = 1;
      })
      .onComplete(() => {
        this.light.intensity = 0;
        this.material.emissiveIntensity = 0;
      });


    this.d = new TWEEN.Tween(this.intensity)
    .to({value: 0.3}, 0)
    .onComplete(() => {
      this.larga.start();
      this.d2.delay(2100).start();
    });

    this.d2 = new TWEEN.Tween(this.intensity)
    .to({value: 0.3}, 0)
    .onComplete(() => {
      this.corta.start();
      this.d3.delay(600).start();
    });

    this.d3 = new TWEEN.Tween(this.intensity)
    .to({value: 0.3}, 0)
    .onComplete(() => {
      this.corta.start();
      this.i.delay(2600).start();
    });

    this.i = new TWEEN.Tween(this.intensity)
    .to({value: 0.3}, 0)
    .onComplete(() => {
      this.corta.start();
      this.i2.delay(600).start();
    });

    this.i2 = new TWEEN.Tween(this.intensity)
    .to({value: 0.3}, 0)
    .onComplete(() => {
      this.corta.start();
      this.e.delay(2600).start();
    });

    this.e = new TWEEN.Tween(this.intensity)
    .to({value: 0.3}, 0)
    .onComplete(() => {
      this.corta.start();
    });


    this.add(cristal);
    this.add(panel);
    this.add(this.light);

  }

  update () {
    TWEEN.update();
  }

  changelight(){
    if(this.material.emissiveIntensity == 1){
      this.material.emissiveIntensity = 0;
      this.light.intensity = 0;
    }
    else{
      this.material.emissiveIntensity = 1;
      this.light.intensity = 0.3;
    }
  }

  clickSl(){
    this.tween.start();
    this.imclicked = true;
    var listener = new THREE.AudioListener();
    var audioLoader = new THREE.AudioLoader();
    var audio = new THREE.Audio(listener);

    audioLoader.load('../Music/Beep.wav', function(buffer) {
      audio.setBuffer(buffer);
      audio.setVolume(0.35);
      audio.play();
    });

    this.add(listener);
  }

  triggerMorse(){
    var listener = new THREE.AudioListener();
    var audioLoader = new THREE.AudioLoader();
    var audio = new THREE.Audio(listener);

    audioLoader.load('../Music/Morse.wav', function(buffer) {
      audio.setBuffer(buffer);
      audio.setVolume(0.35);
      audio.play();
    });

    this.add(listener);
    this.d.delay(600).start();
  }
}

export { SimonLight }
