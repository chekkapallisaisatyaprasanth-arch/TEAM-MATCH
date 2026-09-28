import subprocess

tabs = ['discover', 'leaderboards', 'internships', 'squads', 'messages', 'resume', 'profile']
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

for tab in tabs:
    url = f"http://localhost:3000/#{tab}"
    cmd = [edge_path, "--headless", "--dump-dom", url]
    try:
        res = subprocess.run(cmd, capture_output=True, timeout=10)
        dom = res.stdout.decode('utf-8', errors='replace')
        is_active = f'id="tab-{tab}" class="tab-pane active"' in dom or f'id="tab-{tab}" class="tab-pane' in dom
        print(f"Tab '{tab}': Rendered {len(dom)} bytes. Pane found: {is_active}")
    except Exception as e:
        print(f"Tab '{tab}': ERROR {e}")
