import os
import re

# Get the directory where this script is running
root_dir = os.path.dirname(os.path.realpath(__file__))

# Regex pattern to find links ending in .html within href attributes
# This matches things like href="projects.html" or href="/projects.html"
html_link_pattern = re.compile(r'href=["\']([^"\']+\.html)["\']')

def clean_file_links(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all .html links in the file
    matches = html_link_pattern.findall(content)
    if not matches:
        return False

    new_content = content
    for match in matches:
        # Don't change external links like http://example.com/page.html
        if match.startswith('http://') or match.startswith('https://'):
            continue
            
        # 1. Strip the .html extension
        clean_url = match.replace('.html', '')
        
        # 2. Fix the relative path issue at the same time!
        # If it doesn't already start with a slash, add one so it looks at the root
        if not clean_url.startswith('/') and not clean_url.startswith('#'):
            clean_url = '/' + clean_url
            
        # Replace the old link with the new clean link
        new_content = new_content.replace(f'href="{match}"', f'href="{clean_url}"')
        new_content = new_content.replace(f'href=\'{match}\'', f'href=\'{clean_url}\'')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

# Walk through all directories and files
for root, dirs, files in os.walk(root_dir):
    for filename in files:
        if filename == 'index.html':
            file_path = os.path.join(root, filename)
            if clean_file_links(file_path):
                # Print a clean relative path so you can see what changed
                rel_path = os.path.relpath(file_path, root_dir)
                print(f"Fixed links in: {rel_path}")

print("\nAll links updated successfully!")