import { registerBlockType } from '@wordpress/blocks';

// Import JS
import edit from './edit';

import metadata from './block.json';

registerBlockType( metadata, {
	icon: (
		<svg
			aria-hidden="true"
			focusable="false"
			data-prefix="fad"
			data-icon="th-large"
			className="svg-inline--fa fa-th-large fa-w-16"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
		>
			<g className="fa-group">
				<path
					className="fa-secondary"
					fill="#585aa8"
					d="M488 272H296a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24V296a24 24 0 0 0-24-24zm-272 0H24a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24V296a24 24 0 0 0-24-24z"
					opacity="0.4"
				></path>
				<path
					className="fa-primary"
					fill="#585aa8"
					d="M488 32H296a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24zm-272 0H24A24 24 0 0 0 0 56v160a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24z"
				></path>
			</g>
		</svg>
	),
	edit,

	// Render via PHP
	save() {
		return null;
	},
} );

