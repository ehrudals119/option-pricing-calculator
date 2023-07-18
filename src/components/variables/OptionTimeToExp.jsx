import {useState} from 'react'
import PropTypes from 'prop-types'

function OptionTimeToExp({text}) {

  const [timeToExp, setTimeToExp] = useState('')
  
  const handleTimeToExpChange = (e) => {
    setTimeToExp(e.target.value)
  }
  
  return (
    <>
    <label htmlFor="">{text}</label>
    <input 
    onChange={handleTimeToExpChange} 
    type="number"
    value={timeToExp}/>
    </>
  )
}

OptionTimeToExp.defaultProps = {
    text: 'Time to Expiration',
}

OptionTimeToExp.propTypes = {
    text: PropTypes.string,
}

export default OptionTimeToExp