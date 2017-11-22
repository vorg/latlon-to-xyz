function latLonToXyz (lat, lon, out) {
  out = out || [0, 0, 0]
  const theta = lat / 180 * Math.PI
  const phi = lon / 180 * Math.PI

  out[0] = Math.cos(theta) * Math.cos(phi)
  out[1] = Math.sin(theta)
  out[2] = Math.cos(theta) * Math.sin(phi)
  return out
}

module.exports = latLonToXyz
