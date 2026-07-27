import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksLocationsSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_locations_sections';
  info: {
    displayName: 'Locations Section';
    icon: 'pinMap';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.location', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksProcessSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_process_sections';
  info: {
    displayName: 'Process Section';
    icon: 'arrowRight';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.title-desc', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksTestimonialsSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_testimonials_sections';
  info: {
    displayName: 'Testimonials Section';
    icon: 'message';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.testimonial', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksTypesSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_types_sections';
  info: {
    displayName: 'Types Section';
    icon: 'apps';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.named-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksWhoWeAre extends Struct.ComponentSchema {
  collectionName: 'components_blocks_who_we_ares';
  info: {
    displayName: 'Who We Are';
    icon: 'user';
  };
  attributes: {
    badges: Schema.Attribute.Component<'shared.stat', true>;
    checklist: Schema.Attribute.Component<'shared.text-item', true>;
    img: Schema.Attribute.String & Schema.Attribute.Required;
    imgAlt: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    paragraphs: Schema.Attribute.Component<'shared.text-item', true>;
    titleLine1: Schema.Attribute.String & Schema.Attribute.Required;
    titleLine2: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksWhySection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_why_sections';
  info: {
    displayName: 'Why Section';
    icon: 'star';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.title-desc', true> &
      Schema.Attribute.Required;
    titleLine1: Schema.Attribute.String & Schema.Attribute.Required;
    titleLine2Em: Schema.Attribute.String & Schema.Attribute.Required;
    titleLine2Prefix: Schema.Attribute.String;
  };
}

export interface SectionsClimate extends Struct.ComponentSchema {
  collectionName: 'components_sections_climates';
  info: {
    displayName: 'Climate';
    icon: 'sun';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.named-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsColorSwatches extends Struct.ComponentSchema {
  collectionName: 'components_sections_color_swatchess';
  info: {
    displayName: 'Color Swatches';
    icon: 'palette';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.color-swatch-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsColorTable extends Struct.ComponentSchema {
  collectionName: 'components_sections_color_tables';
  info: {
    displayName: 'Color Table';
    icon: 'grid';
  };
  attributes: {
    headers: Schema.Attribute.JSON & Schema.Attribute.Required;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    rows: Schema.Attribute.Component<'shared.color-table-row', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsCompare extends Struct.ComponentSchema {
  collectionName: 'components_sections_compares';
  info: {
    displayName: 'Compare';
    icon: 'grid';
  };
  attributes: {
    headers: Schema.Attribute.JSON & Schema.Attribute.Required;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    rows: Schema.Attribute.Component<'shared.compare-row', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsDarkCallout extends Struct.ComponentSchema {
  collectionName: 'components_sections_dark_callouts';
  info: {
    displayName: 'Dark Callout';
    icon: 'priceTag';
  };
  attributes: {
    badge: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.dark-callout-item', true> &
      Schema.Attribute.Required;
    paragraphs: Schema.Attribute.Component<'shared.text-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHeights extends Struct.ComponentSchema {
  collectionName: 'components_sections_heightss';
  info: {
    displayName: 'Heights';
    icon: 'arrowUp';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.height-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsInfoGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_info_grids';
  info: {
    displayName: 'Info Grid';
    icon: 'grid';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.named-item', true> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsLightingOptions extends Struct.ComponentSchema {
  collectionName: 'components_sections_lighting_optionss';
  info: {
    displayName: 'Lighting Options';
    icon: 'sun';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.named-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsMaterials extends Struct.ComponentSchema {
  collectionName: 'components_sections_materialss';
  info: {
    displayName: 'Materials';
    icon: 'layer';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.named-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsPermits extends Struct.ComponentSchema {
  collectionName: 'components_sections_permitss';
  info: {
    displayName: 'Permits';
    icon: 'shield';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.named-item', true> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsPricing extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricings';
  info: {
    displayName: 'Pricing';
    icon: 'money';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.pricing-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsSectors extends Struct.ComponentSchema {
  collectionName: 'components_sections_sectorss';
  info: {
    displayName: 'Sectors';
    icon: 'briefcase';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.named-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsSpecGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_spec_grids';
  info: {
    displayName: 'Spec Grid';
    icon: 'grid';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.spec-item', true> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsStatCallout extends Struct.ComponentSchema {
  collectionName: 'components_sections_stat_callouts';
  info: {
    displayName: 'Stat Callout';
    icon: 'chart-pie';
  };
  attributes: {
    badge: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.stat', true> &
      Schema.Attribute.Required;
    paragraphs: Schema.Attribute.Component<'shared.text-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsSwatchGuide extends Struct.ComponentSchema {
  collectionName: 'components_sections_swatch_guides';
  info: {
    displayName: 'Swatch Guide';
    icon: 'palette';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.swatch-item', true> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsUses extends Struct.ComponentSchema {
  collectionName: 'components_sections_usess';
  info: {
    displayName: 'Uses';
    icon: 'apps';
  };
  attributes: {
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'shared.named-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedColorSwatchItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_color_swatch_items';
  info: {
    displayName: 'Color Swatch Item';
    icon: 'palette';
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedColorTableRow extends Struct.ComponentSchema {
  collectionName: 'components_shared_color_table_rows';
  info: {
    displayName: 'Color Table Row';
    icon: 'grid';
  };
  attributes: {
    cells: Schema.Attribute.JSON & Schema.Attribute.Required;
    color: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCompareRow extends Struct.ComponentSchema {
  collectionName: 'components_shared_compare_rows';
  info: {
    displayName: 'Compare Row';
    icon: 'grid';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    values: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface SharedDarkCalloutItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_dark_callout_items';
  info: {
    displayName: 'Dark Callout Item';
    icon: 'priceTag';
  };
  attributes: {
    color: Schema.Attribute.String;
    lead: Schema.Attribute.String & Schema.Attribute.Required;
    num: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    displayName: 'FAQ Item';
    icon: 'question-mark';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHeightItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_height_items';
  info: {
    displayName: 'Height Item';
    icon: 'arrowUp';
  };
  attributes: {
    barHeight: Schema.Attribute.Integer & Schema.Attribute.Required;
    desc: Schema.Attribute.Text;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    m: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLocation extends Struct.ComponentSchema {
  collectionName: 'components_shared_locations';
  info: {
    displayName: 'Location';
    icon: 'pinMap';
  };
  attributes: {
    areas: Schema.Attribute.Text & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMegaColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_mega_columns';
  info: {
    displayName: 'Mega Column';
    icon: 'layout';
  };
  attributes: {
    headHref: Schema.Attribute.String & Schema.Attribute.Required;
    headLabel: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    links: Schema.Attribute.Component<'shared.mega-link', true>;
  };
}

export interface SharedMegaLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_mega_links';
  info: {
    displayName: 'Mega Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMegaPromo extends Struct.ComponentSchema {
  collectionName: 'components_shared_mega_promos';
  info: {
    displayName: 'Mega Promo';
    icon: 'megaphone';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    linkLabel: Schema.Attribute.String & Schema.Attribute.Required;
    sub: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNamedItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_named_items';
  info: {
    displayName: 'Named Item';
    icon: 'layer';
  };
  attributes: {
    alt: Schema.Attribute.String;
    desc: Schema.Attribute.Text & Schema.Attribute.Required;
    img: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    tag: Schema.Attribute.String;
  };
}

export interface SharedPricingItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_pricing_items';
  info: {
    displayName: 'Pricing Item';
    icon: 'money';
  };
  attributes: {
    desc: Schema.Attribute.Text & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.String;
    noteVariant: Schema.Attribute.Enumeration<['muted', 'positive']> &
      Schema.Attribute.DefaultTo<'muted'>;
    range: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedRelatedItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_related_items';
  info: {
    displayName: 'Related Item';
    icon: 'link';
  };
  attributes: {
    alt: Schema.Attribute.String & Schema.Attribute.Required;
    cat: Schema.Attribute.String & Schema.Attribute.Required;
    desc: Schema.Attribute.Text & Schema.Attribute.Required;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    img: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSpecItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_spec_items';
  info: {
    displayName: 'Spec Item';
    icon: 'list';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Stat';
    icon: 'chart-pie';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    n: Schema.Attribute.String & Schema.Attribute.Required;
    suffix: Schema.Attribute.String;
  };
}

export interface SharedSwatchItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_swatch_items';
  info: {
    displayName: 'Swatch Item';
    icon: 'palette';
  };
  attributes: {
    background: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    pct: Schema.Attribute.String & Schema.Attribute.Required;
    use: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials';
  info: {
    displayName: 'Testimonial';
    icon: 'message';
  };
  attributes: {
    initials: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedTextItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_items';
  info: {
    displayName: 'Text Item';
    icon: 'align-left';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedTitleDesc extends Struct.ComponentSchema {
  collectionName: 'components_shared_title_descs';
  info: {
    displayName: 'Title + Description';
    icon: 'bulletList';
  };
  attributes: {
    desc: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.locations-section': BlocksLocationsSection;
      'blocks.process-section': BlocksProcessSection;
      'blocks.testimonials-section': BlocksTestimonialsSection;
      'blocks.types-section': BlocksTypesSection;
      'blocks.who-we-are': BlocksWhoWeAre;
      'blocks.why-section': BlocksWhySection;
      'sections.climate': SectionsClimate;
      'sections.color-swatches': SectionsColorSwatches;
      'sections.color-table': SectionsColorTable;
      'sections.compare': SectionsCompare;
      'sections.dark-callout': SectionsDarkCallout;
      'sections.heights': SectionsHeights;
      'sections.info-grid': SectionsInfoGrid;
      'sections.lighting-options': SectionsLightingOptions;
      'sections.materials': SectionsMaterials;
      'sections.permits': SectionsPermits;
      'sections.pricing': SectionsPricing;
      'sections.sectors': SectionsSectors;
      'sections.spec-grid': SectionsSpecGrid;
      'sections.stat-callout': SectionsStatCallout;
      'sections.swatch-guide': SectionsSwatchGuide;
      'sections.uses': SectionsUses;
      'shared.color-swatch-item': SharedColorSwatchItem;
      'shared.color-table-row': SharedColorTableRow;
      'shared.compare-row': SharedCompareRow;
      'shared.dark-callout-item': SharedDarkCalloutItem;
      'shared.faq-item': SharedFaqItem;
      'shared.height-item': SharedHeightItem;
      'shared.location': SharedLocation;
      'shared.mega-column': SharedMegaColumn;
      'shared.mega-link': SharedMegaLink;
      'shared.mega-promo': SharedMegaPromo;
      'shared.named-item': SharedNamedItem;
      'shared.pricing-item': SharedPricingItem;
      'shared.related-item': SharedRelatedItem;
      'shared.spec-item': SharedSpecItem;
      'shared.stat': SharedStat;
      'shared.swatch-item': SharedSwatchItem;
      'shared.testimonial': SharedTestimonial;
      'shared.text-item': SharedTextItem;
      'shared.title-desc': SharedTitleDesc;
    }
  }
}
