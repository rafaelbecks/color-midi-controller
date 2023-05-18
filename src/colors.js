const tracking = window.tracking

  export function initColorTracking(value) {
    const components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    const customColorR = parseInt(components[1], 16);
    const customColorG = parseInt(components[2], 16);
    const customColorB = parseInt(components[3], 16);

    const colorTotal = customColorR + customColorG + customColorB;

    if (colorTotal === 0) {
      tracking.ColorTracker.registerColor('custom', function(r, g, b) {
        return r + g + b < 10;
      });
    } else {
      const rRatio = customColorR / colorTotal;
      const gRatio = customColorG / colorTotal;

      tracking.ColorTracker.registerColor('custom', function(r, g, b) {
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

      const colors = new tracking.ColorTracker(['custom']);


      tracking.track('#myVideo', colors); // start the tracking of the colors above on the camera in p5

      //start detecting the tracking
      colors.on('track', function(event) {
        window.trackingData = event.data
      })

    }
 }