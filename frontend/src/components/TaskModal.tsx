import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Modal, Portal, TextInput, Button, Title, RadioButton, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task } from '../types';
import { COLORS, CATEGORIES, PRIORITIES } from '../constants';
import useAppDispatch from '../hooks/useAppDispatch';
import { createTask, updateTask } from '../redux/taskSlice';

interface TaskModalProps {
  visible: boolean;
  onDismiss: () => void;
  task?: Task | null;
}

const TaskModal = ({ visible, onDismiss, task }: TaskModalProps) => {
  const dispatch = useAppDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'Medium',
      category: task?.category || 'Personal',
      deadline: task?.deadline ? new Date(task.deadline) : new Date(),
    },
  });

  React.useEffect(() => {
    if (visible) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'Medium',
        category: task?.category || 'Personal',
        deadline: task?.deadline ? new Date(task.deadline) : new Date(),
      });
    }
  }, [visible, task, reset]);

  const deadline = watch('deadline');

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      deadline: data.deadline.toISOString(),
    };

    if (task) {
      dispatch(updateTask({ id: task._id, taskData: formattedData }));
    } else {
      dispatch(createTask(formattedData));
    }
    onDismiss();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('deadline', selectedDate);
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Title style={styles.title}>{task ? 'Edit Task' : 'Add Task'}</Title>

          <Controller
            control={control}
            name="title"
            rules={{ 
              required: 'Title is required',
              maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Task Title"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.title}
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primaryDark}
              />
            )}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

          <Controller
            control={control}
            name="description"
            rules={{
              maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Description (Optional)"
                mode="outlined"
                multiline
                numberOfLines={3}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.description}
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primaryDark}
              />
            )}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

          <Text style={styles.sectionLabel}>Priority</Text>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <View style={styles.radioRow}>
                  {PRIORITIES.map((p) => (
                    <View key={p.value} style={styles.radioItem}>
                      <RadioButton.Android value={p.value} color={COLORS.primary} />
                      <Text>{p.label}</Text>
                    </View>
                  ))}
                </View>
              </RadioButton.Group>
            )}
          />

          <Text style={styles.sectionLabel}>Category</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollCategory}>
                  {CATEGORIES.map((c) => (
                    <View key={c.value} style={styles.radioItemHorizontal}>
                      <RadioButton.Android value={c.value} color={COLORS.primary} />
                      <Text style={styles.categoryText}>{c.label}</Text>
                    </View>
                  ))}
                </ScrollView>
              </RadioButton.Group>
            )}
          />

          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Deadline: {deadline.toLocaleDateString()}</Text>
            <Button mode="outlined" onPress={() => setShowDatePicker(true)} textColor={COLORS.primary}>
              Pick Date
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.buttonRow}>
            <Button mode="text" onPress={onDismiss} style={styles.actionBtn} textColor={COLORS.primary}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.actionBtn} buttonColor={COLORS.primary}>
              Save
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  scroll: {
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.primary,
  },
  input: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollCategory: {
    flexDirection: 'row',
  },
  radioItemHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryText: {
    fontSize: 13,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  actionBtn: {
    marginLeft: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 8,
  },
});

export default TaskModal;
