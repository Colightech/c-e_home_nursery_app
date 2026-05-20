
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import usePaymentStore from "../../store/usePaymentStore";
import useAuthStore from "../../store/useAuthStore";
import socket from "../../socket/socket";




const ParentPayment = () => {

    const [openedPaymentId, setOpenedPaymentId] = useState<string | null>(null);
    const { payments, getParentPayment, ParentConfirmPayment  } = usePaymentStore();
    const user = useAuthStore((state) => state.user);

    console.log("payments response",payments);

    useEffect(() => {
        if (user?._id) {
            socket.emit("join_parent_room", {
                parentId: user._id,
            });
        }
    }, []);


    useEffect(() => {
        getParentPayment(); 
    }, []);

      useEffect(() => {

        socket.on("payment_created", (payment) => {
                console.log("PAYMENT CREATION ALERT:", payment);
                Alert.alert("Payment Alert", "Admin has created payment");
                getParentPayment();
            }
        );

            
        socket.on("payment_confirmed", (payment) => {
                console.log("PAYMENT CONFIRMATION ALERT:", payment);
                Alert.alert("Payment Alert", "Admin has confirm payment");
                getParentPayment();
            }
        );

        return () => {
            socket.off("payment_created");
            socket.off("payment_confirmed");
        };

    }, []);

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
    <View style={{ flex: 1, padding: 15 }}>

      <FlatList
        data={payments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
              backgroundColor: "#fff",
            }}
          >
            <Text>Child: {item.childId?.firstName} {item.childId?.lastName}</Text>
            <Text>Amount: £{item.amount}</Text>
            <Text>Due: {new Date(item.dueDate).toDateString()}</Text>

            <Text style={{ marginVertical: 5 }}>
              Status: {renderStatus(item.status)}
            </Text>

            {
                openedPaymentId === item._id && (
                    <View style={{marginTop: 10, marginBottom: 10}}>
                        <Text style={{fontWeight: "600"}}>PAYMENT DETAILS</Text>
                        <Text style={{ marginBottom: 5}}>
                            please tranfer the exact amount to the given detail and 
                            click the blue button if the transfer is successful.
                        </Text>
                        <Text>Account Name: {item.paymentDetails.accountName}</Text>
                        <Text>Account Number: {item.paymentDetails.accountNumber}</Text>
                        <Text>Sort Code: {item.paymentDetails.sortCode}</Text>
                        <Text>Bank Name: {item.paymentDetails.bankName}</Text>
                        <Text>Type Of Service: {item.paymentDetails.serviceType}</Text>
                    </View>
                )
            }

            {/* MAKE PAYMENT */}
            {item.status === "due" && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#4CAF50",
                  padding: 10,
                  borderRadius: 8,
                }}
                onPress={() => {
                    setOpenedPaymentId((prev) => prev === item._id
                        ? null
                        : item._id
                    );
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                 {openedPaymentId === item._id ? "CLOSE PAYMENT DETAILS" : " MAKE PAYMENT"}
                </Text>
              </TouchableOpacity>
            )}

            {/* CONFIRM PAYMENT */}
            {item.status === "due" && (
              <TouchableOpacity
                onPress={() => ParentConfirmPayment(item._id)}
                style={{
                  marginTop: 10,
                  backgroundColor: "#2196F3",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center"  }}>
                  
                  {openedPaymentId === item._id ? "LOADING PAYMENT STATUS...." : "I HAVE MADE PAYMENT"}
                </Text>
              </TouchableOpacity>
            )}

            {item.status === "awaiting_admin" && (
              <Text style={{ color: "orange", marginTop: 10 }}>
                Awaiting admin confirmation...
              </Text>
            )}

            {item.status === "paid" && (
              <Text style={{ color: "green", marginTop: 10 }}>
                Payment Confirmed ✔
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default ParentPayment;