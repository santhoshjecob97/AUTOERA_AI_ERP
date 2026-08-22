/**
 * Autoera AI Solutions - Pitch Deck Validation Tests
 * 
 * This file contains validation tests to ensure pitch deck quality,
 * consistency, and compliance with requirements.
 */

const fs = require('fs');
const path = require('path');

class PitchDeckValidator {
    constructor() {
        this.dataPath = path.join(__dirname, '../content/data-sources.json');
        this.configPath = path.join(__dirname, '../versions/version-config.json');
        this.brandPath = path.join(__dirname, '../brand-guidelines/');
        
        this.data = this.loadJSON(this.dataPath);
        this.config = this.loadJSON(this.configPath);
        
        this.errors = [];
        this.warnings = [];
    }
    
    loadJSON(filepath) {
        try {
            const content = fs.readFileSync(filepath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            this.errors.push(`Failed to load ${filepath}: ${error.message}`);
            return {};
        }
    }
    
    // Property 1: Content completeness for target audiences
    validateContentCompleteness() {
        console.log('🔍 Validating content completeness...');
        
        const requiredSections = [
            'company', 'problem_metrics', 'solution_metrics', 
            'ai_engines', 'market_data', 'pricing_tiers',
            'case_studies', 'competitive_advantages'
        ];
        
        requiredSections.forEach(section => {
            if (!this.data[section]) {
                this.errors.push(`Missing required section: ${section}`);
            } else if (Array.isArray(this.data[section]) && this.data[section].length === 0) {
                this.errors.push(`Empty required section: ${section}`);
            }
        });
        
        // Validate AI engines completeness
        if (this.data.ai_engines) {
            if (this.data.ai_engines.length !== 6) {
                this.errors.push(`Expected 6 AI engines, found ${this.data.ai_engines.length}`);
            }
            
            this.data.ai_engines.forEach((engine, index) => {
                if (!engine.name || !engine.capabilities || !engine.icon) {
                    this.errors.push(`AI engine ${index + 1} missing required fields`);
                }
                
                if (engine.capabilities && engine.capabilities.length < 3) {
                    this.warnings.push(`AI engine ${engine.name} has fewer than 3 capabilities`);
                }
            });
        }
        
        // Validate case studies
        if (this.data.case_studies) {
            if (this.data.case_studies.length < 3) {
                this.errors.push(`Expected at least 3 case studies, found ${this.data.case_studies.length}`);
            }
            
            this.data.case_studies.forEach((caseStudy, index) => {
                const required = ['title', 'challenge', 'solution', 'results'];
                required.forEach(field => {
                    if (!caseStudy[field]) {
                        this.errors.push(`Case study ${index + 1} missing ${field}`);
                    }
                });
                
                if (caseStudy.results && caseStudy.results.length === 0) {
                    this.errors.push(`Case study ${index + 1} has no results`);
                }
            });
        }
        
        // Validate ROI metrics
        if (this.data.solution_metrics) {
            const roiValue = this.data.solution_metrics.proven_roi_percentage;
            if (!roiValue || roiValue !== 1944) {
                this.errors.push(`Expected proven ROI of 1944%, found ${roiValue}%`);
            }
        }
        
        // Validate pricing tiers
        if (this.data.pricing_tiers) {
            const expectedRange = { min: 20000, max: 150000 };
            this.data.pricing_tiers.forEach((tier, index) => {
                if (!tier.price_monthly) {
                    this.errors.push(`Pricing tier ${index + 1} missing monthly price`);
                } else {
                    const price = tier.price_monthly;
                    if (price < expectedRange.min || price > expectedRange.max) {
                        this.warnings.push(`Pricing tier ${tier.name} (₹${price}) outside expected range ₹${expectedRange.min}-₹${expectedRange.max}`);
                    }
                }
            });
        }
        
        console.log('✅ Content completeness validation complete');
    }
    
    // Property 2: Visual consistency and professional standards
    validateVisualConsistency() {
        console.log('🎨 Validating visual consistency...');
        
        // Check brand guidelines files exist
        const brandFiles = [
            'brand-identity.md',
            'color-palette.css',
            'typography.css'
        ];
        
        brandFiles.forEach(file => {
            const filepath = path.join(this.brandPath, file);
            if (!fs.existsSync(filepath)) {
                this.errors.push(`Missing brand guideline file: ${file}`);
            }
        });
        
        // Validate color palette consistency
        try {
            const colorCSS = fs.readFileSync(path.join(this.brandPath, 'color-palette.css'), 'utf8');
            
            const requiredColors = [
                '--autoera-blue: #1E3A8A',
                '--innovation-orange: #F97316',
                '--professional-gray: #374151',
                '--light-gray: #F3F4F6'
            ];
            
            requiredColors.forEach(color => {
                if (!colorCSS.includes(color)) {
                    this.errors.push(`Missing or incorrect brand color: ${color}`);
                }
            });
            
        } catch (error) {
            this.warnings.push(`Could not validate color palette: ${error.message}`);
        }
        
        // Validate typography consistency
        try {
            const typographyCSS = fs.readFileSync(path.join(this.brandPath, 'typography.css'), 'utf8');
            
            const requiredFonts = ['Inter', 'Roboto Mono'];
            requiredFonts.forEach(font => {
                if (!typographyCSS.includes(font)) {
                    this.errors.push(`Missing brand font: ${font}`);
                }
            });
            
        } catch (error) {
            this.warnings.push(`Could not validate typography: ${error.message}`);
        }
        
        console.log('✅ Visual consistency validation complete');
    }
    
    // Property 3: Audience-specific customization capability
    validateAudienceCustomization() {
        console.log('👥 Validating audience customization...');
        
        const requiredVersions = ['investor', 'customer', 'partner', 'general'];
        
        requiredVersions.forEach(version => {
            if (!this.config.version_configurations[version]) {
                this.errors.push(`Missing version configuration: ${version}`);
            } else {
                const versionConfig = this.config.version_configurations[version];
                
                // Validate required fields
                const requiredFields = ['name', 'description', 'target_audience', 'slides', 'emphasis'];
                requiredFields.forEach(field => {
                    if (!versionConfig[field]) {
                        this.errors.push(`Version ${version} missing ${field}`);
                    }
                });
                
                // Validate slide count
                if (versionConfig.slides && versionConfig.slides.length === 0) {
                    this.errors.push(`Version ${version} has no slides defined`);
                }
                
                // Validate duration
                if (!versionConfig.duration_minutes || versionConfig.duration_minutes <= 0) {
                    this.errors.push(`Version ${version} has invalid duration`);
                }
            }
        });
        
        // Validate slide templates
        if (this.config.slide_templates) {
            const requiredTemplates = [
                'title', 'problem', 'solution_overview', 'market_opportunity',
                'case_studies', 'roi_demonstration', 'next_steps'
            ];
            
            requiredTemplates.forEach(template => {
                if (!this.config.slide_templates[template]) {
                    this.errors.push(`Missing slide template: ${template}`);
                }
            });
        }
        
        console.log('✅ Audience customization validation complete');
    }
    
    // Property 4: Technical content accessibility
    validateTechnicalAccessibility() {
        console.log('🔧 Validating technical content accessibility...');
        
        // Check that technical content is balanced
        if (this.data.technology_stack) {
            const techStack = this.data.technology_stack;
            const requiredComponents = ['backend', 'frontend', 'ai_ml', 'infrastructure'];
            
            requiredComponents.forEach(component => {
                if (!techStack[component]) {
                    this.errors.push(`Missing technology stack component: ${component}`);
                } else {
                    // Check that descriptions are not overly technical
                    const description = techStack[component];
                    if (description.length > 100) {
                        this.warnings.push(`Technology ${component} description may be too detailed for general audience`);
                    }
                }
            });
        }
        
        // Validate AI model count
        if (this.data.solution_metrics) {
            const modelCount = this.data.solution_metrics.total_ai_models;
            if (!modelCount || modelCount < 65) {
                this.errors.push(`Expected 65+ AI models, found ${modelCount}`);
            }
        }
        
        console.log('✅ Technical accessibility validation complete');
    }
    
    // Property 5: Actionable next steps provision
    validateActionableNextSteps() {
        console.log('📋 Validating actionable next steps...');
        
        // Validate contact information completeness
        if (this.data.company) {
            const requiredContact = ['email', 'phone', 'website'];
            requiredContact.forEach(field => {
                if (!this.data.company[field]) {
                    this.errors.push(`Missing contact information: ${field}`);
                }
            });
            
            // Validate email format
            if (this.data.company.email && !this.data.company.email.includes('@')) {
                this.errors.push('Invalid email format');
            }
            
            // Validate phone format
            if (this.data.company.phone && !this.data.company.phone.startsWith('+91')) {
                this.warnings.push('Phone number should include country code');
            }
        }
        
        // Validate special offers
        if (this.data.special_offers) {
            if (this.data.special_offers.length === 0) {
                this.warnings.push('No special offers defined for next steps');
            }
        }
        
        // Validate trial information
        if (this.data.contact_info) {
            if (!this.data.contact_info.trial_duration) {
                this.warnings.push('No trial duration specified');
            }
            
            if (!this.data.contact_info.response_time) {
                this.warnings.push('No response time specified');
            }
        }
        
        console.log('✅ Actionable next steps validation complete');
    }
    
    // Unit tests for specific components
    validateDataAccuracy() {
        console.log('📊 Validating data accuracy...');
        
        // Validate financial projections
        if (this.data.financial_projections) {
            ['conservative', 'target'].forEach(scenario => {
                if (this.data.financial_projections[scenario]) {
                    const projection = this.data.financial_projections[scenario];
                    
                    // Check year-over-year growth makes sense
                    if (projection.year_1 && projection.year_2 && projection.year_3) {
                        if (projection.year_2.revenue_crores <= projection.year_1.revenue_crores) {
                            this.warnings.push(`${scenario} scenario shows no growth from year 1 to 2`);
                        }
                        
                        if (projection.year_3.revenue_crores <= projection.year_2.revenue_crores) {
                            this.warnings.push(`${scenario} scenario shows no growth from year 2 to 3`);
                        }
                    }
                }
            });
        }
        
        // Validate market data consistency
        if (this.data.market_data) {
            const marketData = this.data.market_data;
            
            if (marketData.global_automotive_ai_market) {
                const global = marketData.global_automotive_ai_market;
                if (global.projected_size_billion <= global.current_size_billion) {
                    this.errors.push('Global market projection shows no growth');
                }
            }
        }
        
        console.log('✅ Data accuracy validation complete');
    }
    
    validateLinkIntegrity() {
        console.log('🔗 Validating link integrity...');
        
        // Check that all referenced files exist
        const referencedFiles = [
            '../brand-guidelines/color-palette.css',
            '../brand-guidelines/typography.css',
            '../content/data-sources.json',
            '../versions/version-config.json'
        ];
        
        referencedFiles.forEach(file => {
            const filepath = path.join(__dirname, file);
            if (!fs.existsSync(filepath)) {
                this.errors.push(`Referenced file does not exist: ${file}`);
            }
        });
        
        console.log('✅ Link integrity validation complete');
    }
    
    runAllValidations() {
        console.log('🚀 Starting Autoera AI Pitch Deck Validation...');
        console.log('================================================');
        
        this.validateContentCompleteness();
        this.validateVisualConsistency();
        this.validateAudienceCustomization();
        this.validateTechnicalAccessibility();
        this.validateActionableNextSteps();
        this.validateDataAccuracy();
        this.validateLinkIntegrity();
        
        console.log('\\n📊 Validation Summary:');
        console.log('======================');
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('✅ All validations passed! Pitch deck is ready.');
            return true;
        }
        
        if (this.errors.length > 0) {
            console.log(`\\n❌ ${this.errors.length} Error(s):`);
            this.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log(`\\n⚠️  ${this.warnings.length} Warning(s):`);
            this.warnings.forEach((warning, index) => {
                console.log(`   ${index + 1}. ${warning}`);
            });
        }
        
        return this.errors.length === 0;
    }
    
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total_validations: 7,
                errors: this.errors.length,
                warnings: this.warnings.length,
                passed: this.errors.length === 0
            },
            details: {
                errors: this.errors,
                warnings: this.warnings
            }
        };
        
        const reportPath = path.join(__dirname, '../exports/validation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`\\n📄 Validation report saved: ${reportPath}`);
        return report;
    }
}

// CLI Interface
if (require.main === module) {
    const validator = new PitchDeckValidator();
    const success = validator.runAllValidations();
    validator.generateReport();
    
    process.exit(success ? 0 : 1);
}

module.exports = PitchDeckValidator;