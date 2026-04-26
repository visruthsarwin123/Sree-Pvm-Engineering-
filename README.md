# Atelier - Cinematic Landing Page

Premium marketing site with scroll-scrubbed video interaction.

## Hero Video → Frame Sequence Pipeline

The hero uses a scroll-scrubbed frame sequence. Follow these steps to prepare your video:

```bash
# 1. Drop the source video at /input/source.mp4 in the project root.
mkdir -p input public/frames

# 2. Extract frames with ffmpeg (requires ffmpeg installed locally).
ffmpeg -i input/source.mp4 \
  -vf "fps=30,scale='min(1920,iw)':'-2':flags=lanczos" \
  -q:v 3 \
  public/frames/frame_%04d.jpg

# 3. Count the frames and paste the number into FRAME_COUNT in src/lib/constants.ts.
ls public/frames | wc -l
```

### Optional: WebP conversion
```bash
for f in public/frames/*.jpg; do
  cwebp -q 82 "$f" -o "${f%.jpg}.webp" && rm "$f"
done
```

## Tech Stack
- Vite + React 18 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Radix UI

## Getting Started
```bash
npm install
npm run dev
```
