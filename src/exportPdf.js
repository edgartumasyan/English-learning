import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import notoSansUrl from "../fonts/NotoSans-Regular.ttf?url";
import notoArmenianUrl from "../fonts/NotoSansArmenian-Regular.ttf?url";

// jsPDF's built-in fonts don't cover Cyrillic or Armenian, so we register the
// Noto TTFs at runtime. They're fetched from static assets (kept out of the JS
// bundle) and cached after the first export.
let fontsReady = null;

async function fetchBase64(url) {
  const buffer = await (await fetch(url)).arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFonts() {
  if (!fontsReady) {
    fontsReady = Promise.all([
      fetchBase64(notoSansUrl),
      fetchBase64(notoArmenianUrl),
    ]);
  }
  return fontsReady;
}

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

export async function exportWordsToPdf(words, label = "vocabulary") {
  const [notoSans, notoArmenian] = await loadFonts();

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.addFileToVFS("NotoSans.ttf", notoSans);
  doc.addFont("NotoSans.ttf", "NotoSans", "normal");
  doc.addFileToVFS("NotoSansArmenian.ttf", notoArmenian);
  doc.addFont("NotoSansArmenian.ttf", "NotoSansArmenian", "normal");

  const accent = [59, 130, 246];
  const muted = [107, 114, 128];

  doc.setFont("NotoSans", "normal");
  doc.setFontSize(22);
  doc.setTextColor(...accent);
  doc.text("English Vocabulary", doc.internal.pageSize.getWidth() / 2, 48, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text(
    `${words.length} words`,
    doc.internal.pageSize.getWidth() / 2,
    64,
    { align: "center" },
  );

  autoTable(doc, {
    startY: 84,
    head: [["#", "ENGLISH", "RUSSIAN", "ARMENIAN"]],
    body: words.map((w, i) => [
      i + 1,
      clean(w.english),
      clean(w.russian),
      clean(w.armenian),
    ]),
    styles: { font: "NotoSans", fontSize: 9, cellPadding: 5, textColor: [26, 26, 46] },
    headStyles: {
      fillColor: [240, 244, 248],
      textColor: [55, 65, 81],
      fontSize: 8,
      fontStyle: "normal",
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 32, textColor: muted },
      3: { font: "NotoSansArmenian" },
    },
    margin: { left: 40, right: 40 },
  });

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFont("NotoSans", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text(
    `Generated on ${date}`,
    doc.internal.pageSize.getWidth() / 2,
    doc.internal.pageSize.getHeight() - 24,
    { align: "center" },
  );

  doc.save(`${label}-vocabulary.pdf`);
}
