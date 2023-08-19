import { cdf } from './NormalDistribution';

const INTEREST_RATE = 0.03;
const DAYS_IN_YEAR = 365;
const CONSTANT_POW = Math.pow(0.40, 2) / 2;

export const calculation = (currentPrice, strikePrice, timeToExp, isPut, volatility) => {
    const timeToExpInYears = timeToExp / DAYS_IN_YEAR;
    const d1 = calculateDOne(currentPrice, strikePrice, timeToExpInYears, volatility);
    const d2 = calculateDTwo(d1, volatility, timeToExpInYears);

    const Nd1 = cdf(isPut ? -d1 : d1);
    const Nd2 = cdf(isPut ? -d2 : d2);

    return isPut 
        ? Nd2 * strikePrice * Math.exp(-INTEREST_RATE * timeToExpInYears) - Nd1 * currentPrice 
        : Nd1 * currentPrice - Nd2 * strikePrice * Math.exp(-INTEREST_RATE * timeToExpInYears);
};

const calculateDOne = (currentPrice, strikePrice, timeToExp, volatility) => {
    return (Math.log(currentPrice / strikePrice) + (INTEREST_RATE + CONSTANT_POW) * timeToExp) / (volatility * Math.sqrt(timeToExp));
};

const calculateDTwo = (d1, volatility, timeToExp) => {
    return d1 - volatility * Math.sqrt(timeToExp);
};