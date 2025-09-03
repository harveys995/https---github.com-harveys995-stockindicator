type ButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    loading?: boolean;
  };
  
  export function PrimaryButton({ onClick, disabled, loading, children }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className="
          bg-white/40 backdrop-blur-md rounded-3xl shadow-md p-6
          inline-flex items-center gap-2
          px-4 py-2
          text-black
          hover:bg-blue-700
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        "
      >
        {loading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent"
            aria-hidden
          />
        )}
        <span>{loading ? 'Scanning…' : children}</span>
      </button>
    );
  }
  