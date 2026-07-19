import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Title, Text, Button, Badge } from 'react-native-paper';
import { Task } from '../types';
import { COLORS } from '../constants';

interface TaskDetailsModalProps {
  visible: boolean;
  onDismiss: () => void;
  task: Task | null;
}

const TaskDetailsModal = ({ visible, onDismiss, task }: TaskDetailsModalProps) => {
  if (!task) return null;

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'High':
        return COLORS.priorityHigh;
      case 'Medium':
        return COLORS.priorityMedium;
      case 'Low':
        return COLORS.priorityLow;
      default:
        return COLORS.textSecondaryLight;
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <ScrollView>
          <Title style={styles.title}>{task.title}</Title>

          <View style={styles.badgeRow}>
            <Badge style={[styles.badge, { backgroundColor: getPriorityColor() }]}>
              Priority: {task.priority}
            </Badge>
            <Badge style={[styles.badge, { backgroundColor: COLORS.primary }]}>
              Category: {task.category}
            </Badge>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {task.description || 'No description provided.'}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, { color: task.completed ? COLORS.success : COLORS.warning }]}>
              {task.completed ? 'Completed' : 'Pending'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Deadline:</Text>
            <Text style={styles.infoValue}>{new Date(task.deadline).toLocaleString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created At:</Text>
            <Text style={styles.infoValue}>{new Date(task.createdAt).toLocaleString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>{new Date(task.updatedAt).toLocaleString()}</Text>
          </View>

          <Button mode="contained" onPress={onDismiss} style={styles.closeBtn} buttonColor={COLORS.primary}>
            Close
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    marginRight: 8,
    color: '#ffffff',
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  closeBtn: {
    marginTop: 24,
  },
});

export default TaskDetailsModal;
