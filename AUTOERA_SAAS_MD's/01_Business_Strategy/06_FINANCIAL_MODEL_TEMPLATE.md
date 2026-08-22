# AUTOERA AI SaaS - Financial Model Template

## 📊 **Overview**

This document provides the framework for building a detailed financial model in Excel. Use this as a guide to create your own model with actual data and assumptions.

---

## 🎯 **Model Structure**

### **Recommended Tabs/Sheets**

1. **Assumptions** - All key inputs and drivers
2. **Revenue Model** - Customer acquisition and revenue projections
3. **Cost Model** - Operating expenses and COGS
4. **P&L Statement** - Income statement (monthly/annual)
5. **Cash Flow** - Cash flow statement
6. **Balance Sheet** - Assets, liabilities, equity
7. **Unit Economics** - CAC, LTV, payback calculations
8. **Headcount** - Team growth and compensation
9. **Fundraising** - Funding rounds and dilution
10. **Scenarios** - Best case, base case, worst case

---

## 📋 **1. Assumptions Tab**

### **Revenue Assumptions**

```
Customer Acquisition:
├─ Year 1: 50 customers (4-5/month average)
├─ Year 2: 500 customers (10x growth)
├─ Year 3: 2,000 customers (4x growth)
├─ Year 4: 4,500 customers (2.25x growth)
└─ Year 5: 5,000 customers (1.1x growth)

Customer Mix (% of total):
├─ Dealerships: 70% (Year 1) → 50% (Year 5)
├─ Banks/NBFCs: 20% (Year 1) → 25% (Year 5)
├─ Insurance: 10% (Year 1) → 20% (Year 5)
└─ Fleet/Service: 0% (Year 1) → 5% (Year 5)

Average Contract Value (ACV):
├─ Dealerships: ₹6L (Y1) → ₹10L (Y5)
├─ Banks/NBFCs: ₹25L (Y1) → ₹40L (Y5)
├─ Insurance: ₹50L (Y1) → ₹80L (Y5)
└─ Blended ACV: ₹10L (Y1) → ₹56L (Y5)

Churn Rate (annual):
├─ Year 1: 10%
├─ Year 2: 8%
├─ Year 3: 6%
├─ Year 4: 5%
└─ Year 5: 5%

Upsell/Expansion:
├─ Net Revenue Retention: 110-120%
├─ % of customers that expand: 30-40%
├─ Average expansion: 20-30% of ACV
```

### **Cost Assumptions**

```
Cost of Goods Sold (COGS):
├─ Cloud infrastructure: 5-8% of revenue
├─ Third-party APIs (GPT-4, data): 2-3% of revenue
├─ Customer support: 2-3% of revenue
└─ Total COGS: 10-15% of revenue

Operating Expenses:
├─ Sales & Marketing: 30-40% of revenue (Year 1-2), 20-25% (Year 3-5)
├─ Research & Development: 25-35% of revenue
├─ General & Administrative: 15-20% of revenue
└─ Total OpEx: 70-95% of revenue (Year 1), 40-60% (Year 5)

Customer Acquisition Cost (CAC):
├─ Year 1: ₹60K per customer
├─ Year 2: ₹55K per customer
├─ Year 3: ₹50K per customer
├─ Year 4: ₹45K per customer
└─ Year 5: ₹40K per customer
```

### **Team Assumptions**

```
Headcount Growth:
├─ Year 1: 10 people (start) → 33 (end)
├─ Year 2: 33 → 60
├─ Year 3: 60 → 85
├─ Year 4: 85 → 105
└─ Year 5: 105 → 115

Department Split (Year 5):
├─ Engineering: 35 people (30%)
├─ Sales: 25 people (22%)
├─ Customer Success: 15 people (13%)
├─ Marketing: 10 people (9%)
├─ Product: 10 people (9%)
├─ Operations: 10 people (9%)
└─ Leadership: 10 people (9%)

Average Compensation:
├─ Engineering: ₹12-18 lakhs/year
├─ Sales: ₹10-15 lakhs/year + commission
├─ Customer Success: ₹8-12 lakhs/year
├─ Marketing: ₹10-15 lakhs/year
├─ Product: ₹15-20 lakhs/year
├─ Operations: ₹8-12 lakhs/year
└─ Leadership: ₹25-40 lakhs/year
```

---

## 💰 **2. Revenue Model Tab**

### **Monthly Revenue Calculation**

```
Formula Structure:

New Customers (Month M) = 
    IF(M <= 12, Year1_Monthly_Target, 
    IF(M <= 24, Year2_Monthly_Target, ...))

Churned Customers (Month M) = 
    Total_Active_Customers(M-1) × Monthly_Churn_Rate

Active Customers (Month M) = 
    Active_Customers(M-1) + New_Customers(M) - Churned_Customers(M)

New MRR (Month M) = 
    New_Customers(M) × Average_ACV / 12

Churned MRR (Month M) = 
    Churned_Customers(M) × Average_ACV / 12

Expansion MRR (Month M) = 
    Active_Customers(M) × Expansion_Rate × Average_ACV / 12

Total MRR (Month M) = 
    MRR(M-1) + New_MRR(M) - Churned_MRR(M) + Expansion_MRR(M)

Monthly Revenue (Month M) = 
    Total_MRR(M) + Transaction_Fees(M) + Professional_Services(M)
```

### **Annual Revenue Summary**

```
Year 1:
├─ New Customers: 50
├─ Churned Customers: 5 (10% churn)
├─ Ending Customers: 45
├─ Average ACV: ₹10 lakhs
├─ Subscription Revenue: ₹10 crores
├─ Transaction Fees: ₹1.5 crores
├─ Professional Services: ₹0.5 crores
└─ Total Revenue: ₹12 crores

Year 2:
├─ New Customers: 500
├─ Churned Customers: 44 (8% churn)
├─ Ending Customers: 501
├─ Average ACV: ₹15 lakhs
├─ Subscription Revenue: ₹70 crores
├─ Transaction Fees: ₹12 crores
├─ Professional Services: ₹3 crores
└─ Total Revenue: ₹85 crores

[Continue for Years 3-5]
```

---

## 💸 **3. Cost Model Tab**

### **COGS Calculation**

```
Cloud Infrastructure:
├─ Base cost: ₹50K/month (Year 1)
├─ Variable cost: ₹500 per customer per month
└─ Total: Base + (Customers × Variable)

Third-Party APIs:
├─ GPT-4 API: ₹20K/month + ₹200 per customer
├─ Data providers: ₹10K/month + ₹100 per customer
└─ Total: Fixed + (Customers × Variable)

Customer Support:
├─ Support staff: 1 per 50 customers
├─ Average salary: ₹6 lakhs/year
└─ Total: (Customers / 50) × ₹6L

Total COGS = Infrastructure + APIs + Support
Gross Margin = (Revenue - COGS) / Revenue
```

### **Operating Expenses**

```
Sales & Marketing:
├─ Sales team salaries: Headcount × Avg_Salary
├─ Sales commissions: 10-15% of new ARR
├─ Marketing spend: ₹2-5 lakhs/month
├─ Events and conferences: ₹5-10 lakhs/year
├─ Tools and software: ₹1-2 lakhs/month
└─ Total S&M: Sum of above

Research & Development:
├─ Engineering salaries: Headcount × Avg_Salary
├─ Product salaries: Headcount × Avg_Salary
├─ Tools and infrastructure: ₹2-3 lakhs/month
└─ Total R&D: Sum of above

General & Administrative:
├─ Leadership salaries: Headcount × Avg_Salary
├─ Operations salaries: Headcount × Avg_Salary
├─ Office rent: ₹2-5 lakhs/month
├─ Legal and compliance: ₹5-10 lakhs/year
├─ Insurance: ₹2-5 lakhs/year
├─ Miscellaneous: 5% of other OpEx
└─ Total G&A: Sum of above

Total OpEx = S&M + R&D + G&A
```

---

## 📊 **4. P&L Statement Tab**

### **Monthly P&L Structure**

```
Revenue:
├─ Subscription Revenue
├─ Transaction Fees
├─ Professional Services
└─ Total Revenue

Cost of Goods Sold:
├─ Cloud Infrastructure
├─ Third-Party APIs
├─ Customer Support
└─ Total COGS

Gross Profit = Revenue - COGS
Gross Margin % = Gross Profit / Revenue

Operating Expenses:
├─ Sales & Marketing
├─ Research & Development
├─ General & Administrative
└─ Total OpEx

EBITDA = Gross Profit - OpEx
EBITDA Margin % = EBITDA / Revenue

Depreciation & Amortization (if applicable)

EBIT = EBITDA - D&A

Interest Expense (if applicable)

EBT = EBIT - Interest

Taxes (assume 25-30% when profitable)

Net Income = EBT - Taxes
Net Margin % = Net Income / Revenue
```

---

## 💵 **5. Cash Flow Tab**

### **Cash Flow Statement**

```
Operating Activities:
├─ Net Income
├─ Add: Depreciation & Amortization
├─ Changes in Working Capital:
│   ├─ Accounts Receivable (increase = cash out)
│   ├─ Accounts Payable (increase = cash in)
│   └─ Deferred Revenue (increase = cash in)
└─ Cash from Operations

Investing Activities:
├─ CapEx (equipment, software licenses)
├─ Acquisitions (if any)
└─ Cash from Investing

Financing Activities:
├─ Equity Fundraising (Pre-seed, Series A, B)
├─ Debt Financing (if any)
├─ Debt Repayment
└─ Cash from Financing

Net Change in Cash = Operations + Investing + Financing
Ending Cash = Beginning Cash + Net Change

Runway (months) = Ending Cash / Monthly Burn Rate
```

---

## 🎯 **6. Unit Economics Tab**

### **Key Metrics Calculation**

```
Customer Acquisition Cost (CAC):
CAC = Total S&M Spend / New Customers Acquired

Customer Lifetime Value (LTV):
LTV = (Average ACV × Gross Margin %) / Churn Rate
Example: (₹10L × 90%) / 10% = ₹90L

LTV/CAC Ratio:
LTV/CAC = LTV / CAC
Target: >3 (good), >5 (great), >10 (exceptional)

CAC Payback Period (months):
Payback = CAC / (Monthly Revenue per Customer × Gross Margin %)
Example: ₹60K / (₹8.3K × 90%) = 8 months

Monthly Recurring Revenue (MRR):
MRR = Active Customers × Average Monthly Subscription

Annual Recurring Revenue (ARR):
ARR = MRR × 12

Net Revenue Retention (NRR):
NRR = (Starting ARR + Expansion - Churn) / Starting ARR
Target: >100% (indicates growth from existing customers)

Gross Revenue Retention (GRR):
GRR = (Starting ARR - Churn) / Starting ARR
Target: >90%

Rule of 40:
Rule of 40 = Revenue Growth % + EBITDA Margin %
Target: >40% (healthy SaaS business)
```

---

## 👥 **7. Headcount Tab**

### **Team Growth Model**

```
Department Headcount by Year:

Engineering:
├─ Year 1: 5 → 12
├─ Year 2: 12 → 20
├─ Year 3: 20 → 28
├─ Year 4: 28 → 33
└─ Year 5: 33 → 35

Sales:
├─ Year 1: 2 → 5
├─ Year 2: 5 → 12
├─ Year 3: 12 → 18
├─ Year 4: 18 → 23
└─ Year 5: 23 → 25

[Continue for all departments]

Total Compensation by Department:
Headcount × Average Salary + Benefits (15-20%)

Hiring Timeline:
├─ Q1: [Roles to hire]
├─ Q2: [Roles to hire]
├─ Q3: [Roles to hire]
└─ Q4: [Roles to hire]
```

---

## 💰 **8. Fundraising Tab**

### **Funding Rounds & Dilution**

```
Pre-Seed Round:
├─ Amount Raised: ₹2 crores
├─ Pre-Money Valuation: ₹12 crores
├─ Post-Money Valuation: ₹14 crores
├─ Equity Sold: 14.3%
├─ Founder Ownership After: 85.7%

Series A:
├─ Amount Raised: ₹20 crores
├─ Pre-Money Valuation: ₹80 crores
├─ Post-Money Valuation: ₹100 crores
├─ Equity Sold: 20%
├─ Founder Ownership After: 68.6%

Series B:
├─ Amount Raised: ₹75 crores
├─ Pre-Money Valuation: ₹325 crores
├─ Post-Money Valuation: ₹400 crores
├─ Equity Sold: 18.75%
├─ Founder Ownership After: 55.7%

ESOP Pool:
├─ Reserve: 15-20% of fully diluted cap table
├─ Allocated: 5-10% (to employees)
├─ Unallocated: 10-15% (for future hires)
```

---

## 📈 **9. Scenarios Tab**

### **Three Scenario Modeling**

```
Base Case (Most Likely):
├─ Customer acquisition: As per assumptions
├─ Churn: 10% → 5%
├─ ACV growth: 10-15% annually
├─ Gross margin: 85-90%
└─ Year 5 ARR: ₹2,800 crores

Best Case (Optimistic):
├─ Customer acquisition: +30% vs base
├─ Churn: 8% → 3%
├─ ACV growth: 20-25% annually
├─ Gross margin: 90-92%
└─ Year 5 ARR: ₹4,000+ crores

Worst Case (Conservative):
├─ Customer acquisition: -30% vs base
├─ Churn: 15% → 8%
├─ ACV growth: 5-8% annually
├─ Gross margin: 80-85%
└─ Year 5 ARR: ₹1,500 crores

Sensitivity Analysis:
├─ What if churn increases by 5%?
├─ What if CAC increases by 50%?
├─ What if ACV growth slows to 5%?
└─ Impact on profitability and runway
```

---

## 📊 **Key Metrics Dashboard**

### **Monthly Tracking**

```
Growth Metrics:
├─ New Customers
├─ Total Active Customers
├─ MRR and ARR
├─ MRR Growth Rate (%)
├─ Customer Growth Rate (%)

Financial Metrics:
├─ Total Revenue
├─ Gross Profit and Margin %
├─ EBITDA and Margin %
├─ Net Income and Margin %
├─ Cash Balance and Runway

Unit Economics:
├─ CAC
├─ LTV
├─ LTV/CAC Ratio
├─ CAC Payback (months)
├─ Gross Revenue Retention %
├─ Net Revenue Retention %

Efficiency Metrics:
├─ Revenue per Employee
├─ Magic Number (New ARR / S&M Spend)
├─ Rule of 40
├─ Burn Multiple (Cash Burned / Net New ARR)
```

---

## ✅ **Model Validation Checklist**

- [ ] All formulas link correctly (no hardcoded numbers except assumptions)
- [ ] Monthly totals match annual totals
- [ ] Cash flow ties to P&L and balance sheet
- [ ] Scenarios use same formula structure (only assumptions change)
- [ ] Unit economics are consistent with revenue and cost models
- [ ] Headcount costs match P&L expenses
- [ ] Fundraising dilution calculations are correct
- [ ] Model is flexible (easy to update assumptions)
- [ ] Charts and visualizations update automatically
- [ ] Model is auditable (clear structure and documentation)

---

## 🚀 **Next Steps**

1. **Download Excel template** (create based on this structure)
2. **Input your actual assumptions** (customer data, costs, team)
3. **Validate formulas** (check all calculations)
4. **Create scenarios** (best, base, worst case)
5. **Build visualizations** (charts for pitch deck)
6. **Share with advisors** (get feedback on assumptions)
7. **Update monthly** (track actuals vs projections)

---

**This financial model will be your roadmap to ₹2,800 crores! 📊**
