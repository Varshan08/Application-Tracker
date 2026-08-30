# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createOrderData, updateOrderStatus, deleteOrder, getOrder, listOrders, createProductData, updateProductStock, deleteProduct, getProduct, listProducts } from '@dataconnect/generated';


// Operation CreateOrderData: 
const { data } = await CreateOrderData(dataConnect);

// Operation UpdateOrderStatus:  For variables, look at type UpdateOrderStatusVars in ../index.d.ts
const { data } = await UpdateOrderStatus(dataConnect, updateOrderStatusVars);

// Operation DeleteOrder:  For variables, look at type DeleteOrderVars in ../index.d.ts
const { data } = await DeleteOrder(dataConnect, deleteOrderVars);

// Operation GetOrder:  For variables, look at type GetOrderVars in ../index.d.ts
const { data } = await GetOrder(dataConnect, getOrderVars);

// Operation ListOrders: 
const { data } = await ListOrders(dataConnect);

// Operation CreateProductData: 
const { data } = await CreateProductData(dataConnect);

// Operation UpdateProductStock:  For variables, look at type UpdateProductStockVars in ../index.d.ts
const { data } = await UpdateProductStock(dataConnect, updateProductStockVars);

// Operation DeleteProduct:  For variables, look at type DeleteProductVars in ../index.d.ts
const { data } = await DeleteProduct(dataConnect, deleteProductVars);

// Operation GetProduct:  For variables, look at type GetProductVars in ../index.d.ts
const { data } = await GetProduct(dataConnect, getProductVars);

// Operation ListProducts: 
const { data } = await ListProducts(dataConnect);


```