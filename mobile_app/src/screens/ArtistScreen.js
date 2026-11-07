import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Header, MusicPlayer, ExclusiveContent } from '../components';

const ArtistScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.profileContainer}>
        <Image 
          source={require('../../assets/m98-profile.jpg')} 
          style={styles.profileImage}
        />
        <Text style={styles.artistName}>董小姐 (M98)</Text>
        <Text style={styles.artistTag}>电子融合 × 东方韵律</Text>
      </View>
      <MusicPlayer />
      <ExclusiveContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  profileContainer: { alignItems: 'center', padding: 20 },
  profileImage: { width: 150, height: 150, borderRadius: 75, borderWidth: 3, borderColor: '#8A2BE2' },
  artistName: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 10 },
  artistTag: { fontSize: 16, color: '#FF6B6B', marginTop: 5 }
});

export default ArtistScreen;
