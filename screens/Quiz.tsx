import React, { useEffect, useMemo, useState } from 'react';

import {
    // Alert,
    SafeAreaView,
    Spinner,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from '../components';
import {
    RootStackParamList as R,
    RouteProp,
    StackNavigationProp,
    getQuestions,
    useAuth,
    useStateValue,
    useTimeoutFn,
    updateUser,
} from '../utils';

import { Button, ButtonContainer } from '../components/Button';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#36B1F0',
        flex: 1,
        paddingHorizontal: 20,
    },
    text: {
        color: '#fff',
        fontSize: 25,
        textAlign: 'center',
        letterSpacing: -0.02,
        fontWeight: '600',
    },
    safearea: {
        flex: 1,
        marginTop: 100,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loadingArea: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    spinner: {
        // marginTop: 10,
    },
});

type QuizNavigationProp = StackNavigationProp<R, 'Quiz'>;
type QuizRouteProp = RouteProp<R, 'Quiz'>;

interface Props {
    navigation: QuizNavigationProp;
    route: QuizRouteProp;
}

const Quiz = (props: Props) => {
    const { route, navigation } = props;
    const { category } = route.params;
    const { auth } = useAuth();
    const { state: { aggregated }, dispatch } = useStateValue();

    const aggregator = useMemo(() => {
        if (aggregated && aggregated[category]) {
            return aggregated[category];
        }
        return { limit: 1, offset: 0 };
    }, [aggregated, category]);

    const [question, setQuestion] = useState<any>();
    const [loading, setLoading] = useState(false);

    const answers = useMemo(() => {
        if (question) {
            return Object.keys(question)
                .filter((k: string) => k.substring(0, 6) === 'Answer')
                .map((k: string) => ({
                    position: k.substring(7),
                    value: question[k],
                }));
        }
        return [];
    }, [question]);

    console.log('### answers: ', answers);

    const handleAnswer = async (selected: any) => {
        console.log('##### selected:', selected);
        if (auth) {
            const inputData = {
                Email: auth.Email,
                [question.ID]: selected.position,
            };

            await updateUser(inputData);

            const nextAggregated = {
                [category]: {
                    ...aggregator,
                    offset: aggregator.offset + 1,
                },
            };

            dispatch({
                type: 'SET_AGGREGATED',
                aggregated: nextAggregated,
            });
        }
    };

    useEffect(() => {
        if (!aggregated) {
            dispatch({
                type: 'SET_AGGREGATED',
                aggregated: { [category]: { limit: 1, offset: 0 } },
            });
        }
    }, [category, aggregated, dispatch]);

    useEffect(() => {
        const getQuestion = async () => {
            setLoading(true);
            const results = await getQuestions(aggregator, { category });
            setQuestion(results[0]);
        };

        if (auth && aggregator && category) {
            getQuestion();
        }
    }, [auth, dispatch, aggregator, category]);

    const [, , reset] = useTimeoutFn(() => {
        setLoading(false);
    }, 100);

    const [, , resetBack] = useTimeoutFn(() => {
        if (!question) {
            const resetAggregated = {
                [category]: {
                    limit: 1,
                    offset: 0,
                },
            };

            dispatch({
                type: 'SET_AGGREGATED',
                aggregated: resetAggregated,
            });

            navigation.goBack();
        }
    }, 500);

    useEffect(() => {
        if (question) {
            reset();
        } else {
            resetBack();
        }
    }, [question, reset, resetBack]);

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safearea}>
                {(loading || !question) ? (
                    <View style={styles.loadingArea}>
                        <Text style={{ marginBottom: 10 }}>Looking for question...</Text>
                        <Spinner size="giant" />
                    </View>
                ) : (
                    <View>
                        <Text category="h6">{question ? question.Description : ''}</Text>

                        <ButtonContainer>
                            {answers.map((a: any) => (
                                <Button
                                    key={a.position}
                                    text={a.value}
                                    onPress={() => handleAnswer(a)}
                                />
                            ))}
                        </ButtonContainer>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
};

export default Quiz;
