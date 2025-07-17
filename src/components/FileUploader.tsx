import React from 'react';
import { FaTrash } from 'react-icons/fa';

type FileUploaderProps = {
	handleFiles: (files: FileList) => void;
	fileCount: number;
	lastUpdated: string | null;
	clearFiles?: () => void;
	loadDemoData?: () => void;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
	handleFiles,
	fileCount,
	lastUpdated,
	clearFiles,
	loadDemoData,
}) => {
	return (
		<div className='mt-auto flex items-center justify-start gap-4 pt-4'>
			<div className='flex gap-2'>
				<label className='inline-flex cursor-pointer justify-center rounded-xl bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 hover:shadow-xl hover:shadow-slate-900/50 active:scale-95'>
					Browse
					<input
						type='file'
						accept='.csv,.json'
						multiple
						onChange={(e) =>
							e.target.files && handleFiles(e.target.files)
						}
						className='hidden'
					/>
				</label>

				{loadDemoData && (
					<button
						onClick={loadDemoData}
						className='inline-flex cursor-pointer justify-center rounded-xl bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 hover:shadow-xl hover:shadow-slate-900/50 active:scale-95'
					>
						Load Demo Data
					</button>
				)}
			</div>

			{fileCount > 0 && (
				<div className='flex items-center justify-between gap-4'>
					{clearFiles && (
						<button
							onClick={clearFiles}
							className='cursor-pointer text-white hover:text-slate-300'
						>
							<FaTrash />
						</button>
					)}
					<div>
						<p className='text-sm text-slate-300'>
							Uploaded files: {fileCount}
						</p>
						{lastUpdated && (
							<p className='text-sm text-slate-400'>
								Last upload: {lastUpdated}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
