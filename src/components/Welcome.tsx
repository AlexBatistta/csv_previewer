import { FileUploader } from './FileUploader';

interface WelcomeProps {
	handleFiles: (files: FileList) => void;
	fileCount: number;
	lastUpdated: string | null;
	loadDemoData?: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({
	handleFiles,
	fileCount,
	lastUpdated,
	loadDemoData,
}) => {
	return (
		<div className='flex h-full flex-col items-center justify-start gap-6 px-10 pt-10 text-white'>
			<h1 className='text-center text-4xl font-extrabold tracking-tight text-slate-100 drop-shadow'>
				🚀 Welcome to the{' '}
				<span className='text-cyan-400'>HacknPlan Data Parser</span>
			</h1>

			<div className='max-w-4xl text-center text-lg text-slate-300'>
				<p>
					This web app helps you clean and organize raw data from your
					HacknPlan project boards.
				</p>
				<p className='mt-2'>With just a few clicks, you can:</p>
			</div>

			<ul className='list-disc space-y-2 px-8 text-left text-base text-slate-100 marker:text-cyan-400 sm:px-16'>
				<li>
					📦 Load your full export package from HacknPlan (16 CSV files).
				</li>
				<li>
					🔍 Filter work items by <strong>importance</strong>,{' '}
					<strong>status</strong> and <strong>boards</strong>.
				</li>
				<li>
					🔁 Replace internal IDs with readable names (e.g., board names,
					users, tags).
				</li>
				<li>
					📤 Export a clean, filtered CSV or JSON file for reporting and
					sharing.
				</li>
			</ul>

			<div className='mt-8 w-full max-w-4xl rounded-xl bg-slate-800/80 p-6 shadow-lg ring-1 ring-slate-700'>
				<h2 className='mb-4 text-center text-2xl font-semibold text-slate-100'>
					📁 What files do you need?
				</h2>
				<p className='mb-4 text-center text-slate-300'>
					Upload the complete set of CSV files exported by HacknPlan:
				</p>

				<ul className='grid list-disc grid-cols-1 gap-y-2 px-6 text-left text-slate-200 marker:text-cyan-400 md:grid-cols-2 md:px-12'>
					<li>boards_data.csv</li>
					<li>categories_data.csv</li>
					<li>design_element_types_data.csv</li>
					<li>game_design_model_data.csv</li>
					<li>importance_levels_data.csv</li>
					<li>milestones_data.csv</li>
					<li>project_data.csv</li>
					<li>project_users_data.csv</li>
					<li>stages_data.csv</li>
					<li>subtasks_data.csv</li>
					<li>tags_data.csv</li>
					<li>workitem_data.csv</li>
					<li>workitem_dependencies_data.csv</li>
					<li>workitem_tags_data.csv</li>
					<li>workitem_users_data.csv</li>
					<li>workitem_worklogs_data.csv</li>
				</ul>

				<p className='mt-6 text-center text-sm text-slate-400'>
					⚠️ Make sure to select <strong>all files</strong> when prompted.
					The app will parse and link everything for a clean, readable
					dataset.
				</p>

				<div className='mt-4 flex justify-center'>
					<FileUploader
						handleFiles={handleFiles}
						fileCount={fileCount}
						lastUpdated={lastUpdated}
						loadDemoData={loadDemoData}
					/>
				</div>
			</div>
			<footer>
				<p className='mt-2 text-center text-sm text-slate-500'>
					Developed by{' '}
					<a
						className='cursor-pointer font-bold transition-colors duration-200 hover:underline'
						href='https://github.com/AlexBatistta'
					>
						Alex Batistta
					</a>
				</p>
			</footer>
		</div>
	);
};
