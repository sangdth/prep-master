import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Icon, Input as KittenInput } from '@ui-kitten/components';
import { InputProps } from '@ui-kitten/components/ui';

interface Props extends InputProps {
    clearable?: Boolean;
    value: string;
    onChangeText: (s: string) => void;
}

const Input = (props: Props) => {
    const {
        accessoryRight,
        clearable = true,
        value,
        onChangeText,
        ...rest
    } = props;

    const renderIcon = (iconProps: any) => (
        <TouchableWithoutFeedback onPress={() => onChangeText('')}>
            <Icon {...iconProps} name="close" />
        </TouchableWithoutFeedback>
    );

    return (
        <KittenInput
            {...rest}
            value={value}
            onChangeText={onChangeText}
            accessoryRight={clearable && value && !accessoryRight ? renderIcon : accessoryRight}
        />
    );
};

Input.defaultProps = {
    clearable: true,
};

export default Input;
