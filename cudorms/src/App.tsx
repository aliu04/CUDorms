import './App.css';
import searchIcon from './assets/search.png';
import { useState, useEffect } from 'react';
import React from 'react';

//defining interface of dorm
interface Dorm {
  name: string;
}

function App() {
  // Use the interface with useState
  const [dorms, getDorms] = useState<Dorm[]>([]);

  //gets all dorms using endpoint (stored in array called dorms)
  useEffect(() => {
    fetch('http://localhost:4000/dorms')
      .then((response) => {
        if (!response.ok) {
          throw new Error('http error');
        }
        return response.json();
      })
      .then((data) => {
        getDorms(data.data)
        console.log(data.data)
      })
      .catch((error) => {
        console.log('Fetch error:', error);
      })

  }, []);

  return (
    <>
      <h1>CUDorms</h1>
      <div>
        <form id="form">
          <div className="input-box">
            <img className="search-icon" src={searchIcon} />
            <input placeholder="Enter a dorm"
              id="filter-text-val" />
          </div>
        </form>
      </div>
      <div>
        {dorms.length > 0 ? (
          <ul>
            {dorms.map((dorm) => (
              <li>{dorm.name}</li>
            ))}
          </ul>
        ) : (
          <p>No dorms found.</p>
        )}
      </div>
    </>
  )
}

export default App
