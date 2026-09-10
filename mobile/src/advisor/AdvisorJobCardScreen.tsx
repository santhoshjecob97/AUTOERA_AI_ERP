import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '../theme/colors';

interface AdvisorJobCardScreenProps {
  onBack: () => void;
}

export const AdvisorJobCardScreen: React.FC<AdvisorJobCardScreenProps> = ({ onBack }) => {
  const [currentStage, setCurrentStage] = useState('QUALITY_CHECK');
  const [assignedTech, setAssignedTech] = useState('Rajesh K (L2)');
  const [whatsappSent, setWhatsappSent] = useState(false);

  const stages = [
    { code: 'CHECKED_IN', label: '1. Check-In' },
    { code: 'IN_PROGRESS', label: '2. In Progress' },
    { code: 'WAITING_PARTS', label: '3. Parts Auth' },
    { code: 'QUALITY_CHECK', label: '4. Quality Check' },
    { code: 'READY_FOR_DELIVERY', label: '5. Ready' },
    { code: 'DELIVERED', label: '6. Delivered' },
  ];

  const handleAutoDispatch = () => {
    setAssignedTech('Rajesh K (L2 Specialist — Assigned to Bay 3)');
    Alert.alert(
      "Skill Matrix Auto-Dispatch",
      "Technician Skill Matrix matched L2 certification for brake system overhaul. Bay 3 scheduled."
    );
  };

  const handleSendWhatsApp = () => {
    setWhatsappSent(true);
    Alert.alert(
      "WhatsApp Dispatched (Gupshup)",
      "Template 'stage_4_quality_check' dispatched to customer +91 98401 23456. Status: DELIVERED."
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>&larr; Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Card Operations</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Job Card Header */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.jcId}>JC-2026-0891</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{currentStage.replace(/_/g, ' ')}</Text>
          </View>
        </View>
        <Text style={styles.vehicleName}>Tata Nexon EV Empowered+ (TN-09-CB-4491)</Text>
        <Text style={styles.customerName}>Customer: Anita Sundaram &bull; +91 98401 23456</Text>
      </View>

      {/* 6-Stage State Machine Transition Selector */}
      <Text style={styles.sectionHeading}>Stage Transition (Auto-WhatsApp)</Text>
      <View style={styles.stagesGrid}>
        {stages.map((s) => {
          const isSelected = currentStage === s.code;
          return (
            <TouchableOpacity
              key={s.code}
              style={[styles.stageChip, isSelected && styles.stageChipSelected]}
              onPress={() => {
                setCurrentStage(s.code);
                setWhatsappSent(false);
              }}
            >
              <Text style={[styles.stageChipText, isSelected && styles.stageChipTextSelected]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Technician Auto-Dispatch Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Technician Skill Matrix</Text>
        <View style={styles.techRow}>
          <View>
            <Text style={styles.techName}>{assignedTech}</Text>
            <Text style={styles.techSub}>Skill Tier: Level 2 &bull; Active Workload: 1 Job</Text>
          </View>
          <TouchableOpacity
            style={styles.dispatchBtn}
            onPress={handleAutoDispatch}
          >
            <Text style={styles.dispatchBtnText}>Auto-Match</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Parts & Labour Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Billable Items & Requisitions</Text>
        
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>Front Brake Pad Kit (OEM)</Text>
          <Text style={styles.itemCost}>₹ 3,200.00</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>Front Brake Rotor Skimming</Text>
          <Text style={styles.itemCost}>₹ 1,100.00</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>Periodic Inspection & Wash Labour</Text>
          <Text style={styles.itemCost}>₹ 1,500.00</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>GST (18%)</Text>
          <Text style={styles.itemCost}>₹ 650.00</Text>
        </View>
        
        <View style={styles.divider} />
        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>Total Estimate</Text>
          <Text style={styles.totalValue}>₹ 6,450.00</Text>
        </View>
      </View>

      {/* WhatsApp Dispatches */}
      <TouchableOpacity
        style={[styles.whatsappBtn, whatsappSent && styles.whatsappSentBtn]}
        onPress={handleSendWhatsApp}
      >
        <Text style={styles.whatsappBtnText}>
          {whatsappSent ? '✓ Stage Milestone Dispatched to Customer' : `💬 Dispatch WhatsApp Update (${currentStage})`}
        </Text>
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jcId: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  statusPill: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  statusPillText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  vehicleName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  customerName: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeading: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  stageChip: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  stageChipSelected: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: Colors.primary,
  },
  stageChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  stageChipTextSelected: {
    color: Colors.primary,
    fontWeight: '800',
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techName: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  techSub: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  dispatchBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dispatchBtnText: {
    color: '#070a13',
    fontSize: 11,
    fontWeight: '800',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemName: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  itemCost: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDark,
    marginVertical: 8,
  },
  totalLabel: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  totalValue: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  whatsappBtn: {
    backgroundColor: '#25D366', // WhatsApp Brand Green
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  whatsappSentBtn: {
    backgroundColor: 'rgba(37, 211, 102, 0.2)',
    borderWidth: 1,
    borderColor: '#25D366',
  },
  whatsappBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
});
