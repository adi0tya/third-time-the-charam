import os
import subprocess

in_dir = r"c:\Users\aditya\OneDrive\Desktop\Something\project1\public\images"
out_dir = r"c:\Users\aditya\OneDrive\Desktop\Something\project1\public\images"

files = [
    "IMG-20260328-WA0005.jpg",
    "IMG-20260331-WA0023.jpg",
    "IMG_20260130_002122.jpg",
    "IMG_20260310_213006.jpg"
]

for f in files:
    in_path = os.path.join(in_dir, f)
    out_path = os.path.join(out_dir, f.rsplit(".", 1)[0] + "_transparent.png")
    if os.path.exists(in_path):
        print(f"Processing {f}...")
        subprocess.run(["rembg", "i", in_path, out_path])
        print(f"Done: {out_path}")
    else:
        print(f"File not found: {in_path}")

print("\nAll done!")
