"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
  alert: (options: Omit<ConfirmationOptions, 'cancelText'>) => Promise<void>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    showCancel?: boolean;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    showCancel: true,
  });

  const confirm = useCallback((options: ConfirmationOptions) => {
    return new Promise<boolean>((resolve) => {
      setModalState({
        isOpen: true,
        ...options,
        showCancel: true,
        resolve,
      });
    });
  }, []);

  const alert = useCallback((options: Omit<ConfirmationOptions, 'cancelText'>) => {
    return new Promise<void>((resolve) => {
      setModalState({
        isOpen: true,
        ...options,
        showCancel: false,
        resolve: () => resolve(),
      });
    });
  }, []);

  const handleConfirm = () => {
    modalState.resolve?.(true);
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (modalState.showCancel) {
      modalState.resolve?.(false);
      setModalState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <ConfirmationContext.Provider value={{ confirm, alert }}>
      {children}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        isDanger={modalState.isDanger}
        showCancel={modalState.showCancel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error("useConfirmation must be used within a ConfirmationProvider");
  }
  return context;
}
