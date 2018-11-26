import React, { Component } from 'react';
import * as THREE from 'three';
class SimViewer extends Component {
    constructor(Super) {
        super();

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        var renderer = new THREE.WebGLRenderer(document.body.clientWidth, document.body.clientHeight);
        this.renderer = renderer;
        document.body.appendChild( renderer.domElement );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
        geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
        geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );

        var line = new THREE.Line( geometry, material );
        scene.add( line );


        camera.position.z = 20;

        var animate = function () {
            requestAnimationFrame( animate );

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render( scene, camera );
        };

        animate();


    }
    render(){
        return (
            <div style={this.props.style}>

            </div>
        )
    }
}
export default SimViewer