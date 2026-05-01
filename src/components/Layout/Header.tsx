import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../styles/Theme';

interface HeaderProps {
  onMenuPress?: () => void;
  title?: string;
  showLogo?: boolean;
  showBack?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  title,
  showLogo = true,
  showBack = false,
  onBackPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Left: Menu or Back button */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={showBack ? onBackPress : onMenuPress}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={showBack ? 'arrow-back' : 'menu'}
          size={28}
          color={COLORS.gray[800]}
        />
      </TouchableOpacity>

      {/* Center: Logo or Title */}
      {showLogo ? (
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      {/* Right: Placeholder for balance */}
      <View style={styles.iconButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: SIZES.paddingMd,
    paddingVertical: SIZES.paddingMd,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    ...SHADOWS.small,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: SIZES.radiusFull,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});

export default Header;