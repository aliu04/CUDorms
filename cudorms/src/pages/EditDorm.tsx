import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dorm } from '../interfaces';
import { useNavigate } from 'react-router-dom';

function EditDorm() {
  const [dorm, setDorm] = useState<Dorm | null>();
  const [editVersion, setEditVersion] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  const handleEdit = () => {
    setEditVersion(true);
    setNewLocation(dorm.location);
  };
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation(event.target.value);
  };

  const handleDelete = () => {
    fetch(`http://localhost:4000/dorms/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Delete request failed');
        }
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleSubmit() {
    const data = {
      location: newLocation
    };
    fetch(`http://localhost:4000/dorms/${id}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('http error');
        }
        return response.json();
      })
      .then(updatedDorm => {
        console.log(data)
        setDorm(updatedDorm);
        setEditVersion(false);
      })
      .catch((error) => {
        alert('error');
        console.log(error);
      })
  };
  
  return (
    <>
      <h1>Dorm Info</h1>
      <p> Name: {dorm.name}</p>
      {editVersion ? (
        <>
          <input
            type="text"
            value={newLocation}
            onChange={handleLocationChange}
            placeholder="Enter new location" />
          <button onClick={handleSubmit}>Save</button>
        </>
      ) : (
        <>
          <p> Location: {dorm.location}</p>
          <button onClick={handleEdit}>Edit</button>
        </>
      )}
      <button onClick={handleDelete}>Delete</button>
    </>
  );
}

export default EditDorm;