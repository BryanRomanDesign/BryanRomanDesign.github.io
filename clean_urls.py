import os
import shutil

# Get the directory where this script is running
root_dir = os.path.dirname(os.path.realpath(__file__))

# Loop through all files in the root directory
for filename in os.listdir(root_dir):
    # Check if the file is an HTML file
    if filename.endswith('.html'):
        # Skip the main index.html file
        if filename == 'index.html':
            continue
            
        # Get the name of the file without the .html extension (e.g., 'projects')
        folder_name = os.path.splitext(filename)[0]
        
        # Path to the new folder
        new_folder_path = os.path.join(root_dir, folder_name)
        
        # Path to the current HTML file
        current_file_path = os.path.join(root_dir, filename)
        
        # Path to the new index.html inside the new folder
        destination_file_path = os.path.join(new_folder_path, 'index.html')
        
        try:
            # 1. Create the new folder if it doesn't already exist
            if not os.path.exists(new_folder_path):
                os.makedirs(new_folder_path)
                print(f"Created folder: /{folder_name}")
            
            # 2. Move and rename the HTML file
            shutil.move(current_file_path, destination_file_path)
            print(f"Moved and renamed: {filename} -> /{folder_name}/index.html")
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print("\nAll done! Your file structure has been updated.")