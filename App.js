import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Camera } from 'expo-camera';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import * as AWS from 'aws-sdk';
import sendThroughSendGrid from './src/SendMail'

const ID = 'AKIAQJQBNKSSQAQNWLVJ';
const SECRET = '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';

// The name of the bucket that you have created
const BUCKET_NAME = 'noww';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

var isPreview = false;
var cameraRef = null;

export default function App() {
  cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    onHandlePermission();
  }, []);

  const onHandlePermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType(prevCameraType =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {isPreview && (
        <TouchableOpacity
          onPress={cancelPreview}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <AntDesign name='close' size={56} color='#fff' />
        </TouchableOpacity>
      )}
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        onCameraReady={onCameraReady}
        useCamera2Api={true}
      />
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
          <MaterialIcons name='flip-camera-ios' size={56} color='brown' />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          disabled={!isCameraReady}
          onPress={onSnap}
          style={styles.capture}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  text: {
    color: '#fff'
  },
  bottomButtonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  capture: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: CAPTURE_SIZE,
    width: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    marginBottom: 28,
    marginHorizontal: 30
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5A45FF',
    opacity: 0.65
  }
});

const cancelPreview = async () => {
  await cameraRef.current.resumePreview();
  isPreview = false;
};

const onSnap = async () => {
  if (cameraRef.current) {
    const options = { quality: 0.7, base64: false };
    const data = await cameraRef.current.takePictureAsync(options);
    const source = data.uri.replace('data:image/png;base64,',"");
    //const source = data.base64;
    alert(source);
    if (source) {
      await cameraRef.current.pausePreview();
      isPreview = true;

      await uploadFile(source);
    }
  }
};

const uploadFile = (stream) => {
  // Read content from the file
  const fileContent = stream;

  // Setting up S3 upload parameters


  var s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: "us-west-1"
  }),
    params = {
      Bucket: BUCKET_NAME,
      ContentType: 'image/jpeg',
      Key: 'webcamsnap.jpg', // File name you want to save as in S3
      Body: fileContent
    };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      cancelPreview();
      // alert(err.code);
      throw err;
    } else {
      var msg = `File uploaded successfully. ${data.Location}`;
      alert(msg);
      console.log(msg);
      cancelPreview();
    }
  });
};