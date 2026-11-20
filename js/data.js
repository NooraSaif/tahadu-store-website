/* ==========================================================
   data.js — store settings + default sample products
   Edit this file to change the phone number, password, etc.
   ========================================================== */

const STORE = {
  name: "تهادوا",
  whatsapp: "0096895920269",      // WhatsApp number: country code + number, no "+" or spaces
  currency: "ر.ع",              // Shown after every price
  adminPassword: "tahadu2026"   // CHANGE THIS! (front-end only: keeps casual visitors out, not hackers)
};

// The categories. "all" is only used by the filter buttons.
const CATEGORIES = {
  flowers: "باقات ورد",
  boys:    "هدايا مواليد أولاد",
  girls:   "هدايا مواليد بنات"
};

// Default products. Replace the image links with your real photos
// (put photos in the images/ folder and use "images/photo1.jpg").
const DEFAULT_PRODUCTS = [
  { id: "p1", title: "باقة ورد وردية", price: 18, category: "flowers",
    description: "باقة ورد طبيعية بألوان هادئة، مناسبة لتهنئة الأم بالمولود الجديد.",
    images: ["https://placehold.co/700x700/F7DCD8/E0685E?text=Flowers+1", "https://placehold.co/700x700/FBF4EE/D9A23F?text=Flowers+1b"] },
  { id: "p2", title: "باقة ورد مع شوكولاتة", price: 25, category: "flowers",
    description: "باقة ورد منسقة مع علبة شوكولاتة فاخرة.",
    images: ["https://placehold.co/700x700/FBF4EE/E0685E?text=Flowers+2"] },
  { id: "p3", title: "هدية مولود أزرق", price: 30, category: "boys",
    description: "صندوق هدية يحتوي على ملابس قطنية ناعمة وبطانية ولعبة صغيرة للمولود.",
    images: ["https://placehold.co/700x700/CFE6E8/5E9DA3?text=Boy+Gift+1", "https://placehold.co/700x700/FBF4EE/5E9DA3?text=Boy+Gift+1b"] },
  { id: "p4", title: "طقم مولود أولاد", price: 22, category: "boys",
    description: "طقم أنيق من القطن الناعم مع تغليف هدايا جاهز.",
    images: ["https://placehold.co/700x700/CFE6E8/5E9DA3?text=Boy+Gift+2"] },
  { id: "p5", title: "هدية مولودة وردية", price: 30, category: "girls",
    description: "صندوق هدية يحتوي على ملابس ناعمة وربطة شعر وبطانية للمولودة.",
    images: ["https://placehold.co/700x700/F7DCD8/E0685E?text=Girl+Gift+1", "https://placehold.co/700x700/FBF4EE/E0685E?text=Girl+Gift+1b"] },
  { id: "p6", title: "طقم مولودة فاخر", price: 35, category: "girls",
    description: "طقم فاخر مع تغليف أنيق، مثالي كهدية للمواليد.",
    images: ["https://placehold.co/700x700/F7DCD8/D9A23F?text=Girl+Gift+2"] }
];
