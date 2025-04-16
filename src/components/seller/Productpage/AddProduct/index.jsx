import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import FillingSuggestion from "./components/FillingSuggestion";
import ProductTabs from "./components/ProductTabs";
import BasicInformation from "./components/BasicInfomation";
import SalesInformation from "./components/SalesInformation";
import Shipping from "./components/Shipping";
import Others from "./components/Others";
import FooterButtons from "./components/FooterButtons";
import productService from "../../../../services/productService";

// Key để lưu và lấy draft từ localStorage
const PRODUCT_DRAFT_KEY = "shopee_product_draft";

const AddProduct = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Basic information");

  const fillingSuggestionRef = useRef(null);
  const basicInfoRef = useRef(null);
  const salesInfoRef = useRef(null);
  const shippingRef = useRef(null);
  const othersRef = useRef(null);
  const productTabsRef = useRef(null);

  // State để kiểm soát việc hiển thị modal gợi ý khôi phục dữ liệu nháp
  const [showDraftModal, setShowDraftModal] = useState(false);

  const [productData, setProductData] = useState({
    images: [],
    promotionImage: null,
    productName: "",
    category: "",
    selectedCategoryName: "",
    description: "",
    // Sales Information
    variations: [],
    price: "",
    stock: "",
    sizeChart: "",
    wholesale: [],
    // Shipping
    weight: "",
    parcelSize: {
      width: "",
      length: "",
      height: "",
    },
    shippingOptions: {
      Nhanh: false,
      "Hỏa Tốc": false,
      "Tiết Kiệm": false,
      "Hàng Cồng Kềnh": false,
    },
    // Others
    preOrder: "No",
    condition: "New",
    parentSKU: "",
  });

  // Kiểm tra localStorage khi trang được tải
  useEffect(() => {
    const checkForDraft = () => {
      try {
        const savedDraft = localStorage.getItem(PRODUCT_DRAFT_KEY);
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          // Hiển thị xác nhận nếu có dữ liệu nháp
          setShowDraftModal(true);
        }
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu nháp:", error);
      }
    };

    checkForDraft();
  }, []);

  // Hàm khôi phục dữ liệu nháp từ localStorage
  const restoreDraft = () => {
    try {
      const savedDraft = localStorage.getItem(PRODUCT_DRAFT_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);

        // Chỉ cập nhật các trường text và số, không phải là file
        const newProductData = {
          ...productData,
          ...draftData,
          // Giữ nguyên trường images vì không thể lưu file vào localStorage
          images: productData.images,
          promotionImage: productData.promotionImage,
        };

        setProductData(newProductData);
        toast.success("Draft data has been restored successfully");
        setShowDraftModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi khôi phục dữ liệu nháp:", error);
      toast.error("Failed to restore draft data");
    }
  };

  // Hàm từ chối khôi phục dữ liệu nháp
  const discardDraft = () => {
    localStorage.removeItem(PRODUCT_DRAFT_KEY);
    setShowDraftModal(false);
    toast.info("Draft has been discarded");
  };

  // Hàm lưu dữ liệu nháp vào localStorage
  const saveDraft = () => {
    try {
      // Tạo bản sao của productData để xử lý trước khi lưu
      const draftToSave = { ...productData };

      // Xóa những trường không thể lưu vào localStorage (như File objects)
      delete draftToSave.images;
      delete draftToSave.promotionImage;

      // Lưu vào localStorage
      localStorage.setItem(PRODUCT_DRAFT_KEY, JSON.stringify(draftToSave));
      toast.success("Product draft saved successfully");

      // Có thể kết hợp với việc lưu lên server nếu cần
      // handleSubmit("save");
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu nháp:", error);
      toast.error("Failed to save draft data");
    }
  };

  const handleInputChange = (name, value) => {
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let targetRef;
    switch (tab) {
      case "Basic information":
        targetRef = basicInfoRef;
        break;
      case "Sales information":
        targetRef = salesInfoRef;
        break;
      case "Shipping":
        targetRef = shippingRef;
        break;
      case "Others":
        targetRef = othersRef;
        break;
      default:
        return;
    }

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Hàm tính toán phần trăm hiển thị của một element trong viewport
  const getVisiblePercentage = (element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleHeight =
      Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const elementHeight = rect.height;
    return (visibleHeight > 0 ? visibleHeight / elementHeight : 0) * 100;
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { ref: basicInfoRef, name: "Basic information" },
        { ref: salesInfoRef, name: "Sales information" },
        { ref: shippingRef, name: "Shipping" },
        { ref: othersRef, name: "Others" },
      ];

      let maxVisibleSection = null;
      let maxVisiblePercentage = 0;

      sections.forEach(({ ref, name }) => {
        if (ref.current) {
          const visiblePercentage = getVisiblePercentage(ref.current);
          if (visiblePercentage > maxVisiblePercentage) {
            maxVisiblePercentage = visiblePercentage;
            maxVisibleSection = name;
          }
        }
      });

      if (maxVisibleSection && maxVisiblePercentage >= 30) {
        setActiveTab(maxVisibleSection);
      }
    };

    let scrollTimeout;
    const debouncedScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener("scroll", debouncedScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  const handleSubmit = async (action) => {
    console.log("Thực hiện hành động:", action);
    console.log("Dữ liệu sản phẩm chi tiết:", productData);

    try {
      toast.dismiss();
      toast.info("Đang xử lý...", { autoClose: 3000 });

      // Tạo FormData mới
      const formData = new FormData();

      // Kiểm tra và thêm các trường bắt buộc với giá trị hợp lệ
      // Nếu giá trị không hợp lệ, sử dụng giá trị mặc định

      // Tên sản phẩm - Nếu trống, sử dụng "Sản phẩm mới"
      formData.append(
        "productName",
        productData.productName?.trim() || "Sản phẩm mới"
      );

      // Mô tả - Nếu trống, sử dụng mô tả mặc định
      formData.append(
        "description",
        productData.description?.trim() || "Mô tả sản phẩm"
      );

      // Giá - Nếu không hợp lệ, sử dụng 10000
      const price =
        !isNaN(parseFloat(productData.price)) &&
        parseFloat(productData.price) > 0
          ? parseFloat(productData.price)
          : 10000;
      formData.append("price", price.toString());

      // Số lượng - Nếu không hợp lệ, sử dụng 1
      const stock =
        !isNaN(parseInt(productData.stock)) && parseInt(productData.stock) >= 0
          ? parseInt(productData.stock)
          : 1;
      formData.append("stock", stock.toString());

      // Danh mục - Nếu trống, sử dụng ID danh mục mặc định
      formData.append("category", productData.category || "1");

      // Shop ID luôn cố định
      formData.append("shopId", "1");

      // Cân nặng - Nếu không hợp lệ, sử dụng 0.5
      const weight =
        !isNaN(parseFloat(productData.weight)) &&
        parseFloat(productData.weight) > 0
          ? parseFloat(productData.weight)
          : 0.5;
      formData.append("weight", weight.toString());

      // Trạng thái sản phẩm
      formData.append("status", action === "save" ? "pending" : "active");

      // ParcelSize - Nếu giá trị không hợp lệ, sử dụng kích thước mặc định
      const parcelSize = {
        width:
          !isNaN(parseFloat(productData.parcelSize?.width)) &&
          parseFloat(productData.parcelSize.width) > 0
            ? parseFloat(productData.parcelSize.width)
            : 10,
        length:
          !isNaN(parseFloat(productData.parcelSize?.length)) &&
          parseFloat(productData.parcelSize.length) > 0
            ? parseFloat(productData.parcelSize.length)
            : 10,
        height:
          !isNaN(parseFloat(productData.parcelSize?.height)) &&
          parseFloat(productData.parcelSize.height) > 0
            ? parseFloat(productData.parcelSize.height)
            : 10,
      };
      formData.append("parcelSize", JSON.stringify(parcelSize));

      // Xử lý shipping options nếu có
      if (productData.shippingOptions) {
        formData.append(
          "shippingOptions",
          JSON.stringify(productData.shippingOptions)
        );
      } else {
        // Mặc định hỗ trợ tất cả phương thức vận chuyển
        formData.append(
          "shippingOptions",
          JSON.stringify({
            Nhanh: true,
            "Hỏa Tốc": true,
            "Tiết Kiệm": true,
            "Hàng Cồng Kềnh": true,
          })
        );
      }

      // Thêm thông tin khác nếu có, hoặc sử dụng giá trị mặc định
      formData.append("preOrder", productData.preOrder || "No");
      formData.append("condition", productData.condition || "New");
      formData.append("parentSKU", productData.parentSKU || "");

      // Thêm hình ảnh nếu có
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          }
        });
      } else {
        // Thêm URL ảnh mặc định nếu không có ảnh
        formData.append(
          "imageUrls",
          JSON.stringify(["https://via.placeholder.com/300x300"])
        );
      }

      // Xử lý biến thể sản phẩm
      if (productData.variations && productData.variations.length > 0) {
        console.log("Variations trước khi xử lý:", productData.variations);

        // Lọc ra các biến thể hợp lệ: có giá, số lượng và các thông tin cần thiết
        const cleanVariations = productData.variations
          .filter((variant) => {
            // Kiểm tra nếu biến thể có đủ thông tin cần thiết
            const hasPrice = variant.price && !isNaN(parseFloat(variant.price));
            const hasStock = variant.stock && !isNaN(parseInt(variant.stock));
            const hasColor = variant.color && variant.color !== "null";
            const hasMaterial = variant.material && variant.material !== "null";

            return hasPrice && hasStock && (hasColor || hasMaterial);
          })
          .map((variant, index) => {
            // Xử lý giá trị số
            const variantPrice =
              parseFloat(variant.price) || parseFloat(productData.price) || 1;
            const variantStock =
              parseInt(variant.stock) || parseInt(productData.stock) || 1;
            const variantWeight =
              parseFloat(variant.weight) || parseFloat(productData.weight) || 1;

            // Xử lý image_url
            let imageUrl = variant.image_url || null;
            if (
              !imageUrl &&
              productData.images &&
              productData.images.length > 0
            ) {
              const image = productData.images[0];
              imageUrl =
                image instanceof File ? URL.createObjectURL(image) : image;
            }

            // Đảm bảo không có trường NULL nếu là chuỗi "null"
            const cleanVariant = {
              color:
                variant.color === "null" || !variant.color
                  ? "Default"
                  : variant.color,
              material:
                variant.material === "null" || !variant.material
                  ? "Default"
                  : variant.material,
              size:
                variant.size === "null" || !variant.size ? null : variant.size,
              ram: variant.ram === "null" || !variant.ram ? null : variant.ram,
              processor:
                variant.processor === "null" || !variant.processor
                  ? null
                  : variant.processor,
              storage:
                variant.storage === "null" || !variant.storage
                  ? null
                  : variant.storage,
              weight: !isNaN(variantWeight) ? variantWeight : 1,
              price: !isNaN(variantPrice) ? variantPrice : 1,
              stock: !isNaN(variantStock) ? variantStock : 1,
              image_url: imageUrl || "https://via.placeholder.com/300x300",
            };

            console.log(
              `Biến thể ${index + 1} sau khi làm sạch:`,
              cleanVariant
            );
            return cleanVariant;
          });

        // Nếu sau khi lọc không còn biến thể nào, tạo biến thể mặc định
        if (cleanVariations.length === 0) {
          console.log("Không có biến thể hợp lệ, tạo biến thể mặc định");
          const defaultVariation = {
            color: "Default",
            material: "Default",
            size: null,
            ram: null,
            processor: null,
            storage: null,
            weight: parseFloat(productData.weight) || 1,
            price: parseFloat(productData.price) || 10000, // Đảm bảo giá luôn > 0
            stock: parseInt(productData.stock) || 10, // Đảm bảo stock luôn > 0
            image_url:
              productData.images && productData.images.length > 0
                ? productData.images[0] instanceof File
                  ? URL.createObjectURL(productData.images[0])
                  : productData.images[0]
                : "https://via.placeholder.com/300x300",
          };

          console.log("Biến thể mặc định:", defaultVariation);
          formData.append("variations", JSON.stringify([defaultVariation]));
        } else {
          console.log(`Gửi ${cleanVariations.length} biến thể hợp lệ`);
          formData.append("variations", JSON.stringify(cleanVariations));
        }
      } else {
        // Nếu không có variations, tạo một variation mặc định
        const defaultVariation = {
          color: "Default",
          material: "Default",
          size: null,
          ram: null,
          processor: null,
          storage: null,
          weight: parseFloat(productData.weight) || 1,
          price: parseFloat(productData.price) || 10000, // Đảm bảo giá luôn > 0
          stock: parseInt(productData.stock) || 10, // Đảm bảo stock luôn > 0
          image_url:
            productData.images && productData.images.length > 0
              ? productData.images[0] instanceof File
                ? URL.createObjectURL(productData.images[0])
                : productData.images[0]
              : "https://via.placeholder.com/300x300",
        };

        console.log(
          "Biến thể mặc định (không có variations):",
          defaultVariation
        );
        formData.append("variations", JSON.stringify([defaultVariation]));
      }

      // In ra log để debug
      console.log("==== DỮ LIỆU GỬI ĐI ====");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      // Thêm biến để theo dõi trạng thái tạo sản phẩm
      let productCreated = false;

      try {
        // Gửi request
        const response = await productService.createProduct(formData);
        console.log("Kết quả tạo sản phẩm:", response);
        productCreated = true; // Đánh dấu rằng đã nhận được response từ API

        // Kiểm tra response và xử lý nhiều tình huống khác nhau
        if (response) {
          // Trường hợp có product_id trong data
          if (response.data && response.data.product_id) {
            toast.success(
              `Sản phẩm đã được ${
                action === "save" ? "lưu nháp" : "đăng"
              } thành công!`
            );
            // Chuyển hướng đến trang danh sách sản phẩm
            setTimeout(() => {
              window.location.href = "/vendor/products";
            }, 1500);
            return;
          }

          // Trường hợp có message success nhưng không có product_id
          if (
            response.data &&
            (response.data.message || response.data.success)
          ) {
            toast.success(
              `Sản phẩm đã được tạo thành công! Đang chuyển hướng...`
            );
            // Vẫn chuyển hướng dù không có ID
            setTimeout(() => {
              window.location.href = "/vendor/products";
            }, 1500);
            return;
          }

          // Trường hợp có success ở cấp cao nhất
          if (response.success === true) {
            toast.success(`Sản phẩm đã được tạo thành công!`);
            setTimeout(() => {
              window.location.href = "/vendor/products";
            }, 1500);
            return;
          }
        }

        // Nếu đã nhận được response nhưng không phù hợp các trường hợp trên, hiển thị thông báo
        if (productCreated) {
          toast.warning(
            "Đã nhận phản hồi từ server nhưng không tìm thấy ID sản phẩm. Sản phẩm có thể đã được tạo thành công."
          );
          // Vẫn chuyển hướng sau 3 giây
          setTimeout(() => {
            window.location.href = "/vendor/products";
          }, 3000);
        }
      } catch (error) {
        console.error("Chi tiết lỗi:", error);

        // Nếu đã nhận được phản hồi từ server (có thể là sản phẩm đã được tạo)
        if (productCreated) {
          toast.warning(
            "Đã nhận phản hồi từ server nhưng xảy ra lỗi khi xử lý. Sản phẩm có thể đã được tạo."
          );
          // Vẫn chuyển hướng sau 3 giây
          setTimeout(() => {
            window.location.href = "/vendor/products";
          }, 3000);
          return;
        }

        // Xử lý lỗi chi tiết
        toast.dismiss();

        if (error.response) {
          console.log("Status:", error.response.status);
          console.log("Data:", error.response.data);

          // Hiển thị thông báo lỗi cụ thể từ API nếu có
          if (error.response.data && error.response.data.message) {
            toast.error(`Lỗi API: ${error.response.data.message}`);
          } else {
            toast.error(`Lỗi API: ${error.response.status} - ${error.message}`);
          }
        } else {
          toast.error(error.message);
        }
      }
    } catch (outerError) {
      console.error("Lỗi ngoại vi:", outerError);
      toast.error(`Có lỗi xảy ra: ${outerError.message}`);
    }
  };

  // Kiểm tra xem category đã được chọn chưa
  const hasCategory = Boolean(productData.category);

  // Cập nhật chức năng của nút Save as Draft
  const handleSaveAndDelist = () => {
    // Lưu nháp vào localStorage
    saveDraft();

    // Tiếp tục với việc lưu lên server
    handleSubmit("save");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Modal gợi ý khôi phục dữ liệu nháp */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Resume Draft</h3>
            <p className="mb-6">
              You have an unsaved product draft. Would you like to continue
              editing where you left off?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={discardDraft}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Discard Draft
              </button>
              <button
                onClick={restoreDraft}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Resume Editing
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1500px] mx-auto">
        <div className="flex gap-4 p-4">
          {/* Left column - Filling Suggestion */}
          <div className="w-72 flex-shrink-0" ref={fillingSuggestionRef}>
            <FillingSuggestion />
          </div>

          {/* Right column - Main content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm">
            {/* Tabs section */}
            <div
              ref={productTabsRef}
              className="sticky top-0 z-10"
              style={{
                background: "white",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div className="border-b">
                <ProductTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>
            </div>

            {/* Content section */}
            <div className="divide-y divide-gray-200">
              {/* Basic Information section */}
              <div ref={basicInfoRef} className="p-6">
                <BasicInformation
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>

              {/* Sales Information section */}
              <div ref={salesInfoRef} className="p-6">
                <SalesInformation
                  hasCategory={hasCategory}
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>

              {/* Shipping section */}
              <div ref={shippingRef} className="p-6">
                <Shipping
                  hasCategory={hasCategory}
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>

              {/* Others section */}
              <div ref={othersRef} className="p-6">
                <Others
                  hasCategory={hasCategory}
                  productData={productData}
                  onInputChange={handleInputChange}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t">
              <div className="mt-8">
                <FooterButtons
                  onCancel={() => navigate("/vendor/products")}
                  onSaveAndPublish={() => handleSubmit("publish")}
                  onSaveAndDelist={handleSaveAndDelist}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
