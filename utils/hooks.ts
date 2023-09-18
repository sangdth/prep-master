import { useCallback, useEffect } from 'react';
import {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
} from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserType } from './types';
import { searchUser } from './axios';
import { useStateValue } from './state';

export const makeKey = (email: string) => email.split('@').join('_at_');

export const makeEmail = (key: string) => key.split('_at_').join('@');

export const useAuth = () => {
  const { state: { auth, user }, dispatch } = useStateValue();

  const getUser = useCallback(async (email: string) => {
    if (user && user.Email === email) {
      return user;
    }

    const foundUser = await searchUser(email);

    dispatch({
      type: 'SET_USER',
      user: foundUser,
    });

    return foundUser;
  }, [user, dispatch]);

  useEffect(() => {
    const checkSecureStore = async () => {
      try {
        const email = await AsyncStorage.getItem('current-email');

        if (email) {
          const foundCode = await getItemAsync(makeKey(email));

          if (foundCode) {
            const response = await getUser(email);
            if (response && response['Access Code'] === foundCode) {
              dispatch({ type: 'SET_AUTH', auth: response });
            }
          }
        }
      } catch (e) {
        console.error('Error[checkSecureStore]: ', e.message);
      }
    };

    if (!auth) {
      checkSecureStore();
    }
  }, [auth, dispatch, getUser]);

  const logout = async (data?: UserType) => {
    try {
      dispatch({ type: 'SET_AUTH', auth: undefined });
      if (data) {
        await deleteItemAsync(makeKey(data.Email));
      }
    } catch (e) {
      console.error('Error[logout]: ', e.message);
    }
  };

  const login = async (data: UserType) => {
    try {
      dispatch({ type: 'SET_AUTH', auth: data });
      await setItemAsync(makeKey(data.Email), data['Access Code']);
    } catch (e) {
      console.error('Error[login]: ', e.message);
    }
  };

  return { user, auth, getUser, login, logout };
};

/*
 * Currently react-use has some packages use `window` and `document`
 * as global object, it does not support in here, so we walk around.
 * https://github.com/streamich/react-use/issues/829
 */
export { default as useDebounce } from 'react-use/lib/useDebounce';
export { default as useTimeout } from 'react-use/lib/useTimeout';
export { default as useTimeoutFn } from 'react-use/lib/useTimeoutFn';
