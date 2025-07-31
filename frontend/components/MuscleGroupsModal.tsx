import React from 'react';
import { Modal, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import GymButton from '@/components/GymButton';

interface MuscleGroupsModalProps {
  visible: boolean;
  onClose: () => void;
  onMuscleGroupSelect: (muscleGroup: string) => void;
}

const MuscleGroupVisual = ({ 
  muscleGroup, 
  onPress, 
  colors 
}: { 
  muscleGroup: string; 
  onPress: () => void;
  colors: any;
}) => {
  const getMuscleIcon = (group: string) => {
    switch (group) {
      case 'peito': return '💪';
      case 'costas': return '🏋️';
      case 'ombro': return '🤲';
      case 'biceps': return '💪';
      case 'triceps': return '💪';
      case 'perna': return '🦵';
      case 'gluteo': return '🍑';
      case 'abdomen': return '🏃';
      case 'cardio': return '❤️';
      case 'full_body': return '👤';
      default: return '💪';
    }
  };

  const getMuscleColor = (group: string) => {
    switch (group) {
      case 'peito': return '#FF6B6B';
      case 'costas': return '#4ECDC4';
      case 'ombro': return '#45B7D1';
      case 'biceps': return '#96CEB4';
      case 'triceps': return '#FFEAA7';
      case 'perna': return '#DDA0DD';
      case 'gluteo': return '#FFB6C1';
      case 'abdomen': return '#98D8C8';
      case 'cardio': return '#FF8A80';
      case 'full_body': return '#F7DC6F';
      default: return '#FF6B6B';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.muscleGroupVisual, 
        { 
          backgroundColor: getMuscleColor(muscleGroup),
          borderColor: colors.border 
        }
      ]}
      onPress={onPress}
    >
      <Text style={styles.muscleIcon}>{getMuscleIcon(muscleGroup)}</Text>
      <ThemedText style={[styles.muscleGroupName, { color: '#FFFFFF' }]}>
        {muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default function MuscleGroupsModal({ 
  visible, 
  onClose, 
  onMuscleGroupSelect 
}: MuscleGroupsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const muscleGroups = [
    'peito', 'costas', 'ombro', 'biceps', 'triceps', 
    'perna', 'gluteo', 'abdomen', 'cardio', 'full_body'
  ];

  const handleMuscleGroupSelect = (muscleGroup: string) => {
    console.log('🎯 Selecionou grupo muscular:', muscleGroup);
    onMuscleGroupSelect(muscleGroup);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface, maxHeight: '90%' }]}>
          <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
            Selecione o Grupo Muscular
          </ThemedText>

          <ThemedText style={{ color: colors.icon, textAlign: 'center', marginBottom: 15, fontSize: 14 }}>
            Toque no grupo muscular para ver os exercícios disponíveis
          </ThemedText>

          <ScrollView style={styles.muscleGroupsGrid} showsVerticalScrollIndicator={false}>
            <View style={styles.muscleGroupsGridContainer}>
              {muscleGroups.map((muscleGroup) => (
                <MuscleGroupVisual
                  key={muscleGroup}
                  muscleGroup={muscleGroup}
                  colors={colors}
                  onPress={() => handleMuscleGroupSelect(muscleGroup)}
                />
              ))}
            </View>
          </ScrollView>

          <GymButton
            title="Fechar"
            onPress={onClose}
            variant="outline"
            size="medium"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    zIndex: 1001,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  muscleGroupsGrid: {
    maxHeight: 400,
  },
  muscleGroupsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    maxHeight: 400,
  },
  muscleGroupVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    marginHorizontal: 4,
    width: 90,
    height: 90,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  muscleIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  muscleGroupName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}; 