import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { BASE_URL } from "../../data/baseUrl";
import { color } from '../../data/color'

export default function Verify() {
    const router = useRouter()
    const { width, height } = Dimensions.get('window')
    const [otp, setOtp] = useState(null)
    const [verifying, setVerifying] = useState(false)
    const { id, email } = useLocalSearchParams()
    const handleVerify = async () => {
        setVerifying(true)
        try {
            const response = await axios.post(`${BASE_URL}/server/auth/verify/${id}`, {otp})
            if(response?.status === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Congrats, you are registered!',
                    text1Style: {fontWeight: 'bold', fontSize: 15},
                    text2: `${response?.data?.message}`,
                    text2Style: {fontWeight: 'bold', fontSize: 15},
                })
                router.replace('/login')
            }
        } catch(err) {
            if(err?.response?.status === 500) {
                Alert.alert('Error', 'Something went wrong')
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text1Style: {fontWeight: 'bold', fontSize: 15},
                    text2: `${err?.response?.data?.message || 'Something went wrong'}`,
                    text2Style: {fontWeight: 'bold', fontSize: 15},
                })
            }
        } finally {
            setVerifying(false)
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Image 
                source={require('../../assets/images/splash-icon.png')}
                style={{width, height: height * 0.05}}
                resizeMode="contain"
            />
            <ScrollView 
                contentContainerStyle={[styles.wrapper, {width, height: height * 0.7}]}
                keyboardDismissMode="on-drag"
            >
                <View style={styles.sentMail}>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>Enter the OTP Code sent to</Text>
                    <Text style={{fontSize: 20, color: color}}>*{email}*</Text>
                </View>
                <OtpInput 
                    numberOfDigits={4}
                    onTextChange={(text) => setOtp(text)}
                    focusColor={color}
                    type="numeric"
                    onFilled={() => Keyboard.dismiss()}
                    theme={{
                        containerStyle: {
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 30,
                        },
                        pinCodeTextStyle: {
                            color: color
                        },
                        pinCodeContainerStyle: {
                            borderWidth: 4
                        },
                        filledPinCodeContainerStyle: {
                            borderColor: color,
                        }
                    }}
                />
                <TouchableOpacity 
                    style={[styles.btn, {width: width * 0.8}]} 
                    onPress={handleVerify}
                >
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>
                        {verifying ? <ActivityIndicator color='white' /> : 'Verify'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 20,
        position: 'relative'
    },
    btn: {
        height: 45, 
        backgroundColor: color, 
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30
    }
})