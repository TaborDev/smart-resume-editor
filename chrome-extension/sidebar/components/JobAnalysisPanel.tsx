import React, { useMemo } from 'react';
import { JobInfo, JobAnalysisResponse } from '@smart-resume/types';
import { calculateMatchScore, extractKeywords } from '@smart-resume/utils';

interface JobAnalysisPanelProps {
  jobInfo: JobInfo;
  analysis: JobAnalysisResponse | null;
  resumeLatex: string;
  darkMode: boolean;
}

export const JobAnalysisPanel: React.FC<JobAnalysisPanelProps> = ({
  jobInfo,
  analysis,
  resumeLatex,
  darkMode
}) => {
  const matchScore = useMemo(() => {
    if (!analysis) return 0;
    const resumeKeywords = extractKeywords(resumeLatex);
    return calculateMatchScore(resumeKeywords, analysis.keywords);
  }, [analysis, resumeLatex]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  if (!analysis) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-800">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Job Analysis
          </h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(matchScore)} ${getScoreColor(matchScore)}`}>
            {matchScore}% Match
          </div>
        </div>

        {/* Job Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {jobInfo.jobTitle}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {jobInfo.companyName} • {jobInfo.siteName}
          </p>
        </div>

        {/* Keywords Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Key Requirements
          </h4>
          
          {/* Required Skills */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Required Skills ({analysis.requiredSkills.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {analysis.requiredSkills.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded"
                >
                  {skill}
                </span>
              ))}
              {analysis.requiredSkills.length > 8 && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  +{analysis.requiredSkills.length - 8} more
                </span>
              )}
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Preferred Skills ({analysis.preferredSkills.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {analysis.preferredSkills.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                >
                  {skill}
                </span>
              ))}
              {analysis.preferredSkills.length > 6 && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  +{analysis.preferredSkills.length - 6} more
                </span>
              )}
            </div>
          </div>

          {/* Experience Level */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Experience Level
            </span>
            <span className="text-xs font-medium text-gray-900 dark:text-white capitalize">
              {analysis.experienceLevel}
            </span>
          </div>

          {/* Skills Matrix */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Skills Match Overview
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Technical:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {analysis.categories.technical.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tools:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {analysis.categories.tools.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Soft:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {analysis.categories.soft.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Certs:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {analysis.categories.certifications.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};