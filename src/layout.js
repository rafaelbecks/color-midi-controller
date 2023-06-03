import styled from 'styled-components'
import track from './assets/track.svg'

export const Window =  styled.div.attrs({
  className: 'window',
})`
  width: 850px;  
`

export const WindowPane = styled.div.attrs({
  className: 'windown-pane'
})`
  background: #000;
  display:flex;
`

export const TitleBar =  styled.div.attrs({
  className: 'title-bar',
})``

export const Title =  styled.div.attrs({
  className: 'title',
})`
  font-weight: 300 !important;
`

export const CloseButton = styled.button.attrs({
  className: 'close'
})``

export const Button = styled.button.attrs({
  className: 'btn'
})``

export const FooterButton = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    top: 10px;
`

export const Resize = styled.button.attrs({
  className: 'resize'
})``

export const Separator = styled.div.attrs({
  className: 'separator'
})``

export const Container = styled.div`
  height: 600px;
  width: 100%;
  padding: 12px 5px;
  display: flex;
  justify-content: space-around;
  
  .selected { 
    font-weight: 700; 
  }
`

export const LeftSection = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
`

export const TabContainer = styled.div`
    background: #fff;
    display: flex;
    width: fit-content;
    justify-content: center;
    align-items: center;
`

export const Tab = styled.div`
    padding: 7px 10px;
    border-right: 1px solid #000;
    font-size: 14px;
    cursor: pointer;
`

export const RightSection = styled.div`
  width: 534px;
  background: #fff;
  height: 100%;
`

export const MIDISection = styled.div`
  height: 290px;
  width: 256px;
  padding: 14px 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between
`
export const ColorSection = styled.div`
  height: 225px;
  width: 100%;
  background: #fff;
  position: relative;
`

export const Control = styled.div`
  display:flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

export const BigSelect = styled.select`
  width: 100%;
  height: 28px;
  background-position: top 4px right 2px;
`

export const MIDISelectionContainer = styled.div`
  text-align: left;
`

export const InputRange = styled.input.attrs({
  type: 'range'
})`
  -webkit-appearance: none;
  height: 40px;
  border: none;
  width: 195px;
  transform: rotate(-90deg);
  position: relative;
  top: 88px;
  position: absolute;
  left: -61px;
  &::-webkit-slider-runnable-track {
    background-image: url(${track});
    background-size: cover;
    background-position: contain;
    height: 30px;
    border: none;
  }
  &::-webkit-slider-thumb {
-webkit-appearance: none;
    border: 1px solid #000000;
    height: 39px;
    width: 19px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    margin-top: -5px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
`

export const ColorPicker = styled.input.attrs({
  type: 'color'
})`
    width: 180px;
    height: 180px;
    position: relative;
    left: 30px;
    top: 22px;
`

export const NoteLabel = styled.label`
    font-size: 62px;
    color: #fff;
    position: absolute;
    top: 75px;
    left: 80px;
    width: 180px;
    text-align: center;
`

export const CameraSectionContainer = styled.div`
  padding: 14px 12px;
  
  label {
    margin-right: 20px;
  }
`

export const SketchContainer = styled.div`
    width: 640px;
    height: 480px;
    transform: scale(0.8);
    position: relative;
    left: -65px;
    top: 28px;
`

export const BackgroundCamera = styled.img`
    width: 512px;
    margin: 46px 0;
`

export const SelectDeviceContainer = styled.div`
  position: relative;
  h2 {
    position: absolute;
    color: #fff;
    bottom: -20px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 300;
    font-size: 27px;
  }
`




