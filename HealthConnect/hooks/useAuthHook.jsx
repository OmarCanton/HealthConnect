import { CommonActions } from "@react-navigation/native"
import { useNavigation, useRouter } from "expo-router"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    currentUser,
    logoutUser
} from "../redux/slices/authSlice"


export default function useAuthCheck() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const user = useSelector(currentUser)
    const token = user?.token
    const router = useRouter()

    useEffect(() => {
        if(user === null || !user.isAuthenticated) {
            dispatch(logoutUser())
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: '(auth)'}]
                })
            )
        }
    }, [dispatch, token, user, router, navigation])
}
