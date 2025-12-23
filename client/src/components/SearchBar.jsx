import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      <style>{`
        .search-bar {
          position: relative;
          flex: 1 1 auto;
          min-width: 100px;
          max-width: 250px;
          margin-right:50px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }
        .search-bar input {
          width: 95%;
          padding-left: 38px;
        }
        
        @media (max-width: 768px) {
          .search-bar {
            max-width: 100%;
            width: 50%;
            margin-right: 40px;
          }
        }
      `}</style>
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
