import { Link } from "react-router";
import { useCartStore } from "../store/cartStore";

function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.thumbnail}
          alt={product.title}
          width="150"
          height="150"
        />
        <h3>{product.title}</h3>
      </Link>
      <p>{product.category}</p>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>Add to cart</button>
    </div>
  );
}

export default ProductCard;
