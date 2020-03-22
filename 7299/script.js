var Engine = BABYLON.Engine, Scene = BABYLON.Scene, ArcRotateCamera = BABYLON.ArcRotateCamera, Vector3 = BABYLON.Vector3, MeshBuilder = BABYLON.MeshBuilder, TransformNode = BABYLON.TransformNode, HemisphericLight = BABYLON.HemisphericLight, InstancedMesh = BABYLON.InstancedMesh, PBRMaterial = BABYLON.PBRMaterial, Color4 = BABYLON.Color4, DefaultRenderingPipeline = BABYLON.DefaultRenderingPipeline;
(function main() {
    var engine = new Engine(document.querySelector('canvas'), false);
    var scene = createScene({ engine: engine });
    engine.runRenderLoop(function () { scene.render(); });
    addEventListener('resize', function () { engine.resize(); });
})();
function createScene(_a) {
    var engine = _a.engine;
    var width = 0.01; // stroke w
    var height = 10; // stroke h
    var depth = 0.01; // stroke d
    var N = 1000; // no. strokes
    var R = 10; // band radius
    var os = Math.PI * 10; // offset ang
    var turnsPerSec = 0.2; // anim speed
    var scene = new Scene(engine);
    scene.clearColor.set(0, 0, 0, 1);
    var camera = new ArcRotateCamera('', 0, 0, R * 5, new Vector3(0, 0, 0), scene);
    camera.attachControl(engine.getRenderingCanvas());
    var light0 = new HemisphericLight('', new Vector3(1, -1, 0), scene);
    light0.intensity = 10;
    var mat0 = new PBRMaterial('', scene);
    mat0.roughness = 1;
    var mesh = MeshBuilder.CreateBox('', { width: width, height: height, depth: depth });
    mesh.material = mat0;
    mesh.setEnabled(false);
    mesh.registerInstancedBuffer('color', 4);
    var insts = [];
    var host = new TransformNode('');
    for (var i = 0; i < N; ++i) {
        var inst = mesh.createInstance('');
        inst.position.x = R * Math.sin(i / N * Math.PI * 2);
        inst.position.z = R * Math.cos(i / N * Math.PI * 2);
        inst.parent = host;
        var r = i / N;
        var g = Math.random();
        var b = 1 - r;
        inst.instancedBuffers.color = new Color4(r, g, b, 1);
        insts.push(inst);
    }
    var t = 0;
    scene.onBeforeRenderObservable.add(function () {
        var a = Math.PI * 2 * t / 1000 * turnsPerSec;
        for (var i = 0; i < insts.length; ++i) {
            var inst = insts[i];
            var aa = a + os * i / N;
            inst.rotation.x = aa;
            inst.rotation.z = aa;
        }
        t += engine.getDeltaTime();
    });
    var rp = new DefaultRenderingPipeline('', true, scene);
    rp.bloomEnabled = true;
    rp.bloomThreshold = 0.1;
    rp.bloomWeight = 2;
    rp.fxaaEnabled = true;
    rp.samples = 2;
    return scene;
}