import React from "react";
import { useContext, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image,Button,Platform,ScrollView} from "react-native";
import {Picker} from "@react-native-picker/picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import * as ImagePicker from 'expo-image-picker';
import demo from '../assets/data/demo.js';

const EditProfile = ({ }) => {
    const navigation = useNavigation();
    const [name, setName] = useState();
    const [age, setAge] = useState();
    const [image, setImage] = useState(null);
    const [Demo, setData] = useState(demo);
    const removeItem = (index) => {
        setData(Demo.filter((o, i) => index !== i));
    };
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
    return (
        <SafeAreaView style={styles.container}>
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
                        <Ionicons name="pencil" size={20} color="#DFD8C8" onPress={pickImage} />
                        {image && <Image source={{ uri: image }} style={styles.image}  />}
                    </View>

                </View>


                <Text style={[styles.subText, styles.recent]}>Name</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormInput
                            labelValue={name}
                            onChangeText={(userName) => setName(userName)}
                            placeholderText="JUlie"
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
                            labelValue={name}
                            onChangeText={(userName) => setName(userName)}
                            placeholderText="22"
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
                            //selectedValue={selectedValue}
                            style={{ height: 50, width: 150 }}
                            onValueChange={
                                (itemValue, itemIndex) => {
                                    //setSelectedValue(itemValue)
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
                            //selectedValue={selectedValue}
                            style={{ height: 50, width: 150 }}
                            onValueChange={
                                (itemValue, itemIndex) => {
                                    //setSelectedValue(itemValue)
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
                            labelValue={name}
                            onChangeText={(userName) => setName(userName)}
                            placeholderText="TEXT"
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
                            labelValue={name}
                            onChangeText={(userName) => setName(userName)}
                            placeholderText="TEXT"
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
                            labelValue={name}
                            onChangeText={(userName) => setName(userName)}
                            placeholderText="TEXT"
                            iconType="user"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 32 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
                                ()=>{

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