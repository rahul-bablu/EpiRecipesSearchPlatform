import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CategoryPage.css';
import './ItemList.css';

// Type for the Item component props
interface ItemProps {
  title: string;
  category: string;
}

function Item({ title, category }: ItemProps): JSX.Element {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/category/${category}/${title}`);
  };

  return (
    <div className="item-box-all" onClick={handleNavigate}>
      {title}
    </div>
  );
}

interface ItemListProps {
  category: string;
  items: string[];
}

function ItemList({ category, items }: ItemListProps): JSX.Element {
  return (
    <div className="item-list-row-all">
      {items.map((item, index) => (
        <Item key={index} category={category} title={item} />
      ))}
    </div>
  );
}

interface RatingButtonProps {
  value: number;
  selectedRating: number | null;
  onClick: (value: number | null) => void;
}

const RatingButton: React.FC<RatingButtonProps> = ({ value, selectedRating, onClick }) => {
  const isSelected = selectedRating === value;

  return (
    <button
      className={`rating-button ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(value)}
    >
      Above {value}
    </button>
  );
};

interface RangeFilterProps {
  label: string;
  range: number[];
  setRange: (value: number[]) => void;
  min: number;
  max: number;
}

const RangeFilter: React.FC<RangeFilterProps> = ({ label, range, setRange, min, max }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = +e.target.value;
    if (newMin <= range[1]) {
      setRange([newMin, range[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = +e.target.value;
    if (newMax >= range[0]) {
      setRange([range[0], newMax]);
    }
  };

  return (
    <div className="range-filter">
      <label>{label}: {range[0]} - {range[1]}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={range[0]}
        onChange={handleMinChange}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={range[1]}
        onChange={handleMaxChange}
      />
    </div>
  );
}

function CategoryPage(): JSX.Element {
  const { name } = useParams<{ name: string }>();
  const [items, setItems] = useState<string[]>([]);
  const [fatsRange, setFatsRange] = useState<number[]>([0, 100]);
  const [proteinsRange, setProteinsRange] = useState<number[]>([0, 100]);
  const [caloriesRange, setCaloriesRange] = useState<number[]>([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const response = await fetch(`/api/categories/${name}?fatsRange=${fatsRange}&proteinsRange=${proteinsRange}&caloriesRange=${caloriesRange}&ratingFilter=${ratingFilter}`);
        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        console.error('Error fetching category items:', error);
      }
    };

    fetchCategoryItems();
  }, [name, fatsRange, proteinsRange, caloriesRange, ratingFilter]);

  return (
    <div className="two-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Filters</h3>

        {/* Fats Range Filter */}
        <RangeFilter
          label="Fats"
          range={fatsRange}
          setRange={setFatsRange}
          min={0}
          max={100}
        />

        {/* Proteins Range Filter */}
        <RangeFilter
          label="Proteins"
          range={proteinsRange}
          setRange={setProteinsRange}
          min={0}
          max={100}
        />

        {/* Calories Range Filter */}
        <RangeFilter
          label="Calories"
          range={caloriesRange}
          setRange={setCaloriesRange}
          min={0}
          max={1000}
        />

        {/* Rating Filter */}
        <div className="rating-buttons">
          <h4>Rating</h4>
          <RatingButton
            value={3}
            selectedRating={ratingFilter}
            onClick={setRatingFilter}
          />
          <RatingButton
            value={4}
            selectedRating={ratingFilter}
            onClick={setRatingFilter}
          />
          <RatingButton
            value={5}
            selectedRating={ratingFilter}
            onClick={setRatingFilter}
          />
          <button
            className={`rating-button ${ratingFilter === null ? 'selected' : ''}`}
            onClick={() => setRatingFilter(null)}
          >
            All
          </button>
        </div>
      </div>

      {/* Category Page Items */}
      <div className="category-page">
        <h1>{name}</h1>
        <div className="category-items-row">
          <ItemList category={name as string} items={items} />
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
