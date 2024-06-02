import { useState, useEffect } from "react";
import { Dorm } from "../interfaces";

function ModifyDorms() {
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
    <div>
      <h1>Behind the scenes page</h1>
      <div>
        {dorms.length > 0 ? (
          <ul>
            {dorms.map((dorm) => (
              <li key={dorm._id} className='dorm-elt'>
                {dorm.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No dorms found.</p>
        )}
      </div>
    </div>


  )

}

export default ModifyDorms;