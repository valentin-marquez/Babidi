import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const inputRef = useRef();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setIsButtonActive(!showPassword);
  };

  // Exponer el inputRef al componente padre
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    inputRef: inputRef.current,
    blur: () => {
      inputRef.current.blur();
    }
  }));

  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text">Contraseña</span>
        {props.error && (
          <span className="label-text-alt text-error">
            {props.error}
          </span>
        )}
      </label>
      <div className={`relative ${props.error ? 'input-error focus:input-error' : ''}`}>
        <input
          ref={inputRef} // Asignar la referencia al input
          type={showPassword ? 'text' : 'password'}
          placeholder="Contraseña"
          value={props.value}
          onChange={props.onChange}
          onKeyUp={props.onKeyUp}
          className={`input input-bordered w-full hover:input-primary focus:input-primary transition-colors ${props.error ? 'input-error focus:input-error' : ''}`}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className={`absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary cursor-pointer transition-colors ${isButtonActive ? 'text-primary' : ''}`}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
});

export default PasswordInput;
