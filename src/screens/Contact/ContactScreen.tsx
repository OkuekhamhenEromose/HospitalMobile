// src/screens/Contact/ContactScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, Circle, G, } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
  primary:   '#1378e5',
  secondary: '#177fed',
  green:     '#22c55e',
  greenDk:   '#16a34a',
  red:       '#ef4444',
  white:     '#ffffff',
  bg:        '#f5f8ff',
  text:      '#1a2340',
  sub:       '#5a6a85',
  muted:     '#8898aa',
  border:    '#e2eaf5',
  dark:      '#111827',
  wa:        '#25D366',
  slotBorder:'#bfdbfe',
  slotBg:    '#eff6ff',
  slotActive:'#1378e5',
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

// ── New SVG Icons ─────────────────────────────────────────────────────────────
const NowOrLaterIcon = ({ color = C.sub }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill={color} d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z" />
  </Svg>
);

const VideoConsultIcon = ({ color = C.sub }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <G fill={color}>
      <Path d="M20.117 7.625a1 1 0 0 0-.564.1L15 10v4l4.553 2.275A1 1 0 0 0 21 15.383V8.617a1 1 0 0 0-.883-.992" />
      <Path d="M5 5C3.355 5 2 6.355 2 8v8c0 1.645 1.355 3 3 3h8c1.645 0 3-1.355 3-3V8c0-1.645-1.355-3-3-3z" />
    </G>
  </Svg>
);

const MessageIcon = ({ color = C.primary }: { color?: string }) => (
  <Svg width={13} height={13} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8m-8 4h6m4-9a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
  </Svg>
);

const LikeIcon = ({ color = C.green }: { color?: string }) => (
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

const CalendarIcon = ({ color = C.green }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill="none" stroke={color} d="M7.5 6V1m10 5V1m4 16v4.5h-18v-3m17.863-10H3.352M.5 18.25v.25h17.9l.15-.25l.234-.491A28 28 0 0 0 21.5 5.729V3.5h-18v2.128A28 28 0 0 1 .743 17.744z" />
  </Svg>
);

const LocationIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={13} height={13} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
      <Circle cx="12" cy="10" r="3" />
      <Path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8" />
    </G>
  </Svg>
);

const PhoneIcon = ({ color = C.primary }: { color?: string }) => (
  <Svg width={15} height={15} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill={color} fillOpacity={0.3} stroke={color} strokeDasharray="62" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3c0.5 0 2.5 4.5 2.5 5c0 1 -1.5 2 -2 3c-0.5 1 0.5 2 1.5 3c0.39 0.39 2 2 3 1.5c1 -0.5 2 -2 3 -2c0.5 0 5 2 5 2.5c0 2 -1.5 3.5 -3 4c-1.5 0.5 -2.5 0.5 -4.5 0c-2 -0.5 -3.5 -1 -6 -3.5c-2.5 -2.5 -3 -4 -3.5 -6c-0.5 -2 -0.5 -3 0 -4.5c0.5 -1.5 2 -3 4 -3Z" />
  </Svg>
);

const MorningIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <G fill="none">
      <G stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
        <Path d="M12 17.885a5.885 5.885 0 1 0 0-11.77a5.885 5.885 0 0 0 0 11.77m-9.281-5.879H1.5m21 0h-1.207m-9.287-9.287V1.5m0 21v-1.207M5.435 5.435l-.859-.859m14.848 14.848l-.86-.86m.001-13.129l.858-.859M4.576 19.424l.86-.86" />
      </G>
    </G>
  </Svg>
);

const AfternoonIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16">
    <Path d="M0 0h16v16H0z" fill="none" />
    <Path fill={color} d="M10.746 5.005A5.5 5.5 0 0 1 10.5 16H4a4 4 0 0 1-1.61-7.663A4.5 4.5 0 0 1 2.029 7H.5a.5.5 0 0 1 0-1h1.527a4.5 4.5 0 0 1 .957-2.309L1.646 2.354a.5.5 0 1 1 .708-.708L3.69 2.984A4.5 4.5 0 0 1 6 2.027V.5a.5.5 0 0 1 1 0v1.528a4.5 4.5 0 0 1 2.309.956l1.337-1.338a.5.5 0 0 1 .708.708L10.016 3.69c.311.388.56.831.73 1.314M4 15h6.5a4.5 4.5 0 1 0-4.152-6.239A4 4 0 0 1 8 12a.5.5 0 1 1-1 0a3 3 0 1 0-3 3m5.691-9.94a3.5 3.5 0 1 0-6.33 2.991a4.03 4.03 0 0 1 2.106.227a5.5 5.5 0 0 1 4.224-3.219" />
  </Svg>
);

const WHATSAPP_NUMBER = '2349067784278';

// ── Doctor data ───────────────────────────────────────────────────────────────
interface Doctor {
  id:          number;
  name:        string;
  specialty:   string;
  experience:  string;
  rating:      number;
  patients:    string;
  clinic:      string;
  location:    string;
  fee:         string;
  nextSlot:    string;
  available:   boolean;
  waNumber:    string;
}

const DOCTORS: Doctor[] = [
  {
    id: 1,
    name:       'Dr. Chidi Okonkwo',
    specialty:  'Senior Surgeon',
    experience: '12 years experience overall',
    rating:     92,
    patients:   '1,240 Patient Stories',
    clinic:     'lumen HealthCare Center',
    location:   'Adeola Odeku Street, Victoria Island, Lagos',
    fee:        '₦10,000 Consultation Fee',
    nextSlot:   '09:00 AM, Today',
    available:  true,
    waNumber:   WHATSAPP_NUMBER,
  },
  {
    id: 2,
    name:       'Dr. Amaka Nwosu',
    specialty:  'Consultant Physician',
    experience: '9 years experience overall',
    rating:     89,
    patients:   '890 Patient Stories',
    clinic:     'lumen HealthCare Center',
    location:   'Adeola Odeku Street, Victoria Island, Lagos',
    fee:        '₦8,500 Consultation Fee',
    nextSlot:   '11:30 AM, Today',
    available:  true,
    waNumber:   WHATSAPP_NUMBER,
  },
  {
    id: 3,
    name:       'Dr. Emeka Eze',
    specialty:  'Cardiologist',
    experience: '15 years experience overall',
    rating:     95,
    patients:   '2,100 Patient Stories',
    clinic:     'lumen HealthCare Center',
    location:   'Adeola Odeku Street, Victoria Island, Lagos',
    fee:        '₦15,000 Consultation Fee',
    nextSlot:   '02:00 PM, Tomorrow',
    available:  false,
    waNumber:   WHATSAPP_NUMBER,
  },
  {
    id: 4,
    name:       'Dr. Ngozi Adeyemi',
    specialty:  'Obstetrics & Gynecology',
    experience: '11 years experience overall',
    rating:     91,
    patients:   '1,560 Patient Stories',
    clinic:     'lumen HealthCare Center',
    location:   'Adeola Odeku Street, Victoria Island, Lagos',
    fee:        '₦12,000 Consultation Fee',
    nextSlot:   '10:15 AM, Today',
    available:  true,
    waNumber:   WHATSAPP_NUMBER,
  },
];

// ── Schedule data ─────────────────────────────────────────────────────────────
const DAYS = [
  { label: 'Today',    sub: 'Mon, 23 Jun', slots: 8  },
  { label: 'Tomorrow', sub: 'Tue, 24 Jun', slots: 13 },
  { label: 'Wed',      sub: '25 Jun',      slots: 6  },
  { label: 'Thu',      sub: '26 Jun',      slots: 11 },
  { label: 'Fri',      sub: '27 Jun',      slots: 9  },
];

const MORNING_SLOTS = [
  '09:00 AM','09:15 AM','09:30 AM','09:45 AM',
  '10:00 AM','10:30 AM','11:00 AM','11:30 AM',
];
const AFTERNOON_SLOTS = [
  '01:00 PM','01:30 PM','02:00 PM','02:15 PM',
  '02:30 PM','03:00 PM','03:30 PM','03:50 PM',
];

const MAIN_TABS = ['Now or Later', 'Video Consult'];

// ─────────────────────────────────────────────────────────────────────────────
interface ContactScreenProps { navigation?: any; }

export default function ContactScreen({ navigation }: ContactScreenProps) {
  const [activeTab,       setActiveTab]       = useState(0);
  const [selectedDoctor,  setSelectedDoctor]  = useState<Doctor>(DOCTORS[0]);
  const [selectedDay,     setSelectedDay]     = useState(0);
  const [selectedSlot,    setSelectedSlot]    = useState<string | null>(null);
  const [bookingConfirmed,setBookingConfirmed] = useState(false);

  const navigate = (route: string) => navigation?.navigate?.(route);

  // WhatsApp helpers
  const openWA = (doc: Doctor, msg?: string) => {
    const text = msg ?? `Hi! I'd like to book an appointment with ${doc.name} (${doc.specialty}).`;
    Linking.openURL(`https://wa.me/${doc.waNumber}?text=${encodeURIComponent(text)}`);
  };

  const openVideoWA = (doc: Doctor) => {
    const text = `Hi! I'd like to schedule a WhatsApp video consultation with ${doc.name} (${doc.specialty}).`;
    Linking.openURL(`https://wa.me/${doc.waNumber}?text=${encodeURIComponent(text)}`);
  };

  const handleBooking = () => {
    if (!selectedSlot) {
      Alert.alert('Select a time slot', 'Please pick a time slot before booking.');
      return;
    }
    setBookingConfirmed(true);
    Alert.alert(
      '✅ Appointment Confirmed!',
      `Your appointment with ${selectedDoctor.name} is booked for ${selectedSlot} on ${DAYS[selectedDay].sub}.`,
      [{ text: 'OK', onPress: () => setBookingConfirmed(false) }],
    );
  };

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — Hero doctor banner (HomeScreen style)
        ══════════════════════════════════════════════════════════ */}
        <SafeAreaView style={s.heroSafeArea}>
          <View>
            <View style={s.heroSlide}>
              <Image
                source={require('../../../assets/images/hospitaldoctor7.png')}
                style={s.heroImage}
                resizeMode="cover"
              />
            </View>

            {/* ── Overlay: SignOut (left) │ Notification + Profile (right) ── */}
            <View style={s.heroOverlay}>
              <View style={s.heroOverlayRow}>

                {/* LEFT — sign out */}
                <TouchableOpacity
                  style={s.iconBtn}
                  onPress={() => navigation?.goBack?.()}
                  activeOpacity={0.7}
                >
                  <SignOutIcon color={C.text} />
                </TouchableOpacity>

                {/* RIGHT — notification + profile */}
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
            SECTION 2 — Tabs: Now or Later / Video Consult
        ══════════════════════════════════════════════════════════ */}
        <View style={s.tabSection}>
          {/* Tab pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.tabPillsRow}
          >
            {MAIN_TABS.map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={[s.tabPill, i === activeTab && s.tabPillActive]}
                onPress={() => setActiveTab(i)}
                activeOpacity={0.8}
              >
                {i === 0 ? (
                  <NowOrLaterIcon color={i === activeTab ? C.white : C.sub} />
                ) : (
                  <VideoConsultIcon color={i === activeTab ? C.white : C.sub} />
                )}
                <Text style={[s.tabPillTxt, i === activeTab && s.tabPillTxtActive]}>
                  {tab}
                </Text>
                {i === 0 && (
                  <Ionicons
                    name="chevron-down"
                    size={13}
                    color={i === activeTab ? C.white : C.sub}
                    style={{ marginLeft: 3 }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Tab A: Now or Later — Doctor list ── */}
          {activeTab === 0 && (
            <View style={{ marginTop: 14 }}>
              {DOCTORS.map((doc, di) => {
                const isSelected = selectedDoctor.id === doc.id;
                return (
                  <TouchableOpacity
                    key={di}
                    style={[s.doctorCard, isSelected && s.doctorCardSelected]}
                    onPress={() => { setSelectedDoctor(doc); setSelectedSlot(null); }}
                    activeOpacity={0.9}
                  >
                    {isSelected && (
                      <View style={s.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color={C.primary} />
                      </View>
                    )}

                    <View style={s.docTopRow}>
                      <Image
                        source={require('../../../assets/images/hero-doctor.jpg')}
                        style={s.docAvatar}
                        resizeMode="cover"
                      />
                      <View style={s.docInfo}>
                        <Text style={s.docName}>{doc.name}</Text>
                        <Text style={s.docSpecialty}>{doc.specialty}</Text>
                        <Text style={s.docExp}>{doc.experience}</Text>

                        <View style={s.docMetaRow}>
                          <LikeIcon color={C.green} />
                          <Text style={s.docRating}>{doc.rating}%</Text>
                          <MessageIcon color={C.primary} />
                          <Text style={s.docPatients}>{doc.patients}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={s.docLocRow}>
                      <LocationIcon color={C.muted} />
                      <Text style={s.docLoc}>{doc.location} · {doc.clinic}</Text>
                    </View>

                    <View style={s.docFeeRow}>
                      <Text style={s.docFeeLabel}>~</Text>
                      <Text style={s.docFee}>{doc.fee}</Text>
                    </View>

                    <View style={s.availRow}>
                      <CalendarIcon color={C.green} />
                      <Text style={s.availLabel}>NEXT AVAILABLE AT</Text>
                      <Text style={s.availTime}>{doc.nextSlot}</Text>
                    </View>

                    <View style={s.docBtnRow}>
                      <TouchableOpacity
                        style={s.contactBtn}
                        onPress={() => openWA(doc)}
                        activeOpacity={0.85}
                      >
                        <PhoneIcon color={C.primary} />
                        <Text style={s.contactBtnTxt}>Contact Clinic</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          s.bookBtn,
                          !doc.available && { backgroundColor: C.muted },
                        ]}
                        onPress={() => {
                          if (!doc.available) {
                            Alert.alert('Not Available', `${doc.name} is not available today. Please select another time.`);
                            return;
                          }
                          setSelectedDoctor(doc);
                        }}
                        activeOpacity={0.88}
                      >
                        <Text style={s.bookBtnTxt}>
                          {doc.available ? 'Book Clinic Visit' : 'Unavailable'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ── Tab B: Video Consult ── */}
          {activeTab === 1 && (
            <View style={{ marginTop: 14 }}>
              <View style={s.videoBanner}>
                <Image
                  source={require('../../../assets/images/hero-doctor.jpg')}
                  style={s.videoBannerImage}
                  resizeMode="cover"
                />
                <View style={s.videoBannerOverlay}>
                  <View style={s.videoLiveBadge}>
                    <View style={s.videoLiveDot} />
                    <Text style={s.videoLiveTxt}>LIVE CONSULT</Text>
                  </View>
                  <Text style={s.videoBannerTitle}>Consult a Doctor{'\n'}via WhatsApp</Text>
                  <Text style={s.videoBannerSub}>
                    Connect face-to-face with our specialists from the comfort of your home
                  </Text>
                </View>
              </View>

              <Text style={[s.sectionLabel, { marginTop: 18 }]}>How it works</Text>
              {[
                { step: '1', icon: 'person-outline',     label: 'Choose a doctor below'              },
                { step: '2', icon: 'logo-whatsapp',      label: 'Tap "Start Video Call" on WhatsApp' },
                { step: '3', icon: 'videocam-outline',   label: 'Consult securely in minutes'        },
              ].map((h, i) => (
                <View key={i} style={s.howRow}>
                  <View style={s.howStep}>
                    <Text style={s.howStepTxt}>{h.step}</Text>
                  </View>
                  <Ionicons name={h.icon as any} size={18} color={C.primary} style={{ marginRight: 10 }} />
                  <Text style={s.howLabel}>{h.label}</Text>
                </View>
              ))}

              <Text style={[s.sectionLabel, { marginTop: 18 }]}>Select a Doctor</Text>
              {DOCTORS.map((doc, di) => (
                <View key={di} style={s.videoDocCard}>
                  <Image
                    source={require('../../../assets/images/hero-doctor.jpg')}
                    style={s.videoDocAvatar}
                    resizeMode="cover"
                  />
                  <View style={s.videoDocInfo}>
                    <Text style={s.docName}>{doc.name}</Text>
                    <Text style={s.docSpecialty}>{doc.specialty}</Text>
                    <View style={s.docMetaRow}>
                      <LikeIcon color={C.green} />
                      <Text style={s.docRating}>{doc.rating}%</Text>
                      <Text style={[s.docFee, { marginLeft: 10 }]}>{doc.fee}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={s.waVideoBtn}
                    onPress={() => openVideoWA(doc)}
                    activeOpacity={0.88}
                  >
                    <Ionicons name="logo-whatsapp" size={16} color={C.white} />
                    <Text style={s.waVideoBtnTxt}>Video</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 — Schedule: Day tabs + time slot grid
        ══════════════════════════════════════════════════════════ */}
        <View style={s.scheduleSection}>
          <View style={s.scheduleHeader}>
            <View style={s.scheduleHeaderLeft}>
              <Text style={s.scheduleHeaderBig}>Book in</Text>
              <Text style={s.scheduleHeaderAccent}>3 Taps</Text>
            </View>
            <View style={s.scheduleHeaderRight}>
              <Text style={s.scheduleHeaderSub}>Appointment confirmed</Text>
              <Text style={s.scheduleHeaderSub}>in seconds</Text>
            </View>
          </View>

          <View style={s.scheduleDocChip}>
            <Image
              source={require('../../../assets/images/hero-doctor.jpg')}
              style={s.scheduleDocAvatar}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={s.scheduleDocName}>{selectedDoctor.name}</Text>
              <Text style={s.scheduleDocSpec}>{selectedDoctor.specialty}</Text>
            </View>
            <View style={s.slotCountBadge}>
              <Text style={s.slotCountTxt}>
                {DAYS[selectedDay].slots} slots
              </Text>
            </View>
          </View>

          <Text style={s.sectionLabel}>Clinic Visit Slots</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingRight: 16 }}
            style={{ marginBottom: 18 }}
          >
            {DAYS.map((day, di) => (
              <TouchableOpacity
                key={di}
                style={[s.dayTab, di === selectedDay && s.dayTabActive]}
                onPress={() => { setSelectedDay(di); setSelectedSlot(null); }}
                activeOpacity={0.8}
              >
                <Text style={[s.dayTabLabel, di === selectedDay && s.dayTabLabelActive]}>
                  {day.label}
                </Text>
                <Text style={[s.dayTabSub, di === selectedDay && { color: C.primary }]}>
                  {day.slots} slots available
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.slotSectionRow}>
            <MorningIcon color={C.muted} />
            <Text style={s.slotSectionLabel}>Morning</Text>
          </View>
          <View style={s.slotsGrid}>
            {MORNING_SLOTS.map((slot, si) => (
              <TouchableOpacity
                key={si}
                style={[
                  s.slotPill,
                  slot === selectedSlot && s.slotPillActive,
                ]}
                onPress={() => setSelectedSlot(slot === selectedSlot ? null : slot)}
                activeOpacity={0.8}
              >
                <Text style={[
                  s.slotPillTxt,
                  slot === selectedSlot && s.slotPillTxtActive,
                ]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[s.slotSectionRow, { marginTop: 16 }]}>
            <AfternoonIcon color={C.muted} />
            <Text style={s.slotSectionLabel}>Afternoon</Text>
          </View>
          <View style={s.slotsGrid}>
            {AFTERNOON_SLOTS.map((slot, si) => (
              <TouchableOpacity
                key={si}
                style={[
                  s.slotPill,
                  slot === selectedSlot && s.slotPillActive,
                ]}
                onPress={() => setSelectedSlot(slot === selectedSlot ? null : slot)}
                activeOpacity={0.8}
              >
                <Text style={[
                  s.slotPillTxt,
                  slot === selectedSlot && s.slotPillTxtActive,
                ]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedSlot && (
            <View style={s.selectedSummary}>
              <Ionicons name="checkmark-circle" size={18} color={C.green} />
              <Text style={s.selectedSummaryTxt}>
                {selectedDoctor.name}  ·  {DAYS[selectedDay].sub}  ·  {selectedSlot}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.confirmBtn, !selectedSlot && { opacity: 0.5 }]}
            onPress={handleBooking}
            activeOpacity={0.88}
          >
            <MaterialIcons name="event-available" size={18} color={C.white} />
            <Text style={s.confirmBtnTxt}>Confirm Appointment</Text>
            <Ionicons name="navigate-outline" size={16} color={C.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.waFallback}
            onPress={() => openWA(selectedDoctor, `Hi! I'd like to book an appointment with ${selectedDoctor.name} for ${selectedSlot ?? 'a suitable time'} on ${DAYS[selectedDay].sub}.`)}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={16} color={C.wa} />
            <Text style={s.waFallbackTxt}>Or confirm via WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // ── Hero section ──
  heroSafeArea: { backgroundColor: C.bg },
  heroSlide: { width, overflow: 'hidden', backgroundColor: C.bg, paddingTop: 56 },
  heroImage: { width, height: 396 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  heroOverlayRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingTop: 6,
  },
  rightIconsRow: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  // ── Section 2: Tabs ──
  tabSection: {
    backgroundColor: C.white, marginHorizontal: 16, marginTop: 16,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  tabPillsRow:   { flexDirection: 'row', gap: 10 },
  tabPill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 10, borderRadius: 50, borderWidth: 1.5,
    borderColor: C.border, backgroundColor: C.bg,
  },
  tabPillActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabPillTxt:    { fontSize: 13, fontWeight: '600', color: C.sub, marginLeft: 5 },
  tabPillTxtActive: { color: C.white },

  // Doctor card
  doctorCard: {
    backgroundColor: C.bg, borderRadius: 16, padding: 14,
    marginBottom: 14, borderWidth: 1.5, borderColor: C.border, position: 'relative',
  },
  doctorCardSelected: { borderColor: C.primary, backgroundColor: '#eff6ff' },
  selectedBadge: { position: 'absolute', top: 12, right: 12 },

  docTopRow:   { flexDirection: 'row', gap: 12, marginBottom: 10 },
  docAvatar:   { width: 72, height: 72, borderRadius: 36, backgroundColor: '#e5e7eb' },
  docInfo:     { flex: 1 },
  docName:     { fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 2 },
  docSpecialty:{ fontSize: 12, color: C.sub, marginBottom: 2 },
  docExp:      { fontSize: 11, color: C.muted, marginBottom: 5 },
  docMetaRow:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docRating:   { fontSize: 12, fontWeight: '700', color: C.green },
  docPatients: { fontSize: 11, color: C.primary },

  docLocRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  docLoc:      { fontSize: 11, color: C.sub, flex: 1 },
  docFeeRow:   { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 6 },
  docFeeLabel: { fontSize: 13, color: C.muted },
  docFee:      { fontSize: 12, fontWeight: '600', color: C.text },

  availRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginBottom: 12, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: C.border,
  },
  availLabel:  { fontSize: 10, fontWeight: '800', color: C.green, letterSpacing: 0.5 },
  availTime:   { fontSize: 11, fontWeight: '600', color: C.text },

  docBtnRow:   { flexDirection: 'row', gap: 10 },
  contactBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, paddingVertical: 11,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.primary,
  },
  contactBtnTxt: { color: C.primary, fontSize: 13, fontWeight: '700' },
  bookBtn: {
    flex: 1.4, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 11, borderRadius: 12, backgroundColor: C.primary,
  },
  bookBtnTxt: { color: C.white, fontSize: 13, fontWeight: '700' },

  // Video tab
  videoBanner: { width: '100%', height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 4 },
  videoBannerImage: { width: '100%', height: '100%' },
  videoBannerOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(19,120,229,0.78)',
    padding: 16, justifyContent: 'flex-end',
  },
  videoLiveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  videoLiveDot:   { width: 7, height: 7, borderRadius: 4, backgroundColor: C.red },
  videoLiveTxt:   { color: C.white, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  videoBannerTitle: { color: C.white, fontSize: 18, fontWeight: '800', lineHeight: 24, marginBottom: 4 },
  videoBannerSub:   { color: 'rgba(255,255,255,0.8)', fontSize: 11, lineHeight: 16 },

  howRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  howStep: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  howStepTxt: { color: C.white, fontSize: 12, fontWeight: '800' },
  howLabel:   { fontSize: 13, color: C.text, fontWeight: '500' },

  videoDocCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.bg, borderRadius: 14, padding: 12, marginBottom: 10,
  },
  videoDocAvatar: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#e5e7eb' },
  videoDocInfo:   { flex: 1 },
  waVideoBtn: {
    backgroundColor: C.wa, borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  waVideoBtnTxt: { color: C.white, fontSize: 12, fontWeight: '700' },

  sectionLabel: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10 },

  // ── Section 3: Schedule ──
  scheduleSection: {
    backgroundColor: C.white, marginHorizontal: 16, marginTop: 16,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },

  scheduleHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  scheduleHeaderLeft:  {},
  scheduleHeaderBig:   { fontSize: 22, fontWeight: '400', color: C.text },
  scheduleHeaderAccent:{ fontSize: 26, fontWeight: '900', color: C.primary, lineHeight: 30 },
  scheduleHeaderRight: {},
  scheduleHeaderSub:   { fontSize: 12, fontWeight: '600', color: C.sub, textAlign: 'right' },

  scheduleDocChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#eff6ff', borderRadius: 14, padding: 10, marginBottom: 16,
  },
  scheduleDocAvatar: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e5e7eb' },
  scheduleDocName:   { fontSize: 13, fontWeight: '700', color: C.text },
  scheduleDocSpec:   { fontSize: 11, color: C.sub },
  slotCountBadge:    { backgroundColor: C.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  slotCountTxt:      { color: C.white, fontSize: 11, fontWeight: '700' },

  dayTab: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, minWidth: 100,
  },
  dayTabActive: { borderColor: C.primary, backgroundColor: '#eff6ff' },
  dayTabLabel:  { fontSize: 13, fontWeight: '700', color: C.sub, marginBottom: 3 },
  dayTabLabelActive: { color: C.primary },
  dayTabSub:    { fontSize: 10, color: C.muted },

  slotSectionRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  slotSectionLabel:{ fontSize: 13, fontWeight: '600', color: C.sub },

  slotsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotPill: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10,
    borderWidth: 1.5, borderColor: C.slotBorder, backgroundColor: C.slotBg,
  },
  slotPillActive:  { backgroundColor: C.slotActive, borderColor: C.slotActive },
  slotPillTxt:     { fontSize: 12, fontWeight: '600', color: C.primary },
  slotPillTxtActive:{ color: C.white },

  selectedSummary: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12, marginTop: 16,
  },
  selectedSummaryTxt: { flex: 1, fontSize: 12, fontWeight: '600', color: C.dark },

  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: C.primary, borderRadius: 50, paddingVertical: 15,
    marginTop: 16, elevation: 4, shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  confirmBtnTxt: { color: C.white, fontSize: 15, fontWeight: '700' },

  waFallback: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, marginTop: 10,
  },
  waFallbackTxt: { color: C.wa, fontSize: 13, fontWeight: '600' },
});