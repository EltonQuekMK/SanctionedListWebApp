"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import styles from "./page.module.css";
import axios from "axios";

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
  COMMENTS: string;
}

interface Result {
  item: ResultItem;
  score: number;
  requirementFrom: string;
  siteName: string;
  url: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/search`, { query });

    if (response.status === 200) {
      const data = await response.data;
      setResults(data.results);
    } else {
      console.error("Search failed");
    }
    setSearchQuery(query);
    setSearchExecuted(true);
  };

  interface KeyboardEvent {
    key: string;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  interface PlaceOfBirth {
    CITY: string;
    STATE_PROVINCE: string;
    COUNTRY: string;
  }

  const renderPlaceOfBirth = (placeOfBirth: PlaceOfBirth): string => {
    const { CITY, STATE_PROVINCE, COUNTRY } = placeOfBirth;
    const parts = [CITY, STATE_PROVINCE, COUNTRY].filter(Boolean);
    return parts.length > 0 ? `${parts.join(", ")}` : "";
  };

  return (
    <div className={styles.page}>
      <Sidebar />
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
          <button className={styles.searchButton} onClick={handleSearch} />
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
                    <p><span className={`badge rounded-pill ${result.item.TYPE === "individual" ? "text-bg-primary" : "text-bg-success"} text-uppercase`}>{result.item.TYPE}</span></p>
                    {alias && <p><b>Alias:</b> {alias}</p>}
                    {result.item.NAME_ORIGINAL_SCRIPT && <p><b>Original Script:</b> {result.item.NAME_ORIGINAL_SCRIPT}</p>}
                    {result.item.TITLE && <p><b>Title:</b> {result.item.TITLE}</p>}
                    {/* {address && <p>Address: {address}</p>} */}
                    {renderPlaceOfBirth(result.item.PLACE_OF_BIRTH) && <p><b>Place of Birth:</b> {renderPlaceOfBirth(result.item.PLACE_OF_BIRTH)}</p>}
                    {result.item.COMMENTS && <p><b>Comments:</b> {result.item.COMMENTS}</p>}
                    <p className={styles.resultItemFooter}>
                      <span className={`badge rounded-pill text-bg-secondary text-uppercase`}>{result.requirementFrom}</span>
                      &nbsp;
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                        title={result.siteName}
                      >
                        {result.siteName + " >"}
                      </a>
                    </p>
                    {/* <p>
                      <button className={styles.detailsButton} onClick={handleSearch}>Details</button>
                    </p> */}
                  </div>
                )
              })}
            </div>
          ) : (
            <p>No results found for query &quot;{searchQuery}&quot;</p>
          )
        )}
      </div>
      <footer className={styles.footer}>
        {/* Add footer content here */}
      </footer>
    </div>
  );
}