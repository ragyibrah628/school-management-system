import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { displayClass, baseFor, buildClassName, parseClass, sortClasses, streamsOf } from '../utils/promotion';

interface ClassManagerProps {
  schoolClasses: string[];
  studentCounts: Record<string, number>;
  onSave: (classes: string[], moves: { from: string; to: string }[]) => void;
}

export function ClassManager({ schoolClasses, studentCounts, onSave }: ClassManagerProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const [hasStreams, setHasStreams] = useState(false);
  const [streams, setStreams] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const classesOfLevel = (level: number) => schoolClasses.filter(c => parseClass(c)?.level === level);

  const open = (level: number) => {
    const existing = streamsOf(schoolClasses, level);
    setEditing(level);
    setHasStreams(existing.length > 0);
    setStreams(existing);
    setDraft('');
    setError('');
  };

  const addStream = () => {
    const name = draft.trim();
    if (!name) return;
    const full = buildClassName(baseFor(editing || 1, schoolClasses), name);
    if (parseClass(full)?.level !== editing) { setError(`"${name}" cannot be used as a stream name.`); return; }
    if (streams.some(s => buildClassName(baseFor(editing || 1, schoolClasses), s) === full)) { setError('This stream already exists.'); return; }
    setStreams([...streams, name]);
    setDraft('');
    setError('');
  };

  const save = () => {
    if (editing === null) return;
    const base = baseFor(editing, schoolClasses);
    const pending = draft.trim() ? [...streams, draft.trim()] : streams;
    const names = pending.map(s => buildClassName(base, s));
    const bad = pending.find((s, i) => parseClass(names[i])?.level !== editing || names.indexOf(names[i]) !== i);
    if (hasStreams && bad) { setError(`"${bad}" cannot be used as a stream name (or is repeated).`); return; }
    if (hasStreams && pending.length === 0) { setError('Add at least one stream, or untick "This class has streams".'); return; }
    const wanted = hasStreams ? pending.map(s => buildClassName(base, s)) : [base];
    const current = classesOfLevel(editing);
    const removed = current.filter(c => !wanted.includes(c));
    // students of removed streams join the plain class (or the first remaining stream)
    const moves = removed.filter(c => (studentCounts[c] || 0) > 0).map(c => ({ from: c, to: wanted[0] }));
    if (moves.length > 0) {
      const total = moves.reduce((sum, m) => sum + (studentCounts[m.from] || 0), 0);
      if (!window.confirm(`${total} students from ${moves.map(m => displayClass(m.from)).join(', ')} will move to ${displayClass(wanted[0])}. Continue?`)) return;
    }
    const others = schoolClasses.filter(c => parseClass(c)?.level !== editing);
    onSave(sortClasses([...others, ...wanted]), moves);
    setEditing(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border mt-4">
      <h2 className="font-bold text-lg mb-1">School Classes</h2>
      <p className="text-xs text-slate-500 mb-3">Form I to Form IV always exist. Tap a class to say whether it has streams. Results of a class add up all its streams.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(level => {
          const base = baseFor(level, schoolClasses);
          const list = classesOfLevel(level);
          return (
            <div key={base} className="border rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{displayClass(base)}</p>
                <button onClick={() => open(level)} className="text-xs flex items-center gap-1 text-indigo-600 font-semibold"><Pencil size={14} /> Edit</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {list.map(c => (
                  <span key={c} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold">{displayClass(c)} ({studentCounts[c] || 0})</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-lg mb-3">{displayClass(baseFor(editing, schoolClasses))}</h3>
            <label className="flex items-center gap-2 text-sm mb-3">
              <input type="checkbox" checked={hasStreams} onChange={e => { setHasStreams(e.target.checked); setError(''); }} />
              This class has streams
            </label>
            {hasStreams && (
              <>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {streams.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold">
                      {displayClass(buildClassName(baseFor(editing, schoolClasses), s))}
                      <button onClick={() => setStreams(streams.filter(x => x !== s))} className="text-red-500 font-bold">✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addStream(); }} placeholder="Stream name (A, B, C or other)" className="flex-1 border px-3 py-2 rounded-xl text-sm" />
                  <button onClick={addStream} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">+ Add</button>
                </div>
              </>
            )}
            {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
            <div className="flex gap-2 justify-end mt-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border text-sm">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
