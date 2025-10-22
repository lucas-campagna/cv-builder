type TSection = {
  title: string;
  upperLeft?: string;
  upperRight?: string;
  lowerLeft?: string;
  lowerRight?: string;
  summary?: string | string[];
}

const Section = ({ title, upperLeft, upperRight, lowerLeft, lowerRight, summary }: TSection) => {
  const hasUpper = upperLeft || upperRight;
  const hasLower = lowerLeft || lowerRight;
  return (
    <div className="mb-3">
      <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-900 pb-1 mb-1">
        {title}
      </h2>
      <div className="mx-2">
        {
          hasUpper &&
          <div className={'flex justify-between'}>
            <span className="text-lg">{upperLeft}</span>
            <span className="text-lg">{upperRight}</span>
          </div>
        }
        {
          hasLower && <div className={'flex justify-between'}>
            <span className="text-lg">{lowerLeft}</span>
            <span className="text-md">{lowerRight}</span>
          </div>
        }
        {summary && (
          <p className="text-sm">
            {!Array.isArray(summary) ? summary : summary.map((children, index) => <BulletPoint key={index} children={children} />)}
          </p>
        )}
      </div>
    </div>
  )
};

/**
 * Renders a simple bullet point item as seen in the Experience section.
 * @param {string} children - The content of the bullet point.
 */
const BulletPoint = ({ children }: { children: string }) => (
  <li className="list-disc ml-5 my-1 text-base">
    {children}
  </li>
);

export { Section, BulletPoint };
export type { TSection };
