import {cdf} from './NormalDistribution'

export const calculation = (currentPrice, strikePrice, timeToExp, isPut) => {

    const volatility = 0.4
    const interestRate = 0.01
    const timeToExpinYears = timeToExp/365

    let premium = 0

    const d1 = dOne(currentPrice, strikePrice, timeToExpinYears, volatility, interestRate);

    const d2 = dTwo(d1, volatility, timeToExpinYears);

    if(isPut){
        const Nd1 = cdf(d1 * -1);

        const Nd2 = cdf(d2 * -1);

        premium =  Nd2 * strikePrice * Math.pow(Math.E, -1 * interestRate * timeToExpinYears) - Nd1 * currentPrice
    }

    else{
        const Nd1 = cdf(d1);

        const Nd2 = cdf(d2);

        premium = Nd1 * currentPrice - Nd2 * strikePrice * Math.pow(Math.E, -1 * interestRate * timeToExpinYears)
    }

    return premium
}

const dOne = (currentPrice, strikePrice, timeToExp, volatility, interestRate) => {
    let d1 = (Math.log(currentPrice/strikePrice) + (interestRate + (Math.pow(0.40,2)/2)) * (timeToExp)) / (volatility * Math.pow(timeToExp,0.5));

    return d1;
}

const dTwo = (d1, volatility, timeToExp) => {
    let d2 = d1 - volatility * Math.pow((timeToExp),0.5);

    return d2;
}