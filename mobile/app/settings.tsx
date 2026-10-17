import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Settings() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.section}>Rules</Text>
      <Text style={styles.text}>
        Your locked rules are active on the backend.\n\nEdit them here in a later update.
      </Text>
      <Text style={styles.section}>Usage</Text>
      <Text style={styles.text}>Yen / dollar tracking comes next.</Text>
      <Text style={styles.section}>Connectors</Text>
      <Text style={styles.text}>Gmail, Calendar, GitHub — next phase.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#0f0f0f' },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginTop: 40, marginBottom: 20 },
  section: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 24, marginBottom: 8 },
  text: { fontSize: 15, color: '#aaa', lineHeight: 22 }
});
