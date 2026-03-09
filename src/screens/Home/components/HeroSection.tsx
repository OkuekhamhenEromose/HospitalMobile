import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../../styles/theme';

const { width, height } = Dimensions.get('window');

interface HeroSectionProps {
  onMenuPress?: () => void;
  onFindOutMore?: () => void;
  onOurServices?: () => void;
  onOurPackages?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onMenuPress,
  onFindOutMore,
  onOurServices,
  onOurPackages,
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/hero-doctor.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.hamburger}
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="menu" size={28} color={COLORS.gray[800]} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          
          <Text style={styles.title}>
            Etta-Atlantic Memorial Hospital Ikate Lekki Lagos
          </Text>

          <Text style={styles.description}>
            Etta-Atlantic Memorial Hospital Lekki stands as the premier private
            hospital in Lekki, Lagos. Our foundation was laid with the singular
            purpose of delivering world-class healthcare to the community of Lagos
            and the broader Nigerian populace.
          </Text>

          <Text style={styles.subDescription}>
            Established by a physician with medical training and experience practicing
            in the US, along with access to expert consultation and up-to-date research.
            Markedly, he has teamed up with bright and dedicated Nigerian physicians and
            other allied health professionals with training home and abroad to provide
            excellent care.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onFindOutMore}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>FIND OUT MORE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onOurServices}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>OUR SERVICES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              onPress={onOurPackages}
              activeOpacity={0.8}
            >
              <Text style={styles.outlineButtonText}>OUR PACKAGES</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.whatsappButton} activeOpacity={0.8}>
          <MaterialIcons name="whatsapp" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.95,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SIZES.paddingMd + 10,
    paddingHorizontal: SIZES.paddingMd,
    zIndex: 10,
  },
  hamburger: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: SIZES.radiusFull,
    ...SHADOWS.small,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: SIZES.paddingXl,
    paddingBottom: SIZES.paddingXl + 20,
  },
  welcomeText: {
    fontSize: SIZES.h5,
    fontWeight: '400',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    lineHeight: 34,
    marginBottom: SIZES.md,
  },
  description: {
    fontSize: SIZES.body2,
    color: COLORS.textPrimary,
    lineHeight: SIZES.body2 * 1.6,
    marginBottom: SIZES.sm,
  },
  subDescription: {
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
    lineHeight: SIZES.body3 * 1.5,
    marginBottom: SIZES.lg,
  },
  buttonContainer: {
    gap: SIZES.sm,
    marginTop: 'auto',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.paddingMd - 2,
    paddingHorizontal: SIZES.paddingLg,
    borderRadius: SIZES.radiusFull,
    alignSelf: 'flex-start',
    ...SHADOWS.medium,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body3,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SIZES.paddingMd - 2,
    paddingHorizontal: SIZES.paddingLg,
    borderRadius: SIZES.radiusFull,
    alignSelf: 'flex-start',
    ...SHADOWS.medium,
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body3,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outlineButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.paddingMd - 2,
    paddingHorizontal: SIZES.paddingLg,
    borderRadius: SIZES.radiusFull,
    alignSelf: 'flex-start',
    ...SHADOWS.small,
  },
  outlineButtonText: {
    color: COLORS.textPrimary,
    fontSize: SIZES.body3,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
    zIndex: 100,
  },
});

export default HeroSection;