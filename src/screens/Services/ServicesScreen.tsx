// src/screens/Services/ServicesScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
  primary:   '#1378e5',
  secondary: '#177fed',
  red:       '#ef4444',
  white:     '#ffffff',
  bg:        '#f5f8ff',
  text:      '#1a2340',
  sub:       '#5a6a85',
  muted:     '#8898aa',
  border:    '#e2eaf5',
  green:     '#22c55e',
  dark:      '#111827',
};

// ── SVG Icons (from HomeScreen) ───────────────────────────────────────────────
const SignOutIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path
      fill={color}
      d="M12.232 3.25H9.768c-.813 0-1.469 0-2 .043c-.546.045-1.026.14-1.47.366a3.75 3.75 0 0 0-1.64 1.639c-.226.444-.32.924-.365 1.47c-.043.531-.043 1.187-.043 2v6.464c0 .813 0 1.469.043 2c.045.546.14 1.026.366 1.47a3.75 3.75 0 0 0 1.639 1.64c.444.226.924.32 1.47.365c.531.043 1.187.043 2 .043h2.464c.813 0 1.469 0 2-.043c.546-.045 1.026-.14 1.47-.366a3.75 3.75 0 0 0 1.64-1.639c.226-.444.32-.924.365-1.47c.043-.531.043-1.187.043-2V15a.75.75 0 0 0-1.5 0v.2c0 .852 0 1.447-.038 1.91c-.038.453-.107.714-.207.912c-.216.423-.56.767-.983.983c-.198.1-.459.17-.913.207c-.462.037-1.056.038-1.909.038H9.8c-.852 0-1.447 0-1.91-.038c-.453-.038-.714-.107-.911-.207a2.25 2.25 0 0 1-.984-.983c-.1-.198-.17-.459-.207-.913c-.037-.462-.038-1.057-.038-1.909V8.8c0-.852 0-1.447.038-1.91c.037-.453.107-.714.207-.911a2.25 2.25 0 0 1 .984-.984c.197-.1.458-.17.912-.207c.462-.037 1.057-.038 1.909-.038h2.4c.853 0 1.447 0 1.91.038c.453.037.714.107.912.207c.423.216.767.56.983.984c.1.197.17.458.207.912c.037.462.038 1.057.038 1.909V9a.75.75 0 0 0 1.5 0v-.232c0-.813 0-1.469-.043-2c-.045-.546-.14-1.026-.366-1.47a3.75 3.75 0 0 0-1.639-1.64c-.444-.226-.924-.32-1.47-.365c-.531-.043-1.187-.043-2-.043"
    />
    <Path
      fill={color}
      d="M12.47 8.47a.75.75 0 1 1 1.06 1.06l-1.72 1.72H20a.75.75 0 0 1 0 1.5h-8.19l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06z"
    />
  </Svg>
);

const NotificationIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path
      fill={color}
      fillRule="evenodd"
      d="M12 1a2 2 0 0 0-1.98 2.284A7 7 0 0 0 5 10v8H4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2h-1v-8a7 7 0 0 0-5.02-6.716Q14 3.144 14 3a2 2 0 0 0-2-2m2 21a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1"
      clipRule="evenodd"
    />
  </Svg>
);

const ProfileIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path
      fill={color}
      fillRule="evenodd"
      d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z"
      clipRule="evenodd"
    />
  </Svg>
);

// ── Service SVG Icons ─────────────────────────────────────────────────────────
const EmergencyIcon = ({ color = '#e03131' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 512 512">
    <Path d="M0 0h512v512H0z" fill="none" />
    <Path fill={color} d="m118.2 55l-2.5 5.02C108.9 73.86 99.93 79 91.97 79s-16.99-5.17-23.92-19.03l-16.1 8.06C61.02 86.17 75.99 97 91.97 97c14.43 0 27.93-8.91 37.03-24h82v419h18V73h81.8c7.3 11.92 17.2 19.95 28.2 22.82V119h18V95.84c12.5-3.24 23.7-13.13 31.1-27.81l-16.2-8.06C365 73.83 356 79 348 79s-17-5.17-23.9-19.03L321.6 55zm171.1 82c-1.3 3-3.9 9.6-5.4 19.8c-1.9 12.9-2.9 29.5-2.9 47.2c0 33.5 3.8 70.9 10.5 93.5c14 6 35.3 9.5 56.5 9.5s42.5-3.5 56.5-9.5c6.7-22.6 10.5-60 10.5-93.5c0-17.7-1-34.3-2.9-47.2c-1.5-10.2-4.1-16.8-5.4-19.8zm5.3 77c35.3 7.2 70.6 10.5 105.9 0c-.5 24-2.4 45-10.2 69.6c-28.9 3-56.5 11.4-89.9-3.9zm91.1 107.7c-5.8 1.1-11.8 1.9-17.9 2.4c.7 3.1 1.5 6.6 2.3 10.6c2.4 11.4 4.4 25.3 3.9 32.7v.1c-.4 6.3-3 13.3-6.2 21.1s-6.9 16.5-7.7 26.7c-1.2 14.7 1.4 34.1 4.1 50.4s5.6 29.4 5.6 29.4l17.6-4s-2.9-12.6-5.5-28.3c-2.5-15.8-4.7-35-3.8-46.1c.5-6.4 3.2-13.4 6.4-21.3s6.9-16.6 7.5-26.8c.7-11.5-1.8-25.6-4.2-37.5c-.7-3.4-1.5-6.6-2.1-9.4m-74.7.1v24.5h18v-22.1c-6.1-.5-12.2-1.3-18-2.4" />
  </Svg>
);

const InternalMedicineIcon = ({ color = '#1971c2' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 64 64">
    <Path d="M0 0h64v64H0z" fill="none" />
    <Path fill={color} d="M54.934.661H8.576C4.033.661.338 4.357.338 8.901v46.356c0 4.544 3.695 8.24 8.238 8.24h46.358c4.543 0 8.24-3.696 8.24-8.24V8.901c0-4.545-3.697-8.24-8.24-8.24M31.64 6.079a6.968 6.968 0 0 1 0 13.936a6.969 6.969 0 1 1 0-13.936m18.164 46.589c0 1.686-1.325 3.053-3.011 3.053s-3.051-1.367-3.051-3.053V33.186h-2.553v23.587H22.195V33.186h-2.526v19.482a3.05 3.05 0 0 1-3.049 3.053c-1.682 0-3.009-1.367-3.009-3.053V31.06c0-4.93 4.398-8.926 9.329-8.926h7.843v6.592l-1.507.416v-1.64c0-.98-.897-1.87-2.526-.774c-2.291 1.548-4.764 10.339-2.084 9.993c1.297-.165 2.028-.793 3.451-.873c1.154-.06 1.159-.558 1.159-1.212c.002-.655 0-2.756 0-2.756v-1.024l1.507-.418v9.267c.002 0 .026.649-.588.649h-.631c-.012 0-.022-.006-.034-.006h-1.855a3 3 0 0 0-2.993 2.996a2.997 2.997 0 0 0 2.993 2.995h8.308a.535.535 0 0 1 0 1.068h-8.596a2.386 2.386 0 0 0-2.381 2.385a2.385 2.385 0 0 0 2.381 2.382h8.596a.535.535 0 0 1 0 1.069H25.929a.924.924 0 0 0 0 1.848h10.054a2.383 2.383 0 0 0 0-4.765h-8.596a.535.535 0 0 1 0-1.07h8.596a2.383 2.383 0 0 0 0-4.765h-8.308a1.148 1.148 0 0 1 0-2.296h1.403c1.244 2.334 5.207 1.285 5.935.843c3.155-1.86 2.516-4.142 1.497-4.935c-1.618-1.253-3.88.285-3.88.285v-8.046c.453.113 1.02.251 1.509.368v1.171s-.001 2.102 0 2.757c.002.655.002 1.152 1.159 1.212c1.425.08 2.156.708 3.45.873c2.681.346.209-8.445-2.087-9.993c-1.63-1.096-2.523-.206-2.523.774v1.509l-1.509-.37v-6.506h8.204c4.93 0 8.969 3.996 8.97 8.924z" />
  </Svg>
);

const GeneralPracticeIcon = ({ color = '#2f9e44' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 128 128">
    <Path d="M0 0h128v128H0z" fill="none" />
    <Path fill="none" stroke="#BDBDBD" strokeLinejoin="round" strokeWidth={6} d="M60.55 98.3c-16.79 4.83-26.01-18.83-29.53-27.27C24 54.17 5.69 42.41 7.04 30s16.6-11.17 16.6-11.17" />
    <Path fill="none" stroke="#BDBDBD" strokeLinejoin="round" strokeWidth={6} d="M59.5 98.3c16.89-4.48 11.39-28.91 10.07-37.96c-2.63-18.08 7.04-37.57-.49-47.52S49.1 11.76 49.1 11.76" />
    <Circle cx="101.84" cy="32.23" r="15.25" fill={color} opacity={0.7} />
    <Circle cx="102.38" cy="31.13" r="13.41" fill={color} opacity={0.5} />
    <Path fill="none" stroke="#03A9F4" strokeWidth={8} d="M69.39 58.93c-.89 6.74 10.14 31.36-6.97 38.1c-19.16 7.56-26.31-20.55-31.39-26" />
    <Path fill="none" stroke="#03A9F4" strokeWidth={5} d="M32.63 73.54s10.77 11.36 23.4 6.15C68 74.75 69.86 61.64 69.86 61.64" />
    <Path fill={color} d="M100.96 21.43c-5.24 1.22-8.49 6.45-7.28 11.69c.18.78.46 1.54.83 2.26l.68 1.34c-1.92 2.51-3.48 3.47-4.01 6.38c1.36 1.33 2.95 2.39 4.69 3.13c0-.01.01-.02.01-.03c0 .01.01.02.01.04c2.87 1.22 6.14 1.59 9.42.83c.37-.09.72-.2 1.07-.31l-.31-2.8s.4-3.55.49-3.74c.23-.45 1.16-.69 1.64-.97c1.16-.7 2.17-1.65 2.95-2.76a9.8 9.8 0 0 0 1.5-7.78c-1.22-5.24-6.46-8.5-11.69-7.28" opacity=".22" />
    <Path fill="none" stroke="#03A9F4" strokeWidth={8} d="M60.42 96.03c9.59 21.97 24.29 25.08 35.15 23.19c9.54-1.67 22.17-10.22 22.14-25.72c-.04-18.68-12.5-17.5-19.25-29.47c-8.41-14.92 3.05-28.62 3.05-28.62" />
    <Path fill="#616161" d="M27.83 14.04c-1.5.01-2.82.73-3.69 1.82l-1.24-.98c-1.13-.89-2.79-.08-2.78 1.36l.04 5.19c.01 1.44 1.68 2.23 2.79 1.32l1.21-.98c.88 1.09 2.22 1.8 3.73 1.79c2.63-.02 4.75-2.17 4.73-4.8s-2.16-4.74-4.79-4.72m25.3-1.82l-2.65-4.46c-.74-1.24-2.58-1.07-3.08.27l-.55 1.48c-1.31-.49-2.81-.42-4.1.35a4.76 4.76 0 0 0-1.66 6.53a4.76 4.76 0 0 0 6.53 1.66c1.3-.77 2.08-2.07 2.27-3.46l1.54.21c1.42.19 2.44-1.34 1.7-2.58" />
    <Circle cx="104.19" cy="29.3" r="9.12" fill={color} opacity={0.8} />
    <Circle cx="104.65" cy="28.59" r="7.08" fill={color} opacity={0.3} />
    <Path fill="#757575" d="M42.37 15.11c-.83-1.19-.67-3.41.76-4.42s3.59-.57 4.42.76c.93 1.48-1.5.15-2.93 1.16s-1.25 3.94-2.25 2.5m-17.36 2.14c.36-1.41 2.13-2.74 3.83-2.32s2.78 2.33 2.32 3.83c-.51 1.67-1.1-1.04-2.8-1.45c-1.69-.42-3.78 1.64-3.35-.06" />
  </Svg>
);

const GynecologyIcon = ({ color = '#9c36b5' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill={color} d="m9.716 20.392l-.322-.623q-.206-.367-.286-.76q-.081-.392-.081-.809q0-.517.143-1.012t.455-.919q.22-.332.348-.722q.129-.39.129-.797q0-.439-.16-.846q-.16-.408-.348-.816q-.211-.436-.364-.879q-.153-.442-.153-.909V8.27q0-.799-.495-1.4t-1.255-.6q-.64 0-1.136.359q-.497.36-.583.936q.83.19 1.38.867T7.539 10q0 1.039-.73 1.77t-1.77.73t-1.769-.73T2.54 10q0-.923.594-1.611t1.475-.835q.106-.985.891-1.635t1.828-.65q.098 0 .187.013t.186.024q.966-.575 2.063-.806T12 4.27q1.154 0 2.251.23t2.063.806q.078-.012.177-.024t.176-.013q1.048 0 1.834.65t.891 1.635q.881.165 1.466.844q.584.679.584 1.602q0 1.039-.73 1.77t-1.77.73t-1.769-.73t-.73-1.77q0-.892.55-1.578t1.4-.856q-.107-.577-.593-.937q-.487-.36-1.133-.36q-.76 0-1.252.601t-.492 1.4v3.03q0 .467-.156.91q-.155.442-.361.878q-.194.408-.351.816t-.157.846q0 .408.12.807t.376.732q.287.442.433.918t.146.993q0 .417-.093.81q-.093.392-.274.76l-.321.642l-.916-.458l.322-.623q.144-.258.213-.54t.069-.591q0-.377-.12-.72t-.307-.668q-.33-.443-.49-.966q-.158-.523-.158-1.071q0-.517.163-.982t.38-.906q.188-.389.335-.784t.147-.803V8.27q0-.755.322-1.408t.884-1.026q-.746-.315-1.53-.44q-.784-.127-1.599-.127t-1.609.126t-1.52.441q.562.373.884 1.026t.322 1.407V11.3q0 .427.144.825t.338.78q.212.443.377.908q.166.464.166.962q0 .548-.159 1.068t-.47.969q-.214.327-.33.669t-.116.719q0 .308.079.59q.079.283.204.54l.301.624z" />
  </Svg>
);

const GeneralSurgeryIcon = ({ color = '#e67700' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 64 64">
    <Path d="M0 0h64v64H0z" fill="none" />
    <Path fill={color} d="M3.184 4.304a.407.407 0 0 1 .162-.555l2.97-1.618a.406.406 0 0 1 .554.164l1.191 2.173c4.503-1.35 9.492.57 11.835 4.861l-5.755 3.142a3.599 3.599 0 0 1-6.321 3.447l-5.757 3.138C-.282 14.767.795 9.533 4.373 6.478L3.184 4.303zm40.547 39.142H63.1v20.022H43.731zm-2.22 10.007H25.868a4.947 4.947 0 0 1-4.946-4.942a4.944 4.944 0 0 1 4.946-4.941h15.643zM7.784 57.462c0-1.105.895-2.002 2.001-2.002H41.51v8.006H7.784v-6.005zm12.03-9.975a5.97 5.97 0 0 1-5.975 5.966a5.97 5.97 0 0 1-5.976-5.966c0-3.293 2.675-5.963 5.976-5.963c3.299 0 5.975 2.67 5.975 5.963m32.66-16.707l-3.361-9.569c-.652-1.804-1.904-3.212-5.438-3.212H28.159c-3.533 0-4.787 1.408-5.436 3.212l-3.36 9.569c-.251.618-.381 2.007.986 2.937l7.901 5.206a2.507 2.507 0 0 0 3.469-.707a2.503 2.503 0 0 0-.713-3.468l-6.271-4.133l1.765-4.869h2.443l-1.431 3.95l4.761 3.138a4.76 4.76 0 0 1 2.057 3.039a4.76 4.76 0 0 1-.692 3.608a4.8 4.8 0 0 1-1.016 1.098h6.592a4.9 4.9 0 0 1-1.017-1.098a4.77 4.77 0 0 1-.694-3.608a4.77 4.77 0 0 1 2.058-3.039l4.764-3.138l-1.437-3.95h2.445l1.769 4.869l-6.274 4.133c-1.153.76-1.475 2.317-.712 3.468s2.317 1.469 3.47.707l7.9-5.206c1.368-.931 1.239-2.319.989-2.937zM37.461 8.634a2.36 2.36 0 0 1-2.144 1.373a2.37 2.37 0 0 1-2.149-1.373H28.84c-.07.38-.111.769-.111 1.17a6.61 6.61 0 0 0 6.611 6.603a6.607 6.607 0 0 0 6.612-6.603c0-.402-.043-.79-.11-1.17zm-4.439-1.559a2.37 2.37 0 0 1 2.295-1.788c1.106 0 2.039.764 2.291 1.788h3.75a6.61 6.61 0 0 0-6.017-3.876a6.61 6.61 0 0 0-6.017 3.876z" />
  </Svg>
);

const OrthopedicIcon = ({ color = '#2f9e44' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill={color} d="M13.29 5.79c-.28-1.014.104-2.309.847-3.052A2.519 2.519 0 0 1 17.7 6.3a2.519 2.519 0 0 1 3.562 3.563c-.743.743-2.038 1.128-3.052.848c-.536-.149-1.185-.173-1.579.22l-.842.843l-2.685.413v-.54a.75.75 0 0 0-.987-.712l-1.135.378V9.455L13.07 7.37c.393-.394.369-1.043.22-1.58m-3.808 5.165L7.37 13.07c-.394.393-1.043.369-1.58.22c-1.013-.28-2.308.105-3.051.848A2.519 2.519 0 0 0 6.3 17.7a2.519 2.519 0 0 0 3.563 3.562c.743-.743 1.128-2.038.848-3.052c-.149-.536-.173-1.185.22-1.579l3.064-3.064l-1.527.235a.75.75 0 0 1-.864-.741v-.374l-1.134.378a.75.75 0 0 1-.988-.711z" />
  </Svg>
);

const DermatologyIcon = ({ color = '#e8590c' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 64 64">
    <Path d="M0 0h64v64H0z" fill="none" />
    <Path fill={color} d="M30.899 50.352a1.76 1.76 0 0 0-2.486 0l-8.278 8.272l-1.03-1.03l11.1-11.085a1.758 1.758 0 0 0-2.486-2.488L16.622 55.108l-1.028-1.028l12.91-12.899a1.759 1.759 0 0 0-2.483-2.488L13.109 51.591l-1.028-1.03l10.132-10.124a1.759 1.759 0 0 0-2.485-2.486L6.693 50.961a958 958 0 0 1-.019-5.572c0-2.842-3.591-3.263-3.77-3.065C2.729 42.53.938 62.266.938 62.266H21.49l1.145-1.145l-.015-.013l8.281-8.274a1.76 1.76 0 0 0 .001-2.486z" />
    <Path fill={color} d="M40.146 1.963c-10.392 0-19.967 7.796-21.963 16.381c-.447 1.914-.947 6.898-.947 6.898l-4.775 12.034a1.844 1.844 0 0 0 1.702 2.562h1.63l2.911-2.909a3.2 3.2 0 0 1 5.402 1.632l.891-.89a3.2 3.2 0 0 1 4.592 4.454a3.204 3.204 0 0 1 1.637 5.405l-.93.928c.596.121 1.164.41 1.625.871a3.205 3.205 0 0 1 0 4.532l-2.065 2.062v6.345h24.447V42.841c5.322-4.185 8.751-10.691 8.751-17.99c0-12.644-10.251-22.889-22.908-22.889zm-17.269 27.85a2.555 2.555 0 1 1-.005-5.11a2.555 2.555 0 0 1 .005 5.11m11.956 5.953c.638 0 1.166.523 1.166 1.159c0 .644-.528 1.163-1.166 1.163a1.162 1.162 0 1 1 0-2.322m-.694 7.269a1.164 1.164 0 1 1 .004-2.328a1.164 1.164 0 0 1-.004 2.328m2.484 5.006a1.75 1.75 0 0 1-1.598-1.888a1.75 1.75 0 0 1 1.89-1.587c.957.082 1.67.928 1.584 1.883a1.737 1.737 0 0 1-1.876 1.591zm1.676-6.973a1.74 1.74 0 1 1 0-3.48c.955 0 1.733.778 1.733 1.739s-.778 1.741-1.733 1.741m2.473 3.649c-.646 0-1.17-.518-1.17-1.165a1.167 1.167 0 0 1 2.332 0c0 .646-.519 1.165-1.162 1.165m2.6-6.761h-.407v-2.077l.402-.004a4.73 4.73 0 0 0 4.715-4.704a4.73 4.73 0 0 0-4.713-4.704l-.404-.002V24.39h.407c3.745 0 6.789 3.04 6.789 6.781s-3.044 6.786-6.789 6.786z" />
  </Svg>
);

const LabDiagnosticsIcon = ({ color = '#1971c2' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 20 20">
    <Path d="M0 0h20v20H0z" fill="none" />
    <Path fill={color} fillRule="evenodd" d="M16.432 15C14.387 9.893 12 8.547 12 6V3h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8v3c0 2.547-2.387 3.893-4.432 9c-.651 1.625-2.323 4 6.432 4s7.083-2.375 6.432-4m-1.617 1.751c-.702.21-2.099.449-4.815.449s-4.113-.239-4.815-.449c-.249-.074-.346-.363-.258-.628c.22-.67.635-1.828 1.411-3.121c1.896-3.159 3.863.497 5.5.497s1.188-1.561 1.824-.497a15.4 15.4 0 0 1 1.411 3.121c.088.265-.009.553-.258.628" clipRule="evenodd" />
  </Svg>
);

const PharmacyIcon = ({ color = '#e03131' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 64 64">
    <Path d="M0 0h64v64H0z" fill="none" />
    <Path fill={color} d="M36.537 9.19h1.185v5.666h-1.185zm4.329 10.809h-17.5v24.083h17.5zm-4.283 22.208l-1.843-3.356l-1.848 3.356h-1.718l2.712-4.911l-3.27-5.955c-.17.014-.324.041-.504.041h-2.154v6.353h-2.456V22.36h4.873c2.945 0 4.239 1.851 4.239 4.478c0 1.727-.633 3.074-1.815 3.839l2.359 4.316l1.795-3.252h1.705l-2.649 4.808l3.093 5.658h-2.518z" />
    <Path fill={color} d="M29.534 24.21h-1.576v5.319h1.744c1.316 0 2.456-.71 2.456-2.649c0-1.657-.666-2.67-2.625-2.67zm9.652-15.02h1.179v5.666h-1.179zm2.642 0h1.183v5.666h-1.183z" />
    <Path fill={color} d="M55.545.563H8.759C4.174.563.445 4.292.445 8.879v46.78c0 4.586 3.73 8.317 8.314 8.317h46.786c4.584 0 8.313-3.731 8.313-8.317V8.879c0-4.586-3.729-8.316-8.313-8.316M43.013 54.771c0 .899-.748 1.634-1.679 1.634h-18.45c-.929 0-1.682-.735-1.682-1.634V17.576h21.811zm1.942-39.636c0 .475-.39.857-.877.857H20.134a.87.87 0 0 1-.879-.857V8.928c0-.473.396-.853.879-.853h23.944c.487 0 .877.38.877.853z" />
  </Svg>
);

const PlasticSurgeryIcon = ({ color = '#9c36b5' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 48 48">
    <Path d="M0 0h48v48H0z" fill="none" />
    <G fill="none" stroke={color} strokeLinecap="round">
      <Path strokeLinejoin="round" strokeWidth={4.667} d="M19.036 44q-1.47-4.794-4.435-7.147c-2.965-2.353-7.676-.89-9.416-3.318s1.219-6.892 2.257-9.526s-3.98-3.566-3.394-4.313q.585-.748 7.609-4.316Q13.652 4 26.398 4C39.144 4 44 14.806 44 21.679s-5.88 14.277-14.256 15.874q-1.123 1.636 3.24 6.447" />
      <Path strokeWidth={4} d="M21.022 4.59q-1.782 7.843 0 12.205c1.782 4.362 9.659 3.692 9.659 7.761c0 4.07-4.59 4.852-3.978 7.676q.613 2.823 2.725 7.324M17 30.55c.235 0 2.4-.138 3.959-1.75q1.558-1.614 1.558-3.8" />
    </G>
  </Svg>
);

const AcuteIllnessesIcon = ({ color = '#c92a2a' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 48 48">
    <Path d="M0 0h48v48H0z" fill="none" />
    <Path fill={color} fillRule="evenodd" d="M24.012 14.503a10 10 0 0 0 0 .977l-.006 7.014c-.002 1.397.562 1.941 1 2.198q.07.04.139.073l.002-.306q0-.32-.005-.7c-.01-1.07-.024-2.467.134-3.868A10 10 0 0 0 34 25a10 10 0 0 0 3.713-.712c2.263 6.996 3.076 15.228 1.401 16.618c-2.998 2.488-8.988.99-11.982-2.002c-2.406-2.403-2.205-8-2.052-12.043a4.3 4.3 0 0 1-1.083-.442a3.8 3.8 0 0 1-.994-.835c-.297.352-.64.625-.996.833a4.3 4.3 0 0 1-1.081.44c.145 4.019.322 9.543-2.064 11.919c-2.983 2.971-8.947 4.453-11.926 1.973S8.945 13.986 15.9 13.99c5.078.005 5.004 6.422 4.966 9.717a68 68 0 0 0-.003 1.054q.069-.034.137-.073c.44-.256 1.003-.8 1.005-2.197V6.001l1-.001h1v2h.011v.005zm12.745 4.669A5 5 0 0 1 35 19.9V21a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2v-1.1a5 5 0 0 1-1.757-.728l-.829.828A1 1 0 0 1 29 21.414L27.586 20A1 1 0 0 1 29 18.586l.828-.829A5 5 0 0 1 29.1 16H28a1 1 0 1 1-2 0v-2a1 1 0 1 1 2 0h1.1c.13-.638.38-1.233.728-1.757L29 11.414A1 1 0 0 1 27.586 10l.698-.698l.009-.01l.01-.008l.697-.698A1 1 0 0 1 30.414 10l.829.828A5 5 0 0 1 33 10.1V9a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2v1.1c.638.13 1.233.38 1.757.728l.829-.828A1 1 0 0 1 39 8.586L40.414 10A1 1 0 1 1 39 11.414l-.828.829c.347.524.598 1.119.728 1.757H40a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0h-1.1a5 5 0 0 1-.728 1.757l.828.829A1 1 0 1 1 40.414 20L39 21.414A1 1 0 0 1 37.586 20z" clipRule="evenodd" />
  </Svg>
);

const HematologyIcon = ({ color = '#e03131' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill={color} d="M21 7c-1 0-1-1-1-1V5h-2v2h-2V6c0-1.73-1.25-5-6-5S4 4.27 4 6v13c0 .33-.1 2-2 2v2c2.93 0 4-2.39 4-4V6c0-.12.05-3 4-3c3.83 0 4 2.7 4 3v1h-2V5h-2v1s0 1-1 1s-1 1-1 1v12s0 2 5 2h4c5 0 5-2 5-2V8s0-1-1-1m-6 12.4a3 3 0 0 1-3-3c0-2 3-5.4 3-5.4s3 3.4 3 5.4a3 3 0 0 1-3 3" />
  </Svg>
);

const CardiologyIcon = ({ color = '#e03131' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 64 64">
    <Path d="M0 0h64v64H0z" fill="none" />
    <Path fill={color} d="M5.482 33.956h5.547c.421 0 .811.21 1.043.556c0 0 1.057 1.596 2.112 3.179c.585-5.186 2.622-23.314 2.622-23.314c.07-.598.561-1.07 1.171-1.105a1.245 1.245 0 0 1 1.287.956s2.656 11.137 3.913 16.399l1.663-4.708a1.248 1.248 0 0 1 2.35-.014s2.467 6.701 2.961 8.051h4.814c.421 0 .811.21 1.042.556c0 0 1.058 1.596 2.111 3.18c.587-5.186 2.624-23.314 2.624-23.314a1.25 1.25 0 0 1 2.458-.149l3.911 16.399l1.666-4.708a1.247 1.247 0 0 1 2.348-.014s2.47 6.701 2.963 8.051h4.92l.262-.5c2.39-4.112 4.135-11.726 4.135-17.271c0-7.075-5.149-15.621-15.183-15.621c-14.338 0-16.181 13.431-16.181 13.431S30.263.63 15.934.63C6.254.63 1.061 8.866 1.061 16.186c0 6.322 2.768 14.126 4.186 17.331z" />
    <Path fill={color} d="M53.216 36.456c-.526 0-.993-.329-1.172-.818l-2.068-5.617l-1.915 5.432c-.185.523-.69.862-1.243.829a1.24 1.24 0 0 1-1.149-.958l-3.238-13.567l-2.208 19.623a1.25 1.25 0 0 1-.951 1.072a1.25 1.25 0 0 1-1.334-.521s-3.03-4.561-3.642-5.476H29.28a1.25 1.25 0 0 1-1.171-.818l-2.068-5.616l-1.92 5.432a1.24 1.24 0 0 1-1.243.829a1.25 1.25 0 0 1-1.153-.958l-3.232-13.558l-2.207 19.614a1.25 1.25 0 0 1-.95 1.072a1.25 1.25 0 0 1-1.335-.521s-3.03-4.561-3.642-5.476H6.84c8.964 15.927 25.201 26.417 25.201 26.417S48.572 52.38 57.679 36.455h-4.462z" />
  </Svg>
);

const GastroenterologyIcon = ({ color = '#e67700' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 48 48">
    <Path d="M0 0h48v48H0z" fill="none" />
    <G fill="none" stroke={color} strokeLinecap="round" strokeWidth={4}>
      <Path strokeLinejoin="round" d="M23 5q-1.719 6.69 0 9.938c1.719 3.247 5.7 5.042.574 9.373c-5.126 4.332-10.323.697-13.532.697S4.023 28.621 4.023 34q0 5.379 1.978 9" />
      <Path strokeLinejoin="round" d="M29.984 5q-2.162 7.993.985 10.14c3.148 2.145 3.389-2.336 9.172.33s4.28 11.961.953 16.746C37.768 37 30.668 41.835 24.008 41s-9.135-8.98-9.992-8.98s-2.668.025-3.022 3.397q-.353 3.372 2.01 7.583" />
      <Path d="M35.645 28.29q-.867 2.568-2.93 4.01q-2.062 1.442-5.237 1.7" />
    </G>
  </Svg>
);

const NephrologyIcon = ({ color = '#1971c2' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <G fill="none" stroke={color} strokeLinecap="round" strokeWidth={1.5}>
      <Path d="M9.986 6c.157-1.406-.982-3-3.415-3C4.047 3 2 5.462 2 8.5S3.539 14 6.064 14c1.616 0 2.472-1.254 2.292-2.341" />
      <Path d="M7 8c1.5 0 3.5.496 3.5 3.64c0 4.16-2 5.72-.5 9.36m7-13c-1.5 0-3.5.496-3.5 3.64c0 4.16 2 5.72.5 9.36" />
      <Path d="M6.61 6c.204.571.55 1.943.306 2.857C6.814 9.238 6.488 10 6 10m8.014-4c-.157-1.406.982-3 3.415-3C19.953 3 22 5.462 22 8.5S20.461 14 17.936 14c-1.695 0-2.554-1.38-2.258-2.5" />
      <Path d="M17.39 6c-.204.571-.55 1.943-.306 2.857c.102.381.428 1.143.916 1.143" />
    </G>
  </Svg>
);

const ResearchIcon = ({ color = '#2f9e44' }: { color?: string }) => (
  <Svg width={28} height={28} viewBox="0 0 36 36">
    <Path d="M0 0h36v36H0z" fill="none" />
    <Path fill={color} d="M23 34s-2-1-5-1s-5 1-5 1l.999-32h8.002z" />
    <Path fill={color} opacity={0.6} d="M17.978 0h1c2 0 4.001 2 4.001 2s3.227 1.274 6.227 2.274S36.028 22.479 36 23.668c-.022.96-4.746 1.866-4.975 1.263c-.517-1.361-1.718-5.296-2.83-10.804c0 11 2.416 19.707 2.416 19.707S24.978 36 21.978 36c-1-4-.999-17-.999-20S17.978 0 17.978 0" />
    <Path fill={color} opacity={0.6} d="M18 0h-1c-2 0-4.001 2-4.001 2S9.772 3.274 6.772 4.274S-.049 22.479-.022 23.668c.022.96 4.746 1.866 4.974 1.263c.517-1.361 1.717-4.993 2.83-10.804c0 11-2.416 19.707-2.416 19.707S11 36 14 36c1-4 .999-17 .999-20S18 0 18 0" />
    <Path fill={color} opacity={0.4} d="M24.002 4S21 0 19 0h-2c-2 0-5.002 4-5.002 4l2.001 1l-2.001 1l3.001 10.004h6.002L24.002 6l-2.001-1zM12.18 28.167c-.537.062-2.668-.25-3.084-.458c-.565-.283-.648-.615-.583-1.208c.065-.594.311-1.344.425-3.5c.909.417 2.951.542 4.535.583c0 1.812-.332 3.417-.332 3.417c-.069.549-.424 1.103-.961 1.166m11.64 0c.537.062 2.667-.25 3.084-.458c.565-.283.648-.615.583-1.208c-.065-.594-.311-1.344-.425-3.5c-.909.417-2.951.542-4.535.583c0 1.812.332 3.417.332 3.417c.069.549.424 1.103.961 1.166" />
    <Circle cx="23.563" cy="13.813" fill="#bb1a34" r=".354" />
    <Circle cx="24.563" cy="13.813" fill="#4289c1" r=".354" />
    <Path fill={color} opacity={0.5} d="M25.918 16.917c-.39.153-2.209.167-2.709-.042c-.5-.208-.688-.438-.729-1.021S22.542 13 22.542 13h3.959s.125 1.625.125 3c.001.585-.254.739-.708.917" />
    <Path fill={color} opacity={0.3} d="M21.001 3.5h-6.002v-1a2 2 0 0 1 2-2h2.002a2 2 0 0 1 2 2z" />
    <Path fill={color} opacity={0.2} d="M21.001 31.712h-6.002V3.501a2 2 0 0 1 2-2h2.002a2 2 0 0 1 2 2z" />
  </Svg>
);

const RecommendationIcon = ({ color = C.green }: { color?: string }) => (
  <Svg width={13} height={13} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <G fill="none">
      <Path fill="#fff" d="m21.204 10.977l2.045-2.045l-2.045-2.045h-6.648l1.023-4.09L14.045.75h-1.534L6.887 11.49H5.864V9.955H.751v13.294h5.113v-2.045H7.91l3.067 1.022h8.693l2.045-1.534l-1.534-2.045l2.045-1.534l-1.534-2.045l2.045-1.79z" />
      <Path fill="#bbd8ff" d="M5.864 12H.751v11.249h5.113z" />
      <Path stroke="#092f63" strokeLinecap="round" strokeLinejoin="round" d="M5.864 11.489h1.023L12.511.75h1.534l1.534 2.046l-1.023 4.09h6.648l2.045 2.045l-2.045 2.045l1.533 2.301l-2.045 1.79l1.534 2.045l-2.045 1.534l1.534 2.045l-2.046 1.534h-8.692L7.91 21.203H5.864" />
      <Path stroke="#092f63" strokeLinecap="round" strokeLinejoin="round" d="M5.864 9.955H.751v13.294h5.113zM2.797 21.204V20.18" />
    </G>
  </Svg>
);

// ── PAYMENT PLAN CARDS ────────────────────────────────────────────────────────
interface PaymentPlan {
  tier:       string;
  tagline:    string;
  price:      string;
  period:     string;
  icon:       string;
  gradient:   [string, string];
  textColor:  string;
  subColor:   string;
  features:   string[];
  payUrl:     string;
  popular?:   boolean;
}

const PAYMENT_PLANS: PaymentPlan[] = [
  {
    tier:      'Silver',
    tagline:   'Essential Care',
    price:     '₦15,000',
    period:    '/ month',
    icon:      'shield-outline',
    gradient:  ['#6b7a99', '#8896b3'],
    textColor: '#ffffff',
    subColor:  'rgba(255,255,255,0.75)',
    payUrl:    'https://hospitalback-clean-0fre.onrender.com/api/payments/silver/',
    features:  [
      'General Practice visits',
      'Basic Lab Diagnostics',
      'Emergency consultation',
      'Pharmacy discounts (5%)',
    ],
  },
  {
    tier:      'Gold',
    tagline:   'Enhanced Health',
    price:     '₦35,000',
    period:    '/ month',
    icon:      'shield-star-outline',
    gradient:  ['#e67700', '#f59f00'],
    textColor: '#ffffff',
    subColor:  'rgba(255,255,255,0.75)',
    payUrl:    'https://hospitalback-clean-0fre.onrender.com/api/payments/gold/',
    popular:   true,
    features:  [
      'Everything in Silver',
      'Specialist consultations',
      'Ultrasound & ECG',
      'Pharmacy discounts (15%)',
      'Priority appointment booking',
    ],
  },
  {
    tier:      'Platinum',
    tagline:   'Premium Coverage',
    price:     '₦75,000',
    period:    '/ month',
    icon:      'shield-crown-outline',
    gradient:  ['#1378e5', '#0f5bbf'],
    textColor: '#ffffff',
    subColor:  'rgba(255,255,255,0.75)',
    payUrl:    'https://hospitalback-clean-0fre.onrender.com/api/payments/platinum/',
    features:  [
      'Everything in Gold',
      'Surgery coverage',
      'Hematology & Cardiology',
      'Pharmacy discounts (25%)',
      'Free ambulance service',
      'Annual full health check',
    ],
  },
];

// ── SECTION 1 DATA — 16 services ─────────────────────────────────────────────
interface ServiceItem {
  label:  string;
  bg:     string;
  color:  string;
  IconComponent: React.FC<{ color?: string }>;
}

const SERVICES: ServiceItem[] = [
  { label: 'Emergency\nServices',    bg: '#ffd6d6', color: '#e03131', IconComponent: EmergencyIcon },
  { label: 'Internal\nMedicine',     bg: '#d0e8ff', color: '#1971c2', IconComponent: InternalMedicineIcon },
  { label: 'General\nPractice',      bg: '#d3f9d8', color: '#2f9e44', IconComponent: GeneralPracticeIcon },
  { label: 'Gynecology\nObstetrics', bg: '#f3d9fa', color: '#9c36b5', IconComponent: GynecologyIcon },
  { label: 'General\nSurgery',       bg: '#fff3bf', color: '#e67700', IconComponent: GeneralSurgeryIcon },
  { label: 'Orthopedic\nSurgery',    bg: '#d3f9d8', color: '#2f9e44', IconComponent: OrthopedicIcon },
  { label: 'Dermatology',            bg: '#ffe8cc', color: '#e8590c', IconComponent: DermatologyIcon },
  { label: 'Lab\nDiagnostics',       bg: '#d0e8ff', color: '#1971c2', IconComponent: LabDiagnosticsIcon },
  { label: 'Pharmacy',               bg: '#ffd6d6', color: '#e03131', IconComponent: PharmacyIcon },
  { label: 'Plastic\nSurgery',       bg: '#f3d9fa', color: '#9c36b5', IconComponent: PlasticSurgeryIcon },
  { label: 'Acute\nIllnesses',       bg: '#ffd6d6', color: '#c92a2a', IconComponent: AcuteIllnessesIcon },
  { label: 'Hematology',             bg: '#ffe3e3', color: '#e03131', IconComponent: HematologyIcon },
  { label: 'Cardiology',             bg: '#ffd6d6', color: '#e03131', IconComponent: CardiologyIcon },
  { label: 'Gastro-\nenterology',    bg: '#fff3bf', color: '#e67700', IconComponent: GastroenterologyIcon },
  { label: 'Nephrology',             bg: '#d0e8ff', color: '#1971c2', IconComponent: NephrologyIcon },
  { label: 'Research',               bg: '#d3f9d8', color: '#2f9e44', IconComponent: ResearchIcon },
];

const COLS     = 4;
const ROWS     = 2;
const PER_PAGE = COLS * ROWS;

const PAGES: ServiceItem[][] = [];
for (let i = 0; i < SERVICES.length; i += PER_PAGE) {
  PAGES.push(SERVICES.slice(i, i + PER_PAGE));
}

const CELL_WIDTH = (width - 32 - 8 * (COLS - 1)) / COLS;

// ── Service detail lists ──────────────────────────────────────────────────────
const SERVICE_DETAILS: { title: string; items: string[] }[] = [
  { title: 'Emergency Services',     items: ['Seizures', 'Loss of consciousness', 'Acute severe asthma', 'Shock', 'Trauma / Lacerations / Cut injuries'] },
  { title: 'Internal Medicine',      items: ['Stroke', 'Diabetes and its complications', 'Thyroid disorders', 'Kidney failure / disease', 'Hypertension'] },
  { title: 'General Practice',       items: ['Peptic ulcer disease / gastritis', 'Malaria', 'Enteric fever', 'Diarrhea and complications', 'Sepsis'] },
  { title: 'Gynecology Obstetrics',  items: ['Antenatal services', 'Vaginal deliveries', 'Caesarean section', 'Menstrual disorder', 'Infertility', 'Myomectomy'] },
  { title: 'General Surgery',        items: ['Mastectomy', 'Hernia repair', 'Lumpectomy', 'Appendectomy', 'Exploratory laparotomy', 'Cholecystectomy'] },
  { title: 'Orthopedic Surgery',     items: ['Joint fusion', 'Fracture repair / Decompression', 'Spinal decompression', 'Knee arthroscopy', 'Club foot correction'] },
  { title: 'Dermatology',            items: ['Rashes / Urticaria', 'Fungal / Bacterial skin infection', 'Skin growth & lesions', 'Acne'] },
  { title: 'Lab Diagnostics',        items: ['Fully functional medical laboratory', 'Ultrasound scans', 'Electrocardiogram', 'Cardiotocograph'] },
  { title: 'Pharmacy',               items: ['Ambulance services', 'Prescription dispensing', 'OTC medications', 'Drug counselling'] },
  { title: 'Plastic Surgery',        items: ['Burns', 'Keloid escharification', 'Surgical debridement', 'Lipoma removal'] },
  { title: 'Acute Illnesses',        items: ['Pneumonia', 'Delirium', 'Loss of consciousness', 'Sepsis and shock'] },
  { title: 'Hematology',             items: ['Sickle cell disease', 'Blood transfusion', 'Bleeding disorders', 'Blood cancers', 'Chemotherapy'] },
  { title: 'Cardiology',             items: ['Chest pain', 'Heart failure', 'Irregular heartbeats', 'Defibrillator'] },
  { title: 'Gastroenterology',       items: ['Inflammatory bowel disease', 'Upper and lower GI bleeds', 'Liver disease', 'Pancreatic disease'] },
  { title: 'Nephrology',             items: ['Kidney disease', 'Hypertension', 'Electrolyte abnormalities'] },
  { title: 'Research',               items: ['Clinical trials', 'Evidence-based medicine', 'Medical publications', 'Health outcome studies'] },
];

// ── SECTION 2 — Patient Stories ───────────────────────────────────────────────
const STORIES = [
  { label: 'Recommendation',       value: 98 },
  { label: 'Wait time',            value: 70 },
  { label: 'Doctor friendliness',  value: 88 },
  { label: 'Detailed explanation', value: 80 },
];

// ── SECTION 3 — Packages ──────────────────────────────────────────────────────
const PLAN_TABS = ['3mo', '6mo', '12mo'];

const PLAN_FEATURES = [
  { title: 'Additional 2% NMS cash',     sub: 'Max ₦1,000 on prepaid medicine',       plans: [false, true,  true]  },
  { title: 'Additional 10% off on Lab',  sub: 'Existing offer + max ₦100 on lab',     plans: [false, true,  true]  },
  { title: 'Unlimited Free Delivery',    sub: 'Free delivery on orders above ₦99',    plans: [false, false, true]  },
  { title: 'Superfast Delivery',         sub: 'High priority delivery for all orders', plans: [false, false, true]  },
  { title: 'Priority Consultation',      sub: 'Skip the queue, book instantly',        plans: [false, false, true]  },
];

// ── Bar component ─────────────────────────────────────────────────────────────
function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={barStyles.row}>
        <View style={barStyles.track}>
          <View style={[barStyles.fill, { width: `${value}%` as any }]} />
        </View>
        <Text style={barStyles.pct}>{value}%</Text>
      </View>
    </View>
  );
}
const barStyles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 6 },
  row:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  track: { flex: 1, height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 4, backgroundColor: C.green },
  pct:   { fontSize: 12, fontWeight: '700', color: C.text, width: 34, textAlign: 'right' },
});

// ─────────────────────────────────────────────────────────────────────────────
export default function ServicesScreen({ navigation }: { navigation?: any }) {
  const [selectedIdx,  setSelectedIdx]  = useState<number | null>(null);
  const [activePlan,   setActivePlan]   = useState(2);
  const [dotPage,      setDotPage]      = useState(0);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const navigate = (route: string) => navigation?.navigate?.(route);

  const onHScroll = (e: any) => {
    const pageW = width - 32;
    setDotPage(Math.round(e.nativeEvent.contentOffset.x / pageW));
  };

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════════════════════
            HERO SECTION — space + overlay icons
        ══════════════════════════════════════════════════════════ */}
        <SafeAreaView style={s.heroSafeArea}>
          <View>
            <View style={s.heroSlide} />

            <View style={s.heroOverlay}>
              <View style={s.heroOverlayRow}>
                <TouchableOpacity
                  style={s.iconBtn}
                  onPress={() => navigation?.goBack?.()}
                  activeOpacity={0.7}
                >
                  <SignOutIcon color={C.text} />
                </TouchableOpacity>

                <View style={s.rightIconsRow}>
                  <TouchableOpacity
                    style={s.iconBtn}
                    onPress={() => navigate('Notifications')}
                    activeOpacity={0.7}
                  >
                    <NotificationIcon color={C.text} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.iconBtn}
                    onPress={() => navigate('Profile')}
                    activeOpacity={0.7}
                  >
                    <ProfileIcon color={C.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>

        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — Medical Services (tight against hero)
        ══════════════════════════════════════════════════════════ */}
        <View style={s.firstSection}>
          <Text style={s.sectionTitle}>Medical Services</Text>
          <View style={s.divider} />
          <Text style={s.sectionSub}>Tap a service to see details · swipe to explore all</Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onHScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={width - 32}
            snapToAlignment="start"
            contentContainerStyle={{ gap: 0 }}
            style={{ marginHorizontal: -18 }}
          >
            {PAGES.map((page, pageIdx) => (
              <View key={pageIdx} style={{ width: width - 32, paddingHorizontal: 18 }}>
                {[0, 1].map(rowIdx => (
                  <View key={rowIdx} style={s.iconRow}>
                    {page.slice(rowIdx * COLS, rowIdx * COLS + COLS).map((item, colIdx) => {
                      const globalIdx = pageIdx * PER_PAGE + rowIdx * COLS + colIdx;
                      const isActive  = selectedIdx === globalIdx;
                      const { IconComponent } = item;
                      return (
                        <TouchableOpacity
                          key={colIdx}
                          style={[s.iconCell, { width: CELL_WIDTH }]}
                          onPress={() => setSelectedIdx(isActive ? null : globalIdx)}
                          activeOpacity={0.75}
                        >
                          <View style={[
                            s.iconCircle,
                            { backgroundColor: item.bg },
                            isActive && s.iconCircleActive,
                          ]}>
                            <IconComponent color={item.color} />
                          </View>
                          <Text style={s.iconLabel} numberOfLines={2}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* Page dots */}
          <View style={s.dotsRow}>
            {PAGES.map((_, i) => (
              <View key={i} style={[s.dot, i === dotPage ? s.dotActive : s.dotOff]} />
            ))}
          </View>

          {/* Expanded detail panel */}
          {selectedIdx !== null && (
            <View style={s.detailPanel}>
              <View style={s.detailHeader}>
                <Text style={s.detailTitle}>{SERVICE_DETAILS[selectedIdx]?.title}</Text>
                <TouchableOpacity onPress={() => setSelectedIdx(null)}>
                  <Ionicons name="close-circle" size={20} color={C.muted} />
                </TouchableOpacity>
              </View>
              <View style={s.detailSep} />
              {SERVICE_DETAILS[selectedIdx]?.items.map((item, i) => (
                <View key={i} style={s.detailRow}>
                  <View style={s.detailBullet} />
                  <Text style={s.detailText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — Patient Stories
        ══════════════════════════════════════════════════════════ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Patient Stories</Text>
          <View style={s.divider} />

          <View style={s.recoRow}>
            <Text style={s.recoLabel}>Recommendation</Text>
            <View style={s.thumbCircle}>
              <RecommendationIcon color={C.green} />
            </View>
          </View>

          {STORIES.map((st, i) => (
            <StatBar key={i} label={st.label} value={st.value} />
          ))}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 4 }}
            style={{ marginTop: 14 }}
          >
            {[
              { name: 'Adaeze O.',  text: 'Excellent care from the emergency team. Very professional.', stars: 5 },
              { name: 'Emeka J.',   text: 'The doctors explained everything clearly. Highly recommend!', stars: 5 },
              { name: 'Fatima B.',  text: 'Modern facilities and compassionate nursing team.',            stars: 4 },
            ].map((q, i) => (
              <View key={i} style={[s.quoteCard, { width: width * 0.65 }]}>
                <View style={{ flexDirection: 'row', gap: 2, marginBottom: 6 }}>
                  {Array.from({ length: q.stars }).map((_, j) => (
                    <Ionicons key={j} name="star" size={12} color="#f59e0b" />
                  ))}
                </View>
                <Text style={s.quoteText}>"{q.text}"</Text>
                <Text style={s.quoteName}>— {q.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2.5 — Payment Plan Cards
        ══════════════════════════════════════════════════════════ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Health Plans</Text>
          <View style={s.divider} />
          <Text style={s.sectionSub}>Pick a plan and pay securely to activate your coverage</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_W + 14}
            snapToAlignment="start"
            contentContainerStyle={{ gap: 14, paddingRight: 20 }}
            style={{ marginHorizontal: -18, paddingLeft: 18, marginTop: 4 }}
          >
            {PAYMENT_PLANS.map((plan, pi) => (
              <View key={pi} style={{ width: CARD_W }}>
                <View style={[pc.card, { backgroundColor: plan.gradient[0] }]}>
                  {plan.popular && (
                    <View style={pc.popularBadge}>
                      <Text style={pc.popularText}>Most Popular</Text>
                    </View>
                  )}
                  <View style={pc.cardTopRow}>
                    <View style={pc.cardIconWrap}>
                      <MaterialCommunityIcons name={plan.icon as any} size={30} color={plan.textColor} />
                    </View>
                    <TouchableOpacity
                      style={pc.dotsBtn}
                      onPress={() => setExpandedPlan(expandedPlan === pi ? null : pi)}
                      activeOpacity={0.7}
                    >
                      <Text style={[pc.dotsText, { color: plan.textColor }]}>⋮</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={pc.priceRow}>
                    <Text style={[pc.price, { color: plan.textColor }]}>{plan.price}</Text>
                    <Text style={[pc.pricePeriod, { color: plan.subColor }]}>{plan.period}</Text>
                  </View>
                  <View style={[pc.decCircleLg, { backgroundColor: plan.gradient[1] }]} />
                  <View style={[pc.decCircleSm, { backgroundColor: plan.gradient[1] }]} />
                  <View style={pc.cardBottomRow}>
                    <View>
                      <Text style={[pc.tierName, { color: plan.textColor }]}>{plan.tier}</Text>
                      <Text style={[pc.tagline, { color: plan.subColor }]}>{plan.tagline}</Text>
                    </View>
                  </View>
                </View>

                {expandedPlan === pi && (
                  <View style={pc.featurePanel}>
                    <Text style={pc.featurePanelTitle}>What's included</Text>
                    {plan.features.map((f, fi) => (
                      <View key={fi} style={pc.featureRow}>
                        <View style={[pc.featureDot, { backgroundColor: plan.gradient[0] }]} />
                        <Text style={pc.featureText}>{f}</Text>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={[pc.payBtn, { backgroundColor: plan.gradient[0] }]}
                      onPress={() => Linking.openURL(plan.payUrl)}
                      activeOpacity={0.88}
                    >
                      <MaterialCommunityIcons name="credit-card-outline" size={17} color="#fff" />
                      <Text style={pc.payBtnText}>Pay for {plan.tier} Plan</Text>
                      <Ionicons name="arrow-forward" size={15} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={pc.collapseBtn}
                      onPress={() => setExpandedPlan(null)}
                      activeOpacity={0.7}
                    >
                      <Text style={pc.collapseTxt}>Close</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {expandedPlan !== pi && (
                  <TouchableOpacity
                    style={[pc.quickPayBtn, { borderColor: plan.gradient[0] }]}
                    onPress={() => Linking.openURL(plan.payUrl)}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons name="credit-card-check-outline" size={16} color={plan.gradient[0]} />
                    <Text style={[pc.quickPayTxt, { color: plan.gradient[0] }]}>Subscribe Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 — Packages plan comparison
        ══════════════════════════════════════════════════════════ */}
        <View style={[s.section, { marginBottom: 24 }]}>
          <Text style={s.sectionTitle}>Our Packages</Text>
          <View style={s.divider} />
          <Text style={s.sectionSub}>Choose a healthcare plan that works for you</Text>

          <View style={s.planTabs}>
            {PLAN_TABS.map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={[s.planTab, i === activePlan && s.planTabOn]}
                onPress={() => setActivePlan(i)}
                activeOpacity={0.8}
              >
                <Text style={[s.planTabTxt, i === activePlan && s.planTabTxtOn]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[s.planRow, { marginBottom: 4 }]}>
            <View style={{ flex: 1 }} />
            {PLAN_TABS.map((t, i) => (
              <View key={i} style={[s.planColHead, i === activePlan && s.planColHeadOn]}>
                <Text style={[s.planColHeadTxt, i === activePlan && { color: C.primary, fontWeight: '800' }]}>{t}</Text>
              </View>
            ))}
          </View>

          {PLAN_FEATURES.map((feat, fi) => (
            <View key={fi} style={[s.planRow, fi % 2 === 0 && { backgroundColor: '#f8faff', borderRadius: 10 }]}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={s.featTitle}>{feat.title}</Text>
                <Text style={s.featSub}>{feat.sub}</Text>
              </View>
              {feat.plans.map((has, pi) => (
                <View key={pi} style={s.planCheckCol}>
                  <View style={[s.checkCircle, { backgroundColor: has ? (pi === activePlan ? C.primary : '#dbeafe') : '#f3f4f6' }]}>
                    <Ionicons name={has ? 'checkmark' : 'remove'} size={13} color={has ? (pi === activePlan ? C.white : C.primary) : C.muted} />
                  </View>
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity
            style={s.cta}
            onPress={() => navigation?.navigate?.('Packages')}
            activeOpacity={0.88}
          >
            <Text style={s.ctaTxt}>Get {PLAN_TABS[activePlan]} Plan</Text>
            <Ionicons name="arrow-forward" size={16} color={C.white} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // ── Hero section ──
  heroSafeArea: { backgroundColor: C.bg },
  heroSlide: { width, height: 56, backgroundColor: C.bg },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  heroOverlayRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingTop: 6,
  },
  rightIconsRow: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  // ── First section (tight against hero, no extra marginTop) ──
  firstSection: {
    backgroundColor: C.white, marginHorizontal: 16, marginTop: 0,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },

  // ── Regular section card ──
  section: {
    backgroundColor: C.white, marginHorizontal: 16, marginTop: 16,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: C.text, marginBottom: 6 },
  divider:    { width: 36, height: 3, backgroundColor: C.primary, borderRadius: 2, marginBottom: 10 },
  sectionSub: { fontSize: 12, color: C.sub, lineHeight: 18, marginBottom: 14 },

  // Icon grid
  iconRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  iconCell:   { alignItems: 'center', paddingVertical: 6 },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  // ACTIVE state — subtle shadow ONLY on the clicked item, NO border
  iconCircleActive: {
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  iconLabel:  { fontSize: 10, color: C.sub, textAlign: 'center', fontWeight: '500', lineHeight: 13 },

  // Page dots
  dotsRow:    { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 },
  dot:        { height: 6, borderRadius: 3 },
  dotActive:  { width: 18, backgroundColor: C.primary },
  dotOff:     { width: 6,  backgroundColor: '#d1d5db' },

  // Detail panel
  detailPanel: { marginTop: 14, backgroundColor: C.bg, borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: C.primary },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  detailTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  detailSep:  { height: 1, backgroundColor: C.border, marginBottom: 10 },
  detailRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 7 },
  detailBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary, marginTop: 5 },
  detailText: { fontSize: 13, color: C.sub, flex: 1, lineHeight: 19 },

  // Patient stories
  recoRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  recoLabel:  { fontSize: 13, fontWeight: '700', color: C.text },
  thumbCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center' },
  quoteCard:  { backgroundColor: C.bg, borderRadius: 14, padding: 14 },
  quoteText:  { fontSize: 12, color: C.sub, lineHeight: 18, fontStyle: 'italic', marginBottom: 6 },
  quoteName:  { fontSize: 11, fontWeight: '700', color: C.text },

  // Packages
  planTabs:   { flexDirection: 'row', backgroundColor: C.bg, borderRadius: 50, padding: 4, marginBottom: 16, gap: 4 },
  planTab:    { flex: 1, paddingVertical: 9, borderRadius: 50, alignItems: 'center' },
  planTabOn:  { backgroundColor: C.primary },
  planTabTxt: { fontSize: 13, fontWeight: '600', color: C.muted },
  planTabTxtOn: { color: C.white, fontWeight: '700' },

  planColHead:   { width: 46, alignItems: 'center', paddingVertical: 6, borderRadius: 8 },
  planColHeadOn: { backgroundColor: '#eff6ff' },
  planColHeadTxt: { fontSize: 12, fontWeight: '600', color: C.muted },

  planRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, marginBottom: 2 },
  featTitle:  { fontSize: 12, fontWeight: '700', color: C.text, marginBottom: 2 },
  featSub:    { fontSize: 10, color: C.muted, lineHeight: 14 },
  planCheckCol: { width: 46, alignItems: 'center' },
  checkCircle: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },

  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: C.primary, borderRadius: 50, paddingVertical: 15,
    marginTop: 18, elevation: 4, shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  ctaTxt: { color: C.white, fontSize: 15, fontWeight: '700' },
});

// Card width
const CARD_W = 220;

const pc = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, overflow: 'hidden' },
  popularBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  popularText: { fontSize: 11, fontWeight: '700', color: '#111' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIconWrap: { width: 46, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  dotsBtn: { padding: 6 },
  dotsText: { fontSize: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  price: { fontSize: 22, fontWeight: '900' },
  pricePeriod: { fontSize: 12, marginLeft: 6 },
  decCircleLg: { position: 'absolute', width: 90, height: 90, borderRadius: 45, right: -28, bottom: -28, opacity: 0.9 },
  decCircleSm: { position: 'absolute', width: 50, height: 50, borderRadius: 25, right: -6, bottom: -6, opacity: 0.9 },
  cardBottomRow: { marginTop: 34 },
  tierName: { fontSize: 16, fontWeight: '900' },
  tagline: { fontSize: 12, marginTop: 2 },
  featurePanel: { backgroundColor: C.bg, padding: 12, borderRadius: 12, marginTop: 10 },
  featurePanelTitle: { fontSize: 14, fontWeight: '800', marginBottom: 8, color: C.text },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  featureText: { fontSize: 13, color: C.sub, flex: 1 },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 10, marginTop: 8 },
  payBtnText: { color: '#fff', fontWeight: '800' },
  collapseBtn: { marginTop: 8, alignItems: 'center' },
  collapseTxt: { color: C.muted, fontWeight: '700' },
  quickPayBtn: { marginTop: 10, borderWidth: 1, borderRadius: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  quickPayTxt: { fontSize: 13, fontWeight: '800' },
});