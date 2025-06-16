import { useState, useEffect } from 'react';
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
} from './hooks/dataHooks';
import { TabSelector } from './components/TabSelector';
import { StageColumn } from './components/StageColumn';
import { FileUploader } from './components/FileUploader';

export const App = () => {
	const [jsonFiles, setJsonFiles] = useState<
		{ name: string; content: string }[]
	>([]);
	const [lastUpdated, setLastUpdated] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState(0);

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

	return (
		<div className='flex min-h-screen w-full flex-col bg-slate-800 p-4 text-white'>
			<h1 className='mb-4 flex justify-center text-2xl font-bold'>
				{ProjectData.name}
			</h1>

			<TabSelector
				boards={BoardData}
				milestones={MilestoneData}
				activeTab={activeTab}
				onChange={setActiveTab}
			/>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				{StageData.map((stage) => (
					<StageColumn
						key={stage.id}
						stage={stage}
						workItems={getCardsForStage(WorkItemsData, stage.id)}
						importanceData={ImportanceData}
						tags={TagsData}
						users={UsersData}
						workItemUsers={WorkItemUsersData}
					/>
				))}
			</div>

			<FileUploader
				handleFiles={handleFiles}
				fileCount={jsonFiles.length}
				lastUpdated={lastUpdated}
			/>
		</div>
	);
};
