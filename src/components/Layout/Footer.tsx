import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@constants/Theme';

interface FooterProps {
  onBookAppointment?: () => void;
  onAboutPress?: () => void;
  onServicesPress?: () => void;
  onPackagesPress?: () => void;
  onContactPress?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onBookAppointment,
  onAboutPress,
  onServicesPress,
  onPackagesPress,
  onContactPress,
}) => {
  const handlePhonePress = () => {
    Linking.openURL('tel:08083734008');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:hello@ettaatlantic.com');
  };

  const handleSocialPress = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: 'https://facebook.com/ethaatlantic',
      twitter: 'https://twitter.com/ethaatlantic',
      instagram: 'https://instagram.com/ethaatlantic',
    };
    if (urls[platform]) {
      Linking.openURL(urls[platform]);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryLight]}
      style={styles.container}
    >
      {/* Logo and Address */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="local-hospital" size={40} color={COLORS.white} />
        </View>
        <Text style={styles.address}>
          <Text style={styles.addressBold}>22 Abioro Street, Ikate Lekki,</Text>
          {'\n'}
          <Text style={styles.addressBold}>Lagos State</Text>
          {'\n'}
          Nigeria
        </Text>
      </View>

      {/* About Us Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <TouchableOpacity onPress={onAboutPress}>
          <Text style={styles.link}>About Etta-Atlantic Memorial</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>News & Articles</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onContactPress}>
          <Text style={styles.link}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      {/* Useful Links Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Useful Links</Text>
        <TouchableOpacity onPress={onServicesPress}>
          <Text style={styles.link}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPackagesPress}>
          <Text style={styles.link}>Healthcare Packages</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBookAppointment}>
          <Text style={styles.link}>Book an Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <Text style={styles.contactText}>
          Call us now if you are in a medical emergency need, we will reply
          swiftly and provide you with a medical aid.
        </Text>

        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.phone}>08083734008</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.email}>hello@ettaatlantic.com</Text>
        </TouchableOpacity>

        <Text style={styles.socialText}>Visit us on social networks:</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialPress('facebook')}
          >
            <FontAwesome name="facebook" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialPress('twitter')}
          >
            <FontAwesome name="twitter" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialPress('instagram')}
          >
            <FontAwesome name="instagram" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Copyright */}
      <View style={styles.copyrightSection}>
        <Text style={styles.copyright}>
          © 2026 Etta-Atlantic Memorial Hospital | All rights reserved.
        </Text>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={onBookAppointment}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* WhatsApp Floating Button */}
      <TouchableOpacity style={styles.whatsappButton} activeOpacity={0.8}>
        <MaterialIcons name="whatsapp" size={32} color={COLORS.white} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.paddingXl,
    paddingHorizontal: SIZES.paddingLg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  address: {
    fontSize: SIZES.body1,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: SIZES.body1 * 1.5,
  },
  addressBold: {
    fontWeight: '700',
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  link: {
    fontSize: SIZES.body2,
    color: COLORS.white,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  contactSection: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  contactText: {
    fontSize: SIZES.body2,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: SIZES.body2 * 1.5,
    marginBottom: SIZES.lg,
  },
  phone: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  email: {
    fontSize: SIZES.body2,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SIZES.lg,
  },
  socialText: {
    fontSize: SIZES.body3,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyrightSection: {
    alignItems: 'center',
    paddingTop: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  copyright: {
    fontSize: SIZES.body3,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  bookButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SIZES.paddingMd,
    paddingHorizontal: SIZES.paddingXl,
    borderRadius: SIZES.radiusFull,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body2,
    fontWeight: '700',
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default Footer;