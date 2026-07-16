import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
const PageNotFound = () => {
  // const themeContext = useContext(ThemeContext);
  // const isDarkTheme = themeContext.theme.includes('dark');
  const isDarkTheme = false;
  // const pageNotFound = isDarkTheme ? pageNotFoundDark : pageNotFoundLight;
  // const pageNotFound2x = isDarkTheme ? pageNotFoundDark2x : pageNotFoundLight2x;
  const navigate = useNavigate();
  return (
    <div>
      <p>Chúng tôi không thể tìm thấy trang theo yêu cầu của bạn !</p>
    </div>
  );
};

export default PageNotFound;
