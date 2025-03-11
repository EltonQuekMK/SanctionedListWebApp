"use client";

import { useState } from "react";
import styles from "./page.module.css";

interface ResultItem {
  FIRST_NAME: string;
  SECOND_NAME: string;
  THIRD_NAME: string;
  TYPE: string;
  ALIAS: { ALIAS_NAME: string }[];
  ADDRESS: { COUNTRY: string }[];
  DATE_OF_BIRTH: string;
  PLACE_OF_BIRTH: {
    CITY: string;
    STATE_PROVINCE: string;
    COUNTRY: string;
  };
  NAME_ORIGINAL_SCRIPT: string;
  TITLE: string;
}


export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ item: ResultItem }[]>([]);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = async () => {
    const response = await fetch("http://localhost:3001/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (response.ok) {
      const data = await response.json();
      setResults(data.results);
    } else {
      console.error("Search failed");
    }
    setSearchQuery(query);
    setSearchExecuted(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.centerContainer}>
        <div className={styles.searchBar}>
          <h1>Sanctioned List Search</h1>
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            Search
          </button>
        </div>
        {searchExecuted && (
          results.length > 0 ? (
            <div className={styles.results}>
              {results.map((result, index) => (
                <div key={index} className={styles.resultItem}>
                  <h2>{result.item.FIRST_NAME} {result.item.SECOND_NAME} {result.item.THIRD_NAME}</h2>
                  <p>Type: {result.item.TYPE}</p>
                  <p>Aliases: {result.item.ALIAS.map(alias => alias.ALIAS_NAME).join(", ")}</p>
                  <p>Address: {result.item.ADDRESS.map(address => address.COUNTRY).join(", ")}</p>
                  {result.item.DATE_OF_BIRTH && <p>Date of Birth: {result.item.DATE_OF_BIRTH}</p>}
                  {result.item.PLACE_OF_BIRTH && <p>Place of Birth: {result.item.PLACE_OF_BIRTH.CITY}, {result.item.PLACE_OF_BIRTH.STATE_PROVINCE}, {result.item.PLACE_OF_BIRTH.COUNTRY}</p>}
                  {result.item.NAME_ORIGINAL_SCRIPT && <p>Original Script: {result.item.NAME_ORIGINAL_SCRIPT}</p>}
                  {result.item.TITLE && <p>Title: {result.item.TITLE}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p>No results found for query "{searchQuery}"</p>
          )
        )}
      </div>
      <footer className={styles.footer}>
        {/* Add footer content here */}
      </footer>
    </div >
  );
}