import { registerBlockType } from '@wordpress/blocks';

// Import JS
import edit from './edit';

import metadata from './block.json';

export const name = 'ptam/featured-posts';

registerBlockType( metadata, {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	icon: (
		<svg
			aria-hidden="true"
			focusable="false"
			data-prefix="fad"
			data-icon="tag"
			className="svg-inline--fa fa-tag fa-w-16"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
		>
			<g className="fa-group">
				<path
					className="fa-secondary"
					fill="#585aa8"
					d="M497.94 225.94L286.06 14.06A48 48 0 0 0 252.12 0H48A48 48 0 0 0 0 48v204.12a48 48 0 0 0 14.06 33.94l211.88 211.88a48 48 0 0 0 67.88 0l204.12-204.12a48 48 0 0 0 0-67.88zM112 160a48 48 0 1 1 48-48 48 48 0 0 1-48 48z"
					opacity="0.7"
				></path>
				<path className="fa-primary" fill="currentColor" d=""></path>
			</g>
		</svg>
	),
	edit,

	// Render via PHP
	save() {
		return null;
	},
} );
