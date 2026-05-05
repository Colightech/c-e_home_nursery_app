
import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../../style/supperadmin/attendanceStyle';
import useAttendanceStore from "../../store/useAttendanceStore";
import useAdminStore from "../../store/useAdminStore";
import Avatar from "../../components/Avater";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;



const SupperAdminAttendance = () => {

  const navigation = useNavigation<NavigationProp>();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [actionType, setActionType] = React.useState<"checkin" | "checkout">("checkin");
  const [selectedChild, setSelectedChild] = React.useState<any>(null);

  const [personName, setPersonName] = React.useState("");
  const [relationship, setRelationship] = React.useState("");


  const { attendance, fetchByDate, checkIn, checkOut, loading } = useAttendanceStore();
   const fetchChildren = useAdminStore((state) => state.fetchChildren);
  const children = useAdminStore((state) => state.childdata);

  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    fetchByDate(today);
    fetchChildren();
  }, []);

  const getChildAttendance = (childId: string) => {
    return attendance.find((a) => a.childId?._id === childId);
  };



  return (
    <View style={styles.container}>
      <View >
        <TouchableOpacity
          onPress={() => navigation.replace("supperadmin")}
        >
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>
      </View>
       <ScrollView style={styles.container}>
        <Text style={styles.title}>Today's Attendance</Text>

        {children?.map((child) => {
          
          const record = getChildAttendance(child._id);
      
          return (
            <View key={child._id} style={styles.card}>
              {/* LEFT */}
              <View style={styles.left}>
                <Avatar name={`${child.firstName} ${child.lastName}`} />
                <Text>{child.firstName} {child.lastName}</Text>
              </View>

              {/* MIDDLE */}
              <View style={styles.middle}>
                <Text>Status: {record?.status || "Absent"}</Text>
                <Text>In: {record?.timeIn ? new Date(record.timeIn).toLocaleTimeString() : "--"}</Text>
                <Text>Out: {record?.timeOut ? new Date(record.timeOut).toLocaleTimeString() : "--"}</Text>
              </View>

              {/* RIGHT */}
              <View style={styles.right}>
                {!record && (
                  <TouchableOpacity
                    style={styles.checkInBtn}
                    onPress={() => {
                      setSelectedChild(child);
                      setActionType("checkin");
                      setModalVisible(true);
                    }}
                  >
                    <Text>Check In</Text>
                  </TouchableOpacity>                
                )}

                {record && !record.timeOut && (
                  <TouchableOpacity
                    style={styles.checkOutBtn}
                    onPress={() => {
                      setSelectedChild(child);
                      setActionType("checkout");
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.btnText}>Check Out</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {loading && <Text>Processing...</Text>}
      </ScrollView>

      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View >
              <Text style={styles.modalTitle}>
                {actionType === "checkin" ? "Check In" : "Check Out"}
              </Text>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            

            <TextInput
              placeholder="Name"
              value={personName}
              onChangeText={setPersonName}
              style={styles.input}
            />

            <TextInput
              placeholder="Relationship (Father, Mother...)"
              value={relationship}
              onChangeText={setRelationship}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={async () => {
                if (!personName || !relationship) return;

                if (actionType === "checkin") {
                  await checkIn({
                    childId: selectedChild._id,
                    daycareId: selectedChild.daycareId,
                    checkedInBy: {
                      name: personName,
                      relationship,
                    },
                  });
                } else {
                  await checkOut({
                    childId: selectedChild._id,
                    checkedOutBy: {
                      name: personName,
                      relationship,
                    },
                  });
                }

                // reset
                setModalVisible(false);
                setPersonName("");
                setRelationship("");
                setSelectedChild(null);
              }}
            >
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>

            
          </View>
        </View>
      )}
    </View>
  )
}

export default SupperAdminAttendance;



