import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const frames = [
  { id: '1', source: require('../../assets/frames/frame1.png') },
  { id: '2', source: require('../../assets/frames/frame2.png') },
  { id: '3', source: require('../../assets/frames/frame3.png') },
  { id: '4', source: require('../../assets/frames/frame4.png') },
];

const FrameSelectionScreen = () => {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const router = useRouter();

  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame);
    router.push({
      pathname: '/Components/CameraScreen',
      params: { frame: JSON.stringify(frame) },
    });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Asset 10.png')} style={styles.backgroundImage} />
      
      <FlatList
        data={frames}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.frameList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          
          <TouchableOpacity
            style={[styles.frameContainer, selectedFrame?.id === item.id && styles.selectedFrame]}
            onPress={() => handleFrameSelect(item)}
          >
            <Image source={item.source} style={styles.frameImage} />
          </TouchableOpacity>
        )}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' },

  backgroundImage: { 
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' },

  frameList: { 
    paddingHorizontal: 20, 
    alignItems: 'center' },

  frameContainer: { 
    marginHorizontal: 10, 
    borderWidth: 2, 
    borderColor: 'transparent', 
    borderRadius: 10, 
    overflow: 'hidden' },

  selectedFrame: { 
    borderColor: '#FFD700' 
  },

  frameImage: { 
    width: 150, 
    height: 250, 
    resizeMode: 'contain' },
});

export default FrameSelectionScreen;


// import React, { useState } from 'react';
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   ImageBackground,
//   Dimensions
// } from 'react-native';
// import { useRouter } from 'expo-router';

// const frames = [
//   { id: '1', source: require('../../assets/frames/frame1.png') },
//   { id: '2', source: require('../../assets/frames/frame2.png') },
//   { id: '3', source: require('../../assets/frames/frame3.png') },
//   { id: '4', source: require('../../assets/frames/frame4.png') },
// ];

// const FrameSelectionScreen = () => {
//   const [selectedFrame, setSelectedFrame] = useState(null);
//   const router = useRouter();

//   const handleSubmit = () => {
//     if (selectedFrame) {
//       router.push({
//         pathname: '/Components/CameraScreen',
//         params: { frame: JSON.stringify(selectedFrame) },
//       });
//     }
//   };

//   const handleHome = () => {
//     router.push('/');
//   };

//   return (
//     <ImageBackground
//       source={require('../../assets/images/Asset 10.png')}
//       style={styles.background}
//     >
//       {/* Frame Background Box */}
//       <ImageBackground
//         source={require('../../assets/images/Asset 7.png')}
//         style={styles.frameBox}
//         imageStyle={{ resizeMode: 'contain' }}
//       >
//         <FlatList
//           data={frames}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           scrollEnabled={false}
//           contentContainerStyle={styles.frameList}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[
//                 styles.frameContainer,
//                 selectedFrame?.id === item.id && styles.selectedFrame,
//               ]}
//               onPress={() => setSelectedFrame(item)}
//             >
//               <Image source={item.source} style={styles.frameImage} />
//             </TouchableOpacity>
//           )}
//         />
//       </ImageBackground>

//       {/* Submit Button */}
//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Image source={require('../../assets/images/Asset 8.png')} style={styles.submitImage} />
//       </TouchableOpacity>

//       {/* Home Button */}
//       <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
//         <Image source={require('../../assets/images/Asset 9.png')} style={styles.homeImage} />
//       </TouchableOpacity>
//     </ImageBackground>
//   );
// };

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     resizeMode: 'cover',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//   },
//   frameBox: {
//     width: '100%',
//     aspectRatio: 3 / 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//     marginBottom: 30,
//   },
//   frameList: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   frameContainer: {
//     width: width / 3,
//     height: 180,
//     margin: 10,
//     marginTop: 35,
//     borderWidth: 2,
//     borderColor: 'transparent',
//     borderRadius: 10,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedFrame: {
//     borderColor: '#FFD700',
//   },
//   frameImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   submitButton: {
//     marginBottom: 20,
//   },
//   submitImage: {
//     width: 120,
//     height: 50,
//     resizeMode: 'contain',
//   },
//   homeButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//   },
//   homeImage: {
//     width: 50,
//     height: 50,
//     resizeMode: 'contain',
//   },
// });

// export default FrameSelectionScreen;
