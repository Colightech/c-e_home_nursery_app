
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
import getFormattedDateTime from "../../utils/getFormattedDateTime";



type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const SupperAdminAttendance = () => {

  const navigation = useNavigation<NavigationProp>();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [actionType, setActionType] = React.useState<"checkin" | "checkout">("checkin");
  const [selectedChild, setSelectedChild] = React.useState<any>(null);

  const [personName, setPersonName] = React.useState("");
  const [relationship, setRelationship] = React.useState("");
  const [enterName, setEnterName] = React.useState("");

   const [time, setTime] = React.useState(getFormattedDateTime());


  const { attendance, fetchByDate, checkIn, checkOut, loading } = useAttendanceStore();
   const fetchChildren = useAdminStore((state) => state.fetchChildren);
  const children = useAdminStore((state) => state.childdata);

  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    fetchByDate(today);
    fetchChildren();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormattedDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (enterName) {
      const timer = setTimeout(() => {
        setEnterName("")
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [enterName]);


  const getChildAttendance = (childId: string) => {
    return attendance.find((a) => a.childId?._id === childId);
  };


  const getStatusUI = (record: any) => {
    if (!record) {
      return {
        label: "Absent",
        color: "#555",
        icon: "close-circle-outline",
      };
    } else if (record.status === "late") {
      return {
        label: "Late",
        color: "#FF3B30",
        icon: "alert-circle-outline",
      };
    } else {
      return {
        label: "Present",
        color: "#34C759",
        icon: "checkmark-circle-outline",
      };
    }
  };



  return (
    <View style={styles.container}>
      <View >
        <TouchableOpacity
          onPress={() => navigation.replace("supperadmin")}
          style={styles.backIcon}
        >
          <Ionicons name="chevron-back" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Text style={styles.title}>Today's </Text>
        <Text style={styles.liveTime}>{time} Attendance</Text>

      
        {children?.map((child) => {

          const record = getChildAttendance(child._id);

          const status = getStatusUI(record); 

          return (
            <View key={child._id} style={styles.card}>

              {/* LEFT */}
              <View style={styles.left}>
                <Avatar name={`${child.firstName} ${child.lastName}`} />
                <Text>{child.firstName} {child.lastName}</Text>
              </View>

              {/* MIDDLE (UPGRADED) */}
              <View style={styles.middle}>

                {/* STATUS WITH ICON */}
                <View style={styles.statusRow}>
                  <Ionicons name={status.icon} size={20} color={status.color} />
                  <Text style={[styles.statusText, { color: status.color }]}>
                    {status.label}
                  </Text>
                </View>

                {/* TIME */}
                <Text style={styles.timeText}>
                  Time in: {record?.timeIn
                    ? new Date(record.timeIn).toLocaleTimeString()
                    : "--"}
                </Text>

                <Text style={styles.timeText}>
                  Time out: {record?.timeOut
                    ? new Date(record.timeOut).toLocaleTimeString()
                    : "--"}
                </Text>

              </View>

              {/* RIGHT (UNCHANGED LOGIC) */}
              {
                loading ? (
                  <Text>Loading...</Text>
                ) : (
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
                        <Text style={styles.checkText}>Check In</Text>
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
                        <Text style={styles.checkText}>Check Out</Text>
                      </TouchableOpacity>
                    )}

                    {record?.timeOut && (
                      <Text style={{ color: "green", fontSize: 12 }}>
                        Completed
                      </Text>
                    )}
                  </View>
                )
              }
            

            </View>
            );
        })}


        {loading && <Text>Processing...</Text>}
      </ScrollView>

      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.cancelNcheck}>
              <Text style={styles.modalTitle}>
                {actionType === "checkin" ? "Enter Check In details" : "Enter Check Out details"}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-outline" size={25} color="black" />
              </TouchableOpacity>
            </View>
            

            <TextInput
              placeholder="Name"
              value={personName}
              onChangeText={setPersonName}
              style={styles.input}
            />

            <TextInput
              placeholder="Relationship"
              value={relationship}
              onChangeText={setRelationship}
              style={styles.input}
            />
            {enterName ? (
              <Text style={styles.alert}>
                {enterName}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={async () => {
                if (!personName || !relationship){
                  return setEnterName("please enter your name and relationship with child");
                }
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
              <Text style={styles.confirmBtnText}>{loading ? "Confirming..." : "Confirm"}</Text>
            </TouchableOpacity>

            
          </View>
        </View>
      )}
    </View>
  )
}

export default SupperAdminAttendance;



