import React from 'react';
import { Link } from 'react-router-dom';
import { Dorm } from '../interfaces';
import "../App.css";

interface DormCardProps {
  dorm: Dorm;
}

const DormCard: React.FC<DormCardProps> = ({ dorm }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">⭐</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star">✨</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const getAmenityIcons = (amenities: Dorm['amenities']) => {
    const amenityList = [];
    
    if (amenities.laundry) amenityList.push({ icon: '🧺', name: 'Laundry' });
    if (amenities.kitchen) amenityList.push({ icon: '🍳', name: 'Kitchen' });
    if (amenities.ac) amenityList.push({ icon: '❄️', name: 'AC' });
    if (amenities.gym) amenityList.push({ icon: '💪', name: 'Gym' });
    if (amenities.parking) amenityList.push({ icon: '🅿️', name: 'Parking' });
    if (amenities.elevator) amenityList.push({ icon: '🛗', name: 'Elevator' });
    if (amenities.studyRoom) amenityList.push({ icon: '📚', name: 'Study Room' });
    if (amenities.petFriendly) amenityList.push({ icon: '🐕', name: 'Pet Friendly' });

    return amenityList.slice(0, 4); // Show max 4 amenities
  };

  return (
    <div className="dorm-card">
      <Link to={`/dorms/${dorm._id}`} className="dorm-card-link">
        <div className="dorm-image">
          {dorm.images && dorm.images.length > 0 ? (
            <img src={dorm.images[0]} alt={dorm.name} />
          ) : (
            <div className="dorm-image-placeholder">
              <span>🏠</span>
            </div>
          )}
          <div className="dorm-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>

        <div className="dorm-info">
          <div className="dorm-header">
            <h3 className="dorm-name">{dorm.name}</h3>
            {dorm.location && (
              <p className="dorm-location">📍 {dorm.location}</p>
            )}
          </div>

          {dorm.description && (
            <p className="dorm-description">
              {dorm.description.length > 100 
                ? `${dorm.description.substring(0, 100)}...` 
                : dorm.description}
            </p>
          )}

          <div className="dorm-rating">
            <div className="rating-stars">
              {renderStars(dorm.rating.average)}
            </div>
            <span className="rating-text">
              {dorm.rating.average.toFixed(1)} ({dorm.rating.count} reviews)
            </span>
          </div>

          <div className="dorm-amenities">
            {getAmenityIcons(dorm.amenities).map((amenity, index) => (
              <span key={index} className="amenity-icon" title={amenity.name}>
                {amenity.icon}
              </span>
            ))}
            {getAmenityIcons(dorm.amenities).length === 4 && (
              <span className="amenity-more" title="More amenities">
                +{Object.values(dorm.amenities).filter(Boolean).length - 4}
              </span>
            )}
          </div>

          <div className="dorm-availability">
            <div className="availability-tags">
              {dorm.availability.slice(0, 3).map((year, index) => (
                <span key={index} className="availability-tag">
                  {year}
                </span>
              ))}
              {dorm.availability.length > 3 && (
                <span className="availability-more">
                  +{dorm.availability.length - 3} more
                </span>
              )}
            </div>
          </div>

          {dorm.roomTypes.length > 0 && (
            <div className="dorm-pricing">
              <span className="price-range">
                ${Math.min(...dorm.roomTypes.map(rt => rt.price))} - 
                ${Math.max(...dorm.roomTypes.map(rt => rt.price))}
                <span className="price-period">/semester</span>
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default DormCard;