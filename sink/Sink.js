import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { Desague } from '../desague/Desague.js'

class Sink extends THREE.Object3D {
  constructor() {
    super();

    var shape = new THREE.Shape();
    shape.lineTo(2.3,0);
    shape.bezierCurveTo(2.3, 0, 2.8, 0, 2.8, 0.5);
    shape.lineTo(2.8,2.8);
    shape.lineTo(-2.8,2.8);
    shape.lineTo(-2.8,0.5);
    shape.bezierCurveTo(-2.8,0.5,-2.8,0,-2.3,0);
    shape.lineTo(0,0);

    var lshape = new THREE.Shape();
    lshape.moveTo(0.0001);
    lshape.lineTo(4, 0);
    lshape.bezierCurveTo(4, 0, 5, 0, 5, 4);
    lshape.lineTo(4.2,4);
    lshape.bezierCurveTo(4.2, 4, 4.2, 0.8, 4, 0.8);
    lshape.lineTo(0.0001, 0.8);

    var cortegeo = new THREE.BoxGeometry(50, 50, 200);
    cortegeo.translate(0,0,-101.85);

    var cuencogeo = new THREE.LatheGeometry(lshape.extractPoints().shape, 50, 0, Math.PI*2);

    const textureLoader = new THREE.TextureLoader();
    const diffuseTexture = textureLoader.load('../imgs/porcelana.jpg');

    const material = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
    });

    var options = { depth : 15 , steps : 10 , curveSegments : 20, bevelThickness : 0 , bevelSize : 0, bevelSegments : 0} ;
    var geometry = new THREE. ExtrudeGeometry ( shape , options ) ;
    var sink = new THREE.Mesh(geometry, material);
    sink.rotateX(-(Math.PI/2));

    var sinkc = new THREE.Mesh(cuencogeo, material);
    var corte = new THREE.Mesh(cortegeo, material);
    var desague = new Desague();
    desague.scale.set(0.1,0.1,0.1);
    desague.translateZ(0.4);
    desague.translateY(15.5);

    var csg = new CSG();
    csg.union([sinkc]);
    csg.subtract([corte]);
    var model = csg.toMesh();

    model.translateY(14.5);
    model.translateZ(-1.5);

    this.add(sink);
    this.add(model);
    this.add(desague);

    this.englobante = new THREE.Box3();
    this.englobante.setFromObject(this);

  }

  update () {
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Sink }
