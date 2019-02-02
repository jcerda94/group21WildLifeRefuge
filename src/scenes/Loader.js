let camera, renderer, scene, mixer;

const clock = new THREE.Clock();

function initLoadingManager() {

    const manager = new THREE.LoadingManager();
    const progressBar = document.querySelector( '#progress' );
    const loadingOverlay = document.querySelector( '#loading-overlay' );

    let percentComplete = 1;
    let frameID = null;

    const updateAmount = 0.5; // in percent of bar width, should divide 100 evenly

    const animateBar = () => {
        percentComplete += updateAmount;

        // if the bar fills up, just reset it.
        // I'm changing the color only once, you
        // could get fancy here and set up the colour to get "redder" every time
        if ( percentComplete >= 100 ) {

            progressBar.style.backgroundColor = 'blue'
            percentComplete = 1;

        }

        progressBar.style.width = percentComplete + '%';

        frameID = requestAnimationFrame( animateBar )

    }

    manager.onStart = () => {

        // prevent the timer being set again
        // if onStart is called multiple times
        if ( frameID !== null ) return;

        animateBar();

    };

    manager.onLoad = function ( ) {

        loadingOverlay.classList.add( 'loading-overlay-hidden' );

        // reset the bar in case we need to use it again
        percentComplete = 0;
        progressBar.style.width = 0;
        cancelAnimationFrame( frameID );

    };

    manager.onError = function ( e ) {

        console.error( e );

        progressBar.style.backgroundColor = 'red';

    }

    return manager;
}

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const nearClippingPlane = 0.1;
    const farClippingPlane = 1000;

    camera = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );
    camera.position.set( 100, 200, 300 );

    const controls = new THREE.OrbitControls( camera );
    controls.target.set( 0, 100, 0 );

    controls.update();

    // create a global illumination light
    const ambientLight = new THREE.AmbientLight( 0xffffff, 1.0 );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 1.0 );
    pointLight.position.set( 0, 0, 20 );
    scene.add( pointLight );

}

function initMeshes() {

    const manager = initLoadingManager();

    const loader = new THREE.FBXLoader( manager );
    loader.load( 'https://threejs.org/examples/models/fbx/Samba Dancing.fbx', function( object ) {

        mixer = new THREE.AnimationMixer( object );
        var action = mixer.clipAction( object.animations[ 0 ] );
        action.play();

        scene.add( object );
    }, manager.onProgress, manager.onError );

}

function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );
    if( mixer ) mixer.update( clock.getDelta() );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
initMeshes();

animate();
