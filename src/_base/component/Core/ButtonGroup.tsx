import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import "./btngroup.css";
import { useRef, useState } from "react";
import useOutsideClick from "./ContentSearchMenu";
function ButtonGroup({
  icon,
  list,
  style,
  text,
  cssClass,
}: {
  cssClass: string;
  text?: string;
  icon: JSX.Element;
  list: any;
  style?: React.CSSProperties;
}) {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Tạo một ref cho phần tử dropdown với kiểu HTMLDivElement

  // Hàm để xử lý khi click bên ngoài dropdown
  const handleClose = () => {
    setShowMenu(!showMenu);
  };

  const toggleBtn = () => {
    setShowMenu(!showMenu);
  };
  useOutsideClick(dropdownRef, handleClose);

  return (
    <>
      <div  className="btn-group-c">
        <ButtonComponent   className={cssClass} style={style} onClick={toggleBtn}>
          <span>{text}</span>
          {icon}
        </ButtonComponent>
        {showMenu && <div className="btn-group-c-content">{list}</div>}
      </div>
    </>
  );
}

export default ButtonGroup;
