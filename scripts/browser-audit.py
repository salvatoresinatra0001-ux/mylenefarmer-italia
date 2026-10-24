#!/usr/bin/env python3
"""GitHub Pages AMOLED V16: responsive pages and music-embed smoke audit."""
import argparse
import json
import pathlib
import urllib.parse
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument("--base", default="https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/")
parser.add_argument("--offline", action="store_true")
parser.add_argument("--executable")
args = parser.parse_args()
root = pathlib.Path("dist")
out = pathlib.Path("reports")
out.mkdir(exist_ok=True)
files = json.loads((root / "site-manifest.json").read_text())["files"]
paths = [f["path"] for f in files if f["path"].endswith(".html")]
report = {"base": args.base, "theme": "AMOLED Black", "pages": [], "music": {}, "limitations": ["Streaming playback and subscriber access are controlled by Apple Music and Spotify."]}
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, executable_path=args.executable, args=["--no-sandbox"])
    for mode, viewport in [("desktop", {"width": 1440, "height": 900}), ("mobile", {"width": 390, "height": 844})]:
        context = browser.new_context(viewport=viewport, device_scale_factor=1, reduced_motion="reduce")
        def route_handler(route):
            req = route.request
            host = urllib.parse.urlparse(req.url).hostname
            basehost = urllib.parse.urlparse(args.base).hostname
            if req.resource_type in ("media", "font") or (req.is_navigation_request() and req.frame.parent_frame is not None):
                route.abort()
            elif host not in ("127.0.0.1", "localhost", basehost) and req.resource_type in ("image", "stylesheet", "script"):
                route.abort()
            else:
                route.continue_()
        context.route("**/*", route_handler)
        page = context.new_page()
        for name in paths:
            item = {"path": name, "viewport": mode, "errors": []}
            events = []
            def on_error(exc): events.append(str(exc))
            page.on("pageerror", on_error)
            try:
                response = page.goto(urllib.parse.urljoin(args.base, name), wait_until="domcontentloaded", timeout=40000)
                item["status"] = response.status if response else None
                item["title"] = page.title()
                item["background"] = page.locator("body").evaluate("(el)=>getComputedStyle(el).backgroundColor")
                item["overflow"] = page.evaluate("document.documentElement.scrollWidth > innerWidth + 2")
                item["themeStylesheet"] = page.locator('link[href*="amoled-v16.css"]').count() > 0
                item["errors"].extend(events)
                if name in ("index.html", "ascolta.html", "discografia.html") and mode == "desktop":
                    page.screenshot(path=str(out / (mode + "-" + name.replace(".html", "") + ".png")), full_page=True)
                if name == "discografia.html":
                    item["appleEmbeds"] = page.locator('iframe[src*="embed.music.apple.com"]').count()
                if name == "ascolta.html":
                    item["spotifyEmbeds"] = page.locator('iframe[src*="open.spotify.com/embed/artist"]').count()
            except Exception as exc:
                item["errors"].append(str(exc))
            report["pages"].append(item)
            page.remove_listener("pageerror", on_error)
        context.close()
    browser.close()
report["music"] = {
    "appleAlbums": max((p.get("appleEmbeds", 0) for p in report["pages"] if p["path"] == "discografia.html"), default=0),
    "spotifyPlayers": max((p.get("spotifyEmbeds", 0) for p in report["pages"] if p["path"] == "ascolta.html"), default=0)
}
report["ok"] = all(
    p.get("status") == 200
    and not p["errors"]
    and not p.get("overflow")
    and p.get("themeStylesheet", False)
    and p.get("background") in ("rgb(0, 0, 0)", "rgba(0, 0, 0, 1)")
    for p in report["pages"]
) and report["music"]["appleAlbums"] >= 12 and report["music"]["spotifyPlayers"] >= 1
(out / "browser-audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "ok": report["ok"], "pagesTested": len(report["pages"]), "music": report["music"],
    "problems": [p for p in report["pages"] if p.get("status") != 200 or p["errors"] or p.get("overflow") or not p.get("themeStylesheet") or p.get("background") not in ("rgb(0, 0, 0)", "rgba(0, 0, 0, 1)")][:8]
}, ensure_ascii=False))
raise SystemExit(0 if report["ok"] else 1)
