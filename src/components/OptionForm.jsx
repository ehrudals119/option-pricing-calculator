import React, { useState, useRef } from 'react';
import Button from './shared/Button';
import { calculation } from './Calculation';
import { TabGroup } from './OptionTabs';
import OptionInput from './OptionInput';

const BASE_URL_VOL = "http://localhost:4000/volatility?ticker=";
const BASE_URL_PRICE = "http://localhost:4000/price?ticker=";

const CONTRACT_MULTIPLIER = 100;

function OptionForm() {
  // State variables
  const [strategyType, setStrategyType] = useState('');
  const [legs, setLegs] = useState(1);
  const [optionTypes, setOptionTypes] = useState(['','','','']);
  const [positionTypes, setPositionTypes] = useState(['','','','']);
  const [strikePrices, setStrikePrices] = useState(['','','','']);
  const [stockSymbol, setStockSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [timeToExp, setTimeToExp] = useState(1);
  const [contracts, setContracts] = useState(1);
  const [volatility, setVolatility] = useState(10);
  const [explanation, setExplanation] = useState('');

  const [useUserInputVol, setUseUserInputVol] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Refs
  const currentPriceRef = useRef();
  const strikePriceRef = useRef();
  const timeToExpRef = useRef();
  const contractsRef = useRef();
  const volatilityRef = useRef();
  const resultRef = useRef();

  const handleInputChange = (name, index) => (e) => {
    const value = e.target.value;
    switch (name) {
      case 'stockSymbol':
        setStockSymbol(value);
        break;
      case 'currentPrice':
        setCurrentPrice(value);
        break;
      case 'strikePrice':
        const updatedStrikePrices = [...strikePrices];
        updatedStrikePrices[index] = value;
        setStrikePrices(updatedStrikePrices);
        break;
      case 'timeToExp':
        setTimeToExp(value);
        break;
      case 'contracts':
        setContracts(value);
        break;
      case 'volatility':
        setVolatility(value);
        break;
      default:
        break;
    }
  };

  const handleActiveChange = (strat) => {
      setStrategyType(strat);
      let updatedLegs = 1;
      let updatedOptionTypes = ['','','',''];
      let updatedPositionTypes = ['','','',''];

      switch(strat) {
          case "Call":
              updatedLegs = 1;
              updatedOptionTypes = ['Call','','',''];
              updatedPositionTypes = ['Long','','',''];
              break;
          case "Put":
              updatedLegs = 1;
              updatedOptionTypes = ['Put','','',''];
              updatedPositionTypes = ['Long','','',''];
              break;
          case "Call Spread":
              updatedLegs = 2;
              updatedOptionTypes = ['Call','Call','',''];
              updatedPositionTypes = ['Long','Short','',''];
              break;
          case "Put Spread":
              updatedLegs = 2;
              updatedOptionTypes = ['Put','Put','',''];
              updatedPositionTypes = ['Long','Short','',''];
              break;
          case "Strangle/Straddle":
              updatedLegs = 2;
              updatedOptionTypes = ['Put','Call','',''];
              updatedPositionTypes = ['Long','Long','',''];
              break;
          case "Iron Condor/Butterfly":
              updatedLegs = 4;
              updatedOptionTypes = ['Put','Put','Call','Call'];
              updatedPositionTypes = ['Long','Short','Long','Short'];
              break;
          default:
              break;
      }

      setLegs(updatedLegs);
      setOptionTypes(updatedOptionTypes);
      setPositionTypes(updatedPositionTypes);
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

    if (timeToExp < 7) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }

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

    var totalPremium = 0;

    for(let i = 0; i < legs; i++){
      const premium = calculation(
        currentPrice,
        strikePrices[i],
        timeToExp,
        optionTypes[i] === 'Put',
        usedVolatility / 100
      ) * contracts * CONTRACT_MULTIPLIER;

      totalPremium += premium * (positionTypes[i] === "Short" ? -1 : 1);
    }

    resultRef.current.innerText = "$" + (Math.round(totalPremium * CONTRACT_MULTIPLIER) / 100);

    setExplanation(summarize(Number(timeToExpRef.current.value)));
  };

  const summarize = (expiryDays) => {
    const baseStr = "Your current position gives you the right to ";
    let infoStr = ""; 

    var haveShort = false;
  
    for(let i = 0; i < legs; i++){
      console.log(`Pos: ${positionTypes[i]}`);
      if(positionTypes[i] === 'Long'){
        if(i === legs - 1){
          infoStr += `${optionTypes[i] === "Put" ? 'sell' : 'buy'} ${contracts * CONTRACT_MULTIPLIER} shares of ${stockSymbol} stock at $${strikePrices[i]} `;
        }
        else{
          infoStr += `${optionTypes[i] === "Put" ? 'sell' : 'buy'} ${contracts * CONTRACT_MULTIPLIER} shares of ${stockSymbol} stock at $${strikePrices[i]}, `;
        }
      }
      else{
        haveShort = true;
      }
    }

    if(haveShort){
      infoStr += "and obligates you to "
      for(let i = 0; i < legs; i++){
        if(positionTypes[i] === 'Short'){
          if(i === legs - 1){
            infoStr += `${optionTypes[i] === "Put" ? 'sell' : 'buy'} ${contracts * CONTRACT_MULTIPLIER} shares of ${stockSymbol} stock at $${strikePrices[i]} `;
          }
          else{
            infoStr += `${optionTypes[i] === "Put" ? 'sell' : 'buy'} ${contracts * CONTRACT_MULTIPLIER} shares of ${stockSymbol} stock at $${strikePrices[i]}, `;
          }
        }
      }
    }
  
    infoStr += `on ${getExpiryDate(expiryDays)}`;
  
    return baseStr + infoStr;
  };

  const getExpiryDate = (days) => {
    var today = new Date();
    today.setDate(today.getDate() + days);
    return today.toDateString(); 
}

  return (
    <>
      {showAlert && <div className="alert">Time to expiry is less than 7 days!</div>}
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
                onChange={handleInputChange('stockSymbol')}
                type="text"
                value={stockSymbol}
              />
            </div>
          </form>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Current Price</label>
              <input
                onChange={handleInputChange('currentPrice')}
                type="number"
                ref={currentPriceRef}
                value={currentPrice}
              />
            </div>

            {
              legs > 0 &&
              Array.from({ length: legs }, (_, i) => (
                <OptionInput
                  key={i}
                  name={positionTypes[i] + " " + optionTypes[i]}
                  strikePrice={strikePrices[i]}
                  timeToExp={timeToExp}
                  contracts={contracts}
                  handleInputChange={(name) => (e) => handleInputChange(name, i)(e)}
                  index={i}
                  strikePriceRef={strikePriceRef}
                  timeToExpRef={timeToExpRef}
                  contractsRef={contractsRef}
                  CONTRACT_MULTIPLIER={CONTRACT_MULTIPLIER}
                />
              ))
            }

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
          <p>Implied Volatility:</p>
          <span>
            <p>{(Math.round(volatility * 100) / 100) + "%"}</p>
          </span>
          <br></br>
          <p>Your position is currently:</p>
          {/* <p>
              {optionType === 'Call' 
                  ? (currentPrice > strikePrice ? 'In the Money' : 'Out of the Money')
                  : (currentPrice < strikePrice ? 'In the Money' : 'Out of the Money')
              }
          </p> */}
          </div>
        <div className="output-group">
          <p class="bold-text">Breakdown:</p>
          <p>{explanation === '' ? '' : explanation}</p>
        </div>
      </div>
      </div>
    </>
  );
}

export default OptionForm;