import React, { Component } from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Nav } from "react-bootstrap";

import logo from "assets/img/reactlogo.png";
import { useDispatch, useSelector } from "react-redux";

function Sidebar({ color, image, routes }) {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = React.useState(null)
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  React.useEffect(() => {
    setProfile(user.role);
  }, [user])

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")"
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              <img src={require("assets/img/reactlogo.png")} alt="..." />
            </div>
          </a>
          <a className="simple-text" href="http://www.creative-tim.com">
            Admin EA
          </a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (prop.name)
              if (!prop.redirect)
                if (prop.roles.includes(profile))
                  return (
                    <li
                      className={
                        prop.upgrade
                          ? "active active-pro"
                          : activeRoute(prop.layout + prop.path)
                      }
                      key={key}
                    >
                      <NavLink
                        to={prop.layout + prop.path}
                        className="nav-link"
                        activeClassName="active"
                      >
                        <i className={prop.icon} />
                        <p>{prop.name}</p>
                      </NavLink>
                    </li>
                  );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
