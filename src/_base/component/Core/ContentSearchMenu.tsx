import { RefObject, useEffect } from 'react';

// Hook này giúp xử lý sự kiện click bên ngoài của một phần tử DOM
const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    // Hàm được gọi khi click bên ngoài phần tử
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Thêm sự kiện click vào document
    document.addEventListener('mousedown', handleClickOutside);

    // Dọn dẹp sự kiện
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export default useOutsideClick;
