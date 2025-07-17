import { FaUser, FaUserTag } from 'react-icons/fa';
import { FaRegSquare, FaRegCheckSquare } from 'react-icons/fa';
import type { WorkItemData } from '../types';

interface Props {
	data: WorkItemData;
	tag?: string;
	assignedUsers?: string[];
	subtasks?: { complete: boolean; title: string }[];
}

const getImportanceClass = (
	importance: string
): { border: string; text: string } => {
	const map: Record<string, { border: string; text: string }> = {
		Urgent: { border: 'border-red-600', text: 'text-red-600' },
		High: { border: 'border-orange-500', text: 'text-orange-500' },
		Normal: { border: 'border-blue-500', text: 'text-blue-500' },
		Low: { border: 'border-green-400', text: 'text-green-400' },
	};
	return map[importance] ?? { border: 'border-gray-300', text: 'text-white' };
};

const formatDescription = (description: string) => {
	return description
		.split('###')
		.map((line, lineIndex) => {
			const trimmedLine = line.trim();
			if (!trimmedLine) return null;

			// Dividir por ** para encontrar texto en negrita
			const parts = trimmedLine.split('**');

			return (
				<p key={lineIndex} className='mb-1'>
					{parts.map((part, partIndex) => {
						// Si el índice es impar, es texto en negrita
						if (partIndex % 2 === 1) {
							return <strong key={partIndex}>{part}</strong>;
						}
						return part;
					})}
				</p>
			);
		})
		.filter(Boolean);
};

export const Card: React.FC<Props> = ({
	data,
	tag,
	assignedUsers,
	subtasks,
}) => {
	return (
		<div
			key={data.id}
			className={`rounded border-t-4 ${getImportanceClass(data.importance).border} flex flex-col gap-2 bg-slate-600 p-4 text-sm`}
		>
			<div className='flex justify-between gap-2'>
				<h2 className='text-base font-semibold'>{`${data.id} - ${data.title}`}</h2>
				<p
					className={`text-xs ${getImportanceClass(data.importance).text}`}
				>
					{data.importance}
				</p>
			</div>
			<div className='indent-8 wrap-break-word'>
				{formatDescription(data.description)}
			</div>
			<div className='my-2 flex items-end justify-between'>
				<div className='flex flex-col gap-1'>
					<p className='flex items-center justify-start gap-1 text-xs text-slate-300'>
						<FaUser className='text-[14px]' /> {data.creatorUser}
					</p>
					{assignedUsers && assignedUsers.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{assignedUsers.map((u, index) => (
								<p
									key={index}
									className='mr-1 flex items-center justify-start gap-1 text-xs whitespace-nowrap text-slate-300'
								>
									<FaUserTag className='text-base' /> {u}
								</p>
							))}
						</div>
					)}
				</div>
				{tag && (
					<div className='inline-flex w-fit rounded-md bg-slate-500 px-2 py-1 text-xs text-slate-300'>
						<p>{tag}</p>
					</div>
				)}
			</div>
			{subtasks &&
				subtasks.length > 0 &&
				subtasks.map((task, index) => (
					<div
						key={index}
						className='flex items-center justify-start gap-2'
					>
						{task.complete ? <FaRegCheckSquare /> : <FaRegSquare />}
						<p>{task.title}</p>
					</div>
				))}
		</div>
	);
};
