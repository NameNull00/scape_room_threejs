import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

class Llave extends THREE.Object3D {
  constructor() {
    super();

    var modelo_loader = new OBJLoader();
    var material_loader = new MTLLoader();

    material_loader.load('../models/Llave/key.mtl',
      (material) => {
        modelo_loader.setMaterials(material);
        modelo_loader.load('../models/Llave/key.obj',
          (obj) => {
            obj.scale.set(0.1,0.1,0.1);
            obj.rotateZ(Math.PI/2);
            this.add(obj);
          },
          null, null);
      });
  }



  update() {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }

}

export { Llave }
