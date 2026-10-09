#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const host = "127.0.0.1";
const port = 4277;
const address = process.env.CABIN_E2E_URL || `http://${host}:${port}/`;
const server = process.env.CABIN_E2E_URL ? null : spawn("python3", ["-m", "http.server", String(port), "--bind", host], {
  stdio: ["ignore", "pipe", "pipe"]
});

async function ready() {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(address)).ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error("Cabin Crew test server failed to start");
}
async function checkPage(browser, width, reducedMotion = false) {
  const mobile = width < 951;
  const context = await browser.newContext({
    viewport: { width, height: mobile ? 780 : 900 },
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", response => {
    if (response.url().startsWith(address) && response.status() >= 400) {
      errors.push(`Failed local resource: ${response.url()} (${response.status()})`);
    }
  });

  const response = await page.goto(address, { waitUntil: "domcontentloaded" });
  assert.equal(response.status(), 200, `HTTP 200 at ${width}px`);
  assert.match(await page.title(), /Cabin Crew/);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),
    "https://gracianb.github.io/cabin-crew-site/");
  assert.equal(await page.locator('meta[property="og:image"]').getAttribute("content"),
    "https://gracianb.github.io/cabin-crew-site/og-cover.png?v=1");
  assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute("content"),"summary_large_image");
  const social=await fetch(new URL("og-cover.png",address));
  assert.equal(social.status,200,"Social card must be published");
  const png=Buffer.from(await social.arrayBuffer());
  assert.equal(png.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16),1200);
  assert.equal(png.readUInt32BE(20),630);
  assert.match(await page.locator("h1").innerText(), /journeys[\s\S]*returning/i);
  assert.equal(await page.locator("[data-stop]").count(), 6, "Six actual career chapters");
  const overflows = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflows <= 1, `Horizontal overflow of ${overflows}px at ${width}px`);

  const dialog = page.locator("#v4-brief-dialog");
  await page.locator("#open-brief").click();
  assert.equal(await dialog.evaluate(node => node.open), true, "Recruiter introduction opens");
  await page.locator("#close-brief").click();
  assert.equal(await dialog.evaluate(node => node.open), false, "Recruiter introduction closes");

  await page.locator('[data-stop="5"]').click();
  assert.match(await page.locator("#v4-panel-city").innerText(), /Back to aviation/);
  assert.equal(await page.locator('[data-stop="5"]').getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator("#v4-stop-next").isDisabled(), true);
  await page.locator("#v4-stop-prev").click();
  assert.match(await page.locator("#v4-panel-city").innerText(), /International/);
  await page.locator('[data-stop="0"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-stop="1"]').getAttribute("aria-pressed"), "true");

  if (mobile) {
    const toggle = page.locator(".mobile-menu-button");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Escape");
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    await toggle.click();
    await page.locator('#main-navigation a[href="#training"]').click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  }

  const privateLinks = await page.locator("a[href]").evaluateAll(nodes =>
    nodes.map(node => node.getAttribute("href")).filter(href =>
      /\.(?:pdf|docx?|xlsx?)(?:[?#]|$)/i.test(href || "")),
  );
  assert.deepEqual(privateLinks, [], "Never ship private job-application documents");
  assert.deepEqual(errors, [], `Browser console/network at ${width}px`);
  await context.close();
}
try {
  await ready();
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    for (const width of [320, 390, 768, 1440]) await checkPage(browser, width);
    await checkPage(browser, 390, true);
    console.log("CABIN CREW PUBLIC E2E PASS: 320/390/768/1440, keyboard, mobile, reduced motion");
  } finally {
    await browser.close();
  }
} finally {
  server?.kill("SIGTERM");
}
