"""
AUTOERA AI Module 10: Customer Churn Prediction
===============================================
Type: Classification
Target: Predicts customer churn with 85% accuracy target
Features: Service frequency, satisfaction scores, communication response, payment behavior

Complete ML Pipeline for Customer Retention
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score, roc_curve
import pickle
from datetime import datetime, timedelta
import json

print("="*80)
print("AUTOERA - CUSTOMER CHURN PREDICTION")
print("="*80)
print("\n[1/9] Generating Customer Churn Dataset...")

np.random.seed(42)
n_customers = 5000

# Generate customer behavior data for churn prediction
data = {
    'customer_id': range(1, n_customers + 1),
    'customer_age': np.random.randint(25, 75, n_customers),
    'account_age_months': np.random.randint(3, 60, n_customers),
    'total_services': np.random.randint(1, 30, n_customers),
    'avg_service_interval_days': np.random.uniform(60, 400, n_customers),
    'last_service_days_ago': np.random.randint(10, 500, n_customers),
    'avg_service_cost': np.random.uniform(1500, 25000, n_customers),
    'total_spent': np.random.uniform(3000, 200000, n_customers),
    'payment_delays': np.random.randint(0, 8, n_customers),
    'missed_appointments': np.random.randint(0, 6, n_customers),
    'complaints_filed': np.random.randint(0, 4, n_customers),
    'satisfaction_score': np.random.uniform(1, 10, n_customers),
    'voice_response_rate': np.random.uniform(0, 1, n_customers),
    'whatsapp_engagement': np.random.uniform(0, 1, n_customers),
    'email_response_rate': np.random.uniform(0, 1, n_customers),
    'loyalty_program_member': np.random.choice([0, 1], n_customers, p=[0.4, 0.6]),
    'referrals_made': np.random.randint(0, 5, n_customers),
    'seasonal_service_pattern': np.random.choice(['Regular', 'Seasonal', 'Emergency'], n_customers),
    'preferred_service_day': np.random.choice(['Weekday', 'Weekend'], n_customers, p=[0.7, 0.3]),
    'distance_to_center_km': np.random.uniform(1, 50, n_customers),
    'competitor_offers_received': np.random.randint(0, 5, n_customers),
    'price_sensitivity_score': np.random.uniform(1, 10, n_customers),
    'service_quality_rating': np.random.uniform(1, 10, n_customers),
    'communication_frequency_score': np.random.uniform(1, 10, n_customers)
}

df = pd.DataFrame(data)

# Create churn target based on realistic customer behavior patterns
df['churn_risk_score'] = 0

# High churn indicators
df.loc[df['last_service_days_ago'] > 300, 'churn_risk_score'] += 3
df.loc[df['satisfaction_score'] < 4, 'churn_risk_score'] += 4
df.loc[df['payment_delays'] > 3, 'churn_risk_score'] += 2
df.loc[df['missed_appointments'] > 2, 'churn_risk_score'] += 2
df.loc[df['complaints_filed'] > 1, 'churn_risk_score'] += 3
df.loc[df['voice_response_rate'] < 0.3, 'churn_risk_score'] += 2
df.loc[df['competitor_offers_received'] > 2, 'churn_risk_score'] += 2
df.loc[df['price_sensitivity_score'] > 7, 'churn_risk_score'] += 1

# Loyalty factors (reduce churn risk)
df.loc[df['loyalty_program_member'] == 1, 'churn_risk_score'] -= 1
df.loc[df['referrals_made'] > 1, 'churn_risk_score'] -= 2
df.loc[df['total_services'] > 15, 'churn_risk_score'] -= 1
df.loc[df['account_age_months'] > 24, 'churn_risk_score'] -= 1

# Create binary churn target
df['customer_churn'] = 0
df.loc[df['churn_risk_score'] >= 5, 'customer_churn'] = 1

# Add some randomness
random_churn = np.random.choice(df[df['customer_churn']==0].index, size=int(n_customers*0.05))
df.loc[random_churn, 'customer_churn'] = 1

churn_rate = df['customer_churn'].mean()

print(f"✓ Dataset created: {len(df)} customers")
print(f"  Churn Rate: {churn_rate*100:.1f}%")
print(f"  Churned Customers: {df['customer_churn'].sum()}")

# EDA
print("\n[2/9] Exploratory Data Analysis...")
print("Dataset Shape:", df.shape)
print("\nTarget Distribution:")
print(df['customer_churn'].value_counts())
print("\nStatistical Summary:")
print(df.describe())

# Visualizations
print("\n[3/9] Creating Visualizations...")

fig, axes = plt.subplots(3, 3, figsize=(16, 12))
fig.suptitle('AUTOERA - Customer Churn Analysis', fontsize=16, fontweight='bold')

# 1. Churn Rate
axes[0, 0].pie(df['customer_churn'].value_counts(), labels=['Retained', 'Churned'], 
              autopct='%1.1f%%', colors=['#2ecc71', '#e74c3c'], startangle=90)
axes[0, 0].set_title(f'Customer Churn Rate: {churn_rate*100:.1f}%')

# 2. Days Since Last Service
axes[0, 1].hist([df[df['customer_churn']==0]['last_service_days_ago'],
                df[df['customer_churn']==1]['last_service_days_ago']],
               bins=30, label=['Retained', 'Churned'], color=['#2ecc71', '#e74c3c'], alpha=0.7)
axes[0, 1].set_xlabel('Days Since Last Service')
axes[0, 1].set_ylabel('Frequency')
axes[0, 1].set_title('Service Recency Impact')
axes[0, 1].legend()
axes[0, 1].axvline(x=300, color='black', linestyle='--', label='Critical: 300 days')

# 3. Satisfaction vs Churn
axes[0, 2].boxplot([df[df['customer_churn']==0]['satisfaction_score'],
                   df[df['customer_churn']==1]['satisfaction_score']],
                  labels=['Retained', 'Churned'])
axes[0, 2].set_ylabel('Satisfaction Score')
axes[0, 2].set_title('Satisfaction Impact on Churn')

# 4. Payment Behavior
payment_churn = df.groupby('payment_delays')['customer_churn'].mean()
axes[1, 0].bar(payment_churn.index, payment_churn.values*100, color='#e74c3c')
axes[1, 0].set_xlabel('Number of Payment Delays')
axes[1, 0].set_ylabel('Churn Rate (%)')
axes[1, 0].set_title('Payment Delays vs Churn')

# 5. Communication Response
axes[1, 1].scatter(df[df['customer_churn']==0]['voice_response_rate'], 
                  df[df['customer_churn']==0]['whatsapp_engagement'],
                  alpha=0.3, label='Retained', c='#2ecc71', s=10)
axes[1, 1].scatter(df[df['customer_churn']==1]['voice_response_rate'], 
                  df[df['customer_churn']==1]['whatsapp_engagement'],
                  alpha=0.3, label='Churned', c='#e74c3c', s=10)
axes[1, 1].set_xlabel('Voice Response Rate')
axes[1, 1].set_ylabel('WhatsApp Engagement')
axes[1, 1].set_title('Communication Engagement')
axes[1, 1].legend()

# 6. Loyalty Program Impact
loyalty_churn = df.groupby('loyalty_program_member')['customer_churn'].mean()
axes[1, 2].bar(['Non-Member', 'Member'], loyalty_churn.values*100, color=['#e74c3c', '#2ecc71'])
axes[1, 2].set_ylabel('Churn Rate (%)')
axes[1, 2].set_title('Loyalty Program Impact')

# 7. Account Age vs Churn
age_bins = pd.cut(df['account_age_months'], bins=6)
age_churn = df.groupby(age_bins)['customer_churn'].mean()
axes[2, 0].plot(range(len(age_churn)), age_churn.values*100, marker='o', color='#3498db', linewidth=2)
axes[2, 0].set_xticks(range(len(age_churn)))
axes[2, 0].set_xticklabels([f"{int(interval.left)}-{int(interval.right)}" for interval in age_churn.index], rotation=45)
axes[2, 0].set_xlabel('Account Age (months)')
axes[2, 0].set_ylabel('Churn Rate (%)')
axes[2, 0].set_title('Account Age vs Churn')
axes[2, 0].grid(True, alpha=0.3)

# 8. Competitor Offers Impact
comp_churn = df.groupby('competitor_offers_received')['customer_churn'].mean()
axes[2, 1].bar(comp_churn.index, comp_churn.values*100, color='#f39c12')
axes[2, 1].set_xlabel('Competitor Offers Received')
axes[2, 1].set_ylabel('Churn Rate (%)')
axes[2, 1].set_title('Competitor Impact')

# 9. Correlation Heatmap
churn_corr_cols = ['customer_churn', 'satisfaction_score', 'last_service_days_ago', 'payment_delays', 
                   'voice_response_rate', 'complaints_filed', 'loyalty_program_member']
corr_matrix = df[churn_corr_cols].corr()
sns.heatmap(corr_matrix, annot=True, cmap='RdYlGn', center=0, ax=axes[2, 2])
axes[2, 2].set_title('Churn Factor Correlations')

plt.tight_layout()
plt.savefig('10_churn_prediction_eda.png', dpi=300, bbox_inches='tight')
print("✓ EDA visualizations saved")

# Preprocessing
print("\n[4/9] Preprocessing Data...")

X = df.drop(['customer_churn', 'customer_id', 'churn_risk_score'], axis=1)
y = df['customer_churn']

# Encode categorical variables
label_encoders = {}
categorical_cols = ['seasonal_service_pattern', 'preferred_service_day']

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

# Split data with stratification
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✓ Data prepared - Train: {len(X_train)}, Test: {len(X_test)}")
print(f"  Train churn rate: {y_train.mean()*100:.1f}%")
print(f"  Test churn rate: {y_test.mean()*100:.1f}%")

# Feature Engineering
print("\n[5/9] Feature Engineering...")

# Customer value score
X_train['customer_value_score'] = (X_train['total_spent'] / X_train['account_age_months']) * X_train['satisfaction_score']
X_test['customer_value_score'] = (X_test['total_spent'] / X_test['account_age_months']) * X_test['satisfaction_score']

# Engagement score
X_train['engagement_score'] = (X_train['voice_response_rate'] + X_train['whatsapp_engagement'] + X_train['email_response_rate']) / 3
X_test['engagement_score'] = (X_test['voice_response_rate'] + X_test['whatsapp_engagement'] + X_test['email_response_rate']) / 3

# Risk indicators
X_train['risk_indicators'] = X_train['payment_delays'] + X_train['missed_appointments'] + X_train['complaints_filed']
X_test['risk_indicators'] = X_test['payment_delays'] + X_test['missed_appointments'] + X_test['complaints_filed']

# Service consistency
X_train['service_consistency'] = X_train['total_services'] / (X_train['account_age_months'] / 12)  # Services per year
X_test['service_consistency'] = X_test['total_services'] / (X_test['account_age_months'] / 12)

X_train_final = scaler.fit_transform(X_train)
X_test_final = scaler.transform(X_test)

print("✓ Created 4 engineered features")

# Model Training
print("\n[6/9] Training Churn Prediction Models...")

models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, class_weight='balanced'),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000, class_weight='balanced'),
    'SVM': SVC(random_state=42, probability=True, class_weight='balanced')
}

results = {}
for name, model in models.items():
    print(f"  Training {name}...")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_final, y_train, cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42), scoring='accuracy')
    
    # Train and predict
    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)
    y_pred_proba = model.predict_proba(X_test_final)[:, 1] if hasattr(model, 'predict_proba') else None
    
    accuracy = accuracy_score(y_test, y_pred)
    
    results[name] = {
        'model': model,
        'cv_scores': cv_scores,
        'cv_mean': cv_scores.mean(),
        'accuracy': accuracy,
        'y_pred': y_pred,
        'y_pred_proba': y_pred_proba
    }
    
    print(f"    CV Accuracy: {cv_scores.mean()*100:.2f}% (±{cv_scores.std()*100:.2f}%)")
    print(f"    Test Accuracy: {accuracy*100:.2f}%")

# Model Evaluation
print("\n[7/9] Model Evaluation...")

best_model_name = max(results, key=lambda x: results[x]['accuracy'])
best_model = results[best_model_name]['model']
best_accuracy = results[best_model_name]['accuracy']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Customer Churn Prediction Performance', fontsize=16, fontweight='bold')

# 1. Model comparison
model_names = list(results.keys())
test_accuracies = [results[m]['accuracy'] for m in model_names]
cv_accuracies = [results[m]['cv_mean'] for m in model_names]

x = np.arange(len(model_names))
width = 0.35

axes[0, 0].bar(x - width/2, [a*100 for a in cv_accuracies], width, label='CV Accuracy', color='#3498db')
axes[0, 0].bar(x + width/2, [a*100 for a in test_accuracies], width, label='Test Accuracy', color='#2ecc71')
axes[0, 0].set_xticks(x)
axes[0, 0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0, 0].set_ylabel('Accuracy (%)')
axes[0, 0].set_title('Model Performance Comparison')
axes[0, 0].axhline(y=85, color='r', linestyle='--', label='Target: 85%')
axes[0, 0].legend()

# 2. Confusion Matrix
cm = confusion_matrix(y_test, results[best_model_name]['y_pred'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0, 1])
axes[0, 1].set_title(f'Confusion Matrix - {best_model_name}')
axes[0, 1].set_ylabel('True Label')
axes[0, 1].set_xlabel('Predicted Label')

# 3. ROC Curve
if results[best_model_name]['y_pred_proba'] is not None:
    fpr, tpr, _ = roc_curve(y_test, results[best_model_name]['y_pred_proba'])
    auc = roc_auc_score(y_test, results[best_model_name]['y_pred_proba'])
    axes[1, 0].plot(fpr, tpr, label=f'AUC = {auc:.3f}', color='#2ecc71', linewidth=2)
    axes[1, 0].plot([0, 1], [0, 1], 'r--', label='Random')
    axes[1, 0].set_xlabel('False Positive Rate')
    axes[1, 0].set_ylabel('True Positive Rate')
    axes[1, 0].set_title('ROC Curve')
    axes[1, 0].legend()

# 4. Feature Importance
if hasattr(best_model, 'feature_importances_'):
    importance_df = pd.DataFrame({
        'feature': list(X_train.columns),
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    
    axes[1, 1].barh(range(len(importance_df)), importance_df['importance'], color='#e74c3c')
    axes[1, 1].set_yticks(range(len(importance_df)))
    axes[1, 1].set_yticklabels(importance_df['feature'])
    axes[1, 1].set_xlabel('Feature Importance')
    axes[1, 1].set_title('Top 10 Churn Predictors')
    axes[1, 1].invert_yaxis()

plt.tight_layout()
plt.savefig('10_churn_prediction_results.png', dpi=300, bbox_inches='tight')

print(f"\n✓ Best Model: {best_model_name}")
print(f"  Test Accuracy: {best_accuracy*100:.2f}%")
print(f"  Target Achievement: {'✓ YES' if best_accuracy >= 0.85 else '✗ NO'}")

print(f"\nClassification Report:")
print(classification_report(y_test, results[best_model_name]['y_pred']))

# Deployment
print("\n[8/9] Saving Model...")

deployment_package = {
    'model': best_model,
    'scaler': scaler,
    'label_encoders': label_encoders,
    'feature_names': list(X_train.columns),
    'model_name': best_model_name,
    'accuracy': best_accuracy,
    'target_accuracy': 0.85,
    'churn_rate': churn_rate,
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('10_churn_prediction_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

# Churn risk assessment function
def assess_churn_risk(probability):
    if probability >= 0.7:
        return "HIGH RISK"
    elif probability >= 0.4:
        return "MEDIUM RISK"
    else:
        return "LOW RISK"

metadata = {
    'module_name': 'Customer Churn Prediction',
    'module_id': '10',
    'model_type': 'Classification',
    'target': 'customer_churn',
    'best_model': best_model_name,
    'accuracy': f"{best_accuracy*100:.2f}%",
    'target_accuracy': '85%',
    'churn_rate': f"{churn_rate*100:.1f}%",
    'target_achieved': bool(best_accuracy >= 0.85),  # Convert numpy bool to Python bool
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('10_churn_prediction_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✓ Model and metadata saved")

# Usage Example
print("\n[9/9] Testing Churn Prediction...")

sample_customer = {
    'customer_age': 45,
    'account_age_months': 18,
    'total_services': 6,
    'avg_service_interval_days': 240,
    'last_service_days_ago': 320,  # High risk factor
    'avg_service_cost': 8500,
    'total_spent': 51000,
    'payment_delays': 2,
    'missed_appointments': 1,
    'complaints_filed': 1,
    'satisfaction_score': 3.5,  # Low satisfaction
    'voice_response_rate': 0.3,  # Low engagement
    'whatsapp_engagement': 0.4,
    'email_response_rate': 0.2,
    'loyalty_program_member': 0,  # Not a member
    'referrals_made': 0,
    'seasonal_service_pattern': 'Regular',
    'preferred_service_day': 'Weekday',
    'distance_to_center_km': 25,
    'competitor_offers_received': 3,  # High risk
    'price_sensitivity_score': 8.5,
    'service_quality_rating': 4.0,
    'communication_frequency_score': 3.0
}

sample_df = pd.DataFrame([sample_customer])

# Encode categorical variables
for col in categorical_cols:
    sample_df[col] = label_encoders[col].transform(sample_df[col])

# Add engineered features
sample_df['customer_value_score'] = (sample_df['total_spent'] / sample_df['account_age_months']) * sample_df['satisfaction_score']
sample_df['engagement_score'] = (sample_df['voice_response_rate'] + sample_df['whatsapp_engagement'] + sample_df['email_response_rate']) / 3
sample_df['risk_indicators'] = sample_df['payment_delays'] + sample_df['missed_appointments'] + sample_df['complaints_filed']
sample_df['service_consistency'] = sample_df['total_services'] / (sample_df['account_age_months'] / 12)

sample_scaled = scaler.transform(sample_df)
churn_prediction = best_model.predict(sample_scaled)[0]
churn_probability = best_model.predict_proba(sample_scaled)[0][1] if hasattr(best_model, 'predict_proba') else None

print(f"\nCustomer Churn Assessment:")
print(f"  Churn Prediction: {'WILL CHURN ⚠️' if churn_prediction == 1 else 'WILL RETAIN ✓'}")
if churn_probability:
    risk_level = assess_churn_risk(churn_probability)
    print(f"  Churn Probability: {churn_probability*100:.1f}%")
    print(f"  Risk Level: {risk_level}")

print(f"\nRetention Recommendations:")
if churn_prediction == 1 or (churn_probability and churn_probability > 0.5):
    print(f"  🎯 IMMEDIATE ACTION REQUIRED:")
    print(f"    • Personal outreach within 48 hours")
    print(f"    • Offer loyalty program enrollment")
    print(f"    • Schedule service appointment")
    print(f"    • Address satisfaction concerns")
    print(f"    • Provide competitive retention offer")

print("\n" + "="*80)
print("✅ CUSTOMER CHURN PREDICTION COMPLETED!")
print("="*80)
print("\nFiles Generated:")
print("  1. 10_churn_prediction_eda.png")
print("  2. 10_churn_prediction_results.png")
print("  3. 10_churn_prediction_model.pkl") 
print("  4. 10_churn_prediction_metadata.json")