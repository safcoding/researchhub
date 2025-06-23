interface SelectFieldProps{
    label: string;
    name: string;
    value: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    options: string[];
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SelectField({
    label,
    name,
    value,
    error,
    required,
    disabled,
    options,
    placeholder,
    onChange
}: SelectFieldProps) {
    return(
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                 className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                 } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                required={required}        
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}                
            </select>   
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}