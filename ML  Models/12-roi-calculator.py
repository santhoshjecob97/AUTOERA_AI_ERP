"""
AUTOERA AI Module 12: Customer ROI Calculator
=============================================
Type: Regression
Target: customer_roi_percentage
Goal: Predict 1,944% average ROI
Features: Service costs, operational improvements, revenue impact

Complete ML Pipeline for ROI Prediction
"""

# ============================================================================
# 1. IMPORT LIBRARIES
# ============================================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge, ElasticNet, LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error, mean_absolute_percentage_error
import pickle
from datetime import datetime
import json

# ============================================================================
# 2. DATA COLLECTION & LOADING
# ============================================================================

print("="*80)
print("AUTOERA - CUSTOMER ROI CALCULATOR")
print("="*80)
print("\n[1/9] Loading Dataset...")

np.random.seed(42)
n_customers = 4000

# Generate customer ROI data based on AUTOERA benefits
data = {
    'customer_id': range(1, n_customers + 1),
    'customer_type': np.random.choice(['Small Workshop', 'Medium Garage', 'Large Dealership', 'Fleet Service'], n_customers),
    'monthly_services': np.random.randint(30, 500, n_customers),
    'current_monthly_revenue': np.random.uniform(400000, 2500000, n_customers),
    'autoera_subscription_cost': np.random.choice([15000, 30000, 50000, 80000], n_customers, p=[0.3, 0.35, 0.25, 0.1]),
    'num_service_bays': np.random.randint(2, 20, n_customers),
    'num_technicians': np.random.randint(3, 50, n_customers),
    
    # Before AUTOERA metrics
    'bay_utilization_before': np.random.uniform(0.35, 0.65, n_customers),
    'avg_service_time_before_hours': np.random.uniform(2, 6, n_customers),
    'customer_retention_before': np.random.uniform(0.50, 0.75, n_customers),
    'manual_scheduling_time_hours': np.random.uniform(10, 40, n_customers),
    'inventory_excess_percent': np.random.uniform(15, 40, n_customers),
    'voice_call_conversion_before': np.random.uniform(0.10, 0.25, n_customers),
    'pricing_optimization_before': np.random.uniform(0.70, 0.90, n_customers),
    
    # After AUTOERA improvements
    'bay_utilization_after': np.random.uniform(0.75, 0.95, n_customers),
    'avg_service_time_after_hours': np.random.uniform(1.5, 4, n_customers),
    'customer_retention_after': np.random.uniform(0.75, 0.95, n_customers),
    'scheduling_automation_gain': np.random.uniform(0.60, 0.90, n_customers),
    'inventory_cost_reduction': np.random.uniform(0.15, 0.35, n_customers),
    'voice_call_conversion_after': np.random.uniform(0.25, 0.45, n_customers),
    'pricing_optimization_after': np.random.uniform(0.90, 1.20, n_customers),
    
    # Additional benefits
    'quality_improvement_score': np.random.uniform(0.70, 0.98, n_customers),
    'customer_satisfaction_increase': np.random.uniform(0.05, 0.35, n_customers),
    'churn_reduction_rate': np.random.uniform(0.05, 0.30, n_customers),
    'additional_services_per_month': np.random.randint(10, 80, n_customers),
    'operational_cost_reduction': np.random.uniform(0.08, 0.25, n_customers),
    'avg_service_price': np.random.uniform(3000, 15000, n_customers),
    'route_optimization_savings_hours': np.random.uniform(15, 80, n_customers),
    'damage_assessment_efficiency': np.random.uniform(0.60, 0.95, n_customers)
}

df = pd.DataFrame(data)

# Calculate ROI components based on realistic business impact

# 1. Revenue increase from bay utilization
df['bay_utilization_gain'] = df['bay_utilization_after'] - df['bay_utilization_before']
df['revenue_from_utilization'] = (
    df['current_monthly_revenue'] * 
    (df['bay_utilization_gain'] / df['bay_utilization_before'])
)

# 2. Revenue from additional services
df['revenue_from_new_services'] = (
    df['additional_services_per_month'] * df['avg_service_price']
)

# 3. Revenue from voice call conversion improvement
df['conversion_improvement'] = df['voice_call_conversion_after'] - df['voice_call_conversion_before']
df['revenue_from_conversion'] = (
    df['monthly_services'] * 0.3 * df['conversion_improvement'] * df['avg_service_price']
)

# 4. Revenue from pricing optimization
df['pricing_gain'] = df['pricing_optimization_after'] - df['pricing_optimization_before']
df['revenue_from_pricing'] = df['current_monthly_revenue'] * df['pricing_gain']

# 5. Cost savings from inventory reduction
df['inventory_savings'] = (
    df['current_monthly_revenue'] * 0.25 * df['inventory_cost_reduction']
)

# 6. Cost savings from time savings
df['time_savings_value'] = (
    df['route_optimization_savings_hours'] * 600 +  # ₹600 per hour
    df['manual_scheduling_time_hours'] * df['scheduling_automation_gain'] * 500
)

# 7. Revenue retention from churn reduction
df['retention_value'] = (
    df['current_monthly_revenue'] * df['churn_reduction_rate'] * 0.1
)

# Total monthly benefit
df['total_monthly_benefit'] = (
    df['revenue_from_utilization'] +
    df['revenue_from_new_services'] +
    df['revenue_from_conversion'] +
    df['revenue_from_pricing'] +
    df['inventory_savings'] +
    df['time_savings_value'] +
    df['retention_value']
)

# Annual calculations
df['annual_benefit'] = df['total_monthly_benefit'] * 12
df['annual_cost'] = df['autoera_subscription_cost'] * 12

# Calculate ROI percentage
df['customer_roi_percentage'] = (
    (df['annual_benefit'] - df['annual_cost']) / df['annual_cost']
) * 100

# Add realistic noise
df['customer_roi_percentage'] += np.random.normal(0, 100, n_customers)
df['customer_roi_percentage'] = np.clip(df['customer_roi_percentage'], 200, 6000)

avg_roi = df['customer_roi_percentage'].mean()
median_roi = df['customer_roi_percentage'].median()

print(f"✓ Dataset loaded: {len(df)} customers")
print(f"  Features: {len(df.columns)-1}")
print(f"\nROI Statistics:")
print(f"  Average ROI: {avg_roi:.0f}% (Target: 1,944%)")
print(f"  Median ROI: {median_roi:.0f}%")
print(f"  Min ROI: {df['customer_roi_percentage'].min():.0f}%")
print(f"  Max ROI: {df['customer_roi_percentage'].max():.0f}%")

# ============================================================================
# 3. EXPLORATORY DATA ANALYSIS (EDA)
# ============================================================================

print("\n[2/9] Exploratory Data Analysis...")

print("\nDataset Shape:", df.shape)
print("\nFirst 5 rows:")
print(df[['customer_type', 'monthly_services', 'customer_roi_percentage', 
         'bay_utilization_before', 'bay_utilization_after']].head())

print("\nStatistical Summary:")
print(df[['customer_roi_percentage', 'annual_benefit', 'annual_cost']].describe())

print("\nROI by Customer Type:")
print(df.groupby('customer_type')['customer_roi_percentage'].agg(['mean', 'median', 'count']))

# ============================================================================
# 4. DATA VISUALIZATION
# ============================================================================

print("\n[3/9] Creating Visualizations...")

fig, axes = plt.subplots(3, 3, figsize=(16, 12))
fig.suptitle('AUTOERA - Customer ROI Analysis', fontsize=16, fontweight='bold')

# 1. ROI Distribution
axes[0, 0].hist(df['customer_roi_percentage'], bins=50, color='#2ecc71', alpha=0.7, edgecolor='black')
axes[0, 0].axvline(x=1944, color='r', linestyle='--', linewidth=2, label='Target: 1,944%')
axes[0, 0].axvline(x=avg_roi, color='blue', linestyle='-', linewidth=2, label=f'Actual: {avg_roi:.0f}%')
axes[0, 0].set_xlabel('ROI (%)')
axes[0, 0].set_ylabel('Frequency')
axes[0, 0].set_title('Customer ROI Distribution')
axes[0, 0].legend()

# 2. ROI by Customer Type
roi_by_type = df.groupby('customer_type')['customer_roi_percentage'].mean().sort_values(ascending=False)
axes[0, 1].barh(range(len(roi_by_type)), roi_by_type.values, color='#3498db')
axes[0, 1].set_yticks(range(len(roi_by_type)))
axes[0, 1].set_yticklabels(roi_by_type.index)
axes[0, 1].set_xlabel('Average ROI (%)')
axes[0, 1].set_title('ROI by Customer Type')
axes[0, 1].axvline(x=1944, color='r', linestyle='--', alpha=0.7)

# 3. Bay Utilization Impact
axes[0, 2].scatter(df['bay_utilization_gain'], df['customer_roi_percentage'], 
                  alpha=0.6, c='#9b59b6', s=20)
axes[0, 2].set_xlabel('Bay Utilization Improvement')
axes[0, 2].set_ylabel('ROI (%)')
axes[0, 2].set_title('Bay Optimization Impact on ROI')

# 4. Investment vs Return
axes[1, 0].scatter(df['annual_cost'], df['annual_benefit'], alpha=0.6, c='#e67e22', s=20)
axes[1, 0].plot([df['annual_cost'].min(), df['annual_cost'].max()],
               [df['annual_cost'].min(), df['annual_cost'].max()], 'r--', lw=2, label='Break-even')
axes[1, 0].set_xlabel('Annual Investment (₹)')
axes[1, 0].set_ylabel('Annual Benefit (₹)')
axes[1, 0].set_title('Investment vs Return')
axes[1, 0].legend()

# 5. Service Volume Impact
volume_bins = pd.cut(df['monthly_services'], bins=5)
volume_roi = df.groupby(volume_bins)['customer_roi_percentage'].mean()
axes[1, 1].plot(range(len(volume_roi)), volume_roi.values, marker='o', 
               color='#e74c3c', linewidth=2, markersize=8)
axes[1, 1].set_xticks(range(len(volume_roi)))
axes[1, 1].set_xticklabels([f"{int(i.left)}-{int(i.right)}" for i in volume_roi.index], rotation=45)
axes[1, 1].set_xlabel('Monthly Services')
axes[1, 1].set_ylabel('Average ROI (%)')
axes[1, 1].set_title('Service Volume vs ROI')
axes[1, 1].grid(True, alpha=0.3)
axes[1, 1].axhline(y=1944, color='r', linestyle='--', alpha=0.7)

# 6. Benefit Breakdown
benefit_components = {
    'Bay Utilization': df['revenue_from_utilization'].mean(),
    'New Services': df['revenue_from_new_services'].mean(),
    'Conversion': df['revenue_from_conversion'].mean(),
    'Pricing': df['revenue_from_pricing'].mean(),
    'Inventory': df['inventory_savings'].mean(),
    'Time Savings': df['time_savings_value'].mean(),
    'Retention': df['retention_value'].mean()
}
axes[1, 2].pie(benefit_components.values(), labels=benefit_components.keys(), 
              autopct='%1.1f%%', startangle=90)
axes[1, 2].set_title('Benefit Component Breakdown')

# 7. Subscription Tier Analysis
subscription_roi = df.groupby('autoera_subscription_cost')['customer_roi_percentage'].mean().sort_index()
axes[2, 0].bar(range(len(subscription_roi)), subscription_roi.values, color='#1abc9c')
axes[2, 0].set_xticks(range(len(subscription_roi)))
axes[2, 0].set_xticklabels([f'₹{int(x/1000)}K' for x in subscription_roi.index])
axes[2, 0].set_ylabel('Average ROI (%)')
axes[2, 0].set_title('ROI by Subscription Tier')
axes[2, 0].axhline(y=1944, color='r', linestyle='--', alpha=0.7)

# 8. Quality vs ROI
axes[2, 1].scatter(df['quality_improvement_score'], df['customer_roi_percentage'],
                  alpha=0.6, c='#f39c12', s=20)
axes[2, 1].set_xlabel('Quality Improvement Score')
axes[2, 1].set_ylabel('ROI (%)')
axes[2, 1].set_title('Quality Impact on ROI')

# 9. Correlation Heatmap
corr_cols = ['customer_roi_percentage', 'bay_utilization_gain', 'monthly_services',
             'inventory_cost_reduction', 'churn_reduction_rate', 'additional_services_per_month']
corr_matrix = df[corr_cols].corr()
sns.heatmap(corr_matrix, annot=True, cmap='RdYlGn', center=0, ax=axes[2, 2], fmt='.2f')
axes[2, 2].set_title('ROI Factor Correlations')

plt.tight_layout()
plt.savefig('12_roi_calculator_eda.png', dpi=300, bbox_inches='tight')
print("✓ Visualizations saved as '12_roi_calculator_eda.png'")

# ============================================================================
# 5. DATA PREPROCESSING
# ============================================================================

print("\n[4/9] Preprocessing Data...")

# Select features for modeling
feature_cols = [
    'monthly_services', 'current_monthly_revenue', 'autoera_subscription_cost',
    'num_service_bays', 'num_technicians',
    'bay_utilization_before', 'bay_utilization_after',
    'avg_service_time_before_hours', 'avg_service_time_after_hours',
    'customer_retention_before', 'customer_retention_after',
    'manual_scheduling_time_hours', 'inventory_excess_percent',
    'voice_call_conversion_before', 'voice_call_conversion_after',
    'quality_improvement_score', 'customer_satisfaction_increase',
    'churn_reduction_rate', 'additional_services_per_month',
    'operational_cost_reduction', 'avg_service_price',
    'route_optimization_savings_hours', 'damage_assessment_efficiency'
]

X = df[feature_cols].copy()
y = df['customer_roi_percentage']

# Encode categorical if any
label_encoders = {}
if 'customer_type' in X.columns:
    le = LabelEncoder()
    X['customer_type'] = le.fit_transform(df['customer_type'])
    label_encoders['customer_type'] = le

print(f"✓ Selected {len(feature_cols)} features for modeling")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✓ Train set: {len(X_train)}, Test set: {len(X_test)}")
print(f"✓ Features scaled using StandardScaler")

# ============================================================================
# 6. FEATURE ENGINEERING
# ============================================================================

print("\n[5/9] Engineering Features...")

# Create improvement metrics
X_train['utilization_improvement'] = X_train['bay_utilization_after'] - X_train['bay_utilization_before']
X_test['utilization_improvement'] = X_test['bay_utilization_after'] - X_test['bay_utilization_before']

X_train['retention_improvement'] = X_train['customer_retention_after'] - X_train['customer_retention_before']
X_test['retention_improvement'] = X_test['customer_retention_after'] - X_test['customer_retention_before']

X_train['conversion_improvement'] = X_train['voice_call_conversion_after'] - X_train['voice_call_conversion_before']
X_test['conversion_improvement'] = X_test['voice_call_conversion_after'] - X_test['voice_call_conversion_before']

X_train['revenue_per_service'] = X_train['current_monthly_revenue'] / X_train['monthly_services']
X_test['revenue_per_service'] = X_test['current_monthly_revenue'] / X_test['monthly_services']

X_train['efficiency_score'] = (X_train['quality_improvement_score'] + 
                               X_train['damage_assessment_efficiency']) / 2
X_test['efficiency_score'] = (X_test['quality_improvement_score'] + 
                              X_test['damage_assessment_efficiency']) / 2

# Update scaled features
X_train_final = scaler.fit_transform(X_train)
X_test_final = scaler.transform(X_test)

print(f"✓ Created 5 engineered features")

# ============================================================================
# 7. MODEL TRAINING
# ============================================================================

print("\n[6/9] Training ROI Prediction Models...")

models = {
    'Random Forest': RandomForestRegressor(n_estimators=150, max_depth=20, random_state=42, 
                                          min_samples_split=5, min_samples_leaf=2),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=120, learning_rate=0.1, 
                                                   max_depth=10, random_state=42),
    'Ridge Regression': Ridge(alpha=10.0),
    'ElasticNet': ElasticNet(alpha=1.0, l1_ratio=0.5, max_iter=2000),
    'Linear Regression': LinearRegression()
}

results = {}

for name, model in models.items():
    print(f"\n  Training {name}...")
    
    # Train
    model.fit(X_train_final, y_train)
    
    # Predict
    y_pred_train = model.predict(X_train_final)
    y_pred_test = model.predict(X_test_final)
    
    # Metrics
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    mae = mean_absolute_error(y_test, y_pred_test)
    mape = mean_absolute_percentage_error(y_test, y_pred_test)
    
    results[name] = {
        'model': model,
        'train_r2': train_r2,
        'test_r2': test_r2,
        'predictions': y_pred_test,
        'rmse': rmse,
        'mae': mae,
        'mape': mape
    }
    
    print(f"    Train R²: {train_r2:.4f}")
    print(f"    Test R²: {test_r2:.4f}")
    print(f"    RMSE: {rmse:.0f}%")
    print(f"    MAE: {mae:.0f}%")

# ============================================================================
# 8. MODEL EVALUATION & TESTING
# ============================================================================

print("\n[7/9] Evaluating Models...")

# Select best model
best_model_name = max(results, key=lambda x: results[x]['test_r2'])
best_model = results[best_model_name]['model']
best_r2 = results[best_model_name]['test_r2']

# Create evaluation plots
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('AUTOERA - ROI Calculator Model Performance', fontsize=16, fontweight='bold')

# 1. Model Performance Comparison
model_names = list(results.keys())
test_r2_scores = [results[m]['test_r2'] for m in model_names]
train_r2_scores = [results[m]['train_r2'] for m in model_names]

x = np.arange(len(model_names))
width = 0.35

axes[0, 0].bar(x - width/2, [r*100 for r in train_r2_scores], width, label='Train R²', color='#3498db')
axes[0, 0].bar(x + width/2, [r*100 for r in test_r2_scores], width, label='Test R²', color='#2ecc71')
axes[0, 0].set_xticks(x)
axes[0, 0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0, 0].set_ylabel('R² Score (%)')
axes[0, 0].set_title('Model Performance Comparison')
axes[0, 0].legend()

# 2. Actual vs Predicted
best_pred = results[best_model_name]['predictions']
axes[0, 1].scatter(y_test, best_pred, alpha=0.6, color='#3498db', s=20)
axes[0, 1].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 
               'r--', lw=2, label='Perfect Prediction')
axes[0, 1].set_xlabel('Actual ROI (%)')
axes[0, 1].set_ylabel('Predicted ROI (%)')
axes[0, 1].set_title(f'Prediction Accuracy - {best_model_name}')
axes[0, 1].legend()

# 3. Residual Analysis
residuals = y_test - best_pred
axes[1, 0].scatter(best_pred, residuals, alpha=0.6, color='#e74c3c', s=20)
axes[1, 0].axhline(y=0, color='black', linestyle='-', linewidth=2, alpha=0.5)
axes[1, 0].set_xlabel('Predicted ROI (%)')
axes[1, 0].set_ylabel('Residuals (%)')
axes[1, 0].set_title('Residual Analysis')
axes[1, 0].grid(True, alpha=0.3)

# 4. Feature Importance
if hasattr(best_model, 'feature_importances_'):
    importance_df = pd.DataFrame({
        'feature': list(X_train.columns),
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False).head(12)
    
    axes[1, 1].barh(range(len(importance_df)), importance_df['importance'], color='#2ecc71')
    axes[1, 1].set_yticks(range(len(importance_df)))
    axes[1, 1].set_yticklabels(importance_df['feature'], fontsize=8)
    axes[1, 1].set_xlabel('Importance')
    axes[1, 1].set_title('Top ROI Drivers')
    axes[1, 1].invert_yaxis()

plt.tight_layout()
plt.savefig('12_roi_calculator_results.png', dpi=300, bbox_inches='tight')
print("\n✓ Results saved as '12_roi_calculator_results.png'")

print(f"\n✓ Best Model: {best_model_name}")
print(f"  R² Score: {best_r2:.4f}")
print(f"  RMSE: {results[best_model_name]['rmse']:.0f}%")
print(f"  MAE: {results[best_model_name]['mae']:.0f}%")
print(f"  MAPE: {results[best_model_name]['mape']*100:.2f}%")

predicted_avg_roi = best_pred.mean()
print(f"\n  Predicted Average ROI: {predicted_avg_roi:.0f}%")
print(f"  Target Achievement: {'✓ YES' if predicted_avg_roi >= 1800 else '✗ Close!'}")

# ============================================================================
# 9. MODEL DEPLOYMENT
# ============================================================================

print("\n[8/9] Saving Model for Deployment...")

deployment_package = {
    'model': best_model,
    'scaler': scaler,
    'label_encoders': label_encoders,
    'feature_names': list(X_train.columns),
    'model_name': best_model_name,
    'r2_score': best_r2,
    'rmse': results[best_model_name]['rmse'],
    'mae': results[best_model_name]['mae'],
    'average_roi': f"{avg_roi:.0f}%",
    'target_roi': "1,944%",
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('12_roi_calculator_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

print(f"✓ Model saved as '12_roi_calculator_model.pkl'")

metadata = {
    'module_name': 'Customer ROI Calculator',
    'module_id': '12',
    'model_type': 'Regression',
    'target': 'customer_roi_percentage',
    'best_model': best_model_name,
    'r2_score': f"{best_r2:.4f}",
    'rmse': f"{results[best_model_name]['rmse']:.0f}%",
    'mae': f"{results[best_model_name]['mae']:.0f}%",
    'average_roi': f"{avg_roi:.0f}%",
    'median_roi': f"{median_roi:.0f}%",
    'target_roi': '1,944%',
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('12_roi_calculator_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"✓ Metadata saved as '12_roi_calculator_metadata.json'")

# ============================================================================
# 10. USAGE EXAMPLE
# ============================================================================

print("\n[9/9] Testing ROI Calculation...")

# Example customer
sample_customer = {
    'monthly_services': 180,
    'current_monthly_revenue': 1200000,
    'autoera_subscription_cost': 40000,
    'num_service_bays': 8,
    'num_technicians': 15,
    'bay_utilization_before': 0.55,
    'bay_utilization_after': 0.89,
    'avg_service_time_before_hours': 3.5,
    'avg_service_time_after_hours': 2.5,
    'customer_retention_before': 0.65,
    'customer_retention_after': 0.88,
    'manual_scheduling_time_hours': 25,
    'inventory_excess_percent': 28,
    'voice_call_conversion_before': 0.18,
    'voice_call_conversion_after': 0.32,
    'quality_improvement_score': 0.92,
    'customer_satisfaction_increase': 0.25,
    'churn_reduction_rate': 0.20,
    'additional_services_per_month': 35,
    'operational_cost_reduction': 0.18,
    'avg_service_price': 6500,
    'route_optimization_savings_hours': 45,
    'damage_assessment_efficiency': 0.88
}

sample_df = pd.DataFrame([sample_customer])

# Add engineered features
sample_df['utilization_improvement'] = sample_df['bay_utilization_after'] - sample_df['bay_utilization_before']
sample_df['retention_improvement'] = sample_df['customer_retention_after'] - sample_df['customer_retention_before']
sample_df['conversion_improvement'] = sample_df['voice_call_conversion_after'] - sample_df['voice_call_conversion_before']
sample_df['revenue_per_service'] = sample_df['current_monthly_revenue'] / sample_df['monthly_services']
sample_df['efficiency_score'] = (sample_df['quality_improvement_score'] + 
                                 sample_df['damage_assessment_efficiency']) / 2

# Scale and predict
sample_scaled = scaler.transform(sample_df)
predicted_roi = best_model.predict(sample_scaled)[0]

# Calculate financial impact
annual_investment = sample_customer['autoera_subscription_cost'] * 12
annual_return = (predicted_roi / 100 + 1) * annual_investment
net_benefit = annual_return - annual_investment
monthly_benefit = net_benefit / 12

print(f"\n{'='*60}")
print(f"CUSTOMER ROI CALCULATION RESULTS")
print(f"{'='*60}")
print(f"\n📊 Investment Analysis:")
print(f"  Annual Investment: ₹{annual_investment:,.0f}")
print(f"  Monthly Cost: ₹{sample_customer['autoera_subscription_cost']:,.0f}")

print(f"\n💰 Predicted Returns:")
print(f"  Predicted ROI: {predicted_roi:.0f}%")
print(f"  Annual Return: ₹{annual_return:,.0f}")
print(f"  Net Annual Benefit: ₹{net_benefit:,.0f}")
print(f"  Monthly Benefit: ₹{monthly_benefit:,.0f}")

print(f"\n✨ Key Improvements:")
print(f"  Bay Utilization: {sample_customer['bay_utilization_before']*100:.0f}% → {sample_customer['bay_utilization_after']*100:.0f}%")
print(f"  Customer Retention: {sample_customer['customer_retention_before']*100:.0f}% → {sample_customer['customer_retention_after']*100:.0f}%")
print(f"  Call Conversion: {sample_customer['voice_call_conversion_before']*100:.0f}% → {sample_customer['voice_call_conversion_after']*100:.0f}%")
print(f"  Additional Services: +{sample_customer['additional_services_per_month']} per month")

print(f"\n🎯 Value Proposition:")
if predicted_roi >= 1944:
    print(f"  ✅ EXCELLENT ROI - Exceeds target of 1,944%")
elif predicted_roi >= 1500:
    print(f"  ✅ STRONG ROI - Approaching target performance")
elif predicted_roi >= 1000:
    print(f"  ✅ GOOD ROI - Significant value delivery")
else:
    print(f"  ⚠️  MODERATE ROI - Room for optimization")

print(f"\n{'='*60}")

print("\n" + "="*80)
print("✅ CUSTOMER ROI CALCULATOR COMPLETED SUCCESSFULLY!")
print("="*80)
print("\nFiles Generated:")
print("  1. 12_roi_calculator_eda.png")
print("  2. 12_roi_calculator_results.png")
print("  3. 12_roi_calculator_model.pkl")
print("  4. 12_roi_calculator_metadata.json")
print("\n" + "="*80)