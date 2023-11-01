import React from 'react';

const CustomInput = ({
    positionType,
    optionType,
    strikePrice,
    timeToExp,
    contracts,
    handleInputChange,
    handlePositionTypeChange,
    handleOptionTypeChange,
    strikePriceRef,
    timeToExpRef,
    contractsRef,
    CONTRACT_MULTIPLIER,
  }) => {
    return (
      <>
        <select value={positionType} onChange={handlePositionTypeChange}>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
        <select value={optionType} onChange={handleOptionTypeChange}>
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
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

  export default CustomInput