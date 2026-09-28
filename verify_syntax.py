import glob
import re

def check_brackets_and_quotes(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    in_block_comment = False
    for line_num, line in enumerate(lines, 1):
        i = 0
        while i < len(line):
            if in_block_comment:
                if line[i:i+2] == '*/':
                    in_block_comment = False
                    i += 2
                    continue
                i += 1
                continue
            
            # Check comment start
            if line[i:i+2] == '//':
                break
            if line[i:i+2] == '/*':
                in_block_comment = True
                i += 2
                continue
            
            # Check strings
            if line[i] in ("'", '"', '`'):
                quote = line[i]
                i += 1
                while i < len(line):
                    if line[i] == '\\':
                        i += 2
                        continue
                    if line[i] == quote:
                        i += 1
                        break
                    # If template literal has ${...}
                    if quote == '`' and line[i:i+2] == '${':
                        stack.append(('${', line_num))
                        i += 2
                        break
                    i += 1
                continue
            
            char = line[i]
            if char in '({[':
                stack.append((char, line_num))
            elif char in ')}]':
                if not stack:
                    return f"Unmatched closing '{char}' at line {line_num}"
                last, last_line = stack.pop()
                if last == '${' and char == '}':
                    # closed template literal expression
                    # resume in template literal
                    quote = '`'
                    while i + 1 < len(line):
                        i += 1
                        if line[i] == '\\':
                            i += 1
                            continue
                        if line[i] == quote:
                            break
                        if line[i:i+2] == '${':
                            stack.append(('${', line_num))
                            i += 1
                            break
                    i += 1
                    continue
                expected = pairs[char]
                if last != expected:
                    return f"Mismatched bracket: expected '{expected}' (opened line {last_line}), got '{char}' at line {line_num}"
            i += 1
            
    if stack:
        return f"Unclosed opened token '{stack[-1][0]}' from line {stack[-1][1]}"
    return None

js_files = glob.glob('js/*.js')
all_ok = True
for f in js_files:
    err = check_brackets_and_quotes(f)
    if err:
        print(f"FAILED: {f} -> {err}")
        all_ok = False
    else:
        print(f"PASSED: {f}")

if all_ok:
    print("\nALL JavaScript files have balanced parentheses, braces, and strings!")
