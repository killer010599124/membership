import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useKeepAwake } from "expo-keep-awake";
import EditText from "../Components/EditBox";
import Button from "../Components/Button";
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

  const [visibleManual, setVisibleManual] = useState(null);

  const imgUrl = [
    require("../assets/Avatar1.png"),
    require("../assets/Avatar2.png"),
    require("../assets/Avatar3.png"),
    require("../assets/Avatar4.png"),
    require("../assets/Avatar5.png"),
    require("../assets/Avatar6.png"),
  ];
  const [currentAvatar, setCurrentAvatar] = useState(imgUrl[0]);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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

  const royalModal = () => {
    return (
      <View
        style={{
          borderRadius: dimension.width * 0.02,
          height: dimension.height * 0.35,
          backgroundColor: "white",
          alignItems: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            alignItems: "flex-end",
            zIndex: 99,
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 10,
              height: dimension.height * 0.04,
              width: dimension.height * 0.04,
              //   borderRadius: dimension.height * 0.02,
              marginRight: 10,
              marginTop: 10,
            }}
            onPress={() => {
              setVisibleManual(null);
            }}
          >
            <AntDesign name="close" size={30} color="#D7D7D7" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            ...styles.container,
            height: dimension.height * 0.3,
            width: dimension.width * 0.9,
            marginTop: dimension.height * 0.025,
          }}
        >
          <View style={{ ...styles.row, width: "100%" }}>
            <TouchableOpacity
              style={{
                width: dimension.width * 0.2,
                height: dimension.width * 0.2,
              }}
              onPress={() => {
                setVisibleManual(null);
                setCurrentAvatar(imgUrl[0]);
              }}
            >
              <Image
                source={imgUrl[0]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="stretch"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: dimension.width * 0.2,
                height: dimension.width * 0.2,
              }}
              onPress={() => {
                setVisibleManual(null);
                setCurrentAvatar(imgUrl[1]);
              }}
            >
              <Image
                source={imgUrl[1]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="stretch"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: dimension.width * 0.2,
                height: dimension.width * 0.2,
              }}
              onPress={() => {
                setVisibleManual(null);
                setCurrentAvatar(imgUrl[2]);
              }}
            >
              <Image
                source={imgUrl[2]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.row, width: "100%" }}>
            <TouchableOpacity
              style={{
                width: dimension.width * 0.2,
                height: dimension.width * 0.2,
              }}
              onPress={() => {
                setVisibleManual(null);
                setCurrentAvatar(imgUrl[3]);
              }}
            >
              <Image
                source={imgUrl[3]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="stretch"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: dimension.width * 0.2,
                height: dimension.width * 0.2,
              }}
              onPress={() => {
                setVisibleManual(null);
                setCurrentAvatar(imgUrl[4]);
              }}
            >
              <Image
                source={imgUrl[4]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="stretch"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: dimension.width * 0.2,
                height: dimension.width * 0.2,
              }}
              onPress={() => {
                setVisibleManual(null);
                setCurrentAvatar(imgUrl[5]);
              }}
            >
              <Image
                source={imgUrl[5]}
                style={{ width: "100%", height: "100%" }}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

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

      <TouchableOpacity
        style={{
          height: dimension.height * 0.2,
          width: "100%",
          alignSelf: "center",
          backgroundColor: "#2C1746",
          marginTop: dimension.height * 0.1,
          borderRadius: dimension.width * 0.05,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          setVisibleManual(1);
        }}
      >
        <View
          style={{
            width: dimension.width * 0.2,
            height: dimension.width * 0.2,
          }}
        >
          <Image
            source={currentAvatar}
            style={{ width: "100%", height: "100%" }}
            resizeMode="stretch"
          ></Image>
        </View>
        <Text style={{ color: "white", fontSize: dimension.width * 0.07 }}>
          Jaka
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 10,
          textAlign: "center",
          color: "#130138",
          fontSize: dimension.width * 0.05,
          fontWeight: "bold",
        }}
      >
        Complete your profile
      </Text>

      <Text style={{ marginTop: 10 }}>Name</Text>
      <TextInput
        style={{
          ...styles.editStyle,
          height: dimension.height * 0.04,
          fontSize: dimension.height * 0.02,
        }}
        placeholder="Enter a name"
        value={name}
        onChangeText={setName}
      ></TextInput>

      <Text style={{ marginTop: 10 }}>Surname</Text>
      <TextInput
        style={{
          ...styles.editStyle,
          height: dimension.height * 0.04,
          fontSize: dimension.height * 0.02,
        }}
        placeholder="Enter a surname"
        value={surname}
        onChangeText={setSurname}
      ></TextInput>

      <Text style={{ marginTop: 10 }}>Tax</Text>
      <TextInput
        style={{
          ...styles.editStyle,
          height: dimension.height * 0.04,
          fontSize: dimension.height * 0.02,
        }}
        placeholder="Enter a tax"
        value={tax}
        onChangeText={setTax}
      ></TextInput>

      <Text style={{ marginTop: 10 }}>Province</Text>
      <TextInput
        style={{
          ...styles.editStyle,
          height: dimension.height * 0.04,
          fontSize: dimension.height * 0.02,
        }}
        placeholder="Enter a province"
        value={province}
        onChangeText={setProvince}
      ></TextInput>

      <Text style={{ marginTop: 10 }}>Address</Text>
      <TextInput
        style={{
          ...styles.editStyle,
          height: dimension.height * 0.04,
          fontSize: dimension.height * 0.02,
        }}
        placeholder="Enter a address"
        value={address}
        onChangeText={setAddress}
      ></TextInput>

      <Text style={{ marginTop: 10 }}>City</Text>
      <TextInput
        style={{
          ...styles.editStyle,
          height: dimension.height * 0.04,
          fontSize: dimension.height * 0.02,
        }}
        placeholder="Enter a city"
        value={city}
        onChangeText={setCity}
      ></TextInput>

      <Text style={{ marginTop: 10 }}>Post Code</Text>
      <TextInput
        style={{
          ...styles.editStyle,
          height: dimension.height * 0.04,
          fontSize: dimension.height * 0.02,
        }}
        placeholder="Enter a post code"
        value={postCode}
        onChangeText={setPostCode}
      ></TextInput>

      <Button
        title="Save"
        onPress={() => {
          navigation.navigate("Setting");
        }}
      />

      <Modal isVisible={visibleManual === 1} style={styles.bottomModal}>
        {royalModal()}
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
