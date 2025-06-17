import React from 'react';
import type {
	BoardData,
	ImportanceData,
	ProjectData,
	StageData,
	SubtaskData,
	TagData,
	UserData,
	WorkItemData,
	WorkItemUserData,
} from '../types';
import { getUserById } from '../utils/parsingHelpers';

type FileDownloaderProps = {
	projectData: ProjectData;
	boards: BoardData[];
	stages: StageData[];
	workItems: WorkItemData[];
	subtasksData: SubtaskData[];
	tagsData: TagData[];
	workItemUsers: WorkItemUserData[];
	usersData: UserData[];
	importanceData: ImportanceData[];
};

export const FileDownloader: React.FC<FileDownloaderProps> = ({
	projectData,
	boards,
	stages,
	workItems,
	subtasksData,
	tagsData,
	workItemUsers,
	usersData,
	importanceData,
}) => {
	// Arma la estructura que usás para JSON y CSV
	const getStructuredBoards = () => {
		return boards.map((board) => {
			return {
				board: board.name,
				stages: stages.map((stage) => {
					const itemsForStage = workItems.filter(
						(item) => item.stageId === stage.id
					);

					return {
						stage: stage.name,
						items: itemsForStage.map((item) => {
							const tags = tagsData
								.filter((t) => t.workItemId === item.id)
								.map((t) => t.name);

							const subtasks = subtasksData
								.filter((s) => s.workItemId === item.id)
								.map((s) => ({
									title: s.title,
									complete: s.isCompleted ? 'True' : 'False',
								}));

							const users = workItemUsers
								.filter((w) => w.workItemId === item.id)
								.map(
									(w) => usersData.find((u) => u.id === w.userId)?.name
								)
								.filter(Boolean) as string[];

							const importanceName =
								importanceData.find((i) => i.id === item.importance)
									?.name ?? 'Unknown';

							return {
								title: `${item.id} - ${item.title}`,
								description: item.description,
								importance: importanceName,
								tags,
								subtasks,
								users,
								creatorUser: getUserById(usersData, item.creatorUser),
							};
						}),
					};
				}),
			};
		});
	};

	// Convierte la estructura a CSV string
	const structuredBoardsToCSV = (
		structuredBoards: ReturnType<typeof getStructuredBoards>
	) => {
		const csvRows: string[] = [];
		const headers = [
			'Board',
			'Stage',
			'Title',
			'Description',
			'Importance',
			'CreatorUser',
			'Tags',
			'Subtasks',
			'Users',
		];
		csvRows.push(headers.join(','));

		for (const boardObj of structuredBoards) {
			const boardName = boardObj.board;

			for (const stageObj of boardObj.stages) {
				const stageName = stageObj.stage;

				for (const item of stageObj.items) {
					const tags = item.tags.length ? item.tags.join(';') : '';
					const users = item.users.length ? item.users.join(';') : '';
					const subtasks = item.subtasks.length
						? item.subtasks
								.map((st) => `${st.title} (${st.complete})`)
								.join('; ')
						: '';

					const row = [
						boardName,
						stageName,
						item.title,
						item.description.replace(/\n/g, ' '),
						item.importance,
						item.creatorUser,
						tags,
						subtasks,
						users,
					].map((field) => {
						if (
							typeof field === 'string' &&
							(field.includes(',') ||
								field.includes('"') ||
								field.includes('\n'))
						) {
							return `"${field.replace(/"/g, '""')}"`;
						}
						return field;
					});

					csvRows.push(row.join(','));
				}
			}
		}
		return csvRows.join('\n');
	};

	// Descarga JSON
	const handleDownloadJSON = () => {
		const structuredBoards = getStructuredBoards();
		const finalData = { [projectData.name]: structuredBoards };

		const jsonString = JSON.stringify(finalData, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `${projectData.name}.json`;
		a.click();

		setTimeout(() => URL.revokeObjectURL(url), 100);
	};

	// Descarga CSV
	const handleDownloadCSV = () => {
		const structuredBoards = getStructuredBoards();
		const csvString = structuredBoardsToCSV(structuredBoards);

		const csvBlob = new Blob([csvString], { type: 'text/csv' });
		const csvUrl = URL.createObjectURL(csvBlob);

		const a = document.createElement('a');
		a.href = csvUrl;
		a.download = `${projectData.name}.csv`;
		a.click();

		setTimeout(() => URL.revokeObjectURL(csvUrl), 100);
	};

	return (
		<div className='mt-auto flex items-center justify-start gap-4 pt-4'>
			<button
				onClick={handleDownloadJSON}
				className='inline-flex cursor-pointer justify-center rounded-xl bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 hover:shadow-xl hover:shadow-slate-900/50 active:scale-95'
			>
				Download JSON
			</button>
			<button
				onClick={handleDownloadCSV}
				className='inline-flex cursor-pointer justify-center rounded-xl bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 hover:shadow-xl hover:shadow-slate-900/50 active:scale-95'
			>
				Download CSV
			</button>
		</div>
	);
};
