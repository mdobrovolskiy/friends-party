import { createSlice } from '@reduxjs/toolkit'

export const wordsSlice = createSlice({
  name: 'wordsSlice',
  initialState: {
    words: [],
  },
  reducers: {
    setSessionWords(state, action) {
      state.words = action.payload
    },
  },
})

export const { setSessionWords } = wordsSlice.actions

export default wordsSlice.reducer
