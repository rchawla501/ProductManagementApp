import { useEffect, useState } from "preact/hooks";

function Product() {
  const [productList, setProductList] = useState(null);
  const [isSaveMode, setSaveMode] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [productId, setProductId] = useState(0);
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");

  interface ProductModel {
    productName: string;
    price: number;
  }

  async function getProductList() {
    const res = await fetch("https://localhost:7130/api/products");
    setProductList(await res.json());
  }

  useEffect(() => {
    getProductList();
  }, []);

  function validateForm() {
    var isValid = true;
    setNameError("");
    setPriceError("");
    if (!productName.trim()) {
      isValid = false;
      setNameError("Product Name is required");
    }
    if (isNaN(price) || price <= 0) {
      isValid = false;
      setPriceError("Price must be greater than zero");
    }
    return isValid;
  }

  async function handleAddProduct(e) {
    e.preventDefault();

    if (!isSaveMode) {
      // is in add mode . switch to save mode
      setSaveMode(true);
      return;
    } else {
      //validate inputs
      if (!validateForm()) {
        return false;
      }

      if (isEditMode) {
        // is in edit mode
        console.log("Update product invoked", productId);
        await editProduct();
      } else {
        console.log("Add product invoked");
        await addProduct({ productName, price });
      }

      if (nameError.length > 0 || priceError.length > 0) {
        return false;
      }

      //refresh the product list
      await getProductList();
      setSaveMode(false);
      setProductName("");
      setPrice(0);
    }
  }

  async function addProduct(product: ProductModel) {
    console.log("addProduct invoked", product);
    const res = await fetch("https://localhost:7130/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
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
  }

  async function editProduct() {
    const res = await fetch("https://localhost:7130/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: productId,
        productName: productName,
        price: price,
      }),
    });

    console.log("response", res);

    if (res.ok) {
      console.log("Product Updated successfully");
    } else {
      console.log("Error in updating product");
    }
  }
  async function deleteProduct(id: number) {
    console.log("deleteProduct invoked", id);
    const res = await fetch(`https://localhost:7130/api/products/${id}`, {
      method: "DELETE",
    });
    //refresh the product list
    await getProductList();
  }

  async function handleEditProduct(product: any) {
    console.log("Edit product invoked", product);
    setEditMode(true);
    setSaveMode(true);
    setProductName(product.productName);
    setPrice(product.price);
    setProductId(product.id);
    return false;
  }

  return (
    <>
      {isSaveMode ? (
        <>
          <div class="input-group mb-3 mt-3">
            <label for="productName" class="input-group-text">
              Product Name
            </label>
            <input
              required
              error-message="Product Name is required"
              type="text"
              id="productName"
              name="productName"
              class="form-control float-right"
              placeholder="Product Name"
              value={productName}
              onInput={(e) => setProductName(e.currentTarget.value)}
            />
            <p>{nameError}</p>
          </div>
          <div class="input-group mb-3 mt-3">
            <label for="price" class="input-group-text">
              Price
            </label>
            <input
              required
              error-message="Price is required"
              type="number"
              class="form-control"
              placeholder="Product Price"
              value={price}
              onInput={(e) => setPrice(Number(e.currentTarget.value))}
            />
            <p>{priceError}</p>
          </div>
        </>
      ) : null}
      <div style="width:100%;float:right">
        <div class="btn-group mb-3">
          <button
            type="button"
            class="btn btn-primary"
            onClick={(e) => handleAddProduct(e)}
          >
            {isSaveMode ? "Save Product" : "Add Product"}
          </button>
        </div>
      </div>

      <table class="table mt-5">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Product Id</th>
            <th scope="col">Product Name</th>
            <th scope="col">Price</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {productList === null
            ? ""
            : productList.map((product) => (
                <tr>
                  <th scope="row">{product.id}</th>
                  <td>{product.productName}</td>
                  <td>{product.price}</td>
                  <td>
                    <button
                      class="btn btn-primary"
                      onClick={(e) => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      class="btn btn-danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
}

export default Product;
