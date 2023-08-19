function FAQ() {
    const questionsAndAnswers = [
      {
        question: "What is a strike price?",
        answer: "A strike price refers to the fixed price at which the owner of an option can buy (in the case of a call option) or sell (in the case of a put option) the underlying security or asset. It's essentially the price at which an option gets its value.",
      },
      {
        question: 'What is formula is used for estimates?',
        answer: "The calculator uses the Black-Scholes formula to estimate returns at a range of dates and potential underlying prices. The estimations are based on implied volatility which is calculated from the current price of the selected options and the current price of the underlying stock or ETF."
      },
      {
        question: 'What are the limitations of the calculator?',
        answer: "The largest unknown in the Black-Scholes formula, and any other pricing method, is Implied Volatility. Given a constant IV, the calculator will be correct in its price estimation, however since IV is a reflection of market sentiment and external variables, it is impossible to predict what people will be thinking in the future."
      },

    ];
  
    return (
      <div className="faq-section faq-container">
        <h2>Frequently Asked Questions</h2>
        <br></br>
        {questionsAndAnswers.map((item, index) => (
          <div key={index} className="faq-item">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
            <br></br>
          </div>
        ))}
      </div>
    );
  }
  
  export default FAQ;
  