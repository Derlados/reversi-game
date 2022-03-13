import { createStackNavigator } from '@react-navigation/stack'

export enum MainRoutes {
    MENU = 'Menu',
    GAME = 'Game'
}

export type MainStackParamList = {
    [MainRoutes.MENU]: undefined
    [MainRoutes.GAME]: undefined
}

export const MainStack = createStackNavigator<MainStackParamList>()