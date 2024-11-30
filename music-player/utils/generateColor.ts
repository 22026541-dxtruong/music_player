export const generateGenreColor = (genre_id: number): string => {
    const r = Math.floor((Math.sin(genre_id) * 127 + 128));  // Sử dụng hàm sin để tạo sự phân bố đều
    const g = Math.floor((Math.cos(genre_id) * 127 + 128));  // Sử dụng hàm cos để tạo sự phân bố đều
    const b = Math.floor((Math.tan(genre_id) * 127 + 128));  // Sử dụng hàm tan để tạo sự phân bố đều

    return `rgb(${r}, ${g}, ${b})`;
};

export const generateUserColor = (username: string) => {
    if (!username) return { 'backgroundColor': '8B5DFF', 'textColor': 'ffffff' }
    const firstChar = username.charAt(0).toLowerCase();

    const charCode = firstChar.charCodeAt(0);

    const r = (charCode * 123) % 256;
    const g = (charCode * 234) % 256;
    const b = (charCode * 345) % 256;

    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    const textColor = brightness < 128 ? 'ffffff' : '000000';

    const backgroundColor = `${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;

    return { backgroundColor, textColor };
};