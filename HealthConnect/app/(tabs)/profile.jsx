import { Pressable, SafeAreaView, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

export default function Profile() {
    const dispatch = useDispatch()

    const logout = () => {
        dispatch(logoutUser())
    }
    return (
        <SafeAreaView>
            <Text>hey</Text>
            <Pressable onPress={logout}>
                <Text>Logout</Text>
            </Pressable>
        </SafeAreaView>
    )
}