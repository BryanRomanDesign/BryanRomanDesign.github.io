import os
import re

root_dir = os.path.dirname(os.path.realpath(__file__))

# Patterns to find relative paths for assets (href, src, data-src, etc.)
asset_patterns = [
    (re.compile(r'href=["\'](css/[^"\']+)["\']'), 'href="/{}"'),
    (re.compile(r'src=["\'](js/[^"\']+)["\']'), 'src="/{}"'),
    (re.compile(r'src=["\'](images/[^"\']+)["\']'), 'src="/{}"'),
    (re.compile(r'href=["\'](images/[^"\']+)["\']'), 'href="/{}"'),
    # NEW: Target srcset attribute values specifically
    (re.compile(r'srcset=["\']([^"\']+)["\']'), 'srcset="{}"')
]

def fix_srcset_paths(srcset_content):
    """Helper function to split comma-separated srcset paths and add leading slashes."""
    parts = srcset_content.split(',')
    fixed_parts = []
    for part in parts:
        stripped = part.strip()
        # If it points to an images/ path and doesn't start with a slash, fix it
        if stripped.startswith('images/') and not stripped.startswith('/'):
            fixed_parts.append('/' + stripped)
        else:
            fixed_parts.append(stripped)
    return ', '.join(fixed_parts)

def fix_asset_paths(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    updated = False

    for pattern, template in asset_patterns:
        matches = pattern.findall(content)
        for match in matches:
            # Handle standard attributes (href, src)
            if 'images/' in match or 'css/' in match or 'js/' in match:
                if pattern.pattern.startswith('srcset'):
                    # Custom logic for complex comma-separated srcset attributes
                    old_str = match
                    new_str = fix_srcset_paths(match)
                else:
                    # Standard simple paths
                    old_str = match
                    new_str = f"/{match}"
                
                # Replace occurrences safely checking both quote types
                content = content.replace(f'"{old_str}"', f'"{new_str}"')
                content = content.replace(f"'{old_str}'", f"'{new_str}'")
                updated = True

    if updated and content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Walk through all directories, skipping the main root index.html 
for root, dirs, files in os.walk(root_dir):
    if root == root_dir:
        continue
        
    for filename in files:
        if filename == 'index.html':
            file_path = os.path.join(root, filename)
            if fix_asset_paths(file_path):
                rel_path = os.path.relpath(file_path, root_dir)
                print(f"Fixed asset paths & srcsets in: {rel_path}")

print("\nAll asset paths and srcsets updated successfully!")