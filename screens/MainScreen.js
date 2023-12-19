import { FlatList } from "react-native-gesture-handler";
import styles from "../utils/styles";
import { Text, TouchableOpacity, View, Image, Modal, TextInput } from "react-native";
import { useEffect, useState } from "react";
import Database from "../utils/Database";
import { useIsFocused } from "@react-navigation/native";
import Space from "../components/Space";
import { DateHandler } from "../utils/DateHandler";
import SideMenu from '../components/SideMenu';
import Button from "../components/Button";
import ProgressDialog from "../components/ProgressDialog";

export default function MainScreen({ navigation, route }) {
  const userInfo = route.params;
  


  const [prompt, setPromt] = useState('')
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('')

  const isFocused = useIsFocused();

  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    refreshDrawings()
  }, [])

  useEffect(() => {
    refreshDrawings()
  }, [isFocused])


  const refreshDrawings = () => {
    Database.getDrawings((data) => { setDrawings(data) })
  }

  const startDrawing = (drawing) => {
    //console.log(drawing)
    navigation.navigate("Canvas", { ...userInfo, drawing })
  }

  const handleNewPress = () => {

    if (prompt.length == 0) {
      alert('drawing name required!')
      return
    }
    const id = drawings ? drawings.length + 1 : 0;
    setModalVisible(false)
    const drawing = { key: id, title: prompt, path: "coming soon4" }
    //console.log(drawing)
    startDrawing(drawing)
    //setDrawings(newDrawings);
  };


  const handleDelete =  async(idListToDelete)=> {
    await Database.deleteDrawings(idListToDelete); 
    refreshDrawings()
  }

  const handleSignout = async () => {
    // delete drawings from local storage
    // these will be fetched next time when user logs in
    
    Database.signout(() => {
      Database.deleteDrawings()
      navigation.replace("Login");
    });
  };


  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const handleLongPress = (itemId) => {
    setSelectedItemIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(itemId)) {
        // If already selected, remove from the array
        return prevSelectedIds.filter((id) => id !== itemId);
      } else {
        // If not selected, add to the array
        return [...prevSelectedIds, itemId];
      }
    });
  };


  const handleBackup = async () =>{
    setLoadingMsg('Creating Online Backup...')
    await Database.backup(drawings)
    setLoadingMsg('');
  }

  return (
    <View style={[styles.container, styles.secondaryBackground]}>
      
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>

        <View style={[styles.container, styles.absolute, styles.fullscreen, styles.center]}>
          <View style={[styles.modal, styles.card, styles.cardShadow, { height: 'auto' }]}>

            <TouchableOpacity onPress={() => { setModalVisible(false) }} style={[styles.button, { marginLeft: '90%' }]}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>❌</Text>
            </TouchableOpacity>

            <TextInput
              placeholder='New Drawing Name'
              style={styles.prompt}
              value={prompt}
              onChangeText={setPromt}
            />
            <View style={{ flexDirection: 'column', width: "95%", alignItems: 'center' }}>
              <Space />
              <TouchableOpacity onPress={handleNewPress} style={[styles.menuButton, { marginTop: 5, width: '80%' }]}>
                <Text style={{ textAlign: 'center' }}>Start Drawing 🪄</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>


      </Modal>

      {
        drawings.length == 0 ?
          <View style={[styles.container, styles.center]}>
            <Text style={{ color: 'grey' }}>No Drawings Yet!</Text>
            <Text style={{ color: 'grey' }}>Click '➕' icon to create new drawing</Text>
          </View>
          :
          <View  style={[{ marginTop: 100 }, styles.container]}>
            <FlatList
              style={{flex: 1}}
              keyExtractor={(item) => item.title}
              data={drawings}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.card,
                    styles.horizontal,
                    styles.verticalCenter,
                    { marginLeft: 20, marginRight: 20 },
                    selectedItemIds.includes(item.title) ? styles.cardSelected : {}
                  ]}
                  onPress={() => { selectedItemIds.length == 0? startDrawing(item): handleLongPress(item.title) }}
                  onLongPress={() => { handleLongPress(item.title) }}
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
                    <Text style={{ color: "gray", fontSize: 14 }}>{new DateHandler(item.datetime).getFormatedDateTime()}</Text>
                  </View>

                </TouchableOpacity>
              )}
            />
            {
              selectedItemIds.length != 0? 
              <View style={[styles.horizontal, styles.justifyCenter, {padding: 20}]}>
              <Button 
                style={{backgroundColor: 'lightpink'}}
                title="delete"
                onPress={()=>{handleDelete(selectedItemIds)}}
              />
              <Button 
                title="cancel"
                onPress={()=>{setSelectedItemIds([])}}
              />
            </View>
            : 
            ''
            }
          </View>
      }

      <View style={[styles.container, styles.fullscreen, styles.absolute]}>
        <View
          style={[
            styles.horizontal,
            styles.justifyCenter,
            styles.primaryTopbar,
          ]}
        >
          <SideMenu
            style={[styles.menuButton]}
            navigation={navigation}
            username={userInfo.name}
            btnList={[
              { text: 'Delete All', onPress: () => { handleDelete(drawings.map(item=>item.title)) } },
              { text: 'Backup', onPress: handleBackup },
              { text: 'Logout', onPress: () => { handleSignout() } },
            ]}
          />

          <Image
            style={styles.logo}
            source={require("../assets/genDrawLogo.png")}
          />
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
        </View>
      </View>
      {loadingMsg !='' && <ProgressDialog msg={loadingMsg}/>}
    </View>

  );
}
