import React from "react";
import { IconStar, IconStarFilled, IconEye } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';
import { ShowPrice, DateFormat } from '../Functions';

const PropertyCard = ({ property, onRemove, onView, showActions = true }) => {
  // Get image URL
  const getImageUrl = () => {
    if (property.pro_cover_image) {
      return `${import.meta.env.REACT_APP_WEB_URL || 'https://landmarkplots.com'}/uploads/${property.pro_cover_image}`;
    } else {
      return `${import.meta.env.REACT_APP_WEB_URL || 'https://landmarkplots.com'}/uploads/default.jpg`;
    }
  };

  const handleUnfavorite = () => {
    const ok = window.confirm("Remove this property from favorites?");
    if (ok && onRemove) {
      onRemove(property.listing_id);
    }
  };

  return (
    <div className="col-md-3 mb-4">
      <article className="featured__card">
        <div className="featured__thumbnail position-relative">
          {/* Favorite Star */}
          <button
            className="favorite-star position-absolute"
            style={{ top: '15px', right: '15px', zIndex: 10, border: 'none', background: 'transparent', padding: 4, cursor: 'pointer' }}
            title="Unfavorite"
            aria-label="Unfavorite"
            onClick={handleUnfavorite}
          >
            <IconStarFilled size={20} style={{ color: '#f59e0b' }} />
          </button>
          
          <div className="media">
            <Link
              className="featured__thumbnail--link"
              to={`/my-property/${property.listing_id}`}
            >
              <img
                className="featured__thumbnail--img"
                src={getImageUrl()}
                alt={`Property in ${property.pro_city || 'Location'}`}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />
            </Link>
          </div>
          
          <div className="featured__badge">
            
            <span className="badge__field style2">
              For {property.pro_ad_type || 'Sale'}
            </span>
          </div>
        </div>
        
        <div className="featured__content">
          <div className="featured__content--top d-flex align-items-center justify-content-between">
            <h3 className="featured__card--title" style={{fontSize:"16px"}}>
           
                {property.pro_area_size && property.pro_area_size_unit && property.pro_type ? 
                  `${property.pro_area_size} ${property.pro_area_size_unit} ${property.pro_type.split(",")[0]}` : 
                  'Property Details'
                } for {property.pro_ad_type === "Rent" ? "Rent" : "Sale"} in{" "}
                <span className="text-capitalize">
                  {property.pro_locality || 'Location'}
                </span>
                {property.pro_sub_district ? `, ${property.pro_sub_district}` : ""}
                {property.pro_city ? `, ${property.pro_city}` : ""}
                {property.pro_state ? `, ${property.pro_state}` : ""}
              
            </h3>
          </div>
          
          <div>
            <span className="featured__card--price">
              {ShowPrice(property.pro_ad_type, property.pro_amt)}
            </span>
          </div>

          <p className="featured__content--desc">
            <svg
              width="11"
              height="17"
              viewBox="0 0 11 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.48287 0C2.45013 0 0 2.4501 0 5.48288C0 5.85982 0.0343013 6.21958 0.102785 6.57945C0.514031 9.69783 4.42055 11.9767 5.51712 16.4144C6.5966 12.0452 11 8.824 11 5.48288H10.9657C10.9657 2.45013 8.51548 0 5.48282 0H5.48287ZM5.48287 2.17592C7.21338 2.17592 8.61839 3.58097 8.61839 5.31144C8.61839 7.04191 7.21335 8.44696 5.48287 8.44696C3.7524 8.44696 2.34736 7.04191 2.34736 5.31144C2.34736 3.58097 3.75228 2.17592 5.48287 2.17592Z"
                fill="#16A34A"
              />
            </svg>
            {property.pro_locality || 'Location'}, {property.pro_city || 'City'}
          </p>
          
          
          <div className="featured__content--footer d-flex align-items-center justify-content-between">
            <div className="featured__author d-flex align-items-center">
              <span className="featured__author--name">
                <span className="featured__info--text" style={{fontSize: "13px"}}> 
                  Listed by {property.pro_user_type || 'Owner'}
                </span>
                {property.pro_creation_date ? DateFormat(property.pro_creation_date) : ''}
              </span>
            </div>

            {showActions && (
              <ul className="featured__content--share d-flex">
                <li className="featured__share--btn__list position-relative">
                  <button
                    className="featured__share--btn"
                    onClick={() => onView(property)}
                    title="View Property"
                  >
                    <IconEye size={16} />
                  </button>
                </li>
                {/* <li className="featured__share--btn__list position-relative">
                  <button
                    className="featured__share--btn"
                    onClick={handleUnfavorite}
                    title="Unfavorite"
                    aria-label="Unfavorite"
                  >
                    <IconStar size={16} />
                  </button>
                </li> */}
              </ul>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PropertyCard;
