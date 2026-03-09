import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from '@components/common/Button';
import { COLORS, SIZES } from '@constants/theme';

interface BookAppointmentSectionProps {
  onBookAppointment?: () => void;
}

const BookAppointmentSection: React.FC<BookAppointmentSectionProps> = ({
  onBookAppointment,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={require('@assets/images/consult-doctor.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Main Content */}
        <View style={styles.textContainer}>
          <Text style={styles.question}>
            Are you in need of one of the best private hospitals in Lagos?
          </Text>
          <Text style={styles.answer}>Search no more! You are at the right place.</Text>

          <View style={styles.card}>
            <Text style={styles.cardText}>
              Etha-Atlantic Memorial Hospital Lekki Lagos has the best medical
              specialists on ground with impeccable track records. We pay attention to
              standards and follow best practices.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Speak to a Doctor</Text>
          <View style={styles.underline} />
          <Text style={styles.ctaText}>
            Book an appointment to see a medical doctor for all your health concerns.
          </Text>
          <Button
            title="BOOK AN APPOINTMENT"
            onPress={onBookAppointment || (() => {})}
            variant="primary"
            size="medium"
            style={styles.ctaButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.xxl,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SIZES.paddingLg,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  image: {
    width: 280,
    height: 200,
  },
  textContainer: {
    marginBottom: SIZES.xl,
  },
  question: {
    fontSize: SIZES.h5,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
    lineHeight: SIZES.h5 * 1.3,
  },
  answer: {
    fontSize: SIZES.body1,
    color: COLORS.textPrimary,
    marginBottom: SIZES.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    padding: SIZES.paddingLg,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.white,
  },
  cardText: {
    fontSize: SIZES.body2,
    lineHeight: SIZES.body2 * 1.6,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
  },
  ctaContainer: {
    alignItems: 'flex-start',
  },
  ctaTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  underline: {
    width: 96,
    height: 3,
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.lg,
  },
  ctaText: {
    fontSize: SIZES.body1,
    color: COLORS.textPrimary,
    lineHeight: SIZES.body1 * 1.6,
    marginBottom: SIZES.lg,
  },
  ctaButton: {
    alignSelf: 'flex-start',
  },
});

export default BookAppointmentSection;