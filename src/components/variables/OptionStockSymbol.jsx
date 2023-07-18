import {useState} from 'react'
import PropTypes from 'prop-types'

function OptionStockSymbol({text}) {

  const [stockSymbol, setStockSymbol] = useState('')

  const handleStockSymbolChange = (e) => {
      setStockSymbol(e.target.value)
  }
  
  return (
    <>
    <label htmlFor="">{text}</label>
    <input 
    onChange={handleStockSymbolChange} 
    type="text"
    value={stockSymbol}/>
    </>
  )
}

OptionStockSymbol.defaultProps = {
    text: 'Stock Symbol',
}

OptionStockSymbol.propTypes = {
    text: PropTypes.string,
}

export default OptionStockSymbol