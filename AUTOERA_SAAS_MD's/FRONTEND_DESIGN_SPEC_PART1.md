# Complete Frontend Design Specification - Part 1
## AUTOERA AI Platform - Page-wise Design Guide

---

## A. Global: Design System & Tokens

**FRAME:** Design System / Global

### Goal
Single source of truth ensuring consistent typography, colors, spacing, components, icons, motion, and accessibility across all pages.

### Must-Have Components

#### 1. Typography Scale
```css
H1: Inter Bold 32px / 40px line-height
H2: Inter Bold 28px / 36px
H3: Inter SemiBold 24px / 32px
H4: Inter SemiBold 20px / 28px
H5: Inter Medium 18px / 24px
H6: Inter Medium 16px / 22px
Body: Inter Regular 14px / 20px
Caption: Inter Regular 12px / 16px
```

#### 2. Color Tokens
```
Primary: #667eea (Purple-Blue)
Primary Light: #8b9ef5
Primary Dark: #4c63d2
Secondary: #764ba2 (Purple)
Success: #4caf50
Warning: #ff9800
Error: #f44336
Info: #2196f3
Neutral 100-900: #f5f5f5 to #212121
```

#### 3. Spacing Scale
```
xs: 4px, sm: 8px, md: 12px, lg: 16px
xl: 24px, 2xl: 32px, 3xl: 48px, 4xl: 64px
```

#### 4. Component Library
- Button (primary/secondary/ghost/danger)
- Input, Select, Textarea, Checkbox, Radio
- Table with sorting/filtering
- Modal, Drawer, Dialog
- Card, Paper, Container
- Avatar, Badge, Chip
- Toast, Snackbar, Alert
- Tooltip, Popover
- Tabs, Accordion
- Breadcrumbs, Pagination
- DatePicker, TimePicker
- FileUploader with drag-drop
- Responsive Grid (12-column)
- Skeleton loaders
- Progress bars, Spinners

#### 5. Icon Set
- Actions: add, edit, delete, save, cancel, search
- Status: success, warning, error, info, pending
- Navigation: menu, back, forward, home
- Vehicle: car, truck, motorcycle, ev
- Finance: payment, invoice, credit-card
- AI/ML: brain, robot, analytics
- Communication: email, sms, phone, notification

#### 6. Motion Guidelines
- Button press: scale(0.98) 100ms
- Toast: slide-in-right 300ms ease-out
- Modal: fade-in + scale 200ms
- Loading: rotate 1s linear infinite

#### 7. Accessibility
- WCAG 2.1 AA compliance
- Color contrast ratio ≥ 4.5:1
- Keyboard navigation support
- ARIA labels on all interactive elements
- Screen reader friendly
- Focus indicators visible
- Language fallback (EN/HI)

#### 8. Dark Mode
- Toggle in user preferences
- Inverted color palette
- Reduced brightness for images

### Data & API
None (static design tokens)

---

## B. Auth & Onboarding

**FRAME:** Auth & Onboarding

### Goal
Secure multi-tenant authentication with simple onboarding wizard for dealership branding.

### Pages/Flows

#### 1. Login Page
**Components:**
- Email/Phone input
- Password input with show/hide toggle
- Remember me checkbox
- Login button
- Forgot password link
- SSO options (Google, Microsoft)
- 2FA modal (SMS/Email/TOTP)

**States:**
- Default
- Loading (spinner on button)
- Error (invalid credentials)
- Locked (too many attempts)
- Success (redirect to dashboard)

**Data Props:**
```typescript
interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
  tenant?: string;
}
```

**API Contract:**
```
POST /api/auth/login/
Body: { email, password }
Response: { access, refresh, user: { id, name, role }, tenant: { id, name } }
```

#### 2. 2FA Verification
**Components:**
- 6-digit code input
- Resend code button
- Verify button
- Method selector (SMS/Email/TOTP)

**API Contract:**
```
POST /api/auth/2fa/verify/
Body: { token, method }
Response: { verified: boolean }
```

#### 3. Forgot Password
**Flow:**
1. Enter email
2. Receive reset link
3. Enter new password
4. Confirm password
5. Success message

**API Contract:**
```
POST /api/auth/password-reset/
Body: { email }
POST /api/auth/password-reset-confirm/
Body: { token, new_password }
```

#### 4. Onboarding Wizard
**Steps:**
1. Welcome & tenant name
2. Branding (logo, colors, domain)
3. Default settings
4. Import sample data (CSV)
5. Billing setup
6. Terms acceptance

**Components:**
- Progress stepper (5 steps)
- Logo uploader (drag-drop)
- Color picker
- CSV file uploader with mapping UI
- Payment method form
- Terms checkbox

**Data Props:**
```typescript
interface OnboardingData {
  tenantName: string;
  branding: {
    logo: File;
    primaryColor: string;
    domain: string;
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
  };
  sampleData?: File;
}
```

**API Contract:**
```
POST /api/tenant/onboard/
Body: FormData with all onboarding data
Response: { tenantId, status, redirectUrl }
```

### Security Features
- Password strength indicator
- reCAPTCHA on signup
- Rate limiting (5 attempts/15min)
- Session timeout (30min inactive)
- Secure token storage (httpOnly cookies)

---

## C. Super Admin Dashboard

**FRAME:** SuperAdmin Dashboard

### Goal
Platform-level health monitoring, tenant management, billing, and global configuration.

### Must-Have Widgets

#### 1. System Health Summary
**Metrics:**
- Uptime percentage
- Active tenants
- Total API calls (24h)
- Error rate
- CPU/GPU usage
- Database connections

**Visualization:**
- Status badges (green/yellow/red)
- Line charts for trends
- Real-time updates

#### 2. Tenant Management
**Components:**
- Searchable table
- Filters (status, plan, region)
- Sort by (name, created, usage)
- Quick actions menu
- Bulk operations

**Columns:**
- Tenant name
- Plan (Free/Pro/Enterprise)
- Status (Active/Suspended/Trial)
- Users count
- Storage used
- Last active
- Actions

**Quick Actions:**
- View details
- Suspend/Resume
- Upgrade/Downgrade
- Impersonate
- View logs

#### 3. Billing Overview
**Components:**
- Revenue chart (MRR, ARR)
- Invoice list
- Payment status
- Churn rate
- Upcoming renewals

#### 4. Feature Flags
**Components:**
- Toggle switches
- Feature name & description
- Rollout percentage slider
- Target tenants selector

#### 5. AI Model Performance
**Metrics per model:**
- Accuracy
- Latency (p50, p95, p99)
- Usage count
- Error rate
- By tenant breakdown

#### 6. Audit Log Viewer
**Components:**
- Filterable table
- Search by user/action/resource
- Date range picker
- Export to CSV

**Data Props:**
```typescript
interface SuperAdminDashboard {
  health: SystemHealth;
  tenants: Tenant[];
  billing: BillingMetrics;
  aiPerformance: ModelMetrics[];
  auditLogs: AuditLog[];
}
```

**API Contracts:**
```
GET /api/super/tenants?status=&q=&page=
POST /api/super/tenant/{id}/action
Body: { action: 'suspend'|'upgrade', params }
GET /api/infra/health
GET /api/ai/performance?tenantId=&model=
GET /api/super/audit-logs?user=&action=&from=&to=
```

### Access Control
- Role: super_admin only
- SSO required
- IP whitelist optional
- Audit all actions

---

