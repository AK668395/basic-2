import Color from 'color';

const COLOR_HARMONIES = {
    complementary: 180,
    analogous: 30,
    triadic: 120,
    splitComplementary: 150,
};

export function getColorHarmony(colors: string[]): { score: number, explanation: string } {
    if (colors.length < 2) {
        return { score: 7, explanation: 'Not enough colors to determine harmony.' };
    }

    const colorObjects = colors.map(c => {
        try {
            return Color(c);
        } catch (e) {
            return null;
        }
    }).filter(c => c !== null) as Color[];

    if(colorObjects.length < 2) {
        return { score: 7, explanation: 'Could not parse provided colors.' };
    }

    const hues = colorObjects.map(c => c.hue());
    const hueDifferences = [];
    for (let i = 0; i < hues.length - 1; i++) {
        for (let j = i + 1; j < hues.length; j++) {
            const diff = Math.abs(hues[i] - hues[j]);
            hueDifferences.push(Math.min(diff, 360 - diff));
        }
    }

    const avgDifference = hueDifferences.reduce((a, b) => a + b, 0) / hueDifferences.length;

    let bestHarmony: keyof typeof COLOR_HARMONIES | 'monochromatic' | 'achromatic' | 'mixed' = 'mixed';
    let harmonyScore = 0;

    const luminanceRange = Math.max(...colorObjects.map(c => c.luminosity())) - Math.min(...colorObjects.map(c => c.luminosity()));
    const saturationRange = Math.max(...colorObjects.map(c => c.saturationl())) - Math.min(...colorObjects.map(c => c.saturationl()));

    if (saturationRange < 15) {
        bestHarmony = 'achromatic';
        harmonyScore = 8;
    }
    else if(avgDifference < 15 && luminanceRange > 0.2) {
        bestHarmony = 'monochromatic';
        harmonyScore = 9;
    }
    else {
       Object.entries(COLOR_HARMONIES).forEach(([harmony, targetDiff]) => {
            const score = 1 - Math.abs(avgDifference - targetDiff) / 180;
            if (score > harmonyScore) {
                harmonyScore = score;
                bestHarmony = harmony as keyof typeof COLOR_HARMONIES;
            }
        });
       harmonyScore = 4 + harmonyScore * 6;
    }

    const explanations = {
        complementary: 'The colors are opposite on the color wheel, creating a vibrant and high-contrast look.',
        analogous: 'The colors are next to each other on the color wheel, resulting in a serene and comfortable design.',
        triadic: 'The colors are evenly spaced around the color wheel, offering high contrast while retaining harmony.',
        splitComplementary: 'A variation of the complementary color scheme, providing high contrast without being as jarring.',
        monochromatic: 'The outfit uses variations in lightness and saturation of a single color, creating a clean and elegant feel.',
        achromatic: 'The outfit uses neutral colors, creating a sophisticated and timeless look.',
        mixed: 'The color combination is unique but does not strictly follow a traditional harmony rule.'
    }

    return { score: harmonyScore, explanation: explanations[bestHarmony] };
}

export function getSeasonalColors(date: Date): string[] {
    const month = date.getMonth(); // 0-11

    // Northern Hemisphere seasons
    if (month >= 2 && month <= 4) { // Spring
        return ['pastel pink', 'baby blue', 'light green', 'lavender', 'soft yellow'];
    }
    if (month >= 5 && month <= 7) { // Summer
        return ['white', 'turquoise', 'coral', 'bright yellow', 'royal blue'];
    }
    if (month >= 8 && month <= 10) { // Fall
        return ['burgundy', 'mustard yellow', 'olive green', 'burnt orange', 'brown'];
    }
    // Winter (Nov, Dec, Jan)
    return ['navy blue', 'emerald green', 'deep red', 'charcoal gray', 'black'];
}