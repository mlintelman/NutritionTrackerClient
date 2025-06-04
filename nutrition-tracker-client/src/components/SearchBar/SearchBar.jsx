import React, {useEffect, useState} from 'react'
import styles from './SearchBar.module.css'
import API_BASE_URL from '../../config'

// Search bar that makes API calls, optimized with debouncing and caching
// things to improve: arrow and enter keys, better styling
export default function SearchBar({ onSelect, clearTrigger }) {
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [cache, setCache] = useState({})

    /*const searchFoodItems = async (searchTerm) => {
        if (!searchTerm) {
            setFoods([]);
            return;
        }
        try {
            const response = await fetch(`https://localhost:7284/api/FoodItems/search?query=${searchTerm}`)
            const data = await response.json()
            setFoods(data)
        } catch (err) {
            console.log("Search error:", err)
        }
    }*/

    // Make API call and update search results with response data
    const fetchFoodItems = async () => {
        //  Check if the search is in the cache already
        if (cache[search]){
            console.log("CACHE RETURNED ", search)
            // If so, just set the results from the cache
            setSearchResults(cache[search])
            // Return so the rest of the code doesn't run
            return
        }
        console.log("API CALL ", search)
        // API call
        //const response = await fetch(`https://localhost:7284/api/FoodItems/search?query=${search}`)
        const response = await fetch(`${API_BASE_URL}FoodItems/search?query=${search}`)
        // Convert to json
        const data = await response.json()
        // Set search results to response data
        setSearchResults(data)
        // Add to cache
        setCache(c => ({...c, [search]: data}))
    }

    function handleSelect(item) {
        setSearch(item.name)
        setShowResults(false)
        if (onSelect) {
            onSelect(item)
        }
    }

    // Trigger to reset the search
    useEffect(() => {
        setSearch("");
        setSearchResults([]);
    }, [clearTrigger])


    // Search foods when the search dependency is changed
    useEffect(() => {
        // Clear serach results if empty search
        if (!search.trim()) {
            setSearchResults([]);
            return;
        }
        // Debounce the search
        const timer = setTimeout(fetchFoodItems, 300);
        // Clear the timeout to clean up resources
        return () => clearTimeout(timer);
    }, [search])


    return (
        <div className={styles.searchContainer}>
            <input 
                className={styles.searchInput}
                id='searchInput'
                type='text'
                placeholder='Search food...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                onBlur={() => setShowResults(false)}
                />
            {showResults && (
            <div className={styles.searchResultContainer}>
                {searchResults.map((item) => 
                    <span 
                        key={item.id} 
                        value={item.id} 
                        className={styles.result}
                        onMouseDown={() => handleSelect(item)}
                    >
                        {item.name}
                    </span>)
                }
            </div>
            )}
        </div>
    )
}
    /*return (
        <section className='search_section'>
            <div className='search_input_div'>
                <input
                    type='text'
                    className='search_input'
                    placeholder='Search...'
                    autoComplete='off'
                    onChange={handleChange}
                    value={search}
                />
            </div>
            <div className='search_result'>
                <ul className={styles.dropdown}>
                    {searchData.map(item => (
                        <li
                            key={item.id}
                            onMouseDown={() => handleSelect(item)}
                            className={styles.dropdownItem}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>               
            </div>
        </section>
    );
}*/