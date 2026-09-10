import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # completely blank layout

    # Color Palette
    BG_DARK = RGBColor(7, 10, 19)          # Deep Carbon Navy (#070A13)
    CARD_BG = RGBColor(15, 22, 38)        # Card Navy (#0F1626)
    CARD_BORDER = RGBColor(38, 48, 68)    # Slate Border (#263044)
    ACCENT_ORANGE = RGBColor(249, 115, 22) # Vibrant AutoEra Orange (#F97316)
    ACCENT_LIGHT = RGBColor(251, 146, 60)  # Lighter Orange (#FB923C)
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8
    TEXT_DIM = RGBColor(100, 116, 139)    # #64748B
    SUCCESS_GREEN = RGBColor(34, 197, 94) # #22C55E
    BLUE_ACCENT = RGBColor(59, 130, 246)  # #3B82F6

    bg_img_path = "f:\\autoeraaisaas-main\\pitch-deck\\assets\\ai_car_tech_bg.jpg"
    if not os.path.exists(bg_img_path):
        bg_img_path = "f:\\autoeraaisaas-main\\pitch-deck\\assets\\ai_car_background.jpg"
    has_bg_img = os.path.exists(bg_img_path)

    def set_slide_background(slide, is_cover=False):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()

        if has_bg_img:
            if is_cover:
                pic = slide.shapes.add_picture(bg_img_path, Inches(4.5), Inches(0.5), width=Inches(8.8), height=Inches(4.95))
            else:
                pic = slide.shapes.add_picture(bg_img_path, Inches(7.5), Inches(0.5), width=Inches(5.8), height=Inches(3.26))
            
            veil = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
            veil.fill.solid()
            veil.fill.fore_color.rgb = BG_DARK
            veil.line.fill.background()
            fill = veil.fill
            try:
                alpha = 0.35 if is_cover else 0.72
                fill._xPr.find('{http://schemas.openxmlformats.org/drawingml/2006/main}solidFill')[0].set('alpha', str(int((1-alpha)*100000)))
            except Exception:
                pass
        return bg

    def add_header(slide, slide_num, title, subtitle):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.28))
        tf = cat_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"AUTOERA AI  |  SLIDE {slide_num:02d}"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = ACCENT_ORANGE
        p.font.name = "Segoe UI"

        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(11.7), Inches(0.55))
        tf = t_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.font.name = "Segoe UI"

        s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.25), Inches(11.7), Inches(0.35))
        tf = s_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = subtitle
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = "Segoe UI"

    def add_card(slide, left, top, width, height, title="", border_color=CARD_BORDER, bg_color=CARD_BG):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        
        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.18), top + Inches(0.14), width - Inches(0.36), Inches(0.32))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(12)
            p.font.bold = True
            p.font.color.rgb = ACCENT_LIGHT
            p.font.name = "Segoe UI"
        return card

    # =========================================================================
    # SLIDE 1: COVER
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, is_cover=True)

    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.1), Inches(3.8), Inches(0.38))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(22, 30, 49)
    badge.line.color.rgb = ACCENT_ORANGE
    badge.line.width = Pt(1)
    tf = badge.text_frame
    p = tf.paragraphs[0]
    p.text = "CONFIDENTIAL INVESTOR PRESENTATION  •  2026"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ORANGE
    p.alignment = PP_ALIGN.CENTER

    # Official AutoEra Logo
    logo_path = "f:\\autoeraaisaas-main\\pitch-deck\\assets\\autoera_logo_original.png"
    if os.path.exists(logo_path):
        logo_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(4.5), Inches(1.3))
        logo_card.fill.solid()
        logo_card.fill.fore_color.rgb = RGBColor(255, 255, 255)
        logo_card.line.color.rgb = ACCENT_ORANGE
        logo_card.line.width = Pt(1.5)
        s1.shapes.add_picture(logo_path, Inches(0.95), Inches(1.72), width=Inches(4.2), height=Inches(1.15))
        
        hero = s1.shapes.add_textbox(Inches(0.8), Inches(3.05), Inches(7.5), Inches(0.45))
        tf = hero.text_frame
        tf.word_wrap = True
        p2 = tf.paragraphs[0]
        p2.text = "AI-Native Dealership Operating System"
        p2.font.size = Pt(16.5)
        p2.font.bold = True
        p2.font.color.rgb = ACCENT_LIGHT
        p2.font.name = "Segoe UI"
    else:
        hero = s1.shapes.add_textbox(Inches(0.8), Inches(1.65), Inches(6.8), Inches(1.6))
        tf = hero.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "AUTOERA AI"
        p.font.size = Pt(54)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.font.name = "Segoe UI"
        p2 = tf.add_paragraph()
        p2.text = "AI-Native Dealership Operating System"
        p2.font.size = Pt(18)
        p2.font.bold = True
        p2.font.color.rgb = ACCENT_LIGHT
        p2.font.name = "Segoe UI"

    sub = s1.shapes.add_textbox(Inches(0.8), Inches(3.55), Inches(11.7), Inches(0.4))
    tf = sub.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Unifying Sales · Service · Parts · Finance · Insurance — with built-in AI Intelligence"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Master Vision Card
    v_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.05), Inches(11.7), Inches(0.8))
    v_card.fill.solid()
    v_card.fill.fore_color.rgb = RGBColor(15, 22, 38)
    v_card.line.color.rgb = ACCENT_ORANGE
    v_card.line.width = Pt(1)
    tf_v = v_card.text_frame
    tf_v.word_wrap = True
    p_v = tf_v.paragraphs[0]
    p_v.text = '"AutoEra AI will become the global operating system for the automotive industry — the single platform that every dealership, OEM, fleet operator, insurer, finance company, and vehicle owner depends on as the system of record for their automotive world."'
    p_v.font.size = Pt(10.5)
    p_v.font.italic = True
    p_v.font.color.rgb = RGBColor(241, 245, 249)

    pills = [
        ("Year 1 Target: ₹10 Cr ARR", "200 Dealers · 300 Workshops in South India"),
        ("Year 5 Goal: ₹720 Cr ARR", "12,000 Dealers · ₹340 Cr EBITDA (47%)"),
        ("100% Functional MVP", "40+ Models, Django 4.2+ + React 19 Deployed")
    ]
    for i, (head, desc) in enumerate(pills):
        px = Inches(0.8 + i * 3.9)
        add_card(s1, px, Inches(5.0), Inches(3.6), Inches(1.05), border_color=ACCENT_ORANGE)
        tb = s1.shapes.add_textbox(px + Inches(0.18), Inches(4.9), Inches(3.24), Inches(0.8))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = head
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = TEXT_MUTED

    f_card = s1.shapes.add_textbox(Inches(0.8), Inches(6.25), Inches(11.7), Inches(0.6))
    tf = f_card.text_frame
    p = tf.paragraphs[0]
    p.text = "Founder & CEO: Santhosh Jacob  |  AutoEra AI Solutions  |  Automotive Cloud Platform"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 2: PROBLEM
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, 2, "The Problem: The Fragmented Automotive Dealership Crisis", 
               "Dealerships globally and in India lose 18-25% top-line revenue due to disconnected legacy software and paper silos.")

    problems = [
        ("5–7 Disconnected Software Silos", 
         "• DMS, CRM, Excel, WhatsApp, Accounting & OEM Portals don't sync.\n• Double manual data entry creates 35% operational waste.\n• Zero single-pane-of-glass visibility across showroom & workshop.",
         "35-40% operational time wasted"),
        ("Parts Stockouts & Dead Capital",
         "• Dealerships lock ₹15L–₹50L monthly in spares, with 15–20% dead stock.\n• Unplanned stockouts delay vehicle delivery by 2–3 days.\n• No algorithmic reordering tied to scheduled bay appointments.",
         "₹4L - ₹8L locked dead inventory"),
        ("Workshop Bay Inefficiency & Downtime",
         "• Paper job cards; bay assignment tracked by verbal shouting.\n• Technicians idle awaiting parts clearance or customer WhatsApp approvals.\n• Vehicle Turnaround Time (TAT) is 40% slower than optimal.",
         "28% unbilled technician idle bay hours"),
        ("Customer Churn & Zero Follow-up",
         "• Post-warranty customer retention collapses below 25%.\n• No automated AI follow-ups for service intervals, insurance renewals, or PUC.\n• Zero lifetime customer nurturing resulting in massive customer leakage.",
         "> 65% post-warranty customer churn")
    ]

    for i, (title, desc, stat) in enumerate(problems):
        row = i // 2
        col = i % 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(1.75 + row * 2.5)
        w = Inches(5.7)
        h = Inches(2.3)
        add_card(s2, x, y, w, h, title=title)
        
        tb = s2.shapes.add_textbox(x + Inches(0.18), y + Inches(0.48), w - Inches(0.36), Inches(1.25))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = desc
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_MUTED

        stat_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.18), y + Inches(1.8), w - Inches(0.36), Inches(0.35))
        stat_box.fill.solid()
        stat_box.fill.fore_color.rgb = RGBColor(25, 30, 45)
        stat_box.line.color.rgb = RGBColor(239, 68, 68)
        tf_s = stat_box.text_frame
        p_s = tf_s.paragraphs[0]
        p_s.text = f"Impact: {stat}"
        p_s.font.size = Pt(10)
        p_s.font.bold = True
        p_s.font.color.rgb = RGBColor(248, 113, 113)
        p_s.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 3: SOLUTION & PRODUCT
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, 3, "Solution & Product: One Unified AI-Driven Automotive ERP",
               "12 AI-Native modules replacing 5–7 disconnected legacy tools with a high-throughput, automated operating system.")

    modules = [
        ("AI Predictive Service CRM", "Intelligent lead scoring, automated WhatsApp/SMS service reminders, warranty tracking, and dynamic churn prevention."),
        ("Multi-Bay Digital Job Cards (SOP-02)", "0–90 second vehicle intake via number plate scan. Real-time technician bay auto-dispatch, labor tracking, mobile approval."),
        ("B2B Spares & Parts Marketplace", "Automated reorder triggers, OEM part compatibility matrix, supplier PO generation, and 1.5–2.5% take-rate integration."),
        ("Automated GST & Invoicing", "Indian GST compliance, HSN/SAC automated tax calculation, split labor/parts billing, and UPI/Razorpay payment reconciliation."),
        ("7 Specialist AI Agents", "Built-in Copilot querying live ERP data with ActionProposal human-in-the-loop validation for critical inventory & claims actions."),
        ("EV Intelligence & Fleet Telematics", "Indian climate EV battery health degradation diagnostics, OBD-II connected failure warning, and fleet maintenance.")
    ]

    for i, (title, desc) in enumerate(modules):
        col = i % 3
        row = i // 3
        x = Inches(0.8 + col * 3.95)
        y = Inches(1.75 + row * 2.5)
        w = Inches(3.75)
        h = Inches(2.3)
        add_card(s3, x, y, w, h, title=title, border_color=CARD_BORDER)
        
        tb = s3.shapes.add_textbox(x + Inches(0.18), y + Inches(0.55), w - Inches(0.36), Inches(1.55))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = desc
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    banner = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.5), Inches(11.7), Inches(0.55))
    banner.fill.solid()
    banner.fill.fore_color.rgb = CARD_BG
    banner.line.color.rgb = SUCCESS_GREEN
    tf = banner.text_frame
    p = tf.paragraphs[0]
    p.text = "Production Ready: 40+ relational models, 44+ REST APIs, Django 4.2+ + React 19 deployed on cloud with pilot seed automation."
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = SUCCESS_GREEN
    p.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 4: MARKET OPPORTUNITY (GLOBAL & INDIAN FOCUS)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, 4, "Market Opportunity: Global Scale ($48.5B) + Indian Epicenter (₹1.08L Cr)",
               "Automotive aftermarket & retail software is experiencing an unprecedented shift from on-prem legacy DMS to cloud AI ERP.")

    market_cards = [
        ("GLOBAL TAM", "$48.5 Billion", "₹4,00,000+ Crore", "1,200,000+ Franchised & Multi-Brand Dealers, Repair Chains globally (CAGR 14.2%)", BLUE_ACCENT),
        ("INDIA TAM", "₹1,08,000 Crore", "$13.0 Billion", "3,00,000+ Dealerships, 2W/4W Workshops & Commercial Garages across India", ACCENT_ORANGE),
        ("GLOBAL SAM", "$9.2 Billion", "₹76,000 Crore", "Cloud SaaS & AI adoption in emerging digital corridors: SE Asia, GCC/MENA & LatAm", BLUE_ACCENT),
        ("INDIA SAM", "₹8,640 Crore", "$1.04 Billion", "24,000+ Tech-Ready Multi-Brand Dealers & Organized Auto Franchises", ACCENT_ORANGE)
    ]

    for i, (tag, val, subval, desc, color) in enumerate(market_cards):
        x = Inches(0.8 + i * 2.95)
        y = Inches(1.75)
        w = Inches(2.8)
        h = Inches(2.35)
        add_card(s4, x, y, w, h, border_color=color)

        tb = s4.shapes.add_textbox(x + Inches(0.15), y + Inches(0.15), w - Inches(0.3), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = tag
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = color
        
        p2 = tf.add_paragraph()
        p2.text = val
        p2.font.size = Pt(20)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE

        p3 = tf.add_paragraph()
        p3.text = subval
        p3.font.size = Pt(11)
        p3.font.bold = True
        p3.font.color.rgb = ACCENT_LIGHT

        p4 = tf.add_paragraph()
        p4.text = desc
        p4.font.size = Pt(10)
        p4.font.color.rgb = TEXT_MUTED

    som_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(11.7), Inches(2.7))
    som_box.fill.solid()
    som_box.fill.fore_color.rgb = CARD_BG
    som_box.line.color.rgb = SUCCESS_GREEN
    som_box.line.width = Pt(1.5)

    tb_som = s4.shapes.add_textbox(Inches(1.0), Inches(4.45), Inches(11.3), Inches(2.4))
    tf_som = tb_som.text_frame
    tf_som.word_wrap = True
    tf_som.margin_left = tf_som.margin_top = tf_som.margin_right = tf_som.margin_bottom = 0
    p = tf_som.paragraphs[0]
    p.text = "5-YEAR SOM TARGET: ₹720 CRORE ARR ($87 MILLION) — MASTER PLAN 2026 GOAL"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = SUCCESS_GREEN

    p2 = tf_som.add_paragraph()
    p2.text = "• 12,000 Dealerships + 25,000 Workshops + 2,000 Fleet Operators across India, Southeast Asia & GCC corridors.\n• Tamil Nadu Beachhead: Leveraging Chennai as the 'Detroit of Asia' (producing 70% EV 2W and 40% EV 4W in India) to validate and prove the operational model with 50 local dealers.\n• High-Margin Diversification: ₹500 Cr from SaaS Subscriptions + ₹120 Cr B2B Spare Parts Marketplace Take-Rate + ₹80 Cr Enterprise OEM Contracts + ₹20 Cr AI Usage Fees.\n• Exceptional Unit Profitability: Yielding ₹340 Crores in Net Operating EBITDA (47% margin) by Year 5."
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 5: UPGRADED BUSINESS MODEL & TIERS (STARTER 50K, PRO 100K, ENTERPRISE 250K)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, 5, "Master Plan Business Model: Premium Tiers (₹50K / ₹100K / ₹250K)",
               "Engineered for ₹720 Crore ARR by Year 5 with ₹340 Crore Operating EBITDA (47% margin).")

    plans = [
        ("Starter Workshop", "₹50,000 / mo", "Multi-Bay Workshops (1–5 bays)",
         "• ServicePulse 90-sec Job Card\n• Number Plate Scanner\n• Basic Parts Inventory\n• Tamil/English WhatsApp Updates\n• Automated GST Invoicing\n• 5 User Accounts · 2,500 AI Queries"),
        ("Pro Dealership ★", "₹1,00,000 / mo", "Authorized Dealerships (to 12 bays)",
         "• Full Sales CRM + Service Engine\n• AI Voice Follow-Up Agent\n• Predictive Parts Replenishment\n• Insurance Claim Assistant\n• 15 Users · 10,000 AI Queries\n• Sweet Spot for High-Velocity Retainer"),
        ("Enterprise Group", "₹2,50,000 / mo", "Dealer Groups & Chains (Multi-Branch)",
         "• All 12 AI-Native Modules\n• Multi-Branch Inventory Balancing\n• Fleet Telematics + EV Battery Health\n• Executive KPI Benchmarking\n• Dedicated CS Manager & Custom RAG\n• Unlimited Users & Enterprise SLAs")
    ]

    for i, (name, price, subhead, feats) in enumerate(plans):
        x = Inches(0.8 + i * 3.95)
        y = Inches(1.75)
        w = Inches(3.75)
        h = Inches(3.2)
        border = SUCCESS_GREEN if i == 2 else (ACCENT_ORANGE if i == 1 else CARD_BORDER)
        add_card(s5, x, y, w, h, border_color=border)

        tb = s5.shapes.add_textbox(x + Inches(0.18), y + Inches(0.18), w - Inches(0.36), Inches(2.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = name
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

        p2 = tf.add_paragraph()
        p2.text = price
        p2.font.size = Pt(18)
        p2.font.bold = True
        p2.font.color.rgb = ACCENT_LIGHT

        p3 = tf.add_paragraph()
        p3.text = subhead
        p3.font.size = Pt(10)
        p3.font.color.rgb = TEXT_DIM

        p4 = tf.add_paragraph()
        p4.text = feats
        p4.font.size = Pt(10.5)
        p4.font.color.rgb = TEXT_MUTED

    # Revenue Breakdown Banner (Master Plan Table 56)
    add_card(s5, Inches(0.8), Inches(5.15), Inches(11.7), Inches(1.9), title="Year 5 Revenue Breakdown (₹720 Crores Total ARR)")
    tb_b = s5.shapes.add_textbox(Inches(1.0), Inches(5.55), Inches(11.3), Inches(1.4))
    tf_b = tb_b.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
    p = tf_b.paragraphs[0]
    p.text = "• SaaS Subscriptions (69%): ₹500 Crores (from Starter ₹50K, Pro ₹100K, and Enterprise ₹250K/mo across 12,000 dealers)\n• Transaction Fees (17%): ₹120 Crores (1.5%–2.5% B2B Spare Parts Marketplace Take-Rate & Insurance origination)\n• Enterprise Contracts (11%): ₹80 Crores (OEM Network Licenses & Large Commercial Fleet Deployments)\n• AI Usage Fees (3%): ₹20 Crores (AI Vision damage scanning tokens & automated conversational voice API calls)\n• Total Expenses: ₹380 Crores  |  Net Operating EBITDA: ₹340 Crores (47% EBITDA Margin) ★"
    p.font.size = Pt(11.5)
    p.font.color.rgb = SUCCESS_GREEN

    # =========================================================================
    # SLIDE 6: TRACTION & VALIDATION
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, 6, "Traction & Validation: Fully Functional MVP Ready for Scale",
               "Honest, verified milestones: Built from the ground up to solve actual workshop workflow bottlenecks.")

    tracts = [
        ("Full-Stack Functional MVP", "VERIFIED IN CODEBASE",
         "• 40+ relational models in PostgreSQL covering Sales, Service, Parts, Billing, and RBAC.\n• React 19 + TypeScript frontend with live Gemini AI tool calling.\n• Seed pilot command (seed_pilot_dealership.py) allows instantaneous dealership staging."),
        ("Field Discovery & Interviews", "MARKET VALIDATION",
         "• Conducted in-depth interviews with 15+ multi-brand workshop owners in Tamil Nadu.\n• Verified top pain points: 30% lead leakage, parts reorder chaos, and GST billing delays.\n• 8 flagship workshops queued for live pilot onboarding."),
        ("Pilot Onboarding Pipeline", "READY FOR GO-LIVE",
         "• Phase 1 pilot rollout in Coimbatore & Chennai automotive corridors.\n• Real-time feedback loop configured for weekly feature enhancement.\n• Foundation for Year 1 milestone: scaling to 200 dealers & 300 workshops.")
    ]

    for i, (title, tag, desc) in enumerate(tracts):
        x = Inches(0.8 + i * 3.95)
        y = Inches(1.75)
        w = Inches(3.75)
        h = Inches(4.9)
        add_card(s6, x, y, w, h, border_color=CARD_BORDER)

        tb = s6.shapes.add_textbox(x + Inches(0.18), y + Inches(0.18), w - Inches(0.36), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = tag
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_ORANGE
        
        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 7: COMPETITIVE ADVANTAGE
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, 7, "Competitive Advantage: AI-Native vs. Legacy Monsters",
               "Why AutoEra AI wins: Built natively for multi-brand auto retail with AI agents querying live ERP data.")

    comps = [
        ("AutoEra AI (Us)", "Modern unified AI ERP built natively for auto retail & workshops. Live bay cards, predictive CRM, automated GST, transparent pricing.", SUCCESS_GREEN, "WINNER"),
        ("Legacy OEM DMS (Dealer Management)", "Rigid, desktop-bound, 15-year-old monoliths. Locked to single OEMs; cannot handle multi-brand servicing or agile WhatsApp automation.", RGBColor(239, 68, 68), "Monolithic & Rigid"),
        ("Generic ERPs (Zoho / Tally / SAP)", "Horizontal software lacking automotive context. No VIN decoder, no bay tracking, no parts compatibility matrix without costly custom dev.", RGBColor(239, 68, 68), "No Auto Workflows"),
        ("Point Solutions (Standalone Invoicing)", "Solve only billing or basic CRM. Creates isolated data silos; requires continuous manual double entry between mechanics and accounts.", RGBColor(239, 68, 68), "Fragmented Silos")
    ]

    for i, (name, desc, color, badge_text) in enumerate(comps):
        x = Inches(0.8 + i * 2.95)
        y = Inches(1.75)
        w = Inches(2.8)
        h = Inches(4.9)
        add_card(s7, x, y, w, h, border_color=color)

        tb = s7.shapes.add_textbox(x + Inches(0.18), y + Inches(0.18), w - Inches(0.36), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = badge_text
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = name
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(10.5)
        p3.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 8: GO-TO-MARKET (GTM) STRATEGY (MASTER PLAN 2026 TIMELINE)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, 8, "Go-To-Market Roadmap: Chennai to ₹720 Crore ARR (2026–2030)",
               "Structured expansion scaling from regional automotive clusters to 39,000+ connected nodes.")

    phases = [
        ("Year 1 (2026): Tamil Nadu Cluster", "200 Dealers · 300 Workshops",
         "• 50 flagship dealers in a 10km radius in Chennai & Coimbatore.\n• Deploy ServicePulse 90-sec Job Card + Tamil Voice Agent.\n• Reach ₹10 Crore ARR milestone with cash-flow positivity."),
        ("Year 2–3 (2027–28): Pan-India Scale", "2,000 Dealers · 4,000 Workshops",
         "• Scale across South India (TN, Karnataka, Andhra, Maharashtra).\n• Automated B2B spare parts replenishment with regional distributors.\n• ₹96 Crore ARR with ₹25 Cr operating EBITDA."),
        ("Year 4–5 (2029–30): Global Corridors", "12,000 Dealers · ₹720 Cr ARR ★",
         "• Pan-India + Southeast Asia & GCC market expansion.\n• 39,000+ total connected nodes (Dealers + Workshops + Fleets).\n• Generating ₹340 Crores in Net Operating EBITDA (47% margin).")
    ]

    for i, (title, subhead, desc) in enumerate(phases):
        x = Inches(0.8 + i * 3.95)
        y = Inches(1.75)
        w = Inches(3.75)
        h = Inches(4.9)
        add_card(s8, x, y, w, h, border_color=CARD_BORDER)

        tb = s8.shapes.add_textbox(x + Inches(0.18), y + Inches(0.18), w - Inches(0.36), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = subhead
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_LIGHT
        
        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 9: FINANCIAL PROJECTIONS (MASTER PLAN TABLE 55 & 56)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, 9, "Financial Projections: 5-Year Scaling to ₹720 Crore ARR",
               "Master Plan 2026: Achieving ₹340 Crore Operating EBITDA (47% margin) across 39,000+ automotive entities.")

    # 5-Year Forecast Table Card
    add_card(s9, Inches(0.8), Inches(1.75), Inches(7.2), Inches(4.9), title="5-Year Financial Forecast (Master Plan Table 55)")
    tb_tab = s9.shapes.add_textbox(Inches(1.0), Inches(2.25), Inches(6.8), Inches(4.2))
    tf_tab = tb_tab.text_frame
    tf_tab.word_wrap = True
    tf_tab.margin_left = tf_tab.margin_top = tf_tab.margin_right = tf_tab.margin_bottom = 0
    p = tf_tab.paragraphs[0]
    p.text = "Year 1 (2026): 200 Dealers · 300 Workshops · 20 Fleets\n• Monthly Run-Rate: ₹40L–₹80L | Annual ARR: ₹10.0 Crores\n\nYear 2 (2027): 800 Dealers · 1,500 Workshops · 100 Fleets\n• Monthly Run-Rate: ₹2.50 Cr | Annual ARR: ₹30.0 Crores\n\nYear 3 (2028): 2,000 Dealers · 4,000 Workshops · 300 Fleets\n• Monthly Run-Rate: ₹8.00 Cr | Annual ARR: ₹96.0 Crores | EBITDA: +₹25 Cr\n\nYear 4 (2029): 5,000 Dealers · 10,000 Workshops · 800 Fleets\n• Monthly Run-Rate: ₹25.0 Cr | Annual ARR: ₹300.0 Crores | EBITDA: +₹110 Cr\n\nYear 5 (2030): 12,000 Dealers · 25,000 Workshops · 2,000 Fleets ★\n• Monthly Run-Rate: ₹60.0 Cr | Total ARR: ₹720.0 Crores ($87M)\n• Operating Expenses: ₹380 Cr | Operating EBITDA: ₹340.0 Crores (47% Margin)"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Right Card: Revenue Breakdown by Stream
    add_card(s9, Inches(8.2), Inches(1.75), Inches(4.3), Inches(4.9), title="Year 5 Revenue Breakdown (Table 56)", border_color=ACCENT_ORANGE)
    tb_ask = s9.shapes.add_textbox(Inches(8.4), Inches(2.25), Inches(3.9), Inches(4.2))
    tf_ask = tb_ask.text_frame
    tf_ask.word_wrap = True
    tf_ask.margin_left = tf_ask.margin_top = tf_ask.margin_right = tf_ask.margin_bottom = 0
    p = tf_ask.paragraphs[0]
    p.text = "Year 5 Stream Breakdown:\n\n• SaaS Subscriptions (69%): ₹500 Cr\n  (Starter ₹50K, Pro ₹100K, Enterprise ₹250K/mo)\n\n• Transaction Fees (17%): ₹120 Cr\n  (1.5%–2.5% B2B Spares Marketplace & Insurance)\n\n• Enterprise Contracts (11%): ₹80 Cr\n  (OEM Network Licenses & Government Fleets)\n\n• AI Usage Fees (3%): ₹20 Cr\n  (Damage scanning tokens & Voice API calls)\n\nTOTAL ARR: ₹720 Crores ★\n\nUnicorn Valuation Math (Table 127):\n₹720 Cr ARR × 10x Multiple =\n₹7,200 Crores (~$870 Million Enterprise Value)"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 10: TEAM & VISION
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, 10, "Team & Long-Term Vision: Powering the Future of Auto Retail",
               "Domain-driven execution team committed to building a ₹720 Crore global automotive enterprise from Tamil Nadu.")

    add_card(s10, Inches(0.8), Inches(1.75), Inches(5.7), Inches(3.2), title="Founder & CEO")
    tb_tm = s10.shapes.add_textbox(Inches(1.0), Inches(2.25), Inches(5.3), Inches(2.5))
    tf_tm = tb_tm.text_frame
    tf_tm.word_wrap = True
    tf_tm.margin_left = tf_tm.margin_top = tf_tm.margin_right = tf_tm.margin_bottom = 0
    p = tf_tm.paragraphs[0]
    p.text = "Santhosh Jacob — Founder & CEO\n"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIGHT
    
    p2 = tf_tm.add_paragraph()
    p2.text = "• Architected and built the entire AutoEra AI platform end-to-end (Django 4.2+, React 19, PostgreSQL, Gemini Tool Calling).\n• Deep automotive domain roots in Tamil Nadu with direct access to dealership dealer principals.\n• Supported by seasoned automotive workshop advisors and SaaS scale mentors."
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_MUTED

    add_card(s10, Inches(6.8), Inches(1.75), Inches(5.7), Inches(3.2), title="Long-Term Vision: Connected Automotive Grid")
    tb_vs = s10.shapes.add_textbox(Inches(7.0), Inches(2.25), Inches(5.3), Inches(2.5))
    tf_vs = tb_vs.text_frame
    tf_vs.word_wrap = True
    tf_vs.margin_left = tf_vs.margin_top = tf_vs.margin_right = tf_vs.margin_bottom = 0
    p = tf_vs.paragraphs[0]
    p.text = "Scaling to ₹720 Crore ARR ($87 Million):\n\n• Connected Vehicle Telematics & OBD-II proactive failure warning.\n• High-Throughput Spare Parts Marketplace powering ₹20,000+ Cr in annual GMV.\n• Dedicated EV Fleet, Battery Health & Smart Diagnostics infrastructure."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    close = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.15), Inches(11.7), Inches(1.8))
    close.fill.solid()
    close.fill.fore_color.rgb = CARD_BG
    close.line.color.rgb = ACCENT_ORANGE
    close.line.width = Pt(1.5)
    
    tb_c = s10.shapes.add_textbox(Inches(1.0), Inches(5.3), Inches(11.3), Inches(1.5))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
    p = tf_c.paragraphs[0]
    p.text = "Thank You, Visionary Investors & Partners!"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.alignment = PP_ALIGN.CENTER
    
    p2 = tf_c.add_paragraph()
    p2.text = "Let's partner together to build the global automotive SaaS champion scaling to ₹720 Crores ($870M+ Valuation)."
    p2.font.size = Pt(12)
    p2.font.bold = True
    p2.font.color.rgb = ACCENT_LIGHT
    p2.alignment = PP_ALIGN.CENTER

    p3 = tf_c.add_paragraph()
    p3.text = "Website: autoera.in  |  Contact: santhosh@autoera.in  |  Live Platform Deployed & Demo Ready"
    p3.font.size = Pt(11)
    p3.font.color.rgb = TEXT_MUTED
    p3.alignment = PP_ALIGN.CENTER

    output_path = "f:\\autoeraaisaas-main\\pitch-deck\\AutoEra_AI_Investor_Pitch_Deck.pptx"
    prs.save(output_path)
    print(f"Updated presentation saved successfully to: {output_path}")

    # Also save copy to original path
    legacy_path = "f:\\autoeraaisaas-main\\pitch-deck\\AutoEra_AI_Pitch_Deck_TANSEED.pptx"
    prs.save(legacy_path)
    print(f"Also synced to: {legacy_path}")

if __name__ == "__main__":
    create_deck()
