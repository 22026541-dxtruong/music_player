import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {defaultStyle} from "@/constants/styles";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import {useAuthContext} from "@/context/AuthContext";

type Props = {
    visible: boolean
    onClose: () => void
}

const CreatePlaylistModal = ({visible, onClose}: Props) => {
    const [name, setName] = useState('')
    const { user } = useAuthContext()
    const [error, setError] = useState<any>()
    const { postData } = useFetch<Playlist>(BASE_URL + `playlists/create`)

    const handleCreatePlaylist = () => {
        if (!name) {
            setError('Name is required');
            return;
        }
        postData({
            name: name,
            user_id: user?.user_id
        }).then(() => setError(null)).catch(err => {
            setError(err)
            return;
        })
        onClose()
    }

    const handlePressOutside = (e: any) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Modal animationType="fade" visible={visible} transparent={true} onRequestClose={onClose}>
            <Pressable style={styles.container} onPress={handlePressOutside}>
                <View style={styles.content}>
                    <Text style={{...defaultStyle.title, fontSize: 20}}>Give your playlist a name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder={'Playlist'}
                        textAlign={'center'}
                        style={styles.input}
                    />
                    {error && <Text style={{...defaultStyle.subtitle, color: 'red', textAlign: 'center'}}>{error || "Name is required"}</Text>}
                    <View style={styles.button}>
                        <Pressable style={styles.cancel} onPress={onClose}>
                            <Text style={{...defaultStyle.title, color: 'red'}}>Cancel</Text>
                        </Pressable>
                        <Pressable style={styles.create} onPress={handleCreatePlaylist}>
                            <Text style={{...defaultStyle.title, color: '#8B5DFF'}}>Create</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        ...defaultStyle.container,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: 300,
        paddingVertical: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        gap: 10
    },
    input: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '80%',
        fontSize: 16,
        paddingHorizontal: 0
    },
    button: {
        flexDirection: "row",
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        width: '100%'
    },
    cancel: {
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: 'red'
    },
    create: {
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#8B5DFF'
    }
})

export default CreatePlaylistModal;