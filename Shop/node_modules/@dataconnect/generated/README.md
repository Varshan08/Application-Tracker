# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetOrder*](#getorder)
  - [*ListOrders*](#listorders)
  - [*GetProduct*](#getproduct)
  - [*ListProducts*](#listproducts)
  - [*GetOrderItem*](#getorderitem)
  - [*ListOrderItems*](#listorderitems)
- [**Mutations**](#mutations)
  - [*CreateOrderData*](#createorderdata)
  - [*UpdateOrderStatus*](#updateorderstatus)
  - [*DeleteOrder*](#deleteorder)
  - [*CreateProductData*](#createproductdata)
  - [*UpdateProductStock*](#updateproductstock)
  - [*DeleteProduct*](#deleteproduct)
  - [*CreateOrderItemData*](#createorderitemdata)
  - [*UpdateOrderItemQuantity*](#updateorderitemquantity)
  - [*DeleteOrderItem*](#deleteorderitem)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetOrder
You can execute the `GetOrder` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getOrder(vars: GetOrderVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderData, GetOrderVariables>;

interface GetOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrderVariables): QueryRef<GetOrderData, GetOrderVariables>;
}
export const getOrderRef: GetOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrder(dc: DataConnect, vars: GetOrderVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderData, GetOrderVariables>;

interface GetOrderRef {
  ...
  (dc: DataConnect, vars: GetOrderVariables): QueryRef<GetOrderData, GetOrderVariables>;
}
export const getOrderRef: GetOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrderRef:
```typescript
const name = getOrderRef.operationName;
console.log(name);
```

### Variables
The `GetOrder` query requires an argument of type `GetOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrder` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrderData {
  order?: {
    id: UUIDString;
    customerName: string;
    total: number;
    status: string;
  } & Order_Key;
}
```
### Using `GetOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrder, GetOrderVariables } from '@dataconnect/generated';

// The `GetOrder` query requires an argument of type `GetOrderVariables`:
const getOrderVars: GetOrderVariables = {
  id: ..., 
};

// Call the `getOrder()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrder(getOrderVars);
// Variables can be defined inline as well.
const { data } = await getOrder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrder(dataConnect, getOrderVars);

console.log(data.order);

// Or, you can use the `Promise` API.
getOrder(getOrderVars).then((response) => {
  const data = response.data;
  console.log(data.order);
});
```

### Using `GetOrder`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrderRef, GetOrderVariables } from '@dataconnect/generated';

// The `GetOrder` query requires an argument of type `GetOrderVariables`:
const getOrderVars: GetOrderVariables = {
  id: ..., 
};

// Call the `getOrderRef()` function to get a reference to the query.
const ref = getOrderRef(getOrderVars);
// Variables can be defined inline as well.
const ref = getOrderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrderRef(dataConnect, getOrderVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.order);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.order);
});
```

## ListOrders
You can execute the `ListOrders` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listOrders(options?: ExecuteQueryOptions): QueryPromise<ListOrdersData, undefined>;

interface ListOrdersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListOrdersData, undefined>;
}
export const listOrdersRef: ListOrdersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listOrders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListOrdersData, undefined>;

interface ListOrdersRef {
  ...
  (dc: DataConnect): QueryRef<ListOrdersData, undefined>;
}
export const listOrdersRef: ListOrdersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listOrdersRef:
```typescript
const name = listOrdersRef.operationName;
console.log(name);
```

### Variables
The `ListOrders` query has no variables.
### Return Type
Recall that executing the `ListOrders` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListOrdersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListOrdersData {
  orders: ({
    id: UUIDString;
    customerName: string;
    total: number;
    status: string;
  } & Order_Key)[];
}
```
### Using `ListOrders`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listOrders } from '@dataconnect/generated';


// Call the `listOrders()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listOrders();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listOrders(dataConnect);

console.log(data.orders);

// Or, you can use the `Promise` API.
listOrders().then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

### Using `ListOrders`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listOrdersRef } from '@dataconnect/generated';


// Call the `listOrdersRef()` function to get a reference to the query.
const ref = listOrdersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listOrdersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

## GetProduct
You can execute the `GetProduct` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProduct(vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface GetProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
}
export const getProductRef: GetProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProduct(dc: DataConnect, vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface GetProductRef {
  ...
  (dc: DataConnect, vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
}
export const getProductRef: GetProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductRef:
```typescript
const name = getProductRef.operationName;
console.log(name);
```

### Variables
The `GetProduct` query requires an argument of type `GetProductVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetProduct` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductData {
  product?: {
    name: string;
    price: number;
    stock: number;
  };
}
```
### Using `GetProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProduct, GetProductVariables } from '@dataconnect/generated';

// The `GetProduct` query requires an argument of type `GetProductVariables`:
const getProductVars: GetProductVariables = {
  id: ..., 
};

// Call the `getProduct()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProduct(getProductVars);
// Variables can be defined inline as well.
const { data } = await getProduct({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProduct(dataConnect, getProductVars);

console.log(data.product);

// Or, you can use the `Promise` API.
getProduct(getProductVars).then((response) => {
  const data = response.data;
  console.log(data.product);
});
```

### Using `GetProduct`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductRef, GetProductVariables } from '@dataconnect/generated';

// The `GetProduct` query requires an argument of type `GetProductVariables`:
const getProductVars: GetProductVariables = {
  id: ..., 
};

// Call the `getProductRef()` function to get a reference to the query.
const ref = getProductRef(getProductVars);
// Variables can be defined inline as well.
const ref = getProductRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductRef(dataConnect, getProductVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.product);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.product);
});
```

## ListProducts
You can execute the `ListProducts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProducts(options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface ListProductsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsData, undefined>;
}
export const listProductsRef: ListProductsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProducts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface ListProductsRef {
  ...
  (dc: DataConnect): QueryRef<ListProductsData, undefined>;
}
export const listProductsRef: ListProductsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductsRef:
```typescript
const name = listProductsRef.operationName;
console.log(name);
```

### Variables
The `ListProducts` query has no variables.
### Return Type
Recall that executing the `ListProducts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductsData {
  products: ({
    name: string;
    brand: string;
    price: number;
  })[];
}
```
### Using `ListProducts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProducts } from '@dataconnect/generated';


// Call the `listProducts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProducts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProducts(dataConnect);

console.log(data.products);

// Or, you can use the `Promise` API.
listProducts().then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListProducts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductsRef } from '@dataconnect/generated';


// Call the `listProductsRef()` function to get a reference to the query.
const ref = listProductsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## GetOrderItem
You can execute the `GetOrderItem` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getOrderItem(vars: GetOrderItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderItemData, GetOrderItemVariables>;

interface GetOrderItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrderItemVariables): QueryRef<GetOrderItemData, GetOrderItemVariables>;
}
export const getOrderItemRef: GetOrderItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrderItem(dc: DataConnect, vars: GetOrderItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderItemData, GetOrderItemVariables>;

interface GetOrderItemRef {
  ...
  (dc: DataConnect, vars: GetOrderItemVariables): QueryRef<GetOrderItemData, GetOrderItemVariables>;
}
export const getOrderItemRef: GetOrderItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrderItemRef:
```typescript
const name = getOrderItemRef.operationName;
console.log(name);
```

### Variables
The `GetOrderItem` query requires an argument of type `GetOrderItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrderItemVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrderItem` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrderItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrderItemData {
  orderItem?: {
    name: string;
    price: number;
    quantity: number;
  };
}
```
### Using `GetOrderItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrderItem, GetOrderItemVariables } from '@dataconnect/generated';

// The `GetOrderItem` query requires an argument of type `GetOrderItemVariables`:
const getOrderItemVars: GetOrderItemVariables = {
  id: ..., 
};

// Call the `getOrderItem()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrderItem(getOrderItemVars);
// Variables can be defined inline as well.
const { data } = await getOrderItem({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrderItem(dataConnect, getOrderItemVars);

console.log(data.orderItem);

// Or, you can use the `Promise` API.
getOrderItem(getOrderItemVars).then((response) => {
  const data = response.data;
  console.log(data.orderItem);
});
```

### Using `GetOrderItem`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrderItemRef, GetOrderItemVariables } from '@dataconnect/generated';

// The `GetOrderItem` query requires an argument of type `GetOrderItemVariables`:
const getOrderItemVars: GetOrderItemVariables = {
  id: ..., 
};

// Call the `getOrderItemRef()` function to get a reference to the query.
const ref = getOrderItemRef(getOrderItemVars);
// Variables can be defined inline as well.
const ref = getOrderItemRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrderItemRef(dataConnect, getOrderItemVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orderItem);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orderItem);
});
```

## ListOrderItems
You can execute the `ListOrderItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listOrderItems(options?: ExecuteQueryOptions): QueryPromise<ListOrderItemsData, undefined>;

interface ListOrderItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListOrderItemsData, undefined>;
}
export const listOrderItemsRef: ListOrderItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listOrderItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListOrderItemsData, undefined>;

interface ListOrderItemsRef {
  ...
  (dc: DataConnect): QueryRef<ListOrderItemsData, undefined>;
}
export const listOrderItemsRef: ListOrderItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listOrderItemsRef:
```typescript
const name = listOrderItemsRef.operationName;
console.log(name);
```

### Variables
The `ListOrderItems` query has no variables.
### Return Type
Recall that executing the `ListOrderItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListOrderItemsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListOrderItemsData {
  orderItems: ({
    name: string;
    price: number;
    quantity: number;
  })[];
}
```
### Using `ListOrderItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listOrderItems } from '@dataconnect/generated';


// Call the `listOrderItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listOrderItems();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listOrderItems(dataConnect);

console.log(data.orderItems);

// Or, you can use the `Promise` API.
listOrderItems().then((response) => {
  const data = response.data;
  console.log(data.orderItems);
});
```

### Using `ListOrderItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listOrderItemsRef } from '@dataconnect/generated';


// Call the `listOrderItemsRef()` function to get a reference to the query.
const ref = listOrderItemsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listOrderItemsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orderItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orderItems);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateOrderData
You can execute the `CreateOrderData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createOrderData(): MutationPromise<CreateOrderDataData, undefined>;

interface CreateOrderDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateOrderDataData, undefined>;
}
export const createOrderDataRef: CreateOrderDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrderData(dc: DataConnect): MutationPromise<CreateOrderDataData, undefined>;

interface CreateOrderDataRef {
  ...
  (dc: DataConnect): MutationRef<CreateOrderDataData, undefined>;
}
export const createOrderDataRef: CreateOrderDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrderDataRef:
```typescript
const name = createOrderDataRef.operationName;
console.log(name);
```

### Variables
The `CreateOrderData` mutation has no variables.
### Return Type
Recall that executing the `CreateOrderData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrderDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrderDataData {
  order_insert: Order_Key;
}
```
### Using `CreateOrderData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrderData } from '@dataconnect/generated';


// Call the `createOrderData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrderData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrderData(dataConnect);

console.log(data.order_insert);

// Or, you can use the `Promise` API.
createOrderData().then((response) => {
  const data = response.data;
  console.log(data.order_insert);
});
```

### Using `CreateOrderData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrderDataRef } from '@dataconnect/generated';


// Call the `createOrderDataRef()` function to get a reference to the mutation.
const ref = createOrderDataRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrderDataRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_insert);
});
```

## UpdateOrderStatus
You can execute the `UpdateOrderStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateOrderStatus(vars: UpdateOrderStatusVariables): MutationPromise<UpdateOrderStatusData, UpdateOrderStatusVariables>;

interface UpdateOrderStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrderStatusVariables): MutationRef<UpdateOrderStatusData, UpdateOrderStatusVariables>;
}
export const updateOrderStatusRef: UpdateOrderStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrderStatus(dc: DataConnect, vars: UpdateOrderStatusVariables): MutationPromise<UpdateOrderStatusData, UpdateOrderStatusVariables>;

interface UpdateOrderStatusRef {
  ...
  (dc: DataConnect, vars: UpdateOrderStatusVariables): MutationRef<UpdateOrderStatusData, UpdateOrderStatusVariables>;
}
export const updateOrderStatusRef: UpdateOrderStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrderStatusRef:
```typescript
const name = updateOrderStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrderStatus` mutation requires an argument of type `UpdateOrderStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrderStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateOrderStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrderStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrderStatusData {
  order_update?: Order_Key | null;
}
```
### Using `UpdateOrderStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrderStatus, UpdateOrderStatusVariables } from '@dataconnect/generated';

// The `UpdateOrderStatus` mutation requires an argument of type `UpdateOrderStatusVariables`:
const updateOrderStatusVars: UpdateOrderStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateOrderStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrderStatus(updateOrderStatusVars);
// Variables can be defined inline as well.
const { data } = await updateOrderStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrderStatus(dataConnect, updateOrderStatusVars);

console.log(data.order_update);

// Or, you can use the `Promise` API.
updateOrderStatus(updateOrderStatusVars).then((response) => {
  const data = response.data;
  console.log(data.order_update);
});
```

### Using `UpdateOrderStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrderStatusRef, UpdateOrderStatusVariables } from '@dataconnect/generated';

// The `UpdateOrderStatus` mutation requires an argument of type `UpdateOrderStatusVariables`:
const updateOrderStatusVars: UpdateOrderStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateOrderStatusRef()` function to get a reference to the mutation.
const ref = updateOrderStatusRef(updateOrderStatusVars);
// Variables can be defined inline as well.
const ref = updateOrderStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrderStatusRef(dataConnect, updateOrderStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_update);
});
```

## DeleteOrder
You can execute the `DeleteOrder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteOrder(vars: DeleteOrderVariables): MutationPromise<DeleteOrderData, DeleteOrderVariables>;

interface DeleteOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteOrderVariables): MutationRef<DeleteOrderData, DeleteOrderVariables>;
}
export const deleteOrderRef: DeleteOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteOrder(dc: DataConnect, vars: DeleteOrderVariables): MutationPromise<DeleteOrderData, DeleteOrderVariables>;

interface DeleteOrderRef {
  ...
  (dc: DataConnect, vars: DeleteOrderVariables): MutationRef<DeleteOrderData, DeleteOrderVariables>;
}
export const deleteOrderRef: DeleteOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteOrderRef:
```typescript
const name = deleteOrderRef.operationName;
console.log(name);
```

### Variables
The `DeleteOrder` mutation requires an argument of type `DeleteOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteOrderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteOrder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteOrderData {
  order_delete?: Order_Key | null;
}
```
### Using `DeleteOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteOrder, DeleteOrderVariables } from '@dataconnect/generated';

// The `DeleteOrder` mutation requires an argument of type `DeleteOrderVariables`:
const deleteOrderVars: DeleteOrderVariables = {
  id: ..., 
};

// Call the `deleteOrder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteOrder(deleteOrderVars);
// Variables can be defined inline as well.
const { data } = await deleteOrder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteOrder(dataConnect, deleteOrderVars);

console.log(data.order_delete);

// Or, you can use the `Promise` API.
deleteOrder(deleteOrderVars).then((response) => {
  const data = response.data;
  console.log(data.order_delete);
});
```

### Using `DeleteOrder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteOrderRef, DeleteOrderVariables } from '@dataconnect/generated';

// The `DeleteOrder` mutation requires an argument of type `DeleteOrderVariables`:
const deleteOrderVars: DeleteOrderVariables = {
  id: ..., 
};

// Call the `deleteOrderRef()` function to get a reference to the mutation.
const ref = deleteOrderRef(deleteOrderVars);
// Variables can be defined inline as well.
const ref = deleteOrderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteOrderRef(dataConnect, deleteOrderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_delete);
});
```

## CreateProductData
You can execute the `CreateProductData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createProductData(): MutationPromise<CreateProductDataData, undefined>;

interface CreateProductDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateProductDataData, undefined>;
}
export const createProductDataRef: CreateProductDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProductData(dc: DataConnect): MutationPromise<CreateProductDataData, undefined>;

interface CreateProductDataRef {
  ...
  (dc: DataConnect): MutationRef<CreateProductDataData, undefined>;
}
export const createProductDataRef: CreateProductDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductDataRef:
```typescript
const name = createProductDataRef.operationName;
console.log(name);
```

### Variables
The `CreateProductData` mutation has no variables.
### Return Type
Recall that executing the `CreateProductData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductDataData {
  product_insert: Product_Key;
}
```
### Using `CreateProductData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProductData } from '@dataconnect/generated';


// Call the `createProductData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProductData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProductData(dataConnect);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
createProductData().then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

### Using `CreateProductData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductDataRef } from '@dataconnect/generated';


// Call the `createProductDataRef()` function to get a reference to the mutation.
const ref = createProductDataRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductDataRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

## UpdateProductStock
You can execute the `UpdateProductStock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProductStock(vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface UpdateProductStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
}
export const updateProductStockRef: UpdateProductStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProductStock(dc: DataConnect, vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface UpdateProductStockRef {
  ...
  (dc: DataConnect, vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
}
export const updateProductStockRef: UpdateProductStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductStockRef:
```typescript
const name = updateProductStockRef.operationName;
console.log(name);
```

### Variables
The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductStockVariables {
  id: UUIDString;
  stock: number;
}
```
### Return Type
Recall that executing the `UpdateProductStock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductStockData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductStockData {
  product_update?: Product_Key | null;
}
```
### Using `UpdateProductStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProductStock, UpdateProductStockVariables } from '@dataconnect/generated';

// The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`:
const updateProductStockVars: UpdateProductStockVariables = {
  id: ..., 
  stock: ..., 
};

// Call the `updateProductStock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProductStock(updateProductStockVars);
// Variables can be defined inline as well.
const { data } = await updateProductStock({ id: ..., stock: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProductStock(dataConnect, updateProductStockVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
updateProductStock(updateProductStockVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `UpdateProductStock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductStockRef, UpdateProductStockVariables } from '@dataconnect/generated';

// The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`:
const updateProductStockVars: UpdateProductStockVariables = {
  id: ..., 
  stock: ..., 
};

// Call the `updateProductStockRef()` function to get a reference to the mutation.
const ref = updateProductStockRef(updateProductStockVars);
// Variables can be defined inline as well.
const ref = updateProductStockRef({ id: ..., stock: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductStockRef(dataConnect, updateProductStockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## DeleteProduct
You can execute the `DeleteProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface DeleteProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
}
export const deleteProductRef: DeleteProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface DeleteProductRef {
  ...
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
}
export const deleteProductRef: DeleteProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProductRef:
```typescript
const name = deleteProductRef.operationName;
console.log(name);
```

### Variables
The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProductVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProductData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProductData {
  product_delete?: Product_Key | null;
}
```
### Using `DeleteProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProduct, DeleteProductVariables } from '@dataconnect/generated';

// The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`:
const deleteProductVars: DeleteProductVariables = {
  id: ..., 
};

// Call the `deleteProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProduct(deleteProductVars);
// Variables can be defined inline as well.
const { data } = await deleteProduct({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProduct(dataConnect, deleteProductVars);

console.log(data.product_delete);

// Or, you can use the `Promise` API.
deleteProduct(deleteProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_delete);
});
```

### Using `DeleteProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProductRef, DeleteProductVariables } from '@dataconnect/generated';

// The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`:
const deleteProductVars: DeleteProductVariables = {
  id: ..., 
};

// Call the `deleteProductRef()` function to get a reference to the mutation.
const ref = deleteProductRef(deleteProductVars);
// Variables can be defined inline as well.
const ref = deleteProductRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProductRef(dataConnect, deleteProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_delete);
});
```

## CreateOrderItemData
You can execute the `CreateOrderItemData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createOrderItemData(): MutationPromise<CreateOrderItemDataData, undefined>;

interface CreateOrderItemDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateOrderItemDataData, undefined>;
}
export const createOrderItemDataRef: CreateOrderItemDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrderItemData(dc: DataConnect): MutationPromise<CreateOrderItemDataData, undefined>;

interface CreateOrderItemDataRef {
  ...
  (dc: DataConnect): MutationRef<CreateOrderItemDataData, undefined>;
}
export const createOrderItemDataRef: CreateOrderItemDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrderItemDataRef:
```typescript
const name = createOrderItemDataRef.operationName;
console.log(name);
```

### Variables
The `CreateOrderItemData` mutation has no variables.
### Return Type
Recall that executing the `CreateOrderItemData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrderItemDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrderItemDataData {
  orderItem_insert: OrderItem_Key;
}
```
### Using `CreateOrderItemData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrderItemData } from '@dataconnect/generated';


// Call the `createOrderItemData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrderItemData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrderItemData(dataConnect);

console.log(data.orderItem_insert);

// Or, you can use the `Promise` API.
createOrderItemData().then((response) => {
  const data = response.data;
  console.log(data.orderItem_insert);
});
```

### Using `CreateOrderItemData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrderItemDataRef } from '@dataconnect/generated';


// Call the `createOrderItemDataRef()` function to get a reference to the mutation.
const ref = createOrderItemDataRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrderItemDataRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.orderItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.orderItem_insert);
});
```

## UpdateOrderItemQuantity
You can execute the `UpdateOrderItemQuantity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateOrderItemQuantity(vars: UpdateOrderItemQuantityVariables): MutationPromise<UpdateOrderItemQuantityData, UpdateOrderItemQuantityVariables>;

interface UpdateOrderItemQuantityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrderItemQuantityVariables): MutationRef<UpdateOrderItemQuantityData, UpdateOrderItemQuantityVariables>;
}
export const updateOrderItemQuantityRef: UpdateOrderItemQuantityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrderItemQuantity(dc: DataConnect, vars: UpdateOrderItemQuantityVariables): MutationPromise<UpdateOrderItemQuantityData, UpdateOrderItemQuantityVariables>;

interface UpdateOrderItemQuantityRef {
  ...
  (dc: DataConnect, vars: UpdateOrderItemQuantityVariables): MutationRef<UpdateOrderItemQuantityData, UpdateOrderItemQuantityVariables>;
}
export const updateOrderItemQuantityRef: UpdateOrderItemQuantityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrderItemQuantityRef:
```typescript
const name = updateOrderItemQuantityRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrderItemQuantity` mutation requires an argument of type `UpdateOrderItemQuantityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrderItemQuantityVariables {
  id: UUIDString;
  quantity: number;
}
```
### Return Type
Recall that executing the `UpdateOrderItemQuantity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrderItemQuantityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrderItemQuantityData {
  orderItem_update?: OrderItem_Key | null;
}
```
### Using `UpdateOrderItemQuantity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrderItemQuantity, UpdateOrderItemQuantityVariables } from '@dataconnect/generated';

// The `UpdateOrderItemQuantity` mutation requires an argument of type `UpdateOrderItemQuantityVariables`:
const updateOrderItemQuantityVars: UpdateOrderItemQuantityVariables = {
  id: ..., 
  quantity: ..., 
};

// Call the `updateOrderItemQuantity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrderItemQuantity(updateOrderItemQuantityVars);
// Variables can be defined inline as well.
const { data } = await updateOrderItemQuantity({ id: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrderItemQuantity(dataConnect, updateOrderItemQuantityVars);

console.log(data.orderItem_update);

// Or, you can use the `Promise` API.
updateOrderItemQuantity(updateOrderItemQuantityVars).then((response) => {
  const data = response.data;
  console.log(data.orderItem_update);
});
```

### Using `UpdateOrderItemQuantity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrderItemQuantityRef, UpdateOrderItemQuantityVariables } from '@dataconnect/generated';

// The `UpdateOrderItemQuantity` mutation requires an argument of type `UpdateOrderItemQuantityVariables`:
const updateOrderItemQuantityVars: UpdateOrderItemQuantityVariables = {
  id: ..., 
  quantity: ..., 
};

// Call the `updateOrderItemQuantityRef()` function to get a reference to the mutation.
const ref = updateOrderItemQuantityRef(updateOrderItemQuantityVars);
// Variables can be defined inline as well.
const ref = updateOrderItemQuantityRef({ id: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrderItemQuantityRef(dataConnect, updateOrderItemQuantityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.orderItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.orderItem_update);
});
```

## DeleteOrderItem
You can execute the `DeleteOrderItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteOrderItem(vars: DeleteOrderItemVariables): MutationPromise<DeleteOrderItemData, DeleteOrderItemVariables>;

interface DeleteOrderItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteOrderItemVariables): MutationRef<DeleteOrderItemData, DeleteOrderItemVariables>;
}
export const deleteOrderItemRef: DeleteOrderItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteOrderItem(dc: DataConnect, vars: DeleteOrderItemVariables): MutationPromise<DeleteOrderItemData, DeleteOrderItemVariables>;

interface DeleteOrderItemRef {
  ...
  (dc: DataConnect, vars: DeleteOrderItemVariables): MutationRef<DeleteOrderItemData, DeleteOrderItemVariables>;
}
export const deleteOrderItemRef: DeleteOrderItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteOrderItemRef:
```typescript
const name = deleteOrderItemRef.operationName;
console.log(name);
```

### Variables
The `DeleteOrderItem` mutation requires an argument of type `DeleteOrderItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteOrderItemVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteOrderItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteOrderItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteOrderItemData {
  orderItem_delete?: OrderItem_Key | null;
}
```
### Using `DeleteOrderItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteOrderItem, DeleteOrderItemVariables } from '@dataconnect/generated';

// The `DeleteOrderItem` mutation requires an argument of type `DeleteOrderItemVariables`:
const deleteOrderItemVars: DeleteOrderItemVariables = {
  id: ..., 
};

// Call the `deleteOrderItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteOrderItem(deleteOrderItemVars);
// Variables can be defined inline as well.
const { data } = await deleteOrderItem({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteOrderItem(dataConnect, deleteOrderItemVars);

console.log(data.orderItem_delete);

// Or, you can use the `Promise` API.
deleteOrderItem(deleteOrderItemVars).then((response) => {
  const data = response.data;
  console.log(data.orderItem_delete);
});
```

### Using `DeleteOrderItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteOrderItemRef, DeleteOrderItemVariables } from '@dataconnect/generated';

// The `DeleteOrderItem` mutation requires an argument of type `DeleteOrderItemVariables`:
const deleteOrderItemVars: DeleteOrderItemVariables = {
  id: ..., 
};

// Call the `deleteOrderItemRef()` function to get a reference to the mutation.
const ref = deleteOrderItemRef(deleteOrderItemVars);
// Variables can be defined inline as well.
const ref = deleteOrderItemRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteOrderItemRef(dataConnect, deleteOrderItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.orderItem_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.orderItem_delete);
});
```

