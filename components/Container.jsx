export default function Container({ children, className = "" }) {
  return (
    <div className={`max-w-[1600px] mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}
