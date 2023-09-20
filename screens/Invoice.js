import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useKeepAwake } from "expo-keep-awake";
import EditText from "../Components/EditBox";
import Button from "../Components/Button";
import Button1 from "../Components/Button1";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import CustomHeader from "../Components/header";
import Modal from "react-native-modal";
const InvoicePage = ({ navigation }) => {
  useKeepAwake();

  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [tax, setTax] = useState("");
  const [province, setProvince] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [dimension, setDimension] = useState(Dimensions.get("window"));
  const onChange = () => {
    setDimension(Dimensions.get("window"));
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      //   Dimensions.removeEventListener('change', onChange);
    };
  });

  useEffect(() => {
    // Font.loadAsync({
    //   Rubic: require("../assets/font/Rubik-SemiBold.ttf"),
    // });
  }, []);

  const orderList = [
    {
      product_name: "BOMBILLA 6400K 7W 665LM E27",
      qty: 1.0,
      price_unit: "8.0",
      price_total: "8.0",
    },
    {
      product_name: "BOMBILLA 3000K 12W 1150LM E27",
      qty: 1.0,
      price_unit: "5.25",
      price_total: "5.25",
    },
    {
      product_name: "BOMBILLA 3U 6400K 6.5W E14 5/100",
      qty: 1.0,
      price_unit: "3.2",
      price_total: "3.2",
    },
    {
      product_name: "CARDAN 20W 4000K",
      qty: 2.0,
      price_unit: "19.5",
      price_total: "39.0",
    },
    {
      product_name: "CARRILTRIFASICO DE 2METRO NEGRO",
      qty: 1.0,
      price_unit: "39.5",
      price_total: "39.5",
    },
  ];

  const renderItem = ({ item }) => (
    <View
      style={{
        paddingHorizontal: dimension.width * 0.01,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text>{item.product_name}</Text>
      <Text>{item.price_total}</Text>
    </View>
  );

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        backgroundColor: "white",
        height: dimension.height,
      }}
    >
      <View
        style={{
          position: "absolute",
          width: dimension.width,
          marginTop: dimension.height * 0.05,
          zIndex: 999,
        }}
      >
        <CustomHeader
          onBackPress={() => {
            navigation.navigate("Setting");
          }}
        />
      </View>
      <View
        style={{
          width: dimension.width * 0.2,
          height: dimension.width * 0.2,
          alignSelf: "center",
          marginTop: dimension.height * 0.1,
          borderRadius: dimension.width * 0.05,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../assets/invoice.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="stretch"
        ></Image>
      </View>

      <Text
        style={{
          marginTop: 10,
          textAlign: "center",
          color: "#130138",
          fontSize: dimension.width * 0.03,
          fontWeight: "bold",
        }}
      >
        Puerto maxcotas s.l {"\n"}
        pol.industrial risco prieto {"\n"}
        35600 puerto del rosario {"\n"}
        tfno.9281856504 {"\n"}
        B13668926
      </Text>

      <View>
        <FlatList
          data={orderList}
          renderItem={renderItem}
          // keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 20 }}
        />
      </View>
      <View style={{ ...styles.line, marginVertical: 15 }} />
      <View
        style={{
          paddingHorizontal: dimension.width * 0.01,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>Total</Text>
        <Text>139.00</Text>
      </View>

      <View style = {{position : 'absolute', marginTop : dimension.height * 0.8, alignSelf : 'center'}}>
        <Text
          style={{
            marginTop: 10,
            textAlign: "center",
            width: dimension.width * 0.7,
            alignSelf: "center",
            color: "#130138",
            fontSize: dimension.width * 0.04,
            fontWeight: "bold",
          }}
        >
          Returns bazaar items with purchase receipt and original packaging
          within a maximum period of 30 days without prejudice to the warranty
          law, customer service
        </Text>
        <Button1
          title="Register Invoice"
          onPress={() => {
            navigation.navigate("Ticket");
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  line: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    borderStyle: "dashed",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  overlay: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "20%",
    height: "100%",
  },
  info: {
    color: "black",
    fontSize: 12,
  },
  bottomModal: {
    justifyContent: "center",
  },
  editStyle: {
    borderColor: "gray",
    borderWidth: 1,
    // marginRight: 10,
    paddingLeft: 20,
    backgroundColor: "white",
    borderColor: "white",
    borderRadius: 10,
    elevation: 2, // Add elevation for box shadow effect
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
export default InvoicePage;
