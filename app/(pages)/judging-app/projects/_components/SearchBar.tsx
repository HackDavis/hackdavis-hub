'use client';
import React, { useState, ChangeEvent } from 'react';
import styles from './SearchBar.module.scss';
import { CiMap } from 'react-icons/ci';
import { IoMdSearch } from 'react-icons/io';

export default function SearchBar() {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        {/* <div className={styles.icon}> */}
        <IoMdSearch />
        {/* </div> */}
        <div className={styles.input}>
          <input
            name="search"
            type="text"
            placeholder="Search for projects"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className={styles.map}>
        <CiMap />
      </div>
    </div>
  );
}
