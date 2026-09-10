# -*- coding: utf-8 -*-
"""
Generates the information-dense, institutional-grade PowerPoint pitch deck
AutoEra_AI_Master_Pitch_Deck_2026.pptx.
Matches the rich KPIs, tables, cards, and zero-wasted-space layout of
autoera-master-clean-pitch.html.
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_dense_pptx():
    prs = Presentation()
    prs.slide_width = Inches(15.0)
    prs.slide_height = Inches(10.0)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    BG_LIGHT = RGBColor(248, 250, 252)       # #F8FAFC
    CARD_BG = RGBColor(255, 255, 255)        # #FFFFFF
    CARD_BORDER = RGBColor(226, 232, 240)    # #E2E8F0
    NAVY_DARK = RGBColor(6, 11, 24)          # #060B18
    NAVY_CARD = RGBColor(10, 17, 40)         # #0A1128
    ORANGE_BRAND = RGBColor(255, 87, 34)     # #FF5722
    TEXT_DARK = RGBColor(15, 23, 42)         # #0F172A
    TEXT_BODY = RGBColor(51, 65, 85)         # #334155
    TEXT_MUTED = RGBColor(100, 116, 139)     # #64748B
    TEXT_WHITE = RGBColor(248, 250, 252)     # #F8FAFC
    DANGER_RED = RGBColor(220, 38, 38)       # #DC2626
    SUCCESS_GREEN = RGBColor(22, 163, 74)    # #16A34A

    logo_path = r"f:\autoeraaisaas-main\pitch-deck\assets\autoera_logo_original.png"
    car_crop_path = r"f:\autoeraaisaas-main\pitch-deck\assets\clean_cover_car.jpg"

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_LIGHT
        bg.line.fill.background()
        return bg

    def add_header(slide, slide_num, title_part1, title_orange="", subtitle=""):
        if os.path.exists(logo_path):
            slide.shapes.add_picture(logo_path, Inches(0.8), Inches(0.25), height=Inches(0.55))

        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(12.6), Inches(0.2), Inches(2.4), Inches(0.75))
        badge.fill.solid()
        badge.fill.fore_color.rgb = NAVY_DARK
        badge.line.fill.background()

        tb = slide.shapes.add_textbox(Inches(12.7), Inches(0.22), Inches(2.2), Inches(0.7))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run1 = p.add_run()
        run1.text = f"{slide_num:02d} "
        run1.font.bold = True
        run1.font.size = Pt(18)
        run1.font.color.rgb = ORANGE_BRAND

        run2 = p.add_run()
        run2.text = "PITCH DECK" if slide_num < 10 else "FINAL SLIDE"
        run2.font.bold = True
        run2.font.size = Pt(10.5)
        run2.font.color.rgb = TEXT_WHITE

        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(13.4), Inches(0.7))
        tf = t_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        run_t1 = p.add_run()
        run_t1.text = title_part1 + " "
        run_t1.font.bold = True
        run_t1.font.size = Pt(24)
        run_t1.font.color.rgb = NAVY_DARK

        if title_orange:
            run_t2 = p.add_run()
            run_t2.text = title_orange
            run_t2.font.bold = True
            run_t2.font.size = Pt(24)
            run_t2.font.color.rgb = ORANGE_BRAND

        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.size = Pt(11)
            p2.font.color.rgb = TEXT_MUTED

    def add_bottom_banner(slide, text_left, metrics_list):
        bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(9.05), Inches(13.4), Inches(0.65))
        bar.fill.solid()
        bar.fill.fore_color.rgb = NAVY_DARK
        bar.line.fill.background()

        tb = slide.shapes.add_textbox(Inches(1.0), Inches(9.08), Inches(7.5), Inches(0.55))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        run1 = p.add_run()
        run1.text = "⚡ " + text_left
        run1.font.bold = True
        run1.font.size = Pt(11)
        run1.font.color.rgb = TEXT_WHITE

        cur_x = 8.6
        for m in metrics_list:
            mtb = slide.shapes.add_textbox(Inches(cur_x), Inches(9.08), Inches(1.8), Inches(0.55))
            mtf = mtb.text_frame
            mtf.vertical_anchor = MSO_ANCHOR.MIDDLE
            mp = mtf.paragraphs[0]
            mp.alignment = PP_ALIGN.RIGHT
            m_run = mp.add_run()
            m_run.text = f"✓ {m}"
            m_run.font.bold = True
            m_run.font.size = Pt(10.5)
            m_run.font.color.rgb = ORANGE_BRAND
            cur_x += 1.85

    def add_card(slide, left, top, width, height, title="", desc="", is_navy=False, is_featured=False):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = NAVY_CARD if is_navy else CARD_BG
        card.line.color.rgb = ORANGE_BRAND if is_featured else (NAVY_CARD if is_navy else CARD_BORDER)
        card.line.width = Pt(2.0 if is_featured else 1.0)

        if title or desc:
            tb = slide.shapes.add_textbox(Inches(left + 0.12), Inches(top + 0.1), Inches(width - 0.24), Inches(height - 0.2))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

            if title:
                p = tf.paragraphs[0]
                p.text = title
                p.font.bold = True
                p.font.size = Pt(12)
                p.font.color.rgb = ORANGE_BRAND if is_featured else (TEXT_WHITE if is_navy else NAVY_DARK)

            if desc:
                p2 = tf.add_paragraph() if title else tf.paragraphs[0]
                p2.text = desc
                p2.font.size = Pt(10)
                p2.font.color.rgb = RGBColor(203, 213, 225) if is_navy else TEXT_BODY

        return card

    # =========================================================================
    # SLIDE 1: COVER
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1)

    if os.path.exists(logo_path):
        slide1.shapes.add_picture(logo_path, Inches(0.8), Inches(0.6), height=Inches(0.75))

    tb = slide1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(7.5), Inches(3.2))
    tf = tb.text_frame
    tf.word_wrap = True

    p_conf = tf.paragraphs[0]
    r_conf = p_conf.add_run()
    r_conf.text = "CONFIDENTIAL INVESTOR PRESENTATION · 2026\n"
    r_conf.font.size = Pt(10)
    r_conf.font.bold = True
    r_conf.font.color.rgb = ORANGE_BRAND

    p_title = tf.add_paragraph()
    r_t1 = p_title.add_run()
    r_t1.text = "AI-NATIVE "
    r_t1.font.bold = True
    r_t1.font.size = Pt(32)
    r_t1.font.color.rgb = NAVY_DARK

    r_t2 = p_title.add_run()
    r_t2.text = "DEALERSHIP OPERATING SYSTEM\n"
    r_t2.font.bold = True
    r_t2.font.size = Pt(32)
    r_t2.font.color.rgb = ORANGE_BRAND

    p_sub = tf.add_paragraph()
    p_sub.text = "Unifying Sales · Service · Parts · Finance · Insurance — with built-in AI Intelligence\n"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = RGBColor(249, 115, 22)

    # Master Vision Card
    v_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.0), Inches(7.4), Inches(1.6))
    v_card.fill.solid()
    v_card.fill.fore_color.rgb = CARD_BG
    v_card.line.color.rgb = ORANGE_BRAND
    v_card.line.width = Pt(2.0)

    v_tb = slide1.shapes.add_textbox(Inches(0.95), Inches(4.1), Inches(7.1), Inches(1.4))
    v_tf = v_tb.text_frame
    v_tf.word_wrap = True
    vp = v_tf.paragraphs[0]
    vp.text = '"AutoEra AI will become the global operating system for the automotive industry — the single platform that every dealership, OEM, fleet operator, insurer, finance company, and vehicle owner depends on as the system of record for their automotive world."'
    vp.font.italic = True
    vp.font.size = Pt(11)
    vp.font.color.rgb = TEXT_BODY

    # 4-Grid KPI Highlight Block
    add_card(slide1, 0.8, 5.8, 1.7, 1.2, "₹720 Cr", "Year 5 ARR Target", is_featured=True)
    add_card(slide1, 2.7, 5.8, 1.7, 1.2, "85%", "Gross Margins", is_featured=False)
    add_card(slide1, 4.6, 5.8, 1.7, 1.2, "15+", "Signed Dealer LOIs", is_featured=True)
    add_card(slide1, 6.5, 5.8, 1.7, 1.2, "4.8 Mo", "CAC Payback", is_featured=False)

    # Founder info
    f_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(7.2), Inches(7.4), Inches(1.3))
    f_card.fill.solid()
    f_card.fill.fore_color.rgb = CARD_BG
    f_card.line.color.rgb = CARD_BORDER
    f_tb = slide1.shapes.add_textbox(Inches(1.0), Inches(7.3), Inches(7.0), Inches(1.1))
    f_tf = f_tb.text_frame
    f_tf.word_wrap = True
    fp1 = f_tf.paragraphs[0]
    fp1.text = "Santhosh — Founder & CEO | AutoEra AI Solutions"
    fp1.font.bold = True
    fp1.font.size = Pt(13)
    fp1.font.color.rgb = NAVY_DARK

    fp2 = f_tf.add_paragraph()
    fp2.text = "💎 Institutional Seed Round · Growth Investment Opportunity | 🏎️ Vision-AI Telemetry Active"
    fp2.font.size = Pt(10.5)
    fp2.font.color.rgb = ORANGE_BRAND

    # Right: Car Image + 4 Ecosystem Cards
    if os.path.exists(car_crop_path):
        slide1.shapes.add_picture(car_crop_path, Inches(8.5), Inches(0.8), width=Inches(5.7), height=Inches(4.5))

    add_card(slide1, 8.5, 5.5, 2.75, 1.4, "🤖 Multi-Agent RAG", "7 Specialist agents query live ERP PostgreSQL data with zero hallucinations.")
    add_card(slide1, 11.45, 5.5, 2.75, 1.4, "⚡ ServicePulse OCR", "Number plate scanner creates complete digital job cards in under 90 seconds.")
    add_card(slide1, 8.5, 7.1, 2.75, 1.4, "📦 B2B Spares Engine", "Predictive inventory replenishment linked directly to aftermarket distributors.")
    add_card(slide1, 11.45, 7.1, 2.75, 1.4, "💬 Voice AI (Tamil/Eng)", "Automated service booking, follow-up calls, and WhatsApp invoice delivery.")

    add_bottom_banner(slide1, "DRIVING THE FUTURE OF AUTOMOTIVE INTELLIGENCE", ["16 Modules", "11 RBAC Roles", "₹720 Cr Roadmap"])

    # =========================================================================
    # SLIDE 2: THE PROBLEM
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, 2, "EVERY INDIAN DEALERSHIP RUNS ON", "FRAGMENTED, DISCONNECTED SYSTEMS",
               "30,000+ Indian dealer rooftops suffer massive lead leakage, operational blindspots, and silent margin erosion")

    # Left 5 problem cards
    y = 1.85
    problems = [
        ("📊 5–7 Disconnected Software Systems [₹14.4L/yr Waste]", "DMS + CRM + Excel + WhatsApp Web + Tally + OEM Portal — data is trapped in silos with zero bi-directional synchronization."),
        ("📉 30–40% Lead Leakage Across Channels [₹8.5L Lost/Mo]", "Leads from CarWale, walk-ins, phone calls, and Facebook ads arrive unassigned; salespeople cherry-pick while 40% go uncontacted."),
        ("🔧 Paper Job Cards & Manual Service Bays [3.2 Hrs Idle/Day]", "Technicians use paper clipboards; service advisors yell status across bays; vehicle delivery delays cause massive customer dissatisfaction."),
        ("🧊 Management Blindness & Batch Reporting [30-Day Lag]", "General Managers and Dealer Principals rely on end-of-month accountant summaries — zero live visibility into gross profit by bay or rep."),
        ("🤖 Zero Autonomous AI Intelligence [100% Manual]", "No legacy DMS in India offers AI agents that proactively query ERP records, draft WhatsApp follow-ups, or propose parts stock reorders.")
    ]
    for title, desc in problems:
        add_card(slide2, 0.8, y, 7.4, 1.3, title, desc)
        y += 1.4

    # Right: Financial Drain + Fragmented Reality + Root Cause
    add_card(slide2, 8.5, 1.85, 5.7, 2.4, "⚠️ ANNUAL FINANCIAL DRAIN (₹32L+ TOTAL LOSS)",
             "• ₹12–18L Annual Fragmented SaaS Spend (5–8 tools)\n• 35% Customer Churn after initial warranty expires\n• 2.5 Hours Daily Manual Data Re-entry per rep across CRM & billing\n• ₹3.2L/month Lost Unbilled Service Bay Revenue", is_featured=True)

    add_card(slide2, 8.5, 4.45, 5.7, 2.0, "TODAY'S FRAGMENTED REALITY (6 SILOED APPS)",
             "🖥️ Legacy DMS (CDK / Orbitsys) · 📱 WhatsApp Web · 📑 Tally / Zoho Books\n📊 Excel Tracking Sheets · 🌐 OEM Ordering Portal · 📞 Call Center Dialer\n\nResult: 0% Cross-Department Intelligence", is_navy=False)

    add_card(slide2, 8.5, 6.65, 5.7, 2.2, "THE ROOT CAUSE: ARCHITECTURAL OBSOLESCENCE",
             "Legacy DMS systems were engineered 15–20 years ago as monolithic SQL databases. They lack modern REST/JSON endpoints, semantic vector embeddings, and real-time webhook architectures required for AI agent automation.", is_navy=True)

    add_bottom_banner(slide2, "CRITICAL BOTTLENECK: ₹32L+ ANNUAL REVENUE EROSION PER DEALERSHIP", ["5-7 Siloed Tools", "40% Lead Leakage", "Zero Real-Time BI"])

    # =========================================================================
    # SLIDE 3: SOLUTION & PRODUCT
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, 3, "ONE PLATFORM. EVERY DEPARTMENT.", "AI-NATIVE INTELLIGENCE.",
               "16 integrated modules and 7 specialist AI agents engineered natively on a unified real-time database")

    # 4 Core Pillars
    add_card(slide3, 0.8, 1.85, 3.8, 3.4, "🚗 Showroom & Sales CRM [LIVE]",
             "• AI Lead Scoring & Omnichannel Routing\n• WhatsApp Auto-Follow-ups (Tamil/Eng)\n• Digital Test Drive GPS Tracking\n• Customer 360 Timeline (15 Event Types)\n• Real-Time Quotation & Booking Engine")

    add_card(slide3, 4.8, 1.85, 3.8, 3.4, "🔧 ServicePulse Workshop OS [LIVE]",
             "• 90-Sec Number Plate Scanner OCR\n• Visual Bay Scheduler & Tech Allocation\n• Real-time WhatsApp Video Repair Approval\n• Vehicle 360 VIN Lifecycle Record\n• Post-Service Feedback Automation")

    add_card(slide3, 0.8, 5.45, 3.8, 3.4, "📦 Parts & Multi-Warehouse [LIVE]",
             "• Fast/Slow Moving Stock Analytics\n• Automated Low-Stock Purchase Orders\n• Regional Distributor B2B Catalog Sync\n• Inter-Branch Warehouse Balancing\n• Barcode & Bin Location Verification")

    add_card(slide3, 4.8, 5.45, 3.8, 3.4, "💰 Finance, GST & Insurance [LIVE]",
             "• 1-Click GST E-Invoicing & E-Way Bill\n• Automated Razorpay/Bank Reconciliation\n• Policy Expiry Renewal Churn Predictor\n• Real-time Profit & Loss by Rooftop / Bay\n• Multi-Location Group Accounting")

    # Right: 7 AI Specialists + ActionProposal
    add_card(slide3, 8.8, 1.85, 5.4, 4.2, "7 SPECIALIST AUTONOMOUS AI AGENTS",
             "• 🎯 SalesAI: 24/7 lead qualification & test drive booking\n• 🛠️ ServiceAI: 90-sec repair estimation & bay planning\n• 📦 PartsAI: Predictive demand forecasting & auto-POs\n• 💵 FinanceAI: Automated payment reconciliation & ledger\n• 📋 ComplianceAI: GST e-invoice verification & warranty claims\n• 👔 GMCopilot: Natural language query of live dealership KPIs\n• 💬 SupportAI: Tamil, Tanglish & English WhatsApp voice bot", is_navy=True)

    add_card(slide3, 8.8, 6.25, 5.4, 2.6, "ACTIONPROPOSAL TWO-TIER SAFETY PROTOCOL",
             "Tier 1 (Autonomous Read): Scans ERP, computes margins, drafts messages, flags stockouts.\n\nTier 2 (Human Approval): Price alterations, large parts orders, discounts generate an ActionProposal requiring Manager sign-off before mutation.", is_featured=True)

    add_bottom_banner(slide3, "ENTERPRISE SAFETY: ZERO UNCHECKED MUTATIONS · 100% AUDIT LOGGING", ["7 Agents Built", "Gemini 3.6 Flash RAG", "11 RBAC Roles"])

    # =========================================================================
    # SLIDE 4: MARKET OPPORTUNITY
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, 4, "AUTOMOTIVE AFTERMARKET & RETAIL:", "GLOBAL SCALE ($48.5B) + INDIA (₹1.08L CR)",
               "Capitalizing on the seismic shift from rigid on-premise software to intelligent cloud operating platforms")

    # Top: TAM / SAM / SOM
    add_card(slide4, 0.8, 1.85, 4.3, 2.5, "TAM · GLOBAL & INDIA [14.2% CAGR]",
             "$48.5B / ₹1,08,000 Cr\n\nGlobal automotive DMS software + Indian automotive aftermarket operations across 45,000+ authorized and independent centers.")

    add_card(slide4, 5.35, 1.85, 4.3, 2.5, "SAM · TARGET SEGMENT [12,000 HUBS]",
             "₹14,400 Crores\n\n12,000 organized multi-brand 3S dealerships, authorized OEM dealer groups, and premium multi-bay workshop chains in India.", is_featured=True)

    add_card(slide4, 9.9, 1.85, 4.3, 2.5, "SOM · YEAR 5 GOAL [₹720 CR ARR]",
             "₹720 Crores ARR\n\nCapturing 1,200 Dealerships and 25,000 Workshop nodes generating ₹60L blended annual platform value via SaaS + Spares fees.", is_navy=True)

    # Middle: 3 Market Vectors
    add_card(slide4, 0.8, 4.55, 4.3, 2.2, "🇮🇳 India — 3rd Largest Auto Market",
             "• 30,000+ FADA dealer outlets employing 5M+ people.\n• 82% of dealers actively seeking modern DMS replacements.\n• GST e-invoicing mandates forcing compliance digitization.")

    add_card(slide4, 5.35, 4.55, 4.3, 2.2, "🏭 TN Base — 'Detroit of Asia'",
             "• 70% of India's electric 2W, 40% of electric 4W produced here.\n• 1,200+ major dealerships within a 300km corridor.\n• Unrivaled ecosystem for hyper-rapid pilot iteration.")

    add_card(slide4, 9.9, 4.55, 4.3, 2.2, "🌐 High-Margin Global Corridors",
             "• Southeast Asia (Indonesia, Thailand, Vietnam) & GCC.\n• Same fragmented dealership pain with 3x higher SaaS ARPU.\n• Cloud-native multi-currency & multilingual architecture ready.")

    # Bottom: SOM Mathematical Breakdown Table
    t_shape = slide4.shapes.add_table(5, 5, Inches(0.8), Inches(6.95), Inches(13.4), Inches(1.95))
    t = t_shape.table
    t.columns[0].width = Inches(3.2)
    t.columns[1].width = Inches(2.2)
    t.columns[2].width = Inches(2.8)
    t.columns[3].width = Inches(2.8)
    t.columns[4].width = Inches(2.4)

    som_headers = ["Revenue Layer", "Node Volume", "Average Blended Pricing", "Annual Platform GMV", "Year 5 ARR"]
    for c_idx, h in enumerate(som_headers):
        cell = t.cell(0, c_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_WHITE

    som_data = [
        ("Pro Dealerships", "1,200 Dealerships", "₹1,00,000 / month", "Core SaaS Operations", "₹144.0 Crores"),
        ("Starter Workshops", "25,000 Workshops", "₹10,000–₹50,000 / mo blended", "Job Cards & Invoicing", "₹356.0 Crores"),
        ("B2B Spares Marketplace", "39,000 Nodes Total", "2.5% Transaction Take-Rate", "₹4,800 Cr Spare Parts GMV", "₹120.0 Crores"),
        ("Enterprise & OEM Contracts", "25 OEM & Chains", "Custom Licensing + Telematics", "Fleet Intelligence Sync", "₹100.0 Crores")
    ]
    for r_idx, row in enumerate(som_data):
        for c_idx, val in enumerate(row):
            cell = t.cell(r_idx + 1, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(9)
            if c_idx == 4:
                p.font.bold = True
                p.font.color.rgb = ORANGE_BRAND

    add_bottom_banner(slide4, "BOTTOM-UP MATH: 1,200 DEALERS + 25K WORKSHOPS + SPARES TAKE-RATE = ₹720 CR ARR", ["45,000+ Rooftops", "12,000 SAM", "₹720 Cr SOM Target"])

    # =========================================================================
    # SLIDE 5: BUSINESS MODEL
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_header(slide5, 5, "ENTERPRISE-GRADE PRICING + MULTI-LAYER MONETIZATION:", "₹720 CR ARR",
               "Scaling from high-ACV subscription tiers into B2B spare parts GMV take-rates and OEM network licensing")

    # 3 Tiers
    add_card(slide5, 0.8, 1.85, 3.8, 4.8, "STARTER WORKSHOP\n₹50,000 / mo",
             "For workshops & independent service centers (1–5 bays)\n\n• ServicePulse 90-sec Job Card OCR\n• Number Plate Scanner & ANPR\n• Basic Parts Inventory Tracking\n• Tamil & English WhatsApp Updates\n• GST Invoicing & 5 User Accounts\n\nACV: ₹6 Lakhs / year", is_featured=False)

    add_card(slide5, 4.8, 1.85, 4.3, 4.8, "PRO DEALERSHIP ★ SWEET SPOT\n₹1,00,000 / mo",
             "For authorized single dealerships & multi-brand 3S hubs (≤12 bays)\n\n• Full Sales CRM + Service Engine\n• AI Voice Follow-up Agent (Tamil/English)\n• Predictive Parts Replenishment Engine\n• Insurance Renewal & Claims Module\n• 15 Users & Advanced BI Analytics\n\nACV: ₹12 Lakhs / year", is_featured=True)

    add_card(slide5, 9.3, 1.85, 4.9, 4.8, "YEAR 5 REVENUE WATERFALL (₹720 CR)",
             "• SaaS Subscriptions (69%): ₹500 Cr\n  12k dealerships & 25k workshops\n\n• Spares Marketplace Take-Rate (17%): ₹120 Cr\n  2.5% take-rate on ₹4,800 Cr GMV\n\n• Enterprise & OEM Contracts (11%): ₹80 Cr\n  White-label & fleet network contracts\n\n• AI Usage & Telemetry Fees (3%): ₹20 Cr\n  Per-minute voice AI & vision tokens\n\nTOTAL ANNUAL RECURRING REVENUE: ₹720 CR ★", is_navy=True)

    # Unit Economics Bar
    add_card(slide5, 0.8, 6.85, 13.4, 2.0, "INSTITUTIONAL SAAS UNIT ECONOMICS (YEAR 3–5 METRICS)",
             "• 85% Software Gross Margins | 8.6x LTV:CAC Ratio | 4.8 Months CAC Payback Period | 135% Net Revenue Retention (NRR)\n• Operating EBITDA at Maturity: ₹340 Crores (47% Margin) | Total Year 5 Operating Expenses: ₹380 Crores\n• B2B Spares Engine locks in high switching costs and compounds dealership lifetime value.", is_featured=False)

    add_bottom_banner(slide5, "HIGH CAPITAL EFFICIENCY: 85% SOFTWARE GROSS MARGINS · MULTI-LAYER EXPANSION", ["₹50k Starter", "₹1L Pro (Core)", "₹2.5L Enterprise"])

    # =========================================================================
    # SLIDE 6: TRACTION & VALIDATION
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_header(slide6, 6, "PRODUCT-COMPLETE.", "READY FOR PILOT DEPLOYMENT.",
               "Multi-tenant production architecture fully built, battle-tested with adversarial defense, and staged for commercial rollout")

    # Left: Stats + Verified capabilities
    add_card(slide6, 0.8, 1.85, 1.9, 1.3, "44+", "REST Endpoints", is_featured=True)
    add_card(slide6, 2.85, 1.85, 1.9, 1.3, "7", "AI Specialists", is_featured=True)
    add_card(slide6, 4.9, 1.85, 1.9, 1.3, "15+", "Domain Models", is_featured=True)
    add_card(slide6, 6.95, 1.85, 1.9, 1.3, "11", "RBAC Roles", is_featured=True)

    add_card(slide6, 0.8, 3.3, 8.05, 3.7, "VERIFIED PRODUCTION CAPABILITIES (LIVE ENVIRONMENT)",
             "• ✓ Full-stack deployed live — Vercel (FE) + Render (BE)\n• ✓ Gemini AI integration with live API tool calling\n• ✓ Semantic RAG with anti-hallucination guardrails\n• ✓ ActionProposal human-in-the-loop governance\n• ✓ Multi-tenant data isolation & 11 RBAC enterprise roles\n• ✓ Auto-generated OpenAPI / Swagger API specifications\n• ✓ 12-vector prompt injection defense tested\n• ✓ Full mutation audit logging engine for compliance")

    add_card(slide6, 0.8, 7.15, 8.05, 1.7, "SIMULATED DEALERSHIP ROI BENCHMARK",
             "• +28% Service Bay Throughput | -45% Customer Lead Response Latency\n• ₹3.5L/mo Additional Spare Parts Gross Margin via automated replenishment\n• 90-sec Job Card generation vs. 15-minute manual paper entry", is_navy=False)

    # Right: Pipeline + 30-Day blueprint
    add_card(slide6, 9.05, 1.85, 5.15, 2.7, "15+ SIGNED DEALERSHIP LOIS",
             "Secured across major automotive dealer networks in:\n• Coimbatore (6 rooftops)\n• Chennai (5 rooftops)\n• Bangalore (4 rooftops)\nRepresenting Maruti, Tata, Hyundai, and large multi-brand 3S centers.", is_featured=True)

    add_card(slide6, 9.05, 4.75, 5.15, 4.1, "RAPID 30-DAY TURNKEY BLUEPRINT",
             "• Day 1–7: Master Data Migration & GST Setup\n• Day 8–14: Core ERP Live Deployment\n• Day 15–21: AI Copilot, WhatsApp & Voice Bots\n• Day 22–30: Full Operations & Initial ROI Audit\n\nModern Stack: React 19 · Vite 6 · Django 4.2+ · PostgreSQL 16 · Gemini 3.6 Flash · JWT Auth", is_navy=True)

    add_bottom_banner(slide6, "COMMERCIAL READINESS: 15+ SIGNED LOIS · 30-DAY TURNKEY BLUEPRINT", ["44+ APIs Live", "7 Agents Built", "100% Multi-Tenant"])

    # =========================================================================
    # SLIDE 7: COMPETITIVE ADVANTAGE
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7)
    add_header(slide7, 7, "AI-NATIVE VS. AI-BOLTED:", "A GENERATIONAL DIFFERENCE",
               "Architectural moat: Legacy DMS providers cannot easily bolt AI onto 15-year-old monolithic database architectures")

    # Table
    table_shape = slide7.shapes.add_table(12, 6, Inches(0.8), Inches(1.85), Inches(8.5), Inches(7.0))
    table = table_shape.table
    table.columns[0].width = Inches(3.1)
    table.columns[1].width = Inches(1.2)
    table.columns[2].width = Inches(1.05)
    table.columns[3].width = Inches(1.05)
    table.columns[4].width = Inches(1.05)
    table.columns[5].width = Inches(1.05)

    headers = ["Capability Matrix", "AutoEra AI", "Orbitsys", "AutoFacets", "DealerSocket", "Zoho CRM"]
    for c_idx, h in enumerate(headers):
        cell = table.cell(0, c_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = ORANGE_BRAND if c_idx == 1 else NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_WHITE

    matrix_data = [
        ("Full ERP (Sales+Service+Parts+Fin)", "✓", "✓", "✓", "✓", "✗"),
        ("Customer 360 (15 Event Types)", "✓", "~", "~", "✓", "~"),
        ("Vehicle 360 (VIN-Centric)", "✓", "~", "✓", "✓", "✗"),
        ("AI Copilot (Live ERP Data)", "★", "✗", "✗", "✗", "✗"),
        ("7 Specialist AI Agents", "★", "✗", "✗", "✗", "✗"),
        ("RAG Knowledge Base Engine", "★", "✗", "✗", "✗", "✗"),
        ("ActionProposal (Human-in-Loop)", "★", "✗", "✗", "✗", "✗"),
        ("Multi-Tenant Dealer Group Arch", "✓", "~", "✓", "✓", "✗"),
        ("Tamil / Tanglish Regional AI", "✓", "✗", "✗", "✗", "✗"),
        ("Modern Stack (2026 Standard)", "✓", "Legacy", "Legacy", "Legacy", "✓"),
        ("GST-Compliant E-Invoicing", "✓", "✓", "✓", "✗", "✗"),
    ]

    for r_idx, row in enumerate(matrix_data):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx + 1, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(9.5)
            if c_idx == 1:
                p.font.bold = True
                p.font.color.rgb = ORANGE_BRAND
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(255, 245, 235)
            else:
                p.font.color.rgb = DANGER_RED if val == "✗" else TEXT_BODY

    # Right: Moats
    add_card(slide7, 9.6, 1.85, 4.6, 3.4, "WHY LEGACY DMS CANNOT JUST 'ADD AI'",
             "AI-native means the data model natively supports vector embeddings, the API supports LLM tool-calling, and the workflow supports ActionProposals.\n\nThis is deep foundational architecture — it cannot be bolted onto a 15-year-old on-premise relational monolith.\n\nAutoEra AI was engineered AI-native from Day 1.", is_navy=True)

    add_card(slide7, 9.6, 5.45, 4.6, 3.4, "VERNACULAR AI & IOT EDGE MOAT",
             "• Vernacular AI: Service advisors in Tier 2/3 cities speak Tamil, Telugu, Hindi & Tanglish. AutoEra's localized voice agent handles customer follow-ups natively.\n\n• Hardware Telemetry: Plug-and-play OBD-II telematics & ANPR cameras stream live data directly into Vehicle 360 profiles.", is_featured=False)

    add_bottom_banner(slide7, "UNMATCHED ARCHITECTURAL MOAT: EMBEDDINGS + TOOL CALLING + ACTIONPROPOSALS", ["Only Live Copilot", "Regional Voice AI", "100% GST Native"])

    # =========================================================================
    # SLIDE 8: ROADMAP & GTM
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_header(slide8, 8, "MASTER PLAN EXECUTION TIMELINE:", "CHENNAI BEACHHEAD TO ₹720 CR ARR",
               "Aggressive geographic and technological scaling from South India's automotive capital to global leadership")

    # 4 Timeline Cards
    add_card(slide8, 0.8, 1.85, 3.1, 3.2, "YEAR 1 (2026)\n₹10 Cr ARR",
             "200 Dealers · 300 Workshops\n\nChennai & Coimbatore launch. Deploy ServicePulse + Tamil Voice. 50 dealer beachhead in 10km radius.", is_featured=True)
    add_card(slide8, 4.2, 1.85, 3.1, 3.2, "YEAR 2 (2027)\n₹30 Cr ARR",
             "800 Dealers · 1,500 Workshops\n\nPan-South expansion (TN, Karnataka, AP, MH). Launch B2B automated parts replenishment with distributors.")
    add_card(slide8, 7.6, 1.85, 3.1, 3.2, "YEAR 3 (2028)\n₹96 Cr ARR",
             "2,000 Dealers · 4,000 Workshops\n\nNational expansion via FADA dealer networks (Maruti, Tata, Hyundai). OEM fleet & warranty integration.")
    add_card(slide8, 11.0, 1.85, 3.2, 3.2, "YEAR 4–5 (2029–30)\n₹720 Cr ARR ★",
             "12k Dealers · 25k Workshops\n\nPan-India + SE Asia (ASEAN) & GCC expansion. 39,000 nodes generating ₹340 Cr operating EBITDA.", is_navy=True)

    # 3 Strategic Growth Channels
    add_card(slide8, 0.8, 5.25, 4.3, 2.2, "🤝 Distributor & Parts Flywheel",
             "Aftermarket spare parts distributors co-sponsor AutoEra licenses to secure recurring workshop parts supply.")
    add_card(slide8, 5.35, 5.25, 4.3, 2.2, "🏭 FADA & OEM Network Adoption",
             "Bulk dealer association onboarding for automated GST e-invoicing compliance and unified service quality benchmarks.")
    add_card(slide8, 9.9, 5.25, 4.3, 2.2, "📲 Grassroots Workshop Virality",
             "Free-tier mobile job card scanner app converts unorganized garages into paid Starter subscribers within 60 days.")

    # Bottom Geographic Roadmap Bar
    add_card(slide8, 0.8, 7.65, 13.4, 1.2, "GEOGRAPHIC CLUSTER PROGRESSION",
             "• 2026: Chennai, Coimbatore, Salem, Madurai (200 Dealers) | 2027: Bengaluru, Hyderabad, Pune, Mumbai (800 Dealers)\n• 2028: Delhi-NCR, Ahmedabad, Kolkata, Pan-India (2,000 Dealers) | 2029–30: Jakarta, Bangkok, Dubai, Riyadh (12,000 Dealers)", is_navy=False)

    add_bottom_banner(slide8, "SCALING VELOCITY: 200 ROOFTOPS IN Y1 ➔ 39,000 AUTOMOTIVE NODES IN Y5", ["Year 1: ₹10 Cr", "Year 3: ₹96 Cr", "Year 5: ₹720 Cr"])

    # =========================================================================
    # SLIDE 9: FINANCIAL PROJECTIONS
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9)
    add_header(slide9, 9, "5-YEAR GROWTH PATH TO ₹720 CRORE ARR:", "₹340 CR EBITDA (47%)",
               "High operating leverage software model producing exceptional free cash flow and institutional profitability at scale")

    # 4 Top KPI Blocks
    add_card(slide9, 0.8, 1.85, 3.1, 1.3, "₹720 Crores", "Year 5 ARR (Table 56)", is_featured=True)
    add_card(slide9, 4.2, 1.85, 3.1, 1.3, "₹340 Crores", "Operating EBITDA (47%)", is_featured=False)
    add_card(slide9, 7.6, 1.85, 3.1, 1.3, "₹380 Crores", "Year 5 Total Expenses", is_featured=False)
    add_card(slide9, 11.0, 1.85, 3.2, 1.3, "₹7,200 Cr", "Unicorn Value (~$870M)", is_navy=True)

    # Table 1: Year 5 Revenue Breakdown (Table 56)
    t1_shape = slide9.shapes.add_table(6, 3, Inches(0.8), Inches(3.35), Inches(6.5), Inches(3.6))
    t1 = t1_shape.table
    t1.columns[0].width = Inches(3.8)
    t1.columns[1].width = Inches(1.5)
    t1.columns[2].width = Inches(1.2)

    t1_headers = ["Revenue Stream", "Year 5 Amount", "% Share"]
    for c_idx, h in enumerate(t1_headers):
        cell = t1.cell(0, c_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_WHITE

    t1_data = [
        ("SaaS Subscriptions (Starter/Pro/Ent)", "₹500 Crores", "69%"),
        ("Transaction Fees (Spares & Ins.)", "₹120 Crores", "17%"),
        ("Enterprise Contracts (OEMs & Fleets)", "₹80 Crores", "11%"),
        ("AI Usage Fees (Voice & Vision)", "₹20 Crores", "3%"),
        ("TOTAL ANNUAL RECURRING REVENUE", "₹720 Crores", "100% ★")
    ]
    for r_idx, row in enumerate(t1_data):
        for c_idx, val in enumerate(row):
            cell = t1.cell(r_idx + 1, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(9.5)
            if r_idx == 4:
                p.font.bold = True
                p.font.color.rgb = ORANGE_BRAND
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(255, 245, 235)

    # Table 2: 5-Year Growth Progression (Table 55)
    t2_shape = slide9.shapes.add_table(6, 5, Inches(7.6), Inches(3.35), Inches(6.6), Inches(3.6))
    t2 = t2_shape.table
    t2.columns[0].width = Inches(1.6)
    t2.columns[1].width = Inches(1.1)
    t2.columns[2].width = Inches(1.3)
    t2.columns[3].width = Inches(1.2)
    t2.columns[4].width = Inches(1.4)

    t2_headers = ["Year", "Dealers", "Workshops", "MRR", "ARR"]
    for c_idx, h in enumerate(t2_headers):
        cell = t2.cell(0, c_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_WHITE

    t2_data = [
        ("Year 1 (2026)", "200", "300", "₹40 Lakhs", "₹10.0 Cr"),
        ("Year 2 (2027)", "800", "1,500", "₹2.50 Cr", "₹30.0 Cr"),
        ("Year 3 (2028)", "2,000", "4,000", "₹8.00 Cr", "₹96.0 Cr"),
        ("Year 4 (2029)", "5,000", "10,000", "₹25.00 Cr", "₹300.0 Cr"),
        ("Year 5 (2030)", "12,000", "25,000", "₹60.00 Cr", "₹720.0 Cr ★")
    ]
    for r_idx, row in enumerate(t2_data):
        for c_idx, val in enumerate(row):
            cell = t2.cell(r_idx + 1, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(9.5)
            if r_idx == 4:
                p.font.bold = True
                p.font.color.rgb = ORANGE_BRAND
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(255, 245, 235)

    add_card(slide9, 0.8, 7.15, 13.4, 1.7, "UNICORN VALUATION MATH (MASTER PLAN TABLE 127)",
             "₹720 Crores ARR × 10x Revenue Multiple = ₹7,200 Crores (~$870 Million Enterprise Valuation) upon national dominance and ASEAN/GCC expansion.\nCash Flow Positive from Year 3 onwards with a steady-state 47% Operating EBITDA margin.", is_navy=False)

    add_bottom_banner(slide9, "FINANCIAL DISCIPLINE: PROFITABLE FROM YEAR 3 ONWARDS · 47% OPERATING MARGIN", ["₹340 Cr EBITDA", "47% Margin", "8.6x LTV:CAC"])

    # =========================================================================
    # SLIDE 10: INVESTMENT ASK
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10)
    add_header(slide10, 10, "SEED ROUND INVESTMENT ASK & ALLOCATION:", "CATALYZING YEAR 1 (₹10 CR ARR)",
               "Funding the 18-month beachhead expansion, AI mobile technician apps, and B2B spare parts marketplace integration")

    # 3 Columns
    add_card(slide10, 0.8, 1.85, 4.3, 5.4, "STRATEGIC CAPITAL ALLOCATION",
             "• 40% (₹2.0 Cr) — Mobile App & AI Engineering\n• 25% (₹1.25 Cr) — GTM, Dealer Onboarding & Hardware\n• 15% (₹0.75 Cr) — Cloud Infra, Security & SLA\n• 10% (₹0.50 Cr) — B2B Parts Catalog Integration\n• 10% (₹0.50 Cr) — Working Capital & 18-Mo Runway\n\nTotal Ask: Seed Growth Capital (₹5.0 Cr Target)")

    add_card(slide10, 5.35, 1.85, 4.3, 5.4, "WHAT THIS SEED ROUND IGNITES",
             "• 50 paid flagship dealerships onboarded with verified 4x ROI case study metrics.\n\n• B2B Spare Parts Marketplace engine connected to regional aftermarket distributors.\n\n• Rapid acceleration to 400 active dealerships generating ₹10 Crore ARR in Year 1.\n\n• Institutional Series A readiness ($5M–$8M round) for pan-India expansion.", is_featured=True)

    add_card(slide10, 9.9, 1.85, 4.3, 5.4, "18-MONTH EXECUTION MILESTONES",
             "• M1–M3: Commercial Launch & Flagship Deployments\n  Deploy first 15 paid dealerships in Coimbatore & Chennai. Mobile tech app live.\n\n• M4–M6: 50 Dealerships & Parts Marketplace Beta\n  50 paid dealerships operational. Launch automated B2B parts ordering with distributors.\n\n• M7–M12: Year 1 Milestone — 400 Dealers\n  Scale across TN, Karnataka, Maharashtra. Hit ₹10 Cr ARR.\n\n• M13–M18: Series A Readiness ($5M–$8M Round)", is_navy=True)

    # Founder Contact Card
    fc = add_card(slide10, 0.8, 7.45, 13.4, 1.4, "SANTHOSH — FOUNDER & CEO | AUTOERA AI SOLUTIONS",
                  "AutoEra AI Cloud Platform · Chennai & Coimbatore, Tamil Nadu, India | Email: santhosh@autoera.ai | Web: www.autoera.ai\nJoin us in building the global operating system for the automotive world.")

    add_bottom_banner(slide10, "JOIN US IN BUILDING THE GLOBAL OPERATING SYSTEM FOR THE AUTOMOTIVE WORLD", ["18-Mo Runway", "₹10 Cr Y1 ARR", "400 Flagship Dealers"])

    output_path = r"f:\autoeraaisaas-main\pitch-deck\AutoEra_AI_Master_Pitch_Deck_2026.pptx"
    prs.save(output_path)
    print(f"Successfully generated dense PowerPoint deck: {output_path}")

if __name__ == '__main__':
    build_dense_pptx()
