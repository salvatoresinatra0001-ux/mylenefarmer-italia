#!/usr/bin/env python3
"""Cloudinary -> rights-reviewed public gallery catalog. Stdlib only.
Environment: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
The approval file contains individual public IDs and documented rights.
"""
import base64, json, os, pathlib, sys, urllib.parse, urllib.request, urllib.error
ROOT=pathlib.Path(__file__).resolve().parent.parent
APPROVALS=ROOT/"data/cloudinary-approved.json"
OUTPUT=ROOT/"assets/data/cloudinary-gallery.json"
PREFIX="MYLENE_FARMER/"
def fail(s): raise SystemExit(s)
def load_approvals():
    data=json.loads(APPROVALS.read_text(encoding="utf-8"))
    approved={}
    valid={"portraits","live","discography","visual","appearances"}
    for item in data.get("approved",[]):
        pid=item.get("public_id","")
        if not pid.startswith(PREFIX) or pid in approved: fail("Invalid or duplicate public_id: "+pid)
        if item.get("category") not in valid: fail("Invalid category: "+pid)
        for field in ("title","photographer","license","source_url","rights_evidence"):
            if not isinstance(item.get(field),str) or not item[field].strip(): fail("Missing "+field+": "+pid)
        for field in ("source_url","rights_evidence"):
            u=urllib.parse.urlsplit(item[field])
            if u.scheme!="https" or not u.netloc: fail("HTTPS evidence required: "+pid)
        approved[pid]=item
    return approved
def inventory(cloud,key,secret):
    token=base64.b64encode((key+":"+secret).encode()).decode()
    cursor=None
    results={}
    while True:
        qs={"prefix":PREFIX,"max_results":500,"type":"upload","resource_type":"image"}
        if cursor: qs["next_cursor"]=cursor
        url=f"https://api.cloudinary.com/v1_1/{urllib.parse.quote(cloud,safe='')}/resources/image/upload?"+urllib.parse.urlencode(qs)
        request=urllib.request.Request(url,headers={"Authorization":"Basic "+token,"Accept":"application/json"})
        try:
            with urllib.request.urlopen(request,timeout=60) as resp: data=json.load(resp)
        except urllib.error.HTTPError as e: fail(f"Cloudinary HTTP {e.code}; catalog unchanged.")
        for a in data.get("resources",[]): results[a["public_id"]]=a
        cursor=data.get("next_cursor")
        print("Inventory page: ",len(results),file=sys.stderr)
        if not cursor: break
    return results
def main():
    approved=load_approvals()
    cloud=os.getenv("CLOUDINARY_CLOUD_NAME","")
    key=os.getenv("CLOUDINARY_API_KEY","")
    secret=os.getenv("CLOUDINARY_API_SECRET","")
    if not all((cloud,key,secret)): fail("Cloudinary credentials missing in GitHub Actions secrets. No changes made.")
    found=inventory(cloud,key,secret)
    images=[]
    for pid,meta in sorted(approved.items()):
        if pid not in found: fail("Approved asset missing in Cloudinary: "+pid)
        a=found[pid]
        import hashlib
        image_id=hashlib.sha256(pid.encode("utf-8")).hexdigest()[:24]
        images.append({
            "image_id":image_id,"title":meta["title"],"category":meta["category"],
            "year":meta.get("year",""),"photographer":meta["photographer"],
            "description":meta.get("description",""),"alt":meta.get("alt",meta["title"]),
            "license":meta["license"],"source_url":meta["source_url"],"rights_evidence":meta["rights_evidence"],
            "rights_verified":True,"publish":True,"width":a.get("width"),"height":a.get("height")
        })
    doc={"version":"8.1","source":"Cloudinary MYLENE_FARMER/","cloudinary_assets_scanned":len(found),"published_count":len(images),"images":images}
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    payload=json.dumps(doc,ensure_ascii=False,indent=2)+"\n"
    if OUTPUT.exists() and OUTPUT.read_text(encoding="utf-8")==payload:
        print("Public catalog unchanged")
    else:
        OUTPUT.write_text(payload,encoding="utf-8")
        print(f"Public catalog updated: {len(images)} approved photographs; {len(found)} archive assets scanned.")
if __name__=="__main__": main()
