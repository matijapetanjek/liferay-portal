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

import '@testing-library/jest-dom/extend-expect';
import {act, cleanup, fireEvent, render, wait} from '@testing-library/react';
import React from 'react';

import {parseCSV} from '../../../src/main/resources/META-INF/resources/js/FileParsers';
import FileUpload from '../../../src/main/resources/META-INF/resources/js/FileUpload';

jest.mock('../../../src/main/resources/META-INF/resources/js/FileParsers');

const fileContents = `currencyCode,type,name
    USD,site,My Channel 0
    USD,site,My Channel 1
    USD,site,My Channel 2
    USD,site,My Channel 3
    USD,site,My Channel 4
`;
const fileSchema = ['currencyCode', 'type', 'name'];
const file = new Blob([fileContents], {type: 'text/csv'});

describe('FileUpload', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(cleanup);

	it('must read the file on input change', async () => {
		parseCSV.mockImplementationOnce(({onProgress}) =>
			onProgress({loaded: 50, total: 100})
		);

		const {getByRole, getByText} = render(
			<FileUpload portletNamespace="test" />
		);

		act(() => {
			fireEvent.change(getByRole('textbox'), {target: {files: [file]}});
		});

		await wait(() => {
			getByText(Liferay.Language.get('file-upload'));
		});

		expect(parseCSV).toBeCalled();
	});

	it('must loading primary button on reading file', async () => {
		parseCSV.mockImplementationOnce(({onProgress}) =>
			onProgress({loaded: 50, total: 100})
		);

		const {getByRole, getByText} = render(
			<FileUpload portletNamespace="test" />
		);

		act(() => {
			fireEvent.change(getByRole('textbox'), {target: {files: [file]}});
		});

		await wait(() => {
			getByText(Liferay.Language.get('file-upload'));
		});

		expect(getByText(Liferay.Language.get('done'))).toBeDisabled();
	});

	it('must enable button on file process ended', async () => {
		parseCSV.mockImplementationOnce(({onComplete}) => onComplete());

		const {getByRole, getByText} = render(
			<FileUpload portletNamespace="test" />
		);

		act(() => {
			fireEvent.change(getByRole('textbox'), {target: {files: [file]}});
		});

		await wait(() => {
			getByText(Liferay.Language.get('file-upload'));
		});

		expect(getByText(Liferay.Language.get('done'))).not.toBeDisabled();
	});

	it('must fire file-schema event on file process ended', async () => {
		const mockFileShemaListener = jest.fn();
		Liferay.on('file-schema', mockFileShemaListener);
		parseCSV.mockImplementationOnce(({onComplete}) =>
			onComplete(fileSchema)
		);

		const {getByRole, getByText} = render(
			<FileUpload portletNamespace="test" />
		);

		act(() => {
			fireEvent.change(getByRole('textbox'), {target: {files: [file]}});
		});

		await wait(() => {
			getByText(Liferay.Language.get('file-upload'));
		});

		expect(mockFileShemaListener.mock.calls[0][0].schema).toStrictEqual(
			fileSchema
		);
	});
});
