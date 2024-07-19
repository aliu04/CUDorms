import "../App.css";
import { Dorm } from '../interfaces';

interface DormCardProps {
  dorm: Dorm;
}

const DormCard: React.FC<DormCardProps> = ({ dorm }) => {
  return (
    <div key = {dorm._id} className = "dorm-card">
      <img src={dorm.images[0]} alt={dorm.name} />
      <span className = "dorm-card-info">
        <h3 className="dorm-card-title"> {dorm.name} </h3>
      </span>
    </div>
  )
}

export default DormCard;