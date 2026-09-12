#!/usr/bin/env python3
"""Extract independent scroll frames. Requires ffmpeg and Pillow (WebP).

Run from the repository root. No sharpening, upscaling or interpolation.
"""
import argparse
import json
from pathlib import Path
import subprocess
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('source', nargs='?', default='web/public/videos/camera-360-studio.mp4')
args = parser.parse_args()
root = Path('web/public/assets/camera/turn-v1')
for variant in ['mobile', 'desktop']:
    (root / variant).mkdir(parents=True, exist_ok=True)
video = subprocess.Popen([
    'ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', args.source,
    '-an', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
frame_bytes = 1280 * 720 * 3
count = 0
while data := video.stdout.read(frame_bytes):
    if len(data) != frame_bytes:
        raise RuntimeError('Incomplete source frame')
    frame = Image.frombytes('RGB', (1280, 720), data)
    if count % 2 == 0:
        frame.save(root / 'desktop' / f'{count // 2:03}.webp', quality=88, method=6)
        frame.resize((960, 540), Image.Resampling.LANCZOS).save(
            root / 'mobile' / f'{count // 2:03}.webp', quality=88, method=6)
    count += 1
if video.wait() or count != 241:
    raise RuntimeError(f'Expected 241 source frames, found {count}')
manifest = {}
for name, width, expected in [('mobile', 960, 121), ('desktop', 1280, 121)]:
    files = sorted((root / name).glob('*.webp'))
    assert len(files) == expected
    manifest[name] = dict(width=width, height=width * 9 // 16, frames=expected,
                          bytes=sum(p.stat().st_size for p in files))
(root / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps(manifest))
