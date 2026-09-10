import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '../theme/colors';

interface CustomerServiceTrackingScreenProps {
  onBack: () => void;
}

interface Milestone {
  id: number;
  stage: string;
  title: string;
  description: string;
  time: string;
  status: 'COMPLETED' | 'ACTIVE' | 'UPCOMING';
}

export const CustomerServiceTrackingScreen: React.FC<CustomerServiceTrackingScreenProps> = ({ onBack }) => {
  const [isPaid, setIsPaid] = useState(false);

  const milestones: Milestone[] = [
    {
      id: 1,
      stage: 'Stage 1',
      title: 'Vehicle Check-In',
      description: 'Physical walkaround complete. Digital inventory slip signed.',
      time: '09:15 AM',
      status: 'COMPLETED',
    },
    {
      id: 2,
      stage: 'Stage 2',
      title: 'Work In Progress',
      description: 'Assigned to Bay 3. L2 Technician Rajesh K commenced periodic service.',
      time: '10:30 AM',
      status: 'COMPLETED',
    },
    {
      id: 3,
      stage: 'Stage 3',
      title: 'Parts Authorization',
      description: 'Customer approved synthetic motor oil and cabin filter replacement via WhatsApp.',
      time: '11:45 AM',
      status: 'COMPLETED',
    },
    {
      id: 4,
      stage: 'Stage 4',
      title: 'Quality Check & Foam Wash',
      description: '32-point road-worthiness inspection passed. Currently in detailing bay.',
      time: '01:15 PM',
      status: 'ACTIVE',
    },
    {
      id: 5,
      stage: 'Stage 5',
      title: 'Ready for Delivery',
      description: 'Vehicle prepared for customer pickup with digital gate pass OTP.',
      time: 'Est. 02:30 PM',
      status: 'UPCOMING',
    },
    {
      id: 6,
      stage: 'Stage 6',
      title: 'Delivered & Handover',
      description: 'Vehicle exit verified. NPS feedback survey dispatched.',
      time: 'Est. 03:00 PM',
      status: 'UPCOMING',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>&larr; Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Service Tracking</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Job Card Info Banner */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.jcNumber}>JC-2026-0891</Text>
          <View style={styles.badgeActive}>
            <Text style={styles.badgeActiveText}>Stage 4 of 6</Text>
          </View>
        </View>
        <Text style={styles.vehicleText}>Tata Nexon EV Empowered+ (TN-09-CB-4491)</Text>
        <Text style={styles.advisorText}>Service Advisor: Anand Mohan (Apex Mobility Guindy)</Text>
      </View>

      {/* Digital Gate Pass Section */}
      <View style={styles.gatePassCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.gatePassTitle}>Digital Gate Pass OTP</Text>
          <Text style={styles.otpPill}>VALID TODAY</Text>
        </View>
        <Text style={styles.otpValue}>8 4 9 2</Text>
        <Text style={styles.gatePassSub}>Present this 4-digit code at the exit gate after invoice clearance.</Text>
      </View>

      {/* Visual 6-Stage Timeline */}
      <Text style={styles.timelineHeading}>Workshop Milestones</Text>
      <View style={styles.timelineContainer}>
        {milestones.map((m, idx) => {
          const isCompleted = m.status === 'COMPLETED';
          const isActive = m.status === 'ACTIVE';

          return (
            <View key={m.id} style={styles.timelineItem}>
              {/* Timeline Indicator Column */}
              <View style={styles.timelineCol}>
                <View
                  style={[
                    styles.timelineDot,
                    isCompleted && styles.dotCompleted,
                    isActive && styles.dotActive,
                  ]}
                >
                  {isCompleted && <Text style={styles.checkMark}>✓</Text>}
                  {isActive && <View style={styles.innerActiveDot} />}
                </View>
                {idx < milestones.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      isCompleted && styles.lineCompleted,
                    ]}
                  />
                )}
              </View>

              {/* Milestone Details */}
              <View style={styles.timelineContent}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.stageBadge, isActive && styles.stageBadgeActive]}>
                    {m.stage}
                  </Text>
                  <Text style={styles.timeText}>{m.time}</Text>
                </View>
                <Text style={styles.itemTitle}>{m.title}</Text>
                <Text style={styles.itemDesc}>{m.description}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Payment & Invoice Action */}
      <View style={styles.invoiceBox}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.invoiceLabel}>Total Invoice Amount</Text>
            <Text style={styles.invoiceAmount}>₹ 6,450.00</Text>
          </View>
          <TouchableOpacity
            style={[styles.payButton, isPaid && styles.paidButton]}
            onPress={() => {
              setIsPaid(true);
              Alert.alert('Payment Successful', 'Receipt #REC-9821 issued. Gate pass OTP 8492 is now activated for exit.');
            }}
            disabled={isPaid}
          >
            <Text style={styles.payButtonText}>
              {isPaid ? '✓ Paid (UPI)' : 'Pay via UPI / Card'}
            </Text>
          </TouchableOpacity>
        </View>
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
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jcNumber: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  badgeActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  badgeActiveText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  vehicleText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  advisorText: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  gatePassCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 20,
    alignItems: 'center',
  },
  gatePassTitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  otpPill: {
    color: Colors.success,
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
  },
  otpValue: {
    color: Colors.success,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 8,
    marginVertical: 6,
  },
  gatePassSub: {
    color: Colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  timelineHeading: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },
  timelineContainer: {
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineCol: {
    width: 28,
    alignItems: 'center',
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.borderMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: {
    backgroundColor: Colors.success,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  innerActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  checkMark: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderDark,
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: Colors.success,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  stageBadge: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stageBadgeActive: {
    color: Colors.primary,
  },
  timeText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  itemTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  itemDesc: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  invoiceBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  invoiceLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  invoiceAmount: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  payButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  paidButton: {
    backgroundColor: Colors.success,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
