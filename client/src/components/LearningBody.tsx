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

export function LearningBody({ body }: { body: string }) {
  const blocks = body
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5 text-sm leading-7 text-muted-foreground sm:text-base">
      {blocks.map((block, index) => {
        const heading = block.match(/^(#{2,3})\s+(.+)$/);
        if (heading) {
          const className =
            heading[1].length === 2
              ? "pt-2 text-lg font-semibold text-foreground"
              : "pt-1 text-base font-semibold text-foreground";
          const content = renderInline(heading[2]);
          return heading[1].length === 2 ? (
            <h2 key={index} className={className}>
              {content}
            </h2>
          ) : (
            <h3 key={index} className={className}>
              {content}
            </h3>
          );
        }
        const lines = block.split("\n");
        if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((line) => /^\s*\d+[.)]\s+/.test(line))) {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
