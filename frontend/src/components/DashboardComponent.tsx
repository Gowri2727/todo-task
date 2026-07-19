import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import useTasks from '../hooks/useTasks';
import { COLORS } from '../constants';

const DashboardComponent = () => {
  const { stats } = useTasks();

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>Dashboard Statistics</Text>
        <ProgressBar
          progress={stats.completionPercentage / 100}
          color={COLORS.primary}
          style={styles.progressBar}
        />
        <Text style={styles.percentageText}>{stats.completionPercentage}% Completed</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.priorityHigh }]}>{stats.overdue}</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>{stats.todayTasks}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statBox: {
    alignItems: 'center',
    marginRight: 24,
    minWidth: 60,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default DashboardComponent;
