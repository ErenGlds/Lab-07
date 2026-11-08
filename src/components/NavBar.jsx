import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cartStore";

function NavBar({ theme, onToggleTheme }) {
  const { user, dispatch } = useAuth();
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <nav className="navbar">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/cart">Cart ({itemCount})</NavLink>

      <div className="navbar-right">
        <button onClick={onToggleTheme}>
          {theme === "light" ? "Dark" : "Light"} mode
        </button>
        {user ? (
          <>
            <span>{user.username}</span>
            <button onClick={() => dispatch({ type: "LOGGED_OUT" })}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
