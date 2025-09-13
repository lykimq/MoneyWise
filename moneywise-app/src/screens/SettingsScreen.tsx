import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * SettingsScreen Component
 *
 * This screen provides a comprehensive interface for managing application
 * settings, including general preferences, budget configurations, data
 * management options, and support information.
 */
const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [budgetRollover, setBudgetRollover] = React.useState(true);
  const [budgetAlerts, setBudgetAlerts] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* General Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="globe-outline" size={20} color="#007AFF" />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <View style={styles.settingValue}>
                <Text style={styles.settingValueText}>English</Text>
                <Ionicons name="chevron-down-outline" size={16} color="#666" />
              </View>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="cash-outline" size={20} color="#007AFF" />
                <Text style={styles.settingLabel}>Currency</Text>
              </View>
              <View style={styles.settingValue}>
                <Text style={styles.settingValueText}>EUR</Text>
                <Ionicons name="chevron-down-outline" size={16} color="#666" />
              </View>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon-outline" size={20} color="#007AFF" />
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Budget Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Settings</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                <Text style={styles.settingLabel}>Budget Period</Text>
              </View>
              <View style={styles.settingValue}>
                <Text style={styles.settingValueText}>Monthly</Text>
                <Ionicons name="chevron-down-outline" size={16} color="#666" />
              </View>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="refresh-outline" size={20} color="#007AFF" />
                <Text style={styles.settingLabel}>Budget Rollover</Text>
              </View>
              <Switch
                value={budgetRollover}
                onValueChange={setBudgetRollover}
                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                thumbColor={budgetRollover ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="warning-outline" size={20} color="#007AFF" />
                <Text style={styles.settingLabel}>Budget Alerts</Text>
              </View>
              <Switch
                value={budgetAlerts}
                onValueChange={setBudgetAlerts}
                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                thumbColor={budgetAlerts ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.settingLabel}>Backup Data</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="cloud-download-outline"
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.settingLabel}>Restore Data</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="download-outline" size={20} color="#007AFF" />
                <Text style={styles.settingLabel}>Export Data</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* About & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Support</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.settingLabel}>Help & FAQ</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="mail-outline" size={20} color="#007AFF" />
                <Text style={styles.settingLabel}>Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#007AFF"
                />
                <Text style={styles.settingLabel}>About MoneyWise</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={[styles.settingItem, styles.dangerItem]}>
              <View style={styles.settingInfo}>
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                <Text style={[styles.settingLabel, styles.dangerText]}>
                  Clear All Data
                </Text>
              </View>
              <Text style={styles.dangerButtonText}>Clear Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#FF6B6B',
  },
  dangerButtonText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
});

export default SettingsScreen;
