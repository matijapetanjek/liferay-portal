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

import ClayButton from '@clayui/button';
import ClayForm from '@clayui/form';
import ClayModal from '@clayui/modal';
import ClayProgressBar from '@clayui/progress-bar';
import {useIsMounted} from '@liferay/frontend-js-react-web';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

import {parseCSV} from './FileParsers';

const FileUploadModal = ({closeModal, fileToInspect, observer}) => {
	const [percentage, setPercentage] = useState(0);
	const isMounted = useIsMounted();
	const [errorMessage, setErrorMessage] = useState();

	useEffect(() => {
		function uploadFile() {
			const onComplete = (schema) => {
				if (isMounted()) {
					setPercentage(100);
					Liferay.fire('file-schema', {
						schema,
					});
				}
			};

			const onError = () => {
				if (isMounted()) {
					setErrorMessage(Liferay.Language.get('unexpected-error'));
				}
			};

			const onProgress = (event) => {
				if (isMounted()) {
					setPercentage(
						Math.round((event.loaded / event.total) * 100)
					);
				}
			};

			return parseCSV({
				file: fileToInspect,
				onComplete,
				onError,
				onProgress,
			});
		}

		return uploadFile();
	}, [isMounted, fileToInspect]);

	const isLoading = percentage !== 100;

	return (
		<ClayModal observer={observer} size="md">
			<ClayModal.Header>
				{Liferay.Language.get('file-upload')}
			</ClayModal.Header>

			<ClayModal.Body>
				<ClayForm.Group className={errorMessage ? 'has-error' : ''}>
					<div
						className="progress-container"
						data-percentage={percentage}
						data-title={
							isLoading
								? Liferay.Language.get('in-progress')
								: Liferay.Language.get('completed')
						}
					>
						<ClayProgressBar
							value={percentage}
							warn={!!errorMessage}
						/>
					</div>

					{errorMessage && (
						<ClayForm.FeedbackGroup>
							<ClayForm.FeedbackItem>
								<ClayForm.FeedbackIndicator symbol="exclamation-full" />

								{errorMessage}
							</ClayForm.FeedbackItem>
						</ClayForm.FeedbackGroup>
					)}
				</ClayForm.Group>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={closeModal}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						{!errorMessage && (
							<ClayButton
								disabled={isLoading}
								displayType="primary"
								onClick={closeModal}
								type="button"
							>
								{isLoading && (
									<span className="inline-item inline-item-before">
										<span
											aria-hidden="true"
											className="loading-animation"
										></span>
									</span>
								)}

								{Liferay.Language.get('done')}
							</ClayButton>
						)}
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

FileUploadModal.propTypes = {
	closeModal: PropTypes.func.isRequired,
	fileToInspect: PropTypes.object.isRequired,
	observer: PropTypes.object,
};

export default FileUploadModal;
