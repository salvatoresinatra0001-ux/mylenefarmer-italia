#!/usr/bin/env python3
"""Interactive V500 browser smoke tests against a local dist HTTP server."""
import argparse
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser()
p.add_argument("--base", default="http://127.0.0.1:8000/")
base=p.parse_args().base.rstrip("/")+"/"
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
 page=browser.new_page(viewport={"width":1280,"height":800}, reduced_motion="reduce")
 errors=[]
 page.on("pageerror",lambda exc:errors.append(str(exc)))
 page.goto(base+"index.html",wait_until="domcontentloaded")
 page.locator("[data-v500-search]").click()
 dialog=page.locator("dialog.mf-v500-dialog")
 assert dialog.evaluate("(e)=>e.open"),"command search did not open"
 page.locator("#mf-v500-query").fill("anamorphosee")
 page.wait_for_function("document.querySelectorAll('.mf-v500-hit').length>0")
 assert page.locator(".mf-v500-hit").count()>0,"accent-insensitive search failed"
 page.keyboard.press("Escape")
 assert not dialog.evaluate("(e)=>e.open"),"Escape did not close search"
 page.goto(base+"discografia.html",wait_until="domcontentloaded")
 page.locator("[data-kind='studio']").click()
 assert page.locator(".mf-v500-count").inner_text().startswith("13 ") or "pubblicazioni" in page.locator(".mf-v500-count").inner_text()
 page.locator("#mf-v500-decade").select_option("1990")
 assert page.locator("main .tbl-wrap tbody tr:not([hidden])").count()>0,"1990s filter failed"
 page.goto(base+"dossier-storia-poetica.html",wait_until="domcontentloaded")
 assert page.locator(".mf-v500-next").count()>0,"next chapter missing"
 assert not errors,"JavaScript runtime errors: "+repr(errors)
 browser.close()
print("V500 browser smoke: OK")