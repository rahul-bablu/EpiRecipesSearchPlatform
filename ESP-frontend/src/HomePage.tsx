import { useState, useEffect } from 'react';
import Category from './Category'; // Import the Category component
import './App.css';

interface CategoryData {
  name: string;
  items: string[];
}

// Home component to display all categories with their items
function Home(): JSX.Element {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and their respective items from Flask API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/categories'); // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Error fetching categories');
        }
        const data: CategoryData[] = await response.json();
        setCategories(data);
        setLoading(false);  // Set loading to false after fetching data
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Display loading state while fetching data
  if (loading) {
    return (
      <div className="center-container">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  // Display error message if there's an issue with the API
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render categories if they exist
  return (
    <div className="categories-container">
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <Category key={index} name={category.name} items={category.items} />
        ))
      ) : (
        <div>No categories available</div>
      )}
    </div>
  );
}

export default Home;
