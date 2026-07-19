import { Platform } from 'react-native';

const envApiUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL = envApiUrl || (Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://127.0.0.1:5000/api');
