
import React, { useEffect } from "react";
import {
  View,
  Text,
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

  const navigation = useNavigation<NavigationProp>()


   const { attendance, fetchByDate, checkIn, checkOut, loading } = useAttendanceStore();
   const children = useAdminStore((state) => state.childdata);

  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    fetchByDate(today);
  }, []);

  const getChildAttendance = (childId: string) => {
    return attendance.find((a) => a.childId?._id === childId);
  };


  // const attendanceMap = React.useMemo(() => {
  //   const map = new Map();

  //   attendance.forEach((a) => {
  //     if (a.childId?._id) {
  //       map.set(a.childId._id, a);
  //     }
  //   });

  //   return map;
  // }, [attendance]);



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
                    onPress={() =>
                      checkIn({
                        childId: child?._id,
                        daycareId: child?.daycareId,
                        checkedInBy: {
                          name: "Staff",
                          relationship: "Caregiver",
                        },
                      })
                    }
                  >
                    <Text>Check In</Text>
                  </TouchableOpacity>                
                )}

                {record && !record.timeOut && (
                  <TouchableOpacity
                    style={styles.checkOutBtn}
                    onPress={() =>
                      checkOut({
                        childId: child?._id,
                        checkedOutBy: {
                          name: "Parent",
                          relationship: "Mother",
                        },
                      })
                    }
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
    </View>
  )
}

export default SupperAdminAttendance;



