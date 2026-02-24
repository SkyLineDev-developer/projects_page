import { Project } from "@/lib/projects.data";

export default function ProjectRow({ project }: { project: Project }) {
  const statusColor = {
    ready: "text-emerald-400",
    building: "text-amber-400",
    error: "text-red-400",
  }[project.status ?? "ready"];

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-[#1a1a1a] last:border-b-0 hover:bg-[#0f0f0f] transition-colors cursor-pointer group">
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0 overflow-hidden">
        {project.icon ? (
          <img src={project.icon} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 76 65" fill="white">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
        )}
      </div>

      {/* Name + URL */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{project.name}</p>
        <p className="text-[12px] text-[#555] truncate mt-0.5">{project.domain}</p>
      </div>

      {/* Last commit */}
      <div className="hidden sm:flex flex-col min-w-0 w-48">
        <p className="text-[13px] text-[#888] truncate">{project.lastCommit}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-[#555]">{project.updatedAt} on</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          <span className="text-[11px] text-[#555]">{project.branch ?? "main"}</span>
        </div>
      </div>

      {/* Team */}
      <div className="hidden md:flex items-center w-52 shrink-0">
        <div className="flex items-center gap-1.5 bg-[#111] border border-[#222] rounded-full px-3 py-1 max-w-[190px]">
          <svg width="12" height="12" viewBox="0 0 98 96" fill="#555" className="shrink-0">
            <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
          </svg>
          <span className="text-[12px] text-[#666] truncate">{project.team}</span>
        </div>
      </div>

      {/* Status + dots */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-7 h-7 rounded-full border border-[#2a2a2a] flex items-center justify-center">
          {project.status === "building" ? (
            <svg className="animate-spin text-blue-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={statusColor}>
              {project.status === "error" ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <polyline points="20 6 9 17 4 12" />
              )}
            </svg>
          )}
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="text-[#444] hover:text-[#888] transition-colors p-1"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}