import { StackNavigationProp } from '@react-navigation/stack'
import { MainRoutes, MainStackParamList } from './routes'

//TODO ... = MainRoutes ????????
export type MainNavigationProp<RouteName extends keyof MainStackParamList = MainRoutes>
    = StackNavigationProp<MainStackParamList, RouteName>