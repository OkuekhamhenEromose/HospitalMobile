import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SafeAreaWrapper from '@components/common/SafeAreaWrapper';
import Footer from '@components/Layout/Footer';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import PostOfWeekSection from './components/PostOfWeekSection';
import BookAppointmentSection from './components/BookAppointmentSection';
import { COLORS } from '@constants/Theme';
import type { MainDrawerParamList, RootStackParamList } from '@types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList & MainDrawerParamList,
  'Home'
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleFindOutMore = () => {
    navigation.navigate('About');
  };

  const handleOurServices = () => {
    navigation.navigate('Services');
  };

  const handleOurPackages = () => {
    navigation.navigate('Packages');
  };

  const handleBookNow = () => {
    navigation.navigate('Contact');
  };

  const handlePostClick = (slug: string) => {
    navigation.navigate('BlogDetail', { slug });
  };

  const handleViewAllPosts = () => {
    navigation.navigate('Blog');
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <HeroSection
          onMenuPress={handleMenuPress}
          onFindOutMore={handleFindOutMore}
          onOurServices={handleOurServices}
          onOurPackages={handleOurPackages}
        />

        <AboutSection onBookNow={handleBookNow} />

        <ServicesSection />

        <PostOfWeekSection
          onPostClick={handlePostClick}
          onViewAllPosts={handleViewAllPosts}
          onPackagesClick={handleOurPackages}
        />

        <BookAppointmentSection onBookAppointment={handleBookNow} />

        <Footer
          onBookAppointment={handleBookNow}
          onAboutPress={handleFindOutMore}
          onServicesPress={handleOurServices}
          onPackagesPress={handleOurPackages}
          onContactPress={handleBookNow}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;