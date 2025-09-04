import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context2/AuthContext";
import axios from "axios";
import { IconHeartFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import './UserFavorites.css';

const UserFavorites = () => {
  const { currentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      console.log("Fetching favorites for user:", currentUser?.user.id);
      const response = await axios.get(
        import.meta.env.VITE_BACKEND +
          `/api/userFavorites/getUserFavorites/${currentUser?.user.id}`
      );
      console.log("API Response:", response.data);
      
      if (response.data === "failed") {
        setError("Failed to fetch favorites");
      } else {
        setFavorites(response.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (propertyId) => {
    try {
      await axios.delete(import.meta.env.VITE_BACKEND + `/api/userFavorites/removeFromFavorites/${currentUser?.user.id}/${propertyId}`);
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.property_id !== propertyId));
    } catch (err) {
      console.error("Error removing from favorites:", err);
      setError("Failed to remove from favorites");
    }
  };

  const viewProperty = (favorite) => {
    if (favorite.pro_url) {
      // Open property in new tab using the pro_url
      window.open(`https://landmarkplots.com/${favorite.pro_url}`, '_blank');
    } else {
      // Fallback to my-property page if pro_url is not available
      navigate(`/my-property/${favorite.property_id}`);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your favorites...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error!</h4>
              <p>{error}</p>
              <button 
                className="btn btn-outline-danger" 
                onClick={fetchFavorites}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0 favorites-card" style={{ borderRadius: "15px" }}>
            <div className="card-header favorites-header border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bold text-white">
                  <IconHeartFilled className="me-2" style={{ color: '#ff6b6b' }} />
                  My Favorites
                  <span className="favorites-count ms-2">{favorites.length}</span>
                </h4>
              </div>
            </div>
            
            <div className="card-body p-4">
              {favorites.length === 0 ? (
                <div className="text-center py-5">
                  <IconHeartFilled size={64} style={{ color: '#e5e7eb' }} />
                  <h5 className="mt-3 text-muted">No favorites yet</h5>
                  <p className="text-muted">Start adding properties to your favorites to see them here.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Browse Properties
                  </button>
                </div>
              ) : (
                <div className="row">
                  {favorites.map((favorite) => (
                    <PropertyCard
                      key={favorite.id}
                      property={favorite}
                      onRemove={removeFromFavorites}
                      onView={viewProperty}
                      showActions={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFavorites;
