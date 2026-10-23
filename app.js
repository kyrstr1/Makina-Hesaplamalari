const links = [...document.querySelectorAll("[data-page]")];
function showPage(n, hash = true) {
  const v = ["delik", "torna", "vida", "disli", "koniklik", "bilgi"].includes(n)
    ? n
    : "delik";
  document
    .querySelectorAll(".tool-page,.info-page")
    .forEach((p) => (p.hidden = p.id !== `page-${v}`));
  links.forEach((a) => a.classList.toggle("active", a.dataset.page === v));
  document.title = `${document.querySelector(`#page-${v}`)?.dataset.title || "CNC Toolkit"} — CNC Toolkit`;
  document.querySelector("#nav").classList.remove("open");
  document.querySelector("#menu").setAttribute("aria-expanded", "false");
  if (hash && location.hash !== `#${v}`)
    history.replaceState(null, "", `#${v}`);
  window.scrollTo(0, 0);
}
links.forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(a.dataset.page);
  }),
);
window.addEventListener("hashchange", () =>
  showPage(location.hash.slice(1), false),
);
document.querySelector("#menu").addEventListener("click", () => {
  const n = document.querySelector("#nav");
  n.classList.toggle("open");
  document
    .querySelector("#menu")
    .setAttribute("aria-expanded", String(n.classList.contains("open")));
});
const themeBtn = document.querySelector("#theme");
function setTheme(t) {
  document.body.classList.toggle("dark", t === "dark");
  themeBtn.querySelector("span").textContent =
    t === "dark" ? "Koyu tema" : "Açık tema";
  try {
    localStorage.setItem("cnc-toolkit-theme", t);
  } catch {}
}
let saved;
try {
  saved = localStorage.getItem("cnc-toolkit-theme");
} catch {}
setTheme(
  saved ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
);
themeBtn.addEventListener("click", () =>
  setTheme(document.body.classList.contains("dark") ? "light" : "dark"),
);
const cone = document.querySelector("#cone-form");
cone.addEventListener("submit", (e) => {
  e.preventDefault();
  const D = +document.querySelector("#D").value,
    d = +document.querySelector("#d").value,
    L = +document.querySelector("#L").value,
    error = document.querySelector("#cone-error");
  let msg = "";
  if (!document.querySelector("#D").value || !Number.isFinite(D) || D <= 0)
    msg = "Büyük çap sıfırdan büyük geçerli bir sayı olmalıdır.";
  else if (!document.querySelector("#d").value || !Number.isFinite(d) || d <= 0)
    msg = "Küçük çap sıfırdan büyük geçerli bir sayı olmalıdır.";
  else if (D <= d) msg = "Büyük çap, küçük çaptan büyük olmalıdır.";
  else if (!document.querySelector("#L").value || !Number.isFinite(L) || L <= 0)
    msg = "Konik uzunluk sıfırdan büyük olmalıdır.";
  error.textContent = msg;
  error.hidden = !msg;
  if (msg) return;
  const a = (Math.atan((D - d) / (2 * L)) * 180) / Math.PI;
  document.querySelector("#alpha").innerHTML =
    `${a.toLocaleString("tr-TR", { maximumFractionDigits: 4 })}<small>°</small>`;
  document.querySelector("#beta").textContent =
    `${(2 * a).toLocaleString("tr-TR", { maximumFractionDigits: 4 })} °`;
});
document.querySelector("#cone-clear").addEventListener("click", () => {
  cone.reset();
  document.querySelector("#cone-error").hidden = true;
  document.querySelector("#alpha").innerHTML = "—<small>°</small>";
  document.querySelector("#beta").textContent = "— °";
});
const materials = [
  {
    mkeNorm: "Ç 1030",
    materialName: "34–42’lik çelik",
    hssRough: 26,
    hssFinish: 40,
    carbideRough: 130,
    carbideFinish: 180,
    group: "Çelikler",
  },
  {
    mkeNorm: "Ç 1040",
    materialName: "50’lik çelik",
    hssRough: 25,
    hssFinish: 35,
    carbideRough: 135,
    carbideFinish: 160,
    group: "Çelikler",
  },
  {
    mkeNorm: "Ç 1050",
    materialName: "60’lık çelik",
    hssRough: 23,
    hssFinish: 30,
    carbideRough: 100,
    carbideFinish: 140,
    group: "Çelikler",
  },
  {
    mkeNorm: "Ç 1060",
    materialName: "70’lik çelik",
    hssRough: 17,
    hssFinish: 25,
    carbideRough: 90,
    carbideFinish: 120,
    group: "Çelikler",
  },
  {
    mkeNorm: "Ç 1080",
    materialName: "85’lik çelik",
    hssRough: 14,
    hssFinish: 20,
    carbideRough: 70,
    carbideFinish: 100,
    group: "Çelikler",
  },
  {
    mkeNorm: "GS (DS) 45",
    materialName: "Çelik döküm",
    hssRough: 17,
    hssFinish: 25,
    carbideRough: 90,
    carbideFinish: 120,
    group: "Çelikler",
  },
  {
    mkeNorm: "Ç 3115",
    materialName: "Krom nikelli çelik",
    hssRough: 12,
    hssFinish: 18,
    carbideRough: 40,
    carbideFinish: 60,
    group: "Çelikler",
  },
  {
    mkeNorm: "Ç 5330",
    materialName: "Krom molibdenli çelik",
    hssRough: 12,
    hssFinish: 18,
    carbideRough: 40,
    carbideFinish: 60,
    group: "Çelikler",
  },
  {
    mkeNorm: "Ç 6120",
    materialName: "Krom vanadyumlu çelik",
    hssRough: 12,
    hssFinish: 18,
    carbideRough: 40,
    carbideFinish: 60,
    group: "Çelikler",
  },
  {
    mkeNorm: "Ç 10110",
    materialName: "Alet çeliği",
    hssRough: 10,
    hssFinish: 15,
    carbideRough: 30,
    carbideFinish: 45,
    group: "Çelikler",
  },
  {
    mkeNorm: "GG 12",
    materialName: "Font (gri dökme demir)",
    hssRough: 20,
    hssFinish: 30,
    carbideRough: 75,
    carbideFinish: 110,
    group: "Dökme demirler",
  },
  {
    mkeNorm: "GG 18",
    materialName: "Dövülür font",
    hssRough: 15,
    hssFinish: 22,
    carbideRough: 50,
    carbideFinish: 75,
    group: "Dökme demirler",
  },
  {
    mkeNorm: "GG 30",
    materialName: "Sert font",
    hssRough: 10,
    hssFinish: 15,
    carbideRough: 25,
    carbideFinish: 40,
    group: "Dökme demirler",
  },
  {
    mkeNorm: "CU 4",
    materialName: "Bakır",
    hssRough: 50,
    hssFinish: 75,
    carbideRough: 250,
    carbideFinish: 350,
    group: "Bakır alaşımları",
  },
  {
    mkeNorm: "H Pr 57",
    materialName: "Dökme pirinç",
    hssRough: 50,
    hssFinish: 75,
    carbideRough: 250,
    carbideFinish: 350,
    group: "Bakır alaşımları",
  },
  {
    mkeNorm: "H Pr 60 (2)",
    materialName: "Hadde pirinci",
    hssRough: 30,
    hssFinish: 50,
    carbideRough: 170,
    carbideFinish: 240,
    group: "Bakır alaşımları",
  },
  {
    mkeNorm: "Pr 95",
    materialName: "Kızıl",
    hssRough: 50,
    hssFinish: 75,
    carbideRough: 250,
    carbideFinish: 350,
    group: "Bakır alaşımları",
  },
  {
    mkeNorm: "BH 8",
    materialName: "Bronz",
    hssRough: 26,
    hssFinish: 40,
    carbideRough: 130,
    carbideFinish: 180,
    group: "Bakır alaşımları",
  },
  {
    mkeNorm: "AL 30",
    materialName: "Alüminyum",
    hssRough: 200,
    hssFinish: 300,
    carbideRough: 1000,
    carbideFinish: 1500,
    group: "Hafif metal alaşımları",
  },
  {
    mkeNorm: "",
    materialName: "Silumin",
    hssRough: 20,
    hssFinish: 30,
    carbideRough: 100,
    carbideFinish: 150,
    group: "Hafif metal alaşımları",
  },
  {
    mkeNorm: "",
    materialName: "Duralümin",
    hssRough: 40,
    hssFinish: 60,
    carbideRough: 200,
    carbideFinish: 300,
    group: "Hafif metal alaşımları",
  },
  {
    mkeNorm: "",
    materialName: "Magnezyum (kaynak tabloda: Magnevin)",
    hssRough: 120,
    hssFinish: 200,
    carbideRough: 600,
    carbideFinish: 700,
    group: "Hafif metal alaşımları",
  },
  {
    mkeNorm: "",
    materialName: "Elektron",
    hssRough: 150,
    hssFinish: 250,
    carbideRough: 600,
    carbideFinish: 1500,
    group: "Hafif metal alaşımları",
  },
];
const materialSelect = document.querySelector("#materialSelect"),
  toolSelect = document.querySelector("#toolSelect"),
  cutSelect = document.querySelector("#cutSelect"),
  diameterInput = document.querySelector("#diameterInput"),
  latheForm = document.querySelector("#calculatorForm"),
  errorNode = document.querySelector("#formError");
const displayMaterial = (m) =>
  `${m.mkeNorm ? `${m.mkeNorm} — ` : ""}${m.materialName}`;
function renderMaterials() {
  materials.forEach((m, i) => {
    const o = document.createElement("option");
    o.value = String(i);
    o.textContent = displayMaterial(m);
    materialSelect.append(o);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${m.mkeNorm || "—"}</td><td>${m.materialName}</td><td>${m.hssRough}</td><td>${m.hssFinish}</td><td>${m.carbideRough}</td><td>${m.carbideFinish}</td>`;
    document.querySelector("#materialTableBody").append(tr);
  });
}
function speed() {
  if (!materialSelect.value) return null;
  const m = materials[+materialSelect.value];
  return m[
    `${toolSelect.value}${cutSelect.value === "rough" ? "Rough" : "Finish"}`
  ];
}
function refreshSpeed() {
  const v = speed();
  document.querySelector("#speedValue").innerHTML =
    v === null ? "— <small>m/dk</small>" : `${v} <small>m/dk</small>`;
}
function parseDiameter(raw) {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!cleaned || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(cleaned)) return NaN;
  return Number(cleaned);
}
function showError(m) {
  errorNode.textContent = m;
  errorNode.hidden = false;
}
function clearLathe() {
  latheForm.reset();
  errorNode.hidden = true;
  refreshSpeed();
  document.querySelector("#resultNumber").innerHTML = "— <small>dev/dk</small>";
  document.querySelector("#resultDetails").innerHTML =
    "<p>Malzeme ve çap bilgilerini girin.</p>";
  document.querySelector("#resultPanel").classList.remove("has-result");
}
latheForm.addEventListener("submit", (e) => {
  e.preventDefault();
  errorNode.hidden = true;
  const m = materialSelect.value ? materials[+materialSelect.value] : null,
    D = parseDiameter(diameterInput.value);
  if (!m) return showError("Lütfen torna edilecek malzemeyi seç.");
  if (!diameterInput.value.trim()) return showError("İş parçası çapını gir.");
  if (!Number.isFinite(D) || D <= 0)
    return showError("Çap sıfırdan büyük, geçerli bir sayı olmalı.");
  const V = speed(),
    n = Math.round((1000 * V) / (Math.PI * D));
  document.querySelector("#resultNumber").innerHTML =
    `${new Intl.NumberFormat("tr-TR").format(n)} <small>dev/dk</small>`;
  document.querySelector("#resultDetails").innerHTML =
    `<div class="detail-row"><span>Malzeme</span><strong>${displayMaterial(m)}</strong></div><div class="detail-row"><span>Kesici takım</span><strong>${toolSelect.value === "hss" ? "Seri çelik (HSS)" : "Sert metal uç"}</strong></div><div class="detail-row"><span>Talaş türü</span><strong>${cutSelect.value === "rough" ? "Kaba talaş" : "İnce talaş"}</strong></div><div class="detail-row"><span>Kesme hızı (V)</span><strong>${V} m/dk</strong></div><div class="detail-row"><span>Çap (D)</span><strong>${new Intl.NumberFormat("tr-TR").format(D)} mm</strong></div>`;
  document.querySelector("#resultPanel").classList.add("has-result");
});
document.querySelector("#clearButton").addEventListener("click", clearLathe);
[materialSelect, toolSelect, cutSelect].forEach((e) =>
  e.addEventListener("change", refreshSpeed),
);
renderMaterials();
refreshSpeed();
const calculations = {
    pitch: (L, N) => L / N,
    height: (P) => 0.866025 * P,
    pitchDiameter: (d, P) => d - 0.64952 * P,
    feed: (P, n) => P * n,
  },
  byId = (id) => document.getElementById(id),
  val = (id) => Number(byId(id).value),
  positive = (x) => Number.isFinite(x) && x > 0,
  fmt = (x) =>
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 3 }).format(x);
function setOut(id, x, u) {
  byId(id).textContent = `${fmt(x)} ${u}`;
}
function updatePitch() {
  const L = val("pitch-length"),
    N = val("pitch-intervals");
  if (!positive(L) || !Number.isInteger(N) || N < 1) {
    byId("pitch-error").textContent =
      "Uzunluğu sıfırdan büyük, aralık sayısını pozitif tam sayı girin.";
    return;
  }
  byId("pitch-error").textContent = "";
  setOut("pitch-result", calculations.pitch(L, N), "mm");
  byId("pitch-formula").textContent = `P = ${fmt(L)} ÷ ${N}`;
}
function updateHeight() {
  const P = val("height-pitch");
  if (!positive(P)) {
    byId("height-error").textContent = "Hatve sıfırdan büyük olmalı.";
    return;
  }
  byId("height-error").textContent = "";
  setOut("height-result", calculations.height(P), "mm");
  byId("height-formula").textContent = `H = 0,866025 × ${fmt(P)}`;
}
function updateDiameter() {
  const d = val("diameter-size"),
    P = val("diameter-pitch"),
    out = calculations.pitchDiameter(d, P);
  if (!positive(d) || !positive(P) || !positive(out)) {
    byId("diameter-error").textContent =
      "Çap ve hatve pozitif olmalı; hesaplanan çap sıfırdan büyük kalmalı.";
    return;
  }
  byId("diameter-error").textContent = "";
  setOut("diameter-result", out, "mm");
  byId("diameter-formula").textContent = `d₂ = ${fmt(d)} − 0,64952 × ${fmt(P)}`;
}
function updateFeed() {
  const P = val("feed-pitch"),
    n = val("feed-rpm");
  if (!positive(P) || !positive(n)) {
    byId("feed-error").textContent = "Hatve ve devir sıfırdan büyük olmalı.";
    return;
  }
  byId("feed-error").textContent = "";
  setOut("feed-result", calculations.feed(P, n), "mm/dak");
  byId("feed-formula").textContent = `F = ${fmt(P)} × ${fmt(n)}`;
}
[
  ["pitch-length", "pitch-intervals", updatePitch],
  ["height-pitch", "height-pitch", updateHeight],
  ["diameter-size", "diameter-pitch", updateDiameter],
  ["feed-pitch", "feed-rpm", updateFeed],
].forEach(([a, b, fn]) => {
  byId(a).addEventListener("input", fn);
  if (a !== b) byId(b).addEventListener("input", fn);
});
byId("size-select").addEventListener("change", (e) => {
  if (e.target.value) {
    byId("diameter-size").value = e.target.value;
    updateDiameter();
  }
});
byId("diameter-size").addEventListener("input", () => {
  const o = [...byId("size-select").options].find(
    (x) => x.value === byId("diameter-size").value,
  );
  byId("size-select").value = o ? o.value : "";
});
document.querySelectorAll("[data-copy]").forEach((b) =>
  b.addEventListener("click", async () => {
    const t = byId(b.dataset.copy).textContent.trim();
    try {
      await navigator.clipboard.writeText(t);
    } catch {
      const x = document.createElement("textarea");
      x.value = t;
      document.body.append(x);
      x.select();
      document.execCommand("copy");
      x.remove();
    }
    b.textContent = "Kopyalandı";
    setTimeout(() => (b.textContent = "Kopyala"), 1300);
  }),
);
byId("thread-search").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  byId("thread-table")
    .querySelectorAll("tr")
    .forEach((r) => (r.hidden = !r.textContent.toLowerCase().includes(q)));
});
updatePitch();
updateHeight();
updateDiameter();
updateFeed();
showPage(location.hash.slice(1) || "delik", false);
