// src/components/ColorSelector.jsx

import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { toast } from 'react-toastify'; // Import toast for notifications

// Define the main 20 colors (you can customize this list)
const MAIN_COLORS = [
  { name: 'Red', hex: '#FF0000', nameEn: 'Red' },
  { name: 'Green', hex: '#00FF00', nameEn: 'Green' },
  { name: 'Blue', hex: '#0000FF', nameEn: 'Blue' },
  { name: 'Yellow', hex: '#FFFF00', nameEn: 'Yellow' },
  { name: 'Black', hex: '#000000', nameEn: 'Black' },
  { name: 'White', hex: '#FFFFFF', nameEn: 'White' },
  { name: 'Orange', hex: '#FFA500', nameEn: 'Orange' },
  { name: 'Purple', hex: '#800080', nameEn: 'Purple' },
  { name: 'Pink', hex: '#FFC0CB', nameEn: 'Pink' },
  { name: 'Brown', hex: '#A52A2A', nameEn: 'Brown' },
  { name: 'Gray', hex: '#808080', nameEn: 'Gray' },
  { name: 'Cyan', hex: '#00FFFF', nameEn: 'Cyan' },
  { name: 'Magenta', hex: '#FF00FF', nameEn: 'Magenta' },
  { name: 'Lime', hex: '#00FF00', nameEn: 'Lime' },
  { name: 'Maroon', hex: '#800000', nameEn: 'Maroon' },
  { name: 'Navy', hex: '#000080', nameEn: 'Navy' },
  { name: 'Olive', hex: '#808000', nameEn: 'Olive' },
  { name: 'Teal', hex: '#008080', nameEn: 'Teal' },
  { name: 'Silver', hex: '#C0C0C0', nameEn: 'Silver' },
  { name: 'Gold', hex: '#FFD700', nameEn: 'Gold' },
];

const ColorSelector = ({ colors, setColors }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#FFFFFF');
  const [newColorName, setNewColorName] = useState('');
  const [newColorNameEn, setNewColorNameEn] = useState('');
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleAddColor = (color) => {
    setColors([...colors, color]);
  };

  const handleRemoveColor = (index) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
  };

  const handleSortColors = (dragIndex, hoverIndex) => {
    if (dragIndex === hoverIndex) return;
    const updatedColors = [...colors];
    const [draggedColor] = updatedColors.splice(dragIndex, 1);
    updatedColors.splice(hoverIndex, 0, draggedColor);
    setColors(updatedColors);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Colors</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md p-2 shadow-sm"
            draggable
            onDragStart={() => setDraggingIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              handleSortColors(draggingIndex, index);
              setDraggingIndex(null);
            }}
          >
            <div
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: color.hex }}
            ></div>
            <p className="text-sm">{color.name}</p>
            <button
              type="button"
              onClick={() => handleRemoveColor(index)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              title="Remove Color"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm 
                   font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setShowSuggestions(!showSuggestions)}
      >
        {showSuggestions ? 'Hide Colors' : 'Add Colors'}
      </button>
      {showSuggestions && (
        <div className="mt-4 space-y-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm 
                       font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => setShowColorPicker(true)}
          >
            Add Another Color
          </button>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MAIN_COLORS.map((color, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md 
                           transition duration-150 ease-in-out"
                onClick={() => handleAddColor(color)}
              >
                <div
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <p className="text-sm">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <ChromePicker
              color={newColor}
              onChangeComplete={(color) => setNewColor(color.hex)}
              className="mb-4"
            />
            <input
              type="text"
              placeholder="Color Name"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 
                         rounded-md focus:outline-none focus:ring-indigo-500 
                         focus:border-indigo-500 sm:text-sm mb-2"
            />
            <input
              type="text"
              placeholder="Color Name in English"
              value={newColorNameEn}
              onChange={(e) => setNewColorNameEn(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 
                         rounded-md focus:outline-none focus:ring-indigo-500 
                         focus:border-indigo-500 sm:text-sm mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm 
                           font-medium rounded-md shadow-sm text-white bg-indigo-600 
                           hover:bg-indigo-700 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  if (newColorName.trim() === '' || newColorNameEn.trim() === '') {
                    toast.error('Please provide both color names.');
                    return;
                  }
                  handleAddColor({
                    name: newColorName,
                    nameEn: newColorNameEn,
                    hex: newColor,
                  });
                  setShowColorPicker(false);
                  setNewColor('#FFFFFF');
                  setNewColorName('');
                  setNewColorNameEn('');
                }}
              >
                Add Color
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm 
                           font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowColorPicker(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
