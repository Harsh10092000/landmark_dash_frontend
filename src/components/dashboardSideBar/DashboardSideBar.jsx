import React, { useState } from "react";
import "./DashboardSideBar.css";
import { Link } from "react-router-dom";
import { AddPropertyIcon, AllProperties, MyProperties, ShortlistedIcon, SubscriptionIcon, UserIcon } from "../SvgIcons";
//import { IconDashboard } from "@tabler/icons-react";

const DashboardSideBar = ({ isSidebarOpen, toggleSidebar }) => {
  const DashboardIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-dashboard"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M13.45 11.55l2.05 -2.05" />
      <path d="M6.4 20a9 9 0 1 1 11.2 0z" />
    </svg>
  );

  const [selectedItem, setSelectedItem] = useState("My Properties");
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const menuItems = [
    {
      name: "My Profile",
      url: "/dashboard",
      icon: <UserIcon />,
    },
    {
      name: "List Property",
      url: "/dashboard",
      icon: <AddPropertyIcon />,
    },
    {
      name: "All Properties",
      url: "/dashboard",
      icon: <AllProperties />,
    },
    {
      name: "My Properties",
      url: "/dashboard",
      icon: <MyProperties />,
    },
    {
      name: "Shotlisted",
      url: "/dashboard",
      icon: <ShortlistedIcon />,
    },
    {
      name: "Logout",
      url: "/dashboard",
      icon: <DashboardIcon />,
    },
  ];

  return (
    <div
      className={`dashboard-sideBar-modern shadow-lg ${sidebarCollapse ? "sidebar-close" : "sidebar-open"} ${isSidebarOpen ? "open-mobile-sidebar" : ""}`}
      style={{
        background: "#fff",
        borderRadius: "18px",
        minHeight: "100vh",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        width: sidebarCollapse ? 70 : 240,
        transition: "width 0.2s cubic-bezier(.4,0,.2,1)",
        // overflow: "hidden",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="sidebar-logo d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
        <img src="/favicon.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
        <div className="sidebar-toggle-icon" onClick={toggleSidebar} style={{ cursor: "pointer" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" opacity="0.4" d="M15.7798 4.5H5.2202C4.27169 4.5 3.5 5.06057 3.5 5.75042C3.5 6.43943 4.27169 7 5.2202 7H15.7798C16.7283 7 17.5 6.43943 17.5 5.75042C17.5 5.06054 16.7283 4.5 15.7798 4.5Z"></path><path fill="currentColor" d="M18.7798 10.75H8.2202C7.27169 10.75 6.5 11.3106 6.5 12.0004C6.5 12.6894 7.27169 13.25 8.2202 13.25H18.7798C19.7283 13.25 20.5 12.6894 20.5 12.0004C20.5 11.3105 19.7283 10.75 18.7798 10.75Z"></path><path fill="currentColor" d="M15.7798 17H5.2202C4.27169 17 3.5 17.5606 3.5 18.2504C3.5 18.9394 4.27169 19.5 5.2202 19.5H15.7798C16.7283 19.5 17.5 18.9394 17.5 18.2504C17.5 17.5606 16.7283 17 15.7798 17Z"></path></svg>
        </div>
      </div>
      <div className="dashboardSideBar py-4">
        <div className="dashboardSidebar-inside d-flex flex-column gap-2">
          <div className="sidebar-icon mobile-hidden mb-3" onClick={() => setSidebarCollapse(!sidebarCollapse)} style={{ cursor: "pointer", marginLeft: sidebarCollapse ? 0 : 8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64"/></svg>
          </div>
          {menuItems.map((item, index) => (
            <Link
              key={item.name}
              className={`menu-link-modern d-flex align-items-center gap-3 px-3 py-2 rounded-2 fw-semibold ${selectedItem === item.name ? "menu-link-selected-modern" : ""}`}
              to={item.url}
              onClick={() => setSelectedItem(item.name)}
              style={{
                background: selectedItem === item.name ? "#e3f0ff" : "transparent",
                color: selectedItem === item.name ? "#1976d2" : "#333",
                transition: "background 0.2s, color 0.2s",
                fontWeight: selectedItem === item.name ? 700 : 500,
                boxShadow: selectedItem === item.name ? "0 2px 8px rgba(25, 118, 210, 0.08)" : "none",
                cursor: "pointer",
              }}
            >
              <span className="menu-icon" style={{ fontSize: 22 }}>{item.icon}</span>
              {!sidebarCollapse && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSideBar;
