import {StyleSheet} from "react-native";
import colors from "./colors";
import fonts from "./fonts";
import dimensions from "./dimensions";

export const defaultStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: dimensions.padding,
        backgroundColor: colors.background,
        gap: 10
    },
    header: {
        color: colors.primary,
        fontSize: fonts.lg,
        fontWeight: 'bold',
        width: 100
    },
    title: {
        color: colors.title,
        fontWeight: 'bold',
        fontSize: fonts.sm
    },
    subtitle: {
        color: colors.subtitle,
        fontSize: fonts.xs
    },
    error: {
        color: colors.error,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: fonts.sm,
        flex: 1
    }
})
