import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isDefault: true,
}

const defaultPageSlice = createSlice({
  name: 'defaultPage',
  initialState,
  reducers: {
    closeDefault: (state) => {
      state.isDefault = false
    },
  },
})

export const { closeDefault } = defaultPageSlice.actions

export default defaultPageSlice.reducer
