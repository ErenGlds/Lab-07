import { Link } from "react-router";

function Home() {
  return (
    <div>
      <h1>Welcome to the Online Shop</h1>
      <p>Browse our catalogue and add your favourite products to the cart.</p>
      <Link to="/products">Browse products</Link>
    </div>
  );
}

export default Home;
