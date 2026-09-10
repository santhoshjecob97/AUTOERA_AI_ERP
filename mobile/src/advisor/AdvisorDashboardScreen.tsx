import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

interface AdvisorDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export const AdvisorDashboardScreen: React.FC<AdvisorDashboardScreenProps> = ({ onNavigate }) => {
  const bays = [
    { id: 1, name: 'Bay 1 — 2-Post Lift', status: 'IN_USE', vehicle: 'Creta SX (TN-01-AX-9912)', tech: 'Karthik (L2)' },
    { id: 2, name: 'Bay 2 — Scissor Lift', status: 'IN_USE', vehicle: 'Seltos GTX (TN-07-DE-4410)', tech: 'Suresh (L1)' },
    { id: 3, name: 'Bay 3 — EV Diagnostic', status: 'IN_USE', vehicle: 'Nexon EV (TN-09-CB-4491)', tech: 'Rajesh (L3)' },
    { id: 4, name: 'Bay 4 — Wheel Align', status: 'READY', vehicle: 'Available', tech: 'Unassigned' },
    { id: 5, name: 'Bay 5 — Quick Service', status: 'READY', vehicle: 'Available', tech: 'Unassigned' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>AUTOERA WORKSHOP OPS</Text>
          <Text style={styles.welcomeText}>Service Advisor: Anand M.</Text>
        </View>
        <TouchableOpacity
          style={styles.newCheckInBtn}
          onPress={() => onNavigate('advisor-checkin')}
        >
          <Text style={styles.newCheckInText}>+ Walkaround</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Trio */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Active Bays</Text>
          <Text style={styles.kpiVal}>3 / 5</Text>
          <Text style={styles.kpiSub}>60% capacity</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>In Progress</Text>
          <Text style={styles.kpiVal}>9</Text>
          <Text style={styles.kpiSub}>4 ready today</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>SLA On-Time</Text>
          <Text style={styles.kpiVal}>94.2%</Text>
          <Text style={styles.kpiSub}>1 flagged</Text>
        </View>
      </View>

      {/* Action Banner */}
      <TouchableOpacity
        style={styles.scanBanner}
        onPress={() => onNavigate('advisor-checkin')}
        activeOpacity={0.8}
      >
        <Text style={styles.scanEmoji}>📱</Text>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.scanTitle}>Digital Vehicle Check-In</Text>
          <Text style={styles.scanSub}>Scan VIN, record scratch diagram & AI symptom diagnosis</Text>
        </View>
        <Text style={styles.scanArrow}>&rarr;</Text>
      </TouchableOpacity>

      {/* Live Workshop Bays */}
      <Text style={styles.sectionHeading}>Live Workshop Bays</Text>
      {bays.map((bay) => {
        const isOccupied = bay.status === 'IN_USE';
        return (
          <TouchableOpacity
            key={bay.id}
            style={styles.bayCard}
            onPress={() => onNavigate('advisor-jobcard')}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.bayName}>{bay.name}</Text>
              <View style={[styles.statusBadge, isOccupied ? styles.badgeOccupied : styles.badgeReady]}>
                <Text style={[styles.statusBadgeText, isOccupied ? styles.textOccupied : styles.textReady]}>
                  {bay.status}
                </Text>
              </View>
            </View>
            <Text style={styles.bayVehicle}>{bay.vehicle}</Text>
            <Text style={styles.bayTech}>Technician: {bay.tech}</Text>
          </TouchableOpacity>
        );
      })}
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
    marginBottom: 20,
  },
  brandTitle: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  welcomeText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  newCheckInBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  newCheckInText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: 16,
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  kpiVal: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  kpiSub: {
    color: Colors.accent,
    fontSize: 9,
    marginTop: 1,
  },
  kpiDivider: {
    width: 1,
    backgroundColor: Colors.borderDark,
  },
  scanBanner: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scanEmoji: {
    fontSize: 26,
  },
  scanTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  scanSub: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  scanArrow: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionHeading: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  bayCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bayName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOccupied: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
  },
  badgeReady: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  textOccupied: {
    color: Colors.primary,
  },
  textReady: {
    color: Colors.success,
  },
  bayVehicle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  bayTech: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
