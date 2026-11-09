import { Link, useNavigate, useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import { fetchProduct } from "../api/productsApi";
import { useCartStore } from "../store/cartStore";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const {
    loading,
    error,
    data: product,
  } = useFetch((signal) => fetchProduct(id, signal), [id]);

  if (loading) return <p>Loading product...</p>;

  if (error) {
    return (
      <div>
        <p>
          {error.status === 404
            ? "Product not found."
            : `Something went wrong: ${error.message}`}
        </p>
        <button onClick={() => navigate("/products")}>Back</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate("/products")}>Back</button>
      <h1>{product.title}</h1>
      <img
        src={product.thumbnail}
        alt={product.title}
        width="250"
        height="250"
      />
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>
      <button onClick={() => addItem(product)}>Add to cart</button>
      <div>
        <Link to={`/products/${Number(id) + 1}`}>Next product</Link>
      </div>
    </div>
  );
}

export default ProductDetail;
