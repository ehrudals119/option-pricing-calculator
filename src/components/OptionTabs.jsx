import React, { useState } from 'react';
import styled from 'styled-components';

const Tab = styled.button`
  font-size: 20px;
  padding: 10px 60px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 0;
  outline: 0;
  ${({ active }) =>
    active &&
    `
    border-bottom: 2px solid black;
    opacity: 1;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
`;
const types = ['Call', 'Put', 'Call Spread', 'Put Spread'];

export function TabGroup({ onActiveChange }) {
  const [active, setActive] = useState(types[0]);

  const handleTabClick = (type) => {
    setActive(type);
    onActiveChange(type);
  };

  const getSummary = (type) => {
    if (type === 'Call') {
      return 'Buy a Call option when you expect the underlying stock price to rise.';
    } else if (type === 'Put') {
      return 'Buy a Put option when you expect the underlying stock price to fall.';
    } else if (type === 'Call Spread'){
      return 'Buy a call spread when you expect the underlying stock to fall or rise moderately. Purchasing a call with a lower strike price than the written call (short) provides a bullish strategy, and purchasing a call with a higher strike price than the written call provides a bearish strategy.';
    } else if (type === 'Put Spread'){
      return 'Buy a call spread when you expect the underlying stock to fall or rise moderately. Purchasing a put with a lower strike price than the written put (short) provides a bearish strategy, and purchasing a put with a higher strike price than the written put provides a bearish strategy.'
    }
    else{
      return '';
    }

  };

  return (
    <>
      <ButtonGroup>
        {types.map(type => (
          <Tab
            key={type}
            active={active === type}
            onClick={() => handleTabClick(type)}
          >
            {type}
          </Tab>
        ))}
      </ButtonGroup>
      <p />
      <p>{getSummary(active)}</p>
    </>
  );
}
