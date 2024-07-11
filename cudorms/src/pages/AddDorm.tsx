import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from '../components/NavBar'

function AddDorm() {
  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [rating, setRating] = useState(0);
  const [availability, setAvailability] = useState<string[]>([]);

  const handleAvailabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setAvailability([...availability, value]);
    } else {
      setAvailability(availability.filter(avail => avail !== value));
    }
  };

  function handleAddDorms() {
    const data = {
      name,
      location,
      address: {
        address,
        coordinates: [longitude, latitude],
      },
      rating,
      availability
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
        navigate('/admin/dorms')
        console.log(data)

      })
      .catch((error) => {
        alert('error');
        console.log(error);
      })
  }
  return (
    <>
      <NavBar/>
      <form className="form-new-dorm">
        <label htmlFor="add-name">Name</label>
        <input className="add-name" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <label htmlFor="add-location">Location</label>
        <input className="add-location" type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <label htmlFor="add-address">Address</label>
        <input className="add-address" type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <label htmlFor="add-long">Longitude</label>
        <input className="add-long" type="number" value={longitude} onChange={e => setLongitude(parseFloat(e.target.value) || 0)} />
        <label htmlFor="add-lat">Latitude</label>
        <input className="add-lat" type="number" value={latitude} onChange={e => setLatitude(parseFloat(e.target.value) || 0)} />
        <label htmlFor="add-rating">Rating</label>
        <input className="add-rating" type="number" min="1" max="5" value={rating} onChange={e => setRating(parseFloat(e.target.value) || 0)} />
        <fieldset>
          <legend>Availability</legend>
          <label>
            <input type="checkbox" value="freshman" onChange={handleAvailabilityChange} />Freshman</label>
          <label>
            <input type="checkbox" value="sophomore" onChange={handleAvailabilityChange} />Sophomore</label>
          <label>
            <input type="checkbox" value="junior" onChange={handleAvailabilityChange} />Junior</label>
          <label>
            <input type="checkbox" value="senior" onChange={handleAvailabilityChange} />Senior</label>

        </fieldset>

        <button type="button" onClick={handleAddDorms}> Add </button>
      </form >
    </>
  );

}

export default AddDorm;