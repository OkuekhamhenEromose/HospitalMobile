import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Defs, Use, ClipPath } from 'react-native-svg';
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

// ─── SVG Icon Components ──────────────────────────────────────────────────────

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {/* Door / threshold path */}
    <Path
      fill={color}
      fillRule="evenodd"
      d="m20.75 10.96l.782.626a.75.75 0 0 0 .936-1.172l-8.125-6.5a3.75 3.75 0 0 0-4.686 0l-8.125 6.5a.75.75 0 0 0 .937 1.172l.781-.626v10.29H2a.75.75 0 0 0 0 1.5h20a.75.75 0 0 0 0-1.5h-1.25zM9.25 9.5a2.75 2.75 0 1 1 5.5 0a2.75 2.75 0 0 1-5.5 0m2.8 3.75c.664 0 1.237 0 1.696.062c.492.066.963.215 1.345.597s.531.853.597 1.345c.058.43.062.96.062 1.573v4.423h-1.5V17c0-.728-.002-1.2-.048-1.546c-.044-.325-.114-.427-.172-.484s-.159-.128-.484-.172c-.347-.046-.818-.048-1.546-.048s-1.2.002-1.546.048c-.325.044-.427.115-.484.172s-.128.159-.172.484c-.046.347-.048.818-.048 1.546v4.25h-1.5v-4.3c0-.664 0-1.237.062-1.696c.066-.492.215-.963.597-1.345s.854-.531 1.345-.597c.459-.062 1.032-.062 1.697-.062z"
      clipRule="evenodd"
    />
    {/* Roof right side */}
    <Path
      fill={color}
      d="M18.5 3H16a.5.5 0 0 0-.5.5v.059l3.5 2.8V3.5a.5.5 0 0 0-.5-.5"
    />
    {/* Person/circle dot */}
    <Path
      fill={color}
      fillRule="evenodd"
      d="M10.75 9.5a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0"
      clipRule="evenodd"
    />
  </Svg>
);

const AboutIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M256 42.667c117.822 0 213.334 95.512 213.334 213.333c0 117.82-95.512 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334S138.18 42.667 256 42.667m21.38 192h-42.666v128h42.666zM256.217 144c-15.554 0-26.837 11.22-26.837 26.371c0 15.764 10.986 26.963 26.837 26.963c15.235 0 26.497-11.2 26.497-26.667c0-15.446-11.262-26.667-26.497-26.667"
    />
  </Svg>
);

const ServicesIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M4.616 21q-.691 0-1.153-.462T3 19.385V8.615q0-.69.463-1.152T4.615 7H9V5.615q0-.69.463-1.153T10.616 4h2.769q.69 0 1.153.462T15 5.615V7h4.385q.69 0 1.152.463T21 8.616v10.769q0 .69-.463 1.153T19.385 21zM10 7h4V5.615q0-.23-.192-.423T13.385 5h-2.77q-.23 0-.423.192T10 5.615zm1.5 7.5v3h1v-3h3v-1h-3v-3h-1v3h-3v1z"
    />
  </Svg>
);

const BlogIcon = ({ color, size }: { color: string; size: number }) => (
  // Iconify: material-symbols:book-2-outline — open book shape
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1-2.5-2.5m2.5.5H18v-3H6.5a.5.5 0 0 0 0 1H18v1H6.5a.5.5 0 0 0 0 1M8 7h8v2H8zm0 4h6v2H8z"
    />
  </Svg>
);

const ContactIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill={color}
      d="M46.483 14.556C45.925 32.293 31.372 46.5 13.5 46.5c-6.833 0-12-5.335-12-12.069a4.5 4.5 0 0 1 2.829-4.178l6.165-2.466a5.5 5.5 0 0 1 5.932 1.217l3.076 3.077c.136.136.289.152.382.124a18.55 18.55 0 0 0 12.32-12.32c.029-.094.013-.247-.123-.383l-3.077-3.076a5.5 5.5 0 0 1-1.217-5.932l2.466-6.165A4.5 4.5 0 0 1 34.431 1.5c7.365 0 12.166 5.861 12.052 13.056"
    />
  </Svg>
);

const DashboardIcon = ({ color, size }: { color: string; size: number }) => (
  // Ionicons grid equivalent — 2×2 grid
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M3 3h8v8H3zm0 10h8v8H3zM13 3h8v8h-8zm0 10h8v8h-8z"
    />
  </Svg>
);

// ─── Icon map ─────────────────────────────────────────────────────────────────

type IconName = 'Home' | 'About' | 'Services' | 'Blog' | 'Contact' | 'Dashboard';

const TAB_ICONS: Record<IconName, React.FC<{ color: string; size: number }>> = {
  Home: HomeIcon,
  About: AboutIcon,
  Services: ServicesIcon,
  Blog: BlogIcon,
  Contact: ContactIcon,
  Dashboard: DashboardIcon,
};

// ─── Navigators ───────────────────────────────────────────────────────────────

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
          const IconComponent = TAB_ICONS[route.name as IconName];
          if (!IconComponent) return null;
          return <IconComponent color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      {/* <Tab.Screen name="Packages" component={PackagesScreen} /> */}
      <Tab.Screen name="Blog" component={BlogListScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      {/* Always rendered; hidden when logged out */}
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