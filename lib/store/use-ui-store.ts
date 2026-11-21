// lib/store/use-ui-store.ts
// Lightweight UI-only state (modal visibility) shared across the shell.

'use client';

import { create } from 'zustand';

interface UiState {
  commandPaletteOpen: boolean;
  bookingWizardOpen: boolean;
  notificationsOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  openBookingWizard: () => void;
  closeBookingWizard: () => void;
  toggleNotifications: () => void;
  closeNotifications: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  commandPaletteOpen: false,
  bookingWizardOpen: false,
  notificationsOpen: false,
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  openBookingWizard: () => set({ bookingWizardOpen: true }),
  closeBookingWizard: () => set({ bookingWizardOpen: false }),
  toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),
  closeNotifications: () => set({ notificationsOpen: false }),
}));
