"""
AUTOERA AI Module 03: Voice Telecaller Conversion Predictor
===========================================================
Type: Classification
Target: Predicts booking conversion probability from voice calls
Features: Call duration, sentiment, customer profile, timing

Complete ML Pipeline
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score, roc_curve
import pickle
from datetime import datetime
import json

print("="*80)
print("AUTOERA - VOICE TELECALLER CONVERSION PREDICTOR")
print("="*80)
print("\n[1/9] Generating Voice Call Dataset...")

np.random.seed(42)
n_samples = 6000

# Generate realistic voice call data
data = {
    'call_id': range(1, n_samples + 1),
    'customer_age': np.random.randint(25, 70, n_samples),
    'customer_segment': np.random.choice(['Premium', 'Regular', 'Occasional', 'New'], n_samples),
    'days_since_last_service': np.random.randint(30, 400, n_samples),
    'call_duration_seconds': np.random.randint(30, 600, n_samples),
    'call_time_hour': np.random.randint(9, 20, n_samples),
    'call_attempt_number': np.random.randint(1, 5, n_samples),
    'previous_bookings': np.random.randint(0, 15, n_samples),
    'missed_appointments': np.random.randint(0, 3, n_samples),
    'vehicle_age_years': np.random.randint(1, 15, n_samples),
    'loyalty_score': np.random.uniform(0, 100, n_samples),
    'sentiment_score': np.random.choice(['Positive', 'Neutral', 'Negative'], n_samples, p=[0.5, 0.3, 0.2]),
    'urgency_level': np.random.choice(['High', 'Medium', 'Low'], n_samples),
    'service_overdue': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
    'voice_propensity_score': np.random.uniform(0, 100, n_samples),
    'last_service_cost': np.random.uniform(2000, 15000, n_samples),
    'preferred_contact': np.random.choice(['Voice', 'WhatsApp', 'Email'], n_samples),
    'call_language': np.random.choice(['English', 'Hindi', 'Tamil'], n_samples)
}

df = pd.DataFrame(data)

# Create target variable (booking_conversion) based on logical rules
df['booking_conversion'] = 0

# High conversion factors
high_conversion_mask = (
    (df['call_duration_seconds'] > 120) &
    (df['sentiment_score'] == 'Positive') &
    (df['service_overdue'] == 1) &
    (df['voice_propensity_score'] > 60) &
    (df['customer_segment'].isin(['Premium', 'Regular']))
)

df.loc[high_conversion_mask, 'booking_conversion'] = 1

# Medium conversion
medium_conversion_mask = (
    (df['call_duration_seconds'] > 90) &
    (df['sentiment_score'].isin(['Positive', 'Neutral'])) &
    (df['loyalty_score'] > 50) &
    (df['call_attempt_number'] <= 2)
)

df.loc[medium_conversion_mask & (df['booking_conversion'] == 0), 'booking_conversion'] = np.random.choice([0, 1], sum(medium_conversion_mask & (df['booking_conversion'] == 0)), p=[0.6, 0.4])

# Add some randomness
random_conversions = np.random.choice(df[df['booking_conversion']==0].index, size=int(n_samples*0.05))
df.loc[random_conversions, 'booking_conversion'] = 1

conversion_rate = df['booking_conversion'].mean()

print(f"✓ Dataset created: {len(df)} calls")
print(f"  Conversion Rate: {conversion_rate*100:.1f}% (Target: 25-35%)")

# EDA
print("\n[2/9] Exploratory Data Analysis...")
print(df.info())
print("\nStatistical Summary:")
print(df.describe())
print("\nTarget Distribution:")
print(df['booking_conversion'].value_counts())

# Visualizations
print("\n[3/9] Creating Visualizations...")

fig, axes = plt.subplots(3, 3, figsize=(16, 12))
fig.suptitle('AUTOERA - Voice Telecaller Conversion Analysis', fontsize=16, fontweight='bold')

# 1. Conversion Rate
axes[0, 0].pie(df['booking_conversion'].value_counts(), labels=['No Booking', 'Booked'],
              autopct='%1.1f%%', colors=['#e74c3c', '#2ecc71'], startangle=90)
axes[0, 0].set_title(f'Conversion Rate: {conversion_rate*100:.1f}%')

# 2. Call Duration vs Conversion
axes[0, 1].hist([df[df['booking_conversion']==0]['call_duration_seconds'],
                df[df['booking_conversion']==1]['call_duration_seconds']],
               bins=30, label=['Not Converted', 'Converted'], color=['#e74c3c', '#2ecc71'], alpha=0.7)
axes[0, 1].set_xlabel('Call Duration (seconds)')
axes[0, 1].set_ylabel('Frequency')
axes[0, 1].set_title('Call Duration Impact')
axes[0, 1].legend()
axes[0, 1].axvline(x=120, color='black', linestyle='--', label='120s threshold')

# 3. Sentiment Impact
sentiment_conv = df.groupby('sentiment_score')['booking_conversion'].mean()
axes[0, 2].bar(range(len(sentiment_conv)), sentiment_conv.values*100, color=['#2ecc71', '#f39c12', '#e74c3c'])
axes[0, 2].set_xticks(range(len(sentiment_conv)))
axes[0, 2].set_xticklabels(sentiment_conv.index)
axes[0, 2].set_ylabel('Conversion Rate (%)')
axes[0, 2].set_title('Conversion by Sentiment')

# 4. Customer Segment Analysis
segment_conv = df.groupby('customer_segment')['booking_conversion'].mean()
axes[1, 0].bar(range(len(segment_conv)), segment_conv.values*100, color='#3498db')
axes[1, 0].set_xticks(range(len(segment_conv)))
axes[1, 0].set_xticklabels(segment_conv.index, rotation=45)
axes[1, 0].set_ylabel('Conversion Rate (%)')
axes[1, 0].set_title('Conversion by Customer Segment')

# 5. Call Time Analysis
hourly_conv = df.groupby('call_time_hour')['booking_conversion'].agg(['mean', 'count'])
axes[1, 1].plot(hourly_conv.index, hourly_conv['mean']*100, marker='o', color='#2ecc71', linewidth=2)
axes[1, 1].set_xlabel('Hour of Day')
axes[1, 1].set_ylabel('Conversion Rate (%)')
axes[1, 1].set_title('Best Time to Call')
axes[1, 1].grid(True, alpha=0.3)

# 6. Service Overdue Impact
overdue_conv = df.groupby('service_overdue')['booking_conversion'].mean()
axes[1, 2].bar(['Not Overdue', 'Overdue'], overdue_conv.values*100, color=['#3498db', '#e74c3c'])
axes[1, 2].set_ylabel('Conversion Rate (%)')
axes[1, 2].set_title('Service Overdue Impact')

# 7. Loyalty Score vs Conversion
axes[2, 0].scatter(df[df['booking_conversion']==0]['loyalty_score'], 
                  df[df['booking_conversion']==0]['voice_propensity_score'],
                  alpha=0.3, label='Not Converted', c='#e74c3c', s=10)
axes[2, 0].scatter(df[df['booking_conversion']==1]['loyalty_score'], 
                  df[df['booking_conversion']==1]['voice_propensity_score'],
                  alpha=0.3, label='Converted', c='#2ecc71', s=10)
axes[2, 0].set_xlabel('Loyalty Score')
axes[2, 0].set_ylabel('Voice Propensity Score')
axes[2, 0].set_title('Customer Scores vs Conversion')
axes[2, 0].legend()

# 8. Call Attempt Analysis
attempt_conv = df.groupby('call_attempt_number')['booking_conversion'].mean()
axes[2, 1].plot(attempt_conv.index, attempt_conv.values*100, marker='o', color='#e74c3c', linewidth=2)
axes[2, 1].set_xlabel('Call Attempt Number')
axes[2, 1].set_ylabel('Conversion Rate (%)')
axes[2, 1].set_title('Conversion by Attempt Number')
axes[2, 1].grid(True, alpha=0.3)

# 9. Correlation Heatmap
numeric_cols = df.select_dtypes(include=[np.number]).columns
corr = df[numeric_cols].corr()[['booking_conversion']].sort_values(by='booking_conversion', ascending=False)
sns.heatmap(corr, annot=True, cmap='RdYlGn', center=0, ax=axes[2, 2])
axes[2, 2].set_title('Feature Correlation')

plt.tight_layout()
plt.savefig('03_voice_conversion_eda.png', dpi=300, bbox_inches='tight')
print("✓ Visualizations saved")

# Preprocessing
print("\n[4/9] Preprocessing Data...")

X = df.drop(['booking_conversion', 'call_id'], axis=1)
y = df['booking_conversion']

# Encode categorical variables
label_encoders = {}
categorical_cols = ['customer_segment', 'sentiment_score', 'urgency_level', 'preferred_contact', 'call_language']

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✓ Data split - Train: {len(X_train)}, Test: {len(X_test)}")

# Feature Engineering
print("\n[5/9] Feature Engineering...")

X_train['call_efficiency'] = X_train['booking_conversion'] if 'booking_conversion' in X_train.columns else X_train['call_duration_seconds'] / 60
X_test['call_efficiency'] = X_test['call_duration_seconds'] / 60

X_train['engagement_score'] = (X_train['call_duration_seconds'] / 600) * X_train['loyalty_score']
X_test['engagement_score'] = (X_test['call_duration_seconds'] / 600) * X_test['loyalty_score']

X_train['customer_value'] = X_train['previous_bookings'] * X_train['last_service_cost'] / 1000
X_test['customer_value'] = X_test['previous_bookings'] * X_test['last_service_cost'] / 1000

X_train_final = scaler.fit_transform(X_train.drop('booking_conversion', axis=1, errors='ignore'))
X_test_final = scaler.transform(X_test.drop('booking_conversion', axis=1, errors='ignore'))

print("✓ Created 3 engineered features")

# Model Training
print("\n[6/9] Training Models...")

models = {
    'Random Forest': RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42),
    'AdaBoost': AdaBoostClassifier(n_estimators=100, random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000)
}

results = {}
for name, model in models.items():
    print(f"  Training {name}...")
    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)
    y_pred_proba = model.predict_proba(X_test_final)[:, 1] if hasattr(model, 'predict_proba') else None
    
    accuracy = accuracy_score(y_test, y_pred)
    results[name] = {
        'model': model,
        'accuracy': accuracy,
        'y_pred': y_pred,
        'y_pred_proba': y_pred_proba
    }
    print(f"    Accuracy: {accuracy*100:.2f}%")

# Evaluation
print("\n[7/9] Model Evaluation...")

best_model_name = max(results, key=lambda x: results[x]['accuracy'])
best_model = results[best_model_name]['model']
best_accuracy = results[best_model_name]['accuracy']

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.suptitle('Voice Conversion Model Performance', fontsize=16, fontweight='bold')

# Accuracy comparison
model_names = list(results.keys())
accuracies = [results[m]['accuracy'] for m in model_names]
axes[0].bar(range(len(model_names)), [a*100 for a in accuracies], color=['#3498db', '#2ecc71', '#e74c3c', '#f39c12'])
axes[0].set_xticks(range(len(model_names)))
axes[0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0].set_ylabel('Accuracy (%)')
axes[0].set_title('Model Comparison')
axes[0].axhline(y=80, color='r', linestyle='--', label='Target: 80%')
axes[0].legend()

# Confusion Matrix
cm = confusion_matrix(y_test, results[best_model_name]['y_pred'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[1])
axes[1].set_title(f'Confusion Matrix - {best_model_name}')
axes[1].set_ylabel('True')
axes[1].set_xlabel('Predicted')

# ROC Curve
if results[best_model_name]['y_pred_proba'] is not None:
    fpr, tpr, _ = roc_curve(y_test, results[best_model_name]['y_pred_proba'])
    auc = roc_auc_score(y_test, results[best_model_name]['y_pred_proba'])
    axes[2].plot(fpr, tpr, label=f'AUC = {auc:.3f}', color='#2ecc71', linewidth=2)
    axes[2].plot([0, 1], [0, 1], 'r--', label='Random')
    axes[2].set_xlabel('False Positive Rate')
    axes[2].set_ylabel('True Positive Rate')
    axes[2].set_title('ROC Curve')
    axes[2].legend()

plt.tight_layout()
plt.savefig('03_voice_conversion_results.png', dpi=300, bbox_inches='tight')

print(f"\n✓ Best Model: {best_model_name}")
print(f"  Accuracy: {best_accuracy*100:.2f}%")
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
    'target_conversion_rate': 0.30,
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('03_voice_conversion_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

metadata = {
    'module_name': 'Voice Telecaller Conversion Predictor',
    'module_id': '03',
    'model_type': 'Classification',
    'target': 'booking_conversion',
    'best_model': best_model_name,
    'accuracy': f"{best_accuracy*100:.2f}%",
    'conversion_rate': f"{conversion_rate*100:.1f}%",
    'target_range': '25-35%',
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('03_voice_conversion_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✓ Model saved successfully")

# Usage Example
print("\n[9/9] Testing Prediction...")

sample = {
    'customer_age': 45,
    'customer_segment': 'Premium',
    'days_since_last_service': 195,
    'call_duration_seconds': 185,
    'call_time_hour': 14,
    'call_attempt_number': 1,
    'previous_bookings': 6,
    'missed_appointments': 0,
    'vehicle_age_years': 4,
    'loyalty_score': 82,
    'sentiment_score': 'Positive',
    'urgency_level': 'High',
    'service_overdue': 1,
    'voice_propensity_score': 75,
    'last_service_cost': 7500,
    'preferred_contact': 'Voice',
    'call_language': 'English'
}

sample_df = pd.DataFrame([sample])
for col in categorical_cols:
    sample_df[col] = label_encoders[col].transform(sample_df[col])

sample_df['call_efficiency'] = sample_df['call_duration_seconds'] / 60
sample_df['engagement_score'] = (sample_df['call_duration_seconds'] / 600) * sample_df['loyalty_score']
sample_df['customer_value'] = sample_df['previous_bookings'] * sample_df['last_service_cost'] / 1000

sample_scaled = scaler.transform(sample_df)
prediction = best_model.predict(sample_scaled)[0]
probability = best_model.predict_proba(sample_scaled)[0][1] if hasattr(best_model, 'predict_proba') else None

print(f"\nSample Call Prediction:")
print(f"  Conversion: {'HIGH PROBABILITY ✓' if prediction == 1 else 'LOW PROBABILITY ✗'}")
if probability:
    print(f"  Probability: {probability*100:.1f}%")

print("\n" + "="*80)
print("✅ VOICE TELECALLER CONVERSION PREDICTOR COMPLETED!")
print("="*80)
