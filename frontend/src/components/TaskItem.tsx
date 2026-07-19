import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Checkbox, IconButton, Badge } from 'react-native-paper';
import { Task } from '../types';
import { COLORS } from '../constants';
import useAppDispatch from '../hooks/useAppDispatch';
import { toggleTaskCompletion, deleteTask } from '../redux/taskSlice';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onPress: (task: Task) => void;
}

const TaskItem = ({ task, onEdit, onPress }: TaskItemProps) => {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleTaskCompletion({ id: task._id, completed: task.completed }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
  };

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

  const getStatusBadge = () => {
    if (task.completed) {
      return (
        <Badge style={[styles.badge, styles.completedBadge]}>
          Completed
        </Badge>
      );
    }

    const now = new Date();
    const deadlineDate = new Date(task.deadline);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (deadlineDate < todayStart) {
      return (
        <Badge style={[styles.badge, styles.overdueBadge]}>
          Overdue
        </Badge>
      );
    }

    // 24 hours difference
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1 && diffDays >= 0) {
      return (
        <Badge style={[styles.badge, styles.dueSoonBadge]}>
          Due Soon
        </Badge>
      );
    }

    return (
      <Badge style={[styles.badge, styles.pendingBadge]}>
        Pending
      </Badge>
    );
  };

  return (
    <Card style={[styles.card, task.completed && styles.cardCompleted]} onPress={() => onPress(task)}>
      <View style={styles.container}>
        <Checkbox.Android
          status={task.completed ? 'checked' : 'unchecked'}
          onPress={handleToggle}
          color={COLORS.primary}
        />
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              task.completed && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          ) : null}

          <View style={styles.badgeRow}>
            <Badge style={[styles.badge, { backgroundColor: getPriorityColor() }]}>
              {task.priority}
            </Badge>
            <Badge style={[styles.badge, { backgroundColor: COLORS.primary }]}>
              {task.category}
            </Badge>
            {getStatusBadge()}
            <Text style={styles.deadline}>
              Due: {new Date(task.deadline).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => onEdit(task)}
            iconColor={COLORS.primary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={handleDelete}
            iconColor={COLORS.error}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardCompleted: {
    opacity: 0.85,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  description: {
    fontSize: 13,
    color: '#555555',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  badge: {
    marginRight: 6,
    color: '#ffffff',
    fontWeight: 'bold',
    borderRadius: 4,
    paddingHorizontal: 6,
  },
  completedBadge: {
    backgroundColor: '#4caf50',
  },
  pendingBadge: {
    backgroundColor: '#2196f3',
  },
  dueSoonBadge: {
    backgroundColor: '#ff9800',
  },
  overdueBadge: {
    backgroundColor: '#f44336',
  },
  deadline: {
    fontSize: 11,
    color: '#777777',
    marginLeft: 'auto',
  },
  actions: {
    flexDirection: 'row',
  },
});

export default TaskItem;
