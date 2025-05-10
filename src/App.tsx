import './App.css'
import Products from './Products'
import { useState } from 'react'

function App() {
  const [beer, setBeer] = useState<string>("")

  async function addBeer(beer: string) {
    const query = beer
    setBeer("")
    const res = await fetch(`http://localhost:5555/get_product_attributes?query=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (!res.ok) {
      console.error(res.text());
    }
    const data: JSON = await res.json();
    console.log(data)
  }

  return (
    <>
    <div className='title-container'>
      <div className='title-bar'>
        <img className="hamburger" src="/ham.png"/>
        <h3 className='title-text'>Beer-Bud .ai</h3>
        <form id='add-beer' onSubmit={(e)=> {e.preventDefault(); addBeer(beer); }}>
          <input type="text" onChange={(e) => setBeer(e.target.value)} value={beer}/>
        </form>
      </div>
      </div>
      <Products/>
    </>
  )
}

export default App
