"""
AutoEra AI — Mobile App Design Specification (Section 16)
5 Apps — Customer · Service Advisor · Fleet Manager · Dealer Executive · Technician
React Native + Expo — Shared Codebase · OTA Updates · Offline Capability
"""

from typing import Dict, List, Any, Optional

# ─── Mobile Architecture Strategy ─────────────────────────────────────────────

MOBILE_ARCHITECTURE = {
    "strategy": "Shared Codebase — React Native + Expo (5 apps, 1 team, 1 repo)",
    "framework": "React Native + Expo EAS",
    "shared_shell": {
        "components": ["Navigation (React Navigation)", "Auth (JWT + biometric)", "Push Notifications (Expo Notifications)", "Offline Sync (WatermelonDB)", "Theme (dark/light tokens)"],
        "code_reuse_percent": 90,
        "ota_updates": "Expo EAS — JS bundle OTA, no Play Store review required for JS changes",
        "app_count": 5,
    },
    "routing_strategy": "Role-based screen routing — one shell, module screens conditional per authenticated role",
    "offline_strategy": {
        "engine": "WatermelonDB (local SQLite)",
        "sync_model": "Delta sync on reconnect — last-write-wins with conflict resolution",
        "offline_first_screens": ["Job Queue", "Vehicle Inspection", "Fleet Live Map (cached)", "My KPIs"],
    },
    "build": {
        "ci_cd": "Expo EAS Build — cloud build, no local Xcode/Android SDK required",
        "android_target": "API 34 (Android 14)",
        "ios_target": "iOS 16+",
        "ota_channel": "Expo Updates — staged rollouts (10% → 50% → 100%)",
    }
}

# ─── App 1: Vehicle Owner / Customer App ──────────────────────────────────────

CUSTOMER_APP = {
    "app_id": "APP-01",
    "app_name": "Vehicle Owner / Customer App",
    "target_user": "Vehicle Owner (L7 role)",
    "primary_color": "#F97316",  # Orange — AutoEra brand
    "icon": "🚗",
    "screens": [
        {
            "screen": "Home",
            "features": ["Vehicle health score (large, prominent)", "Next service due countdown", "Insurance expiry alert", "Quick actions: Book Service, Renew Insurance, Contact Advisor"],
            "ai_integration": "AI summary: '3 things to watch on your Creta this month'",
            "offline_capable": False,
            "push_notifications": ["Service due", "Insurance expiry", "EMI reminder"],
        },
        {
            "screen": "My Vehicle",
            "features": ["Full vehicle profile", "Service history timeline", "Current insurance policy", "Loan EMI schedule", "Warranty status", "Documents vault"],
            "ai_integration": "AI: 'Based on your mileage pattern, next service likely due in 3 weeks'",
            "offline_capable": True,
            "push_notifications": [],
        },
        {
            "screen": "Book Service",
            "features": ["Workshop finder by location", "Slot selection", "Service type selector", "Voice complaint entry (Tamil/English)", "Photo upload", "Booking confirmation"],
            "ai_integration": "AI slot suggestion: 'Tomorrow 11am at Porur has the shortest wait time based on current bookings'",
            "offline_capable": False,
            "push_notifications": ["Booking confirmed", "Reminder 24h before"],
        },
        {
            "screen": "Service Status",
            "features": ["Real-time job card status (6 stages)", "Stage-by-stage timeline", "Estimated completion time", "Advisor contact button"],
            "ai_integration": "Auto-push notification at every stage change — no need to open app",
            "offline_capable": False,
            "push_notifications": ["Stage changed: Work Started", "Ready for pickup"],
        },
        {
            "screen": "Insurance",
            "features": ["Policy details", "Multi-insurer renewal quotes", "One-tap renewal payment", "Claim initiation with photo upload"],
            "ai_integration": "AI: 'Your NCB saves Rs.1,840. Best deal today: HDFC Ergo at Rs.14,200 comprehensive'",
            "offline_capable": False,
            "push_notifications": ["90/60/30-day renewal reminders"],
        },
        {
            "screen": "Finance",
            "features": ["Loan details", "Full EMI schedule with countdown", "Payment button", "Account statement download"],
            "ai_integration": "EMI reminder push notification 5 days before due date",
            "offline_capable": True,
            "push_notifications": ["EMI due in 5 days", "Payment successful"],
        },
        {
            "screen": "EV Battery (EV only)",
            "features": ["Daily health score", "Personalised range estimate", "Charging history", "Degradation graph", "Replacement timeline"],
            "ai_integration": "AI: 'Charging to 80% daily extends battery life by 14 months vs current 100% habit'",
            "offline_capable": True,
            "push_notifications": ["SOH below 80% — action required"],
        },
        {
            "screen": "Profile",
            "features": ["Personal details", "Notification preferences", "Consent management (DPDP)", "Linked vehicles", "Data export request"],
            "ai_integration": None,
            "offline_capable": True,
            "push_notifications": [],
        },
    ]
}

# ─── App 2: Service Advisor / Technician App ──────────────────────────────────

SERVICE_ADVISOR_APP = {
    "app_id": "APP-02",
    "app_name": "Service Advisor / Technician App",
    "target_user": "Service Advisor (L5) + Technician (L6)",
    "primary_color": "#06B6D4",  # Cyan — service/technical
    "icon": "🔧",
    "screens": [
        {
            "screen": "Job Queue",
            "features": ["All assigned jobs with status badges", "Priority sorting", "Vehicle details", "Customer contact", "Complaint summary"],
            "offline_capability": "Full offline — job list synced on connection, viewable offline",
            "ai_integration": None,
        },
        {
            "screen": "Job Card Creator",
            "features": ["Number plate OCR scan", "Voice complaint entry (Tamil/English)", "AI diagnosis view", "Parts availability check", "Photo evidence capture"],
            "offline_capability": "Partial offline — create locally, sync when connected",
            "ai_integration": "AI diagnosis: symptoms → probable faults → recommended repair actions",
        },
        {
            "screen": "Vehicle Inspection",
            "features": ["Digital checklist with photo capture per point", "AI defect detection suggestion", "Pass/fail per item", "Condition notes"],
            "offline_capability": "Full offline — syncs on connection",
            "ai_integration": "AI defect detection from inspection photos",
        },
        {
            "screen": "Status Updates",
            "features": ["One-tap stage change: Received → Work Started → 50% → QC → Ready → Delivered", "Auto-triggers customer WhatsApp at each change"],
            "offline_capability": "Online required for WhatsApp trigger",
            "ai_integration": None,
        },
        {
            "screen": "Parts Request",
            "features": ["View allocated parts", "Request additional parts from parts team", "Confirm physical receipt"],
            "offline_capability": "Online required for stock availability check",
            "ai_integration": None,
        },
        {
            "screen": "My Productivity",
            "features": ["Today's jobs completed", "Efficiency score vs target", "Earnings tracker (incentive-based)", "Skill matrix progress"],
            "offline_capability": "Synced data — viewable offline",
            "ai_integration": None,
        },
    ]
}

# ─── App 3: Fleet Manager App ─────────────────────────────────────────────────

FLEET_MANAGER_APP = {
    "app_id": "APP-03",
    "app_name": "Fleet Manager App",
    "target_user": "Fleet Manager (L4 role)",
    "primary_color": "#10B981",  # Emerald — fleet/tracking
    "icon": "🚛",
    "screens": [
        {
            "screen": "Fleet Live Map",
            "features": ["All vehicle live locations", "Colour-coded health (green/yellow/red)", "Click vehicle for detail", "Filter by status/driver"],
            "update_frequency": "WebSocket — 30-second push",
            "alert_type": "Push: CRITICAL geofence breach",
        },
        {
            "screen": "Alerts Centre",
            "features": ["Active alerts ranked by severity: CRITICAL/WARNING/ADVISORY", "One-tap action each alert"],
            "update_frequency": "Push notification for CRITICAL, in-app badge for others",
            "alert_type": "CRITICAL → immediate push + SMS",
        },
        {
            "screen": "Vehicle Detail",
            "features": ["Individual health score", "7-day telemetry trend charts", "Upcoming maintenance schedule", "Current driver", "Trip history"],
            "update_frequency": "5-minute polling historical; live for active trip",
            "alert_type": "DTC / anomaly alert push",
        },
        {
            "screen": "Driver Scorecards",
            "features": ["Weekly score per driver", "Team leaderboard", "Coaching flag indicators", "Incentive calculation", "Trip replay"],
            "update_frequency": "Weekly batch + live incident alerts",
            "alert_type": "Harsh braking / speeding event",
        },
        {
            "screen": "Fuel Intelligence",
            "features": ["Daily consumption per vehicle", "Anomaly flags (possible theft)", "Month-end efficiency ranking", "Fuel station log"],
            "update_frequency": "Daily batch + instant anomaly alerts",
            "alert_type": "Stationary-level drop → theft suspected",
        },
        {
            "screen": "Maintenance Calendar",
            "features": ["Upcoming scheduled maintenance", "Predictive recommendations by urgency", "One-tap service booking"],
            "update_frequency": "Weekly update + predictive alert push",
            "alert_type": "Component failure predicted within 7 days",
        },
    ]
}

# ─── App 4: Dealer Executive App ──────────────────────────────────────────────

DEALER_EXECUTIVE_APP = {
    "app_id": "APP-04",
    "app_name": "Dealer Executive App (Sales + DP + Manager)",
    "target_user": "Sales Manager (L4), Dealer Principal (L2), General Manager (L3), Sales Executive (L5)",
    "primary_color": "#8B5CF6",  # Violet — executive/management
    "icon": "👔",
    "screens": [
        {
            "screen": "Morning Brief",
            "features": ["AI-generated daily summary at 7:55am", "Yesterday revenue vs target", "Top 3 actions today with names", "One risk to watch", "Today's target"],
            "ai_integration": "GPT-4o generates from all dashboard data at 7:55am daily",
            "update_frequency": "Daily at 7:55am",
        },
        {
            "screen": "Lead Pipeline",
            "features": ["Hot/Warm/Cold sorted list", "SLA countdown per lead", "One-tap call or WhatsApp", "AI lead score on each card"],
            "ai_integration": "AI next-best-action visible on each lead card",
            "update_frequency": "Real-time WebSocket",
        },
        {
            "screen": "Discount Approvals",
            "features": ["Pending requests with margin impact", "Vehicle details", "Lead score", "One-tap approve/reject with reason"],
            "ai_integration": "AI recommendation: accept/reject based on probability × margin",
            "update_frequency": "Push notification on new request",
        },
        {
            "screen": "Team Performance",
            "features": ["Individual KPIs per executive/advisor", "NPS scores", "Finance penetration", "Insurance renewals"],
            "ai_integration": "AI flags underperformers + likely root cause",
            "update_frequency": "Daily batch + real-time for today metrics",
        },
        {
            "screen": "My KPIs",
            "features": ["Own lead pipeline", "Conversion rate", "Revenue contributed", "Team ranking", "Bonus calculation", "Trend vs last month"],
            "ai_integration": "AI coaching: 'Your response time is 48 min average — team best is 18 min'",
            "update_frequency": "Real-time for active leads",
        },
        {
            "screen": "Alerts",
            "features": ["All escalations", "Claim updates", "Payment received", "Churn risk flags", "System alerts — priority ranked"],
            "ai_integration": "AI priority ranking: most urgent + most impactful first",
            "update_frequency": "Push notification in real-time",
        },
    ]
}

# ─── App 5: Technician App (subset of Service Advisor) ────────────────────────
# Note: Technician has focused screens — Job Queue + Inspection + Status only

TECHNICIAN_APP = {
    "app_id": "APP-05",
    "app_name": "Technician App (Field Specialist)",
    "target_user": "Technician (L6 role)",
    "primary_color": "#F59E0B",  # Amber — workshop/hands-on
    "icon": "⚙️",
    "screens": [
        {
            "screen": "My Job Queue",
            "features": ["Assigned jobs only (filtered to technician)", "Estimated time per job", "Vehicle & complaint details", "Skill match indicator"],
            "offline_capability": "Full offline",
            "ai_integration": "AI diagnosis notes from service advisor pre-populated",
        },
        {
            "screen": "Job Execution",
            "features": ["Step-by-step repair checklist", "Time tracking (start/pause/complete)", "Parts used confirmation", "Photo evidence at each step"],
            "offline_capability": "Full offline — syncs on completion",
            "ai_integration": "AI suggested repair steps based on DTC codes",
        },
        {
            "screen": "Vehicle Inspection",
            "features": ["Pre/post repair inspection checklist", "Photo per inspection point", "AI defect detection", "Sign-off capture"],
            "offline_capability": "Full offline",
            "ai_integration": "AI image analysis for defect identification",
        },
        {
            "screen": "My Productivity",
            "features": ["Jobs completed today", "Efficiency score", "Skill badges earned", "Income tracker (incentive-based)"],
            "offline_capability": "Cached data",
            "ai_integration": None,
        },
    ]
}

ALL_APPS = [CUSTOMER_APP, SERVICE_ADVISOR_APP, FLEET_MANAGER_APP, DEALER_EXECUTIVE_APP, TECHNICIAN_APP]


# ─── Mobile App Service ────────────────────────────────────────────────────────

class MobileAppDesignService:
    """
    AutoEra AI Mobile App Design Service (Section 16)
    5 apps, shared React Native + Expo codebase, role-based routing.
    """

    @classmethod
    def get_architecture(cls) -> Dict[str, Any]:
        return MOBILE_ARCHITECTURE

    @classmethod
    def get_all_apps(cls) -> List[Dict[str, Any]]:
        """Return all 5 app specifications."""
        return ALL_APPS

    @classmethod
    def get_app_by_id(cls, app_id: str) -> Optional[Dict[str, Any]]:
        for app in ALL_APPS:
            if app["app_id"].lower() == app_id.lower():
                return app
        return None

    @classmethod
    def get_apps_summary(cls) -> Dict[str, Any]:
        total_screens = sum(len(app["screens"]) for app in ALL_APPS)
        ai_screens = sum(
            len([s for s in app["screens"] if s.get("ai_integration")])
            for app in ALL_APPS
        )

        return {
            "total_apps": len(ALL_APPS),
            "framework": "React Native + Expo EAS",
            "shared_codebase": True,
            "code_reuse_percent": 90,
            "total_screens": total_screens,
            "ai_integrated_screens": ai_screens,
            "offline_first_architecture": True,
            "ota_updates": "Expo EAS — no Play Store review for JS-only updates",
            "apps": [
                {
                    "app_id": a["app_id"],
                    "name": a["app_name"],
                    "target_user": a["target_user"],
                    "screen_count": len(a["screens"]),
                    "color": a["primary_color"],
                    "icon": a["icon"],
                }
                for a in ALL_APPS
            ],
            "supported_languages": ["English", "Tamil", "Hindi"],
            "voice_input": "ASR (Whisper) — Tamil + English voice complaint entry in Service Advisor App",
            "ocr": "Plate OCR (Job Card Creator) — number plate to vehicle lookup in under 2 seconds",
            "biometric_auth": "TouchID + FaceID via Expo LocalAuthentication",
            "push_notifications": "Expo Notifications + Firebase FCM for Android, APNS for iOS",
        }
