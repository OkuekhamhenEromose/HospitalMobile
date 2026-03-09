import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@contexts/AuthContext';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Screens
import HomeScreen from '@screens/Home/HomeScreen';
import AboutScreen from '@screens/About/AboutScreen';
import ServicesScreen from '@screens/Services/ServicesScreen';
import PackagesScreen from '@screens/Packages/PackagesScreen';
import BlogListScreen from '@screens/Blog/BlogListScreen';
import BlogDetailScreen from '@screens/Blog/BlogDetailScreen';
import ContactScreen from '@screens/Contact/ContactScreen';
import DashboardScreen from '@screens/Dashboard/DashboardScreen';
import LoginScreen from '@screens/Auth/LoginScreen';
import RegisterScreen from '@screens/Auth/RegisterScreen';

// Types
import type {
  RootStackParamList,
  MainDrawerParamList,
  AuthStackParamList,
} from '@types/navigation';

const Drawer = createDrawerNavigator<MainDrawerParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const MainDrawer = () => {
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // Hide header globally
        drawerActiveTintColor: '#1378e5',
        drawerInactiveTintColor: '#6b7280',
        drawerStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About Us', headerShown: true }}
      />
      <Drawer.Screen
        name="Services"
        component={ServicesScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Packages"
        component={PackagesScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Blog"
        component={BlogListScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={{ headerShown: true }}
      />
      {user && (
        <Drawer.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'My Dashboard', headerShown: true }}
        />
      )}
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainDrawer} />
        <Stack.Screen
          name="BlogDetail"
          component={BlogDetailScreen}
          options={{ presentation: 'card', headerShown: true }}
        />
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