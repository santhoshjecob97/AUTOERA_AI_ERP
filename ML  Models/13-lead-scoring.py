"""
AUTOERA AI Module 13: Lead Scoring & Conversion AI
==================================================
Type: Binary Classification
Target: lead_converted (conversion_probability)
Goal: 80% accuracy
Features: Lead source, engagement metrics, demographics, behavioral signals

Complete ML Pipeline for Lead Qualification
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
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (classification_report, confusion_matrix, accuracy_score, 
                            precision_recall_fscore_support, roc_auc_score, roc_curve)
import pickle
from datetime import datetime
import json

# ============================================================================
# 2. DATA COLLECTION & LOADING
# ============================================================================

print("="*80)
print("AUTOERA - LEAD SCORING & CONVERSION AI")
print("="*80)
print("\n[1/9] Loading Dataset...")

np.random.seed(42)
n_leads = 6500

# Generate B2B automotive service lead data
data = {
    'lead_id': range(1, n_leads + 1),
    'lead_source': np.random.choice(['Website', 'Social Media', 'Referral', 'Cold Call', 
                                    'Event', 'Email Campaign', 'Partner'], n_leads),
    'industry_segment': np.random.choice(['Individual', 'Small Workshop', 'Medium Garage', 
                                         'Dealership', 'Fleet Service'], n_leads),
    'company_size_vehicles': np.random.randint(1, 250, n_leads),
    'monthly_service_volume': np.random.randint(5, 600, n_leads),
    'current_software_usage': np.random.choice(['None', 'Basic', 'Advanced', 'Competitor'], n_leads),
    'budget_indicated': np.random.choice(['Not Disclosed', '<25K', '25-50K', '50-100K', '>100K'], n_leads),
    
    # Engagement metrics
    'decision_maker_contacted': np.random.choice([0, 1], n_leads, p=[0.25, 0.75]),
    'email_opens': np.random.randint(0, 20, n_leads),
    'email_clicks': np.random.randint(0, 10, n_leads),
    'website_visits': np.random.randint(0, 35, n_leads),
    'pages_viewed': np.random.randint(0, 50, n_leads),
    'time_on_site_minutes': np.random.uniform(0, 120, n_leads),
    'demo_requested': np.random.choice([0, 1], n_leads, p=[0.55, 0.45]),
    'demo_attended': np.random.choice([0, 1], n_leads, p=[0.7, 0.3]),
    'pricing_page_viewed': np.random.choice([0, 1], n_leads, p=[0.45, 0.55]),
    'case_study_downloaded': np.random.choice([0, 1], n_leads, p=[0.65, 0.35]),
    'video_watched': np.random.choice([0, 1], n_leads, p=[0.6, 0.4]),
    
    # Response & communication
    'response_time_hours': np.random.uniform(0, 72, n_leads),
    'engagement_score': np.random.uniform(0, 100, n_leads),
    'pain_points_identified': np.random.randint(0, 6, n_leads),
    'competitor_evaluation': np.random.choice([0, 1], n_leads, p=[0.55, 0.45]),
    'urgency_level': np.random.choice(['Low', 'Medium', 'High', 'Critical'], n_leads),
    
    # Follow-up & nurturing
    'follow_up_count': np.random.randint(0, 12, n_leads),
    'linkedin_connection': np.random.choice([0, 1], n_leads, p=[0.45, 0.55]),
    'phone_calls_made': np.random.randint(0, 8, n_leads),
    'whatsapp_engaged': np.random.choice([0, 1], n_leads, p=[0.6, 0.4]),
    
    # Interest indicators
    'roi_calculator_used': np.random.choice([0, 1], n_leads, p=[0.75, 0.25]),
    'testimonial_viewed': np.random.choice([0, 1], n_leads, p=[0.7, 0.3]),
    'technical_documentation_downloaded': np.random.choice([0, 1], n_leads, p=[0.8, 0.2]),
    'trial_requested': np.random.choice([0, 1], n_leads, p=[0.85, 0.15]),
    
    # Company indicators
    'company_website_quality': np.random.uniform(1, 10, n_leads),
    'years_in_business': np.random.randint(1, 30, n_leads),
    'online_reviews_count': np.random.randint(0, 500, n_leads),
    'social_media_presence': np.random.uniform(0, 1, n_leads)
}

df = pd.DataFrame(data)

# Create conversion target based on quality indicators
conversion_score = (
    (df['demo_requested'] * 0.20) +
    (df['demo_attended'] * 0.25) +
    (df['decision_maker_contacted'] * 0.18) +
    (df['pricing_page_viewed'] * 0.12) +
    (df['engagement_score'] / 100 * 0.12) +
    (df['pain_points_identified'] / 6 * 0.08) +
    (df['case_study_downloaded'] * 0.08) +
    (df['roi_calculator_used'] * 0.10) +
    (df['trial_requested'] * 0.15) +
    (df['technical_documentation_downloaded'] * 0.05)
)

# Penalties for negative signals
conversion_score -= (df['response_time_hours'] / 72 * 0.08)
conversion_score -= ((df['follow_up_count'] > 8).astype(int) * 0.10)  # Too many follow-ups
conversion_score -= ((df['current_software_usage'] == 'Advanced').astype(int) * 0.05)

# Boost for positive signals
urgency_boost = {'Low': 0.0, 'Medium': 0.05, 'High': 0.10, 'Critical': 0.15}
df['urgency_boost'] = df['urgency_level'].map(urgency_boost)
conversion_score += df['urgency_boost']

# Add noise
conversion_score += np.random.normal(0, 0.12, n_leads)
conversion_score = np.clip(conversion_score, 0, 1)

# Create binary conversion target (realistic 20-25% conversion rate)
df['lead_converted'] = (conversion_score > 0.65).astype(int)

# Adjust to realistic conversion rate
actual_conv_rate = df['lead_converted'].mean()
if actual_conv_rate > 0.27:
    # Reduce conversions
    convert_sample = df[df['lead_converted']==1].sample(frac=0.25, random_state=42).index
    df.loc[convert_sample, 'lead_converted'] = 0

conversion_rate = df['lead_converted'].mean()
converted_count = df['lead_converted'].sum()

print(f"✓ Dataset loaded: {len(df)} leads")
print(f"  Features: {len(df.columns)-1}")
print(f"\nConversion Statistics:")
print(f"  Conversion Rate: {conversion_rate*100:.1f}%")
print(f"  Converted Leads: {converted_count}")
print(f"  Not Converted: {len(df) - converted_count}")

# ============================================================================
# 3. EXPLORATORY DATA ANALYSIS (EDA)
# ============================================================================

print("\n[2/9] Exploratory Data Analysis...")

print("\nDataset Shape:", df.shape)
print("\nFirst 5 rows:")
print(df[['lead_source', 'industry_segment', 'engagement_score', 'demo_requested', 'lead_converted']].head())

print("\nConversion by Lead Source:")
print(df.groupby('lead_source')['lead_converted'].agg(['sum', 'mean', 'count']))

print("\nConversion by Industry Segment:")
print(df.groupby('industry_segment')['lead_converted'].agg(['sum', 'mean', 'count']))

# ============================================================================
# 4. DATA VISUALIZATION
# ============================================================================

print("\n[3/9] Creating Visualizations...")

fig, axes = plt.subplots(3, 3, figsize=(16, 12))
fig.suptitle('AUTOERA - Lead Scoring & Conversion Analysis', fontsize=16, fontweight='bold')

# 1. Conversion Rate
conv_counts = df['lead_converted'].value_counts()
colors = ['#e74c3c', '#2ecc71']
axes[0, 0].pie(conv_counts.values, labels=['Not Converted', 'Converted'], 
              autopct='%1.1f%%', colors=colors, startangle=90)
axes[0, 0].set_title(f'Conversion Rate: {conversion_rate*100:.1f}%')

# 2. Conversion by Lead Source
source_conv = df.groupby('lead_source')['lead_converted'].mean().sort_values(ascending=False)
axes[0, 1].barh(range(len(source_conv)), source_conv.values*100, color='#3498db')
axes[0, 1].set_yticks(range(len(source_conv)))
axes[0, 1].set_yticklabels(source_conv.index)
axes[0, 1].set_xlabel('Conversion Rate (%)')
axes[0, 1].set_title('Conversion by Lead Source')
axes[0, 1].axvline(x=conversion_rate*100, color='r', linestyle='--', alpha=0.7)

# 3. Engagement Score Distribution
axes[0, 2].hist([df[df['lead_converted']==0]['engagement_score'],
                df[df['lead_converted']==1]['engagement_score']],
               bins=30, label=['Not Converted', 'Converted'], 
               color=['#e74c3c', '#2ecc71'], alpha=0.7)
axes[0, 2].set_xlabel('Engagement Score')
axes[0, 2].set_ylabel('Frequency')
axes[0, 2].set_title('Engagement Score by Conversion')
axes[0, 2].legend()

# 4. Demo Impact
demo_conv = pd.crosstab(df['demo_requested'], df['lead_converted'], normalize='index') * 100
demo_conv.plot(kind='bar', ax=axes[1, 0], color=['#e74c3c', '#2ecc71'])
axes[1, 0].set_xticklabels(['No Demo', 'Demo Requested'], rotation=0)
axes[1, 0].set_ylabel('Percentage')
axes[1, 0].set_title('Demo Request Impact')
axes[1, 0].legend(['Not Converted', 'Converted'])

# 5. Decision Maker Contact
dm_conv = pd.crosstab(df['decision_maker_contacted'], df['lead_converted'], normalize='index') * 100
dm_conv.plot(kind='bar', ax=axes[1, 1], color=['#e74c3c', '#2ecc71'])
axes[1, 1].set_xticklabels(['No Contact', 'DM Contacted'], rotation=0)
axes[1, 1].set_ylabel('Percentage')
axes[1, 1].set_title('Decision Maker Contact Impact')
axes[1, 1].legend(['Not Converted', 'Converted'])

# 6. Response Time Impact
response_bins = pd.cut(df['response_time_hours'], bins=5)
response_conv = df.groupby(response_bins)['lead_converted'].mean() * 100
axes[1, 2].plot(range(len(response_conv)), response_conv.values, 
               marker='o', color='#f39c12', linewidth=2, markersize=8)
axes[1, 2].set_xticks(range(len(response_conv)))
axes[1, 2].set_xticklabels([f"{int(i.left)}-{int(i.right)}" for i in response_conv.index], rotation=45)
axes[1, 2].set_xlabel('Response Time (hours)')
axes[1, 2].set_ylabel('Conversion Rate (%)')
axes[1, 2].set_title('Response Time vs Conversion')
axes[1, 2].grid(True, alpha=0.3)

# 7. Industry Segment Analysis
segment_conv = df.groupby('industry_segment')['lead_converted'].mean().sort_values(ascending=False)
axes[2, 0].bar(range(len(segment_conv)), segment_conv.values*100, color='#9b59b6')
axes[2, 0].set_xticks(range(len(segment_conv)))
axes[2, 0].set_xticklabels(segment_conv.index, rotation=45, ha='right')
axes[2, 0].set_ylabel('Conversion Rate (%)')
axes[2, 0].set_title('Conversion by Industry Segment')
axes[2, 0].axhline(y=conversion_rate*100, color='r', linestyle='--', alpha=0.7)

# 8. Engagement Metrics Comparison
engagement_metrics = ['email_opens', 'website_visits', 'demo_requested', 'pricing_page_viewed']
converted_avg = df[df['lead_converted']==1][engagement_metrics].mean()
not_converted_avg = df[df['lead_converted']==0][engagement_metrics].mean()

x = np.arange(len(engagement_metrics))
width = 0.35

axes[2, 1].bar(x - width/2, not_converted_avg.values, width, label='Not Converted', color='#e74c3c')
axes[2, 1].bar(x + width/2, converted_avg.values, width, label='Converted', color='#2ecc71')
axes[2, 1].set_xticks(x)
axes[2, 1].set_xticklabels(engagement_metrics, rotation=45, ha='right', fontsize=8)
axes[2, 1].set_ylabel('Average Count')
axes[2, 1].set_title('Engagement Metrics Comparison')
axes[2, 1].legend()

# 9. Correlation Heatmap
corr_cols = ['lead_converted', 'engagement_score', 'demo_requested', 'decision_maker_contacted',
             'email_opens', 'website_visits', 'pain_points_identified']
corr_matrix = df[corr_cols].corr()
sns.heatmap(corr_matrix, annot=True, cmap='RdYlGn', center=0, ax=axes[2, 2], fmt='.2f')
axes[2, 2].set_title('Conversion Factor Correlations')

plt.tight_layout()
plt.savefig('13_lead_scoring_eda.png', dpi=300, bbox_inches='tight')
print("✓ Visualizations saved as '13_lead_scoring_eda.png'")

# ============================================================================
# 5. DATA PREPROCESSING
# ============================================================================

print("\n[4/9] Preprocessing Data...")

X = df.drop(['lead_converted', 'lead_id', 'urgency_boost'], axis=1)
y = df['lead_converted']

# Encode categorical variables
label_encoders = {}
categorical_cols = ['lead_source', 'industry_segment', 'current_software_usage', 
                   'budget_indicated', 'urgency_level']

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

print(f"✓ Encoded {len(categorical_cols)} categorical features")

# Split data with stratification
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, 
                                                    random_state=42, stratify=y)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"✓ Train set: {len(X_train)}, Test set: {len(X_test)}")
print(f"  Train conversion rate: {y_train.mean()*100:.1f}%")
print(f"  Test conversion rate: {y_test.mean()*100:.1f}%")

# ============================================================================
# 6. FEATURE ENGINEERING
# ============================================================================

print("\n[5/9] Engineering Features...")

# Create engagement intensity score
X_train['total_engagement'] = (X_train['email_opens'] + X_train['email_clicks'] + 
                               X_train['website_visits'] + X_train['follow_up_count'])
X_test['total_engagement'] = (X_test['email_opens'] + X_test['email_clicks'] + 
                              X_test['website_visits'] + X_test['follow_up_count'])

# Create qualification score
X_train['qualification_score'] = (
    X_train['demo_requested'] + 
    X_train['demo_attended'] + 
    X_train['pricing_page_viewed'] + 
    X_train['case_study_downloaded'] +
    X_train['trial_requested']
) / 5

X_test['qualification_score'] = (
    X_test['demo_requested'] + 
    X_test['demo_attended'] + 
    X_test['pricing_page_viewed'] + 
    X_test['case_study_downloaded'] +
    X_test['trial_requested']
) / 5

# Create intent score
X_train['intent_score'] = X_train['engagement_score'] * X_train['qualification_score']
X_test['intent_score'] = X_test['engagement_score'] * X_test['qualification_score']

# Company quality indicator
X_train['company_quality'] = (X_train['company_website_quality'] / 10 + 
                              X_train['social_media_presence']) / 2
X_test['company_quality'] = (X_test['company_website_quality'] / 10 + 
                             X_test['social_media_presence']) / 2

# Update scaled features
X_train_final = scaler.fit_transform(X_train)
X_test_final = scaler.transform(X_test)

print(f"✓ Created 4 engineered features")

# ============================================================================
# 7. MODEL TRAINING
# ============================================================================

print("\n[6/9] Training Lead Scoring Models...")

models = {
    'Random Forest': RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42, 
                                           class_weight='balanced'),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=120, learning_rate=0.1, 
                                                    max_depth=8, random_state=42),
    'AdaBoost': AdaBoostClassifier(n_estimators=100, random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000, 
                                             class_weight='balanced', C=1.0)
}

results = {}

for name, model in models.items():
    print(f"\n  Training {name}...")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_final, y_train, 
                               cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
                               scoring='accuracy')
    
    # Train and predict
    model.fit(X_train_final, y_train)
    y_pred = model.predict(X_test_final)
    y_pred_proba = model.predict_proba(X_test_final)[:, 1] if hasattr(model, 'predict_proba') else None
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
    
    if y_pred_proba is not None:
        roc_auc = roc_auc_score(y_test, y_pred_proba)
    else:
        roc_auc = None
    
    results[name] = {
        'model': model,
        'cv_scores': cv_scores,
        'cv_mean': cv_scores.mean(),
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'roc_auc': roc_auc,
        'y_pred': y_pred,
        'y_pred_proba': y_pred_proba
    }
    
    print(f"    CV Accuracy: {cv_scores.mean()*100:.2f}% (±{cv_scores.std()*100:.2f}%)")
    print(f"    Test Accuracy: {accuracy*100:.2f}%")
    print(f"    Precision: {precision*100:.2f}%")
    print(f"    Recall: {recall*100:.2f}%")
    print(f"    F1-Score: {f1*100:.2f}%")
    if roc_auc:
        print(f"    ROC-AUC: {roc_auc:.3f}")

# ============================================================================
# 8. MODEL EVALUATION & TESTING
# ============================================================================

print("\n[7/9] Evaluating Models...")

# Select best model
best_model_name = max(results, key=lambda x: results[x]['accuracy'])
best_model = results[best_model_name]['model']
best_accuracy = results[best_model_name]['accuracy']

# Create evaluation plots
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('AUTOERA - Lead Scoring Model Performance', fontsize=16, fontweight='bold')

# 1. Model Accuracy Comparison
model_names = list(results.keys())
accuracies = [results[m]['accuracy'] for m in model_names]
f1_scores = [results[m]['f1'] for m in model_names]

x = np.arange(len(model_names))
width = 0.35

axes[0, 0].bar(x - width/2, [a*100 for a in accuracies], width, label='Accuracy', color='#3498db')
axes[0, 0].bar(x + width/2, [f*100 for f in f1_scores], width, label='F1-Score', color='#2ecc71')
axes[0, 0].set_xticks(x)
axes[0, 0].set_xticklabels(model_names, rotation=45, ha='right')
axes[0, 0].set_ylabel('Score (%)')
axes[0, 0].set_title('Model Performance Comparison')
axes[0, 0].axhline(y=80, color='r', linestyle='--', linewidth=2, label='Target: 80%')
axes[0, 0].legend()

# 2. Confusion Matrix
cm = confusion_matrix(y_test, results[best_model_name]['y_pred'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0, 1],
           xticklabels=['Not Converted', 'Converted'],
           yticklabels=['Not Converted', 'Converted'])
axes[0, 1].set_title(f'Confusion Matrix - {best_model_name}')
axes[0, 1].set_ylabel('True Label')
axes[0, 1].set_xlabel('Predicted Label')

# 3. ROC Curve
if results[best_model_name]['y_pred_proba'] is not None:
    fpr, tpr, _ = roc_curve(y_test, results[best_model_name]['y_pred_proba'])
    auc = results[best_model_name]['roc_auc']
    axes[1, 0].plot(fpr, tpr, label=f'{best_model_name} (AUC = {auc:.3f})', 
                   color='#2ecc71', linewidth=2)
    axes[1, 0].plot([0, 1], [0, 1], 'r--', label='Random', linewidth=2)
    axes[1, 0].set_xlabel('False Positive Rate')
    axes[1, 0].set_ylabel('True Positive Rate')
    axes[1, 0].set_title('ROC Curve')
    axes[1, 0].legend()
    axes[1, 0].grid(True, alpha=0.3)

# 4. Feature Importance
if hasattr(best_model, 'feature_importances_'):
    importance_df = pd.DataFrame({
        'feature': list(X_train.columns),
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False).head(12)
    
    axes[1, 1].barh(range(len(importance_df)), importance_df['importance'], color='#e74c3c')
    axes[1, 1].set_yticks(range(len(importance_df)))
    axes[1, 1].set_yticklabels(importance_df['feature'], fontsize=8)
    axes[1, 1].set_xlabel('Importance')
    axes[1, 1].set_title('Top Conversion Predictors')
    axes[1, 1].invert_yaxis()

plt.tight_layout()
plt.savefig('13_lead_scoring_results.png', dpi=300, bbox_inches='tight')
print("\n✓ Results saved as '13_lead_scoring_results.png'")

print(f"\n✓ Best Model: {best_model_name}")
print(f"  Accuracy: {best_accuracy*100:.2f}%")
print(f"  Target Achievement: {'✓ YES' if best_accuracy >= 0.80 else '✗ Close!'}")

print(f"\nClassification Report:")
print(classification_report(y_test, results[best_model_name]['y_pred'], 
                          target_names=['Not Converted', 'Converted']))

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
    'accuracy': best_accuracy,
    'precision': results[best_model_name]['precision'],
    'recall': results[best_model_name]['recall'],
    'f1_score': results[best_model_name]['f1'],
    'roc_auc': results[best_model_name]['roc_auc'],
    'target_accuracy': 0.80,
    'conversion_rate': conversion_rate,
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'achieved_target': best_accuracy >= 0.80
}

with open('13_lead_scoring_model.pkl', 'wb') as f:
    pickle.dump(deployment_package, f)

print(f"✓ Model saved as '13_lead_scoring_model.pkl'")

metadata = {
    'module_name': 'Lead Scoring & Conversion AI',
    'module_id': '13',
    'model_type': 'Binary Classification',
    'target': 'lead_converted',
    'best_model': best_model_name,
    'accuracy': f"{best_accuracy*100:.2f}%",
    'precision': f"{results[best_model_name]['precision']*100:.2f}%",
    'recall': f"{results[best_model_name]['recall']*100:.2f}%",
    'f1_score': f"{results[best_model_name]['f1']*100:.2f}%",
    'roc_auc': f"{results[best_model_name]['roc_auc']:.3f}" if results[best_model_name]['roc_auc'] else 'N/A',
    'target_accuracy': '80%',
    'conversion_rate': f"{conversion_rate*100:.1f}%",
    'target_achieved': best_accuracy >= 0.80,
    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

with open('13_lead_scoring_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"✓ Metadata saved as '13_lead_scoring_metadata.json'")

# ============================================================================
# 10. USAGE EXAMPLE
# ============================================================================

print("\n[9/9] Testing Lead Scoring...")

# High-quality lead example
sample_lead = {
    'lead_source': 'Referral',
    'industry_segment': 'Dealership',
    'company_size_vehicles': 80,
    'monthly_service_volume': 250,
    'current_software_usage': 'Basic',
    'budget_indicated': '50-100K',
    'decision_maker_contacted': 1,
    'email_opens': 12,
    'email_clicks': 6,
    'website_visits': 18,
    'pages_viewed': 35,
    'time_on_site_minutes': 85,
    'demo_requested': 1,
    'demo_attended': 1,
    'pricing_page_viewed': 1,
    'case_study_downloaded': 1,
    'video_watched': 1,
    'response_time_hours': 4,
    'engagement_score': 92,
    'pain_points_identified': 5,
    'competitor_evaluation': 1,
    'urgency_level': 'High',
    'follow_up_count': 4,
    'linkedin_connection': 1,
    'phone_calls_made': 3,
    'whatsapp_engaged': 1,
    'roi_calculator_used': 1,
    'testimonial_viewed': 1,
    'technical_documentation_downloaded': 1,
    'trial_requested': 1,
    'company_website_quality': 8.5,
    'years_in_business': 12,
    'online_reviews_count': 145,
    'social_media_presence': 0.85
}

sample_df = pd.DataFrame([sample_lead])

# Encode categorical variables
for col in categorical_cols:
    sample_df[col] = label_encoders[col].transform(sample_df[col])

# Add engineered features
sample_df['total_engagement'] = (sample_df['email_opens'] + sample_df['email_clicks'] + 
                                 sample_df['website_visits'] + sample_df['follow_up_count'])
sample_df['qualification_score'] = (
    sample_df['demo_requested'] + sample_df['demo_attended'] + 
    sample_df['pricing_page_viewed'] + sample_df['case_study_downloaded'] +
    sample_df['trial_requested']
) / 5
sample_df['intent_score'] = sample_df['engagement_score'] * sample_df['qualification_score']
sample_df['company_quality'] = (sample_df['company_website_quality'] / 10 + 
                                sample_df['social_media_presence']) / 2

# Scale and predict
sample_scaled = scaler.transform(sample_df)
conversion_pred = best_model.predict(sample_scaled)[0]
conversion_prob = best_model.predict_proba(sample_scaled)[0][1] if hasattr(best_model, 'predict_proba') else None

print(f"\n{'='*60}")
print(f"LEAD SCORING ASSESSMENT")
print(f"{'='*60}")

print(f"\n🎯 Lead Quality Score:")
print(f"  Conversion Prediction: {'HIGH PROBABILITY ✓' if conversion_pred == 1 else 'LOW PROBABILITY ✗'}")
if conversion_prob:
    print(f"  Conversion Probability: {conversion_prob*100:.1f}%")
    if conversion_prob >= 0.70:
        priority = "🔴 HOT LEAD - Priority Action"
    elif conversion_prob >= 0.50:
        priority = "🟡 WARM LEAD - Follow Up Soon"
    else:
        priority = "🔵 COLD LEAD - Nurture Campaign"
    print(f"  Priority: {priority}")

print(f"\n📊 Lead Profile:")
print(f"  Industry: {sample_lead['industry_segment']}")
print(f"  Lead Source: {sample_lead['lead_source']}")
print(f"  Service Volume: {sample_lead['monthly_service_volume']}/month")
print(f"  Engagement Score: {sample_lead['engagement_score']}/100")

print(f"\n✅ Positive Indicators:")
if sample_lead['demo_attended']:
    print(f"  • Attended product demo")
if sample_lead['decision_maker_contacted']:
    print(f"  • Decision maker engaged")
if sample_lead['trial_requested']:
    print(f"  • Trial requested")
if sample_lead['roi_calculator_used']:
    print(f"  • Used ROI calculator")
if sample_lead['urgency_level'] in ['High', 'Critical']:
    print(f"  • High urgency indicated")

print(f"\n💼 Recommended Actions:")
if conversion_pred == 1:
    print(f"  🎯 IMMEDIATE ACTIONS:")
    print(f"    1. Schedule contract discussion within 24 hours")
    print(f"    2. Prepare customized proposal")
    print(f"    3. Assign senior account manager")
    print(f"    4. Send case studies relevant to {sample_lead['industry_segment']}")
    print(f"    5. Offer limited-time onboarding discount")
else:
    print(f"  📧 NURTURING SEQUENCE:")
    print(f"    1. Continue email engagement campaign")
    print(f"    2. Share success stories and testimonials")
    print(f"    3. Invite to upcoming webinar/event")
    print(f"    4. Follow up in 7-10 days")

print(f"\n{'='*60}")

print("\n" + "="*80)
print("✅ LEAD SCORING & CONVERSION AI COMPLETED SUCCESSFULLY!")
print("="*80)
print("\nFiles Generated:")
print("  1. 13_lead_scoring_eda.png")
print("  2. 13_lead_scoring_results.png")
print("  3. 13_lead_scoring_model.pkl")
print("  4. 13_lead_scoring_metadata.json")
print("\n" + "="*80)