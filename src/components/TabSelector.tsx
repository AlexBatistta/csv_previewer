import type React from 'react';
import type { BoardData, MilestoneData } from '../types';

type TabSelectorProps = {
	boards: BoardData[];
	milestones: MilestoneData[];
	activeTab: number;
	onChange: (index: number) => void;
};

export const TabSelector: React.FC<TabSelectorProps> = ({
	boards,
	milestones,
	activeTab,
	onChange,
}) => {
	return (
		<div className='mb-4 flex justify-around gap-2 border-b border-slate-600'>
			{boards.map((board, index) => {
				const milestoneName =
					milestones.find((m) => m.id === board.milestoneId)?.name ?? '';
				return (
					<button
						key={board.id}
						onClick={() => onChange(index)}
						className={`cursor-pointer rounded-t-md px-4 py-2 ${
							index === activeTab
								? 'bg-slate-700 font-semibold text-white'
								: 'bg-slate-600 text-slate-300 hover:bg-slate-500'
						}`}
					>
						{board.name}{' '}
						<span className='text-xs opacity-70'>({milestoneName})</span>
					</button>
				);
			})}
		</div>
	);
};
