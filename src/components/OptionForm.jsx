import React, { useState, useRef } from 'react';
import Button from './shared/Button';
import { calculation } from './Calculation';
import { TabGroup } from './OptionTabs';
import OptionInput from './OptionInput';
import CustomInput from './CustomInput';
import ProfitDiagram from './ProfitDiagram';

import { Chart, registerables} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';

Chart.register(...registerables);

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
  const [chartData, setChartData] = useState(null);

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

  const handlePositionTypeChange = (index) => (e) => {
    const value = e.target.value;
    const updatedPositionTypes = [...positionTypes];
    updatedPositionTypes[index] = value;
    setPositionTypes(updatedPositionTypes);
  };
  
  const handleOptionTypeChange = (index) => (e) => {
    const value = e.target.value;
    const updatedOptionTypes = [...optionTypes];
    updatedOptionTypes[index] = value;
    setOptionTypes(updatedOptionTypes);
  };

  const addLeg = async e =>  {
    e.preventDefault();
    if (legs < 4) {
    console.log("Adding leg...");
    const updatedLegs = legs + 1;
    const updatedOptionTypes = [...optionTypes, ''];
    const updatedPositionTypes = [...positionTypes, ''];
    const updatedStrikePrices = [...strikePrices, ''];
    setLegs(updatedLegs);
    setOptionTypes(updatedOptionTypes);
    setPositionTypes(updatedPositionTypes);
    setStrikePrices(updatedStrikePrices);
    }
  };

  const deleteLeg = async e => {
    e.preventDefault();
    if (legs > 1) {
      const updatedLegs = legs - 1;
      const updatedOptionTypes = optionTypes.slice(0, -1);
      const updatedPositionTypes = positionTypes.slice(0, -1);
      const updatedStrikePrices = strikePrices.slice(0, -1);
      setLegs(updatedLegs);
      setOptionTypes(updatedOptionTypes);
      setPositionTypes(updatedPositionTypes);
      setStrikePrices(updatedStrikePrices);
    }
  };  

  const generateChartData = () => {

    setChartData(null);

    const data = {
      datasets : []
    }

    for(let i = 0; i < legs; i++){
      data.datasets.push(
        {
          label: positionTypes[i] + " " + optionTypes[i],
          data: [],
          borderColor: optionTypes[i] === "Call" ? 'rgba(255,0,0,1)': 'rgba(75,192,225,1)' ,
          fill: false,        
          showLine: true,    
      })
    }

    data.datasets.push(
      {
        label: "Current Stock Price",
        data: [],
        borderColor: 'rgba(75,192,0,1)' ,
        fill: false,     
        showLine: true,        
    })

    for(let i = 0; i < legs; i++){

      const pivot = strikePrices[i];

      let value = parseInt(pivot);

      if(optionTypes[i] === "Call"){

        for(let j = 0; j < 4; j++){
          data.datasets[i].data.push({x: value + j * 50, y: j * 50});
        }
      }

      else{
        for(let j = 0; j < 4; j++){
          if(value - j * 50 >= 0){
            data.datasets[i].data.push({x: value - j * 50, y: j * 50});
          }
        }
      }

    }

    for(let x = 0; x < 4; x++){
        data.datasets[data.datasets.length - 1].data.push({x: currentPrice, y: x * 50});
    }

    const options = {
      plugins: {
        datalabels: {
          display: false,
        },
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: currentPrice,
            borderColor: 'rgba(0,255,0,1)',
            borderWidth: 2,
            label: {
              content: 'Current Price',
              enabled: true,
              position: 'top',
            },
          },
        ],
      },
    };
  
    setChartData({
      ...data,
      options: options,
    });

    setChartData(data);
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
          case "Custom":
              updatedLegs = 1;
              updatedOptionTypes = ['Call','Call','Call','Call'];
              updatedPositionTypes = ['Long','Long','Long','Long'];
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

    generateChartData();
  };

  const summarize = (expiryDays) => {
    const baseStr = "Your current position gives you the right to ";
    let infoStr = ""; 

    var haveShort = false;
  
    for(let i = 0; i < legs; i++){
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
              legs > 0 && strategyType !== 'Custom' ?
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
              )) : 
              Array.from({ length: legs }, (_, i) => (
                <CustomInput
                  key={i}
                  positionType = {positionTypes[i]}
                  optionType = {optionTypes[i]}
                  strikePrice={strikePrices[i]}
                  timeToExp={timeToExp}
                  contracts={contracts}
                  handleInputChange={(name) => (e) => handleInputChange(name, i)(e)}
                  index={i}
                  strikePriceRef={strikePriceRef}
                  timeToExpRef={timeToExpRef}
                  contractsRef={contractsRef}
                  CONTRACT_MULTIPLIER={CONTRACT_MULTIPLIER}
                  handlePositionTypeChange = {(e) => handlePositionTypeChange(i)(e)}
                  handleOptionTypeChange = { (e) => handleOptionTypeChange(i)(e)}
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
        <div className="graph">
          {chartData && (
            <Scatter
              data={chartData}
              options = {{
                plugins: {
                  title: {
                    display: true,
                    text: 'Option Profit Chart',
                    color: 'white',
                  },
                  legend: {
                    labels: {
                      color: 'white', 
                    },
                  },
                },
                scales: {x: { title: { display: true, text: 'Stock Price' , color: 'white'},
                ticks: {
                  color: 'white', 
                },        grid: {
                  color: 'black', 
                },},
              y : { title: { display: true, text: 'Payoff (Per Contract)',  color: 'white', }, 
              ticks: {
                color: 'white', 
              },
              grid: {
                color: 'black', 
              },}
              },
              maintainAspectRatio: false, 
              aspectRatio: 2, 
              responsive: true, 
            }}/>
          )}
        </div>
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
          </div>
        <div className="output-group">
          <p class="bold-text">Breakdown:</p>
          <p>{explanation === '' ? '' : explanation}</p>
        </div>
        {strategyType === 'Custom' && (
          <div className = "output-edit">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <form onSubmit={addLeg}>
                <Button type="submit" version="add">
                  Add
                </Button>
              </form>
            </div>
            <div>
              <form onSubmit={deleteLeg}>
                <Button type="submit" version="delete">
                  Delete
                </Button>
              </form>
            </div>
          </div>
          </div>
        )}


      </div>
      </div>
    </>
  );
}

export default OptionForm;