import {useState} from 'react'
import PropTypes from 'prop-types'

function OptionStrikePrice({text}) {

  const [strikePrice, setStrikePrice] = useState('')
  
  const handleStrikePriceChange = (e) => {
    setStrikePrice(e.target.value)
  }
  
  return (
    <>
    <label htmlFor="">{text}</label>
    <input 
    onChange={handleStrikePriceChange} 
    type="number"
    value={strikePrice}/>
    </>
  )
}

OptionStrikePrice.defaultProps = {
    text: 'Strike Price',
}

OptionStrikePrice.propTypes = {
    text: PropTypes.string,
}

export default OptionStrikePrice