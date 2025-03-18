import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import axios from "axios";
import moment from "moment";

interface Website {
    siteName: string;
    url: string;
    requirementFrom: string;
    lastCheckedDate: string;
}

interface GroupedWebsites {
    [key: string]: Website[];
}

export default function Sidebar() {
    const [websites, setWebsites] = useState<GroupedWebsites>({});
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const response = await axios.get("http://localhost:3001/websitesList");
                const data = response.data.data;
                const grouped: GroupedWebsites = data.reduce((acc: GroupedWebsites, website: Website) => {
                    if (!acc[website.requirementFrom]) {
                        acc[website.requirementFrom] = [];
                    }
                    acc[website.requirementFrom].push(website);
                    return acc;
                }, {});
                setWebsites(grouped);
            } catch (error) {
                console.error("Error fetching websites:", error);
            }
        };

        fetchWebsites();
    }, []);

    const isDateOld = (date: string) => {
        const parsedDate = moment.utc(date, "YYYY-MM-DDTHH-mm-ss-SSSZ");
        const result = moment().diff(parsedDate, 'days') > 1;
        console.log("result", date, result);
        return result;
    };

    const toggleSidebar = () => {
        setIsOpen((prevOpen) => !prevOpen);
    };

    return (
        <div className={styles.sidebarContainer}>
            <button className={styles.toggleButton} onClick={toggleSidebar}>
                ☰
            </button>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                <div className={styles.sidebarContent}>
                    <h1>Lists</h1>
                    {Object.keys(websites).map((requirementFrom) => (
                        <div key={requirementFrom}>
                            <h4>{requirementFrom}</h4>
                            <ul>
                                {websites[requirementFrom].map((website) => (
                                    <li key={website.url} className={styles.websiteItem}>
                                        <a href={website.url} target="_blank" rel="noopener noreferrer">
                                            {website.siteName}
                                        </a>
                                        {isDateOld(website.lastCheckedDate) && (
                                            <>&nbsp;<span className={`${styles.badge} badge rounded-pill text-bg-warning`} title="Last checked more than 1 day ago">!</span></>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}