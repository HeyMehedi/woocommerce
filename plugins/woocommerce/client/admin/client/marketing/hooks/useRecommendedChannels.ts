/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { PLUGINS_STORE_NAME } from '@woocommerce/data';
import type { PluginSelectors } from '@woocommerce/data';
import { differenceWith } from 'lodash';

/**
 * Internal dependencies
 */
import { STORE_KEY } from '~/marketing/data-multichannel/constants';
import { RecommendedChannel } from '~/marketing/data-multichannel/types';
import { Selectors } from '~/marketing/data-multichannel/selectors';

type UseRecommendedChannels = {
	loading: boolean;
	data?: Array< RecommendedChannel >;
};

export const useRecommendedChannels = (): UseRecommendedChannels => {
	return useSelect( ( select ) => {
		const { hasFinishedResolution, getRecommendedChannels } = select(
			STORE_KEY
		) as Selectors;
		const { data, error } = getRecommendedChannels();

		const { getActivePlugins } = select(
			PLUGINS_STORE_NAME
		) as PluginSelectors;
		const activePlugins = getActivePlugins();

		/**
		 * Recommended channels that are not in "active" state,
		 * i.e. channels that are not installed or not activated yet.
		 */
		const nonActiveRecommendedChannels =
			data &&
			differenceWith( data, activePlugins, ( a, b ) => {
				return a.product === b;
			} );

		return {
			loading: ! hasFinishedResolution( 'getRecommendedChannels', [] ),
			data: nonActiveRecommendedChannels,
			error,
		};
	}, [] );
};
