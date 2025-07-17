import type { StageData, ImportanceData, BoardData } from '../types';
import { MdFilterAltOff } from 'react-icons/md';

interface AvailableTag {
	id: string;
	name: string;
}

interface FiltersPanelProps {
	stages: StageData[];
	importances: ImportanceData[];
	boards: BoardData[];
	availableTags: AvailableTag[];
	selectedStageIds: string[];
	selectedImportance: string[];
	selectedBoardIds: string[];
	selectedTags: string[];
	onStageChange: (stageIds: string[]) => void;
	onImportanceChange: (importanceNames: string[]) => void;
	onBoardChange: (boardIds: string[]) => void;
	onTagChange: (tags: string[]) => void;
	onClose: () => void;
	isOpen: boolean;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
	stages,
	importances,
	boards,
	availableTags,
	selectedStageIds,
	selectedImportance,
	selectedBoardIds,
	selectedTags,
	onStageChange,
	onImportanceChange,
	onBoardChange,
	onTagChange,
	onClose,
	isOpen,
}) => {
	if (!isOpen) return null;

	const toggleStage = (id: string) => {
		onStageChange(
			selectedStageIds.includes(id)
				? selectedStageIds.filter((s) => s !== id)
				: [...selectedStageIds, id]
		);
	};

	const toggleImportance = (name: string) => {
		onImportanceChange(
			selectedImportance.includes(name)
				? selectedImportance.filter((n) => n !== name)
				: [...selectedImportance, name]
		);
	};

	const toggleBoard = (id: string) => {
		onBoardChange(
			selectedBoardIds.includes(id)
				? selectedBoardIds.filter((b) => b !== id)
				: [...selectedBoardIds, id]
		);
	};

	const clearFilters = () => {
		onBoardChange([]);
		onStageChange([]);
		onImportanceChange([]);
		onTagChange([]);
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75'>
			<div className='mx-4 mt-4 max-h-screen w-full max-w-6xl scroll-py-6 overflow-y-auto rounded-xl bg-slate-800 p-6 text-white shadow-2xl sm:mx-20'>
				{/* Header */}
				<div className='mb-6 flex items-center justify-between border-b border-slate-600 pb-4'>
					<h2 className='text-2xl font-bold'>Filters</h2>
					<div className='flex gap-3'>
						<button
							onClick={clearFilters}
							title='Clear filters'
							className='text-slate-300 hover:text-white'
						>
							<MdFilterAltOff className='text-2xl' />
						</button>
						<button
							onClick={onClose}
							className='cursor-pointer rounded-md px-3 py-1 text-sm font-semibold text-slate-200 hover:bg-slate-700'
						>
							Close ✕
						</button>
					</div>
				</div>

				{/* Filtros */}
				<div className='flex flex-wrap justify-between gap-6'>
					{/* Boards */}
					<div className='min-w-[200px] flex-1 rounded-lg bg-slate-700 p-4 shadow'>
						<p className='mb-2 text-lg font-semibold'>Boards</p>
						{boards.map((board) => (
							<label key={board.id} className='block text-sm'>
								<input
									type='checkbox'
									checked={selectedBoardIds.includes(board.id)}
									onChange={() => toggleBoard(board.id)}
									className='mr-2 cursor-pointer accent-slate-500'
								/>
								{board.name}
							</label>
						))}
					</div>

					{/* Stages */}
					<div className='min-w-[200px] flex-1 rounded-lg bg-slate-700 p-4 shadow'>
						<p className='mb-2 text-lg font-semibold'>Stages</p>
						{stages.map((stage) => (
							<label key={stage.id} className='block text-sm'>
								<input
									type='checkbox'
									checked={selectedStageIds.includes(stage.id)}
									onChange={() => toggleStage(stage.id)}
									className='mr-2 cursor-pointer accent-slate-500'
								/>
								{stage.name}
							</label>
						))}
					</div>

					{/* Importance */}
					<div className='min-w-[200px] flex-1 rounded-lg bg-slate-700 p-4 shadow'>
						<p className='mb-2 text-lg font-semibold'>Importance</p>
						{importances.map((imp) => (
							<label key={imp.id} className='block text-sm'>
								<input
									type='checkbox'
									checked={selectedImportance.includes(imp.name)}
									onChange={() => toggleImportance(imp.name)}
									className='mr-2 cursor-pointer accent-slate-500'
								/>
								{imp.name}
							</label>
						))}
					</div>

					{/* Tags */}
					<div className='min-w-[200px] flex-1 rounded-lg bg-slate-700 p-4 shadow'>
						<p className='mb-2 text-lg font-semibold'>Tags</p>
						{availableTags.map((tag) => (
							<label key={tag.id} className='block text-sm'>
								<input
									type='checkbox'
									checked={selectedTags.includes(tag.name)}
									onChange={(e) =>
										e.target.checked
											? onTagChange([...selectedTags, tag.name])
											: onTagChange(
													selectedTags.filter(
														(t) => t !== tag.name
													)
												)
									}
									className='mr-2 cursor-pointer accent-slate-500'
								/>
								{tag.name}
							</label>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
