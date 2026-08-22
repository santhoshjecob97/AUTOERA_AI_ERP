# Exports Directory

This directory contains the generated pitch deck presentations in various formats.

## Generated Files

When you run the build scripts, the following types of files will be created here:

### HTML Presentations
- `autoera-pitch-deck-investor-[timestamp].html` - Investor-focused version
- `autoera-pitch-deck-customer-[timestamp].html` - Customer-focused version  
- `autoera-pitch-deck-partner-[timestamp].html` - Partner-focused version
- `autoera-pitch-deck-general-[timestamp].html` - General comprehensive version

### PDF Exports
- `autoera-pitch-deck-[version]-[timestamp].pdf` - Print-ready PDF versions

### PowerPoint Files
- `autoera-pitch-deck-[version]-[timestamp].pptx` - Editable PowerPoint presentations

### Image Exports
- `slides/` - Individual slide images for social media and backup

### Reports
- `validation-report.json` - Quality assurance and validation results
- `build-log.txt` - Build process logs and statistics

## Usage

### Building Presentations
```bash
# Build specific version
npm run build:investor
npm run build:customer
npm run build:partner

# Build all versions
npm run build:all

# Validate quality
npm run validate
```

### Opening Presentations
- **HTML files**: Open directly in web browser
- **PDF files**: Use any PDF viewer
- **PowerPoint files**: Open in Microsoft PowerPoint or compatible software

## File Naming Convention

```
autoera-pitch-deck-[version]-[timestamp].[extension]

Where:
- version: investor|customer|partner|general
- timestamp: Unix timestamp for uniqueness
- extension: html|pdf|pptx|png
```

## Backup and Sharing

- HTML files are self-contained and can be shared via email or web
- PDF files are ideal for printing and document sharing
- PowerPoint files allow for further customization and editing
- Keep multiple versions for different presentation contexts

## Cleanup

To remove all generated files:
```bash
npm run clean
```

This will preserve the directory structure while removing all generated presentations.