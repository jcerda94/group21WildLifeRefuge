import * as THREE from 'three'
import { OrbitControls } from '../js/three/OrbitControls'

class Sim {
  camera = null
  scene = null
  renderer = null
  cameraControls = null

  constructor () {
    this.initializeCamera()
    this.initializeScene()
    this.initializeRenderer()

    this.generateTexture()
  }

  initializeCamera () {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    this.camera.position.set(0, 75, 100)
    const cameraControl = new OrbitControls(this.camera)
  }

  initializeScene () {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
  }

  initializeRenderer () {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  generateMesh () {
    const geometry = this.generateGeometry()
    let material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x996600)
    })
    return new THREE.Mesh(geometry, material)
  }

  generateGeometry () {
    return new THREE.PlaneBufferGeometry(100, 100)
  }

  generateCanvasTexture () {
    let canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    let context = canvas.getContext('2d')
    for (let i = 0; i < 20000; i++) {
      context.fillStyle = `hsl(0, 0%, ${Math.random() * 50 + 50}%)`
      context.beginPath()
      context.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() + 0.15,
        0,
        Math.PI * 2,
        true
      )
      context.fill()
    }
    context.globalAlpha = 0.075
    context.globalCompositeOperation = 'lighter'
    return canvas
  }

  generateTexture () {
    const texture = new THREE.CanvasTexture(this.generateCanvasTexture())
    let mesh = this.generateMesh()
    mesh.rotation.x = -(Math.PI / 2)
    this.scene.add(mesh)
    const geometry = this.generateGeometry()
    for (var i = 1; i < 10; i++) {
      let material = this.makeMaterial(texture, {
        h: 0.3,
        s: 0.75,
        l: (i / 15) * 0.4 + 0.1
      })
      mesh = new THREE.Mesh(geometry, material)
      mesh.position.y = i * 0.25
      mesh.rotation.x = -Math.PI / 2
      this.scene.add(mesh)
    }
    this.scene.children.reverse()
  }

  makeMaterial (texture, { h, s, l }) {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(h, s, l),
      map: texture,
      transparent: true
    })
  }

  animate = () => {
    window.requestAnimationFrame(this.animate)
    this.render()
  }

  render () {
    var time = Date.now() / 6000
    this.camera.position.x = 80 * Math.cos(time)
    this.camera.position.z = 80 * Math.sin(time)
    this.camera.lookAt(this.scene.position)
    for (var i = 0, l = this.scene.children.length; i < l; i++) {
      var mesh = this.scene.children[i]
      mesh.position.x = Math.sin(time * 4) * i * i * 0.005
      mesh.position.z = Math.cos(time * 6) * i * i * 0.005
    }
    this.renderer.render(this.scene, this.camera)
  }
}

export default Sim
