import './App.css'
import Products from './Products'

function App() {

  return (
    <>
      <div className='title-bar'>
        <img className="hamburger" src="/ham.png"/>
        <h3 className='title-text'>Beer-Bud .ai</h3>
      </div>
      <Products/>
    </>
  )
}

export default App
