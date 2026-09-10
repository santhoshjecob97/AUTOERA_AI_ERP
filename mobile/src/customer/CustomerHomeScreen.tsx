import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

interface CustomerHomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const CustomerHomeScreen: React.FC<CustomerHomeScreenProps> = ({ onNavigate }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>AUTOERA AI</Text>
          <Text style={styles.welcomeText}>Hello, Anita Sundaram</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>DPDP Verified</Text>
        </View>
      </View>

      {/* Vehicle Showcase Card */}
      <View style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <View>
            <Text style={styles.vehicleModel}>Tata Nexon EV Empowered+</Text>
            <Text style={styles.vehicleReg}>TN-09-CB-4491 &bull; VIN: MAT621980P2K8819</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Connected</Text>
          </View>
        </View>

        {/* Battery / Fuel & Range Gauge */}
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBox}>
            <Text style={styles.gaugeLabel}>Battery Level</Text>
            <Text style={styles.gaugeValue}>82%</Text>
            <Text style={styles.gaugeSub}>SOH 96.4% &bull; Good</Text>
          </View>
          <View style={styles.gaugeDivider} />
          <View style={styles.gaugeBox}>
            <Text style={styles.gaugeLabel}>Estimated Range</Text>
            <Text style={styles.gaugeValue}>328 km</Text>
            <Text style={styles.gaugeSub}>City mode</Text>
          </View>
          <View style={styles.gaugeDivider} />
          <View style={styles.gaugeBox}>
            <Text style={styles.gaugeLabel}>Odometer</Text>
            <Text style={styles.gaugeValue}>18,420</Text>
            <Text style={styles.gaugeSub}>Next svc: 20,000</Text>
          </View>
        </View>
      </View>

      {/* Live Service Milestone Banner */}
      <TouchableOpacity
        style={styles.serviceBanner}
        onPress={() => onNavigate('service-tracking')}
        activeOpacity={0.8}
      >
        <View style={styles.serviceBannerLeft}>
          <View style={styles.serviceIconContainer}>
            <Text style={styles.serviceIcon}>🔧</Text>
          </View>
          <View>
            <Text style={styles.serviceBannerTitle}>Job Card #JC-2026-0891</Text>
            <Text style={styles.serviceBannerSubtitle}>Stage 4: Quality Check & Foam Wash</Text>
          </View>
        </View>
        <Text style={styles.trackText}>Track Live &rarr;</Text>
      </TouchableOpacity>

      {/* Quick Action Tiles */}
      <Text style={styles.sectionTitle}>Quick Services</Text>
      <View style={styles.tilesGrid}>
        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => onNavigate('service-tracking')}
        >
          <Text style={styles.tileEmoji}>📋</Text>
          <Text style={styles.tileTitle}>Live Service Tracking</Text>
          <Text style={styles.tileDesc}>6-stage visual workshop feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => onNavigate('vehicle-health')}
        >
          <Text style={styles.tileEmoji}>⚡</Text>
          <Text style={styles.tileTitle}>Vehicle Health</Text>
          <Text style={styles.tileDesc}>Battery SOH & telemetry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionTile}>
          <Text style={styles.tileEmoji}>📅</Text>
          <Text style={styles.tileTitle}>Book Appointment</Text>
          <Text style={styles.tileDesc}>Select dealership bay & date</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionTile}>
          <Text style={styles.tileEmoji}>🛡️</Text>
          <Text style={styles.tileTitle}>Insurance & SOS</Text>
          <Text style={styles.tileDesc}>24/7 Roadside assistance</Text>
        </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  welcomeText: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  vehicleCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  vehicleModel: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  vehicleReg: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 5,
  },
  statusText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  gaugeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  gaugeBox: {
    flex: 1,
    alignItems: 'center',
  },
  gaugeLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  gaugeValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  gaugeSub: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  gaugeDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.borderDark,
  },
  serviceBanner: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.35)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  serviceBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 18,
  },
  serviceBannerTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  serviceBannerSubtitle: {
    color: Colors.textAccent,
    fontSize: 11,
    marginTop: 1,
  },
  trackText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionTile: {
    width: '48%',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  tileEmoji: {
    fontSize: 22,
    marginBottom: 8,
  },
  tileTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  tileDesc: {
    color: Colors.textMuted,
    fontSize: 10,
  },
});
