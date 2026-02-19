import { useState } from "react";
import SourceCard from "@/components/SourceCard";
import SourceDrawer from "@/components/SourceDrawer";
import { sourceEmails, SourceEmail } from "@/data/mockData";

const Sources = () => {
  const [selected, setSelected] = useState<SourceEmail | null>(null);

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">Sources</h1>
        <p className="mt-1 text-sm text-muted-foreground">Incoming emails and documents feeding your pipeline.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sourceEmails.map(source => (
          <SourceCard key={source.id} source={source} onClick={() => setSelected(source)} />
        ))}
      </div>

      <SourceDrawer source={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Sources;
