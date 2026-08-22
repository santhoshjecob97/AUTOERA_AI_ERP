"""
AUTOERA AI Module 02: Smart Scheduling Engine
==============================================
Type: Classification
Target: Predicts if service is due soon (next 30 days)
Features: Service history, mileage, customer behavior

Complete ML Pipeline with EDA, Visualization, Training, Testing, and Deployment
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pickle
from datetime import datetime, timedelta
import json

print("="*80)
print("AUTOERA - SMART SCHEDULING ENGINE")
print("="*80)
print("\n[1/9] Loading Dataset...")

# Generate synthetic data
np.random.seed(42)
n_samples = 5000

# Generate dates
base_date = datetime.now()
last_service_dates = [base_date - timedelta(days=np.random.randint(1, 365)) for _ in range(n_samples)]
days_since_service = [(base_date - date).days for date in last_service_dates]

data = {
    'customer_id': range(1, n_samples + 1),
    'vehicle_model': np.random.choice(['Honda City', 'Maruti Swift', 'Hyundai Creta', 'Toyota Innova'], n_samples),
    'days_since_last_service': days_since_service,
    'mileage_since_service': np.random.randint(500, 15000, n_samples),
    'total_vehicle_mileage': np.random.randint(10000, 200000, n_samples),
    'service_interval_days': np.random.choice([90, 120, 180, 365], n_samples),
    'average_monthly_mileage': np.random.randint(500, 3000, n_samples),
    'num_previous_services': np.random.randint(1, 20, n_samples),
    'missed_services_count': np.random.randint(0, 5, n_samples),
    'customer_segment': np.random.choice(['Premium', 'Regular', 'Occasional'], n_samples),
    'preferred_service_day': np.random.choice(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], n_samples),
    'last_service_cost': np.random.uniform(2000, 15000, n_samples),
    'loyalty_score': np.random.uniform(0, 100, n_samples)
}

df = pd.DataFrame(data)

# Create target: service_due_soon (within next 30 days)
df['service_due_soon'] = 0
df.loc[(df['days_since_last_service'] + 30 >= df['service_interval_days']) |
       (df['mileage_since_service'] + 1000 >= 10000), 'service_due_soon'] = 1

print(f"✓ Dataset loaded: {len(df)} records")
print(f"  Service Due Soon: {df['service_due_soon'].sum()} ({df['service_due_soon'].mean()*100:.1f}%)")

# EDA
print("\n[2/9] Exploratory Data Analysis...")
print("\nDataset Shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())
print("\nStatistical Summary:")
print(df.describe())

# Visualizations
print("\n[3/9] Creating Visualizations...")

fig, axes = plt.subplots(3, 2, figsize=(14, 12))
fig.suptitle('AUTOERA - Smart Scheduling Analysis', fontsize=16, fontweight='bold')

# 1. Target Distribution
axes[0, 0].pie(df['service_due_soon'].value_counts(), labels=['Not Due', 'Due Soon'], 
              autopct='%1.1f%%', colors=['#2ecc71', '#e74c3c'])
axes[0, 0].set_title('Service Due Distribution')

# 2. Days Since Service Distribution
axes[0, 1].hist([df[df['service_due_soon']==0]['days_since_last_service'],
                df[df['service_due_soon']==1]['days_since_last_service']],
               bins=30, label=['Not Due', 'Due Soon'], color=['#2ecc71', '#e74c3c'], alpha=0.7)
axes[0, 1].set_xlabel('Days Since Last Service')
axes[0, 1].set_ylabel('Frequency')
axes[0, 1].set_title('Service Interval Analysis')
axes[0, 1].legend()
axes[0, 1].axvline(x=150, color='r', linestyle='--', label='120-day interval')

# 3. Mileage vs Service Due
axes[1, 0].scatter(df[df['service_due_soon']==0]['days_since_last_service'], 
                  df[df['service_due_soon']==0]['mileage_since_service'],
                  alpha=0.3, label='Not Due', c='#2ecc71')
axes[1, 0].scatter(df[df['service_due_soon']==1]['days_since_last_service'], 
                  df[df['service_due_soon']==1]['mileage_since_service'],
                  alpha=0.3, label='Due Soon', c='#e74c3c')
axes[1, 0].set_xlabel('Days Since Service')
axes[1, 0].set_ylabel('Mileage Since Service')
axes[1, 0].set_title('Days vs Mileage Analysis')
axes[1, 0].legend()

# 4. Customer Segment Analysis
segment_due = df.groupby('customer_segment')['service_due_soon'].mean()
axes[1, 1].bar(range(len(segment_due)), segment_due.values, color=['#3498db', '#2ecc71', '#e74c3c'])
axes[1, 1].set_xticks(range(len(segment_due)))
axes[1, 1].set_xticklabels(segment_due.index)
axes[1, 1].set_ylabel('Service Due Rate')
axes[1, 1].set_title('Service Due by Customer Segment')

# 5. Vehicle Model Analysis
model_stats = df.groupby('vehicle_model').agg({
    'service_due_soon': 'mean',
    'days_since_last_service': 'mean'
})
x = np.arange(len(model_stats))
width = 0.35
axes[2, 0].bar(x - width/2, model_stats['service_due_soon']*100, width, label='Due Rate (%)', color='#e74c3c')
axes[2, 0].bar(x + width/2, model_stats['days_since_last_service']/10, width, label='Avg Days/10', color='#3498db')
axes[2, 0].set_xticks(x)
axes[2, 0].set_xticklabels(model_stats.index, rotation=45, ha='right')
axes[2, 0].set_title('Service Patterns by Vehicle Model')
axes[2, 0].legend()

# 6. Correlation Heatmap
numeric_cols = df.select_dtypes(include=[np.number]).columns
corr = df[numeric_cols].corr()[['service_due_soon']].sort_values(by='service_due_soon', ascending=False)
sns.heatmap(corr, annot=True, cmap='RdYlGn_r', center=0, ax=axes[2, 1])
axes[2, 1].set_title('Feature Correlation with Service Due')

plt.tight_layout()
plt.savefig('02_smart_scheduling_eda.png', dpi=300, bbox_inches='tight')
print("✓ Visualizations saved")

# Preprocessing
print("\n[4/9] Preprocessing Data...")

X = df.drop(['service_due_soon', 'customer_id'], axis=1)
y = df['service_due_soon']

# Encode categorical variables
label_encoders = {}
for col in ['vehicle_model', 'customer_segment', 'preferred_service_day']:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✓ Train set: {len(X_train)}, Test set: {len(X_test)}")

# Feature Engineering
print("\n[5/9] Feature Engineering...")

X_train['service_ratio'] = X_train['days_since_last_service'] / X_train['service_interval_days']
X_test['service_ratio'] = X_test['days_since_last_service'] / X_test['service_interval_days']

X_train['mileage_factor'] = X_train['mileage_since_service'] / X_train['average_monthly_mileage']
X_test['mileage_factor'] = X_test['mileage_since_service'] / X_test['average_monthly_mileage']

X_train_final = scaler.fit_transform(X_train)
X_test_final = scaler.transform(X_test)

print("✓ Created 2 engineered features")

# Model Training
print("\n[6/9] Training Models...")

models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42),
    'Decision Tree': DecisionTreeClassifier(random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000)
}

results = {}
for name, model in models.items():
    print(f"  Training {name}...")
    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)
    accuracy = accuracy_score(y_test, y_pred)
    results[name] = {'model': model, 'accuracy': accuracy, 'y_pred': y_pred}
    print(f"    Accuracy: {accuracy*100:.2f}%")

# Evaluation
print("\n[7/9] Evaluating Models...")

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle('Model Performance - Smart Scheduling', fontsize=16, fontweight='bold')

# Accuracy comparison
model_names = list(results.keys())
accuracies = [results[m]['accuracy'] for m in model_names]
axes[0].bar(range(len(model_names)), [a*100 for a in accuracies], color=['#3498db', '#2ecc71', '#e74c3c', '#f39c12'])
axes[0].set_xticks(range(len(model_names)))
axes[0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0].set_ylabel('Accuracy (%)')
axes[0].set_title('Model Accuracy Comparison')

# Best model confusion matrix
best_model_name = max(results, key=lambda x: results[x]['accuracy'])
cm = confusion_matrix(y_test, results[best_model_name]['y_pred'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[1])
axes[1].set_title(f'Confusion Matrix - {best_model_name}')
axes[1].set_ylabel('True')
axes[1].set_xlabel('Predicted')

plt.tight_layout()
plt.savefig('02_smart_scheduling_results.png', dpi=300, bbox_inches='tight')
print(f"✓ Best Model: {best_model_name} ({results[best_model_name]['accuracy']*100:.2f}%)")

# Deployment
print("\n[8/9] Saving Model...")

deployment_package = {
    'model': results[best_model_name]['model'],
    'scaler': scaler,
    'label_encoders': label_encoders,
    'feature_names': list(X_train.columns),
    'model_name': best_model_name,
    'accuracy': results[best_model_name]['accuracy'],
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('02_smart_scheduling_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

metadata = {
    'module_name': 'Smart Scheduling Engine',
    'module_id': '02',
    'model_type': 'Classification',
    'target': 'service_due_soon',
    'best_model': best_model_name,
    'accuracy': f"{results[best_model_name]['accuracy']*100:.2f}%",
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('02_smart_scheduling_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✓ Model and metadata saved")

# Usage Example
print("\n[9/9] Testing Prediction...")

sample = {
    'vehicle_model': 'Honda City',
    'days_since_last_service': 165,
    'mileage_since_service': 9500,
    'total_vehicle_mileage': 75000,
    'service_interval_days': 180,
    'average_monthly_mileage': 1500,
    'num_previous_services': 8,
    'missed_services_count': 1,
    'customer_segment': 'Premium',
    'preferred_service_day': 'Saturday',
    'last_service_cost': 5500,
    'loyalty_score': 85
}

sample_df = pd.DataFrame([sample])
for col in ['vehicle_model', 'customer_segment', 'preferred_service_day']:
    sample_df[col] = label_encoders[col].transform(sample_df[col])

sample_df['service_ratio'] = sample_df['days_since_last_service'] / sample_df['service_interval_days']
sample_df['mileage_factor'] = sample_df['mileage_since_service'] / sample_df['average_monthly_mileage']

sample_scaled = scaler.transform(sample_df)
prediction = deployment_package['model'].predict(sample_scaled)[0]

print(f"\nPrediction: {'SERVICE DUE SOON ⚠️' if prediction == 1 else 'NOT DUE YET ✓'}")
print(f"Days until service interval: {sample['service_interval_days'] - sample['days_since_last_service']}")

print("\n" + "="*80)
print("✅ SMART SCHEDULING ENGINE COMPLETED!")
print("="*80)
