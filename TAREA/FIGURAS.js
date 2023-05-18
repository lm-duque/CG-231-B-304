
/**CREACION DEL ESCENARIO */
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000);
camera.position.z = 4.5;
camera.position.x = -5.2;
camera.position.y = 2;

camera.rotation.set(0, -0.5, 0);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

// **LUZ DE ESCENARIO**
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

const size = 150;
const divisions = 160;
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// ** FUNCION TRONCO PIRAMIDE **
function troncoPiramide(altura, numeroLados, apotema, valorPorcentual) {
    // Crear geometría del poliedro truncado
    var geometria = new THREE.BufferGeometry();
    var vertices = [];

    // Calcular ángulo entre los lados del polígono base
    var angulo = (2 * Math.PI) / numeroLados;

    // Calcular altura del poliedro truncado
    var alturaTruncada = altura * valorPorcentual;

    // Crear vértices del polígono base
    for (var i = 0; i < numeroLados; i++) {
        var x = Math.cos(angulo * i) * apotema;
        var y = Math.sin(angulo * i) * apotema;
        vertices.push(x, y, 0);
    }
    
    // Crear vértices superiores
    for (var i = 0; i < numeroLados; i++) {
        var x = Math.cos(angulo * i) * apotema;
        var y = Math.sin(angulo * i) * apotema;
        vertices.push(x, y, 0);
    }
    
    // Crear vértices inferiores
    for (var i = 0; i < numeroLados; i++) {
        var x = Math.cos(angulo * i) * apotema * valorPorcentual;
        var y = Math.sin(angulo * i) * apotema * valorPorcentual;
        vertices.push(x, y, alturaTruncada);
    }

    // Agregar los vértices a la geometría
    geometria.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Crear caras del poliedro
    var caras = [];

    for (var i = 0; i < numeroLados; i++) {
        var baseIndex = i;
        var siguienteIndex = (i + 1) % numeroLados;
        var baseSuperiorIndex = i + numeroLados;
        var siguienteSuperiorIndex = (i + 1) % numeroLados + numeroLados;
        var baseInferiorIndex = i + numeroLados * 2;
        var siguienteInferiorIndex = (i + 1) % numeroLados + numeroLados * 2;

        // Caras laterales
        caras.push(baseIndex, siguienteSuperiorIndex, baseSuperiorIndex);
        caras.push(baseIndex, siguienteIndex, siguienteSuperiorIndex);

        // Caras superiores
        caras.push(baseIndex, baseSuperiorIndex, baseSuperiorIndex + numeroLados);
        caras.push(baseIndex, baseSuperiorIndex + numeroLados, baseIndex + numeroLados);

        // Caras inferiores
        caras.push(baseInferiorIndex, siguienteInferiorIndex, baseIndex + numeroLados * 2);
        caras.push(baseInferiorIndex, baseIndex + numeroLados * 2, baseIndex + numeroLados * 2 + numeroLados);
    }

    // Agregar las caras a la geometría
    geometria.setIndex(caras);

    // Calcular normales de las caras
    geometria.computeFaceNormals();

    // Crear material y objeto Mesh
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: true });
    //var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var poliedro = new THREE.Mesh(geometria, material);

    // Devolver el poliedro truncado
    return poliedro;
}

const nlados = 6;
const altura = 5;
const apotema = 2;
const vporcentual = 0.5;

const geometriaPoliedro = troncoPiramide(altura, nlados, apotema, vporcentual);
scene.add(geometriaPoliedro);

// ** FUNCION RENDER **
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();




