const THREE = require("three");


function SpotLight(scene, config = {}) {

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(500, 150, 500);
    spotLight.shadowCameraNear = 20;
    spotLight.shadowCameraFar = 50;
    spotLight.castShadow = true;

    scene.add(spotLight);

    function update() {}

    return{
        update
    };

}

export default SpotLight;