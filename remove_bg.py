import os
import subprocess

in_dir = r"c:\Users\aditya\OneDrive\Desktop\Something\project1\public\images"
out_dir = r"c:\Users\aditya\OneDrive\Desktop\Something\project1\public\images"

files = [
    "95.jpg",
    "IMG-20251108-WA0021 (1).jpg",
    "IMG-20251108-WA0024.jpg",
    "IMG_20251213_18054517.jpeg"
]

for f in files:
    in_path = os.path.join(in_dir, f)
    # create clean file name for transparent png
    clean_name = f.replace(" ", "_").replace("(", "").replace(")", "").rsplit(".", 1)[0]
    out_path = os.path.join(out_dir, f"{clean_name}_transparent.png")
    if os.path.exists(in_path):
        print(f"Processing {f} -> {out_path}...")
        subprocess.run(["rembg", "i", in_path, out_path])
        print(f"Done: {out_path}")
    else:
        print(f"File not found: {in_path}")

print("\nAll done!")
