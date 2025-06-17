import type { StageData, ImportanceData, BoardData } from '../types';
import { MdFilterAltOff } from 'react-icons/md';

interface FiltersPanelProps {
	stages: StageData[];
	importances: ImportanceData[];
	boards: BoardData[];
	selectedStageIds: string[];
	selectedImportance: string[];
	selectedBoardIds: string[];
	onStageChange: (stageIds: string[]) => void;
	onImportanceChange: (importanceNames: string[]) => void;
	onBoardChange: (boardIds: string[]) => void;
	onClose: () => void;
	isOpen: boolean;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
	stages,
	importances,
	boards,
	selectedStageIds,
	selectedImportance,
	selectedBoardIds,
	onStageChange,
	onImportanceChange,
	onBoardChange,
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
	};
	return (
		<div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75'>
			<div className='w-full max-w-lg rounded-lg bg-slate-800 p-6 text-white shadow-lg'>
				<div className='mb-4 flex items-center justify-between'>
					<h2 className='text-lg font-bold'>Filters</h2>
					<div className='flex items-center justify-center gap-2'>
						<button onClick={() => clearFilters()}>
							<MdFilterAltOff className='cursor-pointer text-xl text-slate-200 hover:text-slate-300' />
						</button>

						<button
							onClick={onClose}
							className='cursor-pointer text-base font-extrabold text-slate-200 hover:text-slate-300'
						>
							✕
						</button>
					</div>
				</div>

				<div className='flex justify-around'>
					<div className='mb-4'>
						<p className='mb-2 font-semibold'>Board</p>
						{boards.map((board) => (
							<label key={board.id} className='block'>
								<input
									type='checkbox'
									checked={selectedBoardIds.includes(board.id)}
									onChange={() => toggleBoard(board.id)}
									className='mr-2 cursor-pointer'
								/>
								{board.name}
							</label>
						))}
					</div>
					<div className='mb-4'>
						<p className='mb-2 font-semibold'>Stage</p>
						{stages.map((stage) => (
							<label key={stage.id} className='block'>
								<input
									type='checkbox'
									checked={selectedStageIds.includes(stage.id)}
									onChange={() => toggleStage(stage.id)}
									className='mr-2 cursor-pointer'
								/>
								{stage.name}
							</label>
						))}
					</div>

					<div>
						<p className='mb-2 font-semibold'>Importance</p>
						{importances.map((imp) => (
							<label key={imp.id} className='block'>
								<input
									type='checkbox'
									checked={selectedImportance.includes(imp.name)}
									onChange={() => toggleImportance(imp.name)}
									className='mr-2 cursor-pointer'
								/>
								{imp.name}
							</label>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
