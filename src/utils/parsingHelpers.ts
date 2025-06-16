import type { UserData, WorkItemData } from '../types';

export const getFileByName = (
	files: { name: string; content: string }[],
	name: string
) => {
	return files.find((file) => file.name === name)?.content;
};

export const getCardsForStage = (workItems: WorkItemData[], stageId: string) =>
	workItems.filter((item) => item.stageId === stageId);

export const getUserById = (usersData: UserData[], id: string) =>
	usersData.find((u) => u.id === id)?.name ?? '';
