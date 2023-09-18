export { RouteProp } from '@react-navigation/native';
export { StackNavigationProp } from '@react-navigation/stack';

// https://reactnavigation.org/docs/typescript
export type RootStackParamList = {
    Login: undefined;
    CheckCode: undefined;
    QuizIndex: undefined;
    Quiz: {
        category: string;
        color: string;
    };
};

// TODO: Redefine the user question/result
// into a packed object.
export type UserType = {
    'Full Name': string;
    'Email': string;
    'Birthday': string;
    'Access Code': string;
    'Results': any;
    [k: string]: string;
};

export type QuestionExpression = {
    category: string;
};

export type Aggregator = {
    limit: number;
    offset: number;
    sortBy?: 'asc' | 'desc';
    sortMethod?: 'date';
    castNumbers?: string[];
    singleObject?: boolean;
};

export type Category = {
    name: string;
    quantity: number;
    icon?: string;
};

export type QuestionType = {
    ID: string;
    Category: string;
    Description: string;
    Result: number;
    'Answer 1': string;
    'Answer 2': string;
    'Answer 3': string;
    'Answer 4': string;
};
