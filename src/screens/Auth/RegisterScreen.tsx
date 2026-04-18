import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SafeAreaWrapper from '@components/common/SafeAreaWrapper';
import { COLORS, SIZES } from '@constants/theme';

const RegisterScreen: React.FC = () => {
  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.paragraph}>Registration form coming soon...</Text>
        </View>
      </View>
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

export default RegisterScreen;