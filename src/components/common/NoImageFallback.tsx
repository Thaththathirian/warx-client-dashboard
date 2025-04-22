import { ImageIcon } from "lucide-react";

// Add this helper component at the top of your file
function NoImageFallback({ className, id }: { className?: string; id?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center text-muted-foreground ${className}`} id={id}>
      <ImageIcon className="h-10 w-10 mb-2" />
      <span>No image</span>
    </div>
  );
}

export default NoImageFallback;