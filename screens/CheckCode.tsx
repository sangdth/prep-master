import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Button,
    Icon,
    Input,
    TouchableWithoutFeedback,
} from '../components';
import {
    RouteProp,
    StackNavigationProp,
    RootStackParamList as R,
    useAuth,
    useStateValue,
    useTimeoutFn,
} from '../utils';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
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
        // flex: 1,
        marginTop: 100,
        justifyContent: 'space-between',
    },
    button: {
        marginTop: 20,
    },
});

type CheckCodeRouteProp = RouteProp<R, 'CheckCode'>;
type CheckCodeNavigationProp = StackNavigationProp<R, 'CheckCode'>;

type Props = {
    navigation: CheckCodeNavigationProp;
    route: CheckCodeRouteProp;
};

const CheckCode = (props: Props) => {
    const { navigation } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const { auth, login } = useAuth();

    const { state: { user } } = useStateValue();

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderIcon = (p: any) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...p} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );

    const handleCheckCode = async () => {
        setLoading(true);
        if (user && user['Access Code'].toUpperCase() === code.toUpperCase()) {
            await login(user);
            navigation.navigate('QuizIndex');
        }
    };

    useTimeoutFn(() => {
        if (auth) {
            navigation.navigate('QuizIndex');
        }
    }, 100);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safearea}>
                <>
                    <Input
                        autoFocus
                        clearable={false}
                        label="Access Code"
                        placeholder="******"
                        caption="Should contain 6 characters"
                        disabled={loading}
                        accessoryRight={renderIcon}
                        captionIcon={(p) => <Icon {...p} name="alert-circle-outline" />}
                        value={code.toUpperCase()}
                        secureTextEntry={secureTextEntry}
                        onChangeText={(v) => setCode(v.toUpperCase())}
                    />

                    <View style={styles.button}>
                        <Button
                            status={!auth ? 'primary' : 'success'}
                            accessoryRight={(p) => <Icon {...p} name={!auth ? 'lock' : 'unlock'} />}
                            disabled={!code || code.length < 6 || loading}
                            onPress={handleCheckCode}
                        >
                            Check Code
                        </Button>
                    </View>
                </>
            </SafeAreaView>
        </View>
    );
};

export default CheckCode;
