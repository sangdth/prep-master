import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';
import { setItemAsync } from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    Button,
    Fading,
    Icon,
    ImageBackground,
    Input,
    Keyboard,
    KeyboardAvoidingView,
    LoadingIndicator,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from '../components';
import {
    createUser,
    generateCode,
    useAuth,
    useDebounce,
    sendMail,
    StackNavigationProp,
    RootStackParamList,
    makeKey,
} from '../utils';

const ArrowIcon = (props: any) => (
    <Icon {...props} name="arrow-forward" />
);

// const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 40,
        justifyContent: 'space-between',
    },
    text: {
        padding: 10,
    },
    upper: {
        color: '#FFFFFF',
        textAlign: 'right',
        fontSize: 100,
        letterSpacing: -0.2,
    },
    below: {
        color: '#FFFFFF',
        textAlign: 'right',
        fontSize: 40,
        letterSpacing: -0.05,
        paddingRight: 10,
    },
    form: {
        padding: 20,
    },
    button: {
        marginTop: 20,
    },
});

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const Login = (props: Props) => {
    const { navigation } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');

    const isValidEmail = useMemo(() => email.split('@').length > 1, [email]);

    const { user, auth, getUser } = useAuth();
    // const { dispatch } = useStateValue();

    const handleForward = async () => {
        setLoading(true);

        if (!user) {
            const code = generateCode();
            await createUser({
                data: {
                    Email: email,
                    'Full Name': fullName,
                    'Access Code': code,
                },
            });
            await setItemAsync(makeKey(email), code);
            await sendMail({
                toEmails: [email],
                subject: 'PREP Master Access Code',
                message: `Your Access Code: ${code}.\n Please keep it secret.`,
            });
            await getUser(email);
        } else if (auth) {
            setLoading(false);
            navigation.navigate('QuizIndex');
        }
        setLoading(false);
        navigation.navigate('CheckCode');
    };

    useDebounce(() => {
        if (isValidEmail && !auth) {
            getUser(email);
        }
    }, 600, [email]);

    // When user comes back, detect the email in AsyncStorage
    useEffect(() => {
        const checkStorage = async () => {
            const foundEmail = await AsyncStorage.getItem('current-email');
            if (foundEmail) {
                setEmail(foundEmail);
            }
        };
        checkStorage();
    }, []);

    useDebounce(() => {
        if (auth) {
            navigation.navigate('QuizIndex');
        }
    }, 100, [auth]);

    const renderIcon = (iconProps: any) => (
        <TouchableWithoutFeedback onPress={() => setEmail('')}>
            <Icon {...iconProps} name="close" />
        </TouchableWithoutFeedback>
    );

    const loginButtonText = useMemo(() => {
        if (user) {
            return `Login as ${user['Full Name']}`;
        }
        return 'Sign me up!';
    }, [user]);

    return (
        <View style={styles.wrapper}>
            <ImageBackground
                source={require('../assets/background/green.jpg')}
                style={styles.backgroundImage}
            >
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            <View style={styles.text}>
                                <Text style={styles.upper} category="h1">
                                    PREP
                                </Text>
                                <Text style={styles.below} category="h1">
                                    Master
                                </Text>
                            </View>
                            <View style={styles.form}>
                                <Input
                                    label="Email"
                                    size="large"
                                    disabled={loading}
                                    placeholder="email@example.com"
                                    value={email}
                                    accessoryRight={email ? renderIcon : undefined}
                                    onChangeText={(v) => setEmail(v.toLowerCase())}
                                />
                                {isValidEmail && (
                                    <Fading trigger={isValidEmail}>
                                        <Input
                                            label="Full Name"
                                            size="large"
                                            disabled={!!user || !isValidEmail}
                                            placeholder="Enter your name..."
                                            clearable={!user}
                                            value={!user ? fullName : user['Full Name']}
                                            onChangeText={(v) => setFullName(v)}
                                        />
                                    </Fading>
                                )}

                                {isValidEmail && (
                                    <Fading trigger={isValidEmail}>
                                        <View style={styles.button}>
                                            <Button
                                                disabled={!isValidEmail || (!user && !fullName)}
                                                accessoryRight={loading ? LoadingIndicator : ArrowIcon}
                                                onPress={handleForward}
                                            >
                                                {loginButtonText}
                                            </Button>
                                        </View>
                                    </Fading>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
};

export default Login;
