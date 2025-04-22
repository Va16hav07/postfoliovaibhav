#!/bin/bash

echo "Setting up images for your portfolio..."

# Create public directory if it doesn't exist
mkdir -p public

echo "Don't forget to add your profile image to the public directory with the name 'profile-image.jpg'"
echo "You can do this by copying your image to: $(pwd)/public/profile-image.jpg"

# Create a placeholder if it doesn't exist
if [ ! -f "public/profile-image.jpg" ]; then
  echo "Profile image not found. Creating a reminder file..."
  echo "Please replace this file with your actual profile image" > public/REPLACE_WITH_PROFILE_IMAGE.txt
fi

echo "Done! Run npm run dev to test your site."
