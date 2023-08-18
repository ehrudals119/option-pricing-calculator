import React, { useState, useRef, useEffect } from 'react';
import Button from './shared/Button';
import OptionStockSymbol from './variables/OptionStockSymbol';
import { calculation } from './Calculation';
import { TabGroup } from './OptionTabs';

function OptionForm() {
  // State variables
  const [optionType, setOptionType] = useState('call');
  const [stockSymbol, setStockSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [timeToExp, setTimeToExp] = useState('');
  const [contracts, setContracts] = useState(1);
  const [volatility, setVolatility] = useState(10);

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

  const baseurl_vol = "http://localhost:5000/volatility?ticker=";

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = baseurl_vol + stockSymbol;
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setVolatility(data.dailyVolatility))
      .catch(error => {
        console.log(error);
        setVolatility(10);
      });

    const premium = calculation(
      currentPriceRef.current.value,
      strikePriceRef.current.value,
      timeToExpRef.current.value,
      optionType === 'Put',
      volatility / 100
    ) * contractsRef.current.value * 100;

    resultRef.current.innerText = "$" + (Math.round(premium * 100) / 100);
  };

  return (
    <>
      <TabGroup onActiveChange={handleActiveChange} />
      <div className='split'>
        <div className='split-left'>
          <h2>Underlying Stock</h2>
          <div className="input-group">
            <label>Stock Symbol</label>
            <input
              onChange={handleInputChange(setStockSymbol)}
              type="text"
              value={stockSymbol}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Current Price</label>
              <input
                onChange={handleInputChange(setCurrentPrice)}
                type="number"
                ref={currentPriceRef}
                value={currentPrice || ''}
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
                <>  X100</>
              </span>
            </div>
            <Button type='submit' version='secondary'>
              Calculate!
            </Button>
          </form>
        </div>

        <div className="input-group split-right">
          <p>Current Position</p>
          <span>
            <p ref={resultRef}>$</p>
          </span>
          <p>Volatility</p>
          <span>
            <p>{(Math.round(volatility * 100) / 100) + "%"}</p>
          </span>
          <span>
          </span>
        </div>
      </div>
    </>
  );
}

export default OptionForm;