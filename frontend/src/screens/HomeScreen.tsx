import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { FAB, Searchbar, Title, Appbar, Button, Snackbar, Text } from 'react-native-paper';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { logout } from '../redux/authSlice';
import { fetchTasks, setFilter, setSearchQuery, clearTaskError } from '../redux/taskSlice';
import useTasks from '../hooks/useTasks';
import TaskItem from '../components/TaskItem';
import DashboardComponent from '../components/DashboardComponent';
import TaskModal from '../components/TaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { Task } from '../types';
import { COLORS } from '../constants';

const FILTER_OPTIONS = [
  'All',
  'Completed',
  'Pending',
  'High Priority',
  'Medium Priority',
  'Low Priority',
  "Today's Tasks",
  'Upcoming',
  'Overdue',
  'Work',
  'Personal',
  'Study',
  'Shopping',
  'Health',
  'Others',
];

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { filter, searchQuery, loading, error: taskError } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  const { filteredTasks } = useTasks();

  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [activeTaskDetails, setActiveTaskDetails] = useState<Task | null>(null);

  // Snackbar feedback state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (taskError) {
      setSnackbarMessage(taskError);
      setSnackbarVisible(true);
      dispatch(clearTaskError());
    }
  }, [taskError, dispatch]);

  const onRefresh = () => {
    dispatch(fetchTasks()).then(() => {
      setSnackbarMessage('Tasks updated successfully!');
      setSnackbarVisible(true);
    });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalVisible(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setTaskModalVisible(true);
  };

  const handlePressTask = (task: Task) => {
    setActiveTaskDetails(task);
    setDetailsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content 
          title={`Hello, ${user?.name || 'User'}`} 
          subtitle="Manage your tasks professionally" 
          titleStyle={styles.appbarTitle}
          subtitleStyle={styles.appbarSubtitle}
        />
        <Appbar.Action icon="logout" onPress={handleLogout} color="#ffffff" />
      </Appbar.Header>

      <DashboardComponent />

      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search by title, description or category..."
          onChangeText={(query) => dispatch(setSearchQuery(query))}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={COLORS.primary}
          placeholderTextColor="#757575"
        />
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_OPTIONS.map((opt) => (
            <Button
              key={opt}
              mode={filter === opt ? 'contained' : 'outlined'}
              onPress={() => dispatch(setFilter(opt))}
              style={styles.filterBtn}
              compact
              labelStyle={styles.filterLabel}
              buttonColor={filter === opt ? COLORS.primary : undefined}
              textColor={filter === opt ? '#ffffff' : COLORS.primary}
            >
              {opt}
            </Button>
          ))}
        </ScrollView>
      </View>

      {loading && filteredTasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onEdit={handleEditTask}
              onPress={handlePressTask}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Title style={styles.emptyTextTitle}>No Tasks Found</Title>
              <Text style={styles.emptyTextSub}>Try adding a task or changing your filter criteria</Text>
              <Button 
                mode="contained" 
                onPress={handleAddTask} 
                style={styles.addFirstBtn}
                buttonColor={COLORS.primary}
              >
                Create First Task
              </Button>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddTask}
        color="#ffffff"
      />

      <TaskModal
        visible={taskModalVisible}
        onDismiss={() => setTaskModalVisible(false)}
        task={selectedTask}
      />

      <TaskDetailsModal
        visible={detailsModalVisible}
        onDismiss={() => setDetailsModalVisible(false)}
        task={activeTaskDetails}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appbar: {
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  appbarTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  appbarSubtitle: {
    color: '#e0e0e0',
    fontSize: 12,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  searchbar: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filterSection: {
    paddingLeft: 16,
    marginBottom: 10,
  },
  filterScroll: {
    paddingRight: 16,
  },
  filterBtn: {
    marginRight: 8,
    borderRadius: 24,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 88,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
    paddingHorizontal: 32,
  },
  emptyTextTitle: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyTextSub: {
    color: '#757575',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  addFirstBtn: {
    borderRadius: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    elevation: 4,
  },
  snackbar: {
    backgroundColor: '#323232',
    borderRadius: 8,
  },
});

export default HomeScreen;
