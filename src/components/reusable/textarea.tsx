interface TextAreaFieldProps {
    label: string;
    name: string;
    value: string;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;    
}

export function TextAreaField({
    label,
    name,
    value,
    error,
    placeholder,
    required,
    disabled,
    rows = 3, 
    onChange
}: TextAreaFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                rows={rows}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder={placeholder}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}