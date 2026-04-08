export function LegalDocument({
  doc,
  privacyPath,
}: {
  doc: {
    h1: string;
    updated: string;
    sections: readonly { h: string; html: string }[];
  };
  privacyPath: string;
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[720px] px-6 md:px-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{doc.h1}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{doc.updated}</p>

        <div className="prose-brand mt-10 space-y-8 text-[15px] leading-relaxed text-brand-600">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-bold text-brand-900">{s.h}</h2>
              <div
                className="mt-3 space-y-3 [&_a]:font-medium [&_a]:text-brand-900 [&_a]:underline [&_a]:underline-offset-2"
                dangerouslySetInnerHTML={{
                  __html: s.html.replace(/\{\{privacyPath\}\}/g, privacyPath),
                }}
              />
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
