import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';

const NavigationContext = createContext();

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

export const NavigationProvider = ({ children }) => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    // Determine active section based on current path
    useEffect(() => {
        const path = location.pathname;

        if (path.startsWith(ROUTES.RED_TEAM.BASE)) {
            setActiveSection('red-team');
        } else if (path.startsWith(ROUTES.BLUE_TEAM.BASE)) {
            setActiveSection('blue-team');
        } else if (path.startsWith(ROUTES.AI_LABS.BASE)) {
            setActiveSection('ai-labs');
        } else if (path.startsWith(ROUTES.REAL_LIFE.BASE)) {
            setActiveSection('real-life');
        } else if (path.startsWith(ROUTES.PWNBOX)) {
            setActiveSection('pwnbox');
        } else {
            setActiveSection('dashboard');
        }

        // Generate breadcrumbs (simplified logic for now)
        const pathSegments = path.split('/').filter(Boolean);
        const crumbs = pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
            return {
                label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
                path: url
            };
        });
        setBreadcrumbs(crumbs);

    }, [location]);

    const value = {
        activeSection,
        breadcrumbs
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};
