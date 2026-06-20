import { AXES, AXIS_SHORT_NAMES, type AxisScores } from "../data/axes";

export type RadarChartProps = {
  scores: AxisScores;
  displayScores: AxisScores;
  labels: Record<string, string>;
  size?: number;
};

function polarPoint(center: number, radius: number, index: number, count: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

function pointsToString(points: Array<{ x: number; y: number }>): string {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

export function RadarChart({ scores, displayScores, labels, size = 360 }: RadarChartProps) {
  const center = size / 2;
  const outerRadius = size * 0.33;
  const labelRadius = outerRadius * 1.24;
  const summary = AXES.map(
    (axis) => `${AXIS_SHORT_NAMES[axis]} ${labels[axis] ?? ""}`,
  ).join(", ");
  const polygon = AXES.map((axis, index) =>
    polarPoint(center, outerRadius * (scores[axis] / 100), index, AXES.length),
  );

  return (
    <figure className="radarFigure">
      <svg
        className="radarChart"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`학습 지도 결과: ${summary}`}
      >
        {[0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
          <polygon
            key={ratio}
            points={pointsToString(
              AXES.map((_, index) =>
                polarPoint(center, outerRadius * ratio, index, AXES.length),
              ),
            )}
            fill="none"
            stroke="#CCD0D8"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            aria-hidden="true"
          />
        ))}
        {AXES.map((axis, index) => {
          const point = polarPoint(center, outerRadius, index, AXES.length);
          const label = polarPoint(center, labelRadius, index, AXES.length);
          return (
            <g key={axis}>
              <line
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="#D8DAE0"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                aria-hidden="true"
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor={label.x < center - 8 ? "end" : label.x > center + 8 ? "start" : "middle"}
                dominantBaseline="middle"
                className={`radarLabel radar-${axis}`}
              >
                <tspan>{AXIS_SHORT_NAMES[axis]}</tspan>
                <tspan dx="5" className="radarScore">
                  {displayScores[axis].toFixed(1)}
                </tspan>
              </text>
            </g>
          );
        })}
        <polygon
          points={pointsToString(polygon)}
          fill="rgba(69, 89, 222, 0.23)"
          stroke="#4559DE"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {polygon.map((point, index) => (
          <circle
            key={AXES[index]}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#4559DE"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ))}
      </svg>
    </figure>
  );
}
