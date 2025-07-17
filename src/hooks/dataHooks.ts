import { useMemo } from 'react';
import { getFileByName } from '../utils/parsingHelpers';
import type { SubtaskData } from '../types';

export const useParsedData = (
	jsonFiles: { name: string; content: string }[]
) => {
	const getParsedFile = (name: string) => {
		const content = getFileByName(jsonFiles, name);
		if (!content) return null;
		try {
			return JSON.parse(content);
		} catch {
			console.warn(`${name} is not valid JSON`);
			return null;
		}
	};

	return useMemo(
		() => ({
			project: getParsedFile('project_data.json'),
			boards: getParsedFile('boards_data.json'),
			stages: getParsedFile('stages_data.json'),
			workitems: getParsedFile('workitem_data.json'),
			importance: getParsedFile('importance_levels_data.json'),
			milestones: getParsedFile('milestones_data.json'),
			tags: getParsedFile('workitem_tags_data.json'),
			tagDefinitions: getParsedFile('tags_data.json'),
			users: getParsedFile('project_users_data.json'),
			workitemUsers: getParsedFile('workitem_users_data.json'),
			subtasks: getParsedFile('subtasks_data.json'),
		}),
		[jsonFiles]
	);
};

export const useProjectData = (project: any) => {
	return useMemo(() => {
		if (Array.isArray(project) && project[0]) {
			return { name: project[0].Name, id: project[0].ProjectId };
		}
		return { name: 'Error: Please upload files first', id: '0' };
	}, [project]);
};

export const useBoardData = (boards: any[], projectId: string) => {
	return useMemo(() => {
		if (!Array.isArray(boards)) return [];
		return boards
			.filter(
				(b) =>
					b?.ProjectId === projectId &&
					b?.Name?.trim() &&
					b?.BoardId?.trim()
			)
			.map((b) => ({
				name: b.Name,
				id: b.BoardId,
				milestoneId: b.MilestoneId,
			}));
	}, [boards]);
};

export const useStageData = (stages: any[], projectId: string) => {
	return useMemo(() => {
		if (!Array.isArray(stages)) return [];
		return stages
			.filter((s) => s?.ProjectId === projectId && s?.Name?.trim())
			.map((s) => ({
				id: s.StageId,
				name: s.Name,
				status: s.Status,
			}));
	}, [stages, projectId]);
};

export const useWorkItemsData = (
	workitems: any[],
	projectId: string,
	boards: { id: string }[],
	activeTab: number
) => {
	return useMemo(() => {
		if (!Array.isArray(workitems) || !boards[activeTab]?.id) return [];
		return workitems
			.filter(
				(w) =>
					w?.ProjectId === projectId &&
					w?.BoardId === boards[activeTab].id &&
					w?.StageId?.trim()
			)
			.map((w) => ({
				id: w.WorkItemId,
				title: w.Title,
				description: w.Description,
				importance: w.ImportanceLevelId,
				stageId: w.StageId,
				boardId: w.BoardId,
				creatorUser: w.CreatorUserId,
			}));
	}, [workitems, projectId, boards, activeTab]);
};

export const useImportanceData = (importance: any[], projectId: string) => {
	return useMemo(() => {
		if (!Array.isArray(importance)) return [];
		return importance
			.filter(
				(i) =>
					i?.ProjectId === projectId &&
					i?.ImportanceLevelId &&
					i?.Name?.trim()
			)
			.map((i) => ({
				id: i.ImportanceLevelId,
				name: i.Name,
			}));
	}, [importance, projectId]);
};

export const useMilestoneData = (milestones: any[], projectId: string) => {
	return useMemo(() => {
		if (!Array.isArray(milestones)) return [];
		return milestones
			.filter(
				(i) =>
					i?.ProjectId === projectId && i?.MilestoneId && i?.Name?.trim()
			)
			.map((i) => ({
				id: i.MilestoneId,
				name: i.Name,
			}));
	}, [milestones, projectId]);
};

export const useTagsData = (tags: any[], projectId: string) => {
	return useMemo(() => {
		if (!Array.isArray(tags)) return [];
		return tags
			.filter(
				(t) => t?.ProjectId === projectId && t?.WorkItemId && t?.TagName
			)
			.map((t) => ({
				workItemId: t.WorkItemId,
				name: t.TagName,
			}));
	}, [tags, projectId]);
};

export const useUsersData = (users: any[], projectId: string) => {
	return useMemo(() => {
		if (!Array.isArray(users)) return [];
		return users
			.filter((u) => u?.ProjectId === projectId && u?.UserId && u?.FullName)
			.map((u) => ({
				id: u.UserId,
				name: u.FullName,
			}));
	}, [users, projectId]);
};

export const useWorkItemUsersData = (data: any[], projectId: string) => {
	return useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data
			.filter(
				(w) => w?.ProjectId === projectId && w?.WorkItemId && w?.UserId
			)
			.map((w) => ({
				workItemId: w.WorkItemId,
				userId: w.UserId,
			}));
	}, [data, projectId]);
};

export const useSubtaskData = (
	subtasks: any[],
	projectId: string
): SubtaskData[] => {
	if (!Array.isArray(subtasks)) return [];
	return subtasks
		.filter(
			(s) => s.ProjectId === projectId && s?.WorkItemId && s?.IsCompleted
		)
		.map((s) => ({
			workItemId: s.WorkItemId,
			title: s.Title,
			isCompleted: s.IsCompleted === 'True',
		}));
};
