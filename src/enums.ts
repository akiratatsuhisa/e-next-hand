export enum UserRoles {
  Administrator = "administrator",
  User = "user",
}

export enum ProductAttachmentEntities {
  Product = "product",
  ProductOptionValue = "product_option_value",
  ProductVariant = "product_variant",
}

export enum ProductAttachmentMediaTypes {
  Image = "image",
  Video = "video",
}

export enum OrderStatus {
  Pending = "pending",
  PreOrder = "pre_order",
  Cancelled = "cancelled",
  PaidRequest = "paid_request",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
}

export enum OrderPaymentMethods {
  Stripe = "stripe",
  Paypal = "paypal",
  CashOnDelivery = "cash_on_delivery",
}

export enum OrderPaymentStatus {
  Unpaid = "unpaid",
  Paid = "paid",
  Failed = "failed",
}
