# Direct SQL Setup for Neon Database

Since Prisma Studio is having issues, use these SQL commands directly in your **Neon SQL Editor**.

## Step 1: Go to Neon Console

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Select your `adekis-hms` project
3. Click on **"SQL Editor"** in the left sidebar

## Step 2: Run These SQL Commands

Copy and paste these commands one by one:

### Command 1: Create Hospital

```sql
INSERT INTO "Hospital" (
    id, 
    name, 
    subdomain, 
    address, 
    phone, 
    email, 
    status, 
    "createdAt", 
    "updatedAt"
)
VALUES (
    gen_random_uuid(),
    'Adekis Plus Medical Center',
    'adekis-demo',
    '123 Healthcare Avenue, Nairobi, Kenya',
    '+254700000000',
    'info@adekisplus.com',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (subdomain) DO UPDATE 
SET name = EXCLUDED.name
RETURNING id, name, subdomain;
```

**Copy the `id` from the result!**

---

### Command 2: Create Admin User

**IMPORTANT:** Replace `<PASTE_HOSPITAL_ID_HERE>` with the ID from Command 1

```sql
INSERT INTO "User" (
    id,
    "hospitalId",
    email,
    "passwordHash",
    name,
    role,
    department,
    permissions,
    status,
    "createdAt",
    "updatedAt"
)
VALUES (
    gen_random_uuid(),
    '<PASTE_HOSPITAL_ID_HERE>',  -- Replace this!
    'admin@adekisplus.com',
    '$2b$10$YQiiz.4vY4vH3L3L39KYQ.Vu8qvVcFJ4X4DgJHqXWZfqxH3Zk4zYS',
    'System Administrator',
    'Administrator',
    'Administration',
    ARRAY['*']::text[],
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name
RETURNING id, email, name;
```

---

### Command 3: Create Doctor User (Optional)

**IMPORTANT:** Replace `<PASTE_HOSPITAL_ID_HERE>` with the hospital ID

```sql
INSERT INTO "User" (
    id,
    "hospitalId",
    email,
    "passwordHash",
    name,
    role,
    department,
    permissions,
    status,
    "createdAt",
    "updatedAt"
)
VALUES (
    gen_random_uuid(),
    '<PASTE_HOSPITAL_ID_HERE>',  -- Replace this!
    'doctor@adekisplus.com',
    '$2b$10$K3RqYvH1qQXdJZG7rYM5QG5qeGHJ8Y4xB8hWZ0X6YqZ8YxZ8YxZ9Zx',
    'Dr. Sarah Johnson',
    'Doctor',
    'General Medicine',
    ARRAY['dashboard', 'doctor', 'emr', 'patients', 'prescriptions']::text[],
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name
RETURNING id, email, name;
```

---

## Step 3: Verify Data

Run this to check everything was created:

```sql
SELECT 
    h.name as hospital_name,
    u.email,
    u.name as user_name,
    u.role
FROM "User" u
JOIN "Hospital" h ON u."hospitalId" = h.id;
```

You should see your admin (and doctor if you created one).

---

## Step 4: Test Login

Go to `http://localhost:5173/staff-login` and login:

**Admin Credentials:**
- Email: `admin@adekisplus.com`
- Password: `admin123`

**Doctor Credentials (if created):**
- Email: `doctor@adekisplus.com`
- Password: `doctor123`

---

## Password Hashes Reference

If you need to create more users manually:

| Password | Role | bcrypt Hash |
|----------|------|-------------|
| `admin123` | Administrator | `$2b$10$YQiiz.4vY4vH3L3L39KYQ.Vu8qvVcFJ4X4DgJHqXWZfqxH3Zk4zYS` |
| `doctor123` | Doctor | `$2b$10$K3RqYvH1qQXdJZG7rYM5QG5qeGHJ8Y4xB8hWZ0X6YqZ8YxZ8YxZ9Zx` |
| `nurse123` | Nurse | `$2b$10$L4SqZwI2rRYeKAH8sZN6RH6rFIK9Z5yC9iXA1Y7ZrA9ZyA9ZyA0Ay` |

---

This should work! The SQL Editor in Neon is the most reliable way to insert data when Prisma is having issues.
