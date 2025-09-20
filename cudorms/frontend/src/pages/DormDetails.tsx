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
      <NavBar />
      <div className="dorm-header-container">
        <h1 className="dorm-title">{dorm.name}</h1>
        <h1 className="dorm-description">{dorm.description}</h1>
        <h1 className="dorm-rating"> {dorm?.rating || "N/A"} </h1>
        <p className="dorm-rating-2"> / 5 </p>
      </div>
      <p className="dorm-address"> {dorm?.address?.address || "N/A"}</p>
      <p className='dorm-location'>{dorm?.location || "N/A"}</p>
      <p>
        Coordinates: {dorm?.address?.coordinates?.length === 2
          ? `(${dorm.address.coordinates.join(", ")})`
          : "Not available"}
      </p>
      <p>Availability: {dorm?.availability?.length ? dorm.availability.join(", ") : "Not specified"}</p>

    </>
  )

}

export default DormDetails;