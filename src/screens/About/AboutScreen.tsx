import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SafeAreaWrapper from '@components/common/SafeAreaWrapper';
import { COLORS, SIZES } from '@constants/Theme';

const AboutScreen: React.FC = () => {
  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>About Etha-Atlantic Memorial Hospital</Text>
          <Text style={styles.subtitle}>Ikate Lekki, Lagos</Text>
          
          <Text style={styles.paragraph}>
            Etha-Atlantic Memorial Hospital Lekki stands as the premier private
            hospital in Lekki, Lagos. Our foundation was laid with the singular
            purpose of delivering world-class healthcare to the community of Lagos
            and the broader Nigerian populace.
          </Text>

          <Text style={styles.paragraph}>
            Established by a physician with medical training and experience practicing
            in the US, along with access to expert consultation and up-to-date research.
            Markedly, he has teamed up with bright and dedicated Nigerian physicians and
            other allied health professionals with training home and abroad to provide
            excellent care.
          </Text>

          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            To provide world-class healthcare services to the community of Lagos and
            the broader Nigerian populace, upholding the highest standards of medical
            excellence and patient care.
          </Text>

          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.paragraph}>
            To be the leading private healthcare institution in West Africa, recognized
            for our commitment to evidence-based medicine, advanced technology, and
            compassionate patient care.
          </Text>
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
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  paragraph: {
    fontSize: SIZES.body1,
    lineHeight: SIZES.body1 * 1.6,
    color: COLORS.textSecondary,
    marginBottom: SIZES.md,
  },
});

export default AboutScreen;