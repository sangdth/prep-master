import React, {
    ReactNode,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { Animated } from 'react-native';

type Props = {
    trigger: Boolean;
    timeIn?: number;
    timeOut?: number;
    children: ReactNode;
};

const Fading = (props: Props) => {
    const {
        trigger,
        timeIn = 600,
        timeOut = 600,
        children,
    } = props;

    const fadeValue = useRef(new Animated.Value(0)).current;

    const fadeIn = useCallback(() => {
        Animated.timing(fadeValue, {
            toValue: 1,
            duration: timeIn,
            useNativeDriver: true,
        }).start();
    }, [fadeValue, timeIn]);

    const fadeOut = useCallback(() => {
        Animated.timing(fadeValue, {
            toValue: 0,
            duration: timeOut,
            useNativeDriver: true,
        }).start();
    }, [fadeValue, timeOut]);

    useEffect(() => {
        if (trigger) {
            fadeIn();
        } else {
            fadeOut();
        }
    }, [trigger, fadeIn, fadeOut]);

    return (
        <Animated.View style={{ opacity: fadeValue }}>
            {children}
        </Animated.View>
    );
};

Fading.defaultProps = {
    timeIn: 600,
    timeOut: 600,
};

export default Fading;
