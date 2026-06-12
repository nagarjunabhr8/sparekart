Build the Customer Login page for SpareKart at /shop/login.

Context:
- App: Next.js 15, TypeScript, Tailwind CSS
- File: app/shop/login/page.tsx
- Reference: sparekart.vercel.app/login (B2B) — mirror the split-panel layout exactly
- Brand color: Orange (#EA580C)
- This page uses NO navbar/footer — standalone auth page

LEFT PANEL (40% width, gradient background):
- Gradient: from #EA580C (orange) to #3730A3 (indigo) — matching /shop hero
- SpareKart logo top-left (white text)
- Center content:
  * Orange square avatar with "S" (same style as B2B but orange)
  * "SpareKart" title (white, 28px bold)
  * Subtitle: "Your trusted source for genuine automobile spare parts"
  * 3 feature bullets (white checkmarks in teal squares):
    ✓ Genuine Parts — OEM verified components
    ✓ Fast Delivery — 24-48 hours Pan-India
    ✓ Easy Returns — 30-day hassle-free policy

RIGHT PANEL (60% width, white):
- Title: "Welcome Back" (24px bold)
- Subtitle: "Sign in to your account"

AUTH TABS (underline style — same as B2B):
─── Tab 1: Email Login (default) ───
Fields:
  • Email Address input (placeholder: you@example.com)
  • Password input with show/hide eye icon toggle
  • Row: [☐ Remember me]  [Forgot password? →]
  • [Sign In] button — full width, bg #EA580C, white text, rounded

─── Tab 2: Mobile OTP ───
Fields:
  • Mobile Number (+91 prefix fixed, 10-digit input)
  • [Send OTP] button — outline orange, full width
  • OTP input: 6 individual boxes (auto-advance on input, backspace goes back)
    appears below after Send OTP is clicked
  • Countdown: "Resend in 30s" → becomes clickable "Resend OTP" after 30s
  • [Verify & Sign In] button — full width orange

DEMO CREDENTIALS BOX (amber bg, below primary button):
  "Demo Credentials:"
  📧 customer@sparekart.com / Customer@123
  📱 +91 9876543210 (OTP will be shown in browser console)

FORGOT PASSWORD inline panel (slides in on "Forgot password?" click):
  - Back arrow ← to return to login
  - Title: "Reset Password"
  - Email input
  - [Send Reset Link] button (orange)
  - Success: "✓ Link sent to {email}. Check your inbox." + "Back to Sign In"

BOTTOM:
  "Don't have an account? Create Account" → /shop/register

VALIDATION:
  - Email: valid format, show red border + message on blur if invalid
  - Password: min 8 chars
  - Mobile: exactly 10 digits, starts with 6-9
  - Disable button + show spinner while submitting

AUTH LOGIC (mock — no real backend):
  Email login:
    Accept: customer@sparekart.com / Customer@123
    Success → save to localStorage key "shop_user":
      { name: "Ravi Kumar", email: "customer@sparekart.com",
        phone: "9876543210", city: "Hyderabad", state: "Telangana",
        pincode: "500001", createdAt: new Date().toISOString() }
    Redirect to: searchParams.get('redirect') || '/shop'
    Wrong creds → red banner: "Invalid email or password. Please try again."

  Mobile OTP:
    Accept any valid 10-digit number
    Generate random 6-digit OTP, console.log("OTP:", otp)
    Accept that exact OTP
    Success → save { name: "Guest User", phone: inputPhone, createdAt: ... }
    Redirect to: /shop

  If shop_user already in localStorage on page mount → router.replace('/shop')

IMPORTANT: Use localStorage key "shop_user" ONLY. Never touch "b2b_user".