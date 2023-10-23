import React from 'react';

const BasicInputs = ({
  strikePrice,
  timeToExp,
  contracts,
  handleInputChange,
  strikePriceRef,
  timeToExpRef,
  contractsRef,
  CONTRACT_MULTIPLIER,
}) => {
  return (
    <>
    <h2>Option</h2>
    <div className="input-group">
      <label>Strike Price</label>
      <input
        onChange={handleInputChange('strikePrice')}
        type="number"
        ref={strikePriceRef}
        value={strikePrice}
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

export default BasicInputs;
