import React, { Component } from 'react';
import * as THREE from 'three';
import {OrbitControls} from "../js/three/OrbitControls";

class SimViewer extends Component {
    constructor() {
        super();

        this.state = {
            height: 0,
            width: 0
        };

        var threeObjects = SimViewer.init();
        SimViewer.camera = threeObjects[0];
        SimViewer.scene = threeObjects[1];
        SimViewer.renderer = threeObjects[2];
        SimViewer.plane = threeObjects[3];
        SimViewer.animate();

    }

    static init() {
        var camera, scene, renderer;

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.set( 0, 75, 100 );
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
        var material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x996600) });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = - Math.PI / 2;
        scene.add(mesh);

        var texture = new THREE.CanvasTexture( SimViewer.generateTexture() );
        for ( var i = 1; i < 10; i ++ ) {
            material = new THREE.MeshBasicMaterial( {
                color: new THREE.Color().setHSL( 0.3, 0.75, ( i / 15 ) * 0.4 + 0.1 ),
                map: texture,
                transparent: true,
            } );
            mesh = new THREE.Mesh( geometry, material );
            mesh.position.y = i * 0.25;
            mesh.rotation.x = - Math.PI / 2;
            scene.add( mesh );
        }
        scene.children.reverse();

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );


        const cameraControl = new OrbitControls(camera);

        document.body.appendChild( renderer.domElement );

        return [camera, scene, renderer, mesh]

    }


    static generateTexture() {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 512;
        canvas.height = 512;
        var context = canvas.getContext( '2d' );
        for ( var i = 0; i < 20000; i ++ ) {
            context.fillStyle = 'hsl(0,0%,' + ( Math.random() * 50 + 50 ) + '%)';
            context.beginPath();
            context.arc( Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
            context.fill();
        }
        context.globalAlpha = 0.075;
        context.globalCompositeOperation = 'lighter';
        return canvas;
    }

    static animate() {
        requestAnimationFrame( SimViewer.animate );
        SimViewer.threeRender();
    }

    static threeRender() {
        var time = Date.now() / 6000;
        SimViewer.camera.position.x = 80 * Math.cos( time );
        SimViewer.camera.position.z = 80 * Math.sin( time );
        SimViewer.camera.lookAt( this.scene.position );
        for ( var i = 0, l = SimViewer.scene.children.length; i < l; i ++ ) {
            var mesh = SimViewer.scene.children[ i ];
            mesh.position.x = Math.sin( time * 4 ) * i * i * 0.005;
            mesh.position.z = Math.cos( time * 6 ) * i * i * 0.005;
        }
        SimViewer.renderer.render( SimViewer.scene, SimViewer.camera );
    }


    componentDidUpdate() {

        console.log(this.props.height);

        SimViewer.renderer.setSize(window.innerWidth, this.props.height);


    }


    render(){
        return (
            <div style={this.props.style}>

            </div>
        )
    }
}
export default SimViewer