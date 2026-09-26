
# 08 Quick Reference Table

| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| POST | `/api/auth/register` | Public | Register student |
| POST | `/api/auth/login` | Public | Login student |
| POST | `/api/auth/admin-login` | Public | Login admin |
| POST | `/api/auth/logout` | Public | Clear session |
| POST | `/api/auth/forgot-password`| Public | Mock email reset |
| POST | `/api/auth/reset-password` | Public | Apply reset token |
| **Profile** | | | |
| GET | `/api/users/profile` | Student| Get profile info |
| PUT | `/api/users/profile` | Student| Update profile |
| **Categories** | | | |
| GET | `/api/categories` | Student| List user+default categories |
| POST | `/api/categories` | Student| Custom category |
| PUT | `/api/categories/:id`| Student| Edit custom category |
| DELETE | `/api/categories/:id`| Student| Delete custom category |
| **Transactions** | | | |
| GET | `/api/transactions` | Student| Filter/paginate |
| POST | `/api/transactions` | Student| Create manual tx |
| GET | `/api/transactions/:id`| Student| Detail + log view |
| PUT | `/api/transactions/:id`| Student| Edit tx |
| DELETE | `/api/transactions/:id`| Student| Soft delete |
| POST | `/api/transactions/import-csv/preview` | Student| CSV upload (preview) |
| POST | `/api/transactions/import-csv/confirm` | Student| CSV commit |
| POST | `/api/transactions/scan-receipt`| Student| OCR receipt upload |
| **Recurring** | | | |
| GET | `/api/recurring` | Student| List rules |
| POST | `/api/recurring` | Student| Create rule |
| PUT | `/api/recurring/:id`| Student| Edit rule |
| DELETE | `/api/recurring/:id`| Student| Delete rule |
| **Budgets**| | | |
| GET | `/api/budgets` | Student| Limits vs actuals |
| POST | `/api/budgets` | Student| Set budget |
| DELETE | `/api/budgets/:id` | Student| Clear budget |
| **Notifications**| | | |
| GET | `/api/notifications` | Student| Get unread counts |
| PATCH | `/api/notifications/:id/read`| Student| Mark read |
| **Dashboard**| | | |
| GET | `/api/dashboard/summary` | Student| Top-level metrics |
| **Reports**| | | |
| GET | `/api/reports/category-breakdown` | Student| Pie chart data |
| GET | `/api/reports/trend-6months` | Student| Bar chart data |
| GET | `/api/reports/daily-weekly` | Student| Averages |
| GET | `/api/reports/export-pdf` | Student| Download PDF |
| POST | `/api/reports/share-email` | Student| Send email |
| **AI** | | | |
| POST | `/api/ai/predict-category` | Student| Suggest cat |
| POST | `/api/ai/feedback` | Student| Improve model |
| GET | `/api/ai/monthly-insights` | Student| Narrative text |
| GET | `/api/ai/monthly-insights/history`| Student| Past insights |
| GET | `/api/ai/saving-tips` | Student| Get 3 tips |
| POST | `/api/ai/saving-tips/:id/pin` | Student| Pin a tip |
| POST | `/api/ai/saving-tips/:id/dismiss`| Student| Hide a tip |
| GET | `/api/ai/forecast` | Student| Next month prediction |
| **Bookmarks**| | | |
| GET | `/api/bookmarks` | Student| List bookmarks |
| POST | `/api/bookmarks` | Student| Bookmark insight |
| PATCH | `/api/bookmarks/:id` | Student| Edit note |
| DELETE | `/api/bookmarks/:id` | Student| Delete bookmark |
| **Activity** | | | |
| GET | `/api/activity/recent` | Student| Recently viewed items |
| **Announcements**| | | |
| GET | `/api/announcements` | Student| Active announcements |
| **Templates** | | | |
| GET | `/api/templates` | Student| Quick-add templates |
| POST | `/api/templates` | Student| Create template |
| PUT | `/api/templates/:id` | Student| Update template |
| DELETE | `/api/templates/:id` | Student| Delete template |
| **Admin Panel**| | | |
| GET | `/api/admin/stats` | Admin | Aggregated platform stats |
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/:id/status`| Admin | Disable/Enable user |
| POST | `/api/admin/users/:id/reset-password`|Admin | Force password reset |
| POST | `/api/admin/categories` | Admin | Create system category |
| PUT | `/api/admin/categories/:id`| Admin | Edit system category |
| DELETE | `/api/admin/categories/:id`| Admin | Delete system category |
| POST | `/api/admin/announcements` | Admin | Broadcast announcement |
| GET | `/api/admin/announcements` | Admin | List all broadcasts |
| PUT | `/api/admin/announcements/:id`| Admin | Edit broadcast |
| PATCH | `/api/admin/announcements/:id`| Admin | Toggle broadcast active |
| DELETE | `/api/admin/announcements/:id`| Admin | Delete broadcast |
| POST | `/api/admin/tip-templates` | Admin | Create AI template |
| GET | `/api/admin/tip-templates` | Admin | List AI templates |
| PUT | `/api/admin/tip-templates/:id`| Admin | Edit AI template |
| DELETE | `/api/admin/tip-templates/:id`| Admin | Delete AI template |
| **Health** | | | |
| GET | `/api/health` | Public | Uptime check |
