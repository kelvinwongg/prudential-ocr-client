import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Camera } from 'expo-camera';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>hello world!!!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [displayButton, setDisplayButton] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const camera = React.createRef()

  function onPressHandler() {
    camera.current.takePictureAsync()
    .then(photo => {
      // console.log(photo)
      const formData = new FormData();
      formData.append('file', {
        name: 'CameraCapture',
        uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
      });
      console.log(formData)
      fetch('http://35.235.86.228/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(json => { console.log(json); alert(json.result); })
    })
    .catch(err => console.log(err))
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={camera}
        style={{ flex: 1 }} type={type}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 40, display: (displayButton) ? 'block' : 'none' }}>
          <Button
            onPress={onPressHandler}
            title="Submit Button"
          />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#777',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
