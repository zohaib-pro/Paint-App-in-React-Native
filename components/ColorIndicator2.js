import { useEffect, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import Canvas from 'react-native-canvas';

const ColorIndicator = ({color, shape="circle", size=50, onPress}) => {
    const canvasRef = useRef(null);

    function createCircle(x, y, r, c) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, x, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = c;
        ctx.fill();
    }
    useEffect(()=>{
        if (canvasRef.current) {
            const x = size/2;
            const y = size/2;
            createCircle(x, y, size/4, 'black');
            createCircle(x, y, size/5, 'blue');
        }
    },[canvasRef]);

    return (
        <SafeAreaView style={{ width: size, height: size }}>
            <Canvas
                style={{ width: "100%", height: "100%" }}
                ref={canvasRef}
            />
        </SafeAreaView>
    );
}

export default ColorIndicator;