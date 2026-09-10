import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Colors } from '../theme/colors';

interface AdvisorCheckInScreenProps {
  onBack: () => void;
  onJobCardCreated: () => void;
}

export const AdvisorCheckInScreen: React.FC<AdvisorCheckInScreenProps> = ({ onBack, onJobCardCreated }) => {
  const [regNumber, setRegNumber] = useState('TN-09-CB-4491');
  const [odometer, setOdometer] = useState('18420');
  const [fuelPct, setFuelPct] = useState('80');
  const [complaint, setComplaint] = useState('Slight squeaking noise from front wheels under deceleration.');
  const [hasSpareWheel, setHasSpareWheel] = useState(true);
  const [hasToolKit, setHasToolKit] = useState(true);
  const [hasScratchFront, setHasScratchFront] = useState(true);
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);

  const runAiDiagnosis = () => {
    setAiDiagnosis(
      "AI Diagnosis: Front disc brake pad wear (~80%). Prescribed: Pad replacement + rotor cleaning. Skill required: L2 Technician. Est. labour: 1.2 hrs. Est. cost: ₹ 4,850."
    );
  };

  const handleCreateJobCard = () => {
    Alert.alert(
      "Job Card Created",
      "Job Card #JC-2026-0892 created. WhatsApp 6-stage milestone sequence initialized for customer.",
      [{ text: "View Job Card", onPress: onJobCardCreated }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>&larr; Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Walkaround Check-In</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Vehicle Lookup Form */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>1. Vehicle & Odometer</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Registration Number / VIN</Text>
          <TextInput
            style={styles.input}
            value={regNumber}
            onChangeText={setRegNumber}
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.inputLabel}>Odometer (km)</Text>
            <TextInput
              style={styles.input}
              value={odometer}
              onChangeText={setOdometer}
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.inputLabel}>Fuel / Battery %</Text>
            <TextInput
              style={styles.input}
              value={fuelPct}
              onChangeText={setFuelPct}
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>
      </View>

      {/* Digital Walkaround & Inventory Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>2. Walkaround Inspection & Inventory</Text>
        
        <TouchableOpacity
          style={styles.checkItem}
          onPress={() => setHasScratchFront(!hasScratchFront)}
        >
          <Text style={styles.checkEmoji}>{hasScratchFront ? '⚠️' : '✅'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkTitle}>Front Bumper Minor Scratch</Text>
            <Text style={styles.checkSub}>Pre-existing scratch on lower lip (RH side)</Text>
          </View>
          <Text style={[styles.toggleBadge, hasScratchFront ? styles.badgeWarning : styles.badgeClear]}>
            {hasScratchFront ? 'RECORDED' : 'CLEAR'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkItem}
          onPress={() => setHasSpareWheel(!hasSpareWheel)}
        >
          <Text style={styles.checkEmoji}>{hasSpareWheel ? '🛞' : '❌'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkTitle}>Spare Wheel Present</Text>
            <Text style={styles.checkSub}>Boot inspected</Text>
          </View>
          <Text style={[styles.toggleBadge, hasSpareWheel ? styles.badgeClear : styles.badgeWarning]}>
            {hasSpareWheel ? 'YES' : 'NO'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkItem}
          onPress={() => setHasToolKit(!hasToolKit)}
        >
          <Text style={styles.checkEmoji}>{hasToolKit ? '🧰' : '❌'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkTitle}>Jack & Tool Kit</Text>
            <Text style={styles.checkSub}>Verified inside spare well</Text>
          </View>
          <Text style={[styles.toggleBadge, hasToolKit ? styles.badgeClear : styles.badgeWarning]}>
            {hasToolKit ? 'YES' : 'NO'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Customer Complaint */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>3. Customer Stated Complaint</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={complaint}
          onChangeText={setComplaint}
          multiline
          numberOfLines={3}
          placeholder="Describe symptoms, noise conditions, customer requests..."
          placeholderTextColor={Colors.textMuted}
        />

        <TouchableOpacity
          style={styles.aiButton}
          onPress={runAiDiagnosis}
        >
          <Text style={styles.aiButtonText}>✨ Run Service Advisor AI Diagnosis</Text>
        </TouchableOpacity>

        {aiDiagnosis && (
          <View style={styles.aiResultBox}>
            <Text style={styles.aiResultText}>{aiDiagnosis}</Text>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleCreateJobCard}
      >
        <Text style={styles.submitBtnText}>Create Job Card & Dispatch Stage 1</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  content: {
    padding: 18,
    paddingTop: 45,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  backButton: {
    padding: 6,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: 16,
  },
  cardHeading: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: Colors.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  checkEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  checkTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  checkSub: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  toggleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 9,
    fontWeight: '800',
  },
  badgeClear: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: Colors.success,
  },
  badgeWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: Colors.warning,
  },
  aiButton: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  aiButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  aiResultBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 10,
    marginTop: 10,
  },
  aiResultText: {
    color: Colors.textPrimary,
    fontSize: 11,
    lineHeight: 16,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
