var ctx = require('pex-context')()
var loadImage = require('pex-io/loadImage')
var latLonToXyz = require('../')
var sphere = require('primitive-sphere')(1)
var cube = require('primitive-cube')(0.02)
var camera = require('pex-cam/perspective')({
  fov: Math.PI / 2,
  aspect: ctx.gl.canvas.width / ctx.gl.canvas.height,
  position: [0, 0, 2]
})
require('pex-cam/orbiter')({ camera: camera })

var clearCmd = {
  pass: ctx.pass({
    clearColor: [0, 0, 0, 1],
    clearDepth: 1
  })
}

var drawSphereCmd = {
  pipeline: ctx.pipeline({
    vert: `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    void main () {
      vTexCoord = aTexCoord;
      gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
    }
    `,
    frag: `
    #ifdef GL_ES
    precision highp float;
    #endif
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
    void main () {
      gl_FragColor = vec4(vTexCoord, 0.0, 1.0);
      gl_FragColor = texture2D(uTexture, vTexCoord);
    }
    `,
    depthTest: true
  }),
  attributes: {
    aPosition: ctx.vertexBuffer(sphere.positions),
    aTexCoord: ctx.vertexBuffer(sphere.uvs)
  },
  indices: ctx.indexBuffer(sphere.cells),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix
  }
}

var drawCubeCmd = {
  pipeline: ctx.pipeline({
    vert: `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform vec3 uPosition;
    void main () {
      gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition + uPosition, 1.0);
    }
    `,
    frag: `
    #ifdef GL_ES
    precision highp float;
    #endif
    void main () {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `,
    depthTest: true
  }),
  attributes: {
    aPosition: ctx.vertexBuffer(cube.positions)
  },
  indices: ctx.indexBuffer(cube.cells),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix,
    uPosition: [0, 0, 0]
  }
}

var londonPos = latLonToXyz(51.507222, -0.1275)
var nycPos = latLonToXyz(40.7127, -74.0059)
var seoulPos = latLonToXyz(37.566667, 126.966667)
var sydneyPos = latLonToXyz(-33.865, 151.209444)

loadImage('world.jpg', (err, img) => {
  if (err) console.log(err)
  var tex = ctx.texture2D({
    data: img,
    width: img.width,
    height: img.height,
    pixelFormat: ctx.PixelFormat.RGBA8,
    encoding: ctx.Encoding.SRGB,
    flipY: true
  })
  ctx.frame(() => {
    ctx.submit(clearCmd)
    ctx.submit(drawSphereCmd, {
      uniforms: {
        uTexture: tex
      }
    })
    ctx.submit(drawCubeCmd, {
      uniforms: {
        uPosition: londonPos
      }
    })
    ctx.submit(drawCubeCmd, {
      uniforms: {
        uPosition: nycPos
      }
    })
    ctx.submit(drawCubeCmd, {
      uniforms: {
        uPosition: seoulPos
      }
    })
    ctx.submit(drawCubeCmd, {
      uniforms: {
        uPosition: sydneyPos
      }
    })
  })
})
