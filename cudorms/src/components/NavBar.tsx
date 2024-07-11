import { NavLink } from "react-router-dom";
import "../App.css";
import Logo from '../assets/CUDorms.png';

/* temporary nav bar with user and admin links --> change later on for more useful links */

export default function NavBar() {
  return (
    <div className = 'nav-bar'>
      <NavLink to="/" className = "navbar-logo">
        <img className="navbar-logo" src={Logo} alt="CUDorms Logo"/>
      </NavLink>
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
