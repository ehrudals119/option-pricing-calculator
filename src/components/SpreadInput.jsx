import React from 'react';

const SpreadInputs = ({
  strikePrices,
  timeToExp,
  contracts,
  handleInputChange,
  handleInputChange1,
  strikePriceRef,
  timeToExpRef,
  contractsRef,
  CONTRACT_MULTIPLIER,
}) => {
  return (
    <>
    <h2>Long</h2>
    <div className="input-group">
      <label>Strike Price</label>
      <input
        onChange={handleInputChange('strikePrice', 0)}
        type="number"
        ref={strikePriceRef}
        value={strikePrices[0]}
      />
      <label>Time to Expiry (in Days)</label>
      <input
        onChange={handleInputChange('timeToExp')}
        type="number"
        ref={timeToExpRef}
        value={timeToExp}
      />
      <label>Number of Contracts</label>
      <span>
        <input
          onChange={handleInputChange('contracts')}
          type="number"
          ref={contractsRef}
          value={contracts}
        />
        <>  X {CONTRACT_MULTIPLIER}</>
       
      </span>
      </div>
    <h2>Short</h2>
    <div className="input-group">
      <label>Strike Price</label>
      <input
        onChange={handleInputChange1('strikePrice', 1)}
        type="number"
        ref={strikePriceRef}
        value={strikePrices[1]}
      />
      <label>Time to Expiry (in Days)</label>
      <input
        onChange={handleInputChange('timeToExp')}
        type="number"
        ref={timeToExpRef}
        value={timeToExp}
      />
      <label>Number of Contracts</label>
      <span>
        <input
          onChange={handleInputChange('contracts')}
          type="number"
          ref={contractsRef}
          value={contracts}
        />
        <>  X {CONTRACT_MULTIPLIER}</>
      </span>
      </div>
    </>
  );
};

export default SpreadInputs;
