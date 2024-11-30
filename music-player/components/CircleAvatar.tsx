import React, {useMemo} from 'react';
import {useAuthContext} from "@/context/AuthContext";
import {generateUserColor} from "@/utils/generateColor";
import {Image, ImageStyle} from "expo-image";

type Props = {
    size: number;
    style?: ImageStyle;
}

const CircleAvatar = ({size, style}: Props) => {
    const { user } = useAuthContext()
    const { backgroundColor, textColor } = useMemo(() => generateUserColor(user?.username || '?'), [user])

    return (
        <Image
            style={{...style, width: size, height: size}}
            contentFit={"contain"}
            source={user ?
                { uri: `https://ui-avatars.com/api/?name=${user.username}&background=${backgroundColor}&color=${textColor}&length=1&rounded=true&bold=true&size=${size}`} :
                { uri: `https://ui-avatars.com/api/?name=${'?'}&background=${backgroundColor}&color=${textColor}&length=1&rounded=true&size=${size}`}
            }
        />
    );
};

export default CircleAvatar;