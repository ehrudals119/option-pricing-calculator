import {useState} from 'react'
import PropTypes from 'prop-types'

function OptionContracts({text}) {

  const [contracts, setContracts] = useState('')
  
  const handleContractsChange = (e) => {
    setContracts(e.target.value)
  }
  
  return (
    <>
    <label htmlFor="">{text}</label>
    <span>
    <input 
    onChange={handleContractsChange} 
    type="number"
    value={contracts}/>
    <>  X100</>
    </span>
    </>
  )
}

OptionContracts.defaultProps = {
    text: 'Amount of Contracts',
}

OptionContracts.propTypes = {
    text: PropTypes.string,
}

export default OptionContracts