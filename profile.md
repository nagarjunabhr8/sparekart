Build the Customer Profile page for SpareKart at /shop/profile.

Context:
- App: Next.js 15, TypeScript, Tailwind CSS
- File: app/shop/profile/page.tsx
- Protected: wrap entire page in 
- Inside /shop layout (shows navbar + footer)
- Read/write user data via useShopAuth() hook

PAGE LAYOUT (2-col: sidebar + content):
Max-width 1100px, centered, padding top 32px

LEFT SIDEBAR (240px, sticky):
  Profile summary at top:
    Orange avatar circle (48px) with white initials
    User name (font-medium)
    Email or phone (text-sm text-gray-500)
  
  Vertical nav links (active = orange left border + orange text):
    👤  My Profile
    📍  Saved Addresses
    🚗  My Vehicles
    🔐  Change Password
    ─────────────────
    🚪  Sign Out  (red text)

RIGHT CONTENT (flex-1):
  Changes based on active sidebar item.

───────────────────────────
TAB: My Profile
───────────────────────────
Editable form pre-filled from useShopAuth().user:
  Full Name *
  Email (if exists)
  Mobile (+91 prefix, non-editable)
  City
  State (dropdown — all Indian states)
  Pincode
  Vehicle chips (multi-select: Car Bike Truck Auto SUV)

[Save Changes] button (orange)
On save: call updateUser(formValues), show toast "✓ Profile updated successfully" (top-right, 3s)

───────────────────────────
TAB: Saved Addresses
───────────────────────────
Read addresses from localStorage key "shop_addresses" (array).

Address cards (each):
  Name, phone, full address text
  Type badge: Home / Work / Other
  Default badge (green) if isDefault
  [Edit] [Delete] [Set as Default] buttons

[+ Add New Address] button → shows inline form below:
  Full Name *, Phone *, Address Line 1 *, Address Line 2, City *, State *, PIN *, Type (Home/Work/Other)
  [Save Address] / [Cancel]
  On save: push to shop_addresses array in localStorage

───────────────────────────
TAB: My Vehicles
───────────────────────────
Read from shop_user.vehicles + localStorage "shop_vehicles" (detailed list).

Vehicle cards (each):
  Brand | Model | Year | Fuel Type
  [Remove] button (red)

[+ Add Vehicle] → modal (centered overlay):
  Brand dropdown (Maruti, Hyundai, Tata, Honda, Mahindra, Toyota, Kia, Skoda)
  Model dropdown (dynamic based on brand — use brand→model mapping from home filter)
  Year dropdown (2005–2024)
  Fuel Type dropdown (Petrol, Diesel, CNG, Electric)
  [Add Vehicle] / [Cancel]
  On save: push to shop_vehicles array in localStorage

───────────────────────────
TAB: Change Password
───────────────────────────
Current Password (show/hide toggle)
New Password (show/hide + strength meter — 4 segment bar)
Confirm New Password (match validation)
[Update Password] (orange)
Mock: accept any current password, validate new password rules, show "✓ Password updated"

───────────────────────────
SIGN OUT
───────────────────────────
Clicking "Sign Out" in sidebar → show confirmation modal:
  "Are you sure you want to sign out?"
  [Cancel] [Sign Out] (red button)
  On confirm: logout() from useShopAuth() → router.push('/shop/login')