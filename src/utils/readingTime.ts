/** Minutos de lectura de una nota, a partir del Markdown crudo. */
export function readingTime(body: string): number {
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
