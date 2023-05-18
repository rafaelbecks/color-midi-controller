export const convertToRGB = (hex) => {
  const color = hex.replace('#','')
  if(color.length !== 6){
    throw "Only six-digit hex colors are allowed.";
  }

  const aRgbHex = color.match(/.{1,2}/g);
  return [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16)
  ]
}
