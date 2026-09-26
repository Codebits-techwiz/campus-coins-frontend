# CampusCoin API Integration Report

This document outlines the APIs currently integrated on the CampusCoin frontend. Please use this as a reference to ensure the backend perfectly matches the expected request payloads and response structures.

## 1. Authentication & Profile
- **`GET /api/users/profile`**
  - **Purpose:** Checks session and returns user profile.
  - **Response:** `{ success: true, data: { _id, name, email, role: 'student' | 'admin' } }`

## 2. Categories
- **`GET /api/categories`**
  - **Response:** `{ success: true, data: [ { _id, name, icon, type: 'income' | 'expense' } ] }`
- **`POST /api/categories`**
  - **Payload:** `{ name, icon, type }`
- **`PUT /api/categories/:id`**
  - **Payload:** `{ name, icon, type }`
- **`DELETE /api/categories/:id`**

## 3. Transactions
- **`GET /api/transactions`**
  - **Query Params:** `?page=1&limit=10&search=text&filter=expense`
  - **Response:** `{ success: true, data: { transactions: [...], pagination: { total, page, pages } } }`
- **`POST /api/transactions`**
  - **Payload:** `{ type, category (id), amount (number), description, date (ISO string) }`
- **`PUT /api/transactions/:id`**
  - **Payload:** Partial updates (amount, description, category, type, date)
- **`DELETE /api/transactions/:id`**

## 4. Advanced Transaction Features (AI & Bulk)
- **`POST /api/transactions/scan-receipt`**
  - **Type:** `multipart/form-data` (Field: `receipt`)
  - **Purpose:** OCR parsing of receipts.
  - **Response:** `{ success: true, data: { amount, merchant, date } }`
- **`POST /api/transactions/import-csv/preview`**
  - **Type:** `multipart/form-data` (Field: `file`)
  - **Purpose:** Parses CSV and optionally matches categories with AI.
  - **Response:** `{ success: true, data: { preview: [ { date, description, amount, type, categoryId, aiSuggestedCategory } ] } }`
- **`POST /api/transactions/import-csv/confirm`**
  - **Payload:** `{ rows: [ ... ] }` (Array of preview rows finalized by the user)
  - **Response:** `{ success: true }`

## 5. Templates (Quick-Add)
- **`GET /api/templates`**
  - **Response:** `{ success: true, data: [ { _id, name, category, amount, type } ] }`
- **`POST /api/templates`**
  - **Payload:** `{ name, type, category (id), amount }`
- **`DELETE /api/templates/:id`**

## 6. Budgets
- **`GET /api/budgets?month=YYYY-MM`**
  - **Response:** `{ success: true, data: [ { _id, category, limitAmount, currentSpent } ] }`

## 7. Dashboard & Analytics
- **`GET /api/dashboard/summary`**
  - **Expected Response:** 
    ```json
    {
      "success": true,
      "data": {
        "totals": { "income": 0, "expense": 0, "balance": 0 },
        "recentTransactions": [ ... ],
        "trends": {
          "sixMonth": [
            { "month": "Jan", "income": 1200, "expense": 800 }
          ]
        }
      }
    }
    ```
- **`GET /api/activity/recent`**
  - **Response:** `{ success: true, data: [ { _id, message, timestamp } ] }`

## 8. Notifications & Announcements
- **`GET /api/notifications`**
  - **Response:** `{ success: true, data: { notifications: [...], unreadCount: 0 } }`
- **`GET /api/announcements`**
  - **Response:** `{ success: true, data: [ { _id, title, body, active: true } ] }`

---

## 🛑 Missing / Pending Features (For Backend Developer)
1. **Dashboard Trends (`GET /api/dashboard/summary`)**
   - **Action Required:** Ensure the `trends.sixMonth` array returns properly formatted data (array of objects with `month`, `income`, `expense`). The frontend has been updated to rely on this rather than mock data.
2. **CSV Import Flow (`/import-csv/preview` & `/import-csv/confirm`)**
   - **Action Required:** The frontend integration for uploading and confirming CSV data is complete. Make sure the backend endpoints exist, can parse the CSV file accurately, optionally use AI for category matching on preview, and can bulk insert the finalized JSON payload on confirm.
3. **Receipt OCR (`/scan-receipt`)**
   - **Action Required:** Ensure the endpoint can process image uploads and extract `amount`, `merchant`, and `date`.
