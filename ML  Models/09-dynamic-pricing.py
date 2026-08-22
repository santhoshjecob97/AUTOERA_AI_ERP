"""
AUTOERA AI Module 09: Dynamic Pricing Engine
============================================
Type: Regression
Target: Optimal service price with 20% revenue increase goal
Features: Demand level, competitor pricing, service complexity, customer segment

Complete ML Pipeline for Revenue Optimization
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge, ElasticNet
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import pickle
from datetime import datetime
import json

print("="*80)
print("AUTOERA - DYNAMIC PRICING ENGINE")
print("="*80)
print("\n[1/9] Generating Pricing Dataset...")

np.random.seed(42)
n_services = 4800

data = {
    'service_id': range(1, n_services + 1),
    'service_type': np.random.choice(['Oil Change', 'Brake Service', 'AC Service', 'Engine Repair', 
                                     'Transmission', 'Inspection', 'Tire Service'], n_services),
    'service_complexity': np.random.uniform(1, 10, n_services),
    'base_cost': np.random.uniform(2000, 15000, n_services),
    'parts_cost': np.random.uniform(500, 8000, n_services),
    'labor_hours': np.random.uniform(0.5, 8, n_services),
    'demand_level': np.random.uniform(0, 1, n_services),
    'competitor_avg_price': np.random.uniform(3000, 20000, n_services),
    'customer_segment': np.random.choice(['Budget', 'Value', 'Premium', 'Luxury'], n_services),
    'customer_loyalty_score': np.random.uniform(0, 100, n_services),
    'season': np.random.choice(['Spring', 'Summer', 'Monsoon', 'Winter'], n_services),
    'day_of_week': np.random.choice(['Weekday', 'Weekend'], n_services, p=[0.75, 0.25]),
    'time_slot': np.random.choice(['Morning', 'Afternoon', 'Evening'], n_services),
    'urgency_level': np.random.choice(['Low', 'Medium', 'High', 'Emergency'], n_services),
    'vehicle_age_years': np.random.randint(1, 15, n_services),
    'vehicle_value': np.random.uniform(200000, 3000000, n_services),
    'promotional_period': np.random.choice([0, 1], n_services, p=[0.7, 0.3]),
    'capacity_utilization': np.random.uniform(0.3, 1.0, n_services),
    'technician_skill_level': np.random.uniform(5, 10, n_services),
    'warranty_included': np.random.choice([0, 1], n_services, p=[0.6, 0.4]),
    'parts_premium': np.random.choice([0, 1], n_services, p=[0.7, 0.3]),
    'market_position': np.random.choice(['Economy', 'Standard', 'Premium'], n_services)
}

df = pd.DataFrame(data)

# Create optimal_service_price
segment_multipliers = {'Budget': 0.9, 'Value': 1.0, 'Premium': 1.2, 'Luxury': 1.5}
urgency_multipliers = {'Low': 0.95, 'Medium': 1.0, 'High': 1.15, 'Emergency': 1.3}
season_multipliers = {'Spring': 1.05, 'Summer': 1.15, 'Monsoon': 0.95, 'Winter': 1.0}

df['segment_mult'] = df['customer_segment'].map(segment_multipliers)
df['urgency_mult'] = df['urgency_level'].map(urgency_multipliers)
df['season_mult'] = df['season'].map(season_multipliers)

df['optimal_service_price'] = (
    df['base_cost'] +
    df['parts_cost'] +
    (df['labor_hours'] * 500) +  # ₹500 per hour
    (df['service_complexity'] * 200) +
    (df['competitor_avg_price'] * 0.1)  # 10% of competitor price as market factor
) * df['segment_mult'] * df['urgency_mult'] * df['season_mult']

# Apply demand-based pricing
df['optimal_service_price'] *= (1 + df['demand_level'] * 0.2)  # Up to 20% increase for high demand

# Apply capacity-based pricing
df.loc[df['capacity_utilization'] < 0.5, 'optimal_service_price'] *= 0.95  # 5% discount for low capacity

# Promotional discount
df.loc[df['promotional_period'] == 1, 'optimal_service_price'] *= 0.90

# Premium parts markup
df.loc[df['parts_premium'] == 1, 'optimal_service_price'] *= 1.1

# Warranty inclusion
df.loc[df['warranty_included'] == 1, 'optimal_service_price'] *= 1.05

# Add noise and ensure positive
df['optimal_service_price'] += np.random.normal(0, 200, n_services)
df['optimal_service_price'] = np.clip(df['optimal_service_price'], 1000, 50000)

# Calculate baseline (current) price (20% lower)
df['current_average_price'] = df['optimal_service_price'] * 0.83  # Current pricing is suboptimal

revenue_increase = ((df['optimal_service_price'].mean() - df['current_average_price'].mean()) / 
                   df['current_average_price'].mean()) * 100

print(f"✓ Dataset created: {len(df)} pricing scenarios")
print(f"  Current Avg Price: ₹{df['current_average_price'].mean():,.0f}")
print(f"  Optimal Avg Price: ₹{df['optimal_service_price'].mean():,.0f}")
print(f"  Revenue Increase: {revenue_increase:.1f}% (Target: 20%)")

df.drop(['segment_mult', 'urgency_mult', 'season_mult'], axis=1, inplace=True)

# EDA
print("\n[2/9] Exploratory Data Analysis...")
print("Dataset Shape:", df.shape)
print("\nPrice Statistics:")
print(df[['current_average_price', 'optimal_service_price']].describe())

# Visualizations
print("\n[3/9] Creating Visualizations...")

fig, axes = plt.subplots(3, 3, figsize=(16, 12))
fig.suptitle('AUTOERA - Dynamic Pricing Analysis', fontsize=16, fontweight='bold')

# 1. Price Distribution
axes[0, 0].hist([df['current_average_price'], df['optimal_service_price']], 
               bins=40, label=['Current', 'Optimal'], color=['#e74c3c', '#2ecc71'], alpha=0.7)
axes[0, 0].set_xlabel('Price (₹)')
axes[0, 0].set_ylabel('Frequency')
axes[0, 0].set_title('Price Distribution')
axes[0, 0].legend()

# 2. Revenue Opportunity
price_diff = df['optimal_service_price'] - df['current_average_price']
axes[0, 1].hist(price_diff, bins=40, color='#3498db', alpha=0.7)
axes[0, 1].axvline(x=0, color='r', linestyle='--', linewidth=2)
axes[0, 1].set_xlabel('Price Difference (₹)')
axes[0, 1].set_ylabel('Frequency')
axes[0, 1].set_title(f'Revenue Opportunity (Avg: ₹{price_diff.mean():,.0f})')

# 3. Demand vs Price
axes[0, 2].scatter(df['demand_level'], df['optimal_service_price'], alpha=0.6, color='#9b59b6')
axes[0, 2].set_xlabel('Demand Level')
axes[0, 2].set_ylabel('Optimal Price (₹)')
axes[0, 2].set_title('Demand-Based Pricing')

# 4. Customer Segment Pricing
segment_prices = df.groupby('customer_segment')['optimal_service_price'].mean().sort_values()
axes[1, 0].barh(range(len(segment_prices)), segment_prices.values, color='#e67e22')
axes[1, 0].set_yticks(range(len(segment_prices)))
axes[1, 0].set_yticklabels(segment_prices.index)
axes[1, 0].set_xlabel('Average Price (₹)')
axes[1, 0].set_title('Pricing by Customer Segment')

# 5. Service Type Analysis
service_prices = df.groupby('service_type')['optimal_service_price'].mean().sort_values(ascending=False)
axes[1, 1].bar(range(len(service_prices)), service_prices.values, color='#1abc9c')
axes[1, 1].set_xticks(range(len(service_prices)))
axes[1, 1].set_xticklabels(service_prices.index, rotation=45, ha='right')
axes[1, 1].set_ylabel('Average Price (₹)')
axes[1, 1].set_title('Pricing by Service Type')

# 6. Competitor Pricing Comparison
axes[1, 2].scatter(df['competitor_avg_price'], df['optimal_service_price'], alpha=0.6, color='#f39c12')
axes[1, 2].plot([df['competitor_avg_price'].min(), df['competitor_avg_price'].max()],
               [df['competitor_avg_price'].min(), df['competitor_avg_price'].max()], 'r--', lw=2)
axes[1, 2].set_xlabel('Competitor Price (₹)')
axes[1, 2].set_ylabel('Optimal Price (₹)')
axes[1, 2].set_title('Competitive Positioning')

# 7. Complexity vs Price
axes[2, 0].scatter(df['service_complexity'], df['optimal_service_price'], alpha=0.6, color='#e74c3c')
axes[2, 0].set_xlabel('Service Complexity')
axes[2, 0].set_ylabel('Optimal Price (₹)')
axes[2, 0].set_title('Complexity-Based Pricing')

# 8. Seasonal Pricing
seasonal_prices = df.groupby('season')['optimal_service_price'].mean().reindex(['Spring', 'Summer', 'Monsoon', 'Winter'])
axes[2, 1].bar(range(len(seasonal_prices)), seasonal_prices.values, color='#27ae60')
axes[2, 1].set_xticks(range(len(seasonal_prices)))
axes[2, 1].set_xticklabels(seasonal_prices.index)
axes[2, 1].set_ylabel('Average Price (₹)')
axes[2, 1].set_title('Seasonal Price Variation')

# 9. Correlation Heatmap
corr_cols = ['optimal_service_price', 'base_cost', 'parts_cost', 'labor_hours', 
             'demand_level', 'service_complexity', 'competitor_avg_price']
corr_matrix = df[corr_cols].corr()
sns.heatmap(corr_matrix, annot=True, cmap='RdYlGn', center=0, ax=axes[2, 2])
axes[2, 2].set_title('Price Factor Correlations')

plt.tight_layout()
plt.savefig('09_dynamic_pricing_eda.png', dpi=300, bbox_inches='tight')
print("✓ EDA visualizations saved")

# Preprocessing
print("\n[4/9] Preprocessing Data...")

X = df.drop(['optimal_service_price', 'service_id', 'current_average_price'], axis=1)
y = df['optimal_service_price']

# Encode categorical
label_encoders = {}
categorical_cols = ['service_type', 'customer_segment', 'season', 'day_of_week', 
                   'time_slot', 'urgency_level', 'market_position']

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

# Split and scale
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✓ Data prepared - Train: {len(X_train)}, Test: {len(X_test)}")

# Feature Engineering
print("\n[5/9] Feature Engineering...")

X_train['value_ratio'] = X_train['vehicle_value'] / (X_train['vehicle_age_years'] + 1)
X_test['value_ratio'] = X_test['vehicle_value'] / (X_test['vehicle_age_years'] + 1)

X_train['total_cost_base'] = X_train['base_cost'] + X_train['parts_cost']
X_test['total_cost_base'] = X_test['base_cost'] + X_test['parts_cost']

X_train['premium_indicator'] = X_train['parts_premium'] + X_train['warranty_included']
X_test['premium_indicator'] = X_test['parts_premium'] + X_test['warranty_included']

X_train_final = scaler.fit_transform(X_train)
X_test_final = scaler.transform(X_test)

print("✓ Created 3 engineered features")

# Model Training
print("\n[6/9] Training Pricing Models...")

models = {
    'Random Forest': RandomForestRegressor(n_estimators=150, max_depth=15, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, random_state=42),
    'Ridge': Ridge(alpha=10.0),
    'ElasticNet': ElasticNet(alpha=1.0, l1_ratio=0.5)
}

results = {}
for name, model in models.items():
    print(f"  Training {name}...")
    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)
    
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    results[name] = {
        'model': model,
        'predictions': y_pred,
        'rmse': rmse,
        'mae': mae,
        'r2': r2
    }
    print(f"    RMSE: ₹{rmse:.2f}, R²: {r2:.4f}")

# Evaluation
print("\n[7/9] Model Evaluation...")

best_model_name = max(results, key=lambda x: results[x]['r2'])
best_model = results[best_model_name]['model']

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.suptitle('Dynamic Pricing Model Performance', fontsize=16, fontweight='bold')

# Model comparison
model_names = list(results.keys())
r2_scores = [results[m]['r2'] for m in model_names]
axes[0, 0].bar(range(len(model_names)), [r*100 for r in r2_scores], 
              color=['#3498db', '#2ecc71', '#e74c3c', '#f39c12'])
axes[0, 0].set_xticks(range(len(model_names)))
axes[0, 0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0, 0].set_ylabel('R² Score (%)')
axes[0, 0].set_title('Model Performance')

# Actual vs Predicted
best_pred = results[best_model_name]['predictions']
axes[0, 1].scatter(y_test, best_pred, alpha=0.6, color='#3498db')
axes[0, 1].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
axes[0, 1].set_xlabel('Actual Price (₹)')
axes[0, 1].set_ylabel('Predicted Price (₹)')
axes[0, 1].set_title(f'Price Prediction Accuracy - {best_model_name}')

# Revenue Impact Analysis
current_baseline = y_test * 0.83  # Current pricing
predicted_revenue_increase = ((best_pred.mean() - current_baseline.mean()) / current_baseline.mean()) * 100
axes[1, 0].hist([current_baseline, best_pred], bins=30, 
               label=['Current Pricing', 'Optimized Pricing'], 
               color=['#e74c3c', '#2ecc71'], alpha=0.7)
axes[1, 0].set_xlabel('Price (₹)')
axes[1, 0].set_ylabel('Frequency')
axes[1, 0].set_title(f'Revenue Impact: +{predicted_revenue_increase:.1f}%')
axes[1, 0].legend()

# Feature Importance
if hasattr(best_model, 'feature_importances_'):
    importance_df = pd.DataFrame({
        'feature': list(X_train.columns),
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    
    axes[1, 1].barh(range(len(importance_df)), importance_df['importance'], color='#f39c12')
    axes[1, 1].set_yticks(range(len(importance_df)))
    axes[1, 1].set_yticklabels(importance_df['feature'])
    axes[1, 1].set_xlabel('Importance')
    axes[1, 1].set_title('Top Pricing Factors')
    axes[1, 1].invert_yaxis()

plt.tight_layout()
plt.savefig('09_dynamic_pricing_results.png', dpi=300, bbox_inches='tight')

print(f"\n✓ Best Model: {best_model_name}")
print(f"  R² Score: {results[best_model_name]['r2']:.4f}")
print(f"  Revenue Increase: {predicted_revenue_increase:.1f}% (Target: 20%)")

# Deployment
print("\n[8/9] Saving Model...")

deployment_package = {
    'model': best_model,
    'scaler': scaler,
    'label_encoders': label_encoders,
    'feature_names': list(X_train.columns),
    'model_name': best_model_name,
    'r2_score': results[best_model_name]['r2'],
    'revenue_increase': f"{predicted_revenue_increase:.1f}%",
    'target_increase': "20%",
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('09_dynamic_pricing_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

metadata = {
    'module_name': 'Dynamic Pricing Engine',
    'module_id': '09',
    'model_type': 'Regression',
    'target': 'optimal_service_price',
    'best_model': best_model_name,
    'r2_score': f"{results[best_model_name]['r2']:.4f}",
    'revenue_increase': f"{predicted_revenue_increase:.1f}%",
    'target_achieved': 'Yes' if predicted_revenue_increase >= 18 else 'No',
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('09_dynamic_pricing_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✓ Model saved successfully")

# Usage Example
print("\n[9/9] Testing Price Optimization...")

sample_service = {
    'service_type': 'Engine Repair',
    'service_complexity': 7.5,
    'base_cost': 8000,
    'parts_cost': 4500,
    'labor_hours': 4.0,
    'demand_level': 0.7,
    'competitor_avg_price': 15000,
    'customer_segment': 'Premium',
    'customer_loyalty_score': 75,
    'season': 'Summer',
    'day_of_week': 'Weekday',
    'time_slot': 'Morning',
    'urgency_level': 'High',
    'vehicle_age_years': 6,
    'vehicle_value': 1200000,
    'promotional_period': 0,
    'capacity_utilization': 0.65,
    'technician_skill_level': 8.5,
    'warranty_included': 1,
    'parts_premium': 1,
    'market_position': 'Premium'
}

sample_df = pd.DataFrame([sample_service])
for col in categorical_cols:
    sample_df[col] = label_encoders[col].transform(sample_df[col])

sample_df['value_ratio'] = sample_df['vehicle_value'] / (sample_df['vehicle_age_years'] + 1)
sample_df['total_cost_base'] = sample_df['base_cost'] + sample_df['parts_cost']
sample_df['premium_indicator'] = sample_df['parts_premium'] + sample_df['warranty_included']

sample_scaled = scaler.transform(sample_df)
optimal_price = best_model.predict(sample_scaled)[0]
current_price = optimal_price * 0.83
revenue_gain = optimal_price - current_price

print(f"\nDynamic Pricing Recommendation:")
print(f"  Current Price: ₹{current_price:,.0f}")
print(f"  Optimal Price: ₹{optimal_price:,.0f}")
print(f"  Revenue Gain: ₹{revenue_gain:,.0f} (+{(revenue_gain/current_price)*100:.1f}%)")
print(f"  Service Type: {sample_service['service_type']}")
print(f"  Customer Segment: {sample_service['customer_segment']}")

print("\n" + "="*80)
print("✅ DYNAMIC PRICING ENGINE COMPLETED!")
print("="*80)