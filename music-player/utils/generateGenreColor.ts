export const generateGenreColor = (genre_id: number): string => {
    const r = Math.floor((Math.sin(genre_id) * 127 + 128));  // Sử dụng hàm sin để tạo sự phân bố đều
    const g = Math.floor((Math.cos(genre_id) * 127 + 128));  // Sử dụng hàm cos để tạo sự phân bố đều
    const b = Math.floor((Math.tan(genre_id) * 127 + 128));  // Sử dụng hàm tan để tạo sự phân bố đều

    return `rgb(${r}, ${g}, ${b})`;
};