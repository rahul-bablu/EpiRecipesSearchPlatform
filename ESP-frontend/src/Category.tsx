import { useNavigate } from 'react-router-dom';
import './App.css';

interface ItemProps {
  title: string;
  category: string;
  index: number;
}

function Item({ title, category, index }: ItemProps): JSX.Element {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/category/${category}/${title}`);
  };

  return (
    
    <div className="item-box" onClick={handleNavigate}>

      {title}

    </div>
  );
}

interface CategoryProps {
  name: string;
  items: string[];
}

function Category({ name, items }: CategoryProps): JSX.Element {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/category/${name}`);
  };

  return (
    <div className="card">
      <div className="category-name" onClick={handleNavigate}>{name}</div>
      <div className="category-items">
        {items.map((item, index) => (
          <Item key={index} category={name} title={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Category;
