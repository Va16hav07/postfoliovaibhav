# Vaibhav's Portfolio

A modern, responsive portfolio website built with React, TypeScript, and TailwindCSS.

## Setup

### Adding Your Profile Image

1. Save your profile image as `profile.jpeg`
2. Place this file in the `/public` directory
3. The image will be displayed on the homepage

For quick setup, you can run:
```bash
chmod +x copy-profile-image.sh
./copy-profile-image.sh
```

### Project Images

All projects use the same image from the local directory (`/public/images/project-image.jpg`). To download this image and set it up:

```bash
chmod +x download-project-image.sh
./download-project-image.sh
```

If you want to use different images for each project, modify the `Projects.tsx` file accordingly.

### Adding Your Resume (IMPORTANT)

1. Save your resume as a PDF file with the name `Vaibhav_Kumawat_Resume.pdf`
2. Place this file in the `/public` directory (not in any subdirectory)
3. Verify that the file is correctly placed by running:
   ```bash
   chmod +x check-resume.sh
   ./check-resume.sh
   ```
4. When deployed, the resume will be available for download through the "Download Resume" buttons

**Note:** If your resume file isn't correctly placed, the download functionality will not work on the live site!

## Deployment

This site can be easily deployed on platforms like:

- Vercel
- Netlify
- GitHub Pages

### Deployment Steps for Netlify:

1. Create an account on [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **IMPORTANT**: Make sure your resume file (`Vaibhav_Kumawat_Resume.pdf`) is in the `/public` directory before deploying!

### Verifying Resume Deployment

After deploying your site, you can verify the resume file is properly deployed by visiting:
```
https://your-website-url.com/Vaibhav_Kumawat_Resume.pdf
```

If the file loads, the download functionality should work correctly.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Check if resume file exists
./check-resume.sh

# Build for production
npm run build
```
