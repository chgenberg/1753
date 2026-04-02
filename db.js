// Database – 1753 SKINCARE
//
// PostgreSQL via pg (node-postgres).
// Railway injicerar DATABASE_URL automatiskt när PostgreSQL-addon läggs till.

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false }
});

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id              SERIAL PRIMARY KEY,
      order_number    VARCHAR(50) UNIQUE NOT NULL,
      status          VARCHAR(20) DEFAULT 'pending',
      payment_status  VARCHAR(20) DEFAULT 'pending',
      customer_name   VARCHAR(255) NOT NULL,
      customer_email  VARCHAR(255) NOT NULL,
      customer_phone  VARCHAR(50),
      address         VARCHAR(255),
      zip             VARCHAR(10),
      city            VARCHAR(100),
      country_code    VARCHAR(2) DEFAULT 'SE',
      viva_order_code BIGINT,
      viva_transaction_id VARCHAR(100),
      merchant_trns   VARCHAR(100),
      fortnox_customer_number VARCHAR(50),
      fortnox_order_number    VARCHAR(50),
      fortnox_invoice_number  VARCHAR(50),
      ongoing_order_id        VARCHAR(50),
      items           JSONB NOT NULL,
      total_amount    INTEGER NOT NULL,
      shipping_cost   INTEGER DEFAULT 0,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW(),
      processed_at    TIMESTAMPTZ,
      internal_notes  TEXT DEFAULT ''
    );

    CREATE INDEX IF NOT EXISTS idx_orders_merchant_trns ON orders (merchant_trns);
    CREATE INDEX IF NOT EXISTS idx_orders_order_number  ON orders (order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_viva_order_code ON orders (viva_order_code);

    CREATE TABLE IF NOT EXISTS users (
      id              UUID PRIMARY KEY,
      name            VARCHAR(255) NOT NULL,
      email           VARCHAR(255) UNIQUE NOT NULL,
      phone           VARCHAR(50) DEFAULT '',
      password_hash   TEXT NOT NULL,
      loyalty_points  INTEGER DEFAULT 0,
      tier            VARCHAR(20) DEFAULT 'Brons',
      notifications   JSONB DEFAULT '{"email":true,"sms":false,"offers":true}',
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
  `);
  console.log("[DB] Schema ready");
}

// ---- CRUD helpers ----

async function createOrder({
  orderNumber, customerName, customerEmail, customerPhone,
  address, zip, city, vivaOrderCode, merchantTrns,
  items, totalAmount, shippingCost
}) {
  const { rows } = await pool.query(
    `INSERT INTO orders
       (order_number, customer_name, customer_email, customer_phone,
        address, zip, city, viva_order_code, merchant_trns,
        items, total_amount, shipping_cost)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [orderNumber, customerName, customerEmail, customerPhone || null,
     address, zip, city, vivaOrderCode, merchantTrns,
     JSON.stringify(items), totalAmount, shippingCost || 0]
  );
  return rows[0];
}

async function findOrderByMerchantTrns(merchantTrns) {
  const { rows } = await pool.query(
    "SELECT * FROM orders WHERE merchant_trns = $1 LIMIT 1",
    [merchantTrns]
  );
  return rows[0] || null;
}

async function findOrderByNumber(orderNumber) {
  const { rows } = await pool.query(
    "SELECT * FROM orders WHERE order_number = $1 LIMIT 1",
    [orderNumber]
  );
  return rows[0] || null;
}

async function findOrderByVivaCode(vivaOrderCode) {
  const { rows } = await pool.query(
    "SELECT * FROM orders WHERE viva_order_code = $1 LIMIT 1",
    [vivaOrderCode]
  );
  return rows[0] || null;
}

async function updateOrder(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setClauses = keys.map((k, i) => `${k} = $${i + 2}`);
  setClauses.push("updated_at = NOW()");

  const { rows } = await pool.query(
    `UPDATE orders SET ${setClauses.join(", ")} WHERE id = $1 RETURNING *`,
    [id, ...keys.map(k => fields[k])]
  );
  return rows[0] || null;
}

async function appendNotes(id, text) {
  const { rows } = await pool.query(
    `UPDATE orders
     SET internal_notes = internal_notes || $2, updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [id, text + "\n"]
  );
  return rows[0] || null;
}

// ---- USER helpers ----

async function createUser({ id, name, email, phone, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (id, name, email, phone, password_hash)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, name, email, phone, loyalty_points, tier, notifications, created_at`,
    [id, name, email.toLowerCase(), phone || "", passwordHash]
  );
  return rows[0];
}

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function updateUser(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const setClauses = keys.map((k, i) => `${k} = $${i + 2}`);
  setClauses.push("updated_at = NOW()");
  const { rows } = await pool.query(
    `UPDATE users SET ${setClauses.join(", ")} WHERE id = $1
     RETURNING id, name, email, phone, loyalty_points, tier, notifications, created_at`,
    [id, ...keys.map(k => fields[k])]
  );
  return rows[0] || null;
}

async function findOrdersByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, order_number, status, payment_status, items,
            total_amount, shipping_cost, created_at
     FROM orders WHERE customer_email = $1
     ORDER BY created_at DESC`,
    [email.toLowerCase()]
  );
  return rows;
}

async function countOrdersByEmail(email) {
  const { rows } = await pool.query(
    "SELECT COUNT(*) AS count FROM orders WHERE customer_email = $1 AND payment_status = 'paid'",
    [email.toLowerCase()]
  );
  return parseInt(rows[0].count, 10);
}

module.exports = {
  pool,
  initSchema,
  createOrder,
  findOrderByMerchantTrns,
  findOrderByNumber,
  findOrderByVivaCode,
  updateOrder,
  appendNotes,
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  findOrdersByEmail,
  countOrdersByEmail
};
