import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ProjectItem, Language } from '../types';
import { t } from '../utils/translations';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onOpenRates: (project: ProjectItem) => void;
  language?: Language;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenRates,
  language = 'ru',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return projects.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  return (
    <div id="projects-view" className="space-y-4">
      {/* Search Toolbar — matches Screenshot 3 */}
      <div className="flex items-center gap-0 max-w-sm bg-white dark:bg-[#0f284a] rounded-md border border-slate-300 dark:border-[#1c457c] overflow-hidden shadow-xs focus-within:ring-1 focus-within:ring-[#15437a]">
        <div className="pl-3 text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder={language === 'ru' ? 'Поиск проектов (Search projects...)' : 'Search projects...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-9 px-3 text-xs focus:outline-none bg-transparent text-slate-800 dark:text-white placeholder-slate-400"
        />
        <button
          id="btn-search-projects"
          className="h-9 px-4 bg-[#15437a] hover:bg-[#123660] text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          {t('search', language)}
        </button>
      </div>

      {/* Projects Table — Screenshot 3 White Header */}
      <div className="bg-white dark:bg-[#0f284a] rounded-lg border border-slate-200 dark:border-[#183a69] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0a1b33] text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-[#183a69] select-none">
                <th className="py-3 px-4 w-14 text-center">#</th>
                <th className="py-3 px-4">{language === 'ru' ? 'Название (Name)' : 'Name'}</th>
                <th className="py-3 px-4">{t('colStatus', language)}</th>
                <th className="py-3 px-4 text-center w-24">{t('actions', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#183a69]">
              {filteredProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-white text-sm">
                    {project.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#00a3c4] text-white shadow-xs">
                      {project.status === 'Active' ? 'Active' : project.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      id={`btn-rates-project-${project.id}`}
                      onClick={() => onOpenRates(project)}
                      className="w-7 h-7 rounded bg-[#15437a] hover:bg-[#123660] text-white flex items-center justify-center font-bold text-xs shadow-xs transition-colors mx-auto cursor-pointer"
                      title={language === 'ru' ? 'Тарифы и расчетные ставки проекта' : 'View Project Rates & Tariffs'}
                    >
                      $
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
