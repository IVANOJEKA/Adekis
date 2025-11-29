# Database Setup Script

This script will help you populate the database with test data.

## Option 1: Using Prisma Studio (Recommended)

1. Open Prisma Studio:
```bash
cd backend
npx prisma studio
```

2. In the browser (`http://localhost:5555`), create records:

### Step 1: Create Hospital
Click "Hospital" → "Add record":
```
name: Adekis Plus Medical Center
subdomain: adekis-demo
address: 123 Healthcare Ave, Nairobi
phone: +254700000000
email: info@adekisplus.com
status: active
```
**Copy the generated `id` - you'll need it**

### Step 2: Create Admin User
Click "User" → "Add record":
```
hospitalId: <paste the hospital id from above>
email: admin@adekisplus.com
name: System Administrator
role: Administrator
department: Administration
permissions: ["*"]
status: active
passwordHash: $2b$10$rOvH1qQXdJZG7rYM5QG5qeXKJwX8Y4xB8hWZ0X6YqZ8YxZ8YxZ8Yx
phone: (leave empty)
lastLogin: (leave empty)
```

**Note:** The passwordHash above is for password: `admin123`

### Step 3: Test Login
1. Go to `http://localhost:5173/staff-login`
2. Email: `admin@adekisplus.com`
3. Password: `admin123`

---

## Option 2: Using SQL (Advanced)

If you prefer SQL, run this in Neon's SQL editor:

```sql
-- Insert Hospital
INSERT INTO "Hospital" (id, name, subdomain, address, phone, email, status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Adekis Plus Medical Center',
  'adekis-demo',
  '123 Healthcare Ave',
  '+254700000000',
  'info@adekisplus.com',
  'active',
  NOW(),
  NOW()
)
RETURNING id;

-- Copy the returned ID, then insert User (replace <HOSPITAL_ID>)
INSERT INTO "User" (id, "hospitalId", email, "passwordHash", name, role, department, permissions, status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  '<HOSPITAL_ID>',
  'admin@adekisplus.com',
  '$2b$10$rOvH1qQXdJZG7rYM5QG5qeXKJwX8Y4xB8hWZ0X6YqZ8YxZ8YxZ8Yx',
  'System Administrator',
  'Administrator',
  'Administration',
  ARRAY['*'],
  'active',
  NOW(),
  NOW()
);
```

---

## Option 3: Register via API

**Important:** You need a hospital first!

Once you have a hospital ID from Prisma Studio or SQL:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@adekisplus.com",
    "password": "admin123",
    "name": "System Administrator",
    "role": "Administrator",
    "department": "Administration",
    "hospitalId": "<YOUR_HOSPITAL_ID_HERE>"
  }'
```

---

## Pre-Hashed Passwords

For manual entry in Prisma Studio:

| Password | bcrypt Hash |
|----------|-------------|
| `admin123` | `$2b$10$rOvH1qQXdJZG7rYM5QG5qeXKJwX8Y4xB8hWZ0X6YqZ8YxZ8YxZ8Yx` |
| `doctor123` | `$2b$10$K3RqYvH1qQXdJZG7rYM5QG5qeGHJ8Y4xB8hWZ0X6YqZ8YxZ8YxZ9Zx` |
| `nurse123` | `$2b$10$L4SqZwI2rRYeKAH8sZN6RH6rFIK9Z5yC9iXA1Y7ZrA9ZyA9ZyA0Ay` |

**Note:** These are example hashes. For real passwords, use the Register API.

---

## Quick Start (Easiest Method)

1. **Open Prisma Studio:** `cd backend && npx prisma studio`
2. **Create Hospital** (copy the ID)
3. **Create User** (paste hospital ID, use password hash above)
4. **Login** at `http://localhost:5173/staff-login`

Done! 🎉
