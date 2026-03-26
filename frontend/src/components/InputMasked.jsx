import React from 'react';

export default function InputMasked({
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  maskFunction,
  maxLength,
  type = 'text',
  error = '',
  required = false,
}) {
  const handleChange = (e) => {
    let { value } = e.target;
    
    // Aplicar máscara se fornecida
    if (maskFunction) {
      value = maskFunction(value);
    }
    
    // Limitar caracteres apenas para números se for tipo tel/number
    if (type === 'tel' || type === 'number') {
      value = value.replace(/[^0-9]/g, '');
    }
    
    onChange({ target: { name, value } });
  };

  return (
    <div className="input-container">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        maxLength={maxLength}
        required={required}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}