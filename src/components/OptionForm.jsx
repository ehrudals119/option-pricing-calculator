import React, { useState, useRef, useEffect } from 'react';
import Button from './shared/Button';
import { calculation } from './Calculation';
import { TabGroup } from './OptionTabs';

const BASE_URL_VOL = "http://localhost:5000/volatility?ticker=";
const BASE_URL_PRICE = "http://localhost:5000/price?ticker=";

const CONTRACT_MULTIPLIER = 100;

function OptionForm() {
  // State variables
  const [optionType, setOptionType] = useState('Call');
  const [stockSymbol, setStockSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [timeToExp, setTimeToExp] = useState('');
  const [contracts, setContracts] = useState(1);
  const [volatility, setVolatility] = useState(10);
  const [explanation, setExplanation] = useState('');

  const [useUserInputVol, setUseUserInputVol] = useState(false);

  // Refs
  const currentPriceRef = useRef();
  const strikePriceRef = useRef();
  const timeToExpRef = useRef();
  const contractsRef = useRef();
  const volatilityRef = useRef();
  const resultRef = useRef();

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleActiveChange = (activeType) => {
    setOptionType(activeType);
  };

  const getCurrentPrice = async e => {
    e.preventDefault();
    const url = BASE_URL_PRICE + stockSymbol;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setCurrentPrice((Math.round(data.previousClose * 100) / 100));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    let usedVolatility = useUserInputVol ? volatility : 10;

    if (!useUserInputVol) {
      const url = BASE_URL_VOL + stockSymbol;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        usedVolatility = data.dailyVolatility;
        setVolatility(data.dailyVolatility);
      } catch (error) {
        console.log(error);
        setVolatility(10);
      }
    }

    const premium = calculation(
      currentPrice,
      strikePrice,
      timeToExp,
      optionType === 'Put',
      usedVolatility / 100
    ) * contracts * CONTRACT_MULTIPLIER;

    resultRef.current.innerText = "$" + (Math.round(premium * CONTRACT_MULTIPLIER) / 100);

    setExplanation(summarize)
  };

  const summarize = () => {

    let date = new Date();

    date.setDate(date.getDate() + timeToExp);

    const baseStr = "Your current position gives you the right to "

    const infoStr = `${optionType == "Call" ? "buy" : "sell"} ${contracts * CONTRACT_MULTIPLIER} shares of `

    const stockStr = `${stockSymbol} stock at $${strikePrice} on ${getExpiryDate(timeToExp)}`;

    return baseStr + infoStr + stockStr;
  }

  const getExpiryDate = (days) =>{

      let today = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
      ));

      today.setUTCDate(today.getUTCDate() + 1);

      let formattedDate = (today.getUTCMonth() + 1).toString().padStart(2, '0') + '/' +
                        today.getUTCDate().toString().padStart(2, '0') + '/' +
                        today.getUTCFullYear();


    return formattedDate;
  }

  return (
    <>
      <TabGroup onActiveChange={handleActiveChange} />
      <div className='split'>
        <div className='split-left'>
          <h2>Underlying Stock</h2>
          <form onSubmit={getCurrentPrice}>
            <div className="input-group">
              <span>
              <label>Stock Symbol</label>
              <Button type='submit' version='getprice'>
                Get Price
              </Button>
              </span>
              <input
                onChange={handleInputChange(setStockSymbol)}
                type="text"
                value={stockSymbol}
              />
            </div>
          </form>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Current Price</label>
              <input
                onChange={handleInputChange(setCurrentPrice)}
                type="number"
                ref={currentPriceRef}
                value={currentPrice}
              />
            </div>
            <h2>Option</h2>
            <div className="input-group">
              <label>Strike Price</label>
              <input
                onChange={handleInputChange(setStrikePrice)}
                type="number"
                ref={strikePriceRef}
                value={strikePrice}
              />
              <label>Time to Expiry (in Days)</label>
              <input
                onChange={handleInputChange(setTimeToExp)}
                type="number"
                ref={timeToExpRef}
                value={timeToExp}
              />
              <label>Number of Contracts</label>
              <span>
                <input
                  onChange={handleInputChange(setContracts)}
                  type="number"
                  ref={contractsRef}
                  value={contracts}
                />
                <>  X {CONTRACT_MULTIPLIER}</>
              </span>
            </div>
            <div className="input-group">
              <span>
              <label>Use custom volatility</label>
              <input type="checkbox" checked={useUserInputVol} onChange={() => setUseUserInputVol(!useUserInputVol)} />
              </span>
              {useUserInputVol && (
                <>
                  <label>Volatility (%)</label>
                  <input
                    onChange={handleInputChange(setVolatility)}
                    type="number"
                    ref={volatilityRef}
                    value={volatility}
                  />
                </>
              )}
            </div>
            <Button type='submit' version='secondary'>
              Calculate!
            </Button>
          </form>
        </div>
        
        <div className="split-right">
        <div className="output-group">
        <p class="bold-text">Your current position:</p>
          <span>
              <p class="bold-text" ref={resultRef}>$</p>
          </span>
          <br></br>
          <p>Volatility:</p>
          <span>
            <p>{(Math.round(volatility * 100) / 100) + "%"}</p>
          </span>
          <br></br>
          <p>Your position is:</p>
          <p>
              {optionType === 'Call' 
                  ? (currentPrice > strikePrice ? 'In the Money' : 'Out of the Money')
                  : (currentPrice < strikePrice ? 'In the Money' : 'Out of the Money')
              }
          </p>
          </div>
        <div className="output-group">
          <p class="bold-text">Explanation:</p>
          <p>{explanation === ''? '' : explanation}</p>
        </div>
      </div>
      </div>
    </>
  );
}

export default OptionForm;