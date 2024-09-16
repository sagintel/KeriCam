import * as React from 'react'
import {ActivityIndicator,View,Text,TouchableOpacity,Dimensions, StyleSheet, StatusBar, ToastAndroid} from 'react-native'
import {useCameraPermissions,useMicrophonePermissions,CameraView} from "expo-camera"
import { AntDesign, Entypo, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import CameraPreview from './CameraPreview';
import * as ImagePicker from 'expo-image-picker'
import Slider from '@react-native-community/slider';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';



const CamView = ()=>{

const [cameraMode, setCameraMode] = React.useState('picture');
const [previewVisible, setPreviewVisible] = React.useState(false)
const [capturedImage, setCapturedImage] = React.useState(null)
const [cameraType, setCameraType] = React.useState("back")
const [isPicture, setIsPicture] = React.useState(true)
const [zoomValue, setZoomValue] = React.useState(0)
const [isMuted, setIsMuted] = React.useState(false)
const [flashMode, setFlashMode] = React.useState('auto')
const [quality, setQuality] = React.useState('1080p')
const [isVideo, setIsVideo] = React.useState(false)
const [ratio, setRatio] = React.useState('1:1')
const [selected, setSelected] = React.useState(1)
const [flip, setFlip] = React.useState('vertical')
const [isRecording, setIsRecording] = React.useState(false)
const [fliping, setFliping] = React.useState(false)
const [saving, setSaving] = React.useState(false)
const camRef = React.useRef()
const [permission, requestPermission] = useCameraPermissions();

const handlePicture = async () => {
	try {

		const photo = await camRef?.current?.takePictureAsync()

		setPreviewVisible(true)
		setCapturedImage(photo)
	} catch (error) {
		console.log
	}
}

const handleRecord = async () => {
	try {
		ToastAndroid.show("video recoding",2000)
		setIsRecording(true)
		const video = await camRef?.current?.recordAsync({
			maxFileSize:50000
		})

	} catch (error) {
		console.log
	}
}

const stopRecord =() => { 
	try {
		if (camRef?.current && isRecording) {
			camRef?.current?.stopRecording()

			setIsRecording(false)
			ToastAndroid.show("video recorded",2000)
		}

	} catch (error) {
		console.log
	}
}

const handleRatio = async () => {
	try {
		if (isRecording) {
			ToastAndroid.show("you can not change ration while recording",2000)
		} else {
			if (ratio === '1:1') {
				setRatio('4:3')
				ToastAndroid.show("ration changed to 4:3",2000)
			} else if (ratio === '4:3') {
				setRatio('16:9')
				ToastAndroid.show("ration changed to 16:9",2000)
			} else if(ratio === '16:9') {
				setRatio('1:1')
				ToastAndroid.show("ration changed to 1:1",2000)
			}
		}
	} catch (error) {
		console.log
	}
}

const handleQuality = async () => {
	try {
		if (isRecording) {
			ToastAndroid.show("you can not change quality while recording",2000)
		} else {
			if (quality === '1080p') {
				setQuality('720p')
				ToastAndroid.show("ration changed to 720p",2000)
			} else if (quality === '720p') {
				setQuality('480p')
				ToastAndroid.show("ration changed to 480p",2000)
			} else if(quality === '480p') {
				setQuality('2160p')
				ToastAndroid.show("ration changed to 2160p",2000)
			}else if(quality === '2160p') {
				setQuality('1080p')
				ToastAndroid.show("ration changed to 1080p",2000)
			}
		}
	} catch (error) {
		console.log
	}
}

const retakePicture = async () => {
	if(camRef?.current){
		camRef?.current.resumePreview()
		setCapturedImage(null)
		setPreviewVisible(false)
	}else{
		setCapturedImage(null)
		setPreviewVisible(false)
	}
}
const handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('auto')
    } else if(flashMode === 'auto') {
      setFlashMode('on')
    }
}
const switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
}

const switchMode = (mode) => {
	if (isRecording) {
		ToastAndroid.show("you can not switch mode while recording !",2000)
	} else {
		if (mode !== 'picture') {
			setCameraMode('video')
			setIsVideo(true)
			setIsPicture(false)
		  } else {
			setCameraMode('picture')
			setIsVideo(false)
			setIsPicture(true)
			setQuality("2160p")
		  }
	}
}

async function flipImage (select){
    try{
		if (!capturedImage) {
			ToastAndroid.show("you can not flip an image that do not exists !",2000)
		} else {
			setFliping(true)
			setSelected(select)
			const manipResult = await manipulateAsync(
				capturedImage?.uri,
				[{ flip: flip === "vertical" ?  FlipType.Horizontal : FlipType.Vertical }],
				{ compress: 1, format: SaveFormat.PNG }
			  );

			  setCapturedImage(manipResult);
			  setFliping(false)
		}
    }catch(err){
        console.log(err)
    }
}

async function handlePictureSave(){
    try{
		if (!capturedImage) {
			ToastAndroid.show("you can not flip an image that do not exists !",2000)
		} else {
			setSaving(true)

			const directoryName = 'keriCam';
			const directoryPath = `${FileSystem.documentDirectory}${directoryName}/`;
			const getDir = await FileSystem.readDirectoryAsync(directoryPath)

			if (getDir) {
				
				const filename = `${Date.now()}.png`;
				const localUri = `${FileSystem.documentDirectory}${directoryName}/${filename}`;
				
				await FileSystem.moveAsync({
					from: capturedImage?.uri,
					to: localUri,
				});	
				
				console.log("picture saved")
				ToastAndroid.show("picture saved!",2000)

			} else {
				const createDir = await FileSystem.makeDirectoryAsync(directoryPath, { exists: true });
				if (createDir) {
					
					const filename = `${Date.now()}.png`;
					const localUri = `${FileSystem.documentDirectory}${directoryName}/${filename}`;
					
					await FileSystem.moveAsync({
						from: capturedImage?.uri,
						to: localUri,
					});	
					
					console.log("picture saved")
					ToastAndroid.show("picture saved!",2000)

				}				
			}

			ToastAndroid.show("picture saved !",2000)
			setCapturedImage(null);
			setPreviewVisible(false)
			setSaving(false)
		}
    }catch(err){
        console.log(err)
    }
}

async function galleryImage (){
    try{
		if (isRecording) {
			ToastAndroid.show("you can not select an image while recording !",2000)
		} else {
			let result = await ImagePicker.launchImageLibraryAsync({
				quality:1,
				mediaTypes:ImagePicker.MediaTypeOptions.All
			})
		
			if (!result?.canceled) {
		
				setCapturedImage(result.assets[0])
				setPreviewVisible(true)
			
			}
		}
    }catch(err){
        console.log(err)
    }
}

React.useEffect(()=>{
(
	async ()=>{
		try {
			if (!permission?.granted) {
				requestPermission()
			}
		} catch (error) {
			console.log(error)
		}
	}
)()
},[])

if (previewVisible && capturedImage ) {
	return(
		<CameraPreview saving={saving} handleSave={handlePictureSave} select={selected} fliping={fliping} setFlip={setFlip} handleFlip={flipImage} photo={capturedImage} retakePicture={retakePicture} />
	)
} else {
	return (
		<>
			<StatusBar hidden barStyle="dark-content"/>
			<View style={{width:Dimensions.get("window").width,height:50,backgroundColor:"#000",flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:20}}>
				{
					flashMode === "on" ? <TouchableOpacity onPress={handleFlashMode}><Entypo name="flash" size={24} color="#fff" /></TouchableOpacity> : flashMode === "off"  ? <TouchableOpacity onPress={handleFlashMode}><Ionicons name="flash-off" size={24} color="#fff" /></TouchableOpacity> : <TouchableOpacity onPress={handleFlashMode}><Text style={{color:"#fff"}}>auto</Text></TouchableOpacity>
				}
				{
					cameraMode !== "picture" && ( 
						<TouchableOpacity
							onPress={()=>{
								ToastAndroid.show("mute setting has been updated",2000)
								setIsMuted((prev)=>!prev)
							}}
						>
							{
								isMuted ?
									<MaterialIcons name="volume-mute" size={24} color="#fff" />
								:
									<MaterialCommunityIcons name="volume-mute" size={24} color="#fff" />
							}
						</TouchableOpacity>
					)
				}
				<TouchableOpacity onPress={handleRatio}>
					<MaterialIcons name="aspect-ratio" size={24} color="#fff" />
				</TouchableOpacity>
			</View>
			<CameraView videoQuality={quality} mute={isMuted} focusable={true} ref={camRef} zoom={zoomValue} mode={cameraMode} ratio={ratio} flash={flashMode} style={styles.camera} facing={cameraType}>
			</CameraView>
			<View style={{width:Dimensions.get("window").width,height:150,backgroundColor:"#000",justifyContent:"center",alignItems:"center"}}>
				<View style={{width:"100%",justifyContent:"center",alignItems:"center"}}>
					<View style={{justifyContent:cameraMode !== "video" ? "flex-start" : "space-between",alignItems:"center",width:"100%",height:50,flexDirection:"row"}}>
						<View style={{width:"70%",flexDirection:"row"}}>
							<TouchableOpacity onPress={()=>{
								switchMode("picture")
							}} style={{marginHorizontal:10,marginLeft:20}}>
								<Text style={{color:isPicture ? "gold" : "#fff",fontSize:12}}>
									Photo
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>{
								switchMode("video")
							}} style={{marginHorizontal:10}}>
								<Text style={{color:isVideo ? "gold" : "#fff",fontSize:12}}>
									Video
								</Text>
							</TouchableOpacity>
						</View>
						
						{
							cameraMode !== "picture" && (
								<TouchableOpacity onPress={handleQuality} style={{marginHorizontal:10}}>
									<Text style={{color:isVideo ? "gold" : "#fff",fontSize:12}}>
										Quality : {quality}
									</Text>
								</TouchableOpacity>
							)
						}
					</View>	
					<View style={{justifyContent:"center",alignItems:"center",width:"100%"}}>
						<TouchableOpacity onPress={()=>{
							galleryImage()
						}}>
							<AntDesign name="picture" size={24} color="#fff" />
						</TouchableOpacity>
					</View>				
				</View>
				<View style={{width:Dimensions.get("window").width,height:100,backgroundColor:"#000",flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:10}}>
					<View style={{width:"15%",height:"70%",justifyContent:"center",alignItems:"flex-start"}}>
						<Slider
							style={{width: 100, height: 40}}
							minimumValue={0}
							maximumValue={1}
							onValueChange={(value)=>{
								setZoomValue(value)
							}}
							value={zoomValue}
							minimumTrackTintColor="#FFFFFF"
							maximumTrackTintColor="#FFFFFF"
						/>
					</View>
					<View style={{height:"70%",justifyContent:"center",alignItems:"center"}}>
						<TouchableOpacity onPress={cameraMode === "picture" ? handlePicture : (cameraMode !== "picture" && isRecording ) ? stopRecord : (cameraMode !== "picture" && !isRecording ) ? handleRecord : null} style={{width:50,height:50,borderRadius:45}}>
							<View style={{backgroundColor:isRecording ? "red" : "#fff",width:"100%",height:"100%",borderRadius:45,padding:5}}>

							</View>
						</TouchableOpacity>
					</View>
					<View style={{height:"70%",justifyContent:"center",alignItems:"center"}}>
						<TouchableOpacity onPress={switchCamera} style={{width:50,height:50,borderRadius:45,marginTop:20}}>
							<FontAwesome6 name="camera-rotate" size={24} color="#fff" />	
						</TouchableOpacity>
					</View>					
				</View>
			</View>
		</>
	)
}



}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: 'center',
	},
	message: {
	  textAlign: 'center',
	  paddingBottom: 10,
	},
	camera: {
	  height:Dimensions.get("window").height-200,
	  width:Dimensions.get("window").width
	},
	buttonContainer: {
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: 'transparent',
	  margin: 64,
	},
	button: {
	  flex: 1,
	  alignSelf: 'flex-end',
	  alignItems: 'center',
	},
	text: {
	  fontSize: 24,
	  fontWeight: 'bold',
	  color: 'white',
	},
  });

export default CamView