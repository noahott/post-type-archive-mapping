import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { CheckboxControl } from '@wordpress/components';

const TermListControl = ( props ) => {

	const { terms, onChange, hasSelectAll = false } = props;

	const getDefaultValues = () => {
		return {
			terms: terms,
		};
	};

	const { control, setValue, getValues } = useForm( {
		defaultValues: getDefaultValues(),
	} );

	const formValues = useWatch( { control } );

	if ( ! formValues.terms ) {
		return null;
	}

	const isDisabled = ( term_id ) => {
		if ( ! hasSelectAll || 0 === term_id ) {
			return false;
		} else {
			// Check if term ID 0 is selected.
			const termZero = formValues.terms.find( ( term ) => term.id === 0 );
			return termZero.selected;
		}
	}

	return (
		<div className="term-list-control">
			{
				terms.map( ( term, index ) => {
					return (
						<div key={ term.id } className="term-list-control__term">
							<Controller
								name={ `terms[${ index }]` }
								control={ control }
								render={ ( { field: { onChange, value } } ) => (
									<CheckboxControl
										label={ term.name }
										checked={ term.selected }
										onChange={ ( newValue ) => {
											term.selected = newValue;
											setValue( `terms[${ index }]`, term );
											
											// Get selected terms.
											const selectedTerms = getValues().terms.filter( ( term ) => term.selected );
											props.onChange( selectedTerms );
										} }
										disabled={ isDisabled( term.id ) }
									/>
								) }
							/>
						</div>
					);
				} )
			}
		</div>
	)
};
export default TermListControl;