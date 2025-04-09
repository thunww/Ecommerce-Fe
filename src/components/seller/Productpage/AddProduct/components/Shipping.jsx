import React, { useState, useEffect } from "react";

const Shipping = ({ hasCategory, productData, onInputChange }) => {
  const [weight, setWeight] = useState(productData.weight || "");
  const [parcelSize, setParcelSize] = useState(
    productData.parcelSize || {
      width: "",
      length: "",
      height: "",
    }
  );
  const [shippingOptions, setShippingOptions] = useState(
    productData.shippingOptions || {
      "Hỏa Tốc": false,
      Nhanh: false,
      "Hàng Cồng Kềnh": false,
      "Tiết Kiệm": false,
    }
  );

  // Cập nhật state local khi props thay đổi
  useEffect(() => {
    if (productData.weight) setWeight(productData.weight);
    if (productData.parcelSize) setParcelSize(productData.parcelSize);
    if (productData.shippingOptions)
      setShippingOptions(productData.shippingOptions);
  }, [productData]);

  // Kiểm tra nếu có ít nhất một option được chọn
  const hasEnabledOption = Object.values(shippingOptions).some(
    (value) => value === true
  );

  const handleShippingOptionChange = (option) => {
    // Khác với cài đặt trước đó, cho phép chọn nhiều option cùng lúc
    const updatedOptions = {
      ...shippingOptions,
      [option]: !shippingOptions[option],
    };

    setShippingOptions(updatedOptions);
    onInputChange("shippingOptions", updatedOptions);
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    onInputChange("weight", value);
  };

  const handleParcelSizeChange = (field, value) => {
    // Đảm bảo giá trị nhập vào là số hợp lệ và không quá dài
    let processedValue = value;

    // Loại bỏ các ký tự không phải số và dấu chấm
    processedValue = value.replace(/[^\d.]/g, "");

    // Giới hạn chỉ 2 chữ số thập phân
    if (processedValue.includes(".")) {
      const parts = processedValue.split(".");
      processedValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    // Giới hạn độ dài tối đa 5 ký tự (99.99)
    if (processedValue.length > 5) {
      processedValue = processedValue.slice(0, 5);
    }

    const updatedParcelSize = { ...parcelSize, [field]: processedValue };
    setParcelSize(updatedParcelSize);

    // Kiểm tra nếu có ít nhất một giá trị không rỗng thì mới gửi lên
    const hasValue = Object.values(updatedParcelSize).some(
      (val) => val && val.trim() !== ""
    );
    if (hasValue) {
      onInputChange("parcelSize", updatedParcelSize);
    } else {
      onInputChange("parcelSize", null);
    }
  };

  return (
    <div>
      <div className="space-y-8">
        <h2 className="text-lg font-medium">Shipping</h2>

        {!hasCategory ? (
          <div className="text-center py-8 text-gray-500">
            Available only after you select a product category
          </div>
        ) : (
          <div className="space-y-8">
            {/* Weight */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-red-500 mr-0.5">*</span>
                <span className="text-sm">Weight</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-[200px]">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Input"
                    value={weight}
                    onChange={(e) => handleWeightChange(e.target.value)}
                  />
                </div>
                <span className="text-sm text-gray-500">gr</span>
              </div>
            </div>

            {/* Parcel Size */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-sm">Parcel Size</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-[150px]">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="W (Integer)"
                    value={parcelSize.width}
                    onChange={(e) =>
                      handleParcelSizeChange("width", e.target.value)
                    }
                  />
                </div>
                <span className="text-sm text-gray-500">cm</span>
                <span className="text-gray-400">×</span>
                <div className="relative w-[150px]">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="L"
                    value={parcelSize.length}
                    onChange={(e) =>
                      handleParcelSizeChange("length", e.target.value)
                    }
                  />
                </div>
                <span className="text-sm text-gray-500">cm</span>
                <span className="text-gray-400">×</span>
                <div className="relative w-[150px]">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="H (Integer)"
                    value={parcelSize.height}
                    onChange={(e) =>
                      handleParcelSizeChange("height", e.target.value)
                    }
                  />
                </div>
                <span className="text-sm text-gray-500">cm</span>
              </div>
            </div>

            {/* Shipping Fee */}
            <div className="grid grid-cols-[180px,1fr] gap-2">
              <div className="flex items-start">
                <span className="text-sm">Shipping Fee</span>
              </div>
              <div className="space-y-4">
                {!hasEnabledOption && (
                  <div className="text-red-500 text-sm">
                    Product can't be saved with no shipping options enabled.
                  </div>
                )}

                {/* Hỏa Tốc */}
                <div className="bg-gray-50 p-4 rounded">
                  <div className="font-medium mb-2">Hỏa Tốc</div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Hỏa Tốc</span>
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        SHOPEE SUPPORTED ...
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Weight Required
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={shippingOptions["Hỏa Tốc"]}
                          onChange={() => handleShippingOptionChange("Hỏa Tốc")}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Nhanh */}
                <div className="bg-gray-50 p-4 rounded">
                  <div className="font-medium mb-2">Nhanh</div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Nhanh</span>
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        SHOPEE SUPPORTED ...
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Weight Required
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={shippingOptions["Nhanh"]}
                          onChange={() => handleShippingOptionChange("Nhanh")}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Hàng Cồng Kềnh */}
                <div className="bg-gray-50 p-4 rounded">
                  <div className="font-medium mb-2">Hàng Cồng Kềnh</div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Hàng Cồng Kềnh</span>
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        SHOPEE SUPPORTED ...
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Weight Required
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={shippingOptions["Hàng Cồng Kềnh"]}
                          onChange={() =>
                            handleShippingOptionChange("Hàng Cồng Kềnh")
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tiết Kiệm */}
                <div className="bg-gray-50 p-4 rounded">
                  <div className="font-medium mb-2">Tiết Kiệm</div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Tiết kiệm</span>
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        SHOPEE SUPPORTED ...
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Weight Required
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={shippingOptions["Tiết Kiệm"]}
                          onChange={() =>
                            handleShippingOptionChange("Tiết Kiệm")
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Note text */}
                <div className="text-xs text-gray-500">
                  Shipping settings will be applicable for this product only.
                  Shipping fees displayed are base rates and will be subject to
                  change depending on buyer and seller location.
                </div>
                <div className="text-xs">
                  You can also{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    click here
                  </a>{" "}
                  to open more shipping channels for your products.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shipping;
