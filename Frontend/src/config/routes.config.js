// Centralized route configuration
export const ROUTES = {
    PUBLIC: {
        LANDING: '/',
        LOGIN: '/login',
        SIGNUP: '/signup'
    },
    DASHBOARD: '/dashboard',
    MODULES: '/modules',
    RED_TEAM: {
        BASE: '/red-team',
        ROADMAP: '/red-team/roadmap',
        CHALLENGES: '/red-team/challenges',
        CATEGORY: '/red-team/category/:category',
        CHALLENGE: '/red-team/challenge/:id'
    },
    BLUE_TEAM: {
        BASE: '/blue-team',
        ROADMAP: '/blue-team/roadmap',
        FORENSICS: '/blue-team/forensics',
        ALERTS: '/blue-team/alerts'
    },
    AI_INJECTOR: {
        BASE: '/ai-injector',
        DASHBOARD: '/ai-injector/dashboard',
        LAB: '/ai-injector/lab'
    },
    REAL_LIFE: {
        BASE: '/real-life',
        CHALLENGE: '/real-life/challenge/:id'
    },
    SOC_ANALYST: '/soc-analyst',
    PWNBOX: '/pwnbox',
    PROFILE: '/profile',
    ADMIN: '/admin'
};
