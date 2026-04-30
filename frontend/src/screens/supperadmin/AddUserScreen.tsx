
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Switch,
  TouchableOpacity
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import useAuthStore from "../../store/useAuthStore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../../style/auth/addUserStyle";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const AddUserScreen = () => {

const navigation = useNavigation<NavigationProp>();

  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const success = useAuthStore((s) => s.success);

  // ================= USER =================
  const [role, setRole] = useState("parent");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // ================= CHILD BASIC =================
  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  const [childAddress, setChildAddress] = useState("");
  const [homeLanguage, setHomeLanguage] = useState("");
  const [pickupPassword, setPickupPassword] = useState("");
  const [childDob, setChildDob] = useState("");

  // ================= EMERGENCY CONTACT =================
  const [emName, setEmName] = useState("");
  const [emPhone, setEmPhone] = useState("");
  const [emAddress, setEmAddress] = useState("");
  const [emRelationship, setEmRelationship] = useState("");

  // ================= AUTHORIZED CONTACT =================
  const [authName, setAuthName] = useState("");
  const [authAddress, setAuthAddress] = useState("");
  const [authRelationship, setAuthRelationship] = useState("");
  const [hasLegalRight, setHasLegalRight] = useState(false);
  const [authDetails, setAuthDetails] = useState("");

  // ================= MEDICAL =================
  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergyDetails, setAllergyDetails] = useState("");

  const [hasCondition, setHasCondition] = useState(false);
  const [conditionDetails, setConditionDetails] = useState("");

  const [vaccinationsUpToDate, setVaccinationsUpToDate] = useState(false);
  const [vaccinationDetails, setVaccinationDetails] = useState("");

  // ================= DOCTOR =================
  const [doctorName, setDoctorName] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        useAuthStore.setState({ success: null, error: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const payload: any = {
      role,
      firstName,
      lastName,
      email,
      password,
      address,
      phone,
      gender,
      dateOfBirth,
    };

    if (role === "parent") {
      payload.child = {
        firstName: childFirstName,
        lastName: childLastName,
        address: childAddress,
        homeLanguage,
        pickupPassword,
        dateOfBirth: childDob,

        emergencyContacts: [
          {
            name: emName,
            phone: emPhone,
            address: emAddress,
            relationship: emRelationship,
          },
        ],

        authorizedContacts: [
          {
            name: authName,
            address: authAddress,
            relationship: authRelationship,
            hasLegalContactRight: hasLegalRight,
            details: authDetails,
          },
        ],

        medicalInfo: {
          allergies: {
            hasAllergies,
            details: allergyDetails,
          },
          medicalConditions: {
            hasCondition,
            details: conditionDetails,
          },
          vaccinationsUpToDate,
          vaccinationDetails,
        },

        doctor: {
          name: doctorName,
          phone: doctorPhone,
          address: doctorAddress,
        },
      };
    }

    
     const res = await register(payload);
    if (res?.error) return; //stop if failed
  };

  return (
    <ScrollView style={styles.container}>

      <TouchableOpacity
          onPress={() => navigation.replace("supperadmin")}
      >
          <Ionicons name="chevron-back" size={35} color="black" />
      </TouchableOpacity>
      
      <Text style={{textAlign: "center", fontSize: 25, fontWeight: 600}}>User user</Text>

      {/* ================= USER SECTION ================= */}
      <Text >Select Role</Text>
      <Picker style={styles.userInputStyle} selectedValue={role} onValueChange={setRole}>
        <Picker.Item label="Parent" value="parent" />
        <Picker.Item label="Admin" value="admin" />
        <Picker.Item label="Caregiver" value="caregiver" />
        <Picker.Item label="Super Admin" value="super-admin" />
      </Picker>

      <TextInput style={styles.userInputStyle} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.userInputStyle} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.userInputStyle} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.userInputStyle} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.userInputStyle} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.userInputStyle} placeholder="Phone" value={phone} onChangeText={setPhone} />
       <Text >Select Gender</Text>
      <Picker style={styles.userInputStyle} selectedValue={gender} onValueChange={setGender}>
        <Picker.Item label="Nale" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>
      <TextInput style={styles.userInputStyle}placeholder="DOB" value={dateOfBirth} onChangeText={setDateOfBirth} />

      {/* ================= CHILD SECTION ================= */}
      {role === "parent" && (
        <>
          <Text style={{ marginTop: 20 }}>Child Information</Text>

          <TextInput style={styles.userInputStyle} placeholder="Child First Name" value={childFirstName} onChangeText={setChildFirstName} />
          <TextInput style={styles.userInputStyle} placeholder="Child Last Name" value={childLastName} onChangeText={setChildLastName} />
          <TextInput style={styles.userInputStyle} placeholder="Child Address" value={childAddress} onChangeText={setChildAddress} />
          <TextInput style={styles.userInputStyle} placeholder="Home Language" value={homeLanguage} onChangeText={setHomeLanguage} />
          <TextInput style={styles.userInputStyle} placeholder="Pickup Password" value={pickupPassword} onChangeText={setPickupPassword} />
          <TextInput style={styles.userInputStyle} placeholder="Child DOB" value={childDob} onChangeText={setChildDob} />

          {/* Emergency Contact */}
          <Text style={{ marginTop: 10 }}>Emergency Contact</Text>
          <TextInput style={styles.userInputStyle} placeholder="Name" value={emName} onChangeText={setEmName} />
          <TextInput style={styles.userInputStyle} placeholder="Phone" value={emPhone} onChangeText={setEmPhone} />
          <TextInput style={styles.userInputStyle} placeholder="Address" value={emAddress} onChangeText={setEmAddress} />
          <TextInput style={styles.userInputStyle} placeholder="Relationship" value={emRelationship} onChangeText={setEmRelationship} />

          {/* Authorized Contact */}
          <Text style={{ marginTop: 10 }}>Authorized Contact</Text>
          <TextInput style={styles.userInputStyle} placeholder="Name" value={authName} onChangeText={setAuthName} />
          <TextInput style={styles.userInputStyle} placeholder="Address" value={authAddress} onChangeText={setAuthAddress} />
          <TextInput style={styles.userInputStyle} placeholder="Relationship" value={authRelationship} onChangeText={setAuthRelationship} />

          <View style={styles.switchies}>
            <Text>anybody with legal right, contact with the child?</Text>
            <Switch value={hasLegalRight} onValueChange={setHasLegalRight} />
          </View>
          <TextInput style={styles.userInputStyle} placeholder="Details" value={authDetails} onChangeText={setAuthDetails} />

          {/* Medical */}
          <Text style={{ marginTop: 10, textAlign: "center", fontSize: 20, fontWeight: 600 }}>Medical Info</Text>

          <View style={styles.switchies}>
            <Text>Does your child have any known allergies?</Text>
            <Switch value={hasAllergies} onValueChange={setHasAllergies} />
          </View>
          <TextInput style={styles.userInputStyle} placeholder="Full Details" value={allergyDetails} onChangeText={setAllergyDetails} />

          <View style={styles.switchies}>
            <Text>Does your child have any medical conditions?</Text>
            <Switch value={hasCondition} onValueChange={setHasCondition} />
          </View>
          <TextInput style={styles.userInputStyle} placeholder="Full Details" value={conditionDetails} onChangeText={setConditionDetails} />
          
          <View style={styles.switchies}>
            <Text>Is your child up to date with NHS vaccinations?</Text>
            <Switch value={vaccinationsUpToDate} onValueChange={setVaccinationsUpToDate} />
          </View>
          <TextInput style={styles.userInputStyle} placeholder="If no, please give details:" value={vaccinationDetails} onChangeText={setVaccinationDetails} />

          {/* Doctor */}
          <Text style={{ marginTop: 10 }}>Child's GP (Doctor)</Text>
          <TextInput style={styles.userInputStyle} placeholder="Doctor Name" value={doctorName} onChangeText={setDoctorName} />
          <TextInput style={styles.userInputStyle} placeholder="Doctor Phone" value={doctorPhone} onChangeText={setDoctorPhone} />
          <TextInput style={styles.userInputStyle} placeholder="Doctor Address" value={doctorAddress} onChangeText={setDoctorAddress} />
        </>
      )}

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {success && (
        <Text style={{ color: "green", marginBottom: 10 }}>
          {success}
        </Text>
      )}

      <View style={styles.buttonStyle}>
        <Button
          title={loading ? "Registering..." : "Create User"}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default AddUserScreen;





