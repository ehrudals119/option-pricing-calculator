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
const types = ['Call', 'Put'];

export function TabGroup({ onActiveChange }) {
  const [active, setActive] = useState(types[0]);

  const handleTabClick = (type) => {
    setActive(type);
    onActiveChange(type);
  };

  const getSummary = (type) => {
    if (type === 'Call') {
      return 'Buy a Call option when you expect the underlying asset price to rise.';
    } else if (type === 'Put') {
      return 'Buy a Put option when you expect the underlying asset price to fall.';
    } else {
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
