import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import { Audio } from 'expo-av'

const colors = [ "#FFFFA2", "#A2D9CE", "#D7BDE2" ]

const optionsTimes = {
  0: 25,
  1: 5,
  2: 15,
};

export default function App() {
  
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "LONG");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if(isActive) {
      //run timer
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000)
    } else {
      // clear interval
      clearInterval(interval);
    }

    if(time === 0){
      setIsActive(false);
      setIsWorking((prev) => !prev);
      setTime(optionsTimes[currentTime] * 60);

      playSound()
    }

    return () => clearInterval(interval)
  }, [isActive, time]);

  useEffect(() => {
    setIsActive(false);
  }, [currentTime]);

  function handleStartStop(){
    playSound()
    setIsActive(!isActive);
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/click.wav")
    )
    await sound.playAsync()
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors[currentTime]}]}>
      <View 
        style={{
          flex: 1,
          paddingHorizontal: 15, 
          paddingTop: Platform.OS === "android" && 30,

        }}
      >
        <Text style={styles.text}>Pomodoro</Text>
        
          <Header 
            setTime={setTime} 
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
          />

        <Timer time={time} />
          <TouchableOpacity
            onPress={handleStartStop}
            style={styles.button}
          >
            <Text 
              style={{ color: "white", fontWeight:"bold"}}
            >
              { isActive ? "STOP" : "START"}
            </Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 32, 
    fontWeight: 'bold'
  },
  button: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,
    borderRadius: 15
  }
});