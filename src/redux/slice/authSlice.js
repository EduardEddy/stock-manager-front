import { createSlice } from '@reduxjs/toolkit'

/*const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}*/

const initialState = (() => {
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (savedUser && savedToken) {
    return {
      user: JSON.parse(savedUser),
      token: savedToken,
      isAuthenticated: true,
      loading: false,
      error: null,
    };
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
})();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
    },
    loginFailure: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    logout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
