import { FlatList } from "react-native-gesture-handler";
import styles from "../utils/styles";
import { Button, Text, TouchableOpacity, View, Image, Modal, TextInput } from "react-native";
import { useEffect, useState } from "react";
import Database from "../utils/Database";
import { useIsFocused } from "@react-navigation/native";
import Space from "../components/Space";


export default function MainScreen({ navigation, route }) {
  const userInfo = route.params;
  console.log(route.params);


  const [prompt, setPromt] = useState('')
  const [isModalVisible, setModalVisible] = useState(false);

  const isFocused = useIsFocused();  

  const [drawings, setDrawings] = useState(
    [
      //   { key: 1, title: "Drawing 1", path: "coming soon1" },
    ]
  );

  useEffect(() => {
    refreshDrawings()
  }, [])

  useEffect(()=>{
    refreshDrawings()
  }, [isFocused])


  const refreshDrawings = ()=>{
    Database.getDrawings((data) => {setDrawings(data) }) 
  }

  const startDrawing = (drawing)=>{
    navigation.navigate("Canvas", {...userInfo, drawing})
  }


  
  const handleNewPress = () => {

    if (prompt.length == 0) {
      alert('drawing name required!')
      return
    }
    const id = drawings ? drawings.length + 1 : 0;
    setModalVisible(false)
    const drawing = { key: id, title: prompt, path: "coming soon4" }
    console.log(drawing)
    startDrawing(drawing)
    //setDrawings(newDrawings);
  };


  const handleSignout = () => {
    Database.signout(() => {
      navigation.replace("Login");
    });
  };

  return (
    <View style={[styles.container, styles.secondaryBackground]}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>

        <View style={[styles.container, styles.absolute, styles.fullscreen, styles.center]}>
          <View style={[styles.modal, styles.card, styles.cardShadow, {height: 'auto'}]}>

            <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={[styles.button, { marginLeft: '90%' }]}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>❌</Text>
            </TouchableOpacity>

            <TextInput
              placeholder='New Drawing Name'
              style={styles.prompt}
              value={prompt}
              onChangeText={setPromt}
            />
            <View style={{ flexDirection: 'column', width: "95%", alignItems: 'center' }}>
              <Space/>
              <TouchableOpacity onPress={handleNewPress} style={[styles.menuButton, { marginTop: 5, width: '80%' }]}>
                <Text style={{ textAlign: 'center' }}>Start Drawing 🪄</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>


      </Modal>

      <View
        style={[
          styles.horizontal,
          styles.justifyCenter,
          styles.primaryTopbar,
        ]}
      >
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "lightgreen" }]}
          onPress={() => {
            setPromt('')
            setModalVisible(true)
            //Database.deleteDrawings(); alert('deleted'); 
          }}
        >
          <Text style={{ fontSize: 20 }}>➕</Text>
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require("../assets/genDrawLogo.png")}
        />
        <TouchableOpacity
          style={[
            styles.center,
            styles.menuButton,
            { backgroundColor: "lightpink" },
          ]}
          onPress={() => {
            handleSignout();
          }}
        >
          <Text style={[styles.center, { fontSize: 15, fontWeight: "bold" }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        //keyExtractor={(item) => item.key.toString()}
        data={drawings}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              styles.horizontal,
              styles.verticalCenter
            ]}
            onPress={()=>{startDrawing(item)}}
          >
            {/* Image on the left */}
            <View style={{
              width: 80,
              height: 80,
              marginRight: 10,
              borderWidth: 2,
              borderColor: "black",
              borderRadius: 10,
            }}>
              <Image
                style={[styles.fullscreen, styles.absolute]}
                source={{ uri: item.drawingImage }}
              />
              {
                item.sketchImage ?
                  <Image
                    style={[styles.fullscreen, styles.absolute]}
                    source={{ uri: item.sketchImage }}
                  /> :
                  ''
              }
            </View>
            <View>
              <Text style={{ color: "black", fontSize: 18 }}>{item.title}</Text>
              <Text style={{ color: "gray", fontSize: 14 }}>{item.path}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
