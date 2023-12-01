import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, View, Dimensions, Image, Button, ActivityIndicator, TouchableOpacity, Text, Modal, TextInput } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import ColorPicker from 'react-native-wheel-color-picker';

//Custom Components
import styles from '../utils/styles';
import ColorIndicator from '../components/ColorIndicator';
import Stack from '../utils/Stack';
import Slider from '@react-native-community/slider';
import Space from '../components/Space';

// Import the SideMenu
import SideMenu from '../components/SideMenu';

// Import the Api
import ApiConnection from '../utils/ApiConnection';
import { Alert } from 'react-native';
import Database from '../utils/Database';
import { DateHandler } from '../utils/DateHandler';

export default function CanvasRender({ navigation, route}) {

  const {name, drawing } = route.params;


  const viewRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [strokeSize, setStrokeSize] = useState(3);
  const [isShowSketch, setShowSketch] = useState(false);
  const [color, setColor] = useState('#ff0000');
  const [isShowColorPicker, setShowColorPicker] = useState(false);
  var drawingAllowed = true;
  // Get screen dimensions
  const { width, height } = Dimensions.get('window');

  const onColorChange = color => {
    setColor(color);
  };

  const undoStackImg = useRef(new Stack());
  const redoStackImg = useRef(new Stack());
  var path = [];  // always have the latest path

  function printSizes() {
    console.log(undoStackImg.current.size(), redoStackImg.current.size());
  }
  const handleUndo = () => {
    if (undoStackImg.current.size() > 0) {
      const lastAction = undoStackImg.current.pop();
      // Push the undone action to the redo stack
      redoStackImg.current.push(lastAction);
      // Clear the canvas and redraw the remaining actions
      clearCanvas();
      //redrawFromStack(undoStackImg);'
      const state = undoStackImg.current.peek();
      if (state)
        redrawState(state);
      printSizes();
    }
  };

  const handleRedo = () => {
    if (redoStackImg.current.size() > 0) {
      const redoAction = redoStackImg.current.pop();
      // Push the redone action back to the undo stack
      undoStackImg.current.push(redoAction);

      // Clear the canvas and redraw the actions
      clearCanvas();
      //redrawFromStack(undoStack);
      redrawState(redoAction);
      printSizes();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, width, height + 100);
    }
  };

  const saveCanvas = async () => {
    const dataUrl = await canvasRef.current.toDataURL('image/png');
    undoStackImg.current.push(dataUrl);
  }

  const saveDrawing = async ()=>{
    const dateHandler = new DateHandler()
    //console.log('saving at: '+dateHandler.getFormatedDateTime())
    const drawingImage = undoStackImg.current.peek().replace(/"/g, '');
    drawing.drawingImage = drawingImage;
    drawing.datetime = dateHandler.getMillis()
    await Database.saveDrawing(drawing, image_url)
    alert('drawing saved');
  }

  const drawImage = (ctx, imgSrc) =>{
    const image = new CanvasImage(canvasRef.current);
    image.src = imgSrc
    image.addEventListener('load', () => {
      ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
    });
  }
  const redrawState = (state) => {
    console.log('redrawing form history')
    const ctx = canvasRef.current.getContext('2d');
    const imgSrc = state.replace(/"/g, ''); // the string contains quotes by default, therefore remove
    drawImage(ctx, imgSrc)
  }

  const handleTouchStart = (event) => {
    if (!drawingAllowed) return;
    isDrawingRef.current = true;
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;
    //console.log(`Touched at coordinates X: ${x}, Y: ${y}`);
    const p = { x, y };
    path = [];  //start a new path when new touch start detected
    path.push(p);
  };

  const handleTouchMove = (event) => {
    if (!isDrawingRef.current && !drawingAllowed) return;
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;

    //console.log(`Touched at coordinates X: ${x}, Y: ${y}`);

    const p1 = path[path.length - 1];
    const p2 = { x, y };
    if (p2.y < 50)
      return;
    drawLineOnCanvas({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color, strokeSize });
    path.push(p2);
  };

  const handleTouchEnd = () => {
    if (!drawingAllowed) return;
    isDrawingRef.current = false;
    //undoStack.current.push({path, color, strokeSize});
    saveCanvas();
  };

  const drawLineOnCanvas = (line) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.strokeSize;
      ctx.closePath();
      ctx.stroke();
    }
  };
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height + 100;
    }

  }, [width, height]);

  useEffect(()=>{
    if (drawing && drawing.drawingImage)
        drawImage(canvasRef.current.getContext('2d'), drawing.drawingImage)
  },[width])

  // ********* logic of Generating Image*******


  // some state 
  const [isModalVisible, setModalVisible] = useState(false); // for visibility of the Modal
  const [prompt, setPromt] = useState('') // for prompt
  const [geneImage, setGenImage] = useState('')
  const [apiImage, setApiImage] = useState('')
  const { loading, image_url, error, generate_images } = ApiConnection();

  // function to generate the image
  const genImage = () => {
    if (prompt == "") {
      Alert.alert("Prompt can not be Empty")
    } else {
      generate_images(prompt) // passing the prompt
      setPromt('')
    }

  }

  useEffect(() => {
    setApiImage(image_url);
  }, [image_url]);


  // function to move back
  const moveBack = () => {

    // const ctx = canvasRef.current.getContext('2d');
    // drawImage(ctx, image_url)
    setGenImage(image_url)
    setModalVisible(false)
    console.log('set \n', geneImage.length)
    setPromt('')
    setShowSketch(true)
    setApiImage('')
    alert('moveback called')
  }

  const cross = () => {
    setModalVisible(false);
    setApiImage('')
    setPromt('')
  }


  // ********* end of Generating Image Logic ******


  return (
    <SafeAreaView style={[styles.container]}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>

        <View style={[styles.container, styles.absolute, styles.fullscreen, styles.center]}>
          <View style={[styles.modal, styles.card, styles.cardShadow]}>

            <TouchableOpacity onPress={cross} style={[styles.button, { marginLeft: '90%' }]}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>❌</Text>
            </TouchableOpacity>

            <TextInput
              placeholder='Enter Prompt'
              style={styles.prompt}
              value={prompt}
              onChangeText={setPromt}
            />
            <View style={{ flexDirection: 'column', width: "95%", alignItems: 'center' }}>
              <TouchableOpacity onPress={genImage} style={[styles.menuButton, { marginTop: 5, width: '80%' }]}>
                <Text style={{ textAlign: 'center' }}>Generate Image🪄</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={apiImage ? moveBack : null}
                disabled={apiImage ? false : true}  // diabled the move to canvas when image is not generated
                style={[styles.menuButton, { marginTop: 5, width: '80%', backgroundColor: apiImage ? "lightblue" : '#c4d4e3' }]}>
                <Text style={{ textAlign: 'center' }}>Move Image to Canvas</Text>
              </TouchableOpacity>

            </View>
            {apiImage && <Image source={{ uri: apiImage }} style={{ width: "70%", height: '50%', marginTop: 10 }} />}
            {loading && <ActivityIndicator style={{ marginTop: 20, color: 'white' }} />}
            {error && <Text>Error: {error.message}</Text>}
          </View>
        </View>


      </Modal>


      <View
        ref={viewRef}
        style={styles.container}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {
          isShowSketch ? 
          <View style={[styles.container, styles.center]}>
            <Image
            source={{ uri: geneImage }} // Replace with your image file path
            style={styles.absCenter}
          />
          </View>
           : ''
        }
        <Canvas
          style={[styles.canvasDefault, { marginTop: 0 }]}
          ref={canvasRef}
        />

      </View>

      {
        // the following view will be used when you want to show something at top
      }
      <View style={[styles.container, styles.absolute, styles.fullscreen, styles.center]}>
        {
          isShowColorPicker ? (<View style={[styles.red, styles.card, { width: "80%", height: "70%" }]}>
            <ColorPicker
              color={color}
              onColorChange={(color) => onColorChange(color)}
              //onColorChangeComplete={color => alert(`Color selected: ${color}`)}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
            />
            <Space />
            <Button title='select'
              onPress={() => { setShowColorPicker(false) }}
            />
          </View>) : null
        }
      </View>

      <View style={[styles.container, styles.absolute, styles.fullscreen]}>
        <View style = {[styles.primaryTopbar, styles.center]}>
        <View style={[styles.center, styles.center, styles.horizontal]}>
          <SideMenu
            style={[styles.menuButton, {marginTop: 0, height: 'auto'}]}
            navigation={navigation}
            username={name}
            onOpen={() => { drawingAllowed = false }}
            onClose={() => { drawingAllowed = true }}
            btnList={[
              { text: 'save', onPress: () => { saveDrawing() } },
              { text: 'clear', onPress: () => { clearCanvas(); undoStackImg.current.clear(); redoStackImg.current.clear(); } },
              { text: 'AI Sketch', onPress: () => { setModalVisible(true) } }
            ]}
          />
          <View style={[styles.center]}>
            <Text style={{ color: 'black' }}>size: {strokeSize.toFixed(1)}</Text>
            <Slider
              style={{ width: 150, height: 30 }}
              minimumValue={1}
              maximumValue={10}
              onValueChange={(value) => { setStrokeSize(value) }}
              minimumTrackTintColor={color}
              maximumTrackTintColor="#000000"
              thumbTintColor={color}
              value={strokeSize}
            />
          </View>
          <TouchableOpacity onPress={() => { handleUndo() }}>
            <Text style={{ fontSize: 30, transform: [{ rotateZ: '180deg' },] }}>↪️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { handleRedo() }}>
            <Text style={{ fontSize: 30, transform: [{ rotateZ: '180deg' },] }}>↩️</Text>
          </TouchableOpacity>
          <ColorIndicator color={color}
            size={40}
            onPress={() => { setShowColorPicker(true); }}
          />
        </View>
        <View>
          <Text style={{color: 'white'}}>{drawing.title} 🖋</Text>
        </View>
        </View>
      </View>

    </SafeAreaView>
  );
}