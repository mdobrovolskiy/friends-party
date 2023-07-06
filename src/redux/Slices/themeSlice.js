import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
  name: 'themeSlice',
  initialState: {
    lightTheme: true,
  },
  reducers: {
    setTheme(state, action) {
      state.lightTheme = action.payload
    },
  },
})

export const { setTheme } = themeSlice.actions

export default themeSlice.reducer
