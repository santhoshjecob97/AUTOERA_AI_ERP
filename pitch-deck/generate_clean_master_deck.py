import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_master_clean_deck():
    prs = Presentation()
    # 15.0 x 10.0 inches (3:2 ratio matching the attached Autoera_AI_Pitch_CLEAN_FINAL.pptx)
    prs.slide_width = Inches(15.0)
    prs.slide_height = Inches(10.0)
    blank_layout = prs.slide_layouts[6]

    # Color Palette matching Autoera_AI_Pitch_CLEAN_FINAL.pptx
    BG_LIGHT = RGBColor(248, 250, 252)       # #F8FAFC
    CARD_BG = RGBColor(255, 255, 255)        # #FFFFFF
    CARD_BORDER = RGBColor(226, 232, 240)    # #E2E8F0
    NAVY_DARK = RGBColor(6, 11, 24)          # #060B18 (Deep Black Navy)
    NAVY_CARD = RGBColor(10, 17, 40)         # #0A1128 (Card Navy)
    NAVY_BORDER = RGBColor(30, 41, 59)       # #1E293B
    ORANGE_BRAND = RGBColor(255, 87, 34)     # #FF5722 (Vibrant AutoEra Orange)
    ORANGE_LIGHT = RGBColor(249, 115, 22)    # #F97316
    TEXT_DARK = RGBColor(15, 23, 42)         # #0F172A
    TEXT_BODY = RGBColor(51, 65, 85)         # #334155
    TEXT_MUTED = RGBColor(100, 116, 139)     # #64748B
    TEXT_WHITE = RGBColor(248, 250, 252)     # #F8FAFC
    SUCCESS_GREEN = RGBColor(22, 163, 74)    # #16A34A
    DANGER_RED = RGBColor(220, 38, 38)       # #DC2626

    logo_path = "f:\\autoeraaisaas-main\\pitch-deck\\assets\\autoera_logo_original.png"
    car_img_path = "f:\\autoeraaisaas-main\\pitch-deck\\extracted_clean_final\\slide_1.jpg"

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_LIGHT
        bg.line.fill.background()
        return bg

    def add_header(slide, slide_num, title_part1, title_orange="", subtitle=""):
        # AutoEra Logo
        if os.path.exists(logo_path):
            slide.shapes.add_picture(logo_path, Inches(0.8), Inches(0.35), height=Inches(0.65))
        else:
            tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(4.0), Inches(0.65))
            tf = tb.text_frame
            p = tf.paragraphs[0]
            p.text = "AUTOERA AI"
            p.font.size = Pt(22)
            p.font.bold = True
            p.font.color.rgb = NAVY_DARK

        # Top-right wedge/badge matching reference deck
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(12.8), Inches(0.25), Inches(2.2), Inches(0.85))
        badge.fill.solid()
        badge.fill.fore_color.rgb = NAVY_DARK
        badge.line.fill.background()

        tb = slide.shapes.add_textbox(Inches(12.9), Inches(0.28), Inches(2.0), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run1 = p.add_run()
        run1.text = f"{slide_num:02d} "
        run1.font.bold = True
        run1.font.size = Pt(20)
        run1.font.color.rgb = ORANGE_BRAND
        run1.font.name = "Arial"

        run2 = p.add_run()
        run2.text = "PITCH DECK" if slide_num < 11 else "FINAL SLIDE"
        run2.font.bold = True
        run2.font.size = Pt(11)
        run2.font.color.rgb = TEXT_WHITE
        run2.font.name = "Arial"

        # Slide Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.15), Inches(13.4), Inches(0.7))
        tf = t_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        run_t1 = p.add_run()
        run_t1.text = title_part1 + " "
        run_t1.font.bold = True
        run_t1.font.size = Pt(28)
        run_t1.font.color.rgb = NAVY_DARK
        run_t1.font.name = "Arial"

        if title_orange:
            run_t2 = p.add_run()
            run_t2.text = title_orange
            run_t2.font.bold = True
            run_t2.font.size = Pt(28)
            run_t2.font.color.rgb = ORANGE_BRAND
            run_t2.font.name = "Arial"

        # Subtitle
        if subtitle:
            s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.85), Inches(13.4), Inches(0.45))
            tf_s = s_box.text_frame
            tf_s.word_wrap = True
            tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
            p_s = tf_s.paragraphs[0]
            p_s.text = subtitle
            p_s.font.size = Pt(13)
            p_s.font.color.rgb = TEXT_MUTED
            p_s.font.name = "Arial"

    def add_bottom_banner(slide, tag_text, tag_orange="", metric1="", metric2="", metric3=""):
        banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(8.85), Inches(13.4), Inches(0.85))
        banner.fill.solid()
        banner.fill.fore_color.rgb = NAVY_DARK
        banner.line.fill.background()

        tb = slide.shapes.add_textbox(Inches(1.1), Inches(8.95), Inches(8.5), Inches(0.65))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        run1 = p.add_run()
        run1.text = tag_text + " "
        run1.font.bold = True
        run1.font.size = Pt(13)
        run1.font.color.rgb = TEXT_WHITE
        run1.font.name = "Arial"

        if tag_orange:
            run2 = p.add_run()
            run2.text = tag_orange
            run2.font.bold = True
            run2.font.size = Pt(13)
            run2.font.color.rgb = ORANGE_BRAND
            run2.font.name = "Arial"

        # Metrics on right
        metrics_box = slide.shapes.add_textbox(Inches(9.5), Inches(8.95), Inches(4.4), Inches(0.65))
        tf_m = metrics_box.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = 0
        p_m = tf_m.paragraphs[0]
        p_m.alignment = PP_ALIGN.RIGHT
        
        items = [m for m in [metric1, metric2, metric3] if m]
        p_m.text = "   |   ".join(items)
        p_m.font.size = Pt(11)
        p_m.font.bold = True
        p_m.font.color.rgb = RGBColor(226, 232, 240)
        p_m.font.name = "Arial"

    def add_card(slide, left, top, width, height, title="", items=None, is_navy=False, border_orange=False, badge_text=""):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = NAVY_CARD if is_navy else CARD_BG
        card.line.color.rgb = ORANGE_BRAND if border_orange else (NAVY_BORDER if is_navy else CARD_BORDER)
        card.line.width = Pt(2 if border_orange else 1)

        if badge_text:
            badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + width - Inches(1.8), top - Inches(0.18), Inches(1.6), Inches(0.35))
            badge.fill.solid()
            badge.fill.fore_color.rgb = ORANGE_BRAND
            badge.line.fill.background()
            tb = slide.shapes.add_textbox(left + width - Inches(1.8), top - Inches(0.18), Inches(1.6), Inches(0.35))
            tf = tb.text_frame
            p = tf.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            p.text = badge_text
            p.font.size = Pt(9)
            p.font.bold = True
            p.font.color.rgb = TEXT_WHITE

        content_top = top + Inches(0.16)
        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.2), content_top, width - Inches(0.4), Inches(0.4))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.bold = True
            p.font.size = Pt(13)
            p.font.color.rgb = TEXT_WHITE if is_navy else (ORANGE_BRAND if border_orange else NAVY_DARK)
            p.font.name = "Arial"
            content_top += Inches(0.38)

        if items:
            tb = slide.shapes.add_textbox(left + Inches(0.2), content_top, width - Inches(0.4), height - (content_top - top) - Inches(0.12))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            for i, itm in enumerate(items):
                p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
                p.text = itm
                p.font.size = Pt(10.5)
                p.font.color.rgb = RGBColor(226, 232, 240) if is_navy else TEXT_BODY
                p.space_after = Pt(4)
                p.font.name = "Arial"

        return card

    # =========================================================================
    # SLIDE 1: COVER
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Logo
    if os.path.exists(logo_path):
        s1.shapes.add_picture(logo_path, Inches(1.0), Inches(0.8), height=Inches(0.95))

    # Cover Title
    tb = s1.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(7.5), Inches(1.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    r1 = p.add_run()
    r1.text = "PITCH "
    r1.font.bold = True
    r1.font.size = Pt(46)
    r1.font.color.rgb = NAVY_DARK
    r1.font.name = "Arial"
    r2 = p.add_run()
    r2.text = "DECK"
    r2.font.bold = True
    r2.font.size = Pt(46)
    r2.font.color.rgb = ORANGE_BRAND
    r2.font.name = "Arial"

    p2 = tf.add_paragraph()
    p2.text = "AI-POWERED AUTOMOTIVE OPERATING SYSTEM"
    p2.font.bold = True
    p2.font.size = Pt(17)
    p2.font.color.rgb = NAVY_DARK
    p2.font.name = "Arial"
    p2.space_before = Pt(8)

    # Vision Box
    vbox = s1.shapes.add_textbox(Inches(1.0), Inches(4.2), Inches(7.2), Inches(1.8))
    tf_v = vbox.text_frame
    tf_v.word_wrap = True
    p_v = tf_v.paragraphs[0]
    p_v.text = "Unifying Sales · Service · Parts · Finance · Insurance with built-in AI Intelligence. AutoEra AI will become the global operating system for the automotive industry — the single platform that every dealership, OEM, fleet operator, insurer, and vehicle owner depends on."
    p_v.font.size = Pt(13.5)
    p_v.font.color.rgb = TEXT_BODY
    p_v.font.name = "Arial"

    # 4 Pillars
    pills = [
        ("AI-Powered Intelligence", "🤖"),
        ("Data-Driven Growth", "📈"),
        ("Customer Centric", "🤝"),
        ("Secure & Scalable", "🛡️")
    ]
    for i, (txt, ico) in enumerate(pills):
        px = Inches(1.0 + i * 1.8)
        py = Inches(6.3)
        box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, py, Inches(1.65), Inches(1.0))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = CARD_BORDER
        tb = s1.shapes.add_textbox(px + Inches(0.08), py + Inches(0.12), Inches(1.5), Inches(0.8))
        tf_b = tb.text_frame
        tf_b.word_wrap = True
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = f"{ico}\n{txt}"
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = NAVY_DARK

    # Founder Info
    tb = s1.shapes.add_textbox(Inches(1.0), Inches(7.6), Inches(6.0), Inches(0.9))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "Santhosh Jecob"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = NAVY_DARK
    p2 = tf.add_paragraph()
    p2.text = "Founder & CEO | AutoEra AI • Chennai, India"
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_MUTED

    # Car image on right
    if os.path.exists(car_img_path):
        s1.shapes.add_picture(car_img_path, Inches(8.0), Inches(0.8), width=Inches(6.6))

    add_bottom_banner(s1, "DRIVING THE FUTURE OF", "AUTOMOTIVE INTELLIGENCE", "16 Integrated Modules", "11 RBAC Roles", "₹720 Cr ARR Goal")

    # =========================================================================
    # SLIDE 2: THE PROBLEM
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, 2, "AI-POWERED", "AUTOMOTIVE PLATFORM", "Dealerships and mobility businesses are paralyzed by fragmented legacy tools and lost revenue.")

    # 4 Problem Cards
    add_card(s2, Inches(0.8), Inches(2.4), Inches(3.2), Inches(3.0), "🗄️ DATA SILOS", [
        "5–7 disconnected software tools (CRM, DMS, parts catalog, telephony) create severe data blind spots.",
        "Customer and vehicle history is fragmented across legacy systems.",
        "Zero single source of truth."
    ])

    add_card(s2, Inches(4.2), Inches(2.4), Inches(3.2), Inches(3.0), "⏱️ LOW EFFICIENCY", [
        "60%+ of service advisor time spent on manual data entry and repetitive paperwork.",
        "Technicians wait 15–20 mins per job chasing parts availability.",
        "Manual telephone scheduling causes long hold times and errors."
    ])

    add_card(s2, Inches(0.8), Inches(5.6), Inches(3.2), Inches(3.0), "⭐ POOR CX & CHURN", [
        "Slow response times and missed inquiries during peak showroom hours.",
        "Opaque repair estimates and unexpected price escalations.",
        "40%+ customer drop-off post-warranty due to zero proactive engagement."
    ])

    add_card(s2, Inches(4.2), Inches(5.6), Inches(3.2), Inches(3.0), "📉 LOST REVENUE", [
        "Dealerships lose ₹40L–₹75L annually per location in uncontacted leads and missed renewals.",
        "Unclaimed warranty reimbursements and dead parts inventory stock.",
        "Poor follow-up automation slashes service retention."
    ])

    # Right Industry Impact Card
    add_card(s2, Inches(7.6), Inches(2.4), Inches(6.6), Inches(6.2), "CRITICAL INDUSTRY PAIN POINTS & LOSSES", [
        "🚨 65% of customer inquiries during peak showroom hours go unanswered or severely delayed.",
        "🚨 15–20% of service appointments suffer from parts unavailability and scheduling friction.",
        "🚨 ₹75 Lakhs+ lost annually per dealership from missed lead follow-ups and service churn.",
        "🚨 42% customer drop-off post warranty period due to lack of personalized predictive maintenance.",
        "🚨 Fragmented legacy DMS tools (Autosoft, Orbitsys) charge heavy maintenance with zero built-in AI.",
        "🚨 AutoEra AI solves this with a unified, real-time operating system that connects all silos."
    ], is_navy=True)

    add_bottom_banner(s2, "DRIVING THE FUTURE OF", "AUTOMOTIVE INTELLIGENCE", "Smarter Decisions", "Customer Centric", "Secure & Scalable")

    # =========================================================================
    # SLIDE 3: THE SOLUTION
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, 3, "THE", "SOLUTION", "Intelligent conversations, deep automotive domain knowledge, and real-time ERP action.")

    add_card(s3, Inches(0.8), Inches(2.4), Inches(4.2), Inches(4.5), "PRODUCT 01: AI VOICE & COMMS AGENT", [
        "📞 24/7 Autonomous Inbound & Outbound Calling",
        "🎯 Lead Qualification & Automated CRM Capture",
        "📅 Service Booking, Rescheduling & Pick-up Scheduling",
        "🗣️ Multilingual: Tamil, English, Hindi, Telugu, Kannada",
        "🔄 Instant Human Escalation with Live Sentiment Summary",
        "💬 Multi-channel: WhatsApp, SMS, Web Chat, Showroom"
    ], border_orange=True)

    add_card(s3, Inches(5.2), Inches(2.4), Inches(4.6), Inches(4.5), "CENTRAL HUB: AUTOERA AI ENGINE", [
        "⚡ Core Automotive Dealership Operating System",
        "🔹 Unifying Sales, Service, Parts, Finance & Insurance",
        "🔹 ActionProposal Two-Tier Safety Protocol",
        "🔹 11 Enterprise RBAC Roles & Audit Trail",
        "🔹 Direct Bi-directional DMS & OEM Sync",
        "🔹 Real-Time Conversational AI to Structured ERP Records"
    ], is_navy=True)

    add_card(s3, Inches(10.0), Inches(2.4), Inches(4.2), Inches(4.5), "PRODUCT 02: AI SERVICE ADVISOR COPILOT", [
        "⚡ Voice-to-Job-Card Generation in under 45 seconds",
        "🔍 OEM RAG Diagnostic & Repair Recommendation",
        "📦 Real-Time Parts Inventory Check & Stock Allocation",
        "💰 Transparent Labor & Parts Cost Estimation",
        "📋 Technician Work Order Guidance & Bay Tracking",
        "🔁 Automated CSI Retention & Insurance Follow-ups"
    ])

    # 6 Impact metric boxes
    metrics = [
        ("100% Inquiries", "Zero missed calls"),
        ("+35% Bookings", "Higher conversion"),
        ("94% CSI Score", "Instant responses"),
        ("+28% Upsell", "OEM guided jobs"),
        ("-60% Paperwork", "Autonomous cards"),
        ("Actionable BI", "Live dealership audit")
    ]
    for i, (m_val, m_lbl) in enumerate(metrics):
        mx = Inches(0.8 + i * 2.25)
        my = Inches(7.1)
        b = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, my, Inches(2.15), Inches(1.5))
        b.fill.solid()
        b.fill.fore_color.rgb = CARD_BG
        b.line.color.rgb = CARD_BORDER
        tb = s3.shapes.add_textbox(mx, my + Inches(0.2), Inches(2.15), Inches(1.1))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = m_val
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = ORANGE_BRAND
        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.CENTER
        p2.text = m_lbl
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    add_bottom_banner(s3, "TURNING EVERY CONVERSATION INTO", "AN OPPORTUNITY FOR REVENUE GROWTH", "24/7 Autonomy", "< 2s Latency", "Measurable ROI")

    # =========================================================================
    # SLIDE 4: HOW THE PRODUCT WORKS
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, 4, "HOW", "THE PRODUCT WORKS", "Combining voice, intelligence, data, and automation to trigger real operational workflows.")

    # 5 Stages
    stages = [
        ("1. CHANNELS", ["📞 Voice Calls", "💬 WhatsApp", "🌐 Web Chat", "📱 SMS / RCS", "📑 Tablets"], False),
        ("2. COMMS LAYER", ["🎙️ Real-Time STT", "🧠 Intent NLU", "🗣️ Neural Voice", "🇮🇳 Multi-Dialect", "⚡ SIP Telephony"], False),
        ("3. AI INTELLIGENCE", ["🤖 7 Specialized Agents", "📚 OEM RAG Grounding", "🚗 Vehicle History", "⚙️ Business Logic", "🛡️ ActionProposal"], True),
        ("4. ERP SYSTEMS", ["🖥️ DMS / CRM", "🛠️ Workshop Bay", "📦 Parts Master", "🧾 Billing Ledger", "📊 BI Analytics"], False),
        ("5. OUTCOMES", ["✅ Instant Booking", "✅ Job Card Done", "✅ Parts Reserved", "✅ CRM Updated", "✅ Client Notified"], False)
    ]
    for i, (stg_title, stg_items, is_nv) in enumerate(stages):
        sx = Inches(0.8 + i * 2.7)
        sy = Inches(2.4)
        add_card(s4, sx, sy, Inches(2.55), Inches(3.8), stg_title, stg_items, is_navy=is_nv, border_orange=is_nv)

    # Bottom 45-Second Flow
    add_card(s4, Inches(0.8), Inches(6.4), Inches(8.6), Inches(2.2), "FROM CONVERSATION TO ACTION (45-SECOND WORKFLOW)", [
        "1. Customer Inquires via Voice or WhatsApp with natural vernacular language.",
        "2. AutoEra AI comprehends intent, pulls vehicle service history and OEM maintenance schedule.",
        "3. System generates structured ActionProposal with parts needed, labor codes and price estimate.",
        "4. Service Advisor reviews and approves with 1-tap on mobile or desktop console.",
        "5. Direct automated write to DMS, job card created, bay assigned, and customer gets instant confirmation."
    ])

    add_card(s4, Inches(9.6), Inches(6.4), Inches(4.6), Inches(2.2), "KEY DIFFERENTIATORS", [
        "✓ Automotive Domain Specific (VIN, DTC, Parts)",
        "✓ Built-in ActionProposal Two-Tier Safety Protocol",
        "✓ No Hallucinated ERP Writes",
        "✓ Native Tamil & Indian Regional Dialects",
        "✓ 30-Day Turnkey Onboarding"
    ], is_navy=True)

    add_bottom_banner(s4, "NOT JUST A CHATBOT:", "AN ACTION-ORIENTED OPERATING SYSTEM", "Real Conversations", "Real Actions", "Real Growth")

    # =========================================================================
    # SLIDE 5: PRODUCT & DEEP AUTOMOTIVE TECH
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, 5, "PRODUCT &", "AUTOMOTIVE DEEP-TECH", "Engineered for automotive enterprise security, safety protocols, and domain mastery.")

    add_card(s5, Inches(0.8), Inches(2.4), Inches(3.2), Inches(3.2), "🛡️ 11 AUTOMOTIVE RBAC ROLES", [
        "Dealer Principal (Owner View)",
        "General Manager (Full Ops)",
        "Service Advisor (Front Desk)",
        "Technician (Bay Job Cards)",
        "Parts Manager (Inventory)",
        "Telecaller / BDC Executive",
        "Finance & Insurance Desk",
        "Warranty Claims Officer"
    ])

    add_card(s5, Inches(4.2), Inches(2.4), Inches(3.2), Inches(3.2), "⚡ ACTIONPROPOSAL SAFETY", [
        "Two-Tier Safety Architecture",
        "AI never directly overwrites critical ERP databases.",
        "All writes generate structured ActionProposal envelopes.",
        "Confidence scores attached.",
        "One-tap human verification for high-value estimates."
    ])

    add_card(s5, Inches(7.6), Inches(2.4), Inches(3.2), Inches(3.2), "🗣️ INDIAN MULTI-DIALECT VOICE", [
        "Streaming Voice Architecture",
        "Native Tamil + English bilingual support from Day 1.",
        "Fine-tuned on 10,000+ Indian automotive service audio hours.",
        "Handles noisy workshop acoustics and technical terminology."
    ])

    add_card(s5, Inches(11.0), Inches(2.4), Inches(3.2), Inches(3.2), "📚 AUTOMOTIVE RAG GROUNDING", [
        "Deterministic Knowledge Retrieval",
        "OEM service manuals & repair bulletins vectorized in pgvector.",
        "Strict citation enforcement.",
        "Zero hallucination of labor codes, oil grades, or parts costs."
    ])

    # 16 Modules Banner
    add_card(s5, Inches(0.8), Inches(5.8), Inches(13.4), Inches(2.8), "16 INTEGRATED AUTOMOTIVE ERP MODULES IN A SINGLE UNIFIED PLATFORM", [
        "1. Vehicle Sales CRM  |  2. Service Workshop DMS  |  3. Parts Catalog & Inventory  |  4. Finance & Insurance (F&I)",
        "5. Digital Job Card & Estimation  |  6. Technician Bay Allocation  |  7. Warranty & Claims  |  8. Customer Retention & CSI",
        "9. Multi-Channel Telephony  |  10. Digital Vehicle Inspection (DVI)  |  11. Accounts & Invoicing  |  12. Dealer Groups",
        "13. Procurement & OEM POs  |  14. Telematics & Connected Vehicle  |  15. Executive BI Dashboards  |  16. Multi-Agent AI Copilot"
    ], is_navy=True)

    add_bottom_banner(s5, "VOICE + INTELLIGENCE + DATA + ACTION =", "REAL BUSINESS IMPACT", "24/7 Live", "< 2s Response", "+32% Upsell")

    # =========================================================================
    # SLIDE 6: TECHNOLOGY ARCHITECTURE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, 6, "TECHNOLOGY", "ARCHITECTURE", "Modern, cloud-native, and AI-native stack engineered for 99.99% enterprise uptime.")

    add_card(s6, Inches(0.8), Inches(2.4), Inches(4.3), Inches(3.6), "💻 FRONTEND & MOBILE", [
        "• React 19 + TypeScript + Vite",
        "• Tailwind CSS Automotive Design System",
        "• Responsive Tablet / Mobile PWA for workshop bays",
        "• WebRTC Audio Streaming with sub-300ms audio buffer",
        "• Real-time WebSocket event listeners"
    ])

    add_card(s6, Inches(5.35), Inches(2.4), Inches(4.3), Inches(3.6), "⚙️ BACKEND API & DATA", [
        "• Django 4.2+ REST Framework (Python 3.11+)",
        "• PostgreSQL 16 with Multi-Tenant Row Level Security",
        "• pgvector for Automotive Semantic Knowledge Search",
        "• Celery Workers + Redis 7 Cache & Message Broker",
        "• Idempotent API endpoints with audit logging"
    ])

    add_card(s6, Inches(9.9), Inches(2.4), Inches(4.3), Inches(3.6), "🤖 AI & TELEPHONY PIPELINE", [
        "• Gemini 3.6 Flash & Pro Multi-Agent Orchestrator",
        "• Deepgram / Whisper STT (<300ms transcription)",
        "• Cartesia & ElevenLabs Neural Indian TTS Voices",
        "• FreeSWITCH & Asterisk SIP PBX Gateways",
        "• Exotel & Twilio Indian Telecom Aggregation"
    ])

    add_card(s6, Inches(0.8), Inches(6.2), Inches(13.4), Inches(2.4), "ENTERPRISE SECURITY, COMPLIANCE & PERFORMANCE", [
        "🔒 DPDP Act & GDPR Compliant: AES-256 encryption at rest, TLS 1.3 in transit, strict tenant data isolation.",
        "☁️ Cloud-Native & Kubernetes Ready: Docker microservices architecture deployable on AWS India / Azure India or on-prem.",
        "📊 Full Observability & Audit Trail: OpenTelemetry tracing, structured JSON logs, and real-time LLM cost analytics.",
        "⚡ Sub-100ms Database Queries: Optimized indexed schemas for instant job card lookups and parts queries."
    ], is_navy=True)

    add_bottom_banner(s6, "BUILT WITH CUTTING-EDGE AI ·", "GROUNDED IN AUTOMOTIVE REALITIES", "High Concurrency", "Zero Lock-in", "Enterprise Grade")

    # =========================================================================
    # SLIDE 7: MARKET OPPORTUNITY
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, 7, "MARKET", "OPPORTUNITY", "Massive, rapidly digitizing, and ripe for AI-native operating system transformation.")

    # 3 Large Metric Cards
    add_card(s7, Inches(0.8), Inches(2.4), Inches(4.2), Inches(2.6), "GLOBAL MARKET", [
        "Global Opportunity: $162 Billion+",
        "Automotive Aftermarket SaaS & Digital Solutions by 2030.",
        "Growing at 10.2% CAGR globally."
    ], border_orange=False)

    add_card(s7, Inches(5.4), Inches(2.4), Inches(4.2), Inches(2.6), "INDIA ADDRESSABLE ECOSYSTEM", [
        "India Total Market: ₹1,08,000 Crores ($13B+)",
        "Dealership, Aftersales & Workshop Service Ecosystem.",
        "Fastest growing major automotive market worldwide."
    ], border_orange=True)

    add_card(s7, Inches(10.0), Inches(2.4), Inches(4.2), Inches(2.6), "INDIA DIGITAL SAAS SAM", [
        "Digital SaaS Opportunity: ₹15,000 Crores ($1.8B+)",
        "Dealership ERP, Voice Automation & Customer SaaS.",
        "Rapidly accelerating at 14.3% CAGR."
    ])

    # Bottom-Up Math Box
    add_card(s7, Inches(0.8), Inches(5.2), Inches(13.4), Inches(3.4), "BOTTOM-UP SAAS MATH & 5-YEAR TARGET SOM", [
        "🏢 25,000+ Franchised Automotive Dealerships & 50,000+ Multi-Brand Workshops in India.",
        "💰 Average Annual Software & Telephony Spend per Dealership: ₹6,00,000 to ₹30,00,000.",
        "🎯 AutoEra 5-Year Target Penetration: 1,200 High-Value Dealership Groups (~5% of Indian franchised market).",
        "📈 Formula: 1,200 Dealerships × Avg. ₹6,00,000 Annual Subscription = ₹720 Crores ARR ($86M+).",
        "🚀 Expansion Potential: Pan-India OEM mandates + Middle East & Southeast Asia automotive hubs."
    ], is_navy=True)

    add_bottom_banner(s7, "THE AUTOMOTIVE SECTOR IS READY FOR AI.", "AUTOERA AI IS READY TO LEAD.", "TAM: $162B+", "SAM: ₹15,000 Cr", "SOM: ₹720 Cr")

    # =========================================================================
    # SLIDE 8: BUSINESS MODEL & PRICING
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, 8, "BUSINESS MODEL &", "SCALABLE PRICING", "Predictable B2B SaaS subscriptions engineered for enterprise dealership unit economics.")

    # 3 Pricing Tiers
    add_card(s8, Inches(0.8), Inches(2.4), Inches(4.2), Inches(4.2), "STARTER PLAN", [
        "₹50,000 / month  (₹5 Lakhs / yr paid annually)",
        "• Ideal for Single Authorized Service Center",
        "• AI Voice Inbound Agent (2,500 minutes)",
        "• Multi-Channel WhatsApp Business Integration",
        "• Digital Job Cards & Service Booking",
        "• 5 User Accounts Included",
        "• Standard Business Hours Support"
    ])

    add_card(s8, Inches(5.4), Inches(2.4), Inches(4.2), Inches(4.2), "PROFESSIONAL PLAN", [
        "₹1,00,000 / month  (₹10 Lakhs / yr paid annually)",
        "• Ideal for Multi-Brand Dealerships (1-3 Branches)",
        "• AI Voice Inbound & Outbound (7,500 minutes)",
        "• AI Service Advisor Copilot with OEM RAG",
        "• Parts Catalog & Real-Time Inventory Sync",
        "• 20 User Accounts + Technician Bay App",
        "• Priority Support & Dedicated Onboarding Manager"
    ], border_orange=True, badge_text="MOST POPULAR")

    add_card(s8, Inches(10.0), Inches(2.4), Inches(4.2), Inches(4.2), "ENTERPRISE PLAN", [
        "₹2,50,000 / month  (₹25 Lakhs / yr paid annually)",
        "• Ideal for Dealer Groups & OEM Networks (5+ Outlets)",
        "• Unlimited AI Voice Minutes & Multilingual Engine",
        "• Custom OEM DMS Connectors & API Gateways",
        "• Multi-Tenant Group Consolidation & BI",
        "• Unlimited User Accounts & Role Permissions",
        "• 24/7 Dedicated Technical Account Manager"
    ])

    # Unit Economics Strip
    add_card(s8, Inches(0.8), Inches(6.8), Inches(13.4), Inches(1.8), "EXCELLENT ENTERPRISE UNIT ECONOMICS (AT SCALE)", [
        "Customer LTV: ₹36 Lakhs+   |   Blended CAC: ₹1.2 Lakhs   |   LTV:CAC Ratio: > 7.2x   |   CAC Payback: < 90 Days",
        "Gross Margin: 78% scaling to 85% at scale (via LLM prompt caching, model routing & local distillation)   |   Net Retention: 130%+"
    ], is_navy=True)

    add_bottom_banner(s8, "HIGH CAPITAL EFFICIENCY ·", "DEEP ENTERPRISE MOATS", "LTV:CAC > 7.2x", "Payback < 90 Days", "85% Gross Margin")

    # =========================================================================
    # SLIDE 9: TRACTION, VALIDATION & GTM
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, 9, "TRACTION, VALIDATION &", "GO-TO-MARKET", "Proven pilot validation with dealer principals, clear expansion milestones, and 30-day playbook.")

    add_card(s9, Inches(0.8), Inches(2.4), Inches(4.2), Inches(4.2), "COMMERCIAL VALIDATION", [
        "✅ 15+ Dealership LOIs & Pilots secured in South India.",
        "✅ 40+ Deep Dealer Principal interviews completed.",
        "✅ 98.4% Appointment Confirmation Rate in voice pilots.",
        "✅ 20-30% Uplift in service renewal conversions.",
        "✅ 2 Hours saved daily per service advisor.",
        "✅ 30-Day Turnkey Deployment Blueprint."
    ])

    add_card(s9, Inches(5.4), Inches(2.4), Inches(8.8), Inches(4.2), "5-PHASE SCALED GO-TO-MARKET BLUEPRINT", [
        "📍 Phase 1 (Months 1-6): Chennai & Tamil Nadu Cluster — 15 Pilots converting to 50 Paid Dealerships.",
        "📍 Phase 2 (Months 7-18): South India Automotive Hubs (Bengaluru, Hyderabad, Coimbatore) — 150 Dealerships.",
        "📍 Phase 3 (Months 19-36): West & North India Hubs (Pune, Mumbai, Delhi NCR, Ahmedabad) — 500 Dealerships.",
        "📍 Phase 4 (Months 37-48): Pan-India OEM Endorsement Programs — 850 Dealerships.",
        "📍 Phase 5 (Months 49-60): Southeast Asia & Middle East Automotive Networks — 1,200+ Dealerships."
    ], is_navy=True)

    # Testimonial Box
    add_card(s9, Inches(0.8), Inches(6.8), Inches(13.4), Inches(1.8), "DEALER PRINCIPAL FEEDBACK", [
        "\"AutoEra AI handled over 1,400 customer service renewal calls in our pilot month without dropping a single lead. Our workshop bookings jumped by 27% while our front desk saved over two hours of manual entry every day.\"",
        "— Leading Multi-Brand Automotive Dealer Principal, Tamil Nadu"
    ], border_orange=True)

    add_bottom_banner(s9, "START NARROW. PROVE VALUE.", "SCALE NATIONWIDE.", "15+ LOIs", "30-Day Onboarding", "Pan-India Expansion")

    # =========================================================================
    # SLIDE 10: COMPETITIVE ADVANTAGE & FINANCIAL ROADMAP
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, 10, "COMPETITIVE ADVANTAGE &", "FINANCIAL ROADMAP", "Purpose-built for automotive. Scaling from Year 1 (₹10 Cr ARR) to Year 5 (₹720 Cr ARR).")

    # Table 1: Competitive Comparison
    add_card(s10, Inches(0.8), Inches(2.4), Inches(6.4), Inches(4.2), "COMPETITIVE ADVANTAGE", [
        "• Automotive-Specific AI: Purpose-built for dealerships vs generic bots.",
        "• Multilingual Indian Voice: Tamil + English Day 1 vs English only.",
        "• ActionProposal Protocol: Zero hallucinated writes to core ERP.",
        "• 16 Integrated Modules: Full Dealership OS vs fragmented point tools.",
        "• 30-Day Go-Live: Fast turnkey deployment vs 6-12 months for legacy DMS.",
        "• India-First Pricing: 1/5th the cost of US legacy software (Tekion)."
    ])

    # Table 2: 5-Year Financial Roadmap
    add_card(s10, Inches(7.6), Inches(2.4), Inches(6.6), Inches(4.2), "5-YEAR FINANCIAL ROADMAP (₹ CRORES)", [
        "Year 1 (2025-26): 100 Dealers  |  ₹83L MRR   |  ₹10 Cr ARR   |  Break-even",
        "Year 2 (2026-27): 250 Dealers  |  ₹2.5 Cr MRR  |  ₹30 Cr ARR   |  ₹4.5 Cr EBITDA (15%)",
        "Year 3 (2027-28): 500 Dealers  |  ₹6.5 Cr MRR  |  ₹80 Cr ARR   |  ₹20 Cr EBITDA (25%)",
        "Year 4 (2028-29): 850 Dealers  |  ₹18 Cr MRR   |  ₹220 Cr ARR  |  ₹72 Cr EBITDA (33%)",
        "Year 5 (2029-30): 1,200 Dealers|  ₹60 Cr MRR   |  ₹720 Cr ARR  |  ₹288 Cr EBITDA (40%)",
        "--------------------------------------------------------------------------------",
        "5-Year Cumulative Revenue: ₹1,060+ Crores  |  Profitable from Year 2"
    ], is_navy=True, border_orange=True)

    add_card(s10, Inches(0.8), Inches(6.8), Inches(13.4), Inches(1.8), "FINANCIAL DISCIPLINE & SCALE", [
        "AutoEra AI combines rapid enterprise SaaS ARR growth with strong profitability. By automating repetitive telecalling and job-card creation, dealerships achieve >5x ROI within 60 days of deployment, resulting in near-zero churn (<3.5%) and strong customer lifetime value."
    ])

    add_bottom_banner(s10, "AUTOMOTIVE-SPECIFIC AI ·", "ACTION ORIENTED · BUILT TO SCALE", "Y1: ₹10 Cr ARR", "Y3: ₹80 Cr ARR", "Y5: ₹720 Cr ARR")

    # =========================================================================
    # SLIDE 11: VISION & THE ASK
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, 11, "THE FUTURE IS INTELLIGENT.", "THE FUTURE IS AUTOERA AI.", "Building the global operating system for automotive dealerships and mobility businesses.")

    # 5 Pillars Row
    pillars = [
        ("OUR MISSION", "Empower automotive businesses with AI to operate smarter and grow faster."),
        ("OUR VISION", "Become the #1 AI operating system for automotive dealerships globally."),
        ("OUR 5-YR GOAL", "₹720 Crores ARR across 1,200+ dealerships & OEM networks."),
        ("OUR PATH", "Narrow. Focus. Prove Value. Scale pan-India and internationally."),
        ("OUR PROMISE", "Action-oriented AI that delivers measurable ROI from Day 1.")
    ]
    for i, (p_t, p_d) in enumerate(pillars):
        px = Inches(0.8 + i * 2.7)
        add_card(s11, px, Inches(2.4), Inches(2.55), Inches(2.0), p_t, [p_d])

    # Investment Ask
    add_card(s11, Inches(0.8), Inches(4.7), Inches(7.5), Inches(3.9), "INVESTMENT ROUND & FUNDING ASK", [
        "TARGET ASK: ₹15 – 20 CRORES (GROWTH)  /  ₹3 – 5 CRORES (SEED TRANCHE)",
        "",
        "ALLOCATION OF FUNDS:",
        "• 45% AI R&D & Engineering: Multimodal Voice, OEM Connectors, ActionProposal Engine",
        "• 25% Go-To-Market & Sales: Direct enterprise sales across India's top 8 auto clusters",
        "• 20% Team & Domain Ops: Automotive specialists, customer success & implementations",
        "• 10% Security & Cloud Infra: SOC2 certification, DPDP compliance & working capital"
    ], is_navy=True, border_orange=True)

    # Founder & Contact
    add_card(s11, Inches(8.7), Inches(4.7), Inches(5.5), Inches(3.9), "FOUNDER & CONTACT DETAILS", [
        "SANTHOSH JECOB",
        "Founder & CEO | AutoEra AI",
        "",
        "Automotive AI technologist with deep domain expertise in dealership ERP workflows, voice telemetry, and high-scale SaaS architectures.",
        "",
        "📧 Email: santhosh@autoera.ai",
        "🌐 Website: www.autoera.ai",
        "📍 Headquarters: Chennai, Tamil Nadu, India",
        "",
        "Thank you for your time and partnership."
    ])

    add_bottom_banner(s11, "LET'S DRIVE THE FUTURE OF AUTOMOTIVE TOGETHER:", "THE OPPORTUNITY IS NOW.", "Santhosh Jecob", "Chennai, India", "santhosh@autoera.ai")

    # Save
    out_dir = "f:\\autoeraaisaas-main\\pitch-deck"
    out_file = os.path.join(out_dir, "AutoEra_AI_Master_Pitch_Deck_2026.pptx")
    prs.save(out_file)
    print(f"Successfully generated: {out_file}")

if __name__ == "__main__":
    create_master_clean_deck()
