import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styles from '../style/supperadmin/childrenDetailStyle'
import Avatar from './Avater'
import { Child } from '../store/types'
import Ionicons from "react-native-vector-icons/Ionicons";

type childrenDetailProp = {
  storeChildren: Child;
  setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChildrenDetails = ({ storeChildren, setOpenDetails }: childrenDetailProp) => {

    // console.log("storeChildren response in ChildrenDetails", storeChildren);

  return (
    <View style={styles.container}>
        <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setOpenDetails(false)}
        >
            <Ionicons name="close-outline" size={25} color="black" />
        </TouchableOpacity>
        <View style={styles.iconAndName}>
            <View>
                <Avatar
                    imageUrl=''
                    name={`${storeChildren?.firstName} ${storeChildren?.lastName}`}
                />
            </View>
            <View style={styles.names}>
                <Text>{storeChildren?.firstName}</Text>
                <Text>{storeChildren?.lastName}</Text>
            </View>
        </View>

        {/* BASIC DETAIL */}
        <View style={styles.basicDetails}>
            <Text><Text style={styles.basicDetailsItems}>Address: </Text>{storeChildren?.address}</Text>
            <Text><Text style={styles.basicDetailsItems}>Date of birth: </Text>{storeChildren?.dateOfBirth}</Text>
            <Text><Text style={styles.basicDetailsItems}>Language: </Text>{storeChildren?.homeLanguage}</Text>
            <Text><Text style={styles.basicDetailsItems}>Pick up password: </Text>{storeChildren?.pickupPassword}</Text>
        </View>

        {/* PARENTS INFORMATION */}
        <View>
            <Text style={styles.parentDetails}>Parent Information</Text>
            <View>
                 <Text><Text style={styles.basicDetailsItems}>Father's name: </Text>{storeChildren?.parentId?.firstName} {storeChildren?.parentId?.lastName}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Email: </Text>{storeChildren?.parentId?.email}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Phone: </Text>{storeChildren?.parentId?.phone}</Text>
            </View>
        </View>

        {/* EMERGENCY CONTACT */}
        <View>
            <Text style={styles.parentDetails}>Emergency Contact</Text>
            <View>
                 <Text><Text style={styles.basicDetailsItems}>Name: </Text>{storeChildren?.emergencyContacts?.[0]?.name}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Phone: </Text>{storeChildren?.emergencyContacts?.[0]?.phone}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Address: </Text>{storeChildren?.emergencyContacts?.[0]?.address}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Relationship: </Text>{storeChildren?.emergencyContacts?.[0]?.relationship}</Text>
            </View>
        </View>

        {/* AUTHORIZED CONTACT */}
        <View>
            <Text style={styles.parentDetails}>Authorized Contact</Text>
            <View>
                 <Text><Text style={styles.basicDetailsItems}>Name: </Text>{storeChildren?.authorizedContacts?.[0]?.name}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Address: </Text>{storeChildren?.authorizedContacts?.[0]?.address}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Relationship: </Text>{storeChildren?.authorizedContacts?.[0]?.relationship}</Text>
                {
                    storeChildren?.authorizedContacts?.[0]?.hasLegalContactRight ? (
                        <Text><Text style={styles.basicDetailsItems}>Details: </Text>{storeChildren?.authorizedContacts?.[0]?.details}</Text>
                    ) : 
                    <></>
                }
                 
            </View>
        </View>

        {/* MEDICAL INFORMATION */}
        <View>
            <Text style={styles.parentDetails}>Medical Information</Text>
            <View>
                {
                    storeChildren?.medicalInfo?.allergies?.hasAllergies ? (
                        <Text><Text style={styles.basicDetailsItems}>Alergies: </Text>{storeChildren?.medicalInfo?.allergies?.details}</Text>
                    ) : 
                    <></>
                }
                 
                {
                    storeChildren?.medicalInfo?.medicalConditions?.hasCondition ? (
                        <Text><Text style={styles.basicDetailsItems}>Details: </Text>{storeChildren?.medicalInfo?.medicalConditions?.details}</Text>
                    ) : 
                    <></>
                }

                {
                    storeChildren?.medicalInfo?.vaccinationsUpToDate ? (
                        <Text><Text style={styles.basicDetailsItems}>Vaccination: </Text>{storeChildren?.medicalInfo?.vaccinationDetails}</Text>
                    ) : 
                    <></>
                }
            </View>
        </View>

         {/* CHILD'S GP (DOCTOR) */}
        <View>
            <Text style={styles.parentDetails}>Child's GP (Doctor)</Text>
            <View>
                 <Text><Text style={styles.basicDetailsItems}>Name: </Text>{storeChildren?.doctor?.name}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Address: </Text>{storeChildren?.doctor?.address}</Text>
                 <Text><Text style={styles.basicDetailsItems}>Phon: </Text>{storeChildren?.doctor?.phone}</Text>
            </View>
        </View>
    </View>
  )
}

export default ChildrenDetails;
