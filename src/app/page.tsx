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

  const renderPlaceOfBirth = (placeOfBirth: {
    CITY: string;
    STATE_PROVINCE: string;
    COUNTRY: string;
  }): string => {
    const { CITY, STATE_PROVINCE, COUNTRY } = placeOfBirth;
    const parts = [CITY, STATE_PROVINCE, COUNTRY].filter(Boolean);
    return parts.length > 0 ? `Place of Birth: ${parts.join(", ")}` : "";
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
              {results.map((result, index) => {
                const alias = result.item.ALIAS.map(alias => alias.ALIAS_NAME).join(", ");
                // const address = result.item.ADDRESS.join(", ");
                return (
                  <div key={index} className={styles.resultItem}>
                    <h2>{result.item.FIRST_NAME} {result.item.SECOND_NAME} {result.item.THIRD_NAME}</h2>
                    <span className={`badge rounded-pill ${result.item.TYPE === "individual" ? "text-bg-primary" : "text-bg-info"} text-uppercase`}>{result.item.TYPE}</span>
                    {alias && <p>Alias: {alias}</p>}
                    {result.item.NAME_ORIGINAL_SCRIPT && <p>Original Script: {result.item.NAME_ORIGINAL_SCRIPT}</p>}
                    {result.item.TITLE && <p>Title: {result.item.TITLE}</p>}
                    {/* {address && <p>Address: {address}</p>} */}
                    {renderPlaceOfBirth(result.item.PLACE_OF_BIRTH) && <p>{renderPlaceOfBirth(result.item.PLACE_OF_BIRTH)}</p>}
                  </div>
                )
              })}
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