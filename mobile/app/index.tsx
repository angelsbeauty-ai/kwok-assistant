import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';

export default function Home() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('Kwok Assistant \u2014 Phase 1\n\nYour rules are active.');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kwok</Text>
      <Text style={styles.subtitle}>Your AI assistant</Text>

      <View style={styles.chat}>
        <Text style={styles.reply}>{reply}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Tell me what you need..."
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Pressable style={styles.button} onPress={() => setReply('Phase 1 placeholder \u2014 backend connection next')}>
        <Text style={styles.buttonText}>Send</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#0f0f0f' },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginTop: 40 },
  subtitle: { fontSize: 16, color: '#aaa', marginBottom: 30 },
  chat: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 20 },
  reply: { color: '#fff', fontSize: 16, lineHeight: 22 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 12, padding: 16, minHeight: 80, marginBottom: 12 },
  button: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: '600', fontSize: 16 }
});
