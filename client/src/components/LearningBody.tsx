import { Fragment, type ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-muted px-1 py-0.5 text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function renderContent(block: string, key: number): ReactNode {
  const lines = block.split("\n");
  const tableRows = lines.map((line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const isTable =
    lines.length >= 2 &&
    lines.every((line) => line.includes("|")) &&
    tableRows[1].every((cell) => /^:?-{3,}:?$/.test(cell));
  if (isTable) {
    const headers = tableRows[0];
    return (
      <div key={key} className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-muted/60 text-xs font-semibold uppercase tracking-wide text-foreground">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-4 py-3">
                  {renderInline(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {tableRows.slice(2).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((_, columnIndex) => (
                  <td key={columnIndex} className="px-4 py-3 align-top">
                    {renderInline(row[columnIndex] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
    return (
      <ul key={key} className="list-disc space-y-2 pl-5">
        {lines.map((line, lineIndex) => (
          <li key={lineIndex}>{renderInline(line.replace(/^\s*[-*]\s+/, ""))}</li>
        ))}
      </ul>
    );
  }
  if (lines.every((line) => /^\s*\d+[.)]\s+/.test(line))) {
    return (
      <ol key={key} className="list-decimal space-y-2 pl-5">
        {lines.map((line, lineIndex) => (
          <li key={lineIndex}>{renderInline(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>
        ))}
      </ol>
    );
  }
  if (lines.every((line) => /^\s*>\s?/.test(line))) {
    return (
      <blockquote key={key} className="border-l-2 border-primary/40 pl-4 italic text-foreground">
        {lines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 && <br />}
            {renderInline(line.replace(/^\s*>\s?/, ""))}
          </Fragment>
        ))}
      </blockquote>
    );
  }
  return (
    <p key={key}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {renderInline(line)}
        </Fragment>
      ))}
    </p>
  );
}

export function LearningBody({ body }: { body: string }) {
  const normalizedBody = body.trim().replace(/([^\n])\n(?=#{2,3}\s)/g, "$1\n\n");
  const blocks = normalizedBody
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5 text-sm leading-7 text-muted-foreground sm:text-base">
      {blocks.map((block, index) => {
        const heading = block.match(/^(#{2,3})\s+([^\n]+)(?:\n([\s\S]*))?$/);
        if (heading) {
          const className = "pt-2 text-lg font-semibold text-foreground";
          const Heading = heading[1].length === 2 ? "h2" : "h3";
          return (
            <Fragment key={index}>
              <Heading className={className}>{renderInline(heading[2])}</Heading>
              {heading[3]?.trim() && renderContent(heading[3].trim(), index)}
            </Fragment>
          );
        }
        return renderContent(block, index);
      })}
    </div>
  );
}
