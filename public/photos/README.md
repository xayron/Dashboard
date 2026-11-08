# Local Photos Directory

Drop your personal photos (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`) here!

The dashboard automatically scans this directory via the `/api/photos` endpoint and cycles through them in **Ambient Mode**:
- **Landscape photos** ($R \ge 1.6$) are rendered in full-bleed cover mode.
- **Squarish photos** ($1.2 \le R < 1.6$) are centered with mild background blur.
- **Portrait photos** ($R < 1.2$) are displayed uncropped with dual-blur mirrored wings and automatic widget relocation to the sidebands.
