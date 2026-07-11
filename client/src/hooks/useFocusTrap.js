import { useEffect, useRef } from "react";

/**
 * Custom hook to trap keyboard focus within a container element.
 * Perfect for accessible modals, dialogs, and slide-over drawers.
 *
 * @param {import('react').RefObject<HTMLElement>} containerRef Ref of the dialog/drawer container
 * @param {boolean} isActive Controls whether the trap is active
 */
function useFocusTrap(containerRef, isActive) {
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    // Cache the currently focused element to restore it on close
    previousFocusRef.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Query standard focusable elements
    const focusableElementsSelector =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

    const getFocusableElements = () => {
      return Array.from(container.querySelectorAll(focusableElementsSelector)).filter(
        (el) => el.tabIndex !== -1 && el.offsetWidth > 0 && el.offsetHeight > 0
      );
    };

    // Auto-focus the first focusable element inside the container
    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Wrap focus to the last element if tabbing backward on the first element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Wrap focus to the first element if tabbing forward on the last element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the previously active element
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, containerRef]);
}

export { useFocusTrap };
