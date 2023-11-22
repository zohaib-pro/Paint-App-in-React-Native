import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, View, Dimensions, Image, Button, TouchableOpacity, Text } from 'react-native';
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

export default function CanvasRender({ navigation, route }) {

  const {name} = route.params;

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


  const redrawState = (state) => {
    console.log('redrawing form history')
    const ctx = canvasRef.current.getContext('2d');
    const image = new CanvasImage(canvasRef.current);
    const imgSrc = state.replace(/"/g, ''); // the string contains quotes by default, therefore remove
    image.src = imgSrc
    image.addEventListener('load', () => {
      ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
    });
  }

  // const redrawFromStack = (stack) => {
  //   stack.current.getItems().forEach((action) => {
  //     const {path, color, strokeSize} = action;
  //     for (let i = 0; i < path.length-1; i++) {
  //       p1 = path[i];
  //       p2 = path[i+1];
  //       drawLineOnCanvas({x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color, strokeSize});
  //     }
  //   });    
  // };

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

    console.log(`Touched at coordinates X: ${x}, Y: ${y}`);

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

  return (
    <SafeAreaView style={[styles.container]}>

      <View
        ref={viewRef}
        style={styles.container}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {
          isShowSketch ? <Image
            source={require('../car_sketch.jpg')} // Replace with your image file path
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          /> : ''
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

      <View style={[styles.container, styles.absolute, styles.fullscreen, styles.topbarSpace]}>
        <View style={[styles.center, styles.center, styles.horizontal, { height: 50, backgroundColor: '#D3D3D3' }]}>
          <SideMenu
            navigation={navigation}
            username={name}
            onOpen={() => { drawingAllowed = false }}
            onClose={() => { drawingAllowed = true }}
            btnList={[
              { text: 'save', onPress: () => { saveCanvas() } },
              { text: 'clear', onPress: () => { clearCanvas(); undoStackImg.current.clear(); redoStackImg.current.clear(); } },
              { text: 'AI Sketch', onPress: () => { setShowSketch(!isShowSketch) } },
            ]}
          // onclear={()=>{clearCanvas();undoStack.current.clear()}}
          // onsave={()=>{
          //   saveCanvas();
          // }}
          />
          <View style={[styles.center]}>
            <Text style={{ color: 'grey' }}>size: {strokeSize.toFixed(1)}</Text>
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
      </View>

    </SafeAreaView>
  );
}