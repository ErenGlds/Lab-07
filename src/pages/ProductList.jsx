import { useSearchParams } from "react-router";
import useFetch from "../hooks/useFetch";
import { fetchProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  const { loading, error, data } = useFetch(fetchProducts, []);

  const updateParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  };

  const categories = data
    ? [...new Set(data.map((product) => product.category))].sort()
    : [];

  const filtered = data
    ? data.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) &&
          (category === "" || product.category === category),
      )
    : [];

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  return (
    <div>
      <h1>Products</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title"
          value={query}
          onChange={(e) => updateParam("q", e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
