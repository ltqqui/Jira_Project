// drawerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';

export type ComponentInfo = {
  type: string;
  props: any;
};

export type DrawerState = {
  visible: boolean;
  title: string;
  component: any;
  callFunction: any;
};

const initialState: DrawerState = {
  visible: false,
  title: '',
  component: '',
  callFunction: null,
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setComponent: (state, action: PayloadAction<any | null>) => {
      state.component = action.payload;
    },
    setCallFunction: (state, action: PayloadAction<any>) => {
      state.callFunction = action.payload;
    },
  },
});

export const { setVisible, setTitle, setComponent, setCallFunction } = drawerSlice.actions;

export default drawerSlice.reducer;
