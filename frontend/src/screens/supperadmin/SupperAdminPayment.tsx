import React, { useEffect, useState } from "react";
import {View, Text, FlatList, TouchableOpacity, TextInput,
  Alert, ScrollView,
} from "react-native";
 import { Picker } from "@react-native-picker/picker";
 import DatePicker from "react-native-date-picker";
import usePaymentStore from "../../store/usePaymentStore";
import useAdminStore from "../../store/useAdminStore";
import styels from "../../style/supperadmin/supperAdminPaymentStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import socket from "../../socket/socket";
import useAuthStore from "../../store/useAuthStore";
 



const SupperAdminPayment = () => {

    const { payments, getAllPayments, confirmAdminPayment, createPayment, loading} = usePaymentStore();
    const fetchChildren = useAdminStore((state) => state.fetchChildren);
    const childdata = useAdminStore((state) => state.childdata);
    const user = useAuthStore((state) => state.user);

    const [selectedChild, setSelectedChild] = useState<any>(null);
    const [addPayment, setAddPayment] = useState<boolean>(false);

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [sortCode, setSortCode] = useState("");
    const [serviceType, setServiceType] = useState("");

    const [dueDate, setDueDate] = useState<Date>(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);


    useEffect(() => {
        if (user?.daycareId) {
            socket.emit("join_admin_room", {
                daycareId: user.daycareId,
            });
        }
    }, []);


    useEffect(() => {
        
        socket.on("parent_payment_alert", (payment) => {
                console.log("ADMIN PAYMENT ALERT:", payment);
                Alert.alert("Payment Alert", "A parent submitted payment");
                getAllPayments();
            }
        );

        return () => {
            socket.off("parent_payment_alert");
        };

    }, []);


    useEffect(() => {
        getAllPayments();
        fetchChildren();
        resetForm();
    }, []);



    const resetForm = () => {
        setAmount("");
        setDescription("");
        setDueDate(new Date());

        setBankName("");
        setAccountName("C&E Home Nursery");
        setAccountNumber("74817860");
        setSortCode("30-99-50");
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
        const res = await createPayment(payload);
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


    const renderStatus = (status: string) => {
        switch (status) {
        case "due":
            return "🔴 PAYMENT DUE";
        case "awaiting_admin":
            return "🟡 WAITING ADMIN CONFIRMATION";
        case "paid":
            return "🟢 PAID";
        case "overdue":
            return "⚠️ OVERDUE";
        default:
            return status;
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
                        <View>
                            <TouchableOpacity
                                onPress={() => setOpenDatePicker(true)}
                                style={styels.inputStyle}
                            >
                                <Text>
                                    {dueDate
                                        ? dueDate.toDateString()
                                        : "Select Due Date"}
                                </Text>
                            </TouchableOpacity>

                            <DatePicker
                                modal
                                open={openDatePicker}
                                date={dueDate}
                                mode="date"
                                onConfirm={(date) => {
                                    setOpenDatePicker(false);
                                    setDueDate(date);
                                }}
                                onCancel={() => {
                                    setOpenDatePicker(false);
                                }}
                            />
                        </View>

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
                        {loading ? "Adding Payment..." : "Add Payment"}
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
                                Status: {renderStatus(item.status)}
                            </Text>

                            <Text>
                                Parent: {item.parentId?.firstName} {item.parentId?.lastName}
                            </Text>

                            <Text>
                                dueDate:  {" "} {new Date(item.dueDate).toDateString()}
                            </Text>
                             {item.status === "paid" && (
                                <Text style={{ color: "green", marginTop: 10 }}>
                                     Payment Confirmed ✔
                                </Text>
                            )}





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
                                    Bank:  {" "}  {item.paymentDetails?.bankName}
                                </Text>
                                <Text>
                                    Account Name:  {" "}  {item.paymentDetails?.accountName}
                                </Text>
                                <Text>
                                    Sort Code: {" "}  {item.paymentDetails?.sortCode}
                                </Text>
                                <Text>
                                    Account Number:  {" "} {item.paymentDetails?.accountNumber}
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
                                        CONFORM PAYMENT RECEIVED
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