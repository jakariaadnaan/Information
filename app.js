(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const digitsOnly = (value) => String(value || "").replace(/[^0-9]/g, "");

  function normalizeBdNumber(raw) {
    let digits = digitsOnly(raw);
    if (digits.startsWith("00880")) digits = digits.slice(2);
    if (digits.startsWith("880")) digits = digits.slice(3);
    if (digits.length === 10 && digits.startsWith("1")) digits = "0" + digits;
    return digits;
  }

  function rangeInfo(number) {
    const prefix = number.slice(0, 4);
    const ranges = {
      "013": "Grameenphone (013)",
      "017": "Grameenphone (017)",
      "014": "Banglalink (014)",
      "019": "Banglalink (019)",
      "015": "Teletalk (015)",
      "016": "Airtel / Robi range (016)",
      "018": "Robi (018)"
    };
    return ranges[number.slice(0, 3)] || "অজানা / যাচাই প্রয়োজন";
  }

  function validate(raw) {
    const normalized = normalizeBdNumber(raw);
    const valid = /^01[3-9]\d{8}$/.test(normalized);
    return { normalized, valid, formatted: valid ? "+880 " + normalized.slice(1, 5) + "-" + normalized.slice(5, 8) + "-" + normalized.slice(8) : "" };
  }

  function getReports() {
    try { return JSON.parse(localStorage.getItem("nlbd_reports") || "[]"); }
    catch (_) { return []; }
  }

  function findReports(number) {
    return getReports().filter((r) => r.number === number);
  }

  function runLookup() {
    const raw = $("phone").value.trim();
    const error = $("error");
    const result = $("result");
    error.hidden = true;
    if (!raw) {
      error.textContent = "প্রথমে একটি মোবাইল নম্বর লিখুন।";
      error.hidden = false;
      result.hidden = true;
      return;
    }
    const checked = validate(raw);
    if (!checked.valid) {
      error.textContent = "সঠিক বাংলাদেশি মোবাইল নম্বর দিন। উদাহরণ: 01712345678 বা +8801712345678";
      error.hidden = false;
      result.hidden = true;
      return;
    }
    const reports = findReports(checked.normalized);
    $("formattedNumber").textContent = checked.formatted;
    $("validBadge").textContent = "ফরম্যাট সঠিক";
    $("formatValue").textContent = "বাংলাদেশি মোবাইল · বৈধ গঠন";
    $("operatorValue").textContent = rangeInfo(checked.normalized);
    $("spamValue").textContent = reports.length ? reports.length + "টি লোকাল রিপোর্ট" : "কোনো লোকাল রিপোর্ট নেই";
    $("resultNote").textContent = reports.length
      ? "এগুলো শুধু এই ব্রাউজারে সংরক্ষিত রিপোর্ট। অভিযোগ সত্য প্রমাণ করে না এবং অন্য ব্যবহারকারীরা দেখতে পান না।"
      : "এটি শুধু নম্বরের গঠন ও প্রিফিক্স পরীক্ষা। কোনো লাইভ ডেটাবেসে অনুসন্ধান করা হয়নি। অপারেটর অনুমান নম্বর পোর্টেবিলিটির কারণে ভুল হতে পারে।";
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  $("lookupBtn").addEventListener("click", runLookup);
  $("phone").addEventListener("keydown", (event) => { if (event.key === "Enter") runLookup(); });

  $("reportForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const checked = validate($("reportPhone").value);
    if (!checked.valid) {
      $("reportMessage").textContent = "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন 01712345678)।";
      $("reportMessage").style.color = "#ff9d9d";
      return;
    }
    const report = {
      number: checked.normalized,
      type: $("reportType").value,
      details: $("reportDetails").value.trim().slice(0, 240),
      createdAt: new Date().toISOString()
    };
    const reports = getReports();
    reports.push(report);
    try {
      localStorage.setItem("nlbd_reports", JSON.stringify(reports.slice(-100)));
      $("reportMessage").textContent = "রিপোর্ট এই ব্রাউজারে সংরক্ষিত হয়েছে। এটি পাবলিক বা শেয়ার করা হয়নি।";
      $("reportMessage").style.color = "#8ee6d5";
      $("reportForm").reset();
    } catch (_) {
      $("reportMessage").textContent = "ব্রাউজার স্টোরেজে সংরক্ষণ করা যায়নি। ব্রাউজারের storage settings পরীক্ষা করুন।";
      $("reportMessage").style.color = "#ff9d9d";
    }
  });
})();