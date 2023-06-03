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
  Separator, SketchContainer, Tab, TabContainer, Title,
  TitleBar,
  Window,
  WindowPane
} from './layout'
import { MIDIIcon } from './icons'
import pattern from './assets/pattern.png'
import { initColorTracking } from './colors'
import { getNotes, getScales } from './midiMapping'
import WebMidi from 'webmidi'
import { useState } from 'react'

let capture

const notes = getNotes()
const scales = getScales()

const UI = ({
  cameras,
  selectCamera,
  selectedCamera,
  midiDevices,
}) => {

  const [keys, setKey] = useState('C', 'G')
  const [throttle, setThrottle] = useState([500, 500])
  const [duration, setDuration] = useState([2000, 1000])
  const [channel, setChannel] = useState([1,2]);
  const [scale, setScale] = useState(['major pentatonic', 'major pentatonic'])
  const [octaves, setOctaves] = useState([2, 3])
  const [currentChannel, setCurrentChannel] = useState(0)
  const [velocity, setVelocity] = useState([0.4,0.5])
  const [colors, setColor] = useState(['#636cdd', '#63fcdd'])

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

    initColorTracking(window.colors)
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

  window.colors = colors
  window.throttle = throttle
  window.duration = duration
  window.keys = keys
  window.channel = channel
  window.scale = scale
  window.octaves = octaves
  window.velocity = velocity
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
              <TabContainer>
                {colors.map((color, index) =>
                  <Tab key={index} onClick={() => { setCurrentChannel(index) }}
                       className={currentChannel === index && 'selected'}>
                    Color {index + 1}
                  </Tab>
                )}
              </TabContainer>

              {colors.map((color, index) =>
                (
                  <div
                    key={index}
                    style={{  display: currentChannel === index ? 'block' : 'none' }}>
                    <MIDISection>
                      <Control>
                        <label>Key</label>
                        <select value={keys[index]} onChange={(e) => {
                          const newKeys = Array.from(keys)
                          newKeys[index] = e.target.value
                          setKey(newKeys)
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
                        <select value={scale[index]} onChange={(e) => {
                          const newScale = Array.from(scale)
                          newScale[index] = e.target.value
                          setScale(newScale)
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
                        <select value={octaves[index]} onChange={(e) => {
                          const newOctaves = Array.from(octaves)
                          newOctaves[index] = parseInt(e.target.value)
                          setOctaves(newOctaves)
                          window.octaves = newOctaves
                        }}>
                          <option value={1}>1</option>
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
                               value={throttle[index]}
                               onChange={(e) => {
                                 const newThrottle = Array.from(throttle)
                                 newThrottle[index] = parseInt(e.target.value)
                                 setThrottle(newThrottle)
                                 window.throttle = newThrottle
                               }}/>
                      </Control>
                      <Control>
                        <label>Duration</label>
                        <input type="number"
                               step={100}
                               style={{width: '150px'}}
                               min={100}
                               value={duration[index]}
                               onChange={(e) => {
                                 const newDuration = Array.from(duration)
                                 newDuration[index] = parseInt(e.target.value)
                                 setDuration(newDuration)
                                 window.duration = newDuration
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
                                 value={channel[index]}
                                 onChange={(e) => {
                                   const newChannels = Array.from(channel)
                                   newChannels[index] = parseInt(e.target.value)
                                   setChannel(newChannels)
                                   window.channel = newChannels
                                 }}/>
                        </Control>
                      </MIDISelectionContainer>
                    </MIDISection>
                    <ColorSection>
                      <InputRange onChange={(e) => {
                        const newVelocity = Array.from(velocity)
                        newVelocity[index] = parseInt(e.target.value) / 100
                        setVelocity(newVelocity)
                      }} />
                      <ColorPicker type="color" value={colors[index]} onChange={(e) => {
                        const newColors = Array.from(colors)
                        newColors[index] = e.target.value
                        setColor(newColors)
                      }
                      }  />
                      <NoteLabel id={"note"+index}></NoteLabel>
                    </ColorSection>

                  </div>
                )
              )}

            </LeftSection>
            <RightSection>
              <CameraSectionContainer>
                <Control>
                  <label>Camera</label>
                  <BigSelect onChange={(e) => {
                    selectCamera(e.target.value)
                    window.stop = false
                  }}
                  value={selectedCamera}
                  >
                    <option value={0}>Select a camera</option>
                    {cameras.map((camera) => (
                      <option key={camera.deviceId} value={camera.deviceId}>{camera.label}</option>
                    ))}
                  </BigSelect>
                </Control>
                {/*<Control style={{ marginTop: '10px'}}>*/}
                {/*  <label>Video URL</label>*/}
                {/*  <input type="text"*/}
                {/*         style={{width: '76%'}}*/}
                {/*         onChange={(e) => {*/}
                {/*           // setThrottle(parseInt(e.target.value))*/}
                {/*           // window.throttle = parseInt(e.target.value)*/}
                {/*         }}/>*/}
                {/*</Control>*/}

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
                    window.stop = true
                  }}>Stop</Button>
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
