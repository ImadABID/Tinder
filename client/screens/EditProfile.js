import React from "react";
import { useContext, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity} from "react-native";
import {Picker} from "@react-native-picker/picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import * as ImagePicker from 'expo-image-picker';
import demo from '../assets/data/demo.js';

import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as ip_server from './server_ip';

var first_time = 1;

const EditProfile = ({ }) => {
    
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [age, setAge] = useState();
    const [description, setDescription] = useState('');
    const [passion, setPassion] = useState('');
    const [orientation, setOrientation] = useState('male');
    const [targetedSex, setTargetedSex] = useState('na');
    
    const [image, setImage] = useState({uri : 'none'});
    const [Demo, setData] = useState(demo);
    
    const [profileImage, setProfileImage] = useState({uri : 'none'});

    const removeItem = (index) => {
        setData(Demo.filter((o, i) => index !== i));
    };

    const pickImage = async (setImage) => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result);
        }
    };

    const createFormData = (photo, body = {}) => {
        const data = new FormData();
        
        data.append('photo', {
            name: 'photo',
            type: 'image/jpeg',
            uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        });
        
        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });
        
        return data;
    };

    const handleUploadPhoto = (img, host_name, token, imageRole) => {
        fetch('http://'+host_name+'/upload_image', {
            method: 'POST',
            headers : {'Accept' : 'application/json', 'Content-Type' : 'multipart/form-data'},
            body: createFormData(img, { token :  token, imageRole : imageRole}),
        })
        .then((response) => response.json())
        .then((response) => {
            console.log('response', response);
        })
        .catch((error) => {
            console.log('upload image error', error);
        });
    };

    const delete_image = async (imageRole) => {

        let token = await SecureStore.getItemAsync('token');
        if(token){

            let host_name = await ip_server.get_hostname();
            let link = 'http://'+host_name+'/delete_image';

            let data = 'token='+token+'&imageRole='+imageRole;

            let myInit = {
                method: 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
                body: data
            };

            fetch(link, myInit)
            .then((res)=>{return res.json();})
            .then( res =>{
                if(res.msg != '0'){
                    console.log(res.msg);
                }
            }).catch(err => {
                navigation.navigate('LoginScreen');
            });

        }else{
            navigation.navigate('LoginScreen');
        }

    }

    const at_start_up = async () => {

        if(first_time === 1){
            
            first_time = 0;

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
                    if(res.client.hasOwnProperty('orientation')){
                        setOrientation(res.client.orientation);
                    }
                    if(res.client.hasOwnProperty('targetedSex')){
                        setTargetedSex(res.client.targetedSex);
                    }
                    if(res.client.hasOwnProperty('profileImage')){
                        setProfileImage({uri : 'http://'+host_name+'/get_image?filename='+res.client.profileImage});
                    }
                }).catch(err => {
                    navigation.navigate('LoginScreen');
                });
                
            }else{
                navigation.navigate('LoginScreen');
            }
        }
    
    }

    useFocusEffect(
        React.useCallback(() => {
            at_start_up();
        })
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.titleBar}>
                    <Ionicons name="ios-arrow-back" size={24} color="#52575D"
                        onPress={() => {first_time = 1; navigation.goBack();}}
                    ></Ionicons>
                </View>
                <View style={{ alignSelf: "center" }}>
                    <View style={styles.profileImage}>
                        {profileImage.uri == 'none' ? <Image source={require('../assets/default-img.jpg')} style={styles.image} resizeMode="center"></Image> : <Image source={{uri : profileImage.uri}} style={styles.image} resizeMode="center"></Image>}
                    </View>
                    <View style={styles.dm}>
                        <Ionicons name="pencil" size={20} color="#DFD8C8" onPress={ ()=>{pickImage(setProfileImage);}} />
                    </View>
                    <View style={styles.delete_profile_image}>
                        <MaterialIcons
                            name="delete" size={20} color="#DFD8C8"
                            onPress={
                                () => {
                                    setProfileImage({uri:'none'});
                                    delete_image('profileImage');
                                }
                            }
                        ></MaterialIcons>
                    </View>

                </View>


                <Text style={[styles.subText, styles.recent]}>Name</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormInput
                            labelValue={username}
                            onChangeText={(name) => setUsername(name)}
                            placeholderText="name"
                            iconType="user"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </View>
                <Text style={[styles.subText, styles.recent]}>Age</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormInput
                            labelValue={age}
                            onChangeText={(age) => setAge(age)}
                            placeholderText="age"
                            iconType="user"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </View>
                <Text style={[styles.subText, styles.recent]}>Orientation</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <Picker
                            selectedValue = {orientation}
                            style={{ height: 50, width: 150 }}
                            onValueChange={
                                (itemValue, itemIndex) => {
                                    setOrientation(itemValue)
                                }
                            }
                        >
                            <Picker.Item label="male" value="male"/>
                            <Picker.Item label="female" value="female"/>
                        </Picker>
                    </View>
                </View>
                <Text style={[styles.subText, styles.recent]}>Interessed in</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <Picker
                            selectedValue={targetedSex}
                            style={{ height: 50, width: 150 }}
                            onValueChange={
                                (itemValue, itemIndex) => {
                                    setTargetedSex(itemValue)
                                }
                            }
                        >
                            <Picker.Item label="men" value="men"/>
                            <Picker.Item label="women" value="women"/>
                            <Picker.Item label="I prefer not to say" value="na"/>
                        </Picker>
                    </View>
                </View>
                <Text style={[styles.subText, styles.recent]}>PAssion</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormInput
                            labelValue={passion}
                            onChangeText={(pas) => setPassion(pas)}
                            placeholderText="passion"
                            iconType="user"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                    </View>
                </View>
                <Text style={[styles.subText, styles.recent]}>Description</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormInput
                            labelValue={description}
                            onChangeText={(des) => setDescription(des)}
                            placeholderText="description"
                            iconType="user"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 32 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        
                        
                        <TouchableOpacity onPress={pickImage}>
                            <View style={styles.mediaImageContainer}>
                                <Image source={require("../assets/add_image.png")} style={styles.image} resizeMode="cover"></Image>
                            </View>
                        </TouchableOpacity>
                        

                        {Demo.map((item, index) => (
                            <View key={index} style={styles.mediaImageContainer}>
                                <Image source={item.image} style={styles.image} resizeMode="cover"></Image>
                                <Ionicons name="trash" color="red" size={25} onPress={()=>removeItem(index)} style={{ position: 'absolute', top: 10, left: 10 }} />

                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormButton
                            buttonTitle="Save"
                            onPress = {
                                async ()=>{

                                    first_time = 1;

                                    let token = await SecureStore.getItemAsync('token');
                                    if (token) {

                                        console.log(token);

                                        let host_name = await ip_server.get_hostname();
                                        let link = 'http://'+host_name+'/profile/update';

                                        console.log('link');

                                        /*
                                        
                                            * Req :
                                            curl
                                                -X POST 
                                                -d 'username=lora'
                                                -d 'email=lora17@yml.fr'
                                                -d 'password=kona75mi:-)'
                                                http://localhost:3000/users/register
                                            
                                            * Res :
                                                {
                                                msg : '0' if no err,
                                                token : if no err
                                                }
                                        */

                                        let data = 'token='+token+'&username='+username+'&age='+age+'&orientation='+orientation+'&targetedSex='+targetedSex+'&description='+description+'&passion='+passion;

                                        console.log(data);

                                        let myInit = {
                                            method: 'POST',
                                            headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
                                            body: data
                                        };

                                        fetch(link, myInit)
                                        .then((res)=>{return res.json();})
                                        .then(res =>{


                                            if(res.msg === '0'){
                                                navigation.navigate('ProfileScreen');
                                            }else{
                                                //setErrorMsg(res.msg);
                                            }

                                        })
                                        .catch(err =>{
                                            console.log(err);
                                        })
                                        .finally(()=>{

                                        });

                                        // sending profile pic
                                        handleUploadPhoto(profileImage, host_name, token, 'profileImage');

                                    }else{
                                        navigation.navigate('LoginScreen');
                                    }

                                }
                            }
                        />
                        
                    </View>
                </View>
                <Text>

                </Text>


            </ScrollView>
        </SafeAreaView>
    );
}
export default EditProfile;

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
    delete_profile_image: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom : 20,
        right : 0,
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
        marginTop: -100,
        marginLeft: 150,
        width: 40,
        height: 40,
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
        marginTop: 10,
        marginBottom: 0,
        fontSize: 15
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