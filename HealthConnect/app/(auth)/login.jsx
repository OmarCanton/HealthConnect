import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { color } from "../../data/color";
import { router } from "expo-router";
import { useState } from "react";
import Toast from 'react-native-toast-message'
import axios from 'axios'
import { BASE_URL } from "../../data/baseUrl";
import { useDispatch } from 'react-redux'
import { loginUser } from '../../redux/slices/authSlice'
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
    const { width, height } = Dimensions.get('screen')
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [error, setError] = useState('')
    const [seePasword, setSeePassword] = useState(false);

    const handlePassVisibility = () => {
        setSeePassword(prevState => !prevState)
    }

    const handleLogin = async () => {
        if(formData.email === '' || formData.password === '') {
            setError('One or more fields empty')
            return
        }
        setIsLoggingIn(true)
        try {
            const response = await axios.post(`${BASE_URL}/server/auth/login`, formData)
            dispatch(loginUser(response?.data?.user))
            if(response?.data?.user?.role === 'patient') {
                router.replace('/(tabs)/education')
            } else {
                router.replace('/(tabs)')
            }
        } catch (err) {
            setError(err?.response?.message || err?.message)
            Toast.show({
                type: 'error',
                text1: err?.response?.message || err?.message,
                text1Style: {fontWeight: 'bold', fontSize: 15} 
            })
        } finally {
            setIsLoggingIn(false)
        }
    }


    return (
        <SafeAreaView style={{flex: 1, gap: 10}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image 
                    source={require('../../assets/images/logo.png')}
                    resizeMode="contain"
                    style={{height: height * 0.1, width: width * 0.3}}
                />
                <Text style={{color: color, fontSize: 30, fontWeight: 'bold'}}>Health Connect</Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Welcome back, please login into your account</Text>
            </View>
            {error && (
                <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>
            )}
            <ScrollView 
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets={true} 
                contentContainerStyle={{
                    padding: 10,
                    paddingHorizontal: 20,
                    gap: 10,
                    paddingTop: 50
                }}
            >
                <Text>Email address:</Text>
                <TextInput 
                    style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                    placeholder="nanadapaah@gmail.com"
                    placeholderTextColor={'grey'}
                    onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                    keyboardType="email-address"
                />
                <Text>Password:</Text>
                <View>
                    <TextInput 
                        style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                        secureTextEntry={seePasword ? false : true}
                        placeholder="**************"
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => setFormData(prev => ({...prev, password: text}))}
                    />
                    <Pressable 
                        onPress={handlePassVisibility} 
                        style={{ position: 'absolute', top: 15, right: 10 }}
                    >
                        <Ionicons 
                            name={seePasword ? 'eye-off' : 'eye'} 
                            size={25}
                            style={{ color: '#3c3c3c' }}
                        />
                    </Pressable>
                </View>
                <View style={{marginTop: 10, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable 
                        style={{
                            backgroundColor: color, 
                            padding: 10,
                            width: 100,
                            height: 45,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 7,
                        }}
                        onPress={handleLogin}
                    >
                        {isLoggingIn ? (
                            <ActivityIndicator color={'white'}/>
                        ):(
                            <Text style={{color: 'white'}}>Login</Text>
                        )}
                    </Pressable>
                </View>
                <View style={{marginTop: 10, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Don{"'"}t have an account?</Text> 
                    <TouchableOpacity onPress={() => router.replace('/register')}>
                        <Text style={{ color: color, fontSize: 15 }}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}