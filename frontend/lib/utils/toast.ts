// lib/utils/toast.ts

import React from 'react';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is installed. If not, will need to install or use a simpler ID generation.

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // in milliseconds
}

type ToastCallback = (toast: ToastMessage) => void;

class ToastEmitter {
  private listeners: ToastCallback[] = [];

  subscribe(callback: ToastCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  emit(toast: ToastMessage) {
    this.listeners.forEach(listener => listener(toast));
  }
}

export const toastEmitter = new ToastEmitter();

export const showToast = (message: string, type: ToastType, duration: number = 3000) => {
  const id = uuidv4(); // Generate a unique ID for each toast
  toastEmitter.emit({ id, message, type, duration });
};
