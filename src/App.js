import Header from './components/Header'
import OptionForm from './components/OptionForm'

function App() {
  return (
    <>
      <Header/>
      <div className="container">
        <div className="form">
          <OptionForm/>
        </div>
      </div>
    </>
  ) 
}

export default App