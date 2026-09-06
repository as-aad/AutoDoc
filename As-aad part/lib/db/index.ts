import { neon } from '@neondatabase/serverless';

const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_JOXcLhajP36F@ep-floral-wave-azesk6cc-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export const sql = neon(databaseUrl);

export async function initDatabase() {
  try {
    // --- AUTHENTICATION & USERS TABLE ---
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        suspension_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // --- GARAGES & VERIFICATION TABLES ---
    await sql`
      CREATE TABLE IF NOT EXISTS garages (
        id VARCHAR(255) PRIMARY KEY,
        owner_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating NUMERIC(3,2) DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        verified BOOLEAN DEFAULT false,
        specialties TEXT[],
        image_url TEXT,
        cover_url TEXT,
        open_requests INTEGER DEFAULT 0,
        completed_jobs INTEGER DEFAULT 0,
        years_active INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ensure cover_url column exists if garages table was previously created without it
    await sql`ALTER TABLE garages ADD COLUMN IF NOT EXISTS cover_url TEXT;`;

    await sql`
      CREATE TABLE IF NOT EXISTS verifications (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        submitted_at VARCHAR(100) NOT NULL,
        documents TEXT[],
        status VARCHAR(50) DEFAULT 'pending',
        rejection_reason TEXT,
        location VARCHAR(255),
        specialties TEXT[]
      );
    `;

    // --- DISPUTES MEDIATION TABLE ---
    await sql`
      CREATE TABLE IF NOT EXISTS disputes (
        id VARCHAR(255) PRIMARY KEY,
        booking_id VARCHAR(255) NOT NULL,
        customer_id VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        garage_id VARCHAR(255) NOT NULL,
        garage_name VARCHAR(255) NOT NULL,
        reason TEXT NOT NULL,
        details TEXT NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        resolution_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // --- VEHICLES & REMINDERS TABLES ---
    await sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(255) PRIMARY KEY,
        owner_id VARCHAR(255) NOT NULL,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        plate VARCHAR(50) NOT NULL,
        color VARCHAR(50),
        vin VARCHAR(100),
        mileage INTEGER DEFAULT 0,
        health_score INTEGER DEFAULT 100,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vehicle_documents (
        id VARCHAR(255) PRIMARY KEY,
        vehicle_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        expiry_date VARCHAR(100) NOT NULL,
        uploaded_at VARCHAR(100) NOT NULL,
        file_url TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS maintenance_records (
        id VARCHAR(255) PRIMARY KEY,
        vehicle_id VARCHAR(255) NOT NULL,
        date VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        cost NUMERIC(10,2) NOT NULL,
        garage_name VARCHAR(255) NOT NULL,
        mileage INTEGER NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reminders (
        id VARCHAR(255) PRIMARY KEY,
        vehicle_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        due_date VARCHAR(100) NOT NULL,
        severity VARCHAR(50) DEFAULT 'info'
      );
    `;

    // --- REPAIR REQUESTS, QUOTES & BOOKINGS TABLES ---
    await sql`
      CREATE TABLE IF NOT EXISTS service_requests (
        id VARCHAR(255) PRIMARY KEY,
        vehicle_id VARCHAR(255) NOT NULL,
        vehicle_name VARCHAR(255),
        owner_id VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        photos TEXT[],
        location VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        urgency VARCHAR(50) DEFAULT 'medium',
        accepted_quote_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS accepted_quote_id VARCHAR(255);`;

    await sql`
      CREATE TABLE IF NOT EXISTS repair_requests (
        id VARCHAR(255) PRIMARY KEY,
        vehicle_id VARCHAR(255) NOT NULL,
        vehicle_name VARCHAR(255),
        owner_id VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        photos TEXT[],
        location VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        urgency VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id VARCHAR(255) PRIMARY KEY,
        request_id VARCHAR(255) NOT NULL,
        garage_id VARCHAR(255) NOT NULL,
        garage_name VARCHAR(255) NOT NULL,
        garage_rating NUMERIC(3,2) DEFAULT 5.0,
        garage_review_count INTEGER DEFAULT 0,
        garage_verified BOOLEAN DEFAULT false,
        price NUMERIC(10,2) NOT NULL,
        eta VARCHAR(100) NOT NULL,
        eta_hours INTEGER DEFAULT 24,
        notes TEXT,
        warranty_days INTEGER DEFAULT 90,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS garage_rating NUMERIC(3,2) DEFAULT 5.0;`;
    await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS garage_review_count INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS garage_verified BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS eta_hours INTEGER DEFAULT 24;`;
    await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS warranty_days INTEGER DEFAULT 90;`;

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(255) PRIMARY KEY,
        request_id VARCHAR(255),
        vehicle_id VARCHAR(255) NOT NULL,
        vehicle_name VARCHAR(255),
        customer_id VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(100),
        garage_id VARCHAR(255) NOT NULL,
        garage_name VARCHAR(255),
        mechanic_id VARCHAR(255),
        mechanic_name VARCHAR(255),
        service_title VARCHAR(255),
        service_type VARCHAR(100),
        service_description TEXT,
        price NUMERIC(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        scheduled_date VARCHAR(100),
        before_photos TEXT[],
        after_photos TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS service_bookings (
        id VARCHAR(255) PRIMARY KEY,
        request_id VARCHAR(255),
        vehicle_id VARCHAR(255) NOT NULL,
        vehicle_name VARCHAR(255),
        customer_id VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(100),
        garage_id VARCHAR(255) NOT NULL,
        garage_name VARCHAR(255),
        mechanic_id VARCHAR(255),
        mechanic_name VARCHAR(255),
        service_title VARCHAR(255),
        service_type VARCHAR(100),
        service_description TEXT,
        price NUMERIC(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        scheduled_date VARCHAR(100),
        before_photos TEXT[],
        after_photos TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(255) PRIMARY KEY,
        booking_id VARCHAR(255) UNIQUE NOT NULL,
        invoice_number VARCHAR(255) UNIQUE,
        labor_cost_cents INTEGER DEFAULT 0,
        parts_cost_json TEXT,
        total_cents INTEGER DEFAULT 0,
        warranty_months INTEGER DEFAULT 0,
        warranty_expires_at TIMESTAMP WITH TIME ZONE,
        pdf_url TEXT,
        issued_by_user_id VARCHAR(255),
        issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        garage_name VARCHAR(255),
        customer_name VARCHAR(255),
        vehicle_name VARCHAR(255),
        items JSONB DEFAULT '[]'::jsonb,
        subtotal NUMERIC(10,2) DEFAULT 0,
        tax NUMERIC(10,2) DEFAULT 0,
        total NUMERIC(10,2) DEFAULT 0,
        issued_date VARCHAR(100),
        warranty_days INTEGER DEFAULT 90,
        warranty_expiry VARCHAR(100)
      );
    `;

    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(255);`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS labor_cost_cents INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS parts_cost_json TEXT;`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS total_cents INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS warranty_months INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS warranty_expires_at TIMESTAMP WITH TIME ZONE;`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_url TEXT;`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issued_by_user_id VARCHAR(255);`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`;


    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(255) PRIMARY KEY,
        booking_id VARCHAR(255) NOT NULL,
        garage_id VARCHAR(255) NOT NULL,
        garage_name VARCHAR(255),
        customer_name VARCHAR(255),
        garage_rating NUMERIC(3,2) DEFAULT 5.0,
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS booking_messages (
        id VARCHAR(255) PRIMARY KEY,
        booking_id VARCHAR(255) NOT NULL,
        sender_id VARCHAR(255) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        sender_role VARCHAR(50) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mechanics (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        garage_id VARCHAR(255),
        specialization VARCHAR(255) DEFAULT 'General Repair',
        credential_url TEXT,
        pending_credential_url TEXT,
        application_status VARCHAR(50) DEFAULT 'PENDING',
        rating NUMERIC(3,2) DEFAULT 0.0,
        total_reviews INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // --- SPARE PARTS MARKETPLACE TABLES ---
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price_cents INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL,
        image TEXT,
        stock_quantity INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        total_cents INTEGER NOT NULL,
        stripe_checkout_session_id VARCHAR(255) UNIQUE,
        stripe_payment_intent_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price_cents_at_purchase INTEGER NOT NULL
      );
    `;

    // Seed System Accounts (Admin, Garage, Mechanic) if missing
    await sql`
      INSERT INTO users (id, name, email, password_hash, role, phone, location, status)
      VALUES 
        ('user-admin-1', 'System Administrator', 'admin@autodoc.com', 'admin123', 'admin', '+1 (415) 555-0999', 'San Francisco, CA', 'active'),
        ('user-garage-1', 'Marcus Thorne (Apex Motors)', 'owner@apexmotors.com', 'password123', 'garage', '+1 (415) 555-0100', 'San Francisco, CA', 'active'),
        ('user-mechanic-1', 'Jordan Reyes', 'jordan@apexmotors.com', 'password123', 'mechanic', '+1 (415) 555-0144', 'San Francisco, CA', 'active')
      ON CONFLICT (email) DO NOTHING;
    `;

    // Delete any legacy demo products so only real database products remain
    await sql`
      DELETE FROM products WHERE id IN ('prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8');
    `;

    return true;
  } catch (error) {
    console.error('Error initializing Neon database schema:', error);
    return false;
  }
}
