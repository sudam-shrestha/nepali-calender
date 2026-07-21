/*!
 * nepali-calendar.js
 * Dependency-free Bikram Sambat (BS) calendar date picker.
 * Shows a Nepali calendar UI; writes the equivalent English (AD) date
 * into a paired hidden input for form submission.
 *
 * Data range: BS 2000 - BS 2090 (approx AD 1943-04-14 to AD 2034-04-13)
 * Anchor: BS 2000/01/01 = AD 1943/04/14
 *
 * Usage (CDN / plain HTML):
 *   <script src="nepali-calendar.js"></script>
 *   <input type="text" id="dob">
 *   <script>NepaliCalendar.attach('#dob');</script>
 *
 * Works the same way when the file is loaded as an npm package (MERN)
 * or as a Vite/asset include in a Laravel Blade view - see README.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NepaliCalendar = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Verified BS month-length data, BS 2000-2090.
  // Cross-checked against official Nepali calendar records.
  // Row index 0 = BS 2000, each row = 12 month lengths (Baisakh..Chaitra).
  // ---------------------------------------------------------------------
  var MIN_YEAR = 2000;
  var DATA_STR = "30,32,31,32,31,30,30,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;30,32,31,32,31,30,30,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,29,30,30,29,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,29,30,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,29,30,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,30,29,31;31,31,31,32,31,31,30,29,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,30;31,32,31,32,31,30,30,30,29,30,29,31;31,31,31,32,31,31,30,29,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;30,32,31,32,31,30,30,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,31,32,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;30,32,31,32,31,30,30,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;30,32,31,32,31,31,29,30,30,29,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,29,30,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,29,30,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,30,29,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,30;31,32,31,32,31,30,30,30,29,30,29,31;31,31,31,32,31,31,30,29,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,30;31,32,31,32,31,30,30,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,31,32,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;30,32,31,32,31,30,30,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;30,32,31,32,31,31,29,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,29,30,30,29,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,29,30,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;31,31,31,32,31,31,30,29,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,30;31,32,31,32,31,30,30,30,29,30,29,31;31,31,31,32,31,31,30,29,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,30;31,32,31,32,31,30,30,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,31,31,31,30,29,30,29,30,30;31,32,31,32,31,30,30,30,29,29,30,31;30,32,31,32,31,30,30,30,29,30,29,31;31,31,32,31,31,31,30,29,30,29,30,30;31,31,32,31,31,31,30,30,29,30,30,30;30,31,32,32,30,31,30,30,29,30,30,30;30,32,31,32,31,30,30,30,29,30,30,30;30,32,31,32,31,30,30,30,29,30,30,30";

  var BS_DATA = DATA_STR.split(';').map(function (row) {
    return row.split(',').map(Number);
  });
  var MAX_YEAR = MIN_YEAR + BS_DATA.length - 1;

  // AD anchor date corresponding to BS MIN_YEAR/01/01
  var AD_ANCHOR = new Date(Date.UTC(1943, 3, 14)); // month is 0-indexed: April = 3
  var MS_PER_DAY = 86400000;

  var MONTH_NAMES_EN = ['Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Aswin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
  var MONTH_NAMES_NE = ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत'];
  var DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DAY_NAMES_NE = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];
  var NE_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

  function yearRow(y) {
    if (y < MIN_YEAR || y > MAX_YEAR) {
      throw new Error('NepaliCalendar: year ' + y + ' is outside supported range ' + MIN_YEAR + '-' + MAX_YEAR);
    }
    return BS_DATA[y - MIN_YEAR];
  }

  function daysInBsMonth(year, month /* 1-12 */) {
    return yearRow(year)[month - 1];
  }

  function daysInBsYear(year) {
    return yearRow(year).reduce(function (a, b) { return a + b; }, 0);
  }

  function toNepaliDigits(input) {
    return String(input).replace(/[0-9]/g, function (d) { return NE_DIGITS[d]; });
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  // ---- AD -> BS ----
  function adToBs(adDate) {
    var d = new Date(Date.UTC(adDate.getFullYear(), adDate.getMonth(), adDate.getDate()));
    var diffDays = Math.round((d - AD_ANCHOR) / MS_PER_DAY);
    if (diffDays < 0) throw new Error('NepaliCalendar: date is before supported range (BS ' + MIN_YEAR + '/01/01)');

    var year = MIN_YEAR;
    while (true) {
      var yLen = daysInBsYear(year);
      if (diffDays < yLen) break;
      diffDays -= yLen;
      year++;
      if (year > MAX_YEAR) throw new Error('NepaliCalendar: date is after supported range (BS ' + MAX_YEAR + ')');
    }

    var month = 1;
    while (true) {
      var mLen = daysInBsMonth(year, month);
      if (diffDays < mLen) break;
      diffDays -= mLen;
      month++;
    }

    return { year: year, month: month, day: diffDays + 1 };
  }

  // ---- BS -> AD ----
  function bsToAd(year, month, day) {
    yearRow(year); // validates range
    var totalDays = 0;
    for (var y = MIN_YEAR; y < year; y++) totalDays += daysInBsYear(y);
    for (var m = 1; m < month; m++) totalDays += daysInBsMonth(year, m);
    totalDays += (day - 1);

    var ms = AD_ANCHOR.getTime() + totalDays * MS_PER_DAY;
    var result = new Date(ms);
    return new Date(result.getUTCFullYear(), result.getUTCMonth(), result.getUTCDate());
  }

  function formatAd(adDate) {
    return adDate.getFullYear() + '-' + pad2(adDate.getMonth() + 1) + '-' + pad2(adDate.getDate());
  }

  function formatBs(bsDate, lang) {
    var y = bsDate.year, m = bsDate.month, d = bsDate.day;
    if (lang === 'ne') {
      return toNepaliDigits(y) + ' ' + MONTH_NAMES_NE[m - 1] + ' ' + toNepaliDigits(d);
    }
    return y + '-' + pad2(m) + '-' + pad2(d) + ' (' + MONTH_NAMES_EN[m - 1] + ')';
  }

  // ---------------------------------------------------------------------
  // Widget
  // ---------------------------------------------------------------------
  var instanceCount = 0;

  function attach(target, options) {
    var input = typeof target === 'string' ? document.querySelector(target) : target;
    if (!input) throw new Error('NepaliCalendar: target input not found: ' + target);

    var opts = Object.assign({
      lang: 'ne',            // 'ne' Nepali script or 'en' English month names
      nepaliDigits: true,    // use Nepali numerals in the visible UI
      hiddenInputName: null, // name attribute for the auto-created AD hidden input
      hiddenInputSelector: null, // OR: reuse an existing input for the AD value
      onSelect: null         // callback({ bs, ad, adFormatted, bsFormatted })
    }, options || {});

    instanceCount++;
    input.readOnly = true;
    input.classList.add('ncal-input');
    input.placeholder = input.placeholder || (opts.lang === 'ne' ? 'मिति छान्नुहोस्' : 'Select date');

    var hiddenInput = null;
    if (opts.hiddenInputSelector) {
      hiddenInput = document.querySelector(opts.hiddenInputSelector);
    } else {
      hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = opts.hiddenInputName || (input.name ? input.name + '_ad' : 'ncal_ad_' + instanceCount);
      input.insertAdjacentElement('afterend', hiddenInput);
    }

    var today = adToBs(new Date());
    var view = { year: today.year, month: today.month };
    var selected = null;

    var panel = document.createElement('div');
    panel.className = 'ncal-panel';
    panel.style.display = 'none';
    document.body.appendChild(panel);

    function monthName(m) {
      return opts.lang === 'ne' ? MONTH_NAMES_NE[m - 1] : MONTH_NAMES_EN[m - 1];
    }
    function dayHeader(i) {
      return opts.lang === 'ne' ? DAY_NAMES_NE[i] : DAY_NAMES_EN[i];
    }
    function digit(n) {
      return opts.nepaliDigits ? toNepaliDigits(n) : String(n);
    }

    function render() {
      var firstOfMonthAd = bsToAd(view.year, view.month, 1);
      var startWeekday = firstOfMonthAd.getDay(); // 0=Sun
      var totalDays = daysInBsMonth(view.year, view.month);

      var html = '';
      html += '<div class="ncal-header">';
      html += '<button type="button" class="ncal-nav" data-nav="prev-year">&laquo;</button>';
      html += '<button type="button" class="ncal-nav" data-nav="prev-month">&lsaquo;</button>';
      html += '<div class="ncal-title">' + monthName(view.month) + ' ' + digit(view.year) + '</div>';
      html += '<button type="button" class="ncal-nav" data-nav="next-month">&rsaquo;</button>';
      html += '<button type="button" class="ncal-nav" data-nav="next-year">&raquo;</button>';
      html += '</div>';

      html += '<div class="ncal-weekdays">';
      for (var w = 0; w < 7; w++) html += '<span>' + dayHeader(w) + '</span>';
      html += '</div>';

      html += '<div class="ncal-days">';
      for (var s = 0; s < startWeekday; s++) html += '<span class="ncal-day ncal-day--empty"></span>';
      for (var day = 1; day <= totalDays; day++) {
        var isToday = view.year === today.year && view.month === today.month && day === today.day;
        var isSelected = selected && selected.year === view.year && selected.month === view.month && selected.day === day;
        var cls = 'ncal-day';
        if (isToday) cls += ' ncal-day--today';
        if (isSelected) cls += ' ncal-day--selected';
        html += '<button type="button" class="' + cls + '" data-day="' + day + '">' + digit(day) + '</button>';
      }
      html += '</div>';

      html += '<div class="ncal-footer"><button type="button" class="ncal-today-btn" data-nav="today">' +
        (opts.lang === 'ne' ? 'आज' : 'Today') + '</button></div>';

      panel.innerHTML = html;
    }

    function positionPanel() {
      var rect = input.getBoundingClientRect();
      panel.style.position = 'absolute';
      panel.style.top = (window.scrollY + rect.bottom + 4) + 'px';
      panel.style.left = (window.scrollX + rect.left) + 'px';
    }

    function open() {
      render();
      positionPanel();
      panel.style.display = 'block';
    }
    function close() {
      panel.style.display = 'none';
    }

    function selectDay(day) {
      selected = { year: view.year, month: view.month, day: day };
      var ad = bsToAd(selected.year, selected.month, selected.day);
      var adFormatted = formatAd(ad);
      var bsFormatted = formatBs(selected, opts.lang);

      input.value = bsFormatted;
      hiddenInput.value = adFormatted;

      input.dispatchEvent(new Event('change', { bubbles: true }));
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));

      if (typeof opts.onSelect === 'function') {
        opts.onSelect({ bs: selected, ad: ad, adFormatted: adFormatted, bsFormatted: bsFormatted });
      }
      close();
    }

    panel.addEventListener('click', function (e) {
      e.stopPropagation();
      var dayBtn = e.target.closest('[data-day]');
      if (dayBtn) { selectDay(Number(dayBtn.getAttribute('data-day'))); return; }

      var navBtn = e.target.closest('[data-nav]');
      if (!navBtn) return;
      var nav = navBtn.getAttribute('data-nav');
      if (nav === 'prev-month') { view.month--; if (view.month < 1) { view.month = 12; view.year--; } }
      else if (nav === 'next-month') { view.month++; if (view.month > 12) { view.month = 1; view.year++; } }
      else if (nav === 'prev-year') { view.year--; }
      else if (nav === 'next-year') { view.year++; }
      else if (nav === 'today') { view.year = today.year; view.month = today.month; }
      view.year = Math.min(Math.max(view.year, MIN_YEAR), MAX_YEAR);
      render();
    });

    input.addEventListener('click', open);
    document.addEventListener('click', function (e) {
      if (e.target === input || panel.contains(e.target)) return;
      close();
    });
    window.addEventListener('resize', function () { if (panel.style.display !== 'none') positionPanel(); });
    window.addEventListener('scroll', function () { if (panel.style.display !== 'none') positionPanel(); }, true);

    return {
      open: open,
      close: close,
      destroy: function () { panel.remove(); },
      setValue: function (year, month, day) { view.year = year; view.month = month; selectDay(day); },
      getValue: function () { return selected; }
    };
  }

  return {
    MIN_YEAR: MIN_YEAR,
    MAX_YEAR: MAX_YEAR,
    adToBs: adToBs,
    bsToAd: bsToAd,
    formatAd: formatAd,
    formatBs: formatBs,
    toNepaliDigits: toNepaliDigits,
    monthNames: { en: MONTH_NAMES_EN, ne: MONTH_NAMES_NE },
    attach: attach
  };
});