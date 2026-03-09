import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@constants/theme';

interface Service {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

const ServicesSection: React.FC = () => {
  const services: Service[] = [
    {
      icon: 'local-hospital',
      title: 'Acute Hospital Medicine',
      description:
        'We provide a 24-hour emergency service to ensure acute care for patients presenting with a range of medical illnesses.',
    },
    {
      icon: 'biotech',
      title: 'Medical Laboratory & Diagnostics',
      description:
        'Our laboratory unit is well-equipped with advanced equipment to carry out a variety of investigations for rapid and standard results.',
    },
    {
      icon: 'hotel',
      title: 'Surgery',
      description:
        'Etha-Atlantic Memorial Hospital Ikate Lekki Lagos has a state of the art surgical centre offering a wide range of surgical services.',
    },
    {
      icon: 'family-restroom',
      title: 'Family Healthcare',
      description:
        'Visit Etha-Atlantic Memorial Hospital in Ikate Lekki Lagos for preventive health screenings (check-ups) for you and your family.',
    },
    {
      icon: 'local-pharmacy',
      title: 'Pharmacy',
      description:
        'Our pharmacy is well-stocked with high quality medications and a qualified pharmacist for proper dispersion of needed medications.',
    },
    {
      icon: 'health-and-safety',
      title: 'Health Insurance',
      description:
        'Fortunately, Etha-Atlantic Memorial Hospital Ikate Lekki Lagos work collaboratively with various Health Maintenance Organizations (HMOs) to ensure adequate coverage for your healthcare.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Etha-Atlantic Memorial Hospital</Text>
        <Text style={styles.titleHighlight}>Ikate Lekki Lagos</Text>
        <Text style={styles.subtitle}>Our Medical Services</Text>
      </View>

      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <MaterialIcons
              name={service.icon}
              size={60}
              color={COLORS.secondary}
              style={styles.icon}
            />
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <View style={styles.underline} />
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.xl,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    paddingHorizontal: SIZES.paddingLg,
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  titleHighlight: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  servicesContainer: {
    paddingHorizontal: SIZES.paddingLg,
  },
  serviceCard: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
    paddingHorizontal: SIZES.paddingMd,
  },
  icon: {
    marginBottom: SIZES.md,
  },
  serviceTitle: {
    fontSize: SIZES.h5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  underline: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.sm,
  },
  serviceDescription: {
    fontSize: SIZES.body2,
    lineHeight: SIZES.body2 * 1.5,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ServicesSection;