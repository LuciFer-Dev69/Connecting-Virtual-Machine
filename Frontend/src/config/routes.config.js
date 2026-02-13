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
    AI_LABS: {
        BASE: '/ai-labs',
        PROMPT_INJECTION: '/ai-labs/prompt-injection',
        LOG_ANALYSIS: '/ai-labs/log-analysis',
        SIMULATOR: '/ai-labs/simulator'
    },
    REAL_LIFE: {
        BASE: '/real-life',
        CORPORATE: '/real-life/corporate',
        INFRASTRUCTURE: '/real-life/infrastructure',
        INSIDER: '/real-life/insider',
        CHALLENGE: '/real-life/challenge/:id'
    },
    PWNBOX: '/pwnbox',
    PROFILE: '/profile',
    ADMIN: '/admin'
};
