/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.batch.engine.internal;

import com.liferay.batch.engine.csv.ObjectFieldColumnDescriptors;
import com.liferay.osgi.service.tracker.collections.map.ServiceTrackerMap;
import com.liferay.osgi.service.tracker.collections.map.ServiceTrackerMapFactory;
import com.liferay.petra.string.StringPool;

import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;

/**
 * @author Matija Petanjek
 */
@Component(service = ObjectFieldCSVDescriptorRegistry.class)
public class ObjectFieldCSVDescriptorRegistry {

	public ObjectFieldColumnDescriptors getObjectFieldCSVDescriptor(
		long companyId, String taskItemDelegateName) {

		return _serviceTrackerMap.getService(
			companyId + StringPool.POUND + taskItemDelegateName);
	}

	@Activate
	protected void activate(BundleContext bundleContext) {
		_serviceTrackerMap = ServiceTrackerMapFactory.openSingleValueMap(
			bundleContext, ObjectFieldColumnDescriptors.class, null,
			(serviceReference, emitter) -> emitter.emit(
				(Long)serviceReference.getProperty("companyId") +
					StringPool.POUND +
						(String)serviceReference.getProperty(
							"batch.engine.task.item.delegate.name")));
	}

	@Deactivate
	protected void deactivate() {
		_serviceTrackerMap.close();
	}

	private ServiceTrackerMap<String, ObjectFieldColumnDescriptors>
		_serviceTrackerMap;

}