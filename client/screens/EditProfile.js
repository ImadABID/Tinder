import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView } from "react-native";
import { useContext, useState } from 'react';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

const EditProfile = ({ }) => {
    const navigation = useNavigation();
    const [name, setName] = useState();
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
                        <Ionicons name="pencil" size={20} color="#DFD8C8" onPress={() => navigation.navigate('EditProfile')} ></Ionicons>
                    </View>

                </View>


                <Text style={[styles.subText, styles.recent]}>NAme</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormInput
                            labelValue={name}
                            onChangeText={(userName) => setName(userName)}
                            placeholderText="JUlie"
                            iconType="user"
                            keyboardType="name"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </View>
                <Text style={[styles.subText, styles.recent]}>Interet</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormInput
                            labelValue={name}
                            onChangeText={(userName) => setName(userName)}
                            placeholderText="Photographer"
                            iconType="user"
                            keyboardType="name"
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
                            keyboardType="name"
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
                            keyboardType="name"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
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
                            keyboardType="name"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                    </View>
                </View>
                <Text style={[styles.subText, styles.recent]}>Orientation</Text>
                <View style={{ alignItems: "center" }}>
                    <View style={styles.infoContainer}>
                        <FormInput
                            labelValue={name}
                            onChangeText={(userName) => setName(userName)}
                            placeholderText="TEXT"
                            iconType="user"
                            keyboardType="name"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                    </View>
                </View>
                <View style={{ marginTop: 32 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.mediaImageContainer}>

                            <Image source={require("../assets/media1.jpg")} style={styles.image} resizeMode="cover"></Image>
                            <Ionicons name="trash" color="red" size={25} style={{ position: 'absolute', top: 10, left: 10 }} />

                        </View>

                        <View style={styles.mediaImageContainer}>
                            <Image source={require("../assets/media2.jpg")} style={styles.image} resizeMode="cover"></Image>
                            <Ionicons name="trash" color="red" size={25} style={{ position: 'absolute', top: 10, left: 10 }} />

                        </View>
                        <View style={styles.mediaImageContainer}>
                            <Image source={require("../assets/media3.jpg")} style={styles.image} resizeMode="cover"></Image>
                            <Ionicons name="trash" color="red" size={25} style={{ position: 'absolute', top: 10, left: 10 }} />

                        </View>
                    </ScrollView>
                </View>

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