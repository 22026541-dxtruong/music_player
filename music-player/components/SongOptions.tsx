import React from 'react';
import {Animated, Modal, View} from "react-native";
import {Gesture, GestureDetector} from "react-native-gesture-handler";

type Props = {
    visible: boolean,
}
const SongOptions = ({visible}: Props) => {
    const AnimatedModal = Animated.createAnimatedComponent(Modal)
    const pan = Gesture.Pan()
    return (
        <GestureDetector gesture={pan}>
            <AnimatedModal visible={visible} transparent={true} animationType={"slide"} >
                <View>

                </View>
            </AnimatedModal>
        </GestureDetector>
    );
}

export default SongOptions;