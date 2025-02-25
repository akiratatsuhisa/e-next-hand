import { DATABASE } from "@/server-constants";
import { sql } from "drizzle-orm";
import {
  bigint,
  mysqlTable,
  datetime,
  varchar,
  boolean,
  text,
  int,
  char,
  decimal,
  foreignKey,
} from "drizzle-orm/mysql-core";
import {
  OrderPaymentMethods,
  OrderPaymentStatus,
  OrderStatus,
  ProductAttachmentMediaTypes,
} from "@/enums";

const idField = bigint("id", { mode: "bigint" }).primaryKey().autoincrement();

const sortOrderField = int("sort_order", { unsigned: true })
  .default(0)
  .notNull();

const commonFields = {
  createdAt: datetime("created_at", { mode: "date" })
    .default(sql`NOW()`)
    .notNull(),
  createdBy: bigint("created_by", { mode: "bigint" }).notNull(),
  updatedAt: datetime("updated_at", { mode: "date" })
    .default(sql`NOW()`)
    .notNull(),
  updatedBy: bigint("updated_by", { mode: "bigint" }).notNull(),
};

export const categories = mysqlTable("categories", {
  id: idField,

  name: varchar("name", { length: DATABASE.STRING_LENGTH.MEDIUM }).notNull(),
  sortOrder: sortOrderField,

  ...commonFields,
});

export const products = mysqlTable("products", {
  id: idField,

  categoryId: bigint("category_id", { mode: "bigint" })
    .references(() => categories.id, DATABASE.REFERENCES_ACTIONS)
    .notNull(),

  name: varchar("name", { length: DATABASE.STRING_LENGTH.MEDIUM }).notNull(),
  description: text("description"),

  ...commonFields,
});

export const productOptions = mysqlTable("product_options", {
  id: idField,

  productId: bigint("product_id", { mode: "bigint" })
    .references(() => products.id, DATABASE.REFERENCES_ACTIONS)
    .notNull(),

  name: varchar("name", { length: DATABASE.STRING_LENGTH.MEDIUM }).notNull(),

  ...commonFields,
});

export const productOptionValues = mysqlTable("product_option_values", {
  id: idField,

  productOptionId: bigint("product_option_id", { mode: "bigint" })
    .references(() => productOptions.id, DATABASE.REFERENCES_ACTIONS)
    .notNull(),

  value: varchar("value", {
    length: DATABASE.STRING_LENGTH.MEDIUM,
  }).notNull(),
  sortOrder: sortOrderField,

  ...commonFields,
});

export const productVariants = mysqlTable("product_variants", {
  id: idField,

  productId: bigint("product_id", { mode: "bigint" })
    .references(() => products.id, DATABASE.REFERENCES_ACTIONS)
    .notNull(),

  sku: varchar("sku", {
    length: DATABASE.STRING_LENGTH.MEDIUM,
  })
    .unique()
    .notNull(),

  originalPrice: decimal("original_price", { ...DATABASE.DECIMAL.MONEY }),
  price: decimal("price", { ...DATABASE.DECIMAL.MONEY }).notNull(),
  stock: int("stock", { unsigned: true }).default(0).notNull(),

  ...commonFields,
});

export const productVariantOptionValues = mysqlTable(
  "product_variant_option_values",
  {
    id: idField,

    productVariantId: bigint("product_variant_id", {
      mode: "bigint",
    }).notNull(),

    productOptionValueId: bigint("product_option_value_id", {
      mode: "bigint",
    }).notNull(),

    ...commonFields,
  },
  (table) => [
    foreignKey({
      columns: [table.productVariantId],
      foreignColumns: [productVariants.id],
      name: "p_v_o_v_product_variant_id_fk",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.productOptionValueId],
      foreignColumns: [productOptionValues.id],
      name: "p_v_o_v_product_option_value_id_fk",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const productAttachments = mysqlTable(
  "product_attachments",
  {
    id: idField,

    productId: bigint("product_id", { mode: "bigint" }),
    productOptionValueId: bigint("product_option_value_id", {
      mode: "bigint",
    }),
    productVariantId: bigint("product_variant_id", {
      mode: "bigint",
    }),

    isMain: boolean("is_main").default(false).notNull(),
    mediaPath: varchar("media_path", {
      length: DATABASE.STRING_LENGTH.MEDIUM,
    }).notNull(),
    mediaType: varchar("media_type", {
      length: DATABASE.STRING_LENGTH.TINY,
      enum: [
        ProductAttachmentMediaTypes.Image,
        ProductAttachmentMediaTypes.Video,
      ],
    })
      .default(ProductAttachmentMediaTypes.Image)
      .notNull(),
    sortOrder: sortOrderField,

    ...commonFields,
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "p_a_product_id_fk",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.productVariantId],
      foreignColumns: [productVariants.id],
      name: "p_a_product_variant_id_fk",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.productOptionValueId],
      foreignColumns: [productOptionValues.id],
      name: "p_a_product_option_value_id_fk",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const addresses = mysqlTable("addresses", {
  id: idField,

  firstName: varchar("first_name", {
    length: DATABASE.STRING_LENGTH.SMALL,
  }),
  lastName: varchar("last_name", {
    length: DATABASE.STRING_LENGTH.SMALL,
  }),

  email: varchar("email", {
    length: DATABASE.STRING_LENGTH.MEDIUM,
  }),
  phone: varchar("phone", { length: DATABASE.STRING_LENGTH.MINI }),

  address: varchar("address", {
    length: DATABASE.STRING_LENGTH.MEDIUM,
  }),
  city: varchar("city", { length: DATABASE.STRING_LENGTH.SMALL }),
  countryCode: char("country_code", { length: 2 }),
  postalCode: varchar("postal_code", { length: DATABASE.STRING_LENGTH.MINI }),

  ...commonFields,
});

export const orders = mysqlTable("orders", {
  id: idField,

  userId: varchar("user_id", { length: DATABASE.STRING_LENGTH.TINY }),

  order_number: char("order_number", { length: 20 }).notNull(),

  status: varchar("status", {
    length: 16,
    enum: [
      OrderStatus.Pending,
      OrderStatus.PreOrder,
      OrderStatus.Cancelled,
      OrderStatus.PaidRequest,
      OrderStatus.Processing,
      OrderStatus.Shipped,
      OrderStatus.Delivered,
    ],
  })
    .default(OrderStatus.Pending)
    .notNull(),
  paymentMethod: varchar("payment_method", {
    length: 16,
    enum: [
      OrderPaymentMethods.Stripe,
      OrderPaymentMethods.Paypal,
      OrderPaymentMethods.CashOnDelivery,
    ],
  })
    .default(OrderPaymentMethods.Paypal)
    .notNull(),
  paymentStatus: varchar("payment_status", {
    length: 16,
    enum: [OrderPaymentStatus.Unpaid, OrderPaymentStatus.Paid],
  })
    .default(OrderPaymentStatus.Unpaid)
    .notNull(),

  shippingAddressId: bigint("shipping_address_id", { mode: "bigint" })
    .references(() => addresses.id, DATABASE.REFERENCES_ACTIONS)
    .notNull(),

  billingAddressId: bigint("billing_address_id", { mode: "bigint" })
    .references(() => addresses.id, DATABASE.REFERENCES_ACTIONS)
    .notNull(),

  discountAmount: decimal("discount_amount", DATABASE.DECIMAL.MONEY)
    .default("0")
    .notNull(),
  taxAmount: decimal("tax_amount", DATABASE.DECIMAL.MONEY)
    .default("0")
    .notNull(),
  shippingFee: decimal("shipping_fee", DATABASE.DECIMAL.MONEY)
    .default("0")
    .notNull(),
  totalPrice: decimal("total_price", DATABASE.DECIMAL.MONEY)
    .default("0")
    .notNull(),

  ...commonFields,
});

export const orderItems = mysqlTable("order_items", {
  id: idField,

  orderId: bigint("order_id", { mode: "bigint" })
    .references(() => orders.id, DATABASE.REFERENCES_ACTIONS)
    .notNull(),
  productVariantId: bigint("product_variant_id", { mode: "bigint" })
    .references(() => productVariants.id, DATABASE.REFERENCES_ACTIONS)
    .notNull(),

  quantity: int("quantity", { unsigned: true }).default(1).notNull(),

  unitPrice: decimal("unit_price", DATABASE.DECIMAL.MONEY)
    .default("0")
    .notNull(),
  discountAmount: decimal("discount_amount", DATABASE.DECIMAL.MONEY)
    .default("0")
    .notNull(),
  taxAmount: decimal("tax_amount", DATABASE.DECIMAL.MONEY)
    .default("0")
    .notNull(),
  totalPrice: decimal("total_price", DATABASE.DECIMAL.MONEY)
    .default("0")
    .notNull(),

  ...commonFields,
});
