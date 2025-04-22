#!/bin/bash

echo "Setting up profile image..."

# Create public directory if it doesn't exist
mkdir -p public

# Check if the profile.jpeg exists in the src directory
if [ -f "src/assets/profile.jpeg" ]; then
  echo "Found profile.jpeg in src/assets, copying to public directory..."
  cp src/assets/profile.jpeg public/
  echo "✅ Profile image copied successfully!"
else
  echo "⚠️ profile.jpeg not found in src/assets directory."
  echo "Please ensure your profile image is available at public/profile.jpeg"
fi

echo "Done! Run npm run dev to test your site."
