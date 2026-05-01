import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import Button from '@components/common/Button';
import { COLORS, SIZES, SHADOWS } from '@constants/Theme';

const { width } = Dimensions.get('window');

interface AboutSectionProps {
  onBookNow?: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ onBookNow }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary]}
        style={styles.header}
      >
        <Text style={styles.headerText}>
          Etta-Atlantic Memorial Hospital Lekki Lagos is the best hospital in Lagos,
          Nigeria. Our standards are in line with the World Health Organization and
          principled on evidence-based medicine.
        </Text>
      </LinearGradient>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {/* Professional Team Card */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Professional Team</Text>
            <View style={styles.underline} />
          </View>
          <Text style={styles.cardText}>
            We have teamed up with highly qualified physicians and health professionals
            to provide excellent care to all our patients. Additionally, we pride
            ourselves on providing quality and effective medical treatment for everyone.
            Our Medical Services are tailored to provide the best health care for you and
            your loved ones.
          </Text>
        </LinearGradient>

        {/* Advanced Technology Card */}
        <LinearGradient
          colors={[COLORS.primaryLight, COLORS.primary]}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Advanced Technology</Text>
            <View style={styles.underline} />
          </View>
          <Text style={styles.cardText}>
            We are using advanced electronic medical records systems for better services
            and fast delivery of good healthcare services in Lagos. Telemedicine gives us
            access to the best medical professionals all over the world. We also partner
            with hospitals and healthcare centres in Lagos, Nigeria and across the globe.
          </Text>
        </LinearGradient>

        {/* Great Facilities Card */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Great Facilities</Text>
            <View style={styles.underline} />
          </View>
          <Text style={styles.cardText}>
            We use standard medical and imaging equipment including BiPAP ventilators,
            CTG, defibrillators, ultrasound scan machines, ECG, cardiac monitors, infusion
            pumps etc. Also, our hospital in Ikate Lekki includes world-class hospital
            furniture and a well-equipped medical laboratory to cater to all your health
            needs.
          </Text>
        </LinearGradient>

        {/* CTA Card */}
        <View style={[styles.card, styles.ctaCard]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, styles.ctaTitle]}>Speak to a Doctor</Text>
            <View style={[styles.underline, styles.ctaUnderline]} />
          </View>
          <Text style={[styles.cardText, styles.ctaText]}>
            Book an appointment to see a Medical Doctor for all your health concerns.
          </Text>
          {/* <Button
            title="BOOK NOW"
            onPress={onBookNow || (() => {})}
            variant="primary"
            size="medium"
            style={styles.ctaButton}
          /> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.xl,
  },
  header: {
    padding: SIZES.paddingXl,
    paddingVertical: SIZES.paddingXl + 8,
  },
  headerText: {
    fontSize: SIZES.body1,
    lineHeight: SIZES.body1 * 1.6,
    color: COLORS.white,
    textAlign: 'center',
  },
  cardsContainer: {
    // No gap needed - cards will be flush
  },
  card: {
    padding: SIZES.paddingLg,
    paddingVertical: SIZES.paddingXl,
  },
  cardHeader: {
    marginBottom: SIZES.md,
  },
  cardTitle: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  underline: {
    width: 80,
    height: 2,
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  cardText: {
    fontSize: SIZES.body2,
    lineHeight: SIZES.body2 * 1.6,
    color: COLORS.white,
  },
  ctaCard: {
    backgroundColor: COLORS.secondary,
    borderBottomLeftRadius: SIZES.radiusLg,
    borderBottomRightRadius: SIZES.radiusLg,
  },
  ctaTitle: {
    color: COLORS.white,
  },
  ctaUnderline: {
    backgroundColor: COLORS.white,
    opacity: 1,
  },
  ctaText: {
    color: COLORS.white,
    marginBottom: SIZES.lg,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    marginTop: SIZES.md,
  },
});

export default AboutSection;