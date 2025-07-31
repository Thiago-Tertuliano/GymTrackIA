import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: DataPoint[];
  title: string;
  height?: number;
  showValues?: boolean;
}

export default function SimpleChart({ 
  data, 
  title, 
  height = 120,
  showValues = true 
}: SimpleChartProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const barAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(barAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
  }, [barAnim, opacityAnim]);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <ThemedText style={[styles.title, { color: colors.text }]}>
        {title}
      </ThemedText>
      
      <View style={[styles.chartContainer, { height }]}>
        <View style={styles.chartArea}>
          {data.map((point, index) => {
            const percentage = range > 0 ? (point.value - minValue) / range : 0.5;
            const barHeight = percentage * (height - 40);
            const barColor = point.color || colors.tint;
            
            return (
              <View key={index} style={styles.barContainer}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                      transform: [{
                        scaleY: barAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      }],
                    },
                  ]}
                />
                
                {showValues && (
                  <ThemedText style={[styles.value, { color: colors.text }]}>
                    {point.value}
                  </ThemedText>
                )}
                
                <ThemedText style={[styles.label, { color: colors.text }]}>
                  {point.label}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chartContainer: {
    paddingHorizontal: 20,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
}); 