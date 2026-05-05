
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
import AppInput from "../../components/AppInput"
import useAdminStore from "../../store/useAdminStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const AddUserScreen = () => {

    const navigation = useNavigation<NavigationProp>();

    const fetchDaycare = useAdminStore((s) => s.fetchDaycare);
    const daycare = useAdminStore((s) => s.daycare);

    // console.log("daycare response", daycare);
   

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
    const [daycareId, setDaycareId] = useState("");
    const [gender, setGender] = useState("male");
    const [dateOfBirth, setDateOfBirth] = useState("");


    // ================= CHILD BASIC =================
    const [childFirstName, setChildFirstName] = useState("");
    const [childLastName, setChildLastName] = useState("");
    const [childAddress, setChildAddress] = useState("");
    const [homeLanguage, setHomeLanguage] = useState("English");
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
        }, 9000);
        return () => clearTimeout(timer);
      }
    }, [success, error]);

    useEffect(() => {
      fetchDaycare();
    }, [])

    useEffect(() => {
      if (daycare?.length > 0 && !daycareId) {
        setDaycareId(daycare[0]._id);
      }
    }, [daycare]);

    // =========== CLEAR FORM FIELDS ============
    const resetForm = () => {
      setRole("parent")
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setAddress("");
      setPhone("");
      setDaycareId("");
      setGender("male");
      setDateOfBirth("");

      // child
      setChildFirstName("");
      setChildLastName("");
      setChildAddress("");
      setHomeLanguage("English");
      setPickupPassword("");
      setChildDob("");

      // emergency
      setEmName("");
      setEmPhone("");
      setEmAddress("");
      setEmRelationship("");

      //== AUTHORIZED CONTACT ====
      setAuthName("");
      setAuthAddress("");
      setAuthRelationship("");
      setHasLegalRight(false);
      setAuthDetails("");

      //==== MEDICAL ===
      setHasAllergies(false);
      setAllergyDetails("");

      setHasCondition(false);
      setConditionDetails("");

      setVaccinationsUpToDate(false);
      setVaccinationDetails("");

      // === DOCTOR =====
      setDoctorName("");
      setDoctorPhone("");
      setDoctorAddress("");
    }

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
      resetForm();
    };

    return (
      <ScrollView style={styles.container}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.replace("supperadmin")}
        >
            <Ionicons name="chevron-back" size={25} color="#fff" />
        </TouchableOpacity>
        
        <Text style={{textAlign: "center", fontSize: 25, fontWeight: 600}}>User user</Text>

        {/* ================= USER SECTION ================= */}
        <Text >Select Role</Text>
        <Picker style={styles.userInputStyle}  selectedValue={role} onValueChange={setRole}>
          <Picker.Item style={styles.pickerStyle} label="Parent" value="parent" />
          <Picker.Item style={styles.pickerStyle} label="Admin" value="admin" />
          <Picker.Item style={styles.pickerStyle} label="Caregiver" value="caregiver" />
          <Picker.Item style={styles.pickerStyle} label="Super Admin" value="super-admin" />
        </Picker>

        <AppInput  placeholder="First Name" value={firstName} onChangeText={setFirstName} />
        <AppInput  placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        <AppInput  placeholder="Email" value={email} onChangeText={setEmail} />
        <AppInput  placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <AppInput  placeholder="Address" value={address} onChangeText={setAddress} />
        <AppInput  placeholder="Phone" value={phone} onChangeText={setPhone} />
        <Text style={{ marginTop: 10 }}>Select Daycare</Text>
        <Picker style={styles.userInputStyle} selectedValue={daycareId} onValueChange={setDaycareId}>
          {daycare?.map((item: any) => (
            <Picker.Item key={item._id} label={item.name} value={item._id}/>
          ))}
        </Picker>
        <Text style={{marginTop: 10}}>Select Gender</Text>
        <Picker style={styles.userInputStyle} selectedValue={gender} onValueChange={setGender}>
          <Picker.Item style={styles.pickerStyle} label="Male" value="male" />
          <Picker.Item style={styles.pickerStyle} label="Female" value="female" />
        </Picker>
        <AppInput   placeholder="Date of birth" value={dateOfBirth} onChangeText={setDateOfBirth} />

        {/* ================= CHILD SECTION ================= */}
        {role === "parent" && (
          <>
            <Text style={{ marginTop: 20, fontSize: 20, fontWeight: 600 }}>Child Information</Text>
            <AppInput placeholder="Child First Name" value={childFirstName} onChangeText={setChildFirstName} />
            <AppInput placeholder="Child Last Name" value={childLastName} onChangeText={setChildLastName} />
            <AppInput placeholder="Child Address" value={childAddress} onChangeText={setChildAddress} />
            <Text style={{marginTop: 10}}>Select Child Home Language</Text>
            <Picker style={styles.userInputStyle} selectedValue={homeLanguage} onValueChange={setHomeLanguage}>
              <Picker.Item style={styles.pickerStyle} label="English" value="English" />
              <Picker.Item style={styles.pickerStyle} label="French" value="French" />
              <Picker.Item style={styles.pickerStyle} label="Spanish" value="Spanish" />
              <Picker.Item style={styles.pickerStyle} label="Arabic" value="Arabic" />
            </Picker>
            <AppInput   placeholder="Pickup Password" value={pickupPassword} onChangeText={setPickupPassword} />
            <AppInput  placeholder="Child Date of birth" value={childDob} onChangeText={setChildDob} />

            {/* Emergency Contact */}
            <Text style={{ marginTop: 10 }}>Emergency Contact</Text>
            <AppInput  placeholder="Name" value={emName} onChangeText={setEmName} />
            <AppInput  placeholder="Phone" value={emPhone} onChangeText={setEmPhone} />
            <AppInput  placeholder="Address" value={emAddress} onChangeText={setEmAddress} />
            <AppInput  placeholder="Relationship" value={emRelationship} onChangeText={setEmRelationship} />

            {/* Authorized Contact */}
            <Text style={{ marginTop: 10 }}>Authorized Contact</Text>
            <AppInput  placeholder="Name" value={authName} onChangeText={setAuthName} />
            <AppInput  placeholder="Address" value={authAddress} onChangeText={setAuthAddress} />
            <AppInput  placeholder="Relationship" value={authRelationship} onChangeText={setAuthRelationship} />

            <View style={styles.switchies}>
              <Text>anybody with legal right contact with the child?</Text>
              <Switch value={hasLegalRight} onValueChange={setHasLegalRight} />
            </View>
            <AppInput  placeholder="Details" value={authDetails} onChangeText={setAuthDetails} />

            {/* Medical */}
            <Text style={{ marginTop: 10, textAlign: "center", fontSize: 20, fontWeight: 600 }}>Medical Info</Text>

            <View style={styles.switchies}>
              <Text>Does your child have any known allergies?</Text>
              <Switch value={hasAllergies} onValueChange={setHasAllergies} />
            </View>
            <AppInput  placeholder="Full Details" value={allergyDetails} onChangeText={setAllergyDetails} />

            <View style={styles.switchies}>
              <Text>Does your child have any medical conditions?</Text>
              <Switch value={hasCondition} onValueChange={setHasCondition} />
            </View>
            <AppInput  placeholder="Full Details" value={conditionDetails} onChangeText={setConditionDetails} />
            
            <View style={styles.switchies}>
              <Text>Is your child up to date with NHS vaccinations?</Text>
              <Switch value={vaccinationsUpToDate} onValueChange={setVaccinationsUpToDate} />
            </View>
            <AppInput  placeholder="If no, please give details:" value={vaccinationDetails} onChangeText={setVaccinationDetails} />

            {/* Doctor */}
            <Text style={{ marginTop: 10 }}>Child's GP (Doctor)</Text>
            <AppInput  placeholder="Doctor Name" value={doctorName} onChangeText={setDoctorName} />
            <AppInput  placeholder="Doctor Phone" value={doctorPhone} onChangeText={setDoctorPhone} />
            <AppInput  placeholder="Doctor Address" value={doctorAddress} onChangeText={setDoctorAddress} />
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



