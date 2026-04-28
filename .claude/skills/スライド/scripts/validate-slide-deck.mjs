#!/usr/bin/env node

import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const BAD_LINE_START = "^[はがをにでとのへやも、。）」』】]";
const BAD_LINE_END = "[（「『【・]$";
const PLACEHOLDER = "\\b(?:LAYOUT|PHOTO|CATEGORY|SECTION(?:\\s+\\d+)?|CHAPTER(?:\\s+\\d+)?|COMPANY NAME|LOREM IPSUM|SCREENSHOT(?:\\s*/\\s*PHOTO)?)\\b";

function normalizeTarget(rawTarget) {
  if (!rawTarget) {
    throw new Error("Usage: node scripts/validate-slide-deck.mjs <url-or-file>");
  }

  if (/^[a-z]+:\/\//i.test(rawTarget)) {
    return rawTarget;
  }

  return pathToFileURL(path.resolve(rawTarget)).href;
}

function issueSort(a, b) {
  if (a.slideIndex !== b.slideIndex) {
    return a.slideIndex - b.slideIndex;
  }

  return a.kind.localeCompare(b.kind);
}

const target = normalizeTarget(process.argv[2]);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

try {
  await page.goto(target, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);

  const report = await page.evaluate(
    ({ badLineStartSource, badLineEndSource, placeholderSource }) => {
      const badLineStart = new RegExp(badLineStartSource, "u");
      const badLineEnd = new RegExp(badLineEndSource, "u");
      const placeholder = new RegExp(placeholderSource, "iu");

      const slides = Array.from(document.querySelectorAll(".slide")).filter(
        (slide) => slide instanceof HTMLElement
      );

      function nodeIsVisible(node) {
        const parent = node.parentElement;
        if (!parent) return false;
        const style = window.getComputedStyle(parent);
        return style.display !== "none" && style.visibility !== "hidden";
      }

      function forceSlideState(activeIndex) {
        slides.forEach((slide, index) => {
          slide.style.setProperty("display", "block", "important");
          slide.style.setProperty(
            "visibility",
            index === activeIndex ? "visible" : "hidden",
            "important"
          );
          slide.style.setProperty("opacity", index === activeIndex ? "1" : "0", "important");
          slide.style.setProperty("pointer-events", "none", "important");
          slide.style.setProperty("z-index", index === activeIndex ? "10" : "0", "important");

          if (window.getComputedStyle(slide).position === "static") {
            slide.style.setProperty("position", "absolute", "important");
            slide.style.setProperty("inset", "0", "important");
          }
        });
      }

      function selectorFor(element) {
        const tag = element.tagName.toLowerCase();
        const id = element.id ? `#${element.id}` : "";
        const classes = Array.from(element.classList).slice(0, 2);
        const classPart = classes.length ? `.${classes.join(".")}` : "";
        return `${tag}${id}${classPart}`;
      }

      function budgetFor(element) {
        const role = element.dataset.copyRole;
        if (role === "metric") return 8;
        if (role === "label") return 10;
        if (role === "quote") return 18;
        if (
          element.closest(".layout-left-right") &&
          (element.classList.contains("text-accent") ||
            element.classList.contains("slide-h1") ||
            element.classList.contains("slide-h2") ||
            role === "headline")
        ) {
          return 10;
        }
        if (element.classList.contains("slide-hero")) return 12;
        if (element.classList.contains("slide-h1") || role === "headline") return 18;
        if (element.classList.contains("slide-h2")) return 20;
        if (element.classList.contains("slide-h3") || element.classList.contains("slide-title")) {
          return 22;
        }
        if (element.classList.contains("slide-caption") || element.classList.contains("slide-micro")) {
          return 20;
        }
        return 24;
      }

      function extractRenderedLines(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const fragments = [];

        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (!node.textContent || !node.textContent.trim() || !nodeIsVisible(node)) {
            continue;
          }

          for (let index = 0; index < node.textContent.length; index += 1) {
            const char = node.textContent[index];
            if (char === "\n") continue;

            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, index + 1);
            const rect = Array.from(range.getClientRects()).find(
              (candidate) => candidate.width > 0 || candidate.height > 0
            );

            if (!rect) continue;
            if (/\s/.test(char) && char !== "\u3000") continue;

            fragments.push({
              char,
              top: Math.round(rect.top * 2) / 2,
              left: Math.round(rect.left * 2) / 2,
            });
          }
        }

        fragments.sort((a, b) => {
          if (Math.abs(a.top - b.top) > 1) {
            return a.top - b.top;
          }
          return a.left - b.left;
        });

        const lines = [];
        let currentTop = null;
        let currentLine = [];

        for (const fragment of fragments) {
          if (currentTop === null || Math.abs(fragment.top - currentTop) <= 2) {
            currentTop = currentTop ?? fragment.top;
            currentLine.push(fragment.char);
            continue;
          }

          lines.push(currentLine.join("").replace(/\s+/g, "").trim());
          currentTop = fragment.top;
          currentLine = [fragment.char];
        }

        if (currentLine.length) {
          lines.push(currentLine.join("").replace(/\s+/g, "").trim());
        }

        return lines.filter(Boolean);
      }

      function collectOverflowIssues(slide, slideIndex) {
        const slideRect = slide.getBoundingClientRect();
        const issues = [];

        slide.querySelectorAll("*").forEach((element) => {
          if (!(element instanceof HTMLElement)) return;
          if (!element.innerText.trim() && !element.matches("img, svg, canvas, video")) return;

          const style = window.getComputedStyle(element);
          if (style.display === "none" || style.visibility === "hidden") return;

          const rect = element.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          const protrudes =
            rect.left < slideRect.left - 1 ||
            rect.right > slideRect.right + 1 ||
            rect.top < slideRect.top - 1 ||
            rect.bottom > slideRect.bottom + 1;
          const scrolls =
            element.scrollWidth > element.clientWidth + 1 ||
            element.scrollHeight > element.clientHeight + 1;

          if (!protrudes && !scrolls) return;

          issues.push({
            slideIndex,
            kind: "overflow",
            selector: selectorFor(element),
            text: element.innerText.trim().slice(0, 60),
          });
        });

        return issues;
      }

      function collectCopyIssues(slide, slideIndex) {
        const issues = [];
        const inspected = Array.from(
          slide.querySelectorAll(
            "[data-copy-role], .slide-hero, .slide-h1, .slide-h2, .slide-h3, .slide-title, .slide-body, .slide-caption, .slide-micro, h1, h2, h3, p, li, blockquote"
          )
        ).filter((element) => element instanceof HTMLElement);

        for (const element of inspected) {
          const text = element.innerText.trim();
          if (!text) continue;

          if (placeholder.test(text)) {
            issues.push({
              slideIndex,
              kind: "placeholder",
              selector: selectorFor(element),
              text: text.slice(0, 60),
            });
          }

          const lines = extractRenderedLines(element);
          if (!lines.length) continue;

          const budget = budgetFor(element);

          lines.forEach((line, lineIndex) => {
            if (lineIndex > 0 && badLineStart.test(line)) {
              issues.push({
                slideIndex,
                kind: "bad-line-start",
                selector: selectorFor(element),
                text: line,
              });
            }

            if (badLineEnd.test(line)) {
              issues.push({
                slideIndex,
                kind: "bad-line-end",
                selector: selectorFor(element),
                text: line,
              });
            }

            if (line.replace(/\s+/g, "").length > budget) {
              issues.push({
                slideIndex,
                kind: "line-too-long",
                selector: selectorFor(element),
                text: line,
              });
            }
          });

          const lastLine = lines[lines.length - 1].replace(/\s+/g, "");
          if (lastLine.length === 1) {
            issues.push({
              slideIndex,
              kind: "orphan-last-line",
              selector: selectorFor(element),
              text: lastLine,
            });
          }

          // Design System v1.0: max 5 rendered lines per text block
          if (lines.length > 5) {
            issues.push({
              slideIndex,
              kind: "line-count-exceeded",
              selector: selectorFor(element),
              text: `${lines.length} lines (max 5): "${text.slice(0, 40)}"`,
            });
          }
        }

        return issues;
      }

      // Design System v1.0: max 100 chars of content per slide
      function collectDensityIssues(slide, slideIndex) {
        const issues = [];
        const contentEl = slide.querySelector(".slide-content") || slide;
        const allText = Array.from(
          contentEl.querySelectorAll(
            ".slide-hero, .slide-h1, .slide-h2, .slide-h3, .slide-title, .slide-body, .slide-caption, .slide-micro, h1, h2, h3, p, li, blockquote"
          )
        )
          .filter((el) => {
            const s = window.getComputedStyle(el);
            return s.display !== "none" && s.visibility !== "hidden";
          })
          .map((el) => el.innerText.trim())
          .join("");

        const charCount = allText.replace(/\s+/g, "").length;
        if (charCount > 100) {
          issues.push({
            slideIndex,
            kind: "text-budget-exceeded",
            selector: ".slide-content",
            text: `${charCount} chars (max 100)`,
          });
        }

        return issues;
      }

      // Design System v1.0: contrast ratio >= 4.5:1 (WCAG 2.1 AA)
      function parseRgb(colorStr) {
        const match = colorStr.match(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/);
        if (!match) return null;
        return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
      }

      function linearizeChannel(c) {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      }

      function relativeLuminance([r, g, b]) {
        return 0.2126 * linearizeChannel(r) + 0.7152 * linearizeChannel(g) + 0.0722 * linearizeChannel(b);
      }

      function effectiveBackground(element) {
        let el = element;
        while (el && el !== document.body.parentElement) {
          const bg = window.getComputedStyle(el).backgroundColor;
          if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
            return bg;
          }
          el = el.parentElement;
        }
        return "rgb(255, 255, 255)";
      }

      function collectContrastIssues(slide, slideIndex) {
        const issues = [];
        const textEls = Array.from(
          slide.querySelectorAll(
            ".slide-hero, .slide-h1, .slide-h2, .slide-h3, .slide-title, .slide-body, .slide-caption, h1, h2, h3, p, li"
          )
        ).filter((el) => {
          if (!(el instanceof HTMLElement)) return false;
          const s = window.getComputedStyle(el);
          return s.display !== "none" && s.visibility !== "hidden" && el.innerText.trim().length > 0;
        });

        for (const el of textEls) {
          const style = window.getComputedStyle(el);
          const fgRgb = parseRgb(style.color);
          const bgRgb = parseRgb(effectiveBackground(el));
          if (!fgRgb || !bgRgb) continue;

          const fgL = relativeLuminance(fgRgb);
          const bgL = relativeLuminance(bgRgb);
          const lighter = Math.max(fgL, bgL);
          const darker = Math.min(fgL, bgL);
          const ratio = (lighter + 0.05) / (darker + 0.05);

          if (ratio < 4.5) {
            issues.push({
              slideIndex,
              kind: "contrast-too-low",
              selector: selectorFor(el),
              text: `ratio ${ratio.toFixed(2)}:1 (min 4.5:1) — "${el.innerText.trim().slice(0, 30)}"`,
            });
          }
        }

        return issues;
      }

      const issues = [];

      slides.forEach((slide, index) => {
        forceSlideState(index);
        issues.push(...collectOverflowIssues(slide, index + 1));
        issues.push(...collectCopyIssues(slide, index + 1));
        issues.push(...collectDensityIssues(slide, index + 1));
        issues.push(...collectContrastIssues(slide, index + 1));
      });

      return {
        slideCount: slides.length,
        issues,
      };
    },
    {
      badLineStartSource: BAD_LINE_START,
      badLineEndSource: BAD_LINE_END,
      placeholderSource: PLACEHOLDER,
    }
  );

  report.issues.sort(issueSort);

  if (!report.issues.length) {
    console.log(`PASS: ${report.slideCount} slides validated without blocking issues.`);
    process.exit(0);
  }

  console.log(`FAIL: ${report.issues.length} issues found across ${report.slideCount} slides.`);
  for (const issue of report.issues) {
    console.log(
      `- slide ${issue.slideIndex} [${issue.kind}] ${issue.selector}: ${issue.text || "(no text)"}`
    );
  }
  process.exit(1);
} finally {
  await browser.close();
}
