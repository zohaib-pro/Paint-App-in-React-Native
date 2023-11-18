import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, View, Dimensions, Image, Button, TouchableOpacity, Text } from 'react-native';
import Canvas from 'react-native-canvas';
import ColorPicker from 'react-native-wheel-color-picker';

//Custom Components
import styles from './utils/styles';
import ColorIndicator from './components/ColorIndicator';
import Stack from './utils/Stack';
import Slider from '@react-native-community/slider';
import Space from './components/Space';

// Import the SideMenu
import SideMenu from './SideMenu';

export default function CanvasRender({ navigation }) {
  const viewRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [strokeSize, setStrokeSize] = useState(3);
  const [color, setColor] = useState('#ff0000');
  const [isShowColorPicker, setShowColorPicker] = useState(false);

  // Get screen dimensions
  const { width, height } = Dimensions.get('window');

  const onColorChange = color => {
    setColor(color);
  };


  const undoStack = useRef(new Stack());
  const redoStack = useRef(new Stack());
  var path = [];  // always have the latest path

  const handleUndo = () => {
    if (undoStack.current.size() > 0) {
      console.log("before undo: " + undoStack.current.getItems().length);
      const lastAction = undoStack.current.pop();
      console.log("after undo: " + undoStack.current.getItems().length);
      // Push the undone action to the redo stack
      redoStack.current.push(lastAction);

      // Clear the canvas and redraw the remaining actions
      clearCanvas();
      redrawFromStack(undoStack);
    }
  };

  const handleRedo = () => {
    if (redoStack.current.size() > 0) {
      const redoAction = redoStack.current.pop();
      // Push the redone action back to the undo stack
      undoStack.current.push(redoAction);

      // Clear the canvas and redraw the actions
      clearCanvas();
      redrawFromStack(undoStack);
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, width, height);
    }
  };

  const redrawFromStack = (stack) => {

    const paths = stack.current.getItems();

    stack.current.getItems().forEach((action) => {
      const {path, color, strokeSize} = action;
      for (let i = 0; i < path.length-1; i++) {
        p1 = path[i];
        p2 = path[i+1];
        drawLineOnCanvas({x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color, strokeSize});
      }
    });
  };

  const handleTouchStart = (event) => {
    isDrawingRef.current = true;
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;
    //console.log(`Touched at coordinates X: ${x}, Y: ${y}`);
    const p = {x,y};
    path = [];  //start a new path when new touch start detected
    path.push(p);
  };

  const handleTouchMove = (event) => {
    if (!isDrawingRef.current) return;
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;

    //console.log(`Touched at coordinates X: ${x}, Y: ${y}`);

    const p1 = path[path.length-1];
    const p2 = { x, y };
    drawLineOnCanvas({x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color, strokeSize});
    path.push(p2);
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    undoStack.current.push({path, color, strokeSize});
  };

  const drawLineOnCanvas = (line) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.strokeSize;
      ctx.stroke();
      ctx.closePath();
    }
  };
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }

  }, [width, height]);

  return (
    <SafeAreaView style={styles.container}>

      <View
        ref={viewRef}
        style={{ width: '100%', height: '100%' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* <Image
          source={require('./car_sketch.jpg')} // Replace with your image file path
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        /> */}
        <Canvas
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent', position: 'absolute' }}
          ref={canvasRef}
        />


       <SideMenu navigation={navigation}/> 
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
      <View style={[styles.container, styles.absolute, styles.fullscreen, styles.flexEnd]}>
        <View style={[styles.center, styles.center, styles.horizontal, { height: 50, backgroundColor: '#D3D3D3' }]}>
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


