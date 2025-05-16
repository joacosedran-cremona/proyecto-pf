"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2 className="text-white">Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
