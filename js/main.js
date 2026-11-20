/* ==========================================================
   main.js — one file that runs all three pages.
   Each HTML page has <body data-page="home|product|admin">
   and we run only the code that belongs to that page.
   ========================================================== */

const STORAGE_KEY = "tahadu_products";

/* ---------- Helpers ---------- */

// Get products: saved ones (localStorage) first, otherwise the defaults from data.js
function getProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* storage blocked or broken: use defaults */ }
  return DEFAULT_PRODUCTS;
}

function saveProducts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Make text safe before putting it inside HTML
function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML.replace(/"/g, "&quot;");
}

function formatPrice(p) { return `${p} ${STORE.currency}`; }

/* ==========================================================
   HOME PAGE
   ========================================================== */
function initHome() {
  const grid = document.getElementById("grid");
  const filters = document.getElementById("filters");
  const products = getProducts();

  // Build the filter buttons: "الكل" + one per category
  let html = `<button class="active" data-cat="all">الكل</button>`;
  for (const key in CATEGORIES) {
    html += `<button data-cat="${key}">${CATEGORIES[key]}</button>`;
  }
  filters.innerHTML = html;

  // Draw the product cards for a category
  function render(cat) {
    const shown = cat === "all" ? products : products.filter(p => p.category === cat);
    if (shown.length === 0) {
      grid.innerHTML = `<p class="empty">لا توجد منتجات في هذا القسم حاليًا.</p>`;
      return;
    }
    grid.innerHTML = shown.map(p => `
      <a class="card" href="product.html?id=${encodeURIComponent(p.id)}">
        <img src="${esc(p.images[0] || "")}" alt="${esc(p.title)}" loading="lazy">
        <div class="card-body">
          <h3>${esc(p.title)}</h3>
          <span class="price">${formatPrice(esc(p.price))}</span>
        </div>
      </a>`).join("");
  }

  // When a filter button is clicked
  filters.addEventListener("click", e => {
    if (e.target.tagName !== "BUTTON") return;
    filters.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    render(e.target.dataset.cat);
  });

  render("all");
}

/* ==========================================================
   PRODUCT PAGE
   ========================================================== */
function initProduct() {
  const box = document.getElementById("product");
  const id = new URLSearchParams(location.search).get("id");   // from product.html?id=p1
  const p = getProducts().find(item => item.id === id);

  if (!p) {
    box.innerHTML = `<p class="empty">المنتج غير موجود. <a class="back" href="index.html">العودة للمتجر</a></p>`;
    return;
  }
  document.title = `${p.title} | ${STORE.name}`;

  // Pre-filled WhatsApp message: "أريد شراء هذا المنتج: <name>"
  const message = `أريد شراء هذا المنتج: ${p.title}`;
  const waLink = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;

  box.innerHTML = `
    <div class="gallery">
      <img class="main-img" id="mainImg" src="${esc(p.images[0] || "")}" alt="${esc(p.title)}">
      <div class="thumbs" id="thumbs">
        ${p.images.length > 1 ? p.images.map((src, i) =>
          `<img src="${esc(src)}" alt="صورة ${i + 1}" class="${i === 0 ? "active" : ""}">`).join("") : ""}
      </div>
    </div>
    <div class="info">
      <span class="tag">${esc(CATEGORIES[p.category] || "")}</span>
      <h1>${esc(p.title)}</h1>
      <span class="price">${formatPrice(esc(p.price))}</span>
      <p>${esc(p.description)}</p>
      <a class="btn green" href="${waLink}" target="_blank" rel="noopener">اطلب عبر الواتساب</a>
    </div>`;

  // Click a small image to show it big
  document.getElementById("thumbs").addEventListener("click", e => {
    if (e.target.tagName !== "IMG") return;
    document.getElementById("mainImg").src = e.target.src;
    document.querySelectorAll("#thumbs img").forEach(i => i.classList.remove("active"));
    e.target.classList.add("active");
  });
}

/* ==========================================================
   ADMIN PAGE
   ========================================================== */
function initAdmin() {
  const loginBox = document.getElementById("loginBox");
  const panel = document.getElementById("panel");

  // --- Login (remembered only until the tab is closed) ---
  function showPanel() {
    loginBox.hidden = true;
    panel.hidden = false;
    fillCategories();
    renderList();
  }

  document.getElementById("loginBtn").onclick = () => {
    if (document.getElementById("pass").value === STORE.adminPassword) {
      sessionStorage.setItem("tahadu_admin", "yes");
      showPanel();
    } else {
      document.getElementById("loginMsg").textContent = "كلمة المرور غير صحيحة";
    }
  };
  document.getElementById("logoutBtn").onclick = () => {
    sessionStorage.removeItem("tahadu_admin");
    location.reload();
  };

  // --- Form elements ---
  const f = {
    id: document.getElementById("pid"),
    title: document.getElementById("title"),
    price: document.getElementById("price"),
    category: document.getElementById("category"),
    description: document.getElementById("description"),
    images: document.getElementById("images")
  };
  const msg = document.getElementById("msg");

  function fillCategories() {
    f.category.innerHTML = Object.keys(CATEGORIES)
      .map(k => `<option value="${k}">${CATEGORIES[k]}</option>`).join("");
  }

  function clearForm() {
    f.id.value = ""; f.title.value = ""; f.price.value = "";
    f.description.value = ""; f.images.value = "";
    document.getElementById("formTitle").textContent = "إضافة منتج جديد";
  }

  // --- Show the list of products with Edit / Delete buttons ---
  function renderList() {
    const list = getProducts();
    document.getElementById("list").innerHTML = list.length ? list.map(p => `
      <div class="admin-item">
        <img src="${esc(p.images[0] || "")}" alt="">
        <div class="name"><strong>${esc(p.title)}</strong><br>${formatPrice(esc(p.price))}</div>
        <button class="btn small light" data-edit="${esc(p.id)}">تعديل</button>
        <button class="btn small danger" data-del="${esc(p.id)}">حذف</button>
      </div>`).join("") : `<p class="empty">لا توجد منتجات.</p>`;
  }

  document.getElementById("list").addEventListener("click", e => {
    const list = getProducts();

    if (e.target.dataset.edit) {               // Edit: put product data into the form
      const p = list.find(x => x.id === e.target.dataset.edit);
      f.id.value = p.id; f.title.value = p.title; f.price.value = p.price;
      f.category.value = p.category; f.description.value = p.description;
      f.images.value = p.images.join("\n");
      document.getElementById("formTitle").textContent = "تعديل المنتج";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (e.target.dataset.del && confirm("هل تريد حذف هذا المنتج؟")) {   // Delete
      saveProducts(list.filter(x => x.id !== e.target.dataset.del));
      renderList();
    }
  });

  // --- Save (add new or update existing) ---
  document.getElementById("saveBtn").onclick = () => {
    const images = f.images.value.split("\n").map(s => s.trim()).filter(Boolean);
    if (!f.title.value.trim() || !f.price.value || images.length === 0) {
      msg.textContent = "الرجاء تعبئة الاسم والسعر ورابط صورة واحد على الأقل";
      return;
    }
    const list = getProducts();
    const product = {
      id: f.id.value || "p" + Date.now(),      // new products get a unique id
      title: f.title.value.trim(),
      price: f.price.value,
      category: f.category.value,
      description: f.description.value.trim(),
      images: images
    };
    const index = list.findIndex(x => x.id === product.id);
    if (index >= 0) list[index] = product; else list.push(product);

    saveProducts(list);
    clearForm();
    renderList();
    msg.textContent = "تم الحفظ ✔";
  };
  document.getElementById("clearBtn").onclick = clearForm;

  // --- Export: copy the code to paste into js/data.js ---
  document.getElementById("exportBtn").onclick = () => {
    const code = "const DEFAULT_PRODUCTS = " + JSON.stringify(getProducts(), null, 2) + ";";
    const out = document.getElementById("exportOut");
    out.value = code;
    out.hidden = false;
    out.select();
    if (navigator.clipboard) navigator.clipboard.writeText(code);
    msg.textContent = "تم نسخ البيانات. الصقها في js/data.js مكان DEFAULT_PRODUCTS";
  };

  // --- Reset back to the default products ---
  document.getElementById("resetBtn").onclick = () => {
    if (confirm("سيتم حذف كل التعديلات والرجوع للمنتجات الافتراضية. متأكد؟")) {
      localStorage.removeItem(STORAGE_KEY);
      renderList();
    }
  };

  // Already logged in during this tab session? Skip the login box.
  if (sessionStorage.getItem("tahadu_admin") === "yes") showPanel();
}

/* ---------- Start the right code for the current page ---------- */
const page = document.body.dataset.page;
if (page === "home") initHome();
if (page === "product") initProduct();
if (page === "admin") initAdmin();
