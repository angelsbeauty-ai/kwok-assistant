import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const API = process.env.EXPO_PUBLIC_API_URL || 'https://your-railway-url.up.railway.app';

export default function Home() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('Kwok is ready.\n\nTell me what you need.');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      setReply(data.reply || 'No reply');
      setMessage('');
    } catch (e) {
      setReply('Cannot reach backend. Check the API URL.');
    } finally {
      setLoading(false);
    }
  }

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
        placeholderTextColor="#666"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Pressable style={styles.button} onPress={send} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Send</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#0f0f0f' },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginTop: 40 },
  subtitle: { fontSize: 16, color: '#aaa', marginBottom: 30 },
  chat: { minHeight: 200, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 20 },
  reply: { color: '#fff', fontSize: 16, lineHeight: 22 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 12, padding: 16, minHeight: 80, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: '600', fontSize: 16 }
});
