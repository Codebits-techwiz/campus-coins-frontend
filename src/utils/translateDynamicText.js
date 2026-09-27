// Translation helper for dynamic backend text (AI tips, categories, announcements, etc.)

const URDU_PHRASES = [
  // AI Tips & Summaries
  {
    match: /Great budget tracking.*meals and coffee/i,
    ur: "بہترین بجٹ ٹریکنگ! بچت کے نئے مواقع تلاش کرنے کے لیے اپنے روزمرہ کے کھانے اور کیفے کے اخراجات لاگ کرتے رہیں۔"
  },
  {
    match: /Food delivery spending rose 40%/i,
    ur: "اس مہینے فوڈ ڈیلیوری کا خرچ ۴۰٪ بڑھ گیا۔ ہفتہ وار آرڈرز محدود کرنے سے ۳،۵۰۰ روپے بچائے جا سکتے ہیں۔"
  },
  {
    match: /You saved Rs 1,200 on transport/i,
    ur: "آپ نے اس ہفتے رائیڈ شیئر پر حد لگا کر ۱،۲۰۰ روپے کی بچت کی!"
  },
  {
    match: /Your Food spend is 52%/i,
    ur: "آپ کا کھانے کا خرچ اس مہینے کے بجٹ کا ۵۲٪ ہے۔ ہفتے میں دو بار گھر سے کھانا لانے پر غور کریں۔"
  },
  {
    match: /Spotify and other subscriptions/i,
    ur: "اسپوٹیفائی اور دیگر سبسکرپشنز کا کل ۶۰۰ روپے ماہانہ ہوتا ہے۔ غیر ضروری ایپس چیک کریں۔"
  },
  {
    match: /You are Rs 2,400 away from your Rs 10,000 savings goal/i,
    ur: "آپ اپنے ۱۰،۰۰۰ روپے بچت گول سے صرف ۲،۴۰۰ روپے دور ہیں۔"
  },
  {
    match: /Bus pass top-ups beat ride-shares/i,
    ur: "بس پاس رائیڈ شیئرز سے زیادہ سستا رہتا ہے۔ یہ بہترین عادت برقرار رکھیں۔"
  },
  // Categories & Descriptions
  { match: /^Food$/i, ur: "کھانا" },
  { match: /^Transport$/i, ur: "ٹرانسپورٹ" },
  { match: /^Hostel\/Rent$/i, ur: "ہاسٹل / کرایہ" },
  { match: /^Academics$/i, ur: "پڑھائی" },
  { match: /^Subscriptions$/i, ur: "سبسکرپشنز" },
  { match: /^Entertainment$/i, ur: "تفریح" },
  { match: /^Allowance$/i, ur: "الاؤنس" },
  { match: /^Part-time Job$/i, ur: "پارٹ ٹائم ملازمت" },
  { match: /^Scholarship$/i, ur: "اسکالرشپ" },
  { match: /^Gift$/i, ur: "تحفہ" },
  { match: /^Other Income$/i, ur: "دیگر آمدنی" },
  { match: /^Miscellaneous$/i, ur: "متفرق" },
  { match: /Food & Canteen/i, ur: "کھانا اور کینٹین" },
  { match: /Food & Dining/i, ur: "کھانا اور کینٹین" },
  { match: /Academics & Books/i, ur: "پڑھائی اور کتابیں" },
  { match: /Hostel & Rent/i, ur: "ہاسٹل اور کرایہ" },
  { match: /Hostel Bill/i, ur: "ہاسٹل بل" },
  { match: /Transport & Commute/i, ur: "ٹرانسپورٹ اور سفر" },
  { match: /Canteen Chai & Snack/i, ur: "کینٹین چائے اور سنیک" },
  { match: /Semester Photocopies/i, ur: "سمسٹر فوٹو کاپیاں" },
  { match: /Hostel Shared Grocery/i, ur: "ہاسٹل گروسری" },
  { match: /High impact/i, ur: "زیادہ اثر" },
  { match: /Medium impact/i, ur: "درمیانہ اثر" },
  { match: /Low impact/i, ur: "کم اثر" },
  { match: /^high$/i, ur: "زیادہ" },
  { match: /^medium$/i, ur: "درمیانہ" },
  { match: /^low$/i, ur: "کم" },
  { match: /^low$/i, ur: "کم" }
];

export function translateDynamicText(text, lang = 'en') {
  if (!text || typeof text !== 'string') return text;
  if (lang !== 'ur') return text;

  for (const item of URDU_PHRASES) {
    if (item.match.test(text)) {
      return item.ur;
    }
  }

  return text;
}

