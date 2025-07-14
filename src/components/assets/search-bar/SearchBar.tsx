import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (userText: string) => void;
    onEnter: (userText: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onEnter }) => {
    const [searchKey, setSearchKey] = useState<string>('');

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    onSearch(e.target.value);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter(searchKey.trim());
    }
  };

    return (
        <input
            type='text'
            placeholder='Search...'
            className='search-input'
            value={searchKey}
            onChange={handleChange}
            onKeyDown={handleKey}
        />
    );
};

export default SearchBar;
