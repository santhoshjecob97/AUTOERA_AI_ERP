"""
AUTOERA AI Module 05: Bay Optimization Engine
=============================================
Type: Regression
Target: Predicts optimal bay utilization rate (Target: 89%)
Features: Bay configuration, service types, timing, technician skills

Complete ML Pipeline for Bay Utilization Optimization
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import pickle
from datetime import datetime, timedelta
import json

print("="*80)
print("AUTOERA - BAY OPTIMIZATION ENGINE")
print("="*80)
print("\n[1/9] Generating Bay Utilization Dataset...")

np.random.seed(42)
n_records = 3000

# Generate realistic bay utilization data
data = {
    'bay_id': np.random.randint(1, 16, n_records),  # 15 bays
    'bay_type': np.random.choice(['General', 'Engine', 'Body', 'AC', 'Electrical'], n_records),
    'day_of_week': np.random.choice(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], n_records),
    'hour_of_day': np.random.randint(8, 19, n_records),  # 8 AM to 7 PM
    'season': np.random.choice(['Spring', 'Summer', 'Monsoon', 'Winter'], n_records),
    'technician_skill_level': np.random.uniform(3, 10, n_records),  # 1-10 scale
    'num_technicians_available': np.random.randint(1, 4, n_records),
    'avg_service_duration_hours': np.random.uniform(0.5, 6, n_records),
    'scheduled_appointments': np.random.randint(0, 8, n_records),
    'walk_in_probability': np.random.uniform(0, 0.5, n_records),
    'equipment_availability': np.random.uniform(0.7, 1.0, n_records),
    'bay_capacity': np.random.choice([1, 2], n_records, p=[0.8, 0.2]),  # Most bays handle 1 vehicle
    'prev_day_utilization': np.random.uniform(0.3, 0.95, n_records),
    'customer_waiting_time': np.random.uniform(0, 120, n_records),  # minutes
    'service_complexity_avg': np.random.uniform(1, 10, n_records),
    'weather_impact': np.random.choice(['None', 'Light', 'Moderate', 'Heavy'], n_records, p=[0.4, 0.3, 0.2, 0.1])
}

df = pd.DataFrame(data)

# Create target variable: bay_utilization_rate based on realistic factors
base_utilization = 0.6  # Base 60% utilization

# Factors affecting utilization
day_factors = {'Monday': 0.9, 'Tuesday': 1.0, 'Wednesday': 1.1, 'Thursday': 1.0, 'Friday': 0.95, 'Saturday': 0.8}
hour_factors = {h: 0.8 if h < 10 or h > 17 else 1.0 for h in range(8, 19)}
hour_factors.update({h: 1.2 for h in range(10, 16)})  # Peak hours

season_factors = {'Spring': 1.1, 'Summer': 1.2, 'Monsoon': 0.8, 'Winter': 1.0}
weather_factors = {'None': 1.0, 'Light': 0.95, 'Moderate': 0.85, 'Heavy': 0.7}

df['day_factor'] = df['day_of_week'].map(day_factors)
df['hour_factor'] = df['hour_of_day'].map(hour_factors)
df['season_factor'] = df['season'].map(season_factors)
df['weather_factor'] = df['weather_impact'].map(weather_factors)

# Calculate utilization
df['bay_utilization_rate'] = (
    base_utilization * 
    df['day_factor'] * 
    df['hour_factor'] * 
    df['season_factor'] * 
    df['weather_factor'] *
    (df['technician_skill_level'] / 10) *
    df['equipment_availability'] *
    (1 + df['scheduled_appointments'] / 10) *
    (1 - df['customer_waiting_time'] / 500)  # Waiting time penalty
)

# Add noise and cap at realistic values
df['bay_utilization_rate'] += np.random.normal(0, 0.05, n_records)
df['bay_utilization_rate'] = np.clip(df['bay_utilization_rate'], 0.2, 0.98)

# Remove helper columns
df.drop(['day_factor', 'hour_factor', 'season_factor', 'weather_factor'], axis=1, inplace=True)

target_89_count = (df['bay_utilization_rate'] >= 0.89).sum()
avg_utilization = df['bay_utilization_rate'].mean()

print(f"✓ Dataset created: {len(df)} records")
print(f"  Average Utilization: {avg_utilization*100:.1f}%")
print(f"  Records ≥89%: {target_89_count} ({target_89_count/len(df)*100:.1f}%)")

# EDA
print("\n[2/9] Exploratory Data Analysis...")
print("Dataset Shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())
print("\nStatistical Summary:")
print(df.describe())

# Visualizations
print("\n[3/9] Creating Visualizations...")

fig, axes = plt.subplots(3, 3, figsize=(16, 12))
fig.suptitle('AUTOERA - Bay Optimization Analysis', fontsize=16, fontweight='bold')

# 1. Utilization Distribution
axes[0, 0].hist(df['bay_utilization_rate'], bins=30, color='#3498db', alpha=0.7)
axes[0, 0].axvline(x=0.89, color='r', linestyle='--', linewidth=2, label='Target: 89%')
axes[0, 0].axvline(x=avg_utilization, color='g', linestyle='-', linewidth=2, label=f'Current: {avg_utilization*100:.1f}%')
axes[0, 0].set_xlabel('Bay Utilization Rate')
axes[0, 0].set_ylabel('Frequency')
axes[0, 0].set_title('Bay Utilization Distribution')
axes[0, 0].legend()

# 2. Utilization by Day of Week
day_util = df.groupby('day_of_week')['bay_utilization_rate'].mean().reindex(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
)
axes[0, 1].bar(range(len(day_util)), day_util.values*100, color='#2ecc71')
axes[0, 1].set_xticks(range(len(day_util)))
axes[0, 1].set_xticklabels(day_util.index, rotation=45, ha='right')
axes[0, 1].set_ylabel('Average Utilization (%)')
axes[0, 1].set_title('Utilization by Day of Week')
axes[0, 1].axhline(y=89, color='r', linestyle='--', label='Target: 89%')
axes[0, 1].legend()

# 3. Hourly Utilization Pattern
hourly_util = df.groupby('hour_of_day')['bay_utilization_rate'].mean()
axes[0, 2].plot(hourly_util.index, hourly_util.values*100, marker='o', color='#e74c3c', linewidth=2)
axes[0, 2].set_xlabel('Hour of Day')
axes[0, 2].set_ylabel('Average Utilization (%)')
axes[0, 2].set_title('Hourly Utilization Pattern')
axes[0, 2].axhline(y=89, color='r', linestyle='--', label='Target: 89%')
axes[0, 2].grid(True, alpha=0.3)
axes[0, 2].legend()

# 4. Bay Type Performance
bay_util = df.groupby('bay_type')['bay_utilization_rate'].mean().sort_values(ascending=False)
colors = ['#2ecc71' if x >= 0.89 else '#e74c3c' for x in bay_util.values]
axes[1, 0].bar(range(len(bay_util)), bay_util.values*100, color=colors)
axes[1, 0].set_xticks(range(len(bay_util)))
axes[1, 0].set_xticklabels(bay_util.index, rotation=45, ha='right')
axes[1, 0].set_ylabel('Average Utilization (%)')
axes[1, 0].set_title('Utilization by Bay Type')
axes[1, 0].axhline(y=89, color='r', linestyle='--', label='Target')
axes[1, 0].legend()

# 5. Technician Skill Impact
axes[1, 1].scatter(df['technician_skill_level'], df['bay_utilization_rate']*100, alpha=0.6, color='#9b59b6')
axes[1, 1].set_xlabel('Technician Skill Level')
axes[1, 1].set_ylabel('Utilization Rate (%)')
axes[1, 1].set_title('Skill Level vs Utilization')
axes[1, 1].axhline(y=89, color='r', linestyle='--', label='Target')
axes[1, 1].legend()

# 6. Seasonal Patterns
season_util = df.groupby('season')['bay_utilization_rate'].mean()
axes[1, 2].bar(range(len(season_util)), season_util.values*100, color='#f39c12')
axes[1, 2].set_xticks(range(len(season_util)))
axes[1, 2].set_xticklabels(season_util.index)
axes[1, 2].set_ylabel('Average Utilization (%)')
axes[1, 2].set_title('Seasonal Utilization Patterns')
axes[1, 2].axhline(y=89, color='r', linestyle='--', label='Target')
axes[1, 2].legend()

# 7. Equipment vs Utilization
axes[2, 0].scatter(df['equipment_availability'], df['bay_utilization_rate']*100, alpha=0.6, color='#e67e22')
axes[2, 0].set_xlabel('Equipment Availability')
axes[2, 0].set_ylabel('Utilization Rate (%)')
axes[2, 0].set_title('Equipment Impact')
axes[2, 0].axhline(y=89, color='r', linestyle='--')

# 8. Correlation Heatmap
numeric_cols = df.select_dtypes(include=[np.number]).columns
corr = df[numeric_cols].corr()[['bay_utilization_rate']].sort_values(by='bay_utilization_rate', ascending=False)
sns.heatmap(corr, annot=True, cmap='RdYlGn', center=0, ax=axes[2, 1])
axes[2, 1].set_title('Feature Correlation with Utilization')

# 9. Weather Impact
weather_util = df.groupby('weather_impact')['bay_utilization_rate'].mean()
axes[2, 2].bar(range(len(weather_util)), weather_util.values*100, color='#1abc9c')
axes[2, 2].set_xticks(range(len(weather_util)))
axes[2, 2].set_xticklabels(weather_util.index)
axes[2, 2].set_ylabel('Average Utilization (%)')
axes[2, 2].set_title('Weather Impact')
axes[2, 2].axhline(y=89, color='r', linestyle='--')

plt.tight_layout()
plt.savefig('05_bay_optimization_eda.png', dpi=300, bbox_inches='tight')
print("✓ EDA visualizations saved")

# Preprocessing
print("\n[4/9] Preprocessing Data...")

X = df.drop(['bay_utilization_rate'], axis=1)
y = df['bay_utilization_rate']

# Encode categorical variables
label_encoders = {}
categorical_cols = ['bay_type', 'day_of_week', 'season', 'weather_impact']

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✓ Data split - Train: {len(X_train)}, Test: {len(X_test)}")

# Feature Engineering
print("\n[5/9] Feature Engineering...")

# Create efficiency metrics
X_train['efficiency_score'] = (X_train['technician_skill_level'] * X_train['equipment_availability'] * 
                               X_train['num_technicians_available']) / X_train['avg_service_duration_hours']
X_test['efficiency_score'] = (X_test['technician_skill_level'] * X_test['equipment_availability'] * 
                              X_test['num_technicians_available']) / X_test['avg_service_duration_hours']

# Demand pressure
X_train['demand_pressure'] = X_train['scheduled_appointments'] + (X_train['walk_in_probability'] * 5)
X_test['demand_pressure'] = X_test['scheduled_appointments'] + (X_test['walk_in_probability'] * 5)

# Operational smoothness
X_train['operational_smoothness'] = 1 / (X_train['customer_waiting_time'] / 60 + 1)
X_test['operational_smoothness'] = 1 / (X_test['customer_waiting_time'] / 60 + 1)

# Update scaled data
X_train_final = scaler.fit_transform(X_train)
X_test_final = scaler.transform(X_test)

print("✓ Created 3 engineered features")

# Model Training
print("\n[6/9] Training Regression Models...")

models = {
    'Random Forest': RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, random_state=42),
    'Ridge Regression': Ridge(alpha=1.0),
    'SVR': SVR(C=1.0, gamma='scale')
}

results = {}
for name, model in models.items():
    print(f"  Training {name}...")
    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)
    
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    results[name] = {
        'model': model,
        'predictions': y_pred,
        'rmse': rmse,
        'mae': mae,
        'r2': r2
    }
    print(f"    RMSE: {rmse:.4f}, R²: {r2:.4f}")

# Model Evaluation
print("\n[7/9] Model Evaluation...")

best_model_name = max(results, key=lambda x: results[x]['r2'])
best_model = results[best_model_name]['model']
best_predictions = results[best_model_name]['predictions']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Bay Optimization Model Performance', fontsize=16, fontweight='bold')

# 1. Model comparison
model_names = list(results.keys())
r2_scores = [results[m]['r2'] for m in model_names]
rmse_scores = [results[m]['rmse'] for m in model_names]

x = np.arange(len(model_names))
width = 0.35

axes[0, 0].bar(x - width/2, [r*100 for r in r2_scores], width, label='R² Score (%)', color='#2ecc71')
axes[0, 0].bar(x + width/2, [r*1000 for r in rmse_scores], width, label='RMSE × 1000', color='#e74c3c')
axes[0, 0].set_xticks(x)
axes[0, 0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0, 0].set_title('Model Performance Comparison')
axes[0, 0].legend()

# 2. Actual vs Predicted
axes[0, 1].scatter(y_test*100, best_predictions*100, alpha=0.6, color='#3498db')
axes[0, 1].plot([y_test.min()*100, y_test.max()*100], [y_test.min()*100, y_test.max()*100], 'r--', lw=2)
axes[0, 1].set_xlabel('Actual Utilization (%)')
axes[0, 1].set_ylabel('Predicted Utilization (%)')
axes[0, 1].set_title(f'Actual vs Predicted - {best_model_name}')
axes[0, 1].axhline(y=89, color='g', linestyle='--', alpha=0.7, label='Target: 89%')
axes[0, 1].axvline(x=89, color='g', linestyle='--', alpha=0.7)
axes[0, 1].legend()

# 3. Residuals
residuals = y_test - best_predictions
axes[1, 0].scatter(best_predictions*100, residuals*100, alpha=0.6, color='#e74c3c')
axes[1, 0].axhline(y=0, color='black', linestyle='-', alpha=0.5)
axes[1, 0].set_xlabel('Predicted Utilization (%)')
axes[1, 0].set_ylabel('Residuals (%)')
axes[1, 0].set_title('Residual Analysis')

# 4. Feature Importance (if available)
if hasattr(best_model, 'feature_importances_'):
    importance_df = pd.DataFrame({
        'feature': list(X_train.columns),
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    
    axes[1, 1].barh(range(len(importance_df)), importance_df['importance'], color='#f39c12')
    axes[1, 1].set_yticks(range(len(importance_df)))
    axes[1, 1].set_yticklabels(importance_df['feature'])
    axes[1, 1].set_xlabel('Feature Importance')
    axes[1, 1].set_title('Top 10 Feature Importance')
    axes[1, 1].invert_yaxis()

plt.tight_layout()
plt.savefig('05_bay_optimization_results.png', dpi=300, bbox_inches='tight')

print(f"\n✓ Best Model: {best_model_name}")
print(f"  R² Score: {results[best_model_name]['r2']:.4f}")
print(f"  RMSE: {results[best_model_name]['rmse']:.4f}")
print(f"  MAE: {results[best_model_name]['mae']:.4f}")

# Optimization Analysis
print("\n[8/9] Optimization Analysis...")

# Find conditions for achieving 89% utilization
high_util_records = df[df['bay_utilization_rate'] >= 0.89]
optimal_conditions = {}

for col in ['bay_type', 'day_of_week', 'hour_of_day', 'season']:
    if col in ['bay_type', 'day_of_week', 'season']:
        optimal_conditions[col] = high_util_records[col].mode().iloc[0] if len(high_util_records) > 0 else 'N/A'
    else:
        optimal_conditions[col] = high_util_records[col].mean() if len(high_util_records) > 0 else 0

print("\nOptimal Conditions for 89%+ Utilization:")
for condition, value in optimal_conditions.items():
    print(f"  {condition}: {value}")

# Deployment
deployment_package = {
    'model': best_model,
    'scaler': scaler,
    'label_encoders': label_encoders,
    'feature_names': list(X_train.columns),
    'model_name': best_model_name,
    'r2_score': results[best_model_name]['r2'],
    'target_utilization': 0.89,
    'optimal_conditions': optimal_conditions,
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('05_bay_optimization_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

metadata = {
    'module_name': 'Bay Optimization Engine',
    'module_id': '05',
    'model_type': 'Regression',
    'target': 'bay_utilization_rate',
    'best_model': best_model_name,
    'r2_score': f"{results[best_model_name]['r2']:.4f}",
    'rmse': f"{results[best_model_name]['rmse']:.4f}",
    'target_utilization': '89%',
    'current_avg': f"{avg_utilization*100:.1f}%",
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('05_bay_optimization_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✓ Model saved successfully")

# Usage Example
print("\n[9/9] Testing Optimization...")

sample = {
    'bay_id': 5,
    'bay_type': 'General',
    'day_of_week': 'Wednesday',
    'hour_of_day': 14,  # 2 PM peak hour
    'season': 'Summer',
    'technician_skill_level': 8.5,
    'num_technicians_available': 3,
    'avg_service_duration_hours': 2.0,
    'scheduled_appointments': 6,
    'walk_in_probability': 0.3,
    'equipment_availability': 0.95,
    'bay_capacity': 1,
    'prev_day_utilization': 0.82,
    'customer_waiting_time': 15,  # 15 minutes
    'service_complexity_avg': 6.5,
    'weather_impact': 'None'
}

sample_df = pd.DataFrame([sample])
for col in categorical_cols:
    sample_df[col] = label_encoders[col].transform(sample_df[col])

# Add engineered features
sample_df['efficiency_score'] = (sample_df['technician_skill_level'] * sample_df['equipment_availability'] * 
                                sample_df['num_technicians_available']) / sample_df['avg_service_duration_hours']
sample_df['demand_pressure'] = sample_df['scheduled_appointments'] + (sample_df['walk_in_probability'] * 5)
sample_df['operational_smoothness'] = 1 / (sample_df['customer_waiting_time'] / 60 + 1)

sample_scaled = scaler.transform(sample_df)
predicted_utilization = best_model.predict(sample_scaled)[0]

print(f"\nSample Bay Optimization:")
print(f"  Predicted Utilization: {predicted_utilization*100:.1f}%")
print(f"  Target Achievement: {'✓ ACHIEVED' if predicted_utilization >= 0.89 else '✗ BELOW TARGET'}")
print(f"  Gap to Target: {(0.89 - predicted_utilization)*100:+.1f} percentage points")

# Optimization suggestions
if predicted_utilization < 0.89:
    print(f"\nOptimization Suggestions:")
    print(f"  • Increase technician skill level to 9+")
    print(f"  • Schedule during peak hours (10 AM - 4 PM)")  
    print(f"  • Ensure equipment availability > 95%")
    print(f"  • Reduce customer waiting time to <10 minutes")

print("\n" + "="*80)
print("✅ BAY OPTIMIZATION ENGINE COMPLETED!")
print("="*80)
print("\nFiles Generated:")
print("  1. 05_bay_optimization_eda.png")
print("  2. 05_bay_optimization_results.png") 
print("  3. 05_bay_optimization_model.pkl")
print("  4. 05_bay_optimization_metadata.json")