import { useState } from "preact/hooks";

interface ProductModel {
  id: number;
  name: string;
  price: number;
}

const ProductForm = ({ product, onSaveProduct }) => {
  const [formData, setFormData] = !product.id
    ? useState({ id: 0, name: "", price: 0 })
    : useState({ id: product.id, name: product.name, price: product.price });

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");

  const validateForm = () => {
    console.log(formData);
    var isValid = true;
    setNameError("");
    setPriceError("");
    if (!formData.name.trim()) {
      isValid = false;
      setNameError("Product Name is required");
    }
    if (isNaN(formData.price) || formData.price <= 0) {
      isValid = false;
      setPriceError("Price must be greater than zero");
    }
    return isValid;
  };

  const handleFormDataEntry = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) return false;

    if (product.id > 0) {
      // edit product
      await editProduct();
    } else {
      //add product
      await addProduct();
    }
    onSaveProduct(); // invoke callback function.
  };
  const addProduct = async () => {
    console.log("addProduct invoked", formData);
    const res = await fetch("https://localhost:7130/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: formData.name,
        price: formData.price,
      }),
    });

    console.log("response", res);
    const data = await res.json();

    console.log("response data", data);

    if (res.ok) {
      console.log("Product added successfully");
    } else {
      setNameError(
        data.errors.ProductName === undefined ? "" : "ProductName is required"
      );
      setPriceError(data.errors.Price === undefined ? "" : "Price is required");
    }
  };

  const editProduct = async () => {
    const res = await fetch("https://localhost:7130/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: formData.id,
        productName: formData.name,
        price: formData.price,
      }),
    });

    console.log("response", res);

    if (res.ok) {
      console.log("Product Updated successfully");
    } else {
      console.log("Error in updating product");
    }
  };

  return (
    <div>
      <div class="input-group mb-3 mt-3">
        <label for="productName" class="input-group-text">
          Product Name
        </label>
        <input
          required
          error-message="Product Name is required"
          type="text"
          id="name"
          name="name"
          class="form-control float-right"
          placeholder="Product Name"
          value={formData.name}
          onInput={handleFormDataEntry}
        />
        <p>{nameError}</p>
      </div>
      <div class="input-group mb-3 mt-3">
        <label for="price" class="input-group-text">
          Price
        </label>
        <input
          required
          id="price"
          name="price"
          error-message="Price is required"
          type="number"
          class="form-control"
          placeholder="Product Price"
          value={formData.price}
          onInput={handleFormDataEntry}
        />
        <p>{priceError}</p>
      </div>
      <div style="width:100%;float:right">
        <div class="btn-group mb-3">
          <button
            type="button"
            class="btn btn-primary"
            onClick={(e) => handleSaveProduct(e)}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
