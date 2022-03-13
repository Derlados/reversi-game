import { NavigationContainer } from "@react-navigation/native"
import Game from "../screens/game/Game"
import Menu from "../screens/menu/Menu"
import { MainRoutes, MainStack } from "./routes"

const MainNavigation = (): React.ReactElement => {

    return (
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen
                    name={MainRoutes.MENU}
                    component={Menu}
                    options={{ headerShown: false }}
                />
                <MainStack.Screen
                    name={MainRoutes.GAME}
                    component={Game}
                    options={{ headerShown: false }}
                />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}
export default MainNavigation