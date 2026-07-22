# Nepali Calendar by SudamHub

A dependency-free Bikram Sambat (BS) calendar date picker built with plain
HTML, CSS, and JavaScript. No build step, no npm, no framework required.

The calendar **UI is shown in Nepali** (BS year/month/day, Nepali digits and
month names by default). When a date is picked, the visible input keeps the
Nepali display text, and a **paired hidden input receives the equivalent
English (AD) date** in `YYYY-MM-DD` format &mdash; so anything downstream
(a form submission, a script, local storage) can keep working with an
ordinary Gregorian date without knowing a Nepali calendar was involved.

## Requirements

- No dependencies, no build tools.
- Any modern browser (uses standard DOM APIs only).
- Loaded via CDN &mdash; one `<link>` and one `<script>` tag, nothing to
  download or host yourself (see Quick start below).
- Supported date range: **BS 2000&ndash;2090** (approx. AD 1943‑04‑14 to
  2034‑04‑13). Verified with a day-by-day round-trip test across the full
  range (33,238 days, zero mismatches).

## Files

```
nepali-calendar-js/
├── index.html              # working demo + usage reference, open this first
├── src/
│   ├── nepali-calendar.js  # the whole library
│   └── nepali-calendar.css # styling
└── README.md
```

## Quick start (CDN)

Since the repo is public on GitHub, [jsDelivr](https://www.jsdelivr.com/)
mirrors it automatically &mdash; no npm, no download, no hosting of your own.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sudam-shrestha/nepali-calender@main/src/nepali-calendar.css">
<script src="https://cdn.jsdelivr.net/gh/sudam-shrestha/nepali-calender@main/src/nepali-calendar.js"></script>

<input type="text" id="dob" name="dob">

<script>
  NepaliCalendar.attach('#dob', {
    lang: 'ne',                 // 'ne' Nepali script, or 'en'
    nepaliDigits: true,
    hiddenInputName: 'dob_ad',  // auto-created hidden field, holds the AD value
    onSelect: function (result) {
      console.log(result.bsFormatted); // e.g. "२०८२ श्रावण १५"
      console.log(result.adFormatted); // e.g. "2025-07-30"
    }
  });
</script>
```

Open `index.html` in a browser to see it working end to end, including what
gets submitted (visible Nepali value + hidden AD value).

**Pinning a version:** `@main` always serves whatever is on the `main`
branch, which is fine for now but can change under you. Once you cut a
release tag (e.g. `v1.0.0`), swap `@main` for `@v1.0.0` in production sites
so the CDN URL never changes behavior unexpectedly. After any push, jsDelivr
can take a few minutes to pick up the change &mdash; force it sooner by
visiting `https://purge.jsdelivr.net/gh/sudam-shrestha/nepali-calender@main/src/nepali-calendar.js`.

**Self-hosting instead:** the `src/nepali-calendar.js` and `.css` files have
zero dependencies, so you can still just copy them next to your HTML and
point `<link>`/`<script>` at the local path if you'd rather not rely on a
third-party CDN.

## Behavior

- The target `<input>` becomes read-only and shows the picked Nepali date
  as text.
- A second, hidden `<input>` is created automatically right after it
  (name defaults to `<original name>_ad`), holding the AD equivalent.
  Use `hiddenInputSelector` instead if you'd rather point it at a field
  you already have.
- Month (`‹` `›`) and year (`«` `»`) arrows in the header navigate the
  calendar without closing the panel; "Today" jumps back to the current BS
  month.
- Clicking a day fires a native `change` event on both inputs, plus the
  `onSelect` callback, then closes the panel. Clicking outside the panel
  also closes it.

## Options reference

| Option | Default | Description |
|---|---|---|
| `lang` | `'ne'` | `'ne'` for Nepali script, `'en'` for English month names |
| `nepaliDigits` | `true` | Render digits as ०१२... instead of 012... |
| `hiddenInputName` | `<input.name>_ad` | Name of the auto-created hidden AD field |
| `hiddenInputSelector` | &mdash; | Reuse an existing input instead of auto-creating one |
| `onSelect` | &mdash; | `({ bs, ad, adFormatted, bsFormatted }) => void` |

## Date conversion (no UI)

For places you just need BS ⟷ AD conversion without the picker widget &mdash;
the same file exposes these directly. Supported range: **BS 2000&ndash;2090**
(≈ AD 1943‑04‑14 to 2034‑04‑13); calling these outside that range throws an
`Error`.

```js
// AD date -> BS
NepaliCalendar.adToBs(new Date());
// { year: 2083, month: 4, day: 4 }

// BS date -> AD
const ad = NepaliCalendar.bsToAd(2082, 4, 15); // JS Date
NepaliCalendar.formatAd(ad);                   // "2025-07-30"

// Display formatting
const bs = { year: 2082, month: 4, day: 15 };
NepaliCalendar.formatBs(bs, 'ne'); // "२०८२ श्रावण १५"
NepaliCalendar.formatBs(bs, 'en'); // "2082-04-15 (Shrawan)"

// Just the Nepali numerals
NepaliCalendar.toNepaliDigits(2082); // "२०८२"

// Range constants, useful for validating input before converting
NepaliCalendar.MIN_YEAR; // 2000
NepaliCalendar.MAX_YEAR; // 2090

// Out-of-range dates throw, so validate or wrap in try/catch
try {
  NepaliCalendar.bsToAd(1990, 1, 1);
} catch (e) {
  console.error(e.message); // "NepaliCalendar: year 1990 is outside supported range 2000-2090"
}
```

**Common use case &mdash; show "today" in BS somewhere on the page:**

```html
<span id="today-bs"></span>
<script>
  document.getElementById('today-bs').textContent =
    NepaliCalendar.formatBs(NepaliCalendar.adToBs(new Date()), 'ne');
  // renders: २०८३ श्रावण ४
</script>
```

## Data source

Month lengths come from the official BS calendar records for 2000&ndash;2090
BS. Anchor date: BS 2000/01/01 = AD 1943‑04‑14. All conversions were
round-trip tested day-by-day across the entire supported range.

## Later / not in scope yet

Laravel and React/MERN wrappers around this same core are planned for a
later pass &mdash; for now this is deliberately scoped to plain HTML/CSS/JS.