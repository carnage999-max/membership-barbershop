"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-center" 
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0D1117',
          color: '#F4F1EA',
          border: '1px solid rgba(223, 186, 110, 0.2)',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          fontSize: '14px',
          fontWeight: 600
        },
        success: {
          iconTheme: {
            primary: '#DFBA6E', 
            secondary: '#0D1117',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC143C',
            secondary: '#F4F1EA',
          },
        }
      }} 
    />
  );
}
