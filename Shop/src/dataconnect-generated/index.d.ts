import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateOrderDataData {
  order_insert: Order_Key;
}

export interface CreateOrderItemDataData {
  orderItem_insert: OrderItem_Key;
}

export interface CreateProductDataData {
  product_insert: Product_Key;
}

export interface DeleteOrderData {
  order_delete?: Order_Key | null;
}

export interface DeleteOrderItemData {
  orderItem_delete?: OrderItem_Key | null;
}

export interface DeleteOrderItemVariables {
  id: UUIDString;
}

export interface DeleteOrderVariables {
  id: UUIDString;
}

export interface DeleteProductData {
  product_delete?: Product_Key | null;
}

export interface DeleteProductVariables {
  id: UUIDString;
}

export interface GetOrderData {
  order?: {
    id: UUIDString;
    customerName: string;
    total: number;
    status: string;
  } & Order_Key;
}

export interface GetOrderItemData {
  orderItem?: {
    name: string;
    price: number;
    quantity: number;
  };
}

export interface GetOrderItemVariables {
  id: UUIDString;
}

export interface GetOrderVariables {
  id: UUIDString;
}

export interface GetProductData {
  product?: {
    name: string;
    price: number;
    stock: number;
  };
}

export interface GetProductVariables {
  id: UUIDString;
}

export interface ListOrderItemsData {
  orderItems: ({
    name: string;
    price: number;
    quantity: number;
  })[];
}

export interface ListOrdersData {
  orders: ({
    id: UUIDString;
    customerName: string;
    total: number;
    status: string;
  } & Order_Key)[];
}

export interface ListProductsData {
  products: ({
    name: string;
    brand: string;
    price: number;
  })[];
}

export interface OrderItem_Key {
  id: UUIDString;
  __typename?: 'OrderItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface UpdateOrderItemQuantityData {
  orderItem_update?: OrderItem_Key | null;
}

export interface UpdateOrderItemQuantityVariables {
  id: UUIDString;
  quantity: number;
}

export interface UpdateOrderStatusData {
  order_update?: Order_Key | null;
}

export interface UpdateOrderStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateProductStockData {
  product_update?: Product_Key | null;
}

export interface UpdateProductStockVariables {
  id: UUIDString;
  stock: number;
}

interface CreateOrderDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateOrderDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateOrderDataData, undefined>;
  operationName: string;
}
export const createOrderDataRef: CreateOrderDataRef;

export function createOrderData(): MutationPromise<CreateOrderDataData, undefined>;
export function createOrderData(dc: DataConnect): MutationPromise<CreateOrderDataData, undefined>;

interface UpdateOrderStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrderStatusVariables): MutationRef<UpdateOrderStatusData, UpdateOrderStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrderStatusVariables): MutationRef<UpdateOrderStatusData, UpdateOrderStatusVariables>;
  operationName: string;
}
export const updateOrderStatusRef: UpdateOrderStatusRef;

export function updateOrderStatus(vars: UpdateOrderStatusVariables): MutationPromise<UpdateOrderStatusData, UpdateOrderStatusVariables>;
export function updateOrderStatus(dc: DataConnect, vars: UpdateOrderStatusVariables): MutationPromise<UpdateOrderStatusData, UpdateOrderStatusVariables>;

interface DeleteOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteOrderVariables): MutationRef<DeleteOrderData, DeleteOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteOrderVariables): MutationRef<DeleteOrderData, DeleteOrderVariables>;
  operationName: string;
}
export const deleteOrderRef: DeleteOrderRef;

export function deleteOrder(vars: DeleteOrderVariables): MutationPromise<DeleteOrderData, DeleteOrderVariables>;
export function deleteOrder(dc: DataConnect, vars: DeleteOrderVariables): MutationPromise<DeleteOrderData, DeleteOrderVariables>;

interface GetOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrderVariables): QueryRef<GetOrderData, GetOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrderVariables): QueryRef<GetOrderData, GetOrderVariables>;
  operationName: string;
}
export const getOrderRef: GetOrderRef;

export function getOrder(vars: GetOrderVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderData, GetOrderVariables>;
export function getOrder(dc: DataConnect, vars: GetOrderVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderData, GetOrderVariables>;

interface ListOrdersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListOrdersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListOrdersData, undefined>;
  operationName: string;
}
export const listOrdersRef: ListOrdersRef;

export function listOrders(options?: ExecuteQueryOptions): QueryPromise<ListOrdersData, undefined>;
export function listOrders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListOrdersData, undefined>;

interface CreateProductDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateProductDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateProductDataData, undefined>;
  operationName: string;
}
export const createProductDataRef: CreateProductDataRef;

export function createProductData(): MutationPromise<CreateProductDataData, undefined>;
export function createProductData(dc: DataConnect): MutationPromise<CreateProductDataData, undefined>;

interface UpdateProductStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
  operationName: string;
}
export const updateProductStockRef: UpdateProductStockRef;

export function updateProductStock(vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;
export function updateProductStock(dc: DataConnect, vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface DeleteProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  operationName: string;
}
export const deleteProductRef: DeleteProductRef;

export function deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface GetProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  operationName: string;
}
export const getProductRef: GetProductRef;

export function getProduct(vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;
export function getProduct(dc: DataConnect, vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface ListProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProductsData, undefined>;
  operationName: string;
}
export const listProductsRef: ListProductsRef;

export function listProducts(options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;
export function listProducts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface CreateOrderItemDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateOrderItemDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateOrderItemDataData, undefined>;
  operationName: string;
}
export const createOrderItemDataRef: CreateOrderItemDataRef;

export function createOrderItemData(): MutationPromise<CreateOrderItemDataData, undefined>;
export function createOrderItemData(dc: DataConnect): MutationPromise<CreateOrderItemDataData, undefined>;

interface UpdateOrderItemQuantityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrderItemQuantityVariables): MutationRef<UpdateOrderItemQuantityData, UpdateOrderItemQuantityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrderItemQuantityVariables): MutationRef<UpdateOrderItemQuantityData, UpdateOrderItemQuantityVariables>;
  operationName: string;
}
export const updateOrderItemQuantityRef: UpdateOrderItemQuantityRef;

export function updateOrderItemQuantity(vars: UpdateOrderItemQuantityVariables): MutationPromise<UpdateOrderItemQuantityData, UpdateOrderItemQuantityVariables>;
export function updateOrderItemQuantity(dc: DataConnect, vars: UpdateOrderItemQuantityVariables): MutationPromise<UpdateOrderItemQuantityData, UpdateOrderItemQuantityVariables>;

interface DeleteOrderItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteOrderItemVariables): MutationRef<DeleteOrderItemData, DeleteOrderItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteOrderItemVariables): MutationRef<DeleteOrderItemData, DeleteOrderItemVariables>;
  operationName: string;
}
export const deleteOrderItemRef: DeleteOrderItemRef;

export function deleteOrderItem(vars: DeleteOrderItemVariables): MutationPromise<DeleteOrderItemData, DeleteOrderItemVariables>;
export function deleteOrderItem(dc: DataConnect, vars: DeleteOrderItemVariables): MutationPromise<DeleteOrderItemData, DeleteOrderItemVariables>;

interface GetOrderItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrderItemVariables): QueryRef<GetOrderItemData, GetOrderItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrderItemVariables): QueryRef<GetOrderItemData, GetOrderItemVariables>;
  operationName: string;
}
export const getOrderItemRef: GetOrderItemRef;

export function getOrderItem(vars: GetOrderItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderItemData, GetOrderItemVariables>;
export function getOrderItem(dc: DataConnect, vars: GetOrderItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderItemData, GetOrderItemVariables>;

interface ListOrderItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListOrderItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListOrderItemsData, undefined>;
  operationName: string;
}
export const listOrderItemsRef: ListOrderItemsRef;

export function listOrderItems(options?: ExecuteQueryOptions): QueryPromise<ListOrderItemsData, undefined>;
export function listOrderItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListOrderItemsData, undefined>;

