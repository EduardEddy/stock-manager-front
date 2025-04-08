import { loginStart, loginSuccess, loginFailure } from './slice/authSlice'
//import { post } from '../services/httpClient'
import { post } from '../http/ApiService'

export const login = (email, password) => async (dispatch) => {
  dispatch(loginStart())

  try {
    const response = await post('/login', { email, password });
    const userData = {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
      lastName: response.data.lastName,
      role: response.data.role
    };

    const token = response.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch(loginSuccess({ user: userData, token }))
    return { success: true };
  } catch (error) {
    const errorMessage = error?.message || 'Error desconocido'
    dispatch(loginFailure(errorMessage))
    return { success: false, error: errorMessage };
  }
}
