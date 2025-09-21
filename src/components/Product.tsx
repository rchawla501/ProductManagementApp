import { useEffect, useState } from "preact/hooks";
import ProductForm from "./ProductForm";

function Product() {
  const [productList, setProductList] = useState(null);
  const [product, setProductData] = useState({ id: 0, name: "", price: 0 });
  const [isFormMode, setFormMode] = useState(false);

  async function getProductList() {
    console.log("In getProductList", productList);
    setProductList(null);
    const res = await fetch("https://localhost:7130/api/products");
    setProductList(await res.json());
    setFormMode(false);
  }

  useEffect(() => {
    console.log("In UseEffect");
    getProductList();
  }, []);

  const deleteProduct = async (id: number) => {
    console.log("deleteProduct invoked", id);
    const res = await fetch(`https://localhost:7130/api/products/${id}`, {
      method: "DELETE",
    });
    //refresh the product list
    await getProductList();
  };

  const handleAddProduct = async (e) => {
    console.log("Add product invoked");
    const prod = {
      id: 0,
      name: "",
      price: 0,
    };
    setProductData(prod);
    setFormMode(true);
    console.log("handleAddProduct", product);
  };

  const handleEditProduct = async (product: any) => {
    console.log("Edit product invoked", product);
    setFormMode(true);

    const prod = {
      id: product.id,
      name: product.productName,
      price: product.price,
    };
    setProductData(prod);
    return false;
  };

  return (
    <>
      {isFormMode ? (
        <ProductForm
          product={product}
          onSaveProduct={getProductList}
        ></ProductForm>
      ) : (
        <>
          <div style="width:100%;float:right">
            <div class="btn-group mb-3">
              <button
                type="button"
                class="btn btn-primary"
                onClick={(e) => handleAddProduct(e)}
              >
                Add Product
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
      )}
    </>
  );
}

export default Product;
