import React, { Component } from 'react';
import * as THREE from 'three';


class SimViewer extends Component {


    constructor(Super) {
        super();

        // global variables
        var renderer;
        var scene;
        var camera;
        var cameraControl;
        var control;
        var stats;
        /**
         * Initializes the scene, camera and objects. Called when the window is
         * loaded by using window.onload (see below)
         */
        function init() {
            // create a scene, that will hold all our elements such as objects, cameras and lights.
            scene = new THREE.Scene();
            // create a camera, which defines where we're looking at.
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            // create a render, sets the background color and the size
            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0x000000, 1.0);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMapEnabled = true;
            // create the ground plane
            var planeGeometry = new THREE.PlaneGeometry(20, 20);
            var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;
            // add the plane to the scene
//        scene.add(plane);
            // position and point the camera to the center of the scene
            camera.position.x = 3;
            camera.position.y = 15;
            camera.position.z = 10;
            camera.lookAt(scene.position);

            // add camera control
            cameraControl = new THREE.OrbitControls(camera);
            cameraControl.maxPolarAngle = Math.PI * 0.5;
            // add spotlight for the shadows
            var spotLight = new THREE.DirectionalLight(0xffffff);
            spotLight.position.set(50, 50, 50);
            spotLight.castShadow = true;
            spotLight.intensity = 2;
            scene.add(spotLight);
            var ambiLight = new THREE.AmbientLight(0x333333);
            scene.add(ambiLight);
            // setup the control object for the control gui
            control = new function() {
                this.rotationSpeed = 0.005;
            };
            // add extras
            addControlGui(control);
            addStatsObject();
            loadModel();
            // add the output of the renderer to the html element
            document.body.appendChild(renderer.domElement);
            // call the render function, after the first render, interval is determined
            // by requestAnimationFrame
            render();
        }
        function loadModel() {
            var loader = new THREE.JSONLoader();
            loader.load("assets/betterTerrain.js",
                function(model, material) {
                    var mesh = new THREE.Mesh(model, material[0]);
                    mesh.scale = new THREE.Vector3(3,3,3);
                    scene.add(mesh);
                }, "assets/");
        }
        function addControlGui(controlObject) {
            var gui = new dat.GUI();
            gui.add(controlObject, 'rotationSpeed', -0.01, 0.01);
        }
        function addStatsObject() {
            stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            document.body.appendChild( stats.domElement );
        }
        /**
         * Called when the scene needs to be rendered. Delegates to requestAnimationFrame
         * for future renders
         */
        function render() {

            camera.lookAt(scene.position);


            // update stats
            stats.update();

            //update camera
            cameraControl.update();
            // and render the scene
            renderer.render(scene, camera);
            // render using requestAnimationFrame
            requestAnimationFrame(render);
        }
        /**
         * Function handles the resize event. This make sure the camera and the renderer
         * are updated at the correct moment.
         */
        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        // calls the init function when the window is done loading.
        window.onload = init;
        // calls the handleResize function when the window is resized
        window.addEventListener('resize', handleResize, false);

    }

    render(){
        return (
            <div style={this.props.style}>

            </div>
        )
    }

}

export default SimViewer