# Givens Fire and Forestry Static Site

This is a plain HTML/CSS/JS static migration of `givensfireandforestry.com`.

## Project Structure

- `index.html` - homepage
- `about.html` - company and operator information
- `gallery.html` - project image gallery
- `services.html` - service details
- `tree-removal.html` - flat-rate tree removal page
- `contact.html` - appointment/contact page
- `resources.html` - wildfire and forestry resources
- `toolbox.html` - tree height and firewood cord calculators
- `style.css` - shared styling for every page
- `script.js` - mobile nav and calculator behavior
- `assets/images/` - all downloaded local image assets
- `research/` - source capture notes, original page HTML, and asset manifest

## Preview Locally

Run this from the project folder:

```sh
python3 -m http.server 4173
```

Then open:

```txt
http://127.0.0.1:4173/index.html
```

## Host Free On Cloudflare Pages

1. Create a free Cloudflare account at `cloudflare.com`.
2. Push this folder to a GitHub repository.
3. In Cloudflare, go to `Workers & Pages`.
4. Choose `Create application`, then `Pages`, then `Connect to Git`.
5. Select the GitHub repository.
6. Use these build settings:
   - Framework preset: `None`
   - Build command: leave blank
   - Build output directory: `/`
7. Click `Save and Deploy`.

Cloudflare will deploy the static site and give you a temporary `*.pages.dev` URL.

## Connect `givensfireandforestry.com`

1. In Cloudflare Pages, open the deployed project.
2. Go to `Custom domains`.
3. Add `givensfireandforestry.com`.
4. Add `www.givensfireandforestry.com`.
5. If your domain already uses Cloudflare nameservers, Cloudflare will create the DNS records automatically.
6. If your domain is registered elsewhere, update your registrar nameservers to the Cloudflare nameservers shown in your Cloudflare dashboard.
7. Set the preferred canonical domain in Cloudflare Pages after both domains verify.

Recommended setup:

- `givensfireandforestry.com` redirects to `www.givensfireandforestry.com`
- SSL/TLS mode: `Full`
- Always Use HTTPS: enabled

## Contact Form Setup

The Squarespace forms were replaced with Formspree-ready HTML forms.

Before launch:

1. Create a free Formspree account at `formspree.io`.
2. Create a new form.
3. Copy the form endpoint.
4. Replace every placeholder:

```txt
https://formspree.io/f/your-form-id
```

with your real Formspree endpoint in:

- `index.html`
- `contact.html`
- `tree-removal.html`

File uploads from Squarespace were not recreated because Formspree file uploads depend on your selected Formspree plan and endpoint settings.

## Update Content

Edit the HTML file for the page you want to change:

- Page text lives directly in each `.html` file.
- Shared colors, fonts, spacing, nav behavior, responsive layout, and buttons live in `style.css`.
- Mobile nav and toolbox calculators live in `script.js`.
- Images should be placed in `assets/images/`, then referenced with paths like:

```html
<img src="assets/images/example.jpg" alt="Describe the image">
```

Keep image filenames lowercase with hyphens, for example:

```txt
new-project-photo.jpg
```

## Design Notes From Original Site

- Fonts: `Anton`, `Oswald`, `Newsreader`
- Max page/container width: `1500px`
- Main colors:
  - Black: `#000000`
  - White: `#ffffff`
  - Light background: `#e1dfd9`
  - Dark green: `#2c382b`
  - Near-black green: `#1d231c`
  - Muted green: `#8fa98f`

## Migration Notes

Screenshots and extracted source data are kept in `research/` for reference. The public site itself only needs the HTML files, `style.css`, `script.js`, and `assets/images/`.
