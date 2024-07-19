import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dorm } from '../interfaces';
import { ChangeEvent } from 'react';
import DormCard from '../components/DormCard';
import NavBar from '../components/NavBar';

function Overview() {
  // Use the interface with useState
  const [dorms, getDorms] = useState<Dorm[]>([]);
  const [searchBar, setSearchBar] = useState('');


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

  const handleSearchBar = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchBar(event.target.value);
  };

  const searchedDorms = dorms.filter(dorm =>
    dorm.name.toLowerCase().includes(searchBar.toLowerCase())
  );

  return (
    <>
      <NavBar/>
      <h1 className = 'search-title'> Find your Dorm </h1>
      <div>
        <form id="form">
            <input placeholder="Enter a dorm" id="filter-text-val" onChange={handleSearchBar} />
        </form>
      </div>
      
      <div>
        {searchedDorms.length > 0 ? (
          <div className = 'grid-container'>
          <div className="dorm-grid">
            {searchedDorms.map((dorm) => (
              <DormCard dorm={dorm} key={dorm._id}/>
            ))}
          </div>
          </div>
        ) : (
          <p>No dorms found.</p>
        )}
      </div>
    </>
  )
}

export default Overview
