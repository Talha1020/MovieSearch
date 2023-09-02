import { useState } from "react";

const ContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
};
const StarComponentStyle = {
  display: "flex",
  // gap: "16px",
};

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  message = [],
  defaultRating = 0,
  className,
  onUserRating,
}) {
  const TextStyle = {
    lineHeight: "1",
    margin: "0",
    color: color,
    fontSize: `${size / 1.5}px`,
  };

  const [rating, setRating] = useState(defaultRating);
  const [tempeRating, setTempRating] = useState(0);
  return (
    <div style={ContainerStyle} className={className}>
      <div style={StarComponentStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRating={
              () => {
                setRating(() => i + 1);
                onUserRating(() => i + 1);
              }
              //
            }
            onHoverEnter={() => setTempRating(() => i + 1)}
            onHoverLeave={() => setTempRating(0)}
            full={tempeRating ? tempeRating >= i + 1 : rating >= 1 + i}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={TextStyle}>
        {message.length === maxRating
          ? message[tempeRating - 1] || message[rating - 1] || ""
          : tempeRating || rating || ""}
      </p>
    </div>
  );
}

function Star({
  onRating,
  onHoverEnter,
  onHoverLeave,
  full,
  color,
  size,
  onUserRating,
}) {
  const StarStyle = {
    display: "block",
    height: `${size}px`,
    width: `${size}px`,
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={StarStyle}
      onClick={onRating}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
          onClick={onRating}
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          height={size}
          width={size}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
