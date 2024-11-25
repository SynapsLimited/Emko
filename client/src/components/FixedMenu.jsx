import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  BookOpen,
  Package,
  ChevronRight,
  LogOut,
  PenTool,
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
} from 'lucide-react';
import './../css/fixedmenu.css';
import { UserContext } from '../context/userContext';

const FixedMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);
  const { currentUser } = useContext(UserContext);

  // Handle clicking outside the menu to close any open submenu
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // If there is no logged-in user, do not render the menu
  if (!currentUser) {
    return null;
  }

  // Define menu items after ensuring currentUser exists
  const menuItems = [
    {
      icon: <User className="menu-icon" />,
      label: 'Profile',
      submenu: [
        {
          icon: <User className="submenu-icon" />,
          label: 'Profile',
          link: `/profile/${currentUser.id}`,
        },
        {
          icon: <LogOut className="submenu-icon" />,
          label: 'Logout',
          link: `/logout`,
        },
      ],
    },
    {
      icon: <BookOpen className="menu-icon" />,
      label: 'Projects',
      submenu: [
        {
          icon: <BookOpen className="submenu-icon" />,
          label: 'All Projects',
          link: `/projects`,
        },
        {
          icon: <PenTool className="submenu-icon" />,
          label: 'Create Project',
          link: `/create-project`,
        },
        {
          icon: <LayoutDashboard className="submenu-icon" />,
          label: 'Projects Dashboard',
          link: `/projects-dashboard`,
        },
      ],
    },
    {
      icon: <Package className="menu-icon" />,
      label: 'Products',
      submenu: [
        {
          icon: <ShoppingBag className="submenu-icon" />,
          label: 'All Products',
          link: `/full-catalog`,
        },
        {
          icon: <PlusCircle className="submenu-icon" />,
          label: 'Create Product',
          link: `/create-product`,
        },
        {
          icon: <LayoutDashboard className="submenu-icon" />,
          label: 'Products Dashboard',
          link: `/products-dashboard`,
        },
      ],
    },
  ];

  // Toggle the active menu
  const handleMenuToggle = (label) => {
    setActiveMenu((prev) => (prev === label ? null : label));
  };

  return (
    <div className="fixed-menu" ref={menuRef}>
      {menuItems.map((item, index) => (
        <div
          className={`menu-item-wrapper ${activeMenu === item.label ? 'active' : ''}`}
          key={index}
        >
          <button
            className={`menu-button ${activeMenu === item.label ? 'active' : ''}`}
            onClick={() => handleMenuToggle(item.label)}
            aria-haspopup="true"
            aria-expanded={activeMenu === item.label}
          >
            {item.icon}
            <span className="menu-label">{item.label}</span>
          </button>
          {activeMenu === item.label && (
            <div className="submenu" role="menu">
              {item.submenu.map((subItem, subIndex) => (
                <Link
                  to={subItem.link}
                  className="submenu-item"
                  key={subIndex}
                  onClick={() => setActiveMenu(null)}
                  role="menuitem"
                >
                  {subItem.icon}
                  <span className="submenu-label">{subItem.label}</span>
                  <ChevronRight className="submenu-chevron" />
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FixedMenu;
