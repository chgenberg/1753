// Database – 1753 SKINCARE
//
// PostgreSQL via pg (node-postgres).
// Railway injicerar DATABASE_URL automatiskt när PostgreSQL-addon läggs till.

const { Pool } = require("pg");
const crypto = require("crypto");

const FACE_KEY = process.env.FACE_ENCRYPTION_KEY
  ? Buffer.from(process.env.FACE_ENCRYPTION_KEY, "hex")
  : null;

function encryptImage(buffer) {
  if (!FACE_KEY) throw new Error("FACE_ENCRYPTION_KEY not configured");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", FACE_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { encrypted, iv, authTag };
}

function decryptImage(encrypted, iv, authTag) {
  if (!FACE_KEY) throw new Error("FACE_ENCRYPTION_KEY not configured");
  const decipher = crypto.createDecipheriv("aes-256-gcm", FACE_KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

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
      internal_notes  TEXT DEFAULT '',
      locale          VARCHAR(5) DEFAULT 'sv',
      tracking_number VARCHAR(255),
      tracking_url    TEXT,
      shipped_at      TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS idx_orders_merchant_trns ON orders (merchant_trns);
    CREATE INDEX IF NOT EXISTS idx_orders_order_number  ON orders (order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_viva_order_code ON orders (viva_order_code);

    CREATE SEQUENCE IF NOT EXISTS shared_order_seq START WITH 20000;

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
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(128);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMPTZ;

    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

    CREATE TABLE IF NOT EXISTS discount_codes (
      id              SERIAL PRIMARY KEY,
      code            VARCHAR(50) UNIQUE NOT NULL,
      percent         INTEGER NOT NULL DEFAULT 0,
      fixed_amount    INTEGER DEFAULT 0,
      description     VARCHAR(255) DEFAULT '',
      product_ids     JSONB,
      max_uses        INTEGER,
      used_count      INTEGER DEFAULT 0,
      valid_from      TIMESTAMPTZ,
      valid_until     TIMESTAMPTZ,
      active          BOOLEAN DEFAULT true,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS fixed_amount INTEGER DEFAULT 0;

    ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

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
      customer_email          VARCHAR(255),
      customer_name           VARCHAR(255),
      order_number            VARCHAR(50),
      paused_at               TIMESTAMPTZ,
      cancelled_at            TIMESTAMPTZ,
      created_at              TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
    ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
    ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);
    ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'SEK';

    ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'SEK';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'sv';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;

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
      skin_condition  VARCHAR(50) DEFAULT NULL,
      gdpr_consent    BOOLEAN DEFAULT true,
      unsubscribe_token VARCHAR(64) UNIQUE,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      unsubscribed_at TIMESTAMPTZ
    );

    ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS skin_condition VARCHAR(50) DEFAULT NULL;
    ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS last_emailed_at TIMESTAMPTZ DEFAULT NULL;

    CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
    CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers (status);
    CREATE INDEX IF NOT EXISTS idx_subscribers_skin ON subscribers (skin_condition);

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

    CREATE TABLE IF NOT EXISTS reviews (
      id              SERIAL PRIMARY KEY,
      product_id      VARCHAR(50) NOT NULL,
      reviewer_name   VARCHAR(255) NOT NULL,
      rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title           VARCHAR(500) DEFAULT '',
      body            TEXT DEFAULT '',
      reply           TEXT DEFAULT '',
      title_en        VARCHAR(500) DEFAULT '',
      body_en         TEXT DEFAULT '',
      reply_en        TEXT DEFAULT '',
      verified        BOOLEAN DEFAULT false,
      review_date     TIMESTAMPTZ,
      location        VARCHAR(255) DEFAULT '',
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title_en VARCHAR(500) DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS body_en TEXT DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_en TEXT DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title_es VARCHAR(500) DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS body_es TEXT DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_es TEXT DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title_de VARCHAR(500) DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS body_de TEXT DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_de TEXT DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title_fr VARCHAR(500) DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS body_fr TEXT DEFAULT '';
    ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_fr TEXT DEFAULT '';

    CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews (product_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (product_id, rating);

    CREATE TABLE IF NOT EXISTS wishlists (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL,
      product_id      VARCHAR(50) NOT NULL,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );

    CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists (user_id);

    CREATE TABLE IF NOT EXISTS addresses (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL,
      label           VARCHAR(100) DEFAULT 'Hem',
      address         VARCHAR(255) NOT NULL,
      zip             VARCHAR(10) NOT NULL,
      city            VARCHAR(100) NOT NULL,
      is_default      BOOLEAN DEFAULT false,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses (user_id);

    CREATE TABLE IF NOT EXISTS email_conversations (
      id              SERIAL PRIMARY KEY,
      from_email      VARCHAR(255) NOT NULL,
      from_name       VARCHAR(255) DEFAULT '',
      subject         VARCHAR(500) NOT NULL,
      body_text       TEXT NOT NULL,
      body_html       TEXT DEFAULT '',
      ai_draft        TEXT DEFAULT '',
      status          VARCHAR(20) DEFAULT 'pending',
      category        VARCHAR(50) DEFAULT 'general',
      customer_context JSONB DEFAULT '{}',
      admin_reply     TEXT DEFAULT '',
      sent_at         TIMESTAMPTZ,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_email_conv_status ON email_conversations (status);

    CREATE TABLE IF NOT EXISTS skin_analyses (
      id              SERIAL PRIMARY KEY,
      user_id         UUID REFERENCES users(id),
      answers         JSONB,
      result          JSONB,
      full_text       TEXT DEFAULT '',
      score           INTEGER,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_skin_analyses_user ON skin_analyses (user_id);

    CREATE TABLE IF NOT EXISTS face_snapshots (
      id              SERIAL PRIMARY KEY,
      user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      analysis_id     INTEGER REFERENCES skin_analyses(id) ON DELETE SET NULL,
      encrypted_image BYTEA NOT NULL,
      iv              BYTEA NOT NULL,
      auth_tag        BYTEA NOT NULL,
      width           INTEGER DEFAULT 640,
      height          INTEGER DEFAULT 640,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_face_snapshots_user ON face_snapshots (user_id);

    CREATE TABLE IF NOT EXISTS training_uploads (
      id              SERIAL PRIMARY KEY,
      image_data      TEXT NOT NULL,
      scan_results    JSONB,
      quiz_answers    JSONB,
      top_condition   VARCHAR(50),
      confidence      REAL,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS newsletter_drafts (
      id              SERIAL PRIMARY KEY,
      issue_number    INTEGER NOT NULL,
      type            VARCHAR(20) NOT NULL DEFAULT 'value',
      subject         VARCHAR(255) NOT NULL,
      preheader       VARCHAR(255) DEFAULT '',
      html_body       TEXT NOT NULL,
      sources         JSONB DEFAULT '[]',
      segment_title   VARCHAR(255) DEFAULT '',
      status          VARCHAR(20) DEFAULT 'draft',
      approved_at     TIMESTAMPTZ,
      sent_at         TIMESTAMPTZ,
      sent_count      INTEGER DEFAULT 0,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS system_config (
      key             VARCHAR(100) PRIMARY KEY,
      value           TEXT NOT NULL,
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS social_posts (
      id              SERIAL PRIMARY KEY,
      platform        VARCHAR(20) NOT NULL DEFAULT 'all',
      post_type       VARCHAR(30) NOT NULL DEFAULT 'product',
      image_url       TEXT,
      image_path      TEXT,
      caption_sv      TEXT,
      caption_en      TEXT,
      caption_linkedin_sv TEXT,
      caption_linkedin_en TEXT,
      hashtags        TEXT,
      reference_images JSONB DEFAULT '[]',
      prompt_used     TEXT,
      product_ids     JSONB DEFAULT '[]',
      status          VARCHAR(20) DEFAULT 'draft',
      scheduled_at    TIMESTAMPTZ,
      published_at    TIMESTAMPTZ,
      ig_post_id      VARCHAR(100),
      fb_post_id      VARCHAR(100),
      li_post_id      VARCHAR(100),
      error_message   TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Migrations
  try {
    await pool.query(`ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS li_post_id VARCHAR(100)`);
    await pool.query(`ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS caption_linkedin_sv TEXT`);
    await pool.query(`ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS caption_linkedin_en TEXT`);
  } catch (_) {}

  // Ensure shared_order_seq starts at 20000 minimum
  try {
    const seqCheck = await pool.query(
      `SELECT last_value FROM shared_order_seq`
    );
    const current = Number(seqCheck.rows[0].last_value);
    if (current < 20000) {
      await pool.query(`SELECT setval('shared_order_seq', 19999, false)`);
      console.log("[DB] shared_order_seq reset to start at 20000");
    }
  } catch {
    try {
      await pool.query(`SELECT setval('shared_order_seq', 19999, false)`);
      console.log("[DB] shared_order_seq initialized to start at 20000");
    } catch (e2) {
      console.warn("[DB] Could not set shared_order_seq:", e2.message);
    }
  }

  console.log("[DB] Schema ready");
}

// ---- CRUD helpers ----

async function createOrder({
  orderNumber, customerName, customerEmail, customerPhone,
  address, zip, city, vivaOrderCode, merchantTrns,
  items, totalAmount, shippingCost, currency, userId, locale
}) {
  const { rows } = await pool.query(
    `INSERT INTO orders
       (order_number, customer_name, customer_email, customer_phone,
        address, zip, city, viva_order_code, merchant_trns,
        items, total_amount, shipping_cost, currency, user_id, locale)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     RETURNING *`,
    [orderNumber, customerName, customerEmail, customerPhone || null,
     address, zip, city, vivaOrderCode, merchantTrns,
     JSON.stringify(items), totalAmount, shippingCost || 0, currency || "SEK",
     userId || null, locale || "sv"]
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
     SET internal_notes = COALESCE(internal_notes, '') || $2, updated_at = NOW()
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
  vivaInitialOrderCode, customerEmail, customerName, orderNumber
}) {
  const { rows } = await pool.query(
    `INSERT INTO subscriptions
       (user_id, product_id, product_name, quantity,
        interval_days, discount_percent, original_price, recurring_price,
        viva_initial_order_code, customer_email, customer_name, order_number)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [userId, productId, productName, quantity || 1,
     intervalDays || 60, discountPercent || 15, originalPrice, recurringPrice,
     vivaInitialOrderCode, customerEmail || null, customerName || null, orderNumber || null]
  );
  return rows[0];
}

async function findSubscriptionsByUser(userId) {
  const { rows } = await pool.query(
    `SELECT s.* FROM subscriptions s
     WHERE s.cancelled_at IS NULL
       AND (s.user_id = $1
            OR (s.user_id IS NULL
                AND LOWER(s.customer_email) = LOWER((SELECT email FROM users WHERE id = $1))))
     ORDER BY s.created_at DESC`,
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

async function findSubscriptionsByVivaCode(vivaOrderCode) {
  const { rows } = await pool.query(
    "SELECT * FROM subscriptions WHERE viva_initial_order_code = $1",
    [vivaOrderCode]
  );
  return rows;
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

async function findSubscribersBySkinCondition(condition) {
  const { rows } = await pool.query(
    "SELECT * FROM subscribers WHERE status = 'active' AND skin_condition = $1 ORDER BY created_at DESC",
    [condition]
  );
  return rows;
}

async function getSubscriberSkinSegments() {
  const { rows } = await pool.query(
    `SELECT skin_condition, COUNT(*)::int AS count
     FROM subscribers
     WHERE status = 'active' AND skin_condition IS NOT NULL
     GROUP BY skin_condition
     ORDER BY count DESC`
  );
  return rows;
}

async function updateSubscriberSkinCondition(email, skinCondition) {
  const { rows } = await pool.query(
    `UPDATE subscribers SET skin_condition = $2
     WHERE email = $1 RETURNING *`,
    [email.toLowerCase(), skinCondition]
  );
  return rows[0] || null;
}

async function touchSubscriberEmailed(subscriberId) {
  await pool.query(
    `UPDATE subscribers SET last_emailed_at = NOW() WHERE id = $1`,
    [subscriberId]
  );
}

async function canEmailSubscriber(subscriberId, cooldownHours = 24) {
  const { rows } = await pool.query(
    `SELECT last_emailed_at FROM subscribers WHERE id = $1`,
    [subscriberId]
  );
  if (!rows[0] || !rows[0].last_emailed_at) return true;
  const elapsed = Date.now() - new Date(rows[0].last_emailed_at).getTime();
  return elapsed >= cooldownHours * 3600000;
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

async function nextSharedOrderNumber() {
  const { rows } = await pool.query("SELECT nextval('shared_order_seq') AS num");
  return String(rows[0].num);
}

const nextOngoingOrderNumber = nextSharedOrderNumber;

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

async function createDiscountCode({ code, percent, fixedAmount, description, productIds, maxUses, validFrom, validUntil }) {
  const { rows } = await pool.query(
    `INSERT INTO discount_codes (code, percent, fixed_amount, description, product_ids, max_uses, valid_from, valid_until)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [code.toLowerCase(), percent || 0, fixedAmount || 0, description || "",
     productIds ? JSON.stringify(productIds) : null,
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

// ---- REVIEWS ----

async function createReview({ product_id, reviewer_name, rating, title, body, reply, verified, review_date, location }) {
  const { rows } = await pool.query(
    `INSERT INTO reviews (product_id, reviewer_name, rating, title, body, reply, verified, review_date, location)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [product_id, reviewer_name, rating, title || '', body || '', reply || '', verified || false, review_date || null, location || '']
  );
  return rows[0];
}

async function findReviewsByProduct(productId, limit = 10, offset = 0, locale = "sv") {
  const { rows } = await pool.query(
    `SELECT id, product_id, reviewer_name, rating,
       title, body, reply,
       title_en, body_en, reply_en,
       title_es, body_es, reply_es,
       title_de, body_de, reply_de,
       title_fr, body_fr, reply_fr,
       verified, review_date, location
     FROM reviews WHERE product_id = $1
     ORDER BY review_date DESC NULLS LAST
     LIMIT $2 OFFSET $3`,
    [productId, limit, offset]
  );
  if (locale !== "sv") {
    const suffix = ["en", "es", "de", "fr"].includes(locale) ? locale : "en";
    return rows.map((r) => ({
      ...r,
      title: r[`title_${suffix}`] || r.title_en || r.title,
      body: r[`body_${suffix}`] || r.body_en || r.body,
      reply: r[`reply_${suffix}`] || r.reply_en || r.reply,
    }));
  }
  return rows;
}

async function getReviewStats(productId) {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*)::int AS count,
       COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS avg,
       COUNT(*) FILTER (WHERE rating = 1)::int AS r1,
       COUNT(*) FILTER (WHERE rating = 2)::int AS r2,
       COUNT(*) FILTER (WHERE rating = 3)::int AS r3,
       COUNT(*) FILTER (WHERE rating = 4)::int AS r4,
       COUNT(*) FILTER (WHERE rating = 5)::int AS r5
     FROM reviews WHERE product_id = $1`,
    [productId]
  );
  const r = rows[0];
  return { count: r.count, avg: parseFloat(r.avg), distribution: [r.r1, r.r2, r.r3, r.r4, r.r5] };
}

async function getAllReviewStats() {
  const { rows } = await pool.query(
    `SELECT product_id,
       COUNT(*)::int AS count,
       COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS avg
     FROM reviews GROUP BY product_id`
  );
  const map = {};
  for (const r of rows) map[r.product_id] = { count: r.count, avg: parseFloat(r.avg) };
  return map;
}

async function countReviews() {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM reviews`);
  return rows[0].count;
}

// ---- WISHLISTS ----

async function getWishlist(userId) {
  const { rows } = await pool.query(
    "SELECT product_id, created_at FROM wishlists WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function addToWishlist(userId, productId) {
  const { rows } = await pool.query(
    `INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING RETURNING *`,
    [userId, productId]
  );
  return rows[0];
}

async function removeFromWishlist(userId, productId) {
  const { rowCount } = await pool.query(
    "DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2",
    [userId, productId]
  );
  return rowCount > 0;
}

// ---- SKIN ANALYSES ----

async function saveSkinAnalysis({ userId, score, summary, recommendations, fullResponse }) {
  const { rows } = await pool.query(
    `INSERT INTO skin_analyses (user_id, score, answers, result, full_text)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, score || null, JSON.stringify({ summary, recommendations }), JSON.stringify({ summary, recommendations }), fullResponse || ""]
  );
  return rows[0];
}

async function createSkinAnalysis({ userId, answers, result, fullText, score }) {
  const { rows } = await pool.query(
    `INSERT INTO skin_analyses (user_id, score, answers, result, full_text)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId || null, score || null, JSON.stringify(answers || {}), JSON.stringify(result || {}), fullText || ""]
  );
  return rows[0];
}

async function getSkinAnalyses(userId) {
  const { rows } = await pool.query(
    "SELECT id, score, answers, result, full_text, created_at FROM skin_analyses WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function getSkinMetricsHistory(userId, limit = 20) {
  const { rows } = await pool.query(
    `SELECT id, score, result->'metrics' as metrics, result->'skinAge' as skin_age,
            result->'fitzpatrick' as fitzpatrick, created_at
     FROM skin_analyses
     WHERE user_id = $1 AND result->'metrics' IS NOT NULL
     ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return rows;
}

// ---- FACE SNAPSHOTS (encrypted) ----

async function saveFaceSnapshot({ userId, analysisId, imageBuffer }) {
  const { encrypted, iv, authTag } = encryptImage(imageBuffer);
  const { rows } = await pool.query(
    `INSERT INTO face_snapshots (user_id, analysis_id, encrypted_image, iv, auth_tag)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, analysis_id, created_at`,
    [userId, analysisId || null, encrypted, iv, authTag]
  );
  return rows[0];
}

async function getFaceSnapshot(snapshotId, userId) {
  const { rows } = await pool.query(
    `SELECT encrypted_image, iv, auth_tag FROM face_snapshots WHERE id = $1 AND user_id = $2`,
    [snapshotId, userId]
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return decryptImage(r.encrypted_image, r.iv, r.auth_tag);
}

async function listFaceSnapshots(userId) {
  const { rows } = await pool.query(
    `SELECT fs.id, fs.analysis_id, fs.created_at, sa.score
     FROM face_snapshots fs
     LEFT JOIN skin_analyses sa ON sa.id = fs.analysis_id
     WHERE fs.user_id = $1
     ORDER BY fs.created_at DESC`,
    [userId]
  );
  return rows;
}

async function deleteFaceSnapshot(snapshotId, userId) {
  const { rowCount } = await pool.query(
    `DELETE FROM face_snapshots WHERE id = $1 AND user_id = $2`,
    [snapshotId, userId]
  );
  return rowCount > 0;
}

async function deleteAllFaceSnapshots(userId) {
  const { rowCount } = await pool.query(
    `DELETE FROM face_snapshots WHERE user_id = $1`,
    [userId]
  );
  return rowCount;
}

// ---- TRAINING UPLOADS ----

async function createTrainingUpload({ imageData, scanResults, quizAnswers, topCondition, confidence }) {
  const { rows } = await pool.query(
    `INSERT INTO training_uploads (image_data, scan_results, quiz_answers, top_condition, confidence)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, top_condition, confidence, created_at`,
    [imageData, JSON.stringify(scanResults || {}), JSON.stringify(quizAnswers || {}), topCondition || null, confidence || null]
  );
  return rows[0];
}

async function countTrainingUploads() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM training_uploads");
  return rows[0].count;
}

async function exportTrainingUploads({ limit = 100, offset = 0, condition = null } = {}) {
  let query = `SELECT id, top_condition, confidence, scan_results, quiz_answers, created_at
               FROM training_uploads`;
  const params = [];
  if (condition) {
    params.push(condition);
    query += ` WHERE top_condition = $${params.length}`;
  }
  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);
  const { rows } = await pool.query(query, params);
  return rows;
}

async function exportTrainingUploadImage(id) {
  const { rows } = await pool.query(
    `SELECT id, image_data, top_condition, confidence FROM training_uploads WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function getTrainingUploadStats() {
  const { rows } = await pool.query(
    `SELECT top_condition, COUNT(*)::int AS count, ROUND(AVG(confidence)::numeric, 2) AS avg_confidence
     FROM training_uploads
     WHERE top_condition IS NOT NULL
     GROUP BY top_condition
     ORDER BY count DESC`
  );
  const total = await countTrainingUploads();
  return { total, conditions: rows };
}

// ---- ADDRESSES ----

async function getAddresses(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC",
    [userId]
  );
  return rows;
}

async function createAddress({ userId, label, address, zip, city, isDefault }) {
  if (isDefault) {
    await pool.query("UPDATE addresses SET is_default = false WHERE user_id = $1", [userId]);
  }
  const { rows } = await pool.query(
    `INSERT INTO addresses (user_id, label, address, zip, city, is_default)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, label || "Hem", address, zip, city, isDefault || false]
  );
  return rows[0];
}

async function updateAddress(id, userId, fields) {
  if (fields.is_default) {
    await pool.query("UPDATE addresses SET is_default = false WHERE user_id = $1", [userId]);
  }
  const sets = [];
  const vals = [];
  let idx = 1;
  for (const [key, val] of Object.entries(fields)) {
    sets.push(`${key} = $${idx++}`);
    vals.push(val);
  }
  if (sets.length === 0) return null;
  vals.push(id, userId);
  const { rows } = await pool.query(
    `UPDATE addresses SET ${sets.join(", ")} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING *`,
    vals
  );
  return rows[0];
}

async function deleteAddress(id, userId) {
  const { rowCount } = await pool.query("DELETE FROM addresses WHERE id = $1 AND user_id = $2", [id, userId]);
  return rowCount > 0;
}

// ---- LOYALTY ----

async function addLoyaltyPoints(userId, points) {
  const { rows } = await pool.query(
    `UPDATE users SET loyalty_points = COALESCE(loyalty_points, 0) + $1 WHERE id = $2 RETURNING loyalty_points, tier`,
    [points, userId]
  );
  if (rows.length === 0) return null;
  const user = rows[0];
  let newTier = "Brons";
  if (user.loyalty_points >= 10000) newTier = "Platina";
  else if (user.loyalty_points >= 5000) newTier = "Guld";
  else if (user.loyalty_points >= 2000) newTier = "Silver";
  if (newTier !== user.tier) {
    await pool.query("UPDATE users SET tier = $1 WHERE id = $2", [newTier, userId]);
  }
  return { loyaltyPoints: user.loyalty_points, tier: newTier };
}

async function deductLoyaltyPoints(userId, points) {
  const { rows } = await pool.query(
    `UPDATE users SET loyalty_points = GREATEST(0, COALESCE(loyalty_points, 0) - $1) WHERE id = $2 RETURNING loyalty_points, tier`,
    [points, userId]
  );
  if (rows.length === 0) return 0;
  const user = rows[0];
  let newTier = "Brons";
  if (user.loyalty_points >= 10000) newTier = "Platina";
  else if (user.loyalty_points >= 5000) newTier = "Guld";
  else if (user.loyalty_points >= 2000) newTier = "Silver";
  if (newTier !== user.tier) {
    await pool.query("UPDATE users SET tier = $1 WHERE id = $2", [newTier, userId]);
  }
  return user.loyalty_points;
}

async function adminListReviews({ limit = 20, offset = 0, productId, rating, search } = {}) {
  let where = [];
  let params = [];
  let idx = 1;
  if (productId) { where.push(`product_id = $${idx++}`); params.push(productId); }
  if (rating) { where.push(`rating = $${idx++}`); params.push(parseInt(rating)); }
  if (search) { where.push(`(reviewer_name ILIKE $${idx} OR title ILIKE $${idx} OR body ILIKE $${idx})`); params.push(`%${search}%`); idx++; }
  const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

  const countRes = await pool.query(`SELECT COUNT(*)::int AS total FROM reviews ${whereClause}`, params);
  const { rows } = await pool.query(
    `SELECT * FROM reviews ${whereClause} ORDER BY review_date DESC NULLS LAST LIMIT $${idx} OFFSET $${idx + 1}`,
    [...params, limit, offset]
  );
  return { reviews: rows, total: countRes.rows[0].total };
}

async function updateReview(id, fields) {
  const sets = [];
  const vals = [];
  let idx = 1;
  for (const [key, val] of Object.entries(fields)) {
    sets.push(`${key} = $${idx++}`);
    vals.push(val);
  }
  if (sets.length === 0) return null;
  vals.push(id);
  const { rows } = await pool.query(
    `UPDATE reviews SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
    vals
  );
  return rows[0];
}

async function deleteReview(id) {
  const { rowCount } = await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
  return rowCount > 0;
}

// ---- NEWSLETTER DRAFT helpers ----

async function createNewsletterDraft({ issueNumber, type, subject, preheader, htmlBody, sources, segmentTitle }) {
  const { rows } = await pool.query(
    `INSERT INTO newsletter_drafts (issue_number, type, subject, preheader, html_body, sources, segment_title)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [issueNumber, type, subject, preheader || "", htmlBody, JSON.stringify(sources || []), segmentTitle || ""]
  );
  return rows[0];
}

async function getNewsletterDraft(id) {
  const { rows } = await pool.query("SELECT * FROM newsletter_drafts WHERE id = $1", [id]);
  return rows[0] || null;
}

async function listNewsletterDrafts({ status, limit = 20 } = {}) {
  let q = "SELECT * FROM newsletter_drafts";
  const params = [];
  if (status) {
    q += " WHERE status = $1";
    params.push(status);
  }
  q += " ORDER BY created_at DESC LIMIT $" + (params.length + 1);
  params.push(limit);
  const { rows } = await pool.query(q, params);
  return rows;
}

async function approveNewsletterDraft(id) {
  const { rows } = await pool.query(
    `UPDATE newsletter_drafts SET status = 'approved', approved_at = NOW() WHERE id = $1 AND status = 'draft' RETURNING *`,
    [id]
  );
  return rows[0] || null;
}

async function markNewsletterSent(id, sentCount) {
  const { rows } = await pool.query(
    `UPDATE newsletter_drafts SET status = 'sent', sent_at = NOW(), sent_count = $2 WHERE id = $1 RETURNING *`,
    [id, sentCount]
  );
  return rows[0] || null;
}

// ---- EMAIL CONVERSATIONS ----

async function createEmailConversation({ fromEmail, fromName, subject, bodyText, bodyHtml, aiDraft, category, customerContext }) {
  const { rows } = await pool.query(
    `INSERT INTO email_conversations (from_email, from_name, subject, body_text, body_html, ai_draft, category, customer_context)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [fromEmail, fromName || "", subject, bodyText, bodyHtml || "", aiDraft || "", category || "general", JSON.stringify(customerContext || {})]
  );
  return rows[0];
}

async function listEmailConversations({ status, page = 1, perPage = 25 }) {
  const conditions = [];
  const params = [];
  let idx = 1;
  if (status) { conditions.push(`status = $${idx++}`); params.push(status); }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * perPage;

  const countRes = await pool.query(`SELECT COUNT(*) AS total FROM email_conversations ${where}`, params);
  const total = parseInt(countRes.rows[0].total, 10);

  const dataRes = await pool.query(
    `SELECT * FROM email_conversations ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, perPage, offset]
  );
  return { conversations: dataRes.rows, total, page, perPage };
}

async function getEmailConversation(id) {
  const { rows } = await pool.query("SELECT * FROM email_conversations WHERE id = $1", [id]);
  return rows[0] || null;
}

async function updateEmailConversation(id, fields) {
  const sets = [];
  const params = [];
  let idx = 1;
  for (const [key, val] of Object.entries(fields)) {
    sets.push(`${key} = $${idx++}`);
    params.push(val);
  }
  if (sets.length === 0) return;
  params.push(id);
  await pool.query(`UPDATE email_conversations SET ${sets.join(", ")} WHERE id = $${idx}`, params);
}

// ---- System config (key-value store for tokens etc.) ----

async function getConfig(key) {
  const { rows } = await pool.query("SELECT value FROM system_config WHERE key = $1", [key]);
  return rows[0]?.value ?? null;
}

async function setConfig(key, value) {
  await pool.query(
    `INSERT INTO system_config (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, value]
  );
}

async function getFortnoxTokensFromDB() {
  const [accessToken, refreshToken, expiresAt] = await Promise.all([
    getConfig("fortnox_access_token"),
    getConfig("fortnox_refresh_token"),
    getConfig("fortnox_expires_at"),
  ]);
  return {
    accessToken: accessToken || "",
    refreshToken: refreshToken || "",
    expiresAt: expiresAt ? parseInt(expiresAt, 10) : 0,
  };
}

async function saveFortnoxTokensToDB(accessToken, refreshToken, expiresAt) {
  await Promise.all([
    setConfig("fortnox_access_token", accessToken),
    setConfig("fortnox_refresh_token", refreshToken),
    setConfig("fortnox_expires_at", String(expiresAt)),
  ]);
}

// ---- Social media posts ----

async function createSocialPost(data) {
  const { rows } = await pool.query(
    `INSERT INTO social_posts (platform, post_type, image_url, image_path, caption_sv, caption_en, caption_linkedin_sv, caption_linkedin_en, hashtags, reference_images, prompt_used, product_ids, status, scheduled_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING *`,
    [data.platform||'all', data.post_type||'product', data.image_url||null, data.image_path||null,
     data.caption_sv||null, data.caption_en||null, data.caption_linkedin_sv||null, data.caption_linkedin_en||null,
     data.hashtags||null, JSON.stringify(data.reference_images||[]), data.prompt_used||null,
     JSON.stringify(data.product_ids||[]), data.status||'draft', data.scheduled_at||null]
  );
  return rows[0];
}

async function updateSocialPost(id, fields) {
  const sets = [];
  const vals = [];
  let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) {
      sets.push(`${k} = $${i++}`);
      vals.push(typeof v === 'object' && v !== null && !(v instanceof Date) ? JSON.stringify(v) : v);
    }
  }
  if (sets.length === 0) return null;
  vals.push(id);
  const { rows } = await pool.query(
    `UPDATE social_posts SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    vals
  );
  return rows[0] || null;
}

async function listSocialPosts({ status, limit, offset } = {}) {
  let q = 'SELECT * FROM social_posts';
  const params = [];
  if (status) { q += ' WHERE status = $1'; params.push(status); }
  q += ' ORDER BY COALESCE(scheduled_at, created_at) DESC';
  if (limit) { q += ` LIMIT $${params.length + 1}`; params.push(limit); }
  if (offset) { q += ` OFFSET $${params.length + 1}`; params.push(offset); }
  const { rows } = await pool.query(q, params);
  return rows;
}

async function getSocialPost(id) {
  const { rows } = await pool.query('SELECT * FROM social_posts WHERE id = $1', [id]);
  return rows[0] || null;
}

async function deleteSocialPost(id) {
  await pool.query('DELETE FROM social_posts WHERE id = $1', [id]);
}

async function getDueSocialPosts() {
  const { rows } = await pool.query(
    `SELECT * FROM social_posts WHERE status = 'scheduled' AND scheduled_at <= NOW() ORDER BY scheduled_at ASC`
  );
  return rows;
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
  findSubscriptionsByVivaCode,
  updateSubscription,
  findDueSubscriptions,
  createSubscriptionCharge,
  createSubscriber,
  findSubscriberByEmail,
  findSubscriberByToken,
  unsubscribe,
  findActiveSubscribers,
  findSubscribersBySkinCondition,
  getSubscriberSkinSegments,
  updateSubscriberSkinCondition,
  touchSubscriberEmailed,
  canEmailSubscriber,
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
  nextSharedOrderNumber,
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
  adminTopProducts,
  createReview,
  findReviewsByProduct,
  getReviewStats,
  getAllReviewStats,
  countReviews,
  adminListReviews,
  updateReview,
  deleteReview,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  saveSkinAnalysis,
  createSkinAnalysis,
  getSkinAnalyses,
  getSkinMetricsHistory,
  createTrainingUpload,
  countTrainingUploads,
  exportTrainingUploads,
  exportTrainingUploadImage,
  getTrainingUploadStats,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  addLoyaltyPoints,
  deductLoyaltyPoints,
  createNewsletterDraft,
  getNewsletterDraft,
  listNewsletterDrafts,
  approveNewsletterDraft,
  markNewsletterSent,
  createEmailConversation,
  listEmailConversations,
  getEmailConversation,
  updateEmailConversation,
  getConfig,
  setConfig,
  getFortnoxTokensFromDB,
  saveFortnoxTokensToDB,
  saveFaceSnapshot,
  getFaceSnapshot,
  listFaceSnapshots,
  deleteFaceSnapshot,
  deleteAllFaceSnapshots,
  createSocialPost,
  updateSocialPost,
  listSocialPosts,
  getSocialPost,
  deleteSocialPost,
  getDueSocialPosts,
};