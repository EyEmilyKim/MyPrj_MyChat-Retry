import { useState } from 'react';

export default function useSelect(initialIndex) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];

    setSelectedIndex(selectedIndex);
    setSelectedValue(selectedOption.value);
    setSelectedText(selectedOption.text);
  };

  return [handleSelectChange, selectedValue, setSelectedValue, selectedText, selectedIndex];
}
