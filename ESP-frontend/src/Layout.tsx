import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import searchicon from '/searchicon.png';
import './App.css';

function NavBar(): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // For keeping track of selected suggestion
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setShowSuggestions(false); // Hide suggestions if query is empty
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data: string[] = await response.json();
        setResults(data);
        setShowSuggestions(true); // Show suggestions when data is fetched
        setSelectedIndex(-1); // Reset selected index
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);  // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    // Handle clicks outside of the suggestions container
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    navigate(`/category/${suggestion}`);
    setQuery('');
    setResults([]);
    setShowSuggestions(false); // Hide suggestions on click
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || results.length === 0) return;

      if (e.key === 'ArrowDown') {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % results.length); // Loop through suggestions
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prevIndex) =>
          prevIndex === 0 ? results.length - 1 : (prevIndex - 1 + results.length) % results.length
        );
      } else if (e.key === 'Enter') {
        if (selectedIndex !== -1 && results[selectedIndex]) {
          handleSuggestionClick(results[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, results, selectedIndex]);

  return (
    <>
      <div className="topnav">
        <div style={{ width: '3em' }}></div>
        <div className='logo' onClick={()=>{navigate('/')}}>
          EpiRecipes
        </div>
        <div style={{ width: '7em' }}></div>
        <div className='search-container'>
          <img src={searchicon} alt="search" />
          <form className='srh' autoComplete='off'>
            <input
              type="text"
              placeholder='Search your Recipes'
              name='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)} // Show suggestions when input is focused
            />
          </form>
        </div>
        <div style={{ width: '4em' }}></div>
      </div>
      {showSuggestions && results.length > 0 && (
        <div className="search-results" ref={suggestionsRef}>
          <ul>
            {results.map((result, index) => (
              <li
                key={index}
                className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(result)}
              >
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function LayOut(): JSX.Element {
  return (
    <>
      <NavBar />
      <Outlet /> 
    </>
  );
}

export default LayOut;
