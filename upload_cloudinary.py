import os
import cloudinary
import cloudinary.uploader

# Configure Cloudinary credentials
cloudinary.config(
    cloud_name = "deevn56zp",
    api_key = "199735666854258",
    api_secret = "hWSud9jglCdFM3ZbeFLv4aPo2mE",
    secure = True
)

images_dir = r"public/images"
image_files = [
    "IMG-20260328-WA0005_transparent.png",
    "IMG-20260331-WA0023_transparent.png",
    "IMG_20260130_002122_transparent.png",
    "IMG_20260310_213006_transparent.png"
]

uploaded_urls = {}

print("Starting uploads to Cloudinary...")
for filename in image_files:
    file_path = os.path.join(images_dir, filename)
    if os.path.exists(file_path):
        print(f"Uploading {filename}...")
        try:
            # Upload using the filename (without extension) as the public ID
            public_id = os.path.splitext(filename)[0]
            result = cloudinary.uploader.upload(
                file_path,
                public_id=public_id,
                folder="proposal_assets"
            )
            secure_url = result.get("secure_url")
            uploaded_urls[filename] = secure_url
            print(f"Successfully uploaded! URL: {secure_url}")
        except Exception as e:
            print(f"Failed to upload {filename}: {e}")
    else:
        print(f"File not found: {file_path}")

print("\n--- UPLOADED URLS MAP ---")
for name, url in uploaded_urls.items():
    print(f'"{name}": "{url}",')
