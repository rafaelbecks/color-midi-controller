import './App.css';
import Sketch from "react-p5";
import {
  BackgroundCamera,
  BigSelect, Button,
  CameraSectionContainer,
  CloseButton, ColorPicker, ColorSection,
  Container, Control, FooterButton, InputRange,
  LeftSection, MIDISection, MIDISelectionContainer, NoteLabel,
  Resize,
  RightSection, SelectDeviceContainer,
  Separator, SketchContainer, Title,
  TitleBar,
  Window,
  WindowPane
} from './layout'
import { MIDIIcon } from './icons'
import pattern from './assets/pattern.png'
import { initColorTracking } from './colors'
import { getNotes, getScales, sendNote } from './music'
import WebMidi from 'webmidi'
import { useState } from 'react'

let capture

const notes = getNotes()
const scales = getScales()

const UI = ({
  color,
  setColor,
  cameras,
  selectCamera,
  selectedCamera,
  midiDevices,
}) => {

  const [throttle, setThrottle] = useState(500);
  const [duration, setDuration] = useState(2000);
  const [channel, setChannel] = useState(1);

  const setup = (p5, canvasParentRef) => {
      const canvas = p5.createCanvas(640, 480).parent(canvasParentRef)

      capture = p5.createCapture({
        video: {
          width: 640,
          height: 480,
          deviceId: {
            exact: window.selectedCamera
          },
        }
      }).parent(canvasParentRef) //capture the webcam
      capture.position(0,0) //move the cc to the top left
      capture.style('z-index', 1)
      canvas.style('position', 'relative')
      canvas.style('z-index', 2)
      capture.id("myVideo"); //give the capture an ID so we can use it in the tracker below.

    initColorTracking(window.color)
  }

  const draw = p5 => {
    p5.clear()
    const trackingData = window.trackingData
    if(trackingData){ //if there is tracking data to look at, then...
      for (let i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
        let c = p5.color(255, 255,255);
        p5.noFill()
        p5.stroke(c)
        p5.rect(trackingData[i].x,trackingData[i].y,trackingData[i].width,trackingData[i].height)
      }
    } else {
      WebMidi.outputs[0].sendStop()
    }
  }


  return (
    <div className="App">
      <Window>
        <TitleBar>
          <CloseButton aria-label="Close" />
          <Title>Color MIDI Controller</Title>
          <Resize aria-label="Resize"  />
        </TitleBar>
        <Separator />

        <WindowPane>
          <Container>
            <LeftSection>
              <MIDISection>
                <Control>
                  <label>Key</label>
                  <select value={window.key} onChange={(e) => {
                    window.key = e.target.value
                  }}>
                    {notes.notes.map((key) => {
                      return (
                        <option key={key} value={key}>{key}</option>
                      )
                    })}
                  </select>
                </Control>
                <Control>
                  <label>Scale</label>
                  <select value={window.scale} onChange={(e) => {
                    window.scale = e.target.value
                  }}>
                    {scales.map((name) => {
                    return (
                      <option key={name} value={name}>{name}</option>
                    )
                  })}
                  </select>
                </Control>
                {/*<Control>*/}
                {/*  <label>Range</label>*/}
                {/*  <select>*/}
                {/*    <option>C</option>*/}
                {/*    <option>E</option>*/}
                {/*    <option>F</option>*/}
                {/*  </select>*/}
                {/*</Control>*/}
                <Control>
                  <label>Octaves</label>
                  <select value={window.octaves} onChange={(e) => {
                    window.octaves = e.target.value
                  }}>                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>

                  </select>
                </Control>
                <Control>
                  <label>Rate</label>
                  <input type="number"
                         step={100}
                         style={{width: '150px'}}
                         min={1}
                         value={throttle}
                         onChange={(e) => {
                         setThrottle(parseInt(e.target.value))
                          window.throttle = parseInt(e.target.value)
                  }}/>
                </Control>
                <Control>
                  <label>Duration</label>
                  <input type="number"
                         step={100}
                         style={{width: '150px'}}
                         min={100}
                         value={duration}
                         onChange={(e) => {
                           setDuration(parseInt(e.target.value))
                           window.duration = parseInt(e.target.value)
                         }}/>
                </Control>
                <MIDISelectionContainer>
                  <MIDIIcon width="40" height="40" />
                  <Control>
                    <BigSelect>
                      {midiDevices.map((device) => {
                        return (
                          <option key={device.id}
                                  value={device.id}
                                  onChange={() => { window.currentMidiDevice = device.id}}
                          >
                            {device.name}
                          </option>
                        )
                      })}
                    </BigSelect>
                  </Control>
                  <Control style={{ marginTop: '15px'}}>
                    <label>Channel</label>
                    <input type="number"
                           step={1}
                           style={{width: '150px'}}
                           min={1}
                           max={16}
                           value={channel}
                           onChange={(e) => {
                             setChannel(parseInt(e.target.value))
                             window.channel = parseInt(e.target.value)
                           }}/>
                  </Control>
                </MIDISelectionContainer>
              </MIDISection>
              <ColorSection>
                <InputRange onChange={(e) => {
                  window.velocity = parseInt(e.target.value) / 100
                }} />
                <ColorPicker type="color" value={color} onChange={(e) => {
                  setColor(e.target.value)
                }
                }  />
                <NoteLabel id="note"></NoteLabel>
              </ColorSection>
            </LeftSection>
            <RightSection>
              <CameraSectionContainer>
                <Control>
                  <label>Camera</label>
                  <BigSelect onChange={(e) => {
                    selectCamera(e.target.value)
                  }}
                  value={selectedCamera}
                  >
                    <option value={0}>Select a camera</option>
                    {cameras.map((camera) => (
                      <option key={camera.deviceId} value={camera.deviceId}>{camera.label}</option>
                    ))}
                  </BigSelect>
                </Control>

                {selectedCamera !== 0 ? (
                  <SketchContainer>
                    <Sketch setup={setup} draw={draw} />
                  </SketchContainer>
                ) :
                  (
                    <SelectDeviceContainer>
                      <BackgroundCamera alt="pattern" src={pattern} />
                      <h2>Select device to begin</h2>
                    </SelectDeviceContainer>
                  )
                }

                <FooterButton>
                  <Button onClick={() => {
                    selectCamera(0)
                  }}>Stop</Button>
                  <Button onClick={() => {
                    sendNote()
                  }}>Debug</Button>
                </FooterButton>
              </CameraSectionContainer>
            </RightSection>
          </Container>
        </WindowPane>
      </Window>
    </div>
  );
}

export default UI;
