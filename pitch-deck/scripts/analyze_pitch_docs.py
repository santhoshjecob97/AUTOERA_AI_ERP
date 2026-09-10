import os, sys, docx, pypdf

base_dir = r"f:\autoeraaisaas-main\AUTOERA PITCH DOCUMENTS"
out_dir = r"f:\autoeraaisaas-main\pitch-deck\content"
os.makedirs(out_dir, exist_ok=True)

report_file = os.path.join(out_dir, "extracted_pitch_docs_summary.txt")

with open(report_file, "w", encoding="utf-8") as out:
    out.write("====================================================================\n")
    out.write("AUTOERA PITCH DOCUMENTS DEEP EXTRACTION & ANALYSIS\n")
    out.write("====================================================================\n\n")

    # 1. DOCX files
    docx_files = [
        "AutoEra_AI_37Section_Report.docx",
        "AutoEra_AI_Board_Audit_Response.docx",
        "AutoEra_AI_Product_Architecture_2026.docx",
        "AutoEra_AI_SOP_Manual_2026.docx",
        "AutoEra_AI_Master_Plan_2026.docx",
    ]

    for fname in docx_files:
        fpath = os.path.join(base_dir, fname)
        if not os.path.exists(fpath):
            continue
        out.write(f"\n############################################################\n")
        out.write(f"FILE: {fname}\n")
        out.write(f"############################################################\n")
        doc = docx.Document(fpath)
        
        # Extract tables
        out.write(f"--- TABLES IN {fname} ({len(doc.tables)} tables) ---\n")
        for t_idx, table in enumerate(doc.tables[:10]):
            out.write(f"\n[Table {t_idx+1}]\n")
            for row in table.rows[:15]:
                row_text = [cell.text.strip().replace('\n', ' ') for cell in row.cells]
                out.write(" | ".join(row_text) + "\n")

        # Extract headings and key text
        out.write(f"\n--- HEADINGS & TEXT IN {fname} ---\n")
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        for p in doc.paragraphs:
            txt = p.text.strip()
            if not txt:
                continue
            style_name = p.style.name if p.style else ""
            if "Heading" in style_name or "Title" in style_name or len(txt) < 80 and txt.isupper():
                out.write(f"\n>>> [{style_name}] {txt}\n")
            elif any(k in txt.lower() for k in ["tam", "sam", "som", "pricing", "competitor", "market", "revenue", "crore", "vision", "mission", "architecture", "cagr"]):
                out.write(f"  • {txt}\n")

    # 2. PDF files
    for fname in os.listdir(base_dir):
        if fname.endswith(".pdf") and any(k in fname for k in ["MARKET", "Industry"]):
            fpath = os.path.join(base_dir, fname)
            out.write(f"\n############################################################\n")
            out.write(f"FILE: {fname}\n")
            out.write(f"############################################################\n")
            try:
                reader = pypdf.PdfReader(fpath)
                out.write(f"Total Pages: {len(reader.pages)}\n\n")
                for page_num in range(min(len(reader.pages), 30)):
                    text = reader.pages[page_num].extract_text()
                    out.write(f"--- Page {page_num+1} ---\n")
                    # write lines matching keywords or top of page
                    lines = text.split('\n')
                    out.write("\n".join(lines[:15]) + "\n")
                    key_lines = [l for l in lines[15:] if any(k in l.lower() for k in ["tam", "sam", "som", "pricing", "competitor", "market", "revenue", "crore", "cagr", "orbit", "dealer", "zoho", "tally", "faqs", "dealership"])]
                    if key_lines:
                        out.write("Key Excerpts:\n" + "\n".join(key_lines[:20]) + "\n")
            except Exception as e:
                out.write(f"Error reading PDF {fname}: {e}\n")

    # 3. MHT file
    for fname in os.listdir(base_dir):
        if fname.endswith(".mht"):
            fpath = os.path.join(base_dir, fname)
            out.write(f"\n############################################################\n")
            out.write(f"FILE: {fname}\n")
            out.write(f"############################################################\n")
            try:
                with open(fpath, "r", encoding="utf-8", errors="ignore") as fp:
                    content = fp.read()
                out.write(f"Content length: {len(content)} characters\n")
                lines = [l.strip() for l in content.splitlines() if l.strip() and not l.startswith("=") and not l.startswith("Content-")]
                out.write("\n".join(lines[:60]) + "\n")
            except Exception as e:
                out.write(f"Error reading MHT: {e}\n")

print(f"Extraction complete! Saved to: {report_file}")
