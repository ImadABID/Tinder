import React, {useState} from "react";
import { StyleSheet, Text, View, SafeAreaView, Image,Button,Platform,ScrollView} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import Demo from '../assets/data/demo.js';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

import * as ip_server from './server_ip';

async function log_out(){
    await SecureStore.deleteItemAsync('token');
}
const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
const ProfileScreen = ({ }) => {
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [passion, setPassion] = useState('');
    const [image, setImage] = useState(null);

    const at_start_up = async () => {
        
        let token = await SecureStore.getItemAsync('token');
        if (token) {
            
            let host_name = await ip_server.get_hostname();
            let link = 'http://'+host_name+'/users/profile';

            let data = 'token='+token;

            let myInit = {
                method: 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
                body: data
            };

            fetch(link, myInit)
            .then((res)=>{return res.json();})
            .then( res =>{
                setUsername(res.client.username);
                if(res.client.hasOwnProperty('age')){
                    setAge(res.client.age);
                }
                if(res.client.hasOwnProperty('description')){
                    setDescription(res.client.description);
                }
                if(res.client.hasOwnProperty('passion')){
                    setPassion(res.client.passion);
                }
            }).catch(err => {
                navigation.navigate('LoginScreen');
            });
            
        }else{
            navigation.navigate('LoginScreen');
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            at_start_up();
        })
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header/>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.titleBar}>
                    <Ionicons name="ios-arrow-back" size={24} color="#52575D"
                        onPress={() => navigation.goBack()}
                    ></Ionicons>

                </View>
                <View style={{ alignSelf: "center" }}>
                    <View style={styles.profileImage}>
                        <Image source={require("../assets/profile-pic.jpg")} style={styles.image} resizeMode="center"></Image>
                    </View>
                    <View style={styles.dm}>
                        <MaterialIcons name="chat" size={20} color="#DFD8C8" onPress={() => navigation.navigate('ChatScreen')} ></MaterialIcons>
                    </View>
                    <View style={styles.edit}>
                        <MaterialIcons name="build" size={20} color="#DFD8C8" onPress={() => navigation.navigate('EditProfile')}
                        ></MaterialIcons>
                    </View>
                    <View style={styles.add}>
                        <Ionicons name="ios-add" size={30} color="#DFD8C8" style={{ marginTop: 3, marginLeft: 2 }} onPress={pickImage} ></Ionicons>
                    </View>
                    <View style={styles.logout}>
                        <Ionicons
                            name="log-out-outline" size={30} color="#DFD8C8" style={{ marginTop: 3, marginLeft: 2 }}
                            onPress = {
                                ()=>{
                                    log_out();
                                    navigation.navigate('LoginScreen');
                                }
                            }
                        >

                        </Ionicons>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{username}</Text>
                </View>

                <View style={styles.statsContainer}>

                    <View style={[styles.statsBox]}>
                        <Text style={[styles.text, { fontSize: 24 }]}>Age</Text>
                        <Text style={[styles.text, styles.subText]}>22</Text>
                    </View>
                </View>

                <View style={{ marginTop: 32 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                        <View style={styles.mediaImageContainer}>
                        <Button title="Pick an image from camera roll" onPress={pickImage} />
                        {image && <Image source={{ uri: image }} style={styles.image}  />}
                            <Image source={require("../assets/media1.jpg")} style={styles.image} resizeMode="cover"></Image>
                        </View>
                        {Demo.map((item, index) => (
                            <View key={index} style={styles.mediaImageContainer}>
                                <Image source={item.image} style={styles.image} resizeMode="cover"></Image>
                            </View>
                        ))}
                    </ScrollView>

                </View>
                <Text style={[styles.subText, styles.recent]}>Description</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.recentItem}>
                        <View style={styles.activityIndicator}></View>
                        <View style={{ width: 250 }}>
                            <Text style={[styles.text, { color: "#41444B", fontWeight: "300" }]}>
                            Text <Text style={{ fontWeight: "400" }}>Text</Text> Text <Text style={{ fontWeight: "400" }}>Text</Text>
                            </Text>
                        </View>
                    </View>

                </View>
                <Text style={[styles.subText, styles.recent]}>Passion   </Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.recentItem}>
                        <View style={styles.activityIndicator}></View>
                        <View style={{ width: 250 }}>
                            <Text style={[styles.text, { color: "#41444B", fontWeight: "300" }]}>
                            Text <Text style={{ fontWeight: "400" }}>Text</Text> Text <Text style={{ fontWeight: "400" }}>Text</Text>
                            </Text>
                        </View>
                    </View>

                </View>
                <Text style={[styles.subText, styles.recent]}>Orientation</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.recentItem}>
                        <View style={styles.activityIndicator}></View>
                        <View style={{ width: 250 }}>
                            <Text style={[styles.text, { color: "#41444B", fontWeight: "300" }]}>
                            Text <Text style={{ fontWeight: "400" }}>Text</Text> Text <Text style={{ fontWeight: "400" }}>Text</Text>
                            </Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    editBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 0,
        marginHorizontal: 320
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden"
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    edit: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 28,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 10,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    add: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 20,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    logout: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    mediaCount: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: "50%",
        marginTop: -50,
        marginLeft: 30,
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        shadowColor: "rgba(0, 0, 0, 0.38)",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        shadowOpacity: 1
    },
    recent: {
        marginLeft: 78,
        marginTop: 32,
        marginBottom: 6,
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    },
    activityIndicator: {
        backgroundColor: "#CABFAB",
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    }
});