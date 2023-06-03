import { useEffect, useState } from 'react'
import './App.css';
import UI from './ui'
import { initMidi } from './midiMapping'

function App() {

  const [cameras, setCameras] = useState([])
  const [selectedCamera, selectCamera] = useState(0)
  const [midiDevices, setMidiDevices] = useState([])

  useEffect(() => {
    async function getDevices(){
      const devices = await window.navigator.mediaDevices.enumerateDevices()
      const midiDevices = await initMidi()
      window.currentMidiDevice = midiDevices[0].id
      setMidiDevices(midiDevices)
      setCameras(devices.filter((item) => item.kind.includes('video')))

    }
     getDevices()
  }, [])

  //tracking
  // useEffect(() => {
  //   const canvas = document.getElementById('canvas');
  //   const context = canvas.getContext('2d');
  //
  //   const tracker = new tracking.ColorTracker(['yellow']);
  //   tracker.setMinDimension(5);
  //
  //   tracking.track('#video', tracker);
  //
  //   tracker.on('track', function(event) {
  //     context.clearRect(0, 0, canvas.width, canvas.height);
  //
  //     event.data.forEach(function(rect) {
  //       if (rect.color === 'custom') {
  //         rect.color = tracker.customColor;
  //       }
  //
  //       context.strokeStyle = rect.color;
  //       context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  //       context.font = '11px Helvetica';
  //       context.fillStyle = "#fff";
  //       context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
  //       context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
  //     });
  //   });
  //
  //   initCustomColorTracking(tracker);
  // }, [])

  window.selectedCamera = selectedCamera

  return (
    <div className="App">
      <UI
        cameras={cameras}
        selectCamera={selectCamera}
        selectedCamera={selectedCamera}
        setCameras={setCameras}
        midiDevices={midiDevices}
      />
    </div>
  );
}

export default App;
