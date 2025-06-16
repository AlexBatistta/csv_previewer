import React from 'react';
import { Card } from './Card';
import type {
	WorkItemData,
	ImportanceData,
	TagData,
	UserData,
	WorkItemUserData,
	StageData,
} from '../types';
import { getUserById } from '../utils/parsingHelpers';

type StageColumnProps = {
	stage: StageData;
	workItems: WorkItemData[];
	importanceData: ImportanceData[];
	tags: TagData[];
	users: UserData[];
	workItemUsers: WorkItemUserData[];
};

export const StageColumn: React.FC<StageColumnProps> = ({
	stage,
	workItems,
	importanceData,
	tags,
	users,
	workItemUsers,
}) => {
	return (
		<div key={stage.id} className='rounded-lg bg-slate-700 p-4 shadow-md'>
			<h3 className='mb-2 text-lg font-semibold'>{stage.name}</h3>
			<div className='space-y-2'>
				{workItems.map((item) => {
					const importance =
						importanceData.find((imp) => imp.id === item.importance)
							?.name || 'Normal';

					const itemTags = tags.find(
						(tag) => tag.workItemId === item.id
					)?.name;
					const assignedUsers = workItemUsers
						.filter((wu) => wu.workItemId === item.id)
						.map(
							(wu) => users.find((u) => u.id === wu.userId)?.name || ''
						);

					return (
						<Card
							key={item.id}
							data={{
								...item,
								importance: importance,
								creatorUser: getUserById(users, item.creatorUser),
							}}
							tag={itemTags}
							assignedUsers={assignedUsers}
							subtasks={[
								{ complete: true, title: 'Titulo' },
								{ complete: false, title: 'Segundo' },
							]}
						/>
					);
				})}
			</div>
		</div>
	);
};
