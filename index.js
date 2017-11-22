function latLonToXyz (lat, lon, out) {
  out = out || [0, 0, 0]
  const theta = lat
  const phi = lon

  out[0] = Math.cos(theta) * Math.cos(phi)
  out[1] = Math.sin(theta)
  out[2] = Math.cos(theta) * Math.sin(phi)
  return out
}

module.exports = latLonToXyz
