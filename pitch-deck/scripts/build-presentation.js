#!/usr/bin/env node

/**
 * Autoera AI Solutions - Pitch Deck Builder
 * 
 * This script generates customized pitch decks based on audience type,
 * duration, and content preferences.
 */

const fs = require('fs');
const path = require('path');

class PitchDeckBuilder {
    constructor() {
        this.dataPath = path.join(__dirname, '../content/data-sources.json');
        this.configPath = path.join(__dirname, '../versions/version-config.json');
        this.templatePath = path.join(__dirname, '../templates/master-template.html');
        this.outputPath = path.join(__dirname, '../exports/');
        
        this.data = this.loadData();
        this.config = this.loadConfig();
        this.template = this.loadTemplate();
        
        // Ensure output directory exists
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }
    }
    
    loadData() {
        try {
            const data = fs.readFileSync(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading data sources:', error);
            process.exit(1);
        }
    }
    
    loadConfig() {
        try {
            const config = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(config);
        } catch (error) {
            console.error('Error loading version config:', error);
            process.exit(1);
        }
    }
    
    loadTemplate() {
        try {
            return fs.readFileSync(this.templatePath, 'utf8');
        } catch (error) {
            console.error('Error loading template:', error);
            process.exit(1);
        }
    }
    
    generateSlide(slideType, customizations = {}) {
        const slideConfig = this.config.slide_templates[slideType];
        if (!slideConfig) {
            throw new Error(`Unknown slide type: ${slideType}`);
        }
        
        switch (slideType) {
            case 'title':
                return this.generateTitleSlide(customizations);
            case 'problem':
                return this.generateProblemSlide(customizations);
            case 'solution_overview':
                return this.generateSolutionOverviewSlide(customizations);
            case 'ai_engines_showcase':
                return this.generateAIEnginesSlide(customizations);
            case 'market_opportunity':
                return this.generateMarketSlide(customizations);
            case 'case_studies':
                return this.generateCaseStudiesSlide(customizations);
            case 'roi_demonstration':
                return this.generateROISlide(customizations);
            case 'financial_projections':
                return this.generateFinancialSlide(customizations);
            case 'competitive_advantages':
                return this.generateCompetitiveSlide(customizations);
            case 'team':
                return this.generateTeamSlide(customizations);
            case 'funding_ask':
                return this.generateFundingSlide(customizations);
            case 'next_steps':
                return this.generateNextStepsSlide(customizations);
            default:
                return this.generateGenericSlide(slideType, customizations);
        }
    }
    
    generateTitleSlide(customizations) {
        const company = this.data.company;
        return `
        <div class="slide">
            <div class="slide-header">
                <div class="logo">🚀 ${company.name}</div>
                <div class="slide-number">01</div>
            </div>
            <div class="slide-content">
                <h1 class="slide-title">${company.tagline}</h1>
                <p class="slide-subtitle">The World's Most Comprehensive Automotive AI Platform</p>
                <div class="cta-section">
                    <h2 class="cta-title">One Platform. ${this.data.solution_metrics.ai_engines} AI Engines. ${this.data.solution_metrics.total_ai_models} Specialized Models.</h2>
                    <p class="cta-subtitle">Infinite Possibilities for Your Dealership</p>
                </div>
            </div>
            <div class="slide-footer">
                <div class="footer-contact">
                    <span>📧 ${company.email}</span>
                    <span>📱 ${company.phone}</span>
                    <span>🌐 ${company.website}</span>
                </div>
                <div>© ${company.founded} ${company.name}</div>
            </div>
        </div>`;
    }
    
    generateProblemSlide(customizations) {
        const metrics = this.data.problem_metrics;
        return `
        <div class="slide">
            <div class="slide-header">
                <div class="logo">🚀 ${this.data.company.name}</div>
                <div class="slide-number">02</div>
            </div>
            <div class="slide-content">
                <h2 class="slide-title">Automotive Dealerships Are Drowning in Manual Operations</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${metrics.manual_operations_percentage}%</div>
                        <div class="metric-label">Manual Operations</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${metrics.daily_hours_wasted} hrs</div>
                        <div class="metric-label">Daily Waste</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">₹${metrics.monthly_losses_lakhs}L</div>
                        <div class="metric-label">Monthly Losses</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${metrics.customer_dissatisfaction_percentage}%</div>
                        <div class="metric-label">Customer Dissatisfaction</div>
                    </div>
                </div>
                <div class="two-column">
                    <div class="content-block">
                        <h3>Key Pain Points</h3>
                        <ul>
                            <li>Sales teams spend ${metrics.sales_time_on_data_entry}% time on data entry vs selling</li>
                            <li>Service scheduling conflicts cause ${metrics.service_complaints_from_scheduling}% customer complaints</li>
                            <li>Finance approvals take ${metrics.finance_approval_days} days vs competitors' instant decisions</li>
                            <li>Insurance claims processing takes ${metrics.insurance_processing_days} days vs industry ${metrics.industry_standard_insurance_days}-day standard</li>
                        </ul>
                    </div>
                    <div class="chart-container">
                        <div class="chart-placeholder">
                            📊 Efficiency Comparison Chart<br>
                            Manual vs AI-Powered Operations
                        </div>
                    </div>
                </div>
            </div>
            <div class="slide-footer">
                <div class="footer-contact">
                    <span>📧 ${this.data.company.email}</span>
                    <span>📱 ${this.data.company.phone}</span>
                    <span>🌐 ${this.data.company.website}</span>
                </div>
                <div>© ${this.data.company.founded} ${this.data.company.name}</div>
            </div>
        </div>`;
    }
    
    generateAIEnginesSlide(customizations) {
        const engines = this.data.ai_engines;
        const leftEngines = engines.slice(0, 3);
        const rightEngines = engines.slice(3, 6);
        
        const generateEngineBlock = (engine) => `
            <div class="content-block">
                <h3>${engine.icon} ${engine.name}</h3>
                <ul>
                    ${engine.capabilities.slice(0, 3).map(cap => `<li>${cap}</li>`).join('')}
                </ul>
            </div>`;
        
        return `
        <div class="slide">
            <div class="slide-header">
                <div class="logo">🚀 ${this.data.company.name}</div>
                <div class="slide-number">03</div>
            </div>
            <div class="slide-content">
                <h2 class="slide-title">Our Solution: Complete AI Ecosystem</h2>
                <div class="two-column">
                    <div>
                        ${leftEngines.map(generateEngineBlock).join('')}
                    </div>
                    <div>
                        ${rightEngines.map(generateEngineBlock).join('')}
                    </div>
                </div>
            </div>
            <div class="slide-footer">
                <div class="footer-contact">
                    <span>📧 ${this.data.company.email}</span>
                    <span>📱 ${this.data.company.phone}</span>
                    <span>🌐 ${this.data.company.website}</span>
                </div>
                <div>© ${this.data.company.founded} ${this.data.company.name}</div>
            </div>
        </div>`;
    }
    
    generateROISlide(customizations) {
        const metrics = this.data.solution_metrics;
        return `
        <div class="slide">
            <div class="slide-header">
                <div class="logo">🚀 ${this.data.company.name}</div>
                <div class="slide-number">04</div>
            </div>
            <div class="slide-content">
                <h2 class="slide-title">Proven Results: ${metrics.proven_roi_percentage}% ROI</h2>
                <div class="chart-container">
                    <div class="chart-placeholder">
                        📈 ROI Breakdown Chart<br>
                        Cost Savings vs Revenue Increase
                    </div>
                </div>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${metrics.lead_conversion_improvement}%</div>
                        <div class="metric-label">Lead Conversion Improvement</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${metrics.service_completion_improvement}%</div>
                        <div class="metric-label">Faster Service Completion</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${metrics.loan_approval_rate_increase}%</div>
                        <div class="metric-label">Loan Approval Rate Increase</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${metrics.fraud_detection_accuracy}%</div>
                        <div class="metric-label">Fraud Detection Accuracy</div>
                    </div>
                </div>
            </div>
            <div class="slide-footer">
                <div class="footer-contact">
                    <span>📧 ${this.data.company.email}</span>
                    <span>📱 ${this.data.company.phone}</span>
                    <span>🌐 ${this.data.company.website}</span>
                </div>
                <div>© ${this.data.company.founded} ${this.data.company.name}</div>
            </div>
        </div>`;
    }
    
    generateCaseStudiesSlide(customizations) {
        const caseStudy = this.data.case_studies[0]; // Use first case study
        return `
        <div class="slide">
            <div class="slide-header">
                <div class="logo">🚀 ${this.data.company.name}</div>
                <div class="slide-number">05</div>
            </div>
            <div class="slide-content">
                <h2 class="slide-title">Customer Success: ${caseStudy.title}</h2>
                <div class="two-column">
                    <div class="content-block">
                        <h3>🎯 Challenge</h3>
                        <p>${caseStudy.challenge}</p>
                        
                        <h3>💡 Solution</h3>
                        <p>${caseStudy.solution}</p>
                    </div>
                    <div class="content-block">
                        <h3>📈 Results</h3>
                        <ul>
                            ${caseStudy.results.map(result => `<li>${result}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="slide-footer">
                <div class="footer-contact">
                    <span>📧 ${this.data.company.email}</span>
                    <span>📱 ${this.data.company.phone}</span>
                    <span>🌐 ${this.data.company.website}</span>
                </div>
                <div>© ${this.data.company.founded} ${this.data.company.name}</div>
            </div>
        </div>`;
    }
    
    generateNextStepsSlide(customizations) {
        return `
        <div class="slide">
            <div class="slide-header">
                <div class="logo">🚀 ${this.data.company.name}</div>
                <div class="slide-number">15</div>
            </div>
            <div class="slide-content">
                <div class="cta-section">
                    <h2 class="cta-title">Ready to Transform Your Dealership?</h2>
                    <p class="cta-subtitle">Join the AI Revolution in Automotive Operations</p>
                    <button class="cta-button">Schedule Your Demo Today</button>
                </div>
                <div class="three-column">
                    <div class="content-block">
                        <h3>📞 Contact Us</h3>
                        <ul>
                            <li>Email: ${this.data.company.email}</li>
                            <li>Phone: ${this.data.company.phone}</li>
                            <li>Website: ${this.data.company.website}</li>
                        </ul>
                    </div>
                    <div class="content-block">
                        <h3>🎯 Next Steps</h3>
                        <ul>
                            <li>30-minute product demo</li>
                            <li>${this.data.contact_info.trial_duration} free trial</li>
                            <li>Custom ROI analysis</li>
                        </ul>
                    </div>
                    <div class="content-block">
                        <h3>🎁 Special Offer</h3>
                        <ul>
                            ${this.data.special_offers.slice(0, 3).map(offer => `<li>${offer}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="slide-footer">
                <div class="footer-contact">
                    <span>📧 ${this.data.company.email}</span>
                    <span>📱 ${this.data.company.phone}</span>
                    <span>🌐 ${this.data.company.website}</span>
                </div>
                <div>© ${this.data.company.founded} ${this.data.company.name}</div>
            </div>
        </div>`;
    }
    
    generateGenericSlide(slideType, customizations) {
        return `
        <div class="slide">
            <div class="slide-header">
                <div class="logo">🚀 ${this.data.company.name}</div>
                <div class="slide-number">XX</div>
            </div>
            <div class="slide-content">
                <h2 class="slide-title">${slideType.replace('_', ' ').toUpperCase()}</h2>
                <div class="content-block">
                    <p>Content for ${slideType} slide will be generated here.</p>
                </div>
            </div>
            <div class="slide-footer">
                <div class="footer-contact">
                    <span>📧 ${this.data.company.email}</span>
                    <span>📱 ${this.data.company.phone}</span>
                    <span>🌐 ${this.data.company.website}</span>
                </div>
                <div>© ${this.data.company.founded} ${this.data.company.name}</div>
            </div>
        </div>`;
    }
    
    buildPresentation(versionType = 'general', customizations = {}) {
        const versionConfig = this.config.version_configurations[versionType];
        if (!versionConfig) {
            throw new Error(`Unknown version type: ${versionType}`);
        }
        
        console.log(`Building ${versionConfig.name}...`);
        console.log(`Target audience: ${versionConfig.target_audience}`);
        console.log(`Duration: ${versionConfig.duration_minutes} minutes`);
        
        let presentation = this.template;
        let slides = [];
        
        // Generate slides based on version configuration
        versionConfig.slides.forEach((slideType, index) => {
            try {
                const slide = this.generateSlide(slideType, customizations);
                slides.push(slide);
                console.log(`✓ Generated ${slideType} slide`);
            } catch (error) {
                console.warn(`⚠ Could not generate ${slideType} slide: ${error.message}`);
                // Generate placeholder slide
                slides.push(this.generateGenericSlide(slideType, customizations));
            }
        });
        
        // Replace template content with generated slides
        const slidesHTML = slides.join('\\n\\n');
        presentation = presentation.replace(/<body>.*<\/body>/s, `<body>${slidesHTML}</body>`);
        
        // Save presentation
        const filename = `autoera-pitch-deck-${versionType}-${Date.now()}.html`;
        const filepath = path.join(this.outputPath, filename);
        
        fs.writeFileSync(filepath, presentation);
        console.log(`✅ Presentation saved: ${filepath}`);
        
        return filepath;
    }
    
    buildAllVersions() {
        const versions = Object.keys(this.config.version_configurations);
        const results = [];
        
        console.log('Building all presentation versions...');
        
        versions.forEach(version => {
            try {
                const filepath = this.buildPresentation(version);
                results.push({ version, filepath, success: true });
            } catch (error) {
                console.error(`❌ Failed to build ${version} version:`, error.message);
                results.push({ version, error: error.message, success: false });
            }
        });
        
        return results;
    }
    
    validateData() {
        const requiredFields = [
            'company', 'problem_metrics', 'solution_metrics', 
            'ai_engines', 'market_data', 'pricing_tiers'
        ];
        
        const missing = requiredFields.filter(field => !this.data[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required data fields: ${missing.join(', ')}`);
        }
        
        console.log('✅ Data validation passed');
        return true;
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    
    const builder = new PitchDeckBuilder();
    
    switch (command) {
        case 'build':
            const version = args[1] || 'general';
            try {
                builder.validateData();
                builder.buildPresentation(version);
            } catch (error) {
                console.error('❌ Build failed:', error.message);
                process.exit(1);
            }
            break;
            
        case 'build-all':
            try {
                builder.validateData();
                const results = builder.buildAllVersions();
                console.log('\\n📊 Build Summary:');
                results.forEach(result => {
                    if (result.success) {
                        console.log(`✅ ${result.version}: ${result.filepath}`);
                    } else {
                        console.log(`❌ ${result.version}: ${result.error}`);
                    }
                });
            } catch (error) {
                console.error('❌ Build all failed:', error.message);
                process.exit(1);
            }
            break;
            
        case 'validate':
            try {
                builder.validateData();
                console.log('✅ All data is valid');
            } catch (error) {
                console.error('❌ Validation failed:', error.message);
                process.exit(1);
            }
            break;
            
        case 'help':
        default:
            console.log(`
Autoera AI Pitch Deck Builder

Usage:
  node build-presentation.js <command> [options]

Commands:
  build [version]    Build specific version (investor|customer|partner|general)
  build-all         Build all versions
  validate          Validate data sources
  help              Show this help message

Examples:
  node build-presentation.js build investor
  node build-presentation.js build-all
  node build-presentation.js validate
            `);
            break;
    }
}

module.exports = PitchDeckBuilder;