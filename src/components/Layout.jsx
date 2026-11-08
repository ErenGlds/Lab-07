import { Outlet } from "react-router";
import NavBar from "./NavBar";
import useLocalStorage from "../hooks/useLocalStorage";

function Layout() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <div className={`app ${theme}`}>
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        Online Shop - Web Programming Assignment 7
      </footer>
    </div>
  );
}

export default Layout;
