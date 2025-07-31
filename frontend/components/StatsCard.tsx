import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color,
  delay = 0,
  trend,
}: StatsCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardColor = color || colors.tint;
  
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const valueAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: delay * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay: delay * 100,
        useNativeDriver: true,
      }),
    ]);

    const valueAnimation = Animated.timing(valueAnim, {
      toValue: 1,
      duration: 1000,
      delay: delay * 100 + 200,
      useNativeDriver: false,
    });

    animation.start();
    valueAnimation.start();
  }, [scaleAnim, opacityAnim, valueAnim, delay]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'arrow.up.circle.fill';
      case 'down': return 'arrow.down.circle.fill';
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#00FF7F';
      case 'down': return '#FF6B6B';
      default: return colors.icon;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: cardColor + '20' }]}>
              <IconSymbol size={20} name={icon} color={cardColor} />
            </View>
          )}
          
          {trend && (
            <IconSymbol size={16} name={getTrendIcon()!} color={getTrendColor()} />
          )}
        </View>
        
        <Animated.View style={[styles.valueContainer, { opacity: valueAnim }]}>
          <ThemedText style={[styles.value, { color: cardColor }]}>
            {value}
          </ThemedText>
        </Animated.View>
        
        <ThemedText style={[styles.title, { color: colors.text }]}>
          {title}
        </ThemedText>
        
        {subtitle && (
          <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
  },
}); 