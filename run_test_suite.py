import subprocess
import time

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
url = "http://localhost:3000/test_in_browser.html"

# Run headless Edge
cmd = [edge_path, "--headless", "--dump-dom", url]

# Give the iframe and JS tests 4 seconds by running with virtual time budget or simple execution
# Note: In Edge headless, --virtual-time-budget=6000 allows async JS timer/events to execute!
cmd_with_budget = [edge_path, "--headless", "--virtual-time-budget=6000", "--dump-dom", url]

print("Running Edge headless with virtual-time-budget=6000ms...")
res = subprocess.run(cmd_with_budget, capture_output=True, timeout=20)
dom = res.stdout.decode('utf-8', errors='replace')

if "SUCCESS: ALL TESTS PASSED WITH 0 ERRORS" in dom:
    print("\n>>> RESULT: SUCCESS: ALL TESTS PASSED WITH 0 ERRORS! <<<\n")
elif "FAILURE" in dom:
    print("\n>>> RESULT: FAILURE DETECTED <<<\n")
else:
    print(f"\n>>> RESULT UNKNOWN (Output length: {len(dom)}) <<<\n")

# Print the test log from the DOM
if '<pre id="test-log">' in dom:
    log_part = dom.split('<pre id="test-log">')[1].split('</pre>')[0]
    print("--- TEST LOG ---")
    print(log_part)
    print("----------------")
