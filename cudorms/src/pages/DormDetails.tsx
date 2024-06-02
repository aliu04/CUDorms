import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dorm } from '../interfaces';


function DormDetails() {
  const [dorm, setDorm] = useState<Dorm[]>([]);
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
  return (
    <h1>{dorm.name}</h1>
  )

}

export default DormDetails;