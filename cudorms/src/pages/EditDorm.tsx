import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dorm } from '../interfaces';
import { useNavigate } from 'react-router-dom';

function EditDorm() {
  const [dorm, setDorm] = useState<Dorm[]>([]);
  const [editVersion, setEditVersion] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>('');
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

  const handleEdit = () => {
    setEditVersion(true);
    setNewAddress(dorm.address);
  };
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress(event.target.value);
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
      address: newAddress
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
            value={newAddress}
            onChange={handleAddressChange}
            placeholder="Enter new address" />

          <button onClick={handleSubmit}>Save</button>
        </>
      ) : (
        <>
          <p> Address: {dorm.address}</p>
          <button onClick={handleEdit}>Edit</button>
        </>
      )}
      <button onClick={handleDelete}>Delete</button>
    </>
  );
}

export default EditDorm;