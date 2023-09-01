function Elipses({
    fill = 'currentColor',
    filled,
    size,
    height,
    width,
    label,
    ...props
  }) {
    return (
        <svg width={size || width || 24} height={size || height || 24}  viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M 16 6 C 14.894531 6 14 6.894531 14 8 C 14 9.105469 14.894531 10 16 10 C 17.105469 10 18 9.105469 18 8 C 18 6.894531 17.105469 6 16 6 Z M 16 14 C 14.894531 14 14 14.894531 14 16 C 14 17.105469 14.894531 18 16 18 C 17.105469 18 18 17.105469 18 16 C 18 14.894531 17.105469 14 16 14 Z M 16 22 C 14.894531 22 14 22.894531 14 24 C 14 25.105469 14.894531 26 16 26 C 17.105469 26 18 25.105469 18 24 C 18 22.894531 17.105469 22 16 22 Z"/>
        </svg>
    );
}

export default Elipses;
