import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { RootStackParamList, StateProvider, reducer } from './utils';

import Login from './screens/Login';
import CheckCode from './screens/CheckCode';
import QuizIndex from './screens/QuizIndex';
import Quiz from './screens/Quiz';

// https://reactnavigation.org/docs/react-native-screens
enableScreens();

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

const loginOptions = {
    title: 'Login',
    headerTransparent: true,
    headerStyle: {
        backgroundColor: 'transparent',
    },
    headerTintColor: '#FFFFFF',
};

const checkCodeOptions = {
    title: 'Access Code',
};

const QuizIndexOptions = {
    headerLeft: () => null,
};

const AppRoot = () => {
    const initialState = {
        user: undefined,
    };

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <StateProvider initialState={initialState} reducer={reducer}>
                <ApplicationProvider {...eva} theme={eva.light}>
                    <NavigationContainer>
                        <Navigator initialRouteName="Login">
                            <Screen name="Login" component={Login} options={loginOptions} />
                            <Screen name="CheckCode" component={CheckCode} options={checkCodeOptions} />
                            <Screen name="QuizIndex" component={QuizIndex} options={QuizIndexOptions} />
                            <Screen name="Quiz" component={Quiz} />
                        </Navigator>
                    </NavigationContainer>
                </ApplicationProvider>
            </StateProvider>
        </>
    );
};

export default AppRoot;
