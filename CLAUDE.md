# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (http://localhost:5173)
pnpm build        # TypeScript check and production build
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

## Architecture

This is a React application for creating presentation slides with charts and exporting them to PPTX and PDF formats.

### Key Libraries

- **@gravity-ui/charts** - Chart rendering (line, pie charts) via `Chart` component
- **@gravity-ui/uikit** - UI components (Button, Link, ThemeProvider)
- **pptxgenjs** - Programmatic PPTX generation with native editable charts
- **jspdf + html2canvas** - PDF export via DOM capture with clickable link annotations

### Data Flow

1. `src/charts/chartData.ts` - Single source of truth for slide content (title, description, links, chart series, pie data)
2. Components render the slide preview using Gravity UI charts
3. Export utilities convert the same data to PPTX (programmatic) or PDF (DOM capture)

### Export Architecture

- **PPTX Export** (`src/utils/pptxExporter.ts`): Uses `chartConverter.ts` to transform chart data format, then builds slides programmatically with PptxGenJS. Charts are native and editable in PowerPoint.
- **PDF Export** (`src/utils/pdfExporter.ts`): Captures slide DOM with html2canvas, extracts link positions, renders to PDF with jsPDF, then overlays invisible clickable link annotations.

### Type Imports

Use `import type` for TypeScript interfaces from `chartData.ts` to avoid Vite module resolution issues:

```typescript
import type {ChartData, PieChartSegment} from '../charts/chartData';
```

### Gravity UI Charts Format

Axes must be arrays:

```typescript
xAxis: [{ type: "datetime" }],
yAxis: [{ title: { text: "Label" } }]
```
