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
  wa:        '#25D366',  // WhatsApp green
  slotBorder:'#bfdbfe',
  slotBg:    '#eff6ff',
  slotActive:'#1378e5',
};

const WHATSAPP_NUMBER = '2348000000000'; // replace with real number

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
    clinic:     'Etta-Atlantic Memorial Hospital',
    location:   'Ikate Lekki, Lagos',
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
    clinic:     'Etta-Atlantic Memorial Hospital',
    location:   'Ikate Lekki, Lagos',
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
    clinic:     'Etta-Atlantic Memorial Hospital',
    location:   'Ikate Lekki, Lagos',
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
    clinic:     'Etta-Atlantic Memorial Hospital',
    location:   'Ikate Lekki, Lagos',
    fee:        '₦12,000 Consultation Fee',
    nextSlot:   '10:15 AM, Today',
    available:  true,
    waNumber:   WHATSAPP_NUMBER,
  },
];

// ── Schedule data (Section 3) ─────────────────────────────────────────────────
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

// ── Tab options ───────────────────────────────────────────────────────────────
const MAIN_TABS = ['Now or Later', 'Video Consult'];

// ─────────────────────────────────────────────────────────────────────────────
interface ContactScreenProps { navigation?: any; }

export default function ContactScreen({ navigation }: ContactScreenProps) {
  const [activeTab,       setActiveTab]       = useState(0);
  const [selectedDoctor,  setSelectedDoctor]  = useState<Doctor>(DOCTORS[0]);
  const [selectedDay,     setSelectedDay]     = useState(0);
  const [selectedSlot,    setSelectedSlot]    = useState<string | null>(null);
  const [bookingConfirmed,setBookingConfirmed] = useState(false);

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
      {/* ── Top bar ── */}
      <SafeAreaView style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation?.goBack?.()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Contact & Book</Text>
        <TouchableOpacity style={s.backBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={20} color={C.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — Hero doctor banner
        ══════════════════════════════════════════════════════════ */}
        <View style={s.heroBanner}>
          <Image
            source={require('../../../assets/images/hero-doctor.jpg')}
            style={s.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — Tabs: Now or Later / Video Consult
        ══════════════════════════════════════════════════════════ */}
        <View style={s.tabSection}>
          {/* Tab pills (Image 1 "Now or Later" + "Video Consult") */}
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
                <Ionicons
                  name={i === 0 ? 'time-outline' : 'videocam-outline'}
                  size={15}
                  color={i === activeTab ? C.white : C.sub}
                  style={{ marginRight: 5 }}
                />
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

          {/* ── Tab A: Now or Later — Doctor list (Image 1 pattern) ── */}
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
                    {/* Selected checkmark */}
                    {isSelected && (
                      <View style={s.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color={C.primary} />
                      </View>
                    )}

                    {/* Top row: avatar + info */}
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

                        {/* Rating + patient stories (Image 1 thumbs-up row) */}
                        <View style={s.docMetaRow}>
                          <Ionicons name="thumbs-up" size={13} color={C.green} />
                          <Text style={s.docRating}>{doc.rating}%</Text>
                          <MaterialCommunityIcons name="comment-text-outline" size={13} color={C.primary} style={{ marginLeft: 10 }} />
                          <Text style={s.docPatients}>{doc.patients}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Location + clinic */}
                    <View style={s.docLocRow}>
                      <Ionicons name="location-outline" size={13} color={C.muted} />
                      <Text style={s.docLoc}>{doc.location} · {doc.clinic}</Text>
                    </View>

                    {/* Fee */}
                    <View style={s.docFeeRow}>
                      <Text style={s.docFeeLabel}>~</Text>
                      <Text style={s.docFee}>{doc.fee}</Text>
                    </View>

                    {/* Next available (Image 1 green "NEXT AVAILABLE AT") */}
                    <View style={s.availRow}>
                      <MaterialIcons name="event-available" size={14} color={C.green} />
                      <Text style={s.availLabel}>NEXT AVAILABLE AT</Text>
                      <Text style={s.availTime}>{doc.nextSlot}</Text>
                    </View>

                    {/* Action buttons (Image 1: Contact Clinic + Book Clinic Visit) */}
                    <View style={s.docBtnRow}>
                      <TouchableOpacity
                        style={s.contactBtn}
                        onPress={() => openWA(doc)}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="call-outline" size={15} color={C.primary} />
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
                          // scroll user down to Section 3
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
              {/* Info banner */}
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

              {/* How it works */}
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

              {/* Doctor video cards */}
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
                      <Ionicons name="thumbs-up" size={12} color={C.green} />
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
            (Image 2 pattern: "3 Taps to Book" / slot picker)
        ══════════════════════════════════════════════════════════ */}
        <View style={s.scheduleSection}>
          {/* Header — Image 2 "3 TAPS TO BOOK" style */}
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

          {/* Selected doctor chip */}
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

          {/* Day tab row (Image 2: Today / Tomorrow pills) */}
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

          {/* Morning slots */}
          <View style={s.slotSectionRow}>
            <Ionicons name="sunny-outline" size={16} color={C.muted} />
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

          {/* Afternoon slots */}
          <View style={[s.slotSectionRow, { marginTop: 16 }]}>
            <Ionicons name="partly-sunny-outline" size={16} color={C.muted} />
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

          {/* Selected summary */}
          {selectedSlot && (
            <View style={s.selectedSummary}>
              <Ionicons name="checkmark-circle" size={18} color={C.green} />
              <Text style={s.selectedSummaryTxt}>
                {selectedDoctor.name}  ·  {DAYS[selectedDay].sub}  ·  {selectedSlot}
              </Text>
            </View>
          )}

          {/* Confirm booking CTA */}
          <TouchableOpacity
            style={[s.confirmBtn, !selectedSlot && { opacity: 0.5 }]}
            onPress={handleBooking}
            activeOpacity={0.88}
          >
            <MaterialIcons name="event-available" size={18} color={C.white} />
            <Text style={s.confirmBtnTxt}>Confirm Appointment</Text>
            <Ionicons name="navigate-outline" size={16} color={C.white} />
          </TouchableOpacity>

          {/* WhatsApp fallback */}
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

  // Top bar
  topBar:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn:     { width: 38, height: 38, borderRadius: 19, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: C.text },

  // ── Section 1: Hero banner ──
  heroBanner:  { width, height: 200, position: 'relative' },
  heroImage:   { width: '100%', height: '100%' },
  // ── Section 2: Tabs ──
  tabSection:    { backgroundColor: C.white, marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  tabPillsRow:   { flexDirection: 'row', gap: 10 },
  tabPill:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg },
  tabPillActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabPillTxt:    { fontSize: 13, fontWeight: '600', color: C.sub },
  tabPillTxtActive:{ color: C.white },

  // Doctor card (Image 1 pattern)
  doctorCard: {
    backgroundColor: C.bg,
    borderRadius: 16, padding: 14,
    marginBottom: 14,
    borderWidth: 1.5, borderColor: C.border,
    position: 'relative',
  },
  doctorCardSelected: { borderColor: C.primary, backgroundColor: '#eff6ff' },
  selectedBadge: { position: 'absolute', top: 12, right: 12 },

  docTopRow:   { flexDirection: 'row', gap: 12, marginBottom: 10 },
  docAvatar:   { width: 72, height: 72, borderRadius: 36, backgroundColor: '#e5e7eb' },
  docInfo:     { flex: 1 },
  docName:     { fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 2 },
  docSpecialty:{ fontSize: 12, color: C.sub, marginBottom: 2 },
  docExp:      { fontSize: 11, color: C.muted, marginBottom: 5 },
  docMetaRow:  { flexDirection: 'row', alignItems: 'center' },
  docRating:   { fontSize: 12, fontWeight: '700', color: C.green, marginLeft: 4 },
  docPatients: { fontSize: 11, color: C.primary, marginLeft: 4 },

  docLocRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  docLoc:      { fontSize: 11, color: C.sub, flex: 1 },
  docFeeRow:   { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 6 },
  docFeeLabel: { fontSize: 13, color: C.muted },
  docFee:      { fontSize: 12, fontWeight: '600', color: C.text },

  // "NEXT AVAILABLE AT" (Image 1 green label)
  availRow:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: C.border },
  availLabel:  { fontSize: 10, fontWeight: '800', color: C.green, letterSpacing: 0.5 },
  availTime:   { fontSize: 11, fontWeight: '600', color: C.text, marginLeft: 4 },

  // Action buttons (Image 1 pattern)
  docBtnRow:   { flexDirection: 'row', gap: 10 },
  contactBtn:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, borderColor: C.primary },
  contactBtnTxt:{ color: C.primary, fontSize: 13, fontWeight: '700' },
  bookBtn:     { flex: 1.4, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 12, backgroundColor: C.primary },
  bookBtnTxt:  { color: C.white, fontSize: 13, fontWeight: '700' },

  // Video tab
  videoBanner: { width: '100%', height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 4 },
  videoBannerImage: { width: '100%', height: '100%' },
  videoBannerOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(19,120,229,0.78)', padding: 16, justifyContent: 'flex-end' },
  videoLiveBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  videoLiveDot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: C.red },
  videoLiveTxt:      { color: C.white, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  videoBannerTitle:  { color: C.white, fontSize: 18, fontWeight: '800', lineHeight: 24, marginBottom: 4 },
  videoBannerSub:    { color: 'rgba(255,255,255,0.8)', fontSize: 11, lineHeight: 16 },

  howRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  howStep:   { width: 26, height: 26, borderRadius: 13, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  howStepTxt:{ color: C.white, fontSize: 12, fontWeight: '800' },
  howLabel:  { fontSize: 13, color: C.text, fontWeight: '500' },

  videoDocCard:   { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.bg, borderRadius: 14, padding: 12, marginBottom: 10 },
  videoDocAvatar: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#e5e7eb' },
  videoDocInfo:   { flex: 1 },
  waVideoBtn:     { backgroundColor: C.wa, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
  waVideoBtnTxt:  { color: C.white, fontSize: 12, fontWeight: '700' },

  sectionLabel: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10 },

  // ── Section 3: Schedule (Image 2 pattern) ──
  scheduleSection: { backgroundColor: C.white, marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },

  // "Book in 3 Taps" header (Image 2)
  scheduleHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  scheduleHeaderLeft:  {},
  scheduleHeaderBig:   { fontSize: 22, fontWeight: '400', color: C.text },
  scheduleHeaderAccent:{ fontSize: 26, fontWeight: '900', color: C.primary, lineHeight: 30 },
  scheduleHeaderRight: {},
  scheduleHeaderSub:   { fontSize: 12, fontWeight: '600', color: C.sub, textAlign: 'right' },

  // Selected doctor chip
  scheduleDocChip:   { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#eff6ff', borderRadius: 14, padding: 10, marginBottom: 16 },
  scheduleDocAvatar: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e5e7eb' },
  scheduleDocName:   { fontSize: 13, fontWeight: '700', color: C.text },
  scheduleDocSpec:   { fontSize: 11, color: C.sub },
  slotCountBadge:    { backgroundColor: C.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  slotCountTxt:      { color: C.white, fontSize: 11, fontWeight: '700' },

  // Day tabs (Image 2 "Today, 23 Nov" pills)
  dayTab:          { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, minWidth: 100 },
  dayTabActive:    { borderColor: C.primary, backgroundColor: '#eff6ff' },
  dayTabLabel:     { fontSize: 13, fontWeight: '700', color: C.sub, marginBottom: 3 },
  dayTabLabelActive:{ color: C.primary },
  dayTabSub:       { fontSize: 10, color: C.muted },

  // Slot section row
  slotSectionRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  slotSectionLabel:{ fontSize: 13, fontWeight: '600', color: C.sub },

  // Time slot grid (Image 2 pill grid)
  slotsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotPill:        { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: C.slotBorder, backgroundColor: C.slotBg },
  slotPillActive:  { backgroundColor: C.slotActive, borderColor: C.slotActive },
  slotPillTxt:     { fontSize: 12, fontWeight: '600', color: C.primary },
  slotPillTxtActive:{ color: C.white },

  // Selected summary
  selectedSummary:    { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12, marginTop: 16 },
  selectedSummaryTxt: { flex: 1, fontSize: 12, fontWeight: '600', color: C.dark },

  // Confirm CTA
  confirmBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.primary, borderRadius: 50, paddingVertical: 15, marginTop: 16, elevation: 4, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  confirmBtnTxt: { color: C.white, fontSize: 15, fontWeight: '700' },

  // WhatsApp fallback
  waFallback:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, marginTop: 10 },
  waFallbackTxt: { color: C.wa, fontSize: 13, fontWeight: '600' },
});