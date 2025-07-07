import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (userText: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchKey, setSearchKey] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchKey(value);
        onSearch(value);
    };

    return (
        <input
            type='text'
            placeholder='Search...'
            className='search-input'
            value={searchKey}
            onChange={handleChange}
        />
    );
};

export default SearchBar;