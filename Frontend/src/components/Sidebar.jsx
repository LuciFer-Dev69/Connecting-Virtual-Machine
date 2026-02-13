import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css';

/**
 * Reusable Sidebar component for consistent navigation
 * @param {Array} items - Array of navigation items with label, path, and icon
 * @param {string} title - Optional title for the sidebar section
 */
const Sidebar = ({ items, title, variant = '' }) => {
    return (
        <aside className={`sidebar-container ${variant}`}>
            {title && <div className="sidebar-header">{title}</div>}
            <nav>
                {items.map((item, index) => {
                    if (item.type === 'divider') {
                        return <div key={`divider-${index}`} className="sidebar-divider" />;
                    }

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

Sidebar.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            path: PropTypes.string,
            icon: PropTypes.element,
            type: PropTypes.string // 'link' (default) or 'divider'
        })
    ).isRequired,
    title: PropTypes.string
};

export default Sidebar;
