import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { getCardsForStage } from './utils/parsingHelpers';
import {
	useParsedData,
	useProjectData,
	useBoardData,
	useStageData,
	useWorkItemsData,
	useImportanceData,
	useMilestoneData,
	useTagsData,
	useUsersData,
	useWorkItemUsersData,
	useSubtaskData,
} from './hooks/dataHooks';
import { TabSelector } from './components/TabSelector';
import { StageColumn } from './components/StageColumn';
import { FileUploader } from './components/FileUploader';
import { FileDownloader } from './components/FileDownloader';
import { MdFilterAlt } from 'react-icons/md';
import { FiltersPanel } from './components/FiltersPanel';
import { Welcome } from './components/Welcome';

export const App = () => {
	const [jsonFiles, setJsonFiles] = useState<
		{ name: string; content: string }[]
	>([]);
	const [lastUpdated, setLastUpdated] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState(0);
	const [selectedStageIds, setSelectedStageIds] = useState<string[]>([]);
	const [selectedImportance, setSelectedImportance] = useState<string[]>([]);
	const [selectedBoard, setSelectedBoard] = useState<string[]>([]);
	const [showFilters, setShowFilters] = useState(false);

	// Cargar desde localStorage al iniciar
	useEffect(() => {
		const savedFiles = localStorage.getItem('csvJsonFiles');
		const savedTimestamp = localStorage.getItem('csvJsonTimestamp');

		if (savedFiles) {
			setJsonFiles(JSON.parse(savedFiles));
		}
		if (savedTimestamp) {
			setLastUpdated(savedTimestamp);
		}
	}, []);

	// Manejo de archivos nuevos
	const handleFiles = async (files: FileList) => {
		const parsedFiles: { name: string; content: string }[] = [];

		for (const file of Array.from(files)) {
			if (file.type !== 'text/csv') continue;

			const text = await file.text();
			const result = Papa.parse(text, { header: true });
			const json = JSON.stringify(result.data, null, 2);

			parsedFiles.push({
				name: file.name.replace(/\.csv$/, '.json'),
				content: json,
			});
		}

		setJsonFiles(parsedFiles);
		localStorage.setItem('csvJsonFiles', JSON.stringify(parsedFiles));

		const timestamp = new Date().toLocaleString();
		setLastUpdated(timestamp);
		localStorage.setItem('csvJsonTimestamp', timestamp);
	};

	const parsedFiles = useParsedData(jsonFiles);
	const ProjectData = useProjectData(parsedFiles.project);
	const BoardData = useBoardData(parsedFiles.boards, ProjectData.id);
	const StageData = useStageData(parsedFiles.stages, ProjectData.id);
	const WorkItemsData = useWorkItemsData(
		parsedFiles.workitems,
		ProjectData.id,
		BoardData,
		activeTab
	);
	const ImportanceData = useImportanceData(
		parsedFiles.importance,
		ProjectData.id
	);
	const MilestoneData = useMilestoneData(
		parsedFiles.milestones,
		ProjectData.id
	);
	const TagsData = useTagsData(parsedFiles.tags, ProjectData.id);
	const UsersData = useUsersData(parsedFiles.users, ProjectData.id);
	const WorkItemUsersData = useWorkItemUsersData(
		parsedFiles.workitemUsers,
		ProjectData.id
	);
	const SubtasksData = useSubtaskData(parsedFiles.subtasks, ProjectData.id);

	const filteredItems = useMemo(() => {
		return WorkItemsData.filter((item) => {
			const importanceName = ImportanceData.find(
				(i) => i.id === item.importance
			)?.name;

			const stageMatch =
				selectedStageIds.length === 0 ||
				selectedStageIds.includes(item.stageId);
			const importanceMatch =
				selectedImportance.length === 0 ||
				(importanceName && selectedImportance.includes(importanceName));

			return stageMatch && importanceMatch;
		});
	}, [WorkItemsData, ImportanceData, selectedStageIds, selectedImportance]);

	const filteredBoards = useMemo(() => {
		return selectedBoard.length === 0
			? BoardData
			: BoardData.filter((board) => selectedBoard.includes(board.id));
	}, [BoardData, selectedBoard]);

	useEffect(() => {
		if (selectedBoard.length === 0) {
			setActiveTab(0);
		} else if (selectedBoard.length === 1) {
			const index = BoardData.findIndex((b) => b.id === selectedBoard[0]);
			setActiveTab(index >= 0 ? index : 0);
		} else {
			setActiveTab(0);
		}
	}, [selectedBoard, BoardData]);

	return (
		<div className='flex min-h-screen w-full flex-col bg-slate-800 p-4 text-white'>
			{jsonFiles.length < 16 ? (
				<Welcome
					handleFiles={handleFiles}
					fileCount={jsonFiles.length}
					lastUpdated={lastUpdated}
				/>
			) : (
				<>
					<h1 className='relative mb-4 flex items-center justify-center text-2xl font-bold'>
						{ProjectData.name}
						<button onClick={() => setShowFilters(true)}>
							<MdFilterAlt className='absolute top-2 right-0 cursor-pointer text-xl text-slate-200 hover:text-slate-300' />
						</button>
					</h1>

					<FiltersPanel
						stages={StageData}
						importances={ImportanceData}
						boards={BoardData}
						selectedStageIds={selectedStageIds}
						selectedImportance={selectedImportance}
						selectedBoardIds={selectedBoard}
						onStageChange={setSelectedStageIds}
						onImportanceChange={setSelectedImportance}
						onBoardChange={setSelectedBoard}
						isOpen={showFilters}
						onClose={() => setShowFilters(false)}
					/>

					<TabSelector
						boards={filteredBoards}
						milestones={MilestoneData}
						activeTab={activeTab}
						onChange={setActiveTab}
					/>

					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						{StageData.map((stage) => (
							<StageColumn
								key={stage.id}
								stage={stage}
								workItems={getCardsForStage(filteredItems, stage.id)}
								importanceData={ImportanceData}
								tags={TagsData}
								users={UsersData}
								workItemUsers={WorkItemUsersData}
								subtasksData={SubtasksData}
							/>
						))}
					</div>

					<div className='flex flex-col justify-between sm:flex-row'>
						<FileUploader
							handleFiles={handleFiles}
							fileCount={jsonFiles.length}
							lastUpdated={lastUpdated}
						/>
						<FileDownloader
							projectData={ProjectData}
							boards={filteredBoards}
							stages={StageData}
							workItems={filteredItems}
							subtasksData={SubtasksData}
							tagsData={TagsData}
							workItemUsers={WorkItemUsersData}
							usersData={UsersData}
							importanceData={ImportanceData}
						/>
					</div>
				</>
			)}
		</div>
	);
};
