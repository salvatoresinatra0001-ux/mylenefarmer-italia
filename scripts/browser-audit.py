#!/usr/bin/env python3
"""Actual Chromium checks; offline mode is explicitly marked and never certifies delivery."""
import argparse, json, pathlib, urllib.parse
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
parser=argparse.ArgumentParser()
parser.add_argument('--base',default='https://mylenefarmer.it/')
parser.add_argument('--offline',action='store_true')
parser.add_argument('--executable')
args=parser.parse_args()
root=pathlib.Path('dist'); output=pathlib.Path('reports'); output.mkdir(exist_ok=True)
manifest=json.loads((root/'site-manifest.json').read_text())
paths=[r['path'] for r in manifest['files'] if r['path'].endswith('.html')]
report={'base':args.base,'mode':'offline-fixtures' if args.offline else 'live','pages':[], 'gallery':{}, 'limitations':['Video/audio playback and third-party iframe interactions are excluded.','Full-resolution third-party source availability can vary; the internal viewer retains a verified thumbnail when an original cannot be loaded.']}
fixture='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#29262b"/><text x="30" y="400" fill="white" font-size="20">OFFLINE IMAGE FIXTURE</text></svg>'
def route_handler(route):
    request=route.request
    if request.resource_type=='media' or (request.resource_type=='document' and request.frame.parent_frame is not None):
        route.abort(); return
    if args.offline and urllib.parse.urlparse(request.url).hostname not in ['127.0.0.1','localhost']:
        if request.resource_type=='image': route.fulfill(status=200,content_type='image/svg+xml',body=fixture)
        else: route.abort()
        return
    route.continue_()
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=args.executable,args=['--no-sandbox'])
    for mode,viewport in [('desktop',{'width':1440,'height':1000}),('mobile',{'width':390,'height':844})]:
        context=browser.new_context(viewport=viewport,device_scale_factor=1,ignore_https_errors=False,reduced_motion='reduce')
        context.route('**/*',route_handler)
        page=context.new_page()
        for name in paths:
            record={'path':name,'viewport':mode,'errors':[],'brokenImages':[]}; errors=[]
            def collect(error): errors.append(str(error))
            page.on('pageerror',collect)
            try:
                response=page.goto(urllib.parse.urljoin(args.base,name),wait_until='domcontentloaded',timeout=45000)
                record['status']=response.status if response else None
                page.locator('body').wait_for()
                page.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
                try: page.wait_for_function("[...document.images].every(i=>i.complete)",timeout=20000)
                except PlaywrightTimeout: pass
                page.wait_for_timeout(200)
                record['title']=page.title()
                record['horizontalOverflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                record['images']=page.evaluate('document.images.length')
                record['imageDetails']=page.evaluate("[...document.images].filter(i=>i.getAttribute('src')).map(i=>({src:i.currentSrc||i.src,width:i.naturalWidth,height:i.naturalHeight,complete:i.complete,visible:!!(i.offsetWidth||i.offsetHeight)}))")
                record['overflowElements']=page.evaluate("[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width}))")
                record['brokenImages']=page.evaluate("[...document.images].filter(i=>i.getAttribute('src')&&!(i.closest('dialog:not([open])'))&&(!i.complete||!i.naturalWidth)).map(i=>({src:i.currentSrc||i.src,alt:i.alt}))")
                record['missingAlt']=page.locator('img:not([alt])').count()
                if name in ['index.html','archivio-drive.html','crediti-foto.html']:
                    for photo in page.locator('img').all():
                        if photo.is_visible():
                            photo.scroll_into_view_if_needed()
                            photo.evaluate("async im=>{try{await im.decode()}catch{}}")
                            page.wait_for_timeout(100)
                    page.evaluate('window.scrollTo(0,0)'); page.wait_for_timeout(500)
                    page.screenshot(path=str(output/(mode+'-'+name.replace('.html','')+'.png')),full_page=True)
            except Exception as exc: record['errors'].append(str(exc))
            record['errors'].extend(errors); page.remove_listener('pageerror',collect); report['pages'].append(record)
        context.close()
    context=browser.new_context(viewport={'width':1280,'height':900}); context.route('**/*',route_handler)
    page=context.new_page()
    try:
        page.goto(urllib.parse.urljoin(args.base,'archivio-drive.html'),wait_until='domcontentloaded')
        page.wait_for_function("document.querySelector('#mf-year').options.length>1")
        expected=json.loads((root/'data/gallery-public.json').read_text())['counts']['published']
        assert page.locator('.mf-card').count()==expected, 'Not all manifest photographs are rendered'
        page.locator('#mf-search').fill('no-match-zzzzzz')
        assert page.locator('.mf-card:visible').count()==0, 'Search did not filter'
        page.locator('#mf-reset').click()
        assert page.locator('.mf-card:visible').count()==expected, 'Reset lost photographs'
        page.locator('[data-open-photo]').first.click()
        assert page.locator('#mf-viewer').evaluate('(d)=>d.open'), 'Lightbox did not open'
        before=page.locator('#mf-position').inner_text(); page.keyboard.press('ArrowRight')
        assert page.locator('#mf-position').inner_text()!=before, 'Keyboard navigation failed'
        failures=[]; shown=[]
        for n in range(expected):
            try:
                page.wait_for_function("document.querySelector('#mf-large').naturalWidth>200 && !document.querySelector('#mf-large').hidden",timeout=10000)
                shown.append({'position':page.locator('#mf-position').inner_text(),'dimensions':page.locator('#mf-large').evaluate('(im)=>[im.naturalWidth,im.naturalHeight]')})
            except PlaywrightTimeout: failures.append({'position':page.locator('#mf-position').inner_text(),'src':page.locator('#mf-large').get_attribute('src')})
            page.keyboard.press('ArrowRight')
        page.keyboard.press('Escape')
        assert not page.locator('#mf-viewer').evaluate('(d)=>d.open'), 'Escape did not close'
        assert page.locator('[download]').count()==0, 'Download button exposed'
        assert page.locator('a[href*="drive.google.com"]').count()==0, 'Drive link exposed'
        report['gallery']={'ok':not failures,'renderedPhotos':expected,'search':True,'reset':True,'lightbox':True,'keyboard':True,'noDriveLinks':True,'noDownloadButtons':True,'lightboxImagesFailed':failures,'lightboxImagesShown':shown}
    except Exception as exc: report['gallery']={'ok':False,'error':str(exc)}
    context.close(); browser.close()
report['ok']=report['gallery'].get('ok',False) and all(r.get('status')==200 and not r['errors'] and not r.get('horizontalOverflow') and not r.get('brokenImages') for r in report['pages'])
(output/'browser-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'mode':report['mode'],'pages':len(report['pages']),'ok':report['ok'],'gallery':report['gallery'],'pagesWithProblems':sum(bool(r['errors'] or r.get('brokenImages') or r.get('horizontalOverflow')) for r in report['pages'])},ensure_ascii=False))
raise SystemExit(0 if report['ok'] else 1)
