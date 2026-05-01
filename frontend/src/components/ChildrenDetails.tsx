import React from 'react'
import { Text, View } from 'react-native'
import styles from '../style/supperadmin/childrenDetailStyle'
import Avatar from './Avater'
import { Child } from '../store/types'

type childrenDetailProp = {
  storeChildren: Child;
  setStoreChildren: React.Dispatch<React.SetStateAction<Child | null>>;
};

const ChildrenDetails = ({ storeChildren, setStoreChildren }: childrenDetailProp) => {

    console.log("storeChildren response in ChildrenDetails",storeChildren);
  return (
    <View style={styles.container}>
        <View>
            <Avatar 
                name={`${storeChildren.firstName} ${storeChildren.lastName}`}
            />
        </View>
        <View>
            <Text>{storeChildren.firstName}</Text>
            <Text>{storeChildren.lastName}</Text>
        </View>
        <View>
            <Text><Text>Address: </Text>{storeChildren.address}</Text>
            <Text><Text>Date of birth: </Text>{storeChildren.dateOfBirth}</Text>
            <Text><Text>Language: </Text>{storeChildren.homeLanguage}</Text>
        </View>
    </View>
  )
}

export default ChildrenDetails
