import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { currentUser } from '@/redux/slices/authSlice';

const SplashScreen = () => {
  const router = useRouter();
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;
  const rotateValue = React.useRef(new Animated.Value(0)).current;
  const user = useSelector(currentUser)

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    const timeout2 = setTimeout(() => {  
      if(user?.role === 'patient') {
        router.replace('/(tabs)/education')
      } else {
        router.replace('/(tabs)')
      }
    }, 4000);

    return () => clearTimeout(timeout2)
  }, [user?.role, router, opacityValue, scaleValue]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: scaleValue },
              { rotate: rotateInterpolate }
            ],
            opacity: opacityValue,
          },
        ]}
      >
        {/* App Logo */}
        <Image 
            style={styles.logo}
            source={require('../assets/images/logo.png')}
            resizeMode='contain'
        />
        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: opacityValue,
            },
          ]}
        >
          HealthConnect
        </Animated.Text>
      </Animated.View>
      
      <View style={styles.loadingContainer}>
        <Animated.Text
          style={[
            styles.loadingText,
            {
              opacity: opacityValue,
            },
          ]}
        >
          <ActivityIndicator />
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34c7599a', // Primary brand color
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
});

export default SplashScreen;