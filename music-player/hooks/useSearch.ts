import {useLayoutEffect, useState} from "react";
import {SearchBarProps} from "react-native-screens";
import {useNavigation} from "expo-router";
import colors from "@/constants/colors";

const defaultSearchOptions: SearchBarProps = {
    tintColor: colors.primary,
    hideWhenScrolling: false,
}

const useSearch = ({searchBarOptions}: {
    searchBarOptions?: SearchBarProps
}) => {
    const [search, setSearch] = useState('')

    const navigation = useNavigation()

    const handleOnChangeText: SearchBarProps['onChangeText'] = ({nativeEvent: {text}}) => {
        setSearch(text)
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                ...defaultSearchOptions,
                ...searchBarOptions,
                onChangeText: handleOnChangeText,
            },
        })
    }, [navigation, searchBarOptions])

    return search
}

export default useSearch