#!/bin/bash

echo "Downloading project image..."

# Create directory for project images if it doesn't exist
mkdir -p public/images

# Download the image using curl
curl "https://media.istockphoto.com/id/1411195926/photo/project-manager-working-on-laptop-and-updating-tasks-and-milestones-progress-planning-with.jpg?s=612x612&w=0&k=20&c=5A0CEsRbIrgnci0Q7LSxbrUZ1pliXy8C04ffpnjnVIw=" -o "public/images/project-image.jpg"

# Check if download was successful
if [ $? -eq 0 ]; then
  echo "✅ Image downloaded successfully to public/images/project-image.jpg"
  
  # Update the Projects.tsx file to use the local image
  sed -i 's|https://media.istockphoto.com/id/1411195926/photo/project-manager-working-on-laptop-and-updating-tasks-and-milestones-progress-planning-with.jpg?s=612x612\&w=0\&k=20\&c=5A0CEsRbIrgnci0Q7LSxbrUZ1pliXy8C04ffpnjnVIw=|/images/project-image.jpg|g' src/components/Projects.tsx
  
  echo "✅ Projects.tsx updated to use the local image path"
else
  echo "❌ Failed to download the image"
fi

echo "Done! Run npm run dev to test your site."
