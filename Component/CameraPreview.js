import { AntDesign, Entypo, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { View,ImageBackground,TouchableOpacity,Text, ActivityIndicator } from "react-native"

const CameraPreview = ({photo,handleFlip,setFlip,retakePicture,fliping,select,saving,handleSave}) => {


return (
    <View
    style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
    }}
    >
    <ImageBackground
        source={{uri: photo && photo?.uri}}
        resizeMode="contain"
        style={{
        flex: 1,
        backgroundColor:"#000"
        }}
    >
        <View
        style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height:70,
            paddingTop:5
        }}
        >
        <View
            style={{
            justifyContent:"space-between",
            alignItems:"center",
            width:"100%",
            paddingHorizontal:15,
            backgroundColor:"#000",
            flexDirection:"row",
            marginBottom:25
            }}
        >
            <TouchableOpacity
            onPress={ async ()=>{
                setFlip("vertical")
                await handleFlip(1)
            }}
            style={{
                padding:5,
                justifyContent:"center",
                alignItems: 'center',
                borderRadius: 4
            }}
            >
               {
                (fliping && select == 1) ? <ActivityIndicator size={15} color="#fff"/>  : <MaterialCommunityIcons name="flip-vertical" size={24} color="#fff" />
               }
            </TouchableOpacity>
            <TouchableOpacity
            onPress={async ()=>{
                setFlip("horizontal")
                await handleFlip(2)
            }}
            style={{
                padding:5,
                justifyContent:"center",
                alignItems: 'center',
                borderRadius: 4
            }}
            >
               {
                (fliping && select == 2) ? <ActivityIndicator size={15} color="#fff"/>  : <MaterialIcons name="flip" size={24} color="#fff" />
               }
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{
                handleSave()
            }}
            style={{
                padding:5,
                justifyContent:"center",
                alignItems: 'center',
                borderRadius: 4
            }}
            >
                {
                    saving ? <ActivityIndicator size={15} color="#fff"/>  : <Entypo name="save" size={30} color="#fff" />
                }
            </TouchableOpacity>
            <TouchableOpacity
            onPress={retakePicture}
            style={{
                padding:5,
                justifyContent:"center",
                alignItems: 'center',
                borderRadius: 4
            }}
            >
                <AntDesign name="back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
        </View>
    </ImageBackground>
    </View>
)
}

export default CameraPreview