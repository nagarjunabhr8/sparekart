Build the Customer Registration page for SpareKart at /shop/register.

CONTEXT
- App: Next.js 15, TypeScript, Tailwind CSS
- File: app/shop/register/page.tsx
- Reference layout: sparekart.vercel.app/register (the B2B version) — reuse the same centered white-card design, but this customer version has only 2 steps (not 3), and NO GST / business type / plan selection.
- Brand color: Orange (#EA580C)
- Standalone page — do NOT render the shop navbar or footer
- Prerequisite: ShopAuthContext should already exist (uses localStorage key "shop_user"). If it doesn't exist yet, also create a minimal version that saves the user object to localStorage key "shop_user".

PAGE WRAPPER
- Light gray background (#F1F5F9), full height
- Centered white card: max-width 600px, border-radius 12px, padding 32px, subtle shadow

PROGRESS BAR (top of card)
- "Step X of 2" text above the bar
- Linear progress bar: orange fill for completed portion, gray for remaining
- Two step labels below the bar: "Personal Info" | "Verify & Secure"
- Active step label: orange text; completed step: gray text with a ✓ checkmark

════════════════════════════════
STEP 1 — PERSONAL INFORMATION
════════════════════════════════
Heading: "Create Your Account"

Fields (all required with * unless noted):

1. Full Name *
   - placeholder: "Your full name"
   - validate: min 3 chars, letters and spaces only

2. Mobile Number *
   - fixed "+91" prefix (non-editable gray box) + 10-digit input
   - placeholder: "10-digit mobile number"
   - validate: exactly 10 digits, must start with 6-9

3. Email Address *
   - placeholder: "your@email.com"
   - validate: valid email format
   - show inline "✓ Looks good" in green when valid

4. City *
   - text input, placeholder: "Your city"

5. State *
   - dropdown, all Indian states + UTs, alphabetically sorted:
     Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat,
     Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh,
     Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan,
     Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal,
     Andaman & Nicobar, Chandigarh, Dadra & Nagar Haveli, Daman & Diu, Delhi,
     Lakshadweep, Puducherry, Ladakh, Jammu & Kashmir

6. Pincode *
   - 6-digit input, placeholder: "6-digit pincode"
   - On valid 6-digit entry, auto-fill City and State from this mock mapping:
       500001 → Hyderabad, Telangana
       400001 → Mumbai, Maharashtra
       110001 → New Delhi, Delhi
       560001 → Bengaluru, Karnataka
       600001 → Chennai, Tamil Nadu
       700001 → Kolkata, West Bengal
       302001 → Jaipur, Rajasthan
       380001 → Ahmedabad, Gujarat
     (For other pincodes, leave City/State editable.)

7. My Vehicles (optional)
   - Multi-select chips (NOT a dropdown): [Car] [Bike] [Truck] [Auto] [SUV]
   - Selected chip: bg #EA580C, white text, no border
   - Unselected chip: white bg, gray border, gray text
   - Toggle selection on click

Buttons row:
   - [Back] — gray outline, disabled on Step 1
   - [Next →] — orange, right-aligned
   - Validate all required fields before advancing; show inline errors under each invalid field.

════════════════════════════════
STEP 2 — VERIFY & SECURE
════════════════════════════════
Heading: "Verify Your Account"

Section A — Mobile OTP:
   - Text: "OTP sent to +91 XXXXXX{last 4 digits}" (mask the middle 6 digits)
   - 6 individual OTP input boxes (auto-advance on input, backspace moves to previous box)
   - Countdown: "Resend in 30s" → becomes clickable "Resend OTP" after 30s
   - [Verify OTP] button (orange outline)
   - Mock: generate a random 6-digit OTP, console.log("OTP:", otp), and accept that exact value.

Section B — Set Password (fades in below ONLY after OTP is verified):
   - Password *
       - show/hide eye toggle
       - Password strength meter: 4 horizontal segments
           1 segment red = Weak, 2 amber = Fair, 3 blue = Good, 4 green = Strong
       - Rules checklist (each ✓ turns green when met):
           ✓ At least 8 characters
           ✓ One uppercase letter (A-Z)
           ✓ One number (0-9)
           ✓ One special character (!@#$%)
   - Confirm Password *
       - show/hide eye toggle
       - inline: "✓ Passwords match" (green) or "✗ Passwords do not match" (red)
   - Terms checkbox:
       "I agree to the Terms of Service and Privacy Policy" (placeholder links, open in new tab)
   - [Create Account] button — orange, full width
       - disabled until: OTP verified AND password valid AND terms checked

Buttons row:
   - [Back] — returns to Step 1, preserving entered values
   - [Create Account] — as above

════════════════════════════════
SUCCESS STATE
════════════════════════════════
After Create Account, show a full-card success overlay:
   - Animated green checkmark (pure CSS keyframe: scale 0 → 1)
   - "🎉 Account Created!"
   - "Welcome to SpareKart, {Full Name}!"
   - "Redirecting to shop in 3 seconds..."
   - [Start Shopping →] button (skips the countdown)

On success:
   - Save to localStorage key "shop_user":
       {
         name, email, phone, city, state, pincode,
         vehicles: selectedChips,
         createdAt: new Date().toISOString()
       }
   - router.push('/shop') after 3 seconds (or immediately on button click)

BOTTOM LINK
   "Already have an account? Sign In" → /shop/login

IMPORTANT
- Use localStorage key "shop_user" ONLY — never touch "b2b_user".
- Do NOT use any external auth or form library — implement with React useState/useEffect.
- Preserve Step 1 values when navigating Back from Step 2.
- Match the clean white-card aesthetic of the existing B2B /register page.