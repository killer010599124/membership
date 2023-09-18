import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import CustomHeader from "../Components/header";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
const HomeScreen = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [appId, setAppId] = useState("");
  const [point, setPoint] = useState();
  const [balance, setBalance] = useState();
  const [average, setAverage] = useState();
  const [shouldRender, setShouldRender] = useState(false);
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

  const [giftCards, setGiftCards] = useState([]);
  const testgiftCards = [
    {
      code: "3503-3ef3-39l8",
      date: "29 June 2021, 7.14 PM",
      balance: 2,
    },
    {
      code: "3503-3ef3-39l9",
      date: "29 June 2021, 7.14 PM",
      balance: 2,
    },
  ];

  const generateRandomString = () => {
    const characters = "abcdef0123456789";
    let randomString = "";

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];

      if ((i + 1) % 4 === 0 && i !== 11) {
        randomString += "-";
      }
    }

    return randomString;
  };
  useEffect(() => {
    AsyncStorage.getItem("contact_email").then((contact_email) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://erp.topledspain.com/api/contact-info?email=${contact_email}`,
        requestOptions
      )
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          console.log(result);

          setUsername(result.name + "!");
          console.log(result.barcode);
          setAppId(result.barcode);
          setShouldRender(true);
        })
        .catch((error) => console.log("error", error));

      fetch(
        `https://erp.topledspain.com/api/get_contact_total_sales?email=${contact_email}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          setAverage(result);
        })
        .catch((error) => console.log("error", error));

      fetch(
        `https://erp.topledspain.com/api/get_contact_loyalty_points?email=${contact_email}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          setPoint(result);
        })
        .catch((error) => console.log("error", error));

      fetch(
        `https://erp.topledspain.com/api/get_contact_eWallet_balance?email=${contact_email}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          setBalance(result);
        })
        .catch((error) => console.log("error", error));

      fetch(
        `https://erp.topledspain.com/api/get_contact_giftcards?email=${contact_email}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const jsonData = JSON.parse(result);
          setGiftCards([jsonData[0], jsonData[1]]);
          console.log(jsonData[0]);
        })
        .catch((error) => console.log("error", error));
    });
  }, []);

  const dateFormat = (dateString) => {
    const dateTime = new Date(dateString);
    const formattedDateTime = dateTime.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formattedDateTime;
  };
  const renderItem = ({ item }) => (
    <View
      style={{
        paddingHorizontal: dimension.width * 0.01,
        paddingVertical: dimension.width * 0.005,
      }}
    >
      <TouchableOpacity
        style={{
          height: dimension.width * 0.15,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 10,
          marginTop: 10,
          elevation: 3, // Add elevation for box shadow effect
          shadowColor: "#000",
          shadowOffset: {
            width: 2,
            height: 5,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
        }}
        onPress={() => {
          // handleProductPress(item);
        }}
      >
        <View
          style={{
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            flex: 1,
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <MaterialCommunityIcons
              name="wallet-giftcard"
              size={dimension.width * 0.06}
              color="#080341"
            />
          </View>

          <View style={{ justifyContent: "space-evenly" }}>
            <Text
              style={{
                color: "#363853",
                fontSize: dimension.width * 0.04,
                fontWeight: "bold",
              }}
            >
              {item.code}
            </Text>
            <Text
              style={{ fontSize: dimension.width * 0.03, color: "#BDBDBD" }}
            >
              {dateFormat(item.date)}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
            }}
          >
            {/* <Text style={{ fontSize: 12 }}>${item.standard_price}</Text> */}
            <Text
              style={{ fontSize: dimension.width * 0.05, fontWeight: "bold" }}
            >
              €{parseFloat(item.balance).toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              width: dimension.width * 0.08,
              height: dimension.width * 0.08,
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../assets/Arrow.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="stretch"
            ></Image>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const returnQR = () => {
    return shouldRender ? (
      <QRCode
        value={appId}
        size={dimension.width * 0.15}
        color="white" // Set the color prop to "white" for a white QR code
        backgroundColor="#5B259F"
      />
    ) : null;
    return (
      <QRCode
        value={appId}
        size={dimension.width * 0.15}
        color="white" // Set the color prop to "white" for a white QR code
        backgroundColor="#5B259F"
      />
    );
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "white",
        height: "120%",
        marginTop: -dimension.height * 0.062,
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: dimension.width * 0.05,
          marginTop: dimension.height * 0.12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text style={{ fontSize: dimension.width * 0.07 }}>Welcome </Text>
          <Text
            style={{
              ...styles.fullName,
              color: "black",
              fontSize: dimension.width * 0.07,
            }}
          >
            {username}
          </Text>
        </View>
        <View
          style={{
            width: dimension.width * 0.1,
            height: dimension.width * 0.1,
          }}
        >
          <Image
            source={require("../assets/Avatar1.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="stretch"
          ></Image>
        </View>
      </View>
      {/* Other content for the Home screen */}

      <View
        style={{
          marginTop: dimension.height * 0.01,
          height: dimension.height * 0.18,
          width: dimension.width * 0.8,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#5B259F",
            height: dimension.height * 0.18,
            borderRadius: dimension.width * 0.12,
            alignItems: "center",
            justifyContent: "center",
          }}
          underlayColor="#fff"
        >
          {returnQR()}
          <Text style={{ color: "white", marginTop: dimension.height * 0.01 }}>
            {appId}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",

          justifyContent: "space-between",
          height: dimension.height * 0.1,
          padding: 10,
        }}
      >
        <View
          style={{
            alignItems: "center",
            width: "50%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: dimension.width * 0.04,
              fontWeight: "bold",
              marginBottom: dimension.height * 0.01,
            }}
          >
            Mis punto
          </Text>
          <Text
            style={{ fontSize: dimension.width * 0.06, fontWeight: "bold" }}
          >
            {point}
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: "black" }}></View>
        <View
          style={{
            alignItems: "center",
            width: "50%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: dimension.width * 0.04,
              fontWeight: "bold",
              marginBottom: dimension.height * 0.01,
            }}
          >
            E wallet
          </Text>
          <Text
            style={{ fontSize: dimension.width * 0.06, fontWeight: "bold" }}
          >
            ${parseFloat(balance).toFixed(2)}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: dimension.height * 0.2,
          marginTop: dimension.height * 0.02,
        }}
      >
        <Image
          source={require("../assets/averageSale.png")}
          style={{ width: "100%", height: "90%" }}
          resizeMode="stretch"
        ></Image>
        <Image
          source={require("../assets/year.png")}
          style={{ width: "100%", height: "10%" }}
          resizeMode="stretch"
        ></Image>
        <Text
          style={{
            color: "white",
            position: "absolute",
            fontSize: dimension.width * 0.05,
            marginTop: dimension.height * 0.018,
            marginLeft: dimension.width * 0.12,
          }}
        >
          ${average}
        </Text>
      </View>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: dimension.height * 0.03,
            alignItems: "baseline",
          }}
        >
          <Text
            style={{
              color: "#5B259F",
              fontSize: dimension.width * 0.06,
              fontWeight: "bold",
            }}
          >
            Gift Card
          </Text>
          <Text
            style={{ color: "#8438FF", fontSize: dimension.width * 0.04 }}
            onPress={() => {
              navigation.navigate("GiftCard");
            }}
          >
            View All
          </Text>
        </View>

        <View>
          <FlatList
            data={giftCards}
            renderItem={renderItem}
            // keyExtractor={(item) => item.id.toString()}
            style={{ height: dimension.height * 0.8 }}
          />
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#5B259F",
          position: "absolute",
          height: dimension.height * 0.08,
          marginTop: dimension.height,
          width: "100%",
          borderRadius: dimension.width * 0.08,
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          style={{
            width: dimension.width * 0.08,
            height: "100%",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <AntDesign name="home" size={dimension.width * 0.08} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: dimension.width * 0.08,
            height: "100%",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("Ticket");
          }}
        >
          <Foundation
            name="ticket"
            size={dimension.width * 0.08}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: dimension.width * 0.08,
            height: "100%",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("GiftCard");
          }}
        >
          <MaterialCommunityIcons
            name="gift-outline"
            size={dimension.width * 0.08}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: dimension.width * 0.08,
            height: "100%",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("Setting");
          }}
        >
          <Ionicons
            name="ios-settings-outline"
            size={dimension.width * 0.08}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const InitialIcon = ({ initials }) => {
  return (
    <View
      style={{
        backgroundColor: "#FFE382",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        width: 50,
        height: 50,
      }}
    >
      <Text style={{ color: "black", fontSize: 20 }}>{initials}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    marginRight: 10,
  },
  fullName: {
    fontWeight: "bold",
  },
});
export default HomeScreen;
