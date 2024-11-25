// src/components/ColorSelector.jsx

import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import './../css/products.css';

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
    const updatedColors = [...colors];
    const draggedColor = updatedColors[dragIndex];
    updatedColors.splice(dragIndex, 1);
    updatedColors.splice(hoverIndex, 0, draggedColor);
    setColors(updatedColors);
  };

  return (
    <div className="color-selector">
      <label>Colors</label>
      <div className="selected-colors">
        {colors.map((color, index) => (
          <div
            key={index}
            className="color-item"
            draggable
            onDragStart={() => setDraggingIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              handleSortColors(draggingIndex, index);
              setDraggingIndex(null);
            }}
          >
            <div
              className="color-circle"
              style={{ backgroundColor: color.hex }}
            ></div>
            <p>{color.name}</p>
            <button
              type="button"
              onClick={() => handleRemoveColor(index)}
              className="remove-color-btn"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setShowSuggestions(!showSuggestions)}
      >
        {showSuggestions ? 'Hide Colors' : 'Add Colors'}
      </button>
      {showSuggestions && (
        <div className="color-suggestions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowColorPicker(true)}
          >
            Add Another Color
          </button>
          <div className="main-colors">
            {MAIN_COLORS.map((color, index) => (
              <div
                key={index}
                className="color-suggestion"
                onClick={() => handleAddColor(color)}
              >
                <div
                  className="color-circle"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <p>{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {showColorPicker && (
        <div className="color-picker-popup">
          <div
            className="color-picker-overlay"
            onClick={() => setShowColorPicker(false)}
          ></div>
          <div className="color-picker-content">
            <ChromePicker
              color={newColor}
              onChangeComplete={(color) => setNewColor(color.hex)}
            />
            <input
            className='input1'
              type="text"
              placeholder="Color Name"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
            />
            <input
              className='input2'
              type="text"
              placeholder="Color Name in English"
              value={newColorNameEn}
              onChange={(e) => setNewColorNameEn(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary "
              onClick={() => {
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
              className="btn btn-secondary btn-color"
              onClick={() => setShowColorPicker(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
