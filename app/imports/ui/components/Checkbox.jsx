import React from 'react';

// eslint-disable-next-line react/prop-types
const Checkbox = ({ id, type, name, handleClick, isChecked }) => (
  <input
    id={id}
    name={name}
    type={type}
    onChange={handleClick}
    checked={isChecked}
  />
);

export default Checkbox;
