import React, { useContext, useEffect, useState } from 'react';
import { IoPersonOutline } from "react-icons/io5";
import './Topbar.css';
import AuthContext from '../../Contex/authContex';
import axios from 'axios'
import { NavLink } from 'react-router-dom';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const authContext = useContext(AuthContext)

  const [menus, setMenus] = useState([])

  useEffect(() => {
    getAllMenus()
  }, [])


  function getAllMenus() {
    axios.get('http://localhost:4000/v1/menus')
      .then(res => {
        setMenus(res.data)
      })
  }


  return (
    <div className='container'>
      <div className='navbars'>
        <div className="main-header">

          <div className="main-header-right">
            <h1 className='nav-title'>سبزلرن</h1>

            <button className="menu-toggle" onClick={toggleMenu}>☰</button>

            <ul className="menu">
              {
                menus.map(menu => (
                  <li key={menu._id} className="menu-item">
                    <NavLink to={menu.href || "#"}>{menu.title}</NavLink>

                    {
                      menu.submenus?.length > 0 && (
                        <ul className="submenu">
                          {
                            menu.submenus.map(sub => (
                              <li key={sub._id}>
                                <NavLink to={`/courses/${sub.href || "#"}`}>{sub.title}</NavLink>
                              </li>
                            ))
                          }
                        </ul>
                      )
                    }
                  </li>
                ))
              }
            </ul>
          </div>

          {
            authContext?.userInfos?.user?.role === "ADMIN" && (
              <div className='admin_panel-btn-wrapper'>
                <NavLink to="/p-admin">ورود به پنل ادمین</NavLink>
              </div>
            )
          }


          <div className='main-header-left desktop-auth'>
            {authContext.userInfos ? (
              <>
                <span>خوش آمدی، {authContext?.userInfos?.user?.name || "کاربر"}</span>
                <NavLink to="/my-account"><IoPersonOutline /></NavLink>
              </>
            ) : (
              <NavLink to="/login">ورود / ثبت‌نام</NavLink>
            )}
          </div>


          <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
            <ul className='toggle_menu'>
              {
                menus.map(menu => (
                  <li key={menu._id} className="menu-item">
                    {menu.title}

                    {
                      menu.submenus?.length > 0 && (
                        <ul className="submenu">
                          {
                            menu.submenus.map(sub => (
                              <li key={sub._id}>
                                <NavLink to={`/courses/${sub.href || "#"}`}>{sub.title}</NavLink>
                              </li>
                            ))
                          }
                        </ul>
                      )
                    }
                  </li>
                ))
              }
            </ul>
            <div className='toggle__login-href'>
              {
                authContext?.userInfos ?
                  (
                    <NavLink to="/my-account">ورود به پنل کاربری</NavLink>
                  )
                  :
                  (
                    <NavLink to="/login">ورود / ثبت‌نام</NavLink>
                  )
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
