import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Colors } from './src/theme/colors';

// Customer Screens
import { CustomerHomeScreen } from './src/customer/CustomerHomeScreen';
import { CustomerServiceTrackingScreen } from './src/customer/CustomerServiceTrackingScreen';
import { CustomerVehicleHealthScreen } from './src/customer/CustomerVehicleHealthScreen';

// Advisor Screens
import { AdvisorDashboardScreen } from './src/advisor/AdvisorDashboardScreen';
import { AdvisorCheckInScreen } from './src/advisor/AdvisorCheckInScreen';
import { AdvisorJobCardScreen } from './src/advisor/AdvisorJobCardScreen';

export default function App() {
  const [activeRole, setActiveRole] = useState<'CUSTOMER' | 'ADVISOR'>('CUSTOMER');
  const [currentScreen, setCurrentScreen] = useState<string>('home');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      {/* Main Screen Router */}
      <View style={styles.screenContainer}>
        {activeRole === 'CUSTOMER' ? (
          <>
            {currentScreen === 'home' && (
              <CustomerHomeScreen onNavigate={(s) => setCurrentScreen(s)} />
            )}
            {currentScreen === 'service-tracking' && (
              <CustomerServiceTrackingScreen onBack={() => setCurrentScreen('home')} />
            )}
            {currentScreen === 'vehicle-health' && (
              <CustomerVehicleHealthScreen onBack={() => setCurrentScreen('home')} />
            )}
          </>
        ) : (
          <>
            {currentScreen === 'home' && (
              <AdvisorDashboardScreen onNavigate={(s) => setCurrentScreen(s)} />
            )}
            {currentScreen === 'advisor-checkin' && (
              <AdvisorCheckInScreen
                onBack={() => setCurrentScreen('home')}
                onJobCardCreated={() => setCurrentScreen('advisor-jobcard')}
              />
            )}
            {currentScreen === 'advisor-jobcard' && (
              <AdvisorJobCardScreen onBack={() => setCurrentScreen('home')} />
            )}
          </>
        )}
      </View>

      {/* Role & Mode Switcher Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeRole === 'CUSTOMER' && styles.tabItemActive]}
          onPress={() => {
            setActiveRole('CUSTOMER');
            setCurrentScreen('home');
          }}
        >
          <Text style={styles.tabIcon}>🚗</Text>
          <Text style={[styles.tabLabel, activeRole === 'CUSTOMER' && styles.tabLabelActive]}>
            Customer App
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeRole === 'ADVISOR' && styles.tabItemActive]}
          onPress={() => {
            setActiveRole('ADVISOR');
            setCurrentScreen('home');
          }}
        >
          <Text style={styles.tabIcon}>👨‍🔧</Text>
          <Text style={[styles.tabLabel, activeRole === 'ADVISOR' && styles.tabLabelActive]}>
            Advisor App
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});
