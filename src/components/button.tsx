export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {children}
    </button>
  );
}
