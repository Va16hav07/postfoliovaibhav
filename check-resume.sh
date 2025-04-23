#!/bin/bash

echo "Checking for resume file..."

# Path to the resume
RESUME_PATH="public/Vaibhav_Kumawat_Resume.pdf"

# Check if the resume exists
if [ -f "$RESUME_PATH" ]; then
  echo "✅ Resume found at $RESUME_PATH"
else
  echo "❌ Resume not found at $RESUME_PATH"
  echo "Please add your resume to this location before deploying!"
  
  # Create the directories if they don't exist
  mkdir -p public
  
  # Create a placeholder file
  echo "Creating a placeholder file with instructions..."
  cat > public/RESUME_MISSING.txt << EOF
IMPORTANT: Your resume file is missing!

Please add your resume as "Vaibhav_Kumawat_Resume.pdf" to the public directory 
before deploying your portfolio.

The resume download button will not work without this file.
EOF

  echo "✅ Created placeholder file with instructions"
fi

echo "Done! Make sure to add your resume before the final build."
