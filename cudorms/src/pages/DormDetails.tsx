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
      <h1>{dorm.name}</h1>
      <p>Street Address: {dorm.address.address}</p>
      <p>Coordinates: {'(' + dorm.address.coordinates.join(', ') + ')'}</p>
      <p>Location: {dorm.location}</p>
      <p>Rating: {dorm.rating}</p>
      <p>Availability: {dorm.availability.join(', ')}</p>
    </>
  )

}

export default DormDetails;