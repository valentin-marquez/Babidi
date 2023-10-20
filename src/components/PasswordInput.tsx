import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function PasswordInput(props) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text">Contraseña</span>
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Contraseña"
          value={props.value}
          onChange={props.onChange}
          className={`input input-bordered w-full hover:input-primary focus:input-primary transition-colors ${props.error ? 'input-error focus:input-error' : ''}`}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary cursor-pointer transition-colors"
        >
          {showPassword ? <EyeOff size={20}/> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
