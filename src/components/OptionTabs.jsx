import React, { useState } from 'react';
import styled from 'styled-components';

const Tab = styled.button`
  font-size: 20px;
  padding: 10px 60px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 1;
  outline: 0;
  display: center;
  ${({ active }) =>
    active &&
    `
    border-bottom: 2px solid black;
    opacity: 1;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
  align-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap; /* Add flex-wrap property to wrap the tabs */
`;

const types = {
  Bullish: ['Call', 'Call Spread'],
  Bearish: ['Put', 'Put Spread'],
  Volatile: ['Strangle/Straddle'],
  Sideways: ['Iron Condor/Butterfly'],
  Custom: ['Custom'],
};
export function TabGroup({ onActiveChange }) {
  const [active, setActive] = useState(types.Bullish[0]);

  const handleTabClick = (type) => {
    setActive(type);
    onActiveChange(type);
  };

  const sentiment = ['Bullish', 'Bearish', 'Volatile', 'Sideways', 'Custom'];

  const getSummary = (sentiment, type) => {
    if (type === 'Call') {
      return 'Buy a Call option when you expect the underlying stock price to rise.';
    } else if (type === 'Put') {
      return 'Buy a Put option when you expect the underlying stock price to fall.';
    } else if (type === 'Call Spread') {
      return sentiment === 'Bullish'
        ? 'Summary for Bullish Call Spread'
        : 'Summary for Bearish Call Spread';
    } else if (type === 'Put Spread') {
      return sentiment === 'Bullish'
        ? 'Summary for Bearish Put Spread'
        : 'Summary for Bullish Put Spread';
    } else if (type === 'Strangle/Straddle') {
      return 'A strangle or straddle involves buying a call and put. It is a strategy suited to a volatile market.';
    } else if (type === 'Iron Condor/Butterfly') {
      return 'An iron condor or Butterfly is a four-legged strategy that provides a profit plateau between the two inner legs. It is a strategy suited to a stable market.';
    } else {
      return '';
    }
  };

  return (
    <>
      <h3>You expect the market to be..</h3>
      <ButtonGroup>
        {Object.keys(types).map((sentiment) => (
          <div key={sentiment}>
            <h3>{sentiment}</h3>
            {types[sentiment].map((type) => (
              <Tab
                key={type}
                active={active === type}
                onClick={() => handleTabClick(type)}
              >
                {type}
              </Tab>
            ))}
          </div>
        ))}
      </ButtonGroup>
      <p />
      <p>{getSummary(active, sentiment)}</p>
    </>
  );
}
