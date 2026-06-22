import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

import HomeScreen from '../screens/Home/HomeScreen';
import AboutScreen from '../screens/About/AboutScreen';
import ServicesScreen from '../screens/Services/ServicesScreen';
// import PackagesScreen from '../screens/Packages/PackagesScreen';
import BlogListScreen from '../screens/Blog/BlogListScreen';
import ContactScreen from '../screens/Contact/ContactScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

import type { RootStackParamList, AuthStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const MainTabs = () => {
  const { user } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1378e5',
        tabBarInactiveTintColor: '#6b7280',
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            Home: 'home-outline',
            About: 'information-circle-outline',
            Services: 'briefcase-outline',
            Packages: 'pricetag-outline',
            Blog: 'newspaper-outline',
            Contact: 'call-outline',
            Dashboard: 'grid-outline',
          };
          return (
            <Ionicons
              name={(icons[route.name] || 'ellipse-outline') as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      {/* <Tab.Screen name="Packages" component={PackagesScreen} /> */}
      <Tab.Screen name="Blog" component={BlogListScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      {/* Always render, hide tab button when logged out */}
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarButton: user ? undefined : () => null,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        {/* <Stack.Screen
          name="BlogDetail"
          component={BlogDetailScreen}
          options={{ presentation: 'card', headerShown: true }}
        /> */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;