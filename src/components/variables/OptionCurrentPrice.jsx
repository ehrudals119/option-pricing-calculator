import {useState} from 'react'
import PropTypes from 'prop-types'

function OptionCurrentPrice({text}) {

  const [currentPrice, setCurrentPrice] = useState('')
  

  const handleCurrentPriceChange = (e) => {
     setCurrentPrice(e.target.value)
  }
  
  return (
    <>
    <label htmlFor="">{text}</label>
    <input 
    onChange={handleCurrentPriceChange} 
    type="number"
    value={currentPrice}/>
    </>
  )
}

OptionCurrentPrice.defaultProps = {
    text: 'Current Price',
}

OptionCurrentPrice.propTypes = {
    text: PropTypes.string,
}

export default OptionCurrentPrice