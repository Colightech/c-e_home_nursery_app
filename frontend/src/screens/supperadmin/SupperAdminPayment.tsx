import React, { useEffect, useState } from "react";
import {View, Text, FlatList, TouchableOpacity, TextInput,
  Alert, ScrollView,
} from "react-native";
 import { Picker } from "@react-native-picker/picker";
import usePaymentStore from "../../store/usePaymentStore";
import useAdminStore from "../../store/useAdminStore";
import styels from "../../style/supperadmin/supperAdminPaymentStyle";
import Ionicons from "react-native-vector-icons/Ionicons";



const SupperAdminPayment = () => {

    const { payments, getAllPayments, confirmAdminPayment, createPayment, loading} = usePaymentStore();
    const fetchChildren = useAdminStore((state) => state.fetchChildren);
    const childdata = useAdminStore((state) => state.childdata);

    const [selectedChild, setSelectedChild] = useState<any>(null);
    const [addPayment, setAddPayment] = useState<boolean>(false);

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [sortCode, setSortCode] = useState("");
    const [serviceType, setServiceType] = useState("");

    useEffect(() => {
        getAllPayments();
        fetchChildren();
    }, []);


    const resetForm = () => {
        setAmount("");
        setDescription("");
        setDueDate("");

        setBankName("");
        setAccountName("");
        setAccountNumber("");
        setSortCode("");
        setServiceType("");
    }


    // CREATE PAYMENT
    const handleCreatePayment = async () => {
        if (!selectedChild) {
            return Alert.alert("Select child");
        }

        if (!amount || !dueDate) {
            return Alert.alert(
                "Amount and due date are required"
            );
        }

        if (
            !bankName ||
            !accountName ||
            !accountNumber
        ) {
            return Alert.alert(
                "Payment account details are required"
            );
        }

        const payload = {
            childId: selectedChild._id,
            amount: Number(amount),
            description,
            dueDate,
            bankName,
            accountName,
            accountNumber,
            sortCode,
            serviceType,
        };

        console.log("CREATE PAYMENT PAYLOAD:",payload);
        const res = await createPayment(payload);
        console.log( "CREATE PAYMENT RESPONSE:",res);
        if (res?.success) {
            Alert.alert(
                "Success",
                "Payment created successfully"
            );

            // RESET FORM
            resetForm();
            setSelectedChild(null);
            // REFRESH PAYMENTS
            getAllPayments();

        } else {
            Alert.alert(
                "Error",
                res?.message || "Failed to create payment"
            );
        }
    };



    return (
        <ScrollView
            style={styels.container}
        >
            <View style={styels.titleIcon}>
                <Text  style={styels.titleText}>Payment Management</Text>
                <TouchableOpacity
                    onPress={() => setAddPayment(true)}
                >
                    <Ionicons name="add" size={30} color="black" />
                </TouchableOpacity>
            </View>

            {/* CREATE PAYMENT SECTION */}
            {
                addPayment && (
                    <View style={styels.inputContainer}>
                        <View style={styels.createClose}>
                            <Text style={styels.inputTitleText}>Create Payment</Text>
                            <TouchableOpacity
                                 onPress={() => setAddPayment(false)}
                            >
                                <Ionicons name="close" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                        {/* CHILD LIST */}
                        <View  style={styels.childPicker}>
                            <Picker
                                selectedValue={selectedChild?._id}
                                onValueChange={(value) => {
                                    const child = childdata.find(
                                        (c: any) => c._id === value
                                    );
                                    setSelectedChild(child);
                                }}
                            >
                                <Picker.Item
                                    label="Select Child"
                                    value={null}
                                />

                                {childdata.map((child: any) => (
                                <Picker.Item
                                    key={child._id}
                                    label={`${child.firstName} ${child.lastName}`}
                                    value={child._id}
                                />
                                ))}
                            </Picker>
                        </View>

                        {/* AMOUNT */}

                        <TextInput
                            placeholder="Amount"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            style={styels.inputStyle}
                        />

                        {/* DESCRIPTION */}
                        <TextInput
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            style={styels.inputStyle}
                        />

                        {/* DUE DATE */}
                        <TextInput
                            placeholder="Due Date (2026-06-01)"
                            value={dueDate}
                            onChangeText={setDueDate}
                            style={styels.inputStyle}
                        />

                        <TextInput
                            placeholder="Bank Name"
                            value={bankName}
                            onChangeText={setBankName}
                            style={styels.inputStyle}
                        />

                        <TextInput
                            placeholder="Account Name"
                            value={accountName}
                            onChangeText={setAccountName}
                            style={styels.inputStyle}
                        />

                        <TextInput
                            placeholder="Account Number"
                            value={accountNumber}
                            onChangeText={setAccountNumber}
                            style={styels.inputStyle}
                        />

                        <TextInput
                            placeholder="Sort Code"
                            value={sortCode}
                            onChangeText={setSortCode}
                            style={styels.inputStyle}
                        />

                        <TextInput
                            placeholder="Types of service"
                            value={serviceType}
                            onChangeText={setServiceType}
                            multiline
                            style={styels.inputStyle}
                        />

                        {/* CREATE BUTTON */}
                        <TouchableOpacity
                            onPress={handleCreatePayment}
                            style={styels.inputBtn}
                        >
                        <Text
                            style={styels.inputText}
                        >
                        {loading ? "Loading..." : "CREATE PAYMENT"}
                        </Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            {/* PAYMENT LIST */}
            {
                loading ? (
                    <Text style={styels.loadingStyle}>Loading...</Text>
                ) : (
                    <FlatList
                        data={payments}
                        scrollEnabled={false}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (

                        <View
                            style={{
                            backgroundColor: "#fff",
                            padding: 15,
                            borderRadius: 12,
                            marginBottom: 12,
                            }}
                        >

                            <Text>
                            Child: {item.childId?.firstName} {item.childId?.lastName}
                            </Text>

                            <Text>
                            Amount: ₦{item.amount}
                            </Text>

                            <Text>
                            Status: {item.status}
                            </Text>

                            <Text>
                            Parent: {item.parentId?.fullName}
                            </Text>

                            <Text>
                            Due:
                            {" "}
                            {new Date(item.dueDate).toDateString()}
                            </Text>





                            {/* PAYMENT DETAILS */}

                            <View
                            style={{
                                marginTop: 10,
                                backgroundColor: "#f5f5f5",
                                padding: 10,
                                borderRadius: 10,
                            }}
                            >

                            <Text>
                                Bank:
                                {" "}
                                {item.paymentDetails?.bankName}
                            </Text>

                            <Text>
                                Account Name:
                                {" "}
                                {item.paymentDetails?.accountName}
                            </Text>
                            <Text>
                                Sort Code:
                                {" "}
                                {item.paymentDetails?.sortCode}
                            </Text>

                            <Text>
                                Account Number:
                                {" "}
                                {item.paymentDetails?.accountNumber}
                            </Text>

                            </View>






                            {/* ADMIN CONFIRMATION */}

                            {
                            item.status === "awaiting_admin" && (
                                <TouchableOpacity
                                    onPress={() => confirmAdminPayment(item._id)}
                                    style={{
                                        marginTop: 15,
                                        backgroundColor: "green",
                                        padding: 12,
                                        borderRadius: 10,
                                    }}
                                    >

                                    <Text
                                        style={{
                                        color: "#fff",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        }}
                                    >
                                        PAYMENT RECEIVED
                                    </Text>

                                </TouchableOpacity>
                            )
                            }

                        </View>
                        )}
                    />
                )
            }
        </ScrollView>
    );
};

export default SupperAdminPayment;