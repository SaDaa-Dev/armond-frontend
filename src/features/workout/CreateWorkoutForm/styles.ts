import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
}); 