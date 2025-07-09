import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { Plus, Calendar, Dumbbell, Trash2, Edit3, Save, X } from 'lucide-react-native';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
}

// Define ExerciseModal outside of WorkoutTracker
const ExerciseModal = ({
  showAddExercise,
  setShowAddExercise,
  editingExercise,
  setEditingExercise,
  newExercise,
  setNewExercise,
  addExercise,
}) => (
  <Modal visible={showAddExercise} animationType="slide" transparent>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <View style={{ backgroundColor: 'white', margin: 16, padding: 24, borderRadius: 16, width: 320 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {editingExercise ? 'Edit Exercise' : 'Add Exercise'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowAddExercise(false);
              setEditingExercise(null);
              setNewExercise({ name: '', sets: '', reps: '', weight: '' });
            }}
            style={{ padding: 8 }}
          >
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}>Exercise Name *</Text>
            <TextInput
              value={newExercise.name}
              onChangeText={(text) => setNewExercise((prev:Exercise) => ({ ...prev, name: text }))}
              placeholder="e.g., Push-ups"
              style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 8 }}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}>Sets *</Text>
              <TextInput
                value={newExercise.sets}
                onChangeText={(text) => setNewExercise((prev:Exercise) => ({ ...prev, sets: text }))}
                placeholder="3"
                keyboardType="numeric"
                style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 8 }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}>Reps *</Text>
              <TextInput
                value={newExercise.reps}
                onChangeText={(text) => setNewExercise((prev:Exercise) => ({ ...prev, reps: text }))}
                placeholder="12"
                keyboardType="numeric"
                style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 8 }}
              />
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#374151' }}>Weight (lbs)</Text>
            <TextInput
              value={newExercise.weight}
              onChangeText={(text) => setNewExercise((prev:Exercise) => ({ ...prev, weight: text }))}
              placeholder="Optional"
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 8 }}
            />
          </View>

          <TouchableOpacity
            onPress={addExercise}
            style={{
              backgroundColor: '#3B82F6',
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 16
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {editingExercise ? 'Update Exercise' : 'Add Exercise'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('today');
  const [currentWorkout, setCurrentWorkout] = useState<any | null>();
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any | null>(null);

  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  const startWorkout = () => {
    const workout: any = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      exercises: [],
      isActive: true,
      startTime: new Date().toLocaleTimeString()
    };
    setCurrentWorkout(workout);
    setActiveTab('today');
  };

  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const exercise = {
      id: Date.now(),
      name: newExercise.name,
      sets: parseInt(newExercise.sets),
      reps: parseInt(newExercise.reps),
      weight: newExercise.weight ? parseFloat(newExercise.weight) : null
    };

    if (editingExercise) {
      setCurrentWorkout((prev: any) => ({
        ...prev,
        exercises: prev.exercises.map((ex:any) =>
          ex.id === editingExercise.id ? { ...exercise, id: editingExercise.id } : ex
        )
      }));
      setEditingExercise(null);
    } else {
      setCurrentWorkout((prev:any) => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }));
    }

    setNewExercise({ name: '', sets: '', reps: '', weight: '' });
    setShowAddExercise(false);
  };

  const editExercise = (exercise:any) => {
    setEditingExercise(exercise);
    setNewExercise({
      name: exercise.name,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      weight: exercise.weight ? exercise.weight.toString() : ''
    });
    setShowAddExercise(true);
  };

  const deleteExercise = (exerciseId: number) => {
    setCurrentWorkout((prev: any) => ({
      ...prev,
      exercises: prev.exercises.filter((ex: { id: number }) => ex.id !== exerciseId)
    }));
  };

  const finishWorkout = () => {
    if (!currentWorkout || (currentWorkout as {exercises:any}).exercises.length === 0) {
      Alert.alert('Error', 'Add at least one exercise to finish workout');
      return;
    }

    const finishedWorkout = {
      ...(currentWorkout as object),
      isActive: false,
      endTime: new Date().toLocaleTimeString(),
      duration: calculateDuration(currentWorkout.startTime, new Date().toLocaleTimeString())
    };

    setWorkouts(prev => [finishedWorkout, ...prev]);
    setCurrentWorkout(null);
    setActiveTab('history');
  };

  const calculateDuration = (start, end) => {
    // Simple duration calculation for demo
    return '45 min';
  };

  const deleteWorkout = (workoutId:any) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setWorkouts(prev => prev.filter(w => w.id !== workoutId))
        }
      ]
    );
  };

  const TodayTab = () => (
    <View style={{ flex: 1, padding: 16 }}>
      {!currentWorkout ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Dumbbell size={80} color="#3B82F6" />
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>Ready to Workout?</Text>
          <Text style={{ color: '#4B5563', textAlign: 'center', marginBottom: 32 }}>
            Start tracking your exercises and build your fitness routine
          </Text>
          <TouchableOpacity
            onPress={startWorkout}
            style={{ backgroundColor: '#3B82F6', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 9999 }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Current Workout</Text>
            <Text style={{ color: '#4B5563' }}>Started: {currentWorkout.startTime}</Text>
            <Text style={{ color: '#4B5563' }}>Exercises: {currentWorkout.exercises.length}</Text>
          </View>

          <ScrollView style={{ flex: 1, marginBottom: 16 }}>
            {currentWorkout.exercises.map((exercise: Exercise) => (
              <View
              key={exercise.id}
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
                // shadow for iOS
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                // elevation for Android
                elevation: 2,
              }}
              >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{exercise.name}</Text>
                <Text style={{ color: '#4B5563' }}>
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.weight && ` @ ${exercise.weight} lbs`}
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => editExercise(exercise)}
                  style={{ padding: 8 }}
                >
                  <Edit3 size={20} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteExercise(exercise.id)}
                  style={{ padding: 8 }}
                >
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
                </View>
              </View>
              </View>
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => setShowAddExercise(true)}
              style={{
                flex: 1,
                backgroundColor: '#3B82F6',
                padding: 16,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8
              }}
            >
              <Plus size={20} color="white" />
              <Text style={{ color: 'white', fontWeight: '600', marginLeft: 8 }}>Add Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={finishWorkout}
              style={{
                backgroundColor: '#22C55E',
                padding: 16,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Save size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const HistoryTab = () => (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Workout History</Text>
      {workouts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Calendar size={80} color="#9CA3AF" />
          <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#4B5563' }}>No Workouts Yet</Text>
          <Text style={{ color: '#6B7280', textAlign: 'center' }}>
            Complete your first workout to see it here
          </Text>
        </View>
      ) : (
        <ScrollView>
          {workouts.map((workout) => (
            <View
              key={workout.id}
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                // shadow for iOS
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                // elevation for Android
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{workout.date}</Text>
                  <Text style={{ color: '#4B5563' }}>
                    {workout.startTime} - {workout.endTime} ({workout.duration})
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteWorkout(workout.id)}
                  style={{ padding: 8 }}
                >
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <View style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8 }}>
                {workout.exercises.map((exercise: Exercise, index: number) => (
                  <Text key={index} style={{ color: '#374151', marginBottom: 4 }}>
                  • {exercise.name}: {exercise.sets} × {exercise.reps}
                  {exercise.weight && ` @ ${exercise.weight} lbs`}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: 'white', paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Workout Tracker</Text>
      </View>

      {/* Tab Navigation */}
      <View style={{ backgroundColor: 'white', flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => setActiveTab('today')}
          style={{
            flex: 1,
            padding: 16,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'today' ? '#3B82F6' : 'transparent'
          }}
        >
          <Text style={{
            fontWeight: '600',
            color: activeTab === 'today' ? '#3B82F6' : '#4B5563'
          }}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: 16,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'history' ? '#3B82F6' : 'transparent'
          }}
        >
          <Text style={{
            fontWeight: '600',
            color: activeTab === 'history' ? '#3B82F6' : '#4B5563'
          }}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'today' ? <TodayTab /> : <HistoryTab />}

      {/* Exercise Modal */}
      <ExerciseModal
        showAddExercise={showAddExercise}
        setShowAddExercise={setShowAddExercise}
        editingExercise={editingExercise}
        setEditingExercise={setEditingExercise}
        newExercise={newExercise}
        setNewExercise={setNewExercise}
        addExercise={addExercise}
      />
    </View>
  );
};

export default WorkoutTracker;