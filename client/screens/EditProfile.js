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

async function log_out(){
    await SecureStore.deleteItemAsync('token');
}

var first_time = 1;

var empty_image = [1, 1, 1, 1, 1];

var nbr_element_not_uploaded_yet;

const EditProfile = ({ }) => {
    
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [passion, setPassion] = useState('');
    const [orientation, setOrientation] = useState('men');
    const [targetedSex, setTargetedSex] = useState('na');

    const [saveButtonTitle, setSaveButtonTitle] = useState('Save');

    const [Demo, setData] = useState(demo);
    
    const [profileImage, setProfileImage] = useState({uri : 'none'});

    const [image1, setImage1] = useState({uri : 'none'});
    const [image2, setImage2] = useState({uri : 'none'});
    const [image3, setImage3] = useState({uri : 'none'});
    const [image4, setImage4] = useState({uri : 'none'});
    const [image5, setImage5] = useState({uri : 'none'});
    const imageSetters = [setImage1, setImage2, setImage3, setImage4, setImage5];

    const [checkMsg, setCheckMsg] = useState('');

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
            nbr_element_not_uploaded_yet--;
            if(nbr_element_not_uploaded_yet===0){
                first_time = 1;
                setSaveButtonTitle("Save");
                navigation.navigate('ProfileScreen');
            }
        })
        .catch((error) => {
            console.log('upload image error', error);
            nbr_element_not_uploaded_yet--;
            if(nbr_element_not_uploaded_yet===0){
                first_time = 1;
                setSaveButtonTitle("Save");
                navigation.navigate('ProfileScreen');
            }
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
                first_time = 1;
                log_out();
                navigation.navigate('LoginScreen');
            });

        }else{
            first_time = 1;
            log_out();
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
                    }else{
                        setProfileImage({uri : 'none'});
                    }
                    if(res.client.hasOwnProperty('image1')){
                        setImage1({uri : 'http://'+host_name+'/get_image?filename='+res.client.image1});
                        empty_image[0] = 0;
                    }else{
                        setImage1({uri : 'none'});
                        empty_image[0] = 1;
                    }
                    if(res.client.hasOwnProperty('image2')){
                        setImage2({uri : 'http://'+host_name+'/get_image?filename='+res.client.image2});
                        empty_image[1] = 0;
                    }else{
                        setImage2({uri : 'none'});
                        empty_image[2] = 0;
                    }
                    if(res.client.hasOwnProperty('image3')){
                        setImage3({uri : 'http://'+host_name+'/get_image?filename='+res.client.image3});
                        empty_image[2] = 0;
                    }else{
                        setImage3({uri : 'none'});
                        empty_image[2] = 1;
                    }
                    if(res.client.hasOwnProperty('image4')){
                        setImage4({uri : 'http://'+host_name+'/get_image?filename='+res.client.image4});
                        empty_image[3] = 0;
                    }else{
                        setImage4({uri : 'none'});
                        empty_image[3] = 1;
                    }
                    if(res.client.hasOwnProperty('image5')){
                        setImage5({uri : 'http://'+host_name+'/get_image?filename='+res.client.image5});
                        empty_image[4] = 0;
                    }else{
                        setImage5({uri : 'none'});
                        empty_image[4] = 1;
                    }
                    
                }).catch(err => {
                    first_time = 1;
                    log_out();
                    navigation.navigate('LoginScreen');
                });
                
            }else{
                first_time = 1;
                log_out();
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
                            <Picker.Item label="men" value="men"/>
                            <Picker.Item label="women" value="women"/>
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
                        
                        
                        {
                            empty_image.indexOf(1) != -1 ?
                            <TouchableOpacity
                                onPress={
                                    ()=>{
                                        pickImage(imageSetters[empty_image.indexOf(1)])
                                        empty_image[empty_image.indexOf(1)] = 0;
                                    }
                                }
                            >
                                <View style={styles.mediaImageContainer}>
                                    <Image source={require("../assets/add_image.png")} style={styles.image} resizeMode="cover"></Image>
                                </View>
                            </TouchableOpacity>
                            :<View></View>
                        }

                        {
                            image1.uri != 'none' ?
                            <View style={styles.mediaImageContainer}>
                                <Image source={{uri:image1.uri}} style={styles.image} resizeMode="cover"></Image>
                                <Ionicons
                                    name="trash" color="red" size={25} style={{ position: 'absolute', top: 10, left: 10 }}
                                    onPress={
                                        () => {
                                            empty_image[0] = 1;
                                            setImage1({uri:'none'});
                                            delete_image('image1');
                                        }
                                    }
                                />
                            </View>
                            :<View></View>
                        }

                        {
                            image2.uri != 'none' ?
                            <View style={styles.mediaImageContainer}>
                                <Image source={{uri:image2.uri}} style={styles.image} resizeMode="cover"></Image>
                                <Ionicons
                                    name="trash" color="red" size={25} style={{ position: 'absolute', top: 10, left: 10 }}
                                    onPress={
                                        () => {
                                            empty_image[1] = 1;
                                            setImage2({uri:'none'});
                                            delete_image('image2');
                                        }
                                    }
                                />
                            </View>
                            :<View></View>
                        }

                        {
                            image3.uri != 'none' ?
                            <View style={styles.mediaImageContainer}>
                                <Image source={{uri:image3.uri}} style={styles.image} resizeMode="cover"></Image>
                                <Ionicons
                                    name="trash" color="red" size={25} style={{ position: 'absolute', top: 10, left: 10 }}
                                    onPress={
                                        () => {
                                            empty_image[2] = 1;
                                            setImage3({uri:'none'});
                                            delete_image('image3');
                                        }
                                    }
                                />
                            </View>
                            :<View></View>
                        }

                        {
                            image4.uri != 'none' ?
                            <View style={styles.mediaImageContainer}>
                                <Image source={{uri:image4.uri}} style={styles.image} resizeMode="cover"></Image>
                                <Ionicons
                                    name="trash" color="red" size={25} style={{ position: 'absolute', top: 10, left: 10 }}
                                    onPress={
                                        () => {
                                            empty_image[3] = 1;
                                            setImage4({uri:'none'});
                                            delete_image('image4');
                                        }
                                    }
                                />
                            </View>
                            :<View></View>
                        }

                        {
                            image5.uri != 'none' ?
                            <View style={styles.mediaImageContainer}>
                                <Image source={{uri:image5.uri}} style={styles.image} resizeMode="cover"></Image>
                                <Ionicons
                                    name="trash" color="red" size={25} style={{ position: 'absolute', top: 10, left: 10 }}
                                    onPress={
                                        () => {
                                            empty_image[4] = 1;
                                            setImage5({uri:'none'});
                                            delete_image('image5');
                                        }
                                    }
                                />
                            </View>
                            :<View></View>
                        }

                    </ScrollView>
                </View>

                <Text style={{textAlign : 'center', color : 'red'}}>
                    {checkMsg}
                </Text>

                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormButton
                            buttonTitle={saveButtonTitle}
                            onPress = {
                                async ()=>{

                                    if(
                                        profileImage.uri ===  'none'
                                        || username === ''
                                        || age === ''
                                        || description === ''
                                        || passion === ''
                                    ){
                                        setCheckMsg('Set all information');
                                    }else{
                                     
                                        setCheckMsg('');

                                        setSaveButtonTitle('Saving ...');

                                        first_time = 1;

                                        let token = await SecureStore.getItemAsync('token');
                                        if (token) {

                                            let host_name = await ip_server.get_hostname();
                                            let link = 'http://'+host_name+'/profile/update';

                                            nbr_element_not_uploaded_yet = 7;

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
                                                    //
                                                }else{
                                                    //setErrorMsg(res.msg);
                                                }
                                                nbr_element_not_uploaded_yet--;
                                                if(nbr_element_not_uploaded_yet===0){
                                                    first_time = 1;
                                                    navigation.navigate('ProfileScreen');
                                                }

                                            })
                                            .catch(err =>{
                                                console.log(err);
                                                nbr_element_not_uploaded_yet--;
                                                if(nbr_element_not_uploaded_yet===0){
                                                    first_time = 1;
                                                    navigation.navigate('ProfileScreen');
                                                }
                                            })
                                            .finally(()=>{

                                            });

                                            // sending profile pic
                                            handleUploadPhoto(profileImage, host_name, token, 'profileImage');

                                            //sending other 5 images
                                            handleUploadPhoto(image1, host_name, token, 'image1');
                                            handleUploadPhoto(image2, host_name, token, 'image2');
                                            handleUploadPhoto(image3, host_name, token, 'image3');
                                            handleUploadPhoto(image4, host_name, token, 'image4');
                                            handleUploadPhoto(image5, host_name, token, 'image5');

                                        }else{
                                            first_time = 1;
                                            log_out();
                                            navigation.navigate('LoginScreen');
                                        }
                                        
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