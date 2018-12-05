import React, { Component } from 'react';
import * as THREE from 'three';
import {OrbitControls} from "../js/three/OrbitControls";

class SimViewer extends Component {
    constructor(Super) {
        super();

        this.state = {
            height: 0,
            width: 0
        };


        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.camera = camera;

        var renderer = new THREE.WebGLRenderer();
        // TODO: Get renderer to render to the full component size
        renderer.setClearColor(0xFFFFFF, 1.0);
        renderer.setSize(600, 600);
        this.renderer = renderer;

        var cameraControl = new OrbitControls(this.camera);
        cameraControl.maxPolarAngle = Math.PI * 0.5;


        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(10, 10);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        scene.add(plane);
        // add the plane to the scene
//        scene.add(plane);
        // position and point the camera to the center of the scene
        camera.position.x = 3;
        camera.position.y = 15;
        camera.position.z = 10;
        camera.lookAt(scene.position);

        // add spotlight for the shadows
        var spotLight = new THREE.DirectionalLight(0xffffff);
        spotLight.position.set(50, 50, 50);
        spotLight.castShadow = true;
        spotLight.intensity = 2;
        scene.add(spotLight);
        var ambiLight = new THREE.AmbientLight(0x333333);
        scene.add(ambiLight);

        document.body.appendChild( this.renderer.domElement );

        var animate = function () {
            requestAnimationFrame( animate );


            renderer.render(scene, camera );
        };

        animate();

    }

    componentDidUpdate() {

        console.log(this.props.height);

        this.renderer.setSize(window.innerWidth, this.props.height + 50);


    }


    render(){
        return (
            <div style={this.props.style} ref={ divElement => {this.divElement = divElement}}>

            </div>
        )
    }
}
export default SimViewer