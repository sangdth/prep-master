import axios from 'axios';
import {
  Category,
  UserType,
  QuestionType,
  QuestionExpression,
  Aggregator,
} from './types';

const apiUrl = `https://sheetdb.io/api/v1/${process.env.EXPO_PUBLIC_SHEETDB_ID}`;

const awsUrl = 'https://e7we3ix1o5.execute-api.us-east-1.amazonaws.com/Prod/send';

const apiHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${process.env.EXPO_PUBLIC_SHEETDB_API_KEY}`,
};

const awsHeaders = {
  'Content-Type': 'application/json',
  Authorization: process.env.EXPO_PUBLIC_AWS_TOKEN,
};

export const getCategories = async (): Promise<Category[] | undefined> => {
  const { data } = await axios.get(apiUrl, { headers: apiHeaders });

  if (data) {
    const tmp = data.reduce((acc: any, current: any) => ({
      ...acc,
      [current.Category || 'UNSPECIFIED']: (acc[current.Category] || 0) + 1,
    }), {});

    return Object.keys(tmp)
      .filter((k) => k !== 'UNSPECIFIED') // do not show unnamed category
      .map((k: string) => ({
        name: k,
        quantity: tmp[k],
      }));
  }
  return undefined;
};

export const getQuestions = async (
  aggregator: Aggregator,
  expression: QuestionExpression,
): Promise<QuestionType[]> => {
  const { limit, offset } = aggregator;
  const { category } = expression;

  const queryUrl = `${apiUrl}/search`;

  const params = {
    limit,
    offset,
    cast_numbers: 'Result',
    Category: category,
  };

  const { data } = await axios.get(queryUrl, { headers: apiHeaders, params });

  return data;
};

// This function is to find a specific user with email
// https://sheetdb.io/api/v1/${id}/search?sheet=Users&Email=example@gmail.com
export const searchUser = async (
  email: string,
): Promise<UserType | undefined> => {
  const queryUrl = `${apiUrl}/search?sheet=Users&Email=${email}`;

  const response = await axios.get(queryUrl, { headers: apiHeaders });

  if (response && response.data && response.data.length >= 1) {
    return response.data[0];
  }

  return undefined;
};

/*
 * Function to create new record for user
 */
export const createUser = async (
  inputData: any,
) => {
  const queryUrl = `${apiUrl}?sheet=Users`;

  const response = await axios.post(
    queryUrl,
    inputData,
    { headers: apiHeaders },
  );

  if (response && response.data) {
    return response.data;
  }

  return undefined;
};

// Use this function to update the user record
// https://sheetdb.io/api/v1/{id}/Email/example@gmail.com?sheet=Users
export const updateUser = async (userInput: any): Promise<any> => {
  const queryUrl = `${apiUrl}/Email/${userInput.Email}?sheet=Users`;

  const response = await axios.put(queryUrl, { data: [userInput] }, { headers: apiHeaders });

  if (response && response.data) {
    return response.data;
  }

  return undefined;
};

export const sendMail = async (
  inputData: any,
): Promise<any> => {
  const response = await axios.post(awsUrl, inputData, { headers: awsHeaders });

  return response;
};
