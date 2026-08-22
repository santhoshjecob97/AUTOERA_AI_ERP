"""
AUTOERA AI Module 08: Quality Control AI
========================================
Type: Classification  
Target: Predicts service quality score with 95% accuracy target
Features: Technician ratings, service duration, customer feedback, rework rate

Complete ML Pipeline for Service Quality Prediction
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support
import pickle
from datetime import datetime
import json

print("="*80)
print("AUTOERA - QUALITY CONTROL AI")
print("="*80)
print("\n[1/9] Generating Quality Control Dataset...")

np.random.seed(42)
n_services = 5500

# Generate service quality data
data = {
    'service_id': range(1, n_services + 1),
    'technician_id': np.random.randint(1, 51, n_services),  # 50 technicians
    'technician_experience_years': np.random.randint(1, 20, n_services),
    'technician_rating': np.random.uniform(2, 5, n_services),
    'technician_certifications': np.random.randint(0, 5, n_services),
    'service_type': np.random.choice(['Routine', 'Major', 'Emergency', 'Inspection'], n_services),
    'service_complexity': np.random.uniform(1, 10, n_services),
    'scheduled_duration_hours': np.random.uniform(0.5, 8, n_services),
    'actual_duration_hours': np.random.uniform(0.5, 10, n_services),
    'parts_quality_score': np.random.uniform(3, 10, n_services),
    'equipment_condition': np.random.uniform(5, 10, n_services),
    'bay_cleanliness': np.random.uniform(4, 10, n_services),
    'customer_satisfaction_score': np.random.uniform(1, 10, n_services),
    'follow_procedures': np.random.choice([0, 1], n_services, p=[0.1, 0.9]),
    'safety_compliance': np.random.choice([0, 1], n_services, p=[0.05, 0.95]),
    'previous_rework_rate': np.random.uniform(0, 0.3, n_services),
    'inspection_passed_first_time': np.random.choice([0, 1], n_services, p=[0.15, 0.85]),
    'customer_complaints': np.random.randint(0, 3, n_services),
    'warranty_claims': np.random.randint(0, 2, n_services),
    'time_of_day': np.random.choice(['Morning', 'Afternoon', 'Evening'], n_services),
    'day_of_week': np.random.choice(['Weekday', 'Weekend'], n_services, p=[0.8, 0.2]),
    'workload_pressure': np.random.uniform(0, 1, n_services),
    'training_hours_last_month': np.random.randint(0, 40, n_services)
}

df = pd.DataFrame(data)

# Create service_quality_score (Excellent, Good, Average, Poor)
quality_score = 0

# Positive factors
df['tech_quality'] = (df['technician_rating'] / 5 + 
                      df['technician_experience_years'] / 20 + 
                      df['technician_certifications'] / 5) / 3

df['process_quality'] = (df['follow_procedures'] + 
                         df['safety_compliance'] + 
                         df['inspection_passed_first_time']) / 3

df['resource_quality'] = (df['parts_quality_score'] / 10 + 
                          df['equipment_condition'] / 10 + 
                          df['bay_cleanliness'] / 10) / 3

# Time efficiency
df['time_efficiency'] = 1 - abs(df['actual_duration_hours'] - df['scheduled_duration_hours']) / df['scheduled_duration_hours']
df['time_efficiency'] = df['time_efficiency'].clip(0, 1)

# Overall quality calculation
df['quality_numeric'] = (
    df['tech_quality'] * 0.4 + 
    df['process_quality'] * 0.3 + 
    df['resource_quality'] * 0.2 + 
    df['time_efficiency'] * 0.1
)

# Penalties
df.loc[df['customer_complaints'] > 0, 'quality_numeric'] -= 0.1
df.loc[df['warranty_claims'] > 0, 'quality_numeric'] -= 0.15
df.loc[df['previous_rework_rate'] > 0.2, 'quality_numeric'] -= 0.1
df.loc[df['workload_pressure'] > 0.7, 'quality_numeric'] -= 0.05

# Add noise
df['quality_numeric'] += np.random.normal(0, 0.05, n_services)
df['quality_numeric'] = df['quality_numeric'].clip(0, 1)

# Convert to categories
df['service_quality_score'] = pd.cut(df['quality_numeric'], 
                                     bins=[0, 0.5, 0.7, 0.85, 1.0],
                                     labels=['Poor', 'Average', 'Good', 'Excellent'])

quality_dist = df['service_quality_score'].value_counts(normalize=True)

print(f"✓ Dataset created: {len(df)} service records")
print(f"  Quality Distribution:")
for cat in ['Excellent', 'Good', 'Average', 'Poor']:
    if cat in quality_dist.index:
        print(f"    {cat}: {quality_dist[cat]*100:.1f}%")

# EDA
print("\n[2/9] Exploratory Data Analysis...")
print("Dataset Shape:", df.shape)
print("\nTarget Distribution:")
print(df['service_quality_score'].value_counts())

# Visualizations
print("\n[3/9] Creating Visualizations...")

fig, axes = plt.subplots(3, 3, figsize=(16, 12))
fig.suptitle('AUTOERA - Quality Control Analysis', fontsize=16, fontweight='bold')

# 1. Quality Distribution
quality_counts = df['service_quality_score'].value_counts()
colors = {'Excellent': '#2ecc71', 'Good': '#3498db', 'Average': '#f39c12', 'Poor': '#e74c3c'}
bar_colors = [colors[cat] for cat in quality_counts.index]
axes[0, 0].bar(range(len(quality_counts)), quality_counts.values, color=bar_colors)
axes[0, 0].set_xticks(range(len(quality_counts)))
axes[0, 0].set_xticklabels(quality_counts.index)
axes[0, 0].set_ylabel('Count')
axes[0, 0].set_title('Service Quality Distribution')

# 2. Technician Rating Impact
tech_quality = df.groupby('service_quality_score')['technician_rating'].mean().reindex(['Poor', 'Average', 'Good', 'Excellent'])
axes[0, 1].bar(range(len(tech_quality)), tech_quality.values, color='#9b59b6')
axes[0, 1].set_xticks(range(len(tech_quality)))
axes[0, 1].set_xticklabels(tech_quality.index)
axes[0, 1].set_ylabel('Average Rating')
axes[0, 1].set_title('Technician Rating by Quality')

# 3. Time Efficiency vs Quality
for qual, color in colors.items():
    mask = df['service_quality_score'] == qual
    axes[0, 2].scatter(df.loc[mask, 'scheduled_duration_hours'], 
                      df.loc[mask, 'actual_duration_hours'],
                      alpha=0.4, label=qual, c=color, s=10)
axes[0, 2].plot([0, 10], [0, 10], 'k--', lw=2)
axes[0, 2].set_xlabel('Scheduled Duration (hrs)')
axes[0, 2].set_ylabel('Actual Duration (hrs)')
axes[0, 2].set_title('Time Management by Quality')
axes[0, 2].legend()

# 4. Service Type Analysis
service_quality = pd.crosstab(df['service_type'], df['service_quality_score'], normalize='index') * 100
service_quality.plot(kind='bar', stacked=True, ax=axes[1, 0], 
                    color=[colors['Poor'], colors['Average'], colors['Good'], colors['Excellent']])
axes[1, 0].set_ylabel('Percentage')
axes[1, 0].set_title('Quality by Service Type')
axes[1, 0].legend(title='Quality')
axes[1, 0].set_xticklabels(axes[1, 0].get_xticklabels(), rotation=45)

# 5. Experience vs Quality
exp_quality = df.groupby(pd.cut(df['technician_experience_years'], bins=5))['service_quality_score'].apply(
    lambda x: (x == 'Excellent').sum() / len(x) * 100
)
axes[1, 1].plot(range(len(exp_quality)), exp_quality.values, marker='o', color='#e74c3c', linewidth=2)
axes[1, 1].set_xticks(range(len(exp_quality)))
axes[1, 1].set_xticklabels([f"{int(i.left)}-{int(i.right)}" for i in exp_quality.index], rotation=45)
axes[1, 1].set_xlabel('Experience (years)')
axes[1, 1].set_ylabel('Excellent Quality Rate (%)')
axes[1, 1].set_title('Experience Impact on Excellence')
axes[1, 1].grid(True, alpha=0.3)

# 6. Rework Rate Impact
rework_quality = df.groupby(pd.cut(df['previous_rework_rate'], bins=5))['service_quality_score'].apply(
    lambda x: (x.isin(['Poor', 'Average'])).sum() / len(x) * 100
)
axes[1, 2].bar(range(len(rework_quality)), rework_quality.values, color='#e67e22')
axes[1, 2].set_xticks(range(len(rework_quality)))
axes[1, 2].set_xticklabels([f"{i.left:.1f}-{i.right:.1f}" for i in rework_quality.index], rotation=45)
axes[1, 2].set_xlabel('Rework Rate')
axes[1, 2].set_ylabel('Low Quality Rate (%)')
axes[1, 2].set_title('Rework Impact')

# 7. Customer Satisfaction Correlation
axes[2, 0].boxplot([df[df['service_quality_score']==cat]['customer_satisfaction_score'].values 
                    for cat in ['Poor', 'Average', 'Good', 'Excellent']],
                   labels=['Poor', 'Average', 'Good', 'Excellent'])
axes[2, 0].set_ylabel('Customer Satisfaction')
axes[2, 0].set_title('Quality vs Customer Satisfaction')

# 8. Complaint Analysis
complaint_quality = df.groupby('customer_complaints')['service_quality_score'].apply(
    lambda x: (x == 'Poor').sum() / len(x) * 100
)
axes[2, 1].bar(complaint_quality.index, complaint_quality.values, color='#c0392b')
axes[2, 1].set_xlabel('Number of Complaints')
axes[2, 1].set_ylabel('Poor Quality Rate (%)')
axes[2, 1].set_title('Complaints vs Quality')

# 9. Correlation Heatmap
corr_cols = ['technician_rating', 'technician_experience_years', 'parts_quality_score',
             'customer_satisfaction_score', 'quality_numeric']
corr_matrix = df[corr_cols].corr()
sns.heatmap(corr_matrix, annot=True, cmap='RdYlGn', center=0, ax=axes[2, 2])
axes[2, 2].set_title('Quality Factor Correlations')

plt.tight_layout()
plt.savefig('08_quality_control_eda.png', dpi=300, bbox_inches='tight')
print("✓ EDA visualizations saved")

# Preprocessing
print("\n[4/9] Preprocessing Data...")

X = df.drop(['service_quality_score', 'service_id', 'quality_numeric', 'tech_quality',
             'process_quality', 'resource_quality', 'time_efficiency', 'technician_id'], axis=1)
y = df['service_quality_score']

# Encode categorical
label_encoders = {}
categorical_cols = ['service_type', 'time_of_day', 'day_of_week']

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

# Encode target
target_encoder = LabelEncoder()
y_encoded = target_encoder.fit_transform(y)

# Split and scale - Remove stratification due to small class sizes
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✓ Data prepared - Train: {len(X_train)}, Test: {len(X_test)}")

# Feature Engineering
print("\n[5/9] Feature Engineering...")

X_train['quality_index'] = (X_train['technician_rating'] / 5 + X_train['parts_quality_score'] / 10) / 2
X_test['quality_index'] = (X_test['technician_rating'] / 5 + X_test['parts_quality_score'] / 10) / 2

X_train['compliance_score'] = X_train['follow_procedures'] + X_train['safety_compliance']
X_test['compliance_score'] = X_test['follow_procedures'] + X_test['safety_compliance']

X_train['performance_pressure'] = X_train['workload_pressure'] * X_train['service_complexity']
X_test['performance_pressure'] = X_test['workload_pressure'] * X_test['service_complexity']

X_train_final = scaler.fit_transform(X_train)
X_test_final = scaler.transform(X_test)

print("✓ Created 3 engineered features")

# Model Training
print("\n[6/9] Training Quality Prediction Models...")

models = {
    'Random Forest': RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42, class_weight='balanced'),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42),
    'AdaBoost': AdaBoostClassifier(n_estimators=100, random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000, multi_class='multinomial')
}

results = {}
for name, model in models.items():
    print(f"  Training {name}...")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_final, y_train, 
                                cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42), 
                                scoring='accuracy')
    
    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
    
    results[name] = {
        'model': model,
        'cv_scores': cv_scores,
        'cv_mean': cv_scores.mean(),
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'y_pred': y_pred
    }
    
    print(f"    CV Accuracy: {cv_scores.mean()*100:.2f}% (±{cv_scores.std()*100:.2f}%)")
    print(f"    Test Accuracy: {accuracy*100:.2f}%")

# Evaluation
print("\n[7/9] Model Evaluation...")

best_model_name = max(results, key=lambda x: results[x]['accuracy'])
best_model = results[best_model_name]['model']
best_accuracy = results[best_model_name]['accuracy']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Quality Control Prediction Performance', fontsize=16, fontweight='bold')

# Model comparison
model_names = list(results.keys())
accuracies = [results[m]['accuracy'] for m in model_names]
axes[0, 0].bar(range(len(model_names)), [a*100 for a in accuracies], 
              color=['#3498db', '#2ecc71', '#e74c3c', '#f39c12'])
axes[0, 0].set_xticks(range(len(model_names)))
axes[0, 0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0, 0].set_ylabel('Accuracy (%)')
axes[0, 0].set_title('Model Performance')
axes[0, 0].axhline(y=95, color='r', linestyle='--', label='Target: 95%')
axes[0, 0].legend()

# Confusion Matrix
cm = confusion_matrix(y_test, results[best_model_name]['y_pred'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0, 1],
           xticklabels=target_encoder.classes_, yticklabels=target_encoder.classes_)
axes[0, 1].set_title(f'Confusion Matrix - {best_model_name}')
axes[0, 1].set_ylabel('True Quality')
axes[0, 1].set_xlabel('Predicted Quality')

# Precision-Recall-F1
metrics_df = pd.DataFrame({
    'Metric': ['Precision', 'Recall', 'F1-Score'],
    'Score': [results[best_model_name]['precision'],
              results[best_model_name]['recall'],
              results[best_model_name]['f1']]
})
axes[1, 0].bar(range(len(metrics_df)), metrics_df['Score']*100, color=['#3498db', '#2ecc71', '#f39c12'])
axes[1, 0].set_xticks(range(len(metrics_df)))
axes[1, 0].set_xticklabels(metrics_df['Metric'])
axes[1, 0].set_ylabel('Score (%)')
axes[1, 0].set_title('Performance Metrics')
axes[1, 0].axhline(y=95, color='r', linestyle='--')

# Feature Importance
if hasattr(best_model, 'feature_importances_'):
    importance_df = pd.DataFrame({
        'feature': list(X_train.columns),
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    
    axes[1, 1].barh(range(len(importance_df)), importance_df['importance'], color='#e74c3c')
    axes[1, 1].set_yticks(range(len(importance_df)))
    axes[1, 1].set_yticklabels(importance_df['feature'])
    axes[1, 1].set_xlabel('Importance')
    axes[1, 1].set_title('Top Quality Indicators')
    axes[1, 1].invert_yaxis()

plt.tight_layout()
plt.savefig('08_quality_control_results.png', dpi=300, bbox_inches='tight')

print(f"\n✓ Best Model: {best_model_name}")
print(f"  Accuracy: {best_accuracy*100:.2f}%")
print(f"  Target Achievement: {'✓ YES' if best_accuracy >= 0.95 else '✗ NO'}")

print(f"\nClassification Report:")
# Get unique classes in test set
unique_classes = sorted(set(y_test) | set(results[best_model_name]['y_pred']))
class_names = [target_encoder.classes_[i] for i in unique_classes]
print(classification_report(y_test, results[best_model_name]['y_pred'], 
                          labels=unique_classes,
                          target_names=class_names))

# Deployment
print("\n[8/9] Saving Model...")

deployment_package = {
    'model': best_model,
    'scaler': scaler,
    'label_encoders': label_encoders,
    'target_encoder': target_encoder,
    'feature_names': list(X_train.columns),
    'model_name': best_model_name,
    'accuracy': best_accuracy,
    'target_accuracy': 0.95,
    'quality_classes': list(target_encoder.classes_),
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('08_quality_control_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

metadata = {
    'module_name': 'Quality Control AI',
    'module_id': '08',
    'model_type': 'Classification',
    'target': 'service_quality_score',
    'classes': list(target_encoder.classes_),
    'best_model': best_model_name,
    'accuracy': f"{best_accuracy*100:.2f}%",
    'precision': f"{results[best_model_name]['precision']*100:.2f}%",
    'target_accuracy': '95%',
    'target_achieved': 'Yes' if best_accuracy >= 0.95 else 'No',
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('08_quality_control_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✓ Model saved successfully")

# Usage Example
print("\n[9/9] Testing Quality Prediction...")

sample_service = {
    'technician_experience_years': 8,
    'technician_rating': 4.5,
    'technician_certifications': 3,
    'service_type': 'Routine',
    'service_complexity': 4.5,
    'scheduled_duration_hours': 2.0,
    'actual_duration_hours': 2.1,
    'parts_quality_score': 9.0,
    'equipment_condition': 8.5,
    'bay_cleanliness': 9.0,
    'customer_satisfaction_score': 8.5,
    'follow_procedures': 1,
    'safety_compliance': 1,
    'previous_rework_rate': 0.05,
    'inspection_passed_first_time': 1,
    'customer_complaints': 0,
    'warranty_claims': 0,
    'time_of_day': 'Morning',
    'day_of_week': 'Weekday',
    'workload_pressure': 0.4,
    'training_hours_last_month': 8
}

sample_df = pd.DataFrame([sample_service])
for col in categorical_cols:
    sample_df[col] = label_encoders[col].transform(sample_df[col])

sample_df['quality_index'] = (sample_df['technician_rating'] / 5 + sample_df['parts_quality_score'] / 10) / 2
sample_df['compliance_score'] = sample_df['follow_procedures'] + sample_df['safety_compliance']
sample_df['performance_pressure'] = sample_df['workload_pressure'] * sample_df['service_complexity']

sample_scaled = scaler.transform(sample_df)
predicted_quality = best_model.predict(sample_scaled)[0]
quality_label = target_encoder.inverse_transform([predicted_quality])[0]

if hasattr(best_model, 'predict_proba'):
    probabilities = best_model.predict_proba(sample_scaled)[0]
    prob_dict = {target_encoder.classes_[i]: prob for i, prob in enumerate(probabilities)}
    
    print(f"\nService Quality Prediction:")
    print(f"  Predicted Quality: {quality_label}")
    print(f"\n  Quality Probabilities:")
    for qual, prob in sorted(prob_dict.items(), key=lambda x: x[1], reverse=True):
        print(f"    {qual}: {prob*100:.1f}%")
else:
    print(f"\nService Quality Prediction: {quality_label}")

print("\n" + "="*80)
print("✅ QUALITY CONTROL AI COMPLETED!")
print("="*80)