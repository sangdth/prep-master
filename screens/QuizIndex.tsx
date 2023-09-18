import React, { useEffect } from 'react';
import {
    ScrollView,
    StatusBar,
    Button,
} from 'react-native';

import RowItem from '../components/RowItem';

import {
    /* RouteProp, */
    Category,
    useAuth,
    StackNavigationProp,
    RootStackParamList as R,
    getCategories,
    useStateValue,
} from '../utils';

type QuizIndexNavigationProp = StackNavigationProp<R, 'QuizIndex'>;
/* type QuizIndexRouteProp = RouteProp<R, 'QuizIndex'>; */

interface Props {
    navigation: QuizIndexNavigationProp;
    // route: QuizIndexRouteProp;
}

export default (props: Props) => {
    const { navigation } = props;

    const { auth, logout } = useAuth();

    const { state: { categories }, dispatch } = useStateValue();

    const handleQuizRoute = (name: string) => {
        navigation.navigate('Quiz', {
            category: name,
            color: '#36b1f0',
        });
    };

    useEffect(() => {
        const getCats = async () => {
            const results = await getCategories();
            dispatch({
                type: 'SET_CATEGORIES',
                categories: results,
            });
        };

        if (auth && (!categories || categories.length === 0)) {
            getCats();
        }
    }, [auth, categories, dispatch]);

    useEffect(() => {
        if (!auth) {
            navigation.navigate('Login');
        }
    }, [auth, navigation]);

    return (
        <ScrollView>
            <StatusBar barStyle="dark-content" />

            {categories && categories.map((c: Category) => (
                <RowItem
                    key={`${c.name}-${c.quantity}`}
                    name={`${c.name}`}
                    color="#36b1f0"
                    onPress={() => handleQuizRoute(c.name)}
                />
            ))}

            <Button onPress={() => logout(auth)} title="Logout" />
        </ScrollView>
    );
};
