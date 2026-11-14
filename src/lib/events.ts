"use client";

// Simple pub/sub and scroll helper for clean cross-component communication
type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Set<Listener<T>> = new Set();

  subscribe(listener: Listener<T>) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(data: T) {
    this.listeners.forEach((listener) => listener(data));
  }
}

export const serviceSelectionEvent = new EventEmitter<string>();
export const productSelectionEvent = new EventEmitter<number>();
export const productProgressEvent = new EventEmitter<number>();

export function scrollToSection(sectionId: string, preselectedService?: string) {
  if (preselectedService) {
    serviceSelectionEvent.emit(preselectedService);
  }

  const el = document.getElementById(sectionId.replace(/^#/, ""));
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
