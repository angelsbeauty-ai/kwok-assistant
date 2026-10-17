import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

const API = process.env.EXPO_PUBLIC_API_URL || 'https://your-railway-url.up.railway.app';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Kwok is ready.\n\nTell me what you need. I will keep it short and clear.' }
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: next.slice(0, -1).map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'No reply' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Cannot reach backend.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kwok</Text>
        <Link href="/settings" style={styles.settings}>Settings</Link>
      </View>

      <ScrollView style={styles.chat} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((m, i) => (
          <View key={i} style={[styles.bubble, m.role === 'user' ? styles.user : styles.assistant]}>
            <Text style={styles.bubbleText}>{m.content}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator color="#fff" style={{ marginTop: 10 }} />}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Tell me what you need..."
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <Pressable style={styles.button} onPress={send} disabled={loading}>
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff' },
  settings: { color: '#fff', fontSize: 16 },
  chat: { flex: 1, paddingHorizontal: 16 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16, marginVertical: 4 },
  user: { alignSelf: 'flex-end', backgroundColor: '#333' },
  assistant: { alignSelf: 'flex-start', backgroundColor: '#1a1a1a' },
  bubbleText: { color: '#fff', fontSize: 16, lineHeight: 22 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#222' },
  input: { flex: 1, backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 12, padding: 12, maxHeight: 100, fontSize: 16 },
  button: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
  buttonText: { color: '#000', fontWeight: '600' }
});
