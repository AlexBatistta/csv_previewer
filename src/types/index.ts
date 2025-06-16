export type ProjectData = {
	name: string;
	id: string;
};

export type BoardData = {
	name: string;
	id: string;
	milestoneId: string;
};

export type StageData = {
	name: string;
	id: string;
	status: string;
};

export type ImportanceData = {
	id: string;
	name: string;
};

export type MilestoneData = {
	id: string;
	name: string;
};

export type TagData = {
	workItemId: string;
	name: string;
};

export type UserData = {
	id: string;
	name: string;
};

export type WorkItemUserData = {
	workItemId: string;
	userId: string;
};

export type WorkItemData = {
	id: string;
	title: string;
	description: string;
	importance: string;
	stageId: string;
	boardId: string;
	creatorUser: string;
};
