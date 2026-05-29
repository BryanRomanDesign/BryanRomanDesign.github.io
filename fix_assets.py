import os
import re

root_dir = os.path.dirname(os.path.realpath(__file__))

# Patterns to find relative paths for assets (href, src, data-src, etc.)
# This targets paths starting with css/, js/, or images/
asset_patterns = [
    (re.compile(r'href=["\'](css/[^"\']+)["\']'), 'href="/{}"'),
    (re.compile(r'src=["\'](js/[^"\']+)["\']'), 'src="/{}"'),
    (re.compile(r'src=["\'](images/[^"\']+)["\']'), 'src="/{}"'),
    # Add href for images if you use them in links
    (re.compile(r'href=["\'](images/[^"\']+)["\']'), 'href="/{}"')
]

def fix_asset_paths(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    updated = False

    for pattern, template in asset_patterns:
        matches = pattern.findall(content)
        for match in matches:
            # Create the absolute root path version (e.g., /css/style.css)
            old_str = match
            new_str = f"/{match}"
            
            # Replace occurrences in the file content
            # Checking both single and double quotes
            content = content.replace(f'"{old_str}"', f'"{new_str}"')
            content = content.replace(f"'{old_str}'", f"'{new_str}'")
            updated = True

    if updated and content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Walk through all directories, skipping the main root index.html 
# because its asset paths are already correct at the root level!
for root, dirs, files in os.walk(root_dir):
    # Skip the root directory itself to leave the main homepage alone
    if root == root_dir:
        continue
        
    for filename in files:
        if filename == 'index.html':
            file_path = os.path.join(root, filename)
            if fix_asset_paths(file_path):
                rel_path = os.path.relpath(file_path, root_dir)
                print(f"Fixed asset paths in: {rel_path}")

print("\nAll asset paths updated successfully!")