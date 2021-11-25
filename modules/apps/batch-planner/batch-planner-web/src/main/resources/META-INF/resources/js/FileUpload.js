/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayForm, {ClayInput} from '@clayui/form';
import {useModal} from '@clayui/modal';
import React, {useCallback, useState} from 'react';

import FileUploadModal from './FileUploadModal';

function FileUpload({portletNamespace}) {
	const [visible, setVisible] = useState(false);
	const [fileToInspect, setFileToInspect] = useState();
	const {observer, onClose} = useModal({
		onClose: () => setVisible(false),
	});

	const onFileChange = useCallback((event) => {
		setVisible(true);
		setFileToInspect(event.target?.files[0]);
	}, []);

	const inputNameId = `${portletNamespace}-import-file`;

	return (
		<span>
			<ClayForm.Group>
				<label htmlFor={inputNameId}>
					{Liferay.Language.get('csv-file')}
				</label>

				<ClayInput
					id={inputNameId}
					name={inputNameId}
					onChange={onFileChange}
					type="file"
				/>
			</ClayForm.Group>

			{visible && (
				<FileUploadModal
					closeModal={onClose}
					fileToInspect={fileToInspect}
					observer={observer}
				/>
			)}
		</span>
	);
}

export default FileUpload;
