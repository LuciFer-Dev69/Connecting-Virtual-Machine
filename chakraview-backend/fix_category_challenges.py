#!/usr/bin/env python3
import re

# Read the file
with open('/home/wujitao/Documents/chakraView/Frontend/src/pages/CategoryChallenges.jsx', 'r') as f:
    content = f.read()

# Find and replace the routing section
old_pattern = r"c\.category === 'Reverse Engineering' \? `#/reverse-challenge/\$\{c\.level\}` :\s+`#/challenge/\$\{c\.id\}`"
new_text = "c.category === 'Reverse Engineering' ? `#/reverse-challenge/${c.level}` :\n                                            c.category === 'Misc' ? `#/misc-challenge/${c.level}` :\n                                              `#/challenge/${c.id}`"

content = re.sub(old_pattern, new_text, content)

# Write back
with open('/home/wujitao/Documents/chakraView/Frontend/src/pages/CategoryChallenges.jsx', 'w') as f:
    f.write(content)

print("✅ Fixed CategoryChallenges.jsx routing")
