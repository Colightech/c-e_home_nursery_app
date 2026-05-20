
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image,  ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from '../../style/supperadmin/adminChildrenStyle';
import useAdminStore from '../../store/useAdminStore';
import Avatar from '../../components/Avater';
import ChildrenDetails from '../../components/ChildrenDetails';
import { Child } from '../../store/types'
import LoadingSpinner from '../../utils/LoadingSpinner';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const AdminChildren = () => {

  const [storeChildren, setStoreChildren] = useState<Child | null>(null);
  const [openDetails, setOpenDetails]: any = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChildren = useAdminStore((state) => state.fetchChildren);
  const childdata = useAdminStore((state) => state.childdata);
  const loading = useAdminStore((state) => state.loading);

  // console.log("storeChildren response", storeChildren);

  useEffect(() => {
    fetchChildren();
  }, [])

  const navigation = useNavigation<NavigationProp>()
  
  return (
    <ScrollView style={styles.container}>
      {
        loading ? (
          <Text style={styles.loadingText}><LoadingSpinner fullScreen/> </Text>
        ) : (
          <View >
            <TouchableOpacity
              onPress={() => navigation.replace("supperadmin")}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.textTitle}>Children</Text>
            <View style={styles.mapItemsContainer}>
                {
                  childdata?.map((item, index) =>(
                    <View
                      key={index}
                    >
                      <TouchableOpacity 
                        style={styles.mapItems}
                        onPress={() => {
                          setStoreChildren(item)
                          setOpenDetails(true)
                        }}
                      >
                        <View>
                          <Avatar 
                            imageUrl=''
                            name={`${item.firstName} ${item.lastName}`}
                          />
                        </View>
                        <View style={styles.nameContainer}>
                          <Text>{item.firstName}</Text>
                          <Text>{item.lastName}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                }
            </View>
            <View style={styles.openDetaile}>
                {openDetails && storeChildren && (
                  <View>
                    <ChildrenDetails
                      storeChildren = {storeChildren}
                      setOpenDetails = { setOpenDetails}
                    />
                  </View>
                )}
            </View>
          </View>
        )
      }
    </ScrollView>
  )
}

export default AdminChildren;


