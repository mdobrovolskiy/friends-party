import { createSlice } from '@reduxjs/toolkit'

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
    userName: '',
    id: 0,
    avatar: '',
  },
  reducers: {
    setCurrentUser(state, action) {
      state.userName = action.payload[0]
      state.id = action.payload[1]
      state.avatar = action.payload[2]
    },
  },
})

export const { setCurrentUser } = currentUserSlice.actions

export default currentUserSlice.reducer
