import {useState, useRef} from 'react'
import Button from './shared/Button'
import OptionStockSymbol from './variables/OptionStockSymbol'
import {calculation} from './Calculation'
import { useEffect } from 'react'
import { TabGroup } from './OptionTabs'

function OptionForm() {

  const [optionType, setOptionType] = useState('call')

  const [stockSymbol, setStockSymbol] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [strikePrice, setStrikePrice] = useState('')
  const [timeToExp, setTimeToExp] = useState('')
  const [contracts, setContracts] = useState(1)

  const currentPriceRef = useRef()
  const strikePriceRef = useRef()
  const timeToExpRef = useRef()
  const contractsRef = useRef()

  const resultRef = useRef()

  const handleStockSymbolChange = (e) => {
    setStockSymbol(e.target.value)
 }

  const handleCurrentPriceChange = (e) => {
     setCurrentPrice(e.target.value)
  }

  const handleStrikePriceChange = (e) => {
    setStrikePrice(e.target.value)
  }

  const handleTimeToExpChange = (e) => {
    setTimeToExp(e.target.value)
  }

  const handleContractsChange = (e) => {
    setContracts(e.target.value)
  }

  const handleActiveChange = (activeType) => {
    setOptionType(activeType)
  };
  

  const handleSubmit = (e, optionType) => {
    e.preventDefault();
    const premium = calculation(
      currentPriceRef.current.value,
      strikePriceRef.current.value,
      timeToExpRef.current.value,
      optionType === 'Put'
    ) * contractsRef.current.value * 100;
  
    const premiumRounded = Math.round(premium * 100) / 100;
  
    resultRef.current.innerText = "$" + premiumRounded;
  };
  

  function loadPrice(){
    const url = `https://api.polygon.io/v1/open-close/${stockSymbol}/2020-10-14?adjusted=true&apiKey=xODwx7vrZ6SdXDuCi3xtLzajO2iaNbbw`
    fetch(url)
    .then((response)=> response.json())
    .then((data)=> console.log(data));
  }

  useEffect(()=>{
    loadPrice();
  }, []);

  return (
    <>
    <TabGroup onActiveChange={handleActiveChange}/>

    <div className='split'> 
    
    <div className='split-left'>

            <h2>Underlying Stock</h2>
            <form onSubmit={loadPrice}>
            <div className="input-group">
            <label htmlFor="">Stock Symbol</label>
                <input 
                onChange={handleStockSymbolChange} 
                type="test"
                value={stockSymbol}/>
              <Button 
            type='submit' 
            version='secondary'
            >
              Get Price
            </Button>
              </div>
              </form>
            <form onSubmit={(e) => handleSubmit(e, optionType)}>
            <div className="input-group">
          
              <label htmlFor="">Current Price</label>
                <input 
                onChange={handleCurrentPriceChange} 
                type="number"
                ref={currentPriceRef}
                value={currentPrice}/>
            </div>

            <h2>Option</h2>
            <div className="input-group">

              <label htmlFor="">Strike Price</label>
                <input 
                onChange={handleStrikePriceChange} 
                type="number"
                ref={strikePriceRef}
                value={strikePrice}/>
              
              <label htmlFor="">Time to Expiry (in Days)</label>
                <input 
                onChange={handleTimeToExpChange} 
                type="number"
                ref={timeToExpRef}
                value={timeToExp}/>
            
              <label htmlFor="">Number of Contracts</label>
                <span>
                  <input 
                  onChange={handleContractsChange} 
                  type="number"
                  ref={contractsRef}
                  value={contracts}/>
                  <>  X100</>
                </span>

            </div>
            <Button 
            type='submit' 
            version='secondary'
            >
              Calculate!
            </Button>
        </form>
      </div>
      <div className="input-group split-right">
        <p>Current Position</p>
        <span>
          <p ref={resultRef}></p>
        </span>
      </div>
    </div>
    </>
  )
}

export default OptionForm