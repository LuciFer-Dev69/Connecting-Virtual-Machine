import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '../../context/NavigationContext';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PageTemplate.css';

/**
 * Standard page template for consistent layout and styling
 * @param {string} title - Page title
 * @param {string} subtitle - Optional page subtitle
 * @param {node} actions - Optional action buttons (top right)
 * @param {node} children - Main page content
 */
const PageTemplate = ({ title, subtitle, actions, children, fullWidth }) => {
    const { breadcrumbs } = useNavigation();

    return (
        <div className={`page-template-container ${fullWidth ? 'full-width' : ''}`}>
            {/* Page Header */}
            <header className="page-header">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                    <ol>
                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const isFirst = index === 0;

                            const separator = !isFirst && (
                                <span className="breadcrumb-separator">
                                    <ChevronRight size={14} />
                                </span>
                            );

                            return (
                                <li key={crumb.path} className="breadcrumb-item">
                                    {separator}
                                    {isLast ? (
                                        <span className="breadcrumb-current" aria-current="page">
                                            {crumb.label}
                                        </span>
                                    ) : (
                                        <Link to={crumb.path} className="breadcrumb-link">
                                            {crumb.label}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                <div className="header-content">
                    <div className="header-text">
                        <h1 className="page-title">{title}</h1>
                        {subtitle && <p className="page-subtitle">{subtitle}</p>}
                    </div>

                    {actions && <div className="header-actions">{actions}</div>}
                </div>
            </header>

            {/* Main Content */}
            <div className="page-content">
                {children}
            </div>
        </div>
    );
};

PageTemplate.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    actions: PropTypes.node,
    children: PropTypes.node.isRequired
};

export default PageTemplate;
