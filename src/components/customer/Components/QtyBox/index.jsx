import Button from "@mui/material/Button";
import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

const QtyBox = ({ stock, onChangeQty }) => {
  const [qtyVal, setQtyVal] = useState(1);

  const plusQty = () => {
    if (qtyVal < stock) {
      const newQty = qtyVal + 1;
      setQtyVal(newQty);
      onChangeQty(newQty); // Truyền giá trị mới lên component cha
    }
  };

  const minusQty = () => {
    if (qtyVal > 1) {
      const newQty = qtyVal - 1;
      setQtyVal(newQty);
      onChangeQty(newQty); // Truyền giá trị mới lên component cha
    }
  };

  return (
    <div className="qtyBox flex items-center relative">
      <input
        type="number"
        className="w-full h-[40px] p-2 pl-5 text-[15px] focus:outline-none border border-[rgba(0,0,0,0.2)] rounded-md"
        value={qtyVal}
        readOnly
      />
      <div className="flex items-center flex-col justify-between h-[40px] absolute top-0 right-0 z-50">
        <Button
          className="!min-w-[30px] !w-[30px] !h-[20px] !text-[#000] !rounded-none hover:!bg-[#f1f1f1]"
          onClick={plusQty}
        >
          <FaAngleUp className="text-[12px] opacity-55" />
        </Button>
        <Button
          className="!min-w-[30px] !w-[30px] !h-[20px] !text-[#000] !rounded-none hover:!bg-[#f1f1f1]"
          onClick={minusQty}
        >
          <FaAngleDown className="text-[12px] opacity-55" />
        </Button>
      </div>
    </div>
  );
};

export default QtyBox;
