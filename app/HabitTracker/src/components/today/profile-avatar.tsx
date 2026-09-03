import { Image, StyleSheet } from 'react-native';

interface ProfileAvatarProps {
  initials?: string;
  size?: number;
}

export function ProfileAvatar({ size = 56 }: ProfileAvatarProps) {
  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return <Image source={require('@/assets/images/profile.png')} style={[styles.avatar, avatarSize]} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
  },
});
