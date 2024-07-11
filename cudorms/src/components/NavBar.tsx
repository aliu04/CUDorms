import { NavLink } from "react-router-dom";
import "../App.css";

/* temporary nav bar with user and admin links --> change later on for more useful links */

export default function NavBar() {
  return (
    <div className = 'nav-bar'>
      <h1 className = 'navbar-title'> CUDorms </h1>
      <ul className="nav-links">
        <li>
          <NavLink to="/">
            USER VIEW
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/dorms"> 
            ADMIN VIEW 
          </NavLink>
        </li>
      </ul>

    </div>
  );
}
