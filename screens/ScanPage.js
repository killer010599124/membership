import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Button from "../Components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarCodeScanner } from "expo-barcode-scanner";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { LogBox } from "react-native";
import CustomHeader from "../Components/header";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import NumericPad from "react-native-numeric-pad";
import Icon from "react-native-vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg";
LogBox.ignoreAllLogs();
const ScanPage = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState("044e-0546-f54d");

  const [previousScreen, setPreviousScreen] = useState("Barcode");

  const [visibleManual, setVisibleManual] = useState(null);
  const [printVisible, setPrintVisible] = useState(null);

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
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // do something - for example: reset states, ask for camera permission
      setScanned(false);
      setHasPermission(false);

      console.log("back");

      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log(data);
    setScanData(data);
  };
  const PrintModal = () => {
    return (
      <View
        style={{
          borderRadius: dimension.width * 0.02,
          height: dimension.height * 0.4,
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
              setPrintVisible(null);
            }}
          >
            <AntDesign name="close" size={30} color="#D7D7D7" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            paddingHorizontal: dimension.width * 0.01,
            paddingVertical: dimension.width * 0.005,
            marginTop: dimension.height * 0.05,
            width: dimension.width * 0.9,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <QRCode value={"350e-395f-2dd3"} size={dimension.width * 0.2} />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: dimension.width * 0.05,
              marginTop: dimension.height * 0.01,
            }}
          >
            350e-395f-2dd3
          </Text>

          <Text
            style={{
              fontSize: dimension.width * 0.08,
              fontWeight: "bold",
            }}
          >
            ${parseFloat(30).toFixed(2)}
          </Text>
        </View>

        <Button
          title="Register"
          onPress={() => {
            navigation.navigate("Success");
          }}
        ></Button>
      </View>
    );
  };
  const royalModal = () => {
    return (
      <View
        style={{
          borderRadius: dimension.width * 0.02,
          height: dimension.height * 0.3,
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
        <Octicons
          name="alert"
          size={36}
          color="#FFA800"
          style={{ marginTop: dimension.height * 0.03 }}
        />
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            alignSelf: "center",
            width: dimension.width * 0.6,
            color: "#15224F",
            fontSize: 16,
          }}
        >
          Sorry!
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            alignSelf: "center",
            width: dimension.width * 0.6,
            color: "#15224F",
            fontSize: 16,
          }}
        >
          You cannot bind this gift card, please contact us if you have any
          questions.
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            alignSelf: "center",
            width: dimension.width * 0.6,
            marginTop: dimension?.height * 0.01,
            color: "#FFA800",
            fontSize: dimension.width * 0.04,
          }}
        >
          {scanData}
        </Text>
      </View>
    );
  };
  function Screen1() {
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={{
            borderColor: "white",
            borderRadius: dimension.width * 0.05,
            width: dimension.height * 0.3,
            backgroundColor: "black",
            opacity: 0.5,
            height: dimension.height * 0.3,
            borderWidth: 2,
            marginTop: dimension.height * 0.3,
            alignSelf: "center",
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            marginTop: dimension.height * 0.8,
            width: dimension.width,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Scan and QR code of the Gift Card
          </Text>
        </View>
      </View>
    );
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          width: dimension.width,
          marginTop: dimension.height * 0.05,
          zIndex: 9,
        }}
      >
        <CustomHeader
          onBackPress={() => {
            navigation.navigate("GiftCard");
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: dimension.height * 0.12,
          alignItems: "baseline",
        }}
      >
        <Text
          style={{
            color: "#130138",
            fontSize: dimension.width * 0.06,
            fontWeight: "bold",
          }}
        >
          Scan
        </Text>
      </View>
      {Screen1()}
      <Modal
        isVisible={visibleManual === 1}
        style={{ justifyContent: "center" }}
      >
        {royalModal()}
      </Modal>
      <Modal isVisible={printVisible === 1} style={styles.bottomModal}>
        {PrintModal()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
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
    justifyContent: "flex-end",
    margin: 0,
  },
});

export default ScanPage;
