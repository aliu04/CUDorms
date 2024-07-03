import { useState, useEffect } from "react";
import { Dorm } from "../interfaces";
import { Link } from "react-router-dom";

function ModifyDorms() {
  // Use the interface with useState
  const [dorms, getDorms] = useState<Dorm[]>([]);
  const [name, setName] = useState('');

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

  function handleAddDorms() {
    const data = {
      name,
    };
    fetch('http://localhost:4000/dorms', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('http error');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.dorm) {
          getDorms([...dorms, data.dorm]);
          setName('')
        }
        console.log(data)
      })
      .catch((error) => {
        alert('error');
        console.log(error);
      })
  };
  return (
    <div>
      <h1>Behind the scenes page</h1>
      <div>
        {dorms.length > 0 ? (
          <ul>
            {dorms.map((dorm) => (
              <li key={dorm._id} className='dorm-elt'>
                <Link to={`/admin/dorms/${dorm._id}`}>{dorm.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No dorms found.</p>
        )}
      </div>
      <form className="form-new-dorm">
        <input className="add-name" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <button type="button" onClick={handleAddDorms}> Add </button>
      </form>

    </div>


  )

}

export default ModifyDorms;