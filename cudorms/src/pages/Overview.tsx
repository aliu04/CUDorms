import searchIcon from '../assets/search.png';
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
          <ul>
            {searchedDorms.map((dorm) => (
              <li key={dorm._id} className='dorm-elt'>
                <Link to={`/dorms/${dorm._id}`}>{dorm.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No dorms found.</p>
        )}
      </div>

      <div className="dorm-grid">
        {searchedDorms.map((dorm) => (
          <DormCard dorm={dorm} key={dorm._id}/>
        ))}
      </div>
    </>
  )
}

export default Overview
