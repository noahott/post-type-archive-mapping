/**
 * External dependencies
 */
import classnames from "classnames";
import axios from "axios";
import Loading from "../components/Loading";
import hexToRgba from "hex-to-rgba";
import TermListControl from "../components/TermListControl";
var HtmlToReactParser = require("html-to-react").Parser;

const { Component, Fragment } = wp.element;

const { __, _n } = wp.i18n;

const { decodeEntities } = wp.htmlEntities;

const {
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
} = wp.components;

const {
	__experimentalGradientPickerControl,
	MediaUpload,
	InspectorControls,
	PanelColorSettings,
} = wp.blockEditor;

const MAX_POSTS_COLUMNS = 6;

class PTAM_Term_Grid extends Component {
	constructor() {
		super(...arguments);

		this.state = {
			loading: true,
			termLoading: false,
			fonts: [],
			taxonomy: "category",
			termsToDisplay: {},
			termsToExclude: {},
			terms: [],
			termsExclude: [],
			imageSizes: ptam_globals.image_sizes,
		};

		//this.get_latest_data();
	}

	getTerms = (object = {}) => {
		let termsList = [];
		let termsListExclude = [];
		let { taxonomy, terms, termsExclude } = this.props.attributes;
		this.setState({
			loading: true,
		});
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_tax_terms`, {
				taxonomy: taxonomy,
			})
			.then((response) => {
				if (Object.keys(response.data).length > 0) {
					termsList.push({
						id: 0,
						name: __("All", "post-type-archive-mapping"),
						selected: terms.length === 0 || terms[0].id === 0,
					});
					// Build a list of terms.
					const excludeTermIds = [];
					termsExclude.forEach(function (termObject) {
						excludeTermIds.push(termObject.id);
					});
					const includeTermIds = [];
					terms.forEach(function (termObject) {
						includeTermIds.push(termObject.id);
					});
					jQuery.each(response.data, function (key, value) {
						// See if term_id matches exclude list.
						termsListExclude.push({ id: value.term_id, name: value.name, selected: excludeTermIds.includes( value.term_id ) });
						termsList.push({ id: value.term_id, name: value.name, selected: includeTermIds.includes( value.term_id )});
					});
				}
				this.setState({
					loading: false,
					terms: termsList,
					termsExclude: termsListExclude,
				});
				this.displayTerms({ value: termsList });
			});
	};
	displayTerms = () => {
		const {
			order,
			orderBy,
			taxonomy,
			termsExclude,
			terms,
			backgroundImageSource,
			backgroundImageFallback,
			backgroundImageMeta,
			imageSize,
		} = this.props.attributes;
		let termsToRetrieve = [];
		let termsToExclude = [];
		terms.forEach(function (termObject) {
			termsToRetrieve.push(termObject.id);
		});
		termsExclude.forEach(function (termObject) {
			termsToExclude.push(termObject.id);
		});
		this.setState({
			termLoading: true,
		});
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_tax_term_data`, {
				terms: termsToRetrieve,
				termsExclude: termsToExclude,
				order: order,
				orderBy: orderBy,
				taxonomy: taxonomy,
				backgroundImageSource: backgroundImageSource,
				backgroundImageFallback: backgroundImageFallback,
				backgroundImageMeta: backgroundImageMeta,
			})
			.then((response) => {
				if (Object.keys(response.data).length > 0) {
					this.setState({
						termsToDisplay: response.data.term_data,
					});
				}
				this.setState({
					termLoading: false,
				});
			});
	};

	getTermHtml = () => {
		const terms = this.state.termsToDisplay;
		const htmlToReactParser = new HtmlToReactParser();
		const {
			linkContainer,
			showTermTitle,
			showTermDescription,
			disableStyles,
			backgroundType,
			termTitleColor,
			termDescriptionColor,
			itemBorder,
			itemBorderColor,
			itemBorderRadius,
			termTitleFont,
			termDescriptionFont,
			showButton,
			termButtonText,
			termButtonFont,
			termButtonTextColor,
			termButtonTextHoverColor,
			termButtonBackgroundColor,
			termButtonBackgroundHoverColor,
			termButtonBorder,
			termButtonBorderColor,
			termButtonBorderRadius,
		} = this.props.attributes;
		if (Object.keys(terms).length === 0) {
			return (
				<h2>{__("No terms could be found.", "post-type-archive-mapping")}</h2>
			);
		}
		const termTitleStyles = !disableStyles
			? {
					color: termTitleColor,
					fontFamily: `${termTitleFont}`,
			  }
			: {};
		const termDescriptionStyles = !disableStyles
			? {
					color: termDescriptionColor,
					fontFamily: `${termDescriptionFont}`,
			  }
			: {};

		const termButtonStyles = !disableStyles
			? {
					color: termButtonTextColor,
					backgroundColor: termButtonBackgroundColor,
					borderWidth: termButtonBorder + "px",
					borderColor: termButtonBorderColor,
					borderRadius: termButtonBorderRadius,
					fontFamily: `${termButtonFont}`,
					borderStyle: "solid",
			  }
			: {};
		return Object.keys(terms).map((i) => (
			<Fragment key={i}>
				<div
					className="ptam-term-grid-item"
					style={
						"image" === backgroundType && !disableStyles
							? {
									backgroundImage: `url(${terms[i].background_image})`,
									borderWidth: `${itemBorder}px`,
									borderColor: `${itemBorderColor}`,
									borderRadius: `${itemBorderRadius}%`,
									borderStyle: "solid",
							  }
							: !disableStyles
							? {
									borderWidth: `${itemBorder}px`,
									borderColor: `${itemBorderColor}`,
									borderRadius: `${itemBorderRadius}%`,
									borderStyle: "solid",
							  }
							: {}
					}
				>
					<div className="ptam-term-grid-item-content">
						{showTermTitle && (
							<h2 style={termTitleStyles}>
								{i in terms
									? terms[i].name
									: __("Unknown Title", "post-type-archive-mapping")}
							</h2>
						)}
						{showTermDescription && (
							<div
								className="ptam-term-grid-item-description"
								style={termDescriptionStyles}
							>
								{i in terms
									? htmlToReactParser.parse(terms[i].description)
									: ""}
							</div>
						)}
						{!linkContainer && showButton && (
							<a
								href="#"
								className="ptam-term-grid-button btn button"
								style={termButtonStyles}
							>
								{termButtonText}
							</a>
						)}
					</div>
				</div>
			</Fragment>
		));
	};

	componentDidMount = () => {
		this.getTerms(this.state);
	};

	render() {
		if (this.props.attributes.preview) {
			return (
				<Fragment>
					<img src={ptam_globals.term_grid_block_preview} />
				</Fragment>
			);
		}

		let htmlToReactParser = new HtmlToReactParser();
		const { attributes, setAttributes } = this.props;
		const {
			terms,
			termsExclude,
			taxonomy,
			align,
			order,
			orderBy,
			columns,
			showTermTitle,
			showTermDescription,
			disableStyles,
			linkContainer,
			linkTermTitle,
			showButton,
			backgroundImageSource,
			backgroundImageMeta,
			backgroundImageFallback,
			imageSize,
			containerId,
			backgroundType,
			backgroundColor,
			backgroundColorHover,
			backgroundGradient,
			backgroundGradientHover,
			overlayColor,
			overlayColorHover,
			overlayOpacity,
			overlayOpacityHover,
			termTitleColor,
			termTitleColorHover,
			termDescriptionColor,
			termDescriptionColorHover,
			itemBorder,
			itemBorderColor,
			itemBorderRadius,
			termTitleFont,
			termDescriptionFont,
			termButtonText,
			termButtonFont,
			termButtonTextColor,
			termButtonTextHoverColor,
			termButtonBackgroundColor,
			termButtonBackgroundHoverColor,
			termButtonBorder,
			termButtonBorderColor,
			termButtonBorderRadius,
		} = attributes;

		// Fonts
		let fontOptions = [];
		for (var key in ptam_globals.fonts) {
			fontOptions.push({ value: key, label: ptam_globals.fonts[key] });
		}

		// Taxonomies.
		let taxOptions = [];
		for (var key in ptam_globals.taxonomies) {
			taxOptions.push({ value: key, label: ptam_globals.taxonomies[key] });
		}

		// Image Sizes.
		let imageSizeOptions = [];
		let imageSizes = this.state.imageSizes;
		for (var key in imageSizes) {
			imageSizeOptions.push({ value: key, label: key });
		}

		// Order Params.
		const orderOptions = [
			{ value: "ASC", label: __("ASC", "post-type-archive-mapping") },
			{ value: "DESC", label: __("DESC", "post-type-archive-mapping") },
		];

		const orderByOptions = [
			{ value: "name", label: __("Term Name", "post-type-archive-mapping") },
			{ value: "slug", label: __("Term Slug", "post-type-archive-mapping") },
			{ value: "order", label: __("Term Order", "post-type-archive-mapping") },
		];

		const backgroundImage = [
			{
				value: "acf",
				label: __("Advanced Custom Fields", "post-type-archive-mapping"),
			},
			{ value: "pods", label: __("Pods", "post-type-archive-mapping") },
			{ value: "meta", label: __("Term Meta", "post-type-archive-mapping") },
		];

		const backgroundTypeOptions = [
			{ value: "none", label: __("None", "post-type-archive-mapping") },
			{
				value: "color",
				label: __("Background Color", "post-type-archive-mapping"),
			},
			{
				value: "gradient",
				label: __("Background Gradient", "post-type-archive-mapping"),
			},
			{
				value: "image",
				label: __("Background Image", "post-type-archive-mapping"),
			},
		];

		// Term select messages.
		const termMessages = {
			clear: __("Clear all terms", "post-type-archive-mapping"),
			list: __("Terms", "post-type-archive-mapping"),
			noItems: __("There are no terms to select.", "post-type-archive-mapping"),
			search: __("Search for terms to display", "post-type-archive-mapping"),
			selected: (n) =>
				sprintf(
					_n(
						"%d term selected",
						"%d terms selected",
						n,
						"post-type-archive-mapping"
					),
					n
				),
			updated: __("Term search results updated.", "post-type-archive-mapping"),
			noResults: __("There were no terms found.", "post-type-archive-mapping"),
		};
		// Term select messages.
		const termMessagesExclude = {
			clear: __("Clear all terms", "post-type-archive-mapping"),
			list: __("Terms", "post-type-archive-mapping"),
			noItems: __("There are no terms to select.", "post-type-archive-mapping"),
			search: __("Search for terms to exclude", "post-type-archive-mapping"),
			selected: (n) =>
				sprintf(
					_n(
						"%d term selected",
						"%d terms selected",
						n,
						"post-type-archive-mapping"
					),
					n
				),
			updated: __("Term search results updated.", "post-type-archive-mapping"),
			noResults: __("There were no terms found.", "post-type-archive-mapping"),
		};

		// Whether to show term exclusion or not.
		let showTermExclude = false;
		const stateTerms = this.state.terms;
		if (Array.isArray(stateTerms)) {
			stateTerms.forEach(function (termObject) {
				if (0 === termObject.id && termObject.selected === true) {
					showTermExclude = true;
					return;
				}
			});
		}

		// Get background color with opacity.
		const overlayColorRGBA = overlayColor
			? hexToRgba(overlayColor, overlayOpacity)
			: "";
		const overlayColorHoverRGBA = overlayColorHover
			? hexToRgba(overlayColorHover, overlayOpacityHover)
			: "";

		const inspectorControls = (
			<InspectorControls>
				<PanelBody
					initialOpen={false}
					title={__("Query", "post-type-archive-mapping")}
				>
					<SelectControl
						label={__("Taxonomies", "post-type-archive-mapping")}
						options={taxOptions}
						value={taxonomy}
						onChange={(value) => {
							this.props.setAttributes({
								taxonomy: value,
								terms: [],
								termsExclude: [],
							});
							this.props.attributes.taxonomy = value;
							this.getTerms({ taxonomy: value });
						}}
					/>
					<SelectControl
						label={__("Order", "post-type-archive-mapping")}
						options={orderOptions}
						value={order}
						onChange={(value) => {
							this.props.setAttributes({ order: value });
							this.props.attributes.order = value;
							this.displayTerms();
						}}
					/>
					<SelectControl
						label={__("Order By", "post-type-archive-mapping")}
						options={orderByOptions}
						value={orderBy}
						onChange={(value) => {
							this.props.setAttributes({ orderBy: value });
							this.props.attributes.orderBy = value;
							this.displayTerms();
						}}
					/>
					{
						this.state.terms.length > 0 && (
							<>
								<h2>{__("Terms to Include", "post-type-archive-mapping")}</h2>
								<TermListControl
									className="ptam-term-select"
									terms={this.state.terms}
									onChange={(newTerms) => {
										this.props.setAttributes({ terms: newTerms });
										this.props.attributes.terms = newTerms;
										this.displayTerms();
									}}
									hasSelectAll={ true }
								/>
							</>
						)
					}
					

					{showTermExclude && (
						<Fragment>
							<h2>{__("Terms to Exclude", "post-type-archive-mapping")}</h2>
							<TermListControl
								className="ptam-term-exclude"
								terms={this.state.termsExclude}
								onChange={(newTerms) => {
									this.props.setAttributes({ termsExclude: newTerms });
									this.props.attributes.termsExclude = newTerms;
									this.displayTerms();
								}}
								messages={termMessagesExclude}
							/>
						</Fragment>
					)}
				</PanelBody>
				<PanelBody
					initialOpen={true}
					title={__("Display", "post-type-archive-mapping")}
				>
					<RangeControl
						label={__("Columns", "post-type-archive-mapping")}
						value={columns}
						onChange={(value) => this.props.setAttributes({ columns: value })}
						min={1}
						max={4}
					/>
					<ToggleControl
						label={__("Show Term Title", "post-type-archive-mapping")}
						checked={showTermTitle}
						onChange={(value) => {
							this.props.setAttributes({
								showTermTitle: value,
							});
						}}
					/>
					<ToggleControl
						label={__("Show Term Description", "post-type-archive-mapping")}
						checked={showTermDescription}
						onChange={(value) => {
							this.props.setAttributes({
								showTermDescription: value,
							});
						}}
					/>
					<SelectControl
						label={__("Background Type", "post-type-archive-mapping")}
						options={backgroundTypeOptions}
						value={backgroundType}
						onChange={(value) => {
							this.props.setAttributes({
								backgroundType: value,
							});
						}}
					/>
					{"color" === backgroundType && (
						<PanelColorSettings
							title={__("Background Color", "post-type-archive-mapping")}
							initialOpen={true}
							colorSettings={[
								{
									value: backgroundColor,
									onChange: (value) => {
										setAttributes({ backgroundColor: value });
									},
									label: __("Background Color", "post-type-archive-mapping"),
								},
								{
									value: backgroundColorHover,
									onChange: (value) => {
										setAttributes({ backgroundColorHover: value });
									},
									label: __(
										"Background Color on Hover",
										"post-type-archive-mapping"
									),
								},
							]}
						></PanelColorSettings>
					)}
					{"gradient" === backgroundType &&
						__experimentalGradientPickerControl && (
							<Fragment>
								<__experimentalGradientPickerControl
									label={__("Choose a Background Gradient", "wp-presenter-pro")}
									value={backgroundGradient}
									onChange={(value) => {
										setAttributes({ backgroundGradient: value });
									}}
								/>
								<__experimentalGradientPickerControl
									label={__(
										"Choose a Background Gradient on Hover",
										"wp-presenter-pro"
									)}
									value={backgroundGradientHover}
									onChange={(value) => {
										setAttributes({ backgroundGradientHover: value });
									}}
								/>
							</Fragment>
						)}

					<ToggleControl
						label={__("Disable Styles", "post-type-archive-mapping")}
						checked={disableStyles}
						onChange={(value) => {
							this.props.setAttributes({
								disableStyles: value,
							});
						}}
					/>
					<ToggleControl
						label={__(
							"Link Entire Container to Term",
							"post-type-archive-mapping"
						)}
						checked={linkContainer}
						onChange={(value) => {
							this.props.setAttributes({
								linkContainer: value,
							});
						}}
					/>
					{!linkContainer && (
						<Fragment>
							<ToggleControl
								label={__("Link Term Title", "post-type-archive-mapping")}
								checked={linkTermTitle}
								onChange={(value) => {
									this.props.setAttributes({
										linkTermTitle: value,
									});
								}}
							/>
							<ToggleControl
								label={__("Show Button", "post-type-archive-mapping")}
								checked={showButton}
								onChange={(value) => {
									this.props.setAttributes({
										showButton: value,
									});
								}}
							/>
						</Fragment>
					)}
					<TextControl
						label={__("Container ID", "post-type-archive-mapping")}
						help={__(
							"Unique CSS ID for styling if you have more than one term grid on the same page.",
							"post-type-archive-mapping"
						)}
						type="text"
						value={containerId}
						onChange={(value) =>
							this.props.setAttributes({ containerId: value })
						}
					/>
				</PanelBody>
				{"image" === backgroundType && (
					<Fragment>
						<PanelBody
							initialOpen={false}
							title={__("Background Image", "post-type-archive-mapping")}
						>
							<SelectControl
								label={__(
									"Background Image Source",
									"post-type-archive-mapping"
								)}
								options={backgroundImage}
								value={backgroundImageSource}
								onChange={(value) => {
									this.props.setAttributes({ backgroundImageSource: value });
								}}
							/>
							{"none" !== backgroundImageSource && (
								<Fragment>
									<SelectControl
										label={__("Image Size", "post-type-archive-mapping")}
										options={imageSizeOptions}
										value={imageSize}
										onChange={(value) => {
											this.props.setAttributes({ imageSize: value });
										}}
									/>
									<TextControl
										label={__("Field Name", "post-type-archive-mapping")}
										type="text"
										value={backgroundImageMeta}
										onChange={(value) =>
											this.props.setAttributes({ backgroundImageMeta: value })
										}
									/>
									<MediaUpload
										onSelect={(imageObject) => {
											this.props.setAttributes({
												backgroundImageFallback: imageObject,
											});
											this.props.attributes.backgroundImageFallback = imageObject;
										}}
										type="image"
										value={backgroundImageFallback.url}
										render={({ open }) => (
											<Fragment>
												<button
													className="ptam-media-alt-upload components-button is-button is-secondary"
													onClick={open}
												>
													{__(
														"Fallback Background Image",
														"post-type-archive-mapping"
													)}
												</button>
												{backgroundImageFallback && (
													<Fragment>
														<div>
															<img
																src={backgroundImageFallback.url}
																alt={__(
																	"Background Image",
																	"post-type-archive-mapping"
																)}
																width="250"
																height="250"
															/>
														</div>
														<div>
															<button
																className="ptam-media-alt-reset components-button is-button is-secondary"
																onClick={(event) => {
																	this.props.setAttributes({
																		backgroundImageFallback: "",
																	});
																	this.props.attributes.backgroundImageFallback =
																		"";
																}}
															>
																{__("Clear Image", "post-type-archive-mapping")}
															</button>
														</div>
													</Fragment>
												)}
											</Fragment>
										)}
									/>
									<div>
										<Button
											isSecondary={true}
											onClick={(event) => {
												this.displayTerms();
											}}
											className="ptam-apply"
										>
											{__("Apply", "post-type-archive-mapping")}
										</Button>
									</div>
									<PanelColorSettings
										title={__("Overlay Color", "post-type-archive-mapping")}
										initialOpen={true}
										colorSettings={[
											{
												value: overlayColor,
												onChange: (value) => {
													setAttributes({ overlayColor: value });
												},
												label: __("Overlay Color", "post-type-archive-mapping"),
											},
											{
												value: overlayColorHover,
												onChange: (value) => {
													setAttributes({ overlayColorHover: value });
												},
												label: __(
													"Overlay Color on Hover",
													"post-type-archive-mapping"
												),
											},
										]}
									></PanelColorSettings>
									<RangeControl
										label={__("Opacity", "post-type-archive-mapping")}
										value={overlayOpacity}
										onChange={(value) =>
											setAttributes({ overlayOpacity: value })
										}
										min={0}
										max={1}
										step={0.01}
									/>
									<RangeControl
										label={__("Opacity on Hover", "post-type-archive-mapping")}
										value={overlayOpacityHover}
										onChange={(value) =>
											setAttributes({ overlayOpacityHover: value })
										}
										min={0}
										max={1}
										step={0.01}
									/>
								</Fragment>
							)}
						</PanelBody>
					</Fragment>
				)}
				<Fragment>
					<PanelBody
						initialOpen={false}
						title={__("General Colors", "post-type-archive-mapping")}
					>
						<PanelColorSettings
							title={__("Text Colors", "post-type-archive-mapping")}
							initialOpen={true}
							colorSettings={[
								{
									value: termTitleColor,
									onChange: (value) => {
										setAttributes({ termTitleColor: value });
									},
									label: __("Term Title Color", "post-type-archive-mapping"),
								},
								{
									value: termTitleColorHover,
									onChange: (value) => {
										setAttributes({ termTitleColorHover: value });
									},
									label: __(
										"Term Title Color on Hover",
										"post-type-archive-mapping"
									),
								},
								{
									value: termDescriptionColor,
									onChange: (value) => {
										setAttributes({ termDescriptionColor: value });
									},
									label: __(
										"Term Description Color",
										"post-type-archive-mapping"
									),
								},
								{
									value: termDescriptionColorHover,
									onChange: (value) => {
										setAttributes({ termDescriptionColorHover: value });
									},
									label: __(
										"Term Description Color on Hover",
										"post-type-archive-mapping"
									),
								},
							]}
						></PanelColorSettings>
					</PanelBody>
				</Fragment>
				<Fragment>
					<PanelBody
						initialOpen={false}
						title={__("Border", "post-type-archive-mapping")}
					>
						<RangeControl
							label={__("Border Width", "post-type-archive-mapping")}
							value={itemBorder}
							onChange={(value) => setAttributes({ itemBorder: value })}
							min={0}
							max={50}
							step={1}
						/>
						<RangeControl
							label={__("Border Radius", "post-type-archive-mapping")}
							help={__(
								"Border radius as a percentage",
								"post-type-archive-mapping"
							)}
							value={itemBorderRadius}
							onChange={(value) => setAttributes({ itemBorderRadius: value })}
							min={0}
							max={100}
							step={1}
						/>
						<PanelColorSettings
							title={__("Border Color", "post-type-archive-mapping")}
							initialOpen={true}
							colorSettings={[
								{
									value: itemBorderColor,
									onChange: (value) => {
										setAttributes({ itemBorderColor: value });
									},
									label: __("Border Color", "post-type-archive-mapping"),
								},
							]}
						></PanelColorSettings>
					</PanelBody>
				</Fragment>
				<Fragment>
					<PanelBody
						initialOpen={false}
						title={__("Typography", "post-type-archive-mapping")}
					>
						<SelectControl
							label={__("Title Typography", "post-type-archive-mapping")}
							options={fontOptions}
							value={termTitleFont}
							onChange={(value) => {
								this.props.setAttributes({ termTitleFont: value });
							}}
						/>
						<SelectControl
							label={__("Description Typography", "post-type-archive-mapping")}
							options={fontOptions}
							value={termDescriptionFont}
							onChange={(value) => {
								this.props.setAttributes({ termDescriptionFont: value });
							}}
						/>
					</PanelBody>
				</Fragment>
				{!linkContainer && showButton && (
					<Fragment>
						<PanelBody
							initialOpen={false}
							title={__("Button", "post-type-archive-mapping")}
						>
							<TextControl
								label={__("Button Text", "post-type-archive-mapping")}
								type="text"
								value={termButtonText}
								onChange={(value) =>
									this.props.setAttributes({ termButtonText: value })
								}
							/>
							<SelectControl
								label={__("Button Typography", "post-type-archive-mapping")}
								options={fontOptions}
								value={termButtonFont}
								onChange={(value) => {
									this.props.setAttributes({ termButtonFont: value });
								}}
							/>
							<PanelColorSettings
								title={__("Button Colors", "post-type-archive-mapping")}
								initialOpen={true}
								colorSettings={[
									{
										value: termButtonTextColor,
										onChange: (value) => {
											setAttributes({ termButtonTextColor: value });
										},
										label: __("Text Color", "post-type-archive-mapping"),
									},
									{
										value: termButtonTextHoverColor,
										onChange: (value) => {
											setAttributes({ termButtonTextHoverColor: value });
										},
										label: __(
											"Text Color on Hover",
											"post-type-archive-mapping"
										),
									},
									{
										value: termButtonBackgroundColor,
										onChange: (value) => {
											setAttributes({ termButtonBackgroundColor: value });
										},
										label: __("Background Color", "post-type-archive-mapping"),
									},
									{
										value: termButtonBackgroundHoverColor,
										onChange: (value) => {
											setAttributes({ termButtonBackgroundHoverColor: value });
										},
										label: __(
											"Background Color on Hover",
											"post-type-archive-mapping"
										),
									},
									{
										value: termButtonBorderColor,
										onChange: (value) => {
											setAttributes({ termButtonBorderColor: value });
										},
										label: __("Border Color", "post-type-archive-mapping"),
									},
								]}
							></PanelColorSettings>
							<RangeControl
								label={__("Border Width", "post-type-archive-mapping")}
								value={termButtonBorder}
								onChange={(value) => setAttributes({ termButtonBorder: value })}
								min={0}
								max={50}
								step={1}
							/>
							<RangeControl
								label={__("Border Radius", "post-type-archive-mapping")}
								help={__(
									"Border radius as a percentage",
									"post-type-archive-mapping"
								)}
								value={termButtonBorderRadius}
								onChange={(value) =>
									setAttributes({ termButtonBorderRadius: value })
								}
								min={0}
								max={100}
								step={1}
							/>
						</PanelBody>
					</Fragment>
				)}
			</InspectorControls>
		);
		if (this.state.loading) {
			return (
				<Fragment>
					<Placeholder>
						<div className="ptam-term-grid-loading">
							<h1>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 315.23 341.25" width="42" height="42"><polygon points="315.23 204.75 315.23 68.25 197.02 0 197.02 136.5 315.23 204.75" style={{fill: "#ffdd01",opacity:0.8}} /><polygon points="0 204.75 0 68.25 118.21 0 118.21 136.5 0 204.75" style={{fill: "#2e3192",opacity:0.8}} /><polygon points="157.62 159.25 275.83 91 157.62 22.75 39.4 91 157.62 159.25" style={{fill:"#86cedc",opacity:0.8}}/><polygon points="157.62 341.25 275.83 273 157.62 204.75 39.4 273 157.62 341.25" style={{fill:"#f07f3b", opacity:0.8}} /><polygon points="177.32 170.62 295.53 102.37 295.53 238.87 177.32 307.12 177.32 170.62" style={{fill:"#c10a26",opacity:0.8}}/><polygon points="137.91 170.62 19.7 102.37 19.7 238.87 137.91 307.12 137.91 170.62" style={{fill:"#662583",opacity:0.8}} /></svg>{" "}
								{__("Term Grid", "post-type-archive-mapping")}
							</h1>
							<h2>
								<Loading cssClass="ptam-term-grid-loading-animation" />
							</h2>
						</div>
					</Placeholder>
				</Fragment>
			);
		}
		if (this.state.termLoading) {
			return (
				<Fragment>
					{inspectorControls}
					<Placeholder>
						<div className="ptam-term-grid-loading">
							<h1>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 315.23 341.25" width="42" height="42"><polygon points="315.23 204.75 315.23 68.25 197.02 0 197.02 136.5 315.23 204.75" style={{fill: "#ffdd01",opacity:0.8}} /><polygon points="0 204.75 0 68.25 118.21 0 118.21 136.5 0 204.75" style={{fill: "#2e3192",opacity:0.8}} /><polygon points="157.62 159.25 275.83 91 157.62 22.75 39.4 91 157.62 159.25" style={{fill:"#86cedc",opacity:0.8}}/><polygon points="157.62 341.25 275.83 273 157.62 204.75 39.4 273 157.62 341.25" style={{fill:"#f07f3b", opacity:0.8}} /><polygon points="177.32 170.62 295.53 102.37 295.53 238.87 177.32 307.12 177.32 170.62" style={{fill:"#c10a26",opacity:0.8}}/><polygon points="137.91 170.62 19.7 102.37 19.7 238.87 137.91 307.12 137.91 170.62" style={{fill:"#662583",opacity:0.8}} /></svg>{" "}
								{__("Term Grid", "post-type-archive-mapping")}
							</h1>
							<h2>
								<Loading cssClass="ptam-term-grid-loading-animation" />
							</h2>
						</div>
					</Placeholder>
				</Fragment>
			);
		}
		if (!this.state.loading && !this.state.termLoading) {
			return (
				<Fragment>
					{inspectorControls}
					{"image" === backgroundType && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .ptam-term-grid-item:before {
								content: '';
								position: absolute;
								width: 100%;
								height: 100%;
								background-color: ${overlayColorRGBA};
								z-index: 1;}
							`,
							}}
						></style>
					)}
					{"none" === backgroundType && !disableStyles && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .ptam-term-grid-item {
								background: transparent;
								}
							`,
							}}
						></style>
					)}
					{"color" === backgroundType && !disableStyles && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .ptam-term-grid-item {
								background-color: ${backgroundColor};
								}
							`,
							}}
						></style>
					)}
					{"gradient" === backgroundType && !disableStyles && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .ptam-term-grid-item {
								background-image: ${backgroundGradient};
								}
							`,
							}}
						></style>
					)}
					{!linkContainer && showButton && !disableStyles && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .ptam-term-grid-item .ptam-term-grid-button:hover {
								background-color: ${termButtonBackgroundHoverColor} !important;
								color: ${termButtonTextHoverColor} !important;
								text-decoration: none;
								}
							`,
							}}
						></style>
					)}
					{linkContainer && !disableStyles && "color" === backgroundType && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .ptam-term-grid-item:hover {
								background-color: ${backgroundColorHover} !important;
							}
							#${containerId} .ptam-term-grid-item:hover .ptam-term-grid-item-content h2,
							#${containerId} .ptam-term-grid-item:hover .ptam-term-grid-item-content h2 a
							 {
								color: ${termTitleColorHover} !important;
							}
							#${containerId} .ptam-term-grid-item:hover .ptam-term-grid-item-description
							 {
								color: ${termDescriptionColorHover} !important;
							}
							`,
							}}
						></style>
					)}
					{linkContainer && !disableStyles && "gradient" === backgroundType && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .ptam-term-grid-item:hover {
								background-image: ${backgroundGradientHover} !important;
							}
							#${containerId} .ptam-term-grid-item:hover .ptam-term-grid-item-content h2,
							#${containerId} .ptam-term-grid-item:hover .ptam-term-grid-item-content h2 a
							 {
								color: ${termTitleColorHover} !important;
							}
							#${containerId} .ptam-term-grid-item:hover .ptam-term-grid-item-description
							 {
								color: ${termDescriptionColorHover} !important;
							}
							`,
							}}
						></style>
					)}
					{!disableStyles && "image" === backgroundType && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .ptam-term-grid-item:hover:before {
								background-color: ${overlayColorHoverRGBA} !important;
							}
							`,
							}}
						></style>
					)}

					<div
						id={containerId}
						className={classnames(`columns-${columns}`, "ptam-term-grid")}
					>
						{this.getTermHtml()}
					</div>
				</Fragment>
			);
		}
	}
}

export default PTAM_Term_Grid;
