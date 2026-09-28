import re
import glob

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check duplicate IDs in HTML
html_ids = re.findall(r'id=["\']([\w\-]+)["\']', html)
counts = {}
for i in html_ids:
    counts[i] = counts.get(i, 0) + 1
duplicates = {k: v for k, v in counts.items() if v > 1}
print(f"Total HTML IDs: {len(html_ids)}, Unique: {len(counts)}")
if duplicates:
    print(f"DUPLICATE IDs found in index.html: {duplicates}")
else:
    print("No duplicate IDs in index.html.")

# Check for all getElementById in JS
all_html_and_js_rendered = set(counts.keys())
for path in glob.glob('js/*.js'):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    rendered = re.findall(r'id=["\']([\w\-]+)["\']', content)
    all_html_and_js_rendered.update(rendered)

missing = {}
for path in glob.glob('js/*.js'):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for el_id in re.findall(r'getElementById\(["\']([\w\-]+)["\']\)', content):
        if el_id not in all_html_and_js_rendered:
            missing.setdefault(el_id, []).append(path)

if missing:
    print(f"MISSING IDs referenced in JS: {missing}")
else:
    print("All getElementById calls have matching elements in HTML or dynamic JS renderers.")

# Check for unclosed HTML tags or obvious HTML issues
print("HTML length:", len(html))
