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

### Adding Your Resume

1. Save your resume as a PDF file with the name `Vaibhav_Kumawat_Resume.pdf`
2. Place this file in the `/public` directory
3. When deployed, the resume will be available for download through the "Download Resume" buttons

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

Once deployed, your site will be live with all your projects and resume ready for visitors.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
