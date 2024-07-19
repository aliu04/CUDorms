import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dorm } from '../interfaces';
import NavBar from '../components/NavBar'


function DormDetails() {
  const [dorm, setDorm] = useState<Dorm | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetch(`http://localhost:4000/dorms/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('error');
        }
        return response.json();
      })
      .then((data) => {
        setDorm(data);
      })
      .catch((error) => {
        console.log('Fetch error:', error);
      })
  }, [id]);

  if (!dorm) return <p>No dorm data found</p>;

  return (
    <>
      {/* still need to show images*/}
      <NavBar/>
      <div className = "dorm-header-container">
        <h1 className = "dorm-title">{dorm.name}</h1>
        <h1 className = "dorm-rating"> {dorm.rating} </h1>
        <p className = "dorm-rating-2"> / 5 </p>
      </div>
      <p className = "dorm-address"> {dorm.address.address}</p>
      <p className = 'dorm-location'>{dorm.location}</p>
      <p>Coordinates: {'(' + dorm.address.coordinates.join(', ') + ')'}</p>
      <p>Availability: {dorm.availability.join(', ')}</p>
    </>
  )

}

export default DormDetails;