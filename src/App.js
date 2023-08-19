import Header from './components/Header'
import OptionForm from './components/OptionForm'
import FAQ from './components/faq'

function App() {
  return (
    <>
      <Header/>
      <div className="container">
        <div className="form">
          <OptionForm/>
        </div>
        <br></br>
        <FAQ />
      </div>
    </>
  ) 
}

export default App