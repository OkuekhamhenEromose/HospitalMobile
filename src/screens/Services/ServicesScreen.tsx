import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SafeAreaWrapper from '@components/common/SafeAreaWrapper';
import { COLORS, SIZES } from '@constants/theme';

const ServicesScreen: React.FC = () => {
  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Our Services</Text>
          <Text style={styles.paragraph}>Services content coming soon...</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.paddingLg,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SIZES.lg,
  },
  paragraph: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
});

export default ServicesScreen;