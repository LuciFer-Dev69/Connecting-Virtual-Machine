# 🚀 CHAKRA VIEW - MASTER ARCHITECTURE REFACTOR PLAN

## EXECUTIVE SUMMARY
Transform Chakra View from a student dashboard into an enterprise-grade cybersecurity training platform with modular architecture, predictable navigation, and professional UX.

---

## PHASE 1: FRONTEND ARCHITECTURE OVERHAUL

### 1.1 Navigation System Redesign
**Current State:** Mixed navigation patterns, inconsistent routing
**Target State:** Unified, predictable navigation hierarchy

#### Implementation:
```
/src/navigation/
  ├── NavigationConfig.js       # Centralized nav configuration
  ├── RouteGuards.js            # Authentication & authorization
  └── NavigationContext.js      # Global nav state management
```

**Navigation Hierarchy:**
```
Public Routes (No Auth Required)
├── / (Landing)
├── /login
└── /signup

Protected Routes (Auth Required)
├── /dashboard (Overview Hub)
│
├── /red-team (Offensive Security)
│   ├── /red-team/roadmap
│   ├── /red-team/challenges
│   └── /red-team/challenge/:id
│
├── /blue-team (Defensive Security)
│   ├── /blue-team/roadmap
│   ├── /blue-team/forensics
│   └── /blue-team/alerts
│
├── /ai-labs (AI Security Research)
│   ├── /ai-labs/prompt-injection
│   ├── /ai-labs/log-analysis
│   └── /ai-labs/simulator
│
├── /real-life (Enterprise Scenarios)
│   ├── /real-life/corporate
│   ├── /real-life/infrastructure
│   ├── /real-life/insider
│   └── /real-life/challenge/:id
│
├── /pwnbox (Attack Environment)
│
└── /profile (User Settings)
```

### 1.2 Layout System Standardization

**Layout Hierarchy:**
```
RootLayout (Top-level wrapper)
├── PublicLayout (Landing, Login, Signup)
│   └── PublicNavbar
│
└── AuthenticatedLayout (All protected routes)
    ├── TopNavigation (Persistent)
    ├── SectionLayout (Section-specific sidebar)
    │   ├── RedTeamLayout
    │   ├── BlueTeamLayout
    │   ├── AILabLayout
    │   └── RealLifeLayout
    └── PageContent (Outlet)
```

### 1.3 Component Architecture

**Atomic Design Structure:**
```
/src/components/
  ├── atoms/              # Basic building blocks
  │   ├── Button.jsx
  │   ├── Input.jsx
  │   ├── Badge.jsx
  │   └── Card.jsx
  │
  ├── molecules/          # Simple combinations
  │   ├── ChallengeCard.jsx
  │   ├── ProgressBar.jsx
  │   └── StatWidget.jsx
  │
  ├── organisms/          # Complex components
  │   ├── ChallengeGrid.jsx
  │   ├── TerminalWindow.jsx
  │   └── DashboardStats.jsx
  │
  ├── templates/          # Page layouts
  │   ├── ChallengeTemplate.jsx
  │   └── DashboardTemplate.jsx
  │
  └── navigation/         # Navigation components
      ├── TopNav.jsx
      ├── SideNav.jsx
      └── Breadcrumbs.jsx
```

---

## PHASE 2: ROUTING & STATE MANAGEMENT

### 2.1 Route Configuration
**File:** `/src/config/routes.config.js`

```javascript
export const ROUTES = {
  PUBLIC: {
    LANDING: '/',
    LOGIN: '/login',
    SIGNUP: '/signup'
  },
  DASHBOARD: '/dashboard',
  RED_TEAM: {
    BASE: '/red-team',
    ROADMAP: '/red-team/roadmap',
    CHALLENGES: '/red-team/challenges',
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
  PROFILE: '/profile'
};
```

### 2.2 Global State Architecture
**Technology:** Context API + Custom Hooks

```
/src/context/
  ├── AuthContext.js          # User authentication state
  ├── ThemeContext.js         # Dark/Light mode
  ├── ChallengeContext.js     # Challenge progress tracking
  └── NavigationContext.js    # Active section, breadcrumbs
```

---

## PHASE 3: UX/UI STANDARDIZATION

### 3.1 Design System
**File:** `/src/styles/design-tokens.css`

```css
:root {
  /* Brand Colors */
  --brand-primary: #00d4ff;
  --brand-secondary: #00ff88;
  --brand-danger: #ff0044;
  
  /* Semantic Colors */
  --color-success: #51cf66;
  --color-warning: #facc15;
  --color-error: #ff4d4d;
  --color-info: #00d4ff;
  
  /* Difficulty Levels */
  --difficulty-easy: var(--color-success);
  --difficulty-medium: var(--color-warning);
  --difficulty-hard: var(--color-error);
  --difficulty-insane: #7c3aed;
  
  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  
  /* Typography */
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### 3.2 Page Templates

**Standard Page Structure:**
```jsx
<PageTemplate>
  <PageHeader>
    <Breadcrumbs />
    <PageTitle />
    <PageActions />
  </PageHeader>
  
  <PageContent>
    {/* Main content */}
  </PageContent>
  
  <PageFooter />
</PageTemplate>
```

---

## PHASE 4: BACKEND ARCHITECTURE

### 4.1 API Route Organization

```
/Backend/routes/
  ├── auth.py              # Authentication endpoints
  ├── challenges.py        # Challenge CRUD
  ├── red_team.py          # Red team specific
  ├── blue_team.py         # Blue team specific
  ├── ai_labs.py           # AI labs endpoints
  ├── real_life.py         # Real-life scenarios
  ├── pwnbox.py            # PwnBox management
  └── user.py              # User profile & progress
```

### 4.2 API Endpoint Standardization

**RESTful Convention:**
```
GET    /api/challenges              # List all challenges
GET    /api/challenges/:id          # Get specific challenge
POST   /api/challenges/:id/submit   # Submit flag
GET    /api/challenges/:id/hint     # Request hint

GET    /api/red-team/roadmap        # Red team progression
GET    /api/blue-team/alerts        # Blue team alerts
POST   /api/pwnbox/spawn            # Spawn PwnBox instance
DELETE /api/pwnbox/terminate        # Terminate instance
```

---

## PHASE 5: SERVICE INTEGRATION

### 5.1 Auto-Service Initialization
**File:** `/Backend/services/service_manager.py`

```python
class ServiceManager:
    """Manages all platform services"""
    
    def __init__(self):
        self.services = {
            'ollama': OllamaService(),
            'pwnbox': PwnBoxService(),
            'docker': DockerService()
        }
    
    def start_all(self):
        """Start all required services on platform boot"""
        for name, service in self.services.items():
            service.start()
            logger.info(f"Started {name} service")
    
    def health_check(self):
        """Check health of all services"""
        return {
            name: service.is_healthy() 
            for name, service in self.services.items()
        }
```

### 5.2 Docker Compose Orchestration
**Enhanced:** `/docker-compose.yml`

```yaml
services:
  # Auto-start Ollama
  ollama:
    image: ollama/ollama:latest
    container_name: chakra_ollama
    restart: always
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## PHASE 6: IMPLEMENTATION CHECKLIST

### Frontend Tasks
- [ ] Create centralized route configuration
- [ ] Implement navigation context
- [ ] Standardize all layouts
- [ ] Build reusable component library
- [ ] Add breadcrumb navigation
- [ ] Implement loading states
- [ ] Add error boundaries
- [ ] Create 404 page

### Backend Tasks
- [ ] Reorganize API routes
- [ ] Implement service manager
- [ ] Add API versioning
- [ ] Standardize error responses
- [ ] Add request validation
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger)

### DevOps Tasks
- [ ] Auto-start all services in docker-compose
- [ ] Add health check endpoints
- [ ] Implement graceful shutdown
- [ ] Add monitoring/logging
- [ ] Create deployment scripts

### Documentation
- [ ] API documentation
- [ ] Component storybook
- [ ] User guide
- [ ] Developer onboarding
- [ ] Architecture diagrams

---

## PHASE 7: QUALITY ASSURANCE

### Testing Strategy
```
/tests/
  ├── unit/              # Component & function tests
  ├── integration/       # API integration tests
  ├── e2e/              # End-to-end user flows
  └── performance/      # Load & stress tests
```

### Key Metrics
- **Page Load Time:** < 2s
- **API Response Time:** < 200ms
- **Lighthouse Score:** > 90
- **Test Coverage:** > 80%

---

## SUCCESS CRITERIA

✅ **Navigation:** User can reach any page in ≤ 3 clicks
✅ **Performance:** All pages load in < 2 seconds
✅ **Consistency:** All pages follow same design system
✅ **Reliability:** Services auto-start and self-heal
✅ **Scalability:** Can handle 1000+ concurrent users
✅ **Professional:** Ready for investor/enterprise demo

---

## TIMELINE ESTIMATE

- **Phase 1-2 (Frontend):** 2-3 days
- **Phase 3 (UX/UI):** 1-2 days
- **Phase 4 (Backend):** 1-2 days
- **Phase 5 (Services):** 1 day
- **Phase 6-7 (QA):** 2-3 days

**Total:** 7-11 days for complete refactor

---

## NEXT STEPS

1. Review and approve this architecture plan
2. Begin Phase 1: Navigation & Routing
3. Implement incrementally with testing
4. Deploy to staging environment
5. Conduct user acceptance testing
6. Production deployment

---

**Status:** Ready for implementation
**Priority:** High
**Impact:** Transforms platform from MVP to enterprise-ready product
