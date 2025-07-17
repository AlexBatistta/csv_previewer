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
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
			// Aceptar tanto CSV como JSON
			if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
				continue;
			}

			const text = await file.text();
			let json: string;

			// Si es CSV, parsearlo con Papa Parse
			if (file.name.endsWith('.csv')) {
				const result = Papa.parse(text, { header: true });
				json = JSON.stringify(result.data, null, 2);
			} else {
				// Si es JSON, validar que sea JSON válido
				try {
					JSON.parse(text); // Validar JSON
					json = text; // Usar el contenido original
				} catch {
					continue;
				}
			}

			parsedFiles.push({
				name: file.name.replace(/\.(csv|json)$/, '.json'),
				content: json,
			});
		}

		setJsonFiles(parsedFiles);
		localStorage.setItem('csvJsonFiles', JSON.stringify(parsedFiles));

		const timestamp = new Date().toLocaleString();
		setLastUpdated(timestamp);
		localStorage.setItem('csvJsonTimestamp', timestamp);
	};

	// Función para limpiar archivos
	const clearFiles = () => {
		setJsonFiles([]);
		setLastUpdated(null);
		localStorage.removeItem('csvJsonFiles');
		localStorage.removeItem('csvJsonTimestamp');
	};

	// Función para cargar datos demo
	const loadDemoData = async () => {
		try {
			const demoFiles = [
				'project_data.json',
				'boards_data.json',
				'stages_data.json',
				'workitem_data.json',
				'importance_levels_data.json',
				'milestones_data.json',
				'workitem_tags_data.json',
				'project_users_data.json',
				'workitem_users_data.json',
				'subtasks_data.json',
				'tags_data.json',
				'workitem_dependencies_data.json',
				'workitem_worklogs_data.json',
				'categories_data.json',
				'design_element_types_data.json',
				'game_design_model_data.json',
			];

			const parsedFiles: { name: string; content: string }[] = [];

			for (const fileName of demoFiles) {
				try {
					const response = await fetch(`/src/assets/demoData/${fileName}`);
					if (response.ok) {
						const jsonContent = await response.text();

						parsedFiles.push({
							name: fileName,
							content: jsonContent,
						});
					}
				} catch (error) {
					console.warn(`Could not load demo file: ${fileName}`);
				}
			}

			if (parsedFiles.length > 0) {
				setJsonFiles(parsedFiles);
				localStorage.setItem('csvJsonFiles', JSON.stringify(parsedFiles));

				const timestamp = new Date().toLocaleString();
				setLastUpdated(timestamp);
				localStorage.setItem('csvJsonTimestamp', timestamp);
			}
		} catch (error) {
			console.error('Error loading demo data:', error);
		}
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

	// Get available tags from the parsed tags data
	const availableTags = useMemo(() => {
		if (
			!parsedFiles.tagDefinitions ||
			!Array.isArray(parsedFiles.tagDefinitions)
		) {
			return [];
		}

		const uniqueTags = parsedFiles.tagDefinitions
			.filter((tag: any) => tag.ProjectId === ProjectData.id)
			.reduce((acc: any[], tag: any) => {
				if (!acc.find((t) => t.id === tag.TagId)) {
					acc.push({
						id: tag.TagId,
						name: tag.Name,
					});
				}
				return acc;
			}, []);

		return uniqueTags;
	}, [parsedFiles.tagDefinitions, ProjectData.id]);

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

			// Role filtering - check if work item has any of the selected role tags
			const tagMatch =
				selectedTags.length === 0 ||
				TagsData.some(
					(tag) =>
						tag.workItemId === item.id && selectedTags.includes(tag.name)
				);

			return stageMatch && importanceMatch && tagMatch;
		});
	}, [
		WorkItemsData,
		ImportanceData,
		TagsData,
		selectedStageIds,
		selectedImportance,
		selectedTags,
	]);

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
			{jsonFiles.length === 0 ? (
				<Welcome
					handleFiles={handleFiles}
					fileCount={jsonFiles.length}
					lastUpdated={lastUpdated}
					loadDemoData={loadDemoData}
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
						availableTags={availableTags}
						selectedStageIds={selectedStageIds}
						selectedImportance={selectedImportance}
						selectedBoardIds={selectedBoard}
						selectedTags={selectedTags}
						onStageChange={setSelectedStageIds}
						onImportanceChange={setSelectedImportance}
						onBoardChange={setSelectedBoard}
						onTagChange={setSelectedTags}
						isOpen={showFilters}
						onClose={() => setShowFilters(false)}
					/>

					<TabSelector
						boards={filteredBoards}
						milestones={MilestoneData}
						activeTab={activeTab}
						onChange={setActiveTab}
					/>

					<div
						className={`grid gap-4 ${
							StageData.filter((stage) => {
								const hasWorkItems =
									getCardsForStage(filteredItems, stage.id).length > 0;
								const isVisible =
									selectedStageIds.length === 0 ||
									selectedStageIds.includes(stage.id);
								return hasWorkItems && isVisible;
							}).length <= 1
								? 'grid-cols-1'
								: 'grid-cols-1 md:grid-cols-2'
						}`}
					>
						{StageData.map((stage) => {
							// Solo mostrar stages que no estén filtrados Y que tengan work items
							const hasWorkItems =
								getCardsForStage(filteredItems, stage.id).length > 0;
							const isVisible =
								selectedStageIds.length === 0 ||
								selectedStageIds.includes(stage.id);

							if (!hasWorkItems || !isVisible) {
								return null;
							}

							return (
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
							);
						})}
					</div>

					<div className='flex flex-col justify-between sm:flex-row'>
						<FileUploader
							handleFiles={handleFiles}
							fileCount={jsonFiles.length}
							lastUpdated={lastUpdated}
							clearFiles={clearFiles}
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
