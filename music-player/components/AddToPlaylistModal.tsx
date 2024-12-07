import React, {useState} from 'react';
import {ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import {defaultStyle} from "@/constants/styles";
import {useAuthContext} from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import PlaylistCheckbox from "@/components/PlaylistCheckbox";

type Props = {
    visible: boolean,
    onClose: () => void,
    song: Song | null
}

const AddToPlaylistModal = ({visible, onClose, song}: Props) => {
    const { user } = useAuthContext()
    const [error, setError] = useState<any>()
    const { data: dataPlaylist, loading: loadingPlaylist } = useFetch<Playlist[]>(BASE_URL + `playlists/by_user?user_id=${user?.user_id}`);
    const { postData } = useFetch(BASE_URL + 'playlists/songs/add')

    const [checkedPlaylists, setCheckedPlaylists] = useState<{ [key: number]: boolean }>({});

    const handleCheckChange = (playlistId: number, checked: boolean) => {
        setCheckedPlaylists(prevState => ({
            ...prevState,
            [playlistId]: checked,
        }));
    };

    const handlePressOutside = (e: any) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleAddToPlaylist = () => {
        if (!checkedPlaylists) {
        setError('No playlists selected');
        return;
        }
        const addToPlaylists = dataPlaylist?.filter(playlist => checkedPlaylists[playlist.playlist_id]);

        postData({
            user_id: user?.user_id,
            playlist_ids: addToPlaylists?.map(item => item.playlist_id),
            song_id: song?.song_id
        }).then(() => {
            setError(null)
        }).catch(err => {
            setError(err)
            return;
        })
        onClose()
    }

    return (
        <Modal animationType={'fade'} visible={visible} transparent={true} onRequestClose={onClose}>
            <Pressable style={styles.container} onPress={handlePressOutside}>
                <View style={styles.content}>
                    <Text style={{...defaultStyle.title, fontSize: 20}}>Your playlist</Text>
                    {loadingPlaylist ?
                        <ActivityIndicator size={"large"} color={"blue"}/> :
                        <FlatList
                            data={dataPlaylist}
                            contentContainerStyle={{ padding: 10 }}
                            ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                            renderItem={({ item }) => (
                                <PlaylistCheckbox
                                    playlist={item}
                                    isChecked={checkedPlaylists[item.playlist_id] || false}
                                    onCheckChange={handleCheckChange}
                                />
                            )}
                        />
                    }
                    {error && <Text style={{...defaultStyle.subtitle, color: 'red', textAlign: 'center'}}>{error}</Text>}
                    <View style={styles.button}>
                        <Pressable style={styles.cancel} onPress={onClose}>
                            <Text style={{...defaultStyle.title, color: 'red'}}>Cancel</Text>
                        </Pressable>
                        <Pressable style={styles.create} onPress={handleAddToPlaylist}>
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
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: "center",
        width: 300,
        maxHeight: 600,
        borderRadius: 15
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

export default AddToPlaylistModal;