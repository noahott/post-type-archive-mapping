import { registerBlockType } from '@wordpress/blocks';

// Import JS
import edit from './edit';

import metadata from './block.json';

export const name = 'ptam/custom-posts';

registerBlockType( metadata, {
	icon: {
		src: (
			<svg
				aria-hidden="true"
				focusable="false"
				data-prefix="fad"
				data-icon="th-list"
				className="svg-inline--fa fa-th-list fa-w-16"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<g className="fa-group">
					<path
						className="fa-secondary"
						fill="#585aa8"
						d="M488 352H205.33a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24H488a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24zm0-320H205.33a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24H488a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24zm0 160H205.33a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24H488a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24z"
						opacity="0.4"
					></path>
					<path
						className="fa-primary"
						fill="#585aa8"
						d="M125.33 192H24a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24h101.33a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24zm0-160H24A24 24 0 0 0 0 56v80a24 24 0 0 0 24 24h101.33a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24zm0 320H24a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24h101.33a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24z"
					></path>
				</g>
			</svg>
		),
	},
	edit,

	// Render via PHP
	save() {
		return null;
	},
} );
