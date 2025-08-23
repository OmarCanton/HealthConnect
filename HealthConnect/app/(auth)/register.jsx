import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message'
import axios from 'axios'
import { BASE_URL } from '../../data/baseUrl'
import { router } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";
import { color } from "../../data/color";
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeIn, FadeInDown, FadeOutDown, LinearTransition } from 'react-native-reanimated'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { allergies } from "../../data/allergies";
import { medical_conditions } from "../../data/medicalConditions";
import { blood_types } from "../../data/bloodTypes";
import * as ImagePicker from 'expo-image-picker'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Register() {
    const { width, height } = Dimensions.get('screen')
    const [formData, setFormData] = useState({
        role: 'patient',
        email: '',
        fullname: '',
        contact: '',
        emergencyContact: '',
        password: '',
        confirmPassword: '',
        birthdate: '',
        license: '',
        specialization: '',
        profileImage: '',
        gender: '',
        bloodType: '',
        allergies: [],
        medicalConditions: []
    })

    const gender = [
        'Male',
        'Female',
        'Other'
    ]

    const [isRegistering, setIsRegistering] = useState(false)
    const [seePasword, setSeePassword] = useState(false);
    const [seePasword2, setSeePassword2] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [profilePicture, setProfilePicture] = useState('')
    const imagePickerModalRef = useRef(null)
    const [permissionStatus, setPermissionStatus] = useState(null)
    const [cameraPermissionStat, setCameraPermissionStat] = useState(null)
    const [message, setMessage] = useState('Patient: Select this option for standard patient access')

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);


    const handleConfirm = (date) => {
        setFormData(prev => ({...prev, birthdate: date.toDateString()}))
        hideDatePicker()
    };

    const handlePassVisibility = () => {
        setSeePassword(prevState => !prevState)
    }
    const handlePassVisibility2 = () => {
        setSeePassword2(prevState => !prevState)
    }
    
    const snapPoints = useMemo(() => ['20%'], [])
    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
            opacity={0.5}
        />
    ), [])

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()
                setPermissionStatus(status)
            } catch(err) {
                Alert.alert('Error', err?.message)
            }
        }
        const checkCameraPermission = async () => {
            try {
                const { status } = await ImagePicker.getCameraPermissionsAsync()
                setCameraPermissionStat(status)
            } catch(err) {
                Alert.alert('Error', err?.message)
            }
        }
        checkPermission()
        checkCameraPermission()
    }, [])

    //function to request for permission
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        setPermissionStatus(status)
        if(status !== 'granted') {
            Alert.alert('Media Permission Required', 'Enable permission to access media', [
                { text: 'Cancel', style: 'cancel' },
                {text: 'Go to settings', onPress: () => Linking.openSettings()}
            ])
        }
    }

    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        setCameraPermissionStat(status)
        if(status !== 'granted') {
            Alert.alert('Camera Permission Required', 'Enable permission to access camera', [
                { text: 'Cancel', style: 'cancel' },
                {text: 'Go to settings', onPress: () => Linking.openSettings()}
            ])
        }
    }

    const pickImageFromCamera = async () => {
        try {
            if(cameraPermissionStat !== 'granted') {
                return requestCameraPermission()
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                quality: 1,
                allowsEditing: true,
                aspect: [4, 3]
            })
            if(!result.canceled) {
                setFormData({...formData, profileImage: result.assets[0].uri})
                setProfilePicture(result.assets[0].uri)
            }
        } catch(err) {
            Alert.alert(err)
        } finally {
            imagePickerModalRef?.current?.close()
        }
    }

    const pickImage = async () => {
        try {
            if(permissionStatus !== 'granted') {
                return requestPermission()
            }
            //open media library if granted
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })
            if(!result.canceled) {
                setFormData({...formData, profileImage: result.assets[0].uri})
                setProfilePicture(result.assets[0].uri)
            }
        } catch(err) {
            Alert.alert('Error', err)
        } finally {
            imagePickerModalRef?.current?.close()
        }
    }

    const handleSignup = async () => {
        if(formData.role === 'patient') {
            if(
                formData.fullname === '' ||
                formData.email === '' ||
                formData.contact === '' ||
                formData.emergencyContact === '' ||
                formData.password === '' ||
                formData.confirmPassword === '' ||
                formData.gender === '' ||
                formData.birthdate === '' ||
                formData.bloodType === ''
            ) {
                Alert.alert('Attention', 'All fields are required')
            }
        } else {
            if(
                formData.fullname === '' ||
                formData.email === '' ||
                formData.contact === '' ||
                formData.emergencyContact === '' ||
                formData.password === '' ||
                formData.confirmPassword === '' ||
                formData.gender === '' ||
                formData.license === '' ||
                formData.specialization === '' 
            ) {
                Alert.alert('Attention', 'All fields are required')
            }
        }
        setIsRegistering(true)
        try {
            const formdata = new FormData()
            formdata.append("profileImage", {
                uri: formData.profileImage,
                type: 'image/*',
                name: 'upload.jpg'
            });
            Object.entries(formData).map(([key, value]) => {
                formdata.append(`${key}`, value)
            })
            const response = await axios.post(`${BASE_URL}/server/auth/register`, formdata, {          
                headers: { 'Content-Type': 'multipart/form-data' }, 
                withCredentials: true 
            })
            if(response?.data?.linkSent) {
                router.push({
                    pathname: '/verify',
                    params: {
                        id: response?.data?.id,
                        email: response?.data?.email
                    }
                })
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: err?.response?.data?.message || err?.message,
                text1Style: {fontSize: 15, fontWeight: 'bold'}
            })
        } finally {
            setIsRegistering(false)
        }
    }
    
    return (
        <GestureHandlerRootView>
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                <ScrollView 
                    keyboardDismissMode="on-drag" 
                    automaticallyAdjustKeyboardInsets={true} 
                    contentContainerStyle={{gap: 10, padding: 20}}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Image 
                            source={require('../../assets/images/logo.png')}
                            resizeMode="contain"
                            style={{height: height * 0.1, width: width * 0.3}}
                        />
                        <Text style={{color: color, fontSize: 30, fontWeight: 'bold'}}>Register</Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingBottom: 20, alignItems: 'center'}}>
                        <Ionicons name="information-circle" color={'#007AFF'} size={25}/>                   
                        <View>
                            <Text style={{color: 'grey', fontWeight: 'bold'}}>{message}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center'}}>
                        <Animated.View entering={FadeInDown}>
                            <Pressable 
                                style={{
                                    flexDirection: 'row', 
                                    gap: 2, 
                                    padding: 10, 
                                    backgroundColor: formData.role === 'patient' ? color : 'darkgrey', 
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 30
                                }}
                                onPress={() => {
                                    setMessage('Patient: Select this option for standard patient access')
                                    setFormData({...formData, role: 'patient'})
                                }}
                            >
                                <Text style={{color: 'white', fontWeight: formData.role === 'patient' && 'bold'}}>Patient</Text>
                            </Pressable>
                        </Animated.View>
                        <Animated.View entering={FadeInDown}>
                            <Pressable 
                                style={{
                                    flexDirection: 'row', 
                                    gap: 2, 
                                    padding: 10, 
                                    backgroundColor: formData.role === 'doctor' ? color : 'darkgrey', 
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 30
                                }}
                                onPress={() => {
                                    setMessage('Doctor: This option is only for medical providers')
                                    setFormData({...formData, role: 'doctor'})
                                }}
                            >
                                <Text style={{color: 'white', fontSize: 15, fontWeight: formData.role === 'doctor' && 'bold'}}>Doctor</Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                    <Text>Full Name:</Text>
                    <TextInput 
                        style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                        placeholder="Omar Canton"
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => setFormData(prev => ({...prev, fullname: text}))}
                    />
                    <Text>Email Address:</Text>
                    <TextInput 
                        style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                        placeholder="nanadapaah@gmail.com"
                        keyboardType="email-address"
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                    />
                    <Text>Contact:</Text>
                    <TextInput 
                        style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                        placeholder="0123456789"
                        placeholderTextColor={'grey'}
                        keyboardType="number-pad"
                        onChangeText={(text) => setFormData(prev => ({...prev, contact: text}))}
                    />
                    <Text>Emergency Contact:</Text>
                    <TextInput 
                        style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                        placeholder="0123456789"
                        placeholderTextColor={'grey'}
                        keyboardType="number-pad"
                        onChangeText={(text) => setFormData(prev => ({...prev, emergencyContact: text}))}
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
                    <Text>Confirm Password:</Text>
                    <View>
                        <TextInput 
                            style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                            secureTextEntry={seePasword2 ? false : true}
                            placeholder="**************"
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => setFormData(prev => ({...prev, confirmPassword: text}))}
                        />
                        <Pressable 
                            onPress={handlePassVisibility2} 
                            style={{ position: 'absolute', top: 15, right: 10 }}
                        >
                            <Ionicons 
                                name={seePasword2 ? 'eye-off' : 'eye'} 
                                size={25}
                                style={{ color: '#3c3c3c' }}
                            />
                        </Pressable>
                    </View>
                    <Text>Profile Image (Upload a professional photo of yours): </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <Pressable onPress={() => imagePickerModalRef?.current?.expand()} style={{backgroundColor: color, height: '100%', padding: 15, borderRadius: 10}}>
                            <Text style={{color: 'white', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>Choose Photo</Text>
                        </Pressable>
                        {profilePicture !== '' && (
                            <View style={{position: 'relative', backgroundColor: 'grey', height: 60, width: 60, borderRadius: 15}}>
                                <Animated.Image 
                                    entering={FadeIn}
                                    exiting={FadeOutDown}
                                    layout={LinearTransition.springify()}
                                    source={{uri: profilePicture !== '' && profilePicture}} 
                                    height={60}
                                    width={60}
                                    resizeMode="cover"
                                    borderRadius={15}
                                />
                                <TouchableOpacity
                                    style={{backgroundColor: 'red', borderRadius: 100,  position: 'absolute', top: -5, right: -5}}
                                    onPress={() => {
                                        setProfilePicture('')
                                        setFormData(prev => ({...prev, profileImage: ''}))
                                    }}
                                >
                                    <Ionicons name="close" color={'white'} size={25}/>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View style={{flexDirection: 'row', gap: 5, paddingBottom: 10, alignItems: 'center'}}>
                        <Text>Gender: </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 5
                        }}>
                            {gender.length > 0 && gender.map((g, index) => (
                                <Pressable 
                                    key={index}
                                    style={{
                                        flexDirection: 'row', 
                                        gap: 2, 
                                        padding: 10, 
                                        backgroundColor: formData.gender === g ? color : 'darkgrey', 
                                        borderRadius: 25,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 30
                                    }}
                                    onPress={() => setFormData(prev => ({...prev, gender: g}))}
                                >
                                    <Text style={{color: 'white', fontWeight: formData.role === 'patient' && 'bold'}}>{g}</Text>
                                </Pressable>
                            ))}
                        </View> 
                    </View>            
                    {formData.role === 'patient' && (
                        <>
                            <Text>Birthdate: </Text>
                            <View style={{padding: 20, borderRadius: 10, backgroundColor: 'lightgrey', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Pressable onPress={showDatePicker}>
                                    <Text style={{color: '#007AFF'}}>Choose Birthdate</Text>
                                </Pressable>
                                <Text style={{fontWeight: 'bold'}}>{formData.birthdate}</Text>
                            </View>
                            <View style={{alignItems: 'center' }}>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </View>
                            <Text>Select your allergies: </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 5
                            }}>
                                {allergies.length > 0 && allergies.map((allergy, index) => (
                                    <Pressable 
                                        key={index}
                                        style={{
                                            flexDirection: 'row', 
                                            gap: 2, 
                                            padding: 10, 
                                            backgroundColor: formData.allergies.find(prev => prev === allergy) ? color : 'darkgrey', 
                                            borderRadius: 25,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 30
                                        }}
                                        onPress={() => setFormData(prev => ({...prev, allergies: [...prev.allergies, allergy]}))}
                                    >
                                        <Text style={{color: 'white', fontWeight: formData.role === 'patient' && 'bold'}}>{allergy}</Text>
                                        {formData.allergies.find(ele => ele === allergy) && (
                                            <Pressable onPress={() => setFormData(prev => ({...prev, allergies: prev.allergies.filter(ele => ele !== allergy)}))}>
                                                <Ionicons name="close-circle" size={20} color={'white'} />
                                            </Pressable>
                                        )}
                                    </Pressable>
                                ))}
                            </View> 
                            <Text>Select your medical conditions: </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 5
                            }}>
                                {medical_conditions.length > 0 && medical_conditions.map((condition, index) => (
                                    <Pressable 
                                        key={index}
                                        style={{
                                            flexDirection: 'row', 
                                            gap: 2, 
                                            padding: 10, 
                                            backgroundColor: formData.medicalConditions.find(prev => prev === condition) ? color : 'darkgrey', 
                                            borderRadius: 25,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 30
                                        }}
                                        onPress={() => setFormData(prev => ({...prev, medicalConditions: [...prev.medicalConditions, condition]}))}
                                    >
                                        <Text style={{color: 'white', fontWeight: formData.role === 'patient' && 'bold'}}>{condition}</Text>
                                        {formData.medicalConditions.find(ele => ele === condition) && (
                                            <Pressable onPress={() => setFormData(prev => ({...prev, medicalConditions: prev.medicalConditions.filter(ele => ele !== condition)}))}>
                                                <Ionicons name="close-circle" size={20} color={'white'} />
                                            </Pressable>
                                        )}
                                    </Pressable>
                                ))}
                            </View> 
                            <Text>Select your blood type: </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 5
                            }}>
                                {blood_types.length > 0 && blood_types.map((blood, index) => (
                                    <Pressable 
                                        key={index}
                                        style={{
                                            flexDirection: 'row', 
                                            gap: 2, 
                                            padding: 10, 
                                            backgroundColor: formData.bloodType === blood ? color : 'darkgrey', 
                                            borderRadius: 25,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 30
                                        }}
                                        onPress={() => setFormData(prev => ({...prev, bloodType: blood}))}
                                    >
                                        <Text style={{color: 'white', fontWeight: formData.role === 'patient' && 'bold'}}>{blood}</Text>
                                        {formData.bloodType === blood && (
                                            <Pressable onPress={() => setFormData(prev => ({...prev, bloodType: ''}))}>
                                                <Ionicons name="close-circle" size={20} color={'white'} />
                                            </Pressable>
                                        )}
                                    </Pressable>
                                ))}
                            </View> 
                        </>
                    )}
                    {formData.role === 'doctor' && (
                        <>
                            <Text>License number:</Text>
                            <TextInput 
                                style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                                placeholder="0123*********"
                                placeholderTextColor={'grey'}
                                keyboardType="number-pad"
                                onChangeText={(text) => setFormData(prev => ({...prev, license: text}))}
                            />
                            <Text>Speciality:</Text>
                            <TextInput 
                                style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
                                placeholder="Dentist"
                                placeholderTextColor={'grey'}
                                onChangeText={(text) => setFormData(prev => ({...prev, specialization: text}))}
                            />
                        </>
                    )}
                    <View style={{marginTop: 10, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <Pressable 
                            style={{
                                backgroundColor: color, 
                                padding: 10,
                                height: 45,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 7,
                            }}
                            onPress={handleSignup}
                        >
                            {isRegistering ? (
                                <ActivityIndicator color={'white'}/>
                            ):(
                                <Text style={{color: 'white'}}>{formData.role === 'patient' ? 'Register as Patient' : 'Register as Doctor'}</Text>
                            )}
                        </Pressable>
                    </View>
                    <View style={{marginTop: 10, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Already have an account?</Text> 
                        <TouchableOpacity onPress={() => router.replace('/login')}>
                            <Text style={{ color: color, fontSize: 15 }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                </KeyboardAvoidingView>
                {/* Bottom sheet for image picking */}
                <BottomSheet 
                    ref={imagePickerModalRef}
                    enablePanDownToClose={true}
                    index={-1}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    handleComponent={null}
                    onClose={() => imagePickerModalRef?.current?.close()}
                >
                    <BottomSheetView>
                        <View style={{padding: 15, paddingTop: 30}}>
                            <TouchableOpacity 
                                onPress={pickImageFromCamera} 
                                style={{borderBottomWidth: 1, padding: 10,  borderBottomColor: 'lightgrey', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
                            >
                                <Text style={{fontSize: 20}}>Take photo</Text>
                                <Ionicons name="camera" size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    padding: 10,
                                }}
                                onPress={pickImage}
                            >
                                <Text style={{fontSize: 20}}>Choose photo</Text>
                                <Ionicons name="image" size={25} />
                            </TouchableOpacity>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}