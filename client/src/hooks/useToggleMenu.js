import React, { useState } from 'react';

export default function useToggleMenu(initialState) {
  const [isMenuOpen, setMenuOpen] = useState(initialState);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return {
    isMenuOpen,
    toggleMenu,
  };
}
