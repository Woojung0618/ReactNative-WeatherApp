import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import moment from "moment";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "334a9c6632ee54de48fd064f99b0a0ec";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Snow: "snowflake-4",
  Drizzle: "day-rain",
  Thunderstorm: "ligntenings",
  Atmosphere: "cloudy-gusts",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.title}>이번주 날씨를 알아봅시다!</Text>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View style={{...styles.day, alignItems: 'center'}} key={index}>
              <Text style={styles.date}>
                {moment.unix(day.dt).format("MM/DD")}
              </Text>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
                <MaterialCommunityIcons name="temperature-celsius" size={50} color="black" />
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                }}
              >
                <Text style={styles.desc}>{day.weather[0].main}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={40} color="black" />
              </View>
              <Text style={styles.description}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    
  },
  city: {
    flex: 0.5,
    backgroundColor: "#6495ED",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 36,
    fontWeight: "600",
    marginTop: 30,
  },
  day: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0FFFF",
    marginTop: -100,
  },
  date: {
    fontSize: 50,
  },
  temp: {
    fontSize: 96,
  },
  desc: {
    fontSize: 40,
    paddingRight: 10,
  },
  description: {
    fontSize: 20,
  },
});
