import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../../data/baseUrl';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { currentUser } from '../../redux/slices/authSlice'
import Toast from 'react-native-toast-message'

export default function Appointments (){
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const user = useSelector(currentUser)
    const [refetch, setRefetch] = useState(false)

    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/server/appointment/`, {
              headers: {
                'Authorization': `Bearer ${user?.accessToken}`,
              },
            });
            if (response.data?.success) {
              setAppointments(response.data?.appointments);
            }
          } catch (error) {
            console.error('Error fetching appointments:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to fetch appointments'
            })
          } finally {
            setLoading(false);
          }
        };
      
        const fetchDoctors = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/server/users/doctors`, {
              headers: {
                'Authorization': `Bearer ${user?.accessToken}`,
              },
            });
            
            if (response.data?.success) {
              setDoctors(response.data?.doctors);
            }
          } catch (error) {
            console.error('Error fetching doctors:', error);
          }
        };

        fetchAppointments();
        fetchDoctors();
    }, [user?.accessToken, refetch]);


    const handleSubmitAppointment = async () => {
        if (!selectedDoctor || !appointmentDate || !reason) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
                body: JSON.stringify({
                doctorId: selectedDoctor,
                appointmentDate,
                reason,
                notes,
            }),
        });
        
        const data = await response.json();
        if (data.success) {
            Alert.alert('Success', 'Appointment request submitted successfully');
            setShowForm(false);
            resetForm();
            setRefetch(prev => !prev)
        } else {
            Alert.alert('Error', data.message || 'Failed to submit appointment request');
        }
        } catch (error) {
        console.error('Error submitting appointment request:', error);
        Alert.alert('Error', 'Failed to submit appointment request');
        }
    };

    const handleRescheduleAppointment = async (appointmentId) => {
        // In a real app, you would implement rescheduling logic
        Alert.alert(
        'Reschedule Appointment',
        'Please contact the doctor directly to reschedule this appointment.',
        [{ text: 'OK' }]
        );
    };

    const resetForm = () => {
        setSelectedDoctor('');
        setAppointmentDate('');
        setReason('');
        setNotes('');
    };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'rescheduled':
        return '#2196F3';
      case 'rejected':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const RenderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.doctorName}>
          Dr. {item.doctorId?.firstName} {item.doctorId?.lastName}
        </Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      
      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.appointmentDate).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="fitness" size={16} color="#666" />
          <Text style={styles.detailText}>{item.reason}</Text>
        </View>
      </View>
      
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
      
      {item.status === 'pending' && (
        <TouchableOpacity 
          style={styles.rescheduleButton}
          onPress={() => handleRescheduleAppointment(item._id)}
        >
          <Text style={styles.rescheduleButtonText}>Reschedule</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.appointmentsList}>
        {appointments.length > 0 ? (
          appointments.map((item, index) => <RenderAppointment key={index} item={ item } />)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments found</Text>
          </View>
        )}
      </ScrollView>
      
      <Modal
        visible={showForm}
        animationType="slide"
        onRequestClose={() => {
          setShowForm(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Request Appointment</Text>
            <TouchableOpacity 
              onPress={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <Text style={styles.label}>Select Doctor *</Text>
            <View style={styles.pickerContainer}>
              {doctors.map((doctor) => (
                <TouchableOpacity
                  key={doctor._id}
                  style={[
                    styles.doctorOption,
                    selectedDoctor === doctor._id && styles.selectedDoctorOption
                  ]}
                  onPress={() => setSelectedDoctor(doctor._id)}
                >
                  <Text style={[
                    styles.doctorOptionText,
                    selectedDoctor === doctor._id && styles.selectedDoctorOptionText
                  ]}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>Appointment Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={appointmentDate}
              onChangeText={setAppointmentDate}
            />
            
            <Text style={styles.label}>Reason *</Text>
            <TextInput
              style={styles.input}
              placeholder="Reason for appointment"
              value={reason}
              onChangeText={setReason}
            />
            
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional notes (optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmitAppointment}
            >
              <Text style={styles.submitButtonText}>Request Appointment</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4F6D7A',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#5DA5B3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  appointmentDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  notesContainer: {
    marginBottom: 10,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
  },
  rescheduleButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  rescheduleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4F6D7A',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 15,
    maxHeight: 150,
  },
  doctorOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedDoctorOption: {
    backgroundColor: '#e3f2fd',
  },
  doctorOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDoctorOptionText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4F6D7A',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})







// import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { color } from "../../data/color";
// import { Ionicons } from "@expo/vector-icons";
// import { useState } from "react";
// import { Checkbox } from 'react-native-paper'

// export default function Appointments() {
//     const [checked, setChecked] = useState(false);

//     return (
//         <SafeAreaView style={{flex: 1}}>
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={{flex: 1}}
//             >
//                 <View style={{alignItems: 'center', justifyContent: 'center', padding: 10}}>
//                     <Text style={{color: color, fontSize: 25, fontWeight: 'bold', textAlign: 'center'}}>Medical Appointment Scheduler</Text>
//                     <Text style={{color: 'grey'}}>Manage Your Healthcare Appointments With Ease</Text>
//                 </View>
//                 <ScrollView contentContainerStyle={{padding: 10, flex: 1, gap: 10}}>
//                     <Text style={{fontWeight: 'bold', paddingHorizontal: 10, fontSize: 20}}>Request New Appointment</Text>
//                     <View style={{
//                         borderRadius: 15, 
//                         padding: 10, 
//                         gap: 10, 
//                         // backgroundColor: '#edededff',
//                         // shadowOffset: {
//                         //     width: 0,
//                         //     height: 10
//                         // },
//                         // shadowColor: 'black',
//                         // shadowOpacity: 0.05,
//                         // shadowRadius: 10,
//                         // elevation: 2,
//                     }}>
//                         <TextInput 
//                             style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
//                             placeholder="Full Name"
//                             placeholderTextColor={'grey'}
//                             // onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
//                             // keyboardType="name-phone-pad"
//                         />
//                         <TextInput 
//                             style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
//                             placeholder="Phone Number"
//                             placeholderTextColor={'grey'}
//                             // onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
//                             keyboardType="number-pad"
//                         />
//                         <View style={{position: 'relative'}}>
//                             <TextInput 
//                                 style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
//                                 placeholder="Appointment type"
//                                 placeholderTextColor={'grey'}
//                                 // onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
//                             />
//                             <Ionicons name="chevron-down-circle" color={'grey'} size={30} style={{position: 'absolute', top: 10, right: 10}}/>
//                         </View>
//                         <View style={{position: 'relative'}}>
//                             <TextInput 
//                                 style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
//                                 placeholder="Prefered Doctor"
//                                 placeholderTextColor={'grey'}
//                                 // onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
//                             />
//                             <Ionicons name="chevron-down-circle" color={'grey'} size={30} style={{position: 'absolute', top: 10, right: 10}}/>
//                         </View>
//                         <View style={{position: 'relative'}}>
//                             <TextInput 
//                                 style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
//                                 placeholder="Prefered Date"
//                                 placeholderTextColor={'grey'}
//                                 // onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
//                             />
//                             <Ionicons name="chevron-down-circle" color={'grey'} size={30} style={{position: 'absolute', top: 10, right: 10}}/>
//                         </View>
//                         <TextInput 
//                             style={{borderColor: color, borderWidth: 1, padding: 15, fontSize: 18, borderRadius: 5 }}
//                             placeholder="Preferred Time"
//                             placeholderTextColor={'grey'}
//                             // onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
//                             keyboardType="email-address"
//                         />
//                         <TouchableOpacity style={{backgroundColor: color, borderRadius: 25, margin: 'auto', paddingHorizontal: 5}}>
//                             <Text style={{color: 'white', padding: 10}}>Add Request</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <View>
//                         <Text style={{fontWeight: 'bold', paddingHorizontal: 10, fontSize: 20}}>Appointment Reminders</Text>                   
//                         <View
//                             style={{
//                                 borderRadius: 15, 
//                                 padding: 10,
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                                 flexWrap: 'wrap'
//                             }}
//                         >
//                             <View>
//                                 <Text style={{fontSize: 15, fontWeight: 'bold'}}>Reminder Timing</Text>
//                                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                                     <View style={{borderWidth: 2, borderColor: color, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 40, transform:[{scale: 0.7}]}}>
//                                         <Checkbox
//                                             status={checked ? 'checked' : 'unchecked'}
//                                             onPress={() => {
//                                                 setChecked(!checked);
//                                             }}
//                                             style={{ transform: [{ scale: 0.3 }] }}
//                                         />
//                                     </View>
//                                     <Text>1 Day Before</Text>
//                                 </View>
//                                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                                     <View style={{borderWidth: 2, borderColor: color, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 40, transform:[{scale: 0.7}]}}>
//                                         <Checkbox
//                                             status={checked ? 'checked' : 'unchecked'}
//                                             onPress={() => {
//                                                 setChecked(!checked);
//                                             }}
//                                             style={{ transform: [{ scale: 0.3 }] }}
//                                         />
//                                     </View>
//                                     <Text>3 Hours Before</Text>
//                                 </View>
//                                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                                     <View style={{borderWidth: 2, borderColor: color, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 40, transform:[{scale: 0.7}]}}>
//                                         <Checkbox
//                                             status={checked ? 'checked' : 'unchecked'}
//                                             onPress={() => {
//                                                 setChecked(!checked);
//                                             }}
//                                             style={{ transform: [{ scale: 0.3 }] }}
//                                         />
//                                     </View>
//                                     <Text>1 Hour Before</Text>
//                                 </View>
//                             </View>

//                             <View>
//                                 <Text style={{fontSize: 15, fontWeight: 'bold'}}>Notification Method</Text>
//                                 <View>
//                                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                                         <View style={{borderWidth: 2, borderColor: color, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 40, transform:[{scale: 0.7}]}}>
//                                             <Checkbox
//                                                 status={checked ? 'checked' : 'unchecked'}
//                                                 onPress={() => {
//                                                     setChecked(!checked);
//                                                 }}
//                                                 style={{ transform: [{ scale: 0.3 }] }}
//                                             />
//                                         </View>
//                                         <Text>Email</Text>
//                                     </View>
//                                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                                         <View style={{borderWidth: 2, borderColor: color, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 40, transform:[{scale: 0.7}]}}>
//                                             <Checkbox
//                                                 status={checked ? 'checked' : 'unchecked'}
//                                                 onPress={() => {
//                                                     setChecked(!checked);
//                                                 }}
//                                                 style={{ transform: [{ scale: 0.3 }] }}
//                                             />
//                                         </View>
//                                         <Text>In App</Text>
//                                     </View>
//                                 </View>
//                            </View>
//                         </View>
//                             <TouchableOpacity style={{backgroundColor: color, borderRadius: 25, margin: 'auto', paddingHorizontal: 5}}>
//                                 <Text style={{color: 'white', padding: 10}}>Save Reminder</Text>
//                             </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     )
// }