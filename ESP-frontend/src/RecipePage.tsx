import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RecipePage.css';

interface Recipe {
  title: string;
  calories?: number;
  fat?: number;
  protein?: number;
  ingredients: string | string[];
  directions?: string;
}

function RecipePage(): JSX.Element {
  const { name, title } = useParams<{ name: string; title: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipe/${name}/${title}`);
        if (response.ok) {
          const data: Recipe = await response.json();
          setRecipe(data);
        } else {
          setError('Recipe not found');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('Error fetching recipe');
      }
    };

    fetchRecipe();
  }, [name, title]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!recipe) {
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

  return (
    <div className="recipe-page">
      <h1>{recipe.title}</h1>
      <div className="recipe-details">
        {recipe.calories && (
          <div>
            <strong>Calories:</strong> {recipe.calories} kcal
          </div>
        )}
        {recipe.fat && (
          <div>
            <strong>Fat:</strong> {recipe.fat} g
          </div>
        )}
        {recipe.protein && (
          <div>
            <strong>Protein:</strong> {recipe.protein} g
          </div>
        )}
        {recipe.ingredients && (
          <div>
            <strong>Ingredients:</strong>
            <ul>
              {Array.isArray(recipe.ingredients)
                ? recipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index}>{ingredient}</li>
                  ))
                : recipe.ingredients.split(',').map((ingredient: string, index: number) => (
                    <li key={index}>{ingredient}</li>
                  ))}
            </ul>
          </div>
        )}
        {recipe.directions && (
          <div>
            <strong>Directions:</strong>
            <p className="directions-text">{recipe.directions}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipePage;
