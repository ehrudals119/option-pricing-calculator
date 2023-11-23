import React from 'react';
import styled from 'styled-components';

const Select = styled.select`
  margin: 5px 5px 5px 0px;
  border-radius: 5px;
  justify-content: flex-end;
  border: none;
  font-size: 18px;
  font-family: Arial;
  background-color: WhiteSmoke; 
`;

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
        <Select value={positionType} onChange={handlePositionTypeChange}>
          <option value="Long">Long</option>
          <option value="Short">Short</option>
        </Select>
        <Select value={optionType} onChange={handleOptionTypeChange}>
          <option value="Call">Call</option>
          <option value="Put">Put</option>
        </Select>
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