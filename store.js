import { configureStore } from '@reduxjs/toolkit'
import defaultPageReducer from './features/default-page/defaultPageSlice'

export const store = configureStore({
  reducer: {
    defaultPage: defaultPageReducer,
  },
})
