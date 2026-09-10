import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

interface CustomerVehicleHealthScreenProps {
  onBack: () => void;
}

export const CustomerVehicleHealthScreen: React.FC<CustomerVehicleHealthScreenProps> = ({ onBack }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>&larr; Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Telemetry & Health</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* EV Battery Intelligence Hero Card */}
      <View style={styles.batteryHero}>
        <View style={styles.rowBetween}>
          <Text style={styles.heroSub}>High-Voltage Battery Pack</Text>
          <View style={styles.healthGradeBadge}>
            <Text style={styles.healthGradeText}>Grade A+</Text>
          </View>
        </View>

        <View style={styles.sohRow}>
          <Text style={styles.sohValue}>96.4%</Text>
          <View style={styles.sohDetails}>
            <Text style={styles.sohLabel}>State of Health (SOH)</Text>
            <Text style={styles.sohSub}>Est. Remaining Life: 2,150 Cycles (~7.8 yrs)</Text>
          </View>
        </View>

        {/* Metric Trio */}
        <View style={styles.metricTrio}>
          <View style={styles.metricBox}>
            <Text style={styles.mLabel}>Cell Imbalance</Text>
            <Text style={styles.mValue}>14 mV</Text>
            <Text style={styles.mStatus}>Optimal (&le; 25 mV)</Text>
          </View>
          <View style={styles.mDivider} />
          <View style={styles.metricBox}>
            <Text style={styles.mLabel}>Pack Temp</Text>
            <Text style={styles.mValue}>27.2°C</Text>
            <Text style={styles.mStatus}>Nominal (15-35°C)</Text>
          </View>
          <View style={styles.mDivider} />
          <View style={styles.metricBox}>
            <Text style={styles.mLabel}>Fast Charge %</Text>
            <Text style={styles.mValue}>18%</Text>
            <Text style={styles.mStatus}>Low Stress (&lt; 35%)</Text>
          </View>
        </View>
      </View>

      {/* Subsystem Health Cards */}
      <Text style={styles.sectionHeading}>Subsystem Status</Text>
      
      <View style={styles.subsystemCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.subsystemName}>🛑 Regenerative & Friction Braking</Text>
          <Text style={styles.subsystemScore}>88 / 100</Text>
        </View>
        <Text style={styles.subsystemDetail}>Brake pad wear nominal. Expected remaining life ~8,500 km.</Text>
      </View>

      <View style={styles.subsystemCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.subsystemName}>❄️ Thermal Management & Cooling</Text>
          <Text style={styles.subsystemScore}>94 / 100</Text>
        </View>
        <Text style={styles.subsystemDetail}>Glycol coolant level optimal. Radiator pump pressure steady at 1.4 bar.</Text>
      </View>

      <View style={styles.subsystemCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.subsystemName}>🛞 TPMS & Tyre Pressure</Text>
          <Text style={styles.subsystemScore}>33 PSI</Text>
        </View>
        <Text style={styles.subsystemDetail}>All 4 tyres balanced (FL: 33, FR: 33, RL: 33, RR: 33 PSI). Zero puncture detected.</Text>
      </View>

      <View style={styles.subsystemCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.subsystemName}>🔋 12V Auxiliary Battery</Text>
          <Text style={styles.subsystemScore}>12.65 V</Text>
        </View>
        <Text style={styles.subsystemDetail}>DC-DC converter supplying nominal 14.1V float voltage during drive cycles.</Text>
      </View>

      {/* Prescriptive Insights Box */}
      <View style={styles.prescriptiveBox}>
        <Text style={styles.prescriptiveTitle}>✨ AI Diagnostic Prescriptions</Text>
        <Text style={styles.prescriptiveText}>
          &bull; Battery degradation rate is 0.8% below fleet average due to consistent overnight 7.4 kW AC charging.
        </Text>
        <Text style={styles.prescriptiveText}>
          &bull; Periodic air-conditioning cabin pollen filter check scheduled for 20,000 km odometer milestone.
        </Text>
      </View>
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
    fontSize: 16,
    fontWeight: '700',
  },
  batteryHero: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroSub: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  healthGradeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  healthGradeText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
  sohRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  sohValue: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: '900',
    marginRight: 14,
  },
  sohDetails: {
    flex: 1,
  },
  sohLabel: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  sohSub: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  metricTrio: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    padding: 12,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  mLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 2,
  },
  mValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  mStatus: {
    color: Colors.success,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  mDivider: {
    width: 1,
    backgroundColor: Colors.borderDark,
  },
  sectionHeading: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  subsystemCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: 10,
  },
  subsystemName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  subsystemScore: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  subsystemDetail: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
  prescriptiveBox: {
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
    marginTop: 10,
  },
  prescriptiveTitle: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  prescriptiveText: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },
});
