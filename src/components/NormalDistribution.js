export const cdf = (z) => {

    if (z < -8.0) return 0;
    if (z > 8.0) return 1.0;

    let sum = 0.0, term = z;

    for(let i = 3; sum + term !== sum; i += 2){
        sum += term;
        term = term * z * z / i;
    }

    return 0.5 + sum * pdf(z);
}

const pdf = (x) => {
    return Math.exp(-x*x / 2) / Math.sqrt(2 * Math.PI);
} 