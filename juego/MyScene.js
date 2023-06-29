// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { PointerLockControls } from '../libs/PointerLockControls.js'
import { CSG } from '../libs/CSG-v2.js'

// Clases de mi proyecto

import { Caja } from '../caja/Caja.js'
import { Bombilla } from '../bombilla/Bombilla.js'
import { Desague } from '../desague/Desague.js'
import { SimonLight } from '../simonlight/SimonLight.js'
import { Rosca } from '../rosca/Rosca.js'
import { CajaFusibles } from '../caja_fusibles/CajaFusibles.js'
import { Mesa } from '../mesa/Mesa.js'
import { Sink } from '../sink/Sink.js'
import { Boton } from '../boton/Boton.js'
import { Cajonera } from '../cajonera/Cajonera.js'
import { Vela } from '../vela/Vela.js'
import { Completo } from '../reloj_completo/reloj_completo.js'
import { Plataforma } from '../plataforma/Plataforma.js'
import { Puerta } from '../puerta/Puerta.js'
import { Pandora } from '../pandora/Pandora.js'
import { Manual } from '../manual/Manual.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

class MyScene extends THREE.Scene {
  // Recibe el  div  que se ha creado en el  html  que va a ser el lienzo en el que mostrar
  // la visualización de la escena
  constructor(myCanvas) {
    super();

    this.clock = new THREE.Clock();

    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Se crea la interfaz gráfica de usuario
    this.floor = this.createGround();
    this.createWalls();

    // Construimos los distinos elementos que tendremos en la escena

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)

    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera(myCanvas);

    // Controlador del ratón
    this.mouse = new THREE.Vector2();

    // Raycaster para la interacción
    this.raycaster = new THREE.Raycaster();

    // Raycaster para las colisiones
    this.raycolisiones = new THREE.Raycaster();

    //Creación del fondo de la escena
    var path = "../imgs/Stars.jpg";
    var urls = [
      path, path,
      path, path,
      path, path
    ];
    var textureCube = new THREE.CubeTextureLoader().load(urls) ;
    this.background = textureCube;

    // Inicialización de los objetos para cargar los sonidos
    this.listener = new THREE.AudioListener();
    this.audioLoader = new THREE.AudioLoader();
    var audio = new THREE.Audio(this.listener);

    // Tema principal del juego
    this.audioLoader.load('../Music/MainTheme.mp3', function (buffer) {
      audio.setBuffer(buffer);
      audio.setLoop(true); // Set the audio to loop
      audio.setVolume(0.35);
      audio.play();
    });

    this.add(this.listener);

    //CREACION DE LOS OBJETOS
    this.caja = new Caja();
    this.bombilla = new Bombilla();
    this.desague = new Desague();
    // Luces simón dice
    this.sl1 = new SimonLight(0xff0000);
    this.sl2 = new SimonLight(0x00ff00);
    this.sl3 = new SimonLight(0x0000ff);
    this.sl4 = new SimonLight(0xffa500);
    // Engranajes
    this.r1 = new Rosca();
    this.r2 = new Rosca();
    this.r3 = new Rosca();
    this.cajafusibles = new CajaFusibles();
    this.mesa = new Mesa();
    this.sink = new Sink();
    this.boton = new Boton();
    this.cajonera = new Cajonera();
    // Velas
    this.v1 = new Vela();
    this.v2 = new Vela();
    this.v3 = new Vela();
    this.reloj = new Completo();
    this.plataforma_llave = new Plataforma('Llave');
    this.puerta = new Puerta();
    this.pandora = new Pandora();
    this.manual = new Manual();
    // Objetos que deben generar colisión
    this.fisicos = [this.caja, this.cajafusibles, this.mesa, this.sink, this.cajonera, this.reloj, this.puerta];

    // VARIABLES DE CONTROL DEL JUEGO
    // El jugador ha obtenido el fusible
    this.tengoFusible = false;
    // El jugador ha colocado el fusible
    this.fusibleColocado = false;
    // El jugador ha abierto la puerta del reloj
    this.puertaReloj = false;
    // El jugador ha colocado todos los engranajes
    this.puertainferior = false;
    // Cuantos engranajes ha conseguido el jugador
    this.roscasObtenidas = -1;
    // El jugador ha quitado la caja
    this.cajaremove = false;
    // El jugador tiene la llave
    this.tengo_llave = false;
    // El jugador ha abierto la caja de pandora
    this.cajaAbierta = false;
    // El jugador tiene el manual de código morse
    this.paper = false;
    // Número de luces pulsadas correctamente en el simón dice
    this.puzzle = 0;

    // VARIABLES DE LOS DIÁLOGOS HTML
    // Diálogo introductorio
    this.dialogIntro = document.getElementById('dialog');
    // Diálogo al abrir la puerta del reloj
    this.dialogClock = document.getElementById('clock_dialog');
    // Diálogo al coger el fusible
    this.dialogFusible = document.getElementById('fusible_dialog');
    // Diálogo al coger la llave
    this.dialogKey = document.getElementById('key_dialog');
    // Diálogo con el input para abrir la puerta
    this.dialogDoor = document.getElementById('door_dialog');
    // Diálogo si se intenta abrir la caja de pandora sin la llave
    this.dialogBoxLock = document.getElementById('box_lock_dialog');
    // Diálogo al coger el manual de código morse
    this.dialogTookPaper = document.getElementById('took_paper_dialog');
    // Diálogo para mostrar el manual
    this.dialogSeePaper = document.getElementById('see_paper_dialog');
    // Diálogo al tener el manual (pulse m para ver el manual)
    this.dialogControls = document.getElementById('controls_dialog');
    // Diálogo de que el juego se ha superado
    this.dialogFinal = document.getElementById('final');
    // Objeto input del diálogo de la puerta (la clave a introducir)
    this.inputPuerta = document.getElementById('dialog-input');

    // ANIMACIONES DE SECUENCIA, ACIERTO Y ERROR EN EL SIMON DICE
    var a = { value: 0 };

    // SECUENCIA
    this.animacion_secuencia = new TWEEN.Tween(a)
      .to({ value: 0.3 }, 1000)
      .onStart(() => {
        this.sl1.changelight();
        this.beepSound();
      })
      .onComplete(() => {
        this.sl1.changelight();
        this.anim2.start();
      });

    this.anim2 = new TWEEN.Tween(a)
      .to({ value: 0.3 }, 1000)
      .onStart(() => {
        this.sl3.changelight();
        this.beepSound();
      })
      .onComplete(() => {
        this.sl3.changelight();
        this.anim3.start();
      });

    this.anim3 = new TWEEN.Tween(a)
      .to({ value: 0.3 }, 1000)
      .onStart(() => {
        this.sl2.changelight();
        this.beepSound();
      })
      .onComplete(() => {
        this.sl2.changelight();
        this.anim4.start();
      });

    this.anim4 = new TWEEN.Tween(a)
      .to({ value: 0.3 }, 1000)
      .onStart(() => {
        this.sl4.changelight();
        this.beepSound();
      })
      .onComplete(() => {
        this.sl4.changelight();
      });

    // ACIERTO
    this.winningAnimation = new TWEEN.Tween(a)
      .delay(1500)
      .to({ value: 1 }, 500)
      .onStart(() => {
        this.beepSound();
        this.sl1.changelight();
        this.sl2.changelight();
        this.sl3.changelight();
        this.sl4.changelight();
      })
      .onComplete(() => {
        this.sl1.changelight();
        this.sl2.changelight();
        this.sl3.changelight();
        this.sl4.changelight();
        this.winanim2.start();
      });

    this.winanim2 = new TWEEN.Tween(a)
      .to({ value: 1 }, 500)
      .delay(150)
      .onComplete(() => {
        this.beepSound();
        this.sl1.changelight();
        this.sl2.changelight();
        this.sl3.changelight();
        this.sl4.changelight();
      });

    // ERROR
    this.mistakeAnimation = new TWEEN.Tween(a)
      .delay(1500)
      .to({ value: 1 }, 500)
      .onStart(() => {
        this.errorSound();
        this.sl1.changelight();
        this.sl2.changelight();
        this.sl3.changelight();
        this.sl4.changelight();
      })
      .onComplete(() => {
        this.mistanim2.start();
      });

    this.mistanim2 = new TWEEN.Tween(a)
      .to({ value: 1 }, 500)
      .delay(150)
      .onComplete(() => {
        this.errorSound();
        this.sl1.changelight();
        this.sl2.changelight();
        this.sl3.changelight();
        this.sl4.changelight();
      });


    // Colocar en la escena el reloj
    this.reloj.scale.set(10, 10, 10);
    this.reloj.rotateY(Math.PI / 2);
    this.reloj.translateY(-155);
    this.reloj.translateZ(-1000);
    this.add(this.reloj);

    // Colocar en la escena la caja de pandora
    this.pandora.scale.set(4, 4, 4);
    this.pandora.rotateY(Math.PI / 2);
    this.pandora.translateY(-50);
    this.pandora.translateZ(70);
    this.add(this.pandora);

    // Colocar en la escena las velas
    this.v1.scale.set(10, 10, 10);
    this.v2.scale.set(5, 5, 5);
    this.v3.scale.set(2.5, 4, 2.5);
    this.v1.translateY(-200);
    this.v2.translateY(-212.5);
    this.v3.translateY(-226);
    this.v1.translateX(800);
    this.v2.translateX(768);
    this.v3.translateX(775);
    this.v1.translateZ(500);
    this.v2.translateZ(490);
    this.v3.translateZ(478);
    this.add(this.v1);
    this.add(this.v2);
    this.add(this.v3);

    // Colocar en la escena la cajonera
    this.cajonera.scale.set(20, 16, 20);
    this.cajonera.translateX(946);
    this.cajonera.translateY(-115);
    this.cajonera.translateZ(-300);
    this.cajonera.rotateY(-Math.PI / 2);
    this.add(this.cajonera);

    // Colocar en la escena el manual
    this.manual.scale.set(10, 10, 10);
    this.manual.translateX(-500);
    this.manual.translateZ(-749);
    this.manual.translateY(60);
    this.add(this.manual);

    // Colocar en la escena la bombilla
    this.bombilla.scale.set(10, 10, 10);
    this.bombilla.translateY(87.6);
    this.add(this.bombilla);

    // Colocar en la escena la caja
    this.caja.scale.set(18, 18, 18);
    this.caja.translateX(550);
    this.caja.translateZ(380);
    this.caja.translateY(-179.8);
    this.add(this.caja);

    // Colocar en la escena el botón
    this.boton.scale.set(10, 10, 10);
    this.boton.translateZ(732.4);
    this.boton.translateX(500);
    this.boton.rotateY(Math.PI);
    this.add(this.boton);

    // Colocar en la escena las luces del simón dice
    this.sl1.translateZ(742.4);
    this.sl1.translateY(90);
    this.sl1.translateX(-288.33);
    this.sl1.rotateX(-(Math.PI / 2));
    this.sl2.translateZ(742.4);
    this.sl2.translateY(90);
    this.sl2.translateX(288.33);
    this.sl2.rotateX(-(Math.PI / 2));
    this.sl3.translateZ(742.4);
    this.sl3.translateY(-90);
    this.sl3.translateX(-288.33);
    this.sl3.rotateX(-(Math.PI / 2));
    this.sl4.translateZ(742.4);
    this.sl4.translateY(-90);
    this.sl4.translateX(288.33);
    this.sl4.rotateX(-(Math.PI / 2));

    this.sl1.scale.set(7.5, 7.5, 7.5);
    this.sl2.scale.set(7.5, 7.5, 7.5);
    this.sl3.scale.set(7.5, 7.5, 7.5);
    this.sl4.scale.set(7.5, 7.5, 7.5);

    this.add(this.sl1);
    this.add(this.sl2);
    this.add(this.sl3);
    this.add(this.sl4);

    // Colocar en la escena la plataforma con la llave
    this.plataforma_llave.translateZ(770.4);
    this.plataforma_llave.translateY(-30);
    this.plataforma_llave.rotateY(Math.PI);
    this.plataforma_llave.scale.set(3, 3, 3);
    this.add(this.plataforma_llave);

    // Colocar en la escena la caja de fusibles
    this.cajafusibles.translateZ(729.15);
    this.cajafusibles.translateX(-480);
    this.cajafusibles.rotateY(Math.PI);
    this.cajafusibles.scale.set(5, 5, 5);

    this.add(this.cajafusibles);

    // Colocar en la escena la mesa
    this.mesa.translateY(-140);
    this.mesa.scale.set(25, 19, 25);

    this.add(this.mesa);

    // Colocar en la escena el lavabo
    this.sink.scale.set(12, 10, 12);
    this.sink.translateY(-224.8);
    this.sink.translateX(-500);
    this.sink.translateZ(-709);
    this.add(this.sink);

    // Colocar en la escena el desague
    this.desague.scale.set(3.6, 3.6, 3.6);
    this.desague.translateY(-226.5);
    this.desague.translateZ(-580);
    this.desague.translateX(-500);

    this.add(this.desague);

    // Colocar en la escena los engranajes
    this.r1.scale.set(3.6, 3.6, 3.6);
    this.r1.translateY(-215);
    this.r1.translateX(522);
    this.add(this.r1);

    this.r2.scale.set(3.6, 3.6, 3.6);
    this.r2.translateY(-215);
    this.r2.translateX(550);
    this.r2.translateZ(380);
    this.add(this.r2);

    this.r3.scale.set(3.6, 3.6, 3.6);
    this.r3.translateY(-60);
    this.r3.translateZ(-709);
    this.r3.translateX(-500);
    this.add(this.r3);

    // Colocar en la escena la puerta
    this.puerta.scale.set(32, 32, 32);
    this.puerta.translateY(-32);
    this.puerta.translateX(678);
    this.puerta.translateZ(-749.9);
    this.add(this.puerta);

    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
  }

  // CARGA DE SONIDOS
  // Sonido de beep (luces)
  beepSound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Beep.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.35);
      audio2.play();
    });
  }

  // Sonido de click (botones)
  clickSound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Boton.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.35);
      audio2.play();
    });
  }

  // Sonido al coger/colocar un objeto
  pickSound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Colocar.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.35);
      audio2.play();
    });
  }

  // Sonido al fallar el simon dice
  errorSound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Error.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.35);
      audio2.play();
    });
  }

  // Sonido de puerta
  doorSound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Puerta.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.35);
      audio2.play();
    });
  }

  // Sonido de cajon
  drawerSound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Cajon.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.35);
      audio2.play();
    });
  }

  // Sonido de bloqueado
  lockedSound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Locked.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.35);
      audio2.play();
    });
  }

  // Sonido de apertura con llave
  openWithKeySound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Open.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.55);
      audio2.play();
    });
  }

  // Sonido de coger un papel
  paperSound() {
    var audio2 = new THREE.Audio(this.listener);

    this.audioLoader.load('../Music/Paper.wav', function (buffer) {
      audio2.setBuffer(buffer);
      audio2.setVolume(0.35);
      audio2.play();
    });
  }

  // Comportamiento al clickar
  onMouseDown(event) {
    if (this.raycaster.enabled) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Se lanza un rayo desde el centro de la pantalkla
      this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);

      const intersects = this.raycaster.intersectObjects(this.children, true);

      if (intersects.length > 0) {
        const object = intersects[0].object.parent;

        //Si se toma un engranaje
        if (object === this.r1 || object === this.r2 || object === this.r3 || object === this.cajonera.cajon1.rosca) {
          this.pickSound();
          if (object === this.cajonera.cajon1.rosca) {
            this.cajonera.cajon1.remove(object);
          }
          else {
            this.remove(object);
          }
          this.roscasObtenidas++;
        // Si se selecciona un cajon
        } else if (object === this.cajonera.cajon1 || object === this.cajonera.cajon2 || object === this.cajonera.cajon3 || object === this.cajonera.cajon4) {
          this.drawerSound();
          object.triggerAnimation();
        // Si no se ha completado el simón dice y se ha conectado el fusible
        } else if (this.puzzle < 4 && this.fusibleColocado) {
          // Si se selecciona el botón se reinicia el puzzle y se muestra la secuencia
          if (object === this.boton) {
            this.puzzle = 0;
            this.clickSound();
            this.animacion_secuencia.delay(2100).start();
            //Si se seleccionan en el orden correcto se muestra la llave si no se reinicia el puzzle
          } else if (object === this.sl1) {
            this.sl1.clickSl();
            if (this.puzzle !== 0) {
              this.puzzle = 0;
              this.mistakeAnimation.start();
            } else {
              this.puzzle = 1;
            }
          } else if (object === this.sl3) {
            this.sl3.clickSl();
            if (this.puzzle !== 1) {
              this.puzzle = 0;
              this.mistakeAnimation.start();
            } else {
              this.puzzle = 2;
            }
          } else if (object === this.sl2) {
            this.sl2.clickSl();
            if (this.puzzle !== 2) {
              this.puzzle = 0;
              this.mistakeAnimation.start();
            } else {
              this.puzzle = 3;
            }
          } else if (object === this.sl4) {
            this.sl4.clickSl();
            if (this.puzzle !== 3) {
              this.puzzle = 0;
              this.mistakeAnimation.start();
            } else {
              this.puzzle = 4;
              this.plataforma_llave.triggerAnimation();
              this.winningAnimation.start();
            }
          }
          // Si no se tiene el fusible y se selecciona
        } else if (!this.tengoFusible && object === this.reloj.inferior.plataforma.fusible) {
          this.pickSound();
          this.tengoFusible = true;
          this.reloj.inferior.plataforma.fusible.visible = false;
          this.dialogFusible.style.display = 'flex';
          this.controls.enabled = false;
          this.controlsDialog();
          // Si tengo el fusible no lo he conectado y selecciono la zona vacía de la caja de fusibles
        } else if (this.tengoFusible && !this.fusibleColocado && object === this.cajafusibles.f1) {
          this.pickSound();
          this.fusibleColocado = true;
          this.cajafusibles.f1.visible = true;
          // Si la puerta del reloj está abierta y selecciono el reloj, se muestran los engranajes que se tengan
        } else if (this.puertaReloj) {
          if (object === this.reloj.cuerpo || object.parent === this.reloj.cuerpo) {
            if (this.roscasObtenidas > -1) {
              this.pickSound();
              for (let i = 0; i < this.roscasObtenidas + 1; i++) {
                this.reloj.cuerpo.roscas[i].visible = true;
              }
              // Si están los 4 engranajes y no se ha abierto la puerta inferior se abre
              if (this.roscasObtenidas === 3 && !this.puertainferior) {
                this.reloj.inferior.triggerAnimation();
                this.puertainferior = true;
              }
            }
          }
          // Abrir la puerta del reloj si no está abierta
        } else if (object === this.reloj.cuerpo.puerta) {
          this.puertaReloj = true;
          this.doorSound();
          this.reloj.cuerpo.puerta.triggerAnimation();
          this.dialogClock.style.display = 'flex';
          this.controls.enabled = false;
          this.controlsDialog();
        }
        // Si aún no se ha quitado la caja y se selecciona
        if (!this.cajaremove && object === this.caja) {
          this.pickSound();
          this.remove(this.caja);
          this.cajaremove = true;
        }
        // Si no tengo la llave y la selecciono
        if (object.parent === this.plataforma_llave.llave && !this.tengo_llave) {
          this.pickSound();
          this.plataforma_llave.llave.visible = false;
          this.tengo_llave = true;
          this.dialogKey.style.display = 'flex';
          this.controls.enabled = false;
          this.controlsDialog();
        }
        // Si he seleccionado la caja de pandora y no tengo la llave
        if (object === this.pandora && !this.tengo_llave) {
          this.lockedSound();
          this.dialogBoxLock.style.display = 'flex';
          this.controls.enabled = false;
          this.controlsDialog();
        }
        // Si he seleccionado la caja de pandora tengo la llave y no está abierta se abre
        if (object === this.pandora && this.tengo_llave && !this.cajaAbierta) {
          this.openWithKeySound();
          this.cajaAbierta = true;
          this.pandora.tapa.triggerAnimation();
        }
        // Si le doy al botón de la caja de pandora
        if (object === this.pandora.boton && this.cajaAbierta) {
          this.clickSound();
          this.pandora.luz.triggerMorse();
        }
        // Si obtengo el manual
        if(object === this.manual){
          this.paperSound();
          this.remove(this.manual);
          this.dialogTookPaper.style.display = 'flex';
          this.controls.enabled = false;
          this.controlsDialog();
          this.paper = true;
        }
        var objectd = intersects[0].object;
        // Si le doy al pomo de la puerta
        if (objectd === this.puerta.pomo) {
          this.dialogDoor.style.display = 'flex';
          this.controls.enabled = false;
          this.controlsDialog();
          this.inputPuerta.focus();
        }
      }

      console.log(intersects[0]);
    }
  }


  createCamera(myCanvas) {
    // Create a perspective camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(500, 20, 500);
    var look = new THREE.Vector3(0, -1.5, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    // Create Pointer Lock Controls
    // Se crean los controles
    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false; // Disable controls initially
    if (this.dialogIntro) {
      this.dialogIntro.style.display = 'flex';
    }

    $(myCanvas).on('click', () => {
      this.controlsDialog();
    });

    // Handle keyboard input

    const onkeydown = (event) => {
      switch (event.code) {
        case 'KeyW':
          moveForward = true;
          break;
        case 'KeyA':
          moveLeft = true;
          break;
        case 'KeyS':
          moveBackward = true;
          break;
        case 'KeyD':
          moveRight = true;
          break;
          // Comportamiento cuando un diálogo se muestra
        case 'Enter':
          this.dialogIntro.style.display = 'none';
          this.dialogClock.style.display = 'none';
          this.dialogFusible.style.display = 'none';
          this.dialogKey.style.display = 'none';
          this.dialogDoor.style.display = 'none';
          this.dialogBoxLock.style.display = 'none';
          this.dialogTookPaper.style.display = 'none';
          this.dialogSeePaper.style.display = 'none';
          this.raycaster.enabled = true;
          this.controls.enabled = true;
          this.controlsDialog();
          // Si la clave de la puerta es la correcta se abre
          if ((this.inputPuerta.value === 'die' || this.inputPuerta.value === 'DIE') && !this.puerta.final){
            this.doorSound();
            this.puerta.triggerAnimation();
          }
          break;
        case 'KeyM':
          // Botón para abrir el manual de morse
          if(this.paper){
            this.dialogSeePaper.style.display = 'flex';
            this.controls.enabled = false;
            this.controlsDialog();
          }
      }
    }

    const onekeyup = (event) => {
      switch (event.code) {
        case 'KeyW':
          moveForward = false;
          break;
        case 'KeyA':
          moveLeft = false;
          break;
        case 'KeyS':
          moveBackward = false;
          break;
        case 'KeyD':
          moveRight = false;
          break;
      }
    }

    document.addEventListener('keydown', onkeydown);

    document.addEventListener('keyup', onekeyup);
  }

  // Si los controles están desactivados se inhabilitan los controles
  controlsDialog() {
    if (this.controls.enabled === false) {
      this.controls.unlock();
      this.dialogControls.style.display = 'none';
    }
    // En caso contrario se habilitan y si se tiene el manual se muestra un texto que dice que tecla pulsar para verlo
    else {
      this.controls.lock();
      if(this.paper){
        this.dialogControls.style.display = 'flex';
      }
    }
  }

  createGround() {
    // El suelo es un Mesh, necesita una geometría y un material.

    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry(2000, 0.2, 1500);

    // Texturas del techo y el suelo
    var texture = new THREE.TextureLoader().load('../imgs/marmol-blanco.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    var materialGround = new THREE.MeshPhongMaterial({ map: texture });

    var wallTexture = new THREE.TextureLoader().load('../imgs/ladrillo-difuso.png');
    var wallBump = new THREE.TextureLoader().load('../imgs/ladrillo-bump.png');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(16, 16);
    wallBump.wrapS = THREE.RepeatWrapping;
    wallBump.wrapT = THREE.RepeatWrapping;
    wallBump.repeat.set(16, 16);
    var wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      bumpMap: wallBump,
      bumpScale: 10,
    });

    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh(geometryGround, materialGround);
    var ceiling = new THREE.Mesh(geometryGround, wallMaterial);

    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -224.9;
    ceiling.position.y = 224.9;

    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add(ground);
    this.add(ceiling);
  }

  // Creación de los muros
  createWalls() {

    this.walls = [];

    var wallGeometry1 = new THREE.BoxGeometry(2000, 450, 0.2);
    var wallGeometry2 = new THREE.BoxGeometry(1500, 450, 0.2);
    var wallTexture = new THREE.TextureLoader().load('../imgs/ladrillo-difuso.png');
    var wallBump = new THREE.TextureLoader().load('../imgs/ladrillo-bump.png');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(22, 8);
    wallBump.wrapS = THREE.RepeatWrapping;
    wallBump.wrapT = THREE.RepeatWrapping;
    wallBump.repeat.set(22, 8);
    var wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      bumpMap: wallBump,
      bumpScale: 10,
    });
    var backWall_full = new THREE.Mesh(wallGeometry1, wallMaterial);
    var leftWall = new THREE.Mesh(wallGeometry2, wallMaterial);
    var rightWall = new THREE.Mesh(wallGeometry2, wallMaterial);
    var frontWall = new THREE.Mesh(wallGeometry1, wallMaterial);
    var hueco_back = new THREE.BoxGeometry(8, 12, 12);
    var hueco_back_mesh = new THREE.Mesh(hueco_back, wallMaterial);
    hueco_back_mesh.scale.set(32, 32, 32);
    hueco_back_mesh.translateY(-32);
    hueco_back_mesh.translateX(550);
    hueco_back_mesh.translateZ(-749.9);
    backWall_full.position.z = -750;

    // Se hace un hueco en un muro para la puerta
    var csg = new CSG();
    csg.union([backWall_full]);
    csg.subtract([hueco_back_mesh]);
    var backWall = csg.toMesh();

    frontWall.position.z = 750;
    leftWall.position.x = -1000;
    leftWall.rotation.y = -(Math.PI / 2);
    rightWall.position.x = 1000;
    rightWall.rotation.y = Math.PI / 2;

    this.walls.push(backWall);
    this.walls.push(leftWall);
    this.walls.push(rightWall);
    this.walls.push(frontWall);

    this.add(this.walls[0]);
    this.add(this.walls[1]);
    this.add(this.walls[2]);
    this.add(this.walls[3]);

  }

  createRenderer(myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  getCamera() {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }

  setCameraAspect(ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    // Este método es llamado cada vez que el usuario modifica el tamaño de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    // Y también el tamaño del renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }


  update() {
    requestAnimationFrame(() => this.update());

    // Update scene elements

    // Update camera position using the controller
    // this.controls.update(this.clock.getDelta());

    // Gestión de colisiones con los objetos (falla)
    var cameraPosition = new THREE.Vector3();
    this.camera.getWorldPosition(cameraPosition);

    var direction = new THREE.Vector3(0, -0.65, -1);
    this.raycolisiones.set(cameraPosition, direction);
    var rayForward = this.raycolisiones.ray;
    var intersectsForward = this.raycolisiones.intersectObjects(this.fisicos, true);

    direction.set(-1, -0.65, 0); // Dirección hacia la izquierda (eje x negativo)
    this.raycolisiones.set(cameraPosition, direction);
    var rayLeft = this.raycolisiones.ray;
    var intersectsLeft = this.raycolisiones.intersectObjects(this.fisicos, true);

    direction.set(1, -0.65, 0); // Dirección hacia la derecha (eje x positivo)
    this.raycolisiones.set(cameraPosition, direction);
    var rayRight = this.raycolisiones.ray;
    var intersectsRight = this.raycolisiones.intersectObjects(this.fisicos, true);

    direction.set(0, -0.65, 1); // Dirección hacia atrás (eje z positivo)
    this.raycolisiones.set(cameraPosition, direction);
    var rayBackward = this.raycolisiones.ray;
    var intersectsBackward = this.raycolisiones.intersectObjects(this.fisicos, true);

    const moveSpeed = 10;

    // Movimiento

    if (this.controls.enabled) {
      if (moveForward && !(intersectsForward.length > 0 && intersectsForward[0].distance <= 160)) {
        this.controls.moveForward(moveSpeed);
      }
      if (moveBackward && !(intersectsBackward.length > 0 && intersectsBackward[0].distance <= 160)) {
        this.controls.moveForward(-moveSpeed);
      }

      // Move left/right
      if (moveLeft && !(intersectsLeft.length > 0 && intersectsLeft[0].distance <= 160)) {
        this.controls.moveRight(-moveSpeed);
      }
      if (moveRight && !(intersectsRight.length > 0 && intersectsRight[0].distance <= 160)) {
        this.controls.moveRight(moveSpeed);
      }
    }

    // Colisiones con los muros
    if (this.camera.position.x > 997) {
      this.camera.position.x = 997;
    }

    if (this.camera.position.x < -997) {
      this.camera.position.x = -997;
    }

    if (this.camera.position.z > 747) {
      this.camera.position.z = 747;
    }

    if (this.camera.position.z < -747) {
      this.camera.position.z = -747;
    }

    // Si se ha abierto la puerta acaba el juego mostrando el diálogo final
    if(this.puerta.final){
      this.dialogFinal.style.display = 'flex';
    }
    this.reloj.update();

    this.renderer.render(this, this.getCamera());
  }
}


/// La función   main
$(function () {

  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
