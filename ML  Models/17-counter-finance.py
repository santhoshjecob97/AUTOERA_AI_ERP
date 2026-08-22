"""
AUTOERA AI Module 04: Counter-Finance Revenue Tracking AI
==========================================================
Type: Regression + Classification Hybrid
Target: commission_variance (Regression), unclaimed_risk (Classification)
Goal: 90% R² for variance, 88% accuracy for risk
Features: Lender info, loan details, processing metrics, customer profile
Complete ML Pipeline for Revenue Leakage Prevention
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
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error, accuracy_score, classification_report, confusion_matrix, roc_auc_score
import pickle
from datetime import datetime, timedelta
import json

print("="*80)
print("AUTOERA - COUNTER-FINANCE REVENUE TRACKING AI")
print("="*80)

# ============================================================================
# 2. DATA GENERATION
# ============================================================================
print("\n[1/9] Generating Counter-Finance Dataset...")
np.random.seed(42)
n_cases = 5200

# Generate finance commission tracking data
data = {
    'case_id': range(1, n_cases + 1),
    'lender_name': np.random.choice(['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 
                                     'SBI', 'PNB', 'Bank of Baroda', 'NBFCs'], n_cases),
    'lender_type': np.random.choice(['Private Bank', 'Public Bank', 'NBFC'], n_cases),
    'loan_amount': np.random.uniform(200000, 2500000, n_cases),
    'loan_tenure_months': np.random.choice([12, 24, 36, 48, 60, 72, 84], n_cases),
    'interest_rate': np.random.uniform(8.5, 15.5, n_cases),
    'estimated_commission_rate': np.random.uniform(1.5, 5.0, n_cases),
    'customer_credit_score': np.random.randint(550, 850, n_cases),
    'customer_income_monthly': np.random.uniform(40000, 200000, n_cases),
    'down_payment_percent': np.random.uniform(10, 45, n_cases),
    'vehicle_type': np.random.choice(['Hatchback', 'Sedan', 'SUV', 'Premium', 'Luxury'], n_cases),
    'vehicle_value': np.random.uniform(400000, 3500000, n_cases),
    'processing_days': np.random.randint(1, 35, n_cases),
    'documentation_complete': np.random.choice([0, 1], n_cases, p=[0.22, 0.78]),
    'cibil_verified': np.random.choice([0, 1], n_cases, p=[0.12, 0.88]),
    'bank_relationship_months': np.random.randint(0, 150, n_cases),
    'previous_loans_count': np.random.randint(0, 4, n_cases),
    'lender_monthly_target_achievement': np.random.uniform(0.5, 1.3, n_cases),
    'season': np.random.choice(['Q1', 'Q2', 'Q3', 'Q4'], n_cases),
    'dealership_monthly_volume': np.random.randint(15, 220, n_cases),
    'approval_retracted': np.random.choice([0, 1], n_cases, p=[0.93, 0.07]),
    'manual_intervention': np.random.choice([0, 1], n_cases, p=[0.72, 0.28]),
    'customer_previous_defaults': np.random.randint(0, 3, n_cases),
    'employment_type': np.random.choice(['Salaried', 'Self-Employed', 'Professional', 'Business'], n_cases),
    'co_applicant': np.random.choice([0, 1], n_cases, p=[0.6, 0.4])
}

df = pd.DataFrame(data)

# Calculate estimated commission
df['estimated_commission'] = df['loan_amount'] * df['estimated_commission_rate'] / 100

# Create actual commission with realistic business logic
base_factor = (
    (df['cibil_verified'] * 0.96 + (1-df['cibil_verified']) * 0.72) *
    (1 - df['approval_retracted'] * 0.55) *
    (df['documentation_complete'] * 1.0 + (1-df['documentation_complete']) * 0.82) *
    (1 - df['manual_intervention'] * 0.12) *
    (1 - df['customer_previous_defaults'] * 0.08)
)

# Lender type variance
lender_factors = {
    'Private Bank': np.random.normal(0.98, 0.09, n_cases),
    'Public Bank': np.random.normal(0.91, 0.14, n_cases), 
    'NBFC': np.random.normal(0.88, 0.17, n_cases)
}

df['lender_factor'] = [lender_factors[lt][i] for i, lt in enumerate(df['lender_type'])]

# Target achievement impact
df['target_impact'] = np.where(df['lender_monthly_target_achievement'] < 0.9, 0.92, 1.02)

df['actual_commission'] = df['estimated_commission'] * base_factor * df['lender_factor'] * df['target_impact']
df['actual_commission'] = np.clip(df['actual_commission'], 0, df['estimated_commission'] * 1.08)

# Calculate variance (TARGET for regression)
df['commission_variance'] = df['actual_commission'] - df['estimated_commission']
df['variance_percentage'] = (df['commission_variance'] / df['estimated_commission']) * 100

# Create risk flag for unclaimed cases (TARGET for classification)
df['unclaimed_risk'] = (
    (df['approval_retracted'] == 1) | 
    (df['manual_intervention'] == 1) |
    (df['variance_percentage'] < -25) |
    (df['processing_days'] > 25) |
    (df['customer_previous_defaults'] >= 2)
).astype(int)

# Drop helper columns
df = df.drop(['lender_factor', 'target_impact'], axis=1)

# Statistics
avg_variance = df['commission_variance'].mean()
avg_variance_pct = df['variance_percentage'].mean()
total_leakage = df[df['commission_variance'] < 0]['commission_variance'].sum()
unclaimed_rate = df['unclaimed_risk'].mean()
monthly_leakage = abs(total_leakage) / 6  # Assuming 6 months of data

print(f"✓ Dataset created: {len(df)} finance cases")
print(f"  Average Variance: ₹{avg_variance:,.0f} ({avg_variance_pct:.1f}%)")
print(f"  Total Revenue Leakage: ₹{abs(total_leakage):,.0f}")
print(f"  Estimated Monthly Leakage: ₹{monthly_leakage:,.0f}")
print(f"  At-Risk Cases: {unclaimed_rate*100:.1f}%")

# ============================================================================
# 3. EXPLORATORY DATA ANALYSIS (EDA)
# ============================================================================
print("\n[2/9] Exploratory Data Analysis...")
print(f"Dataset Shape: {df.shape}")
print("\nFirst 5 rows:")
print(df.head())
print("\nDataset Info:")
print(df.info())
print("\nStatistical Summary:")
print(df.describe())
print("\nVariance Distribution:")
print(df['commission_variance'].describe())
print("\nRisk Distribution:")
print(df['unclaimed_risk'].value_counts())

# ============================================================================
# 4. DATA VISUALIZATION
# ============================================================================
print("\n[3/9] Creating Visualizations...")
fig, axes = plt.subplots(3, 3, figsize=(18, 14))
fig.suptitle('AUTOERA - Counter-Finance Revenue Tracking Analysis', fontsize=16, fontweight='bold', y=0.995)

# Plot 1: Commission Variance Distribution
axes[0, 0].hist(df['commission_variance'], bins=60, color='#e74c3c', alpha=0.7, edgecolor='black')
axes[0, 0].axvline(x=0, color='black', linestyle='--', linewidth=2, label='Zero Variance')
axes[0, 0].set_xlabel('Commission Variance (₹)', fontsize=10)
axes[0, 0].set_ylabel('Frequency', fontsize=10)
axes[0, 0].set_title('Commission Variance Distribution', fontsize=11, fontweight='bold')
axes[0, 0].legend()
axes[0, 0].grid(alpha=0.3)

# Plot 2: Variance by Lender Type
lender_variance = df.groupby('lender_type')['variance_percentage'].mean().sort_values()
colors_lender = ['#e74c3c' if x < 0 else '#2ecc71' for x in lender_variance.values]
axes[0, 1].barh(range(len(lender_variance)), lender_variance.values, color=colors_lender, edgecolor='black')
axes[0, 1].set_yticks(range(len(lender_variance)))
axes[0, 1].set_yticklabels(lender_variance.index, fontsize=10)
axes[0, 1].set_xlabel('Average Variance (%)', fontsize=10)
axes[0, 1].set_title('Variance by Lender Type', fontsize=11, fontweight='bold')
axes[0, 1].axvline(x=0, color='black', linestyle='--', linewidth=2)
axes[0, 1].grid(alpha=0.3, axis='x')

# Plot 3: Estimated vs Actual Commission
scatter = axes[0, 2].scatter(df['estimated_commission']/1000, df['actual_commission']/1000, 
                   alpha=0.4, c=df['unclaimed_risk'], cmap='RdYlGn_r', s=15, edgecolors='black', linewidth=0.5)
max_val = max(df['estimated_commission'].max(), df['actual_commission'].max()) / 1000
axes[0, 2].plot([0, max_val], [0, max_val], 'k--', lw=2, label='Perfect Match')
axes[0, 2].set_xlabel('Estimated Commission (₹K)', fontsize=10)
axes[0, 2].set_ylabel('Actual Commission (₹K)', fontsize=10)
axes[0, 2].set_title('Estimated vs Actual Commission', fontsize=11, fontweight='bold')
axes[0, 2].legend()
axes[0, 2].grid(alpha=0.3)
plt.colorbar(scatter, ax=axes[0, 2], label='Risk Flag')

# Plot 4: Loan Amount vs Variance
axes[1, 0].scatter(df['loan_amount']/100000, df['commission_variance']/1000, 
                   alpha=0.4, c='#3498db', s=15, edgecolors='black', linewidth=0.5)
axes[1, 0].axhline(y=0, color='red', linestyle='--', linewidth=2)
axes[1, 0].set_xlabel('Loan Amount (₹L)', fontsize=10)
axes[1, 0].set_ylabel('Commission Variance (₹K)', fontsize=10)
axes[1, 0].set_title('Loan Amount vs Variance', fontsize=11, fontweight='bold')
axes[1, 0].grid(alpha=0.3)

# Plot 5: Processing Days vs Risk
risk_by_days = df.groupby('processing_days')['unclaimed_risk'].mean()
axes[1, 1].plot(risk_by_days.index, risk_by_days.values*100, marker='o', color='#e74c3c', linewidth=2, markersize=4)
axes[1, 1].set_xlabel('Processing Days', fontsize=10)
axes[1, 1].set_ylabel('Risk Rate (%)', fontsize=10)
axes[1, 1].set_title('Processing Time Impact on Risk', fontsize=11, fontweight='bold')
axes[1, 1].grid(alpha=0.3)

# Plot 6: Risk Distribution
risk_counts = df['unclaimed_risk'].value_counts()
colors_risk = ['#2ecc71', '#e74c3c']
axes[1, 2].pie(risk_counts.values, labels=['Safe', 'At-Risk'], autopct='%1.1f%%', 
               colors=colors_risk, startangle=90, textprops={'fontsize': 10})
axes[1, 2].set_title(f'Unclaimed Risk Distribution\n({risk_counts[1]} at-risk cases)', 
                     fontsize=11, fontweight='bold')

# Plot 7: Credit Score vs Variance
axes[2, 0].scatter(df['customer_credit_score'], df['variance_percentage'], 
                   alpha=0.4, c='#9b59b6', s=15, edgecolors='black', linewidth=0.5)
axes[2, 0].axhline(y=0, color='red', linestyle='--', linewidth=2)
axes[2, 0].set_xlabel('Credit Score', fontsize=10)
axes[2, 0].set_ylabel('Variance (%)', fontsize=10)
axes[2, 0].set_title('Credit Score Impact', fontsize=11, fontweight='bold')
axes[2, 0].grid(alpha=0.3)

# Plot 8: Correlation Heatmap (Numerical Features)
numerical_cols = ['loan_amount', 'loan_tenure_months', 'interest_rate', 'customer_credit_score',
                  'down_payment_percent', 'processing_days', 'commission_variance']
corr_matrix = df[numerical_cols].corr()
sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='coolwarm', center=0, 
            ax=axes[2, 1], cbar_kws={'label': 'Correlation'}, annot_kws={'size': 8})
axes[2, 1].set_title('Feature Correlation Matrix', fontsize=11, fontweight='bold')
axes[2, 1].tick_params(axis='both', labelsize=8)

# Plot 9: Monthly Volume vs Variance
volume_bins = pd.cut(df['dealership_monthly_volume'], bins=5)
volume_variance = df.groupby(volume_bins)['variance_percentage'].mean()
axes[2, 2].bar(range(len(volume_variance)), volume_variance.values, color='#16a085', edgecolor='black')
axes[2, 2].set_xticks(range(len(volume_variance)))
axes[2, 2].set_xticklabels([f'{int(x.left)}-{int(x.right)}' for x in volume_variance.index], 
                           rotation=45, ha='right', fontsize=8)
axes[2, 2].set_xlabel('Monthly Volume Range', fontsize=10)
axes[2, 2].set_ylabel('Avg Variance (%)', fontsize=10)
axes[2, 2].set_title('Volume vs Variance', fontsize=11, fontweight='bold')
axes[2, 2].axhline(y=0, color='red', linestyle='--', linewidth=2)
axes[2, 2].grid(alpha=0.3, axis='y')

plt.tight_layout()
plt.savefig('17_counter_finance_eda.png', dpi=300, bbox_inches='tight')
print("✓ EDA visualizations saved: 17_counter_finance_eda.png")
plt.close()

# ============================================================================
# 5. DATA PREPROCESSING - VARIANCE PREDICTION
# ============================================================================
print("\n[4/9] Preprocessing Data...")

# Prepare data for VARIANCE prediction (Regression)
X_variance = df.drop(['commission_variance', 'variance_percentage', 'actual_commission',
                      'case_id', 'unclaimed_risk', 'estimated_commission'], axis=1).copy()
y_variance = df['commission_variance'].copy()

# Encode categorical features
label_encoders_variance = {}
categorical_cols = ['lender_name', 'lender_type', 'vehicle_type', 'season', 'employment_type']

for col in categorical_cols:
    le = LabelEncoder()
    X_variance[col] = le.fit_transform(X_variance[col])
    label_encoders_variance[col] = le

# Train-test split
X_train_v, X_test_v, y_train_v, y_test_v = train_test_split(
    X_variance, y_variance, test_size=0.2, random_state=42
)

print(f"✓ Variance Prediction - Train: {len(X_train_v)}, Test: {len(X_test_v)}")

# ============================================================================
# 6. FEATURE ENGINEERING
# ============================================================================
print("\n[5/9] Feature Engineering...")

# Feature 1: Loan to Value Ratio
X_train_v['loan_to_value_ratio'] = X_train_v['loan_amount'] / X_train_v['vehicle_value']
X_test_v['loan_to_value_ratio'] = X_test_v['loan_amount'] / X_test_v['vehicle_value']

# Feature 2: Credit Strength Score
X_train_v['credit_strength'] = (X_train_v['customer_credit_score'] / 850) * (1 + X_train_v['cibil_verified'] * 0.2)
X_test_v['credit_strength'] = (X_test_v['customer_credit_score'] / 850) * (1 + X_test_v['cibil_verified'] * 0.2)

# Feature 3: Processing Efficiency
X_train_v['processing_efficiency'] = X_train_v['dealership_monthly_volume'] / (X_train_v['processing_days'] + 1)
X_test_v['processing_efficiency'] = X_test_v['dealership_monthly_volume'] / (X_test_v['processing_days'] + 1)

# Feature 4: Risk Indicator
X_train_v['risk_indicator'] = (
    X_train_v['manual_intervention'] + 
    X_train_v['approval_retracted'] + 
    (X_train_v['customer_previous_defaults'] > 0).astype(int)
)
X_test_v['risk_indicator'] = (
    X_test_v['manual_intervention'] + 
    X_test_v['approval_retracted'] + 
    (X_test_v['customer_previous_defaults'] > 0).astype(int)
)

print("✓ Created 4 engineered features:")
print("  1. loan_to_value_ratio")
print("  2. credit_strength")
print("  3. processing_efficiency")
print("  4. risk_indicator")

# Scale features
scaler_variance = StandardScaler()
X_train_v_scaled = scaler_variance.fit_transform(X_train_v)
X_test_v_scaled = scaler_variance.transform(X_test_v)

# ============================================================================
# 7. MODEL TRAINING - VARIANCE PREDICTION
# ============================================================================
print("\n[6/9] Training Commission Variance Models...")

variance_models = {
    'Random Forest': RandomForestRegressor(n_estimators=150, max_depth=15, min_samples_split=5, random_state=42, n_jobs=-1),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=120, learning_rate=0.1, max_depth=8, random_state=42),
    'Ridge': Ridge(alpha=10.0, random_state=42),
    'Linear Regression': Ridge(alpha=0.1, random_state=42)
}

variance_results = {}
best_r2 = -np.inf
best_variance_model_name = None

for name, model in variance_models.items():
    print(f"\n  Training {name}...")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_v_scaled, y_train_v, 
                                cv=5, scoring='r2', n_jobs=-1)
    
    # Train model
    model.fit(X_train_v_scaled, y_train_v)
    
    # Predictions
    y_pred_v = model.predict(X_test_v_scaled)
    
    # Metrics
    rmse = np.sqrt(mean_squared_error(y_test_v, y_pred_v))
    mae = mean_absolute_error(y_test_v, y_pred_v)
    r2 = r2_score(y_test_v, y_pred_v)
    
    variance_results[name] = {
        'model': model,
        'cv_scores': cv_scores,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'predictions': y_pred_v,
        'rmse': rmse,
        'mae': mae,
        'r2': r2
    }
    
    print(f"    CV R² Score: {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")
    print(f"    Test RMSE: ₹{rmse:,.0f}")
    print(f"    Test MAE: ₹{mae:,.0f}")
    print(f"    Test R²: {r2:.4f}")
    
    if r2 > best_r2:
        best_r2 = r2
        best_variance_model_name = name

print(f"\n✓ Best Variance Model: {best_variance_model_name} (R²: {best_r2:.4f})")

# ============================================================================
# 8. CLASSIFICATION - UNCLAIMED RISK PREDICTION
# ============================================================================
print("\n[7/9] Training Unclaimed Risk Classification...")

# Prepare data for RISK prediction (Classification)
X_risk = df.drop(['unclaimed_risk', 'case_id', 'commission_variance', 
                  'variance_percentage', 'actual_commission', 'estimated_commission'], axis=1).copy()
y_risk = df['unclaimed_risk'].copy()

# Encode categoricals (use same encoders)
label_encoders_risk = {}
for col in categorical_cols:
    le = LabelEncoder()
    X_risk[col] = le.fit_transform(X_risk[col])
    label_encoders_risk[col] = le

# Train-test split
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
    X_risk, y_risk, test_size=0.2, random_state=42, stratify=y_risk
)

# Add same engineered features
for X in [X_train_r, X_test_r]:
    X['loan_to_value_ratio'] = X['loan_amount'] / X['vehicle_value']
    X['credit_strength'] = (X['customer_credit_score'] / 850) * (1 + X['cibil_verified'] * 0.2)
    X['processing_efficiency'] = X['dealership_monthly_volume'] / (X['processing_days'] + 1)
    X['risk_indicator'] = (
        X['manual_intervention'] + 
        X['approval_retracted'] + 
        (X['customer_previous_defaults'] > 0).astype(int)
    )

# Scale
scaler_risk = StandardScaler()
X_train_r_scaled = scaler_risk.fit_transform(X_train_r)
X_test_r_scaled = scaler_risk.transform(X_test_r)

# Train classification models
risk_models = {
    'Random Forest': RandomForestClassifier(n_estimators=120, max_depth=12, random_state=42, class_weight='balanced', n_jobs=-1),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=6, random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000, class_weight='balanced'),
    'SVM': SVC(random_state=42, probability=True, class_weight='balanced', kernel='rbf')
}

risk_results = {}
best_accuracy = 0
best_risk_model_name = None

for name, model in risk_models.items():
    print(f"\n  Training {name}...")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_r_scaled, y_train_r, 
                                cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
                                scoring='accuracy', n_jobs=-1)
    
    # Train
    model.fit(X_train_r_scaled, y_train_r)
    
    # Predictions
    y_pred_r = model.predict(X_test_r_scaled)
    y_pred_proba_r = model.predict_proba(X_test_r_scaled)[:, 1] if hasattr(model, 'predict_proba') else None
    
    # Metrics
    accuracy = accuracy_score(y_test_r, y_pred_r)
    
    risk_results[name] = {
        'model': model,
        'cv_scores': cv_scores,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'predictions': y_pred_r,
        'pred_proba': y_pred_proba_r,
        'accuracy': accuracy
    }
    
    print(f"    CV Accuracy: {cv_scores.mean()*100:.2f}% (±{cv_scores.std()*100:.2f}%)")
    print(f"    Test Accuracy: {accuracy*100:.2f}%")
    
    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_risk_model_name = name

print(f"\n✓ Best Risk Model: {best_risk_model_name} (Accuracy: {best_accuracy*100:.2f}%)")

# ============================================================================
# 9. MODEL EVALUATION & DEPLOYMENT
# ============================================================================
print("\n[8/9] Model Evaluation...")

# Variance Model Evaluation
best_v_model = variance_results[best_variance_model_name]['model']
y_pred_best_v = variance_results[best_variance_model_name]['predictions']

# Risk Model Evaluation
best_r_model = risk_results[best_risk_model_name]['model']
y_pred_best_r = risk_results[best_risk_model_name]['predictions']

# Classification Report
print("\nClassification Report (Risk Prediction):")
print(classification_report(y_test_r, y_pred_best_r, target_names=['Safe', 'At-Risk']))

# Confusion Matrix
cm = confusion_matrix(y_test_r, y_pred_best_r)
print("\nConfusion Matrix:")
print(cm)

# Feature Importance (if tree-based)
if hasattr(best_v_model, 'feature_importances_'):
    feature_importance_v = pd.DataFrame({
        'feature': X_train_v.columns,
        'importance': best_v_model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    print("\nTop 10 Features (Variance Prediction):")
    print(feature_importance_v.to_string(index=False))

# ============================================================================
# 10. SAVE MODELS
# ============================================================================
print("\n[9/9] Saving Models...")

deployment_package = {
    'variance_model': best_v_model,
    'risk_model': best_r_model,
    'scaler_variance': scaler_variance,
    'scaler_risk': scaler_risk,
    'label_encoders_variance': label_encoders_variance,
    'label_encoders_risk': label_encoders_risk,
    'feature_names_variance': list(X_train_v.columns),
    'feature_names_risk': list(X_train_r.columns),
    'variance_model_name': best_variance_model_name,
    'risk_model_name': best_risk_model_name,
    'variance_r2': best_r2,
    'risk_accuracy': best_accuracy,
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('17_counter_finance_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

# Metadata
metadata = {
    'module_name': 'Counter-Finance Revenue Tracking AI',
    'module_id': '17',
    'version': '1.0',
    'model_type': 'Hybrid (Regression + Classification)',
    'targets': {
        'commission_variance': 'Regression',
        'unclaimed_risk': 'Classification'
    },
    'variance_model': best_variance_model_name,
    'risk_model': best_risk_model_name,
    'performance': {
        'variance_r2': f"{best_r2:.4f}",
        'variance_rmse': f"₹{variance_results[best_variance_model_name]['rmse']:,.0f}",
        'variance_mae': f"₹{variance_results[best_variance_model_name]['mae']:,.0f}",
        'risk_accuracy': f"{best_accuracy*100:.2f}%"
    },
    'business_impact': {
        'monthly_leakage_prevented': f"₹{monthly_leakage:,.0f}",
        'at_risk_cases_flagged': f"{unclaimed_rate*100:.1f}%"
    },
    'features_engineered': 4,
    'training_samples': len(df),
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('17_counter_finance_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✓ Models saved:")
print("  - 17_counter_finance_model.pkl")
print("  - 17_counter_finance_metadata.json")
print("  - 17_counter_finance_eda.png")

# ============================================================================
# 11. USAGE EXAMPLE
# ============================================================================
print("\n" + "="*80)
print("USAGE EXAMPLE")
print("="*80)

# Sample case
sample = {
    'lender_name': 'HDFC Bank',
    'lender_type': 'Private Bank',
    'loan_amount': 950000,
    'loan_tenure_months': 60,
    'interest_rate': 10.8,
    'estimated_commission_rate': 3.2,
    'customer_credit_score': 765,
    'customer_income_monthly': 85000,
    'down_payment_percent': 28,
    'vehicle_type': 'SUV',
    'vehicle_value': 1350000,
    'processing_days': 9,
    'documentation_complete': 1,
    'cibil_verified': 1,
    'bank_relationship_months': 42,
    'previous_loans_count': 1,
    'lender_monthly_target_achievement': 0.96,
    'season': 'Q3',
    'dealership_monthly_volume': 92,
    'approval_retracted': 0,
    'manual_intervention': 0,
    'customer_previous_defaults': 0,
    'employment_type': 'Salaried',
    'co_applicant': 1
}

sample_df = pd.DataFrame([sample])

# Encode
for col in categorical_cols:
    sample_df[col] = label_encoders_variance[col].transform(sample_df[col])

# Engineer features
sample_df['loan_to_value_ratio'] = sample_df['loan_amount'] / sample_df['vehicle_value']
sample_df['credit_strength'] = (sample_df['customer_credit_score'] / 850) * (1 + sample_df['cibil_verified'] * 0.2)
sample_df['processing_efficiency'] = sample_df['dealership_monthly_volume'] / (sample_df['processing_days'] + 1)
sample_df['risk_indicator'] = (
    sample_df['manual_intervention'] + 
    sample_df['approval_retracted'] + 
    (sample_df['customer_previous_defaults'] > 0).astype(int)
)

# Scale
sample_v_scaled = scaler_variance.transform(sample_df)
sample_r_scaled = scaler_risk.transform(sample_df)

# Predict
predicted_variance = best_v_model.predict(sample_v_scaled)[0]
predicted_risk = best_r_model.predict(sample_r_scaled)[0]
risk_probability = best_r_model.predict_proba(sample_r_scaled)[0][1] if hasattr(best_r_model, 'predict_proba') else None

estimated_comm = sample['loan_amount'] * sample['estimated_commission_rate'] / 100
predicted_actual = estimated_comm + predicted_variance

print(f"\nPrediction for Loan Case:")
print(f"  Lender: {sample['lender_name']}")
print(f"  Loan Amount: ₹{sample['loan_amount']:,}")
print(f"  Estimated Commission: ₹{estimated_comm:,.0f}")
print(f"  Predicted Actual Commission: ₹{predicted_actual:,.0f}")
print(f"  Predicted Variance: ₹{predicted_variance:,.0f} ({(predicted_variance/estimated_comm)*100:.1f}%)")
print(f"  Unclaimed Risk: {'⚠️  HIGH RISK' if predicted_risk == 1 else '✓ LOW RISK'}")
if risk_probability:
    print(f"  Risk Probability: {risk_probability*100:.1f}%")

if predicted_risk == 1 or predicted_variance < -5000:
    print(f"\n  🔴 ACTION REQUIRED:")
    print(f"    • Flag case for manual review")
    print(f"    • Verify bank payout confirmation")
    print(f"    • Track approval status daily")
    print(f"    • Set up automated reminders")

print("\n" + "="*80)
print("✅ COUNTER-FINANCE REVENUE TRACKING AI COMPLETED!")
print(f"   Monthly Revenue Leakage Prevented: ₹{monthly_leakage:,.0f}")
print("="*80)
