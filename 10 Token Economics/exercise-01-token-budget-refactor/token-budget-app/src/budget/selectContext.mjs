function compareSources(left, right) {
  const leftMandatory = left.mandatory === true && left.authority === "current";
  const rightMandatory = right.mandatory === true && right.authority === "current";
  return Number(rightMandatory) - Number(leftMandatory)
    || (right.priority ?? 0) - (left.priority ?? 0)
    || left.id.localeCompare(right.id);
}

function canonicalTags(values) {
  return [...new Set(values.filter((value) => typeof value === "string"))].sort();
}

export function selectContext(catalog, task = {}, maximumBytes) {
  if (!Number.isInteger(maximumBytes) || maximumBytes <= 0) {
    throw new Error("Maximum context bytes must be a positive integer");
  }

  const ids = new Set();
  for (const source of catalog) {
    if (ids.has(source.id)) throw new Error(`Duplicate context id: ${source.id}`);
    ids.add(source.id);
  }

  const sources = [...catalog].sort(compareSources);
  const mandatoryBytes = sources
    .filter((source) => source.mandatory === true && source.authority === "current")
    .reduce((total, source) => total + source.bytes, 0);
  if (mandatoryBytes > maximumBytes) {
    throw new Error(`Mandatory context requires ${mandatoryBytes} bytes but the maximum is ${maximumBytes}`);
  }

  const requestedTags = canonicalTags([...(task.tags ?? []), ...(task.questions ?? [])]);
  const requestedTagSet = new Set(requestedTags);
  const selected = [];
  const skipped = [];
  let totalBytes = 0;

  for (const source of sources) {
    if (source.authority !== "current") {
      skipped.push({ ...source, reason: "stale" });
      continue;
    }

    const mandatory = source.mandatory === true;
    const relevant = source.tags.some((tag) => requestedTagSet.has(tag));
    if (!mandatory && !relevant) {
      skipped.push({ ...source, reason: "irrelevant" });
      continue;
    }

    if (totalBytes + source.bytes > maximumBytes) {
      skipped.push({ ...source, reason: "budget" });
      continue;
    }

    selected.push({ ...source, reason: mandatory ? "mandatory" : "relevant" });
    totalBytes += source.bytes;
  }

  const coveredTags = new Set(selected.flatMap((source) => source.tags));
  return {
    selected,
    skipped,
    totalBytes,
    remainingBytes: maximumBytes - totalBytes,
    maximumBytes,
    requestedTags,
    unresolvedTags: requestedTags.filter((tag) => !coveredTags.has(tag)),
  };
}
