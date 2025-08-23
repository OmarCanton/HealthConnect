import { Tabs } from 'expo-router'
import useAuthCheck from '../../hooks/useAuthHook'
import { useSelector } from 'react-redux'
import { currentUser } from '../../redux/slices/authSlice'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { color } from '../../data/color'
export default function TabsLayout() {
    useAuthCheck()
    const user = useSelector(currentUser)

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: color,
            headerShown: false

        }}>
            {/* patients and doctors dashboard */}
            <Tabs.Screen name='index' options={{
                href: user?.role === 'doctor' ? undefined : null,
                tabBarIcon: ({focused}) => (
                    <Ionicons name='grid' color={focused ? color : 'grey'} size={25}/>
                ),
                tabBarLabel: 'Dashboard',
            }}/>
            <Tabs.Screen name='education' options={{
                href: user?.role === 'patient' ? undefined : null,
                tabBarIcon: ({focused}) => (
                    <Ionicons name='school' color={focused ? color : 'grey'} size={25}/>
                ),
                tabBarLabel: 'Education'
            }}/>
            <Tabs.Screen name='appointments' options={{
                href: user?.role === 'patient' ? undefined : null,
                tabBarIcon: ({focused}) => (
                    <Ionicons name='calendar' color={focused ? color : 'grey'} size={25}/>
                ),
                tabBarLabel: 'Appointments'
            }}/>
            <Tabs.Screen name='medication' options={{
                href: user?.role === 'patient' ? undefined : null,
                tabBarIcon: ({focused}) => (
                    <FontAwesome5 name='clock' color={focused ? color : 'grey'} size={25}/>
                ),
                tabBarLabel: 'Reminder'
            }}/>
            <Tabs.Screen name='patients' options={{
                href: user?.role === 'doctor' ? undefined : null,
                tabBarIcon: ({focused}) => (
                    <Ionicons name='people' size={25} color={focused ? color : 'grey'}/>
                ),
                tabBarLabel: 'Patients'
            }}/>
            <Tabs.Screen name='prescriptions' options={{
                href: user?.role === 'doctor' ? undefined : null,
                tabBarIcon: ({focused}) => (
                    <FontAwesome5 name='capsules' size={25} color={focused ? color : 'grey'}/>
                ),
                tabBarLabel: 'Prescriptions',
            }}/>
            <Tabs.Screen name='symptomsTracker' options={{
                href: user?.role === 'patient' ? undefined : null,
                tabBarIcon: ({focused}) => (
                    <Ionicons name='pulse' color={focused ? color : 'grey'} size={25}/>
                ),
                tabBarLabel: 'Tracker'
            }}/>
            <Tabs.Screen name='profile' options={{
                tabBarIcon: ({focused}) => (
                    <Ionicons name='person' color={focused ? color : 'grey'} size={25}/>
                ),
                tabBarLabel: 'Profile'
            }}/>
        </Tabs>
    )
}