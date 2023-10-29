const handleActiveChange = (strat, setStrategyType, setLegs, setOptionTypes, setPositionTypes) => {
    let updatedLegs = 1;
    let updatedOptionTypes = ["", "", "", ""];
    let updatedPositionTypes = ["", "", "", ""];

    switch (strat) {
        case "Call":
            updatedLegs = 1;
            updatedOptionTypes = ["Call", "", "", ""];
            updatedPositionTypes = ["Long", "", "", ""];
            break;
        case "Put":
            updatedLegs = 1;
            updatedOptionTypes = ["Put", "", "", ""];
            updatedPositionTypes = ["Long", "", "", ""];
            break;
        case "Call Spread":
            updatedLegs = 2;
            updatedOptionTypes = ["Call", "Call", "", ""];
            updatedPositionTypes = ["Long", "Short", "", ""];
            break;
        case "Put Spread":
            updatedLegs = 2;
            updatedOptionTypes = ["Put", "Put", "", ""];
            updatedPositionTypes = ["Long", "Short", "", ""];
            break;
        case "Strangle/Straddle":
            updatedLegs = 2;
            updatedOptionTypes = ["Put", "Call", "", ""];
            updatedPositionTypes = ["Long", "Long", "", ""];
            break;
        case "Iron Condor/Butterfly":
            updatedLegs = 4;
            updatedOptionTypes = ["Put", "Put", "Call", "Call"];
            updatedPositionTypes = ["Long", "Short", "Long", "Short"];
            break;
        default:
            break;
    }

    setStrategyType(strat);
    setLegs(updatedLegs);
    setOptionTypes(updatedOptionTypes);
    setPositionTypes(updatedPositionTypes);
};

export default handleActiveChange;
