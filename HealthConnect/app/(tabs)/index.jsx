import { Image, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from 'react-redux'
import { currentUser } from '../../redux/slices/authSlice'
import { SafeAreaView } from "react-native-safe-area-context";
import { color } from "../../data/color";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useState } from "react";


export default function Dashboard() {
    const [refreshing, setRefreshing] = useState(false)

    const user = useSelector(currentUser)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000);
    }, [])

    //use refresh variable to refetch all requests to the server

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'red'}}>
            <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 25, fontWeight: 'bold', color}}>Health Connect</Text>
                <Pressable style={{borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5}}>
                    <Image 
                        source={{uri: user?.profileImage}}
                        resizeMode="cover"
                        style={{height: 40, width: 40, borderRadius: 25}}
                    />
                    <Text style={{fontWeight: 'bold'}}>
                        {user?.role === 'doctor' ? 
                            `Dr. ${user?.fullname.split(' ')[0]}`
                            :
                            user?.gender === 'Male' ? `Mr. ${user?.fullname}`
                            :
                            `Miss. ${user?.fullname}`
                        }
                    </Text>
                </Pressable>
            </View>
            <ScrollView 
                contentContainerStyle={{gap: 20}} style={{padding: 10}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color}/>}
            >
                <View style={{padding: 15, backgroundColor: 'white', borderRadius: 10}}>
                    <View style={{gap: 10}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 15}}>Upcoming Appointments</Text>
                            <Ionicons name="calendar" color={'#007AFF'} size={20}/>
                        </View>
                        <View style={{borderLeftWidth: 3, borderLeftColor: '#007AFF', paddingHorizontal: 5, borderRadius: 2, gap: 2}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text>Mrs Jane Acquah</Text>
                                <Text>10:30 AM</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{color: 'grey'}}>Annual Visit</Text>
                                <Text style={{color: 'grey'}}>Today</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text style={{color: '#007AFF', padding: 5}}>View All Appointments &gt;</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center', gap: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>Quick Links</Text>
                    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center'}}>
                        <Pressable onPress={() => router.navigate('/patients')} style={{
                            backgroundColor: 'white', 
                            padding: 20, 
                            borderRadius: 10, 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            shadowOffset: {
                                width: 0,
                                height: 10
                            },
                            shadowColor: 'black',
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 2,
                            gap: 5
                        }}>
                            <Ionicons name="people-circle" color={color} size={40}/>
                            <Text style={{fontSize: 15}}>My Patients</Text>
                        </Pressable>
                        <Pressable onPress={() => router.navigate('/prescriptions')} style={{
                            backgroundColor: 'white', 
                            padding: 20, 
                            borderRadius: 10, 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            shadowOffset: {
                                width: 0,
                                height: 10
                            },
                            shadowColor: 'black',
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 2,
                            gap: 5
                        }}>
                            <FontAwesome5 name="capsules" color={'orange'} size={40}/>
                            <Text style={{fontSize: 15}}>Prescriptions</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={{gap: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>Pending Approvals</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', gap: 5, padding: 10, borderRadius: 10}}>
                        <View>
                            {/* Image of the patient */}
                            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                                <Image 
                                    source={{uri: user?.profileImage}}
                                    style={{height: 30, width: 30, borderRadius: 25}}
                                />
                                <Text style={{fontWeight: 'bold', fontSize: 15}}>{user?.fullname}</Text>
                            </View>
                            <Text style={{color: 'grey'}}>Patient since {'date joined'}</Text>
                            <Text>Appointment Request</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
                                <Ionicons name="information-circle" size={20} color={'#007AFF'}/>
                                <Text style={{color: 'grey'}}>{'Date and time requested'}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', gap: 10}}>
                            <TouchableOpacity style={{borderRadius: 30, backgroundColor: color, padding: 10}}>
                                <Ionicons name="checkmark" color={'white'} size={30}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', padding: 15}}>
                                <Feather name="edit" color={'white'} size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}