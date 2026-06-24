// src/screens/About/AboutScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ── Colours ──────────────────────────────────────────────────────────────────
const C = {
  primary: "#1378e5",
  secondary: "#177fed",
  red: "#ef4444",
  white: "#ffffff",
  bg: "#f5f8ff",
  text: "#1a2340",
  sub: "#5a6a85",
  muted: "#8898aa",
  star: "#f59e0b",
  dark: "#111827",
  border: "#e2eaf5",
};

// ── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = ["About", "Details"];

// ── Hero image (static) ───────────────────────────────────────────────────────
const HERO_IMAGE = require("../../../assets/images/hospitaldoctor6.png");

// ── Stat pills ────────────────────────────────────────────────────────────────
const STAT_PILLS = [
  { icon: "access-time", label: "Open 24/7" },
  { icon: "local-hospital", label: "Specialist" },
  { icon: "star", label: "4.9" },
];

// ── Feature cards ─────────────────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    title: "Professional Team",
    icon: "people",
    desc: "Highly qualified physicians and health professionals providing excellent care.",
    bg: C.primary,
  },
  {
    title: "Advanced Technology",
    icon: "devices",
    desc: "Electronic medical records and telemedicine for fast, quality healthcare delivery.",
    bg: C.secondary,
  },
  {
    title: "Great Facilities",
    icon: "local-hospital",
    desc: "World-class equipment: BiPAP, CTG, ultrasound, ECG, cardiac monitors and more.",
    bg: C.red,
  },
];

// ── Doctors list ──────────────────────────────────────────────────────────────
const DOCTORS = [
  {
    name: "Dr. Chidi Okonkwo",
    role: "Senior Surgeon",
    hours: "8:00 AM–4:00 PM",
    fee: "$20",
    rating: 4.9,
  },
  {
    name: "Dr. Amaka Nwosu",
    role: "Consultant Physician",
    hours: "9:00 AM–5:00 PM",
    fee: "$15",
    rating: 5.0,
  },
  {
    name: "Dr. Emeka Eze",
    role: "Cardiologist",
    hours: "7:30 AM–3:30 PM",
    fee: "$25",
    rating: 4.8,
  },
  {
    name: "Dr. Ngozi Adeyemi",
    role: "Obstetrics & Gynecology",
    hours: "8:00 AM–4:00 PM",
    fee: "$18",
    rating: 4.7,
  },
];

// ── SVG icons (identical copies from HomeScreen) ──────────────────────────────

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

// ── Props ─────────────────────────────────────────────────────────────────────
interface AboutScreenProps {
  navigation?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AboutScreen({ navigation }: AboutScreenProps) {
  const [activeTab, setActiveTab] = useState(0);

  const navigate = (route: string) => navigation?.navigate?.(route);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ══════════════════════════════════════════════════════════
            HERO IMAGE — single static image, no carousel
        ══════════════════════════════════════════════════════════ */}
        <SafeAreaView style={styles.heroSafeArea}>
          <View style={styles.heroContainer}>
            <Image
              source={HERO_IMAGE}
              style={styles.heroImage}
              resizeMode="contain"
            />

            <View style={styles.heroOverlay}>
              <View style={styles.heroOverlayRow}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigation?.goBack?.()}
                  activeOpacity={0.7}
                >
                  <SignOutIcon color={C.text} />
                </TouchableOpacity>

                <View style={styles.rightIconsRow}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigate("Notifications")}
                  >
                    <NotificationIcon color={C.text} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => navigate("Profile")}
                  >
                    <ProfileIcon color={C.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
        {/* end hero */}

        {/* ══════════════════════════════════════════════════════════
            CONTENT AREA
        ══════════════════════════════════════════════════════════ */}
        <View style={styles.content}>
          {/* ── Tabs ── */}
          <View style={styles.tabRow}>
            {TABS.map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={styles.tabItem}
                onPress={() => setActiveTab(i)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    i === activeTab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
                {i === activeTab && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Stat pills ── */}
          <View style={styles.pillRow}>
            {STAT_PILLS.map((p, i) => (
              <View key={i} style={styles.pill}>
                <MaterialIcons name={p.icon as any} size={15} color={C.text} />
                <Text style={styles.pillText}>{p.label}</Text>
              </View>
            ))}
          </View>

          {activeTab === 0 ? (
            <>
              {/* ── About copy ── */}
              <Text style={styles.sectionHeading}>
                About Etta-Atlantic Memorial Hospital
              </Text>
              <View style={styles.sectionDivider} />

              <Text style={styles.body}>
                Etta-Atlantic Memorial Hospital Lekki stands as the premier
                private hospital in Lekki, Lagos. Our foundation was laid with
                the singular purpose of delivering world-class healthcare to the
                community of Lagos and the broader Nigerian populace.{" "}
                <Text style={styles.bodyMuted}>
                  Established by a physician with medical training and
                  experience in the US, teamed with bright and dedicated
                  Nigerian physicians and allied health professionals.
                </Text>
              </Text>

              {/* ── Mission ── */}
              <View style={styles.missionCard}>
                <View style={styles.missionIconWrap}>
                  <MaterialIcons name="flag" size={22} color={C.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.missionTitle}>Our Mission</Text>
                  <Text style={styles.missionBody}>
                    To provide world-class healthcare services to the community
                    of Lagos and the broader Nigerian populace, upholding the
                    highest standards of medical excellence and patient care.
                  </Text>
                </View>
              </View>

              {/* ── Vision ── */}
              <View
                style={[styles.missionCard, { backgroundColor: "#fff5f5" }]}
              >
                <View
                  style={[
                    styles.missionIconWrap,
                    { backgroundColor: "#fee2e2" },
                  ]}
                >
                  <MaterialIcons name="visibility" size={22} color={C.red} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.missionTitle, { color: C.red }]}>
                    Our Vision
                  </Text>
                  <Text style={styles.missionBody}>
                    To be the leading private healthcare institution in West
                    Africa, recognised for our commitment to evidence-based
                    medicine, advanced technology, and compassionate patient
                    care.
                  </Text>
                </View>
              </View>

              {/* ── Why Choose Us ── */}
              <Text style={[styles.sectionHeading, { marginTop: 20 }]}>
                Why Choose Us
              </Text>
              <View style={styles.sectionDivider} />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featureScroll}
                style={{ marginTop: 12 }}
              >
                {FEATURE_CARDS.map((card, i) => (
                  <View
                    key={i}
                    style={[styles.featureCard, { backgroundColor: card.bg }]}
                  >
                    <MaterialIcons
                      name={card.icon as any}
                      size={26}
                      color={C.white}
                    />
                    <Text style={styles.featureCardTitle}>{card.title}</Text>
                    <Text style={styles.featureCardDesc}>{card.desc}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* ── Top Doctors ── */}
              <Text style={[styles.sectionHeading, { marginTop: 24 }]}>
                Top Doctors
              </Text>
              <View style={styles.sectionDivider} />

              {DOCTORS.map((doc, i) => (
                <View key={i} style={styles.doctorCard}>
                  <Image
                    source={require("../../../assets/images/hospitaldoctor6.png")}
                    style={styles.doctorAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.doctorInfo}>
                    <View style={styles.doctorNameRow}>
                      <Text style={styles.doctorName}>{doc.name}</Text>
                      <View style={styles.ratingPill}>
                        <Ionicons name="star" size={11} color={C.star} />
                        <Text style={styles.ratingText}>{doc.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.doctorRole}>{doc.role}</Text>
                    <View style={styles.doctorMetaRow}>
                      <Ionicons name="time-outline" size={12} color={C.muted} />
                      <Text style={styles.doctorMeta}>{doc.hours}</Text>
                    </View>
                    <Text style={styles.doctorFee}>Fee: {doc.fee}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.arrowBtn}
                    onPress={() => navigate("Book")}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="arrow-forward" size={18} color={C.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            /* ── Details tab ── */
            <View style={styles.detailsTab}>
              {[
                { label: "Location", value: "Ikate Lekki, Lagos, Nigeria" },
                { label: "Phone", value: "+234 800 000 0000" },
                { label: "Email", value: "info@ettaatlantic.com" },
                { label: "Hours", value: "24 hours, 7 days a week" },
                { label: "Founded", value: "2018" },
                { label: "Accredited", value: "WHO Standards Compliant" },
              ].map((row, i) => (
                <View key={i} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{row.label}</Text>
                  <Text style={styles.detailValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        {/* end content */}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroSafeArea: {
    backgroundColor: C.white,
  },

  heroContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 10,
    backgroundColor: C.white,
  },

  heroImage: {
    width: width * 0.9,
    height: 400,
  },
  // 340 visible + 56 offset

  // Overlay sits at absolute top-left, same as HomeScreen
  heroOverlay: { position: "absolute", top: 0, left: 0, right: 0 },
  heroOverlayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  rightIconsRow: { flexDirection: "row", gap: 8 },
  iconBtn: {
    // bare — no background, shadow, or elevation (same as HomeScreen)
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Content ───────────────────────────────────────────────────────────────
  content: {
  paddingHorizontal: 20,
  paddingTop: 0,
},

  tabRow: { flexDirection: "row", gap: 24, marginBottom: 16 },
  tabItem: { alignItems: "center", paddingBottom: 4 },
  tabText: { fontSize: 15, color: C.muted, fontWeight: "500" },
  tabTextActive: { color: C.text, fontWeight: "700" },
  tabUnderline: {
    height: 3,
    width: "100%",
    borderRadius: 2,
    backgroundColor: C.text,
    marginTop: 4,
  },

  pillRow: { flexDirection: "row", gap: 12, marginBottom: 18 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: { fontSize: 12, color: C.text, fontWeight: "500" },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: C.text,
    marginBottom: 6,
  },
  sectionDivider: {
    width: 36,
    height: 3,
    backgroundColor: C.primary,
    borderRadius: 2,
    marginBottom: 12,
  },
  body: { fontSize: 13, color: C.text, lineHeight: 21, marginBottom: 14 },
  bodyMuted: { color: C.sub },

  missionCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  missionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  missionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 4,
  },
  missionBody: { fontSize: 12, color: C.sub, lineHeight: 19 },

  featureScroll: { gap: 10, paddingRight: 4 },
  featureCard: {
    width: width * 0.6,
    borderRadius: 14,
    padding: 14,
    gap: 7,
    marginRight: 2,
  },
  featureCardTitle: { color: C.white, fontWeight: "700", fontSize: 13 },
  featureCardDesc: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    lineHeight: 17,
  },

  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  doctorInfo: { flex: 1 },
  doctorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
    flex: 1,
    marginRight: 6,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#fef9ee",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  ratingText: { fontSize: 11, fontWeight: "600", color: C.text },
  doctorRole: { fontSize: 11, color: C.sub, marginBottom: 4 },
  doctorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  doctorMeta: { fontSize: 11, color: C.muted },
  doctorFee: { fontSize: 11, color: C.sub, fontWeight: "500" },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.dark,
    justifyContent: "center",
    alignItems: "center",
  },

  detailsTab: { paddingTop: 4 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  detailLabel: { fontSize: 13, color: C.muted, fontWeight: "500" },
  detailValue: {
    fontSize: 13,
    color: C.text,
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
});
