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

    CREATE SEQUENCE IF NOT EXISTS ongoing_order_seq START WITH 10001;

    CREATE TABLE IF NOT EXISTS users (
      id              UUID PRIMARY KEY,
      name            VARCHAR(255) NOT NULL,
      email           VARCHAR(255) UNIQUE NOT NULL,
      phone           VARCHAR(50) DEFAULT '',
      password_hash   TEXT NOT NULL,
      role            VARCHAR(20) DEFAULT 'customer',
      loyalty_points  INTEGER DEFAULT 0,
      tier            VARCHAR(20) DEFAULT 'Brons',
      notifications   JSONB DEFAULT '{"email":true,"sms":false,"offers":true}',
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';

    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

    CREATE TABLE IF NOT EXISTS discount_codes (
      id              SERIAL PRIMARY KEY,
      code            VARCHAR(50) UNIQUE NOT NULL,
      percent         INTEGER NOT NULL,
      description     VARCHAR(255) DEFAULT '',
      product_ids     JSONB,
      max_uses        INTEGER,
      used_count      INTEGER DEFAULT 0,
      valid_from      TIMESTAMPTZ,
      valid_until     TIMESTAMPTZ,
      active          BOOLEAN DEFAULT true,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS returns (
      id                    SERIAL PRIMARY KEY,
      order_id              INTEGER REFERENCES orders(id),
      items                 JSONB NOT NULL,
      refund_amount         INTEGER NOT NULL,
      reason                TEXT DEFAULT '',
      fortnox_credit_number VARCHAR(50),
      ongoing_return_id     VARCHAR(50),
      status                VARCHAR(20) DEFAULT 'pending',
      created_at            TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id                      SERIAL PRIMARY KEY,
      user_id                 UUID REFERENCES users(id),
      status                  VARCHAR(20) DEFAULT 'pending',
      product_id              VARCHAR(50) NOT NULL,
      product_name            VARCHAR(255) NOT NULL,
      quantity                INTEGER DEFAULT 1,
      interval_days           INTEGER DEFAULT 60,
      discount_percent        INTEGER DEFAULT 15,
      original_price          INTEGER NOT NULL,
      recurring_price         INTEGER NOT NULL,
      viva_initial_order_code BIGINT,
      viva_initial_tx_id      VARCHAR(100),
      next_charge_date        DATE,
      last_charge_date        DATE,
      paused_at               TIMESTAMPTZ,
      cancelled_at            TIMESTAMPTZ,
      created_at              TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions (user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_viva ON subscriptions (viva_initial_order_code);

    CREATE TABLE IF NOT EXISTS subscription_charges (
      id                SERIAL PRIMARY KEY,
      subscription_id   INTEGER REFERENCES subscriptions(id),
      order_id          INTEGER REFERENCES orders(id),
      viva_tx_id        VARCHAR(100),
      amount            INTEGER NOT NULL,
      status            VARCHAR(20) DEFAULT 'pending',
      charged_at        TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id              SERIAL PRIMARY KEY,
      email           VARCHAR(255) UNIQUE NOT NULL,
      first_name      VARCHAR(255) DEFAULT '',
      status          VARCHAR(20) DEFAULT 'active',
      source          VARCHAR(50) DEFAULT 'footer',
      gdpr_consent    BOOLEAN DEFAULT true,
      unsubscribe_token VARCHAR(64) UNIQUE,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      unsubscribed_at TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
    CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers (status);

    CREATE TABLE IF NOT EXISTS automation_flows (
      id              SERIAL PRIMARY KEY,
      slug            VARCHAR(50) UNIQUE NOT NULL,
      name            VARCHAR(255) NOT NULL,
      trigger_event   VARCHAR(50) NOT NULL,
      steps           JSONB NOT NULL DEFAULT '[]',
      active          BOOLEAN DEFAULT true,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS automation_queue (
      id              SERIAL PRIMARY KEY,
      subscriber_id   INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
      flow_id         INTEGER REFERENCES automation_flows(id) ON DELETE CASCADE,
      current_step    INTEGER DEFAULT 0,
      status          VARCHAR(20) DEFAULT 'pending',
      context         JSONB DEFAULT '{}',
      next_send_at    TIMESTAMPTZ NOT NULL,
      last_sent_at    TIMESTAMPTZ,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      completed_at    TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS idx_autoqueue_pending ON automation_queue (status, next_send_at)
      WHERE status = 'pending';
    CREATE INDEX IF NOT EXISTS idx_autoqueue_subscriber ON automation_queue (subscriber_id);

    CREATE TABLE IF NOT EXISTS abandoned_carts (
      id              SERIAL PRIMARY KEY,
      email           VARCHAR(255) NOT NULL,
      items           JSONB NOT NULL,
      recovered       BOOLEAN DEFAULT false,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_abandoned_email ON abandoned_carts (email);
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

// ---- SUBSCRIPTION helpers ----

async function createSubscription({
  userId, productId, productName, quantity,
  intervalDays, discountPercent, originalPrice, recurringPrice,
  vivaInitialOrderCode
}) {
  const { rows } = await pool.query(
    `INSERT INTO subscriptions
       (user_id, product_id, product_name, quantity,
        interval_days, discount_percent, original_price, recurring_price,
        viva_initial_order_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [userId, productId, productName, quantity || 1,
     intervalDays || 60, discountPercent || 15, originalPrice, recurringPrice,
     vivaInitialOrderCode]
  );
  return rows[0];
}

async function findSubscriptionsByUser(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM subscriptions WHERE user_id = $1
     AND cancelled_at IS NULL ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function findSubscriptionById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM subscriptions WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function findSubscriptionByVivaCode(vivaOrderCode) {
  const { rows } = await pool.query(
    "SELECT * FROM subscriptions WHERE viva_initial_order_code = $1 LIMIT 1",
    [vivaOrderCode]
  );
  return rows[0] || null;
}

async function updateSubscription(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const setClauses = keys.map((k, i) => `${k} = $${i + 2}`);
  const { rows } = await pool.query(
    `UPDATE subscriptions SET ${setClauses.join(", ")} WHERE id = $1 RETURNING *`,
    [id, ...keys.map(k => fields[k])]
  );
  return rows[0] || null;
}

async function findDueSubscriptions() {
  const { rows } = await pool.query(
    `SELECT * FROM subscriptions
     WHERE status = 'active'
       AND next_charge_date <= CURRENT_DATE
       AND cancelled_at IS NULL
       AND paused_at IS NULL`
  );
  return rows;
}

async function createSubscriptionCharge({ subscriptionId, orderId, vivaTxId, amount, status }) {
  const { rows } = await pool.query(
    `INSERT INTO subscription_charges
       (subscription_id, order_id, viva_tx_id, amount, status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [subscriptionId, orderId || null, vivaTxId || null, amount, status || "pending"]
  );
  return rows[0];
}

// ---- SUBSCRIBER helpers ----

async function createSubscriber({ email, firstName, source, unsubscribeToken }) {
  const { rows } = await pool.query(
    `INSERT INTO subscribers (email, first_name, source, unsubscribe_token)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       status = CASE WHEN subscribers.status = 'unsubscribed' THEN 'active' ELSE subscribers.status END,
       first_name = COALESCE(NULLIF($2, ''), subscribers.first_name),
       unsubscribed_at = CASE WHEN subscribers.status = 'unsubscribed' THEN NULL ELSE subscribers.unsubscribed_at END
     RETURNING *`,
    [email.toLowerCase(), firstName || "", source || "footer", unsubscribeToken]
  );
  return rows[0];
}

async function findSubscriberByEmail(email) {
  const { rows } = await pool.query(
    "SELECT * FROM subscribers WHERE email = $1 LIMIT 1",
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

async function findSubscriberByToken(token) {
  const { rows } = await pool.query(
    "SELECT * FROM subscribers WHERE unsubscribe_token = $1 LIMIT 1",
    [token]
  );
  return rows[0] || null;
}

async function unsubscribe(token) {
  const { rows } = await pool.query(
    `UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = NOW()
     WHERE unsubscribe_token = $1 AND status = 'active' RETURNING *`,
    [token]
  );
  return rows[0] || null;
}

async function findActiveSubscribers() {
  const { rows } = await pool.query(
    "SELECT * FROM subscribers WHERE status = 'active' ORDER BY created_at DESC"
  );
  return rows;
}

// ---- AUTOMATION FLOW helpers ----

async function upsertFlow({ slug, name, triggerEvent, steps }) {
  const { rows } = await pool.query(
    `INSERT INTO automation_flows (slug, name, trigger_event, steps)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (slug) DO UPDATE SET
       name = $2, trigger_event = $3, steps = $4
     RETURNING *`,
    [slug, name, triggerEvent, JSON.stringify(steps)]
  );
  return rows[0];
}

async function findFlowBySlug(slug) {
  const { rows } = await pool.query(
    "SELECT * FROM automation_flows WHERE slug = $1 AND active = true LIMIT 1",
    [slug]
  );
  return rows[0] || null;
}

async function findFlowByTrigger(triggerEvent) {
  const { rows } = await pool.query(
    "SELECT * FROM automation_flows WHERE trigger_event = $1 AND active = true",
    [triggerEvent]
  );
  return rows;
}

// ---- AUTOMATION QUEUE helpers ----

async function enqueueAutomation({ subscriberId, flowId, context, nextSendAt }) {
  const existing = await pool.query(
    `SELECT id FROM automation_queue
     WHERE subscriber_id = $1 AND flow_id = $2 AND status = 'pending'`,
    [subscriberId, flowId]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  const { rows } = await pool.query(
    `INSERT INTO automation_queue (subscriber_id, flow_id, context, next_send_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [subscriberId, flowId, JSON.stringify(context || {}), nextSendAt || new Date()]
  );
  return rows[0];
}

async function findDueAutomations() {
  const { rows } = await pool.query(
    `SELECT aq.*, af.steps, af.slug AS flow_slug, af.name AS flow_name,
            s.email, s.first_name, s.status AS subscriber_status, s.unsubscribe_token
     FROM automation_queue aq
     JOIN automation_flows af ON af.id = aq.flow_id
     JOIN subscribers s ON s.id = aq.subscriber_id
     WHERE aq.status = 'pending'
       AND aq.next_send_at <= NOW()
       AND s.status = 'active'
     ORDER BY aq.next_send_at ASC
     LIMIT 50`
  );
  return rows;
}

async function advanceAutomation(queueId, { nextStep, nextSendAt }) {
  if (nextSendAt) {
    await pool.query(
      `UPDATE automation_queue
       SET current_step = $2, next_send_at = $3, last_sent_at = NOW()
       WHERE id = $1`,
      [queueId, nextStep, nextSendAt]
    );
  } else {
    await pool.query(
      `UPDATE automation_queue
       SET current_step = $2, status = 'completed', last_sent_at = NOW(), completed_at = NOW()
       WHERE id = $1`,
      [queueId, nextStep]
    );
  }
}

async function cancelAutomationsForSubscriber(subscriberId) {
  await pool.query(
    `UPDATE automation_queue SET status = 'cancelled'
     WHERE subscriber_id = $1 AND status = 'pending'`,
    [subscriberId]
  );
}

// ---- ABANDONED CART helpers ----

async function createAbandonedCart({ email, items }) {
  const { rows } = await pool.query(
    `INSERT INTO abandoned_carts (email, items) VALUES ($1, $2) RETURNING *`,
    [email.toLowerCase(), JSON.stringify(items)]
  );
  return rows[0];
}

async function markCartRecovered(email) {
  await pool.query(
    `UPDATE abandoned_carts SET recovered = true
     WHERE email = $1 AND recovered = false`,
    [email.toLowerCase()]
  );
}

async function nextOngoingOrderNumber() {
  const { rows } = await pool.query("SELECT nextval('ongoing_order_seq') AS num");
  return String(rows[0].num);
}

// ---- ADMIN helpers ----

async function findUserRole(userId) {
  const { rows } = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);
  return rows[0]?.role || "customer";
}

async function adminListOrders({ page = 1, perPage = 25, status, search }) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (status) {
    conditions.push(`status = $${idx++}`);
    params.push(status);
  }
  if (search) {
    conditions.push(`(order_number ILIKE $${idx} OR customer_name ILIKE $${idx} OR customer_email ILIKE $${idx})`);
    params.push(`%${search}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * perPage;

  const countRes = await pool.query(`SELECT COUNT(*) AS total FROM orders ${where}`, params);
  const total = parseInt(countRes.rows[0].total, 10);

  const dataRes = await pool.query(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, perPage, offset]
  );

  return { orders: dataRes.rows, total, page, perPage };
}

async function adminGetOrder(id) {
  const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
  return rows[0] || null;
}

async function adminGetStats() {
  const res = await pool.query(`
    SELECT
      COUNT(*) AS total_orders,
      COALESCE(SUM(total_amount + shipping_cost), 0) AS total_revenue,
      COALESCE(AVG(total_amount + shipping_cost), 0) AS avg_order_value,
      COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) AS fulfilled_orders,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_orders,
      COUNT(CASE WHEN status = 'partial' THEN 1 END) AS partial_orders,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) AS orders_today,
      COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN total_amount + shipping_cost END), 0) AS revenue_today,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS orders_week,
      COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN total_amount + shipping_cost END), 0) AS revenue_week,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) AS orders_month,
      COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN total_amount + shipping_cost END), 0) AS revenue_month
    FROM orders WHERE payment_status = 'paid'
  `);

  const customerCount = await pool.query("SELECT COUNT(DISTINCT customer_email) AS count FROM orders WHERE payment_status = 'paid'");
  const subCount = await pool.query("SELECT COUNT(*) AS count FROM subscriptions WHERE status = 'active' AND cancelled_at IS NULL");
  const subscriberCount = await pool.query("SELECT COUNT(*) AS count FROM subscribers WHERE status = 'active'");

  return {
    ...res.rows[0],
    unique_customers: parseInt(customerCount.rows[0].count, 10),
    active_subscriptions: parseInt(subCount.rows[0].count, 10),
    active_subscribers: parseInt(subscriberCount.rows[0].count, 10)
  };
}

async function adminChartData(days = 30) {
  const revenueByDay = await pool.query(`
    SELECT DATE(created_at) AS date,
           COUNT(*) AS orders,
           COALESCE(SUM(total_amount + shipping_cost), 0) AS revenue
    FROM orders
    WHERE payment_status = 'paid'
      AND created_at >= NOW() - MAKE_INTERVAL(days => $1)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `, [days]);

  const statusDist = await pool.query(`
    SELECT status, COUNT(*) AS count
    FROM orders
    WHERE payment_status = 'paid'
    GROUP BY status
  `);

  const allDates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    allDates.push(d.toISOString().split("T")[0]);
  }

  const dataMap = {};
  for (const row of revenueByDay.rows) {
    const dateStr = new Date(row.date).toISOString().split("T")[0];
    dataMap[dateStr] = { revenue: parseInt(row.revenue), orders: parseInt(row.orders) };
  }

  const daily = allDates.map(d => ({
    date: d,
    revenue: dataMap[d]?.revenue || 0,
    orders: dataMap[d]?.orders || 0
  }));

  return {
    daily,
    statusDistribution: statusDist.rows.map(r => ({ name: r.status, value: parseInt(r.count) }))
  };
}

async function adminTopProducts(limit = 10) {
  const { rows } = await pool.query(`
    SELECT item->>'id' AS product_id,
           item->>'name' AS product_name,
           SUM((item->>'quantity')::int) AS total_sold,
           SUM((item->>'price')::int * (item->>'quantity')::int) AS total_revenue
    FROM orders, jsonb_array_elements(items) AS item
    WHERE payment_status = 'paid'
    GROUP BY item->>'id', item->>'name'
    ORDER BY total_sold DESC
    LIMIT $1
  `, [limit]);
  return rows;
}

async function adminListCustomers({ page = 1, perPage = 25, search }) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (search) {
    conditions.push(`(customer_email ILIKE $${idx} OR customer_name ILIKE $${idx})`);
    params.push(`%${search}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * perPage;

  const countRes = await pool.query(
    `SELECT COUNT(DISTINCT customer_email) AS total FROM orders ${where}`, params
  );
  const total = parseInt(countRes.rows[0].total, 10);

  const dataRes = await pool.query(
    `SELECT customer_email, customer_name, customer_phone,
            COUNT(*) AS order_count,
            SUM(total_amount + shipping_cost) AS total_spent,
            MAX(created_at) AS last_order,
            MIN(created_at) AS first_order
     FROM orders ${where}
     GROUP BY customer_email, customer_name, customer_phone
     ORDER BY last_order DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, perPage, offset]
  );

  return { customers: dataRes.rows, total, page, perPage };
}

async function adminGetCustomer(email) {
  const orders = await pool.query(
    "SELECT * FROM orders WHERE customer_email = $1 ORDER BY created_at DESC",
    [email.toLowerCase()]
  );
  const subs = await pool.query(
    `SELECT s.* FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     WHERE u.email = $1 ORDER BY s.created_at DESC`,
    [email.toLowerCase()]
  );
  return { orders: orders.rows, subscriptions: subs.rows };
}

// ---- DISCOUNT CODE helpers ----

async function listDiscountCodes() {
  const { rows } = await pool.query("SELECT * FROM discount_codes ORDER BY created_at DESC");
  return rows;
}

async function findDiscountCode(code) {
  const { rows } = await pool.query(
    "SELECT * FROM discount_codes WHERE code = $1 LIMIT 1",
    [code.toLowerCase()]
  );
  return rows[0] || null;
}

async function createDiscountCode({ code, percent, description, productIds, maxUses, validFrom, validUntil }) {
  const { rows } = await pool.query(
    `INSERT INTO discount_codes (code, percent, description, product_ids, max_uses, valid_from, valid_until)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [code.toLowerCase(), percent, description || "", productIds ? JSON.stringify(productIds) : null,
     maxUses || null, validFrom || null, validUntil || null]
  );
  return rows[0];
}

async function updateDiscountCode(code, fields) {
  const allowed = ["percent", "description", "product_ids", "max_uses", "valid_from", "valid_until", "active"];
  const keys = Object.keys(fields).filter(k => allowed.includes(k));
  if (keys.length === 0) return null;
  const setClauses = keys.map((k, i) => `${k} = $${i + 2}`);
  const values = keys.map(k => k === "product_ids" && fields[k] ? JSON.stringify(fields[k]) : fields[k]);
  const { rows } = await pool.query(
    `UPDATE discount_codes SET ${setClauses.join(", ")} WHERE code = $1 RETURNING *`,
    [code.toLowerCase(), ...values]
  );
  return rows[0] || null;
}

async function deleteDiscountCode(code) {
  const { rowCount } = await pool.query("DELETE FROM discount_codes WHERE code = $1", [code.toLowerCase()]);
  return rowCount > 0;
}

async function incrementDiscountUsage(code) {
  await pool.query(
    "UPDATE discount_codes SET used_count = used_count + 1 WHERE code = $1",
    [code.toLowerCase()]
  );
}

// ---- RETURN helpers ----

async function createReturn({ orderId, items, refundAmount, reason, fortnoxCreditNumber, ongoingReturnId, status }) {
  const { rows } = await pool.query(
    `INSERT INTO returns (order_id, items, refund_amount, reason, fortnox_credit_number, ongoing_return_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [orderId, JSON.stringify(items), refundAmount, reason || "",
     fortnoxCreditNumber || null, ongoingReturnId || null, status || "pending"]
  );
  return rows[0];
}

async function findReturnsByOrder(orderId) {
  const { rows } = await pool.query("SELECT * FROM returns WHERE order_id = $1 ORDER BY created_at DESC", [orderId]);
  return rows;
}

async function adminListSubscriptions({ status, page = 1, perPage = 25 }) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (status) {
    conditions.push(`s.status = $${idx++}`);
    params.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * perPage;

  const countRes = await pool.query(`SELECT COUNT(*) AS total FROM subscriptions s ${where}`, params);
  const total = parseInt(countRes.rows[0].total, 10);

  const dataRes = await pool.query(
    `SELECT s.*, u.name AS user_name, u.email AS user_email
     FROM subscriptions s
     LEFT JOIN users u ON u.id = s.user_id
     ${where}
     ORDER BY s.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, perPage, offset]
  );

  return { subscriptions: dataRes.rows, total, page, perPage };
}

async function adminListSubscribers({ status, page = 1, perPage = 25 }) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (status) {
    conditions.push(`status = $${idx++}`);
    params.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * perPage;

  const countRes = await pool.query(`SELECT COUNT(*) AS total FROM subscribers ${where}`, params);
  const total = parseInt(countRes.rows[0].total, 10);

  const dataRes = await pool.query(
    `SELECT * FROM subscribers ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, perPage, offset]
  );

  return { subscribers: dataRes.rows, total, page, perPage };
}

async function adminNewsletterStats() {
  const subRes = await pool.query(`
    SELECT
      COUNT(*) AS total,
      COUNT(CASE WHEN status = 'active' THEN 1 END) AS active,
      COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) AS unsubscribed
    FROM subscribers
  `);
  const flowRes = await pool.query("SELECT * FROM automation_flows ORDER BY created_at DESC");
  const queueRes = await pool.query(`
    SELECT status, COUNT(*) AS count FROM automation_queue GROUP BY status
  `);
  return {
    subscribers: subRes.rows[0],
    flows: flowRes.rows,
    queue: queueRes.rows
  };
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
  countOrdersByEmail,
  createSubscription,
  findSubscriptionsByUser,
  findSubscriptionById,
  findSubscriptionByVivaCode,
  updateSubscription,
  findDueSubscriptions,
  createSubscriptionCharge,
  createSubscriber,
  findSubscriberByEmail,
  findSubscriberByToken,
  unsubscribe,
  findActiveSubscribers,
  upsertFlow,
  findFlowBySlug,
  findFlowByTrigger,
  enqueueAutomation,
  findDueAutomations,
  advanceAutomation,
  cancelAutomationsForSubscriber,
  createAbandonedCart,
  markCartRecovered,
  nextOngoingOrderNumber,
  findUserRole,
  adminListOrders,
  adminGetOrder,
  adminGetStats,
  adminListCustomers,
  adminGetCustomer,
  listDiscountCodes,
  findDiscountCode,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  incrementDiscountUsage,
  createReturn,
  findReturnsByOrder,
  adminListSubscriptions,
  adminListSubscribers,
  adminNewsletterStats,
  adminChartData,
  adminTopProducts
};
