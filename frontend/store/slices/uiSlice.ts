import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface UIState {
  isModalOpen: boolean;
  modalContent: string | null;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
}

const initialState: UIState = {
  isModalOpen: false,
  modalContent: null,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.isModalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalContent = null;
    },
    showNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>) => {
      state.notification = action.payload;
    },
    hideNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { openModal, closeModal, showNotification, hideNotification } = uiSlice.actions;

export const selectIsModalOpen = (state: RootState) => state.ui.isModalOpen;
export const selectModalContent = (state: RootState) => state.ui.modalContent;
export const selectNotification = (state: RootState) => state.ui.notification;

export default uiSlice.reducer;
