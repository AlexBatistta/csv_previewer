import React from 'react';

type FileUploaderProps = {
	handleFiles: (files: FileList) => void;
	fileCount: number;
	lastUpdated: string | null;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
	handleFiles,
	fileCount,
	lastUpdated,
}) => {
	return (
		<div className='mt-auto flex items-center justify-start gap-4 pt-4'>
			<label className='inline-flex cursor-pointer justify-center rounded-xl bg-slate-400 px-4 py-2 text-black hover:bg-slate-300 hover:shadow-xl hover:shadow-slate-900/50 active:scale-95'>
				Examinar
				<input
					type='file'
					accept='.csv'
					multiple
					onChange={(e) => e.target.files && handleFiles(e.target.files)}
					className='hidden'
				/>
			</label>

			{fileCount > 0 && (
				<div>
					<p className='text-sm text-slate-300'>
						Archivos cargados: {fileCount}
					</p>
					{lastUpdated && (
						<p className='text-sm text-slate-400'>
							Última carga: {lastUpdated}
						</p>
					)}
				</div>
			)}
		</div>
	);
};
