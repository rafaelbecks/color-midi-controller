import { throttle } from './utls'
import { sendNote } from './midiMapping'

const tracking = window.tracking

  export function initColorTracking(colorsArray) {

    for (const colorHex of colorsArray) {
      const components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex);

      const customColorR = parseInt(components[1], 16);
      const customColorG = parseInt(components[2], 16);
      const customColorB = parseInt(components[3], 16);

      const colorTotal = customColorR + customColorG + customColorB;

      if (colorTotal === 0) {
        tracking.ColorTracker.registerColor(colorHex, function(r, g, b) {
          return r + g + b < 10;
        });
      } else {
        const rRatio = customColorR / colorTotal;
        const gRatio = customColorG / colorTotal;

        tracking.ColorTracker.registerColor(colorHex, function(r, g, b) {
          const colorTotal2 = r + g + b;

          if (colorTotal2 === 0) {
            if (colorTotal < 10) {
              return true;
            }
            return false;
          }

          const rRatio2 = r / colorTotal2,
            gRatio2 = g / colorTotal2,
            deltaColorTotal = colorTotal / colorTotal2,
            deltaR = rRatio / rRatio2,
            deltaG = gRatio / gRatio2;

          return deltaColorTotal > 0.9 && deltaColorTotal < 1.1 &&
            deltaR > 0.9 && deltaR < 1.1 &&
            deltaG > 0.9 && deltaG < 1.1;
        });
      }
    }

      const colorTracker = new tracking.ColorTracker(colorsArray)

      tracking.track('#myVideo', colorTracker) // start the tracking of the colors above on the camera in p5


      colorsArray.forEach((color, index) => {
        colorTracker.on('track', throttle(function(event) {
          if(window.stop) return
          window.trackingData = event.data

          const currentColor = event.data.filter(({ color: detectedColor }) => detectedColor === color)
          for (let i = 0; i < currentColor.length; i++) {
            const { x, y } = currentColor[i]
            sendNote(x,y, index)
          }

        }, window.throttle[index] || 500))

      })
      //start detecting the tracking
 }