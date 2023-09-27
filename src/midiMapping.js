import { Scale } from "tonal";
import WebMidi from 'webmidi'
export const getNotes = () => {
  return Scale.get('C chromatic')
}

export const getScales = () => {
  return Scale.names().slice(0, 25)
}

export const initMidi = async () =>
  new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        reject(err)
      }
      resolve(WebMidi.outputs)
    })
  })


export const sendNote = (x,y, colorIndex) => {
  if(window.stop) return
  const maxX= 620
  const maxY = 460
  const velocity = window.velocity[colorIndex] || 0.5
  const duration = window.duration[colorIndex] || 2000
  const channel = window.channel[colorIndex] || 1
  const key = window.keys[colorIndex] || 'C'
  const scale = window.scale[colorIndex] || 'major pentatonic'
  const octaves = window.octaves[colorIndex] || 2
  const notesFromScale = Scale.get(`${key} ${scale}`).notes

  const sectionX = maxX / notesFromScale.length
  const index = Math.floor(x/sectionX)
  const octave = Math.floor(y / (maxY / octaves)) + 3
  const noteToSend = `${notesFromScale[index]}${octave}`
  document.getElementById('note' + colorIndex).innerText = noteToSend

  const midiIndex = window.currentMidiIndex || 0


  WebMidi.outputs[midiIndex].playNote(noteToSend, channel, {
    duration,
    velocity})
}