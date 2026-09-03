import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface ProfileAvatarProps {
  initials?: string;
  size?: number;
}

export function ProfileAvatar({ initials = 'LL', size = 56 }: ProfileAvatarProps) {
  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const fontSize = Math.floor(size * 0.35);

  return (
    <View
      style={[
        styles.avatar,
        avatarSize,
        {
          backgroundColor: '#E3F2FD',
        },
      ]}
    >
      <ThemedText
        style={{
          fontSize,
          fontWeight: '600',
          color: '#1976D2',
        }}
      >
        {initials}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
