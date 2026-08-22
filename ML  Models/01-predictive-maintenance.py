"""
AUTOERA AI Module 01: Predictive Maintenance Engine
====================================================
Type: Classification
Target: Predicts vehicle component failures with 94% accuracy
Features: Vehicle data, service history, mileage, component age

This script follows the complete ML pipeline:
1. Data Collection & Loading
2. Exploratory Data Analysis (EDA)
3. Data Visualization
4. Data Preprocessing
5. Feature Engineering
6. Model Training (Multiple algorithms)
7. Model Evaluation & Testing
8. Best Model Selection
9. Model Deployment (Pickle file)
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

from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score, roc_curve
import joblib
import pickle
import json
from datetime import datetime

# ============================================================================
# 2. DATA COLLECTION & LOADING
# ============================================================================

print("="*80)
print("AUTOERA - PREDICTIVE MAINTENANCE ENGINE")
print("="*80)
print("\n[1/9] Loading Dataset...")

# Generate synthetic automotive service data
np.random.seed(42)
n_samples = 5000

data = {
    'vehicle_id': range(1, n_samples + 1),
    'vehicle_model': np.random.choice(['Honda City', 'Maruti Swift', 'Hyundai Creta', 'Toyota Innova', 'Tata Nexon'], n_samples),
    'vehicle_age_years': np.random.randint(1, 15, n_samples),
    'mileage_km': np.random.randint(5000, 200000, n_samples),
    'last_service_km': np.random.randint(1000, 50000, n_samples),
    'engine_hours': np.random.randint(500, 5000, n_samples),
    'brake_pad_thickness_mm': np.random.uniform(2, 12, n_samples),
    'battery_voltage': np.random.uniform(11.5, 14.5, n_samples),
    'oil_quality_score': np.random.uniform(3, 10, n_samples),
    'tire_tread_depth_mm': np.random.uniform(1, 8, n_samples),
    'coolant_level_percent': np.random.uniform(50, 100, n_samples),
    'num_previous_failures': np.random.randint(0, 5, n_samples),
    'days_since_last_service': np.random.randint(30, 365, n_samples),
    'average_speed_kmh': np.random.uniform(40, 120, n_samples),
    'harsh_braking_count': np.random.randint(0, 100, n_samples),
    'engine_temperature_avg': np.random.uniform(80, 110, n_samples)
}

df = pd.DataFrame(data)

# Create target variable based on logical rules
df['failure_risk'] = 0
df.loc[(df['brake_pad_thickness_mm'] < 4) | (df['battery_voltage'] < 12.2) | 
       (df['oil_quality_score'] < 5) | (df['tire_tread_depth_mm'] < 2) |
       (df['days_since_last_service'] > 270), 'failure_risk'] = 1

# Add some randomness
df.loc[np.random.choice(df[df['failure_risk']==0].index, size=int(n_samples*0.05)), 'failure_risk'] = 1

print(f"✓ Dataset loaded successfully!")
print(f"  Total records: {len(df)}")
print(f"  Features: {len(df.columns)-1}")

# ============================================================================
# 3. EXPLORATORY DATA ANALYSIS (EDA)
# ============================================================================

print("\n[2/9] Performing EDA...")

print("\nDataset Shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())

print("\nDataset Info:")
print(df.info())

print("\nStatistical Summary:")
print(df.describe())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nTarget Variable Distribution:")
print(df['failure_risk'].value_counts())
print(f"\nFailure Rate: {(df['failure_risk'].sum()/len(df)*100):.2f}%")

# ============================================================================
# 4. DATA VISUALIZATION
# ============================================================================

print("\n[3/9] Creating Visualizations...")

# Create visualizations
fig, axes = plt.subplots(3, 3, figsize=(15, 12))
fig.suptitle('AUTOERA - Predictive Maintenance Analysis', fontsize=16, fontweight='bold')

# 1. Target distribution
axes[0, 0].pie(df['failure_risk'].value_counts(), labels=['No Failure', 'Failure'], autopct='%1.1f%%', colors=['#2ecc71', '#e74c3c'])
axes[0, 0].set_title('Failure Risk Distribution')

# 2. Vehicle Age vs Failure
axes[0, 1].hist([df[df['failure_risk']==0]['vehicle_age_years'], df[df['failure_risk']==1]['vehicle_age_years']], 
                label=['No Failure', 'Failure'], bins=15, color=['#2ecc71', '#e74c3c'], alpha=0.7)
axes[0, 1].set_xlabel('Vehicle Age (years)')
axes[0, 1].set_ylabel('Frequency')
axes[0, 1].set_title('Vehicle Age Distribution')
axes[0, 1].legend()

# 3. Mileage vs Failure
axes[0, 2].scatter(df[df['failure_risk']==0]['mileage_km'], df[df['failure_risk']==0]['last_service_km'], 
                  alpha=0.3, label='No Failure', c='#2ecc71')
axes[0, 2].scatter(df[df['failure_risk']==1]['mileage_km'], df[df['failure_risk']==1]['last_service_km'], 
                  alpha=0.3, label='Failure', c='#e74c3c')
axes[0, 2].set_xlabel('Total Mileage (km)')
axes[0, 2].set_ylabel('Last Service (km)')
axes[0, 2].set_title('Mileage vs Last Service')
axes[0, 2].legend()

# 4. Brake Pad Thickness
axes[1, 0].boxplot([df[df['failure_risk']==0]['brake_pad_thickness_mm'], 
                    df[df['failure_risk']==1]['brake_pad_thickness_mm']], 
                   labels=['No Failure', 'Failure'])
axes[1, 0].set_ylabel('Brake Pad Thickness (mm)')
axes[1, 0].set_title('Brake Pad Condition')

# 5. Battery Voltage
axes[1, 1].boxplot([df[df['failure_risk']==0]['battery_voltage'], 
                    df[df['failure_risk']==1]['battery_voltage']], 
                   labels=['No Failure', 'Failure'])
axes[1, 1].set_ylabel('Battery Voltage (V)')
axes[1, 1].set_title('Battery Health')

# 6. Oil Quality
axes[1, 2].boxplot([df[df['failure_risk']==0]['oil_quality_score'], 
                    df[df['failure_risk']==1]['oil_quality_score']], 
                   labels=['No Failure', 'Failure'])
axes[1, 2].set_ylabel('Oil Quality Score')
axes[1, 2].set_title('Engine Oil Condition')

# 7. Days Since Service
axes[2, 0].hist([df[df['failure_risk']==0]['days_since_last_service'], 
                df[df['failure_risk']==1]['days_since_last_service']], 
               bins=20, label=['No Failure', 'Failure'], color=['#2ecc71', '#e74c3c'], alpha=0.7)
axes[2, 0].set_xlabel('Days Since Last Service')
axes[2, 0].set_ylabel('Frequency')
axes[2, 0].set_title('Service Interval Analysis')
axes[2, 0].legend()

# 8. Correlation Heatmap
numeric_cols = df.select_dtypes(include=[np.number]).columns
corr_matrix = df[numeric_cols].corr()
sns.heatmap(corr_matrix[['failure_risk']].sort_values(by='failure_risk', ascending=False), 
            annot=True, cmap='RdYlGn_r', center=0, ax=axes[2, 1])
axes[2, 1].set_title('Feature Correlation with Failure Risk')

# 9. Vehicle Model Distribution
model_failure = df.groupby('vehicle_model')['failure_risk'].mean().sort_values(ascending=False)
axes[2, 2].bar(range(len(model_failure)), model_failure.values, color='#e74c3c')
axes[2, 2].set_xticks(range(len(model_failure)))
axes[2, 2].set_xticklabels(model_failure.index, rotation=45, ha='right')
axes[2, 2].set_ylabel('Failure Rate')
axes[2, 2].set_title('Failure Rate by Vehicle Model')

plt.tight_layout()
plt.savefig('01_predictive_maintenance_eda.png', dpi=300, bbox_inches='tight')
print("✓ Visualizations saved as '01_predictive_maintenance_eda.png'")

# ============================================================================
# 5. DATA PREPROCESSING
# ============================================================================

print("\n[4/9] Preprocessing Data...")

# Separate features and target
X = df.drop(['failure_risk', 'vehicle_id'], axis=1)
y = df['failure_risk']

# Encode categorical variables
label_encoders = {}
categorical_cols = X.select_dtypes(include=['object']).columns

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

print(f"✓ Encoded {len(categorical_cols)} categorical features")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"✓ Train set: {len(X_train)} samples")
print(f"✓ Test set: {len(X_test)} samples")

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print(f"✓ Features scaled using StandardScaler")

# ============================================================================
# 6. FEATURE ENGINEERING
# ============================================================================

print("\n[5/9] Engineering Features...")

# Create additional features
df_train = X_train.copy()
df_test = X_test.copy()

# Service urgency score
df_train['service_urgency'] = (df_train['days_since_last_service'] / 365) * (df_train['mileage_km'] / 100000)
df_test['service_urgency'] = (df_test['days_since_last_service'] / 365) * (df_test['mileage_km'] / 100000)

# Component health index
df_train['component_health'] = (df_train['brake_pad_thickness_mm'] / 12 + 
                                df_train['tire_tread_depth_mm'] / 8 + 
                                df_train['oil_quality_score'] / 10) / 3
df_test['component_health'] = (df_test['brake_pad_thickness_mm'] / 12 + 
                              df_test['tire_tread_depth_mm'] / 8 + 
                              df_test['oil_quality_score'] / 10) / 3

# Maintenance overdue flag
df_train['maintenance_overdue'] = (df_train['days_since_last_service'] > 180).astype(int)
df_test['maintenance_overdue'] = (df_test['days_since_last_service'] > 180).astype(int)

print(f"✓ Created 3 engineered features")

# Update scaled features
X_train_final = scaler.fit_transform(df_train)
X_test_final = scaler.transform(df_test)

# ============================================================================
# 7. MODEL TRAINING
# ============================================================================

print("\n[6/9] Training Multiple Models...")

models = {
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
    'Random Forest': RandomForestClassifier(random_state=42, n_estimators=100),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42),
    'SVM': SVC(random_state=42, probability=True)
}

results = {}

for name, model in models.items():
    print(f"\nTraining {name}...")
    model.fit(X_train_final, y_train)
    
    # Predictions
    y_pred = model.predict(X_test_final)
    y_pred_proba = model.predict_proba(X_test_final)[:, 1] if hasattr(model, 'predict_proba') else None
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    
    results[name] = {
        'model': model,
        'accuracy': accuracy,
        'y_pred': y_pred,
        'y_pred_proba': y_pred_proba
    }
    
    print(f"  Accuracy: {accuracy*100:.2f}%")

# ============================================================================
# 8. MODEL EVALUATION & TESTING
# ============================================================================

print("\n[7/9] Evaluating Models...")

# Create evaluation plots
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('AUTOERA - Model Performance Comparison', fontsize=16, fontweight='bold')

# Model accuracy comparison
model_names = list(results.keys())
accuracies = [results[m]['accuracy'] for m in model_names]

axes[0, 0].bar(range(len(model_names)), [acc*100 for acc in accuracies], color=['#3498db', '#2ecc71', '#e74c3c', '#f39c12'])
axes[0, 0].set_xticks(range(len(model_names)))
axes[0, 0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0, 0].set_ylabel('Accuracy (%)')
axes[0, 0].set_title('Model Accuracy Comparison')
axes[0, 0].axhline(y=94, color='r', linestyle='--', label='Target: 94%')
axes[0, 0].legend()

# Select best model
best_model_name = max(results, key=lambda x: results[x]['accuracy'])
best_model = results[best_model_name]['model']
best_accuracy = results[best_model_name]['accuracy']

print(f"\n✓ Best Model: {best_model_name}")
print(f"  Accuracy: {best_accuracy*100:.2f}%")

# Confusion Matrix
cm = confusion_matrix(y_test, results[best_model_name]['y_pred'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0, 1])
axes[0, 1].set_title(f'Confusion Matrix - {best_model_name}')
axes[0, 1].set_ylabel('True Label')
axes[0, 1].set_xlabel('Predicted Label')

# ROC Curve
if results[best_model_name]['y_pred_proba'] is not None:
    fpr, tpr, _ = roc_curve(y_test, results[best_model_name]['y_pred_proba'])
    auc = roc_auc_score(y_test, results[best_model_name]['y_pred_proba'])
    axes[1, 0].plot(fpr, tpr, label=f'AUC = {auc:.3f}', color='#2ecc71', linewidth=2)
    axes[1, 0].plot([0, 1], [0, 1], 'r--', label='Random')
    axes[1, 0].set_xlabel('False Positive Rate')
    axes[1, 0].set_ylabel('True Positive Rate')
    axes[1, 0].set_title('ROC Curve')
    axes[1, 0].legend()
    print(f"  AUC Score: {auc:.3f}")

# Classification Report
print(f"\nClassification Report:")
print(classification_report(y_test, results[best_model_name]['y_pred']))

# Feature Importance (for tree-based models)
if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'feature': df_train.columns,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    
    axes[1, 1].barh(range(len(feature_importance)), feature_importance['importance'], color='#3498db')
    axes[1, 1].set_yticks(range(len(feature_importance)))
    axes[1, 1].set_yticklabels(feature_importance['feature'])
    axes[1, 1].set_xlabel('Importance')
    axes[1, 1].set_title('Top 10 Feature Importance')
    axes[1, 1].invert_yaxis()

plt.tight_layout()
plt.savefig('01_predictive_maintenance_results.png', dpi=300, bbox_inches='tight')
print("\n✓ Results saved as '01_predictive_maintenance_results.png'")

# ============================================================================
# 9. MODEL DEPLOYMENT
# ============================================================================

print("\n[8/9] Saving Model for Deployment...")

# Create deployment package
deployment_package = {
    'model': best_model,
    'scaler': scaler,
    'label_encoders': label_encoders,
    'feature_names': list(df_train.columns),
    'model_name': best_model_name,
    'accuracy': best_accuracy,
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'target_accuracy': 0.94,
    'achieved_target': best_accuracy >= 0.94
}

# Save as pickle
with open('01_predictive_maintenance_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

print(f"✓ Model saved as '01_predictive_maintenance_model.pkl'")
print(f"  Model Type: {best_model_name}")
print(f"  Accuracy: {best_accuracy*100:.2f}%")
print(f"  Target Achieved: {'✓ Yes' if best_accuracy >= 0.94 else '✗ No'}")

# Save model metadata
metadata = {
    'module_name': 'Predictive Maintenance Engine',
    'module_id': '01',
    'model_type': 'Classification',
    'target_variable': 'failure_risk',
    'best_model': best_model_name,
    'accuracy': f"{best_accuracy*100:.2f}%",
    'training_samples': len(X_train),
    'test_samples': len(X_test),
    'features_count': len(df_train.columns),
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'target_accuracy': '94%',
    'status': 'Production Ready' if best_accuracy >= 0.94 else 'Needs Improvement'
}

with open('01_predictive_maintenance_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"✓ Metadata saved as '01_predictive_maintenance_metadata.json'")

# ============================================================================
# 10. USAGE EXAMPLE
# ============================================================================

print("\n[9/9] Testing Model Prediction...")

# Load model
with open('01_predictive_maintenance_model.pkl', 'rb') as f:
    loaded_package = pickle.load(f)

# Example prediction
sample_data = {
    'vehicle_model': 'Honda City',
    'vehicle_age_years': 8,
    'mileage_km': 95000,
    'last_service_km': 8000,
    'engine_hours': 2500,
    'brake_pad_thickness_mm': 3.5,
    'battery_voltage': 12.1,
    'oil_quality_score': 4.8,
    'tire_tread_depth_mm': 2.5,
    'coolant_level_percent': 75,
    'num_previous_failures': 2,
    'days_since_last_service': 285,
    'average_speed_kmh': 65,
    'harsh_braking_count': 45,
    'engine_temperature_avg': 95
}

sample_df = pd.DataFrame([sample_data])

# Encode and scale
for col in categorical_cols:
    if col in sample_df.columns:
        sample_df[col] = loaded_package['label_encoders'][col].transform(sample_df[col])

# Add engineered features
sample_df['service_urgency'] = (sample_df['days_since_last_service'] / 365) * (sample_df['mileage_km'] / 100000)
sample_df['component_health'] = (sample_df['brake_pad_thickness_mm'] / 12 + 
                                 sample_df['tire_tread_depth_mm'] / 8 + 
                                 sample_df['oil_quality_score'] / 10) / 3
sample_df['maintenance_overdue'] = (sample_df['days_since_last_service'] > 180).astype(int)

sample_scaled = loaded_package['scaler'].transform(sample_df)

# Predict
prediction = loaded_package['model'].predict(sample_scaled)[0]
probability = loaded_package['model'].predict_proba(sample_scaled)[0] if hasattr(loaded_package['model'], 'predict_proba') else None

print(f"\nSample Prediction:")
print(f"  Failure Risk: {'HIGH RISK ⚠️' if prediction == 1 else 'LOW RISK ✓'}")
if probability is not None:
    print(f"  Probability: {probability[1]*100:.1f}%")
print(f"\nRecommendation: {'IMMEDIATE SERVICE REQUIRED' if prediction == 1 else 'Schedule regular maintenance'}")

print("\n" + "="*80)
print("✅ PREDICTIVE MAINTENANCE MODEL COMPLETED SUCCESSFULLY!")
print("="*80)
print("\nFiles Generated:")
print("  1. 01_predictive_maintenance_eda.png")
print("  2. 01_predictive_maintenance_results.png")
print("  3. 01_predictive_maintenance_model.pkl")
print("  4. 01_predictive_maintenance_metadata.json")
print("\n" + "="*80)
