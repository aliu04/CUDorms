import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchDorms, setFilters } from '../store/slices/dormSlice';
import { Dorm } from '../interfaces';
import DormCard from '../components/DormCard';
import NavBar from '../components/NavBar';

function Overview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [minRating, setMinRating] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const { dorms, isLoading, pagination } = useSelector((state: RootState) => state.dorm);

  // Fetch dorms on component mount
  useEffect(() => {
    dispatch(fetchDorms({ limit: 20 }));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(setFilters({
      search: searchTerm,
      year: selectedYear,
      minRating: minRating,
    }));
    dispatch(fetchDorms({
      search: searchTerm,
      year: selectedYear,
      minRating: minRating,
      limit: 20,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMinRating(parseFloat(event.target.value));
  };

  return (
    <div className="overview-container">
      <NavBar/>
      
      <div className="hero-section">
        <h1 className="hero-title">Find Your Perfect Cornell Dorm</h1>
        <p className="hero-subtitle">Discover the best dorms on campus with detailed amenities, reviews, and insider tips</p>
      </div>

      <div className="search-section">
        <div className="search-filters">
          <div className="search-input-group">
            <input 
              type="text"
              placeholder="Search dorms by name, location, or amenities..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select 
              value={selectedYear} 
              onChange={handleYearChange}
              className="filter-select"
            >
              <option value="">All Years</option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="graduate">Graduate</option>
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={minRating} 
              onChange={handleRatingChange}
              className="filter-select"
            >
              <option value={0}>All Ratings</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          <button onClick={handleSearch} className="search-button">
            Search Dorms
          </button>
        </div>
      </div>
      
      <div className="dorms-section">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dorms...</p>
          </div>
        ) : dorms.length > 0 ? (
          <div className="dorms-grid">
            {dorms.map((dorm) => (
              <DormCard dorm={dorm} key={dorm._id}/>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No dorms found</h3>
            <p>Try adjusting your search criteria or check back later.</p>
          </div>
        )}

        {pagination && pagination.total > dorms.length && (
          <div className="load-more">
            <p>Showing {dorms.length} of {pagination.total} dorms</p>
            <button className="load-more-button">
              Load More Dorms
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Overview
